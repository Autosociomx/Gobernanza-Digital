/**
 * Detección de posibles datos personales en texto candidato.
 *
 * Determinística, local y sin servicios externos. Falla del lado seguro: ante
 * la duda marca (falso positivo) en vez de dejar pasar (falso negativo). La
 * regla 9 del repositorio prohíbe cualquier dato personal real, así que el
 * costo de un falso positivo es una revisión humana; el de un falso negativo,
 * un incidente.
 */

export type PersonalDataKind = 'CURP' | 'RFC' | 'EMAIL' | 'TELEFONO' | 'CLABE';

const CURP = /\b[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d\b/i;
const RFC = /\b[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}\b/i;
const EMAIL = /\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b/i;
const CLABE = /\b\d{18}\b/;
/** Secuencias de 10 dígitos con separadores típicos, con o sin lada +52. */
const TELEFONO = /(?:\+?52[\s.-]?)?(?:\(?\d{2,3}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/g;

function looksLikePhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return true;
  return digits.length === 12 && digits.startsWith('52');
}

/**
 * Devuelve los tipos detectados, nunca el valor encontrado: el dato sospechoso
 * no debe viajar en el veredicto ni en la evidencia.
 */
export function detectPersonalData(text: string): PersonalDataKind[] {
  if (typeof text !== 'string' || !text) return [];
  const kinds = new Set<PersonalDataKind>();

  if (CURP.test(text)) kinds.add('CURP');
  else if (RFC.test(text)) kinds.add('RFC');
  if (EMAIL.test(text)) kinds.add('EMAIL');
  if (CLABE.test(text)) kinds.add('CLABE');

  // Se ignoran dígitos pegados a una secuencia más larga (folios, hashes, años
  // concatenados) para no marcar cualquier número del expediente.
  const withoutLongRuns = text.replace(/\d{11,}/g, ' ');
  for (const match of withoutLongRuns.matchAll(TELEFONO)) {
    if (looksLikePhone(match[0])) {
      kinds.add('TELEFONO');
      break;
    }
  }

  return [...kinds].sort();
}
