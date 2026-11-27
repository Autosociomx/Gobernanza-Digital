// Códigos de identidad ORBE (contrato §2, Sesión 23).
// Tres códigos, tres actores: autor (ciudadano), dependencia (por servicio)
// y moderación. El servidor guarda SOLO hashes SHA-256 con pepper; los
// códigos viajan SOLO en `Authorization: Bearer <código>`.
// Hash: sha256Hex(pepper + ':' + code). Verificación con timingSafeEqual.
// Sin dependencias: funciona sin @netlify/blobs instalado.
'use strict';

const crypto = require('crypto');
const util = require('./util');

function codesConfigured() {
  return Boolean(process.env.ORBE_CODE_PEPPER);
}

// sha256 hex (minúsculas) de pepper + ':' + code. null si no hay pepper.
function hashCode(code) {
  const pepper = process.env.ORBE_CODE_PEPPER;
  if (!pepper || typeof code !== 'string' || code.length === 0) return null;
  return crypto.createHash('sha256').update(pepper + ':' + code).digest('hex');
}

function safeEqualHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// Autor: AUT- + 16 base32 Crockford de crypto.randomBytes(10),
// agrupados AUT-XXXXX-XXXXX-XXXXX-X. Se entrega UNA vez (201 + constancia);
// el servidor guarda solo authorCodeHash.
function newAuthorCode() {
  const c = util.randomBase32Chars(16);
  return 'AUT-' + c.slice(0, 5) + '-' + c.slice(5, 10) + '-' + c.slice(10, 15) + '-' + c.slice(15);
}

// Dependencia: DEP-<SLUG>-XXXXX-XXXXX (10 base32 de randomBytes(6)).
// Uno POR SERVICIO; solo sus hashes viven en ORBE_DEP_CODES.
function newDepCode(slug) {
  const c = util.randomBase32Chars(10);
  return 'DEP-' + String(slug).toUpperCase() + '-' + c.slice(0, 5) + '-' + c.slice(5);
}

// Moderación: MOD- + 16 base32. Solo su hash en ORBE_MOD_CODE_HASH.
function newModCode() {
  return 'MOD-' + util.randomBase32Chars(16);
}

// ORBE_DEP_CODES: JSON {SLUG: sha256hex}. null si no está configurado o
// no es JSON válido.
function depCodes() {
  const raw = process.env.ORBE_DEP_CODES;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed;
  } catch (_e) {
    return null;
  }
}

// Verifica el código de autor contra el hash guardado en el reporte.
// {ok, reason}: reason 'config' (falta pepper) | 'invalid'.
function verifyAuthorCode(code, report) {
  if (!codesConfigured()) return { ok: false, reason: 'config' };
  if (!report || !report.authorCodeHash) return { ok: false, reason: 'invalid' };
  const h = hashCode(code);
  if (h === null) return { ok: false, reason: 'config' };
  return { ok: safeEqualHex(h, report.authorCodeHash), reason: 'invalid' };
}

// Verifica el código de dependencia contra el slug del servicio del
// reporte. {ok, reason, slug}: reason 'config' (falta pepper o lista) |
// 'invalid' (no coincide con ningún servicio) | 'wrong-service' (código
// válido, pero de otro servicio -> 403).
function verifyDepCode(code, service) {
  if (!codesConfigured()) return { ok: false, reason: 'config' };
  const map = depCodes();
  if (!map || Object.keys(map).length === 0) return { ok: false, reason: 'config' };
  const h = hashCode(code);
  if (h === null) return { ok: false, reason: 'config' };
  const slug = util.DEP_SLUGS[service];
  for (const entry of Object.entries(map)) {
    if (safeEqualHex(h, entry[1])) {
      if (entry[0] === slug) return { ok: true, slug: entry[0] };
      return { ok: false, reason: 'wrong-service', slug: entry[0] };
    }
  }
  return { ok: false, reason: 'invalid' };
}

// Verifica el código de moderación contra ORBE_MOD_CODE_HASH.
function verifyModCode(code) {
  if (!codesConfigured()) return { ok: false, reason: 'config' };
  const expected = process.env.ORBE_MOD_CODE_HASH || '';
  if (!expected) return { ok: false, reason: 'config' };
  const h = hashCode(code);
  if (h === null) return { ok: false, reason: 'config' };
  return { ok: safeEqualHex(h, expected), reason: 'invalid' };
}

module.exports = {
  codesConfigured,
  hashCode,
  safeEqualHex,
  newAuthorCode,
  newDepCode,
  newModCode,
  depCodes,
  verifyAuthorCode,
  verifyDepCode,
  verifyModCode,
};
