// Utilidades compartidas de las funciones del tablero ORBE (Sesión 23).
// Sin dependencias: se pueden probar con `node` sin desplegar.
// Contrato: ~/workspace/parlamento-ias/sesion-23-contrato-implementacion-2026-11-26.md
'use strict';

const crypto = require('crypto');

// Servicios del tablero. "dependencia" es el área de servicio que atiende
// el reporte; para el agua es SIAPA Tepic (verificado en el censo de 42
// nodos). Los demás son áreas de servicio genéricas: no se inventan nombres
// oficiales de dependencias.
const SERVICES = {
  agua:       { label: 'Fuga de agua (SIAPA)',   area: 'SIAPA Tepic',               dependencia: 'SIAPA Tepic',               color: '#50b9ff' },
  bache:      { label: 'Bache',                  area: 'Vialidad',                  dependencia: 'Vialidad',                  color: '#ff9a52' },
  luminaria:  { label: 'Luminaria / alumbrado',  area: 'Alumbrado público',         dependencia: 'Alumbrado público',         color: '#f7d75b' },
  basura:     { label: 'Basura',                 area: 'Limpieza y recolección',    dependencia: 'Limpieza y recolección',    color: '#55e995' },
  drenaje:    { label: 'Drenaje',                area: 'Drenaje y alcantarillado',   dependencia: 'Drenaje y alcantarillado',   color: '#a878ff' },
  riesgo_vial:{ label: 'Riesgo vial',            area: 'Seguridad vial',            dependencia: 'Seguridad vial',            color: '#ff6f73' },
  parques:    { label: 'Parques y Jardines',     area: 'Parques y Jardines',        dependencia: 'Parques y Jardines',        color: '#009688' },
};

// Slug de código de dependencia por servicio (contrato §2): uno por
// servicio, en mayúsculas.
const DEP_SLUGS = {
  agua: 'AGUA',
  bache: 'BACHE',
  luminaria: 'LUMINARIA',
  basura: 'BASURA',
  drenaje: 'DRENAJE',
  riesgo_vial: 'RIESGO_VIAL',
  parques: 'PARQUES',
};

// Ciclo de reporte, Sesión 23 (contrato §8). Se conserva "derivado" del
// ciclo de 6 estados votado en Sesión 21; lo único prohibido es "pendiente"
// (en servidor y cliente). "cerrado" es CIERRE TERMINAL: cerrado: [].
const STATUSES = {
  recibido:    'Recibido',
  derivado:    'Derivado',
  en_proceso:  'En proceso',
  atendido:    'Atendido',
  cerrado:     'Cerrado',
  no_atendido: 'No atendido / Reabierto',
  eliminado:   'Eliminado',
};

const STATUS_TRANSITIONS = {
  recibido:    ['derivado', 'en_proceso', 'atendido'],
  derivado:    ['en_proceso', 'atendido'],
  en_proceso:  ['atendido', 'no_atendido'],
  atendido:    ['cerrado', 'no_atendido'],
  cerrado:     [],
  no_atendido: ['en_proceso', 'derivado', 'atendido'],
  eliminado:   [],
};

function isValidTransition(from, to) {
  if (typeof from !== 'string' || typeof to !== 'string') return false;
  if (from === to) return false;
  const allowed = STATUS_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.indexOf(to) !== -1;
}

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB ya decodificada (contrato §6)
const MAX_BODY_BYTES = 6 * 1024 * 1024; // 6 MB (contrato §9)
const MAX_DESCRIPTION = 500;
const MAX_NAME = 80;
const MAX_NOTE = 500;
const MAX_PHONE = 20;
const MAX_EVIDENCE = 5; // tope de evidencias por reporte (contrato §13)
const CONSENT_VERSION = '2026-11-26';

// Formatos de identificador (contrato §3/§13).
const FOLIO_RE = /^ORBE-[0-9]{8}-[A-Z0-9]{8}$/; // folio nuevo, 8 base32
const LEGACY_FOLIO_RE = /^ORBE-[0-9]{8}-[0-9]{6}$/; // folio viejo ORBE-YYYYMMDD-HHMMSS
const LEGACY_ID_RE = /^orb-[0-9]{8}-[a-z0-9]{6}$/; // id viejo orb-YYYYMMDD-xxxxxx
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Base32 Crockford (sin I, L, O, U): el alfabeto de los códigos y folios.
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function randomBase32Chars(n) {
  const bytes = crypto.randomBytes(n);
  let out = '';
  for (let i = 0; i < n; i++) out += CROCKFORD[bytes[i] % 32];
  return out;
}

function randomHex(nBytes) {
  return crypto.randomBytes(nBytes).toString('hex');
}

function newReportId() {
  return crypto.randomUUID();
}

