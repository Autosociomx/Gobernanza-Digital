# Auditoría de interoperabilidad y benchmark internacional

**Programa:** Nayarit Digital / ConnectX / SOATM  
**Versión:** 1.0 · **Estado:** propuesta documental para revisión  
**Método:** evidencia del repositorio + análisis arquitectónico + normalización metalingüística  
**Regla de honestidad:** no se declara implementado aquello que solo está descrito, simulado o planificado.

## 1. Dictamen ejecutivo

El repositorio ya contiene una base arquitectónica útil: visión de plataforma, diez componentes SOATM, arquitectura de datos, libro blanco, estrategia de estándares abiertos y una ficha específica para el módulo de interoperabilidad. No hace falta empezar desde cero.

La brecha principal no es la falta de una lista de países. Es la falta de un **contrato de interoperabilidad ejecutable y verificable** que conecte módulos, datos, políticas, identidad, errores y evidencia.

El benchmark internacional actual es parcial: `docs/plataforma/06-LIBRO-BLANCO.md` compara Estonia, España e Italia principalmente en identidad y protección infantil. El propio documento declara que no es un estudio técnico comparativo de interoperabilidad. Por tanto, no debe presentarse como un benchmark internacional completo de SOATM.

### Dictamen semáforo

| Área | Estado | Evidencia / motivo |
|---|---|---|
| Arquitectura de referencia SOATM | 🟢 Documentada | `docs/plataforma/02-ARQUITECTURA-SISTEMA.md` describe componentes y estados |
| Arquitectura de datos | 🟢 Documentada con brechas | `docs/plataforma/04-ARQUITECTURA-DATOS.md` identifica Firestore y Supabase separados |
| Benchmark internacional de interoperabilidad | 🟡 Incompleto | El libro blanco compara identidad; faltan fichas técnicas homogéneas para interoperabilidad |
| Módulo visual de interoperabilidad | 🟡 Demo | `docs/marco/modulos/interoperabilidad.md` lo identifica como maqueta con datos estáticos |
| Bus de eventos / contrato entre módulos | 🔴 No implementado | El Data Bus está descrito como hoja de ruta; la integración es punto a punto en UI |
| Intercambio institucional real | 🔴 No demostrado | No se documenta un conector institucional de extremo a extremo en producción |
| Autenticación servicio-a-servicio | 🔴 Brecha conocida | El manual de desarrolladores documenta que no existe para los endpoints indicados |
| Evidencia y auditoría transversal | 🟡 Fragmentada | Hay registros en distintos subsistemas, pero no existe canal común entre las fuentes |
| Reutilización entre municipios | 🟡 Hipótesis arquitectónica | Requiere contratos, adaptadores, pruebas de conformidad y piloto con segundo entorno |
| Gobernanza del repositorio | 🟢 Documentada | `docs/marco/GOBERNANZA_REPOSITORIO.md` define PR, CI, archivos protegidos y clasificación |

## 2. Hallazgos principales

### H-01 · Benchmark internacional mezclado con un caso de uso distinto

**Severidad:** Media  
**Evidencia:** `docs/plataforma/06-LIBRO-BLANCO.md`

El cuadro actual trata X-Road/e-Residency, Cl@ve/DNI electrónico y SPID/CIE como referentes de identidad y acceso. Eso puede servir para el caso SINISI, pero no basta para evaluar la interoperabilidad de SOATM.

**Acción:** conservar ese contenido en su contexto de identidad. Crear un benchmark separado para intercambio de datos, estándares semánticos, APIs, identidad de servicios, autorización, auditoría, resiliencia y adopción institucional.

### H-02 · Interoperabilidad es hoy una maqueta, no un servicio integrado

**Severidad:** Alta  
**Evidencia:** `docs/marco/modulos/interoperabilidad.md`

El panel C5 presenta endpoints, trazabilidad interinstitucional y un log tipo blockchain, pero usa arreglos estáticos y no tiene servicio detrás.

**Acción:** etiquetar claramente la vista como DEMO; no llamarla integración real ni registro blockchain operativo. Antes de conectarla a sistemas externos, definir origen, esquema, autorización, retención, errores y límites de confianza del registro.

