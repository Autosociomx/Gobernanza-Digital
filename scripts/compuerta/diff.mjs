/**
 * Lectura del cambio propuesto: qué archivos toca y qué líneas agrega o quita.
 *
 * Las compuertas de autoridad y de deriva no razonan sobre el árbol final sino
 * sobre el movimiento: quitar `LAB_MOCK` de una línea es un acto distinto de
 * que el repositorio no lo tenga nunca. Por eso aquí se trabaja con el parche,
 * no con el contenido.
 */
import { execFileSync } from 'node:child_process';

function git(argumentos) {
  return execFileSync('git', argumentos, { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });
}

export function existeReferencia(referencia) {
  try {
    git(['rev-parse', '--verify', '--quiet', `${referencia}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

export function resolver(referencia) {
  try {
    return git(['rev-parse', referencia]).trim();
  } catch {
    return null;
  }
}

/**
 * Archivos tocados entre la base y la cabeza, usando `base...head` para que la
 * comparación sea contra el ancestro común y no contra la punta de la base:
 * un avance de main no debe aparecer como cambio de esta PR.
 */
export function archivosCambiados(base, cabeza) {
  const salida = git(['diff', '--name-status', '-M', `${base}...${cabeza}`]);
  return salida
    .split('\n')
    .filter(Boolean)
    .map((linea) => {
      const partes = linea.split('\t');
      const estado = partes[0];
      const ruta = partes[partes.length - 1];
      return { estado: estado[0], ruta };
    });
}

/**
 * Rutas con cambios sin confirmar. La compuerta clasifica commits, no el árbol
 * de trabajo: en local conviene avisar de lo que se está quedando fuera.
 */
export function cambiosSinConfirmar() {
  try {
    return git(['status', '--porcelain'])
      .split('\n')
      .filter(Boolean)
      .map((l) => l.slice(3).trim());
  } catch {
    return [];
  }
}

/** Líneas agregadas y eliminadas por archivo. */
export function lineasDelParche(base, cabeza) {
  const salida = git(['diff', '--unified=0', '-M', `${base}...${cabeza}`]);
  const agregadas = [];
  const eliminadas = [];
  let archivo = null;

  for (const linea of salida.split('\n')) {
    if (linea.startsWith('+++ ')) {
      const ruta = linea.slice(4).trim();
      archivo = ruta === '/dev/null' ? archivo : ruta.replace(/^b\//, '');
      continue;
    }
    if (linea.startsWith('--- ')) continue;
    if (linea.startsWith('diff --git') || linea.startsWith('@@')) continue;
    if (!archivo) continue;
    if (linea.startsWith('+')) agregadas.push({ archivo, texto: linea.slice(1) });
    else if (linea.startsWith('-')) eliminadas.push({ archivo, texto: linea.slice(1) });
  }

  return { agregadas, eliminadas };
}