// Folio visible al ciudadano: "ORBE-AAAAMMDD-" + 8 base32 de azar
// (contrato §13; Qwen gana en §5.7 de la síntesis: 8 caracteres, no 6).
function newFolio() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate());
  return 'ORBE-' + ymd + '-' + randomBase32Chars(8);
}

// Geocerca Tepic metro (contrato §11): caja lat 21.30–21.65,
// lng −105.05–−104.70. El polígono municipal exacto INEGI queda como
// mejora futura; la caja es la propuesta citada, no un invento.
function isInTepicMetro(lat, lng) {
  return (
    typeof lat === 'number' && typeof lng === 'number' &&
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= 21.30 && lat <= 21.65 && lng >= -105.05 && lng <= -104.70
  );
}

// Redondeo a 3 decimales (~100 m) para la vista pública (contrato §7).
function round3(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.round(value * 1000) / 1000;
}

// Quita un número de casa suelto al FINAL de la dirección
// ("Calle X 123" -> "Calle X"; "5 de Mayo" no se toca porque el número
// no va al final; "456-B" también se quita). Contrato §7.
function stripHouseNumber(address) {
  if (typeof address !== 'string') return '';
  const out = address.replace(/\s+\d+\s*(-\s*[A-Za-z])?\s*$/, '').trim();
  return out;
}

// Respuesta JSON con CORS por origen (contrato §12): si allowedOrigin es
// null NO se envía Access-Control-Allow-Origin (origen ajeno o sin Origin).
function jsonResponse(statusCode, body, allowedOrigin, extraHeaders) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    // PC-2 (Sesión 23): las cabeceras de netlify.toml cubren archivos
    // estáticos; no está verificado que cubran /.netlify/functions/, así
    // que cada respuesta de función las lleva puestas aquí (constructor
    // central: cubre las 8 funciones, JSON y errores).
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    Vary: 'Origin',
  };
  if (allowedOrigin) headers['Access-Control-Allow-Origin'] = allowedOrigin;
  if (extraHeaders) Object.assign(headers, extraHeaders);
  return { statusCode, headers, body: JSON.stringify(body) };
}

function errorResponse(statusCode, message, allowedOrigin, extraHeaders) {
  return jsonResponse(statusCode, { ok: false, error: message }, allowedOrigin, extraHeaders);
}

function okResponse(body, statusCode, allowedOrigin, extraHeaders) {
  return jsonResponse(statusCode || 200, Object.assign({ ok: true }, body), allowedOrigin, extraHeaders);
}

function parseJsonBody(event) {
  if (!event || !event.body) return null;
  try {
    return JSON.parse(event.body);
  } catch (_e) {
    return null;
  }
}

function cleanText(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function isValidLatLng(lat, lng) {
  return (
    typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180
  );
}

// Acepta "data:image/jpeg;base64,...." y devuelve { buffer, contentType,
// ext }. La etiqueta NO decide el tipo: lib/security.js valida los bytes
// mágicos y quita el EXIF. Solo decodifica base64 y aplica el límite de
// tamaño (2 MB -> error con status 413).
function parseDataUrlPhoto(dataUrl) {
  if (typeof dataUrl !== 'string') return { error: 'La foto debe enviarse como imagen.', status: 400 };
  const m = dataUrl.match(/^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return { error: 'La foto debe ser JPG, PNG o WebP.', status: 400 };
  const contentType = m[1];
  const ext = m[2] === 'jpeg' ? 'jpg' : m[2];
  let buffer;
  try {
    buffer = Buffer.from(m[3], 'base64');
  } catch (_e) {
    return { error: 'La foto no se pudo leer.', status: 400 };
  }
  if (buffer.length === 0) return { error: 'La foto está vacía.', status: 400 };
  if (buffer.length > MAX_PHOTO_BYTES) {
    return { error: 'La foto es demasiado grande (máximo 2 MB).', status: 413 };
  }
  return { buffer, contentType, ext };
}

// Dependencia que atiende un servicio, según el mapa Sesión 21.
// Agua es SIAPA Tepic (no CIAPA). Sin servicio válido devuelve ''.
function dependenciaForService(service) {
  const s = SERVICES[service];
  return s ? (s.dependencia || s.area || '') : '';
}

// Folio visible de un reporte viejo, derivado de createdAt (ISO):
// "ORBE-YYYYMMDD-HHMMSS" en UTC. Solo para compatibilidad con reportes
// sin campo `folio` (migración perezosa, contrato §13).
function folioVisibleFromCreatedAt(createdAt) {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate());
  const hms = pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds());
  return 'ORBE-' + ymd + '-' + hms;
}

function photoUrlFor(key) {
  // Codifica cada segmento pero deja la barra legible en la URL.
  return '/.netlify/functions/photo?key=' + key.split('/').map(encodeURIComponent).join('/');
}