### H-03 · Falta el contrato de eventos entre componentes

**Severidad:** Crítica para escalabilidad  
**Evidencia:** `docs/plataforma/02-ARQUITECTURA-SISTEMA.md` y `docs/plataforma/04-ARQUITECTURA-DATOS.md`

El SOATM Data Bus está en hoja de ruta. La comunicación actual es punto a punto y Firestore/Supabase permanecen separados.

**Acción:** especificar primero un contrato independiente de proveedor. Definir envelope de evento, versión de esquema, identificador de correlación, productor, destinatario, propósito, clasificación de datos, política de reintento, idempotencia, expiración, rechazo y referencia a evidencia. No imponer todavía un broker específico.

### H-04 · Identidad de usuario no equivale a identidad de servicio

**Severidad:** Alta  
**Evidencia:** `docs/plataforma/05-MANUAL-DESARROLLADORES.md`

El control de acceso a una persona usuaria no sustituye autenticación mutua entre servicios. Un conector necesita identificar qué sistema llama, con qué credencial, bajo qué política y con qué alcance.

**Acción:** documentar un modelo de identidad de servicio, rotación de credenciales, mínimo privilegio, revocación y pruebas negativas. No declarar autenticación servicio-a-servicio implementada hasta que exista código y prueba reproducible.

### H-05 · Las fuentes de auditoría están fragmentadas

**Severidad:** Alta  
**Evidencia:** `docs/plataforma/04-ARQUITECTURA-DATOS.md`

Existen registros en Firestore y un ledger específico en Supabase/Postgres, pero no un bus común entre ellos. Sus garantías no son equivalentes.

**Acción:** definir un contrato común de referencia a evidencia sin obligar a centralizar datos sensibles. Distinguir claramente: log operativo, registro de auditoría, ledger encadenado, evidencia firmada y evidencia con sello de tiempo. No usar “inmutable” o “prueba legal” sin especificar el mecanismo y su alcance.

### H-06 · Documentación legal y estados de cumplimiento necesitan una matriz de trazabilidad

**Severidad:** Alta  
**Evidencia:** `docs/marco/MARCO_CUMPLIMIENTO_LNETB.md`, `docs/marco/BIBLIOTECA_LEGAL.md` y `docs/marco/GOBERNANZA_REPOSITORIO.md`

El repositorio distingue estados como Operativo, Operativo en demo, Preparado y Hoja de ruta. Esa disciplina debe aplicarse a cada afirmación del benchmark y a cada requisito legal.

**Acción:** enlazar cada requisito con fuente oficial, artículo/versión, componente, evidencia de código, prueba y responsable de validación. Una declaración documental no equivale por sí sola a certificación o cumplimiento integral.

## 3. Benchmark internacional: patrones a evaluar, no copiar países

El benchmark v1 debe comparar capacidades concretas y usar fuentes oficiales primarias. Esta tabla es una hipótesis de trabajo; cada patrón queda pendiente de investigación y validación documental específica.

| Referente | Patrón candidato | Qué investigar | Adaptación potencial a SOATM |
|---|---|---|---|
| España | ENI + ENS | Normas de interoperabilidad, seguridad, semántica, conservación y conformidad | Perfil mexicano de interoperabilidad y controles verificables |
| Estonia | X-Road | Intercambio distribuido, identidad de organizaciones, integridad y trazabilidad de llamadas | Adaptadores institucionales sin centralizar todas las bases de datos |
| Singapur | Government Tech Stack / API Exchange | Componentes comunes, APIs, identidad y servicios reutilizables | Servicios compartidos y plantillas de integración municipal |
| Uruguay | Plataforma de Interoperabilidad de Agesic | Enrutamiento, metadatos, políticas y gestión de APIs | Pasarela y catálogo de servicios desacoplados |
| Brasil | Conecta gov.br | Intercambio de datos para simplificar trámites y evitar solicitudes repetidas | Medir reutilización lícita de datos y reducción de documentos |
| Unión Europea | European Interoperability Framework | Gobernanza legal, organizativa, semántica y técnica | Marco transversal para evaluar compatibilidad entre instituciones |

