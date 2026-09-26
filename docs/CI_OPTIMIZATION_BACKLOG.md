# Backlog vivo de optimización CI

Este backlog existe precisamente para evitar que `verde` se convierta en sinónimo de `terminado`.

## P0 — confiabilidad

- Confirmar que los runners ejecuten al menos el primer step y diferenciar `startup_failure` de fallo de código.
- Mantener checkout limpio como condición de build.
- Asociar artefactos de evidencia al SHA evaluado.

## P1 — calidad de señal

- Separar reproducibilidad, tipos, tests, seguridad y build para localizar fallos.
- Medir duración de jobs y eliminar duplicación cuando exista evidencia de cuello de botella.
- Añadir cobertura cuando se seleccione una herramienta compatible con Vitest; no inventar un umbral antes de medir línea base.
- Convertir invariantes críticas de arquitectura en tests ejecutables, no solo documentación.

## P1 — seguridad

- Mantener `npm audit --omit=dev --audit-level=high` como gate de producción.
- Conservar auditoría completa en el Observatorio para detectar deuda no bloqueante.
- Ampliar detección de secretos mediante una herramienta especializada cuando se adopte y documente.
- Revisar permisos de workflows bajo mínimo privilegio.

## P2 — rendimiento y UX

- Establecer presupuesto de tamaño de bundle después de medir una línea base estable.
- Incorporar Lighthouse/accesibilidad sobre Deploy Preview cuando el entorno sea reproducible.
- Medir tiempo de build y tiempo total de CI antes de fijar SLOs.

## P2 — gobernanza

- CODEOWNERS para superficies críticas.
- Plantilla de PR con evidencia, impacto arquitectónico y estado de madurez.
- Dependabot para npm y GitHub Actions.
- Nunca inferir `INSTITUTIONAL` de un workflow exitoso.

## Criterio de evolución

Una mejora entra como gate solo cuando:

1. mide una propiedad relevante;
2. es reproducible;
3. tiene falsos positivos aceptables;
4. su fallo ofrece una acción concreta;
5. no confunde calidad técnica con madurez institucional.
