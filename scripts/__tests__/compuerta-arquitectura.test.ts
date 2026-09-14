import { describe, expect, it } from 'vitest';

import { leerDeclaracion, parsearDeclaracion, comoLista } from '../compuerta/declaracion.mjs';
import { compuertaDeImpacto } from '../compuerta/impacto.mjs';
import { compuertaDeEvidencia } from '../compuerta/evidencia.mjs';
import { compuertaDeAutoridad } from '../compuerta/autoridad.mjs';
import { compuertaDeDeriva } from '../compuerta/deriva.mjs';
import { construirRecibo } from '../compuerta/recibo.mjs';

// Pruebas de la compuerta de arquitectura (Issue #68, fases B–E).
//
// Se ejercitan las cuatro fases como funciones puras, con parches sintéticos:
// la compuerta debe poder demostrarse sin depender del estado de git ni de una
// PR real. El criterio de cierre de #68 exige que una PR que toque un contrato
// falle si omite el impacto, si declara E3 sin prueba reproducible y si intenta
// ampliar autoridad sin ADR; cada uno de esos tres casos tiene su prueba aquí.

const ids = (resultado: { hallazgos: { id: string; nivel: string }[] }) =>
  resultado.hallazgos.filter((h) => h.nivel === 'error').map((h) => h.id);

const escalamientos = (resultado: { hallazgos: { id: string; nivel: string }[] }) =>
  resultado.hallazgos.filter((h) => h.nivel === 'escalar').map((h) => h.id);

const cuerpoCon = (bloque: string) => `Texto de la PR.\n\n\`\`\`arquitectura\n${bloque}\n\`\`\`\n\nMás texto.`;

const DECLARACION_MINIMA = [
  'component: Context.OS',
  'impact: CONTRACT_CHANGE',
  'evidence_level: E2_CODE_INSPECTED',
  'maturity: EXPERIMENTAL',
  'semaforo: AMARILLO',
  'authority_changed: false',
  'verified_at_commit: abc1234',
  'evidence:',
  '  ruta: contextos/contracts.ts',
].join('\n');

const entorno = {
  existe: (ruta: string) => !ruta.includes('inexistente'),
  leerArchivo: (ruta: string) => (ruta === 'package.json' ? '{"scripts":{"test:orbe-contextos":"vitest run"}}' : ''),
  resolverCommit: () => true,
};

describe('declaración de impacto', () => {
  it('extrae y parsea el bloque del cuerpo de la PR', () => {
    const d = leerDeclaracion(cuerpoCon(DECLARACION_MINIMA));
    expect(d.presente).toBe(true);
    expect(d.errores).toEqual([]);
    expect(d.componente).toBe('Context.OS');
    expect(d.impactos).toEqual(['CONTRACT_CHANGE']);
    expect(d.authority_changed).toBe(false);
    expect(d.evidencia.ruta).toBe('contextos/contracts.ts');
  });

  it('acepta varios impactos en una línea y listas sangradas', () => {
    const d = leerDeclaracion(
      cuerpoCon(['impact: CONTRACT_CHANGE, EVIDENCE_CHANGE', 'open_gaps:', '  - jurisdiccion', '  - procedencia'].join('\n')),
    );
    expect(d.impactos).toEqual(['CONTRACT_CHANGE', 'EVIDENCE_CHANGE']);
    expect(d.open_gaps).toEqual(['jurisdiccion', 'procedencia']);
  });

  it('no inventa una declaración cuando no hay bloque', () => {
    expect(leerDeclaracion('PR sin bloque').presente).toBe(false);
  });

  it('reporta las líneas que el formato no entiende en vez de adivinarlas', () => {
    const { errores } = parsearDeclaracion('component Context.OS\nimpact: NO_ARCH_IMPACT');
    expect(errores).toHaveLength(1);
    expect(errores[0]).toContain('clave: valor');
  });

  it('normaliza booleanos escritos en español', () => {
    expect(leerDeclaracion(cuerpoCon('authority_changed: sí')).authority_changed).toBe(true);
    expect(leerDeclaracion(cuerpoCon('authority_changed: no')).authority_changed).toBe(false);
    expect(comoLista('A, B ,C')).toEqual(['A', 'B', 'C']);
  });
});

