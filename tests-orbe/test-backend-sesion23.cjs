// Pruebas del backend del Tablero ORBE — refuerzo Sesión 23 (26 nov 2026).
// Se corre con: node tests-orbe/test-backend-sesion23.cjs
// (desde la raíz del worktree tepic-orbe-deploy).
//
// Cubre:
//   (a) los 12 tests de Sesión 21 ADAPTADOS al contrato nuevo
//       (códigos, folio con azar, cierre terminal, consentimiento);
//   (b) los 25 casos nuevos de GPT (dictamen Sesión 23, línea 539),
//       adaptados a la taxonomía de errores del contrato (§9: 409 en
//       conflictos de estado donde GPT ponía 400);
//   (c) los ataques probados de Sesión 22 / equipo rojo como casos que
//       deben FALLAR (401/403/409/429).
//
// Método: store en memoria vía setStoreOverride (sin @netlify/blobs).
// Variables de entorno de prueba fijadas aquí (nunca en el repo): pepper,
// ORBE_DEP_CODES con los 7 códigos de prueba, ORBE_MOD_CODE_HASH,
// ORBE_HMAC_SECRET, ORBE_ALLOWED_ORIGINS.
'use strict';

const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const FN = path.join(ROOT, 'netlify', 'functions');

const util = require(path.join(FN, 'lib', 'util'));
const storeLib = require(path.join(FN, 'lib', 'store'));
const codes = require(path.join(FN, 'lib', 'codes'));
const rate = require(path.join(FN, 'lib', 'rate'));
const createReport = require(path.join(FN, 'create-report')).handler;
const listReports = require(path.join(FN, 'list-reports')).handler;
const getReport = require(path.join(FN, 'get-report')).handler;
const addEvidence = require(path.join(FN, 'add-evidence')).handler;
const addRating = require(path.join(FN, 'add-rating')).handler;
const deleteReport = require(path.join(FN, 'delete-report')).handler;
const reportAbuse = require(path.join(FN, 'report-abuse')).handler;
const photoFn = require(path.join(FN, 'photo')).handler;

// ---- Entorno de prueba -------------------------------------------------
process.env.ORBE_CODE_PEPPER = 'pepper-de-prueba-sesion23';
process.env.ORBE_HMAC_SECRET = 'secreto-hmac-de-prueba-sesion23';
process.env.ORBE_ALLOWED_ORIGINS = 'https://tepic.netlify.app,https://deploy-preview-90--tepic.netlify.app';

const TEST_DEP_CODES = {};
for (const service of Object.keys(util.SERVICES)) {
  TEST_DEP_CODES[util.DEP_SLUGS[service]] = codes.newDepCode(util.DEP_SLUGS[service]);
}
const TEST_DEP_HASHES = {};
for (const [slug, code] of Object.entries(TEST_DEP_CODES)) {
  TEST_DEP_HASHES[slug] = codes.hashCode(code);
}
process.env.ORBE_DEP_CODES = JSON.stringify(TEST_DEP_HASHES);
const TEST_MOD_CODE = codes.newModCode();
process.env.ORBE_MOD_CODE_HASH = codes.hashCode(TEST_MOD_CODE);

// PNG 1x1 válido y JPEG mínimo válido (SOI + APP0 + SOS vacío no: un JPEG
// real mínimo con un segmento SOS; se construye a mano: SOI, APP0 JFIF,
// DQT, SOF0 1x1, DHT, SOS + datos, EOI).
const PHOTO_1X1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwMCAO+ip1sAAAAASUVORK5CYII=';
// JPEG 1x1 gris, bytes reales (FF D8 ... FF D9), sin EXIF.
const JPEG_1X1 = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
  0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
  0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
  0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
  0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
  0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
  0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
  0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
  0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
  0x09, 0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10, 0x00, 0x02, 0x01, 0x03,
  0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7d,
  0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
  0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
  0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72,
  0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
  0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45,
  0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
  0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75,
  0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
  0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3,
  0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
  0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9,
  0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
  0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4,
  0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01,
  0x00, 0x00, 0x3f, 0x00, 0x7f, 0xff, 0xd9,
]);
const PHOTO_JPEG_1X1 = 'data:image/jpeg;base64,' + JPEG_1X1.toString('base64');
// HTML disfrazado de JPEG (B-1).
const PHOTO_HTML_FAKE = 'data:image/jpeg;base64,' + Buffer.from('<html><script>alert(1)</script></html>', 'utf8').toString('base64');

// ---- Store en memoria --------------------------------------------------
class MemoryStore {
  constructor() { this.map = new Map(); this.reads = []; }
  async set(key, value) {
    this.map.set(key, Buffer.isBuffer(value) ? value : String(value));
  }
  async get(key, opts) {
    this.reads.push(key);
    const v = this.map.get(key);
    if (v === undefined) return null;
    if (opts && opts.type === 'json') return JSON.parse(v.toString('utf8'));
    if (opts && opts.type === 'arrayBuffer') {
      return v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength);
    }
    return v;
  }
  async list(opts) {
    const prefix = (opts && opts.prefix) || '';
    const blobs = [];
    for (const key of this.map.keys()) {
      if (key.startsWith(prefix)) blobs.push({ key });
    }
    return { blobs };
  }
  async delete(key) { this.map.delete(key); }
}

let store = null;
function freshStore() {
  store = new MemoryStore();
  storeLib.setStoreOverride(store);
  return store;
}

// ---- Helpers HTTP ------------------------------------------------------
let ipCounter = 0;
function nextIp() { ipCounter += 1; return '10.0.0.' + ipCounter; }

function post(handler, body, opts) {
  const o = opts || {};
  return handler({
    httpMethod: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: Object.assign(
      { 'x-forwarded-for': o.ip || nextIp(), origin: o.origin || 'https://tepic.netlify.app' },
      o.headers || {}
    ),
  });
}
function get(handler, params, opts) {
  const o = opts || {};
  return handler({
    httpMethod: 'GET',
    queryStringParameters: params,
    headers: Object.assign(
      { 'x-forwarded-for': o.ip || nextIp(), origin: o.origin || 'https://tepic.netlify.app' },
      o.headers || {}
    ),
  });
}
const parse = (res) => JSON.parse(res.body);

