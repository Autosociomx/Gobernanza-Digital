// POST /.netlify/functions/delete-report — NUEVA (contrato §13, Sesión 23).
// Borra un reporte (derecho del autor, no transición del ciclo).
// Body JSON: { folio|id, expectedVersion? }
// + cabecera Authorization: Bearer <authorCode> (autor) o <modCode>
//   (moderación).
// - Sin código -> 401. Código de autor de otro reporte -> 403. Código de
//   moderación inválido u otro tipo de código -> 401.
// - Sin pepper o sin hash de moderación -> 503.
// - El autor puede borrar en cualquier estado excepto eliminado (el
//   borrado es un derecho, no una transición). Ya eliminado -> 409.
// - Efecto: fotos en duro (store.delete), datos personales eliminados del
//   JSON, lápida {folio, status:'eliminado', createdAt, deletedAt} +
//   historial sin datos personales, re-sellado.
// Respuesta 200 {ok, folio}.
'use strict';

const util = require('./lib/util');
const storeLib = require('./lib/store');
const codes = require('./lib/codes');
const seal = require('./lib/seal');
const rate = require('./lib/rate');
const security = require('./lib/security');
const { withHandler, rateLimitResponse } = require('./lib/handler');

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

  const id =
    (typeof body.folio === 'string' && body.folio) ||
    (typeof body.id === 'string' && body.id) ||
    '';
  if (!id) {
    return util.errorResponse(400, 'Falta el identificador del reporte.', origin);
  }

  const store = storeLib.getStore();
  const report = await storeLib.getReportByIdOrFolio(store, id);
  if (!report) {
    return util.errorResponse(404, 'No se encontró ese reporte.', origin);
  }

  const token = security.getBearerToken(event);
  if (!token) {
    return util.errorResponse(401, 'Falta el código para borrar este reporte.', origin);
  }

  // El prefijo del código decide el camino: AUT- es autor de algún
  // reporte (si no es el de este, 403); MOD- es moderación; cualquier
  // otro (p. ej. DEP-) no autoriza un borrado -> 401.
  let role = null;
  if (token.startsWith('AUT-')) {
    const check = codes.verifyAuthorCode(token, report);
    if (check.reason === 'config') {
      return util.errorResponse(503, 'Configuración incompleta.', origin);
    }
    if (!check.ok) {
      return util.errorResponse(403, 'Ese código no corresponde a este reporte.', origin);
    }
    role = 'autor';
  } else if (token.startsWith('MOD-')) {
    const check = codes.verifyModCode(token);
    if (check.reason === 'config') {
      return util.errorResponse(503, 'Configuración incompleta.', origin);
    }
    if (!check.ok) {
      return util.errorResponse(401, 'El código de moderación no es válido.', origin);
    }
    role = 'moderacion';
  } else {
    return util.errorResponse(401, 'El código no es válido para borrar este reporte.', origin);
  }

  const ip = security.getClientIp(event);
  const perIp = await rate.checkRateLimit(store, 'mutations', ip, 20, 60 * 60 * 1000);
  if (!perIp.allowed) return rateLimitResponse(perIp.retryAfter, origin);
  const perFolio = await rate.checkRateLimitForFolio(store, 'mutations', report.folio, 20, 60 * 60 * 1000);
  if (!perFolio.allowed) return rateLimitResponse(perFolio.retryAfter, origin);

  if (report.status === 'eliminado') {
    return util.errorResponse(409, 'Este reporte ya fue eliminado.', origin);
  }

  // Fotos en duro (best-effort: si una clave ya no existe, no se falla).
  const photoKeys = [];
  if (report.photoKey) photoKeys.push(report.photoKey);
  if (report.rating && report.rating.afterPhotoKey) photoKeys.push(report.rating.afterPhotoKey);
  if (report.noAtendido && report.noAtendido.photoKey) photoKeys.push(report.noAtendido.photoKey);
  for (const ev of report.evidence || []) {
    if (ev.photoKey) photoKeys.push(ev.photoKey);
  }
  for (const k of photoKeys) {
    await storeLib.deletePhoto(store, k);
  }

  // Lápida: sin datos personales; el historial se conserva sin notas.
  const now = new Date().toISOString();
  const history = (Array.isArray(report.history) ? report.history : []).map((h) => ({
    at: h.at,
    actor: h.actor,
    from: h.from === undefined ? null : h.from,
    to: h.to,
    note: '',
  }));
  history.push({
    at: now,
    actor: role,
    from: report.status,
    to: 'eliminado',
    note: '',
  });

  const tombstone = {
    id: report.id,
    folio: report.folio,
    status: 'eliminado',
    version: (report.version || 1) + 1,
    history: history.slice(-200),
    createdAt: report.createdAt,
    updatedAt: now,
    deletedAt: now,
    // authorCodeHash se CONSERVA solo en el JSON interno (nunca en ninguna
    // vista: publicReport de un eliminado devuelve solo folio/status/
    // createdAt/deletedAt). Sin él, un segundo borrado del autor no se
    // podría distinguir de un código ajeno y el 409 del contrato sería
    // inalcanzable. Es un hash con pepper de un código aleatorio, no un
    // dato personal.
    authorCodeHash: report.authorCodeHash || null,
    seal: { algo: 'HMAC-SHA256', hash: null, at: now, keyId: 'sin_clave' },
  };

  // El índice folio -> id se conserva para que el folio siga resolviendo
  // a la lápida pública.
  await storeLib.saveReport(store, tombstone);

  return util.okResponse({ folio: report.folio }, 200, origin);
});
