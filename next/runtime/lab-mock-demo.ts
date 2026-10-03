import type { AgentEnvelope, AgentResult } from '../contracts/agent';
import { ContextPolicyAgent } from '../modules/context/agent';
import { InMemoryEvidenceAgent, type EvidenceRecord } from '../modules/evidence/agent';
import { OrbeAgent } from '../modules/orbe/agent';
import { SoatmRoutingAgent } from '../modules/soatm/agent';
import { AgentWorker } from './agent-worker';

const requestId = 'lab_mock_demo_001';
const timestamp = '2026-01-01T00:00:00.000Z';

export interface LabMockDemoOutput {
  executionMode: 'LAB_MOCK';
  governance: {
    policyGate: string;
    externalEffects: false;
    humanAuthority: 'required_for_institutional_or_clinical_actions';
  };
  flow: Array<{
    agentId: string;
    decision: AgentResult['decision'];
    reasonCodes: string[];
    evidenceRefs: string[];
    data?: unknown;
  }>;
  evidence: readonly EvidenceRecord[];
}

export async function runLabMockDemo(now: () => string = () => new Date().toISOString()): Promise<LabMockDemoOutput> {
  const evidence = new InMemoryEvidenceAgent();
  const policyGate = new ContextPolicyAgent();
  const dependencies = { policyGate, evidenceSink: evidence, now };

  const input: AgentEnvelope<{ text: string; channel: 'text' }> = {
    requestId,
    timestamp,
    actor: { type: 'citizen', assurance: 'anonymous' },
    intent: 'public_service_report',
    domain: 'ORBE',
    requestedCapability: 'intent.parse',
    riskLevel: 'LOW',
    executionMode: 'LAB_MOCK',
    payload: { text: 'Quiero reportar un bache en Tepic', channel: 'text' },
  };

  const orbeResult = await new AgentWorker(new OrbeAgent(), dependencies).process(input);
  if (orbeResult.decision !== 'ALLOW' || !orbeResult.data) {
    return {
      executionMode: 'LAB_MOCK',
      governance: {
        policyGate: 'ContextPolicyAgent (deterministic)',
        externalEffects: false,
        humanAuthority: 'required_for_institutional_or_clinical_actions',
      },
      flow: [toFlowItem(orbeResult)],
      evidence: evidence.list(),
    };
  }

  const routeInput: AgentEnvelope<{ serviceQuery: string; jurisdiction: string }> = {
    requestId,
    timestamp,
    actor: input.actor,
    intent: 'service.route',
    domain: 'SOATM',
    requestedCapability: 'institution.route',
    riskLevel: 'LOW',
    executionMode: 'LAB_MOCK',
    evidenceRefs: orbeResult.evidenceRefs,
    payload: {
      serviceQuery: orbeResult.data.normalizedIntent,
      jurisdiction: 'Tepic, Nayarit',
    },
  };
  const routeResult = await new AgentWorker(new SoatmRoutingAgent(), dependencies).process(routeInput);

  return {
    executionMode: 'LAB_MOCK',
    governance: {
      policyGate: 'ContextPolicyAgent (deterministic)',
      externalEffects: false,
      humanAuthority: 'required_for_institutional_or_clinical_actions',
    },
    flow: [toFlowItem(orbeResult), toFlowItem(routeResult)],
    evidence: evidence.list(),
  };
}

function toFlowItem(result: AgentResult): LabMockDemoOutput['flow'][number] {
  return {
    agentId: result.audit.agentId,
    decision: result.decision,
    reasonCodes: result.reasonCodes,
    evidenceRefs: result.evidenceRefs,
    ...(result.data === undefined ? {} : { data: result.data }),
  };
}
