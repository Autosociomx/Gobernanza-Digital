# Arquitectura Canónica de Gobernanza Digital

**Versión:** 0.1  
**Fecha:** 2026-08-19  
**Estado:** arquitectura objetivo provisional  
**Regla:** este documento describe responsabilidades y límites; no implica que todos los componentes estén implementados.

## 1. Principio rector

La arquitectura debe separar experiencia, decisión contextual, identidad, interoperabilidad, autoridad, datos e infraestructura. Ninguna interfaz o modelo de IA deberá absorber responsabilidades que pertenezcan a otras capas.

## 2. Vista de capas

```text
[PERSONA / SERVIDOR PÚBLICO / SISTEMA]
                |
                v
+-----------------------------------+
| 1. EXPERIENCE PLANE               |
| ORBE / Web / Mobile / Voz         |
+-----------------------------------+
                |
                v
+-----------------------------------+
| 2. CONTEXT CONTROL PLANE          |
| Context.OS                        |
| intent / purpose / state / scope  |
+-----------------------------------+
                |
                v
+-----------------------------------+
| 3. TRUST & POLICY PLANE           |
| identity / policy / consent       |
| permissions / evidence / audit    |
+-----------------------------------+
                |
                v
+-----------------------------------+
| 4. INTEROPERABILITY PLANE         |
| service catalog / graph / events  |
| APIs / connectors / adapters      |
+-----------------------------------+
                |
                v
+-----------------------------------+
| 5. INSTITUTIONAL SYSTEMS          |
| treasury / registry / cadastre    |
| health / public services / etc.   |
+-----------------------------------+
```

Transversalmente:

```text
IDENTITY & AUTHORIZATION
OBSERVABILITY
SECURITY
DATA GOVERNANCE
CONFIGURATION
PROVIDER ABSTRACTION
```

## 3. Experience Plane — ORBE

### Responsabilidad
Traducir interacción humana a intención estructurada y presentar respuestas, aclaraciones, consentimiento y resultados.

### Puede
- capturar voz/texto;
- identificar intención candidata;
- pedir aclaraciones;
- explicar requisitos;
- solicitar consentimiento;
- presentar estado y evidencia;
- escalar a humano.

### No puede
- conceder permisos por sí mismo;
- modificar registros sin autorización;
- decidir políticas;
- convertirse en fuente maestra de datos;
- afirmar que una ejecución ocurrió sin evidencia.

### Contrato de salida objetivo

```json
{
  "interaction_id": "uuid",
  "actor_id": "opaque-id",
  "intent": "service.request",
  "confidence": 0.92,
  "parameters": {},
  "locale": "es-MX",
  "channel": "voice",
  "requested_at": "ISO-8601"
}
```

## 4. Context Control Plane — Context.OS

### Responsabilidad
Transformar intención en un plan contextual autorizado y trazable.

### Módulos mínimos
- Intent Resolver
- Context Builder
- Purpose Resolver
- Scope Manager
- State Machine
- Memory Authorization Layer
- Orchestrator
- Policy Gateway
- Evidence Collector

### Estados sugeridos

`RECEIVED -> CLARIFYING -> IDENTIFIED -> CONSENT_REQUIRED -> AUTHORIZED -> PLANNED -> EXECUTING -> WAITING_INSTITUTION -> RESOLVED | DENIED | FAILED | HUMAN_HANDOFF`

### Contrato de ejecución objetivo

```json
{
  "execution_id": "uuid",
  "interaction_id": "uuid",
  "service_id": "municipality.service.version",
  "purpose": "citizen_requested_service",
  "actor": {},
  "scope": [],
  "consent_ref": "consent-id",
  "policy_decision_ref": "decision-id",
  "steps": [],
  "correlation_id": "uuid"
}
```

## 5. Trust & Policy Plane

### Identity
Debe integrar proveedores oficiales o compatibles mediante estándares, no asumir identidad por texto introducido por el usuario.

Objetivo:
- OIDC/OAuth 2.1 cuando aplique;
- credenciales institucionales;
- service accounts;
- separación actor humano/servicio.

### Policy
Las decisiones críticas deben ser deterministas, versionadas y auditables.

Entrada mínima:
- actor;
- role/claims;
- requested action;
- resource;
- jurisdiction;
- purpose;
- context;
- policy version.

Salida mínima:

```json
{
  "decision": "ALLOW | DENY | REQUIRE_CONSENT | REQUIRE_HUMAN",
  "policy_id": "policy-x",
  "policy_version": "1.0.0",
  "reason_codes": [],
  "expires_at": "ISO-8601"
}
```

