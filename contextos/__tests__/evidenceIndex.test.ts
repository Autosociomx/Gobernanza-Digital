import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildEntry,
  buildEvidenceIndex,
  classifyPath,
  diffEvidenceIndex,
  evidenceIdFor,
  extractDate,
  extractVersion,
  listSourcePaths,
  readSourceFiles,
  toCodeLensIndex,
} from '../evidence-index';
import type { EvidenceIndexEntry } from '../evidence-index';
import { evaluateCandidate } from '../codelens';
import type { CodeLensCandidate } from '../codelens';

const FIXTURE_ROOT = fileURLToPath(new URL('../evidence-index/__fixtures__/repo', import.meta.url));
const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));

function fixtureIndex() {
  return buildEvidenceIndex(readSourceFiles(FIXTURE_ROOT));
}

function entryFor(entries: EvidenceIndexEntry[], path: string): EvidenceIndexEntry {
  const found = entries.find((entry) => entry.path === path);
  if (!found) throw new Error(`fixture ausente: ${path}`);
  return found;
}

function candidate(overrides: Partial<CodeLensCandidate> = {}): CodeLensCandidate {
  return {
    candidate_id: 'cand-ev-001',
    claim: 'El protocolo de ejemplo declara versión y fecha en su cabecera institucional.',
    evidence_refs: ['repo:docs/marco/PROTOCOLO_FIXTURE.md'],
    origin: 'human',
    requested_action: 'propose',
    ...overrides,
  };
}

