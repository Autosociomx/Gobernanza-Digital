import type { Agent, AgentDecision, AgentEnvelope, AgentResult } from '../../contracts/agent';
import {
  DEPENDENCIAS,
  RUTAS_TEPIC,
  buscarDependencias,
  buscarRuta,
  dependenciaPorId,
  normalizar,
  type Dependencia,
  type NivelGobierno,
  type RegistroRutas,
} from './registry';

type RoutingPayload = { serviceQuery: string; jurisdiction?: string };

export type RouteStatus = 'FOUND' | 'AMBIGUOUS' | 'ATTRIBUTION_UNVERIFIED' | 'NOT_FOUND';

export interface LegalBasis {
  ordenamiento: string;
  articulo?: string;
  fraccion?: string;
  complementario?: string;
  apartado?: string;
  numeral?: number;
  ultimaReforma: string;
}

export interface RoutingData {
  routeStatus: RouteStatus;
  serviceQuery: string;
  matchType?: 'SERVICIO' | 'DEPENDENCIA';
  /** Nombre oficial de la dependencia responsable (se conserva por compatibilidad). */
  institution?: string;
  dependencyId?: string;
  level?: NivelGobierno;
  unit?: string;
  serviceId?: string;
  legalBasis?: LegalBasis;
  source?: { url: string | null; emisor: string; fechaConsulta: string; estado: string };
  candidates?: Array<{ dependencyId: string; institution: string; level: NivelGobierno }>;
  note?: string;
}

/**
 * Agente de enrutamiento SOATM.
 *
 * Resuelve qué dependencia (y, en Tepic, qué unidad) atiende una necesidad,
 * consultando únicamente el registro verificado de `data/dependencias/`.
 * - Si el Reglamento asigna la atribución de forma expresa: FOUND, con fundamento.
 * - Si el registro conoce el servicio pero la atribución no es expresa:
 *   REQUIRE_HUMAN. No se adivina una dependencia.
 * - Si el texto nombra una dependencia de cualquier nivel: FOUND o AMBIGUOUS.
 * - En otro caso: NOT_FOUND.
 * Nunca ejecuta un trámite ni produce efectos jurídicos.
 */
export class SoatmRoutingAgent implements Agent<RoutingPayload, RoutingData> {
  id = 'soatm-routing-agent';
  version = '0.2.0';

  constructor(
    private readonly rutasMunicipales: RegistroRutas = RUTAS_TEPIC,
    private readonly dependencias: readonly Dependencia[] = DEPENDENCIAS,
  ) {}

  async handle(envelope: AgentEnvelope<RoutingPayload>): Promise<AgentResult<RoutingData>> {
    const serviceQuery = envelope.payload.serviceQuery.trim();
    const jurisdiccion = envelope.payload.jurisdiction;
    const municipio = normalizar(this.rutasMunicipales.jurisdiccion.split(',')[0]);
    const aplicaMunicipal = jurisdiccion !== undefined && normalizar(jurisdiccion).includes(municipio);

    if (aplicaMunicipal) {
      const hallazgo = buscarRuta(serviceQuery, this.rutasMunicipales.rutas);
      if (hallazgo) {
        const { ruta } = hallazgo;
        if (ruta.estado_atribucion !== 'verificado' || !ruta.dependencia_id || !ruta.fundamento) {
          return this.result(envelope, 'REQUIRE_HUMAN', ['ATTRIBUTION_NOT_EXPRESS'], true, {
            routeStatus: 'ATTRIBUTION_UNVERIFIED',
            serviceQuery,
            matchType: 'SERVICIO',
            serviceId: ruta.id,
            note: ruta.nota,
          });
        }
        const dependencia = dependenciaPorId(ruta.dependencia_id);
        if (!dependencia) {
          return this.result(envelope, 'ERROR', ['REGISTRY_INCONSISTENT'], true, {
            routeStatus: 'NOT_FOUND',
            serviceQuery,
            serviceId: ruta.id,
          });
        }
        return this.result(envelope, 'ALLOW', ['SERVICE_ROUTE_VERIFIED'], false, {
          routeStatus: 'FOUND',
          serviceQuery,
          matchType: 'SERVICIO',
          serviceId: ruta.id,
          institution: dependencia.nombre_oficial,
          dependencyId: dependencia.id,
          level: dependencia.nivel,
          unit: ruta.unidad ?? undefined,
          legalBasis: {
            ordenamiento: dependencia.fundamento.ordenamiento,
            articulo: ruta.fundamento.articulo,
            fraccion: ruta.fundamento.fraccion,
            complementario: ruta.fundamento.complementario,
            ultimaReforma: dependencia.fundamento.ultima_reforma,
          },
          source: {
            url: this.rutasMunicipales.fuente.url,
            emisor: this.rutasMunicipales.fuente.emisor,
            fechaConsulta: this.rutasMunicipales.fuente.fecha_consulta,
            estado: 'verificado',
          },
          note: ruta.nota,
        });
      }
    }

    const coincidencias = buscarDependencias(serviceQuery, this.dependencias);
    if (coincidencias.length === 1) {
      const [dependencia] = coincidencias;
      return this.result(envelope, 'ALLOW', ['DEPENDENCY_NAME_MATCH'], false, {
        routeStatus: 'FOUND',
        serviceQuery,
        matchType: 'DEPENDENCIA',
        institution: dependencia.nombre_oficial,
        dependencyId: dependencia.id,
        level: dependencia.nivel,
        legalBasis: {
          ordenamiento: dependencia.fundamento.ordenamiento,
          articulo: dependencia.fundamento.articulo,
          fraccion: dependencia.fundamento.fraccion,
          apartado: dependencia.fundamento.apartado,
          numeral: dependencia.fundamento.numeral,
          ultimaReforma: dependencia.fundamento.ultima_reforma,
        },
        source: {
          url: dependencia.fuente.url,
          emisor: dependencia.fuente.emisor,
          fechaConsulta: dependencia.fecha_consulta,
          estado: dependencia.estado_fuente,
        },
      });
    }
    if (coincidencias.length > 1) {
      return this.result(
        envelope,
        'ALLOW',
        ['MULTIPLE_DEPENDENCIES_MATCH'],
        false,
        {
          routeStatus: 'AMBIGUOUS',
          serviceQuery,
          matchType: 'DEPENDENCIA',
          candidates: coincidencias.map((dependencia) => ({
            dependencyId: dependencia.id,
            institution: dependencia.nombre_oficial,
            level: dependencia.nivel,
          })),
        },
        'intent.clarify',
      );
    }

    const motivos = ['ROUTE_NOT_FOUND'];
    if (!aplicaMunicipal) motivos.push('MUNICIPAL_ROUTES_NOT_AVAILABLE_FOR_JURISDICTION');
    return this.result(envelope, 'ALLOW', motivos, false, { routeStatus: 'NOT_FOUND', serviceQuery });
  }

  private result(
    envelope: AgentEnvelope<RoutingPayload>,
    decision: AgentDecision,
    reasonCodes: string[],
    humanActionRequired: boolean,
    data: RoutingData,
    nextCapability = 'evidence.append',
  ): AgentResult<RoutingData> {
    return {
      requestId: envelope.requestId,
      decision,
      reasonCodes,
      data,
      evidenceRefs: [],
      humanActionRequired,
      nextCapability,
      audit: {
        agentId: this.id,
        agentVersion: this.version,
        startedAt: envelope.timestamp,
        completedAt: new Date().toISOString(),
        executionMode: envelope.executionMode,
      },
    };
  }
}
