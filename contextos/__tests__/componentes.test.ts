import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const raiz = resolve(__dirname, '..', '..');
const leer = (ruta: string) => readFileSync(resolve(raiz, ruta), 'utf8');

interface Componente {
  id: string;
  externo?: boolean;
  repositorio?: string;
  punto_de_entrada?: string;
  readme?: string;
  version: { constante?: string; archivo?: string; valor: string };
  madurez: string;
  pruebas?: string[];
  proposito: string;
  pregunta_que_responde: string;
  no_hace: string[];
}

const manifiesto = JSON.parse(leer('docs/marco/componentes.json')) as {
  escala_madurez: string[];
  componentes: Componente[];
};
const scripts = (JSON.parse(leer('package.json')) as { scripts: Record<string, string> }).scripts;

describe('registro canónico de componentes (docs/marco/componentes.json)', () => {
  it('no repite identificadores', () => {
    const ids = manifiesto.componentes.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const c of manifiesto.componentes) {
    describe(c.id, () => {
      it('declara propósito, pregunta que responde, límites y madurez válida', () => {
        expect(c.proposito.length).toBeGreaterThan(40);
        expect(c.pregunta_que_responde).toMatch(/^¿.+\?$/);
        expect(c.no_hace.length).toBeGreaterThan(0);
        expect(manifiesto.escala_madurez).toContain(c.madurez);
      });

      if (c.externo) {
        it('un componente externo indica su repositorio', () => {
          expect(c.repositorio).toMatch(/^https:\/\/github\.com\//);
        });
        return;
      }

      it('su punto de entrada y su README existen', () => {
        expect(existsSync(resolve(raiz, c.punto_de_entrada ?? '')), c.punto_de_entrada).toBe(true);
        expect(existsSync(resolve(raiz, c.readme ?? '')), c.readme).toBe(true);
      });

      it('la versión declarada coincide con la constante del código', () => {
        const fuente = leer(c.version.archivo ?? '');
        const patron = new RegExp(`export const ${c.version.constante} = '([^']+)'`);
        expect(patron.exec(fuente)?.[1]).toBe(c.version.valor);
      });

      it('sus comandos de prueba existen en package.json', () => {
        for (const comando of c.pruebas ?? []) expect(scripts[comando], comando).toBeTruthy();
      });
    });
  }
});
