// POST /.netlify/functions/report-abuse — NUEVA, mínima (contrato §13).
// Aviso de contenido inapropiado en un reporte. Sin auth: es un aviso,
// no una mutación.
// Body JSON: { folio, reason? }
// Guarda abuse/<folio>/<uuid>.json {folio, reason, createdAt}.
// Rate limit 5/h/IP, máx. 10 por folio.
// Respuesta 200 genérica SIEMPRE (no confirma si el folio existe: mismo
// 200 aunque no exista, sin oráculo). Si el folio ya llegó a 10 avisos,
// también 200 genérico sin guardar otro.
'use strict';

const crypto = require('crypto');
const util = require('./lib/util');
const storeLib = require('./lib/store');
const rate = require('./lib/rate');
const security = require('./lib/security');
const { withHandler, rateLimitResponse } = require('./lib/handler');

const MAX_ABUSE_PER_FOLIO = 10;

exports.handler = withHandler(async (event, _context, cors) => {
  const origin = cors.allowedOrigin;
  if (event.httpMethod !== 'POST') {
    return util.errorResponse(405, 'Método no permitido.', origin);
  }

  const parsed = security.requireBody(event);
  if (parsed.error) {
    return util.errorResponse(parsed.error.status, parsed.error.message, origin);
  }
  const body = parsed.value;
  if (!body || typeof body !== 'object') {
    return util.errorResponse(400, 'No se recibió la información.', origin);
  }

  const folio = typeof body.folio === 'string' ? body.folio : '';
  if (!folio) {
    return util.errorResponse(400, 'Falta el folio del reporte.', origin);
  }
  const reason = util.cleanText(body.reason, util.MAX_NOTE);

  const store = storeLib.getStore();
  const ip = security.getClientIp(event);
  const limited = await rate.checkRateLimit(store, 'report-abuse', ip, 5, 60 * 60 * 1000);
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter, origin);

  // Máx. 10 avisos por folio: si ya se llegó, 200 genérico sin guardar.
  // Si el conteo falla, se guarda el aviso (fail open: es solo un aviso).
  try {
    const { blobs } = await store.list({ prefix: 'abuse/' + folio + '/' });
    if (blobs && blobs.length >= MAX_ABUSE_PER_FOLIO) {
      return util.okResponse({}, 200, origin);
    }
  } catch (_e) {
    // Se sigue y se guarda el aviso.
  }

  const abuseId = crypto.randomUUID();
  await store.set(
    storeLib.abuseKey(folio, abuseId),
    JSON.stringify({ folio, reason, createdAt: new Date().toISOString() }),
    { contentType: 'application/json' }
  );

  return util.okResponse({}, 200, origin);
});
