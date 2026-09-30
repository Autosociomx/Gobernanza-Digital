import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import handler from '../contextos-lab';

const originalNetlify = (globalThis as typeof globalThis & {
  Netlify?: { env: { get(name: string): string | undefined } };
}).Netlify;

function setEnv(values: Record<string, string>) {
  (globalThis as typeof globalThis & {
    Netlify?: { env: { get(name: string): string | undefined } };
  }).Netlify = {
    env: {
      get(name: string) {
        return values[name];
      },
    },
  };
}

function request(path: string, init?: RequestInit) {
  return new Request(`https://example.test${path}`, init);
}

beforeEach(() => {
  setEnv({
    CONTEXTOS_LAB_ENABLED: 'true',
    CONTEXTOS_ALLOWED_ORIGINS: 'https://orbe.example.test',
  });
});

afterEach(() => {
  if (originalNetlify) {
    (globalThis as typeof globalThis & { Netlify?: typeof originalNetlify }).Netlify = originalNetlify;
  } else {
    delete (globalThis as typeof globalThis & { Netlify?: unknown }).Netlify;
  }
});

describe('Context.OS LAB Netlify function boundary', () => {
  it('keeps health explicitly in LAB_MOCK with authority NONE', async () => {
    const response = await handler(request('/api/contextos/v0.1/health'));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      executionMode: 'LAB_MOCK',
      authority: 'NONE',
      executionEnabled: true,
    });
  });

  it('fails closed for an unapproved browser origin', async () => {
    const response = await handler(
      request('/api/contextos/v0.1/health', {
        headers: { origin: 'https://evil.example.test' },
      }),
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'ORIGIN_NOT_ALLOWED' });
  });

  it('rejects execute unless the LAB endpoint receives JSON', async () => {
    const response = await handler(
      request('/api/contextos/v0.1/execute', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: '{}',
      }),
    );
    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({ error: 'CONTENT_TYPE_REQUIRED' });
  });

  it('can disable remote LAB execution without changing the Context.OS contract', async () => {
    setEnv({
      CONTEXTOS_LAB_ENABLED: 'false',
      CONTEXTOS_ALLOWED_ORIGINS: 'https://orbe.example.test',
    });
    const response = await handler(
      request('/api/contextos/v0.1/execute', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      }),
    );
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: 'LAB_EXECUTION_DISABLED' });
  });

  it('rejects non-object JSON before entering Context.OS', async () => {
    const response = await handler(
      request('/api/contextos/v0.1/execute', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '[]',
      }),
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'JSON_OBJECT_REQUIRED' });
  });
});
