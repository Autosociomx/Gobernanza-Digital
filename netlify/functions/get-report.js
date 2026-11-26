// GET /.netlify/functions/get-report?id=orb-YYYYMMDD-xxxxxx
//   o /.netlify/functions/get-report?folio=ORBE-YYYYMMDD-HHMMSS
//   o /.netlify/functions/get-report?id=ORBE-YYYYMMDD-HHMMSS
// Devuelve un solo reporte con su evidencia y su calificación.
// Acepta buscar por id interno del backend Y por folio visible al ciudadano.
'use strict';

const util = require('./lib/util');
const storeLib = require('./lib/store');

exports.handler = async (event, context) => {
  storeLib.connect(event, context);
  if (event.httpMethod === 'OPTIONS') return util.okResponse({});
  if (event.httpMethod !== 'GET') {
    return util.errorResponse(405, 'Método no permitido.');
  }

  const params = event.queryStringParameters || {};
  const key =
    (typeof params.id === 'string' && params.id) ||
    (typeof params.folio === 'string' && params.folio) ||
    '';
  if (!key) return util.errorResponse(400, 'Falta el identificador del reporte.');

  const store = storeLib.getStore();
  const report = await storeLib.getReportByIdOrFolio(store, key);
  if (!report) return util.errorResponse(404, 'Ese reporte no existe en el tablero.');

  const out = Object.assign({}, report);
  out.status = report.status === 'pendiente' ? 'recibido' : report.status;
  out.folio = report.folio || util.folioVisibleFromCreatedAt(report.createdAt);
  out.folioOrigen = report.folioOrigen || '';
  out.dependencia = report.dependencia || util.dependenciaForService(report.service);
  out.reporterName = report.reporterName || '';
  out.photoUrl = report.photoUrl || (report.photoKey ? util.photoUrlFor(report.photoKey) : null);
  out.photoNote = report.photoNote || (report.photoKey ? '' : 'Sin foto');
  out.evidence = (report.evidence || []).map((e) => ({
    by: e.by,
    note: e.note || '',
    photoUrl: e.photoUrl || (e.photoKey ? util.photoUrlFor(e.photoKey) : null),
    createdAt: e.createdAt,
  }));
  return util.okResponse({ report: out });
};
