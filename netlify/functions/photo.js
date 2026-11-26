// GET /.netlify/functions/photo?key=photo/<id>-<tipo>.<ext>
// Sirve una foto guardada en Netlify Blobs.
// Solo se sirven claves que empiezan con "photo/": nunca se exponen
// las fichas JSON de los reportes por esta ruta.
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
  const key = typeof params.key === 'string' ? params.key : '';
  if (!key.startsWith('photo/') || key.includes('..') || /[^A-Za-z0-9/_.\-]/.test(key)) {
    return util.errorResponse(400, 'Esa foto no existe.');
  }

  const store = storeLib.getStore();
  const photo = await storeLib.getPhoto(store, key);
  if (!photo) return util.errorResponse(404, 'Esa foto no existe.');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': photo.contentType,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
    body: photo.buffer.toString('base64'),
    isBase64Encoded: true,
  };
};