describe('fase B · compuerta de impacto', () => {
  it('bloquea una PR que toca la arquitectura sin declarar impacto', () => {
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion('PR sin bloque'),
      archivos: [{ estado: 'M', ruta: 'contextos/runtime.ts' }],
      ...entorno,
    });
    expect(ids(resultado)).toContain('B1');
    expect(resultado.exigida).toBe(true);
  });

  it('deja pasar un cambio ajeno a la arquitectura sin declaración', () => {
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion('PR sin bloque'),
      archivos: [{ estado: 'M', ruta: 'README.md' }],
      ...entorno,
    });
    expect(resultado.hallazgos).toEqual([]);
    expect(resultado.exigida).toBe(false);
  });

  it('acepta una declaración completa sobre un contrato', () => {
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      archivos: [{ estado: 'M', ruta: 'contextos/contracts.ts' }],
      ...entorno,
    });
    expect(ids(resultado)).toEqual([]);
  });

  it('bloquea cuando se cambia un contrato sin declarar CONTRACT_CHANGE', () => {
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA.replace('CONTRACT_CHANGE', 'INTEGRATION_CHANGE'))),
      archivos: [{ estado: 'M', ruta: 'shared/semantic/contracts/publicWorksReport.ts' }],
      ...entorno,
    });
    expect(ids(resultado)).toContain('B13');
  });

  it('bloquea NO_ARCH_IMPACT declarado sobre un cambio de contrato', () => {
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion(
        cuerpoCon(
          ['component: Context.OS', 'impact: NO_ARCH_IMPACT', 'evidence_level: E1_DOCUMENTED', 'semaforo: GRIS'].join('\n'),
        ),
      ),
      archivos: [{ estado: 'M', ruta: 'contextos/contracts.ts' }],
      ...entorno,
    });
    expect(ids(resultado)).toContain('B12');
  });

  it('exige authority_changed explícito: omitirlo no es «false»', () => {
    const sinAutoridad = DECLARACION_MINIMA.split('\n')
      .filter((l) => !l.startsWith('authority_changed'))
      .join('\n');
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion(cuerpoCon(sinAutoridad)),
      archivos: [{ estado: 'M', ruta: 'contextos/contracts.ts' }],
      ...entorno,
    });
    expect(ids(resultado)).toContain('B10');
  });

  it('exige ARCHITECTURE_CHANGE al tocar la propia compuerta o sus fronteras', () => {
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      archivos: [{ estado: 'M', ruta: 'docs/marco/fronteras-arquitectura.json' }],
      ...entorno,
    });
    expect(ids(resultado)).toContain('B17');
  });

  it('rechaza vocabulario inventado', () => {
    const resultado = compuertaDeImpacto({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA.replace('CONTRACT_CHANGE', 'ALGO_NUEVO'))),
      archivos: [{ estado: 'M', ruta: 'contextos/runtime.ts' }],
      ...entorno,
    });
    expect(ids(resultado)).toContain('B4');
  });
});

