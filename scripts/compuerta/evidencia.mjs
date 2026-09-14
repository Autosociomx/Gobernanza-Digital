/**
 * Fase C · Evidence Gate.
 *
 * Una PR que afirma «funciona», «resuelto» o «validado» está haciendo una
 * afirmación de hecho, y en este repositorio las afirmaciones de hecho se
 * sostienen o se retiran. La compuerta no juzga si el cambio es bueno: sólo
 * comprueba que la evidencia ofrecida alcanza para el nivel declarado.
 *
 * Regla dura: la compuerta NUNCA sube el nivel de evidencia. Verifica el que
 * se declaró y, si no alcanza, falla. Que una prueba pase no convierte E2 en
 * E3; que un despliegue exista no convierte E3 en E4. Subir de nivel es un
 * acto humano, con nombre y fecha.
 *
 * Los niveles E4 y E5 no son verificables desde el repositorio: un clon no
 * puede comprobar un despliegue ni una operación institucional. Por eso la
 * compuerta los marca siempre como «requiere revisión humana» en vez de
 * darlos por buenos.
 */
import { NIVEL_EVIDENCIA, PALABRAS_DE_AFIRMACION, normalizar } from './vocabulario.mjs';

export function afirmacionesEn(texto) {
  const plano = normalizar(texto ?? '');
  return PALABRAS_DE_AFIRMACION.filter((palabra) => new RegExp(`\\b${palabra}\\b`).test(plano));
}

function valor(mapa, ...claves) {
  for (const clave of claves) {
    const bruto = mapa?.[clave];
    if (bruto !== undefined && bruto !== null && String(bruto).trim() !== '') return String(bruto).trim();
  }
  return null;
}

