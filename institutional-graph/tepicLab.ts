import type {
  InstitutionalGraphSnapshot,
  Organization,
  Post,
} from './contracts';

export const TEPIC_LAB_ORGANIZATION: Organization = {
  organizationId: 'org:mx:nay:tepic',
  name: 'Ayuntamiento de Tepic',
  jurisdiction: 'MX-NAY-TEPIC',
};

export const TEPIC_PUBLIC_SERVICES_LAB_POST: Post = {
  postId: 'post:mx:nay:tepic:public-services-responsible',
  organizationId: TEPIC_LAB_ORGANIZATION.organizationId,
  title: 'Unidad responsable de Servicios Públicos (LAB)',
};

export const TEPIC_LAB_GRAPH: InstitutionalGraphSnapshot = {
  organizations: [TEPIC_LAB_ORGANIZATION],
  posts: [TEPIC_PUBLIC_SERVICES_LAB_POST],
  memberships: [],
  acts: [],
};
