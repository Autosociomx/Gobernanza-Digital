import type {
  Agent,
  AgentEnvelope,
  AgentResult,
  EvidenceSink,
  PolicyGate,
} from '../contracts/agent';

export interface WorkerDependencies {
  policyGate: PolicyGate;
  evidenceSink: EvidenceSink;
  now?: () => string;
}

export class AgentWorker<TPayload = unknown, TData = unknown> {
  constructor(
    private readonly agent: Agent<TPayload, TData>,
    private readonly deps: WorkerDependencies,
  ) {}

  async process(envelope: AgentEnvelope<TPayload>): Promise<AgentResult<TData>> {
    const now = this.deps.now ?? (() => new Date().toISOString());

    await this.deps.evidenceSink.append({
      requestId: envelope.requestId,
      agentId: this.agent.id,
      kind: 'START',
      payload: {
        domain: envelope.domain,
        capability: envelope.requestedCapability,
        riskLevel: envelope.riskLevel,
        executionMode: envelope.executionMode,
      },
      timestamp: now(),
    });

    const policy = await this.deps.policyGate.evaluate(envelope);

    if (policy.decision !== 'ALLOW') {
      const evidenceRef = await this.deps.evidenceSink.append({
        requestId: envelope.requestId,
        agentId: this.agent.id,
        kind: policy.decision === 'REQUIRE_HUMAN' ? 'ESCALATION' : 'RESULT',
        payload: policy,
        timestamp: now(),
      });

      return {
        requestId: envelope.requestId,
        decision: policy.decision,
        reasonCodes: policy.reasonCodes,
        evidenceRefs: [evidenceRef],
        humanActionRequired: policy.decision === 'REQUIRE_HUMAN',
        audit: {
          agentId: this.agent.id,
          agentVersion: this.agent.version,
          startedAt: envelope.timestamp,
          completedAt: now(),
          executionMode: envelope.executionMode,
        },
      };
    }

    try {
      const result = await this.agent.handle(envelope);
      const evidenceRef = await this.deps.evidenceSink.append({
        requestId: envelope.requestId,
        agentId: this.agent.id,
        kind: result.humanActionRequired ? 'ESCALATION' : 'RESULT',
        payload: result,
        timestamp: now(),
      });

      return {
        ...result,
        evidenceRefs: [...result.evidenceRefs, evidenceRef],
      };
    } catch (error) {
      const evidenceRef = await this.deps.evidenceSink.append({
        requestId: envelope.requestId,
        agentId: this.agent.id,
        kind: 'ERROR',
        payload: {
          message: error instanceof Error ? error.message : 'unknown_error',
        },
        timestamp: now(),
      });

      return {
        requestId: envelope.requestId,
        decision: 'ERROR',
        reasonCodes: ['AGENT_EXECUTION_FAILED'],
        evidenceRefs: [evidenceRef],
        humanActionRequired: envelope.riskLevel === 'HIGH' || envelope.riskLevel === 'CRITICAL',
        audit: {
          agentId: this.agent.id,
          agentVersion: this.agent.version,
          startedAt: envelope.timestamp,
          completedAt: now(),
          executionMode: envelope.executionMode,
        },
      };
    }
  }
}
