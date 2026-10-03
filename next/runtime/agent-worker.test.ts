import { describe, expect, it } from 'vitest';
import type { Agent, AgentEnvelope, AgentResult, PolicyGate } from '../contracts/agent';
import { AgentWorker } from './agent-worker';
import { InMemoryEvidenceAgent } from '../modules/evidence/agent';

const envelope: AgentEnvelope<{ value: string }> = {
  requestId: 'req_test_001',
  timestamp: '2026-09-10T00:00:00.000Z',
  actor: { type: 'citizen', assurance: 'anonymous' },
  intent: 'test',
  domain: 'test',
  requestedCapability: 'test.read',
  riskLevel: 'LOW',
  executionMode: 'LAB_MOCK',
  payload: { value: 'ok' },
};

const agent: Agent<{ value: string }, { echoed: string }> = {
  id: 'test-agent',
  version: '0.1.0',
  async handle(input): Promise<AgentResult<{ echoed: string }>> {
    return {
      requestId: input.requestId,
      decision: 'ALLOW',
      reasonCodes: ['TEST_OK'],
      data: { echoed: input.payload.value },
      evidenceRefs: [],
      humanActionRequired: false,
      audit: {
        agentId: 'test-agent',
        agentVersion: '0.1.0',
        startedAt: input.timestamp,
        completedAt: input.timestamp,
        executionMode: input.executionMode,
      },
    };
  },
};

describe('AgentWorker', () => {
  it('bloquea la ejecución cuando Context.OS no autoriza', async () => {
    const policyGate: PolicyGate = {
      async evaluate() {
        return { decision: 'DENY', reasonCodes: ['TEST_DENY'] };
      },
    };
    const evidence = new InMemoryEvidenceAgent();
    const worker = new AgentWorker(agent, { policyGate, evidenceSink: evidence });

    const result = await worker.process(envelope);

    expect(result.decision).toBe('DENY');
    expect(result.reasonCodes).toContain('TEST_DENY');
    expect(evidence.list().length).toBe(2);
  });

  it('ejecuta y registra evidencia cuando Context.OS autoriza', async () => {
    const policyGate: PolicyGate = {
      async evaluate() {
        return { decision: 'ALLOW', reasonCodes: ['TEST_ALLOW'] };
      },
    };
    const evidence = new InMemoryEvidenceAgent();
    const worker = new AgentWorker(agent, { policyGate, evidenceSink: evidence });

    const result = await worker.process(envelope);

    expect(result.decision).toBe('ALLOW');
    expect(result.data?.echoed).toBe('ok');
    expect(result.evidenceRefs.length).toBe(1);
    expect(evidence.list().length).toBe(2);
  });
});
