# Diagnóstico técnico-priorizado SOATM (Ejecución guiada)

**Nayarit Digital · ConnectX · SOATM**  
Objetivo: ejecutar la ruta mínima para pasar de demo a operación verificable, con lenguaje simple y trazabilidad.

---

## 1) Trámite ciudadano prioritario único (Fase 1)

**Trámite seleccionado:** **Servicios Públicos con folio** (bache, luminaria, agua, basura).

**Por qué primero:**
- Es el caso más visible para ciudadanía y Cabildo.
- Ya existe superficie funcional en código:
  - `src/components/CitizenApp.tsx` (`ServiciosYReportesView`)
  - `src/components/C5Dashboard.tsx` (`ServiciosView`)
  - `src/components/UrbanReportMapView.tsx`
- Ya está reconocido en módulo oficial como prioridad temprana:
  - `docs/marco/PLAN_TRABAJO_MUNICIPAL.md` (sección "Servicios Públicos — el reporte con folio")
  - `docs/marco/modulos/servicios.md`

---

## 2) Flujo verificable extremo a extremo (criterio institucional)

Para considerar "cerrado" el trámite, el flujo debe cumplir esta secuencia:

1. **Entrada ciudadana**  
   El ciudadano reporta incidencia desde `ServiciosYReportesView`.
2. **Validación mínima**  
   Se valida tipo de incidencia + ubicación + evidencia (foto/texto).
3. **Resultado operativo**  
   El sistema devuelve estado de recepción y crea ticket trazable.
4. **Folio y evidencia**  
   Debe existir identificador único + evidencia asociada consultable.
5. **Cierre auditable**  
   La cuadrilla registra atención y el ciudadano puede ver estatus final.

**Regla de honestidad obligatoria:** mientras no exista backend operativo completo, el módulo debe marcarse como **DEMO/SIMULADO** de forma explícita.

---

## 3) Separación simple: operativo vs experimental

### Operativo / usable hoy
- Frontend principal y rutas de vista: `src/App.tsx`
- Portal ciudadano (tabs y flujos visibles): `src/components/CitizenApp.tsx`
- Endpoints Express vigentes: `server.ts` (`/api/departments`, `/api/ai/*`, `/api/create-payment-intent`)
- Marco modular verificado: `docs/marco/modulos/INDICE.json`

### Experimental / laboratorio (no acto administrativo)
- Puente Orbe-Context.OS (flag apagado por defecto): `src/components/orbe/OrbeContextPilot.tsx`, `src/orbe/contextosBridge.ts`
- Runtime de laboratorio: `contextos/`
- Canon conceptual del Orbe: `docs/orbe/`

---

## 4) Requisito funcional: MX.ID e inclusión multilingüe

Se establece para próximas iteraciones:

1. **MX.ID (capa identidad/interoperabilidad):**
   - Debe vivir como capa transversal de identificación del ciudadano.
   - No se declara interoperabilidad real con terceros sin convenio y endpoint implementado.

2. **Inclusión lingüística (español + lenguas originarias locales):**
   - Debe ser requisito funcional del flujo ciudadano, no texto decorativo.
   - Primera meta: contenido crítico de reportes y estatus en lenguaje claro y comprensible.

---

## 5) Modo de trabajo con IA (copiloto explícito)

Para cada cambio técnico en esta ruta:

- **Qué cambia:** archivo y módulo impactado.
- **Por qué cambia:** problema ciudadano o de trazabilidad que resuelve.
- **Cómo verificar:** prueba puntual (paso manual o test) para confirmar resultado.

Este formato será la base de acompañamiento para avanzar sin caja negra y con control del proceso.
