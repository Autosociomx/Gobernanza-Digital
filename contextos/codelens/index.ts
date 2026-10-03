export {
  CODELENS_DETECTOR_VERSION,
  CODELENS_GATE_VERSION,
  CODELENS_SCHEMA_VERSION,
  EMPTY_CODELENS_INDEX,
} from './contracts';
export type {
  CodeLensCandidate,
  CodeLensCanonicalClaim,
  CodeLensContradiction,
  CodeLensContradictionType,
  CodeLensEvaluationRecord,
  CodeLensEvidenceRef,
  CodeLensIndex,
  CodeLensOrigin,
  CodeLensProvenance,
  CodeLensReproducibility,
  CodeLensRequestedAction,
  CodeLensVerdict,
  CodeLensVerdictLevel,
} from './contracts';
export {
  buildEvaluationRecord,
  CONTRADICTION_OVERLAP_THRESHOLD,
  evaluateCandidate,
  MIN_CLAIM_LENGTH,
  verifyEvaluationRecord,
} from './gate';
export { detectPersonalData } from './personalData';
export type { PersonalDataKind } from './personalData';
