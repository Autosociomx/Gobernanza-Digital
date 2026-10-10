import { createHash } from 'node:crypto';
import type {
  ConectorId,
  Conectores,
  ResultadoConector,
} from './types';

// Mocks deterministas, sin datos personales reales y sin efectos.
// Un mock NUNCA responde `modo: 'REAL'`.

const CURP_RE = /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HMX][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;
const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;

function resultado<T>(
  conector: ConectorId,
  ok: boolean,
  extra: Partial<ResultadoConector<T>> = {},
): ResultadoConector<T> {
  return { conector, modo: 'LAB_MOCK', ok, consultadoEn: new Date().toISOString(), ...extra };
}

function invalido<T>(conector: ConectorId): ResultadoConector<T> {
  return resultado<T>(conector, false, { codigoError: 'ENTRADA_INVALIDA' });
}

function huella(texto: string): string {
  return createHash('sha256').update(texto).digest('hex');
}

export function crearConectoresMock(): Conectores {
  return {
    renapo: {
      id: 'renapo',
      async verificarCurp(curp) {
        // Solo validación sintáctica: NO consulta RENAPO. `vigente` queda sin definir.
        if (!CURP_RE.test(curp.trim().toUpperCase())) return invalido('renapo');
        return resultado('renapo', true, { datos: { formatoValido: true } });
      },
    },
    catastro: {
      id: 'catastro',
      async consultarPredio(clave) {
        if (!clave.trim()) return invalido('catastro');
        return resultado('catastro', true, { datos: { existe: true } });
      },
    },
    siapa: {
      id: 'siapa',
      async consultarAdeudo(contrato) {
        if (!contrato.trim()) return invalido('siapa');
        return resultado('siapa', true, { datos: { conAdeudo: false } });
      },
    },
    sat: {
      id: 'sat',
      async consultarConstancia(rfc) {
        if (!RFC_RE.test(rfc.trim().toUpperCase())) return invalido('sat');
        return resultado('sat', true, { datos: { activo: true } });
      },
    },
    firma: {
      id: 'firma',
      // Marca de laboratorio: NO es firma electrónica avanzada ni e.firma.
      async firmar(h) {
        if (!h.trim()) return invalido('firma');
        return resultado('firma', true, { datos: { firma: `LAB:${huella(h)}` } });
      },
      async verificar(h, firma) {
        if (!h.trim() || !firma.trim()) return invalido('firma');
        return resultado('firma', true, { datos: { valida: firma === `LAB:${huella(h)}` } });
      },
    },
  };
}
