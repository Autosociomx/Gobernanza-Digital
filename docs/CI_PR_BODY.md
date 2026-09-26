# CI: garantías por capas y mejora continua

## Problema

La Guardia anterior concentraba demasiadas garantías en un solo job y el estado global podía confundirse con calidad o madurez. Además, un fallo temprano dificultaba distinguir runner, código, seguridad y build.

## Solución

Esta intervención separa señales técnicas, añade evidencia por SHA y crea un observatorio no bloqueante que continúa buscando deuda incluso cuando los gates pasan.

### Incluye

- Guardia por capas: reproducibilidad, tipos, suite completa, integración/E2E, seguridad y build.
- Sonda mínima de runner.
- Guardia arquitectónica Context.OS/ORBE.
- CodeQL y dependency review.
- actionlint para workflows.
- Dependabot npm/Actions.
- Evidencia y métricas por SHA.
- CODEOWNERS y plantilla de PR.
- Modelo documental de calidad, aceptación y backlog.

## Regla de gobernanza

CI exitosa no implica `VALIDATED`, `PILOT`, `PRODUCTION` ni `INSTITUTIONAL`. Esas transiciones requieren evidencia independiente.
