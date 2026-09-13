/**
 * Resolvedor del canon del ORBE.
 *
 * Funciones puras sobre un canon ya cargado. No importa JSON ni toca el disco:
 * el servidor lo lee con `node:fs` y el navegador lo pide por HTTP; ambos
 * entregan el mismo objeto a `indexarCanon`.
 *
 * Determinístico por diseño. Ningún modelo de lenguaje decide aquí qué trámite
 * corresponde, qué acción está permitida ni qué fundamento puede citarse: eso
 * lo decide el canon, igual que la política la decide contextos/policyEngine.ts.
 */
import type {
  CanonCrudo,
  EstatusDato,
  Fuente,
  Fundamento,
  Jurisdiccion,
  NivelJurisdiccion,
  Tramite,
} from './types';

export interface CanonIndexado {
  tramites: readonly Tramite[];
  jurisdiccionPorId: ReadonlyMap<string, Jurisdiccion>;
  fuentePorId: ReadonlyMap<string, Fuente>;
  tramitePorId: ReadonlyMap<string, Tramite>;
}

export interface CoincidenciaTramite {
  tramite: Tramite;
  jurisdiccion: Jurisdiccion;
  nivel: NivelJurisdiccion;
  /** 1 = la persona dijo casi literalmente una expresión registrada. */
  puntaje: number;
  expresion: string;
}

/**
 * Normaliza una expresión ciudadana: sin acentos, sin signos, minúsculas.
 *
 * Replica `normalizeCitizenText` de src/orbe/metalinguistics.ts. La duplicación
 * es deliberada y temporal: `shared/` no debe importar de `src/`. La
 * unificación está prevista en docs/orbe/canon/v0.2/ORBE_CANON_JURISDICCIONAL.md.
 */
