import { describe, expect, it } from 'vitest';
import {
  buildEvaluationRecord,
  evaluateCandidate,
  verifyEvaluationRecord,
} from '../codelens';
import type { CodeLensCandidate, CodeLensIndex } from '../codelens';

/**
 * Ningún dato de estas pruebas es real: las referencias apuntan a archivos del
 * repositorio y la CURP del caso 4 es sintética (regla 9 — ningún dato personal
 * real en el repositorio, tampoco en semillas ni en pruebas).
 */
const INDEX: CodeLensIndex = {
  evidence: [
    {
      ref: 'repo:docs/marco/BIBLIOTECA_LEGAL.md#hacienda-municipal',
      kind: 'repo',
      status: 'VERIFICADO',
      digest: 'sha256:aaa',
    },
    {
      ref: 'acta:docs/actas/006',
      kind: 'acta',
      status: 'VERIFICADO',
      digest: 'sha256:bbb',
    },
    {
      ref: 'repo:docs/marco/modulos/INDICE.json#tesoreria',
      kind: 'repo',
      status: 'VERIFICADO',
      digest: 'sha256:ccc',
    },
    {
      ref: 'externa:https://www.dof.gob.mx/nota_detalle.php?codigo=5752569',
      kind: 'externa',
      status: 'POR_VERIFICAR',
    },
    {
      ref: 'repo:docs/marco/GLOSARIO_OFICIAL.md#semaforo',
      kind: 'repo',
      status: 'VERIFICADO',
      digest: 'sha256:ddd',
      digestMismatch: true,
    },
  ],
  canonicalClaims: [
    {
      claim_id: 'nodo:modulos/tesoreria-estado',
      statement: 'El módulo Tesorería Digital está en estado maqueta.',
    },
    {
      claim_id: 'nodo:hacienda/predial-factor-enero',
      statement:
        'La Ley de Hacienda Municipal aplica un factor de 0.85 al predial anual anticipado en enero.',
    },
  ],
};

function candidate(overrides: Partial<CodeLensCandidate> = {}): CodeLensCandidate {
  return {
    candidate_id: 'cand-001',
    claim:
      'La Ley de Hacienda Municipal del Estado de Nayarit permite revaluar un predio cuando se detecta construcción nueva.',
    evidence_refs: ['repo:docs/marco/BIBLIOTECA_LEGAL.md#hacienda-municipal', 'acta:docs/actas/006'],
    origin: 'human',
    requested_action: 'propose',
    ...overrides,
  };
}

