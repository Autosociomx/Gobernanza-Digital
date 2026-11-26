// POST /.netlify/functions/add-evidence
// La dependencia sube su evidencia del trabajo (contrato §13, Sesión 23).
// Body JSON: { folio|id, note?, photoDataUrl, toState?, expectedVersion? }
// + cabecera Authorization: Bearer <depCode>.
// - Sin código -> 401. Código válido pero de otro servicio -> 403.
//   Sin pepper o sin lista de códigos -> 503.
// - byName del cuerpo se IGNORA: el servidor estampa by (dependencia
//   registrada) + byRole 'dependencia'.
// - Foto obligatoria (la evidencia ES la foto del trabajo), ≤2 MB, bytes
//   mágicos + EXIF quitado; evidencia con clave propia
//   evidence/<id>/<uuid>.json y foto con clave aleatoria.
// - Transición validada con isValidTransition (409 si no). Sin toState:
//   desde no_atendido -> en_proceso; desde recibido/derivado/en_proceso
//   -> atendido; en atendido se queda. En cerrado -> 409.
//   toState, si viene, solo admite derivado/en_proceso/atendido.
// - Máx. 5 evidencias por reporte (6ª -> 400).
// - expectedVersion opcional: si viene y no coincide -> 409.
// - La app ciudadana NUNCA llama a esta función.
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
    return util.errorResponse(400, 'No se recibió la información de la evidencia.', origin);
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
    return util.errorResponse(401, 'Falta el código de la dependencia.', origin);
  }
  const check = codes.verifyDepCode(token, report.service);
  if (check.reason === 'config') {
    return util.errorResponse(503, 'Configuración incompleta.', origin);
  }
  if (check.reason === 'wrong-service') {
    return util.errorResponse(403, 'Ese código no corresponde a este servicio.', origin);
  }
  if (!check.ok) {
    return util.errorResponse(401, 'El código de la dependencia no es válido.', origin);
  }

  const ip = security.getClientIp(event);
  const perIp = await rate.checkRateLimit(store, 'mutations', ip, 20, 60 * 60 * 1000);
  if (!perIp.allowed) return rateLimitResponse(perIp.retryAfter, origin);
  const perFolio = await rate.checkRateLimitForFolio(store, 'mutations', report.folio, 20, 60 * 60 * 1000);
  if (!perFolio.allowed) return rateLimitResponse(perFolio.retryAfter, origin);

  if (body.expectedVersion !== undefined && body.expectedVersion !== null) {
    if (Number(body.expectedVersion) !== report.version) {
      return util.errorResponse(409, 'El reporte cambió. Vuelve a cargarlo e inténtalo de nuevo.', origin);
    }
  }

  if (report.status === 'cerrado') {
    return util.errorResponse(409, 'Este reporte ya está cerrado.', origin);
  }

  const evidenceCount = (report.evidence || []).length;
  if (evidenceCount >= util.MAX_EVIDENCE) {
    return util.errorResponse(400, 'Este reporte ya tiene el máximo de 5 evidencias.', origin);
  }

  const note = util.cleanText(body.note, util.MAX_NOTE);

  const decoded = util.parseDataUrlPhoto(body.photoDataUrl);
  if (decoded.error) {
    return util.errorResponse(decoded.status || 400, decoded.error, origin);
  }
  const photo = security.validatePhotoBytes(decoded.buffer);
  if (photo.error) {
    return util.errorResponse(photo.status || 400, photo.error, origin);
  }

  // Destino del estado: toState explícito o regla por defecto.
  let toState;
  if (typeof body.toState === 'string' && body.toState !== '') {
    if (['derivado', 'en_proceso', 'atendido'].indexOf(body.toState) === -1) {
      return util.errorResponse(409, 'La evidencia no puede mover el reporte a ese estado.', origin);
    }
    toState = body.toState;
  } else if (report.status === 'no_atendido') {
    toState = 'en_proceso';
  } else if (report.status === 'atendido') {
    toState = 'atendido';
  } else {
    toState = 'atendido';
  }
  if (toState !== report.status && !util.isValidTransition(report.status, toState)) {
    return util.errorResponse(409, 'Ese cambio de estado no está permitido.', origin);
  }

  const photoKey = storeLib.photoKey(report.id, 'evidencia', photo.ext);
  await storeLib.savePhoto(store, photoKey, photo.buffer, photo.contentType);

  const now = new Date().toISOString();
  const evidence = await storeLib.saveEvidence(store, report.id, {
    by: report.dependencia,
    byRole: 'dependencia',
    note,
    photoKey,
    photoContentType: photo.contentType,
    photoUrl: util.photoUrlFor(photoKey),
    createdAt: now,
  });

  report.evidence = report.evidence || [];
  report.evidence.push({
    id: evidence.id,
    by: evidence.by,
    byRole: evidence.byRole,
    note: evidence.note,
    photoKey: evidence.photoKey,
    photoContentType: evidence.photoContentType,
    photoUrl: evidence.photoUrl,
    createdAt: evidence.createdAt,
  });

  const from = report.status;
  report.status = toState;
  report.version = (report.version || 1) + 1;
  util.pushHistory(report, 'dependencia', from, toState, 'Evidencia de la dependencia.');
  await storeLib.saveReport(store, report);

  return util.okResponse(
    { report: util.publicReport(report, seal.verifySeal(report)) },
    200,
    origin
  );
});
