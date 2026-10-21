# Constitución de Arquitectura v0.1

**Ecosistema:** ConnectX / Gobernanza Digital

**Estado:** Propuesta para revisión humana

**Fecha:** 2026-08-31

**Repositorio de referencia:** `Autosociomx/Gobernanza-digital-`

**Commit auditado:** `afb75910bc631d9714fd797cc950550f45f8c7b9`

**Alcance:** Context.OS, ConnectX, Evidence.OS, CodeLens, ORBE, ID.mx, SOATM, agentes y futuras integraciones.

## 1. Propósito

Esta Constitución establece las fronteras de autoridad, reglas de interoperabilidad y condiciones mínimas de evidencia para que el ecosistema pueda evolucionar sin duplicar responsabilidades, perder trazabilidad ni depender de un proveedor.

No describe una implementación particular. Define invariantes que deben seguir siendo válidas aunque cambien las aplicaciones, proveedores, modelos, municipios o infraestructura.

## 2. Regla canónica del sistema

> **Context.OS autoriza. ConnectX conecta. Evidence.OS prueba. CodeLens verifica. ORBE acompaña. El humano decide.**

Ningún componente puede asumir silenciosamente la autoridad canónica de otro.

## 3. Autoridades y límites

### 3.1 Context.OS — Control de contexto y autoridad

Context.OS determina quién puede realizar una acción, sobre qué recurso, con qué propósito, bajo qué política, durante cuánto tiempo y con qué consentimiento.

Debe:

- evaluar identidad o referencia de sujeto, rol, institución y atribución;
- aplicar políticas versionadas;
- registrar consentimiento, alcance, expiración y revocación;
- emitir una decisión de autorización verificable;
- minimizar los datos expuestos a cada servicio.

No debe:

- convertirse en almacén indiscriminado de expedientes;
- ejecutar por sí mismo todos los servicios;
- sustituir la decisión humana cuando la ley, el riesgo o la irreversibilidad la exijan;
- aceptar que una afirmación ciudadana sea tratada automáticamente como una orden.

### 3.2 ConnectX — Integración e interoperabilidad

ConnectX conecta personas, dependencias, servicios y sistemas mediante contratos versionados, adaptadores, APIs, MCP y eventos institucionales.

Debe:

- preservar los sistemas institucionales que ya funcionan;
- utilizar adaptadores sustituibles;
- evitar dependencias permanentes de formularios o proveedores concretos;
- transportar solamente la información autorizada;
- conservar correlación entre solicitud, ejecución, resultado y evidencia.

No debe:

- gobernar permisos o atribuciones;
- crear una identidad paralela cuando exista una autoridad competente;
- imponer una sola aplicación como condición para la interoperabilidad;
- confundir conexión técnica con autorización institucional.

### 3.3 Evidence.OS — Evidencia, procedencia y auditoría

Evidence.OS conserva la cadena verificable de fuentes, acciones, actores, reglas, versiones, resultados, contradicciones y decisiones.

Debe:

- distinguir hechos verificados, reportes, inferencias, contradicciones, evidencia no probada y evidencia temporalmente no disponible;
- preservar fuente, fecha, versión, alcance y transformaciones;
- producir paquetes auditables exportables y de sólo lectura;
- permitir evidencia contraria, correcciones y revisión;
- aplicar reglas de retención, privacidad y acceso.

No debe:

- ejecutar acciones administrativas;
- declarar verdad por mera inmutabilidad;
- crear múltiples ledgers canónicos para el mismo hecho;
- confundir un hash con prueba suficiente del contenido, autoridad o legalidad.

### 3.4 CodeLens — Verificación técnica y conformidad

CodeLens contrasta contratos, políticas, código, configuración, pruebas y evidencia para determinar qué está realmente implementado y demostrado.

Debe:

- fijar repositorio, commit, versión y objeto auditado;
- responder el protocolo obligatorio aunque el resultado sea `NOT_PROVEN`;
- derivar confianza de la evidencia, no permitir que se autodeclare;
- exigir condiciones de salida verificables para todo bloqueo;
- distinguir opinión de modelo y verificación mecánica.

No debe:

