import type { Agent, AgentEnvelope, AgentResult } from '../../contracts/agent';

type RoutingPayload = { serviceQuery: string; jurisdiction?: string };
type RoutingData = { routeStatus: 'FOUND' | 'NOT_FOUND'; serviceQuery: string; institution?: string };

const labRoutes = [
  {
    keywords: ['bache', 'luminaria', 'alumbrado'],
    institution: 'Servicios Públicos',
  },
] as const;

export class SoatmRoutingAgent implements Agent<RoutingPayload, RoutingData> {
  id = 'soatm-routing-agent';
  version = '0.1.0';

  async handle(envelope: AgentEnvelope<RoutingPayload>): Promise<AgentResult<RoutingData>> {
    const serviceQuery = envelope.payload.serviceQuery.trim();
    const route = labRoutes.find(({ keywords }) =>
      keywords.some((keyword) => serviceQuery.toLowerCase().includes(keyword)),
    );

    return {
      requestId: envelope.requestId,
      decision: 'ALLOW',
      reasonCodes: [route ? 'LAB_MOCK_ROUTE_FOUND' : 'LAB_MOCK_ROUTE_NOT_FOUND'],
      data: {
        routeStatus: route ? 'FOUND' : 'NOT_FOUND',
        serviceQuery,
        ...(route ? { institution: route.institution } : {}),
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
