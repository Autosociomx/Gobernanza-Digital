import { sha256 } from '../canonical';
import {
  CODELENS_DETECTOR_VERSION,
  CODELENS_GATE_VERSION,
  CODELENS_SCHEMA_VERSION,
  EMPTY_CODELENS_INDEX,
} from './contracts';
import type {
  CodeLensCandidate,
  CodeLensContradiction,
  CodeLensEvaluationRecord,
  CodeLensEvidenceRef,
  CodeLensIndex,
  CodeLensProvenance,
  CodeLensReproducibility,
  CodeLensVerdict,
  CodeLensVerdictLevel,
} from './contracts';
import { detectPersonalData } from './personalData';
import { normalizeClaim, topicOverlap } from './text';

/** Umbral de tema compartido para considerar dos afirmaciones comparables. */
export const CONTRADICTION_OVERLAP_THRESHOLD = 0.6;
/** Longitud mínima para que una afirmación sea evaluable con seriedad. */
export const MIN_CLAIM_LENGTH = 20;

const ORIGINS = new Set(['radar', 'human', 'agent', 'import']);
const ACTIONS = new Set(['read', 'propose', 'promote']);
/** Orígenes producidos por máquina sin curaduría previa: nunca alcanzan `green`. */
const MACHINE_ORIGINS = new Set(['agent', 'import']);

function validationErrors(candidate: CodeLensCandidate | undefined): string[] {
  const errors: string[] = [];
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return ['CANDIDATE_INVALID'];
  }
  if (typeof candidate.candidate_id !== 'string' || !candidate.candidate_id.trim()) {
    errors.push('CANDIDATE_ID_REQUIRED');
  }
  if (typeof candidate.claim !== 'string' || !candidate.claim.trim()) {
    errors.push('CLAIM_REQUIRED');
  } else if (candidate.claim.length > 4_000) {
    errors.push('CLAIM_TOO_LONG');
  }
  if (!Array.isArray(candidate.evidence_refs) ||
      candidate.evidence_refs.some((ref) => typeof ref !== 'string')) {
    errors.push('EVIDENCE_REFS_INVALID');
  }
  if (!ORIGINS.has(candidate.origin)) errors.push('ORIGIN_INVALID');
  if (!ACTIONS.has(candidate.requested_action)) errors.push('REQUESTED_ACTION_INVALID');
  return errors;
}

function evaluateProvenance(
  refs: string[],
  index: CodeLensIndex,
): { provenance: CodeLensProvenance; resolved: CodeLensEvidenceRef[]; reasonCodes: string[] } {
  if (refs.length === 0) {
    return { provenance: 'missing', resolved: [], reasonCodes: ['EVIDENCE_REFS_REQUIRED'] };
  }

  const resolved: CodeLensEvidenceRef[] = [];
  const unresolved: string[] = [];
  for (const ref of refs) {
    const known = index.evidence.find((entry) => entry.ref === ref);
    if (known) resolved.push(known);
    else unresolved.push(ref);
  }

  if (resolved.length === 0) {
    return { provenance: 'missing', resolved, reasonCodes: ['EVIDENCE_REFS_UNRESOLVED'] };
  }

  const reasonCodes: string[] = [];
  if (unresolved.length > 0) reasonCodes.push('EVIDENCE_REFS_PARTIALLY_UNRESOLVED');
  if (resolved.some((entry) => entry.status === 'POR_VERIFICAR')) {
    reasonCodes.push('EVIDENCE_STATUS_POR_VERIFICAR');
  }

  const provenance: CodeLensProvenance = reasonCodes.length === 0 ? 'pass' : 'weak';
  if (provenance === 'pass') reasonCodes.push('EVIDENCE_RESOLVED');
  return { provenance, resolved, reasonCodes };
}

