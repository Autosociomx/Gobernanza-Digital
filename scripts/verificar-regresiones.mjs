#!/usr/bin/env node
/**
 * Guardia de regresiones — Nayarit Digital / ConnectX
 *
 * Verifica que ningún push (en especial los que llegan desde AI Studio)
 * reintroduzca las regresiones que ya ocurrieron cuatro veces en este
 * repositorio: llave de API expuesta al navegador, metadatos genéricos,
 * pérdida del code-splitting y borrado de archivos de despliegue.
 *
 * Uso:  node scripts/verificar-regresiones.mjs [--con-bundle]
 *   --con-bundle  además compila y verifica que la llave no esté en dist/
 *
 * R9 delega en scripts/verificar-canon.mjs: la fuente canónica de trámites
 * (data/canon/) debe seguir siendo coherente con el código y con la ley citada.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const errores = [];
const leer = (ruta) => (existsSync(ruta) ? readFileSync(ruta, 'utf-8') : null);

// R1 · La llave de Gemini nunca se inyecta al bundle del navegador
const vite = leer('vite.config.ts') ?? '';
if (/GEMINI_API_KEY'?\s*:\s*JSON\.stringify/.test(vite)) {
  errores.push(
    'vite.config.ts inyecta GEMINI_API_KEY al bundle del navegador. ' +
    'La llave debe vivir solo en server.ts (getAI). Cualquiera con DevTools la extraería.'
  );
}

// R2 · Ningún módulo del cliente crea su propio cliente de IA con la llave
let clientesIA = '';
try {
  clientesIA = execSync("grep -rln 'new GoogleGenAI' src/ || true", { encoding: 'utf-8' }).trim();
} catch { /* grep no disponible: se omite */ }
if (clientesIA) {
  errores.push(
    `Código del navegador crea su propio cliente GoogleGenAI (la llave viajaría al cliente): ${clientesIA}. ` +
    'Debe llamar a un endpoint del servidor (p. ej. /api/ai/risk-analysis).'
  );
}

// R3 · Metadatos reales (SEO/accesibilidad)
const html = leer('index.html') ?? '';
if (!html.includes('lang="es"')) errores.push('index.html no declara lang="es" (el contenido está en español).');
if (html.includes('My Google AI Studio App')) errores.push('index.html conserva el título genérico "My Google AI Studio App".');
if (!html.includes('name="description"')) errores.push('index.html no tiene meta description (SEO cae de 100).');

// R4 · Archivos de despliegue presentes
if (!existsSync('netlify.toml')) errores.push('Falta netlify.toml (cache de assets, redirect SPA y cabeceras de seguridad).');
if (!existsSync('public/robots.txt')) errores.push('Falta public/robots.txt (Lighthouse SEO lo marca inválido si la SPA responde HTML).');

// R5 · Code-splitting de vistas pesadas
const app = leer('src/App.tsx') ?? '';
if (!app.includes('lazy(')) {
  errores.push(
    'src/App.tsx importa todas las vistas de forma eager: la landing descargaría ' +
    'recharts/tesseract/jspdf completos (Performance cae de ~100 a ~70). Usar React.lazy + Suspense.'
  );
}

// R6 · Sin @import bloqueante de fuentes en el CSS
const css = leer('src/index.css') ?? '';
if (/@import url\(['"]https:\/\/fonts\.googleapis/.test(css)) {
  errores.push(
    'src/index.css importa Google Fonts con @import (bloquea el primer render ~780ms). ' +
    'Las fuentes se cargan asíncronas desde index.html.'
  );
}

// R8 · public/ se sirve en el sitio web: sin documentos internos
const permitidosPublic = new Set(['robots.txt', 'CONNECTX_SYSTEM_PROMPT.md']);
try {
  for (const archivo of readdirSync('public')) {
    const esDoc = /\.(md|txt|docx?|pdf)$/i.test(archivo);
    if (esDoc && !permitidosPublic.has(archivo)) {
      errores.push(
        `public/${archivo} se serviría en el sitio web público. Los documentos internos van en docs/interno/ ` +
        '(en julio de 2026 la estrategia interna estuvo expuesta en producción por un archivo así).'
      );
    }
  }
} catch { /* sin carpeta public */ }

// R9 · El canon del ORBE es la fuente canónica y debe seguir siéndolo
// (data/municipality/tepic/services.json vivió meses sin que nadie lo leyera;
//  un catálogo que nadie verifica deja de ser fuente de verdad en silencio)
try {
  execSync('node scripts/verificar-canon.mjs', { stdio: 'pipe' });
} catch (e) {
  const salida = [e.stdout, e.stderr].map((b) => (b ? b.toString() : '')).join('').trim();
  errores.push(
    'El canon del ORBE (data/canon/) no pasa su verificación:\n' +
    salida.split('\n').map((l) => '     ' + l).join('\n')
  );
}

// R7 (opcional) · La llave no aparece en el bundle compilado
if (process.argv.includes('--con-bundle')) {
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    const hallazgo = execSync("grep -rl 'GEMINI' dist/assets/ || true", { encoding: 'utf-8' }).trim();
    if (hallazgo) errores.push(`La cadena GEMINI aparece en el bundle compilado: ${hallazgo}`);
  } catch (e) {
    errores.push(`La compilación falló: ${e.message}`);
  }
}

if (errores.length) {
  console.error('\n✖ GUARDIA DE REGRESIONES: ' + errores.length + ' problema(s) encontrado(s)\n');
  errores.forEach((e, i) => console.error(`  ${i + 1}. ${e}\n`));
  console.error('Referencia: docs/marco/PROTOCOLO_SEGURIDAD.md\n');
  process.exit(1);
}
console.log('✔ Guardia de regresiones: todo en orden.');
