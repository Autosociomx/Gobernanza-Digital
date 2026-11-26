// POST /.netlify/functions/create-report
// Crea un reporte ciudadano. La foto es OPCIONAL y el nombre también.
// Body JSON: { service, description, reporterName?, lat, lng,
//              address?, photoDataUrl?, compartidoDesdeApp?, folioOrigen? }
// Sesión 21 (25 nov 2026) + Ronda 3 (24 nov 2026): el expediente NO pide
// nombre ni fecha de nacimiento; el reporte se identifica solo por folio.
// Sin CURP, sin prometer atención oficial. El reporte nuevo nace con
// status "recibido", con su folio visible "ORBE-YYYYMMDD-HHMMSS" derivado
// de createdAt y con la dependencia derivada del servicio.
// Si body trae "compartidoDesdeApp" con un folio local ORBE-..., ese folio
// se guarda como folioOrigen (trazabilidad con la app local).
// La foto, si viene, se guarda en Netlify Blobs; si no viene, el reporte
// se crea con photoKey null, photoUrl null y la constancia "Sin foto".
// Respuesta 201: { ok, report } con photoUrl lista para mostrar (o null).
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
  if (!body) return util.errorResponse(400, 'No se recibió la información del reporte.');

  const service = typeof body.service === 'string' ? body.service : '';
  if (!util.SERVICES[service]) {
    return util.errorResponse(400, 'Elige el tipo de problema que quieres reportar.');
  }

  const description = util.cleanText(body.description, util.MAX_DESCRIPTION);
  if (description.length < 10) {
    return util.errorResponse(400, 'Describe el problema con al menos 10 caracteres.');
  }

  // Nombre OPCIONAL (Ronda 3): si viene vacío se guarda "" y no se exige.
  // No se pide ni se exige ningún dato personal (ni CURP, ni fecha de
  // nacimiento) para crear un reporte.
  const reporterName = util.cleanText(body.reporterName, util.MAX_NAME);

  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!util.isValidLatLng(lat, lng)) {
    return util.errorResponse(400, 'Marca la ubicación del problema en el mapa.');
  }

  const address = util.cleanText(body.address, 200);

  // Foto OPCIONAL: solo se valida y se guarda si viene una data URL.
  let photo = null;
  if (typeof body.photoDataUrl === 'string' && body.photoDataUrl.trim() !== '') {
    photo = util.parseDataUrlPhoto(body.photoDataUrl);
    if (photo.error) return util.errorResponse(400, photo.error);
  }

  // Folio de origen de la app local: solo si compartidoDesdeApp lo trae
  // y tiene formato ORBE-YYYYMMDD-HHMMSS.
  let folioOrigen = '';
  if (body.compartidoDesdeApp) {
    const candidate =
      typeof body.compartidoDesdeApp === 'string'
        ? body.compartidoDesdeApp
        : typeof body.folioOrigen === 'string'
          ? body.folioOrigen
          : typeof body.folioLocal === 'string'
            ? body.folioLocal
            : '';
    if (/^ORBE-[0-9]{8}-[0-9]{6}$/.test(candidate)) folioOrigen = candidate;
  }

  const now = new Date().toISOString();
  const id = util.newReportId();
  const folio = util.folioVisibleFromCreatedAt(now);
  const dependencia = util.dependenciaForService(service);

  const store = storeLib.getStore();

  let photoKey = null;
  let photoContentType = null;
  let photoUrl = null;
  let photoNote = 'Sin foto';
  if (photo) {
    photoKey = storeLib.photoKey(id, 'antes', photo.ext);
    photoContentType = photo.contentType;
    photoUrl = util.photoUrlFor(photoKey);
    photoNote = '';
    await storeLib.savePhoto(store, photoKey, photo.buffer, photo.contentType);
  }

  const report = {
    id,
    ref: 'Ref. demo ' + util.newRef(),
    folio,
    folioOrigen,
    service,
    dependencia,
    description,
    reporterName,
    lat,
    lng,
    address: address || '',
    status: 'recibido',
    photoKey,
    photoContentType,
    photoUrl,
    photoNote,
    createdAt: now,
    updatedAt: now,
    evidence: [],
    rating: null,
  };

  await storeLib.saveReport(store, report);
  return util.okResponse({ report }, 201);
};
