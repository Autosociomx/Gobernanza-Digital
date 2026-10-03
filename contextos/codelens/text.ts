/**
 * Normalización léxica compartida por el detector de contradicciones.
 * Es conteo de palabras, no comprensión: toda contradicción detectada aquí
 * es una señal para revisión humana, jamás un fallo automático.
 */

const NEGACIONES = new Set([
  'no', 'nunca', 'jamas', 'sin', 'ningun', 'ninguna', 'ninguno', 'tampoco', 'falso',
]);

const VACIAS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a',
  'en', 'y', 'o', 'que', 'se', 'su', 'sus', 'por', 'para', 'con', 'es', 'esta',
  'este', 'esa', 'ese', 'como', 'lo', 'ya', 'mas', 'pero', 'ni', 'the', 'of',
]);

export function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export interface NormalizedClaim {
  tokens: string[];
  numbers: string[];
  negated: boolean;
}

export function normalizeClaim(text: string): NormalizedClaim {
  const plain = stripAccents(String(text ?? '').toLowerCase());
  const raw = plain.split(/[^a-z0-9.%]+/).filter(Boolean);

  const tokens: string[] = [];
  const numbers: string[] = [];
  let negated = false;

  for (const token of raw) {
    if (NEGACIONES.has(token)) {
      negated = true;
      continue;
    }
    if (VACIAS.has(token)) continue;
    const numeric = token.replace(/\.$/, '');
    if (/^\d+(?:\.\d+)?%?$/.test(numeric)) {
      numbers.push(numeric);
      continue;
    }
    if (token.length >= 3) tokens.push(token.replace(/\.$/, ''));
  }

  return { tokens, numbers: [...new Set(numbers)].sort(), negated };
}

/** Contención: intersección sobre el conjunto más pequeño. 0 si alguno está vacío. */
export function topicOverlap(a: NormalizedClaim, b: NormalizedClaim): number {
  const left = new Set(a.tokens);
  const right = new Set(b.tokens);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared / Math.min(left.size, right.size);
}
