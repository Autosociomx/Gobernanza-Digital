// GET /.netlify/functions/list-reports?service=<id>&status=<id>
// Lista pública de reportes, los más recientes primero.
// Filtros opcionales: service (agua, bache, luminaria, basura, drenaje,
// riesgo_vial, parques) y status (recibido, derivado, en_proceso,
// atendido, cerrado, no_atendido). El filtro viejo "pendiente" se acepta
// como alias de "recibido". Sin filtros devuelve todo.
// Si aún no hay reportes: { ok, reports: [], total: 0 }.
'use strict';

const util = require('./lib/util');
const storeLib = require('./lib/store');

function publicReport(r) {
  // Compatibilidad: reportes viejos con status "pendiente" se muestran
  // como "recibido", y sin campo folio se deriva de createdAt.
  const status = r.status === 'pendiente' ? 'recibido' : r.status;
  return {
    id: r.id,
    ref: r.ref,
    folio: r.folio || util.folioVisibleFromCreatedAt(r.createdAt),
    folioOrigen: r.folioOrigen || '',
    service: r.service,
    dependencia: r.dependencia || util.dependenciaForService(r.service),
    description: r.description,
    reporterName: r.reporterName || '',
    lat: r.lat,
    lng: r.lng,
    address: r.address || '',
    status,
    photoKey: r.photoKey || null,
    photoUrl: r.photoUrl || (r.photoKey ? util.photoUrlFor(r.photoKey) : null),
    photoNote: r.photoNote || (r.photoKey ? '' : 'Sin foto'),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    evidence: (r.evidence || []).map((e) => ({
      by: e.by,
      note: e.note || '',
      photoUrl: e.photoUrl || (e.photoKey ? util.photoUrlFor(e.photoKey) : null),
      createdAt: e.createdAt,
    })),
    rating: r.rating || null,
    noAtendido: r.noAtendido || null,
  };
}

exports.handler = async (event, context) => {
  storeLib.connect(event, context);
  if (event.httpMethod === 'OPTIONS') return util.okResponse({});
  if (event.httpMethod !== 'GET') {
    return util.errorResponse(405, 'Método no permitido.');
  }

  const params = event.queryStringParameters || {};
  const service = typeof params.service === 'string' ? params.service : '';
  let status = typeof params.status === 'string' ? params.status : '';
  if (status === 'pendiente') status = 'recibido';

  if (service && !util.SERVICES[service]) {
    return util.errorResponse(400, 'Ese tipo de problema no existe en el tablero.');
  }
  if (status && !util.STATUSES[status]) {
    return util.errorResponse(400, 'Ese estado no existe en el tablero.');
  }

  const store = storeLib.getStore();
  let reports = await storeLib.listReports(store);
  if (service) reports = reports.filter((r) => r.service === service);
  if (status) {
    reports = reports.filter((r) => {
      const s = r.status === 'pendiente' ? 'recibido' : r.status;
      return s === status;
    });
  }

  return util.okResponse({
    reports: reports.map(publicReport),
    total: reports.length,
  });
};