describe('fase C · compuerta de evidencia', () => {
  const declararE3 = (extra: string[] = []) =>
    leerDeclaracion(
      cuerpoCon(
        [
          'component: Context.OS',
          'impact: CONTRACT_CHANGE',
          'evidence_level: E3_REPRODUCIBLE_EXECUTION',
          'maturity: EXPERIMENTAL',
          'semaforo: AMARILLO',
          'authority_changed: false',
          'verified_at_commit: abc1234',
          'evidence:',
          '  ruta: contextos/contracts.ts',
          ...extra,
        ].join('\n'),
      ),
    );

  it('bloquea E3 sin comando reproducible', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: declararE3(),
      cuerpo: 'El runtime quedó validado.',
      titulo: '',
      ...entorno,
    });
    expect(ids(resultado)).toContain('C4');
  });

  it('bloquea E3 con comando pero sin resultado ni artefacto', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: declararE3(['  comando: npm run test:orbe-contextos']),
      cuerpo: '',
      titulo: '',
      ...entorno,
    });
    expect(ids(resultado)).toContain('C5');
  });

  it('bloquea E3 cuyo comando invoca un script que no existe', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: declararE3(['  comando: npm run test:inexistente', '  resultado: 45/45']),
      cuerpo: '',
      titulo: '',
      ...entorno,
    });
    expect(ids(resultado)).toContain('C4');
  });

  it('acepta E3 con comando, resultado y ruta verificada', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: declararE3(['  comando: npm run test:orbe-contextos', '  resultado: 45/45']),
      cuerpo: 'Queda validado.',
      titulo: '',
      ...entorno,
    });
    expect(ids(resultado)).toEqual([]);
  });

  it('detecta la afirmación aunque esté en el título y no en el cuerpo', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: leerDeclaracion(
        cuerpoCon(['component: ORBE', 'impact: NO_ARCH_IMPACT', 'evidence_level: E0_DECLARED', 'semaforo: GRIS'].join('\n')),
      ),
      cuerpo: '',
      titulo: 'ORBE P0 resuelto',
      ...entorno,
    });
    expect(ids(resultado)).toContain('C1');
  });

  it('no confunde las palabras del propio bloque con afirmaciones', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: leerDeclaracion(
        cuerpoCon(['component: ORBE', 'impact: NO_ARCH_IMPACT', 'evidence_level: E0_DECLARED', 'semaforo: GRIS'].join('\n')),
      ),
      cuerpo: cuerpoCon('semaforo: GRIS\nnota: probado'),
      titulo: 'Cambio menor',
      ...entorno,
    });
    expect(ids(resultado)).not.toContain('C1');
  });

  it('bloquea semáforo VERDE sostenido sólo en documentación', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: leerDeclaracion(
        cuerpoCon(
          [
            'component: ORBE',
            'impact: NO_ARCH_IMPACT',
            'evidence_level: E1_DOCUMENTED',
            'semaforo: VERDE',
            'evidence:',
            '  documento: docs/marco/ESTADO.md',
          ].join('\n'),
        ),
      ),
      cuerpo: '',
      titulo: '',
      ...entorno,
    });
    expect(ids(resultado)).toContain('C8');
  });

  it('escala E5 en vez de aprobarlo: la operación institucional no se verifica desde un clon', () => {
    const resultado = compuertaDeEvidencia({
      declaracion: leerDeclaracion(
        cuerpoCon(
          [
            'component: Context.OS',
            'impact: AUTHORITY_CHANGE',
            'evidence_level: E5_INSTITUTIONAL_OPERATION_VERIFIED',
            'maturity: INSTITUTIONAL',
            'semaforo: VERDE',
            'authority_changed: true',
            'verified_at_commit: abc1234',
            'evidence:',
            '  ruta: contextos/runtime.ts',
            '  comando: npm run test:orbe-contextos',
            '  resultado: 45/45',
            '  url: https://ejemplo.gob.mx',
            '  autoridad: Ayuntamiento de Tepic',
            '  responsable: Dirección de Gobierno Digital',
          ].join('\n'),
        ),
      ),
      cuerpo: '',
      titulo: '',
      ...entorno,
    });
    expect(escalamientos(resultado)).toContain('C7');
    expect(resultado.requiere_revision_humana).toBe(true);
  });
});

