/**
 * Registro de dependencias de los tres niveles de gobierno y rutas de servicio
 * de Tepic, leídos desde `data/dependencias/`.
 *
 * Regla del registro: ninguna dependencia ni ruta existe aquí sin fundamento
 * legal (ordenamiento, artículo y fracción) y fuente con fecha de consulta.
 * Este módulo solo consulta; nunca inventa una dependencia, una unidad ni una
 * atribución que el registro no contenga.
 */
import dependenciasJson from '../../../data/dependencias/dependencias.json';
import rutasJson from '../../../data/dependencias/rutas-tepic.json';

export type NivelGobierno = 'federal' | 'estatal' | 'municipal';
export type EstadoFuente = 'verificado' | 'por_verificar' | 'pendiente';

export interface FundamentoDependencia {
  ordenamiento: string;
  articulo?: string;
  fraccion?: string;
  apartado?: string;
  numeral?: number;
  ultima_reforma: string;
}

export interface Dependencia {
  id: string;
  nombre_oficial: string;
  nivel: NivelGobierno;
  tipo: string;
  subtipo?: string | null;
  padre?: string | null;
  fundamento: FundamentoDependencia;
  fuente: { url: string | null; emisor: string };
  fecha_consulta: string;
  estado_fuente: EstadoFuente;
  notas?: string | null;
}

export interface RutaServicio {
  id: string;
  servicio: string;
  palabras_clave: string[];
  dependencia_id: string | null;
  unidad: string | null;
  fundamento: { articulo: string; fraccion?: string; complementario?: string } | null;
  estado_atribucion: 'verificado' | 'no_expresa';
  nota?: string;
}

export interface RegistroRutas {
  jurisdiccion: string;
  fuente: { url: string; emisor: string; fecha_consulta: string };
  rutas: RutaServicio[];
}

export const DEPENDENCIAS: readonly Dependencia[] = (dependenciasJson as { dependencias: Dependencia[] }).dependencias;
export const RUTAS_TEPIC: RegistroRutas = rutasJson as RegistroRutas;

const POR_ID = new Map(DEPENDENCIAS.map((dependencia) => [dependencia.id, dependencia]));

export function dependenciaPorId(id: string): Dependencia | undefined {
  return POR_ID.get(id);
}

/** Minúsculas y sin acentos, para comparar lo que dice una persona con el registro. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Busca la ruta de servicio cuya palabra clave aparece en el texto.
 * Si varias coinciden, gana la palabra clave más larga (la más específica).
 */
export function buscarRuta(
  texto: string,
  rutas: readonly RutaServicio[] = RUTAS_TEPIC.rutas,
): { ruta: RutaServicio; palabraClave: string } | null {
  const t = normalizar(texto);
  let mejor: { ruta: RutaServicio; palabraClave: string } | null = null;
  for (const ruta of rutas) {
    for (const palabra of ruta.palabras_clave) {
      if (t.includes(normalizar(palabra)) && (!mejor || palabra.length > mejor.palabraClave.length)) {
        mejor = { ruta, palabraClave: palabra };
      }
    }
  }
  return mejor;
}

const PREFIJO_GENERICO = /^(secretaria|agencia) (de la |de las |de los |del |de |para la |para el |para )?/;
const LONGITUD_MINIMA_NOMBRE = 5;

/**
 * Busca dependencias por su nombre oficial (sin el prefijo genérico
 * "Secretaría de…") o por las siglas que el propio nombre oficial declara
 * entre paréntesis, como "(DIF)" o "(SIAPA-Tepic)".
 */
export function buscarDependencias(texto: string, dependencias: readonly Dependencia[] = DEPENDENCIAS): Dependencia[] {
  const t = normalizar(texto);
  return dependencias.filter((dependencia) => {
    const nombre = normalizar(dependencia.nombre_oficial);
    const nucleo = nombre.replace(/\s*\([^)]*\)\s*/g, ' ').trim().replace(PREFIJO_GENERICO, '');
    if (nucleo.length >= LONGITUD_MINIMA_NOMBRE && t.includes(nucleo)) return true;
    const siglas = /\(([^)]+)\)/.exec(nombre)?.[1].split('-')[0].trim();
    if (!siglas || siglas.length < 2) return false;
    const escapadas = siglas.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escapadas}([^a-z0-9]|$)`).test(t);
  });
}
