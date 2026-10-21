# Constitución de Gobernanza Digital

**Versión:** 0.1  
**Fecha de corte:** 2026-08-19  
**Estado:** borrador constitucional inicial  
**Autoridad documental:** fuente normativa interna del proyecto, subordinada a evidencia legal oficial y a código verificable cuando corresponda.

## 1. Propósito

Gobernanza Digital es una arquitectura tecnológica para reducir la fragmentación entre ciudadanía, trámites, instituciones, datos y sistemas públicos mediante interoperabilidad, contexto, permisos, trazabilidad y experiencias digitales accesibles.

Su finalidad no es sustituir al gobierno, sino permitir que los sistemas públicos colaboren de forma segura, comprensible, auditable y sustituible.

## 2. Problema fundamental

En muchos procesos públicos, el ciudadano actúa como integrador manual: identifica dependencias, conoce requisitos, vuelve a entregar documentos, consulta sistemas separados y traduce estructuras administrativas. La arquitectura debe trasladar esa complejidad desde la persona hacia la infraestructura.

## 3. Principio de autoridad

La plataforma, ORBE, Context.OS y cualquier modelo de IA no son autoridad. Ninguna inferencia algorítmica constituye por sí misma resolución, autorización, sanción, crédito fiscal, modificación registral, diagnóstico, firma o acto administrativo.

Los actos con efecto jurídico deben permanecer bajo sistemas, procedimientos y servidores públicos competentes.

## 4. ORBE

ORBE es la capa de interacción entre persona y ecosistema.

Flujo objetivo:

`escuchar -> comprender -> aclarar -> orientar -> solicitar consentimiento -> canalizar -> acompañar -> explicar`

ORBE no debe convertirse en base de datos central, policy engine, identity provider ni autoridad institucional.

## 5. Context.OS

Context.OS es el plano de control contextual del ecosistema. Debe administrar progresivamente intención, propósito, permisos, consentimiento, estado, memoria autorizada, políticas, contexto, orquestación, trazabilidad, evidencia y auditoría.

Su responsabilidad central es resolver:

> quién puede solicitar qué, con qué propósito, sobre qué información, bajo qué reglas, durante cuánto tiempo y dejando qué evidencia.

Context.OS no es un chatbot ni una megabase gubernamental.

## 6. Identidad e ID.mx

ID.mx representa una capa de expediente/contexto ciudadano autorizado. No debe sustituir a Llave MX ni crear una identidad oficial paralela. Debe interoperar con mecanismos oficiales cuando exista autorización e integración institucional.

## 7. SOATM

SOATM representa la arquitectura operativa para autonomía e interoperabilidad tecnológica municipal. No debe reducirse a una colección de aplicaciones. Debe evolucionar hacia contratos, interfaces y servicios que permitan colaborar con sistemas existentes sin exigir su reemplazo.

## 8. Nayarit Digital

Nayarit Digital es una implementación territorial del ecosistema en Nayarit. No es toda la arquitectura. El núcleo debe permitir replicación territorial sin reconstrucción estructural.

## 9. Soberanía tecnológica

Soberanía significa conservar control de datos, portabilidad, estándares abiertos, documentación, conocimiento operativo, claves, respaldos, interoperabilidad, sustituibilidad y capacidad contractual de salida.

Ningún proveedor de IA, nube o software debe convertirse en dependencia arquitectónica irreemplazable.

## 10. Inteligencia artificial

Los modelos de IA son motores reemplazables.

`LLM != POLICY ENGINE`  
`LLM != AUTHORITY`  
`LLM != DATABASE`  
`LLM != IDENTITY PROVIDER`

Las políticas críticas deben permanecer fuera del modelo.

## 11. Interoperabilidad

La interoperabilidad objetivo debe utilizar contratos explícitos, versionados y verificables: OpenAPI, JSON Schema, eventos, scopes, propósito, idempotencia, correlation IDs, autenticación servicio-a-servicio, políticas, auditoría y pruebas de conformidad.

La integración punto-a-punto se considera transitoria.

## 12. Verdad operativa

No se podrá afirmar que una capacidad está funcionando únicamente porque existe UI, documentación, un mock, un endpoint aislado, un prompt, un prototipo o un diseño.

Toda afirmación pública deberá asociarse a evidencia.

## 13. Continuidad institucional

La arquitectura debe sobrevivir a cambios de administración, proveedor cloud, modelo de IA, integrador y frontend. La continuidad debe residir en estándares, contratos, documentación, datos y gobernanza.

## 14. Diseño centrado en la persona

La persona no debería necesitar conocer el organigrama gubernamental para obtener un servicio. La experiencia objetivo es expresar una necesidad en lenguaje natural y recibir una ruta institucional correcta, verificable y comprensible.

## 15. Jerarquía de evidencia

Ante conflicto, prevalece este orden:

1. comportamiento comprobable en producción;
2. código vigente en `main`;
3. ADR/arquitectura vigente;
4. fuente institucional o normativa oficial;
5. documentación técnica;
6. decisión explícita reciente;
7. conversación;
8. documento histórico;
9. inferencia.

La información más reciente no gana automáticamente; gana la evidencia con mayor autoridad.

## 16. Admisión de nuevos componentes

Todo componente nuevo deberá demostrar: problema concreto, responsabilidad única, ausencia de duplicación, propietario, entradas, salidas, datos utilizados, permisos, riesgos, interoperabilidad, observabilidad y mecanismo de sustitución.

## 17. Neutralidad institucional

Gobernanza Digital no podrá quedar constitucionalmente acoplada a una persona, partido, candidatura o administración. Las estrategias políticas o comerciales podrán existir como documentos históricos o tácticos, pero no gobernarán la arquitectura central.
