import type { Agent, AgentEnvelope, AgentResult } from '../../contracts/agent';

type C5Payload = {
  capabilities: Array<{ id: string; maturity: string; blockers?: string[] }>;
};

type C5Data = {
  green: string[];
  yellow: string[];
  red: string[];
};

export class C5GovernanceAgent implements Agent<C5Payload, C5Data> {
  id = 'c5-governance-agent';
  version = '0.1.0';

  async handle(envelope: AgentEnvelope<C5Payload>): Promise<AgentResult<C5Data>> {
    const green: string[] = [];
    const yellow: string[] = [];
    const red: string[] = [];

    for (const capability of envelope.payload.capabilities) {
      const blockers = capability.blockers ?? [];
      if (['PRODUCTION', 'INSTITUTIONAL', 'VALIDATED'].includes(capability.maturity) && blockers.length === 0) {
        green.push(capability.id);
      } else if (['EXPERIMENTAL', 'PILOT'].includes(capability.maturity)) {
        yellow.push(capability.id);
      } else {
        red.push(capability.id);
      }
    }

    return {
      requestId: envelope.requestId,
      decision: 'ALLOW',
      reasonCodes: ['READINESS_CLASSIFIED'],
      data: { green, yellow, red },
      evidenceRefs: [],
      humanActionRequired: false,
      nextCapability: 'evidence.append',
      audit: {
        agentId: this.id,
        agentVersion: this.version,
        startedAt: envelope.timestamp,
        completedAt: new Date().toISOString(),
        executionMode: envelope.executionMode,
      },
    };
  }
}
