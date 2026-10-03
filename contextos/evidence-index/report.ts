/**
 * Reporte de cobertura del Evidence Index. Solo lectura: imprime, no escribe.
 *
 *   npm run evidencia:reporte            # resumen legible
 *   npm run evidencia:reporte -- --json  # índice completo en JSON, a stdout
 */

import { buildEvidenceIndex } from './builder';
import { EXCLUDED_PATHS, INCLUDED_FILES, INCLUDED_ROOTS, readSourceFiles } from './scan';

function percent(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

function main(): void {
  const repoRoot = process.cwd();
  const index = buildEvidenceIndex(readSourceFiles(repoRoot));
  const { report, entries } = index;

  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(index, null, 2)}\n`);
    return;
  }

  const lines: string[] = [];
  lines.push(`Evidence Index ${report.schemaVersion}`);
  lines.push(`Raíces: ${INCLUDED_ROOTS.join(', ')} + ${INCLUDED_FILES.join(', ')}`);
  lines.push(`Excluido: ${EXCLUDED_PATHS.join(', ')}`);
  lines.push('');
  lines.push(`Entradas:            ${report.totalEntries}`);
  lines.push(`Con versión:         ${report.withVersion} (${percent(report.withVersion, report.totalEntries)})`);
  lines.push(`Con fecha:           ${report.withDate} (${percent(report.withDate, report.totalEntries)})`);
  lines.push(`Con ambas:           ${report.withVersionAndDate} (${percent(report.withVersionAndDate, report.totalEntries)})`);
  lines.push(`Estatus VERIFICADO:  ${report.verified} (${percent(report.verified, report.totalEntries)})`);
  lines.push('');
  lines.push('Por tipo:');
  for (const [kind, count] of Object.entries(report.byKind)) {
    lines.push(`  ${kind.padEnd(20)} ${count}`);
  }
  lines.push('');
  lines.push(`Documentos con metadatos incompletos: ${report.incomplete.length}`);
  for (const item of report.incomplete.slice(0, 20)) {
    lines.push(`  ${item.path} — falta: ${item.missing.join(', ')}`);
  }
  if (report.incomplete.length > 20) {
    lines.push(`  … y ${report.incomplete.length - 20} más (usa --json para la lista completa)`);
  }
  lines.push('');
  lines.push(`Ejemplo de entrada: ${entries[0]?.evidence_id ?? '(índice vacío)'} → ${entries[0]?.uri ?? ''}`);

  process.stdout.write(`${lines.join('\n')}\n`);
}

main();
