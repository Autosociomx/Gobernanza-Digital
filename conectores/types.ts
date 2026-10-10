// Contrato de conectores institucionales (bloque 2 del backlog).
// Cada integración externa (RENAPO/Llave MX, catastro, SIAPA, SAT, firma)
// se declara aquí UNA vez. El mock `LAB_MOCK` y el futuro conector real
// cumplen la misma interfaz y la misma prueba de contrato.

export const CONECTORES_SCHEMA_VERSION = 'conectores.v0.1' as const;

export type ConectorId = 'renapo' | 'catastro' | 'siapa' | 'sat' | 'firma';

// LAB_MOCK: simulación sin efectos. REAL: conexión institucional vigente.
export type ModoEjecucion = 'LAB_MOCK' | 'REAL';

export interface ResultadoConector<T> {
  conector: ConectorId;
  modo: ModoEjecucion;
  ok: boolean;
  datos?: T;
  // Códigos estables, nunca texto libre del proveedor.
  codigoError?: 'ENTRADA_INVALIDA' | 'NO_ENCONTRADO' | 'NO_CONFIGURADO' | 'FALLO_PROVEEDOR';
  consultadoEn: string;
}

export interface ConectorRenapo {
  id: 'renapo';
  verificarCurp(curp: string): Promise<ResultadoConector<{ formatoValido: true; vigente?: boolean }>>;
}

export interface ConectorCatastro {
  id: 'catastro';
  consultarPredio(claveCatastral: string): Promise<ResultadoConector<{ existe: boolean }>>;
}

export interface ConectorSiapa {
  id: 'siapa';
  consultarAdeudo(contrato: string): Promise<ResultadoConector<{ conAdeudo: boolean }>>;
}

export interface ConectorSat {
  id: 'sat';
  consultarConstancia(rfc: string): Promise<ResultadoConector<{ activo: boolean }>>;
}

export interface ConectorFirma {
  id: 'firma';
  firmar(huellaDocumento: string): Promise<ResultadoConector<{ firma: string }>>;
  verificar(huellaDocumento: string, firma: string): Promise<ResultadoConector<{ valida: boolean }>>;
}

export interface Conectores {
  renapo: ConectorRenapo;
  catastro: ConectorCatastro;
  siapa: ConectorSiapa;
  sat: ConectorSat;
  firma: ConectorFirma;
}
