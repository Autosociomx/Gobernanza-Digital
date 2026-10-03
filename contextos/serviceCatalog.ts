import type { ServiceDescriptor } from './contracts';
import { PUBLIC_WORKS_REPORT_SEMANTIC_CONTRACT } from '../shared/semantic/contracts/publicWorksReport';
import {
  TEPIC_LAB_ORGANIZATION,
  TEPIC_PUBLIC_SERVICES_LAB_POST,
} from '../institutional-graph/tepicLab';

const SEMANTIC = PUBLIC_WORKS_REPORT_SEMANTIC_CONTRACT;

export const PUBLIC_WORKS_REPORT_SERVICE: ServiceDescriptor = {
  id: 'mx.nay.tepic.public-works.report',
  version: '0.2.0',
  title: 'Reporte ciudadano de bache o luminaria',
  description: 'Vertical slice de laboratorio para reportes de infraestructura urbana de bajo riesgo.',
  intentNames: [SEMANTIC.intentName],
  purpose: SEMANTIC.purpose,
  semanticContractId: SEMANTIC.id,
  semanticContractVersion: SEMANTIC.version,
  semanticRegistryVersion: SEMANTIC.registryVersion,
  riskLevel: SEMANTIC.riskLevel,
  adapterId: 'lab.public-works-report.v1',
  executionMode: 'LAB_MOCK',
  institutionalTarget: {
    organizationId: TEPIC_LAB_ORGANIZATION.organizationId,
    postId: TEPIC_PUBLIC_SERVICES_LAB_POST.postId,
    resolutionMode: 'LAB_STATIC',
  },
  allowedJurisdictions: [
    jurisdictionCode(
      SEMANTIC.jurisdiction.country,
      SEMANTIC.jurisdiction.state,
      SEMANTIC.jurisdiction.municipality,
    ),
  ],
  requiredFields: SEMANTIC.slots
    .filter((slot) => slot.required)
    .map((slot) => slot.path),
  allowedSubjects: SEMANTIC.subjects.map((subject) => subject.runtimeValue),
};

const SERVICES: readonly ServiceDescriptor[] = [PUBLIC_WORKS_REPORT_SERVICE];

export function getRegisteredServices(): readonly ServiceDescriptor[] {
  return SERVICES;
}

export function findServiceForIntent(intentName: string): ServiceDescriptor | undefined {
  return SERVICES.find((service) => service.intentNames.includes(intentName));
}

export function jurisdictionCode(country: string, state: string, municipality: string): string {
  return [country, state, municipality]
    .map((part) => part.trim().toUpperCase().replace(/\s+/g, '-'))
    .join('-');
}
