/**
 * Comparación por unidades de código, no por locale.
 *
 * `localeCompare` depende del ICU del entorno: el mismo índice saldría ordenado
 * distinto en dos máquinas y dejaría de ser reproducible. Esto no.
 */
export function compareCodeUnits(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
