// GET /.netlify/functions/list-reports?service=<id>&status=<id>&limit=&cursor=
// Lista pública de reportes, los más recientes primero (contrato §13).
// - limit máx. 50, defecto 20; cursor opaco (base64 de {createdAt, id}).
// - Filtros service/status validados contra el vocabulario único;
//   status=pendiente -> 400 (vocabulario prohibido; ya no es alias).
// - Excluye consentPublish === false y eliminado. Los reportes viejos sin
//   consentPublish se tratan como no publicados (fail closed).
// Respuesta {ok, reports:[vista pública], total, nextCursor}.
'use strict';

const util = require('./lib/util');
const storeLib = require('./lib/store');
const seal = require('./lib/seal');
const rate = require('./lib/rate');
const security = require('./lib/security');
const { withHandler, rateLimitResponse } = require('./lib/handler');

function encodeCursor(item) {
  return Buffer.from(JSON.stringify({ createdAt: item.createdAt, id: item.id })).toString('base64');
}

function decodeCursor(raw) {
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    if (parsed && typeof parsed.createdAt === 'string' && typeof parsed.id === 'string') {
      return parsed;
    }
  } catch (_e) {
    // Cursor inválido.
  }
  return null;
}

exports.handler = withHandler(async (event, _context, cors) => {
  const origin = cors.allowedOrigin;
  if (event.httpMethod !== 'GET') {
    return util.errorResponse(405, 'Método no permitido.', origin);
  }

  const params = event.queryStringParameters || {};
  const service = typeof params.service === 'string' ? params.service : '';
  const status = typeof params.status === 'string' ? params.status : '';

  if (service && !util.SERVICES[service]) {
    return util.errorResponse(400, 'Ese tipo de problema no existe en el tablero.', origin);
  }
  if (status === 'pendiente') {
    return util.errorResponse(400, 'Ese estado ya no existe en el tablero.', origin);
  }
  if (status && !util.STATUSES[status]) {
    return util.errorResponse(400, 'Ese estado no existe en el tablero.', origin);
  }

  let limit = parseInt(params.limit, 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 20;
  if (limit > 50) limit = 50;

  let cursor = null;
  if (typeof params.cursor === 'string' && params.cursor !== '') {
    cursor = decodeCursor(params.cursor);
    if (!cursor) {
      return util.errorResponse(400, 'El cursor no es válido.', origin);
    }
  }

  const store = storeLib.getStore();
  const ip = security.getClientIp(event);
  const limited = await rate.checkRateLimit(store, 'list-reports', ip, 60, 60 * 1000);
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter, origin);

  let reports = await storeLib.listReports(store);
  reports = reports.filter((r) => r.consentPublish === true && r.status !== 'eliminado');
  if (service) reports = reports.filter((r) => r.service === service);
  if (status) reports = reports.filter((r) => r.status === status);

  // Orden estable para paginar: createdAt desc, id desc.
  reports.sort((a, b) => {
    const byDate = (b.createdAt || '').localeCompare(a.createdAt || '');
    if (byDate !== 0) return byDate;
    return (b.id || '').localeCompare(a.id || '');
  });

  if (cursor) {
    reports = reports.filter((r) => {
      if ((r.createdAt || '') < cursor.createdAt) return true;
      if (r.createdAt === cursor.createdAt && (r.id || '') < cursor.id) return true;
      return false;
    });
  }

  const total = reports.length;
  const page = reports.slice(0, limit);
  const nextCursor = reports.length > limit ? encodeCursor(page[page.length - 1]) : null;

  return util.okResponse(
    {
      reports: page.map((r) => util.publicReport(r, seal.verifySeal(r))),
      total,
      nextCursor,
    },
    200,
    origin
  );
});
