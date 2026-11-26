// Rate limits ORBE (contrato §10, Sesión 23).
// Contadores en Blobs por IP hasheada (nunca en claro):
//   rate/<sha256(ip)>/<fn>/<ventana>.json
// Ventana horaria AAAAMMDDHH, o por minuto AAAAMMDDHHmm cuando el
// windowMs es de 60 s o menos. Los contadores por folio (mutaciones por
// folio, abuso por folio) usan la misma forma con prefijo de folio:
//   rate/folio/<folio>/<fn>/<ventana>.json
// (extensión documentada: el contrato §3 solo nombra la clave por IP, pero
// §10 exige límites por folio; la clave por folio es la forma de contarlos).
// Límite de honestidad: sin compare-and-swap en Blobs, dos incrementos
// simultáneos pueden contarse como uno; el límite es de contención, no
// una barrera exacta. Sin dependencias.
'use strict';

const crypto = require('crypto');

function hashIp(ip) {
  return crypto.createHash('sha256').update(String(ip || '')).digest('hex');
}

function windowLabel(windowMs, now) {
  const d = now || new Date();
  const p = (n) => String(n).padStart(2, '0');
  const base =
    d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + p(d.getUTCHours());
  if (windowMs <= 60 * 1000) return base + p(d.getUTCMinutes());
  return base;
}

function secondsToWindowEnd(windowMs, now) {
  const t = (now || new Date()).getTime();
  const end = Math.ceil((t + 1) / windowMs) * windowMs;
  return Math.max(1, Math.ceil((end - t) / 1000));
}

async function readCounter(store, key) {
  try {
    const rec = await store.get(key, { type: 'json' });
    if (rec && typeof rec.count === 'number') return rec;
  } catch (_e) {
    // Sin contador: se crea abajo.
  }
  return null;
}

// Devuelve {allowed: true} o {allowed: false, retryAfter} (segundos).
// Cuando el límite se supera, el contador NO se vuelve a guardar: el
// valor guardado ya está en el límite y el siguiente intento se deniega
// igual, sin crecer sin bound.
async function checkCounter(store, key, limit, windowMs) {
  const label = windowLabel(windowMs);
  const rec = await readCounter(store, key);
  const count = rec && rec.window === label ? rec.count : 0;
  if (count + 1 > limit) {
    return { allowed: false, retryAfter: secondsToWindowEnd(windowMs) };
  }
  try {
    await store.set(
      key,
      JSON.stringify({ window: label, count: count + 1 }),
      { contentType: 'application/json' }
    );
  } catch (_e) {
    // Si el contador no se pudo guardar, la petición sigue: fallar aquí
    // convertiría un problema de almacén en un bloqueo del ciudadano.
  }
  return { allowed: true };
}

async function checkRateLimit(store, fn, ip, limit, windowMs) {
  const key = 'rate/' + hashIp(ip) + '/' + fn + '/' + windowLabel(windowMs) + '.json';
  return checkCounter(store, key, limit, windowMs);
}

async function checkRateLimitForFolio(store, fn, folio, limit, windowMs) {
  const safeFolio = String(folio || '').replace(/[^A-Za-z0-9-]/g, '');
  const key = 'rate/folio/' + safeFolio + '/' + fn + '/' + windowLabel(windowMs) + '.json';
  return checkCounter(store, key, limit, windowMs);
}

module.exports = {
  hashIp,
  windowLabel,
  secondsToWindowEnd,
  checkRateLimit,
  checkRateLimitForFolio,
};
