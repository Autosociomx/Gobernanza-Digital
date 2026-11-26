// Utilidades compartidas de las funciones del tablero ORBE.
// Sin dependencias: se pueden probar con `node` sin desplegar.
'use strict';

// Servicios del tablero. El color de cada pin es el mismo del mapa de ORBE v0.8.
// "dependencia" es el área de servicio que atiende el reporte; para el agua
// es SIAPA Tepic (verificado en el censo de 42 nodos). Los demás son áreas de
// servicio genéricas: no se inventan nombres oficiales de dependencias.
const SERVICES = {
  agua:       { label: 'Fuga de agua (SIAPA)',   area: 'SIAPA Tepic',               dependencia: 'SIAPA Tepic',               color: '#50b9ff' },
  bache:      { label: 'Bache',                  area: 'Vialidad',                  dependencia: 'Vialidad',                  color: '#ff9a52' },
  luminaria:  { label: 'Luminaria / alumbrado',  area: 'Alumbrado público',         dependencia: 'Alumbrado público',         color: '#f7d75b' },
  basura:     { label: 'Basura',                 area: 'Limpieza y recolección',    dependencia: 'Limpieza y recolección',    color: '#55e995' },
  drenaje:    { label: 'Drenaje',                area: 'Drenaje y alcantarillado',   dependencia: 'Drenaje y alcantarillado',   color: '#a878ff' },
  riesgo_vial:{ label: 'Riesgo vial',            area: 'Seguridad vial',            dependencia: 'Seguridad vial',            color: '#ff6f73' },
  parques:    { label: 'Parques y Jardines',     area: 'Parques y Jardines',        dependencia: 'Parques y Jardines',        color: '#009688' },
};

// Ciclo de reporte de 6 estados, Sesión 21 del Parlamento (25 nov 2026).
// Claves en español sin acento; las etiquetas son las legibles al ciudadano.
// "area" se conserva en SERVICES por compatibilidad; "dependencia" es el
// mismo valor con el nombre que usa el resto del backend.
const STATUSES = {
  recibido:    'Recibido',
  derivado:    'Derivado',
  en_proceso:  'En proceso',
  atendido:    'Atendido (pendiente de calificación)',
  cerrado:     'Cerrado',
  no_atendido: 'No atendido / Reabierto',
};

// Transiciones válidas del ciclo. "cerrado" solo se reabre como
// "no_atendido" (el ciudadano marca que no se atendió); "no_atendido"
// vuelve al circuito por "en_proceso" (la dependencia retomó el caso),
// "derivado" o "atendido" (nueva evidencia del trabajo).
const STATUS_TRANSITIONS = {
  recibido:    ['derivado', 'en_proceso', 'atendido'],
  derivado:    ['en_proceso', 'atendido'],
  en_proceso:  ['atendido', 'no_atendido'],
  atendido:    ['cerrado', 'no_atendido'],
  cerrado:     ['no_atendido'],
  no_atendido: ['en_proceso', 'derivado', 'atendido'],
};

function isValidTransition(from, to) {
  if (typeof from !== 'string' || typeof to !== 'string') return false;
  if (from === to) return false;
  const allowed = STATUS_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.indexOf(to) !== -1;
}

const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4 MB ya decodificada
const MAX_DESCRIPTION = 500;
const MAX_NAME = 80;
const MAX_NOTE = 500;

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function errorResponse(statusCode, message) {
  return jsonResponse(statusCode, { ok: false, error: message });
}

function okResponse(body, statusCode) {
  return jsonResponse(statusCode || 200, Object.assign({ ok: true }, body));
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

// Acepta "data:image/jpeg;base64,...." y devuelve { buffer, contentType, ext }.
// Solo imágenes; nada de ejecutables ni otros tipos.
function parseDataUrlPhoto(dataUrl) {
  if (typeof dataUrl !== 'string') return { error: 'La foto debe enviarse como imagen.' };
  const m = dataUrl.match(/^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return { error: 'La foto debe ser JPG, PNG o WebP.' };
  const contentType = m[1];
  const ext = m[2] === 'jpeg' ? 'jpg' : m[2];
  let buffer;
  try {
    buffer = Buffer.from(m[3], 'base64');
  } catch (_e) {
    return { error: 'La foto no se pudo leer.' };
  }
  if (buffer.length === 0) return { error: 'La foto está vacía.' };
  if (buffer.length > MAX_PHOTO_BYTES) {
    return { error: 'La foto es demasiado grande (máximo 4 MB).' };
  }
  return { buffer, contentType, ext };
}

function randomSuffix(length) {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function newReportId() {
  const d = new Date();
  const stamp = d.toISOString().slice(0, 10).replace(/-/g, '');
  return 'orb-' + stamp + '-' + randomSuffix(6);
}

// Referencia de demostración. NO es un folio oficial: ORBE es una guía
// ciudadana independiente y no emite folios de ninguna dependencia.
function newRef() {
  const d = new Date();
  const stamp = d.toISOString().slice(0, 10).replace(/-/g, '');
  return 'ORB-' + stamp + '-' + randomSuffix(4).toUpperCase();
}

// Dependencia que atiende un servicio, según el mapa Sesión 21.
// Agua es SIAPA Tepic (no CIAPA). Sin servicio válido devuelve ''.
function dependenciaForService(service) {
  const s = SERVICES[service];
  return s ? (s.dependencia || s.area || '') : '';
}

// Folio visible al ciudadano, derivado de createdAt (ISO):
// "ORBE-YYYYMMDD-HHMMSS" en UTC, igual que el folio que muestra el
// Tablero en vivo ("ORBE-20261121-230505"). El id interno del backend
// ("orb-YYYYMMDD-xxxxxx") se conserva como clave y no cambia.
// Devuelve null si createdAt no es una fecha válida.
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

module.exports = {
  SERVICES,
  STATUSES,
  STATUS_TRANSITIONS,
  isValidTransition,
  dependenciaForService,
  folioVisibleFromCreatedAt,
  MAX_DESCRIPTION,
  MAX_NAME,
  MAX_NOTE,
  jsonResponse,
  errorResponse,
  okResponse,
  parseJsonBody,
  cleanText,
  isValidLatLng,
  parseDataUrlPhoto,
  newReportId,
  newRef,
  photoUrlFor,
};
