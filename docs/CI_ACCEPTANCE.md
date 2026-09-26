# Criterios de aceptación de CI

La CI se considera **operativa** cuando existe evidencia de que los runners arrancan y ejecutan pasos. Se considera **confiable para una garantía** cuando el check correspondiente ejecuta la comprobación documentada sobre el SHA indicado.

No usar el estado global como sustituto de estas preguntas:

- ¿arrancó el runner?
- ¿se instaló desde lockfile?
- ¿pasó TypeScript?
- ¿pasó la suite completa?
- ¿pasaron contratos/arquitectura?
- ¿pasó seguridad de producción?
- ¿compiló desde checkout limpio?
- ¿se conservó evidencia?

Un estado `skipped`, `cancelled` o un workflow que no ejecutó el primer step es **sin evidencia**, no aprobación.
