import { createHash } from 'node:crypto';
import type { EvidenceSink } from '../../contracts/agent';

export interface EvidenceRecord {
  evidenceId: string;
  requestId: string;
  agentId: string;
  kind: 'START' | 'RESULT' | 'ERROR' | 'ESCALATION';
  timestamp: string;
  payload: unknown;
  sha256: string;
}

export class InMemoryEvidenceAgent implements EvidenceSink {
  private readonly records: EvidenceRecord[] = [];

  async append(input: Omit<EvidenceRecord, 'evidenceId' | 'sha256'>): Promise<string> {
    const canonical = JSON.stringify(input);
    const sha256 = createHash('sha256').update(canonical).digest('hex');
    const evidenceId = `ev_${sha256.slice(0, 16)}`;
    this.records.push({ ...input, evidenceId, sha256 });
    return evidenceId;
  }

  list(): readonly EvidenceRecord[] {
    return this.records;
  }
}