describe('fase D · guardia de la frontera de autoridad', () => {
  const quitarLabMock = [{ archivo: 'contextos/adapters/publicWorksReportAdapter.ts', texto: "  if (mode !== 'LAB_MOCK') {" }];

  it('bloquea el retiro neto de LAB_MOCK sin declararlo', () => {
    const resultado = compuertaDeAutoridad({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      agregadas: [],
      eliminadas: quitarLabMock,
      ...entorno,
    });
    expect(ids(resultado)).toContain('D1');
  });

  it('no señala un movimiento que conserva el literal', () => {
    const resultado = compuertaDeAutoridad({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      agregadas: quitarLabMock,
      eliminadas: quitarLabMock,
      ...entorno,
    });
    expect(ids(resultado)).toEqual([]);
  });

  it('sigue bloqueando si se declara authority_changed sin ADR', () => {
    const resultado = compuertaDeAutoridad({
      declaracion: leerDeclaracion(
        cuerpoCon(DECLARACION_MINIMA.replace('authority_changed: false', 'authority_changed: true')),
      ),
      agregadas: [],
      eliminadas: quitarLabMock,
      ...entorno,
    });
    expect(ids(resultado)).toContain('D1');
  });

  it('escala —no aprueba— cuando hay ADR y declaración completas', () => {
    const resultado = compuertaDeAutoridad({
      declaracion: leerDeclaracion(
        cuerpoCon(
          [
            DECLARACION_MINIMA.replace('authority_changed: false', 'authority_changed: true'),
            'institutional_effects: false',
            'adr: docs/marco/adr/ADR-0002-ejemplo.md',
          ].join('\n'),
        ),
      ),
      agregadas: [],
      eliminadas: quitarLabMock,
      ...entorno,
    });
    expect(ids(resultado)).toEqual([]);
    expect(escalamientos(resultado)).toContain('D1');
    expect(resultado.escala).toBe(true);
  });

  it('bloquea un proveedor de modelo dentro del motor de política', () => {
    const resultado = compuertaDeAutoridad({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      agregadas: [{ archivo: 'contextos/policyEngine.ts', texto: "import { GoogleGenAI } from '@google/genai';" }],
      eliminadas: [],
      ...entorno,
    });
    expect(ids(resultado)).toContain('D6');
  });

  it('bloquea la ejecución de un adapter fuera de Context.OS', () => {
    const resultado = compuertaDeAutoridad({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      agregadas: [
        { archivo: 'src/services/algo.ts', texto: "import { createPublicWorksReportAdapter } from '../../contextos/adapters/publicWorksReportAdapter';" },
      ],
      eliminadas: [],
      ...entorno,
    });
    expect(ids(resultado)).toContain('D7');
  });

  it('bloquea insinuar firma digital en el emisor de evidencia', () => {
    const resultado = compuertaDeAutoridad({
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      agregadas: [{ archivo: 'contextos/evidence.ts', texto: '// la evidencia queda inmutable y con firma digital' }],
      eliminadas: [],
      ...entorno,
    });
    expect(ids(resultado)).toContain('D8');
  });
});

