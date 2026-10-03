/**
 * CodeLens v0.1 — compuerta de calidad de Context.OS.
 *
 * CodeLens NO es memoria, NO es un agente autónomo y NO es una arquitectura
 * paralela: es una función determinística que evalúa candidatos a conocimiento
 * y devuelve un veredicto. El estado canónico, las políticas, los permisos, las
 * versiones y las decisiones humanas siguen siendo de Context.OS.
 */

export const CODELENS_SCHEMA_VERSION = 'contextos.codelens.v0.1' as const;
export const CODELENS_GATE_VERSION = 'contextos.codelens.gate.v0.1' as const;
export const CODELENS_DETECTOR_VERSION = 'contextos.codelens.lexical.v0.1' as const;

export type CodeLensOrigin = 'radar' | 'human' | 'agent' | 'import';
export type CodeLensRequestedAction = 'read' | 'propose' | 'promote';

export type CodeLensVerdictLevel = 'green' | 'yellow' | 'red' | 'pending_review';
export type CodeLensProvenance = 'pass' | 'missing' | 'weak';
export type CodeLensReproducibility = 'pass' | 'unknown' | 'fail';

/** Entrada del contrato mínimo acordado. */
export interface CodeLensCandidate {
  candidate_id: string;
  claim: string;
  evidence_refs: string[];
  origin: CodeLensOrigin;
  requested_action: CodeLensRequestedAction;
}

export type CodeLensContradictionType = 'POLARIDAD' | 'CIFRA';

export interface CodeLensContradiction {
  claim_id: string;
  type: CodeLensContradictionType;
  detected_by: typeof CODELENS_DETECTOR_VERSION;
  /** Similitud léxica de tema, 0–1. No es comprensión semántica: es conteo de tokens. */
  overlap: number;
}

/** Salida del contrato mínimo acordado. */
export interface CodeLensVerdict {
  verdict: CodeLensVerdictLevel;
  provenance: CodeLensProvenance;
  reproducibility: CodeLensReproducibility;
  contradictions: CodeLensContradiction[];
  risk_flags: string[];
  reason_codes: string[];
  required_human_review: boolean;
  evidence_ids: string[];
}

/**
 * Referencia de evidencia ya conocida por Context.OS.
 * CodeLens no resuelve referencias por su cuenta: no lee disco, no abre red y
 * no usa credenciales. Recibe el índice que el dueño del estado le entrega.
 */
export interface CodeLensEvidenceRef {
  ref: string;
  /** `repo` y `acta` son replicables sin red; `externa` no lo es en laboratorio. */
  kind: 'repo' | 'acta' | 'externa';
  /** VERIFICADO / POR_VERIFICAR — regla de citación de docs/marco/BIBLIOTECA_LEGAL.md. */
  status: 'VERIFICADO' | 'POR_VERIFICAR';
  /** Huella registrada por Context.OS. Su ausencia degrada la reproducibilidad. */
  digest?: string;
  /** Marcada por Context.OS cuando la huella dejó de coincidir. */
  digestMismatch?: boolean;
}

/** Afirmación ya canónica contra la cual se contrasta el candidato. */
export interface CodeLensCanonicalClaim {
  claim_id: string;
  statement: string;
}

export interface CodeLensIndex {
  evidence: readonly CodeLensEvidenceRef[];
  canonicalClaims: readonly CodeLensCanonicalClaim[];
}

export const EMPTY_CODELENS_INDEX: CodeLensIndex = Object.freeze({
  evidence: Object.freeze([]) as readonly CodeLensEvidenceRef[],
  canonicalClaims: Object.freeze([]) as readonly CodeLensCanonicalClaim[],
});

/**
 * Registro de evaluación. Reusa la disciplina de checksum de Context.OS
 * (`contextos/canonical.ts`) y declara la misma limitación: un checksum no es
 * firma digital, sello de tiempo ni prueba de inmutabilidad frente a un atacante.
 */
export interface CodeLensEvaluationRecord {
  evidenceId: string;
  schemaVersion: typeof CODELENS_SCHEMA_VERSION;
  gateVersion: typeof CODELENS_GATE_VERSION;
  candidateId: string;
  /** Huella del texto evaluado. El texto crudo no se guarda ni se devuelve. */
  claimDigest: string;
  origin: CodeLensOrigin;
  requestedAction: CodeLensRequestedAction;
  verdict: CodeLensVerdict;
  integrityAssurance: 'CHECKSUM_ONLY';
  hashAlgorithm: 'sha256';
  hash: string;
}
