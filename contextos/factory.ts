import { createPublicWorksReportAdapter } from './adapters/publicWorksReportAdapter';
import { ContextOSRuntime } from './runtime';

/**
 * Inyecciones de laboratorio. `runtime.ts`, `evidence.ts` y el adapter ya
 * aceptaban reloj e identificadores inyectables; la fábrica no los pasaba, así
 * que ninguna corrida podía repetirse byte a byte. Esto sólo abre esa costura.
 *
 * No altera política, consentimiento ni modo de ejecución: los adapters siguen
 * respondiendo `LAB_MOCK` y la autoridad sigue siendo `NONE`.
 */
export interface LabRuntimeOverrides {
  now?: () => Date;
  idFactory?: () => string;
}

export function createLabContextOSRuntime(
  overrides: LabRuntimeOverrides = {},
): ContextOSRuntime {
  const publicWorks = createPublicWorksReportAdapter({ idFactory: overrides.idFactory });
  return new ContextOSRuntime({
    adapters: {
      [publicWorks.id]: publicWorks,
    },
    now: overrides.now,
    idFactory: overrides.idFactory,
  });
}
