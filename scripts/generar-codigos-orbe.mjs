#!/usr/bin/env node
// Genera los códigos de ORBE Sesión 23 (contrato §2 y §14).
//   7 códigos de dependencia (uno POR SERVICIO) + 1 código de moderación.
//
// USO (desde la raíz del worktree):
//   ORBE_CODE_PEPPER=<pepper-hex> node scripts/generar-codigos-orbe.mjs
//
// El pepper DEBE ser el mismo que se configure como ORBE_CODE_PEPPER en
// Netlify: los hashes solo verifican contra ese pepper. Generación del
// pepper (una sola vez, fuera del repo):
//   node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
//
// SALIDA (por stdout, para copiar y pegar en Netlify):
//   ORBE_DEP_CODES    JSON {SLUG: sha256hex} — 7 entradas
//   ORBE_MOD_CODE_HASH sha256hex del código de moderación
//   + los códigos en claro, UNA VEZ, para entregarlos a quien corresponda.
//
// SEGURIDAD:
// - NO escribe secretos a disco: nada se guarda en el repo ni en archivos.
// - Los códigos en claro se imprimen UNA vez por stdout: quien los genera
//   los entrega (dependencia por servicio, moderación al equipo) y BORRA
//   la salida de su terminal/historial. Si la salida se filtra, ROTAR:
//   generar de nuevo con el mismo pepper y actualizar ORBE_DEP_CODES /
//   ORBE_MOD_CODE_HASH en Netlify (los códigos viejos dejan de funcionar).
// - NO se generan ni se guardan códigos reales de producción en esta
//   ronda: este script solo existe para cuando Miguel vote generarlos.
// - El hash es sha256(pepper + ':' + code), el mismo de lib/codes.js
//   (se reutiliza esa implementación, no se duplica).
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const codes = require('../netlify/functions/lib/codes.js');
const util = require('../netlify/functions/lib/util.js');

const pepper = process.env.ORBE_CODE_PEPPER;
if (!pepper) {
  console.error(
    'Falta ORBE_CODE_PEPPER en el entorno.\n' +
      'Genera uno con: node -e "console.log(require(\'crypto\').randomBytes(24).toString(\'hex\'))"\n' +
      'Y ejecuta: ORBE_CODE_PEPPER=<pepper> node scripts/generar-codigos-orbe.mjs'
  );
  process.exit(1);
}

const depCodes = {};
const plain = [];
for (const [service, slug] of Object.entries(util.DEP_SLUGS)) {
  const code = codes.newDepCode(slug);
  plain.push({ service, slug, code });
  depCodes[slug] = codes.hashCode(code);
}
const modCode = codes.newModCode();
const modHash = codes.hashCode(modCode);

console.log('=== ORBE Sesión 23 — códigos (generados, NO guardados a disco) ===');
console.log('');
console.log('1) Variables para Netlify (Site settings > Environment variables):');
console.log('   ORBE_CODE_PEPPER=<el pepper usado para generar esto>');
console.log('   ORBE_DEP_CODES=' + JSON.stringify(depCodes));
console.log('   ORBE_MOD_CODE_HASH=' + modHash);
console.log('');
console.log('2) Códigos en claro — entregar UNA vez y borrar esta salida:');
for (const row of plain) {
  console.log(`   ${row.slug} (${row.service}): ${row.code}`);
}
console.log(`   MODERACIÓN: ${modCode}`);
console.log('');
console.log('3) Reglas de entrega:');
console.log('   - Cada código de dependencia lo entrega MIGUEL a la dependencia');
console.log('     verificada de ese servicio, por un canal que solo ella vea.');
console.log('   - El código de moderación queda en manos del equipo ORBE/Miguel.');
console.log('   - Nunca en el repo, nunca en un chat, nunca en una captura.');
console.log('   - Si un código se filtra, se rota: se vuelve a correr este');
console.log('     script (mismo pepper) y se actualizan las variables en Netlify.');
