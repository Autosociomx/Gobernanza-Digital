import { createHash } from 'node:crypto';
import express from 'express';
import { createLabContextOSRuntime, type LabRuntimeOverrides } from './factory';

/**
 * Semilla de laboratorio: con `CONTEXTOS_LAB_SEED` el runtime emite
 * identificadores y marcas de tiempo derivados de la semilla, de modo que dos
 * corridas del gate E2E produzcan un reporte idéntico byte a byte.
 *
 * Sólo se activa con la variable presente. Sin ella el runtime se comporta
 * exactamente como antes: `randomUUID` y reloj del sistema. No debe usarse
 * fuera del laboratorio — identificadores previsibles no son aceptables donde
 * la evidencia tenga que distinguir solicitudes reales.
 */
function laboratorioDeterminista(seed: string): LabRuntimeOverrides {
  let contador = 0;
  return {
    now: () => new Date('2026-01-01T00:00:00.000Z'),
    idFactory: () => {
      contador += 1;
      const hex = createHash('sha256').update(`${seed}:${contador}`).digest('hex');
      return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
      ].join('-');
    },
  };
}

const app = express();
const seed = process.env.CONTEXTOS_LAB_SEED;
const runtime = createLabContextOSRuntime(seed ? laboratorioDeterminista(seed) : {});
const port = Number(process.env.CONTEXTOS_PORT ?? 3011);
const host = process.env.CONTEXTOS_HOST ?? '127.0.0.1';
const allowedOrigins = new Set(
  (process.env.CONTEXTOS_ALLOWED_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.disable('x-powered-by');
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ error: 'ORIGIN_NOT_ALLOWED' });
  }
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '64kb' }));

app.get('/api/contextos/v0.1/health', (_req, res) => {
  res.json({
    service: 'context-os-runtime',
    version: '0.1.0',
    executionMode: 'LAB_MOCK',
    authority: 'NONE',
  });
});

app.post('/api/contextos/v0.1/execute', async (req, res) => {
  try {
    const result = await runtime.execute(req.body);
    const httpStatus =
      result.status === 'EXECUTED' ? 200 :
      result.status === 'NEEDS_INPUT' || result.status === 'NEEDS_CONSENT' ? 422 :
      result.status === 'DENIED' ? 403 : 500;
    res.status(httpStatus).json(result);
  } catch (error) {
    console.error('Context.OS Runtime error', error);
    res.status(500).json({ error: 'CONTEXTOS_RUNTIME_ERROR' });
  }
});

app.listen(port, host, () => {
  console.log(`Context.OS Runtime v0.1 LAB_MOCK on http://${host}:${port}`);
});
