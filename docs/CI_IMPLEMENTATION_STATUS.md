# Estado de implementación CI

## Implementado en rama

- pipeline principal por garantías;
- suite completa + integración + E2E;
- auditoría de producción y detección básica de secretos;
- evidencia por SHA;
- guardia arquitectónica;
- sonda de runner;
- actionlint;
- CodeQL;
- Dependency Review;
- Dependabot;
- Observatorio semanal;
- CODEOWNERS y plantilla de PR;
- runbook, backlog y modelo de evidencia.

## Verificación en progreso

Los workflows se ejecutan sobre la rama y deben evaluarse por job/step. No se fusiona automáticamente ni se interpreta un estado global como certificación.
