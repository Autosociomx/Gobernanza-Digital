import { describe, expect, it } from 'vitest';
import type { AgentEnvelope } from '../../contracts/agent';
import { SoatmRoutingAgent } from './agent';
import { DEPENDENCIAS, RUTAS_TEPIC, buscarDependencias, dependenciaPorId } from './registry';

function sobre(serviceQuery: string, jurisdiction?: string): AgentEnvelope<{ serviceQuery: string; jurisdiction?: string }> {
  return {
    requestId: 'soatm_test',
    timestamp: '2026-01-01T00:00:00.000Z',
    actor: { type: 'citizen', assurance: 'anonymous' },
    intent: 'service.route',
    domain: 'SOATM',
    requestedCapability: 'institution.route',
    riskLevel: 'LOW',
    executionMode: 'LAB_MOCK',
    payload: { serviceQuery, ...(jurisdiction === undefined ? {} : { jurisdiction }) },
  };
}

const agente = new SoatmRoutingAgent();

describe('registro de dependencias', () => {
  it('contiene los tres niveles con los totales verificados', () => {
    const porNivel = (nivel: string) => DEPENDENCIAS.filter((d) => d.nivel === nivel).length;
    expect(porNivel('federal')).toBe(203);
    expect(porNivel('estatal')).toBe(13);
    expect(porNivel('municipal')).toBe(22);
  });

  it('no admite dependencias sin fundamento, fuente o fecha de consulta, ni identificadores repetidos', () => {
    for (const d of DEPENDENCIAS) {
      expect(d.fundamento.ordenamiento, d.id).toBeTruthy();
      expect(d.fuente.emisor, d.id).toBeTruthy();
      expect(d.fecha_consulta, d.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(new Set(DEPENDENCIAS.map((d) => d.id)).size).toBe(DEPENDENCIAS.length);
  });

  it('cada ruta verificada apunta a una dependencia existente y declara su fundamento', () => {
    for (const ruta of RUTAS_TEPIC.rutas) {
      if (ruta.estado_atribucion === 'verificado') {
        expect(dependenciaPorId(ruta.dependencia_id ?? ''), ruta.id).toBeDefined();
        expect(ruta.fundamento?.articulo, ruta.id).toBeTruthy();
      } else {
        expect(ruta.dependencia_id, ruta.id).toBeNull();
      }
    }
  });

  it('cada organismo coordinado apunta a una coordinadora de sector existente', () => {
    for (const d of DEPENDENCIAS) {
      if (d.padre) expect(dependenciaPorId(d.padre), d.id).toBeDefined();
    }
  });
});

describe('SoatmRoutingAgent', () => {
  it('enruta una luminaria en Tepic a su unidad responsable, con fundamento', async () => {
    const r = await agente.handle(sobre('hay una luminaria apagada en mi calle', 'Tepic, Nayarit'));
    expect(r.decision).toBe('ALLOW');
    expect(r.humanActionRequired).toBe(false);
    expect(r.data).toMatchObject({
      routeStatus: 'FOUND',
      matchType: 'SERVICIO',
      institution: 'Dirección General de Servicios Públicos Municipales',
      level: 'municipal',
      unit: 'Departamento de Alumbrado Público',
      legalBasis: { articulo: '42', fraccion: 'VI' },
      source: { estado: 'verificado' },
    });
  });

  it('enruta el predial a la Dirección de Catastro e Impuesto Predial de la Tesorería', async () => {
    const r = await agente.handle(sobre('quiero pagar mi predial', 'Tepic'));
    expect(r.data).toMatchObject({
      routeStatus: 'FOUND',
      institution: 'Tesorería Municipal',
      unit: 'Dirección de Catastro e Impuesto Predial',
      legalBasis: { articulo: '33', fraccion: 'VI' },
    });
  });

  it('enruta un acta de nacimiento al Registro Civil de la Secretaría del Ayuntamiento', async () => {
    const r = await agente.handle(sobre('Necesito una copia de mi acta de nacimiento', 'Tepic, Nayarit'));
    expect(r.data).toMatchObject({
      institution: 'Secretaría del Ayuntamiento',
      unit: 'Dirección del Registro Civil y sus oficialías',
    });
  });

  it('no adivina la dependencia de un bache: escala a una persona', async () => {
    const r = await agente.handle(sobre('Quiero reportar un bache en Tepic', 'Tepic, Nayarit'));
    expect(r.decision).toBe('REQUIRE_HUMAN');
    expect(r.humanActionRequired).toBe(true);
    expect(r.reasonCodes).toEqual(['ATTRIBUTION_NOT_EXPRESS']);
    expect(r.data?.routeStatus).toBe('ATTRIBUTION_UNVERIFIED');
    expect(r.data?.institution).toBeUndefined();
  });

  it('no aplica rutas de Tepic a otra jurisdicción', async () => {
    const r = await agente.handle(sobre('hay una luminaria apagada', 'Bahía de Banderas, Nayarit'));
    expect(r.data?.routeStatus).toBe('NOT_FOUND');
    expect(r.reasonCodes).toContain('MUNICIPAL_ROUTES_NOT_AVAILABLE_FOR_JURISDICTION');
  });

  it('encuentra una dependencia por sus siglas oficiales', async () => {
    const r = await agente.handle(sobre('¿dónde está el SIAPA?'));
    expect(r.data).toMatchObject({
      routeStatus: 'FOUND',
      matchType: 'DEPENDENCIA',
      dependencyId: 'tep.sistema_integral_de_agua_potable_y_alcantarillado_siapa_tepic',
    });
  });

  it('encuentra una entidad federal por su nombre oficial, con el numeral de la Relación del DOF', async () => {
    const r = await agente.handle(sobre('información de la Lotería Nacional'));
    expect(r.data).toMatchObject({
      routeStatus: 'FOUND',
      level: 'federal',
      legalBasis: { ultimaReforma: 'DOF 12-08-2026' },
    });
    expect(r.data?.legalBasis?.numeral).toBeTypeOf('number');
  });

  it('marca como ambiguo un nombre que existe en dos niveles y pide aclarar', async () => {
    const r = await agente.handle(sobre('Secretaría de Turismo'));
    expect(r.data?.routeStatus).toBe('AMBIGUOUS');
    expect(r.nextCapability).toBe('intent.clarify');
    expect(r.data?.candidates?.map((c) => c.level).sort()).toEqual(['estatal', 'federal']);
  });

  it('responde NOT_FOUND cuando el registro no conoce la necesidad', async () => {
    const r = await agente.handle(sobre('quiero comprar un boleto de avión', 'Tepic'));
    expect(r.data?.routeStatus).toBe('NOT_FOUND');
    expect(r.reasonCodes).toEqual(['ROUTE_NOT_FOUND']);
  });

  it('busca sin importar acentos ni mayúsculas', () => {
    expect(buscarDependencias('LOTERIA NACIONAL').map((d) => d.nombre_oficial)).toEqual(['Lotería Nacional']);
  });
});