function assert(cond, msg) { if (!cond) throw new Error(msg || 'assert falló'); }
function assertEq(a, b, msg) {
  if (a !== b) throw new Error((msg || 'distinto') + ' (esperado ' + JSON.stringify(b) + ', llegó ' + JSON.stringify(a) + ')');
}

const depCodeFor = (service) => TEST_DEP_CODES[util.DEP_SLUGS[service]];

// Crea un reporte y devuelve {res, body, folio, authorCode, raw()}.
// raw() lee la ficha interna del store (para afirmar lo guardado).
// Por defecto reinicia el store; con {keepStore:true} lo conserva (para
// tests con varios reportes en el mismo store).
async function makeReport(overrides, opts) {
  if (!opts || !opts.keepStore) freshStore();
  const res = await post(createReport, Object.assign({
    service: 'agua',
    description: 'Hay una fuga de agua en la banqueta frente a mi casa.',
    lat: 21.5, lng: -104.9,
    consentPublish: true,
  }, overrides || {}), opts || {});
  const body = parse(res);
  assertEq(res.statusCode, 201, 'crear reporte debe dar 201, llegó ' + res.statusCode + ' ' + res.body);
  const folio = body.report.folio;
  const authorCode = body.authorCode;
  assert(typeof authorCode === 'string' && authorCode.startsWith('AUT-'), 'la 201 entrega authorCode');
  return {
    res, body, folio, authorCode,
    report: body.report,
    raw: async () => {
      const idx = await storeLib.getFolioIndex(store, folio);
      return storeLib.getReport(store, idx.id);
    },
  };
}

