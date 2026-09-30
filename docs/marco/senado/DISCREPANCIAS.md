# DISCREPANCIAS

Fecha: 2026-09-30. Se listan sin resolver. La decisión es del responsable humano. Codex aún no ha contraauditado este trabajo, y yo no he contraauditado el suyo (no hay trabajo de Codex en el repositorio): **cierran la condición 4 del criterio de terminado solo cuando ambos lo hagan**.

| # | Discrepancia | Un lado | Otro lado | Qué haría falta |
|---|---|---|---|---|
| D1 | Quién ejecutó la Tarea A | El prompt la asigna a Codex | Yo corrí los comandos (necesarios para las pruebas con fecha) | Que Codex repita y compare resultados |
| D2 | Lectura de fuentes | El prompt exige `LEIDA` donde se cite | Ninguna fuente pudo leerse (proxy bloquea dominios oficiales) | Abrir dominios `.gob.mx` y repetir |
| D3 | Año de la NOM de ECE | `BIBLIOTECA_LEGAL.md`: NOM-024-SSA3-**2012**, "PENDIENTE PDF" | Resultado de búsqueda del DOF: NOM-024-SSA3-**2010** | Abrir el DOF y fijar versión vigente; corregir la biblioteca |
| D4 | Escala de madurez | El prompt cita ADR-0004 como la escala | ADR-0004 existe (rama `agent/source-of-truth-v01`, `03-ADR-REGISTER.md`) pero dice "ID.mx no sustituye Llave MX". La escala PROPOSED→INSTITUTIONAL aparece en `next/README.md`, no en ese ADR | Decidir qué ADR formaliza la escala |
| D5 | Estado del E2E ORBE P0 | `docs/orbe/ORBE_P0_REPORTE.md` (2026-09-04) prevé resultado verde en CI; `main` condiciona el deploy a esta suite | En `main` mi corrida local dio 7/8 y no terminaba. La rama `fix/orbe-p0-e2e-008-safe-degradation` (2026-09-06, sin fusionar) da **8/8 y termina**; su comentario describe el proceso nieto de `npx`. La hipótesis queda confirmada en la práctica | Fusionar la rama; `main` sigue fallando |
| D6 | Nombre "Evidence OS" | El prompt y docs lo tratan como cimiento | En código es `contextos/evidence.ts` (63 l.), sin separación | Decidir si se renombra o se construye aparte |
| D7 | CodeLens | El prompt dice "solo en diseño" | No hay rastro en este repositorio, pero existe el repo `Autosociomx/codelens` (no examinado). Mi afirmación previa "no existe" era incorrecta. | Examinar ese repo |
| D15 | "Versión vitrina" y otros repos | El prompt menciona una posible versión vitrina | `Gobernanza-Digital` **es el mismo repo** (renombrado). Las piezas que yo no hallé en `main` (ContextPolicyAgent, `REQUIRE_HUMAN`, agente de salud, routing SOATM) **sí existen** en la rama `premio-innovacion-2026-agentic-rebuild`. `Soatm` (privado), `ConnectX-intel` y `codelens` no examinados | Decidir qué ramas se fusionan y qué repos se examinan |
| D16 | `main` no refleja el estado real del trabajo | El Senado verá `main` | Lo más fuerte (federación, identidad, CodeLens, degradación segura, agentes) está en 8+ ramas sin fusionar; `main` falla un E2E | Plan de fusión con la Guardia y el CI |
| D17 | Datos sensibles y político-electorales en ramas públicas | `CLAUDE.md` regla 1 y 9 | 42 ramas con `firebase-applet-config.json`; ramas con nombres político-electorales | Limpiar historia o archivar/privatizar ramas (decisión humana; reescribir historia es destructivo) |
| D8 | Reforma local de Nayarit | El prompt: aprobada el 17-sep-2026 | Coincide con el resumen del buscador, sin leer el decreto | Leer el decreto |
| D9 | Estado de módulos | `docs/marco/modulos/salud.md` dice `real`; `docs/orbe/modulos/TEPICTU_SALUD.md` dice "diseñado" | Ya señalada en `docs/plataforma/03-DOCUMENTACION-FUNCIONAL.md` | Decisión humana (CLAUDE.md §5: señalar, no elegir) |
| D10 | Ubicación de entregables | El prompt no fija carpeta | `CLAUDE.md` pide `docs/marco/` por PR; `docs/` es área protegida | Mención explícita en la descripción del PR |
| D11 | Destino de las apps municipales al terminar la administración | El responsable humano afirma que Click por Tepic (y una app de Bahía de Banderas) se acaban con el periodo | No hallé contrato, convenio ni aviso de privacidad de Click por Tepic, ni la app de Bahía (C1, C2) | Solicitud de transparencia; revisar tiendas de apps y la Plataforma Nacional de Transparencia |
| D12 | Licencia | `ESTRATEGIA_ESTANDAR_ABIERTO.md` §3 prevé publicar con AGPL-3.0 | No hay `LICENSE` en la raíz ni `license` en `package.json` | Decisión humana sobre licencia y titular |
| D13 | Titularidad | Objetivo declarado: que pertenezca al municipio, no a una persona | Repo en organización personal; docs nombran fundador/originador; la estrategia plantea marca "propiedad exclusiva" y candados de dependencia | Decisión humana: a quién se cede qué, y cuándo |
| D14 | Reporte ciudadano como "duplicado" | Mi primera versión de la matriz trataba Click por Tepic como cobertura suficiente (INTEGRAR) | Si C1 se confirma, la cobertura no es durable | Resolver C1; la matriz ya lo marca condicionado |

## Afirmaciones que Codex debe atacar
1. Que los componentes 2 y 3 de `COMPONENTES_PARA_SENADO.md` son los más sólidos.
2. Que "Context.OS" es COMPLEMENTAR y no REUTILIZAR: no busqué a fondo en el Repositorio Nacional.
3. Las calificaciones 1–5 del inventario son juicio mío, no medición.
4. La hipótesis sobre la falla del caso 8.
