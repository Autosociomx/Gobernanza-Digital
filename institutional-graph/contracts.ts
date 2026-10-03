export type OrganizationId = string;
export type PostId = string;
export type MembershipId = string;
export type InstitutionalActId = string;
export type EvidenceId = string;

export interface Organization {
  organizationId: OrganizationId;
  name: string;
  jurisdiction?: string;
  validFrom?: string;
  validTo?: string;
}

export interface Post {
  postId: PostId;
  organizationId: OrganizationId;
  title: string;
  validFrom?: string;
  validTo?: string;
}

export interface Membership {
  membershipId: MembershipId;
  postId: PostId;
  personRef: string;
  validFrom: string;
  validTo?: string;
  sourceEvidenceId?: EvidenceId;
}

export interface InstitutionalAct {
  institutionalActId: InstitutionalActId;
  organizationId: OrganizationId;
  postId: PostId;
  occurredAt: string;
  actType: string;
  evidenceId: EvidenceId;
  membershipId?: MembershipId;
  responsibilityStatus:
    | 'INSTITUTIONAL_LINK_ONLY'
    | 'DOCUMENTED_SIGNATORY'
    | 'DOCUMENTED_AUTHORIZER'
    | 'FORMAL_DETERMINATION';
}

export interface InstitutionalGraphSnapshot {
  organizations: Organization[];
  posts: Post[];
  memberships: Membership[];
  acts: InstitutionalAct[];
}

function atOrAfter(value: string, lower: string): boolean {
  return Date.parse(value) >= Date.parse(lower);
}

function atOrBefore(value: string, upper: string): boolean {
  return Date.parse(value) <= Date.parse(upper);
}

export function membershipCovers(
  membership: Membership,
  occurredAt: string,
): boolean {
  if (!atOrAfter(occurredAt, membership.validFrom)) return false;
  if (membership.validTo && !atOrBefore(occurredAt, membership.validTo)) {
    return false;
  }
  return true;
}

export function validateInstitutionalAct(
  snapshot: InstitutionalGraphSnapshot,
  act: InstitutionalAct,
): string[] {
  const errors: string[] = [];

  const organization = snapshot.organizations.find(
    (item) => item.organizationId === act.organizationId,
  );
  if (!organization) errors.push('ORGANIZATION_NOT_FOUND');

  const post = snapshot.posts.find((item) => item.postId === act.postId);
  if (!post) {
    errors.push('POST_NOT_FOUND');
  } else if (post.organizationId !== act.organizationId) {
    errors.push('POST_ORGANIZATION_MISMATCH');
  }

  if (act.membershipId) {
    const membership = snapshot.memberships.find(
      (item) => item.membershipId === act.membershipId,
    );
    if (!membership) {
      errors.push('MEMBERSHIP_NOT_FOUND');
    } else {
      if (membership.postId !== act.postId) {
        errors.push('MEMBERSHIP_POST_MISMATCH');
      }
      if (!membershipCovers(membership, act.occurredAt)) {
        errors.push('MEMBERSHIP_OUTSIDE_ACT_TIME');
      }
    }
  }

  if (!act.evidenceId) errors.push('EVIDENCE_REQUIRED');

  return errors;
}
