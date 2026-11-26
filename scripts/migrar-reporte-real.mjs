#!/usr/bin/env node
// Migra el reporte real ORBE-20261121-230505 del store viejo
// 'reportes-orbe' al store canónico de Sesión 23, con su historial y
// re-sellado (contrato §14; Gemini condición 3; Claude condición 3).
//
// NO SE EJECUTA EN ESTA RONDA: requiere el token de Miguel y su voto.
// Ejecución (solo Miguel, o quien él autorice, desde su máquina):
//   NETLIFY_SITE_ID=<site-id> NETLIFY_AUTH_TOKEN=<token> \
//   ORBE_HMAC_SECRET=<secreto-del-sello> \
//   ORBE_MIGRATION_CONFIRM=1 node scripts/migrar-reporte-real.mjs
//
// Qué hace:
//   1. Lee el store viejo 'reportes-orbe' (NETLIFY_SITE_ID/NETLIFY_AUTH_TOKEN
//      de entorno; nada de credenciales en el repo ni en argumentos).
//   2. Busca el reporte por folio ORBE-20261121-230505 (o por folio
//      derivado de createdAt, como hacían las funciones viejas).
//   3. Copia sus fotos (antes / evidencias / después) del store viejo al
//      canónico con las mismas claves; si una foto falta, avisa y sigue
//      (la ficha queda sin esa foto, no se inventa ninguna).
//   4. Lo escribe en el store canónico (nombre por contexto, ver
//      lib/store.js storeNameForContext; CONTEXT/BRANCH de entorno) con
//      el esquema v2: id legado conservado (orb-YYYYMMDD-xxxxxx), folio
//      explícito, consentPublish=false / consentContact=false (el
//      consentimiento de ese reporte es desconocido: fail closed; el
//      reporte NO aparece en list-reports, pero SÍ es consultable por
//      folio en get-report), folioOrigen conservado tal cual con
//      folioOrigenVerificado=false, version=1, historial conservado (o
//      sintetizado con una entrada de migración), y re-sellado con
//      ORBE_HMAC_SECRET (sin él, el sello queda 'sin_clave' y get-report
//      devuelve sealValid 'sin_sello' — honesto, nunca "íntegra").
//   5. Escribe el índice folio/<folio>.json.
//   6. NO borra el store viejo: la fuente se conserva hasta que Miguel
//      vote retirarla.
//
// Notas:
// - Es idempotente en la práctica: si se corre dos veces, la segunda
//   sobrescribe la misma ficha con los mismos datos.
// - El store canónico en producción es 'orbe-prod' (CONTEXT=production);
//   en local, sin CONTEXT, cae en 'orbe-preview-dev'. Fijar CONTEXT y
//   BRANCH de entorno según el destino deseado antes de correrlo.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const storeLib = require('../netlify/functions/lib/store.js');
const util = require('../netlify/functions/lib/util.js');

const FOLIO_REAL = 'ORBE-20261121-230505';

