# Auditoría de artefactos — ORBE v0.1 + Context.OS Observatory v0.3

**Fecha:** 2026-08-19  
**Estado:** evidencia técnica reproducible para Source of Truth v0.1  
**Alcance:** dos artefactos ZIP entregados para auditoría, sin incorporarlos como código productivo al repositorio.

> Verificación ejecutada: Context.OS Observatory v0.3 completó `npm run verify` con 24/24 pruebas PASS y respondió correctamente en endpoints locales de health, ontology, project-baseline y claims lint. ORBE v0.1 fue inspeccionado estáticamente; su instalación de dependencias no completó dentro de la ventana de auditoría, por lo que su build no se certifica en esta revisión.

## 1. Identidad de artefactos

### ORBE ciudadano — núcleo conversacional v0.1

- Artefacto: `ORBE_ciudadano_nucleo_conversacional_v0.1_limpio_2026-08-19.zip`
- SHA-256: `e777cf5ec88a3dd42f9593ff1afa47a2614f9e8281e101087297b3c5f8db2407`
- `app/page.tsx` SHA-256: `7210b311d52389afb5c97e4025ef8d7f96b55ece30b7c7f55145a5eb2d8f3db1`
- `app/cerebro/page.tsx` SHA-256: `34615813bbe2b2139da88c9b68111043d63c3a37b662bf826ef85c6a0b3c9220`
- `db/schema.ts` SHA-256: `13ddacbf0be50e054d450a6c642b7fdc1aa943fd6b99084711e07e58b600390d`

### Context.OS Observatory v0.3

- Artefacto: `context-os-observatory-v03.zip`
- SHA-256: `00ee850882be1d8ccc319acc75647092d8c198ee344b501ced943fa844f2188a`
- `server.js` SHA-256: `da61dcedc2f0d06e0820674b50c21372473654a8ff004995cf2a3f1e7151589a`
- `data/context-os-ontology.json` SHA-256: `1ce1ebc1cbc5c79f0c0cf39252a904b35bd21f61463cd501e8c33824c7e4ba5b`
- `src/strategy-engine.js` SHA-256: `fc4e26204ce6dc916e5993a5a5ecbc5d5292656807aeca6e4d9b87e8a2a41c5f`
- `src/security.js` SHA-256: `50a9f9d98eb26fd494a05b0f2d0d80008a206b658215e7ab5472a50ed1660b79`

## 2. Veredicto ejecutivo

Los artefactos demuestran dos avances reales pero distintos:

1. **ORBE v0.1** es una interfaz conversacional ciudadana funcional con voz del navegador, ocho dominios municipales, diálogo de seguimiento y límites explícitos de autoridad. No es todavía un cerebro cognitivo ni un agente institucional conectado.
2. **Context.OS Observatory v0.3** es software ejecutable y probado para observación, evidencia, auditoría, estrategia, ontología y grafo. No es el Runtime institucional de Context.OS ni un Policy Engine transaccional.

La relación correcta es:

`ORBE = Experience Plane`  
`Observatory = Evidence Intelligence / diagnóstico`  
`Context.OS Runtime = pendiente de construir como Control Plane institucional`

## 3. ORBE v0.1 — evidencia técnica

### Sí existe

- Aplicación React/Next/Vinext desplegable.
- Catálogo local de 8 servicios/casos: residencia, predial, baches/luminarias, apertura de negocio, bienestar, acta, catastro y tesorería de campo.
- Resolución de intención determinística por palabras clave.
- Estado de conversación en memoria React.
- Preguntas de seguimiento por slots.
- Cambio de intención durante la conversación.
- Síntesis de voz mediante `window.speechSynthesis`.
- Reconocimiento de voz mediante `SpeechRecognition` / `webkitSpeechRecognition` cuando el navegador lo soporta.
- Mensajes explícitos de límites: no inventar requisitos, no cobrar, no autorizar y no modificar registros.
- Superficie `/cerebro` con arquitectura lingüística/cognitiva propuesta, fuentes y ruta de evolución.

### No existe todavía en este artefacto

- Llamada a un LLM.
- Conexión a Context.OS.
- Policy Engine ejecutable.
- Consent Engine persistente.
- Integración con Llave MX.
- Integración a sistemas institucionales.
- Persistencia de conversación o expediente.
- Base de datos de dominio: `db/schema.ts` está intencionalmente vacío.
- RAG/knowledge retrieval.
- Memoria institucional gobernada ejecutable.
- Evaluación lingüística automática en runtime.
- Handoff humano real con SLA/canal institucional.

### Riesgos y deuda

- El `resolveIntent()` usa coincidencia de keywords; no es comprensión semántica robusta.
- La voz depende de capacidades del navegador. `webkitSpeechRecognition` puede depender del proveedor del navegador y no debe presentarse como ASR soberano.
- La ruta `/cerebro` describe un diseño futuro; no debe interpretarse como motor cognitivo implementado.
- La prueba incluida valida principalmente el artefacto/render metadata; no prueba intents, diálogo, voz, accesibilidad o seguridad funcional.
- La instalación de dependencias no pudo completarse dentro de la ventana de auditoría, por lo que el build/test del ZIP no se certifica en esta revisión. La evidencia de código sí fue inspeccionada.

### Clasificación

- Experience Plane: `IMPLEMENTADO`
- Conversación determinística: `IMPLEMENTADO`
- Voz navegador: `IMPLEMENTADO / DEPENDIENTE DEL CLIENTE`
- Cerebro cognitivo: `ESPECIFICACIÓN`
- LLM: `NO IMPLEMENTADO`
- Persistencia: `NO IMPLEMENTADA`
- Integración institucional: `NO INTEGRADA`

