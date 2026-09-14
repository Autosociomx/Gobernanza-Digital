#!/usr/bin/env node
/**
 * Compuerta de arquitectura — Nayarit Digital / ConnectX
 *
 * Convierte el canon en una comprobación que corre. Cuatro fases:
 *
 *   B · Impacto    toda PR sobre la arquitectura declara qué mueve
 *   C · Evidencia  toda afirmación declara con qué se sostiene
 *   D · Autoridad  nadie amplía la autoridad del sistema en silencio
 *   E · Deriva     canon y código no pueden separarse sin que se note
 *
 * Y emite un recibo de arquitectura con lo declarado, lo verificado y lo que
 * quedó abierto.
 *
 * Uso:
 *   node scripts/compuerta-arquitectura.mjs                      # sobre origin/main…HEAD
 *   node scripts/compuerta-arquitectura.mjs --solo-canon         # sólo fase E, sin PR
 *   node scripts/compuerta-arquitectura.mjs --base=origin/main --cabeza=HEAD \
 *        --cuerpo=cuerpo-pr.md --titulo="…" --pr=68 --recibo=artifacts/recibo-arquitectura
 *
 * Variables de entorno equivalentes (las usa el workflow):
 *   COMPUERTA_BASE, COMPUERTA_CABEZA, COMPUERTA_CUERPO, COMPUERTA_TITULO, COMPUERTA_PR
 *
 * Códigos de salida:
 *   0  sin bloqueos (puede haber avisos)
 *   1  bloqueado: hay hallazgos que impiden la fusión
 *   2  escalado: sin bloqueos, pero algo exige revisión arquitectónica humana
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { leerDeclaracion } from './compuerta/declaracion.mjs';
import {
  archivosCambiados,
  lineasDelParche,
  existeReferencia,
  resolver,
  cambiosSinConfirmar,
} from './compuerta/diff.mjs';
import { compuertaDeImpacto } from './compuerta/impacto.mjs';
import { compuertaDeEvidencia } from './compuerta/evidencia.mjs';
import { compuertaDeAutoridad } from './compuerta/autoridad.mjs';
import { compuertaDeDeriva } from './compuerta/deriva.mjs';
import { construirRecibo, reciboAYaml } from './compuerta/recibo.mjs';

const RUTA_FRONTERAS = 'docs/marco/fronteras-arquitectura.json';

function argumento(nombre, porDefecto = null) {
  const prefijo = `--${nombre}=`;
  const encontrado = process.argv.find((a) => a.startsWith(prefijo));
  return encontrado ? encontrado.slice(prefijo.length) : porDefecto;
}

const bandera = (nombre) => process.argv.includes(`--${nombre}`);

const leerArchivo = (ruta) => (existsSync(ruta) ? readFileSync(ruta, 'utf-8') : null);
const existe = (ruta) => existsSync(ruta);
const resolverCommit = (referencia) => existeReferencia(referencia);

function basePorDefecto() {
  for (const candidata of ['origin/main', 'main']) {
    if (existeReferencia(candidata)) return candidata;
  }
  return null;
}

function main() {
  const soloCanon = bandera('solo-canon');
  const base = argumento('base', process.env.COMPUERTA_BASE || basePorDefecto());
  const cabeza = argumento('cabeza', process.env.COMPUERTA_CABEZA || 'HEAD');
  const pr = argumento('pr', process.env.COMPUERTA_PR || null);
  const prefijoRecibo = argumento('recibo', 'artifacts/recibo-arquitectura');

  const rutaCuerpo = argumento('cuerpo', null);
  let cuerpo = process.env.COMPUERTA_CUERPO ?? '';
  if (rutaCuerpo) {
    if (!existsSync(rutaCuerpo)) {
      console.error(`✖ No existe el archivo de cuerpo de PR «${rutaCuerpo}».`);
      process.exit(1);
    }
    cuerpo = readFileSync(rutaCuerpo, 'utf-8');
  }
  const titulo = argumento('titulo', process.env.COMPUERTA_TITULO ?? '');

  const crudoFronteras = leerArchivo(RUTA_FRONTERAS);
  let fronteras = null;
  if (crudoFronteras) {
    try {
      fronteras = JSON.parse(crudoFronteras);
    } catch (e) {
      console.error(`✖ ${RUTA_FRONTERAS} no es JSON válido: ${e.message}`);
      process.exit(1);
    }
  }

  let archivos = [];
  let agregadas = [];
  let eliminadas = [];
  if (!soloCanon) {
    if (!base || !existeReferencia(base)) {
      console.error(
        `✖ No se encuentra la base «${base}». Pásala con --base=<ref> o trae la rama: ` +
          'git fetch origin main. Sin base no hay parche que clasificar.',
      );
      process.exit(1);
    }
    archivos = archivosCambiados(base, cabeza);
    ({ agregadas, eliminadas } = lineasDelParche(base, cabeza));

    const sinConfirmar = cambiosSinConfirmar();
    if (sinConfirmar.length) {
      console.warn(
        `⚠ Hay ${sinConfirmar.length} archivo(s) con cambios sin confirmar. La compuerta clasifica commits, ` +
          'no el árbol de trabajo: lo que no esté en un commit no se está evaluando.',
      );
    }
  }

  const declaracion = leerDeclaracion(cuerpo);
  const contextoBase = { declaracion, archivos, agregadas, eliminadas, existe, leerArchivo, resolverCommit, fronteras };

  const resultados = [];
  let impacto = { hallazgos: [], exigida: false, vigiladas: [] };
  if (!soloCanon) {
    impacto = compuertaDeImpacto(contextoBase);
    resultados.push(impacto);
    resultados.push(
      compuertaDeEvidencia({ ...contextoBase, cuerpo, titulo, impactoExigido: impacto.exigida }),
    );
    resultados.push(compuertaDeAutoridad(contextoBase));
  }
  resultados.push(compuertaDeDeriva(contextoBase));

  const hallazgos = resultados.flatMap((r) => r.hallazgos ?? []);
  const bloqueos = hallazgos.filter((h) => h.nivel === 'error');
  const escalamientos = hallazgos.filter((h) => h.nivel === 'escalar');
  const avisos = hallazgos.filter((h) => h.nivel === 'aviso');

  const veredicto = bloqueos.length ? 'BLOQUEADO' : escalamientos.length ? 'ESCALADO' : 'PASA';

  const recibo = construirRecibo({
    declaracion,
    resultados,
    base,
    cabeza: resolver(cabeza),
    pr,
    veredicto,
    fecha: Date.now(),
  });

  if (prefijoRecibo) {
    mkdirSync(dirname(prefijoRecibo), { recursive: true });
    writeFileSync(`${prefijoRecibo}.yml`, reciboAYaml(recibo), 'utf-8');
    writeFileSync(`${prefijoRecibo}.json`, `${JSON.stringify(recibo, null, 2)}\n`, 'utf-8');
  }

  // Reporte
  console.log('Compuerta de arquitectura — Nayarit Digital / ConnectX');
  if (soloCanon) {
    console.log('Modo: sólo detección de deriva del canon (sin PR).');
  } else {
    console.log(`Base: ${base} · Cabeza: ${cabeza} · Archivos tocados: ${archivos.length}`);
    console.log(
      `Declaración de impacto: ${declaracion.presente ? 'presente' : 'ausente'}` +
        `${impacto.exigida ? ' · exigida por las rutas tocadas' : ''}`,
    );
  }

  for (const a of avisos) console.warn(`⚠ [${a.id}] ${a.mensaje}`);

  if (escalamientos.length) {
    console.error('\n▲ Escala a revisión arquitectónica humana:\n');
    for (const e of escalamientos) console.error(`  · [${e.id}] ${e.mensaje}`);
  }

  if (bloqueos.length) {
    console.error('\n✖ Compuerta de arquitectura: cambio bloqueado\n');
    for (const b of bloqueos) console.error(`  · [${b.id}] ${b.mensaje}`);
    console.error(
      `\n${bloqueos.length} bloqueo(s). Guía: docs/marco/COMPUERTA_ARQUITECTURA.md · ` +
        `decisión: docs/marco/adr/ADR-0001-compuerta-de-arquitectura.md`,
    );
  }

  if (prefijoRecibo) console.log(`\nRecibo: ${prefijoRecibo}.yml (change_id ${recibo.change_id})`);

  if (bloqueos.length) process.exit(1);
  if (escalamientos.length) {
    console.error('\nSin bloqueos, pero hay escalamientos: la compuerta no aprueba ampliaciones de autoridad.');
    process.exit(2);
  }
  console.log(`\n✔ Compuerta de arquitectura: ${veredicto}.`);
}

main();
