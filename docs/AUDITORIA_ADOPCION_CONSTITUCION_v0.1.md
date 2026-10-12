# Auditoría de adopción — Constitución de Arquitectura v0.1

**Fecha:** 2026-08-31

**Repositorio:** `Autosociomx/Gobernanza-digital-`

**Rama revisada:** `main`

**Commit objetivo:** `afb75910bc631d9714fd797cc950550f45f8c7b9`

**Documento:** `docs/marco/CONSTITUCION_ARQUITECTURA_v0.1.md`

## Dictamen

**ADOPTADA COMO PROPUESTA NORMATIVA; CUMPLIMIENTO INTEGRAL NO PROBADO.**

La Constitución refleja correctamente la dirección ya implementada por el vertical nuevo de Context.OS y ORBE, pero no describe todavía el estado de toda la aplicación histórica. Su adopción no eleva automáticamente componentes simulados, documentales o heredados a producción.

## Evidencia de conformidad

| Regla | Evidencia en el commit objetivo | Estado |
|---|---|---|
| Context.OS autoriza | `contextos/runtime.ts` evalúa esquema, servicio, jurisdicción, propósito, política y consentimiento antes del adapter | Implementado y probado |
| ConnectX conecta | Catálogo, adapters y contratos semánticos separan integración de política | Parcialmente implementado |
| Evidence.OS prueba | Context.OS emite `EvidenceRecord` verificable; el dataset de 39 cédulas vive en un repositorio/paquete separado y sigue incompleto | Parcial |
| CodeLens verifica | No existe CodeLens Core completo en este commit | No probado |
| ORBE acompaña | `src/orbe/contextosBridge.ts` separa chat, aclaración, confirmación y runtime; los errores declaran que no hubo acción | Implementado y probado |
| El humano decide | Los flujos de laboratorio y documentación reconocen límites y derivación humana | Parcial |
| Idempotencia | Runtime detecta repetición y conflicto de `requestId` | En memoria; no distribuida |
| Consentimiento | Se valida propósito, alcance, sujeto, solicitud, vigencia y revocación/expiración | Implementado en el vertical |
| Contratos versionados | Intent, contrato semántico y registro llevan ID/versión y se comparan antes de ejecutar | Implementado |
| Estados honestos | UI y documentación identifican `LAB_MOCK`, proyecciones y limitaciones | Alineado, con deuda histórica |

## Bloqueantes P0

1. **CodeLens no está implementado como motor completo.** No puede afirmarse que el ecosistema entero esté mecánicamente verificado.
2. **Evidence.OS no está integrado como producto canónico.** Existen `EvidenceRecord` de Context.OS y un dataset separado de 39 cédulas, pero falta definir la relación de autoridad y construir `Audit Package v0.1`.
3. **La aplicación histórica conserva superficies de alto riesgo.** Salud, `C5Dashboard`, `server.ts` y componentes que mezclan datos reales, simulación y presentación requieren auditorías específicas antes de producción.
4. **La Guardia CI no demuestra ejecución confiable en todos los commits.** Un check rojo o un job sin runner no equivale a prueba ejecutada.

## Riesgos P1

- La idempotencia de Context.OS reside en memoria; no sobrevive reinicios ni múltiples instancias.
- `subjectId` sigue siendo una referencia genérica y necesita contrato explícito de seudonimización/aseguramiento.
- Los adapters de laboratorio generan hashes, pero un hash no sustituye procedencia, preservación, autoridad ni reglas de retención.
- La documentación histórica contiene afirmaciones que sólo son válidas para commits anteriores; toda auditoría debe registrar `target_commit`.
- `docs/marco/GOBERNANZA_REPOSITORIO.md` atribuye al Parlamento la decisión de dirección. La Constitución precisa el límite: el Parlamento recomienda y registra; la autoridad humana aprueba decisiones materiales.
- La raíz y documentación conservan versiones tempranas de Parlamento y guías específicas de proveedor. Deben preservarse como historia, no competir con la Constitución.

## Primera decisión derivada

La Constitución queda como documento normativo propuesto en `docs/marco/`. Ante una contradicción:

1. se registra la contradicción;
2. se identifica el commit y componente afectado;
3. no se reescribe historia ni código silenciosamente;
4. se propone una decisión versionada;
5. una persona autorizada aprueba el cambio material.

## Siguiente incremento

Construir `Audit Package v0.1` sobre una sola cédula controlada y enlazarla con un `EvidenceRecord` real de Context.OS.

El incremento debe demostrar:

- manifiesto y versión;
- caso/cédula;
- fuentes y snapshots;
- hashes y procedencia;
- política, consentimiento y resultado;
- contradicciones y limitaciones;
- acceso externo de sólo lectura;
- decisión humana;
- verificación reproducible.

## Condición de cierre

La Constitución podrá pasar de `PROPOSED` a `ADOPTED` cuando:

- exista aprobación humana registrada en una PR;
- las pruebas de Context.OS/ORBE estén verdes para el commit de adopción;
- se documente la relación entre `EvidenceRecord`, Evidence.OS y CodeLens;
- se asigne responsable de mantenimiento;
- se defina una revisión de versión y fecha.

## Verificación mecánica local

Ejecutada el 2026-08-31 sobre el árbol de trabajo derivado del commit objetivo:

- TypeScript (`tsc --noEmit`): **aprobado, 0 errores**.
- Context.OS, puente ORBE y registro semántico: **45 pruebas aprobadas en 3 archivos**.
- Guardia de regresiones R1–R8: **aprobada** con `grep` disponible en Windows.
- Bundle web de producción (Vite): **aprobado, 3,163 módulos transformados**; conserva advertencias de tamaño en componentes históricos.
- Integridad del parche (`git diff --check`): **sin errores de whitespace**; sólo avisos de normalización LF/CRLF en Windows.

El bundle independiente de `server.ts` no pudo comprobarse localmente porque el ejecutable nativo de esbuild no obtuvo acceso al árbol desde el entorno aislado. La CI debe ejecutar el `npm run build` completo al presentar la PR.
