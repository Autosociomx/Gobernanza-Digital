export type ExecutionMode = 'LAB_MOCK' | 'SANDBOX' | 'INSTITUTIONAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AgentDecision = 'ALLOW' | 'DENY' | 'REQUIRE_CONSENT' | 'REQUIRE_HUMAN' | 'ERROR';

export interface ActorRef {
  type: 'citizen' | 'operator' | 'professional' | 'system';
  id?: string;
  assurance?: 'anonymous' | 'otp' | 'verified' | 'institutional';
}

export interface AgentEnvelope<TPayload = unknown> {
  requestId: string;
  timestamp: string;
  actor: ActorRef;
  intent: string;
  domain: string;
  requestedCapability: string;
  riskLevel: RiskLevel;
  executionMode: ExecutionMode;
  consentRef?: string;
  evidenceRefs?: string[];
  policyContext?: Record<string, unknown>;
  payload: TPayload;
}

export interface AuditMetadata {
  agentId: string;
  agentVersion: string;
  startedAt: string;
  completedAt: string;
  executionMode: ExecutionMode;
  provider?: string;
  traceId?: string;
}

export interface AgentResult<TData = unknown> {
  requestId: string;
  decision: AgentDecision;
  reasonCodes: string[];
  data?: TData;
  evidenceRefs: string[];
  humanActionRequired: boolean;
  nextCapability?: string;
  audit: AuditMetadata;
}

export interface PolicyGate {
  evaluate(envelope: AgentEnvelope): Promise<{
    decision: AgentDecision;
    reasonCodes: string[];
  }>;
}

export interface EvidenceSink {
  append(input: {
    requestId: string;
    agentId: string;
    kind: 'START' | 'RESULT' | 'ERROR' | 'ESCALATION';
    payload: unknown;
    timestamp: string;
  }): Promise<string>;
}

export interface Agent<TPayload = unknown, TData = unknown> {
  id: string;
  version: string;
  handle(envelope: AgentEnvelope<TPayload>): Promise<AgentResult<TData>>;
}
