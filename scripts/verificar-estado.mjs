#!/usr/bin/env node
/**
 * Verificador del estado canónico — Nayarit Digital / ConnectX
 *
 * docs/marco/estado.json es la fuente canónica del trabajo pendiente: lo que
 * cada sesión lee al arrancar y actualiza al cerrar. Un registro de estado
 * solo sirve si no puede pudrirse en silencio, y este repositorio ya tiene la
 * prueba de qué pasa cuando se pudre: NOTA_DE_CONTEXTO_PARA_CLAUDE.md lleva
 * declarándose «vigente» desde el 1 de agosto.
 *
 * Este script es a estado.json lo que la Guardia es al bundle: falla el build
 * antes de que la mentira llegue a main.
 *
 * E1 · el archivo existe y es JSON válido con los campos obligatorios
 * E2 · cada entrada está bien formada y con vocabulario válido
 * E3 · los ids son únicos y las dependencias `bloquea` existen
 * E4 · cada evidencia que es una ruta de archivo existe en el repositorio
 * E5 · `verificado_contra` es un commit real de este repositorio
 * E6 · el archivo no ha caducado (`actualizado` + `vigencia_dias`)
 * E7 · ESTADO.md menciona todas las entradas (prosa y datos no divergen)
 *
 * Desde la compuerta de arquitectura (ADR-0001) el registro lleva además dos
 * ejes independientes —madurez y fuerza de evidencia— y un semáforo, y esas
 * tres cosas también se verifican:
 *
 * E8  · el vocabulario declarado en el JSON coincide con el de la compuerta
 * E9  · cada entrada declara `evidence_level` y `semaforo` válidos
 * E10 · E2 o más exige `verified_at_commit`; E3 o más exige `test_evidence`
 *       con comando y resultado (o artefacto existente)
 * E11 · ROJO y AMARILLO exigen criterio de cierre; GRIS, condición de arranque
 * E12 · VERDE exige entrada resuelta, evidencia E2 o más, commit, criterio y
 *       responsable: verde es cerrado con evidencia, no optimismo
 * E13 · nadie declara E5 mientras el runtime siga declarando authority: NONE
 *
 * Uso:  node scripts/verificar-estado.mjs [--semaforo]
 *   --semaforo  imprime el reporte del semáforo en vez de sólo verificar
 */
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

import { MADUREZ, EVIDENCIA, SEMAFORO, NIVEL_EVIDENCIA } from './compuerta/vocabulario.mjs';

const RUTA_JSON = 'docs/marco/estado.json';
const RUTA_MD = 'docs/marco/ESTADO.md';

const errores = [];
const avisos = [];

// E1 · El archivo existe y es JSON válido con los campos obligatorios
if (!existsSync(RUTA_JSON)) {
  console.error(`✖ Falta ${RUTA_JSON}: es la fuente canónica del estado, no es opcional.`);
  process.exit(1);
}

let estado;
try {
  estado = JSON.parse(readFileSync(RUTA_JSON, 'utf-8'));
} catch (e) {
  console.error(`✖ ${RUTA_JSON} no es JSON válido: ${e.message}`);
  process.exit(1);
}

for (const campo of ['actualizado', 'verificado_contra', 'vigencia_dias', 'entradas']) {
  if (estado[campo] === undefined) errores.push(`${RUTA_JSON} no declara «${campo}».`);
}
if (!Array.isArray(estado.entradas)) {
  console.error(`✖ ${RUTA_JSON}: «entradas» debe ser una lista.`);
  process.exit(1);
}

const tipos = new Set(estado.tipos_validos ?? []);
const estados = new Set(estado.estados_validos ?? []);
const prioridades = new Set(estado.prioridades_validas ?? []);
const decisores = new Set(estado.decide_validos ?? []);

