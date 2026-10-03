/**
 * Puente hacia CodeLens.
 *
 * CodeLens no cambia ni una regla para consumir este índice: solo recibe el
 * `CodeLensIndex` que ya sabía leer. El puente traduce, no decide.
 */

import type { CodeLensCanonicalClaim, CodeLensEvidenceRef, CodeLensIndex } from '../codelens';
import type { EvidenceIndexEntry } from './contracts';

export interface BridgeOptions {
  /** Afirmaciones canónicas que Context.OS entrega; el índice no las produce. */
  canonicalClaims?: readonly CodeLensCanonicalClaim[];
  /** URIs cuyo checksum cambió respecto del índice previo (`diffEvidenceIndex`). */
  changedUris?: readonly string[];
  /** Además del URI, aceptar la cita por `evidence_id` (contenido inmutable). */
  includeEvidenceIdAliases?: boolean;
}

function refFor(
  entry: EvidenceIndexEntry,
  ref: string,
  changed: ReadonlySet<string>,
): CodeLensEvidenceRef {
  const base: CodeLensEvidenceRef = {
    ref,
    // Ninguna entrada es `externa`: el índice solo cataloga lo que está en el repo.
    kind: entry.kind === 'acta' ? 'acta' : 'repo',
    status: entry.status,
    digest: entry.checksum,
  };
  return changed.has(entry.uri) ? { ...base, digestMismatch: true } : base;
}

export function toCodeLensIndex(
  entries: readonly EvidenceIndexEntry[],
  options: BridgeOptions = {},
): CodeLensIndex {
  const changed = new Set(options.changedUris ?? []);
  const includeAliases = options.includeEvidenceIdAliases ?? true;

  const evidence: CodeLensEvidenceRef[] = [];
  for (const entry of entries) {
    evidence.push(refFor(entry, entry.uri, changed));
    if (includeAliases) evidence.push(refFor(entry, entry.evidence_id, changed));
  }

  return {
    evidence,
    canonicalClaims: options.canonicalClaims ?? [],
  };
}
