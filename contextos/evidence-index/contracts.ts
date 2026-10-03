/**
 * Evidence Index v0.1 — inventario de solo lectura de la evidencia que YA existe
 * en el repositorio.
 *
 * No inventa fuentes, no descarga nada y no modifica el runtime. Convierte
 * documentos y contratos reales en entradas con identidad estable, checksum,
 * tipo, versión y fecha, para que Context.OS —y CodeLens como consumidor— dejen
 * de razonar sobre rutas sueltas escritas a mano.
 */

export const EVIDENCE_INDEX_SCHEMA_VERSION = 'contextos.evidence-index.v0.1' as const;

/** Tipo derivado de la ruta, nunca del contenido: la ruta es el hecho verificable. */
export type EvidenceKind =
  | 'acta'
  | 'marco'
  | 'ficha-modulo'
  | 'registro-modulos'
  | 'ficha-orbe'
  | 'registro-orbe'
  | 'plataforma'
  | 'investigacion'
  | 'agentes'
  | 'auditoria'
  | 'expediente-regulatorio'
  | 'presentacion'
  | 'orbe'
  | 'contrato-semantico'
  | 'contrato-runtime'
  /** Cubeta residual: documento del repositorio sin carpeta tipificada. */
  | 'documento';

/**
 * Estatus de curaduría. El índice NO lo infiere: solo lo copia cuando el propio
 * documento lo declara con un marcador explícito. Sin marcador, POR_VERIFICAR.
 */
export type EvidenceStatus = 'VERIFICADO' | 'POR_VERIFICAR';

/** Metadato ausente en el documento, reportado en vez de rellenado. */
export type MissingMetadataField = 'version' | 'fecha' | 'estatus';

export interface EvidenceIndexEntry {
  /** `ev:<sha256>` derivado de (uri, checksum). Mismo contenido ⇒ mismo id. */
  evidence_id: string;
  /** URI estable dentro del repositorio: `repo:<ruta relativa>`. */
  uri: string;
  /** Ruta relativa a la raíz del repositorio, con separador `/`. */
  path: string;
  kind: EvidenceKind;
  /** Versión declarada por el documento (`v1.0`, `**Versión:** 2.0`, campo `version`). */
  version?: string;
  /** Fecha declarada por el documento, normalizada a ISO `YYYY-MM-DD`. */
  date?: string;
  status: EvidenceStatus;
  checksum: string;
  hashAlgorithm: 'sha256';
  bytes: number;
  /** Campos que el documento no declara. El índice los reporta, no los inventa. */
  missing: MissingMetadataField[];
}

/** Documento crudo que el escáner entrega al constructor puro. */
export interface EvidenceSourceFile {
  path: string;
  content: string;
}

export interface EvidenceCoverageReport {
  schemaVersion: typeof EVIDENCE_INDEX_SCHEMA_VERSION;
  totalFiles: number;
  totalEntries: number;
  withVersion: number;
  withDate: number;
  withVersionAndDate: number;
  verified: number;
  byKind: Record<string, number>;
  /** Documentos a los que les falta al menos un metadato, ordenados por ruta. */
  incomplete: Array<{ path: string; missing: MissingMetadataField[] }>;
}

export interface EvidenceIndex {
  schemaVersion: typeof EVIDENCE_INDEX_SCHEMA_VERSION;
  entries: EvidenceIndexEntry[];
  report: EvidenceCoverageReport;
}

/** Diferencia entre dos índices: la única vía honesta a `digestMismatch`. */
export interface EvidenceIndexDiff {
  added: string[];
  removed: string[];
  /** Mismo URI, checksum distinto: el documento cambió desde el índice previo. */
  changed: string[];
}
