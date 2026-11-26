// POST /.netlify/functions/add-evidence
// La dependencia (o quien atiende el reporte) sube su evidencia del trabajo.
// Body JSON: { id, byName, note?, photoDataUrl }
// "id" acepta el id interno del backend o el folio visible "ORBE-YYYYMMDD-HHMMSS".
// La evidencia es la foto del trabajo realizado.
// Regla del ciclo de 6 estados (Sesión 21, 25 nov 2026):
//   - la evidencia mueve el reporte a "atendido" desde "recibido",
//     "derivado" o "en_proceso" (y desde el estado viejo "pendiente");
//   - si el reporte estaba en "no_atendido", la evidencia lo mueve a
//     "en_proceso": la dependencia retomó el caso, no se da por atendido
//     hasta que el ciudadano lo califique.
// Un reporte Cerrado ya no recibe evidencia.
// v1: sin cuentas. Quien responde se identifica con el nombre que escribe.
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
  if (!body) return util.errorResponse(400, 'No se recibió la información de la evidencia.');

  const id = typeof body.id === 'string' ? body.id : '';
  if (!id) return util.errorResponse(400, 'Falta el identificador del reporte.');

  const byName = util.cleanText(body.byName, util.MAX_NAME);
  if (byName.length < 2) {
    return util.errorResponse(400, 'Escribe el nombre de quien sube la evidencia.');
  }

  const note = util.cleanText(body.note, util.MAX_NOTE);

  const photo = util.parseDataUrlPhoto(body.photoDataUrl);
  if (photo.error) return util.errorResponse(400, photo.error);

  const store = storeLib.getStore();
  const report = await storeLib.getReportByIdOrFolio(store, id);
  if (!report) return util.errorResponse(404, 'Ese reporte no existe en el tablero.');
  if (report.status === 'cerrado') {
    return util.errorResponse(400, 'Este reporte ya está cerrado y calificado por el ciudadano.');
  }

  const key = storeLib.photoKey(report.id, 'evidencia-' + Date.now(), photo.ext);
  await storeLib.savePhoto(store, key, photo.buffer, photo.contentType);

  report.evidence = report.evidence || [];
  report.evidence.push({
    by: byName,
    note,
    photoKey: key,
    photoContentType: photo.contentType,
    photoUrl: util.photoUrlFor(key),
    createdAt: new Date().toISOString(),
  });
  // Regla Sesión 21: evidencia desde "no_atendido" -> "en_proceso"
  // (la dependencia retomó el caso); desde recibido/derivado/en_proceso
  // (o el viejo "pendiente") -> "atendido". En "atendido" se queda.
  if (report.status === 'no_atendido') {
    report.status = 'en_proceso';
  } else if (
    report.status === 'recibido' ||
    report.status === 'derivado' ||
    report.status === 'en_proceso' ||
    report.status === 'pendiente'
  ) {
    report.status = 'atendido';
  }

  await storeLib.saveReport(store, report);
  return util.okResponse({ report });
};
