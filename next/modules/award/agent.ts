import type { Agent, AgentEnvelope, AgentResult } from '../../contracts/agent';

type AwardPayload = {
  claims: Array<{ id: string; text: string; evidenceRefs: string[] }>;
  criteria?: string[];
};

type AwardData = {
  verifiedClaimIds: string[];
  unsupportedClaimIds: string[];
  readiness: 'READY_FOR_REVIEW' | 'GAPS_FOUND';
};

export class AwardPackAgent implements Agent<AwardPayload, AwardData> {
  id = 'award-pack-agent';
  version = '0.1.0';

  async handle(envelope: AgentEnvelope<AwardPayload>): Promise<AgentResult<AwardData>> {
    const verifiedClaimIds = envelope.payload.claims
      .filter((claim) => claim.evidenceRefs.length > 0)
      .map((claim) => claim.id);
    const unsupportedClaimIds = envelope.payload.claims
      .filter((claim) => claim.evidenceRefs.length === 0)
      .map((claim) => claim.id);

    return {
      requestId: envelope.requestId,
      decision: 'ALLOW',
      reasonCodes: unsupportedClaimIds.length ? ['UNSUPPORTED_CLAIMS_FOUND'] : ['CLAIMS_HAVE_EVIDENCE_REFS'],
      data: {
        verifiedClaimIds,
        unsupportedClaimIds,
        readiness: unsupportedClaimIds.length ? 'GAPS_FOUND' : 'READY_FOR_REVIEW',
      },
      evidenceRefs: [],
      humanActionRequired: unsupportedClaimIds.length > 0,
      nextCapability: unsupportedClaimIds.length ? 'award.review.requested' : 'dossier.compose',
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
