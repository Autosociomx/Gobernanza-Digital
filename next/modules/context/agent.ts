import type { AgentDecision, AgentEnvelope, PolicyGate } from '../../contracts/agent';

const consentRequiredCapabilities = new Set([
  'record.lookup',
  'record.reference',
  'triage.prioritize',
  'manchester.apply',
  'icd.classify_assist',
  'institutional.write',
  'payment.execute',
]);

const humanAuthorityCapabilities = new Set([
  'clinical.diagnose',
  'clinical.prescribe',
  'clinical.discharge',
  'autonomous.emergency_decision',
  'institutional.write',
]);

export class ContextPolicyAgent implements PolicyGate {
  async evaluate(envelope: AgentEnvelope): Promise<{ decision: AgentDecision; reasonCodes: string[] }> {
    if (envelope.executionMode === 'INSTITUTIONAL' && envelope.actor.assurance !== 'institutional') {
      return { decision: 'DENY', reasonCodes: ['INSTITUTIONAL_ASSURANCE_REQUIRED'] };
    }

    if (humanAuthorityCapabilities.has(envelope.requestedCapability)) {
      return { decision: 'REQUIRE_HUMAN', reasonCodes: ['HUMAN_AUTHORITY_REQUIRED'] };
    }

    if (consentRequiredCapabilities.has(envelope.requestedCapability) && !envelope.consentRef) {
      return { decision: 'REQUIRE_CONSENT', reasonCodes: ['CONSENT_REQUIRED'] };
    }

    // El riesgo CRITICAL puede analizarse en modo acotado (p. ej. triage),
    // pero la autoridad final permanece en manos humanas y del agente de dominio.
    return { decision: 'ALLOW', reasonCodes: ['POLICY_ALLOW'] };
  }
}