// Añade una entrada al historial append-only (máx. 200 entradas).
// `note` nunca lleva datos personales internos: solo texto de proceso.
function pushHistory(report, actor, from, to, note) {
  report.history = Array.isArray(report.history) ? report.history : [];
  report.history.push({
    at: new Date().toISOString(),
    actor,
    from: from === undefined ? null : from,
    to,
    note: typeof note === 'string' ? note : '',
  });
  if (report.history.length > 200) {
    report.history = report.history.slice(report.history.length - 200);
  }
  return report.history;
}

// Vista pública del reporte (contrato §7). NUNCA incluye: id interno,
// hashes de códigos, teléfono, historial interno, folioOrigen no
// verificado, ref demo, GPS exacto. Los reportes eliminados devuelven
// solo la lápida pública.
// El NOMBRE del autor solo se muestra si consintió publicarlo
// (consentPublish === true) o si quien mira es el autor (opts.author):
// rating.by, noAtendido.by y la evidencia ciudadana también llevan su
// nombre, y sin este filtro se filtraría por ahí aunque reporterName
// estuviera oculto (U-1/A-4). La vista del autor pasa {author:true}.
function publicReport(r, sealValid, opts) {
  if (!r) return null;
  if (r.status === 'eliminado') {
    return {
      folio: r.folio,
      status: 'eliminado',
      createdAt: r.createdAt,
      deletedAt: r.deletedAt || null,
      sealValid: sealValid === undefined ? 'sin_sello' : sealValid,
    };
  }
  const showName = r.consentPublish === true || (opts && opts.author === true);
  const name = showName ? (r.reporterName || '') : '';
  const rating = r.rating
    ? Object.assign({}, r.rating, { by: showName ? (r.rating.by || '') : '' })
    : null;
  const noAtendido = r.noAtendido
    ? Object.assign({}, r.noAtendido, { by: showName ? (r.noAtendido.by || '') : '' })
    : null;
  return {
    folio: r.folio || folioVisibleFromCreatedAt(r.createdAt),
    folioOrigenVerificado: r.folioOrigenVerificado === true,
    service: r.service,
    dependencia: r.dependencia || dependenciaForService(r.service),
    description: r.description,
    reporterName: name,
    lat: round3(r.lat),
    lng: round3(r.lng),
    address: stripHouseNumber(r.address || ''),
    status: r.status,
    photoUrl: r.photoUrl || (r.photoKey ? photoUrlFor(r.photoKey) : null),
    photoNote: r.photoNote || (r.photoKey ? '' : 'Sin foto'),
    evidence: (r.evidence || []).map((e) => ({
      by: e.byRole === 'dependencia' ? e.by : showName ? (e.by || '') : '',
      byRole: e.byRole || '',
      note: e.note || '',
      photoUrl: e.photoUrl || (e.photoKey ? photoUrlFor(e.photoKey) : null),
      createdAt: e.createdAt,
    })),
    rating,
    noAtendido,
    sealValid: sealValid === undefined ? 'sin_sello' : sealValid,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

// Vista del autor (contrato §13 get-report): la pública + teléfono propio,
// folioOrigen e historial completo. Nunca incluye authorCodeHash.
function authorReport(r, sealValid) {
  const pub = publicReport(r, sealValid, { author: true });
  if (!pub || r.status === 'eliminado') return pub;
  pub.id = r.id;
  pub.phone = r.phone || null;
  pub.folioOrigen = r.folioOrigen || '';
  pub.history = Array.isArray(r.history) ? r.history : [];
  return pub;
}

// Historial público para get-report sin código: solo {at, actor, from, to},
// sin notas internas (contrato §13).
function publicHistory(r) {
  return (Array.isArray(r.history) ? r.history : []).map((h) => ({
    at: h.at,
    actor: h.actor,
    from: h.from === undefined ? null : h.from,
    to: h.to,
  }));
}

module.exports = {
  SERVICES,
  DEP_SLUGS,
  STATUSES,
  STATUS_TRANSITIONS,
  isValidTransition,
  dependenciaForService,
  folioVisibleFromCreatedAt,
  MAX_DESCRIPTION,
  MAX_NAME,
  MAX_NOTE,
  MAX_PHONE,
  MAX_EVIDENCE,
  MAX_PHOTO_BYTES,
  MAX_BODY_BYTES,
  CONSENT_VERSION,
  FOLIO_RE,
  LEGACY_FOLIO_RE,
  LEGACY_ID_RE,
  UUID_RE,
  CROCKFORD,
  randomBase32Chars,
  randomHex,
  jsonResponse,
  errorResponse,
  okResponse,
  parseJsonBody,
  cleanText,
  isValidLatLng,
  isInTepicMetro,
  round3,
  stripHouseNumber,
  parseDataUrlPhoto,
  newReportId,
  newFolio,
  photoUrlFor,
  pushHistory,
  publicReport,
  authorReport,
  publicHistory,
};
