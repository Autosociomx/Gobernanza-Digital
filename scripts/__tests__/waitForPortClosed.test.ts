import { describe, expect, it } from 'vitest';
import http from 'node:http';
import { isRealConnectionRefusal, waitForPortClosed } from '../test-orbe-p0-e2e.mts';

// Regresión para el hallazgo P2 de la revisión del PR #63: `waitForPortClosed`
// no debe confundir una respuesta lenta (AbortSignal.timeout) con un puerto
// cerrado. Antes del fix, un server vivo que tardaba ~750ms en responder era
// declarado "cerrado" a los ~517ms mientras seguía aceptando conexiones.

describe('isRealConnectionRefusal', () => {
  it('reconoce un rechazo de conexión real (ECONNREFUSED) como cierre', () => {
    const error = new TypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } });
    expect(isRealConnectionRefusal(error)).toBe(true);
  });

  it('NO trata un TimeoutError de AbortSignal.timeout como cierre', () => {
    const error = new DOMException('The operation was aborted due to timeout', 'TimeoutError');
    expect(isRealConnectionRefusal(error)).toBe(false);
  });

  it('no trata un error sin cause.code como cierre', () => {
    expect(isRealConnectionRefusal(new Error('algo distinto'))).toBe(false);
  });
});

describe('waitForPortClosed', () => {
  it('sigue esperando (no declara cerrado) mientras el server sigue vivo pero lento', async () => {
    // Server real que responde bien (200) pero tarda más que el timeout de
    // 500ms de cada intento individual de waitForPortClosed.
    const server = http.createServer((_req, res) => {
      setTimeout(() => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ executionMode: 'LAB_MOCK', authority: 'NONE' }));
      }, 750);
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('sin puerto asignado');
    const baseUrl = `http://127.0.0.1:${address.port}`;

    try {
      // Con el defecto P2, esto resolvía (falso positivo de "cerrado") antes
      // de agotar los 2000ms. Con el fix, debe agotar el timeout y lanzar,
      // porque el servidor nunca deja de responder.
      await expect(waitForPortClosed(2_000, baseUrl)).rejects.toThrow(/sigue respondiendo/);

      // Verificación independiente: el servidor, en efecto, nunca dejó de
      // responder durante la prueba.
      const stillAlive = await fetch(`${baseUrl}/api/contextos/v0.1/health`);
      expect(stillAlive.status).toBe(200);
    } finally {
      server.close();
    }
  }, 10_000);

  it('declara cerrado cuando el puerto de verdad deja de aceptar conexiones', async () => {
    const server = http.createServer((_req, res) => res.end('ok'));
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('sin puerto asignado');
    const baseUrl = `http://127.0.0.1:${address.port}`;

    await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));

    await expect(waitForPortClosed(2_000, baseUrl)).resolves.toBeUndefined();
  });
});