- aprobar despliegues o decisiones administrativas por sí solo;
- otorgar cobertura perfecta a evaluaciones vacías;
- considerar un comentario, tipo o intención como comportamiento ejecutado;
- convertir `UNAVAILABLE` en un estado terminal sin política de reintento.

### 3.5 ORBE — Experiencia y acompañamiento

ORBE ayuda a la persona a comprender, estructurar y dar seguimiento a una necesidad.

Debe:

- explicar en lenguaje claro;
- detectar urgencia, competencia y rutas institucionales;
- solicitar únicamente los datos necesarios;
- mostrar límites, incertidumbre y próximos pasos;
- transferir la acción al sistema o autoridad competente.

No debe:

- sustituir a una autoridad, médico, abogado o funcionario;
- inventar requisitos, resoluciones o estados;
- convertir lenguaje ambiguo en consentimiento;
- ocultar cuándo una respuesta procede de IA.

### 3.6 ID.mx — Referencias de identidad y expediente

ID.mx conserva referencias y pruebas de identidad o atributos autorizados sin duplicar innecesariamente datos sensibles ni sustituir sistemas nacionales competentes.

Debe operar con minimización, divulgación selectiva, propósito, vigencia y revocación.

### 3.7 SOATM — Adopción e implementación municipal

SOATM facilita que municipios adopten servicios, estándares y conectores sin reemplazar indiscriminadamente sus sistemas.

Debe separar su catálogo institucional de catálogos nacionales, conservar correspondencias versionadas y demostrar adopción real por trámite, dependencia, responsable y resultado.

### 3.8 Autoridad humana

La persona autorizada conserva la decisión final cuando exista impacto jurídico, presupuestario, médico, de seguridad, de derechos, de publicación oficial, de producción o cualquier efecto difícilmente reversible.

Ningún consenso de modelos reemplaza esta autoridad.

## 4. Evento institucional canónico

La unidad estable de interoperabilidad es el evento institucional, no una API o proveedor concreto.

Todo evento material debe poder responder:

- quién actuó;
- en nombre de qué institución y cargo;
- bajo qué atribución;
- qué acción solicitó o ejecutó;
- sobre qué recurso;
- con qué política y versión;
- qué consentimiento o fundamento aplicó;
- qué sistema intervino;
- cuál fue el resultado;
- qué evidencia se produjo;
- cuándo ocurrió;
- qué decisión humana quedó pendiente o fue emitida.

Los eventos no deben transportar plantillas biométricas, secretos, credenciales reutilizables ni expedientes completos sin necesidad demostrada.

## 5. Parlamento y agentes

Los agentes se clasifican por función:

- **Deliberativos:** proponen hipótesis, críticas y alternativas.
- **Ejecutivos:** producen cambios o artefactos dentro de un alcance autorizado.
- **Mecánicos:** ejecutan pruebas, consultas, análisis estático y verificaciones reproducibles.
- **Registradores:** normalizan evidencia, contradicciones y estados.

Reglas:

- todos reciben un objetivo, alcance, restricciones y criterio de aceptación;
- la primera revisión adversarial debe ser independiente;
- acuerdo entre modelos no equivale a verificación;
- los cambios irreversibles requieren aprobación humana;
- ningún agente puede ampliar su propio alcance;
- toda delegación material debe generar un recibo de autoridad y resultado.

## 6. Puerta universal de prioridad

Toda iniciativa, función, integración, investigación o refactor debe responder:

1. ¿Resuelve un problema real?
2. ¿Fortalece una base compartida?
3. ¿Reduce riesgo o incertidumbre?
4. ¿Puede producir evidencia esta semana?
5. ¿Sirve para más de un caso o municipio?

### 6.1 Resultado del filtro

- **4–5 respuestas afirmativas:** candidato a trabajo activo.
- **3 respuestas afirmativas:** requiere reformulación o prueba más pequeña.
- **0–2 respuestas afirmativas:** backlog, investigación o archivo.

Una excepción por obligación legal, seguridad crítica o daño inmediato puede adelantar una iniciativa, pero debe documentarse.

## 7. Unidad mínima de trabajo valioso

Una sesión debe producir al menos uno de estos resultados:

- decisión versionada;
- artefacto utilizable;
- prueba reproducible;
- incertidumbre eliminada;
- riesgo identificado y clasificado;
- deuda diferida conscientemente;
- conocimiento incorporado con procedencia.