describe('Evidence Index v0.1 — inventario de solo lectura', () => {
  it('escanea solo la lista blanca: excluye docs/interno y los .html', () => {
    expect(listSourcePaths(FIXTURE_ROOT)).toEqual([
      'contextos/contracts.ts',
      'docs/actas/Acta_900_Fixture.md',
      'docs/marco/FECHA_INCOMPLETA_FIXTURE.md',
      'docs/marco/PROTOCOLO_FIXTURE.md',
      'docs/marco/SIN_VERSION_FIXTURE.md',
      'docs/marco/modulos/INDICE.json',
      'docs/marco/modulos/fixture-modulo.md',
      'docs/orbe/modulos.json',
      'docs/plataforma/SIN_METADATOS_FIXTURE.md',
      'shared/semantic/contracts/fixtureContract.ts',
    ]);
  });

  it('extrae versión, fecha, tipo y checksum de los patrones que el repo ya usa', () => {
    const { entries } = fixtureIndex();

    expect(entryFor(entries, 'docs/marco/PROTOCOLO_FIXTURE.md')).toMatchObject({
      uri: 'repo:docs/marco/PROTOCOLO_FIXTURE.md',
      kind: 'marco',
      version: '1.2',
      date: '2026-08-14',
      status: 'VERIFICADO',
      hashAlgorithm: 'sha256',
      missing: [],
    });
    // Fecha larga en español, sin versión declarada.
    expect(entryFor(entries, 'docs/marco/SIN_VERSION_FIXTURE.md')).toMatchObject({
      date: '2026-08-11',
      version: undefined,
      missing: ['version', 'estatus'],
    });
    // Acta: tipo derivado de la ruta, fecha larga.
    expect(entryFor(entries, 'docs/actas/Acta_900_Fixture.md')).toMatchObject({
      kind: 'acta',
      date: '2026-08-12',
    });
    // JSON: la versión sale del campo `version`, no de la prosa.
    expect(entryFor(entries, 'docs/marco/modulos/INDICE.json')).toMatchObject({
      kind: 'registro-modulos',
      version: '1.0',
      date: '2026-08-01',
    });
    expect(entryFor(entries, 'docs/orbe/modulos.json')).toMatchObject({
      kind: 'registro-orbe',
      version: '2.0',
    });
    // Contratos: versión declarada en el propio contrato.
    expect(entryFor(entries, 'shared/semantic/contracts/fixtureContract.ts')).toMatchObject({
      kind: 'contrato-semantico',
      version: '0.1.0',
    });
    expect(entryFor(entries, 'contextos/contracts.ts')).toMatchObject({
      kind: 'contrato-runtime',
      version: 'contextos.v0.1',
    });

    for (const entry of entries) {
      expect(entry.checksum).toMatch(/^sha256:[0-9a-f]{64}$/);
      expect(entry.bytes).toBeGreaterThan(0);
    }
  });

  it('clasifica por carpeta real del repositorio y deja una cubeta residual explícita', () => {
    expect(classifyPath('docs/actas/Acta_006.md')).toBe('acta');
    expect(classifyPath('docs/agentes/GABINETE_ESPECIALISTAS.md')).toBe('agentes');
    expect(classifyPath('docs/auditoria-orbe/CIERRE_AUDITORIA_FINAL.md')).toBe('auditoria');
    expect(classifyPath('docs/expediente-regulatorio/PLAN_DE_MITIGACION.md')).toBe('expediente-regulatorio');
    expect(classifyPath('docs/presentacion-tepic/guion.md')).toBe('presentacion');
    expect(classifyPath('docs/orbe/README.md')).toBe('orbe');
    expect(classifyPath('docs/orbe/modulos.json')).toBe('registro-orbe');
    expect(classifyPath('docs/marco/modulos/INDICE.json')).toBe('registro-modulos');
    // Sin carpeta tipificada, la cubeta residual — nunca una etiqueta inventada.
    expect(classifyPath('docs/TABLA_MIGRACION_DOCUMENTAL.md')).toBe('documento');
  });

  it('no inventa metadatos: una fecha sin día se reporta ausente', () => {
    const { entries } = fixtureIndex();
    const incompleta = entryFor(entries, 'docs/marco/FECHA_INCOMPLETA_FIXTURE.md');

    expect(incompleta.version).toBe('0.3');
    expect(incompleta.date).toBeUndefined();
    expect(incompleta.missing).toContain('fecha');
    expect(extractDate('**Fecha:** Agosto 2026')).toBeUndefined();
    expect(extractVersion('sin nada que declarar')).toBeUndefined();
  });

  it('el estatus solo se copia de un marcador explícito, nunca se infiere', () => {
    const { entries, report } = fixtureIndex();

    expect(report.verified).toBe(1);
    expect(entryFor(entries, 'docs/marco/PROTOCOLO_FIXTURE.md').status).toBe('VERIFICADO');
    expect(entryFor(entries, 'docs/plataforma/SIN_METADATOS_FIXTURE.md').status).toBe('POR_VERIFICAR');
  });

  it('genera evidence_id determinístico y sensible al contenido', () => {
    const primero = fixtureIndex();
    const segundo = fixtureIndex();

    expect(JSON.stringify(segundo)).toBe(JSON.stringify(primero));

    const protocolo = entryFor(primero.entries, 'docs/marco/PROTOCOLO_FIXTURE.md');
    expect(protocolo.evidence_id).toMatch(/^ev:[0-9a-f]{64}$/);
    expect(protocolo.evidence_id).toBe(evidenceIdFor(protocolo.uri, protocolo.checksum));

    const editado = buildEntry({
      path: 'docs/marco/PROTOCOLO_FIXTURE.md',
      content: 'contenido distinto',
    });
    expect(editado.evidence_id).not.toBe(protocolo.evidence_id);
  });

  it('reporta cobertura y los documentos sin metadatos', () => {
    const { report } = fixtureIndex();

    expect(report.totalEntries).toBe(10);
    expect(report.withVersion + report.withDate).toBeGreaterThan(0);
    expect(report.byKind).toMatchObject({
      acta: 1,
      'contrato-runtime': 1,
      'contrato-semantico': 1,
      'registro-modulos': 1,
      'registro-orbe': 1,
    });
    expect(report.incomplete).toContainEqual({
      path: 'docs/plataforma/SIN_METADATOS_FIXTURE.md',
      missing: ['version', 'fecha', 'estatus'],
    });
  });

  it('compara índices para detectar documentos que cambiaron', () => {
    const previo = fixtureIndex().entries;
    const actual = previo
      .filter((entry) => entry.path !== 'docs/orbe/modulos.json')
      .map((entry) =>
        entry.path === 'docs/marco/PROTOCOLO_FIXTURE.md'
          ? buildEntry({ path: entry.path, content: 'el documento fue editado' })
          : entry,
      )
      .concat(buildEntry({ path: 'docs/marco/NUEVO.md', content: '# Nuevo\n' }));

    expect(diffEvidenceIndex(previo, actual)).toEqual({
      added: ['repo:docs/marco/NUEVO.md'],
      removed: ['repo:docs/orbe/modulos.json'],
      changed: ['repo:docs/marco/PROTOCOLO_FIXTURE.md'],
    });
  });
});

