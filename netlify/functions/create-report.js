// POST /.netlify/functions/create-report
// Crea un reporte ciudadano (contrato §13, Sesión 23).
// Body JSON: { service, description, reporterName?, lat?, lng?, address?,
//              photoDataUrl?, consentPublish, consentContact, phone? }
// - lat/lng opcionales (null sin GPS); si vienen, válidos Y dentro de la
//   geocerca Tepic metro, si no 400.
// - consentPublish/consentContact booleanos (por defecto false). El
//   teléfono solo se guarda si consentContact === true.
// - folioOrigen / compartidoDesdeApp / folioLocal del cliente se IGNORAN
//   (U-16): el folio lo genera el servidor.
// - Sin pepper configurado -> 503 (no se puede hashear el código de autor).
// Respuesta 201: { ok, report (vista pública), authorCode } — el código de
// autor se entrega UNA vez y no se guarda en localStorage.
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
    return util.errorResponse(400, 'No se recibió la información del reporte.', origin);
  }

  const service = typeof body.service === 'string' ? body.service : '';
  if (!util.SERVICES[service]) {
    return util.errorResponse(400, 'Elige el tipo de problema que quieres reportar.', origin);
  }

  const description = util.cleanText(body.description, util.MAX_DESCRIPTION);
  if (description.length < 10) {
    return util.errorResponse(400, 'Describe el problema con al menos 10 caracteres.', origin);
  }

  const reporterName = util.cleanText(body.reporterName, util.MAX_NAME);
  const consentPublish = body.consentPublish === true;
  const consentContact = body.consentContact === true;
  // El teléfono solo se guarda si consentContact === true (contrato §4/§13).
  const phone = consentContact ? util.cleanText(body.phone, util.MAX_PHONE) : null;

  // GPS opcional: null si no hay. Si viene, debe ser válido y dentro de
  // la geocerca Tepic metro; nunca coordenadas fuera de rango.
  let lat = null;
  let lng = null;
  const hasLat = body.lat !== undefined && body.lat !== null && body.lat !== '';
  const hasLng = body.lng !== undefined && body.lng !== null && body.lng !== '';
  if (hasLat || hasLng) {
    lat = Number(body.lat);
    lng = Number(body.lng);
    if (!util.isValidLatLng(lat, lng)) {
      return util.errorResponse(400, 'La ubicación no es válida.', origin);
    }
    if (!util.isInTepicMetro(lat, lng)) {
      return util.errorResponse(400, 'Ubicación fuera de Tepic, Nayarit.', origin);
    }
  }

  const address = util.cleanText(body.address, 200);

  // Foto OPCIONAL: bytes mágicos + EXIF quitado; la etiqueta no decide.
  let photo = null;
  if (typeof body.photoDataUrl === 'string' && body.photoDataUrl.trim() !== '') {
    const decoded = util.parseDataUrlPhoto(body.photoDataUrl);
    if (decoded.error) {
      return util.errorResponse(decoded.status || 400, decoded.error, origin);
    }
    const validated = security.validatePhotoBytes(decoded.buffer);
    if (validated.error) {
      return util.errorResponse(validated.status || 400, validated.error, origin);
    }
    photo = validated;
  }

  // folioOrigen / compartidoDesdeApp / folioLocal se IGNORAN (contrato §13).
  // El servidor genera id (UUID) y folio (ORBE-AAAAMMDD- + 8 base32).

  const store = storeLib.getStore();
  const ip = security.getClientIp(event);

  // Rate limits (contrato §10): 1/minuto/IP y 5/hora/IP.
  const perMinute = await rate.checkRateLimit(store, 'create-report', ip, 1, 60 * 1000);
  if (!perMinute.allowed) return rateLimitResponse(perMinute.retryAfter, origin);
  const perHour = await rate.checkRateLimit(store, 'create-report', ip, 5, 60 * 60 * 1000);
  if (!perHour.allowed) return rateLimitResponse(perHour.retryAfter, origin);

  if (!codes.codesConfigured()) {
    return util.errorResponse(503, 'Configuración incompleta.', origin);
  }

  const authorCode = codes.newAuthorCode();
  const authorCodeHash = codes.hashCode(authorCode);

  const now = new Date().toISOString();
  const id = util.newReportId();
  const folio = util.newFolio();
  const dependencia = util.dependenciaForService(service);

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
    folio,
    folioOrigen: '',
    folioOrigenVerificado: false,
    service,
    dependencia,
    description,
    reporterName,
    phone,
    consentPublish,
    consentContact,
    consentVersion: util.CONSENT_VERSION,
    consentAt: now,
    lat,
    lng,
    address: address || '',
    status: 'recibido',
    version: 1,
    photoKey,
    photoContentType,
    photoUrl,
    photoNote,
    evidence: [],
    rating: null,
    noAtendido: null,
    history: [],
    authorCodeHash,
    seal: { algo: 'HMAC-SHA256', hash: null, at: now, keyId: 'sin_clave' },
    createdAt: now,
    updatedAt: now,
  };
  util.pushHistory(report, 'ciudadano', null, 'recibido', '');

  await storeLib.saveReport(store, report);
  // Índice folio -> id en la misma operación (contrato §13). Si falla, la
  // búsqueda por folio sigue funcionando por migración perezosa.
  try {
    await storeLib.saveFolioIndex(store, folio, id, now);
  } catch (_e) {
    // No se falla la creación por el índice.
  }

  const sealValid = seal.verifySeal(report);
  return util.okResponse(
    { report: util.publicReport(report, sealValid), authorCode },
    201,
    origin
  );
});
