export { EVIDENCE_INDEX_SCHEMA_VERSION } from './contracts';
export type {
  EvidenceCoverageReport,
  EvidenceIndex,
  EvidenceIndexDiff,
  EvidenceIndexEntry,
  EvidenceKind,
  EvidenceSourceFile,
  EvidenceStatus,
  MissingMetadataField,
} from './contracts';
export { buildEntry, buildEvidenceIndex, diffEvidenceIndex, evidenceIdFor } from './builder';
export {
  classifyPath,
  extractDate,
  extractJsonMetadata,
  extractStatus,
  extractTsContractMetadata,
  extractVersion,
  HEADER_LINES,
  headerOf,
} from './metadata';
export {
  EXCLUDED_PATHS,
  INCLUDED_EXTENSIONS,
  INCLUDED_FILES,
  INCLUDED_ROOTS,
  listSourcePaths,
  readSourceFiles,
} from './scan';
export { compareCodeUnits } from './order';
export { toCodeLensIndex } from './codelensBridge';
export type { BridgeOptions } from './codelensBridge';
