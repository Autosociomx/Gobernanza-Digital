import { strict as assert } from 'node:assert';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { RuntimeExecutor } from '../src/orbe/contextosBridge';
import { INITIAL_BRIDGE_STATE, processCitizenUtterance } from '../src/orbe/contextosBridge';
import { buildPublicWorksIntentEnvelope, interpretCitizenUtterance } from '../src/orbe/metalinguistics';
import type { RuntimeRequest, RuntimeResponse } from '../contextos/contracts';

const AUDITED_HEAD = 'afb75910bc631d9714fd797cc950550f45f8c7b9';
/** Semilla fija: el reporte debe salir idéntico en cada corrida. */
const LAB_SEED = 'orbe-p0-e2e';
/** Marca fija del reporte, por la misma razón: la fecha real de corrida haría
 *  que dos ejecuciones del mismo código produjeran archivos distintos. */
const REPORT_TIMESTAMP = '2026-01-01T00:00:00.000Z';
const port = 31_000 + (process.pid % 20_000);
const baseUrl = `http://127.0.0.1:${port}`;
const reportPath = path.join(process.cwd(), 'artifacts', 'orbe-p0-e2e-report.md');

type CaseResult = {
  id: number;
  name: string;
  expected: string;
  passed: boolean;
  detail: string;
};

const results: CaseResult[] = [];
let server: ChildProcess | null = null;

function record(id: number, name: string, expected: string, passed: boolean, detail: string) {
  results.push({ id, name, expected, passed, detail });
}

/** Una petición de salud, con corte propio. Sin este timeout, un `fetch` que se
 *  cuelga deja el bucle de espera atascado y el plazo nunca se vuelve a mirar. */
async function probeHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/contextos/v0.1/health`, {
      signal: AbortSignal.timeout(1_000),
    });
    if (!response.ok) return false;
    const body = await response.json() as any;
    assert.equal(body.executionMode, 'LAB_MOCK');
    assert.equal(body.authority, 'NONE');
    return true;
  } catch {
    return false;
  }
}

async function waitForHealth(timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await probeHealth()) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('LAB server did not become healthy dentro del plazo');
}

/** El caso 8 sólo prueba algo si el runtime está realmente apagado. */
async function waitForRuntimeDown(timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!(await probeHealth())) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('El runtime sigue respondiendo: el caso de degradación no probaría nada');
}

function startLabServer() {
  // Binario local en vez de `npx`: `npx` es un envoltorio, así que el servidor
  // real queda como proceso nieto y sobrevive a la señal que se manda al hijo.
  // Además `npx` puede consultar el registro, y el gate debe correr sin red.
  const tsxBin = path.join(
    process.cwd(),
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'tsx.cmd' : 'tsx',
  );
  server = spawn(tsxBin, ['contextos/labServer.ts'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      CONTEXTOS_HOST: '127.0.0.1',
      CONTEXTOS_PORT: String(port),
      CONTEXTOS_ALLOWED_ORIGINS: 'http://localhost:3000',
      CONTEXTOS_LAB_SEED: LAB_SEED,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    // Grupo de procesos propio, para poder apagar el árbol completo.
    detached: process.platform !== 'win32',
  });
  server.stdout?.on('data', (chunk) => process.stdout.write(`[LAB] ${chunk}`));
  server.stderr?.on('data', (chunk) => process.stderr.write(`[LAB] ${chunk}`));
}

function signalTree(child: ChildProcess, signal: NodeJS.Signals) {
  try {
    if (process.platform !== 'win32' && typeof child.pid === 'number') {
      process.kill(-child.pid, signal); // negativo = grupo entero
      return;
    }
  } catch {
    // El grupo ya no existe; se intenta con el hijo directo.
  }
  try {
    child.kill(signal);
  } catch {
    // Ya terminó.
  }
}

async function stopLabServer() {
  const child = server;
  server = null;
  if (!child || child.exitCode !== null) return;
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      signalTree(child, 'SIGKILL');
      resolve();
    }, 3_000);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
    signalTree(child, 'SIGTERM');
  });
}

const httpExecutor: RuntimeExecutor = async (request: RuntimeRequest): Promise<RuntimeResponse> => {
  const response = await fetch(`${baseUrl}/api/contextos/v0.1/execute`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request),
  });
  const body = await response.json() as RuntimeResponse | { error?: string };
  if (!body || typeof body !== 'object' || !('status' in body)) {
    throw new Error(`Invalid runtime response (${response.status}): ${JSON.stringify(body)}`);
  }
  return body as RuntimeResponse;
};

async function runCase(
  id: number,
  name: string,
  expected: string,
  test: () => Promise<string>,
) {
  try {
    const detail = await test();
    record(id, name, expected, true, detail);
  } catch (error) {
    record(id, name, expected, false, error instanceof Error ? error.message : String(error));
  }
}

async function writeReport() {
  await mkdir(path.dirname(reportPath), { recursive: true });
  const passed = results.filter((result) => result.passed).length;
  const lines = [
    '# ORBE P0 E2E — reporte de corrida',
    '',
    `- Marca de corrida (fija, semilla \`${LAB_SEED}\`): ${REPORT_TIMESTAMP}`,
    `- Base auditada: \`${AUDITED_HEAD}\``,
    '- Runtime: `contextos/labServer.ts` por HTTP real',
    '- Execution mode exigido: `LAB_MOCK`',
    '- Authority exigida: `NONE`',
    `- Resultado: **${passed}/${results.length} casos pasan**`,
    '',
    '| # | Caso | Esperado | Resultado | Detalle |',
    '|---:|---|---|---|---|',
    ...results.map((result) =>
      `| ${result.id} | ${result.name.replaceAll('|', '\\|')} | ${result.expected.replaceAll('|', '\\|')} | ${result.passed ? 'PASS' : 'FAIL'} | ${result.detail.replaceAll('|', '\\|').replaceAll('\n', ' ')} |`,
    ),
    '',
    '> Este reporte prueba la frontera semántica, transporte HTTP, `labServer`, runtime, policy, adapter, evidencia y mensaje ciudadano. No afirma efectos institucionales ni sustituye una prueba de navegador real.',
    '',
  ];
  await writeFile(reportPath, lines.join('\n'), 'utf8');
  console.log(`\nReporte: ${reportPath}`);
}

