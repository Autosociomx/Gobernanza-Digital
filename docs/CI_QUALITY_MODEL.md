# Modelo de calidad CI

## Principio

Un workflow verde no significa que el sistema esté terminado. La CI debe responder preguntas concretas y producir evidencia reproducible por SHA.

## Señales independientes

1. **Reproducibilidad** — ¿un checkout limpio instala y verifica la estructura sin depender del estado de una máquina local?
2. **Calidad** — ¿TypeScript y las reglas estáticas aceptan el cambio?
3. **Tests/contratos** — ¿las unidades, integración ORBE–Context.OS y el vertical slice P0 conservan comportamiento?
4. **Seguridad** — ¿las dependencias de producción evitan vulnerabilidades high/critical y el repositorio/bundle evita patrones de secretos?
5. **Build** — ¿la aplicación completa compila desde checkout limpio y genera evidencia asociada al SHA?

## Lo que CI no decide

CI no eleva por sí sola un componente de LAB_MOCK a EXPERIMENTAL, VALIDATED, PILOT, PRODUCTION o INSTITUTIONAL. La madurez exige evidencia propia, responsables y criterios explícitos.

## Regla CodeLens

Aunque todas las señales estén en verde, la revisión debe seguir buscando:

- tests débiles o inexistentes;
- pasos redundantes o lentos;
- dependencias innecesarias o vulnerables;
- rutas que eludan política, consentimiento o evidencia;
- autoridad impropia delegada a un LLM;
- acoplamiento entre ORBE, Context.OS, SOATM y Evidence.OS;
- diferencias entre documentación y comportamiento ejecutable;
- pérdida de accesibilidad, rendimiento o trazabilidad.

## Evidencia mínima

Cada ejecución debe poder vincular: requisito → cambio → SHA → comprobación → resultado → artefacto.

La ausencia de una comprobación nunca debe interpretarse como aprobación.