export function compuertaDeEvidencia(contexto) {
  const { declaracion, cuerpo, titulo, existe, leerArchivo, resolverCommit, impactoExigido } = contexto;
  const hallazgos = [];
  const error = (id, mensaje) => hallazgos.push({ id, nivel: 'error', mensaje });
  const aviso = (id, mensaje) => hallazgos.push({ id, nivel: 'aviso', mensaje });
  const escalar = (id, mensaje) => hallazgos.push({ id, nivel: 'escalar', mensaje });

  // El texto que se examina excluye el propio bloque de declaración: ahí las
  // palabras son etiquetas del formato, no afirmaciones sobre el mundo.
  const sinBloque = String(cuerpo ?? '').replace(/```(?:arquitectura|arch-impact|architecture)[\s\S]*?```/gi, '');
  const afirmaciones = afirmacionesEn(`${titulo ?? ''}\n${sinBloque}`);

  if (!declaracion.presente) {
    if (afirmaciones.length && !impactoExigido) {
      aviso(
        'C0',
        `La PR afirma «${afirmaciones.join('», «')}» sin declarar nivel de evidencia. No toca rutas de ` +
          'arquitectura, así que no bloquea; si la afirmación es sobre Context.OS, ORBE o Evidence, declara el nivel.',
      );
    }
    return { hallazgos, afirmaciones, requiere_revision_humana: false };
  }

  const nivel = declaracion.evidence_level;
  const orden = NIVEL_EVIDENCIA[nivel];
  const ev = declaracion.evidencia ?? {};
  let requiereRevision = false;

  if (orden === undefined) {
    return { hallazgos, afirmaciones, requiere_revision_humana: false };
  }

  if (afirmaciones.length && nivel === 'E0_DECLARED') {
    error(
      'C1',
      `La PR afirma «${afirmaciones.join('», «')}» y declara E0_DECLARED. E0 es exactamente «lo dije, no lo ` +
        'probé»: o baja la afirmación, o sube la evidencia con lo que la sostiene.',
    );
  }

  const documento = valor(ev, 'documento', 'documentos', 'doc');
  const ruta = valor(ev, 'ruta', 'archivo', 'path');
  const comando = valor(ev, 'comando', 'command');
  const resultado = valor(ev, 'resultado', 'result');
  const artefacto = valor(ev, 'artifact', 'artefacto', 'hash');
  const url = valor(ev, 'url', 'deploy', 'entorno');
  const autoridad = valor(ev, 'autoridad', 'authority');
  const responsable = valor(ev, 'responsable', 'owner', 'humano');

  if (orden >= NIVEL_EVIDENCIA.E1_DOCUMENTED) {
    const citado = documento ?? ruta;
    if (!citado) {
      error('C2', `${nivel} exige citar al menos un documento o ruta en «evidence.documento» / «evidence.ruta».`);
    } else if (/\.[a-z0-9]+$/i.test(citado) && !existe(citado)) {
      error('C2', `${nivel}: la evidencia citada «${citado}» no existe en el repositorio.`);
    }
  }

  if (orden >= NIVEL_EVIDENCIA.E2_CODE_INSPECTED) {
    if (!ruta) {
      error('C3', `${nivel} exige «evidence.ruta»: la ruta del código inspeccionado.`);
    } else if (!existe(ruta)) {
      error('C3', `${nivel}: la ruta inspeccionada «${ruta}» no existe.`);
    }
    if (!declaracion.verified_at_commit) {
      error('C3', `${nivel} exige «verified_at_commit»: una ruta sin commit no es inspección, es referencia.`);
    } else if (resolverCommit && !resolverCommit(declaracion.verified_at_commit)) {
      aviso('C3', `${nivel}: «verified_at_commit» no se resuelve en este clon (puede ser un clon superficial).`);
    }
  }

  if (orden >= NIVEL_EVIDENCIA.E3_REPRODUCIBLE_EXECUTION) {
    if (!comando) {
      error(
        'C4',
        `${nivel} exige «evidence.comando»: el comando exacto que cualquiera puede volver a correr. ` +
          'Sin comando no hay reproducibilidad, hay testimonio.',
      );
    } else {
      const npm = /^npm\s+(?:run\s+)?([\w:-]+)/.exec(comando);
      if (npm) {
        const paquete = leerArchivo('package.json');
        const guiones = paquete ? (JSON.parse(paquete).scripts ?? {}) : {};
        const guion = npm[1];
        if (!['ci', 'install', 'test'].includes(guion) && guiones[guion] === undefined) {
          error('C4', `${nivel}: «${comando}» invoca un script «${guion}» que no existe en package.json.`);
        }
      }
    }
    if (!resultado && !artefacto) {
      error('C5', `${nivel} exige «evidence.resultado» o «evidence.artifact»: un comando sin resultado no prueba nada.`);
    }
    if (artefacto && /[\\/]/.test(artefacto) && /\.[a-z0-9]+$/i.test(artefacto) && !existe(artefacto)) {
      error('C5', `${nivel}: el artefacto citado «${artefacto}» no existe en el repositorio.`);
    }
  }

  if (orden >= NIVEL_EVIDENCIA.E4_DEPLOYED_VERIFIED) {
    requiereRevision = true;
    if (!url || !/^https?:\/\//i.test(url)) {
      error('C6', `${nivel} exige «evidence.url» con el entorno desplegado verificado (http/https).`);
    }
    escalar(
      'C6',
      `${nivel} no es verificable desde el repositorio: un clon no puede comprobar un despliegue. ` +
        'Queda marcado como pendiente de confirmación humana; la compuerta no lo da por bueno.',
    );
  }

  if (orden >= NIVEL_EVIDENCIA.E5_INSTITUTIONAL_OPERATION_VERIFIED) {
    requiereRevision = true;
    if (!autoridad || !responsable) {
      error('C7', `${nivel} exige «evidence.autoridad» y «evidence.responsable»: quién autoriza y quién responde.`);
    }
    escalar(
      'C7',
      `${nivel} afirma operación institucional real. Mientras el runtime declare LAB_MOCK y authority: NONE ` +
        '(fronteras FR-01 y FR-02), E5 es incompatible con el estado del sistema: exige ADR, autoridad ' +
        'delegada y trazabilidad institucional verificadas fuera de este repositorio.',
    );
  }

  if (declaracion.semaforo === 'VERDE' && orden < NIVEL_EVIDENCIA.E2_CODE_INSPECTED) {
    error(
      'C8',
      `Semáforo VERDE con evidencia ${nivel}. Verde significa cerrado con evidencia suficiente; ` +
        'E0 y E1 no cierran nada por sí solos.',
    );
  }

  return { hallazgos, afirmaciones, requiere_revision_humana: requiereRevision };
}
