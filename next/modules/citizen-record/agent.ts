import type { Agent, AgentEnvelope, AgentResult } from '../../contracts/agent';

type CitizenRecordPayload = {
  subjectRef: string;
  requestedFields: string[];
  purpose: string;
};

type CitizenRecordData = {
  subjectRef: string;
  permittedFields: string[];
  withheldFields: string[];
  mode: 'REFERENCE_ONLY';
};

const allowedLabFields = new Set(['name_ref', 'document_refs', 'service_history_refs']);

export class CitizenRecordAgent implements Agent<CitizenRecordPayload, CitizenRecordData> {
  id = 'citizen-record-agent';
  version = '0.1.0';

  async handle(envelope: AgentEnvelope<CitizenRecordPayload>): Promise<AgentResult<CitizenRecordData>> {
    const permittedFields = envelope.payload.requestedFields.filter((field) => allowedLabFields.has(field));
    const withheldFields = envelope.payload.requestedFields.filter((field) => !allowedLabFields.has(field));

    return {
      requestId: envelope.requestId,
      decision: 'ALLOW',
      reasonCodes: ['REFERENCE_ONLY', 'DATA_MINIMIZATION_APPLIED'],
      data: {
        subjectRef: envelope.payload.subjectRef,
        permittedFields,
        withheldFields,
        mode: 'REFERENCE_ONLY',
      },
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
