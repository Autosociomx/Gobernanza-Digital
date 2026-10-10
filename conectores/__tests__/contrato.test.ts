import { describe, expect, it } from 'vitest';
import { crearConectores } from '../factory';
import { crearConectoresMock } from '../mock';
import type { Conectores } from '../types';

// Prueba de contrato: cuando exista un conector real, se pasa por esta misma
// función junto con el mock.
export function pruebaDeContrato(nombre: string, fabrica: () => Conectores) {
  describe(`contrato de conectores · ${nombre}`, () => {
    it('rechaza entradas vacías con ENTRADA_INVALIDA', async () => {
      const c = fabrica();
      expect((await c.catastro.consultarPredio('')).codigoError).toBe('ENTRADA_INVALIDA');
      expect((await c.siapa.consultarAdeudo(' ')).codigoError).toBe('ENTRADA_INVALIDA');
      expect((await c.sat.consultarConstancia('x')).codigoError).toBe('ENTRADA_INVALIDA');
      expect((await c.renapo.verificarCurp('123')).codigoError).toBe('ENTRADA_INVALIDA');
      expect((await c.firma.firmar('')).codigoError).toBe('ENTRADA_INVALIDA');
    });
    it('identifica su conector en cada respuesta', async () => {
      const c = fabrica();
      expect((await c.catastro.consultarPredio('')).conector).toBe('catastro');
    });
  });
}

pruebaDeContrato('LAB_MOCK', crearConectoresMock);

describe('mock', () => {
  it('nunca declara modo REAL', async () => {
    const c = crearConectoresMock();
    expect((await c.catastro.consultarPredio('A-1')).modo).toBe('LAB_MOCK');
    expect((await c.renapo.verificarCurp('HEGG560427MVZRRL04')).modo).toBe('LAB_MOCK');
  });
  it('CURP: valida formato y no afirma vigencia', async () => {
    const r = await crearConectoresMock().renapo.verificarCurp('HEGG560427MVZRRL04');
    expect(r.ok).toBe(true);
    expect(r.datos?.vigente).toBeUndefined();
  });
  it('firma de laboratorio detecta alteración', async () => {
    const { firma } = crearConectoresMock();
    const f = (await firma.firmar('doc1')).datos!.firma;
    expect((await firma.verificar('doc1', f)).datos?.valida).toBe(true);
    expect((await firma.verificar('doc2', f)).datos?.valida).toBe(false);
  });
});

describe('fábrica', () => {
  it('apagado por defecto: usa mock', async () => {
    expect((await crearConectores({}).sat.consultarConstancia('XAXX010101000')).modo).toBe('LAB_MOCK');
  });
  it('encendido sin implementación real: falla cerrado', async () => {
    const r = await crearConectores({ CONECTOR_SAT_ENABLED: 'true' }).sat.consultarConstancia('XAXX010101000');
    expect(r.ok).toBe(false);
    expect(r.codigoError).toBe('NO_CONFIGURADO');
    expect(r.modo).toBe('REAL');
  });
});
