export const CONTEXTOS_SCHEMA_VERSION = 'contextos.v0.1' as const;

export type Decision = 'ALLOW' | 'DENY' | 'REQUIRE_CLARIFICATION' | 'REQUIRE_CONSENT';
export type RuntimeStatus = 'EXECUTED' | 'NEEDS_INPUT' | 'NEEDS_CONSENT' | 'DENIED' | 'ERROR';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ExecutionMode = 'LAB_MOCK' | 'SANDBOX' | 'INSTITUTIONAL';

export interface Jurisdiction {
  country: 'MX';
  state: string;
  municipality: string;
}

export interface IntentEnvelope {
  schemaVersion: typeof CONTEXTOS_SCHEMA_VERSION;
  requestId: string;
  occurredAt: string;
  channel: 'orbe' | 'web' | 'api';
  actor: {
    type: 'citizen';
    subjectId?: string;
    authenticated?: boolean;
  };
  jurisdiction: Jurisdiction;
  intent: {
    name: string;
    subject?: string;
    confidence?: number;
    semanticContractId?: string;
    semanticContractVersion?: string;
    semanticRegistryVersion?: string;
  };
  purpose: string;
  data: {
    description?: string;
    location?: {
      lat?: number;
      lng?: number;
      address?: string;
      landmark?: string;
    };
    contact?: {
      name?: string;
      phone?: string;
      email?: string;
    };
  };
}

export interface ContextEnvelope {
  schemaVersion: typeof CONTEXTOS_SCHEMA_VERSION;
  correlationId: string;
  receivedAt: string;
  intent: IntentEnvelope;
  serviceId?: string;
  policyVersion: string;
}

export interface PolicyDecision {
  decision: Decision;
  policyVersion: string;
  reasonCodes: string[];
  requiredFields?: string[];
  requiredConsentScopes?: string[];
}

export interface ConsentGrant {
  grantId: string;
  requestId: string;
  subjectId?: string;
  purpose: string;
  scopes: string[];
  issuedAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface InstitutionalTargetRef {
  organizationId: string;
  postId: string;
  resolutionMode: 'LAB_STATIC' | 'INSTITUTIONAL_DIRECTORY';
}

export interface ServiceDescriptor {
  id: string;
  version: string;
  title: string;
  description: string;
  intentNames: string[];
  purpose: string;
  semanticContractId: string;
  semanticContractVersion: string;
  semanticRegistryVersion: string;
  riskLevel: RiskLevel;
  adapterId: string;
  executionMode: ExecutionMode;
  allowedJurisdictions: string[];
  requiredFields: string[];
  allowedSubjects: string[];
  institutionalTarget?: InstitutionalTargetRef;
}

export interface ExecutionRequest {
  correlationId: string;
  service: ServiceDescriptor;
  intent: IntentEnvelope;
  authorizedConsentScopes: string[];
}

export interface ExecutionResult {
  status: 'ACCEPTED' | 'REJECTED' | 'FAILED';
  adapterId: string;
  executionMode: ExecutionMode;
  externalReference?: string;
  resultCode: string;
  message: string;
}

export interface EvidenceRecord {
  evidenceId: string;
  correlationId: string;
  createdAt: string;
  schemaVersion: typeof CONTEXTOS_SCHEMA_VERSION;
  eventType: 'POLICY_ONLY' | 'EXECUTION';
  serviceId?: string;
  semantic?: {
    contractId: string;
    contractVersion?: string;
    registryVersion?: string;
  };
  policy: {
    decision: Decision;
    policyVersion: string;
    reasonCodes: string[];
  };
  execution?: {
    status: ExecutionResult['status'];
    adapterId: string;
    executionMode: ExecutionMode;
    resultCode: string;
    externalReference?: string;
  };
  dataMinimization: {
    rawCitizenPayloadStored: false;
    personalContactStored: false;
  };
  integrityAssurance: 'CHECKSUM_ONLY';
  hashAlgorithm: 'sha256';
  hash: string;
}

export interface RuntimeRequest {
  intent: IntentEnvelope;
  consent?: ConsentGrant;
}

export interface RuntimeResponse {
  status: RuntimeStatus;
  correlationId: string;
  policy: PolicyDecision;
  service?: ServiceDescriptor;
  execution?: ExecutionResult;
  evidence: EvidenceRecord;
}
