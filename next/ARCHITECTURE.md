# Arquitectura profesional — Nayarit Digital NEXT

## 1. Tesis de empaquetado

La plataforma se presenta como **infraestructura de coordinación institucional asistida por IA**, con módulos desacoplados y agentes especializados. Cada agente puede razonar sobre su dominio, pero ninguna decisión sensible se ejecuta sin pasar por Context.OS y sin dejar evidencia en Evidence.OS.

## 2. Capas

### Capa A — Experiencia
- ORBE: voz, texto, accesibilidad y captura de intención.

### Capa B — Control
- Context.OS: políticas, identidad, consentimiento, capacidad, límites y escalamiento humano.

### Capa C — Dominio
- SOATM Routing
- Expediente Digital Ciudadano
- Salud / Triage
- C5 / Governance Hub
- futuros módulos sectoriales

### Capa D — Evidencia
- Evidence.OS: procedencia, hash, versión, fuente, decisión, timestamps y auditoría.

### Capa E — Integración
- Institutional Graph
- conectores municipales, estatales y federales
- adaptadores por proveedor y por estándar

## 3. Contrato de ejecución

Toda solicitud debe convertirse en un `AgentEnvelope` con:

- `request_id`
- `actor`
- `intent`
- `domain`
- `risk_level`
- `requested_capability`
- `execution_mode`
- `consent_ref`
- `evidence_refs`
- `policy_context`

Toda respuesta sensible debe devolver:

- `decision`
- `reason_codes`
- `evidence_refs`
- `human_action_required`
- `next_capability`
- `audit_metadata`

## 4. Modos de ejecución

- `LAB_MOCK`: sin autoridad externa ni efectos reales.
- `SANDBOX`: integraciones de prueba y datos no productivos.
- `INSTITUTIONAL`: solo tras convenio, credenciales, control de acceso, auditoría y aprobación humana correspondiente.

El modo se evalúa por capacidad, no por aplicación completa.

## 5. Clasificación de riesgo

- `LOW`: orientación pública sin datos sensibles.
- `MEDIUM`: personalización y routing sin efectos jurídicos.
- `HIGH`: datos personales, expedientes, pagos, cambios administrativos o acceso restringido.
- `CRITICAL`: salud, emergencia, biometría o cualquier decisión con riesgo físico relevante.

A mayor riesgo, mayor exigencia de consentimiento, evidencia y revisión humana.

## 6. Arquitectura de agentes

```text
                        +------------------+
Persona ---------------->    ORBE Agent    |
                        +---------+--------+
                                  |
                                  v
                        +------------------+
                        | Context Policy   |
                        |      Agent       |
                        +---------+--------+
                                  |
             +--------------------+---------------------+
             |                    |                     |
             v                    v                     v
     +---------------+    +---------------+     +---------------+
     | SOATM Routing |    | Citizen Record|     | Health Triage |
     |     Agent     |    |     Agent     |     |     Agent     |
     +-------+-------+    +-------+-------+     +-------+-------+
             |                    |                     |
             +--------------------+---------------------+
                                  |
                                  v
                        +------------------+
                        | Evidence Agent   |
                        +---------+--------+
                                  |
                                  v
                        +------------------+
                        | C5 Governance /  |
                        | Institutional    |
                        | Graph            |
                        +---------+--------+
                                  |
                                  v
                        Servicio / humano autorizado
```

## 7. Salud

El agente de salud NO diagnostica ni prescribe. Sus capacidades iniciales son:

- capturar síntomas reportados;
- aplicar reglas de priorización configuradas y versionadas;
- representar Manchester como una capa de prioridad cuando corresponda;
- asociar terminología CIE-10/CIE-11 solo como clasificación/documentación asistida;
- detectar banderas de escalamiento;
- generar una ruta hacia atención profesional;
- registrar la evidencia y versión de las reglas utilizadas.

Cualquier integración con expediente clínico real requiere autorización institucional y cumplimiento normativo independiente.

## 8. Operación 24/7

Los agentes no deben implementarse como procesos infinitos improvisados. Se empaquetan como workers stateless o semi-stateless sobre una cola/event bus:

1. llega evento;
2. se valida el envelope;
3. Context.OS autoriza o rechaza;
4. el agente ejecuta una capacidad limitada;
5. Evidence.OS registra resultado;
6. se emite un nuevo evento o se escala a humano.

Requisitos previos a producción:

- cola durable;
- dead-letter queue;
- observabilidad;
- métricas SLO/SLA;
- reintentos idempotentes;
- almacenamiento de secretos externo;
- despliegue reproducible;
- rollback;
- runbooks de incidentes.

## 9. Empaquetado para el Premio

El jurado no necesita ver ocho productos. Debe ver una plataforma con tres pruebas:

1. **Orientación pública**: acta o trámite simple.
2. **Expediente + consentimiento**: acceso controlado a información del ciudadano.
3. **Dominio crítico**: salud/triage con escalamiento humano y trazabilidad.

Cada demo debe incluir: entrada, política, ejecución, evidencia, resultado y limitación explícita.
