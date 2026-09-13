#!/usr/bin/env node
/**
 * Prepara firebase-applet-config.json — Nayarit Digital / ConnectX
 *
 * `src/firebase.ts` importa `../firebase-applet-config.json`, que está
 * gitignoreado desde el 13-ago-2026 porque contiene la apiKey real (hallazgo E3
 * del Acta 006). La decisión de mantenerlo fuera de git es correcta y no se
 * toca. El problema es que ni el workflow ni Netlify lo materializaban, así que
 * en un checkout limpio `npm run lint` y `vite build` fallaban siempre y la
 * Guardia no podía terminar en verde. Ver CI-01 en docs/marco/ESTADO.md.
 *
 * Este script cierra ese hueco sin tocar `src/firebase.ts`, que CLAUDE.md §2
 * prohíbe expresamente modificar por esta causa.
 *
 * Orden de resolución:
 *   1. Si el archivo ya existe, no se toca nunca. Un entorno con credenciales
 *      reales manda sobre cualquier cosa que haga este script.
 *   2. Si está la variable FIREBASE_APPLET_CONFIG (el JSON completo), se escribe.
 *      Es la vía para Netlify y para cualquier despliegue real.
 *   3. Con --placeholder, se copia firebase-applet-config.example.json, cuyos
 *      valores son marcadores («TU_API_KEY_ROTADA»). Sirve para comprobar tipos
 *      y compilar en CI; no sirve para hablar con Firebase.
 *   4. Sin nada de lo anterior, falla diciendo qué falta — en vez de dejar que
 *      rollup lance un «Could not resolve» que no explica nada.
 *
 * Uso:
 *   node scripts/preparar-config-firebase.mjs                # despliegue real
 *   node scripts/preparar-config-firebase.mjs --placeholder  # CI
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const DESTINO = 'firebase-applet-config.json';
const EJEMPLO = 'firebase-applet-config.example.json';
const admitePlaceholder = process.argv.includes('--placeholder');

if (existsSync(DESTINO)) {
  console.log(`✔ ${DESTINO} ya existe: no se toca.`);
  process.exit(0);
}

const desdeEntorno = process.env.FIREBASE_APPLET_CONFIG;
if (desdeEntorno && desdeEntorno.trim()) {
  let config;
  try {
    config = JSON.parse(desdeEntorno);
  } catch (e) {
    console.error(
      `✖ FIREBASE_APPLET_CONFIG está definida pero no es JSON válido: ${e.message}\n` +
      '  Debe contener el objeto completo de configuración, no una ruta ni una sola llave.'
    );
    process.exit(1);
  }
  writeFileSync(DESTINO, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`✔ ${DESTINO} escrito desde FIREBASE_APPLET_CONFIG.`);
  process.exit(0);
}

if (admitePlaceholder) {
  if (!existsSync(EJEMPLO)) {
    console.error(`✖ Falta ${EJEMPLO}, que es la plantilla de la que se copia.`);
    process.exit(1);
  }
  writeFileSync(DESTINO, readFileSync(EJEMPLO, 'utf-8'));
  console.warn(
    `⚠ ${DESTINO} generado con valores de ejemplo (--placeholder).\n` +
    '  Sirve para comprobar tipos y compilar. NO sirve para conectarse a Firebase:\n' +
    '  cualquier build publicado con esta configuración no autentica ni lee Firestore.'
  );
  process.exit(0);
}

console.error(
  `✖ Falta ${DESTINO} y no hay de dónde generarlo.\n\n` +
  '  Está gitignoreado a propósito: contiene la apiKey real (Acta 006, hallazgo E3).\n\n' +
  '  Elige una vía:\n' +
  `    · Local:      cp ${EJEMPLO} ${DESTINO} y llena los valores.\n` +
  '    · Despliegue: define FIREBASE_APPLET_CONFIG con el JSON completo.\n' +
  '    · CI:         node scripts/preparar-config-firebase.mjs --placeholder\n'
);
process.exit(1);