export function normalizarExpresion(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const VACIAS = new Set([
  'a', 'al', 'como', 'con', 'de', 'del', 'donde', 'el', 'en', 'es', 'la', 'las',
  'lo', 'los', 'me', 'mi', 'para', 'por', 'que', 'se', 'su', 'un', 'una', 'y', 'yo',
]);

function tokens(texto: string): string[] {
  return normalizarExpresion(texto).split(' ').filter((t) => t.length > 2 && !VACIAS.has(t));
}

export function indexarCanon(canon: CanonCrudo): CanonIndexado {
  return {
    tramites: canon.tramites.tramites,
    jurisdiccionPorId: new Map(canon.jurisdicciones.jurisdicciones.map((j) => [j.id, j])),
    fuentePorId: new Map(canon.fuentes.fuentes.map((f) => [f.id, f])),
    tramitePorId: new Map(canon.tramites.tramites.map((t) => [t.id, t])),
  };
}

/**
 * Resuelve qué trámites corresponden a lo que dijo la persona, sin importar el
 * orden de gobierno. Devuelve las coincidencias ordenadas de mayor a menor
 * puntaje; vacío cuando el canon no reconoce la expresión — y entonces el ORBE
 * debe decir que no sabe, no improvisar.
 */
export function resolverTramites(
  indice: CanonIndexado,
  texto: string,
  opciones: { minimo?: number; limite?: number } = {},
): CoincidenciaTramite[] {
  const minimo = opciones.minimo ?? 0.5;
  const dichos = tokens(texto);
  if (dichos.length === 0) return [];

  const coincidencias: CoincidenciaTramite[] = [];
  for (const tramite of indice.tramites) {
    const jurisdiccion = indice.jurisdiccionPorId.get(tramite.jurisdiccion);
    if (!jurisdiccion) continue;

    let mejor = 0;
    let expresion = '';
    for (const candidata of tramite.expresiones_ciudadanas) {
      const esperados = tokens(candidata);
      if (esperados.length === 0) continue;
      const comunes = esperados.filter((t) => dichos.includes(t)).length;
      const puntaje = comunes / esperados.length;
      if (puntaje > mejor) {
        mejor = puntaje;
        expresion = candidata;
      }
    }

    if (mejor >= minimo) {
      coincidencias.push({
        tramite,
        jurisdiccion,
        nivel: jurisdiccion.nivel,
        puntaje: Number(mejor.toFixed(4)),
        expresion,
      });
    }
  }

  coincidencias.sort((a, b) => b.puntaje - a.puntaje || a.tramite.id.localeCompare(b.tramite.id));
  return opciones.limite ? coincidencias.slice(0, opciones.limite) : coincidencias;
}

/**
 * Fundamento que el ORBE puede citar en público.
 *
 * Aplica la regla de oro del Glosario Oficial en código: solo se cita lo que
 * está VERIFICADO. Una fuente `por_verificar` existe en el canon y sirve
 * internamente, pero nunca sale a boca del asistente como si fuera derecho
 * cerrado.
 */
export function fundamentoPublicable(
  indice: CanonIndexado,
  tramiteId: string,
): { fundamento: Fundamento; fuente: Fuente }[] {
  const tramite = indice.tramitePorId.get(tramiteId);
  if (!tramite) return [];
  return tramite.fundamento
    .map((fundamento) => ({ fundamento, fuente: indice.fuentePorId.get(fundamento.fuente) }))
    .filter((par): par is { fundamento: Fundamento; fuente: Fuente } => par.fuente?.estatus === 'vigente');
}

/** Datos que el ORBE está obligado a presentar como pendientes de verificación. */
export function datosPendientes(indice: CanonIndexado, tramiteId: string): string[] {
  const tramite = indice.tramitePorId.get(tramiteId);
  if (!tramite) return [];
  return (['dependencia', 'costo', 'plazo', 'canal_oficial'] as const).filter(
    (campo) => tramite[campo].estatus !== 'verificado',
  );
}

/** ¿El canon autoriza esta acción para este trámite? Cerrado por defecto. */
export function accionPermitida(indice: CanonIndexado, tramiteId: string, accion: string): boolean {
  const tramite = indice.tramitePorId.get(tramiteId);
  if (!tramite) return false;
  if (tramite.orbe.acciones_restringidas.includes(accion)) return false;
  return tramite.orbe.acciones_permitidas.includes(accion);
}

/** ¿Este trámite tiene ejecución registrada en Context.OS, o solo orientación? */
export function esEjecutable(indice: CanonIndexado, tramiteId: string): boolean {
  const tramite = indice.tramitePorId.get(tramiteId);
  return Boolean(tramite?.orbe.servicio_contextos && tramite.orbe.contrato_semantico);
}

/** Cadena de autoridad de una jurisdicción, de la más específica a la federal. */
export function cadenaDeAutoridad(indice: CanonIndexado, jurisdiccionId: string): Jurisdiccion[] {
  const cadena: Jurisdiccion[] = [];
  let actual = indice.jurisdiccionPorId.get(jurisdiccionId);
  while (actual) {
    cadena.push(actual);
    actual = actual.padre ? indice.jurisdiccionPorId.get(actual.padre) : undefined;
  }
  return cadena;
}

export interface OrientacionCiudadana {
  tramiteId: string;
  nombre: string;
  nivel: NivelJurisdiccion;
  autoridad: string;
  descripcion: string;
  estatus: EstatusDato;
  fundamentoCitable: string[];
  datosPendientes: string[];
  superficie: string | null;
  ejecutable: boolean;
  advertencia: string | null;
}

/**
 * Arma la orientación que el ORBE puede dar sobre un trámite, con sus etiquetas
 * de honestidad ya aplicadas. Es la salida que la UI debe mostrar: nada de lo
 * que sale de aquí afirma más de lo que el canon respalda.
 */
export function orientacionCiudadana(
  indice: CanonIndexado,
  tramiteId: string,
): OrientacionCiudadana | null {
  const tramite = indice.tramitePorId.get(tramiteId);
  const jurisdiccion = tramite ? indice.jurisdiccionPorId.get(tramite.jurisdiccion) : undefined;
  if (!tramite || !jurisdiccion) return null;

  const pendientes = datosPendientes(indice, tramiteId);
  const advertencias: Record<EstatusDato, string | null> = {
    propuesto: 'Esta capacidad es una propuesta de diseño: todavía no existe como trámite operable.',
    demo: 'Esto ocurre en modo laboratorio: no produce efectos administrativos ni actos de autoridad.',
    por_verificar:
      'Los datos operativos de este trámite están pendientes de verificación con la autoridad competente.',
    verificado: null,
  };

  return {
    tramiteId: tramite.id,
    nombre: tramite.nombre,
    nivel: jurisdiccion.nivel,
    autoridad: tramite.autoridad,
    descripcion: tramite.descripcion_ciudadana,
    estatus: tramite.estatus,
    fundamentoCitable: fundamentoPublicable(indice, tramiteId).map(
      ({ fundamento, fuente }) => `${fuente.referencia} — ${fundamento.articulos}`,
    ),
    datosPendientes: pendientes,
    superficie: tramite.orbe.superficie,
    ejecutable: esEjecutable(indice, tramiteId),
    advertencia: advertencias[tramite.estatus],
  };
}