describe('CodeLens v0.1 — compuerta de calidad de Context.OS', () => {
  it('1. evidencia suficiente: aprueba en verde sin exigir revisión adicional', () => {
    const verdict = evaluateCandidate(candidate(), INDEX);

    expect(verdict.verdict).toBe('green');
    expect(verdict.provenance).toBe('pass');
    expect(verdict.reproducibility).toBe('pass');
    expect(verdict.contradictions).toEqual([]);
    expect(verdict.risk_flags).toEqual([]);
    expect(verdict.reason_codes).toContain('QUALITY_GATE_PASSED');
    expect(verdict.required_human_review).toBe(false);
    expect(verdict.evidence_ids[0]).toMatch(/^codelens:[0-9a-f]{64}$/);
  });

  it('2. fuente faltante: sin referencias no hay procedencia y el veredicto es rojo', () => {
    const verdict = evaluateCandidate(candidate({ evidence_refs: [] }), INDEX);

    expect(verdict.verdict).toBe('red');
    expect(verdict.provenance).toBe('missing');
    expect(verdict.reason_codes).toContain('EVIDENCE_REFS_REQUIRED');
    expect(verdict.risk_flags).toContain('NO_PROVENANCE');
    expect(verdict.required_human_review).toBe(true);
  });

  it('2b. referencias que Context.OS no conoce tampoco cuentan como procedencia', () => {
    const verdict = evaluateCandidate(
      candidate({ evidence_refs: ['repo:docs/inventado/QUE_NO_EXISTE.md'] }),
      INDEX,
    );

    expect(verdict.verdict).toBe('red');
    expect(verdict.provenance).toBe('missing');
    expect(verdict.reason_codes).toContain('EVIDENCE_REFS_UNRESOLVED');
  });

  it('3. contradicción detectada: choque de polaridad con el estado canónico', () => {
    const verdict = evaluateCandidate(
      candidate({
        candidate_id: 'cand-003',
        claim: 'El módulo Tesorería Digital no está en estado maqueta.',
        evidence_refs: ['repo:docs/marco/modulos/INDICE.json#tesoreria'],
      }),
      INDEX,
    );

    expect(verdict.contradictions).toHaveLength(1);
    expect(verdict.contradictions[0]).toMatchObject({
      claim_id: 'nodo:modulos/tesoreria-estado',
      type: 'POLARIDAD',
    });
    expect(verdict.verdict).toBe('pending_review');
    expect(verdict.risk_flags).toContain('CONTRADICTS_CANONICAL');
    expect(verdict.required_human_review).toBe(true);
  });

  it('3b. contradicción de cifra sobre el mismo tema', () => {
    const verdict = evaluateCandidate(
      candidate({
        candidate_id: 'cand-003b',
        claim:
          'La Ley de Hacienda Municipal aplica un factor de 0.70 al predial anual anticipado en enero.',
      }),
      INDEX,
    );

    expect(verdict.contradictions.map((item) => item.type)).toContain('CIFRA');
    expect(verdict.verdict).toBe('pending_review');
  });

  it('4. posible dato personal: bloquea en rojo y no repite el dato en la salida', () => {
    const curpSintetica = 'MAAL900101HNTRRS09';
    const verdict = evaluateCandidate(
      candidate({
        candidate_id: 'cand-004',
        claim: `El reporte fue levantado por la persona con CURP ${curpSintetica} en la colonia centro.`,
      }),
      INDEX,
    );

    expect(verdict.verdict).toBe('red');
    expect(verdict.risk_flags).toContain('POSSIBLE_PERSONAL_DATA');
    expect(verdict.reason_codes).toContain('PERSONAL_DATA_SUSPECTED:CURP');
    expect(verdict.required_human_review).toBe(true);
    // El dato sospechoso no puede viajar en el veredicto ni en la evidencia.
    expect(JSON.stringify(verdict)).not.toContain(curpSintetica);
    expect(JSON.stringify(buildEvaluationRecord(candidate(), verdict))).not.toContain(curpSintetica);
  });

  it('4b. también detecta teléfono y correo, sin exponerlos', () => {
    const verdict = evaluateCandidate(
      candidate({
        candidate_id: 'cand-004b',
        claim: 'Contactar al 311 234 5678 o a prueba.sintetica@example.org para dar seguimiento.',
      }),
      INDEX,
    );

    expect(verdict.verdict).toBe('red');
    expect(verdict.reason_codes).toEqual(
      expect.arrayContaining(['PERSONAL_DATA_SUSPECTED:TELEFONO', 'PERSONAL_DATA_SUSPECTED:EMAIL']),
    );
    expect(JSON.stringify(verdict)).not.toContain('3112345678');
    expect(JSON.stringify(verdict)).not.toContain('example.org');
  });

  it('5. intento de promoción sin firma humana: nunca verde, siempre firma requerida', () => {
    const snapshot = JSON.stringify(INDEX);
    const verdict = evaluateCandidate(
      candidate({ candidate_id: 'cand-005', requested_action: 'promote' }),
      INDEX,
    );

    expect(verdict.verdict).toBe('pending_review');
    expect(verdict.verdict).not.toBe('green');
    expect(verdict.reason_codes).toContain('HUMAN_SIGNATURE_REQUIRED');
    expect(verdict.required_human_review).toBe(true);
    // CodeLens no promueve ni muta el estado canónico: la evaluación es pura.
    expect(JSON.stringify(INDEX)).toBe(snapshot);
  });

  it('5b. una promoción con evidencia rota sigue siendo roja, no solo pendiente', () => {
    const verdict = evaluateCandidate(
      candidate({
        candidate_id: 'cand-005b',
        requested_action: 'promote',
        evidence_refs: ['repo:docs/marco/GLOSARIO_OFICIAL.md#semaforo'],
      }),
      INDEX,
    );

    expect(verdict.verdict).toBe('red');
    expect(verdict.reproducibility).toBe('fail');
    expect(verdict.risk_flags).toContain('EVIDENCE_TAMPERED');
    expect(verdict.reason_codes).toContain('HUMAN_SIGNATURE_REQUIRED');
  });

  it('6. resultado reproducible: misma evidencia, mismo veredicto y misma huella', () => {
    const input = candidate({ candidate_id: 'cand-006' });
    const first = evaluateCandidate(input, INDEX);
    const second = evaluateCandidate({ ...input, evidence_refs: [...input.evidence_refs] }, INDEX);

    expect(second).toEqual(first);
    expect(second.evidence_ids).toEqual(first.evidence_ids);

    const distinto = evaluateCandidate(
      { ...input, claim: `${input.claim} Ampliación del alcance para 2027.` },
      INDEX,
    );
    expect(distinto.evidence_ids).not.toEqual(first.evidence_ids);
  });

  it('6b. el registro de evaluación se verifica por checksum y detecta alteración', () => {
    const input = candidate({ candidate_id: 'cand-006b', requested_action: 'promote' });
    const verdict = evaluateCandidate(input, INDEX);
    const record = buildEvaluationRecord(input, verdict);

    expect(record.verdict.verdict).toBe('pending_review');
    expect(record.integrityAssurance).toBe('CHECKSUM_ONLY');
    expect(verifyEvaluationRecord(record)).toBe(true);
    expect(JSON.stringify(record)).not.toContain(input.claim);

    // Alguien intenta convertir un pendiente de firma en un aprobado.
    const alterado = { ...record, verdict: { ...record.verdict, verdict: 'green' as const } };
    expect(verifyEvaluationRecord(alterado)).toBe(false);
  });

  it('un origen de máquina no alcanza verde aunque la evidencia sea impecable', () => {
    const verdict = evaluateCandidate(candidate({ origin: 'agent' }), INDEX);

    expect(verdict.verdict).toBe('yellow');
    expect(verdict.risk_flags).toContain('MACHINE_ORIGIN_UNREVIEWED');
    expect(verdict.required_human_review).toBe(true);
  });

  it('una fuente externa no es replicable en laboratorio: procedencia débil', () => {
    const verdict = evaluateCandidate(
      candidate({ evidence_refs: ['externa:https://www.dof.gob.mx/nota_detalle.php?codigo=5752569'] }),
      INDEX,
    );

    expect(verdict.provenance).toBe('weak');
    expect(verdict.reproducibility).toBe('unknown');
    expect(verdict.reason_codes).toContain('EVIDENCE_STATUS_POR_VERIFICAR');
    expect(verdict.verdict).toBe('yellow');
  });

  it('un candidato malformado se rechaza sin lanzar excepción', () => {
    const verdict = evaluateCandidate(
      { candidate_id: '', claim: '', evidence_refs: null, origin: 'oráculo', requested_action: 'delete' } as unknown as CodeLensCandidate,
      INDEX,
    );

    expect(verdict.verdict).toBe('red');
    expect(verdict.risk_flags).toContain('INVALID_CANDIDATE');
    expect(verdict.reason_codes).toEqual(
      expect.arrayContaining(['CANDIDATE_ID_REQUIRED', 'CLAIM_REQUIRED', 'ORIGIN_INVALID', 'REQUESTED_ACTION_INVALID']),
    );
    expect(verdict.required_human_review).toBe(true);
  });

  it('una afirmación demasiado corta se marca por baja utilidad', () => {
    const verdict = evaluateCandidate(candidate({ claim: 'Sirve.' }), INDEX);

    expect(verdict.risk_flags).toContain('LOW_UTILITY');
    expect(verdict.reason_codes).toContain('CLAIM_TOO_SHORT');
    expect(verdict.verdict).toBe('yellow');
  });
});
