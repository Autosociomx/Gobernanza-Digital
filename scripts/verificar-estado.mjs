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
 * Uso:  node scripts/verificar-estado.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

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

// Salida
for (const a of avisos) console.warn(`⚠ ${a}`);

if (errores.length) {
  console.error('\n✖ Verificación del estado canónico fallida:\n');
  for (const e of errores) console.error(`  · ${e}`);
  console.error(`\n${errores.length} problema(s). Fuente: ${RUTA_JSON} · guía: CLAUDE.md §2.`);
  process.exit(1);
}

const abiertas = estado.entradas.filter((e) => e.estado !== 'resuelto');
const p0 = abiertas.filter((e) => e.prioridad === 'P0').length;
console.log(
  `✔ Estado canónico verificado: ${estado.entradas.length} entrada(s), ` +
  `${abiertas.length} sin cerrar (${p0} en P0), actualizado el ${estado.actualizado}.`
);
