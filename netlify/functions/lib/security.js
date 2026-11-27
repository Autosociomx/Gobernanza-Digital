// Seguridad ORBE (contrato §6, §9, §12, Sesión 23).
// requireBody (413 antes de parsear), getClientIp, checkOrigin (CORS),
// validatePhotoBytes (bytes mágicos + quita EXIF a nivel de bytes, SIN
// sharp y sin dependencias nuevas), photoContentTypeFromBytes.
// Sin dependencias: funciona sin @netlify/blobs instalado.
'use strict';

const util = require('./util');

// Lee y parsea el cuerpo JSON. 413 si supera maxBytes, 400 si no es JSON
// o viene vacío. Devuelve {value} o {error: {status, message}}.
function requireBody(event, maxBytes) {
  const max = maxBytes || util.MAX_BODY_BYTES;
  if (!event || typeof event.body !== 'string' || event.body.length === 0) {
    return { error: { status: 400, message: 'No se recibió la información.' } };
  }
  let raw = event.body;
  if (event.isBase64Encoded) {
    try {
      const decoded = Buffer.from(event.body, 'base64');
      if (decoded.length > max) {
        return { error: { status: 413, message: 'La información es demasiado grande (máximo 6 MB).' } };
      }
      raw = decoded.toString('utf8');
    } catch (_e) {
      return { error: { status: 400, message: 'La información no se pudo leer.' } };
    }
  } else if (Buffer.byteLength(event.body, 'utf8') > max) {
    return { error: { status: 413, message: 'La información es demasiado grande (máximo 6 MB).' } };
  }
  try {
    return { value: JSON.parse(raw) };
  } catch (_e) {
    return { error: { status: 400, message: 'La información no es JSON válido.' } };
  }
}

// IP del cliente: primer valor de x-forwarded-for. Se hashea antes de
// guardarse (ver lib/rate.js); nunca se guarda en claro.
function getClientIp(event) {
  const h = (event && event.headers) || {};
  const xff = h['x-forwarded-for'] || h['X-Forwarded-For'] || '';
  if (typeof xff === 'string' && xff.trim() !== '') {
    return xff.split(',')[0].trim();
  }
  return h['x-nf-client-connection-ip'] || h['client-ip'] || '';
}

