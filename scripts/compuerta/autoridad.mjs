/**
 * Fase D · Authority Boundary Guard.
 *
 * La frontera que este repositorio defiende no es técnica sino institucional:
 * ningún modelo —ORBE, Aura, Gemini, Claude, GPT— autoriza actos de gobierno.
 * El runtime declara `LAB_MOCK` y `authority: NONE`, la política es
 * determinística y el consentimiento es previo. Un cambio puede mover esa
 * frontera; lo que no puede es moverla en silencio.
 *
 * Esta compuerta lee el parche, no el árbol: le importa el movimiento. Quitar
 * `LAB_MOCK` de una línea es un acto; que un archivo nuevo no lo tenga, no.
 * Por eso cada patrón compara cuántas veces se elimina contra cuántas se
 * agrega, y sólo señala el saldo neto.
 *
 * Ningún hallazgo de esta fase se resuelve solo. Con ADR y declaración
 * explícita deja de ser bloqueo y pasa a «escalar»: revisión arquitectónica
 * humana. La compuerta no aprueba ampliaciones de autoridad.
 */

const TOKENS_CUSTODIADOS = [
  {
    id: 'D1',
    token: 'LAB_MOCK',
    ambito: ['contextos/', 'src/', 'scripts/test-orbe-p0-e2e.mts'],
    enunciado: 'el modo de ejecución de laboratorio',
    frontera: 'FR-01',
  },
  {
    id: 'D2',
    token: "authority: 'NONE'",
    ambito: ['contextos/'],
    enunciado: 'la declaración de autoridad nula del runtime',
    frontera: 'FR-02',
  },
  {
    id: 'D3',
    token: 'CHECKSUM_ONLY',
    ambito: ['contextos/', 'src/'],
    enunciado: 'la garantía de integridad declarada de la evidencia',
    frontera: 'FR-03',
  },
];

const PROVEEDORES_DE_MODELO = [
  'GoogleGenAI',
  '@google/genai',
  '@anthropic-ai',
  'openai',
  'OpenAI',
  'generateContent',
];

const RUTAS_SIN_MODELO = [
  'contextos/policyEngine.ts',
  'contextos/consent.ts',
  'contextos/runtime.ts',
  'contextos/adapters/',
  'contextos/evidence.ts',
];

function enAmbito(archivo, ambito) {
  return ambito.some((p) => (p.endsWith('/') ? archivo.startsWith(p) : archivo === p));
}

function contar(lineas, token, ambito) {
  return lineas.filter((l) => enAmbito(l.archivo, ambito) && l.texto.includes(token)).length;
}

