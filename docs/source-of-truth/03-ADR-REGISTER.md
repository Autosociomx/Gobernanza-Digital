# Registro Maestro de Decisiones — ADR

**Versión:** 0.1  
**Fecha de corte:** 2026-08-19

Este registro consolida decisiones de arquitectura. No sustituye ADR individuales futuros; los enumera y fija su estado.

## Estados

- `VIGENTE`
- `MODIFICADA`
- `REVOCADA`
- `EXPERIMENTAL`

---

## ADR-0001 — Gobernanza Digital es la arquitectura superior

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** Gobernanza Digital es el ecosistema/arquitectura superior. Nayarit Digital es una implementación territorial.  
**Problema:** se mezclaban marca territorial, módulos y arquitectura central.  
**Impacto:** permite reutilización fuera de Nayarit y desacopla la plataforma de una administración concreta.  
**Dependencias:** arquitectura canónica, estrategia comercial, README.

## ADR-0002 — ORBE es Experience Plane

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** ORBE es interfaz conversacional/multimodal, no autoridad, policy engine, identity provider ni base de datos.  
**Problema:** riesgo de concentrar lógica crítica en la interfaz o en el LLM.  
**Impacto:** separa experiencia de autorización y ejecución.  
**Dependencias:** Context.OS, Policy, Identity, Service Catalog.

## ADR-0003 — Context.OS es el Context Control Plane

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** Context.OS gobernará intención, propósito, contexto, estado, permisos, consentimiento, orquestación, evidencia y trazabilidad mediante componentes explícitos.  
**Problema:** falta de capa común entre conversación y sistemas institucionales.  
**Impacto:** crea un plano de control reutilizable y auditable.  
**Dependencias:** Policy Engine, Consent, SOATM, auditabilidad.

## ADR-0004 — ID.mx no sustituye Llave MX

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** ID.mx no será identidad oficial paralela. Se tratará como expediente/contexto ciudadano autorizado y deberá interoperar con identidad oficial cuando corresponda.  
**Problema:** duplicación de identidad y riesgo institucional/legal.  
**Impacto:** reduce conflicto con infraestructura federal y favorece interoperabilidad.  
**Dependencias:** OIDC, Llave MX, protección de datos.

## ADR-0005 — SOATM no es una colección de apps

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** SOATM debe expresarse como capa operativa/interoperable compuesta por contratos, catálogo, adaptadores, APIs, eventos y mecanismos de ejecución.  
**Problema:** confusión entre módulos visibles y sistema operativo municipal.  
**Impacto:** facilita integrar sistemas existentes sin reemplazarlos.  
**Dependencias:** Service Catalog, Contract Registry, Connector Runtime.

## ADR-0006 — Los sistemas institucionales conservan autoridad

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** Tesorería, Catastro, Registro Civil, Salud y otros dominios conservan ownership y autoridad sobre sus datos/actos. Gobernanza Digital orquesta e interopera.  
**Problema:** riesgo de crear una megaplataforma centralizadora.  
**Impacto:** menor resistencia institucional y mejor separación de responsabilidades.  
**Dependencias:** adaptadores, políticas, evidencia.

## ADR-0007 — Las políticas críticas quedan fuera del LLM

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** un LLM puede interpretar y explicar, pero no será el motor determinista de autorización o autoridad.  
**Problema:** no determinismo, prompt injection y falta de auditabilidad.  
**Impacto:** obliga a policy engine versionado y verificable.  
**Dependencias:** Policy Gateway, Identity, audit log.

## ADR-0008 — Proveedores de IA sustituibles

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** Gemini, OpenAI, modelos locales u otros deberán conectarse mediante una abstracción de proveedor.  
**Problema:** vendor lock-in y fragilidad operacional/comercial.  
**Impacto:** soberanía y continuidad tecnológica.  
**Dependencias:** AIProvider interface, configuración y evaluación.

## ADR-0009 — La integración punto-a-punto es transitoria

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** nuevas integraciones deberán converger a contratos y adaptadores versionados.  
**Problema:** deuda técnica y acoplamiento N×N.  
**Impacto:** escalabilidad institucional.  
**Dependencias:** Contract Registry, Connector Runtime.

## ADR-0010 — Evidencia obligatoria para claims

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** ninguna capacidad se considerará productiva por existir en UI, documentación o demo.  
**Problema:** sobreventa accidental y confusión entre idea/prototipo/producción.  
**Impacto:** toda presentación externa deberá basarse en la Reality Matrix.  
**Dependencias:** CI, deployment evidence, documentación comercial.

## ADR-0011 — Neutralidad institucional

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** el núcleo no estará acoplado a persona, candidatura, partido o administración.  
**Problema:** pérdida de continuidad cuando cambia el gobierno.  
**Impacto:** arquitectura reutilizable y vendible institucionalmente.  
**Dependencias:** nomenclatura, documentos históricos, narrativa comercial.

## ADR-0012 — “Aplicación Madre” deja de gobernar la arquitectura

**Fecha:** 2026-08-19  
**Estado:** `REVOCADA` como arquitectura central  
**Decisión:** documentos previos basados en “Aplicación Madre”, C5 o estrategia personalista se conservan como antecedentes, no como autoridad vigente.  
**Problema:** mezclaban arquitectura, producto y estrategia política.  
**Impacto:** se conserva trazabilidad sin contaminar el diseño actual.  
**Dependencias:** Contexto Maestro, tabla de migración documental.

## ADR-0013 — Madurez explícita

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** estados permitidos: `CONCEPTO`, `ESPECIFICACIÓN`, `PROTOTIPO`, `IMPLEMENTADO`, `INTEGRADO`, `PRODUCCIÓN`, `DEPRECADO`, `DESCARTADO`.  
**Problema:** uso ambiguo de “ya está construido”.  
**Impacto:** lenguaje común entre ingeniería, negocio, gobierno e inversionistas.  
**Dependencias:** Reality Matrix, roadmap.

## ADR-0014 — La fuente de verdad se mantiene por evidencia

**Fecha:** 2026-08-19  
**Estado:** `VIGENTE`  
**Decisión:** el Contexto Maestro sólo cambiará mediante evidencia verificable o ADR explícito.  
**Problema:** deriva conceptual entre conversaciones.  
**Impacto:** continuidad del conocimiento.  
**Dependencias:** repositorio, procesos de revisión.

---

## Plantilla para nuevos ADR

```markdown
## ADR-XXXX — Título
**Fecha:** YYYY-MM-DD
**Estado:** VIGENTE | MODIFICADA | REVOCADA | EXPERIMENTAL
**Decisión:**
**Problema:**
**Evidencia:**
**Alternativas rechazadas:**
**Impacto:**
**Dependencias:**
**Reemplaza a:**
```