async function main() {
  startLabServer();
  try {
    await waitForHealth();

    await runCase(1, 'Solicitud explícita completa', 'ALLOW → EXECUTED + evidenceId + sha256', async () => {
      const result = await processCitizenUtterance(
        INITIAL_BRIDGE_STATE,
        'Quiero reportar un bache en avenida México 120',
        httpExecutor,
      );
      assert.equal(result.route, 'RUNTIME');
      assert.equal(result.runtimeResponse?.policy.decision, 'ALLOW');
      assert.equal(result.runtimeResponse?.status, 'EXECUTED');
      assert.equal(result.runtimeResponse?.execution?.executionMode, 'LAB_MOCK');
      assert.ok(result.runtimeResponse?.evidence.evidenceId);
      assert.match(result.runtimeResponse?.evidence.hash ?? '', /^[a-f0-9]{64}$/);
      return `evidenceId=${result.runtimeResponse?.evidence.evidenceId}`;
    });

    await runCase(2, 'Aseveración de incidencia', 'CONFIRM_ACTION; cero ejecución', async () => {
      let calls = 0;
      const countedExecutor: RuntimeExecutor = async (request) => {
        calls += 1;
        return httpExecutor(request);
      };
      const result = await processCitizenUtterance(
        INITIAL_BRIDGE_STATE,
        'Hay un bache en avenida México 120',
        countedExecutor,
      );
      assert.equal(result.route, 'CLARIFY');
      assert.equal(result.state.pending?.kind, 'CONFIRM_ACTION');
      assert.equal(calls, 0);
      return 'CONFIRM_ACTION sin llamada HTTP';
    });

    await runCase(3, 'Pregunta informativa', 'CHAT; sin IntentEnvelope ni ejecución', async () => {
      let calls = 0;
      const countedExecutor: RuntimeExecutor = async (request) => {
        calls += 1;
        return httpExecutor(request);
      };
      const result = await processCitizenUtterance(
        INITIAL_BRIDGE_STATE,
        '¿Cómo reporto un bache?',
        countedExecutor,
      );
      assert.equal(result.route, 'CHAT');
      assert.equal(calls, 0);
      assert.equal(result.runtimeResponse, undefined);
      return 'CHAT sin llamada HTTP';
    });

    await runCase(4, 'Ubicación ausente', 'REQUIRE_CLARIFICATION → NEEDS_INPUT; misma intención al continuar', async () => {
      const first = await processCitizenUtterance(
        INITIAL_BRIDGE_STATE,
        'Quiero reportar una luminaria que no sirve',
        httpExecutor,
      );
      assert.equal(first.runtimeResponse?.policy.decision, 'REQUIRE_CLARIFICATION');
      assert.equal(first.runtimeResponse?.status, 'NEEDS_INPUT');
      assert.equal(first.state.pending?.kind, 'LOCATION');
      const requestId = first.state.pending?.kind === 'LOCATION' ? first.state.pending.intent.requestId : undefined;
      assert.ok(requestId);

      const second = await processCitizenUtterance(
        first.state,
        'Avenida Insurgentes esquina con Jacarandas',
        httpExecutor,
      );
      assert.equal(second.runtimeResponse?.status, 'EXECUTED');
      assert.equal(second.runtimeResponse?.correlationId, requestId);
      // El requestId lo genera ORBE por turno y cambia en cada corrida; lo que
      // el caso prueba es que se conserva entre turnos, no su valor literal.
      return 'correlationId conservado entre los dos turnos';
    });

    await runCase(5, 'Expresión ambigua', 'ASK_INTENT; cero ejecución', async () => {
      let calls = 0;
      const countedExecutor: RuntimeExecutor = async (request) => {
        calls += 1;
        return httpExecutor(request);
      };
      const result = await processCitizenUtterance(
        INITIAL_BRIDGE_STATE,
        'bache en mi colonia',
        countedExecutor,
      );
      assert.equal(result.route, 'CLARIFY');
      assert.equal(calls, 0);
      assert.match(result.citizenMessage, /intenci[oó]n/i);
      return 'ASK_INTENT/CLARIFY sin llamada HTTP';
    });

    await runCase(6, 'Binding semántico incompatible', 'Context.OS rechaza', async () => {
      const interpretation = interpretCitizenUtterance('Quiero reportar un bache en calle Puebla 10');
      const intent = buildPublicWorksIntentEnvelope(
        'Quiero reportar un bache en calle Puebla 10',
        interpretation,
        { requestId: 'p0-e2e-semantic-mismatch', now: new Date('2026-09-03T20:00:00.000Z') },
      );
      intent.intent.semanticContractVersion = '999.0.0';
      const response = await httpExecutor({ intent });
      assert.equal(response.status, 'DENIED');
      assert.equal(response.policy.decision, 'DENY');
      assert.ok(response.policy.reasonCodes.some((code) => code.includes('SEMANTIC')));
      return `reasonCodes=${response.policy.reasonCodes.join(',')}`;
    });

    await runCase(7, 'Reenvío del mismo requestId', 'Idempotencia; misma respuesta sin efecto duplicado', async () => {
      const interpretation = interpretCitizenUtterance('Quiero reportar un bache en calle Puebla 10');
      const intent = buildPublicWorksIntentEnvelope(
        'Quiero reportar un bache en calle Puebla 10',
        interpretation,
        { requestId: 'p0-e2e-idempotency', now: new Date('2026-09-03T20:00:00.000Z') },
      );
      const first = await httpExecutor({ intent });
      const second = await httpExecutor({ intent });
      assert.equal(first.status, 'EXECUTED');
      assert.equal(second.status, 'EXECUTED');
      assert.equal(second.evidence.evidenceId, first.evidence.evidenceId);
      assert.equal(second.evidence.hash, first.evidence.hash);
      assert.equal(second.execution?.externalReference, first.execution?.externalReference);
      return `evidenceId estable=${first.evidence.evidenceId}`;
    });

    await stopLabServer();
    await waitForRuntimeDown();

    await runCase(8, 'Runtime caído', 'ORBE no afirma ejecución; degradación segura', async () => {
      const result = await processCitizenUtterance(
        INITIAL_BRIDGE_STATE,
        'Quiero reportar un bache en avenida México 120',
        httpExecutor,
      );
      assert.equal(result.route, 'ERROR');
      assert.match(result.citizenMessage, /No se realiz[oó] ninguna acci[oó]n/i);
      assert.equal(result.runtimeResponse, undefined);
      return 'ERROR seguro, sin runtimeResponse ni afirmación de ejecución';
    });
  } finally {
    await stopLabServer();
    await writeReport();
  }

  const failed = results.filter((result) => !result.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} caso(s) fallaron.`);
  } else {
    console.log('\n8/8 casos ORBE P0 E2E pasan.');
  }
  // Salida explícita: el gate es la puerta de un build (`netlify.toml`) y de un
  // job de CI. Dejar el veredicto en `process.exitCode` y confiar en que el
  // bucle de eventos se vacíe deja el proceso colgado si algo sigue vivo.
  process.exit(failed.length > 0 ? 1 : 0);
}

void main().catch(async (error) => {
  console.error('\nEl gate no pudo completarse:', error);
  await stopLabServer();
  process.exit(1);
});