export function compuertaDeAutoridad(contexto) {
  const { declaracion, agregadas, eliminadas, existe } = contexto;
  const hallazgos = [];
  const crudos = [];

  const declaraCambioDeAutoridad = declaracion.presente && declaracion.authority_changed === true;
  const adr = declaracion.presente ? declaracion.adr : null;
  const adrValido = Boolean(adr) && (!/\.md$/i.test(String(adr)) || existe(String(adr)));

  const señalar = (id, mensaje, frontera) => crudos.push({ id, mensaje, frontera });

  for (const guardia of TOKENS_CUSTODIADOS) {
    const quitadas = contar(eliminadas, guardia.token, guardia.ambito);
    const puestas = contar(agregadas, guardia.token, guardia.ambito);
    if (quitadas > puestas) {
      señalar(
        guardia.id,
        `El cambio retira ${quitadas - puestas} aparición(es) netas de «${guardia.token}»: toca ${guardia.enunciado}.`,
        guardia.frontera,
      );
    }
  }

  const modoAmpliado = agregadas.filter(
    (l) =>
      enAmbito(l.archivo, ['contextos/', 'src/']) &&
      /executionMode\s*[:=]\s*['"](INSTITUTIONAL|SANDBOX)['"]/.test(l.texto),
  );
  if (modoAmpliado.length) {
    señalar(
      'D4',
      `El cambio introduce un executionMode distinto de LAB_MOCK en ${[...new Set(modoAmpliado.map((l) => l.archivo))].join(', ')}. ` +
        'Salir del laboratorio es una ampliación de autoridad.',
      'FR-01',
    );
  }

  const autoridadOtra = agregadas.filter(
    (l) => enAmbito(l.archivo, ['contextos/']) && /authority\s*[:=]\s*['"](?!NONE)[A-Z_]+['"]/.test(l.texto),
  );
  if (autoridadOtra.length) {
    señalar(
      'D5',
      `El cambio declara una autoridad distinta de NONE en ${[...new Set(autoridadOtra.map((l) => l.archivo))].join(', ')}.`,
      'FR-02',
    );
  }

  const modeloEnPolicy = agregadas.filter(
    (l) => enAmbito(l.archivo, RUTAS_SIN_MODELO) && PROVEEDORES_DE_MODELO.some((p) => l.texto.includes(p)),
  );
  if (modeloEnPolicy.length) {
    señalar(
      'D6',
      `El cambio introduce un proveedor de modelo en ${[...new Set(modeloEnPolicy.map((l) => l.archivo))].join(', ')}. ` +
        'La política, el consentimiento y la evidencia son determinísticos: ningún LLM decide ahí.',
      'FR-08',
    );
  }

  const adapterFuera = agregadas.filter(
    (l) =>
      (l.archivo.startsWith('src/') || l.archivo === 'server.ts') &&
      /from\s+['"][^'"]*contextos\/adapters/.test(l.texto),
  );
  if (adapterFuera.length) {
    señalar(
      'D7',
      `El cambio importa un adapter directamente desde ${[...new Set(adapterFuera.map((l) => l.archivo))].join(', ')}. ` +
        'Los adapters sólo se ejecutan a través del runtime de Context.OS, que es quien aplica policy y consentimiento.',
      'FR-01',
    );
  }

  const firmaInsinuada = agregadas.filter(
    (l) =>
      enAmbito(l.archivo, ['contextos/evidence.ts']) &&
      /(firma\s+digital|signature|inmutab|no\s+repudio|non-repudiation)/i.test(l.texto),
  );
  if (firmaInsinuada.length) {
    señalar(
      'D8',
      'El cambio insinúa firma digital o inmutabilidad en el emisor de evidencia. La garantía declarada es ' +
        'CHECKSUM_ONLY: un checksum prueba integridad de contenido, no autoría ni inmutabilidad.',
      'FR-03',
    );
  }

  for (const bruto of crudos) {
    if (!declaraCambioDeAutoridad) {
      hallazgos.push({
        id: bruto.id,
        nivel: 'error',
        mensaje:
          `${bruto.mensaje} La declaración no dice «authority_changed: true». ` +
          `Frontera ${bruto.frontera} en docs/marco/fronteras-arquitectura.json.`,
      });
    } else if (!adrValido) {
      hallazgos.push({
        id: bruto.id,
        nivel: 'error',
        mensaje:
          `${bruto.mensaje} Declara authority_changed pero «adr» ${adr ? `apunta a «${adr}», que no existe` : 'está vacío'}. ` +
          'Toda ampliación de autoridad exige un ADR escrito y fusionado.',
      });
    } else {
      hallazgos.push({
        id: bruto.id,
        nivel: 'escalar',
        mensaje:
          `${bruto.mensaje} Declarado con ${adr}: la compuerta no aprueba ampliaciones de autoridad, ` +
          'escala a revisión arquitectónica humana.',
      });
    }
  }

  if (declaraCambioDeAutoridad && !crudos.length) {
    hallazgos.push({
      id: 'D9',
      nivel: 'escalar',
      mensaje:
        'La declaración dice «authority_changed: true» aunque el parche no toca ninguna frontera custodiada. ' +
        'Se escala igual: quien lo declara sabe algo que el patrón no ve.',
    });
  }

  if (declaraCambioDeAutoridad && declaracion.institutional_effects !== false && declaracion.institutional_effects !== true) {
    hallazgos.push({
      id: 'D10',
      nivel: 'error',
      mensaje: 'Con «authority_changed: true» hay que declarar también «institutional_effects: true|false».',
    });
  }

  return {
    hallazgos,
    fronteras_tocadas: [...new Set(crudos.map((c) => c.frontera))],
    escala: hallazgos.some((h) => h.nivel === 'escalar'),
  };
}
