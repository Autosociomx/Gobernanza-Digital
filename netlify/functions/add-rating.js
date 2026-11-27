// POST /.netlify/functions/add-rating
// El ciudadano califica el trabajo y cierra su reporte, o marca que no se
// atendió y el caso se reabre (contrato §13, Sesión 23).
// Cabecera Authorization: Bearer <authorCode> (obligatoria en ambos
// caminos). byName del cuerpo se IGNORA: by es el nombre guardado del autor.
// Camino A) Calificar y cerrar: { folio|id, stars, comment?,
//   afterPhotoDataUrl, expectedVersion? }
//   Solo desde atendido CON evidencia de dependencia verificada; stars 1–5;
//   afterPhotoDataUrl obligatoria (clave aleatoria, nunca 'despues'); una
//   sola calificación (segunda -> 409); pasa a cerrado (terminal).
// Camino B) Marcar no atendido: { folio|id, noAtendido: true,
//   photoDataUrl?, comment?, expectedVersion? }
//   Solo antes de la calificación; desde cerrado -> 409; también 409
//   desde recibido/derivado (la tabla no contempla ese paso). Foto
//   opcional del problema; queda en history + campo noAtendido.
//   Tope de reaperturas: 429 a la 4ª en una hora; NUNCA cierre automático.
// expectedVersion opcional -> 409 si cambió.
'use strict';

const util = require('./lib/util');
const storeLib = require('./lib/store');
const codes = require('./lib/codes');
const seal = require('./lib/seal');
const rate = require('./lib/rate');
const security = require('./lib/security');
const { withHandler, rateLimitResponse } = require('./lib/handler');

const REOPEN_WINDOW_MS = 60 * 60 * 1000;
const REOPEN_MAX_PER_HOUR = 3; // la 4ª reapertura en una hora -> 429

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
    return util.errorResponse(400, 'No se recibió la información de la calificación.', origin);
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
    return util.errorResponse(401, 'Falta el código del autor.', origin);
  }
  const check = codes.verifyAuthorCode(token, report);
  if (check.reason === 'config') {
    return util.errorResponse(503, 'Configuración incompleta.', origin);
  }
  if (!check.ok) {
    return util.errorResponse(401, 'El código del autor no es válido.', origin);
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

  const comment = util.cleanText(body.comment, util.MAX_NOTE);
  const now = new Date().toISOString();

  // Camino B: marcar no atendido (reabrir). No cierra el reporte.
  if (body.noAtendido === true) {
    if (report.rating) {
      return util.errorResponse(409, 'Este reporte ya fue calificado.', origin);
    }
    if (report.status === 'cerrado') {
      return util.errorResponse(409, 'Este reporte ya está cerrado.', origin);
    }
    if (!util.isValidTransition(report.status, 'no_atendido')) {
      return util.errorResponse(409, 'Ese cambio de estado no está permitido.', origin);
    }
    // Tope de reaperturas: 429 a la 4ª en una hora, nunca cierre automático.
    const since = Date.now() - REOPEN_WINDOW_MS;
    const recentReopens = (report.history || []).filter(
      (h) => h.to === 'no_atendido' && new Date(h.at).getTime() >= since
    ).length;
    if (recentReopens >= REOPEN_MAX_PER_HOUR) {
      return rateLimitResponse(3600, origin);
    }

    let photoKey = null;
    let photoUrl = null;
    let photoContentType = null;
    if (typeof body.photoDataUrl === 'string' && body.photoDataUrl.trim() !== '') {
      const decoded = util.parseDataUrlPhoto(body.photoDataUrl);
      if (decoded.error) {
        return util.errorResponse(decoded.status || 400, decoded.error, origin);
      }
      const photo = security.validatePhotoBytes(decoded.buffer);
      if (photo.error) {
        return util.errorResponse(photo.status || 400, photo.error, origin);
      }
      photoKey = storeLib.photoKey(report.id, 'no-atendido', photo.ext);
      photoContentType = photo.contentType;
      photoUrl = util.photoUrlFor(photoKey);
      await storeLib.savePhoto(store, photoKey, photo.buffer, photo.contentType);
      report.evidence = report.evidence || [];
      report.evidence.push({
        by: report.reporterName || '',
        byRole: 'ciudadano',
        note: comment || 'El ciudadano marcó el reporte como no atendido.',
        photoKey,
        photoContentType,
        photoUrl,
        createdAt: now,
      });
    }

    report.noAtendido = {
      by: report.reporterName || '',
      comment,
      photoKey,
      photoUrl,
      createdAt: now,
    };
    const from = report.status;
    report.status = 'no_atendido';
    report.version = (report.version || 1) + 1;
    util.pushHistory(report, 'ciudadano', from, 'no_atendido', 'El ciudadano marcó el reporte como no atendido.');
    await storeLib.saveReport(store, report);
    return util.okResponse(
      { report: util.publicReport(report, seal.verifySeal(report)) },
      200,
      origin
    );
  }

  // Camino A: calificar y cerrar.
  const stars = Number(body.stars);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return util.errorResponse(400, 'La calificación es de 1 a 5 estrellas.', origin);
  }
  if (report.rating) {
    return util.errorResponse(409, 'Este reporte ya fue calificado.', origin);
  }
  if (report.status !== 'atendido') {
    return util.errorResponse(409, 'Solo se puede calificar un reporte atendido.', origin);
  }
  const hasDepEvidence = (report.evidence || []).some((e) => e.byRole === 'dependencia');
  if (!hasDepEvidence) {
    return util.errorResponse(409, 'Aún no hay evidencia de la dependencia para calificar.', origin);
  }

  const decoded = util.parseDataUrlPhoto(body.afterPhotoDataUrl);
  if (decoded.error) {
    return util.errorResponse(
      decoded.status || 400,
      'Para calificar, sube la foto del después. ' + decoded.error,
      origin
    );
  }
  const photo = security.validatePhotoBytes(decoded.buffer);
  if (photo.error) {
    return util.errorResponse(photo.status || 400, 'Para calificar, sube la foto del después. ' + photo.error, origin);
  }

  const key = storeLib.photoKey(report.id, 'despues', photo.ext);
  await storeLib.savePhoto(store, key, photo.buffer, photo.contentType);

  report.rating = {
    stars,
    comment,
    by: report.reporterName || '',
    afterPhotoKey: key,
    afterPhotoContentType: photo.contentType,
    afterPhotoUrl: util.photoUrlFor(key),
    createdAt: now,
  };
  const from = report.status;
  report.status = 'cerrado'; // CIERRE TERMINAL (contrato §8)
  report.version = (report.version || 1) + 1;
  util.pushHistory(report, 'ciudadano', from, 'cerrado', 'El ciudadano calificó el trabajo.');
  await storeLib.saveReport(store, report);

  return util.okResponse(
    { report: util.publicReport(report, seal.verifySeal(report)) },
    200,
    origin
  );
});