// E2 · Cada entrada bien formada, con vocabulario válido
const OBLIGATORIOS = ['id', 'titulo', 'tipo', 'estado', 'prioridad', 'decide', 'evidencia', 'nota'];
for (const [i, e] of estado.entradas.entries()) {
  const donde = e?.id ? `entrada ${e.id}` : `entrada #${i + 1}`;
  for (const campo of OBLIGATORIOS) {
    if (e?.[campo] === undefined) errores.push(`${donde}: falta el campo «${campo}».`);
  }
  if (e?.tipo && tipos.size && !tipos.has(e.tipo)) {
    errores.push(`${donde}: tipo «${e.tipo}» fuera de tipos_validos.`);
  }
  if (e?.estado && estados.size && !estados.has(e.estado)) {
    errores.push(`${donde}: estado «${e.estado}» fuera de estados_validos.`);
  }
  if (e?.prioridad && prioridades.size && !prioridades.has(e.prioridad)) {
    errores.push(`${donde}: prioridad «${e.prioridad}» fuera de prioridades_validas.`);
  }
  if (e?.decide && decisores.size && !decisores.has(e.decide)) {
    errores.push(`${donde}: decide «${e.decide}» fuera de decide_validos.`);
  }
  if (e?.nota !== undefined && String(e.nota).trim().length < 40) {
    errores.push(
      `${donde}: la nota es demasiado corta. Una entrada sin explicación obliga a la ` +
      'siguiente sesión a redescubrir el problema, que es justo lo que este registro evita.'
    );
  }
}

// E3 · Ids únicos y dependencias existentes
const ids = estado.entradas.map((e) => e?.id).filter(Boolean);
const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
if (repetidos.length) errores.push(`Ids repetidos en ${RUTA_JSON}: ${[...new Set(repetidos)].join(', ')}.`);

const conjunto = new Set(ids);
for (const e of estado.entradas) {
  for (const dep of e?.bloquea ?? []) {
    if (!conjunto.has(dep)) errores.push(`entrada ${e.id}: «bloquea» apunta a ${dep}, que no existe.`);
  }
}

// E4 · Cada evidencia con pinta de ruta existe en el repositorio
for (const e of estado.entradas) {
  for (const ev of e?.evidencia ?? []) {
    const esRuta = typeof ev === 'string' && /\.[a-z0-9]+$/i.test(ev) && !ev.startsWith('#');
    if (esRuta && !existsSync(ev)) {
      errores.push(
        `entrada ${e.id}: la evidencia «${ev}» no existe. ` +
        'Una entrada solo se sostiene si su evidencia es verificable.'
      );
    }
  }
}

// E5 · verificado_contra es un commit real
if (estado.verificado_contra) {
  try {
    execSync(`git cat-file -e ${estado.verificado_contra}^{commit}`, { stdio: 'ignore' });
  } catch {
    avisos.push(
      `«verificado_contra» (${String(estado.verificado_contra).slice(0, 12)}) no se encuentra en este ` +
      'clon. Si el clon es superficial es esperado; si no, el registro apunta a un commit inexistente.'
    );
  }
}

// E6 · El archivo no ha caducado
const fecha = new Date(estado.actualizado);
if (Number.isNaN(fecha.getTime())) {
  errores.push(`«actualizado» («${estado.actualizado}») no es una fecha válida (se espera AAAA-MM-DD).`);
} else {
  const dias = Math.floor((Date.now() - fecha.getTime()) / 86_400_000);
  const limite = Number(estado.vigencia_dias) || 21;
  if (dias > limite) {
    errores.push(
      `${RUTA_JSON} caducó: se actualizó hace ${dias} días y su vigencia declarada es de ${limite}. ` +
      'Revisa las entradas contra la realidad y sube la fecha, o amplía vigencia_dias con motivo. ' +
      'Un estado caducado que se presenta como vigente es peor que no tener registro.'
    );
  } else if (dias > limite - 5) {
    avisos.push(`${RUTA_JSON} caduca en ${limite - dias} día(s): conviene repasarlo en esta sesión.`);
  }
}

// E7 · ESTADO.md menciona todas las entradas
if (!existsSync(RUTA_MD)) {
  errores.push(`Falta ${RUTA_MD}: es la lectura humana del mismo registro.`);
} else {
  const md = readFileSync(RUTA_MD, 'utf-8');
  const ausentes = ids.filter((id) => !md.includes(id));
  if (ausentes.length) {
    errores.push(
      `${RUTA_MD} no menciona ${ausentes.join(', ')}. La prosa y los datos describen el mismo estado: ` +
      'si divergen, vuelve a haber dos verdades.'
    );
  }
}


// ---------------------------------------------------------------------------
// Ejes de madurez y evidencia (ADR-0001)
// ---------------------------------------------------------------------------

