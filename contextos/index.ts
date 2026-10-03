/**
 * Context.OS — punto de entrada público.
 *
 * Importar desde aquí, no desde archivos internos, para que la API pública sea
 * una sola y los cambios internos no rompan a quien la usa:
 *
 *   import { createLabContextOSRuntime, evidence, codelens, evidenceIndex } from './contextos';
 *
 * Componentes que expone (detalle: docs/marco/COMPONENTES.md):
 * - Runtime de Context.OS: política determinística, consentimiento, catálogo de
 *   servicios y ejecución en adaptadores LAB_MOCK.
 * - `evidence`: registros de evidencia de cada decisión del runtime (checksum).
 * - `evidenceIndex`: inventario de evidencia documental del repositorio.
 * - `codelens`: CodeLens Gate, compuerta de calidad para candidatos a conocimiento.
 */

export {
  CONTEXTOS_SCHEMA_VERSION,
  type ConsentGrant,
  type ContextEnvelope,
  type Decision,
  type EvidenceRecord,
  type ExecutionMode,
  type ExecutionRequest,
  type ExecutionResult,
  type IntentEnvelope,
  type InstitutionalTargetRef,
  type Jurisdiction,
  type PolicyDecision,
  type RiskLevel,
  type RuntimeRequest,
  type RuntimeResponse,
  type RuntimeStatus,
  type ServiceDescriptor,
} from './contracts';
export { ContextOSRuntime, type RuntimeDependencies } from './runtime';
export { createLabContextOSRuntime } from './factory';
export { evaluatePolicy, POLICY_VERSION, CONTACT_CONSENT_SCOPE } from './policyEngine';
export { validateConsent, type ConsentContext, type ConsentValidation } from './consent';
export {
  findServiceForIntent,
  getRegisteredServices,
  jurisdictionCode,
  PUBLIC_WORKS_REPORT_SERVICE,
} from './serviceCatalog';

export * as evidence from './evidence';
export * as evidenceIndex from './evidence-index';
export * as codelens from './codelens';
