# Contexto Maestro de Gobernanza Digital

**Versión:** 0.1  
**Fecha de corte:** 2026-08-19  
**Estado:** fuente de verdad provisional  
**Dependencia constitucional:** `00-CONSTITUTION.md`

## 1. Idea central en una frase

Construir una arquitectura pública interoperable que permita a una persona expresar una necesidad y que el ecosistema traduzca esa intención en una ruta institucional segura, verificable, trazable y autorizada, sin obligar al ciudadano a integrar manualmente dependencias y sistemas.

## 2. Problema fundamental

La fragmentación gubernamental separa identidad, trámites, pagos, documentos, datos, dependencias y canales de atención. El ciudadano termina actuando como integrador humano entre sistemas que deberían interoperar.

## 3. Visión

Gobernanza Digital debe funcionar como infraestructura componible y neutral, no como una aplicación monolítica. Las experiencias ciudadanas, los motores de IA, los sistemas institucionales y los proveedores deben poder cambiar sin romper el núcleo de interoperabilidad, autoridad, permisos y evidencia.

## 4. Arquitectura canónica provisional

```text
GOBERNANZA DIGITAL
|
+-- EXPERIENCIA
|   +-- ORBE
|
+-- CONTROL CONTEXTUAL
|   +-- Context.OS
|
+-- IDENTIDAD / CONTEXTO CIUDADANO
|   +-- ID.mx
|
+-- CAPA OPERATIVA MUNICIPAL
|   +-- SOATM
|
+-- INTEROPERABILIDAD
|   +-- Service Catalog
|   +-- APIs
|   +-- Connectors
|   +-- Events
|   +-- Government Service Graph
|
+-- CONFIANZA
|   +-- Policy
|   +-- Permission
|   +-- Consent
|   +-- Evidence
|   +-- Audit
|   +-- Human-in-the-loop
|
+-- SISTEMAS INSTITUCIONALES
|   +-- Tesorería
|   +-- Catastro
|   +-- Registro Civil
|   +-- Servicios Públicos
|   +-- Salud
|   +-- Bienestar
|   +-- otros
|
+-- IMPLEMENTACIONES TERRITORIALES
    +-- Tepic
    +-- Nayarit Digital
```

## 5. Responsabilidades por componente

### ORBE
Capa de interacción. Escucha, comprende, aclara, orienta, solicita consentimiento, canaliza y explica. No gobierna políticas ni autoridad jurídica.

### Context.OS
Plano de control contextual. Debe resolver intención, propósito, permisos, consentimiento, estado, memoria autorizada, políticas, orquestación, trazabilidad y evidencia.

### ID.mx
Capa de expediente/contexto ciudadano autorizado. No sustituye identidad oficial ni Llave MX.

### SOATM
Capa operativa municipal e interfaz de interoperabilidad. Debe desacoplar servicios municipales de aplicaciones concretas y de proveedores.

### Nayarit Digital
Implementación territorial y demostrador del ecosistema. No es el núcleo completo.

### Sistemas institucionales
Tesorería, Catastro, Registro Civil, Salud, Obras, Bienestar y otros son dominios conectados al núcleo, no el núcleo mismo.

## 6. Jerarquía de evidencia

Toda afirmación deberá etiquetarse con uno de estos tipos:

- `CODE`: implementación verificable;
- `DEPLOYMENT`: comportamiento comprobable desplegado;
- `DOC`: documentación técnica/institucional;
- `DECISION`: decisión explícita vigente;
- `RESEARCH`: investigación externa;
- `CHAT`: conversación;
- `INFERENCE`: conclusión razonada sin confirmación.

Confianza:

- `CONFIRMADO`
- `ALTA_CONFIANZA`
- `PROBABLE`
- `NO_VERIFICADO`
- `CONTRADICTORIO`

## 7. Estado real inicial

| Componente | Estado | Confianza | Evidencia inicial | Observación |
|---|---|---|---|---|
| ORBE ciudadano | PROTOTIPO / IMPLEMENTADO PARCIAL | ALTA_CONFIANZA | CODE / PR #44 | Existe UI e intents; requiere verificar integración total de voz y flujo de ejecución |
| Catálogo municipal | IMPLEMENTADO | ALTA_CONFIANZA | CODE / PR #44 | Intents y estados de evidencia estructurados |
| Context.OS runtime | ESPECIFICACIÓN / PARCIAL | PROBABLE | DOC / CODE parcial | No confirmado como control plane completo en producción |
| SOATM | ESPECIFICACIÓN / ARQUITECTURA | ALTA_CONFIANZA | DOC / CHAT / CODE parcial | No afirmar todavía como bus interoperable plenamente operativo |
| ID.mx | CONCEPTO / ESPECIFICACIÓN | PROBABLE | DOC / CHAT | Requiere verificación de persistencia e integración real |
| Llave MX | NO INTEGRADO | ALTA_CONFIANZA | auditorías del repo | No confundir validación local de CURP con identidad oficial |
| Pagos municipales | PROTOTIPO / SANDBOX | ALTA_CONFIANZA | CODE / auditoría | No evidencia de cobro municipal real de producción |
| Backend gubernamental | IMPLEMENTADO PARCIAL | ALTA_CONFIANZA | CODE / auditoría | Requiere endpoints institucionales reales y contratos formales |
| Pruebas automatizadas | DEUDA CRÍTICA | ALTA_CONFIANZA | auditoría previa | Debe revalidarse contra `main` actual |
| Nayarit Digital | IMPLEMENTACIÓN TERRITORIAL EN DESARROLLO | ALTA_CONFIANZA | DOC / CODE / CHAT | No confundir con arquitectura central completa |

