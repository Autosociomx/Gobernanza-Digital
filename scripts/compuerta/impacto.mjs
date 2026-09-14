/**
 * Fase B · Architecture Impact Gate.
 *
 * Toda PR que toque la arquitectura debe decir qué mueve. No se le pide a
 * quien propone el cambio que acierte en todo: se le pide que lo declare, para
 * que la discusión ocurra antes de la fusión y no seis semanas después, cuando
 * el canon y el código ya no coinciden y nadie recuerda cuál de los dos cedió.
 *
 * Una PR sin clasificación falla. Una PR que declara NO_ARCH_IMPACT mientras
 * cambia un contrato, también: la compuerta compara lo declarado contra lo
 * que el parche realmente toca.
 */
import {
  IMPACTOS,
  EVIDENCIA,
  MADUREZ,
  SEMAFORO,
  RUTAS_VIGILADAS,
  RUTAS_CONTRATO,
  RUTAS_ARQUITECTURA,
  RUTAS_EVIDENCIA,
  RUTAS_AUTORIDAD,
  esRutaDe,
} from './vocabulario.mjs';

export function rutasQueExigenDeclaracion(archivos) {
  return archivos.map((a) => a.ruta).filter((ruta) => esRutaDe(ruta, RUTAS_VIGILADAS));
}