Una idea sin cambio de estado se conserva como investigación, no se reporta como implementación.

## 8. Evidencia mínima por estado

| Estado | Evidencia mínima |
|---|---|
| Concepto | Problema, alcance y supuestos |
| Diseñado | Contrato, decisiones y riesgos |
| Implementado | Código o configuración identificable |
| Probado | Prueba ejecutada y resultado reproducible |
| Validado | Evidencia en un caso representativo y revisión independiente |
| Producción | Operación observable, seguridad, responsables y recuperación |

Ningún componente puede declarar un estado superior al demostrado.

## 9. Cambios y condiciones de salida

Todo cambio material debe registrar:

- objetivo y problema;
- componente canónico afectado;
- archivos, contrato o política modificada;
- riesgos;
- pruebas;
- evidencia producida;
- plan de reversión;
- decisión humana cuando aplique.

Todo `BLOCK_MERGE` o bloqueo equivalente debe incluir condiciones de salida comprobables mediante prueba, consulta, análisis estructural o evidencia explícita.

## 10. Privacidad, seguridad y derechos

- Minimización por defecto.
- Consentimiento no ambiguo y revocable cuando corresponda.
- Separación entre identidad y expediente.
- Acceso por propósito, rol, institución y vigencia.
- Registro de consultas y acciones materiales.
- Prohibición de usar expedientes sensibles como entrenamiento sin fundamento, consentimiento y gobernanza específicos.
- Seguridad proporcional al impacto, no sólo al tipo de tecnología.
- Derecho a corrección, evidencia contraria y revisión humana.

Los dominios penal, salud, menores, víctimas y biometría requieren aislamiento y controles reforzados.

## 11. Soberanía y proveedores

- Los contratos del núcleo no dependen de un modelo, nube o proveedor.
- Los adaptadores deben ser sustituibles.
- Toda dependencia externa debe registrar versión, licencia, datos compartidos, política de retención y salida.
- Código y conocimiento externo se incorporan respetando licencias, atribución y procedencia.
- Cuando sea necesario, se utiliza especificación independiente e implementación limpia; nunca se oculta una copia o derivación.

## 12. Escala responsable

Diseñar para una persona y para millones exige desde el inicio:

- identificadores estables;
- contratos y políticas versionados;
- aislamiento por institución, territorio y propósito;
- idempotencia y procesamiento asíncrono;
- observabilidad y recuperación;
- accesibilidad y lenguaje claro;
- operación con conectividad limitada;
- portabilidad y salida del proveedor;
- retención y eliminación gobernadas;
- medición de adopción y resultado, no sólo disponibilidad.

No exige construir infraestructura masiva antes de demostrar un caso completo.

## 13. Primer caso constitucional

La primera validación debe recorrer de principio a fin una solicitud o expediente controlado:

1. ORBE recibe y estructura la necesidad.
2. Context.OS evalúa propósito, consentimiento, política y autoridad.
3. ConnectX enruta mediante un contrato versionado.
4. El servicio competente responde.
5. Evidence.OS conserva fuentes, acción, resultado y contradicciones.
6. CodeLens verifica contratos, implementación y evidencia.
7. Un revisor externo consulta un `Audit Package v0.1` de sólo lectura.
8. La autoridad humana adopta, corrige, vigila o archiva.

## 14. Adopción y revisión

Esta versión entra en vigor únicamente después de:

- compararla con el repositorio y contratos actuales;
- identificar contradicciones y duplicidades;
- revisar riesgos jurídicos, de privacidad y seguridad;
- aprobar explícitamente sus autoridades e invariantes;
- asignar una versión y responsable.

Las modificaciones futuras se agregan como decisiones versionadas. No se reescribe silenciosamente la historia.

## 15. Decisiones pendientes para v0.2

- Definir el repositorio y ruta canónica del documento.
- Elegir el primer caso de validación.
- Consolidar `Institutional Event` y `ConectaX Event Envelope v0.2`.
- Definir el contrato mínimo de `Audit Package v0.1`.
- Determinar la relación exacta entre Evidence.OS y los ledgers existentes.
- Formalizar la matriz de aprobación humana por nivel de riesgo.
- Asignar responsables de Context.OS, ConnectX, Evidence.OS, CodeLens y ORBE.
