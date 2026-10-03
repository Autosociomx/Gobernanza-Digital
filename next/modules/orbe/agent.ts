import type { Agent, AgentEnvelope, AgentResult } from '../../contracts/agent';

type OrbePayload = { text: string; channel?: 'text' | 'voice' };
type OrbeData = { normalizedIntent: string; language: string; accessibilityHints: string[] };

export class OrbeAgent implements Agent<OrbePayload, OrbeData> {
  id = 'orbe-agent';
  version = '0.1.0';

  async handle(envelope: AgentEnvelope<OrbePayload>): Promise<AgentResult<OrbeData>> {
    const text = envelope.payload.text.trim();
    const normalizedIntent = text.toLowerCase();

    return {
      requestId: envelope.requestId,
      decision: 'ALLOW',
      reasonCodes: ['INTENT_NORMALIZED'],
      data: {
        normalizedIntent,
        language: 'es-MX',
        accessibilityHints: envelope.payload.channel === 'voice' ? ['VOICE_INPUT'] : [],
      },
      evidenceRefs: [],
      humanActionRequired: false,
      nextCapability: 'policy.evaluate',
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
