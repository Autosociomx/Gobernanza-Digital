// POST /.netlify/functions/add-rating
// El ciudadano califica el trabajo realizado y cierra su reporte, o marca
// que no se atendió y el caso se reabre.
// Body JSON, dos caminos:
//   A) Calificar y cerrar: { id, stars, comment?, afterPhotoDataUrl, byName? }
//      stars: 1 a 5. La foto del después es obligatoria: es la evidencia del
//      ciudadano de que el trabajo quedó hecho (o no). Un reporte solo se
//      califica una vez; al calificarlo pasa a Cerrado.
//   B) Marcar no atendido: { id, noAtendido: true, photoDataUrl?, comment?, byName? }
//      El reporte pasa a "no_atendido" SIN cerrar. La foto actualizada del
//      problema es opcional; si viene, se guarda como evidencia del ciudadano.
// "id" acepta el id interno del backend o el folio visible "ORBE-YYYYMMDD-HHMMSS".
// v1: sin cuentas. Se confía en que quien califica es quien reportó:
// el tablero muestra el nombre del autor y la calificación queda firmada
// con el nombre que se escribe aquí (opcional; sin nombre queda "").
'use strict';

const util = require('./lib/util');
const storeLib = require('./lib/store');

exports.handler = async (event, context) => {
  storeLib.connect(event, context);
  if (event.httpMethod === 'OPTIONS') return util.okResponse({});
  if (event.httpMethod !== 'POST') {
    return util.errorResponse(405, 'Método no permitido.');
  }

  const body = util.parseJsonBody(event);
  if (!body) return util.errorResponse(400, 'No se recibió la información de la calificación.');

  const id = typeof body.id === 'string' ? body.id : '';
  if (!id) return util.errorResponse(400, 'Falta el identificador del reporte.');

  const comment = util.cleanText(body.comment, util.MAX_NOTE);
  const byName = util.cleanText(body.byName, util.MAX_NAME);

  const store = storeLib.getStore();
  const report = await storeLib.getReportByIdOrFolio(store, id);
  if (!report) return util.errorResponse(404, 'Ese reporte no existe en el tablero.');

  // Camino B: marcar no atendido (reabrir). No cierra el reporte y no
  // exige calificación. Vale desde atendido, en proceso, derivado o
  // recibido, y también reabre uno cerrado.
  if (body.noAtendido === true) {
    let photoKey = null;
    let photoUrl = null;
    if (typeof body.photoDataUrl === 'string' && body.photoDataUrl.trim() !== '') {
      const photo = util.parseDataUrlPhoto(body.photoDataUrl);
      if (photo.error) return util.errorResponse(400, photo.error);
      photoKey = storeLib.photoKey(report.id, 'no-atendido-' + Date.now(), photo.ext);
      await storeLib.savePhoto(store, photoKey, photo.buffer, photo.contentType);
      photoUrl = util.photoUrlFor(photoKey);
      report.evidence = report.evidence || [];
      report.evidence.push({
        by: byName || report.reporterName || 'Ciudadano',
        note: comment || 'El ciudadano marcó el reporte como no atendido.',
        photoKey,
        photoContentType: photo.contentType,
        photoUrl,
        createdAt: new Date().toISOString(),
      });
    }
    report.noAtendido = {
      by: byName || report.reporterName || '',
      comment,
      photoKey,
      photoUrl,
      createdAt: new Date().toISOString(),
    };
    report.status = 'no_atendido';

    await storeLib.saveReport(store, report);
    return util.okResponse({ report });
  }

  // Camino A: calificar y cerrar (como antes).
  const stars = Number(body.stars);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return util.errorResponse(400, 'La calificación es de 1 a 5 estrellas.');
  }

  const photo = util.parseDataUrlPhoto(body.afterPhotoDataUrl);
  if (photo.error) {
    return util.errorResponse(400, 'Para calificar, sube la foto del después. ' + photo.error);
  }

  if (report.rating) {
    return util.errorResponse(400, 'Este reporte ya fue calificado.');
  }
  if (report.status === 'cerrado') {
    return util.errorResponse(400, 'Este reporte ya está cerrado.');
  }

  const key = storeLib.photoKey(report.id, 'despues', photo.ext);
  await storeLib.savePhoto(store, key, photo.buffer, photo.contentType);

  report.rating = {
    stars,
    comment,
    by: byName || report.reporterName,
    afterPhotoKey: key,
    afterPhotoContentType: photo.contentType,
    afterPhotoUrl: util.photoUrlFor(key),
    createdAt: new Date().toISOString(),
  };
  report.status = 'cerrado';

  await storeLib.saveReport(store, report);
  return util.okResponse({ report });
};