// E8 · El vocabulario del JSON no puede separarse del de la compuerta
const listasDeclaradas = [
  ['madurez_validas', MADUREZ],
  ['evidencia_validos', EVIDENCIA],
  ['semaforo_validos', SEMAFORO],
];
for (const [campo, esperado] of listasDeclaradas) {
  const declarado = estado[campo];
  if (declarado === undefined) {
    errores.push(`${RUTA_JSON} no declara «${campo}». Los ejes del ADR-0001 son parte del registro.`);
    continue;
  }
  if (JSON.stringify(declarado) !== JSON.stringify(esperado)) {
    errores.push(
      `${RUTA_JSON}: «${campo}» no coincide con scripts/compuerta/vocabulario.mjs. ` +
      'Dos vocabularios distintos para lo mismo es el primer paso de la deriva.'
    );
  }
}

const madureces = new Set(MADUREZ);
const niveles = new Set(EVIDENCIA);
const semaforos = new Set(SEMAFORO);

for (const e of estado.entradas) {
  const donde = `entrada ${e?.id ?? '(sin id)'}`;

  // E9 · Vocabulario de los ejes
  if (e?.madurez !== undefined && !madureces.has(e.madurez)) {
    errores.push(`${donde}: madurez «${e.madurez}» fuera del eje. Válidas: ${MADUREZ.join(', ')}.`);
  }
  if (e?.evidence_level === undefined) {
    errores.push(
      `${donde}: falta «evidence_level». Toda entrada declara con qué se sostiene, aunque sea E0_DECLARED.`
    );
  } else if (!niveles.has(e.evidence_level)) {
    errores.push(`${donde}: evidence_level «${e.evidence_level}» fuera del eje. Válidos: ${EVIDENCIA.join(', ')}.`);
  }
  if (e?.semaforo === undefined) {
    errores.push(`${donde}: falta «semaforo».`);
  } else if (!semaforos.has(e.semaforo)) {
    errores.push(`${donde}: semaforo «${e.semaforo}» no es válido. Válidos: ${SEMAFORO.join(', ')}.`);
  }

  const orden = NIVEL_EVIDENCIA[e?.evidence_level];

  // E10 · Lo que cada nivel exige
  if (orden !== undefined && orden >= NIVEL_EVIDENCIA.E2_CODE_INSPECTED) {
    if (!e.verified_at_commit) {
      errores.push(
        `${donde}: declara ${e.evidence_level} sin «verified_at_commit». ` +
        'Una ruta sin commit no es inspección, es referencia.'
      );
    } else {
      try {
        execSync(`git cat-file -e ${e.verified_at_commit}^{commit}`, { stdio: 'ignore' });
      } catch {
        avisos.push(`${donde}: «verified_at_commit» (${String(e.verified_at_commit).slice(0, 12)}) no está en este clon.`);
      }
    }
  }
  if (orden !== undefined && orden >= NIVEL_EVIDENCIA.E3_REPRODUCIBLE_EXECUTION) {
    const prueba = e.test_evidence;
    if (!prueba || typeof prueba !== 'object') {
      errores.push(
        `${donde}: declara ${e.evidence_level} sin «test_evidence». E3 es «cualquiera puede volver a correrlo»: ` +
        'exige comando y resultado.'
      );
    } else {
      if (!String(prueba.comando ?? '').trim()) {
        errores.push(`${donde}: «test_evidence» sin «comando».`);
      }
      if (!String(prueba.resultado ?? '').trim() && !String(prueba.artifact ?? '').trim()) {
        errores.push(`${donde}: «test_evidence» sin «resultado» ni «artifact»: un comando sin resultado no prueba nada.`);
      }
      const artefacto = String(prueba.artifact ?? '').trim();
      if (artefacto && /\.[a-z0-9]+$/i.test(artefacto) && !existsSync(artefacto)) {
        errores.push(`${donde}: el artefacto «${artefacto}» citado en «test_evidence» no existe.`);
      }
    }
  }

  // E11 · Cada color exige lo suyo
  const criterio = String(e?.criterio_cierre ?? '').trim();
  if ((e?.semaforo === 'ROJO' || e?.semaforo === 'AMARILLO') && criterio.length < 40) {
    errores.push(
      `${donde}: semáforo ${e.semaforo} sin «criterio_cierre» sustantivo. ` +
      'Rojo sin criterio de salida y amarillo sin acción siguiente se vuelven permanentes.'
    );
  }
  if (e?.semaforo === 'GRIS' && !String(e?.condicion_de_arranque ?? '').trim()) {
    errores.push(`${donde}: semáforo GRIS sin «condicion_de_arranque»: gris significa «no iniciado», y algo lo desbloquea.`);
  }

  // E12 · Verde es cerrado con evidencia
  if (e?.semaforo === 'VERDE') {
    if (e.estado !== 'resuelto') {
      errores.push(`${donde}: semáforo VERDE con estado «${e.estado}». Verde es cerrado, no casi cerrado.`);
    }
    if (orden === undefined || orden < NIVEL_EVIDENCIA.E2_CODE_INSPECTED) {
      errores.push(`${donde}: semáforo VERDE con evidencia ${e.evidence_level}. E0 y E1 no cierran nada por sí solos.`);
    }
    if (!e.verified_at_commit) errores.push(`${donde}: semáforo VERDE sin «verified_at_commit».`);
    if (criterio.length < 40) errores.push(`${donde}: semáforo VERDE sin criterio de cierre cumplido y escrito.`);
    if (!String(e.responsable ?? '').trim()) {
      errores.push(`${donde}: semáforo VERDE sin «responsable». Un cierre sin responsable no es un cierre.`);
    }
  }

  // E13 · E5 es incompatible con el estado declarado del sistema
  if (e?.evidence_level === 'E5_INSTITUTIONAL_OPERATION_VERIFIED') {
    const runtime = existsSync('contextos/labServer.ts') ? readFileSync('contextos/labServer.ts', 'utf-8') : '';
    if (runtime.includes("authority: 'NONE'")) {
      errores.push(
        `${donde}: declara E5_INSTITUTIONAL_OPERATION_VERIFIED mientras contextos/labServer.ts sigue ` +
        'declarando authority: NONE. Nada opera institucionalmente con autoridad nula: primero el ADR ' +
        'que amplía la autoridad, después el nivel de evidencia.'
      );
    }
  }
}

