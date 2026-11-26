// Sesión 23 — Simulación de entorno navegador en Node (NO es navegador real ni teléfono)
// Fecha: 2026-11-26. Autor: autosocio (coordinador de implementación, Sesión 23).
//
// MÉTODO EXACTO (etiqueta honesta):
//   "simulación de entorno navegador en Node, NO es navegador real ni teléfono"
//   Se lee ~/workspace/tepic-orbe-deploy/public/orbe/index.html y se extrae
//   VERBATIM su único <script> principal (IIFE `(() => { ... })();`). Se imprime
//   el SHA-256 del bloque extraído. Se carga íntegro en un contexto `vm` con
//   stubs mínimos de window/document/localStorage/navigator/crypto (WebCrypto
//   real vía crypto.webcrypto). NINGUNA línea del código se altera. Única
//   adición, documentada: antes del `})();` de cierre se expone
//   `window.__ORBE_TEST__` con referencias a las funciones internas (probe de
//   pruebas, no cambio de comportamiento). `fetch` es un stub configurable que
//   REGISTRA cada llamada (url, método, cabeceras, cuerpo): por defecto OFFLINE
//   (tira error) salvo los endpoints que cada prueba configura; así se prueba
//   el fallback local sin red real y se verifica qué manda el cliente
//   (códigos por Authorization Bearer, afterPhotoDataUrl, teléfono solo con
//   consentContact).
//   El backend (netlify/functions) tiene su propio archivo de pruebas:
//   tests-orbe/test-backend-sesion23.cjs (58/58).
//
// QUÉ NO SE PRUEBA AQUÍ (límites honestos, ver informe):
//   - Navegador real, teléfono de Miguel, MapLibre (maplibregl ausente:
//     initMap toma su rama fallback), voz/micrófono, fetch/red real,
//     Netlify Blobs real (@netlify/blobs no instalado en este worktree).
//   - Lente ORBE (CodeLens) vive en el script posterior del HTML y NO se
//     carga aquí: renderEscudo() sale temprano por su guarda
//     typeof OrbeCodeLens === "undefined".
//   - La ruta compartible /orbe/reporte/<folio> solo se prueba a través de
//     fetchSharedByFolio (location stub con pathname /orbe/ y hash vacío).
//
// Uso: node tests-orbe/test-front-sesion23.cjs  (desde la raíz del worktree)
// Sale con código 1 si alguna prueba falla.

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const assert = require('assert');

const HOME = process.env.HOME || '/home/hatch';
const WORKTREE = path.join(HOME, 'workspace/tepic-orbe-deploy');
const HTML_FILE = path.join(WORKTREE, 'public/orbe/index.html');

function sha256(s) { return crypto.createHash('sha256').update(s, 'utf8').digest('hex'); }

let passed = 0, failed = 0;
const failures = [];
async function test(name, fn) {
  try {
    const detail = await fn();
    passed++;
    console.log('PASS — ' + name + (detail ? ' :: ' + detail : ''));
  } catch (e) {
    failed++;
    failures.push(name + ': ' + e.message);
    console.log('FAIL — ' + name + ' :: ' + e.message);
  }
}
function waitFor(cond, ms) {
  const t0 = Date.now();
  return new Promise((resolve, reject) => {
    (function poll() {
      let ok = false;
      try { ok = cond(); } catch (e) { /* seguir */ }
      if (ok) return resolve();
      if (Date.now() - t0 > (ms || 2000)) return reject(new Error('timeout esperando condición'));
      setTimeout(poll, 10);
    })();
  });
}

// ---------------------------------------------------------------------------
// Stubs mínimos de navegador (misma técnica que el harness Sesión 21)
// ---------------------------------------------------------------------------
class StubEl {
  constructor(tag) {
    this.tagName = (tag || 'div').toUpperCase();
    this.children = [];
    this.value = '';
    this.checked = false;
    this._text = '';
    this._html = '';
    this.className = '';
    this.hidden = false;
    this.disabled = false;
    this.style = {};
    this.dataset = {};
    this._attrs = {};
    this.classList = { add() {}, remove() {}, toggle(_c, f) { return !!f; }, contains() { return false; } };
  }
  get textContent() { return this._text; }
  set textContent(v) { this._text = String(v == null ? '' : v); if (v === '') this.children = []; }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = String(v == null ? '' : v); if (v === '') this.children = []; }
  addEventListener() {}
  removeEventListener() {}
  appendChild(c) { this.children.push(c); return c; }
  append(...cs) { cs.forEach((c) => this.children.push(c)); return this; }
  removeChild(c) { return c; }
  insertBefore(c) { this.children.push(c); return c; }
  setAttribute(k, v) { this._attrs[k] = String(v); }
  getAttribute(k) { return this._attrs[k]; }
  removeAttribute(k) { delete this._attrs[k]; }
  focus() {}
  blur() {}
  click() {}
  select() {}
  querySelector() { return null; }
  querySelectorAll() { return []; }
  scrollIntoView() {}
  getContext() { return null; }
}

const elements = new Map();
function el(id) {
  if (!elements.has(id)) elements.set(id, new StubEl('div'));
  return elements.get(id);
}
const bodyEl = new StubEl('body');
const documentStub = {
  getElementById: (id) => el(id),
  createElement: (tag) => new StubEl(tag),
  createTextNode: (t) => { const n = new StubEl('#text'); n.textContent = String(t); return n; },
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  removeEventListener: () => {},
  activeElement: null,
  body: bodyEl,
  documentElement: new StubEl('html'),
  execCommand: () => false,
};

const lsStore = new Map();
const localStorageStub = {
  getItem: (k) => (lsStore.has(k) ? lsStore.get(k) : null),
  setItem: (k, v) => { lsStore.set(k, String(v)); },
  removeItem: (k) => { lsStore.delete(k); },
  clear: () => { lsStore.clear(); },
  _dump: () => Object.fromEntries(lsStore),
};

