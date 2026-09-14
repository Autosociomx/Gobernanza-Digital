/**
 * Fase E · Canon Drift Detector.
 *
 * Un canon que el código dejó de sostener es peor que no tener canon: se sigue
 * citando en público. Y un código que se movió sin actualizar el canon deja a
 * la siguiente sesión leyendo una descripción del sistema que ya no existe.
 * Las dos direcciones son deriva y las dos se detectan aquí:
 *
 *   código → canon   el parche mueve el literal de una frontera y ningún
 *                    documento del canon se actualiza en la misma PR.
 *   canon → código   el canon enuncia una frontera que el código ya no tiene.
 *
 * Las fronteras viven en docs/marco/fronteras-arquitectura.json. Ese archivo
 * no es un registro de estado —el MASTER_STATE es docs/marco/estado.json— sino
 * la forma ejecutable de reglas que el canon ya enuncia en prosa.
 */

const RUTA_ESTADO = 'docs/marco/estado.json';

const IMPACTOS_QUE_EXIGEN_ESTADO = [
  'ARCHITECTURE_CHANGE',
  'CONTRACT_CHANGE',
  'AUTHORITY_CHANGE',
  'EVIDENCE_CHANGE',
];

export function compuertaDeDeriva(contexto) {
  const { fronteras, declaracion, archivos, agregadas, eliminadas, existe, leerArchivo } = contexto;
  const hallazgos = [];
  const error = (id, mensaje) => hallazgos.push({ id, nivel: 'error', mensaje });
  const aviso = (id, mensaje) => hallazgos.push({ id, nivel: 'aviso', mensaje });

  if (!fronteras) {
    error('E0', `No se pudo leer docs/marco/fronteras-arquitectura.json: sin fronteras no hay detección de deriva.`);
    return { hallazgos, fronteras_movidas: [] };
  }

  const tocados = new Set(archivos.map((a) => a.ruta));
  const movidas = [];

  for (const frontera of fronteras.fronteras ?? []) {
    const { id, enunciado } = frontera;

    // Dirección canon → código: lo que el canon afirma, ¿sigue en el código?
    for (const ancla of frontera.codigo ?? []) {
      const contenido = leerArchivo(ancla.archivo);
      if (contenido === null) {
        error(
          `${id}`,
          `ROJO · ${id}: el canon ancla «${enunciado}» en ${ancla.archivo}, que no existe. ` +
            'O el archivo se movió sin actualizar la frontera, o la frontera describe un sistema que ya no está.',
        );
        continue;
      }
      if (ancla.debe_contener && !contenido.includes(ancla.debe_contener)) {
        error(
          `${id}`,
          `ROJO · ${id}: ${ancla.archivo} ya no contiene «${ancla.debe_contener}». ` +
            `El canon sigue afirmando: «${enunciado}». Una de las dos cosas hay que corregir.`,
        );
      }
      for (const prohibido of ancla.no_debe_contener ?? []) {
        if (contenido.includes(prohibido)) {
          error(
            `${id}`,
            `ROJO · ${id}: ${ancla.archivo} contiene «${prohibido}», que la frontera prohíbe. ` +
              `Enunciado: «${enunciado}».`,
          );
        }
      }
    }

    // Dirección código → canon: ¿el canon sigue enunciando la frontera?
    for (const cita of frontera.canon ?? []) {
      const contenido = leerArchivo(cita.archivo);
      if (contenido === null) {
        error(`${id}`, `${id}: el documento de canon ${cita.archivo} no existe.`);
        continue;
      }
      if (cita.debe_mencionar && !contenido.includes(cita.debe_mencionar)) {
        error(
          `${id}`,
          `${id}: ${cita.archivo} ya no menciona «${cita.debe_mencionar}». ` +
            'El código sostiene la frontera pero el canon dejó de enunciarla.',
        );
      }
    }

    // ¿Esta PR movió el literal de la frontera?
    const literales = (frontera.codigo ?? []).map((a) => a.debe_contener).filter(Boolean);
    const movimiento = [...agregadas, ...eliminadas].some(
      (l) =>
        (frontera.codigo ?? []).some((a) => a.archivo === l.archivo) &&
        literales.some((lit) => l.texto.includes(lit)),
    );
    if (!movimiento) continue;

    movidas.push(id);
    const canonTocado = (frontera.canon ?? []).some((c) => tocados.has(c.archivo));
    const adr = declaracion.presente ? declaracion.adr : null;
    const adrValido = Boolean(adr) && (!/\.md$/i.test(String(adr)) || existe(String(adr)));

    if (!canonTocado && !adrValido) {
      error(
        `${id}`,
        `Deriva: la PR mueve el literal de la frontera ${id} («${enunciado}») en el código, y no actualiza ` +
          `ninguno de sus documentos de canon (${(frontera.canon ?? []).map((c) => c.archivo).join(', ')}) ` +
          'ni declara un ADR. Mover una frontera exige que el canon se mueva con ella.',
      );
    }
    if (frontera.adr_requerido && !adrValido) {
      error(
        `${id}`,
        `La frontera ${id} exige ADR para moverse y la declaración no trae uno válido en «adr».`,
      );
    }
    const exigidos = frontera.impacto_si_cambia ?? [];
    if (declaracion.presente && exigidos.length) {
      const declarados = declaracion.impactos ?? [];
      if (!exigidos.some((i) => declarados.includes(i))) {
        error(
          `${id}`,
          `La frontera ${id} se mueve y la declaración no incluye ninguno de los impactos que le corresponden: ` +
            `${exigidos.join(' o ')}.`,
        );
      }
    }
  }

  // Componente declarado contra el vocabulario del canon.
  if (declaracion.presente && declaracion.componente) {
    const validos = fronteras.componentes_validos ?? [];
    if (validos.length && !validos.includes(declaracion.componente)) {
      aviso(
        'E7',
        `«component: ${declaracion.componente}» no está en componentes_validos ` +
          `(${validos.join(', ')}). Si es un componente nuevo, decláralo en las fronteras.`,
      );
    }
  }

  // El MASTER_STATE debe moverse con la arquitectura (regla §11 del plan).
  if (declaracion.presente) {
    const impactos = declaracion.impactos ?? [];
    const exigeEstado = impactos.some((i) => IMPACTOS_QUE_EXIGEN_ESTADO.includes(i));
    if (exigeEstado && !tocados.has(RUTA_ESTADO)) {
      error(
        'E8',
        `El cambio declara ${impactos.filter((i) => IMPACTOS_QUE_EXIGEN_ESTADO.includes(i)).join(', ')} y no ` +
          `actualiza ${RUTA_ESTADO}. El MASTER_STATE registra en qué va el trabajo: si no se mueve con el ` +
          'cambio, vuelve a envejecer en silencio.',
      );
    } else if (impactos.includes('INTEGRATION_CHANGE') && !tocados.has(RUTA_ESTADO)) {
      aviso('E8', `Cambio de integración sin tocar ${RUTA_ESTADO}: conviene registrar la dependencia externa.`);
    }
  }

  return { hallazgos, fronteras_movidas: movidas };
}
