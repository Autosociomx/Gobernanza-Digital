import { describe, expect, it } from 'vitest';
import {
  membershipCovers,
  validateInstitutionalAct,
  type InstitutionalGraphSnapshot,
} from '../contracts';

const snapshot: InstitutionalGraphSnapshot = {
  organizations: [
    {
      organizationId: 'org:tepic',
      name: 'Ayuntamiento de Tepic',
    },
  ],
  posts: [
    {
      postId: 'post:servicios-publicos',
      organizationId: 'org:tepic',
      title: 'Dirección de Servicios Públicos',
    },
  ],
  memberships: [
    {
      membershipId: 'membership:001',
      postId: 'post:servicios-publicos',
      personRef: 'person:example',
      validFrom: '2026-01-01T00:00:00.000Z',
      validTo: '2026-12-31T23:59:59.999Z',
    },
  ],
  acts: [],
};

describe('Institutional Graph contracts', () => {
  it('validates membership coverage as a temporal fact only', () => {
    expect(
      membershipCovers(snapshot.memberships[0], '2026-09-07T12:00:00.000Z'),
    ).toBe(true);
    expect(
      membershipCovers(snapshot.memberships[0], '2027-01-01T00:00:00.000Z'),
    ).toBe(false);
  });

  it('rejects an act linked to a membership outside its validity period', () => {
    const errors = validateInstitutionalAct(snapshot, {
      institutionalActId: 'act:001',
      organizationId: 'org:tepic',
      postId: 'post:servicios-publicos',
      membershipId: 'membership:001',
      occurredAt: '2027-01-15T00:00:00.000Z',
      actType: 'service_case_assignment',
      evidenceId: 'evidence:001',
      responsibilityStatus: 'INSTITUTIONAL_LINK_ONLY',
    });

    expect(errors).toContain('MEMBERSHIP_OUTSIDE_ACT_TIME');
  });

  it('allows an institutional-only link without claiming personal responsibility', () => {
    const errors = validateInstitutionalAct(snapshot, {
      institutionalActId: 'act:002',
      organizationId: 'org:tepic',
      postId: 'post:servicios-publicos',
      occurredAt: '2026-09-07T12:00:00.000Z',
      actType: 'service_case_routed',
      evidenceId: 'evidence:002',
      responsibilityStatus: 'INSTITUTIONAL_LINK_ONLY',
    });

    expect(errors).toEqual([]);
  });
});
