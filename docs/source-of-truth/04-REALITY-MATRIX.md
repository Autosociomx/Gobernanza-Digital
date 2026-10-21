# Matriz de Realidad — Gobernanza Digital

**Versión:** 0.2  
**Fecha de corte:** 2026-08-19  
**Objetivo:** separar concepto, documentación, código, integración y producción usando evidencia reproducible.

## 1. Estados

Madurez:

`CONCEPTO -> ESPECIFICACIÓN -> PROTOTIPO -> IMPLEMENTADO -> INTEGRADO -> PRODUCCIÓN`

Estados terminales: `DEPRECADO`, `DESCARTADO`.

Evidencia: `CODE`, `DEPLOYMENT`, `DOC`, `DECISION`, `RESEARCH`, `CHAT`, `ARTIFACT`, `TEST`.

Confianza: `CONFIRMADO`, `ALTA_CONFIANZA`, `PROBABLE`, `NO_VERIFICADO`, `CONTRADICTORIO`.

## 2. Evidencia nueva incorporada

### ORBE ciudadano v0.1

Artefacto auditado: `ORBE_ciudadano_nucleo_conversacional_v0.1_limpio_2026-08-19.zip`  
SHA-256: `e777cf5ec88a3dd42f9593ff1afa47a2614f9e8281e101087297b3c5f8db2407`

### Context.OS Observatory v0.3

Artefacto auditado: `context-os-observatory-v03.zip`  
SHA-256: `00ee850882be1d8ccc319acc75647092d8c198ee344b501ced943fa844f2188a`

Verificación ejecutada: `npm run verify` -> **24/24 tests PASS**, 0 fallos.  
Servidor local y endpoints de health, ontology, project-baseline y claims lint verificados.

Detalles: `05-ARTIFACT-AUDIT-2026-08-19.md`.

## 3. Matriz canónica v0.2

| Capacidad | Madurez | Evidencia | Confianza | Qué sí existe | Qué falta para ascender |
|---|---|---|---|---|---|
| ORBE Experience Plane | IMPLEMENTADO | ARTIFACT, CODE | CONFIRMADO | UI ciudadana, ocho casos, diálogo por slots, límites de autoridad | integrar contrato con Context.OS Runtime |
| ORBE voz | IMPLEMENTADO dependiente del cliente | ARTIFACT, CODE | CONFIRMADO | SpeechRecognition/webkitSpeechRecognition + speechSynthesis | ASR/TTS portable, accesible y con estrategia soberana |
| ORBE intent resolver | IMPLEMENTADO determinístico | ARTIFACT, CODE | CONFIRMADO | matching por keywords + cambio de intención | IntentEnvelope, NLP semántico y pruebas de regresión |
| ORBE cerebro cognitivo | ESPECIFICACIÓN | ARTIFACT, DOC | CONFIRMADO | capas, habilidades, rúbrica y roadmap descritos en `/cerebro` | convertir narrativa en componentes ejecutables |
| ORBE LLM | NO IMPLEMENTADO en artefacto v0.1 | ARTIFACT, CODE | CONFIRMADO | ninguna llamada LLM localizada | AIProvider opcional detrás de política y contratos |
| ORBE persistencia | NO IMPLEMENTADA | ARTIFACT, CODE | CONFIRMADO | estado vive en React; `db/schema.ts` vacío | session/context store con minimización y TTL |
| Human handoff | PROTOTIPO UX / NO INTEGRADO | ARTIFACT, CODE | ALTA_CONFIANZA | mensajes y botón de siguiente paso | canal humano real, SLA, tracking y evidencia |
| Context.OS Observatory | IMPLEMENTADO / VERIFICADO | ARTIFACT, CODE, TEST | CONFIRMADO | servidor, scanner, store, ontología, estrategia, grafo, linter, dashboard | empaquetado/operación si se adopta como servicio interno |
| Observatory API | IMPLEMENTADA / VERIFICADA LOCAL | ARTIFACT, TEST | CONFIRMADO | health, scan, discover, audit, graph, strategy, ontology, export, etc. | auth/gateway/rate-limit antes de exposición pública |
| Observatory security scanner | IMPLEMENTADO | ARTIFACT, CODE, TEST | CONFIRMADO | bloqueo SSRF, IP privadas, DNS público, pinning, límites | threat model externo y pruebas de carga/adversariales |
| Observatory evidence integrity | IMPLEMENTADO | ARTIFACT, CODE, TEST | CONFIRMADO | hash canónico e integridad referencial | firma institucional/ledger si se requiere no repudio |
| Observatory claim linter | IMPLEMENTADO CON BRECHA P1 | ARTIFACT, CODE, TEST | CONFIRMADO | reglas de claims legales, identidad, seguridad, soberanía | corregir variante `cumple 100% la LNETB` y añadir regresión |
| OpenAI analyzer del Observatory | IMPLEMENTADO COMO OPCIONAL | ARTIFACT, CODE, TEST mock | ALTA_CONFIANZA | adapter Responses API; scoring determinístico no depende de IA | prueba real con credencial autorizada y provider abstraction |
| Context.OS Runtime | ESPECIFICACIÓN / NO IMPLEMENTADO EN OBSERVATORY | DOC, DECISION, ARTIFACT | CONFIRMADO | responsabilidad y ontología están claras | construir control plane mínimo ejecutable |
| Policy Engine | ESPECIFICACIÓN | DECISION, DOC | ALTA_CONFIANZA | requisito arquitectónico definido | PDP versionado con ALLOW/DENY/REQUIRE_* y tests |
| Consent Engine | ESPECIFICACIÓN | DECISION, DOC | ALTA_CONFIANZA | principio y estados definidos | grants persistentes con purpose, scope, TTL, revoke |
| Evidence Record de ejecución | ESPECIFICACIÓN | DECISION, DOC | ALTA_CONFIANZA | requisito de trazabilidad | emitir evidencia en el primer vertical slice |
| ID.mx | CONCEPTO / ESPECIFICACIÓN | DOC, DECISION | ALTA_CONFIANZA | rol definido como índice/vista de evidencia autorizada | esquema, ownership y primer caso read-only |
| Llave MX | NO INTEGRADO | DOC, AUDIT | ALTA_CONFIANZA | arquitectura prevé federación | convenio/acceso + integración oficial demostrable |
| SOATM Integration Plane | ESPECIFICACIÓN / IMPLEMENTACIÓN PARCIAL en repo madre | DOC, CODE previo | ALTA_CONFIANZA | concepto operativo y piezas de integración | contratos, adapters, service auth y event contract formales |
| Service Catalog | PROTOTIPO / IMPLEMENTADO PARCIAL | CODE, DOC | ALTA_CONFIANZA | catálogo/intents disponibles | registry canónico versionado con autoridad y fuentes |
| Government Service Graph | ESPECIFICACIÓN; grafo de evidencia sí existe en Observatory | ARTIFACT, DOC | ALTA_CONFIANZA | patrón y primer grafo de evidencia ejecutable | separar Service Graph operacional del Evidence Graph |
| Institutional Connectors | PROTOTIPO / NO CERTIFICADO | CODE previo | PROBABLE | existen integraciones/mocks en repo madre | inventario mock/sandbox/real + adapter contract |
| Pagos municipales | PROTOTIPO / SANDBOX | auditoría previa | ALTA_CONFIANZA | demos de pago | gateway institucional y conciliación real |
| Firebase/Firestore | IMPLEMENTADO / CONFIGURADO PARCIAL | CODE previo | ALTA_CONFIANZA | configuración y reglas existen | data abstraction, ownership y exit strategy |
| Gemini | IMPLEMENTADO COMO PROVEEDOR EN REPO MADRE | CODE previo | ALTA_CONFIANZA | integración previa existe | desacoplar mediante AIProvider; no convertirlo en dependencia constitucional |
| Tests Observatory | IMPLEMENTADOS | TEST | CONFIRMADO | 24/24 PASS el 2026-08-19 | cobertura de producción, carga y seguridad adicional |
| Tests ORBE v0.1 | INSUFICIENTES / BUILD NO REPRODUCIDO EN ESTA AUDITORÍA | ARTIFACT | CONFIRMADO | test de render/metadata incluido | tests unitarios intent/dialogue/voz/a11y + build reproducible |
| Producción gubernamental | NO CONFIRMADA | ninguna evidencia suficiente | ALTA_CONFIANZA | demos y artefactos tecnológicos | piloto institucional formal, operación, seguridad y métricas |
| Nayarit Digital | IMPLEMENTACIÓN TERRITORIAL EN DESARROLLO | CODE, DOC, DECISION | ALTA_CONFIANZA | instancia territorial del ecosistema | alcance/piloto/autoridad institucional formalizados |

