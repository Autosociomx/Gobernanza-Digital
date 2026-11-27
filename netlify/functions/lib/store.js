// Acceso a Netlify Blobs para el tablero ORBE (contrato §3, Sesión 23).
// Nombre por contexto: CONTEXT === 'production' -> 'orbe-prod';
// en otro caso -> 'orbe-preview-' + sanitizar(BRANCH || CONTEXT || 'dev').
// El store viejo 'reportes-orbe' YA NO lo usan las funciones (solo lo lee
// el script de migración scripts/migrar-reporte-real.mjs).
// Claves:
//   report/<id>.json              -> ficha del reporte (JSON)
//   folio/<folio>.json            -> índice {id, createdAt}
//   evidence/<reportId>/<uuid>.json -> cada evidencia con su propia clave
//   photo/<reportId>-<kind>-<random8>.<ext> -> fotos (clave aleatoria)
//   rate/<sha256(ip)>/<fn>/<ventana>.json -> contadores de rate limit
//   abuse/<folio>/<uuid>.json     -> reportes de contenido inapropiado
// En un deploy de Netlify, getStore() se configura solo; en local hay que
// definir NETLIFY_SITE_ID y NETLIFY_AUTH_TOKEN.
// Sin @netlify/blobs instalado el módulo sigue cargando: el require vive
// dentro de try/catch y las pruebas locales usan setStoreOverride.
// En ese modo connect() es un no-op (el override manda).
'use strict';

const crypto = require('crypto');
const util = require('./util');
const seal = require('./seal');

const LEGACY_STORE_NAME = 'reportes-orbe';

let cachedStore = null;
let cachedStoreName = null;
let overrideStore = null;

// Solo para pruebas locales: inyecta un store en memoria. El store de
// pruebas debe implementar get/set/list/delete (contrato §3).
function setStoreOverride(store) {
  overrideStore = store;
  cachedStore = null;
  cachedStoreName = null;
}

// Nombre del store por contexto (contrato §3).
function storeNameForContext() {
  const ctx = process.env.CONTEXT || '';
  if (ctx === 'production') return 'orbe-prod';
  const raw = (process.env.BRANCH || ctx || 'dev').toLowerCase();
  const branch = raw.replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'dev';
  return 'orbe-preview-' + branch;
}

// Las funciones usan sintaxis v1 (exports.handler, modo Lambda). En ese
// modo Netlify NO configura Blobs solo: hay que llamar connectLambda(event,
// context) al inicio de cada handler, si no getStore() lanza
// MissingBlobsEnvironmentError. El require es perezoso y tolerante: sin
// @netlify/blobs instalado, connectLambda queda null.
let connectLambda = null;
try {
  ({ connectLambda } = require('@netlify/blobs'));
} catch (_e) {
  connectLambda = null;
}

function connect(event, context) {
  // Con store en memoria (pruebas locales) no hay nada que conectar.
  if (overrideStore) return;
  // Sin event/context (pruebas locales sin override) no hace nada.
  if (!event || !context) return;
  if (typeof connectLambda !== 'function') {
    throw new Error('connectLambda no disponible en @netlify/blobs');
  }
  connectLambda(event, context);
}

function getStore() {
  if (overrideStore) return overrideStore;
  const name = storeNameForContext();
  if (cachedStore && cachedStoreName === name) return cachedStore;
  const { getStore: blobsGetStore } = require('@netlify/blobs');
  cachedStore = blobsGetStore({ name });
  cachedStoreName = name;
  return cachedStore;
}

function reportKey(id) {
  return 'report/' + id + '.json';
}

function folioKey(folio) {
  return 'folio/' + folio + '.json';
}

function evidenceKey(reportId, evidenceId) {
  return 'evidence/' + reportId + '/' + evidenceId + '.json';
}

function abuseKey(folio, abuseId) {
  return 'abuse/' + folio + '/' + abuseId + '.json';
}

// Clave de foto aleatoria (contrato §3/§6): nunca la clave fija 'despues'
// ni 'evidencia-' + Date.now(). kind: 'antes' | 'evidencia' | 'despues' |
// 'no-atendido'.
function photoKey(id, kind, ext) {
  return 'photo/' + id + '-' + kind + '-' + util.randomHex(4) + '.' + ext;
}

function contentTypeForKey(key) {
  if (/\.png$/i.test(key)) return 'image/png';
  if (/\.webp$/i.test(key)) return 'image/webp';
  return 'image/jpeg';
}

async function safeGet(store, key, opts) {
  try {
    const data = await store.get(key, opts || { type: 'json' });
    return data === undefined ? null : data;
  } catch (_e) {
    return null;
  }
}

// Guarda el reporte: actualiza updatedAt y lo SELLA en cada mutación
// (contrato §3/§5). El llamador sube `version` antes de guardar cuando la
// mutación cambia el estado; saveReport no inventa versiones.
async function saveReport(store, report) {
  report.updatedAt = new Date().toISOString();
  report.seal = seal.sealReport(report);
  await store.set(reportKey(report.id), JSON.stringify(report), {
    contentType: 'application/json',
  });
  return report;
}