### Reglas para que el benchmark sea auditable

1. Cada afirmación debe tener una fuente primaria oficial o documentación técnica del proyecto original.
2. Separar capacidad documentada, implementación desplegada, resultados medidos y opinión del equipo.
3. Registrar fecha de consulta, versión del estándar y jurisdicción.
4. No inferir que un patrón es superior por la reputación del país.
5. Seleccionar un patrón solo si resuelve una brecha concreta, es compatible con la realidad mexicana y tiene una prueba de aceptación definida.
6. Registrar también patrones descartados y la razón del descarte.

## 4. Optimización metalingüística: vocabulario normativo

El objetivo es que las palabras del proyecto tengan un significado técnico estable. No es solo corregir estilo: evita que una demo se presente como integración, que un hash se venda como auditoría completa o que una intención se interprete como cumplimiento.

| Evitar como afirmación absoluta | Usar en su lugar | Condición para elevar el estado |
|---|---|---|
| “Interoperabilidad real” | “Interoperabilidad documentada / simulada / probada en entorno X” | Intercambio reproducible entre dos sistemas independientes |
| “Blockchain municipal” | “Registro de auditoría” o “ledger encadenado por hashes” | Especificar tecnología, consenso, gobernanza y pruebas; no usar blockchain como adorno |
| “Inmutable” | “Append-only bajo los controles X” | Pruebas de rechazo de UPDATE/DELETE y análisis de privilegios y copias administrativas |
| “Tiempo real” | “Actualización cada N segundos” o “evento procesado en N ms” | Métrica instrumentada con percentiles y ventana de observación |
| “Seguro” | “Controles de seguridad X verificados por pruebas Y” | Modelo de amenazas, pruebas negativas y revisión independiente |
| “Cumple la ley” | “Requisito mapeado; evidencia y validación legal pendientes/completadas” | Matriz artículo-evidencia, revisión competente y alcance definido |
| “Expediente único” | “Vista o índice de expediente con fuentes y permisos explícitos” | Definir autoridad de datos, actualización, rectificación y acceso |
| “IA autónoma” | “Asistente sujeto a políticas, permisos y supervisión” | Límites operativos, registros, mecanismo de intervención y evaluación |
| “Escalable a todos los municipios” | “Diseñado para reutilización; probado en N entornos” | Prueba de conformidad y despliegue repetible en más de un entorno |
| “Auditoría blockchain” | “Registro verificable de eventos con alcance y límites documentados” | Definir integridad, autenticidad, tiempo, retención y responsables |

### Vocabulario de estados recomendado

- **Propuesto:** diseño escrito; no hay implementación demostrada.
- **Implementado:** existe código identificado y conectado a la aplicación.
- **Probado localmente:** existe una prueba reproducible y su resultado.
- **Validado en integración:** prueba de extremo a extremo con sistemas separados.
- **Piloto institucional:** uso autorizado en una entidad y alcance definidos.
- **Producción:** servicio operativo con responsable, monitoreo, continuidad y procedimientos de incidente.
- **Conforme/certificado:** solo cuando el marco aplicable y la evaluación formal permitan esa declaración.

Estos estados no son intercambiables. Una interfaz implementada no demuestra un servicio de backend; una prueba local no demuestra interoperabilidad institucional.

## 5. Arquitectura objetivo mínima

La propuesta no exige reemplazar Firebase, Supabase ni los sistemas municipales existentes. Exige añadir contratos antes de añadir más infraestructura.

1. **Catálogo de servicios:** identificador estable, autoridad responsable, versión, finalidad, clasificación de datos, disponibilidad y condiciones de uso.
2. **Contrato de API/evento:** esquema versionado, validación, correlación, idempotencia, errores, límites y compatibilidad.
3. **Identidad y autorización de servicio:** credenciales identificables, mínimo privilegio, rotación y revocación.
4. **Adaptadores:** traducción entre el contrato común y cada sistema; ninguna dependencia directa entre todos los módulos.
5. **Políticas Context.OS:** decisión explícita, motivo, versión de política y referencia a consentimiento cuando aplique.
6. **Evidencia:** actor/servicio, acción, objeto, finalidad, instante confiable cuando esté disponible, resultado, correlación y referencia al origen.
7. **Resiliencia:** timeout, reintentos controlados, idempotencia, cola de errores, degradación segura y recuperación.
8. **Conformidad:** pruebas automatizadas para casos válidos, inválidos, no autorizados, duplicados, fallos y cambios de versión.

