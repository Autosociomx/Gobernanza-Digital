export const CONTEXTOS_SCHEMA_VERSION = 'contextos.v0.1' as const;

export interface FixtureEnvelope {
  schemaVersion: typeof CONTEXTOS_SCHEMA_VERSION;
}
