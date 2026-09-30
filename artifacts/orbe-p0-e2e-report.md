# ORBE P0 E2E — reporte de corrida

- Fecha: 2026-09-30T09:11:47.880Z
- Base auditada: `afb75910bc631d9714fd797cc950550f45f8c7b9`
- Runtime: `contextos/labServer.ts` por HTTP real
- Execution mode exigido: `LAB_MOCK`
- Authority exigida: `NONE`
- Resultado: **7/8 casos pasan**

| # | Caso | Esperado | Resultado | Detalle |
|---:|---|---|---|---|
| 1 | Solicitud explícita completa | ALLOW → EXECUTED + evidenceId + sha256 | PASS | evidenceId=1dc4b954-95c5-407b-abbb-1c778418ca43 |
| 2 | Aseveración de incidencia | CONFIRM_ACTION; cero ejecución | PASS | CONFIRM_ACTION sin llamada HTTP |
| 3 | Pregunta informativa | CHAT; sin IntentEnvelope ni ejecución | PASS | CHAT sin llamada HTTP |
| 4 | Ubicación ausente | REQUIRE_CLARIFICATION → NEEDS_INPUT; misma intención al continuar | PASS | correlationId preservado=orbe-2c7fa6aa-bdaa-49fd-959d-4b16db98110d |
| 5 | Expresión ambigua | ASK_INTENT; cero ejecución | PASS | ASK_INTENT/CLARIFY sin llamada HTTP |
| 6 | Binding semántico incompatible | Context.OS rechaza | PASS | reasonCodes=SEMANTIC_CONTRACT_VERSION_MISMATCH |
| 7 | Reenvío del mismo requestId | Idempotencia; misma respuesta sin efecto duplicado | PASS | evidenceId estable=88215fb6-975b-4393-8b2f-797ffd12e2e7 |
| 8 | Runtime caído | ORBE no afirma ejecución; degradación segura | FAIL | Expected values to be strictly equal:  'RUNTIME' !== 'ERROR'  |

> Este reporte prueba la frontera semántica, transporte HTTP, `labServer`, runtime, policy, adapter, evidencia y mensaje ciudadano. No afirma efectos institucionales ni sustituye una prueba de navegador real.
