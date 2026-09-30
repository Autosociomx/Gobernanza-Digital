# DISCREPANCIAS

Fecha: 2026-09-30. Se listan sin resolver. La decisión es del responsable humano. Codex aún no ha contraauditado este trabajo, y yo no he contraauditado el suyo (no hay trabajo de Codex en el repositorio): **cierran la condición 4 del criterio de terminado solo cuando ambos lo hagan**.

| # | Discrepancia | Un lado | Otro lado | Qué haría falta |
|---|---|---|---|---|
| D1 | Quién ejecutó la Tarea A | El prompt la asigna a Codex | Yo corrí los comandos (necesarios para las pruebas con fecha) | Que Codex repita y compare resultados |
| D2 | Lectura de fuentes | El prompt exige `LEIDA` donde se cite | Ninguna fuente pudo leerse (proxy bloquea dominios oficiales) | Abrir dominios `.gob.mx` y repetir |
| D3 | Año de la NOM de ECE | `BIBLIOTECA_LEGAL.md`: NOM-024-SSA3-**2012**, "PENDIENTE PDF" | Resultado de búsqueda del DOF: NOM-024-SSA3-**2010** | Abrir el DOF y fijar versión vigente; corregir la biblioteca |
| D4 | Escala de madurez | El prompt cita ADR-0004 | El archivo no existe en el repositorio | Localizar el ADR |
| D5 | Estado del E2E ORBE P0 | `docs/orbe/ORBE_P0_REPORTE.md` (2026-09-04) prevé resultado verde en CI; hay un commit que condiciona el deploy a esta suite | Mi corrida local: 7/8 y no termina | Correr en CI y probar la hipótesis del proceso nieto de `npx` |
| D6 | Nombre "Evidence OS" | El prompt y docs lo tratan como cimiento | En código es `contextos/evidence.ts` (63 l.), sin separación | Decidir si se renombra o se construye aparte |
| D7 | CodeLens | El prompt dice "solo en diseño" | No hay rastro en el repositorio | Indicar dónde está el diseño |
| D8 | Reforma local de Nayarit | El prompt: aprobada el 17-sep-2026 | Coincide con el resumen del buscador, sin leer el decreto | Leer el decreto |
| D9 | Estado de módulos | `docs/marco/modulos/salud.md` dice `real`; `docs/orbe/modulos/TEPICTU_SALUD.md` dice "diseñado" | Ya señalada en `docs/plataforma/03-DOCUMENTACION-FUNCIONAL.md` | Decisión humana (CLAUDE.md §5: señalar, no elegir) |
| D10 | Ubicación de entregables | El prompt no fija carpeta | `CLAUDE.md` pide `docs/marco/` por PR; `docs/` es área protegida | Mención explícita en la descripción del PR |

## Afirmaciones que Codex debe atacar
1. Que los componentes 2 y 3 de `COMPONENTES_PARA_SENADO.md` son los más sólidos.
2. Que "Context.OS" es COMPLEMENTAR y no REUTILIZAR: no busqué a fondo en el Repositorio Nacional.
3. Las calificaciones 1–5 del inventario son juicio mío, no medición.
4. La hipótesis sobre la falla del caso 8.