describe('Evidence Index → CodeLens (sin cambiar una sola regla de la compuerta)', () => {
  it('una cita a un documento VERIFICADO con huella aprueba en verde', () => {
    const index = toCodeLensIndex(fixtureIndex().entries);
    const verdict = evaluateCandidate(candidate(), index);

    expect(verdict.provenance).toBe('pass');
    expect(verdict.reproducibility).toBe('pass');
    expect(verdict.verdict).toBe('green');
  });

  it('acepta la cita por evidence_id además de por ruta', () => {
    const entries = fixtureIndex().entries;
    const protocolo = entryFor(entries, 'docs/marco/PROTOCOLO_FIXTURE.md');
    const verdict = evaluateCandidate(
      candidate({ evidence_refs: [protocolo.evidence_id] }),
      toCodeLensIndex(entries),
    );

    expect(verdict.provenance).toBe('pass');
    expect(verdict.verdict).toBe('green');
  });

  it('un documento sin estatus declarado da procedencia débil, no verde', () => {
    const verdict = evaluateCandidate(
      candidate({ evidence_refs: ['repo:docs/plataforma/SIN_METADATOS_FIXTURE.md'] }),
      toCodeLensIndex(fixtureIndex().entries),
    );

    expect(verdict.provenance).toBe('weak');
    expect(verdict.reason_codes).toContain('EVIDENCE_STATUS_POR_VERIFICAR');
    expect(verdict.verdict).toBe('yellow');
  });

  it('un documento que cambió desde el índice previo reprueba por huella', () => {
    const index = toCodeLensIndex(fixtureIndex().entries, {
      changedUris: ['repo:docs/marco/PROTOCOLO_FIXTURE.md'],
    });
    const verdict = evaluateCandidate(candidate(), index);

    expect(verdict.reproducibility).toBe('fail');
    expect(verdict.risk_flags).toContain('EVIDENCE_TAMPERED');
    expect(verdict.verdict).toBe('red');
  });

  it('el puente nunca produce referencias externas', () => {
    const index = toCodeLensIndex(fixtureIndex().entries);
    expect(index.evidence.every((ref) => ref.kind !== 'externa')).toBe(true);
    expect(index.canonicalClaims).toEqual([]);
  });
});

describe('Evidence Index sobre el repositorio real', () => {
  it('cataloga documentos existentes con identidad estable y sin salirse de la lista blanca', () => {
    const primero = buildEvidenceIndex(readSourceFiles(REPO_ROOT));
    const segundo = buildEvidenceIndex(readSourceFiles(REPO_ROOT));

    expect(JSON.stringify(segundo)).toBe(JSON.stringify(primero));
    expect(primero.entries.length).toBeGreaterThan(50);

    const uris = primero.entries.map((entry) => entry.uri);
    expect(new Set(uris).size).toBe(uris.length);

    for (const entry of primero.entries) {
      expect(entry.evidence_id).toMatch(/^ev:[0-9a-f]{64}$/);
      expect(entry.uri.startsWith('repo:')).toBe(true);
      expect(entry.path.startsWith('docs/interno/')).toBe(false);
      expect(entry.path.endsWith('.html')).toBe(false);
    }

    const paths = primero.entries.map((entry) => entry.path);
    expect(paths).toContain('docs/marco/BIBLIOTECA_LEGAL.md');
    expect(paths).toContain('contextos/contracts.ts');
    expect(paths).toContain('shared/semantic/contracts/publicWorksReport.ts');
  });
});
