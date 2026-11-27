// Envoltorio común de las funciones ORBE (contrato §9, §12, Sesión 23).
// withHandler(fn):
//   - Preflight OPTIONS -> 200 con los encabezados CORS del origen.
//   - connect(event, context) con try/catch: si Blobs no se puede
//     conectar, 500 genérico (nunca se filtra el error interno).
//   - try/catch global -> 500 genérico, sin errorType ni trace ni rutas.
// La función envuelta recibe (event, context, cors) con
// cors = {allowed, allowedOrigin} de lib/security.checkOrigin.
// Sin dependencias: funciona sin @netlify/blobs instalado (con
// setStoreOverride el connect es un no-op; ver lib/store.js).
'use strict';

const storeLib = require('./store');
const util = require('./util');
const security = require('./security');

function withHandler(fn) {
  return async (event, context) => {
    const cors = security.checkOrigin(event || {});
    if (event && event.httpMethod === 'OPTIONS') {
      return util.jsonResponse(200, { ok: true }, cors.allowedOrigin);
    }
    try {
      storeLib.connect(event, context);
    } catch (_e) {
      return util.errorResponse(500, 'Error interno del servidor.', cors.allowedOrigin);
    }
    try {
      return await fn(event, context, cors);
    } catch (_e) {
      return util.errorResponse(500, 'Error interno del servidor.', cors.allowedOrigin);
    }
  };
}

// Respuesta 429 genérica con cabecera Retry-After (contrato §9/§10).
function rateLimitResponse(retryAfter, allowedOrigin) {
  return util.errorResponse(
    429,
    'Demasiadas solicitudes. Inténtalo de nuevo en unos minutos.',
    allowedOrigin,
    { 'Retry-After': String(retryAfter || 60) }
  );
}

module.exports = {
  withHandler,
  rateLimitResponse,
};