// Expediente legacy con nombre y fecha (para probar la migración Ronda 3).
lsStore.set('orbe.v05.expediente', JSON.stringify({ name: 'Test Legacy', dob: '2000-01-01', contact: '', history: ['ORBE-20261107-080141'] }));
// Reportes DEMO viejos en este teléfono: Sesión 23 los retira al cargar.
lsStore.set('orbe.v05.reports', JSON.stringify([
  { folio: 'ORBE-DEMO-20261107-080141', internalId: 'orb-demo-1', category: 'pothole', description: 'Bache demo viejo', status: 'recibido', createdAt: '2026-11-07T08:01:41Z', updatedAt: '2026-11-07T08:01:41Z' },
  { folio: 'ORBE-DEMO-20261107-080142', internalId: 'orb-demo-2', category: 'water_leak', description: 'Fuga demo vieja', status: 'derivado', createdAt: '2026-11-07T08:01:42Z', updatedAt: '2026-11-07T08:01:42Z' },
]));

const sandbox = {
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
  TextEncoder, TextDecoder, URL, Blob, AbortController,
  navigator: { onLine: true, userAgent: 'simulacion-node/2026-11-26' },
  location: { reload() {}, href: 'simulacion://orbe', pathname: '/orbe/', hash: '' },
  history: { replaceState() {} },
  prompt: () => '',
  addEventListener: () => {},
  removeEventListener: () => {},
  document: documentStub,
  localStorage: localStorageStub,
  __fetchMode: 'fail', // 'fail' | 'board-ok'
  __dudasData: null,
  __boardReports: [],
  __sharedReport: null,
  __fetchCalls: [],
};
// fetch stub configurable: offline por defecto; endpoints simulados; REGISTRA todo.
sandbox.fetch = async (url, opts) => {
  const u = String(url);
  const call = { url: u, method: (opts && opts.method) || 'GET', headers: (opts && opts.headers) || {}, body: (opts && opts.body) || null };
  sandbox.__fetchCalls.push(call);
  const bodyJson = () => { try { return JSON.parse(call.body || '{}'); } catch (e) { return {}; } };
  if (u.includes('create-report')) {
    if (sandbox.__fetchMode === 'board-ok') {
      return { ok: true, json: async () => ({ ok: true, report: { id: 'orb-20261125-abcdef', folio: 'ORBE-20261125-ABC12345', status: 'recibido' }, authorCode: 'AUT-TESTCODE12345678' }) };
    }
    throw new Error('offline');
  }
  if (u.includes('add-evidence') || u.includes('add-rating') || u.includes('delete-report')) {
    if (sandbox.__fetchMode === 'board-ok') return { ok: true, json: async () => ({ ok: true }) };
    throw new Error('offline');
  }
  if (u.includes('report-abuse')) {
    if (sandbox.__fetchMode === 'board-ok') return { ok: true, json: async () => ({ ok: true, message: 'Recibido.' }) };
    throw new Error('offline');
  }
  if (u.includes('get-report')) {
    // Solo el folio COMPLETO devuelve el reporte: el oráculo por subcadena está cerrado.
    const q = decodeURIComponent((u.split('folio=')[1] || '').split('&')[0] || '');
    const sr = sandbox.__sharedReport;
    if (sandbox.__fetchMode === 'board-ok' && sr && q === sr.folio) return { ok: true, json: async () => ({ ok: true, report: sr }) };
    return { ok: false, status: 404, json: async () => ({ error: 'not found' }) };
  }
  if (u.includes('list-reports')) return { ok: true, json: async () => ({ reports: sandbox.__boardReports }) };
  if (u.includes('dudas-ciudadanas.json')) return { ok: true, json: async () => ({ dudas: sandbox.__dudasData || [] }) };
  throw new Error('offline: ' + u);
};
sandbox.window = sandbox;
sandbox.crypto = crypto.webcrypto;
vm.createContext(sandbox);

// ---------------------------------------------------------------------------
// Extracción VERBATIM del script real de public/orbe/index.html
// ---------------------------------------------------------------------------
const html = fs.readFileSync(HTML_FILE, 'utf8');
const scriptOpen = html.indexOf('<script>\n(() => {');
if (scriptOpen === -1) throw new Error('no se encontró el <script> principal en el HTML');
const scriptStart = scriptOpen + '<script>\n'.length;
const scriptEnd = html.indexOf('</script>', scriptStart);
if (scriptEnd === -1) throw new Error('no se encontró el </script> del script principal');
const pageScript = html.slice(scriptStart, scriptEnd);
console.log('Script real extraído de public/orbe/index.html (rama orbe-sesion23-hardening)');
console.log('  bytes: ' + Buffer.byteLength(pageScript, 'utf8'));
console.log('  sha256: ' + sha256(pageScript));
assert.ok(pageScript.trimStart().startsWith('(() => {'), 'el script debe empezar con la IIFE');
assert.ok(pageScript.trimEnd().endsWith('})();'), 'el script debe terminar con })();');

const probe = `
;window.__ORBE_TEST__ = {
  ContextOS: ContextOS,
  EvidenceOS: EvidenceOS,
  saveReport: saveReport,
  nextFolio: nextFolio,
  infer: infer,
  routeCapability: routeCapability,
  renderTracking: renderTracking,
  renderCatalogExplorer: renderCatalogExplorer,
  renderConteos: renderConteos,
  computeConteos: computeConteos,
  renderFichasConteos: renderFichasConteos,
  renderBoard: renderBoard,
  loadBoard: loadBoard,
  renderDudas: renderDudas,
  focusReportOnMap: focusReportOnMap,
  fetchSharedByFolio: fetchSharedByFolio,
  cacheSharedReport: cacheSharedReport,
  shareToBoard: shareToBoard,
  postRatingToBoard: postRatingToBoard,
  markNoAtendido: markNoAtendido,
  openClosure: openClosure,
  confirmClosure: confirmClosure,
  openRating: openRating,
  saveRating: saveRating,
  reportAbuse: reportAbuse,
  sealText: sealText,
  startVoice: startVoice,
  addFolioToExpediente: addFolioToExpediente,
  saveExpediente: saveExpediente,
  renderExpediente: renderExpediente,
  statusLabel: statusLabel,
  reportStep: reportStep,
  progress: progress,
  normFolio: normFolio,
  folioMatches: folioMatches,
  fechaHoraCorta: fechaHoraCorta,
  CATS: CATS,
  CAT_SERVICE: CAT_SERVICE,
  ROUTING: ROUTING,
  ORBE_REPORT_STATES: ORBE_REPORT_STATES,
  REPORT_STATE_NEXT: REPORT_STATE_NEXT,
  DEPENDENCIAS_TEPIC: DEPENDENCIAS_TEPIC,
  ORBE_FICHAS_30: ORBE_FICHAS_30,
  get reports() { return reports; },
  get authorCodes() { return authorCodes; },
  get boardReports() { return boardReports; },
  get state() { return state; },
  get locReady() { return locReady; },
  set locReady(v) { locReady = v; },
  get selected() { return selected; },
  get expediente() { return expediente; },
  get fallbackCount() { return fallbackCount; },
  get ratingStars() { return ratingStars; },
  set ratingStars(v) { ratingStars = v; },
  get trackingSearchQuery() { return trackingSearchQuery; },
  set trackingSearchQuery(v) { trackingSearchQuery = v; },
  get catalogTopicFilter() { return catalogTopicFilter; },
  set catalogTopicFilter(v) { catalogTopicFilter = v; },
  setFetchMode: (m) => { window.__fetchMode = m; },
  setDudasData: (d) => { window.__dudasData = d; },
  setBoardReports: (r) => { window.__boardReports = r; },
  setSharedReport: (r) => { window.__sharedReport = r; },
  getFetchCalls: () => window.__fetchCalls.slice(),
  clearFetchCalls: () => { window.__fetchCalls.length = 0; },
  getLsDump: () => localStorage._dump(),
};
`;
const closeIdx = pageScript.lastIndexOf('})();');
const pageScriptProbed = pageScript.slice(0, closeIdx) + probe + pageScript.slice(closeIdx);