describe('fase E · detector de deriva del canon', () => {
  const fronteras = {
    componentes_validos: ['Context.OS'],
    fronteras: [
      {
        id: 'FR-99',
        componente: 'Context.OS',
        enunciado: 'La evidencia declara CHECKSUM_ONLY.',
        codigo: [{ archivo: 'contextos/evidence.ts', debe_contener: "integrityAssurance: 'CHECKSUM_ONLY'" }],
        canon: [{ archivo: 'docs/canon.md', debe_mencionar: 'CHECKSUM_ONLY' }],
        impacto_si_cambia: ['EVIDENCE_CHANGE'],
        adr_requerido: true,
      },
    ],
  };

  const conCanonSano = {
    existe: () => true,
    resolverCommit: () => true,
    leerArchivo: (ruta: string) =>
      ruta === 'contextos/evidence.ts'
        ? "  integrityAssurance: 'CHECKSUM_ONLY' as const,"
        : ruta === 'docs/canon.md'
          ? 'La garantía es CHECKSUM_ONLY.'
          : '',
  };

  it('marca en rojo cuando el código ya no sostiene lo que el canon afirma', () => {
    const resultado = compuertaDeDeriva({
      fronteras,
      declaracion: leerDeclaracion('sin bloque'),
      archivos: [],
      agregadas: [],
      eliminadas: [],
      ...conCanonSano,
      leerArchivo: (ruta: string) => (ruta === 'docs/canon.md' ? 'CHECKSUM_ONLY' : '// sin garantía declarada'),
    });
    expect(ids(resultado)).toContain('FR-99');
    expect(resultado.hallazgos[0].mensaje).toContain('ROJO');
  });

  it('marca deriva cuando el canon deja de enunciar una frontera viva', () => {
    const resultado = compuertaDeDeriva({
      fronteras,
      declaracion: leerDeclaracion('sin bloque'),
      archivos: [],
      agregadas: [],
      eliminadas: [],
      ...conCanonSano,
      leerArchivo: (ruta: string) =>
        ruta === 'contextos/evidence.ts' ? "integrityAssurance: 'CHECKSUM_ONLY' as const," : 'documento sin la frontera',
    });
    expect(ids(resultado)).toContain('FR-99');
  });

  it('no encuentra deriva cuando código y canon coinciden', () => {
    const resultado = compuertaDeDeriva({
      fronteras,
      declaracion: leerDeclaracion('sin bloque'),
      archivos: [],
      agregadas: [],
      eliminadas: [],
      ...conCanonSano,
    });
    expect(ids(resultado)).toEqual([]);
  });

  it('bloquea mover la frontera en el código sin tocar el canon ni declarar ADR', () => {
    const resultado = compuertaDeDeriva({
      fronteras,
      declaracion: leerDeclaracion(
        cuerpoCon(
          [
            'component: Context.OS',
            'impact: EVIDENCE_CHANGE',
            'evidence_level: E2_CODE_INSPECTED',
            'maturity: EXPERIMENTAL',
            'semaforo: AMARILLO',
            'authority_changed: false',
          ].join('\n'),
        ),
      ),
      archivos: [
        { estado: 'M', ruta: 'contextos/evidence.ts' },
        { estado: 'M', ruta: 'docs/marco/estado.json' },
      ],
      agregadas: [{ archivo: 'contextos/evidence.ts', texto: "  integrityAssurance: 'CHECKSUM_ONLY' as const," }],
      eliminadas: [],
      ...conCanonSano,
    });
    expect(ids(resultado)).toContain('FR-99');
    expect(resultado.fronteras_movidas).toEqual(['FR-99']);
  });

  it('exige que el MASTER_STATE se mueva con un cambio de contrato', () => {
    const resultado = compuertaDeDeriva({
      fronteras,
      declaracion: leerDeclaracion(cuerpoCon(DECLARACION_MINIMA)),
      archivos: [{ estado: 'M', ruta: 'contextos/contracts.ts' }],
      agregadas: [],
      eliminadas: [],
      ...conCanonSano,
    });
    expect(ids(resultado)).toContain('E8');
  });
});

describe('recibo de arquitectura', () => {
  it('registra lo declarado y nunca eleva el nivel de evidencia', () => {
    const declaracion = leerDeclaracion(cuerpoCon(DECLARACION_MINIMA));
    const recibo = construirRecibo({
      declaracion,
      resultados: [{ hallazgos: [{ id: 'B1', nivel: 'error', mensaje: 'falta algo' }] }],
      base: 'origin/main',
      cabeza: 'abc1234',
      pr: '68',
      veredicto: 'BLOQUEADO',
      fecha: Date.parse('2026-09-14T00:00:00Z'),
    });
    expect(recibo.change_id).toBe('ARCH-2026-PR68');
    expect(recibo.evidence_level).toBe('E2_CODE_INSPECTED');
    expect(recibo.evidence_level_elevado_por_la_compuerta).toBe(false);
    expect(recibo.veredicto).toBe('BLOQUEADO');
    expect(recibo.bloqueos).toHaveLength(1);
  });

  it('sin declaración, el recibo queda en GRIS y E0, no en blanco', () => {
    const recibo = construirRecibo({
      declaracion: leerDeclaracion('sin bloque'),
      resultados: [],
      base: 'origin/main',
      cabeza: 'abc1234',
      pr: null,
      veredicto: 'PASA',
      fecha: Date.parse('2026-09-14T00:00:00Z'),
    });
    expect(recibo.semaforo).toBe('GRIS');
    expect(recibo.evidence_level).toBe('E0_DECLARED');
    expect(recibo.change_id).toBe('ARCH-2026-LOCAL');
  });
});
