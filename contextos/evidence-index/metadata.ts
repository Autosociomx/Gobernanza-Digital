/**
 * Extractores deterministas de metadatos.
 *
 * Cada regla corresponde a un patrón que YA se usa en el repositorio; no se
 * inventa formato nuevo ni se adivina lo que el documento no dice. Lo ausente se
 * reporta como ausente.
 */

import type { EvidenceKind, EvidenceStatus, MissingMetadataField } from './contracts';

/** Ventana de cabecera: los metadatos del repo viven en las primeras líneas. */
export const HEADER_LINES = 15;

const MESES: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
  noviembre: '11', diciembre: '12',
};

const ISO_DATE = /\b(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/;
// «12 agosto 2026», «11 Agosto 2026», «12 de agosto de 2026»
const LONG_DATE = new RegExp(
  `\\b(\\d{1,2})\\s+(?:de\\s+)?(${Object.keys(MESES).join('|')})\\s+(?:de\\s+)?(20\\d{2})\\b`,
  'i',
);
// «**Versión:** 2.0» o «· v1.0» / «v1.1»
const VERSION_LABEL = /\*\*versi[oó]n:?\*\*\s*v?(\d+\.\d+(?:\.\d+)?)/i;
const VERSION_TOKEN = /(?:^|[\s·(])v(\d+\.\d+(?:\.\d+)?)\b/i;
// Marcador explícito de curaduría; hoy casi ningún documento lo declara.
const STATUS_MARKER = /\*\*estatus:?\*\*\s*(VERIFICADO|POR[_\s]VERIFICAR)/i;

export function headerOf(content: string, lines: number = HEADER_LINES): string {
  return content.split(/\r?\n/, lines).join('\n');
}

export function extractDate(header: string): string | undefined {
  const iso = header.match(ISO_DATE);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const long = header.match(LONG_DATE);
  if (long) {
    const day = long[1].padStart(2, '0');
    const month = MESES[long[2].toLowerCase()];
    if (month) return `${long[3]}-${month}-${day}`;
  }
  // «Agosto 2026» sin día queda fuera a propósito: una fecha incompleta no es fecha.
  return undefined;
}

export function extractVersion(header: string): string | undefined {
  const labelled = header.match(VERSION_LABEL);
  if (labelled) return labelled[1];
  const token = header.match(VERSION_TOKEN);
  if (token) return token[1];
  return undefined;
}

export function extractStatus(header: string): EvidenceStatus {
  const marker = header.match(STATUS_MARKER);
  if (marker && marker[1].toUpperCase() === 'VERIFICADO') return 'VERIFICADO';
  return 'POR_VERIFICAR';
}

/** Metadatos declarados dentro de un JSON del repositorio (`version`, `fecha`). */
export function extractJsonMetadata(content: string): { version?: string; date?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const record = parsed as Record<string, unknown>;
  const version = typeof record.version === 'string' ? record.version : undefined;
  const rawDate =
    typeof record.fecha === 'string' ? record.fecha :
    typeof record.actualizado === 'string' ? record.actualizado :
    undefined;
  const date = rawDate ? extractDate(rawDate) : undefined;
  return { version, date };
}

/** Metadatos de un contrato TypeScript ya versionado (`version: '0.1.0'`). */
export function extractTsContractMetadata(content: string): { version?: string } {
  const declared = content.match(/\bversion:\s*'([^']+)'/);
  if (declared) return { version: declared[1] };
  const schema = content.match(/_SCHEMA_VERSION\s*=\s*'([^']+)'/);
  if (schema) return { version: schema[1] };
  const registry = content.match(/_REGISTRY_VERSION\s*=\s*'([^']+)'/);
  if (registry) return { version: registry[1] };
  return {};
}

/** El tipo se deriva de la ruta: es el único hecho que no depende de la prosa. */
export function classifyPath(path: string): EvidenceKind {
  if (path.startsWith('docs/actas/')) return 'acta';
  if (path === 'docs/marco/modulos/INDICE.json') return 'registro-modulos';
  if (path.startsWith('docs/marco/modulos/')) return 'ficha-modulo';
  if (path === 'docs/orbe/modulos.json') return 'registro-orbe';
  if (path.startsWith('docs/orbe/modulos/')) return 'ficha-orbe';
  if (path.startsWith('docs/marco/')) return 'marco';
  if (path.startsWith('docs/plataforma/')) return 'plataforma';
  if (path.startsWith('docs/investigacion/')) return 'investigacion';
  if (path.startsWith('docs/orbe/')) return 'orbe';
  if (path.startsWith('docs/agentes/')) return 'agentes';
  if (path.startsWith('docs/auditoria-orbe/')) return 'auditoria';
  if (path.startsWith('docs/expediente-regulatorio/')) return 'expediente-regulatorio';
  if (path.startsWith('docs/presentacion-tepic/')) return 'presentacion';
  if (path.startsWith('shared/semantic/contracts/')) return 'contrato-semantico';
  if (path.startsWith('contextos/') && path.endsWith('contracts.ts')) return 'contrato-runtime';
  return 'documento';
}

export function missingFields(
  version: string | undefined,
  date: string | undefined,
  status: EvidenceStatus,
): MissingMetadataField[] {
  const missing: MissingMetadataField[] = [];
  if (!version) missing.push('version');
  if (!date) missing.push('fecha');
  if (status !== 'VERIFICADO') missing.push('estatus');
  return missing;
}
