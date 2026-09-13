/**
 * Tipos del canon del ORBE — la fuente canónica de trámites y servicios.
 *
 * Espejo tipado de `data/canon/*.json`. El contrato publicado vive en
 * `data/canon/schema/canon.schema.json` y lo hace cumplir
 * `scripts/verificar-canon.mjs`; estos tipos son la vista que consume el código.
 *
 * Regla de diseño: el canon es jurisdiccionalmente neutro. Un trámite se
 * declara contra una jurisdicción (federal / estatal / municipal), nunca
 * contra "el municipio" por omisión.
 */

export const CANON_REGISTRY_VERSION = 'orbe.canon.v0.1' as const;

export type NivelJurisdiccion = 'federal' | 'estatal' | 'municipal';
export type EstatusDato = 'propuesto' | 'demo' | 'por_verificar' | 'verificado';
export type EstatusFuente = 'vigente' | 'por_verificar' | 'historico';
export type EfectoJuridico = 'ninguno_en_demo' | 'revision_humana_obligatoria';

export interface Jurisdiccion {
  id: string;
  nivel: NivelJurisdiccion;
  nombre: string;
  padre: string | null;
  /** Única traducción autorizada hacia `jurisdictionCode()` de contextos/serviceCatalog.ts. */
  codigo_contextos: string;
  autoridad_general: string;
}

export interface Fuente {
  id: string;
  autoridad: string;
  nivel: NivelJurisdiccion;
  tipo: string;
  referencia: string;
  alcance: string;
  fecha_consulta: string;
  estatus: EstatusFuente;
  espejo_biblioteca_legal?: string;
  nota_conflicto?: string;
}

/** Un dato operativo con su propio semáforo. */
export interface Dato {
  valor: string | null;
  estatus: EstatusDato;
}

export interface Fundamento {
  fuente: string;
  articulos: string;
}

export interface Tramite {
  id: string;
  nombre: string;
  jurisdiccion: string;
  autoridad: string;
  familia: string;
  descripcion_ciudadana: string;
  expresiones_ciudadanas: string[];
  fundamento: Fundamento[];
  dependencia: Dato;
  costo: Dato;
  plazo: Dato;
  canal_oficial: Dato;
  estatus: EstatusDato;
  efecto_juridico: EfectoJuridico;
  orbe: {
    acciones_permitidas: string[];
    acciones_restringidas: string[];
    /** Enlace profundo a una pantalla real, o null. Nunca se inventa un destino. */
    superficie: string | null;
    contrato_semantico: string | null;
    servicio_contextos: string | null;
  };
}

export interface RegistroJurisdicciones {
  registro: 'orbe.canon.jurisdicciones';
  version: string;
  niveles_validos: NivelJurisdiccion[];
  jurisdicciones: Jurisdiccion[];
}

export interface RegistroFuentes {
  registro: 'orbe.canon.fuentes';
  version: string;
  estatus_validos: EstatusFuente[];
  fuentes: Fuente[];
}

export interface RegistroTramites {
  registro: 'orbe.canon.tramites';
  version: string;
  estatus_validos: EstatusDato[];
  acciones_permitidas_validas: string[];
  tramites: Tramite[];
}

export interface CanonCrudo {
  jurisdicciones: RegistroJurisdicciones;
  fuentes: RegistroFuentes;
  tramites: RegistroTramites;
}
