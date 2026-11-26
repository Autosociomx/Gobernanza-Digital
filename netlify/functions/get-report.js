// GET /.netlify/functions/get-report?folio=ORBE-AAAAMMDD-XXXXXXXX
//   o /.netlify/functions/get-report?id=<uuid | orb-YYYYMMDD-xxxxxx>
// Devuelve un solo reporte (contrato §13, Sesión 23).
// - Solo folio COMPLETO; subcadena o formato inválido -> 404 genérico
//   (sin oráculo: mismo 404 para inexistente y mal formado).
// - Búsqueda por índice (máx. 2 lecturas), nunca escaneo completo.
// - Sin código: vista pública (F-7) + sealValid + historial público
//   (solo {at, actor, from, to}) + folioOrigenVerificado.
// - Con Authorization: Bearer <authorCode> válido para ese reporte: vista
//   del autor (teléfono propio, folioOrigen, historial completo).
//   Con código inválido -> 401.
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
  if (event.httpMethod !== 'GET') {
    return util.errorResponse(405, 'Método no permitido.', origin);
  }

  const params = event.queryStringParameters || {};
  const key =
    (typeof params.folio === 'string' && params.folio) ||
    (typeof params.id === 'string' && params.id) ||
    '';
  if (!key) {
    return util.errorResponse(400, 'Falta el identificador del reporte.', origin);
  }
  // 404 genérico e idéntico para folio mal formado, folio inexistente e
  // id inexistente (contrato §9, sin oráculo).
  const knownFormat =
    util.FOLIO_RE.test(key) || util.LEGACY_FOLIO_RE.test(key) ||
    util.UUID_RE.test(key) || util.LEGACY_ID_RE.test(key);
  if (!knownFormat) {
    return util.errorResponse(404, 'No se encontró ese reporte.', origin);
  }

  const store = storeLib.getStore();
  const ip = security.getClientIp(event);
  const limited = await rate.checkRateLimit(store, 'get-report', ip, 30, 60 * 60 * 1000);
  if (!limited.allowed) return rateLimitResponse(limited.retryAfter, origin);

  const report = await storeLib.getReportByIdOrFolio(store, key);
  if (!report) {
    return util.errorResponse(404, 'No se encontró ese reporte.', origin);
  }

  const sealValid = seal.verifySeal(report);
  const token = security.getBearerToken(event);

  if (token) {
    const check = codes.verifyAuthorCode(token, report);
    if (check.reason === 'config') {
      return util.errorResponse(503, 'Configuración incompleta.', origin);
    }
    if (!check.ok) {
      return util.errorResponse(401, 'El código no es válido para este reporte.', origin);
    }
    const out = util.authorReport(report, sealValid);
    return util.okResponse({ report: out }, 200, origin);
  }

  const out = util.publicReport(report, sealValid);
  if (report.status !== 'eliminado') {
    out.history = util.publicHistory(report);
    out.folioOrigenVerificado = report.folioOrigenVerificado === true;
  }
  return util.okResponse({ report: out }, 200, origin);
});
