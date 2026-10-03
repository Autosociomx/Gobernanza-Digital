import { describe, expect, it } from 'vitest';
import { runLabMockDemo } from './lab-mock-demo';

describe('demo NEXT LAB_MOCK', () => {
  it('conecta ORBE con SOATM mediante política y evidencia', async () => {
    const output = await runLabMockDemo(() => '2026-01-01T00:00:01.000Z');

    expect(output.executionMode).toBe('LAB_MOCK');
    expect(output.flow.map(({ agentId }) => agentId)).toEqual(['orbe-agent', 'soatm-routing-agent']);
    expect(output.flow.map(({ decision }) => decision)).toEqual(['ALLOW', 'ALLOW']);
    expect(output.flow.at(-1)?.data).toMatchObject({ routeStatus: 'FOUND', institution: 'Servicios Públicos' });
    expect(output.evidence).toHaveLength(4);
    expect(output.evidence.every(({ sha256 }) => sha256)).toBe(true);
    expect(output.governance.externalEffects).toBe(false);
  });
});
