/**
 * Construcción del índice. Función pura: recibe archivos ya leídos y devuelve
 * entradas ordenadas y un reporte de cobertura. No toca disco, no toca red, no
 * escribe nada y no depende del reloj.
 */

import { sha256 } from '../canonical';
import { EVIDENCE_INDEX_SCHEMA_VERSION } from './contracts';
import type {
  EvidenceCoverageReport,
  EvidenceIndex,
  EvidenceIndexDiff,
  EvidenceIndexEntry,
  EvidenceSourceFile,
} from './contracts';
import { compareCodeUnits } from './order';
import {
  classifyPath,
  extractDate,
  extractJsonMetadata,
  extractStatus,
  extractTsContractMetadata,
  extractVersion,
  headerOf,
  missingFields,
} from './metadata';

function byteLength(content: string): number {
  return Buffer.byteLength(content, 'utf8');
}

/**
 * Identidad de la entrada: contenido + ubicación. El mismo archivo con el mismo
 * contenido produce el mismo `evidence_id` en cualquier máquina; si el documento
 * cambia, cambia el id, y esa es justamente la señal que Context.OS necesita.
 */
export function evidenceIdFor(uri: string, checksum: string): string {
  return `ev:${sha256({ uri, checksum })}`;
}

export function buildEntry(file: EvidenceSourceFile): EvidenceIndexEntry {
  const path = file.path.replace(/\\/g, '/');
  const content = file.content;
  const header = headerOf(content);
  const kind = classifyPath(path);

  let version = extractVersion(header);
  let date = extractDate(header);

  if (path.endsWith('.json')) {
    const json = extractJsonMetadata(content);
    version = json.version ?? version;
    date = json.date ?? date;
  } else if (path.endsWith('.ts')) {
    const ts = extractTsContractMetadata(content);
    version = ts.version ?? version;
  }

  const status = extractStatus(header);
  const checksum = `sha256:${sha256(content)}`;
  const uri = `repo:${path}`;

  return {
    evidence_id: evidenceIdFor(uri, checksum),
    uri,
    path,
    kind,
    version,
    date,
    status,
    checksum,
    hashAlgorithm: 'sha256',
    bytes: byteLength(content),
    missing: missingFields(version, date, status),
  };
}

export function buildEvidenceIndex(files: readonly EvidenceSourceFile[]): EvidenceIndex {
  const entries = [...files]
    .map(buildEntry)
    .sort((a, b) => compareCodeUnits(a.path, b.path));

  const byKind: Record<string, number> = {};
  for (const entry of entries) {
    byKind[entry.kind] = (byKind[entry.kind] ?? 0) + 1;
  }

  const report: EvidenceCoverageReport = {
    schemaVersion: EVIDENCE_INDEX_SCHEMA_VERSION,
    totalFiles: files.length,
    totalEntries: entries.length,
    withVersion: entries.filter((entry) => Boolean(entry.version)).length,
    withDate: entries.filter((entry) => Boolean(entry.date)).length,
    withVersionAndDate: entries.filter((entry) => entry.version && entry.date).length,
    verified: entries.filter((entry) => entry.status === 'VERIFICADO').length,
    byKind: Object.fromEntries(Object.entries(byKind).sort(([a], [b]) => compareCodeUnits(a, b))),
    incomplete: entries
      .filter((entry) => entry.missing.length > 0)
      .map((entry) => ({ path: entry.path, missing: entry.missing })),
  };

  return { schemaVersion: EVIDENCE_INDEX_SCHEMA_VERSION, entries, report };
}

/**
 * Compara un índice previo con el actual. Es la única forma honesta de saber que
 * un documento citado cambió: el índice no vigila archivos, se compara consigo mismo.
 */
export function diffEvidenceIndex(
  previous: readonly EvidenceIndexEntry[],
  current: readonly EvidenceIndexEntry[],
): EvidenceIndexDiff {
  const before = new Map(previous.map((entry) => [entry.uri, entry]));
  const after = new Map(current.map((entry) => [entry.uri, entry]));

  const added: string[] = [];
  const changed: string[] = [];
  for (const [uri, entry] of after) {
    const old = before.get(uri);
    if (!old) added.push(uri);
    else if (old.checksum !== entry.checksum) changed.push(uri);
  }
  const removed = [...before.keys()].filter((uri) => !after.has(uri));

  return {
    added: added.sort(compareCodeUnits),
    removed: removed.sort(compareCodeUnits),
    changed: changed.sort(compareCodeUnits),
  };
}
