/**
 * Lectura de la declaración de impacto arquitectónico.
 *
 * La declaración vive en el cuerpo de la PR, dentro de un bloque cercado:
 *
 *   ```arquitectura
 *   component: Context.OS
 *   impact: CONTRACT_CHANGE, EVIDENCE_CHANGE
 *   evidence_level: E3_REPRODUCIBLE_EXECUTION
 *   maturity: EXPERIMENTAL
 *   semaforo: AMARILLO
 *   authority_changed: false
 *   verified_at_commit: 13fde75
 *   evidence:
 *     comando: npm run test:orbe-contextos
 *     resultado: 45/45
 *   ```
 *
 * Se eligió el cuerpo de la PR y no un archivo versionado porque la
 * clasificación es una afirmación de quien propone el cambio, no parte del
 * producto; lo que sí queda versionado es el recibo que la compuerta emite.
 *
 * El formato es un subconjunto deliberadamente pequeño de YAML —dos niveles,
 * sin anidamiento libre— para no añadir una dependencia sólo por leer diez
 * líneas. Cualquier cosa que el subconjunto no entienda se reporta como error
 * en vez de interpretarse a la ligera: una compuerta que adivina no es
 * compuerta.
 */

const RE_BLOQUE = /```(?:arquitectura|arch-impact|architecture)[^\n]*\n([\s\S]*?)```/i;
const RE_CLAVE = /^([A-Za-z_][\w.-]*)\s*:\s*(.*)$/;

/** Extrae el bloque de declaración del cuerpo de una PR. `null` si no hay. */
export function extraerBloque(cuerpo) {
  const encontrado = RE_BLOQUE.exec(String(cuerpo ?? ''));
  return encontrado ? encontrado[1] : null;
}

function escalar(bruto) {
  const valor = String(bruto).trim().replace(/^['"]|['"]$/g, '');
  if (/^(true|verdadero|si|sí)$/i.test(valor)) return true;
  if (/^(false|falso|no)$/i.test(valor)) return false;
  return valor;
}

/**
 * Parser del subconjunto: `clave: valor` en la raíz, y bajo una clave sin
 * valor, o una lista de `- elemento`, o un mapa de `subclave: valor`.
 */
export function parsearDeclaracion(texto) {
  const datos = {};
  const errores = [];
  let claveActual = null;

  for (const [i, cruda] of String(texto ?? '').split('\n').entries()) {
    const linea = cruda.replace(/\s+$/, '');
    const contenido = linea.trim();
    if (!contenido || contenido.startsWith('#')) continue;
    const sangria = linea.length - linea.trimStart().length;
    const donde = `línea ${i + 1} («${contenido}»)`;

    if (sangria === 0) {
      const encontrado = RE_CLAVE.exec(contenido);
      if (!encontrado) {
        errores.push(`${donde}: no tiene la forma «clave: valor».`);
        continue;
      }
      const [, clave, valor] = encontrado;
      if (valor === '') {
        datos[clave] = null;
        claveActual = clave;
      } else {
        datos[clave] = escalar(valor);
        claveActual = null;
      }
      continue;
    }

    if (!claveActual) {
      errores.push(`${donde}: está sangrada pero no cuelga de ninguna clave.`);
      continue;
    }

    if (contenido.startsWith('- ')) {
      if (!Array.isArray(datos[claveActual])) datos[claveActual] = [];
      datos[claveActual].push(escalar(contenido.slice(2)));
      continue;
    }

    const encontrado = RE_CLAVE.exec(contenido);
    if (!encontrado) {
      errores.push(`${donde}: no tiene la forma «clave: valor» ni «- elemento».`);
      continue;
    }
    if (datos[claveActual] === null) datos[claveActual] = {};
    if (typeof datos[claveActual] !== 'object' || Array.isArray(datos[claveActual])) {
      errores.push(`${donde}: «${claveActual}» ya recibió otro tipo de valor.`);
      continue;
    }
    datos[claveActual][encontrado[1]] = escalar(encontrado[2]);
  }

  return { datos, errores };
}

/** Convierte `A, B` o `A` o `['A','B']` en una lista limpia de cadenas. */
export function comoLista(valor) {
  if (valor === undefined || valor === null || valor === '') return [];
  if (Array.isArray(valor)) return valor.map((v) => String(v).trim()).filter(Boolean);
  return String(valor)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Lee el cuerpo de una PR y devuelve la declaración normalizada.
 * `presente: false` significa que no hay bloque: no es un error aquí —lo
 * decide la compuerta de impacto, que sabe si el cambio lo exigía.
 */
export function leerDeclaracion(cuerpo) {
  const bloque = extraerBloque(cuerpo);
  if (bloque === null) {
    return { presente: false, crudo: null, datos: {}, errores: [] };
  }
  const { datos, errores } = parsearDeclaracion(bloque);
  return {
    presente: true,
    crudo: bloque,
    datos,
    errores,
    componente: datos.component ?? datos.componente ?? null,
    impactos: comoLista(datos.impact ?? datos.impacto),
    evidence_level: datos.evidence_level ?? datos.evidencia_nivel ?? null,
    madurez: datos.maturity ?? datos.madurez ?? null,
    semaforo: datos.semaforo ?? datos.semáforo ?? null,
    authority_changed: datos.authority_changed ?? datos.autoridad_modificada ?? null,
    institutional_effects: datos.institutional_effects ?? datos.efectos_institucionales ?? null,
    verified_at_commit: datos.verified_at_commit ?? datos.verificado_en_commit ?? null,
    evidencia: typeof datos.evidence === 'object' && datos.evidence !== null && !Array.isArray(datos.evidence)
      ? datos.evidence
      : (typeof datos.evidencia === 'object' && datos.evidencia !== null && !Array.isArray(datos.evidencia)
        ? datos.evidencia
        : {}),
    tests: typeof datos.tests === 'object' && datos.tests !== null && !Array.isArray(datos.tests) ? datos.tests : {},
    adr: datos.adr ?? null,
    open_gaps: comoLista(datos.open_gaps ?? datos.brechas_abiertas),
    change_id: datos.change_id ?? datos.id_cambio ?? null,
  };
}
