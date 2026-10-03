/**
 * Única capa de entrada/salida del incremento: lectura de archivos del propio
 * repositorio. Solo lectura, lista blanca explícita, sin red, sin credenciales y
 * sin escribir nada. Todo lo que quede fuera de la lista blanca se reporta como
 * límite, no se adivina.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { EvidenceSourceFile } from './contracts';
import { compareCodeUnits } from './order';

/** Raíces incluidas. Ampliarlas es una decisión humana, no un descubrimiento. */
export const INCLUDED_ROOTS = [
  'docs',
  'shared/semantic/contracts',
] as const;

/** Archivos sueltos incluidos por ser contratos vigentes del runtime. */
export const INCLUDED_FILES = [
  'contextos/contracts.ts',
] as const;

/**
 * Exclusiones deliberadas:
 * - `docs/interno`: material de uso interno, fuera del build público (CLAUDE.md §7).
 * - `.html`: herramientas del Orbe, no documentos de evidencia.
 * - binarios y activos: no aportan afirmaciones citables.
 */
export const EXCLUDED_PATHS = ['docs/interno'] as const;
export const INCLUDED_EXTENSIONS = ['.md', '.json', '.ts'] as const;

function isExcluded(relPath: string): boolean {
  return EXCLUDED_PATHS.some(
    (excluded) => relPath === excluded || relPath.startsWith(`${excluded}/`),
  );
}

function hasIncludedExtension(relPath: string): boolean {
  return INCLUDED_EXTENSIONS.some((extension) => relPath.endsWith(extension));
}

function walk(rootDir: string, current: string, out: string[]): void {
  for (const entry of readdirSync(current, { withFileTypes: true }).sort((a, b) =>
    compareCodeUnits(a.name, b.name),
  )) {
    const absolute = join(current, entry.name);
    const relPath = relative(rootDir, absolute).split(sep).join('/');
    if (isExcluded(relPath)) continue;
    if (entry.isDirectory()) {
      walk(rootDir, absolute, out);
      continue;
    }
    if (entry.isFile() && hasIncludedExtension(relPath)) out.push(relPath);
  }
}

/** Devuelve las rutas candidatas, ordenadas y deterministas. */
export function listSourcePaths(repoRoot: string): string[] {
  const found: string[] = [];

  for (const root of INCLUDED_ROOTS) {
    const absolute = join(repoRoot, root);
    try {
      if (!statSync(absolute).isDirectory()) continue;
    } catch {
      continue;
    }
    walk(repoRoot, absolute, found);
  }

  for (const file of INCLUDED_FILES) {
    try {
      if (statSync(join(repoRoot, file)).isFile()) found.push(file);
    } catch {
      // Un archivo ausente se omite; el índice no inventa fuentes.
    }
  }

  return [...new Set(found)].sort(compareCodeUnits);
}

/** Lee las fuentes. No sigue enlaces simbólicos fuera de la raíz ni escribe nada. */
export function readSourceFiles(repoRoot: string): EvidenceSourceFile[] {
  return listSourcePaths(repoRoot).map((path) => ({
    path,
    content: readFileSync(join(repoRoot, path), 'utf8'),
  }));
}
