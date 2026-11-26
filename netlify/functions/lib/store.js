// Acceso a Netlify Blobs para el tablero ORBE.
// Un solo store, "reportes-orbe":
//   report/<id>.json        -> ficha del reporte (JSON)
//   photo/<id>-<tipo>.<ext> -> foto (binario)
// No hay índice aparte: el listado se obtiene con store.list({ prefix }).
// En un deploy de Netlify, getStore() se configura solo; en local hay que
// definir NETLIFY_SITE_ID y NETLIFY_AUTH_TOKEN (ver README).
'use strict';

const STORE_NAME = 'reportes-orbe';

let cachedStore = null;
let overrideStore = null;

// Solo para pruebas locales: inyecta un store en memoria.
function setStoreOverride(store) {
  overrideStore = store;
}

// Las funciones usan sintaxis v1 (exports.handler, modo Lambda). En ese modo
// Netlify NO configura Blobs solo: hay que llamar connectLambda(event, context)
// al inicio de cada handler, si no getStore() lanza MissingBlobsEnvironmentError.
// (Fuente: Netlify Support Forums, respuesta del personal: v1 necesita Lambda
// compatibility mode; v2 con `export default` lo hace solo.)
let connectLambda = null;
try {
  ({ connectLambda } = require('@netlify/blobs'));
} catch (e) {
  connectLambda = null;
}

function connect(event, context) {
  // Sin event/context (pruebas locales con store en memoria) no hace nada.
  if (!event || !context) return;
  if (typeof connectLambda !== 'function') {
    throw new Error('connectLambda no disponible en @netlify/blobs');
  }
  connectLambda(event, context);
}

function getStore() {
  if (overrideStore) return overrideStore;
  if (cachedStore) return cachedStore;
  const { getStore: blobsGetStore } = require('@netlify/blobs');
  cachedStore = blobsGetStore({ name: STORE_NAME });
  return cachedStore;
}

function reportKey(id) {
  return 'report/' + id + '.json';
}

function photoKey(id, kind, ext) {
  return 'photo/' + id + '-' + kind + '.' + ext;
}

function contentTypeForKey(key) {
  if (/\.png$/i.test(key)) return 'image/png';
  if (/\.webp$/i.test(key)) return 'image/webp';
  return 'image/jpeg';
}

async function saveReport(store, report) {
  report.updatedAt = new Date().toISOString();
  await store.set(reportKey(report.id), JSON.stringify(report), {
    contentType: 'application/json',
  });
  return report;
}

async function getReport(store, id) {
  if (typeof id !== 'string' || !/^orb-[0-9]{8}-[a-z0-9]{6}$/.test(id)) return null;
  const data = await store.get(reportKey(id), { type: 'json' });
  return data || null;
}

// Busca por id interno del backend ("orb-YYYYMMDD-xxxxxx") o por folio
// visible al ciudadano ("ORBE-YYYYMMDD-HHMMSS"). Para reportes viejos sin
// campo `folio`, el folio se deriva de su createdAt con la misma regla.
async function getReportByIdOrFolio(store, key) {
  if (typeof key !== 'string' || !key) return null;
  if (/^orb-[0-9]{8}-[a-z0-9]{6}$/.test(key)) return getReport(store, key);
  if (!/^ORBE-[0-9]{8}-[0-9]{6}$/.test(key)) return null;
  const util = require('./util');
  const reports = await listReports(store);
  for (const r of reports) {
    if (r.folio === key) return r;
    if (!r.folio && util.folioVisibleFromCreatedAt(r.createdAt) === key) return r;
  }
  return null;
}

async function listReports(store) {
  const { blobs } = await store.list({ prefix: 'report/' });
  const reports = [];
  for (const entry of blobs) {
    const data = await store.get(entry.key, { type: 'json' });
    if (data && data.id) reports.push(data);
  }
  reports.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  return reports;
}

async function savePhoto(store, key, buffer, contentType) {
  await store.set(key, buffer, { contentType });
}

async function getPhoto(store, key) {
  const buffer = await store.get(key, { type: 'arrayBuffer' });
  if (!buffer) return null;
  return { buffer: Buffer.from(buffer), contentType: contentTypeForKey(key) };
}

module.exports = {
  connect,
  STORE_NAME,
  setStoreOverride,
  getStore,
  reportKey,
  photoKey,
  contentTypeForKey,
  saveReport,
  getReport,
  getReportByIdOrFolio,
  listReports,
  savePhoto,
  getPhoto,
};
