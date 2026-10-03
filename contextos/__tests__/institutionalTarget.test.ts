import { describe, expect, it } from 'vitest';
import { PUBLIC_WORKS_REPORT_SERVICE } from '../serviceCatalog';
import { TEPIC_LAB_GRAPH } from '../../institutional-graph/tepicLab';


describe('Context.OS institutional target bridge', () => {
  it('routes the public-works LAB service to an existing organization and post', () => {
    const target = PUBLIC_WORKS_REPORT_SERVICE.institutionalTarget;

    expect(PUBLIC_WORKS_REPORT_SERVICE.executionMode).toBe('LAB_MOCK');
    expect(target?.resolutionMode).toBe('LAB_STATIC');
    expect(
      TEPIC_LAB_GRAPH.organizations.some(
        (organization) => organization.organizationId === target?.organizationId,
      ),
    ).toBe(true);
    expect(
      TEPIC_LAB_GRAPH.posts.some((post) => post.postId === target?.postId),
    ).toBe(true);
  });

  it('does not bind the LAB target to a person or membership', () => {
    expect(TEPIC_LAB_GRAPH.memberships).toEqual([]);
    expect(TEPIC_LAB_GRAPH.acts).toEqual([]);
  });
});