async function main() {
  if (process.env.ORBE_MIGRATION_CONFIRM !== '1') {
    console.error(
      'Migración NO ejecutada: falta ORBE_MIGRATION_CONFIRM=1.\n' +
        'Esto evita correrla por accidente. Ver la cabecera del script.'
    );
    process.exit(2);
  }
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!siteID || !token) {
    console.error('Faltan NETLIFY_SITE_ID y/o NETLIFY_AUTH_TOKEN en el entorno.');
    process.exit(1);
  }
  if (!process.env.ORBE_HMAC_SECRET) {
    console.error(
      'AVISO: sin ORBE_HMAC_SECRET el reporte migrado queda con sello ' +
        "'sin_clave' (sealValid 'sin_sello'). Se sigue, pero conviene " +
        'configurar el secreto y volver a correr la migración.'
    );
  }

  const { getStore } = await import('@netlify/blobs');
  const oldStore = getStore({ name: storeLib.LEGACY_STORE_NAME, siteID, token });
  const newStore = getStore({ name: storeLib.storeNameForContext(), siteID, token });
  console.log(`Origen: ${storeLib.LEGACY_STORE_NAME} -> destino: ${storeLib.storeNameForContext()}`);

  const reports = await storeLib.listReports(oldStore);
  const old = reports.find(
    (r) =>
      r.folio === FOLIO_REAL ||
      (!r.folio && util.folioVisibleFromCreatedAt(r.createdAt) === FOLIO_REAL)
  );
  if (!old) {
    console.error(`No se encontró el reporte ${FOLIO_REAL} en el store viejo.`);
    process.exit(1);
  }
  console.log(`Encontrado: id=${old.id} status=${old.status} servicio=${old.service}`);

  // Copia de fotos del store viejo al canónico (mismas claves).
  const photoKeys = [];
  if (old.photoKey) photoKeys.push(old.photoKey);
  if (old.rating && old.rating.afterPhotoKey) photoKeys.push(old.rating.afterPhotoKey);
  if (old.noAtendido && old.noAtendido.photoKey) photoKeys.push(old.noAtendido.photoKey);
  for (const ev of old.evidence || []) {
    if (ev.photoKey) photoKeys.push(ev.photoKey);
  }
  for (const key of photoKeys) {
    const buf = await oldStore.get(key, { type: 'arrayBuffer' });
    if (!buf) {
      console.error(`AVISO: foto ${key} no encontrada en el store viejo; la ficha queda sin ella.`);
      continue;
    }
    await newStore.set(key, Buffer.from(buf), {
      contentType: storeLib.contentTypeForKey(key),
    });
    console.log(`Foto copiada: ${key}`);
  }

  const now = new Date().toISOString();
  const status =
    old.status === 'pendiente' ? 'recibido' : old.status || 'recibido';
  const history =
    Array.isArray(old.history) && old.history.length > 0
      ? old.history
      : [
          {
            at: old.createdAt || now,
            actor: 'ciudadano',
            from: null,
            to: status,
            note: '',
          },
          {
            at: now,
            actor: 'moderacion',
            from: status,
            to: status,
            note: 'Migrado desde el store reportes-orbe.',
          },
        ];

  const migrated = {
    id: old.id,
    folio: FOLIO_REAL,
    folioOrigen: typeof old.folioOrigen === 'string' ? old.folioOrigen : '',
    folioOrigenVerificado: false,
    service: old.service,
    dependencia: old.dependencia || util.dependenciaForService(old.service),
    description: old.description || '',
    reporterName: old.reporterName || '',
    phone: null,
    consentPublish: false,
    consentContact: false,
    consentVersion: util.CONSENT_VERSION,
    consentAt: now,
    lat: typeof old.lat === 'number' ? old.lat : null,
    lng: typeof old.lng === 'number' ? old.lng : null,
    address: old.address || '',
    status,
    version: 1,
    photoKey: old.photoKey || null,
    photoContentType: old.photoContentType || null,
    photoUrl: old.photoUrl || (old.photoKey ? util.photoUrlFor(old.photoKey) : null),
    photoNote: old.photoNote || (old.photoKey ? '' : 'Sin foto'),
    evidence: (old.evidence || []).map((e) => ({
      by: e.by || '',
      byRole: e.byRole || '',
      note: e.note || '',
      photoKey: e.photoKey || null,
      photoContentType: e.photoContentType || null,
      photoUrl: e.photoUrl || (e.photoKey ? util.photoUrlFor(e.photoKey) : null),
      createdAt: e.createdAt || old.createdAt || now,
    })),
    rating: old.rating || null,
    noAtendido: old.noAtendido || null,
    history,
    authorCodeHash: old.authorCodeHash || null,
    seal: { algo: 'HMAC-SHA256', hash: null, at: now, keyId: 'sin_clave' },
    createdAt: old.createdAt || now,
    updatedAt: now,
  };

  await storeLib.saveReport(newStore, migrated);
  await storeLib.saveFolioIndex(newStore, FOLIO_REAL, migrated.id, migrated.createdAt);
  console.log(
    `Migrado: ${FOLIO_REAL} id=${migrated.id} status=${migrated.status} ` +
      `sello=${migrated.seal.keyId} (consultable por folio en get-report).`
  );
}

main().catch((err) => {
  console.error('Migración fallida:', err && err.message ? err.message : err);
  process.exit(1);
});
