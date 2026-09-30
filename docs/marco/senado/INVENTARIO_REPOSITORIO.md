# INVENTARIO_REPOSITORIO — Tarea A: qué funciona y qué no

- Repositorio: `Autosociomx/Gobernanza-digital-` · commit base `d5a78aa` (Merge ORBE P0 v0.2) · rama de trabajo `claude/stoic-maxwell-ox8pza`.
- Fecha de ejecución: **2026-09-30** (UTC) · Entorno: Linux, Node según `.nvmrc`, `npm ci` previo, Java 21.0.10.
- Nota de alcance: el prompt asigna la Tarea A a Codex. Yo ejecuté los comandos porque `COMPONENTES_PARA_SENADO.md` necesita una prueba con fecha. Codex debe repetirlos y contraauditar (ver `DISCREPANCIAS.md`).
- No revisé "versión vitrina": solo existe este repositorio en la sesión.

## 1. Comandos ejecutados y resultado literal

| Comando | Resultado literal (extracto) | Veredicto |
|---|---|---|
| `npm test` | `Test Files 4 passed (4)` · `Tests 54 passed (54)` · `Duration 547ms` · EXIT=0 | ✅ |
| `npm run test:orbe-contextos` | `Test Files 3 passed (3)` · `Tests 45 passed (45)` · EXIT=0 | ✅ |
| `npm run test:orbe-p0-e2e` | `Resultado: 7/8 casos pasan` · caso 8 "Runtime caído" FAIL: `Expected values to be strictly equal: 'RUNTIME' !== 'ERROR'` · `1 caso(s) fallaron.` · el proceso **no terminó solo**: `timeout 120` lo cortó (EXIT=124) | ❌ **falla** |
| `node scripts/verificar-regresiones.mjs` | `✔ Guardia de regresiones: todo en orden.` · EXIT=0 | ✅ |
| `npm run test:firestore-rules` (Java 21, emulador) | `11 pasadas / 0 fallidas / 11 total` · `Script exited successfully (code 0)` (los `PERMISSION_DENIED` del log son los casos negativos esperados) | ✅ |
| `npm run lint` / `vite build` | **NO_VERIFICADO.** Requieren `firebase-applet-config.json` (gitignorado; `CLAUDE.md` §2 documenta que su ausencia produce `TS2307` esperado). | NO_VERIFICADO |

### Sobre la falla del E2E (caso 8)
`scripts/test-orbe-p0-e2e.mts:262-271` detiene el servidor de laboratorio (`stopLabServer`, SIGTERM al proceso lanzado con `npx tsx`) y luego espera que `processCitizenUtterance` devuelva `route: 'ERROR'`. Obtuvo `'RUNTIME'`, es decir, **algo siguió respondiendo en el puerto**.
**Hipótesis (NO_VERIFICADO):** `npx` es un proceso intermedio; SIGTERM no mata al `node` hijo, el servidor sigue vivo, y eso explica a la vez la falla y que el script no termine. Esto sería un defecto del arnés de prueba, no del puente. Hasta comprobarlo, el caso de "degradación segura" **no está demostrado**. Un reporte previo del repo (`docs/orbe/ORBE_P0_REPORTE.md`) puede decir otra cosa: no lo contrasté (ver D5).
Conteo de pruebas unitarias por archivo (por `it/test` en fuente): runtime 23, bridge 15, registry 7.

## 2. Inventario de componentes y calificación

Escala 1–5. Criterios: **Fun**ciona (pruebas ejecutadas en verde) · **Ver**ificable (un tercero lo reproduce) · **Ley** (responde a un artículo concreto; *no verificado contra texto oficial*, ver `PARALELO_NACIONAL.md`) · **Dif**erente (no hay equivalente; *limitado a mi búsqueda parcial*) · **Obj**eción del Congreso (*sin fuente oficial localizada*) · **Rie**sgo de presentarlo (5 = bajo riesgo). Madurez en escala ADR-0004: **el documento ADR-0004 no está en el repositorio** (grep sin resultados), así que uso la escala que da el prompt y marco el nivel como "techo que permite la evidencia".