## 8. Decisiones consolidadas iniciales

1. Gobernanza Digital es la arquitectura superior; Nayarit Digital es una implementación territorial.
2. ORBE es interfaz, no autoridad ni sistema operativo.
3. Context.OS es el plano de control contextual, no un chatbot.
4. ID.mx no compite con Llave MX.
5. Los dominios municipales son sistemas conectados, no componentes constitucionales del núcleo.
6. La IA debe ser sustituible y las políticas críticas deben quedar fuera del LLM.
7. La continuidad institucional debe sobrevivir a cambios políticos y tecnológicos.
8. La documentación histórica personalista no gobierna la arquitectura vigente.

## 9. Conceptos deprecados o reclasificados

### Aplicación Madre / arquitectura personalista
**Estado:** `DEPRECADO` como arquitectura central.  
**Conservación:** antecedente histórico/estratégico.  
**Motivo:** acopla el producto a una persona/administración y mezcla estrategia política, producto y arquitectura.

### Integraciones punto-a-punto como objetivo final
**Estado:** `DEPRECADO` como arquitectura objetivo.  
**Uso permitido:** transición o adaptadores temporales.

### LLM como núcleo decisor
**Estado:** `DESCARTADO` para decisiones de autoridad/policy.

## 10. Preguntas abiertas prioritarias

### Arquitectura
- ¿Cuál será el contrato mínimo de Context.OS v0.1?
- ¿Qué componentes actuales deben convertirse en adaptadores y cuáles en servicios centrales?
- ¿Qué parte de SOATM existe en código y qué parte sigue siendo nomenclatura estratégica?

### Identidad y datos
- ¿Cuál será la interfaz estándar con Llave MX/OIDC?
- ¿Qué datos puede mantener ID.mx y bajo qué base jurídica/finalidad?

### Interoperabilidad
- ¿Cuál será el formato canónico de `Service`, `Intent`, `Policy`, `Consent`, `Evidence` y `Execution`?
- ¿Qué conectores municipales se priorizan para el primer piloto?

### Seguridad
- ¿Dónde residirá el policy engine?
- ¿Cómo se firmarán, almacenarán y verificarán las evidencias de ejecución?

### Producción
- ¿Cuál es el primer flujo completo que pasará de intención a acto institucional verificable?

## 11. Riesgos estructurales

| Riesgo | Consecuencia | Severidad | Mitigación |
|---|---|---|---|
| Confundir demo con producción | pérdida de credibilidad | crítica | matriz de evidencia y claims |
| Acoplamiento a un proveedor de IA | dependencia y costos | alta | interfaz de proveedor y fallback |
| Acoplamiento político | obsolescencia institucional | crítica | neutralidad constitucional |
| Exceso de nombres/módulos | arquitectura incoherente | alta | nomenclatura canónica y ADR |
| Policy dentro del LLM | decisiones no deterministas | crítica | policy engine externo |
| Falta de pruebas | regresiones y fallos de despliegue | crítica | test pyramid y CI |
| Integraciones ad hoc | deuda técnica | alta | contratos y adaptadores versionados |

## 12. Próximas 10 acciones

1. Auditar `main` y actualizar la matriz de realidad con evidencia por archivo/commit.
2. Definir contratos canónicos de Intent, Service, Policy, Consent, Evidence y Execution.
3. Crear runtime mínimo de Context.OS sin dependencia de un LLM específico.
4. Elegir un solo flujo municipal end-to-end para piloto real.
5. Implementar policy/permission checks deterministas.
6. Formalizar adaptadores institucionales con interfaces versionadas.
7. Crear suite mínima de pruebas unitarias, contrato e integración.
8. Añadir observabilidad y correlation IDs de extremo a extremo.
9. Separar mocks/demos de conectores reales en configuración y documentación.
10. Actualizar README sólo después de que la fuente de verdad y la matriz de realidad estén aprobadas.

## 13. Regla de mantenimiento

Este documento no se actualiza por entusiasmo ni por conversación. Toda modificación material deberá enlazarse con evidencia o con un ADR vigente.