export function compuertaDeImpacto(contexto) {
  const { declaracion, archivos, resolverCommit } = contexto;
  const hallazgos = [];
  const error = (id, mensaje) => hallazgos.push({ id, nivel: 'error', mensaje });
  const aviso = (id, mensaje) => hallazgos.push({ id, nivel: 'aviso', mensaje });

  const vigiladas = rutasQueExigenDeclaracion(archivos);
  const exigida = vigiladas.length > 0;

  if (!declaracion.presente) {
    if (exigida) {
      error(
        'B1',
        `El cambio toca ${vigiladas.length} archivo(s) de arquitectura (${vigiladas.slice(0, 5).join(', ')}` +
          `${vigiladas.length > 5 ? ', …' : ''}) y no declara impacto. Añade un bloque «arquitectura» al ` +
          'cuerpo de la PR: ver .github/pull_request_template.md y docs/marco/COMPUERTA_ARQUITECTURA.md §3.',
      );
    }
    return { hallazgos, exigida, vigiladas };
  }

  for (const problema of declaracion.errores) {
    error('B2', `La declaración no se pudo leer: ${problema}`);
  }

  const impactos = declaracion.impactos;
  if (!impactos.length) {
    error('B3', 'La declaración no trae «impact». Debe traer al menos uno de: ' + IMPACTOS.join(', ') + '.');
  }
  for (const impacto of impactos) {
    if (!IMPACTOS.includes(impacto)) {
      error('B4', `Impacto «${impacto}» desconocido. Válidos: ${IMPACTOS.join(', ')}.`);
    }
  }

  const soloSinImpacto = impactos.length === 1 && impactos[0] === 'NO_ARCH_IMPACT';
  if (impactos.includes('NO_ARCH_IMPACT') && impactos.length > 1) {
    error('B5', 'NO_ARCH_IMPACT no se combina con otros impactos: o el cambio mueve la arquitectura o no.');
  }

  if (!declaracion.componente) {
    error('B6', 'La declaración no trae «component»: sin componente no hay recibo ni trazabilidad.');
  }

  if (!declaracion.evidence_level) {
    error('B7', 'La declaración no trae «evidence_level». Válidos: ' + EVIDENCIA.join(', ') + '.');
  } else if (!EVIDENCIA.includes(declaracion.evidence_level)) {
    error('B7', `«evidence_level: ${declaracion.evidence_level}» no es un nivel válido. Válidos: ${EVIDENCIA.join(', ')}.`);
  }

  if (!declaracion.semaforo) {
    error('B8', 'La declaración no trae «semaforo». Válidos: ' + SEMAFORO.join(', ') + '.');
  } else if (!SEMAFORO.includes(declaracion.semaforo)) {
    error('B8', `«semaforo: ${declaracion.semaforo}» no es válido. Válidos: ${SEMAFORO.join(', ')}.`);
  }

  if (!soloSinImpacto) {
    if (!declaracion.madurez) {
      error('B9', 'Un cambio con impacto arquitectónico debe declarar «maturity». Válidos: ' + MADUREZ.join(', ') + '.');
    } else if (!MADUREZ.includes(declaracion.madurez)) {
      error('B9', `«maturity: ${declaracion.madurez}» no es válido. Válidos: ${MADUREZ.join(', ')}.`);
    }

    if (typeof declaracion.authority_changed !== 'boolean') {
      error(
        'B10',
        'Un cambio con impacto arquitectónico debe declarar «authority_changed: true|false» de forma explícita. ' +
          'Omitirlo no equivale a «false».',
      );
    }

    if (!declaracion.verified_at_commit) {
      error('B11', 'Falta «verified_at_commit»: el recibo necesita saber sobre qué árbol se comprobó lo declarado.');
    } else if (resolverCommit && !resolverCommit(declaracion.verified_at_commit)) {
      aviso(
        'B11',
        `«verified_at_commit» (${declaracion.verified_at_commit}) no se encuentra en este clon. ` +
          'Si el clon es superficial es esperado; si no, apunta a un commit inexistente.',
      );
    }
  }

  // Lo declarado contra lo que el parche realmente toca.
  const contratos = archivos.map((a) => a.ruta).filter((r) => esRutaDe(r, RUTAS_CONTRATO));
  const evidencias = archivos.map((a) => a.ruta).filter((r) => esRutaDe(r, RUTAS_EVIDENCIA));
  const autoridades = archivos.map((a) => a.ruta).filter((r) => esRutaDe(r, RUTAS_AUTORIDAD));
  const estructurales = archivos.map((a) => a.ruta).filter((r) => esRutaDe(r, RUTAS_ARQUITECTURA));

  if (soloSinImpacto && (contratos.length || evidencias.length || autoridades.length || estructurales.length)) {
    error(
      'B12',
      'La declaración dice NO_ARCH_IMPACT pero el cambio toca ' +
        [...contratos, ...evidencias, ...autoridades, ...estructurales].join(', ') +
        '. Eso es un impacto arquitectónico por definición, no por opinión.',
    );
  }

  if (estructurales.length && !impactos.includes('ARCHITECTURE_CHANGE')) {
    error(
      'B17',
      `Toca la arquitectura o su canon ejecutable (${estructurales.join(', ')}) y no declara ` +
        'ARCHITECTURE_CHANGE. La propia compuerta está aquí a propósito: relajarla no es un cambio menor.',
    );
  }

  if (contratos.length && !impactos.includes('CONTRACT_CHANGE')) {
    error('B13', `Toca contrato (${contratos.join(', ')}) y no declara CONTRACT_CHANGE.`);
  }
  if (evidencias.length && !impactos.includes('EVIDENCE_CHANGE')) {
    error('B14', `Toca el emisor de evidencia (${evidencias.join(', ')}) y no declara EVIDENCE_CHANGE.`);
  }
  if (
    autoridades.length &&
    !impactos.includes('AUTHORITY_CHANGE') &&
    !impactos.includes('ARCHITECTURE_CHANGE')
  ) {
    error(
      'B15',
      `Toca policy, consentimiento o adapters (${autoridades.join(', ')}) y no declara ` +
        'AUTHORITY_CHANGE ni ARCHITECTURE_CHANGE. Ahí vive la frontera de autoridad.',
    );
  }

  if (!exigida && declaracion.presente) {
    aviso('B16', 'El cambio no tocaba rutas de arquitectura; la declaración se validó de todos modos.');
  }

  return { hallazgos, exigida, vigiladas };
}
