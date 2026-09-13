import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  accionPermitida,
  cadenaDeAutoridad,
  datosPendientes,
  esEjecutable,
  fundamentoPublicable,
  indexarCanon,
  orientacionCiudadana,
  resolverTramites,
} from '../resolver';
import type { CanonCrudo } from '../types';

function cargarCanon(): CanonCrudo {
  const leer = (archivo: string) => JSON.parse(readFileSync(`data/canon/${archivo}`, 'utf-8'));
  return {
    jurisdicciones: leer('jurisdicciones.json'),
    fuentes: leer('fuentes.json'),
    tramites: leer('tramites.json'),
  };
}

const indice = indexarCanon(cargarCanon());

describe('canon del ORBE · neutralidad jurisdiccional', () => {
  it('cubre los tres órdenes de gobierno, no solo el municipal', () => {
    const niveles = new Set(
      indice.tramites.map((t) => indice.jurisdiccionPorId.get(t.jurisdiccion)?.nivel),
    );
    expect(niveles).toContain('municipal');
    expect(niveles).toContain('estatal');
    expect(niveles).toContain('federal');
  });

  it('manda el acta de nacimiento al Registro Civil estatal, no al ayuntamiento', () => {
    const [mejor] = resolverTramites(indice, 'necesito mi acta de nacimiento');
    expect(mejor?.tramite.id).toBe('mx.nay.registro-civil-acta-nacimiento');
    expect(mejor?.nivel).toBe('estatal');
    expect(mejor?.tramite.autoridad).not.toMatch(/Ayuntamiento/i);
  });

  it('resuelve un trámite municipal sin confundirlo con uno estatal', () => {
    const [mejor] = resolverTramites(indice, 'quiero pagar el predial');
    expect(mejor?.tramite.id).toBe('mx.nay.tepic.predial');
    expect(mejor?.nivel).toBe('municipal');
  });

  it('resuelve una necesidad federal desde la misma conversación', () => {
    const [mejor] = resolverTramites(indice, 'cómo registro mi ganado');
    expect(mejor?.tramite.id).toBe('mx.siniiga-identificacion-ganado');
    expect(mejor?.nivel).toBe('federal');
  });

  it('no inventa un trámite cuando no reconoce la expresión', () => {
    expect(resolverTramites(indice, 'quiero comprar boletos para el concierto')).toEqual([]);
  });

  it('cada trámite se resuelve con sus propias expresiones registradas', () => {
    for (const tramite of indice.tramites) {
      for (const expresion of tramite.expresiones_ciudadanas) {
        const ids = resolverTramites(indice, expresion).map((c) => c.tramite.id);
        expect(ids, `"${expresion}" no resuelve a ${tramite.id}`).toContain(tramite.id);
      }
    }
  });

  it('reconstruye la cadena de autoridad de lo municipal a lo federal', () => {
    expect(cadenaDeAutoridad(indice, 'mx.nay.tepic').map((j) => j.nivel)).toEqual([
      'municipal',
      'estatal',
      'federal',
    ]);
  });
});

describe('canon del ORBE · honestidad de datos', () => {
  it('solo deja citar fundamento con fuente vigente', () => {
    const citables = fundamentoPublicable(indice, 'mx.nay.tepic.constancia-residencia');
    expect(citables.map((c) => c.fuente.id)).toContain('lnetb');
    expect(citables.map((c) => c.fuente.id)).not.toContain('ley-organica-municipal-nayarit');
    expect(citables.every((c) => c.fuente.estatus === 'vigente')).toBe(true);
  });

  it('el predial cita fundamento estatal aunque el trámite sea municipal', () => {
    const citables = fundamentoPublicable(indice, 'mx.nay.tepic.predial').map((c) => c.fuente);
    expect(citables.map((f) => f.id)).toContain('ley-hacienda-municipal-nayarit');
    expect(citables.find((f) => f.id === 'ley-hacienda-municipal-nayarit')?.nivel).toBe('estatal');
  });

  it('declara como pendiente todo dato que no está verificado', () => {
    expect(datosPendientes(indice, 'mx.nay.tepic.predial')).toContain('costo');
  });

  it('ningún trámite del canon afirma efectos jurídicos reales todavía', () => {
    for (const tramite of indice.tramites) {
      expect(['ninguno_en_demo', 'revision_humana_obligatoria']).toContain(tramite.efecto_juridico);
      expect(tramite.estatus).not.toBe('verificado');
    }
  });

  it('la orientación ciudadana siempre lleva su advertencia mientras no esté verificada', () => {
    for (const tramite of indice.tramites) {
      const orientacion = orientacionCiudadana(indice, tramite.id);
      expect(orientacion).not.toBeNull();
      expect(orientacion?.advertencia).toBeTruthy();
    }
  });
});

describe('canon del ORBE · límites de acción', () => {
  it('permite orientar y niega emitir en la constancia de residencia', () => {
    expect(accionPermitida(indice, 'mx.nay.tepic.constancia-residencia', 'orientar')).toBe(true);
    expect(accionPermitida(indice, 'mx.nay.tepic.constancia-residencia', 'emitir_documento_oficial')).toBe(false);
  });

  it('niega cualquier acción no declarada, y cualquier trámite desconocido', () => {
    expect(accionPermitida(indice, 'mx.nay.tepic.predial', 'condonar')).toBe(false);
    expect(accionPermitida(indice, 'mx.nay.tepic.predial', 'accion_inventada')).toBe(false);
    expect(accionPermitida(indice, 'mx.nay.inexistente', 'informar')).toBe(false);
  });

  it('solo el reporte de obra pública es ejecutable: el resto es orientación', () => {
    const ejecutables = indice.tramites.filter((t) => esEjecutable(indice, t.id)).map((t) => t.id);
    expect(ejecutables).toEqual(['mx.nay.tepic.reporte-servicios-publicos']);
  });

  it('todo trámite ejecutable lleva binding semántico, como exige Context.OS', () => {
    for (const tramite of indice.tramites) {
      if (tramite.orbe.servicio_contextos) {
        expect(tramite.orbe.contrato_semantico).toBeTruthy();
      }
    }
  });
});
