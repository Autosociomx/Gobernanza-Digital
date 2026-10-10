# Auditoría autónoma con agentes de código abierto

**Nayarit Digital · ConnectX** · Octubre 2026 · Propuesta de diseño (🟡 PROYECCIÓN: nada de esto está operando todavía salvo lo marcado ✅)

## 1. Qué es real hoy y qué no (honestidad de datos)

| Pieza | Estado | Evidencia |
|---|---|---|
| **La Guardia** (`scripts/verificar-regresiones.mjs`) | ✅ Existe | Falla el build si se violan las reglas R1–R8 |
| **Context.OS Runtime** (`contextos/`) | ✅ Existe, solo `LAB_MOCK` | Política determinística + evidencia con checksum SHA-256 |
| **Conectores** (`conectores/`) | ✅ Nuevo (bloque 2), mocks + prueba de contrato | `npm run test:conectores` |
| **SOATM** | ✅ Es la aplicación (`src/`, `server.ts`) | — |
| **Gabinete / Parlamento de IA** (`docs/agentes/`) | 🟡 Es un proceso documental con APIs de pago/capa gratuita | `GABINETE_ESPECIALISTAS.md` |
| **Evidence OS** | 🔵 Solo se menciona en `docs/orbe/P0_SCOPE.md`; **no hay código** | Hoy su papel lo cumple `contextos/evidence.ts` |
| **CodeLens** | 🔵 **No existe en el repo.** Ni código ni documento | Si es una herramienta tuya externa, dime dónde vive |

Si hay contradicción entre lo que dice una nota y lo que hay en código, manda el código.

## 2. Principio: el agente propone, la regla decide, el humano aprueba

Un agente de IA **no** debe ser quien decide si algo está bien. Se separa en tres capas:

1. **Capa determinística (decide):** Guardia, `tsc`, Vitest, escáner de secretos. Reproducible, sin IA. Es el único juez.
2. **Capa de agentes (propone):** lee, cuestiona y sugiere cambios en una rama. No puede mergear ni tocar archivos protegidos.
3. **Capa humana (aprueba):** PR hacia `main`, como ya exige `GOBERNANZA_REPOSITORIO.md`.

Esto mantiene la invariante de Context.OS: **ningún LLM decide políticas**.

## 3. Cómo "no afectar" habilidades (skills) ni agentes existentes

- Los agentes nuevos **solo escriben en una rama** `chore/auditoria-<fecha>`. Nunca en `main`.
- **Lista de rutas prohibidas** para edición automática: los archivos protegidos de `CLAUDE.md` (`index.html`, `vite.config.ts`, `netlify.toml`, `public/robots.txt`, `src/App.tsx`, `server.ts`, `docs/`, `scripts/verificar-regresiones.mjs`, `.github/workflows/`). En esas rutas el agente solo comenta, no edita.
- Las skills (`.claude/skills/`) se tratan como código: cambios por PR y con revisión humana. Un agente puede *reportar* que una skill está desactualizada, no reescribirla.
- Cada hallazgo lleva `[HALLAZGO]` + `[RECOMENDACIÓN]` + `[MÓDULO]` apuntando a un archivo real (Regla 2 del Gabinete).

## 4. Herramientas de código abierto candidatas (⚠️ POR VERIFICAR licencia, versión y mantenimiento antes de adoptar)

| Función | Opciones abiertas | Notas |
|---|---|---|
| Análisis estático de seguridad | Semgrep (reglas abiertas), CodeQL (ya lo usa GitHub) | Determinístico: capa 1 |
| Secretos en el repo | gitleaks, trufflehog | Encaja con la regla dura 1 (llaves filtradas 4 veces) |
| Dependencias vulnerables | `npm audit`, OSV-Scanner | `npm audit` ya reporta avisos |
| Agente que propone parches | Aider, OpenHands, Continue | Capa 2. Pueden correr con modelos locales |
| Modelos locales (sin enviar código a terceros) | Ollama + modelos abiertos | Evita exponer el repositorio; revisar licencia de cada modelo |
| Accesibilidad | axe-core, pa11y, Lighthouse CI | Meta Lighthouse del proyecto: 97/100/100/100 |

Regla de adopción: una herramienta entra solo con licencia revisada y **fijada a una versión**; se anota en `docs/agentes/INVENTARIO_SKILLS_ORGANIZADO.md`.

## 5. Ciclo de autoauditoría (cruce Context.OS ↔ SOATM ↔ skills)

```
1. Guardia + tsc + Vitest + gitleaks      → hechos duros (JSON)
2. Agente "cuestionador" lee los hechos + el contrato semántico
   (shared/semantic) y pregunta: ¿esta pantalla afirma algo sin etiqueta?
   ¿este módulo "real" tiene servicio detrás? ¿cifra sin fuente?
3. Cada hallazgo se registra como EvidenceRecord (contextos/evidence.ts)
   con correlationId y checksum → bitácora auditable
4. Agente "corrector" abre PR con parche mínimo (rutas permitidas)
5. Se vuelve a correr el paso 1. Si no pasa, el PR no se entrega
6. Humano revisa y aprueba
```

**Cruce de nodos:** cada módulo de `docs/marco/modulos/INDICE.json` es un nodo. Cada hallazgo se enlaza al nodo, a su ficha y, si aplica, a un conector (`conectores/`) o a un artículo de `BIBLIOTECA_LEGAL.md` (solo estatus VERIFICADO). La verificación de que el índice y el código coinciden (archivo y rango de líneas) es una comprobación **determinística** candidata a sumar a la Guardia.

Límite honesto: el checksum SHA-256 de la evidencia es `CHECKSUM_ONLY`. No es firma digital ni prueba de inmutabilidad.

## 6. Fases (para hacerlo por bloques)

| Fase | Entregable | Depende de |
|---|---|---|
| F1 | Guardia ampliada: coherencia `INDICE.json` ↔ código; escáner de secretos en CI | Solo nosotros |
| F2 | Script local que corre capa 1 y escribe un informe JSON | Solo nosotros |
| F3 | Plantilla de prompt del "cuestionador" con formato HALLAZGO/RECOMENDACIÓN/MÓDULO | Solo nosotros |
| F4 | Agente local (modelo abierto) en modo solo-lectura | Equipo con capacidad de cómputo |
| F5 | Agente corrector con PR automático en rutas permitidas | F1–F4 y tu aprobación |
| F6 | Evidence OS real (si se decide) | Decisión de arquitectura |

Cualquier cambio de `.github/workflows/` o de la Guardia es archivo protegido: va por PR con mención explícita.