| Componente | Dónde | Líneas (prod / pruebas) | Pruebas | Fun | Ver | Ley | Dif | Obj | Rie | Nivel que permite la evidencia |
|---|---|---|---|---|---|---|---|---|---|---|
| **Context.OS Runtime** (política determinista, consentimiento, catálogo, adapters `LAB_MOCK`) | `contextos/` | 1 320 incl. pruebas (348 de pruebas) | 23 unit + E2E HTTP 7/8 | 4 | 4 | 3 | 3 | 4 | 4 | EXPERIMENTAL (tope). No VALIDADO: falla E2E-8 y no hay auditoría externa. |
| **Contrato semántico + puente metalingüístico** | `shared/semantic/`, `src/orbe/`, `src/services/contextosRuntimeClient.ts` | 475 + 651 + 69 | 7 + 15 unit | 4 | 4 | 2 | 3 | 4 | 4 | EXPERIMENTAL |
| **Evidencia ("Evidence OS")** | `contextos/evidence.ts` | 63 | Cubierta dentro de `runtime.test.ts` | 3 | 4 | 2 | 2 | 3 | 3 | EXPERIMENTAL. **No existe como componente separado**: es un archivo de 63 líneas con `integrityAssurance: 'CHECKSUM_ONLY'`. El nombre "Evidence OS" sobredimensiona. |
| **Guardia de regresiones + CI** | `scripts/verificar-regresiones.mjs`, `.github/workflows/guardia-regresiones.yml` | 99 | Corrida propia en verde | 4 | 5 | 2 | 2 | 4 | 5 | VALIDADO como control interno (reproducible). No es certificación. |
| **Reglas Firestore de salud** (consentimiento, CURP, código de personal) | `firestore.rules` | 381 | 11/11 en emulador | 4 | 4 | 3 | 2 | 4 | 3 | EXPERIMENTAL (las reglas sí están probadas). |
| **Expediente médico (UI y servicios)** | `src/components/SaludNayaritID.tsx` (966), `src/services/saludPerfilService.ts` (228), `citasSaludService.ts` (112), `SaludView()` en `C5Dashboard.tsx` | 1 306 | **Ninguna** | 2 | 2 | 2 | 1 | 3 | 2 | PROPUESTO→EXPERIMENTAL. Sin pruebas de UI ni de servicios. |
| **Llave MX infantil** | Solo documentos: `docs/marco/soberania-digital-infantil/` (incl. `FICHA_LEGISLATIVA.md`), `docs/auditoria-orbe/` | 0 de código | — | 1 | 2 | 3 | 3 | 3 | 2 | PROPUESTO. Es una propuesta legislativa y de arquitectura, no software. |
| **Academia para servidores públicos** | `src/components/ConnectXAcademy.tsx` (161), `StrategicAcademyView.tsx` | 161+ | Ninguna | 1 | 1 | 2 | 1 | 2 | 3 | PROPUESTO. `INDICE.json` los marca `maqueta`. |
| **ORBE asesor** (Aura + piloto Context.OS) | `src/hooks/useAuraChat.ts`, `server.ts:/api/ai/chat`, `src/components/orbe/` (218) | — | Bridge unit; Aura sin pruebas | 2 | 2 | 3 | 2 | 3 | 2 | EXPERIMENTAL. Puente apagado por defecto. Lenguas originarias: `ESTADO_MADUREZ_TECNOLOGICA.md` las marca 🔴 "strings hardcodeados sin validar". |
| **SOATM / C5 / CitizenApp** | `src/components/` | >3 700 en dos archivos | Ninguna de UI | 2 | 2 | 4 | 2 | 2 | 2 | PROPUESTO/EXPERIMENTAL. `INDICE.json`: 15 de 29 módulos `maqueta`, 2 `riesgo`. |
| **CodeLens** | — | 0 | — | 1 | 1 | 1 | 1 | 1 | 1 | **No existe** en el repositorio (grep sin resultados, ni como documento de diseño). PENDIENTE: origen del diseño. |

Catálogo de servicios de Tepic (`data/municipality/tepic/services.json`): 8 servicios con modelo de estatus `verificado / por_verificar / demo / propuesto`; las oficinas y competencias aparecen "por verificar". No es un catálogo oficial.

## 3. Lo que no debe mostrarse aún (lista cerrada con evidencia del repositorio)

| # | Qué | Evidencia | Categoría |
|---|---|---|---|
| 1 | **Cartas municipales con "hash" y QR oficial** | `src/components/MunicipalLettersView.tsx:110-117`: el "SHA-256" se genera con `Math.random()` y el QR apunta a `https://nayarit.gob.mx/verify/letter/…`. Es un documento simulado con dominio oficial que no controlamos. `INDICE.json` ya lo marca `riesgo`. | Dominio oficial sin permiso + métrica/prueba inventada |
| 2 | **"Potencial Voto" en Brigada de campo** | `src/components/BrigadaFieldView.tsx:22,29` (prioridad `'voto'`, etiqueta "Potencial Voto") | Herramienta político-electoral |
| 3 | `TesisCienciaPolitica.tsx`, `AnalisisPoliticoView.tsx` y el documento `Parlamento.MD` ("Parlamento de las Sillas") | Contenido político y de marketing; `analisis_politico` es `maqueta` | Político / sin fuente |
| 4 | Los 15 módulos `maqueta` y el "Mapa de Calor" de salud | `INDICE.json`; `docs/marco/modulos/salud.md` ("decorativo/estático") | Demostraciones con datos falsos |
| 5 | Pagos (Stripe) | `INDICE.json`: `payments` = `riesgo`; además Tepic y Bahía de Banderas ya cobran en línea | Riesgo + traslape |
| 6 | Nombres "ID.mx", "Nayarit ID", "Llave MX infantil" sin aclarar que son propuesta propia | `ESTADO_MADUREZ_TECNOLOGICA.md` admite que Llave MX es "propuesta" en el proyecto | Posible confusión con servicios oficiales |
| 7 | Cualquier cifra de `PARALELO_NACIONAL.md` (20.5 millones, 168 sistemas, 13→10 trámites…) | Fuente `LOCALIZADA`, no leída | Cifra sin lectura |
| 8 | Demo "constancia-residencia" y el sitio `tepic.netlify.app` presentados como oficiales | Ver `demo/`; `docs/orbe/README.md` lo enlaza; el sitio no es institucional | Dominio/identidad |
| 9 | Hablar de "lenguas originarias" como capacidad | `ESTADO_MADUREZ_TECNOLOGICA.md` 🔴 | Capacidad no validada |

Límite: no audité cada componente de `src/` en busca de cifras sin etiqueta; `NO_VERIFICADO` para el resto de la UI.