function evaluateReproducibility(
  provenance: CodeLensProvenance,
  resolved: CodeLensEvidenceRef[],
): { reproducibility: CodeLensReproducibility; reasonCodes: string[] } {
  if (provenance === 'missing') {
    return { reproducibility: 'unknown', reasonCodes: ['REPRODUCIBILITY_NO_EVIDENCE'] };
  }
  if (resolved.some((entry) => entry.digestMismatch)) {
    return { reproducibility: 'fail', reasonCodes: ['EVIDENCE_DIGEST_MISMATCH'] };
  }
  // Una fuente externa no se puede volver a correr en laboratorio: sin red y sin
  // credenciales, su reproducibilidad es desconocida, no aprobada.
  if (resolved.some((entry) => entry.kind === 'externa')) {
    return { reproducibility: 'unknown', reasonCodes: ['EVIDENCE_EXTERNAL_NOT_REPLAYABLE'] };
  }
  if (resolved.some((entry) => !entry.digest)) {
    return { reproducibility: 'unknown', reasonCodes: ['EVIDENCE_DIGEST_MISSING'] };
  }
  return { reproducibility: 'pass', reasonCodes: ['EVIDENCE_REPLAYABLE'] };
}

function detectContradictions(claim: string, index: CodeLensIndex): CodeLensContradiction[] {
  const candidate = normalizeClaim(claim);
  const found: CodeLensContradiction[] = [];

  for (const canonical of index.canonicalClaims) {
    const other = normalizeClaim(canonical.statement);
    const overlap = topicOverlap(candidate, other);
    if (overlap < CONTRADICTION_OVERLAP_THRESHOLD) continue;

    if (candidate.negated !== other.negated) {
      found.push({
        claim_id: canonical.claim_id,
        type: 'POLARIDAD',
        detected_by: CODELENS_DETECTOR_VERSION,
        overlap: Number(overlap.toFixed(2)),
      });
      continue;
    }
    if (
      candidate.numbers.length > 0 &&
      other.numbers.length > 0 &&
      candidate.numbers.join('|') !== other.numbers.join('|')
    ) {
      found.push({
        claim_id: canonical.claim_id,
        type: 'CIFRA',
        detected_by: CODELENS_DETECTOR_VERSION,
        overlap: Number(overlap.toFixed(2)),
      });
    }
  }

  return found.sort((a, b) => a.claim_id.localeCompare(b.claim_id));
}

function evidenceId(payload: unknown): string {
  return `codelens:${sha256(payload)}`;
}

/**
 * Evalúa un candidato y devuelve un veredicto.
 *
 * Invariantes que las pruebas defienden:
 * - es pura: no escribe, no promueve, no borra, no ejecuta, no abre red;
 * - es determinística: misma entrada e índice ⇒ misma salida, bit a bit;
 * - `promote` jamás alcanza `green`: siempre exige firma humana;
 * - el texto sospechoso de dato personal nunca viaja en la salida.
 */
