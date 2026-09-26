# Intervención CI — 2026-09-26

## Objetivo

Dejar de optimizar para el color del check y empezar a optimizar para garantías verificables y mejora continua.

## Cambios

- Guardia principal dividida en reproducibilidad, calidad, tests, seguridad, build y resumen.
- Suite completa añadida al gate, además de integración ORBE–Context.OS y E2E P0.
- Auditoría de dependencias de producción y detección básica de secretos.
- Evidencia de build asociada al SHA.
- Guardia arquitectónica independiente.
- Observatorio semanal no bloqueante para encontrar deuda aun cuando CI esté verde.
- Sonda mínima para aislar fallos de runner/startup.
- `actionlint` para validar workflows.
- CodeQL y dependency review.
- Dependabot para npm y GitHub Actions.
- CODEOWNERS y plantilla de PR orientada a evidencia/madurez.
- Contrato documental de evidencia y backlog de optimización.

## Regla

No se considera resuelto un problema solo porque el check global esté verde. Cada garantía y cada estado de madurez se evalúan por separado.
