/**
 * Vocabulario de la compuerta de arquitectura.
 *
 * Un solo lugar donde viven los dos ejes —madurez y evidencia— y el semáforo.
 * Los importan el verificador del estado canónico, las cuatro compuertas y el
 * recibo, para que no puedan divergir entre sí.
 *
 * Referencia: docs/marco/adr/ADR-0001-compuerta-de-arquitectura.md
 */

/** Eje 1 · madurez arquitectónica: qué tan lejos ha llegado el componente. */
export const MADUREZ = [
  'PROPOSED',
  'EXPERIMENTAL',
  'VALIDATED',
  'PILOT',
  'PRODUCTION',
  'INSTITUTIONAL',
];

/**
 * Eje 2 · fuerza de evidencia: con qué se sostiene la afirmación.
 * No es lo mismo que madurez. Un componente EXPERIMENTAL puede tener
 * evidencia E3, y uno PILOT puede seguir en E1: son ejes independientes.
 */
export const EVIDENCIA = [
  'E0_DECLARED',
  'E1_DOCUMENTED',
  'E2_CODE_INSPECTED',
  'E3_REPRODUCIBLE_EXECUTION',
  'E4_DEPLOYED_VERIFIED',
  'E5_INSTITUTIONAL_OPERATION_VERIFIED',
];

/** Orden del eje de evidencia, para comparar niveles sin depender del índice. */
export const NIVEL_EVIDENCIA = Object.fromEntries(EVIDENCIA.map((e, i) => [e, i]));

/** Semáforo operativo. Ver docs/marco/COMPUERTA_ARQUITECTURA.md §2. */
export const SEMAFORO = ['VERDE', 'AMARILLO', 'ROJO', 'GRIS'];

/** Clasificación de impacto que toda PR sobre la arquitectura debe declarar. */
export const IMPACTOS = [
  'ARCHITECTURE_CHANGE',
  'CONTRACT_CHANGE',
  'AUTHORITY_CHANGE',
  'EVIDENCE_CHANGE',
  'INTEGRATION_CHANGE',
  'NO_ARCH_IMPACT',
];

/**
 * Rutas cuya modificación obliga a declarar impacto. Se comparan como prefijo
 * de la ruta relativa del archivo tocado.
 */
export const RUTAS_VIGILADAS = [
  'contextos/',
  'src/orbe/',
  'shared/semantic/',
  'src/services/contextosRuntimeClient.ts',
  'src/components/orbe/',
  'scripts/test-orbe-p0-e2e.mts',
  'scripts/compuerta/',
  'scripts/compuerta-arquitectura.mjs',
  'docs/marco/fronteras-arquitectura.json',
];

/** Rutas que son contrato: tocarlas es CONTRACT_CHANGE por definición. */
export const RUTAS_CONTRATO = [
  'contextos/contracts.ts',
  'shared/semantic/types.ts',
  'shared/semantic/contracts/',
];

/** Rutas de evidencia: tocarlas es EVIDENCE_CHANGE por definición. */
export const RUTAS_EVIDENCIA = ['contextos/evidence.ts'];

/** Rutas de policy y consentimiento: tocarlas mueve la frontera de autoridad. */
export const RUTAS_AUTORIDAD = [
  'contextos/policyEngine.ts',
  'contextos/consent.ts',
  'contextos/adapters/',
];

/**
 * Palabras que convierten una PR en una afirmación y activan la compuerta de
 * evidencia. Se buscan sin acentos y en minúsculas sobre el cuerpo de la PR.
 */
export const PALABRAS_DE_AFIRMACION = [
  'funciona',
  'resuelto',
  'resuelta',
  'validado',
  'validada',
  'demostrado',
  'demostrada',
  'listo',
  'lista',
  'estable',
  'integrado',
  'integrada',
  'cerrado',
  'cerrada',
  'terminado',
  'terminada',
  'probado',
  'probada',
];

export function esRutaDe(ruta, prefijos) {
  return prefijos.some((p) => (p.endsWith('/') ? ruta.startsWith(p) : ruta === p));
}

/** Quita acentos y baja a minúsculas, para comparar texto en español. */
export function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