export function evaluateCandidate(
  candidate: CodeLensCandidate,
  index: CodeLensIndex = EMPTY_CODELENS_INDEX,
): CodeLensVerdict {
  const errors = validationErrors(candidate);
  if (errors.length > 0) {
    return {
      verdict: 'red',
      provenance: 'missing',
      reproducibility: 'unknown',
      contradictions: [],
      risk_flags: ['INVALID_CANDIDATE'],
      reason_codes: errors.sort(),
      required_human_review: true,
      evidence_ids: [evidenceId({ gate: CODELENS_GATE_VERSION, errors: errors.sort() })],
    };
  }

  const refs = [...candidate.evidence_refs];
  const riskFlags = new Set<string>();
  const reasonCodes = new Set<string>();

  // 1. Datos personales: bloqueo duro, antes que cualquier otra consideración.
  const personalData = detectPersonalData([candidate.claim, ...refs].join(' \n '));
  if (personalData.length > 0) {
    riskFlags.add('POSSIBLE_PERSONAL_DATA');
    for (const kind of personalData) reasonCodes.add(`PERSONAL_DATA_SUSPECTED:${kind}`);
  }

  // 2. Procedencia y 3. reproducibilidad.
  const { provenance, resolved, reasonCodes: provenanceCodes } = evaluateProvenance(refs, index);
  for (const code of provenanceCodes) reasonCodes.add(code);
  if (provenance === 'missing') riskFlags.add('NO_PROVENANCE');
  if (provenance === 'weak') riskFlags.add('WEAK_PROVENANCE');

  const { reproducibility, reasonCodes: reproCodes } = evaluateReproducibility(provenance, resolved);
  for (const code of reproCodes) reasonCodes.add(code);
  if (reproducibility === 'fail') riskFlags.add('EVIDENCE_TAMPERED');

  // 4. Contradicción contra el estado canónico que Context.OS entrega.
  const contradictions = detectContradictions(candidate.claim, index);
  if (contradictions.length > 0) {
    riskFlags.add('CONTRADICTS_CANONICAL');
    for (const item of contradictions) {
      reasonCodes.add(`CONTRADICTION_${item.type}:${item.claim_id}`);
    }
  }

  // 5. Utilidad: una afirmación demasiado corta no es evaluable ni útil.
  if (candidate.claim.trim().length < MIN_CLAIM_LENGTH) {
    riskFlags.add('LOW_UTILITY');
    reasonCodes.add('CLAIM_TOO_SHORT');
  }

  // 6. Origen de máquina sin curaduría: techo en `yellow`.
  if (MACHINE_ORIGINS.has(candidate.origin)) {
    riskFlags.add('MACHINE_ORIGIN_UNREVIEWED');
    reasonCodes.add(`ORIGIN_REQUIRES_REVIEW:${candidate.origin}`);
  }

  // 7. Promoción: CodeLens no promueve. Nunca. Solo señala que falta la firma.
  const isPromotion = candidate.requested_action === 'promote';
  if (isPromotion) reasonCodes.add('HUMAN_SIGNATURE_REQUIRED');

  const blocked =
    provenance === 'missing' ||
    reproducibility === 'fail' ||
    riskFlags.has('POSSIBLE_PERSONAL_DATA');

  let verdict: CodeLensVerdictLevel;
  if (blocked) {
    verdict = 'red';
  } else if (contradictions.length > 0 || isPromotion) {
    verdict = 'pending_review';
  } else if (
    provenance === 'weak' ||
    reproducibility !== 'pass' ||
    riskFlags.size > 0
  ) {
    verdict = 'yellow';
  } else {
    verdict = 'green';
  }

  const requiredHumanReview = verdict !== 'green';
  if (verdict === 'green') reasonCodes.add('QUALITY_GATE_PASSED');

  const core = {
    schemaVersion: CODELENS_SCHEMA_VERSION,
    gateVersion: CODELENS_GATE_VERSION,
    candidateId: candidate.candidate_id,
    claimDigest: sha256(candidate.claim),
    origin: candidate.origin,
    requestedAction: candidate.requested_action,
    verdict,
    provenance,
    reproducibility,
    contradictions,
    riskFlags: [...riskFlags].sort(),
    reasonCodes: [...reasonCodes].sort(),
  };

  return {
    verdict,
    provenance,
    reproducibility,
    contradictions,
    risk_flags: core.riskFlags,
    reason_codes: core.reasonCodes,
    required_human_review: requiredHumanReview,
    evidence_ids: [evidenceId(core)],
  };
}

/**
 * Construye el registro de evaluación que Context.OS puede persistir.
 * CodeLens no lo guarda: no es dueño de ningún almacén.
 */
export function buildEvaluationRecord(
  candidate: CodeLensCandidate,
  verdict: CodeLensVerdict,
): CodeLensEvaluationRecord {
  const unsigned = {
    evidenceId: verdict.evidence_ids[0],
    schemaVersion: CODELENS_SCHEMA_VERSION,
    gateVersion: CODELENS_GATE_VERSION,
    candidateId: typeof candidate?.candidate_id === 'string' ? candidate.candidate_id : '',
    claimDigest: sha256(typeof candidate?.claim === 'string' ? candidate.claim : ''),
    origin: candidate?.origin,
    requestedAction: candidate?.requested_action,
    verdict,
    integrityAssurance: 'CHECKSUM_ONLY' as const,
    hashAlgorithm: 'sha256' as const,
  } as Omit<CodeLensEvaluationRecord, 'hash'>;

  return { ...unsigned, hash: sha256(unsigned) };
}

export function verifyEvaluationRecord(record: CodeLensEvaluationRecord): boolean {
  const { hash, ...unsigned } = record;
  return hash === sha256(unsigned);
}
