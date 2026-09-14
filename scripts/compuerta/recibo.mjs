/**
 * Recibo de arquitectura.
 *
 * Lo que queda cuando la compuerta termina: un documento corto que dice qué
 * cambió, con qué evidencia, sobre qué commit y qué quedó abierto. Se guarda
 * como artifact de la corrida para que la afirmación no dependa de la memoria
 * de quien la hizo.
 *
 * El recibo registra lo declarado y lo verificado por separado, a propósito.
 * La compuerta no eleva niveles de evidencia: si alguien declaró E3 y la
 * comprobación falló, el recibo lo dice en vez de corregirlo.
 */

function escaparYaml(valor) {
  const texto = String(valor);
  if (texto === '') return "''";
  if (/^[A-Za-z0-9_.\/:+-]+$/.test(texto)) return texto;
  return `'${texto.replace(/'/g, "''")}'`;
}

function aYaml(objeto, sangria = 0) {
  const espacios = ' '.repeat(sangria);
  const lineas = [];
  for (const [clave, valor] of Object.entries(objeto)) {
    if (valor === undefined) continue;
    if (Array.isArray(valor)) {
      if (!valor.length) {
        lineas.push(`${espacios}${clave}: []`);
        continue;
      }
      lineas.push(`${espacios}${clave}:`);
      for (const elemento of valor) {
        if (elemento !== null && typeof elemento === 'object') {
          const anidado = aYaml(elemento, sangria + 4).split('\n');
          lineas.push(`${espacios}  - ${anidado[0].trim()}`);
          for (const resto of anidado.slice(1)) lineas.push(resto);
        } else {
          lineas.push(`${espacios}  - ${escaparYaml(elemento)}`);
        }
      }
      continue;
    }
    if (valor !== null && typeof valor === 'object') {
      if (!Object.keys(valor).length) {
        lineas.push(`${espacios}${clave}: {}`);
        continue;
      }
      lineas.push(`${espacios}${clave}:`);
      lineas.push(aYaml(valor, sangria + 2));
      continue;
    }
    lineas.push(`${espacios}${clave}: ${typeof valor === 'boolean' ? valor : escaparYaml(valor)}`);
  }
  return lineas.join('\n');
}

export function construirRecibo({ declaracion, resultados, base, cabeza, pr, veredicto, fecha }) {
  const anio = new Date(fecha).getUTCFullYear();
  const change_id =
    (declaracion.presente && declaracion.change_id) ||
    (pr ? `ARCH-${anio}-PR${pr}` : `ARCH-${anio}-LOCAL`);

  const hallazgos = resultados.flatMap((r) => r.hallazgos ?? []);
  const porNivel = (nivel) => hallazgos.filter((h) => h.nivel === nivel).map((h) => `${h.id}: ${h.mensaje}`);

  return {
    change_id,
    generado_por: 'scripts/compuerta-arquitectura.mjs',
    generado_en: new Date(fecha).toISOString(),
    pr: pr ? String(pr) : null,
    base: base ?? null,
    verified_at_commit: (declaracion.presente && declaracion.verified_at_commit) || cabeza || null,
    component: (declaracion.presente && declaracion.componente) || null,
    impact: declaracion.presente ? declaracion.impactos : [],
    evidence_level: (declaracion.presente && declaracion.evidence_level) || 'E0_DECLARED',
    evidence_level_elevado_por_la_compuerta: false,
    maturity: (declaracion.presente && declaracion.madurez) || null,
    semaforo: (declaracion.presente && declaracion.semaforo) || 'GRIS',
    authority_changed: declaracion.presente ? declaracion.authority_changed : null,
    institutional_effects: declaracion.presente ? declaracion.institutional_effects : null,
    adr: (declaracion.presente && declaracion.adr) || null,
    adr_required: resultados.some((r) => r.adr_requerido) || false,
    tests: declaracion.presente ? declaracion.tests : {},
    fronteras_movidas: resultados.flatMap((r) => r.fronteras_movidas ?? []),
    fronteras_tocadas: resultados.flatMap((r) => r.fronteras_tocadas ?? []),
    open_gaps: declaracion.presente ? declaracion.open_gaps : [],
    requiere_revision_humana: resultados.some((r) => r.requiere_revision_humana || r.escala) || false,
    veredicto,
    bloqueos: porNivel('error'),
    escalamientos: porNivel('escalar'),
    avisos: porNivel('aviso'),
  };
}

export function reciboAYaml(recibo) {
  return `# Recibo de arquitectura — Nayarit Digital / ConnectX\n` +
    `# Emitido por la compuerta de arquitectura. Registra lo declarado y lo verificado;\n` +
    `# la compuerta no eleva niveles de evidencia. Ver docs/marco/COMPUERTA_ARQUITECTURA.md\n` +
    `${aYaml(recibo)}\n`;
}
