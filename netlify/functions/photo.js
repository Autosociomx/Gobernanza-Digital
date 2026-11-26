// GET /.netlify/functions/photo?key=photo/<id>-<tipo>-<random8>.<ext>
// Sirve una foto guardada en Netlify Blobs (contrato §6/§13, Sesión 23).
// Solo se sirven claves que empiezan con "photo/": nunca se exponen
// las fichas JSON de los reportes por esta ruta.
// El Content-Type se fija por los bytes reales (recalculado al servir),
// no por la etiqueta guardada. Cabeceras: X-Content-Type-Options nosniff,
// Content-Disposition inline, Cache-Control private, no-store.
'use strict';

const util = require('./lib/util');
const storeLib = require('./lib/store');
const rate = require('./lib/rate');
const security = require('./lib/security');
const { withHandler, rateLimitResponse } = require('./lib/handler');

exports.handler = withHandler(async (event, _context, cors) => {
  const origin = cors.allowedOrigin;
  if (event.httpMethod !== 'GET') {
    return util.errorResponse(405, 'Método no permitido.', origin);
  }

  const params = event.queryStringParameters || {};
  const key = typeof params.key === 'string' ? params.key : '';
  if (!key.startsWith('photo/') || key.includes('..') || /[^A-Za-z0-9/_.\\-]/.test(key)) {
    return util.errorResponse(400, 'Esa foto no existe.', origin);
  }

  const store = storeLib.getStore();
  const ip = security.getClientIp(event);
  const limited = await rate.checkRateLimit(store, 'photo', ip, 120, 60 * 1000);
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter, origin);

  const photo = await storeLib.getPhoto(store, key);
  if (!photo) {
    return util.errorResponse(404, 'Esa foto no existe.', origin);
  }

  // Content-Type por bytes reales; si los bytes no se reconocen, se usa
  // el de la clave como respaldo (nunca se sirve sin tipo).
  const contentType = security.photoContentTypeFromBytes(photo.buffer) || photo.contentType;

  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Content-Disposition': 'inline',
    'Cache-Control': 'private, no-store',
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;

  return {
    statusCode: 200,
    headers,
    body: photo.buffer.toString('base64'),
    isBase64Encoded: true,
  };
});