// Salida
for (const a of avisos) console.warn(`⚠ ${a}`);

if (errores.length) {
  console.error('\n✖ Verificación del estado canónico fallida:\n');
  for (const e of errores) console.error(`  · ${e}`);
  console.error(`\n${errores.length} problema(s). Fuente: ${RUTA_JSON} · guía: CLAUDE.md §2.`);
  process.exit(1);
}


if (process.argv.includes('--semaforo')) {
  const grupos = { ROJO: [], AMARILLO: [], VERDE: [], GRIS: [] };
  for (const e of estado.entradas) (grupos[e.semaforo] ?? grupos.GRIS).push(e);
  const titulo = { VERDE: '🟢 CERRADO', AMARILLO: '🟡 EN PROCESO', ROJO: '🔴 BLOQUEADO', GRIS: '⚪ NO INICIADO' };

  console.log('\nSEMÁFORO GOBERNANZA DIGITAL');
  console.log(`Registro: ${RUTA_JSON} · actualizado ${estado.actualizado} · ${estado.entradas.length} entradas\n`);
  for (const color of ['VERDE', 'AMARILLO', 'ROJO', 'GRIS']) {
    console.log(`${titulo[color]} (${grupos[color].length})`);
    for (const e of grupos[color]) {
      console.log(`  · ${e.id} — ${e.titulo}`);
      console.log(`      evidencia: ${e.evidence_level}${e.madurez ? ` · madurez: ${e.madurez}` : ''} · decide: ${e.decide}`);
      const siguiente = color === 'GRIS' ? e.condicion_de_arranque : e.criterio_cierre;
      if (siguiente) console.log(`      ${color === 'GRIS' ? 'arranca con' : 'cierra con'}: ${siguiente}`);
    }
    console.log('');
  }
  const porNivel = {};
  for (const e of estado.entradas) porNivel[e.evidence_level] = (porNivel[e.evidence_level] ?? 0) + 1;
  console.log('EVIDENCIA POR NIVEL');
  for (const nivel of EVIDENCIA) if (porNivel[nivel]) console.log(`  ${nivel}: ${porNivel[nivel]}`);
  console.log('');
}

const abiertas = estado.entradas.filter((e) => e.estado !== 'resuelto');
const p0 = abiertas.filter((e) => e.prioridad === 'P0').length;
console.log(
  `✔ Estado canónico verificado: ${estado.entradas.length} entrada(s), ` +
  `${abiertas.length} sin cerrar (${p0} en P0), actualizado el ${estado.actualizado}.`
);