async function saveFolioIndex(store, folio, id, createdAt) {
  await store.set(
    folioKey(folio),
    JSON.stringify({ id, createdAt: createdAt || new Date().toISOString() }),
    { contentType: 'application/json' }
  );
}

async function getFolioIndex(store, folio) {
  return safeGet(store, folioKey(folio), { type: 'json' });
}

async function getReport(store, id) {
  if (typeof id !== 'string') return null;
  if (!util.UUID_RE.test(id) && !util.LEGACY_ID_RE.test(id)) return null;
  const data = await safeGet(store, reportKey(id), { type: 'json' });
  return data || null;
}

// Busca por id (UUID nuevo o id legado orb-YYYYMMDD-xxxxxx) o por folio.
// El folio se resuelve por ÍNDICE (máx. 2 lecturas), nunca por escaneo.
// Compatibilidad: reportes viejos sin índice se resuelven por escaneo UNA
// vez y se escribe su índice (migración perezosa, contrato §13).
async function getReportByIdOrFolio(store, key) {
  if (typeof key !== 'string' || !key) return null;
  if (util.UUID_RE.test(key) || util.LEGACY_ID_RE.test(key)) {
    return getReport(store, key);
  }
  if (util.FOLIO_RE.test(key)) {
    const idx = await getFolioIndex(store, key);
    if (idx && idx.id) {
      const r = await getReport(store, idx.id);
      if (r) return r;
    }
    const found = await findByFolioScan(store, key);
    if (found) {
      try {
        await saveFolioIndex(store, key, found.id, found.createdAt);
      } catch (_e) {
        // El índice se reconstruye en la próxima búsqueda; no se falla.
      }
    }
    return found;
  }
  if (util.LEGACY_FOLIO_RE.test(key)) {
    const found = await findByFolioScan(store, key);
    if (found) {
      try {
        await saveFolioIndex(store, key, found.id, found.createdAt);
      } catch (_e) {
        // Igual que arriba: la búsqueda sigue funcionando por escaneo.
      }
    }
    return found;
  }
  return null;
}

async function findByFolioScan(store, folio) {
  const reports = await listReports(store);
  for (const r of reports) {
    if (r.folio === folio) return r;
    if (!r.folio && util.folioVisibleFromCreatedAt(r.createdAt) === folio) return r;
  }
  return null;
}

async function listReports(store) {
  const { blobs } = await store.list({ prefix: 'report/' });
  const reports = [];
  for (const entry of blobs || []) {
    const data = await safeGet(store, entry.key, { type: 'json' });
    if (data && data.id) reports.push(data);
  }
  reports.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  return reports;
}

// Cada evidencia con su propia clave (contrato §3, U-12): la fuente es
// evidence/<id>/..., el arreglo report.evidence solo lleva resúmenes.
async function saveEvidence(store, reportId, evidence) {
  const ev = Object.assign({}, evidence);
  if (!ev.id) ev.id = crypto.randomUUID();
  await store.set(evidenceKey(reportId, ev.id), JSON.stringify(ev), {
    contentType: 'application/json',
  });
  return ev;
}

async function getEvidenceForReport(store, reportId) {
  const { blobs } = await store.list({ prefix: 'evidence/' + reportId + '/' });
  const out = [];
  for (const entry of blobs || []) {
    const data = await safeGet(store, entry.key, { type: 'json' });
    if (data && data.id) out.push(data);
  }
  out.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
  return out;
}

async function savePhoto(store, key, buffer, contentType) {
  await store.set(key, buffer, { contentType });
}

// Borrado en duro (contrato §4): best-effort, nunca falla la petición si
// una clave ya no existe. El store de pruebas debe implementar delete().
async function deleteKey(store, key) {
  try {
    await store.delete(key);
  } catch (_e) {
    // Best-effort: la lápida ya registra el borrado.
  }
}

async function deletePhoto(store, key) {
  return deleteKey(store, key);
}

async function getPhoto(store, key) {
  const buffer = await safeGet(store, key, { type: 'arrayBuffer' });
  if (!buffer) return null;
  // El Content-Type servido se recalcula por bytes reales en photo.js;
  // aquí se devuelve el de la clave solo como respaldo.
  return { buffer: Buffer.from(buffer), contentType: contentTypeForKey(key) };
}

module.exports = {
  connect,
  LEGACY_STORE_NAME,
  storeNameForContext,
  setStoreOverride,
  getStore,
  reportKey,
  folioKey,
  evidenceKey,
  abuseKey,
  photoKey,
  contentTypeForKey,
  saveReport,
  saveFolioIndex,
  getFolioIndex,
  getReport,
  getReportByIdOrFolio,
  listReports,
  saveEvidence,
  getEvidenceForReport,
  savePhoto,
  deleteKey,
  deletePhoto,
  getPhoto,
};