### Consent
Todo consentimiento deberá ser específico, informado, revocable, limitado por propósito y duración, y referenciable por auditoría.

### Evidence
Cada ejecución sensible deberá producir evidencia verificable: qué se solicitó, quién autorizó, qué sistema ejecutó, resultado, timestamp y correlación.

## 6. Interoperability Plane — SOATM

SOATM debe materializarse como capacidades interoperables, no como una sola aplicación.

### Componentes objetivo

#### Service Catalog
Registro canónico de servicios y capacidades.

#### Government Service Graph
Relaciones entre necesidades, servicios, dependencias, requisitos, permisos y resultados.

#### API Gateway / Service Gateway
Entrada controlada a servicios internos y externos.

#### Connector Runtime
Adaptadores para sistemas heredados o APIs institucionales.

#### Event Bus
Eventos de negocio versionados para desacoplar procesos.

#### Contract Registry
OpenAPI/JSON Schema/event schemas/versiones y pruebas de conformidad.

## 7. ID.mx

ID.mx no debe entenderse como identity provider por defecto.

Debe evolucionar como representación autorizada de contexto/expediente reusable bajo finalidad explícita.

Posibles responsabilidades:
- referencias documentales;
- atributos verificados;
- consentimientos;
- historial de interacciones autorizadas;
- evidencias;
- preferencias;
- vínculos a fuentes institucionales.

Debe evitar duplicar datos cuando una referencia verificable a la fuente sea suficiente.

## 8. Sistemas institucionales

Cada dominio conserva autoridad y ownership sobre sus datos/actos.

Ejemplos:
- Tesorería
- Catastro
- Registro Civil
- Desarrollo Urbano
- Servicios Públicos
- Salud
- Bienestar

Gobernanza Digital orquesta y conecta; no absorbe automáticamente estos sistemas.

## 9. Modelo de adaptadores

Todo sistema institucional deberá integrarse detrás de una interfaz estable.

```text
Context.OS
   |
SOATM Service Contract
   |
Institution Adapter
   |
Legacy / SaaS / API / Database / Queue
```

La capa superior no deberá conocer detalles del proveedor subyacente.

## 10. Provider abstraction para IA

```text
AIProvider
+-- interpretIntent()
+-- extractEntities()
+-- generateExplanation()
+-- summarize()
```

Los modelos concretos de Gemini/OpenAI/locales deberán implementarse como proveedores sustituibles.

Ningún proveedor debe controlar policy, identidad, persistencia o evidencia.

## 11. Datos

Clasificar los datos al menos en:

- públicos;
- internos;
- personales;
- sensibles;
- evidencia/auditoría;
- secretos/credenciales.

Cada dato deberá tener owner, finalidad, retención, base jurídica, nivel de acceso y mecanismo de eliminación/rectificación cuando aplique.

## 12. Observabilidad

Mínimos:
- structured logs;
- correlation ID;
- traces;
- métricas de latencia/error;
- audit events separados de logs operativos;
- health/readiness endpoints;
- redacción de PII.

## 13. Seguridad

Principios:
- Zero Trust;
- Least Privilege;
- deny by default;
- data minimization;
- explicit consent;
- secret isolation;
- signed/verifiable evidence;
- human handoff;
- rate limiting;
- prompt-injection boundaries.

## 14. Flujo end-to-end objetivo

```text
1. Persona expresa necesidad
2. ORBE estructura intención
3. Context.OS construye contexto
4. Identity valida actor si es necesario
5. Policy evalúa acción y propósito
6. Consent se obtiene si aplica
7. Service Catalog resuelve servicio
8. SOATM selecciona contrato/adaptador
9. Sistema institucional ejecuta
10. Evidence registra resultado
11. ORBE explica resultado verificable
12. Audit conserva trazabilidad
```

## 15. Primer vertical recomendado

Elegir un flujo municipal de baja ambigüedad, alto valor y riesgo jurídico controlable para construir el primer end-to-end real.

Criterios:
- datos disponibles;
- dependencia institucional clara;
- pocos pasos;
- resultado verificable;
- posibilidad de fallback humano;
- sin requerir inicialmente decisiones jurídicas complejas.

## 16. Regla de madurez

Un componente sólo puede pasar de `PROTOTIPO` a `IMPLEMENTADO` cuando exista código reproducible; a `INTEGRADO` cuando tenga dependencia real conectada; y a `PRODUCCIÓN` cuando exista operación desplegada, monitoreada y con evidencia.