La elección de un broker, un API gateway concreto o una plataforma de identidad se deja para después de fijar estos contratos y revisar los requisitos operativos.

## 6. Primer piloto de aceptación

Usar un servicio de demostración no sensible antes de conectar datos personales o sistemas de producción.

**Flujo mínimo:** sistema A solicita una operación → el adaptador valida el contrato → Context.OS evalúa política → el servicio simulado responde → se registra la referencia de evidencia → un auditor reconstruye la secuencia.

### Criterios de aceptación

- 100 % de solicitudes inválidas rechazadas en el conjunto de pruebas definido.
- 100 % de solicitudes no autorizadas denegadas en pruebas negativas.
- Reintentar la misma solicitud no duplica la operación cuando el contrato declara idempotencia.
- Toda operación de prueba tiene un identificador de correlación y una referencia de evidencia.
- La indisponibilidad del proveedor no provoca una autorización implícita.
- Los secretos no aparecen en el cliente, logs ni artefactos del repositorio.
- Una versión incompatible del esquema falla de forma explícita y observable.
- Las métricas reportan tamaño de muestra, periodo y entorno; no se inventan cifras de rendimiento.

Estos criterios son objetivos propuestos, no resultados ya obtenidos.

## 7. Plan de trabajo priorizado

| Prioridad | Entrega | Criterio de cierre |
|---|---|---|
| P0 | Etiquetar la vista de interoperabilidad como DEMO y corregir cualquier afirmación ambigua | UI y documentación coinciden con el estado real |
| P0 | Publicar catálogo de brechas y fuentes | Cada hallazgo tiene ruta, severidad, responsable sugerido y prueba |
| P1 | Benchmark internacional con referencias oficiales | Cada patrón tiene fuente, problema, coste de adopción, riesgo y prueba |
| P1 | Contrato v0.1 de servicio/evento | Esquema versionado y ejemplos válidos/inválidos |
| P1 | Modelo de identidad servicio-a-servicio | Flujos, amenazas, rotación, revocación y pruebas negativas |
| P2 | Adaptador de referencia con servicio simulado | Prueba de extremo a extremo reproducible |
| P2 | Contrato de evidencia transversal | Se puede reconstruir la secuencia sin centralizar indebidamente los datos |
| P3 | Piloto institucional controlado | Autorización formal, responsables, datos permitidos y métricas acordadas |

## 8. Fuentes internas auditadas

- `docs/plataforma/06-LIBRO-BLANCO.md`
- `docs/plataforma/02-ARQUITECTURA-SISTEMA.md`
- `docs/plataforma/04-ARQUITECTURA-DATOS.md`
- `docs/plataforma/05-MANUAL-DESARROLLADORES.md`
- `docs/marco/modulos/interoperabilidad.md`
- `docs/marco/ESTRATEGIA_ESTANDAR_ABIERTO.md`
- `docs/marco/GOBERNANZA_REPOSITORIO.md`
- `docs/marco/MARCO_CUMPLIMIENTO_LNETB.md`
- `docs/marco/BIBLIOTECA_LEGAL.md`

## 9. Decisión recomendada

Aprobar el benchmark como una línea de investigación arquitectónica, no como una declaración de superioridad internacional. Mantener el libro blanco actual en su función de visión y SINISI; añadir esta auditoría como documento de trabajo; y no modificar módulos productivos hasta que el contrato de interoperabilidad tenga revisión técnica, seguridad y criterios de aceptación.

**Principio rector:** reutilizar patrones probados, adaptar contratos al contexto mexicano y exigir evidencia reproducible antes de elevar el estado de cualquier capacidad.
