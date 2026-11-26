// Sello HMAC del reporte ORBE (contrato §5, Sesión 23).
// HMAC-SHA256 con ORBE_HMAC_SECRET sobre el JSON canónico del reporte.
// El estado SÍ entra en el sello, igual que la calificación y las
// evidencias. Sin clave configurada el sello es 'sin_sello' (honesto,
// nunca "íntegra").
// Sin dependencias: funciona sin @netlify/blobs instalado.
'use strict';

const crypto = require('crypto');

// JSON canónico: claves ordenadas, recursivo, sin espacios.
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  const keys = Object.keys(value).sort();
  const parts = [];
  for (const k of keys) {
    if (value[k] === undefined) continue;
    parts.push(JSON.stringify(k) + ':' + stableStringify(value[k]));
  }
  return '{' + parts.join(',') + '}';
}

// Campos que entran en el sello (contrato §5). El sello mismo queda fuera.
function canonicalReport(report) {
  return stableStringify({
    folio: report.folio || null,
    service: report.service || null,
    description: report.description || '',
    lat: report.lat === undefined ? null : report.lat,
    lng: report.lng === undefined ? null : report.lng,
    address: report.address || '',
    status: report.status || null,
    evidence: (report.evidence || []).map((e) => ({
      by: e.by || '',
      byRole: e.byRole || '',
      photoKey: e.photoKey || null,
      createdAt: e.createdAt || null,
    })),
    rating: report.rating || null,
    updatedAt: report.updatedAt || null,
    version: report.version === undefined ? null : report.version,
  });
}

// Sella un reporte (mutación). Sin clave: {hash: null, keyId: 'sin_clave'}.
function sealReport(report) {
  const key = process.env.ORBE_HMAC_SECRET;
  const at = new Date().toISOString();
  if (!key) {
    return { algo: 'HMAC-SHA256', hash: null, at, keyId: 'sin_clave' };
  }
  const hash = crypto
    .createHmac('sha256', key)
    .update(canonicalReport(report))
    .digest('hex');
  return { algo: 'HMAC-SHA256', hash, at, keyId: 'v1' };
}

// Verifica el sello guardado. Devuelve true | false | 'sin_sello'
// (sin sello guardado, o sin clave para verificarlo).
function verifySeal(report) {
  if (!report || !report.seal || !report.seal.hash) return 'sin_sello';
  const key = process.env.ORBE_HMAC_SECRET;
  if (!key) return 'sin_sello';
  const expected = crypto
    .createHmac('sha256', key)
    .update(canonicalReport(report))
    .digest('hex');
  const a = Buffer.from(String(report.seal.hash), 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = {
  stableStringify,
  canonicalReport,
  sealReport,
  verifySeal,
};