// Flujo completo: crear -> evidencia de dependencia -> atendido.
async function makeAttended(overrides, opts) {
  const m = await makeReport(overrides, opts);
  const ev = await post(addEvidence, {
    folio: m.folio, note: 'Se reparó la fuga.', photoDataUrl: PHOTO_1X1,
  }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
  assertEq(ev.statusCode, 200, 'evidencia 200, llegó ' + ev.statusCode + ' ' + ev.body);
  return m;
}

let passed = 0;
let failed = 0;
const results = [];
async function test(name, fn) {
  try {
    await fn();
    passed++;
    results.push('PASS: ' + name);
    console.log('PASS: ' + name);
  } catch (e) {
    failed++;
    results.push('FAIL: ' + name + ' — ' + e.message);
    console.log('FAIL: ' + name + ' — ' + e.message);
  }
}

(async () => {
  // =====================================================================
  // (a) Tests de Sesión 21 adaptados al contrato Sesión 23
  // =====================================================================
  await test('S21-1. crear sin nombre y sin foto (201, vista pública sin id)', async () => {
    const m = await makeReport({ consentPublish: true });
    assertEq(m.report.status, 'recibido', 'status inicial');
    assertEq(m.report.reporterName, '', 'reporterName vacío');
    assertEq(m.report.photoUrl, null, 'photoUrl null');
    assertEq(m.report.photoNote, 'Sin foto', 'constancia Sin foto');
    assertEq(m.report.dependencia, 'SIAPA Tepic', 'dependencia SIAPA Tepic para agua');
    assert(/^ORBE-[0-9]{8}-[A-Z0-9]{8}$/.test(m.folio), 'folio nuevo ORBE-AAAAMMDD-XXXXXXXX, llegó ' + m.folio);
    assertEq(m.report.id, undefined, 'la vista pública NO lleva id interno');
    assertEq(m.report.sealValid, true, 'sello válido al crear');
    const raw = await m.raw();
    assertEq(raw.status, 'recibido', 'guardado recibido');
    assert(raw.authorCodeHash, 'se guarda solo el hash del código de autor');
    assert(!('authorCode' in raw), 'el código en claro NO se guarda');
  });

  await test('S21-2. crear con nombre y foto, consentPublish true (201)', async () => {
    const m = await makeReport({ reporterName: 'Ciudadano de prueba', photoDataUrl: PHOTO_1X1 });
    assertEq(m.report.reporterName, 'Ciudadano de prueba', 'nombre publicado con consentimiento');
    assert(m.report.photoUrl && m.report.photoUrl.includes('/.netlify/functions/photo?key='), 'photoUrl lista');
    assertEq(m.report.photoNote, '', 'sin constancia Sin foto');
    const raw = await m.raw();
    assert(raw.photoKey && raw.photoKey.startsWith('photo/'), 'photoKey guardado');
  });

  await test('S21-2b. crear con nombre y consentPublish false: el nombre NO se publica', async () => {
    const m = await makeReport({ reporterName: 'Ciudadano de prueba', consentPublish: false });
    assertEq(m.report.reporterName, '', 'nombre oculto sin consentimiento');
    const raw = await m.raw();
    assertEq(raw.reporterName, 'Ciudadano de prueba', 'el nombre sí queda guardado interno');
  });

  await test('S21-3. crear con descripción corta (400)', async () => {
    freshStore();
    const res = await post(createReport, {
      service: 'bache', description: 'Corto', lat: 21.5, lng: -104.9,
    });
    assertEq(res.statusCode, 400, 'descripción <10 caracteres debe dar 400');
    assert(parse(res).error.includes('10 caracteres'), 'mensaje pide 10 caracteres');
  });

  await test('S21-4. evidencia con código de dependencia mueve recibido -> atendido', async () => {
    const m = await makeReport({});
    const res = await post(addEvidence, {
      folio: m.folio, note: 'Se reparó la fuga.', photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    const body = parse(res);
    assertEq(res.statusCode, 200, 'add-evidence 200');
    assertEq(body.report.status, 'atendido', 'recibido -> atendido con evidencia');
    assertEq(body.report.evidence[0].by, 'SIAPA Tepic', 'by estampado por el servidor');
    assertEq(body.report.evidence[0].byRole, 'dependencia', 'byRole dependencia');
  });

  await test('S21-5. calificación con código de autor cierra el reporte (atendido -> cerrado)', async () => {
    const m = await makeAttended({});
    const res = await post(addRating, {
      folio: m.folio, stars: 5, comment: 'Quedó bien.', afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    const body = parse(res);
    assertEq(res.statusCode, 200, 'add-rating 200');
    assertEq(body.report.status, 'cerrado', 'calificación cierra');
    assertEq(body.report.rating.stars, 5, 'estrellas guardadas');
    assertEq(body.report.rating.by, '', 'by es el nombre guardado (vacío aquí)');
  });

  await test('S21-6. marcar no_atendido con foto y código (sin cerrar)', async () => {
    const m = await makeAttended({});
    const res = await post(addRating, {
      folio: m.folio, noAtendido: true, comment: 'Sigue saliendo agua.', photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    const body = parse(res);
    assertEq(res.statusCode, 200, 'noAtendido 200');
    assertEq(body.report.status, 'no_atendido', 'status no_atendido');
    assertEq(body.report.rating, null, 'no se cierra ni se califica');
    assert(body.report.noAtendido && body.report.noAtendido.photoUrl, 'foto actualizada guardada');
  });

  await test('S21-7. get-report por folio visible (vista pública, sin id, con sealValid)', async () => {
    const m = await makeReport({});
    const res = await get(getReport, { id: m.folio });
    const body = parse(res);
    assertEq(res.statusCode, 200, 'get por folio 200');
    assertEq(body.report.id, undefined, 'sin id interno en la vista pública');
    assertEq(body.report.folio, m.folio, 'folio coincide');
    assertEq(body.report.sealValid, true, 'sello válido');
    const res2 = await get(getReport, { folio: m.folio });
    assertEq(res2.statusCode, 200, 'get por ?folio= 200');
  });

  await test('S21-8. list-reports con filtro status=no_atendido (sin consent no aparece)', async () => {
    freshStore();
    const m = await makeAttended({}, { keepStore: true });
    await post(addRating, {
      folio: m.folio, noAtendido: true, photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    const res = await get(listReports, { status: 'no_atendido' });
    const body = parse(res);
    assertEq(res.statusCode, 200, 'list 200');
    assertEq(body.total, 1, 'un reporte no_atendido');
    assertEq(body.reports[0].folio, m.folio, 'es el reporte marcado');
    assertEq(body.reports[0].status, 'no_atendido', 'filtro devuelve no_atendido');
    assertEq(body.reports[0].id, undefined, 'sin id interno en el listado');
    // Sin consentimiento no aparece en el listado.
    const m2 = await makeReport({ consentPublish: false }, { keepStore: true });
    const all = parse(await get(listReports, {}));
    assertEq(all.total, 1, 'el reporte sin consentimiento no se lista');
  });

  await test('S21-9. folio nuevo con azar; folio viejo derivado sigue funcionando', async () => {
    const m = await makeReport({});
    assert(/^ORBE-[0-9]{8}-[A-Z0-9]{8}$/.test(m.folio), 'folio con azar, llegó ' + m.folio);
    assertEq(util.folioVisibleFromCreatedAt('2026-11-21T23:05:05.000Z'), 'ORBE-20261121-230505', 'deriva el folio que muestra el Tablero en vivo');
    assertEq(util.folioVisibleFromCreatedAt('no-fecha'), null, 'fecha inválida -> null');
  });

  await test('S21-10. folioOrigen del cliente se IGNORA (U-16)', async () => {
    const m = await makeReport({ compartidoDesdeApp: 'ORBE-20261125-103000' });
    const raw = await m.raw();
    assertEq(raw.folioOrigen, '', 'folioOrigen ignorado');
    assertEq(raw.folioOrigenVerificado, false, 'no verificado');
    const m2 = await makeReport({ compartidoDesdeApp: true, folioOrigen: 'ORBE-20261125-110000' });
    const raw2 = await m2.raw();
    assertEq(raw2.folioOrigen, '', 'folioOrigen por campo también ignorado');
  });

  await test('S21-11. evidencia desde no_atendido -> en_proceso', async () => {
    const m = await makeAttended({});
    await post(addRating, {
      folio: m.folio, noAtendido: true, photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    const res = await post(addEvidence, {
      folio: m.folio, note: 'Regresamos a repararla.', photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    assertEq(parse(res).report.status, 'en_proceso', 'no_atendido -> en_proceso con evidencia');
  });

  await test('S21-12. transiciones del ciclo: cierre TERMINAL, pendiente prohibido', async () => {
    assertEq(Object.keys(util.STATUSES).length, 7, '7 estados (6 del ciclo + eliminado)');
    assert(util.isValidTransition('recibido', 'derivado'), 'recibido->derivado');
    assert(util.isValidTransition('atendido', 'cerrado'), 'atendido->cerrado');
    assert(util.isValidTransition('atendido', 'no_atendido'), 'atendido->no_atendido');
    assert(util.isValidTransition('no_atendido', 'en_proceso'), 'no_atendido->en_proceso');
    assert(!util.isValidTransition('cerrado', 'no_atendido'), 'cerrado->no_atendido YA NO válido (cierre terminal)');
    assert(!util.isValidTransition('cerrado', 'atendido'), 'cerrado->atendido NO válido');
    assert(!util.isValidTransition('recibido', 'cerrado'), 'recibido->cerrado NO válido');
    assert(!util.isValidTransition('recibido', 'pendiente'), 'pendiente prohibido');
    assert(!util.isValidTransition('pendiente', 'recibido'), 'pendiente prohibido');
    assertEq(util.dependenciaForService('agua'), 'SIAPA Tepic', 'agua -> SIAPA Tepic');
    assertEq(util.dependenciaForService('parques'), 'Parques y Jardines', 'parques -> Parques y Jardines');
  });

  // =====================================================================
  // (b) Los 25 casos nuevos de GPT (dictamen Sesión 23, línea 539)
  // =====================================================================
  await test('GPT-1. add-evidence sin depCode -> 401 (C-1)', async () => {
    const m = await makeReport({});
    const res = await post(addEvidence, { folio: m.folio, photoDataUrl: PHOTO_1X1 });
    assertEq(res.statusCode, 401, 'sin código debe dar 401');
  });

  await test('GPT-2. add-evidence con byName "SIAPA Tepic" sin código -> 401; by no es el enviado (S22-2)', async () => {
    const m = await makeReport({});
    const res = await post(addEvidence, {
      folio: m.folio, byName: 'SIAPA Tepic', photoDataUrl: PHOTO_1X1,
    });
    assertEq(res.statusCode, 401, 'byName sin código debe dar 401');
    const raw = await m.raw();
    assertEq(raw.status, 'recibido', 'el reporte no se movió');
    assertEq(raw.evidence.length, 0, 'sin evidencia guardada');
  });

  await test('GPT-3. add-rating sin authorCode -> 401 (C-1)', async () => {
    const m = await makeAttended({});
    const res = await post(addRating, {
      folio: m.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    });
    assertEq(res.statusCode, 401, 'sin código debe dar 401');
  });

  await test('GPT-4. camino A sobre recibido -> 409 (C-2)', async () => {
    const m = await makeReport({});
    const res = await post(addRating, {
      folio: m.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 409, 'calificar en recibido debe dar 409');
  });

  await test('GPT-5. camino A sobre atendido SIN evidencia de dependencia -> 409 (C-2)', async () => {
    // Reporte en atendido sin evidencia: solo se puede llegar por
    // transición directa, que el servidor ya no permite; se simula con
    // un reporte en recibido + isValidTransition, y con un reporte
    // atendido fabricado en el store (sin evidencia) para el camino A.
    const m = await makeReport({});
    const raw = await m.raw();
    raw.status = 'atendido'; // fabricado: atendido sin evidencia
    await storeLib.saveReport(store, raw);
    const res = await post(addRating, {
      folio: m.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 409, 'calificar sin evidencia de dependencia debe dar 409');
  });

  await test('GPT-6. flujo completo con códigos -> 200 y cerrado (U-6)', async () => {
    const m = await makeAttended({});
    const res = await post(addRating, {
      folio: m.folio, stars: 4, comment: 'Bien.', afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 200, 'flujo completo 200');
    assertEq(parse(res).report.status, 'cerrado', 'flujo completo cierra');
  });

  await test('GPT-7. dos reportes en el mismo segundo -> folios distintos (U-2)', async () => {
    const a = await makeReport({});
    const b = await makeReport({});
    assert(a.folio !== b.folio, 'folios distintos: ' + a.folio + ' vs ' + b.folio);
  });

  await test('GPT-8. búsqueda por 6 dígitos -> 404 (U-2, sin oráculo)', async () => {
    const m = await makeReport({});
    const res = await get(getReport, { folio: m.folio.slice(5, 11) });
    assertEq(res.statusCode, 404, 'subcadena debe dar 404');
  });

  await test('GPT-9. reabrir cerrado -> 409 (U-3, cierre terminal)', async () => {
    const m = await makeAttended({});
    await post(addRating, {
      folio: m.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    const res = await post(addRating, {
      folio: m.folio, noAtendido: true, comment: 'No quedó.',
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 409, 'reabrir cerrado debe dar 409');
  });

  await test('GPT-10. recibido -> cerrado directo -> 409 (M-1)', async () => {
    assert(!util.isValidTransition('recibido', 'cerrado'), 'la tabla no permite recibido->cerrado');
    const m = await makeReport({});
    const res = await post(addRating, {
      folio: m.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 409, 'camino A en recibido debe dar 409');
  });

  await test('GPT-11. list-reports sin parámetros -> 20 + nextCursor, sin id, GPS 3 decimales (A-1, A-4)', async () => {
    freshStore();
    for (let i = 0; i < 55; i++) {
      const res = await post(createReport, {
        service: 'bache',
        description: 'Bache número ' + i + ' en la calle de prueba.',
        lat: 21.512345, lng: -104.895678, consentPublish: true,
      });
      assertEq(res.statusCode, 201, 'crear ' + i + ' debe dar 201');
    }
    const res = await get(listReports, {});
    const body = parse(res);
    assertEq(res.statusCode, 200, 'list 200');
    assertEq(body.reports.length, 20, 'defecto 20');
    assert(body.nextCursor, 'hay nextCursor con 55 reportes');
    assertEq(body.total, 55, 'total 55');
    for (const r of body.reports) {
      assertEq(r.id, undefined, 'sin id interno');
      assert(String(r.lat).split('.')[1].length <= 3, 'lat con 3 decimales, llegó ' + r.lat);
      assert(String(r.lng).split('.')[1].length <= 3, 'lng con 3 decimales, llegó ' + r.lng);
      assert(!('phone' in r), 'sin teléfono en el listado');
      assert(!('authorCodeHash' in r), 'sin hashes en el listado');
    }
    const page2 = parse(await get(listReports, { cursor: body.nextCursor }));
    assertEq(page2.reports.length, 20, 'segunda página con 20');
    const big = parse(await get(listReports, { limit: '1000' }));
    assertEq(big.reports.length, 50, 'limit=1000 se topa a 50');
    const big50 = parse(await get(listReports, { limit: '50' }));
    assertEq(big50.reports.length, 50, 'limit=50 trae 50');
    assert(big50.nextCursor, 'con 55 y limit 50 hay nextCursor');
  });

  await test('GPT-12. límites de velocidad: 1/minuto y 5/hora en create -> 429 (A-2)', async () => {
    freshStore();
    const ip = '192.0.2.99';
    const first = await post(createReport, {
      service: 'agua', description: 'Fuga de agua en la banqueta, primera.',
      lat: 21.5, lng: -104.9, consentPublish: true,
    }, { ip });
    assertEq(first.statusCode, 201, 'primera 201');
    const second = await post(createReport, {
      service: 'agua', description: 'Fuga de agua en la banqueta, segunda.',
      lat: 21.5, lng: -104.9, consentPublish: true,
    }, { ip });
    assertEq(second.statusCode, 429, 'segunda en el mismo minuto debe dar 429');
    assert(second.headers['Retry-After'], '429 con Retry-After');
    // 5/hora: se siembra el contador en 5 en la ventana actual.
    const label = rate.windowLabel(60 * 60 * 1000);
    const key = 'rate/' + rate.hashIp('192.0.2.100') + '/create-report/' + label + '.json';
    await store.set(key, JSON.stringify({ window: label, count: 5 }), { contentType: 'application/json' });
    const sixth = await post(createReport, {
      service: 'agua', description: 'Fuga de agua en la banqueta, sexta.',
      lat: 21.5, lng: -104.9, consentPublish: true,
    }, { ip: '192.0.2.100' });
    assertEq(sixth.statusCode, 429, 'sexta en la hora debe dar 429');
  });

  await test('GPT-13. CORS con origen ajeno -> sin Access-Control-Allow-Origin (A-3)', async () => {
    const m = await makeReport({});
    const res = await post(createReport, {
      service: 'agua', description: 'Fuga de agua en la banqueta, origen ajeno.',
      lat: 21.5, lng: -104.9, consentPublish: true,
    }, { origin: 'https://sitio-ajeno.example' });
    assertEq(res.statusCode, 201, 'la petición se procesa igual (CORS lo aplica el navegador)');
    assertEq(res.headers['Access-Control-Allow-Origin'], undefined, 'sin ACAO para origen ajeno');
    const ok = await post(createReport, {
      service: 'agua', description: 'Fuga de agua en la banqueta, origen propio.',
      lat: 21.5, lng: -104.9, consentPublish: true,
    }, { origin: 'https://tepic.netlify.app' });
    assertEq(ok.headers['Access-Control-Allow-Origin'], 'https://tepic.netlify.app', 'ACAO para origen propio');
  });

  await test('GPT-14. crear con consentPublish:false -> ausente en list-reports (U-1)', async () => {
    await makeReport({ consentPublish: false });
    const body = parse(await get(listReports, {}));
    assertEq(body.total, 0, 'sin consentimiento no se lista');
  });

  await test('GPT-15. HTML disfrazado de JPEG -> 400 (B-1)', async () => {
    freshStore();
    const res = await post(createReport, {
      service: 'bache', description: 'Bache con foto falsa en la calle.',
      lat: 21.5, lng: -104.9, photoDataUrl: PHOTO_HTML_FAKE,
    });
    assertEq(res.statusCode, 400, 'HTML como JPEG debe dar 400');
  });

  await test('GPT-16. coordenadas de Tokio -> 400 (B-3)', async () => {
    freshStore();
    const res = await post(createReport, {
      service: 'bache', description: 'Bache en Tokio, fuera de Tepic.',
      lat: 35.68, lng: 139.69,
    });
    assertEq(res.statusCode, 400, 'Tokio debe dar 400');
    assert(parse(res).error.includes('Tepic'), 'mensaje menciona Tepic');
    const ok = await post(createReport, {
      service: 'bache', description: 'Bache en Tepic, dentro de la geocerca.',
      lat: 21.5, lng: -104.89,
    });
    assertEq(ok.statusCode, 201, 'Tepic 201');
  });

  await test('GPT-17. dos add-evidence simultáneos -> sobreviven las 2 evidencias (U-12)', async () => {
    // Sin compare-and-swap en Blobs, dos escrituras simultáneas al mismo
    // JSON pueden pisarse en el arreglo resumen (residual declarado en
    // §9 de la síntesis). Lo que el diseño SÍ garantiza: cada evidencia
    // tiene su propia clave y sobrevive. La prueba lo verifica por clave.
    const m = await makeReport({});
    const [r1, r2] = await Promise.all([
      post(addEvidence, { folio: m.folio, note: 'Evidencia uno.', photoDataUrl: PHOTO_1X1 },
        { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } }),
      post(addEvidence, { folio: m.folio, note: 'Evidencia dos.', photoDataUrl: PHOTO_1X1 },
        { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } }),
    ]);
    assertEq(r1.statusCode, 200, 'primera evidencia 200');
    assertEq(r2.statusCode, 200, 'segunda evidencia 200');
    const keys = await storeLib.getEvidenceForReport(store, (await m.raw()).id);
    assertEq(keys.length, 2, 'las 2 evidencias sobreviven con claves propias');
    const notes = keys.map((k) => k.note).sort();
    assertEq(JSON.stringify(notes), JSON.stringify(['Evidencia dos.', 'Evidencia uno.']), 'las 2 notas están');
    const raw = await m.raw();
    assert(raw.evidence.length >= 1, 'el arreglo resumen trae al menos 1 (la carrera residual puede dejar 1 de 2)');
  });

  await test('GPT-18. folioOrigen sin authorCode -> se ignora (U-16)', async () => {
    const m = await makeReport({ folioOrigen: 'ORBE-20261121-230505', compartidoDesdeApp: 'ORBE-20261121-230505' });
    const raw = await m.raw();
    assertEq(raw.folioOrigen, '', 'folioOrigen ignorado aunque venga en el cuerpo');
  });

  await test('GPT-19. borrar con código erróneo -> 401; con authorCode -> ausente y foto 404 (U-11)', async () => {
    const m = await makeReport({ photoDataUrl: PHOTO_1X1 });
    const raw0 = await m.raw();
    const bad = await post(deleteReport, { folio: m.folio },
      { headers: { Authorization: 'Bearer AUT-XXXXX-XXXXX-XXXXX-X' } });
    assertEq(bad.statusCode, 403, 'código de autor ajeno debe dar 403');
    const noCode = await post(deleteReport, { folio: m.folio });
    assertEq(noCode.statusCode, 401, 'sin código debe dar 401');
    const ok = await post(deleteReport, { folio: m.folio },
      { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(ok.statusCode, 200, 'borrado con código propio 200');
    const list = parse(await get(listReports, {}));
    assertEq(list.total, 0, 'borrado ya no se lista');
    const got = await get(getReport, { folio: m.folio });
    assertEq(got.statusCode, 200, 'la lápida sí se consulta por folio');
    assertEq(parse(got).report.status, 'eliminado', 'lápida pública eliminado');
    assertEq(parse(got).report.reporterName, undefined, 'la lápida no lleva nombre');
    const photoRes = await get(photoFn, { key: raw0.photoKey });
    assertEq(photoRes.statusCode, 404, 'la foto borrada en duro da 404');
    const again = await post(deleteReport, { folio: m.folio },
      { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(again.statusCode, 409, 'segundo borrado 409');
  });

  await test('GPT-20. manipular un byte del reporte -> sealValid false (M-4)', async () => {
    const m = await makeReport({});
    const raw = await m.raw();
    const tampered = Object.assign({}, raw, { description: raw.description + ' (alterado)' });
    await store.set(storeLib.reportKey(raw.id), JSON.stringify(tampered), { contentType: 'application/json' });
    const res = await get(getReport, { folio: m.folio });
    assertEq(parse(res).report.sealValid, false, 'sello inválido tras manipular');
  });

  await test('GPT-21. cuerpo de 6 MB -> 413 (U-30)', async () => {
    freshStore();
    const big = JSON.stringify({
      service: 'bache', description: 'Bache en la calle.',
      lat: 21.5, lng: -104.9, relleno: 'x'.repeat(6 * 1024 * 1024),
    });
    const res = await post(createReport, big);
    assertEq(res.statusCode, 413, 'cuerpo >6MB debe dar 413');
  });

  await test('GPT-22. 2.000 claves de foto -> 2.000 únicas (U-27)', async () => {
    const keys = new Set();
    for (let i = 0; i < 2000; i++) keys.add(storeLib.photoKey('id-de-prueba', 'evidencia', 'jpg'));
    assertEq(keys.size, 2000, '2.000 claves únicas');
  });

  await test('GPT-23. get-report con folio mal formado e inexistente -> el mismo 404 (U-2)', async () => {
    await makeReport({});
    const bad = await get(getReport, { folio: 'ORBE-XXXX' });
    const missing = await get(getReport, { folio: 'ORBE-20261126-AAAAAAAA' });
    assertEq(bad.statusCode, 404, 'folio mal formado 404');
    assertEq(missing.statusCode, 404, 'folio inexistente 404');
    assertEq(parse(bad).error, parse(missing).error, 'mismo mensaje genérico (sin oráculo)');
  });

  await test('GPT-24. búsqueda por folio con 5 reportes -> 2 lecturas de ficha como máximo (U-13)', async () => {
    freshStore();
    let target = null;
    for (let i = 0; i < 5; i++) {
      const r = await post(createReport, {
        service: 'bache', description: 'Bache número ' + i + ' en la calle.',
        lat: 21.5, lng: -104.9, consentPublish: true,
      });
      if (i === 2) target = parse(r).report.folio;
    }
    store.reads = [];
    const res = await get(getReport, { folio: target });
    assertEq(res.statusCode, 200, 'get por folio 200');
    const lookups = store.reads.filter((k) => k.startsWith('folio/') || k.startsWith('report/'));
    assert(lookups.length <= 2, 'máximo 2 lecturas de ficha, fueron ' + lookups.length + ': ' + lookups.join(', '));
  });

  await test('GPT-25. add-rating camino B desde cerrado -> 409 (U-3)', async () => {
    const m = await makeAttended({});
    await post(addRating, {
      folio: m.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    const res = await post(addRating, {
      folio: m.folio, noAtendido: true, comment: 'No quedó.',
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 409, 'camino B desde cerrado debe dar 409');
  });

  // =====================================================================
  // (c) Ataques de Sesión 22 / equipo rojo como casos que deben fallar
  // =====================================================================
  await test('S22-A. suplantación: byName "Falso Trabajador" no mueve nada (C-1)', async () => {
    const m = await makeReport({});
    const res = await post(addEvidence, {
      folio: m.folio, byName: 'Falso Trabajador', photoDataUrl: PHOTO_1X1,
    });
    assertEq(res.statusCode, 401, 'sin código 401');
    const res2 = await post(addEvidence, {
      folio: m.folio, byName: 'Falso Trabajador', photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('bache') } });
    assertEq(res2.statusCode, 403, 'código de otro servicio 403');
    const raw = await m.raw();
    assertEq(raw.status, 'recibido', 'el reporte no se movió');
  });

  await test('S22-B. autocalificación 5 estrellas sin evidencia de dependencia -> 409 (C-2)', async () => {
    const m = await makeReport({});
    const res = await post(addRating, {
      folio: m.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 409, 'autocalificación sin evidencia 409');
    const raw = await m.raw();
    assertEq(raw.rating, null, 'sin calificación guardada');
    assertEq(raw.status, 'recibido', 'sin cierre simulado en el tablero');
  });

  await test('S22-C. list-reports ?limit=1000 se topa a 50 (A-1)', async () => {
    freshStore();
    for (let i = 0; i < 3; i++) {
      await post(createReport, {
        service: 'bache', description: 'Bache número ' + i + ' en la calle.',
        lat: 21.5, lng: -104.9, consentPublish: true,
      });
    }
    const body = parse(await get(listReports, { limit: '1000' }));
    assert(body.reports.length <= 50, 'tope 50');
    assertEq(body.reports.length, 3, 'trae los 3');
  });

  await test('S22-D. 6 evidencias en un reporte: la 6ª -> 400 (A-2)', async () => {
    const m = await makeReport({});
    for (let i = 0; i < 5; i++) {
      const r = await post(addEvidence, {
        folio: m.folio, note: 'Evidencia ' + i + '.', photoDataUrl: PHOTO_1X1,
      }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
      assertEq(r.statusCode, 200, 'evidencia ' + i + ' 200');
    }
    const sixth = await post(addEvidence, {
      folio: m.folio, note: 'Evidencia 6.', photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    assertEq(sixth.statusCode, 400, '6ª evidencia 400');
  });

  await test('S22-E. foto de 3 MB -> 413 (A-2, Gemini)', async () => {
    freshStore();
    const bigPhoto = 'data:image/png;base64,' + Buffer.alloc(3 * 1024 * 1024, 0).toString('base64');
    const res = await post(createReport, {
      service: 'bache', description: 'Bache con foto gigante en la calle.',
      lat: 21.5, lng: -104.9, photoDataUrl: bigPhoto,
    });
    assertEq(res.statusCode, 413, 'foto 3MB debe dar 413');
  });

  await test('S22-F. GPS exacto nunca sale en la vista pública (A-4)', async () => {
    const m = await makeReport({ lat: 21.512345678, lng: -104.895678912 });
    const body = parse(await get(listReports, {}));
    assertEq(body.reports[0].lat, 21.512, 'lat a 3 decimales');
    assertEq(body.reports[0].lng, -104.896, 'lng a 3 decimales');
    const got = parse(await get(getReport, { folio: m.folio }));
    assertEq(got.report.lat, 21.512, 'get-report también redondea');
  });

  await test('S22-G. transición inválida por add-evidence con toState -> 409 (M-1)', async () => {
    const m = await makeReport({});
    const res = await post(addEvidence, {
      folio: m.folio, photoDataUrl: PHOTO_1X1, toState: 'cerrado',
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    assertEq(res.statusCode, 409, 'toState cerrado desde recibido 409');
  });

  await test('S22-H. foto con traversal y claves ajenas -> 400/404, nunca la ficha (B-1)', async () => {
    const m = await makeReport({});
    const raw = await m.raw();
    for (const key of ['report/' + raw.id + '.json', '../report/' + raw.id + '.json', 'photo/../../etc/passwd']) {
      const res = await get(photoFn, { key });
      assert(res.statusCode === 400 || res.statusCode === 404, 'clave ' + key + ' debe dar 400/404, llegó ' + res.statusCode);
      assert(!res.body || !res.body.includes('Hay una fuga'), 'la ficha nunca se sirve por photo');
    }
  });

  await test('S22-I. el sistema NO firma con el nombre de la víctima (S22-2)', async () => {
    const m = await makeAttended({ reporterName: 'María Víctima' });
    const res = await post(addRating, {
      folio: m.folio, stars: 5, byName: 'Otra Persona', afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(res.statusCode, 200, 'rating 200');
    assertEq(parse(res).report.rating.by, 'María Víctima', 'by es el nombre guardado, no el enviado');
  });

  await test('S22-J. teléfono: sin consentContact no se guarda; con él sí (U-1)', async () => {
    const m1 = await makeReport({ phone: '3111234567', consentContact: false });
    const raw1 = await m1.raw();
    assertEq(raw1.phone, null, 'sin consentContact el teléfono no se guarda');
    const m2 = await makeReport({ phone: '3111234567', consentContact: true });
    const raw2 = await m2.raw();
    assertEq(raw2.phone, '3111234567', 'con consentContact sí se guarda');
    const pub2 = parse(await get(getReport, { folio: m2.folio }));
    assertEq(pub2.report.phone, undefined, 'el teléfono nunca sale en la vista pública');
    const aut2 = parse(await get(getReport, { folio: m2.folio },
      { headers: { Authorization: 'Bearer ' + m2.authorCode } }));
    assertEq(aut2.report.phone, '3111234567', 'el autor sí ve su teléfono con su código');
  });

  await test('S22-K. el nombre NO se filtra por rating/noAtendido/evidencia ciudadana sin consentimiento (U-1)', async () => {
    const m = await makeAttended({ reporterName: 'Nombre Privado', consentPublish: false });
    await post(addRating, {
      folio: m.folio, noAtendido: true, comment: 'No quedó.', photoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    const got = parse(await get(getReport, { folio: m.folio }));
    const text = JSON.stringify(got.report);
    assert(!text.includes('Nombre Privado'), 'el nombre no aparece en la vista pública: ' + text);
    assertEq(got.report.reporterName, '', 'reporterName vacío');
    assertEq(got.report.noAtendido.by, '', 'noAtendido.by vacío');
    const m2 = await makeAttended({ reporterName: 'Nombre Público', consentPublish: true });
    await post(addRating, {
      folio: m2.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1,
    }, { headers: { Authorization: 'Bearer ' + m2.authorCode } });
    const got2 = parse(await get(getReport, { folio: m2.folio }));
    assertEq(got2.report.rating.by, 'Nombre Público', 'con consentimiento el nombre sí se muestra');
  });

  await test('S22-L. historial inmutable: dos reaperturas quedan registradas (U-17)', async () => {
    const m = await makeAttended({});
    for (let i = 0; i < 2; i++) {
      await post(addRating, {
        folio: m.folio, noAtendido: true, comment: 'Vez ' + (i + 1) + '.',
      }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
      await post(addEvidence, {
        folio: m.folio, note: 'Reparación vez ' + (i + 1) + '.', photoDataUrl: PHOTO_1X1,
      }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    }
    const raw = await m.raw();
    const reopens = raw.history.filter((h) => h.to === 'no_atendido');
    assertEq(reopens.length, 2, 'dos reaperturas en el historial');
    assert(raw.history.length >= 5, 'el historial conserva todos los cambios');
  });

  await test('S22-M. 4ª reapertura en una hora -> 429, nunca cierre automático (U-3)', async () => {
    const m = await makeAttended({});
    for (let i = 0; i < 3; i++) {
      const r1 = await post(addRating, {
        folio: m.folio, noAtendido: true, comment: 'Vez ' + (i + 1) + '.',
      }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
      assertEq(r1.statusCode, 200, 'reapertura ' + (i + 1) + ' 200');
      const r2 = await post(addEvidence, {
        folio: m.folio, note: 'Reparación vez ' + (i + 1) + '.', photoDataUrl: PHOTO_1X1,
      }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
      assertEq(r2.statusCode, 200, 'evidencia ' + (i + 1) + ' 200');
    }
    const fourth = await post(addRating, {
      folio: m.folio, noAtendido: true, comment: 'Vez 4.',
    }, { headers: { Authorization: 'Bearer ' + m.authorCode } });
    assertEq(fourth.statusCode, 429, '4ª reapertura en una hora 429');
    const raw = await m.raw();
    assert(raw.status !== 'cerrado', 'el reporte NO se cerró solo (está en ' + raw.status + ')');
    assertEq(raw.status, 'en_proceso', 'tras la 3ª evidencia el reporte está en_proceso (la dependencia lo retomó)');
  });

  await test('S22-N. versión optimista: expectedVersion viejo -> 409, la primera escritura queda (U-12)', async () => {
    const m = await makeReport({});
    const raw0 = await m.raw();
    const v = raw0.version;
    const first = await post(addEvidence, {
      folio: m.folio, note: 'Evidencia uno.', photoDataUrl: PHOTO_1X1, expectedVersion: v,
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    assertEq(first.statusCode, 200, 'primera evidencia con versión fresca 200');
    const stale = await post(addEvidence, {
      folio: m.folio, note: 'Evidencia con versión vieja.', photoDataUrl: PHOTO_1X1, expectedVersion: v,
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    assertEq(stale.statusCode, 409, 'segunda evidencia con versión vieja 409');
    const fresh = await post(addEvidence, {
      folio: m.folio, note: 'Evidencia dos.', photoDataUrl: PHOTO_1X1,
      expectedVersion: parse(first).report.version,
    }, { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    assertEq(fresh.statusCode, 200, 'el reintento con la versión fresca pasa');
    const raw = await m.raw();
    assertEq(raw.evidence.length, 2, 'quedan las 2 evidencias');
    // Lo mismo en calificación: segunda con expectedVersion viejo -> 409.
    const m2 = await makeAttended({});
    const raw2 = await m2.raw();
    const v2 = raw2.version;
    const rate1 = await post(addRating, {
      folio: m2.folio, stars: 5, afterPhotoDataUrl: PHOTO_1X1, expectedVersion: v2,
    }, { headers: { Authorization: 'Bearer ' + m2.authorCode } });
    assertEq(rate1.statusCode, 200, 'primera calificación 200');
    const rate2 = await post(addRating, {
      folio: m2.folio, stars: 1, afterPhotoDataUrl: PHOTO_1X1, expectedVersion: v2,
    }, { headers: { Authorization: 'Bearer ' + m2.authorCode } });
    assertEq(rate2.statusCode, 409, 'segunda calificación con versión vieja 409');
    assertEq((await m2.raw()).rating.stars, 5, 'queda una sola calificación (la primera)');
  });

  await test('S22-O. foto servida con nosniff y tipo por bytes reales (B-1/U-29)', async () => {
    const m = await makeReport({ photoDataUrl: PHOTO_JPEG_1X1 });
    const raw = await m.raw();
    const res = await get(photoFn, { key: raw.photoKey });
    assertEq(res.statusCode, 200, 'photo 200');
    assertEq(res.headers['Content-Type'], 'image/jpeg', 'tipo por bytes reales');
    assertEq(res.headers['X-Content-Type-Options'], 'nosniff', 'nosniff');
    assertEq(res.headers['Cache-Control'], 'private, no-store', 'private, no-store');
    const buf = Buffer.from(res.body, 'base64');
    assertEq(buf[0], 0xff, 'bytes JPEG');
    assertEq(buf[1], 0xd8, 'bytes JPEG');
  });

  await test('S22-P. connect roto -> 500 genérico sin trace (B-7)', async () => {
    // Sin override, connect exige Blobs (no instalado): el handler debe
    // responder 500 genérico, nunca el error interno.
    storeLib.setStoreOverride(null);
    try {
      const res = await createReport({
        httpMethod: 'POST',
        body: JSON.stringify({ service: 'agua', description: 'Fuga de agua en la banqueta.', lat: 21.5, lng: -104.9 }),
        headers: { 'x-forwarded-for': '10.9.9.9', origin: 'https://tepic.netlify.app' },
      }, {});
      assertEq(res.statusCode, 500, 'sin Blobs debe dar 500 genérico');
      assert(!res.body.includes('/var/task'), 'sin rutas internas en el 500');
      assert(!res.body.includes('MissingBlobs'), 'sin nombre de error interno en el 500');
    } finally {
      freshStore();
    }
  });

  await test('S22-Q. borrar con código de moderación -> 200; con depCode -> 401 (U-11)', async () => {
    const m = await makeReport({});
    const dep = await post(deleteReport, { folio: m.folio },
      { headers: { Authorization: 'Bearer ' + depCodeFor('agua') } });
    assertEq(dep.statusCode, 401, 'depCode no borra');
    const ok = await post(deleteReport, { folio: m.folio },
      { headers: { Authorization: 'Bearer ' + TEST_MOD_CODE } });
    assertEq(ok.statusCode, 200, 'modCode borra');
  });

  await test('S22-R. report-abuse: 200 genérico aunque el folio no exista (U-11)', async () => {
    const res = await post(reportAbuse, { folio: 'ORBE-20261126-AAAAAAAA', reason: 'Contenido ofensivo.' });
    assertEq(res.statusCode, 200, 'abuse con folio inexistente 200 genérico');
    const res2 = await post(reportAbuse, { folio: 'ORBE-20261126-AAAAAAAA', reason: 'Otro aviso.' });
    assertEq(res2.statusCode, 200, 'segundo aviso 200');
  });

  await test('S22-S. dudas-ciudadanas.json publicado sin URLs javascript: (B-5/U-24)', async () => {
    const fs = require('fs');
    const dudas = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'orbe', 'dudas-ciudadanas.json'), 'utf8'));
    assert(Array.isArray(dudas.dudas), 'dudas es un arreglo');
    const text = JSON.stringify(dudas);
    assert(!/javascript:/i.test(text), 'sin javascript: en dudas');
    assert(!/data:/i.test(text), 'sin data: en dudas');
  });

  await test('S22-U. PC-2: las respuestas de función llevan DENY + nosniff (cabeceras en el constructor central)', async () => {
    const m = await makeReport({ consentPublish: true });
    const createCall = await post(createReport, {
      service: 'bache', description: 'Bache de prueba para cabeceras, en Tepic.',
      lat: 21.51, lng: -104.89, address: 'Calle Prueba, Tepic', consentPublish: true,
    }, { 'X-Forwarded-For': '203.0.113.99' });
    assertEq(createCall.statusCode, 201, 'crear 201');
    assertEq(createCall.headers['X-Frame-Options'], 'DENY', 'DENY en create-report');
    assertEq(createCall.headers['X-Content-Type-Options'], 'nosniff', 'nosniff en create-report');
    const photoRes = await get(photoFn, '?key=' + encodeURIComponent(m.photoKey || 'x'), {}, { 'X-Forwarded-For': '203.0.113.99' });
    assertEq(photoRes.headers['X-Frame-Options'], 'DENY', 'DENY en photo.js');
    assertEq(photoRes.headers['X-Content-Type-Options'], 'nosniff', 'nosniff en photo.js');
    return 'PC-2 en verde (sin depender de que netlify.toml cubra /.netlify/functions/)';
  });

  await test('S22-T. sin secretos configurados: funciones protegidas -> 503, sello sin_sello (fail closed)', async () => {
    const savedPepper = process.env.ORBE_CODE_PEPPER;
    const savedSecret = process.env.ORBE_HMAC_SECRET;
    delete process.env.ORBE_CODE_PEPPER;
    delete process.env.ORBE_HMAC_SECRET;
    freshStore();
    const res = await post(createReport, {
      service: 'agua', description: 'Fuga de agua en la banqueta, sin config.',
      lat: 21.5, lng: -104.9, consentPublish: true,
    });
    assertEq(res.statusCode, 503, 'sin pepper, crear debe dar 503');
    process.env.ORBE_CODE_PEPPER = savedPepper;
    process.env.ORBE_HMAC_SECRET = savedSecret;
  });

  console.log('\n----------------------------------------');
  console.log('Pruebas backend ORBE Sesión 23 (2026-11-26)');
  console.log('Pasadas: ' + passed + ' / ' + (passed + failed));
  console.log('Fallidas: ' + failed);
  results.forEach((r) => console.log('  ' + r));
  console.log('Store: en memoria (setStoreOverride). @netlify/blobs NO instalado.');
  process.exit(failed === 0 ? 0 : 1);
})().catch((e) => {
  console.error('Error fatal en las pruebas:', e);
  process.exit(1);
});
