# Nayarit Digital NEXT — Agentic Rebuild

> Reconstrucción paralela para el Premio a la Innovación Mexicana 2026.

## Regla cero

Esta carpeta NO reemplaza, borra ni migra automáticamente ningún módulo existente. `main` y la implementación histórica siguen siendo la fuente de referencia. `next/` es un escenario limpio para reconstruir la plataforma con contratos explícitos, agentes especializados, evidencia reproducible y límites de autoridad verificables.

## Objetivo

Empaquetar Nayarit Digital como una infraestructura pública interoperable y auditable, no como una colección de demos.

Flujo canónico:

`Persona -> ORBE -> Context.OS -> Agente de dominio -> Evidence.OS -> SOATM / Institutional Graph -> Servicio / humano autorizado`

## Principios

1. **Human authority first**: ningún agente se atribuye autoridad institucional, jurídica o clínica.
2. **Evidence by default**: toda decisión relevante genera o referencia evidencia verificable.
3. **Least privilege**: cada agente recibe únicamente capacidades y datos mínimos.
4. **Consent where required**: los accesos a datos sensibles exigen autorización trazable.
5. **Provider portability**: la lógica institucional no depende de un proveedor de IA.
6. **Event-driven**: los agentes se diseñan como workers continuos; el despliegue 24/7 se habilita solo en infraestructura aprobada.
7. **Fail closed**: si faltan permisos, evidencia o contexto, el agente no ejecuta la acción.
8. **No invented maturity**: cada módulo declara `PROPOSED`, `EXPERIMENTAL`, `VALIDATED`, `PILOT`, `PRODUCTION` o `INSTITUTIONAL`.

## Agentes iniciales

| Agente | Responsabilidad | Riesgo base |
|---|---|---|
| `orbe-agent` | Entrada conversacional, intención y accesibilidad | Medio |
| `context-policy-agent` | Políticas, permisos, consentimiento y límites | Alto |
| `evidence-agent` | Fuentes, hashes, trazabilidad y expediente de evidencia | Alto |
| `soatm-routing-agent` | Dependencia, trámite, servicio y ruta institucional | Medio |
| `citizen-record-agent` | Expediente digital ciudadano y referencias documentales | Alto |
| `health-triage-agent` | Priorización, Manchester, CIE-10/CIE-11 y escalamiento humano | Crítico |
| `c5-governance-agent` | Coordinación, estado institucional y semáforo de conexiones | Alto |
| `award-pack-agent` | Evidencia de candidatura y criterios del Premio 2026 | Bajo |

## Qué significa 24/7

`24/7` es una propiedad operacional, no una frase de marketing. Cada agente tendrá:

- trigger por evento, cola o horario;
- healthcheck;
- reintentos con límite;
- idempotencia;
- trazas y métricas;
- circuit breaker;
- cola de intervención humana;
- modo `LAB_MOCK` por defecto hasta que una integración sea aprobada.

Esta rama todavía NO implica que los agentes estén desplegados permanentemente. El código se prepara para ello sin fingir infraestructura que aún no existe.

## Estructura

```text
next/
  agents/
    registry.yaml
  contracts/
    agent.ts
  runtime/
    agent-worker.ts
  modules/
    health/
    award/
    c5/
  ARCHITECTURE.md
```

## Ruta de construcción

1. Congelar contratos.
2. Implementar runtime común.
3. Encapsular cada módulo detrás de un agente.
4. Añadir pruebas unitarias y E2E.
5. Conectar Evidence.OS como requisito transversal.
6. Construir tres demos reproducibles: trámite simple, expediente/autorización y salud/triage.
7. Desplegar workers 24/7 únicamente después de observabilidad, seguridad y límites de autoridad.

## Demo reproducible LAB_MOCK

La demo mínima conecta una solicitud pública de bache con ORBE, el `ContextPolicyAgent`, el routing SOATM y `InMemoryEvidenceAgent`:

```bash
npm run demo:lab-mock
```

La salida JSON muestra la decisión de cada worker, sus `evidenceRefs` y los registros con SHA-256. El flujo siempre usa `executionMode: LAB_MOCK`, no escribe en sistemas institucionales y no convierte al agente en autoridad administrativa, jurídica o clínica.
