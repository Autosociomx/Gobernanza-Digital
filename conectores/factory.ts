import { crearConectoresMock } from './mock';
import type { ConectorId, Conectores, ResultadoConector } from './types';

// Cada conector real se enciende con CONECTOR_<ID>_ENABLED=true (apagado por
// defecto). Mientras no exista implementación real registrada, un conector
// encendido responde NO_CONFIGURADO: falla cerrado, nunca cae en silencio al mock.

type Env = Record<string, string | undefined>;
export type ImplementacionesReales = Partial<Conectores>;

const IDS: ConectorId[] = ['renapo', 'catastro', 'siapa', 'sat', 'firma'];

export function conectorHabilitado(id: ConectorId, env: Env): boolean {
  return env[`CONECTOR_${id.toUpperCase()}_ENABLED`] === 'true';
}

function noConfigurado(id: ConectorId): ResultadoConector<never> {
  return { conector: id, modo: 'REAL', ok: false, codigoError: 'NO_CONFIGURADO', consultadoEn: new Date().toISOString() };
}

export function crearConectores(env: Env, reales: ImplementacionesReales = {}): Conectores {
  const mock = crearConectoresMock();
  const salida: Record<string, unknown> = { ...mock };
  for (const id of IDS) {
    if (!conectorHabilitado(id, env)) continue;
    if (reales[id]) {
      salida[id] = reales[id];
      continue;
    }
    // Encendido sin implementación: todos los métodos devuelven NO_CONFIGURADO.
    salida[id] = new Proxy({ id }, {
      get: (t, prop) => (prop === 'id' ? id : async () => noConfigurado(id)) as never,
    });
  }
  return salida as unknown as Conectores;
}