## 4. Context.OS Observatory v0.3 — evidencia técnica

### Verificación ejecutada

Se ejecutó:

```bash
npm run verify
```

Resultado:

- chequeo sintáctico: PASS
- tests: `24/24 PASS`
- fallos: `0`

También se inició `server.js` en localhost y se verificaron:

- `GET /api/health`
- `GET /api/ontology`
- `GET /api/project-baseline`
- `POST /api/claims/lint`

### Capacidades implementadas

- servidor HTTP sin dependencias runtime externas;
- scanner de portales públicos;
- descubrimiento municipal;
- auditoría por lentes;
- evidencia con integridad/hash canónico;
- persistencia JSON atómica;
- grafo de evidencia;
- motor de estrategia;
- ontología explícita ORBE / Context.OS / ID.mx / Llave MX / Observatory / systems-of-record;
- referencias internacionales estructuradas;
- linter de claims;
- protección SSRF con bloqueo de IP privada/reservada, resolución DNS pública y pinning del destino;
- límites de tamaño de body;
- CSP y headers defensivos;
- OpenAI opcional para análisis, sin modificar el scoring determinístico.

### No es todavía

- Context.OS Runtime institucional;
- Policy Decision Point;
- Policy Enforcement Point;
- Consent Ledger;
- workflow transaccional gubernamental;
- bus/event backbone;
- API pública institucional autenticada;
- service-to-service authentication;
- integración oficial con Llave MX;
- system-of-record;
- certificación legal o de ciberseguridad.

### Hallazgo de calidad P1 — claim linter

La prueba manual con:

`Context.OS cumple 100% la LNETB y está integrado oficialmente con Llave MX.`

produjo un finding para la integración de Llave MX, pero no detectó la variante `cumple 100% la LNETB`.

La regex actual cubre variantes como `cumple con la LNETB` y `100% de cumplimiento`, pero tiene un hueco para el patrón intermedio `cumple 100% la ...`.

**Acción:** ampliar regla `legal-compliance` y añadir test de regresión.

### Riesgos operativos

- Las APIs no implementan autenticación propia. Es aceptable para bind local `127.0.0.1`, pero no para exposición pública sin gateway/auth/rate limiting.
- Persistencia JSON es válida para laboratorio de un solo proceso, no para operación multiusuario/HA.
- El analizador OpenAI es opcional y externo; la arquitectura debe conservar el modo determinístico como fuente de scoring y permitir sustituir proveedor.
- El scanner es observacional; no debe convertirse en un mecanismo de integración productiva mediante scraping.

### Clasificación

- Observatory: `IMPLEMENTADO / VERIFICADO`
- API local: `IMPLEMENTADA / VERIFICADA`
- Tests: `24/24 PASS`
- Evidence graph: `IMPLEMENTADO`
- Strategy engine: `IMPLEMENTADO`
- Claim linter: `IMPLEMENTADO CON BRECHA P1`
- OpenAI analyzer: `IMPLEMENTADO COMO OPCIONAL`; ejecución real requiere credencial/proveedor disponible
- Context.OS Runtime: `NO IMPLEMENTADO EN ESTE ARTEFACTO`

## 5. Arquitectura resultante

```text
CIUDADANO
   |
   v
ORBE
Experience Plane
   |
   |  Context Envelope
   v
CONTEXT.OS RUNTIME            <- pieza crítica pendiente
Control Plane
   |-- Policy
   |-- Consent
   |-- Purpose
   |-- Authority
   |-- Workflow
   |-- Audit/Evidence
   |
   +---------> ID.mx / Evidence Index
   |
   +---------> SOATM Integration Plane
                    |
                    +--> sistemas institucionales

CONTEXT.OS OBSERVATORY
Evidence Intelligence
   |
   +--> observa ecosistemas
   +--> produce evidencia
   +--> propone estrategia
   +--> alimenta diseño/decisiones
   X  no ejecuta actos administrativos
```

## 6. Próximo incremento correcto

No añadir otro frontend antes de cerrar el circuito mínimo.

### Vertical Slice 001 — `reportar luminaria/bache`

1. ORBE recibe texto/voz.
2. Produce `IntentEnvelope` estructurado.
3. Context.OS Runtime valida propósito, datos mínimos y política.
4. Si requiere datos sensibles, solicita consentimiento explícito.
5. SOATM resuelve un adapter de `public-works-report`.
6. En laboratorio, adapter mock controlado; en piloto, conector real.
7. Se emite `EvidenceRecord` con `correlationId`.
8. ORBE devuelve estado y siguiente paso sin inventar autoridad.

### Contratos mínimos a construir

- `IntentEnvelope`
- `ContextEnvelope`
- `PolicyDecision`
- `ConsentGrant`
- `ServiceDescriptor`
- `ExecutionRequest`
- `ExecutionResult`
- `EvidenceRecord`

## 7. Decisión

A partir de esta auditoría:

- ORBE no debe seguir creciendo como lógica monolítica en `app/page.tsx`.
- El contenido de `/cerebro` debe migrar progresivamente de narrativa a contratos y evaluadores ejecutables.
- Context.OS Observatory debe conservarse como producto/herramienta separada del Runtime.
- El siguiente núcleo de ingeniería debe ser **Context.OS Runtime mínimo**, no otro dashboard.
- El primer objetivo de integración debe ser un flujo municipal de bajo riesgo, trazable y reversible.