## 4. Corrección ontológica principal

No usar `Context.OS` como una sola etiqueta para todo.

A partir de esta versión se distinguen:

1. **Context.OS Observatory** — Evidence Intelligence. Ya implementado y probado.
2. **Context.OS Runtime** — Institutional Control Plane. Pendiente de implementación mínima.

El Observatory puede alimentar decisiones del Runtime, pero **no autoriza ni ejecuta actos administrativos**.

## 5. Claims permitidos hoy

- “ORBE cuenta con una interfaz conversacional funcional, diálogo de seguimiento y voz basada en capacidades del navegador.”
- “Context.OS Observatory v0.3 es software ejecutable; su suite actual pasa 24/24 pruebas.”
- “El Observatory separa evidencia observada, inferencias e incógnitas y genera estrategia trazable.”
- “La arquitectura distingue ORBE, Context.OS Runtime, ID.mx, Llave MX y sistemas institucionales.”
- “Estamos construyendo el Runtime de Context.OS como pieza separada del Observatorio.”

## 6. Claims bloqueados

No afirmar sin evidencia adicional:

- “ORBE ya posee un cerebro cognitivo autónomo.”
- “ORBE está conectado a sistemas municipales reales.”
- “ORBE procesa voz mediante infraestructura soberana propia.”
- “Context.OS Observatory es el Runtime institucional.”
- “Context.OS autoriza actos administrativos.”
- “Estamos integrados oficialmente con Llave MX.”
- “Cumplimos 100% la LNETB.”
- “SOATM ya conecta todos los sistemas municipales.”
- “ID.mx es un expediente único oficial.”
- “La plataforma está lista para millones de usuarios.”
- “Operamos oficialmente para un gobierno.”

## 7. Próximo criterio de construcción

El siguiente incremento no debe ser otro dashboard.

Debe construir el **Vertical Slice 001**:

`ORBE -> IntentEnvelope -> Context.OS Runtime -> Policy/Consent -> SOATM Adapter -> EvidenceRecord -> ORBE`

Caso recomendado: reporte de bache/luminaria, por ser de menor riesgo que pagos, identidad o modificación registral.

Contratos mínimos:

- `IntentEnvelope`
- `ContextEnvelope`
- `PolicyDecision`
- `ConsentGrant`
- `ServiceDescriptor`
- `ExecutionRequest`
- `ExecutionResult`
- `EvidenceRecord`