// CORS (contrato §12). Solo orígenes de ORBE_ALLOWED_ORIGINS (o
// process.env.URL si no está definida, o peticiones sin Origin).
// Devuelve {allowed, allowedOrigin}: allowedOrigin es el origen que debe
// ir en Access-Control-Allow-Origin, o null (sin cabecera) si el origen
// es ajeno o no hay Origin.
function checkOrigin(event) {
  const h = (event && event.headers) || {};
  const origin = h.origin || h.Origin || null;
  if (!origin) return { allowed: true, allowedOrigin: null };
  const list = (process.env.ORBE_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allowedList = list.length > 0 ? list : process.env.URL ? [process.env.URL] : [];
  if (allowedList.indexOf(origin) !== -1) {
    return { allowed: true, allowedOrigin: origin };
  }
  return { allowed: false, allowedOrigin: null };
}

// Token Bearer de la cabecera Authorization. null si no viene.
function getBearerToken(event) {
  const h = (event && event.headers) || {};
  const auth = h.authorization || h.Authorization || '';
  if (typeof auth !== 'string') return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

// Tipo real por bytes mágicos. La etiqueta del data-URL NO decide el tipo.
// HTML disfrazado de JPEG no coincide con ningún patrón -> null -> 400.
function photoContentTypeFromBytes(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

// JPEG: elimina el segmento APP1 (Exif, 0xFFE1). El resto se conserva tal
// cual; tras el marcador SOS (0xFFDA) el resto va verbatim (datos de imagen).
function stripJpegExif(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('No es JPEG');
  const out = [buf.subarray(0, 2)];
  let i = 2;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) throw new Error('Marcador JPEG inválido');
    const marker = buf[i + 1];
    if (marker === 0xda) {
      // SOS: lo que sigue son datos de imagen, se copia tal cual.
      out.push(buf.subarray(i));
      return Buffer.concat(out);
    }
    if (marker >= 0xd0 && marker <= 0xd7) {
      // RSTn: sin longitud.
      out.push(buf.subarray(i, i + 2));
      i += 2;
      continue;
    }
    if (marker === 0x01) {
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    if (len < 2 || i + 2 + len > buf.length) throw new Error('Segmento JPEG inválido');
    if (marker !== 0xe1) out.push(buf.subarray(i, i + 2 + len)); // APP1 fuera
    i += 2 + len;
  }
  throw new Error('JPEG sin SOS');
}

// PNG: conserva solo los chunks críticos (IHDR, PLTE, IDAT, IEND, tRNS).
// Fuera: eXIf, iCCP, tEXt, zTXt, iTXt y demás ancilares.
function stripPngAncillary(buf) {
  const keep = { IHDR: 1, PLTE: 1, IDAT: 1, IEND: 1, tRNS: 1 };
  const out = [buf.subarray(0, 8)];
  let i = 8;
  let sawIEND = false;
  while (i + 8 <= buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString('ascii', i + 4, i + 8);
    const end = i + 12 + len;
    if (end > buf.length) throw new Error('Chunk PNG inválido');
    if (keep[type]) out.push(buf.subarray(i, end));
    if (type === 'IEND') {
      sawIEND = true;
      break;
    }
    i = end;
  }
  if (!sawIEND) throw new Error('PNG sin IEND');
  return Buffer.concat(out);
}

// WebP: elimina los chunks EXIF y XMP y repara el tamaño RIFF.
function stripWebpExif(buf) {
  const out = [buf.subarray(0, 12)];
  let i = 12;
  while (i + 8 <= buf.length) {
    const type = buf.toString('ascii', i, i + 4);
    const size = buf.readUInt32LE(i + 4);
    const end = i + 8 + size + (size % 2);
    if (end > buf.length) throw new Error('Chunk WebP inválido');
    if (type !== 'EXIF' && type !== 'XMP ') out.push(buf.subarray(i, end));
    i = end;
  }
  const body = Buffer.concat(out);
  const fixed = Buffer.from(body);
  fixed.writeUInt32LE(fixed.length - 8, 4);
  return fixed;
}

// Valida una foto por sus bytes y la devuelve saneada (sin EXIF).
// Devuelve {buffer, contentType, ext} o {error, status} (400/413).
function validatePhotoBytes(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return { error: 'La foto está vacía.', status: 400 };
  }
  if (buffer.length > util.MAX_PHOTO_BYTES) {
    return { error: 'La foto es demasiado grande (máximo 2 MB).', status: 413 };
  }
  const contentType = photoContentTypeFromBytes(buffer);
  if (!contentType) {
    return { error: 'La foto debe ser JPG, PNG o WebP.', status: 400 };
  }
  let clean;
  try {
    if (contentType === 'image/jpeg') clean = stripJpegExif(buffer);
    else if (contentType === 'image/png') clean = stripPngAncillary(buffer);
    else clean = stripWebpExif(buffer);
  } catch (_e) {
    return { error: 'La foto no se pudo procesar.', status: 400 };
  }
  if (!clean || clean.length === 0) {
    return { error: 'La foto no se pudo procesar.', status: 400 };
  }
  const ext = contentType === 'image/jpeg' ? 'jpg' : contentType === 'image/png' ? 'png' : 'webp';
  return { buffer: clean, contentType, ext };
}

module.exports = {
  requireBody,
  getClientIp,
  checkOrigin,
  getBearerToken,
  photoContentTypeFromBytes,
  stripJpegExif,
  stripPngAncillary,
  stripWebpExif,
  validatePhotoBytes,
};
