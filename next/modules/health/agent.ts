import type { Agent, AgentEnvelope, AgentResult } from '../../contracts/agent';

type HealthPayload = {
  reportedSymptoms: string[];
  ageBand?: 'child' | 'adult' | 'older_adult';
  requestedCodingSystem?: 'CIE-10' | 'CIE-11';
};

type HealthData = {
  urgency: 'IMMEDIATE_REVIEW' | 'URGENT_REVIEW' | 'ROUTINE_REVIEW' | 'UNDETERMINED';
  codingSystem?: 'CIE-10' | 'CIE-11';
  diagnosticOutput: null;
  requiresProfessionalReview: true;
};

const alarmTerms = [
  'dificultad para respirar',
  'no puede respirar',
  'dolor de pecho',
  'convulsion',
  'convulsión',
  'inconsciente',
  'sangrado abundante',
];

export class HealthTriageAgent implements Agent<HealthPayload, HealthData> {
  id = 'health-triage-agent';
  version = '0.1.0';

  async handle(envelope: AgentEnvelope<HealthPayload>): Promise<AgentResult<HealthData>> {
    const text = envelope.payload.reportedSymptoms.join(' ').toLowerCase();
    const hasAlarmSignal = alarmTerms.some((term) => text.includes(term));

    return {
      requestId: envelope.requestId,
      decision: 'REQUIRE_HUMAN',
      reasonCodes: hasAlarmSignal
        ? ['ALARM_SIGNAL_DETECTED', 'CLINICAL_AUTHORITY_REQUIRED']
        : ['TRIAGE_REQUIRES_PROFESSIONAL_REVIEW'],
      data: {
        urgency: hasAlarmSignal ? 'IMMEDIATE_REVIEW' : 'UNDETERMINED',
        codingSystem: envelope.payload.requestedCodingSystem,
        diagnosticOutput: null,
        requiresProfessionalReview: true,
      },
      evidenceRefs: [],
      humanActionRequired: true,
      nextCapability: hasAlarmSignal ? 'emergency.escalate' : 'care.route',
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
