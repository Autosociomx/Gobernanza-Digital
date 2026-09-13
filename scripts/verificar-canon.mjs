#!/usr/bin/env node
/**
 * Verificador del canon del ORBE — Nayarit Digital / ConnectX
 *
 * El canon (`data/canon/`) es la fuente canónica de trámites y servicios que
 * el ORBE puede explicar, orientar o iniciar. Es jurisdiccionalmente neutro:
 * un trámite se declara contra una jurisdicción (federal / estatal / municipal),
 * nunca contra "el municipio" por omisión.
 *
 * Este script existe por un incidente real y documentado: `data/municipality/tepic/
 * services.json` vivió meses como "catálogo" sin que una sola línea de código lo
 * leyera, y sin que nada impidiera que su contenido contradijera al código. Una
 * fuente canónica que nadie verifica no es canónica: es un PDF con llaves.
 *
 * Verifica, en este orden:
 *   C1 · Forma  — los tres registros cumplen data/canon/schema/canon.schema.json.
 *   C2 · Jerarquía — jurisdicciones coherentes (federal → estatal → municipal).
 *   C3 · Integridad referencial — toda fuente y jurisdicción citada existe.
 *   C4 · Semáforo — el estatus del trámite nunca es más fuerte que su dato más débil.
 *   C5 · Acciones — vocabulario cerrado; permitidas y restringidas nunca se cruzan.
 *   C6 · Canon ↔ código — los ids de contrato semántico y servicio Context.OS que
 *        el canon declara existen en el código, y todo contrato semántico ACTIVE
 *        del código está declarado en el canon.
 *   C7 · Destinos reales — `superficie` solo apunta a vistas y pestañas que existen.
 *   C8 · Sin datos personales — ni CURP, ni teléfono, ni correo en el catálogo.
 *
 * Uso:  node scripts/verificar-canon.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const errores = [];
const raiz = 'data/canon';
const fallo = (regla, mensaje) => errores.push(`[${regla}] ${mensaje}`);

function leerJson(ruta) {
  if (!existsSync(ruta)) {
    fallo('C1', `Falta ${ruta}. El canon es obligatorio: sin él el ORBE no tiene fuente de verdad.`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(ruta, 'utf-8'));
  } catch (e) {
    fallo('C1', `${ruta} no es JSON válido: ${e.message}`);
    return null;
  }
}

const esquema = leerJson(`${raiz}/schema/canon.schema.json`);
const jurisdicciones = leerJson(`${raiz}/jurisdicciones.json`);
const fuentes = leerJson(`${raiz}/fuentes.json`);
const tramites = leerJson(`${raiz}/tramites.json`);

if (!esquema || !jurisdicciones || !fuentes || !tramites) {
  reportar();
}

// ── C1 · Validación de forma contra el esquema publicado ────────────────────
// Subconjunto de JSON Schema suficiente para este contrato. El esquema es el
// contrato publicado (estándar abierto) y también la regla que se ejecuta: así
// no puede desviarse del validador.
function resolver(ref) {
  if (!ref.startsWith('#/')) throw new Error(`Referencia no local: ${ref}`);
  return ref.slice(2).split('/').reduce((nodo, clave) => nodo?.[clave], esquema);
}

function validarForma(valor, def, ruta) {
  if (def.$ref) return validarForma(valor, resolver(def.$ref), ruta);

  if (def.const !== undefined && valor !== def.const) {
    fallo('C1', `${ruta}: se esperaba "${def.const}" y llegó ${JSON.stringify(valor)}.`);
    return;
  }
  if (def.enum && !def.enum.includes(valor)) {
    fallo('C1', `${ruta}: "${valor}" no está en el vocabulario ${JSON.stringify(def.enum)}.`);
    return;
  }
  if (def.type) {
    const tipos = Array.isArray(def.type) ? def.type : [def.type];
    const tipoReal =
      valor === null ? 'null' : Array.isArray(valor) ? 'array' : typeof valor;
    const equivalente = tipoReal === 'number' && Number.isInteger(valor) ? ['number', 'integer'] : [tipoReal];
    if (!tipos.some((t) => equivalente.includes(t))) {
      fallo('C1', `${ruta}: se esperaba ${tipos.join('|')} y llegó ${tipoReal}.`);
      return;
    }
  }
  if (typeof valor === 'string') {
    if (def.minLength !== undefined && valor.length < def.minLength) {
      fallo('C1', `${ruta}: cadena vacía o demasiado corta.`);
    }
    if (def.pattern && !new RegExp(def.pattern).test(valor)) {
      fallo('C1', `${ruta}: "${valor}" no cumple el patrón ${def.pattern}.`);
    }
  }
  if (Array.isArray(valor)) {
    if (def.minItems !== undefined && valor.length < def.minItems) {
      fallo('C1', `${ruta}: se requieren al menos ${def.minItems} elemento(s).`);
    }
    if (def.items) valor.forEach((item, i) => validarForma(item, def.items, `${ruta}[${i}]`));
    return;
  }
  if (valor && typeof valor === 'object') {
    for (const requerido of def.required ?? []) {
      if (!(requerido in valor)) fallo('C1', `${ruta}: falta el campo obligatorio "${requerido}".`);
    }
    if (def.additionalProperties === false && def.properties) {
      for (const clave of Object.keys(valor)) {
        if (!(clave in def.properties)) {
          fallo('C1', `${ruta}: campo no declarado en el esquema: "${clave}".`);
        }
      }
    }
    for (const [clave, subdef] of Object.entries(def.properties ?? {})) {
      if (clave in valor) validarForma(valor[clave], subdef, `${ruta}.${clave}`);
    }
  }
}

validarForma(jurisdicciones, resolver('#/definitions/RegistroJurisdicciones'), 'jurisdicciones.json');
validarForma(fuentes, resolver('#/definitions/RegistroFuentes'), 'fuentes.json');
validarForma(tramites, resolver('#/definitions/RegistroTramites'), 'tramites.json');

// ── C2 · Jerarquía de jurisdicciones ────────────────────────────────────────
const porJurisdiccion = new Map();
for (const j of jurisdicciones.jurisdicciones) {
  if (porJurisdiccion.has(j.id)) fallo('C2', `Jurisdicción duplicada: ${j.id}.`);
  porJurisdiccion.set(j.id, j);
}
const nivelPadreEsperado = { federal: null, estatal: 'federal', municipal: 'estatal' };
for (const j of porJurisdiccion.values()) {
  const esperado = nivelPadreEsperado[j.nivel];
  if (esperado === null) {
    if (j.padre !== null) fallo('C2', `${j.id} es federal y no puede tener padre.`);
    continue;
  }
  const padre = j.padre ? porJurisdiccion.get(j.padre) : undefined;
  if (!padre) {
    fallo('C2', `${j.id} (${j.nivel}) declara el padre "${j.padre}", que no existe en el registro.`);
  } else if (padre.nivel !== esperado) {
    fallo('C2', `${j.id} es ${j.nivel}: su padre debe ser ${esperado} y "${padre.id}" es ${padre.nivel}.`);
  } else if (!j.codigo_contextos.startsWith(`${padre.codigo_contextos}-`)) {
    fallo(
      'C2',
      `${j.id}: codigo_contextos "${j.codigo_contextos}" no extiende al de su padre ` +
      `("${padre.codigo_contextos}"). contextos/serviceCatalog.ts arma el código por jerarquía.`,
    );
  }
}

// ── C3 · Integridad referencial ─────────────────────────────────────────────
const porFuente = new Map();
for (const f of fuentes.fuentes) {
  if (porFuente.has(f.id)) fallo('C3', `Fuente duplicada: ${f.id}.`);
  porFuente.set(f.id, f);
  if (f.estatus === 'por_verificar' && !f.nota_conflicto) {
    fallo(
      'C3',
      `La fuente "${f.id}" está por_verificar sin nota_conflicto. El Glosario Oficial exige decir ` +
      'por qué no está cerrada; lo POR VERIFICAR no se afirma en público.',
    );
  }
}

// ── Reglas por trámite (C3 a C8) ────────────────────────────────────────────
const ORDEN_ESTATUS = { propuesto: 0, demo: 1, por_verificar: 2, verificado: 3 };
const ESTATUS_DE_FUENTE = { vigente: 'verificado', por_verificar: 'por_verificar', historico: 'por_verificar' };
const accionesValidas = new Set(tramites.acciones_permitidas_validas);

const codigoServicios = existsSync('contextos/serviceCatalog.ts')
  ? readFileSync('contextos/serviceCatalog.ts', 'utf-8')
  : '';
const dirContratos = 'shared/semantic/contracts';
const codigoContratos = existsSync(dirContratos)
  ? readdirSync(dirContratos)
      .filter((f) => f.endsWith('.ts'))
      .map((f) => readFileSync(`${dirContratos}/${f}`, 'utf-8'))
      .join('\n')
  : '';

const app = existsSync('src/App.tsx') ? readFileSync('src/App.tsx', 'utf-8') : '';
const citizen = existsSync('src/components/CitizenApp.tsx')
  ? readFileSync('src/components/CitizenApp.tsx', 'utf-8')
  : '';
const vistasValidas = new Set(
  (app.match(/const VALID_VIEWS = \[([^\]]+)\]/)?.[1] ?? '')
    .split(',')
    .map((v) => v.trim().replace(/['"]/g, ''))
    .filter(Boolean),
);
const pestanasValidas = new Set(
  (citizen.match(/type TabType =([^;]+);/)?.[1] ?? '')
    .split('|')
    .map((v) => v.trim().replace(/['"]/g, ''))
    .filter(Boolean),
);

const CURP = /\b[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d\b/;
const TELEFONO = /\b(?:\+52\s?)?(?:\d{3}[\s-]?\d{3}[\s-]?\d{4}|\d{10})\b/;
const CORREO = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/;

const idsTramite = new Set();
const contratosDeclarados = new Set();

for (const t of tramites.tramites) {
  const donde = `trámite "${t.id}"`;

  if (idsTramite.has(t.id)) fallo('C3', `Trámite duplicado: ${t.id}.`);
  idsTramite.add(t.id);

  // C3 · jurisdicción y prefijo del id
  const jur = porJurisdiccion.get(t.jurisdiccion);
  if (!jur) {
    fallo('C3', `${donde} declara la jurisdicción "${t.jurisdiccion}", que no existe en el registro.`);
  } else if (t.id !== t.jurisdiccion && !t.id.startsWith(`${t.jurisdiccion}.`)) {
    fallo(
      'C3',
      `${donde}: el id debe empezar con su jurisdicción ("${t.jurisdiccion}."). Un id que miente sobre ` +
      'la competencia es exactamente la confusión que este canon existe para evitar.',
    );
  }

  // C3 · fundamento
  for (const f of t.fundamento) {
    if (!porFuente.has(f.fuente)) {
      fallo('C3', `${donde} cita la fuente "${f.fuente}", que no está en fuentes.json.`);
    }
  }
  if (t.fundamento.length === 0 && t.estatus !== 'propuesto') {
    fallo(
      'C3',
      `${donde} no tiene fundamento y su estatus es "${t.estatus}". Solo un trámite "propuesto" ` +
      'puede no tener fundamento todavía.',
    );
  }

  // C4 · semáforo: el trámite no puede ser más fuerte que su dato más débil
  const estatusDatos = ['dependencia', 'costo', 'plazo', 'canal_oficial'].map((c) => t[c]?.estatus);
  const estatusFundamento = t.fundamento
    .map((f) => porFuente.get(f.fuente)?.estatus)
    .filter(Boolean)
    .map((e) => ESTATUS_DE_FUENTE[e]);
  const candidatos = [...estatusDatos, ...estatusFundamento].filter((e) => e in ORDEN_ESTATUS);
  if (candidatos.length) {
    const masDebil = candidatos.reduce((a, b) => (ORDEN_ESTATUS[a] <= ORDEN_ESTATUS[b] ? a : b));
    if (t.estatus !== masDebil) {
      fallo(
        'C4',
        `${donde} se declara "${t.estatus}" pero su dato más débil es "${masDebil}". ` +
        'Regla del semáforo: ninguna cifra ni afirmación puede presentarse mejor respaldada de lo que está.',
      );
    }
  }

  // C5 · acciones
  for (const accion of t.orbe.acciones_permitidas) {
    if (!accionesValidas.has(accion)) {
      fallo('C5', `${donde} permite la acción "${accion}", que no está en acciones_permitidas_validas.`);
    }
  }
  const cruce = t.orbe.acciones_permitidas.filter((a) => t.orbe.acciones_restringidas.includes(a));
  if (cruce.length) {
    fallo('C5', `${donde}: la acción "${cruce[0]}" está a la vez permitida y restringida.`);
  }
  if (t.orbe.acciones_restringidas.length === 0) {
    fallo(
      'C5',
      `${donde} no declara ninguna acción restringida. Todo trámite tiene un límite que el ORBE no cruza; ` +
      'omitirlo es la puerta por la que un asistente termina "autorizando".',
    );
  }

  // C6 · el canon no puede prometer capacidades que el código no tiene
  if (t.orbe.servicio_contextos) {
    if (!codigoServicios.includes(`'${t.orbe.servicio_contextos}'`)) {
      fallo(
        'C6',
        `${donde} declara el servicio Context.OS "${t.orbe.servicio_contextos}", que no existe en ` +
        'contextos/serviceCatalog.ts. El canon no promete ejecución que el runtime no registra.',
      );
    }
  }
  if (t.orbe.contrato_semantico) {
    contratosDeclarados.add(t.orbe.contrato_semantico);
    if (!codigoContratos.includes(`'${t.orbe.contrato_semantico}'`)) {
      fallo(
        'C6',
        `${donde} declara el contrato semántico "${t.orbe.contrato_semantico}", que no existe en ` +
        `${dirContratos}/.`,
      );
    }
  }
  if (t.orbe.servicio_contextos && !t.orbe.contrato_semantico) {
    fallo(
      'C6',
      `${donde} tiene servicio Context.OS sin contrato semántico. Context.OS exige binding semántico ` +
      '(SEMANTIC_CONTRACT_REQUIRED en contextos/policyEngine.ts).',
    );
  }

  // C7 · superficie: nunca un destino inventado
  if (t.orbe.superficie !== null) {
    const params = new URLSearchParams(t.orbe.superficie.replace(/^\?/, ''));
    const vista = params.get('view');
    const pestana = params.get('tab');
    if (!t.orbe.superficie.startsWith('?')) {
      fallo('C7', `${donde}: superficie debe ser un enlace profundo relativo que empiece con "?".`);
    }
    if (!vista || (vistasValidas.size && !vistasValidas.has(vista))) {
      fallo('C7', `${donde}: la vista "${vista}" no existe en src/App.tsx (VALID_VIEWS).`);
    }
    if (pestana && pestanasValidas.size && !pestanasValidas.has(pestana)) {
      fallo('C7', `${donde}: la pestaña "${pestana}" no existe en CitizenApp (TabType).`);
    }
  }

  // C8 · ningún dato personal real
  const texto = JSON.stringify(t);
  if (CURP.test(texto)) fallo('C8', `${donde} contiene algo con forma de CURP.`);
  if (TELEFONO.test(texto)) fallo('C8', `${donde} contiene algo con forma de teléfono.`);
  if (CORREO.test(texto)) fallo('C8', `${donde} contiene algo con forma de correo electrónico.`);
}

// C6 (inverso) · el código no puede tener capacidades que el canon no declara
for (const [, id] of codigoContratos.matchAll(/\bid:\s*'([a-z0-9.-]+\.semantic)'/g)) {
  if (!contratosDeclarados.has(id)) {
    fallo(
      'C6',
      `El contrato semántico "${id}" existe en el código pero ningún trámite del canon lo declara. ` +
      'Una capacidad que el ORBE puede ejecutar y el canon no describe es una capacidad sin gobernanza.',
    );
  }
}

reportar();

function reportar() {
  if (errores.length) {
    console.error(`\n✖ CANON DEL ORBE: ${errores.length} problema(s) encontrado(s)\n`);
    errores.forEach((e, i) => console.error(`  ${i + 1}. ${e}\n`));
    console.error('Referencia: data/canon/README.md y docs/marco/AUDITORIA_FUENTE_CANONICA.md\n');
    process.exit(1);
  }
  const total = tramites.tramites.length;
  const porNivel = {};
  for (const t of tramites.tramites) {
    const nivel = porJurisdiccion.get(t.jurisdiccion)?.nivel ?? 'desconocido';
    porNivel[nivel] = (porNivel[nivel] ?? 0) + 1;
  }
  const desglose = Object.entries(porNivel).map(([n, c]) => `${c} ${n}`).join(', ');
  console.log(`✔ Canon del ORBE: ${total} trámites verificados (${desglose}).`);
  process.exit(0);
}