// Texto visible de un nodo y sus descendientes (el stub no agrega textContent).
function textOf(node) {
  if (!node) return '';
  let s = node._text || '';
  (node.children || []).forEach((c) => { s += ' ' + textOf(c); });
  return s;
}

(async () => {
  await test('T0.1 el script real carga y su init corre sin errores', () => {
    vm.runInContext(pageScriptProbed, sandbox, { filename: 'orbe-sesion23-inline-script.js' });
    assert.ok(sandbox.__ORBE_TEST__, 'el probe debe existir');
    return 'init OK: state=' + sandbox.__ORBE_TEST__.state;
  });

  const T = sandbox.__ORBE_TEST__;

  // -------------------------------------------------------------------------
  // F23 — Sesión 23: sin DEMO, sin Llave MX, sin WhatsApp personal (estático + init)
  // -------------------------------------------------------------------------
  await test('F23.1 sin semillas DEMO: los 2 reportes ORBE-DEMO viejos se retiran al cargar', () => {
    assert.strictEqual(T.reports.length, 0, '0 reportes al iniciar, hay ' + T.reports.length);
    const guardados = JSON.parse(T.getLsDump()['orbe.v05.reports'] || '[]');
    assert.ok(!guardados.some((r) => String(r.folio || '').indexOf('ORBE-DEMO-') === 0), 'localStorage ya no guarda DEMO');
    return 'init sin DEMO OK';
  });

  await test('F23.2 HTML estático: fuera Llave MX, WhatsApp personal, demo y CDN sin SRI', () => {
    assert.ok(!html.includes('wa.me/525522302128'), 'sin wa.me del número personal');
    assert.ok(!html.includes('55 2230 2128'), 'sin el número 55 2230 2128');
    assert.ok(!html.includes('llaveSession'), 'sin sesión de Llave MX');
    assert.ok(!html.includes('Llave MX'), 'sin mención de Llave MX');
    assert.ok(!html.includes('Crear reporte de demostración'), 'sin botón de reporte de demostración');
    assert.ok(!html.includes('unpkg.com/maplibre'), 'sin MapLibre desde CDN');
    assert.ok(html.includes('vendor/maplibre-gl.js'), 'MapLibre autoalojado en vendor/');
    assert.ok(!html.includes('id="publishShared" checked'), 'publishShared sin checked');
    assert.ok(!html.includes('enableHighAccuracy'), 'GPS sin alta precisión');
    const demos = (html.match(/ORBE-DEMO-/g) || []).length;
    assert.strictEqual(demos, 2, 'ORBE-DEMO- solo aparece 2 veces (comentario + filtro que retira los viejos), hay ' + demos);
    return 'estático OK';
  });

  // -------------------------------------------------------------------------
  // P1 — Búsqueda por folio (local: subcadena solo en este teléfono)
  // -------------------------------------------------------------------------
  await test('P1.1 normFolio quita guiones y pasa a mayúsculas', () => {
    assert.strictEqual(T.normFolio('orbe-20261121-230505'), 'ORBE20261121230505');
    assert.strictEqual(T.normFolio('  ORBE 2026 1121 '), 'ORBE20261121');
    return 'normFolio OK';
  });

  await test('P1.2 folioMatches local: completo y parcial coinciden, otro no', () => {
    assert.ok(T.folioMatches('ORBE-20261125-120000', '120000'), 'parcial local 120000');
    assert.ok(T.folioMatches('ORBE-20261125-120000', 'orbe-20261125-120000'), 'completo sin importar mayúsculas');
    assert.ok(!T.folioMatches('ORBE-20261125-120000', '999999'), '999999 no coincide');
    assert.ok(!T.folioMatches('ORBE-20261125-120000', ''), 'vacío no coincide');
    return 'folioMatches local OK (la búsqueda en el tablero es por folio completo, ver F23.9)';
  });

  // -------------------------------------------------------------------------
  // B.1 — Reporte local offline (antes que P1.3/P2.1, que lo necesitan)
  // -------------------------------------------------------------------------
  function setForm(o) {
    el('catSelect').value = o.cat;
    el('descInput').value = o.desc;
    el('latInput').value = String(o.lat);
    el('lngInput').value = String(o.lng);
    el('addressInput').value = o.address;
    el('prioritySelect').value = o.priority;
    el('consentCheck').checked = !!o.consent;
    el('publishShared').checked = !!o.publish;
    el('consentContactCheck').checked = !!o.consentContact;
    el('reportPhone').value = o.phone || '';
    el('reporterName').value = o.name || '';
    el('reporterContact').value = '';
    el('saveProfileCheck').checked = false;
  }

  await test('B.1 saveReport offline con publicar: nace recibido, queda local; teléfono sin consentContact NO se guarda', async () => {
    T.setFetchMode('fail');
    T.clearFetchCalls();
    const antes = T.reports.length;
    setForm({ cat: 'pothole', desc: 'Bache grande en República de Chile', lat: 21.5300, lng: -104.8700, address: 'República de Chile, Tepic', priority: 'HIGH', consent: true, publish: true, consentContact: false, phone: '311 000 0000' });
    await T.saveReport(false);
    assert.strictEqual(T.reports.length, antes + 1, 'crea 1 reporte');
    const r = T.reports[0];
    assert.ok(/^ORBE-\d{8}-\d{6}$/.test(r.folio), 'folio nuevo sin DEMO: ' + r.folio);
    assert.strictEqual(r.status, 'recibido', 'offline nace recibido');
    assert.ok(/^[0-9a-f]{64}$/.test(r.evidenceSeal.hash), 'sello SHA-256 local');
    assert.strictEqual(r.phone, '', 'sin consentContact el teléfono queda vacío');
    assert.strictEqual(r.consent.publish, true, 'consent.publish registrado');
    await new Promise((res) => setTimeout(res, 50));
    assert.ok(el('toast').textContent.includes('solo en este teléfono'), 'toast de fallback offline: ' + el('toast').textContent);
    assert.ok(!T.getFetchCalls().some((c) => c.url.includes('add-evidence')), 'nunca se llama a add-evidence al crear');
    return 'folio=' + r.folio + ' recibido, local-only';
  });

  await test('P1.3 renderTracking con folio parcial muestra solo ese reporte', () => {
    const r = T.reports[0];
    const parcial = r.folio.slice(-6);
    T.trackingSearchQuery = parcial;
    T.renderTracking();
    const host = el('trackingList');
    assert.strictEqual(host.children.length, 2, 'debe haber 2 hijos (botón verificar + 1 tarjeta), hay ' + host.children.length);
    assert.ok(textOf(host).includes('SIMULADO') === false, 'sin cierre aún no hay badge SIMULADO');
    T.trackingSearchQuery = '999999';
    T.renderTracking();
    assert.strictEqual(el('trackingList').children.length, 2, 'sin coincidencia hay tarjeta vacía + Ver todos');
    assert.ok(el('trackingList').children[0].textContent.includes('No hay un reporte con ese folio'), 'mensaje de folio no encontrado');
    T.trackingSearchQuery = '';
    T.renderTracking();
    assert.strictEqual(el('trackingList').children.length, 2, 'sin filtro: 1 tarjeta + botón verificar cadena');
    return 'filtro por folio OK';
  });

  await test('P1.4 fetchSharedByFolio sin conexión devuelve null (no inventa)', async () => {
    const r = await T.fetchSharedByFolio('ORBE-20261121-230505');
    assert.strictEqual(r, null, 'sin funciones desplegadas no hay reporte compartido');
    return 'fetchSharedByFolio offline -> null';
  });

  // -------------------------------------------------------------------------
  // P2 — Ver en mapa
  // -------------------------------------------------------------------------
  await test('P2.1 focusReportOnMap centra selected en el reporte', () => {
    const r = T.reports[0];
    T.focusReportOnMap(r);
    assert.strictEqual(T.selected.lat, r.lat, 'lat centrada');
    assert.strictEqual(T.selected.lng, r.lng, 'lng centrada');
    assert.ok(el('toast').textContent.includes(r.folio), 'toast menciona el folio: ' + el('toast').textContent);
    return 'focusReportOnMap OK: ' + r.folio;
  });

  // -------------------------------------------------------------------------
  // Ciclo de 6 estados — con cierre TERMINAL (Sesión 23)
  // -------------------------------------------------------------------------
  await test('S6.1 statusLabel: 6 estados nuevos + claves viejas mapeadas', () => {
    assert.strictEqual(T.statusLabel('recibido'), 'Recibido');
    assert.strictEqual(T.statusLabel('derivado'), 'Derivado');
    assert.strictEqual(T.statusLabel('en_proceso'), 'En proceso');
    assert.strictEqual(T.statusLabel('atendido'), 'Atendido — pendiente de calificación');
    assert.strictEqual(T.statusLabel('cerrado'), 'Cerrado');
    assert.strictEqual(T.statusLabel('no_atendido'), 'No atendido / Reabierto');
    assert.strictEqual(T.statusLabel('resolved'), 'Atendido — pendiente de calificación', 'legacy resolved');
    assert.strictEqual(T.statusLabel('assigned'), 'Derivado', 'legacy assigned');
    assert.strictEqual(T.statusLabel('in_progress'), 'En proceso', 'legacy in_progress');
    return 'statusLabel 6+3 OK';
  });

  await test('S6.2 reportStep y progress en los 6 estados; cerrado es TERMINAL', () => {
    const pasos = [1, 2, 3, 4, 5, 6].map((i) => T.reportStep({ status: ['recibido', 'derivado', 'en_proceso', 'atendido', 'cerrado', 'no_atendido'][i - 1] }));
    assert.strictEqual(JSON.stringify(pasos), JSON.stringify([1, 2, 3, 4, 5, 6]), 'pasos 1-6: ' + JSON.stringify(pasos));
    assert.strictEqual(T.progress('recibido'), 15);
    assert.strictEqual(T.progress('derivado'), 35);
    assert.strictEqual(T.progress('en_proceso'), 60);
    assert.strictEqual(T.progress('atendido'), 85);
    assert.strictEqual(T.progress('cerrado'), 100);
    assert.strictEqual(T.progress('no_atendido'), 100);
    assert.strictEqual(JSON.stringify(T.REPORT_STATE_NEXT.atendido), JSON.stringify(['cerrado', 'no_atendido']));
    assert.strictEqual(JSON.stringify(T.REPORT_STATE_NEXT.cerrado), JSON.stringify([]), 'cerrado: [] — terminal, sin reabrir');
    assert.strictEqual(JSON.stringify(T.REPORT_STATE_NEXT.no_atendido), JSON.stringify(['en_proceso', 'derivado', 'atendido']));
    return 'reportStep 1-6, progress y cierre terminal OK';
  });

  await test('S6.4 markNoAtendido: primer toque arma, segundo aplica (solo en este teléfono)', () => {
    const r = T.reports[0];
    assert.strictEqual(r.status, 'recibido', 'el reporte creado está recibido');
    const btn = new StubEl('button');
    T.markNoAtendido(r.folio, btn);
    assert.strictEqual(r.status, 'recibido', 'primer toque no cambia el estado');
    assert.ok(btn.textContent.includes('Toca de nuevo'), 'el botón pide confirmar: ' + btn.textContent);
    T.markNoAtendido(r.folio, btn);
    assert.strictEqual(r.status, 'no_atendido', 'segundo toque marca no_atendido');
    assert.strictEqual(T.reportStep(r), 6, 'paso 6 de 6');
    return r.folio + ' -> no_atendido';
  });

  await test('S6.5 cierre SIMULADO -> atendido; calificación local -> cerrado; nunca llama a add-evidence', async () => {
    T.setFetchMode('fail');
    T.clearFetchCalls();
    setForm({ cat: 'water_leak', desc: 'Fuga continua sobre avenida principal', lat: 21.5600, lng: -104.8400, address: 'Av. Insurgentes, Tepic', priority: 'CRITICAL', consent: true, publish: false });
    await T.saveReport(false);
    const r = T.reports[0];
    assert.strictEqual(r.status, 'recibido', 'el segundo reporte nace recibido');
    T.openClosure(r.folio);
    el('closureNoteInput').value = 'Se reparó (simulación local).';
    T.confirmClosure();
    assert.strictEqual(r.status, 'atendido', 'cierre pone atendido, no resolved');
    assert.ok(r.closure, 'hay evidencia de cierre');
    assert.strictEqual(r.closure.simulated, true, 'el cierre queda marcado SIMULADO');
    assert.ok(el('toast').textContent.includes('SIMULADO'), 'el toast dice SIMULADO, no "aparece como Atendido": ' + el('toast').textContent);
    T.renderTracking();
    assert.ok(textOf(el('trackingList')).includes('SIMULADO'), 'la tarjeta muestra el badge SIMULADO');
    assert.ok(!T.getFetchCalls().some((c) => c.url.includes('add-evidence')), 'el cierre local NUNCA llama a add-evidence');
    T.openRating(r.folio);
    T.ratingStars = 5;
    el('ratingComment').value = 'Quedó bien.';
    await T.saveRating();
    assert.strictEqual(r.status, 'cerrado', 'calificación local cierra el reporte');
    assert.strictEqual(r.rating.stars, 5, '5 estrellas guardadas');
    return r.folio + ' recibido -> atendido (SIMULADO) -> cerrado';
  });

  // -------------------------------------------------------------------------
  // 21 tipos de incidencia
  // -------------------------------------------------------------------------
  await test('C21.1 CATS tiene 22 claves (8 + 14 nuevas) y el mapa a servicios', () => {
    assert.strictEqual(Object.keys(T.CATS).length, 22, 'CATS=' + Object.keys(T.CATS).join(','));
    assert.strictEqual(T.CAT_SERVICE.falta_agua, 'agua');
    assert.strictEqual(T.CAT_SERVICE.semaforo, 'riesgo_vial');
    assert.strictEqual(T.CAT_SERVICE.tala, 'parques');
    assert.strictEqual(T.ROUTING.water_leak, 'SIAPA Tepic');
    assert.strictEqual(T.ROUTING.falta_agua, 'SIAPA Tepic');
    return 'CATS 22 claves OK';
  });

  await test('C21.2 ContextOS admite las categorías nuevas', () => {
    const base = { desc: 'Semáforo descompuesto en Insurgentes', lat: 21.5089, lng: -104.8935, consent: true, quick: false };
    assert.strictEqual(T.ContextOS.decide('reporte', Object.assign({}, base, { cat: 'semaforo' })).decision, 'ALLOW');
    assert.strictEqual(T.ContextOS.decide('reporte', Object.assign({}, base, { cat: 'falta_agua' })).decision, 'ALLOW');
    assert.strictEqual(T.ContextOS.decide('reporte', Object.assign({}, base, { cat: 'enjambre' })).decision, 'ALLOW');
    return 'decide(semaforo/falta_agua/enjambre)=ALLOW';
  });

  // -------------------------------------------------------------------------
  // marIA: pasaporte / NSS / luz
  // -------------------------------------------------------------------------
  await test('M.1 infer: pasaporte, NSS y luz llegan a su intención', () => {
    assert.strictEqual(T.infer('quiero sacar mi pasaporte').cap, 'passport');
    assert.strictEqual(T.infer('mi NSS').cap, 'nss');
    assert.strictEqual(T.infer('la luz').cap, 'luz_ask');
    assert.strictEqual(T.infer('pagar mi luz').cap, 'payments', 'pagar luz sigue siendo pagos');
    assert.strictEqual(T.infer('quiero contratar la luz').cap, 'contratar_luz');
    const t = T.infer('hay un semáforo descompuesto');
    assert.strictEqual(t.cap, 'territory');
    assert.strictEqual(t.cat, 'semaforo');
    return 'infer pasaporte/nss/luz_ask/payments/contratar_luz/semaforo OK';
  });

  await test('M.2 routeCapability pasaporte: F5 POR CONFIRMAR, sin afirmar requisitos', () => {
    T.routeCapability('passport');
    const host = el('homeResult');
    assert.ok(host.children.length > 0, 'el panel muestra la respuesta');
    const txt = textOf(host);
    assert.ok(txt.includes('POR CONFIRMAR'), 'dice POR CONFIRMAR: ' + txt);
    assert.ok(!txt.includes('Requisitos: tu identificación'), 'no afirma requisitos inventados');
    assert.strictEqual(T.fallbackCount, 0, 'fallbackCount en 0 tras intención válida');
    return 'pasaporte -> F5 POR CONFIRMAR';
  });

  await test('M.3 routeCapability NSS: F4 verificada, requisitos/plazo POR CONFIRMAR', () => {
    T.routeCapability('nss');
    const host = el('homeResult');
    const txt = textOf(host);
    assert.ok(txt.includes('F4'), 'menciona la ficha F4');
    assert.ok(txt.includes('POR CONFIRMAR'), 'requisitos y plazo POR CONFIRMAR: ' + txt);
    assert.ok(txt.includes('800 623 2323'), 'teléfono IMSS verificado');
    return 'NSS -> F4 verificada, requisitos/plazo POR CONFIRMAR';
  });

  await test('M.4 routeCapability luz_ask ofrece pagar o contratar (sin responder "luz" sola)', () => {
    T.routeCapability('luz_ask');
    const host = el('homeResult');
    const txt = textOf(host);
    assert.ok(txt.includes('Pagar mi recibo'), 'ofrece pagar: ' + txt);
    assert.ok(txt.includes('Contratar el servicio'), 'ofrece contratar');
    return 'luz_ask -> dos botones';
  });

  await test('M.5 fallback: 2 intentos piden aclarar, el 3º sale seguro y resetea', () => {
    T.routeCapability('unknown');
    assert.strictEqual(T.fallbackCount, 1, 'tras 1º unknown: 1');
    T.routeCapability('unknown');
    assert.strictEqual(T.fallbackCount, 2, 'tras 2º unknown: 2');
    const txt2 = textOf(el('homeResult'));
    assert.ok(txt2.includes('una palabra más'), '2º intento pide una palabra más');
    T.routeCapability('unknown');
    assert.strictEqual(T.fallbackCount, 0, 'tras 3º unknown resetea a 0');
    const txt3 = textOf(el('homeResult'));
    assert.ok(txt3.includes('Te paso con una persona'), '3er intento sale seguro: ' + txt3);
    assert.ok(txt3.includes('311 265 2791'), 'la salida segura da el teléfono verificado');
    return 'fallback 1-2-3 OK';
  });

  await test('M.6 no se repite la misma respuesta de marIA dos veces seguidas', () => {
    T.routeCapability('passport');
    const first = textOf(el('homeResult'));
    T.routeCapability('passport');
    const second = textOf(el('homeResult'));
    assert.ok(second.includes('Si esto no es lo que pediste'), 'la segunda vez agrega reparación: ' + second.slice(0, 120));
    assert.notStrictEqual(first, second, 'el texto cambia en la repetición');
    return 'no-repeat OK';
  });

  await test('F23.7 marIA sin respuesta: dice por escrito "No encontré ese trámite en el Catálogo"', () => {
    T.routeCapability('procedures', { utterance: 'trámite inexistente xyz' });
    const txt = textOf(el('homeResult'));
    assert.ok(txt.includes('No encontré ese trámite en el Catálogo'), 'responde por escrito, no salta al Catálogo: ' + txt.slice(0, 160));
    return 'procedures sin respuesta OK';
  });

  // -------------------------------------------------------------------------
  // Ronda 3 — Expediente sin nombre ni fecha
  // -------------------------------------------------------------------------
  await test('R3.1 migración: el expediente legacy pierde nombre y fecha, conserva folios', () => {
    const exp = T.expediente;
    assert.ok(!('name' in exp), 'sin campo name: ' + JSON.stringify(exp));
    assert.ok(!('dob' in exp), 'sin campo dob');
    assert.ok((exp.history || []).includes('ORBE-20261107-080141'), 'el folio del historial se conserva');
    return 'expediente migrado: ' + JSON.stringify(exp);
  });

  await test('R3.2 addFolioToExpediente funciona sin nombre (antes pedía nombre)', () => {
    const antes = T.expediente.history.length;
    T.addFolioToExpediente('ORBE-20261107-080142');
    assert.strictEqual(T.expediente.history.length, antes + 1, 'el folio se agrega sin nombre');
    assert.strictEqual(T.expediente.history[0], 'ORBE-20261107-080142', 'el folio nuevo queda primero');
    return 'addFolio sin nombre OK';
  });

  await test('R3.3 saveExpediente no guarda nombre ni fecha', () => {
    el('expContact').value = '311 000 0000';
    T.saveExpediente();
    const exp = T.expediente;
    assert.ok(!('name' in exp) && !('dob' in exp), 'sin name/dob tras guardar: ' + JSON.stringify(exp));
    assert.ok((exp.history || []).length >= 2, 'los folios se conservan al guardar');
    return 'saveExpediente solo folios OK';
  });

  // -------------------------------------------------------------------------
  // B.2 — Reporte -> Tablero compartido con el contrato Sesión 23
  // -------------------------------------------------------------------------
  await test('B.2 saveReport con tablero: adopta folio del servidor; código de autor SOLO en memoria', async () => {
    T.setFetchMode('board-ok');
    T.clearFetchCalls();
    const antes = T.reports.length;
    setForm({ cat: 'drainage', desc: 'Drenaje tapado en colonia centro', lat: 21.5700, lng: -104.8300, address: 'Calle Hidalgo, Tepic', priority: 'HIGH', consent: true, publish: true, consentContact: true, phone: '311 000 0000', name: 'Prueba' });
    await T.saveReport(false);
    assert.strictEqual(T.reports.length, antes + 1, 'crea 1 reporte');
    const r = T.reports[0];
    await waitFor(() => !!r.sharedId, 2000);
    assert.strictEqual(r.folio, 'ORBE-20261125-ABC12345', 'el folio COMPARTIDO lo manda el servidor: ' + r.folio);
    assert.strictEqual(r.sharedId, 'orb-20261125-abcdef', 'sharedId = j.report.id');
    assert.strictEqual(r.status, 'recibido', 'al crear nace recibido');
    assert.strictEqual(r.phone, '311 000 0000', 'con consentContact el teléfono sí se guarda en el reporte local');
    assert.strictEqual(T.authorCodes[r.folio], 'AUT-TESTCODE12345678', 'código de autor en memoria');
    assert.strictEqual(el('authorCodeValue').textContent, 'AUT-TESTCODE12345678', 'la constancia muestra el código una vez');
    assert.ok(!JSON.stringify(T.getLsDump()).includes('AUT-'), 'el código NUNCA se guarda en localStorage');
    const createCall = T.getFetchCalls().find((c) => c.url.includes('create-report'));
    assert.ok(createCall, 'se llamó a create-report');
    const sent = JSON.parse(createCall.body);
    assert.strictEqual(sent.phone, '311 000 0000', 'el teléfono se manda solo con consentContact');
    assert.strictEqual(sent.consentPublish, true, 'consentPublish en el cuerpo');
    assert.ok(!('byName' in sent), 'el cliente NUNCA manda byName');
    T.setFetchMode('fail');
    return 'folio servidor=' + r.folio + ' · código solo en memoria';
  });

  await test('B.3 nextFolio: formato ORBE-AAAAMMDD-HHMMSS y único por llamada', () => {
    const a = T.nextFolio(), b = T.nextFolio();
    assert.ok(/^ORBE-\d{8}-\d{6}$/.test(a.folio), 'folio A: ' + a.folio);
    assert.notStrictEqual(a.internalId, b.internalId, 'internalId único');
    return a.folio + ' / ' + b.folio;
  });

  // -------------------------------------------------------------------------
  // F23.5 — Calificación de un reporte COMPARTIDO: código + foto del después
  // -------------------------------------------------------------------------
  await test('F23.5 rating compartido: sin código no califica; con código y foto manda Bearer + afterPhotoDataUrl', async () => {
    T.setFetchMode('board-ok');
    T.clearFetchCalls();
    const r = T.reports.find((x) => x.sharedId === 'orb-20261125-abcdef');
    assert.ok(r, 'el reporte compartido de B.2 existe');
    assert.strictEqual(r.status, 'recibido', 'sigue recibido antes del cierre');
    T.openClosure(r.folio);
    el('closureNoteInput').value = 'Se destapó el drenaje.';
    T.confirmClosure();
    assert.strictEqual(r.status, 'atendido', 'cierre local pone atendido');
    assert.strictEqual(r.closure.simulated, true, 'cierre SIMULADO');
    // Foto del después (en el navegador real viene del input de archivo).
    r.closure.photo = { dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==' };
    // 1) Sin código: no califica.
    T.openRating(r.folio);
    T.ratingStars = 5;
    el('ratingComment').value = 'Quedó bien.';
    el('ratingAuthorCode').value = '';
    await T.saveRating();
    assert.strictEqual(r.status, 'atendido', 'sin código el estado NO cambia');
    assert.ok(el('toast').textContent.includes('código de autor'), 'pide el código: ' + el('toast').textContent);
    assert.ok(!T.getFetchCalls().some((c) => c.url.includes('add-rating')), 'sin código no se llama a add-rating');
    // 2) Con código y foto: califica con Bearer.
    el('ratingAuthorCode').value = 'AUT-TESTCODE12345678';
    await T.saveRating();
    assert.strictEqual(r.status, 'cerrado', 'con 200 del servidor cierra');
    assert.strictEqual(r.rating.stars, 5, '5 estrellas');
    const call = T.getFetchCalls().find((c) => c.url.includes('add-rating'));
    assert.ok(call, 'se llamó a add-rating');
    assert.strictEqual(call.headers.Authorization, 'Bearer AUT-TESTCODE12345678', 'código por Authorization Bearer');
    const sent = JSON.parse(call.body);
    assert.ok(sent.afterPhotoDataUrl && sent.afterPhotoDataUrl.indexOf('data:image/jpeg') === 0, 'manda afterPhotoDataUrl');
    assert.ok(!('byName' in sent), 'nunca manda byName');
    assert.ok(!('photoDataUrl' in sent), 'no manda el campo viejo photoDataUrl');
    T.setFetchMode('fail');
    return r.folio + ' calificado con código + foto del después';
  });

  // -------------------------------------------------------------------------
  // F23.6 — M2/E2 por confirmar; F23.8 abuso; F23.9 folio completo; sello; conteos; voz
  // -------------------------------------------------------------------------
  await test('F23.6 M2 y E2 pasan a "por confirmar"; verificadas 0 de 30', () => {
    const m2 = T.ORBE_FICHAS_30.find((f) => f.id === 'M2');
    const e2 = T.ORBE_FICHAS_30.find((f) => f.id === 'E2');
    assert.ok(m2 && e2, 'M2 y E2 existen en ORBE_FICHAS_30');
    assert.strictEqual(m2.estado, 'por confirmar', 'M2 por confirmar: ' + m2.nota);
    assert.strictEqual(e2.estado, 'por confirmar', 'E2 por confirmar: ' + e2.nota);
    T.renderFichasConteos();
    assert.strictEqual(String(el('fichasVerificadasCount').textContent), '0', 'verificadas 0 de 30');
    return 'M2/E2 por confirmar OK';
  });

  await test('F23.8 reportAbuse llama a report-abuse con el folio (sin exponer nada)', async () => {
    T.setFetchMode('board-ok');
    T.clearFetchCalls();
    const sr = { folio: 'ORBE-20261121-230505', service: 'bache', description: 'Bache', status: 'recibido' };
    await T.reportAbuse(sr);
    const call = T.getFetchCalls().find((c) => c.url.includes('report-abuse'));
    assert.ok(call, 'se llamó a report-abuse');
    assert.strictEqual(JSON.parse(call.body).folio, 'ORBE-20261121-230505', 'manda el folio');
    T.setFetchMode('fail');
    return 'report-abuse OK';
  });

  await test('F23.9 fetchSharedByFolio: parcial -> null (sin oráculo); completo -> reporte', async () => {
    T.setFetchMode('board-ok');
    T.setSharedReport({ id: 'orb-20261121-abcdef', folio: 'ORBE-20261121-230505', service: 'bache', description: 'Bache en República de Chile', lat: 21.5089, lng: -104.8935, address: 'República de Chile', status: 'recibido', dependencia: 'Obras Públicas — Vialidad (Ayuntamiento de Tepic)', createdAt: '2026-11-21T23:05:05Z', photoUrl: null, rating: null, sealValid: false });
    const parcial = await T.fetchSharedByFolio('080141');
    assert.strictEqual(parcial, null, '6 dígitos no encuentran nada (sin oráculo)');
    const parcial2 = await T.fetchSharedByFolio('ORBE-20261121-23050');
    assert.strictEqual(parcial2, null, 'folio incompleto tampoco');
    const completo = await T.fetchSharedByFolio('ORBE-20261121-230505');
    assert.ok(completo && completo.folio === 'ORBE-20261121-230505', 'folio completo sí lo encuentra');
    T.setFetchMode('fail');
    return 'oráculo de folio cerrado';
  });

  await test('F23.10 sealText: verificado / no verificado / sin sello, nunca "íntegra"', () => {
    assert.strictEqual(T.sealText(true), 'Sello del servidor: Verificado.');
    assert.ok(T.sealText(false).includes('No verificado'), 'sello roto: ' + T.sealText(false));
    assert.ok(T.sealText(undefined).includes('No verificado'), 'sin sello: ' + T.sealText(undefined));
    assert.ok(!T.sealText(false).includes('ntegra') && !T.sealText(undefined).includes('ntegra'), 'nunca dice "íntegra"');
    return 'sealText OK';
  });

  await test('F23.11 computeConteos: una sola fuente, 43 sedes (1 verificada, 39 corregidas, 3 por confirmar)', () => {
    const c = T.computeConteos();
    assert.strictEqual(c.sedes, 43, 'sedes=43');
    assert.strictEqual(c.verificadas, 1, 'verificadas=1');
    assert.strictEqual(c.corregidas, 39, 'corregidas=39');
    assert.strictEqual(c.porConfirmar, 3, 'por confirmar=3');
    assert.strictEqual(c.modelos, 322, 'modelos=322');
    assert.strictEqual(c.nombrados, 292, 'nombrados=292');
    T.renderConteos();
    assert.strictEqual(String(el('conteoSedes').textContent), '43', 'conteoSedes=43');
    const nota = String(el('conteoModelosNota').textContent);
    assert.ok(nota.includes('292') && nota.includes('322'), 'nota 292/322: ' + nota);
    return 'conteos 43/1/39/3 · 322/292 OK';
  });

  await test('F23.13 textos raíz honestos en PlatformLanding.tsx: los 5 viejos fuera, la leyenda dentro', () => {
    const tsx = fs.readFileSync(path.join(WORKTREE, 'src/components/PlatformLanding.tsx'), 'utf8');
    const viejos = [
      'Gobernanza Digital Certificada por Ley',
      'Trámites 100% digitales con acuse con validez jurídica',
      'Llave Infantil MX (SINISI)',
      'C5 Mando Territorial',
      'Carpeta Presidencial',
    ];
    viejos.forEach((s) => assert.ok(!tsx.includes(s), 'sigue presente: ' + s));
    assert.ok(tsx.includes('Prototipo independiente: publicar aquí no es un canal oficial de gobierno.'), 'leyenda honesta presente');
    assert.ok(tsx.includes('Prototipo de identidad infantil (sin conexión oficial)'), 'identidad infantil honesta presente');
    return '5 textos viejos fuera; leyenda honesta dentro (otros textos de la raíz quedan pendientes, ver informe §5.5)';
  });

  await test('F23.12 startVoice sin reconocimiento: mensaje honesto, sin romper', () => {
    T.startVoice('orbe');
    assert.ok(el('toast').textContent.includes('no está disponible'), 'avisa que la voz no está disponible: ' + el('toast').textContent);
    return 'voz no disponible -> aviso honesto';
  });

  // -------------------------------------------------------------------------
  // Tablero en app + Dudas ciudadanas
  // -------------------------------------------------------------------------
  await test('TBL.1 loadBoard vacío muestra estado vacío (no inventa reportes)', async () => {
    T.setBoardReports([]);
    await T.loadBoard(true);
    const host = el('boardList');
    assert.strictEqual(host.children.length, 1, '1 tarjeta de estado vacío');
    assert.ok(host.children[0].textContent.includes('No hay reportes'), 'mensaje vacío: ' + host.children[0].textContent);
    return 'board vacío OK';
  });

  await test('TBL.2 renderBoard muestra folio, fecha, estado, dependencia y sello No verificado', () => {
    T.setBoardReports([{ id: 'orb-20261121-abcdef', folio: 'ORBE-20261121-230505', service: 'bache', description: 'Bache en República de Chile', lat: 21.5089, lng: -104.8935, address: 'República de Chile', status: 'recibido', dependencia: 'Obras Públicas — Vialidad (Ayuntamiento de Tepic)', createdAt: '2026-11-21T23:05:05Z', photoUrl: null, rating: null, sealValid: false }]);
    return (async () => {
      await T.loadBoard(true);
      const host = el('boardList');
      assert.strictEqual(host.children.length, 1, '1 tarjeta del tablero');
      const txt = textOf(host);
      assert.ok(txt.includes('ORBE-20261121-230505'), 'folio visible: ' + txt);
      assert.ok(txt.includes('Recibido'), 'estado Recibido');
      assert.ok(txt.includes('Obras Públicas'), 'dependencia destino');
      assert.ok(txt.includes('No verificado'), 'sello No verificado (sin sello válido no dice "íntegra")');
      assert.ok(txt.includes('Origen: En el tablero compartido'), 'etiqueta de origen');
      assert.ok(txt.includes('Reportar contenido inapropiado'), 'botón de abuso presente');
      return 'tablero renderiza el reporte en vivo ORBE-20261121-230505';
    })();
  });

  await test('DUD.1 renderDudas vacío: estado vacío, sin inventar dudas', async () => {
    T.setDudasData([]);
    await T.renderDudas();
    const host = el('dudasList');
    assert.strictEqual(host.children.length, 1, '1 tarjeta de estado vacío');
    assert.ok(host.children[0].textContent.includes('Todavía no hay dudas registradas'), 'mensaje vacío honesto');
    return 'dudas vacío OK';
  });

  await test('DUD.2 renderDudas con una duda POR CONFIRMAR: frase, enlace y fecha', async () => {
    T.setDudasData([{ frase: '¿Tengo que pagar lo del SIAPA aunque no me llegue agua?', fuente_url: 'https://www.facebook.com/siapa.tepic/posts/123456', fuente_pagina: 'SIAPA Tepic', fecha: '2026-11-24T10:15:00-07:00', estado: 'por_confirmar', respuesta: null, respuesta_fuente: null, respuesta_fecha: null }]);
    await T.renderDudas();
    const host = el('dudasList');
    assert.strictEqual(host.children.length, 1, '1 tarjeta de duda');
    const txt = textOf(host);
    assert.ok(txt.includes('¿Tengo que pagar lo del SIAPA'), 'frase exacta: ' + txt);
    assert.ok(txt.includes('POR CONFIRMAR'), 'estado POR CONFIRMAR');
    assert.ok(txt.includes('No se inventa la respuesta'), 'no inventa respuesta');
    const cnt = String(el('dudasCount').textContent);
    assert.ok(cnt.includes('1 duda'), 'contador: ' + cnt);
    return 'duda POR CONFIRMAR renderizada';
  });

  // -------------------------------------------------------------------------
  // Resumen
  // -------------------------------------------------------------------------
  console.log('\n========================================');
  console.log('Sesión 23 — simulación Node (front): ' + passed + ' pasadas, ' + failed + ' fallidas');
  if (failures.length) {
    console.log('FALLAS:');
    failures.forEach((f) => console.log('  - ' + f));
  }
  console.log('========================================');
  console.log('NOTA: esto es "verde local" (simulación Node). Falta verificar en');
  console.log('navegador real y en el teléfono de Miguel: mapa, voz de marIA,');
  console.log('Tablero contra Netlify Blobs real y despliegue en vivo.');
  process.exit(failed ? 1 : 0);
})();
