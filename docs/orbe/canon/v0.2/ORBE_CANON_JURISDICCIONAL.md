# ORBE_CANON_JURISDICCIONAL.md

**Serie:** `orbe-canon` · **Versión:** v0.2 · **Parent:** v0.1 (congelado)
**Estado:** activo — describe una decisión tomada y el rediseño que falta ejecutar.

> `v0.1` no se reescribe. Este documento extiende su definición canónica con la
> dimensión que faltaba: **el orden de gobierno**.

---

## 1. La decisión

`v0.1` definió al ORBE como el Experience Plane y la frontera semántica que
convierte una expresión humana en orientación o en una intención estructurada.
Esa definición es correcta y se mantiene. Lo que no estaba dicho, y por lo tanto
se decidió por omisión en el código, es **contra qué autoridad ocurre todo eso**.

Se decide, y se declara canónico:

> **El ORBE no sirve a un orden de gobierno: sirve a una persona. La
> jurisdicción es un dato del trámite, resuelto por el canon, nunca un supuesto
> del sistema. Quien pregunta no tiene por qué saber si su asunto es municipal,
> estatal o federal — averiguarlo es trabajo del ORBE, no del ciudadano.**

Corolario operativo: **ninguna capacidad del ORBE puede declararse contra "el
municipio" por omisión.** Se declara contra una jurisdicción del registro
`data/canon/jurisdicciones.json`, que puede ser federal, estatal o municipal.

## 2. Por qué esto es una corrección y no una ampliación de alcance

No es que faltara cubrir más trámites. Es que la competencia administrativa
estaba modelada mal:

- El acta de nacimiento vivía en el catálogo como `tepic.registro_civil_acta_nacimiento`
  cuando el Registro Civil es estatal.
- El predial es municipal, pero su fundamento verificado es **estatal** (Ley de
  Hacienda Municipal del Estado de Nayarit, Arts. 21, 22 y 34). Jurisdicción y
  fundamento son ejes distintos y el modelo anterior no podía expresarlo.
- Mover ganado exige fierro municipal, guía estatal e identificador federal.
  Una sola pregunta ciudadana, tres órdenes de gobierno.

Un sistema que asume municipio manda al ciudadano a la ventanilla equivocada
con la confianza de una respuesta automatizada. Eso es peor que no responder.

Evidencia completa: `docs/marco/AUDITORIA_FUENTE_CANONICA.md`.

## 3. Lo que ya está hecho (entregado con esta versión)

El plano de **orientación** ya es jurisdiccionalmente neutro:

| Artefacto | Qué aporta |
|---|---|
| `data/canon/jurisdicciones.json` | Jerarquía federal → estatal → municipal, con `codigo_contextos` como única traducción autorizada hacia el runtime. |
| `data/canon/fuentes.json` | Registro de fuentes con nivel, vigencia y notas de conflicto. |
| `data/canon/tramites.json` | 11 trámites: 7 municipales, 2 estatales, 2 federales. |
| `data/canon/schema/canon.schema.json` | Contrato publicado (estándar abierto). |
| `shared/canon/resolver.ts` | Resolución determinística de expresión ciudadana → trámite, sin importar el orden de gobierno. |
| `scripts/verificar-canon.mjs` | 8 reglas, R9 de la Guardia, paso propio en CI. |

## 4. Lo que falta: Context.OS v0.2

El plano de **ejecución** sigue siendo municipal. `contextos/runtime.ts:64-73`
rechaza todo envelope sin municipio, así que un trámite estatal no puede
siquiera llegar a la evaluación de política.

Esta es la especificación de la corrección. No se ejecuta todavía porque
cambia el formato de cable de `contextos.v0.1`, y ese cambio exige su propio
PR con pruebas adversariales, según la regla de expansión de
`v0.1/ORBE_CANON.md` §8.

### 4.1 Cambio de tipo

```ts
// contextos/contracts.ts
export type NivelJurisdiccion = 'FEDERAL' | 'ESTATAL' | 'MUNICIPAL';

export interface Jurisdiction {
  country: 'MX';
  level: NivelJurisdiccion;   // nuevo, obligatorio
  state?: string;             // obligatorio salvo en FEDERAL
  municipality?: string;      // obligatorio solo en MUNICIPAL
}
```

`level` es **obligatorio y explícito**. No se infiere de la presencia de
`municipality`: la autoridad que decide es precisamente lo que no puede
quedar a merced de una heurística, por determinística que sea.

### 4.2 Reglas de validación (`contextos/runtime.ts`)

| `level` | `state` | `municipality` | Resultado |
|---|---|---|---|
| `FEDERAL` | ausente | ausente | válido |
| `FEDERAL` | presente | — | `DENY: JURISDICTION_LEVEL_MISMATCH` |
| `ESTATAL` | presente | ausente | válido |
| `ESTATAL` | ausente | — | `DENY: JURISDICTION_REQUIRED` |
| `ESTATAL` | presente | presente | `DENY: JURISDICTION_LEVEL_MISMATCH` |
| `MUNICIPAL` | presente | presente | válido |
| `MUNICIPAL` | presente | ausente | `DENY: JURISDICTION_REQUIRED` |
| ausente | — | — | `DENY: JURISDICTION_LEVEL_REQUIRED` |

`jurisdictionCode()` pasa a recibir la jurisdicción completa y devuelve
`MX`, `MX-NAY` o `MX-NAY-TEPIC` según el nivel. Los códigos municipales
existentes no cambian: `MX-NAY-TEPIC` sigue siendo `MX-NAY-TEPIC`.

### 4.3 Alcance del cambio

- `contextos/contracts.ts` — el tipo y `CONTEXTOS_SCHEMA_VERSION` → `contextos.v0.2`.
- `contextos/runtime.ts` — validación por nivel.
- `contextos/serviceCatalog.ts` — firma de `jurisdictionCode()`.
- `contextos/policyEngine.ts`, `shared/semantic/alignment.ts` — sitios de llamada.
- `shared/semantic/types.ts` — reutilizar `Jurisdiction` en vez de repetir su forma.
- `shared/semantic/contracts/publicWorksReport.ts` — `level: 'MUNICIPAL'`.
- **Ruta HTTP** `/api/contextos/v0.1/execute` → `v0.2`, en `contextos/labServer.ts`,
  `netlify/functions/contextos-lab.mts`, `src/services/contextosRuntimeClient.ts`
  y `scripts/test-orbe-p0-e2e.mts`. Es un despliegue coordinado: el LAB público
  y el cliente cambian juntos o el puente se rompe.
- `contextos/README.md`, `docs/orbe/DESPLIEGUE_LAB.md` — endpoints documentados.

### 4.4 Pruebas de aceptación

Ninguna de estas puede escribirse después. Son la condición de entrega:

1. Los ocho renglones de la tabla §4.2, cada uno con su `reasonCode`.
2. Un envelope `MUNICIPAL` idéntico al actual sigue produciendo `EXECUTED`
   con la misma evidencia verificable — la generalización no cambia el
   comportamiento del caso que ya funciona.
3. Un envelope `ESTATAL` con un servicio registrado solo para `MX-NAY-TEPIC`
   devuelve `JURISDICTION_NOT_ALLOWED`, no `JURISDICTION_REQUIRED`: negar por
   competencia y negar por forma son cosas distintas y el ciudadano merece
   saber cuál.
4. `auditSemanticRuntimeAlignment()` detecta deriva de nivel entre contrato y
   servicio, no solo de código de jurisdicción.
5. El canon y el código siguen alineados: `scripts/verificar-canon.mjs` en verde.

### 4.5 Deuda adyacente que este PR debe resolver o declarar

- **`POLICY_VERSION` global.** `contextos/policyEngine.ts:4` es
  `contextos.policy.public-works.v0.2` y `runtime.ts` la estampa en toda
  evidencia, incluida la de envelopes inválidos. Al segundo dominio, la
  evidencia quedaría firmada con la política equivocada. `ORBE_TAXONOMIA.md` §7
  ya lo advirtió. Debe separarse en política por servicio antes de registrar un
  segundo servicio ejecutable.
- **`buildPublicWorksIntentEnvelope()`** (`src/orbe/metalinguistics.ts:162`)
  lanza si el dominio no es `public_works`. Debe volverse
  `buildIntentEnvelope(contract, …)`, genérico como ya lo es el registro.
- **`normalizarExpresion()`** de `shared/canon/resolver.ts` duplica a
  `normalizeCitizenText()` de `src/orbe/metalinguistics.ts`. La duplicación es
  deliberada (`shared/` no debe importar de `src/`) y temporal: al unificar,
  el normalizador canónico vive en `shared/`.

## 5. Invariantes que esta versión **no** toca

Los diez invariantes constitucionales de `v0.1/ORBE_CANON.md` §6 siguen
íntegros. En particular:

- Los adapters siguen respondiendo `LAB_MOCK`. Ampliar la jurisdicción **no**
  amplía la autoridad: un trámite estatal en Context.OS seguirá sin producir
  efectos administrativos.
- La política sigue siendo determinística; ningún LLM decide competencia.
- `CHECKSUM_ONLY` sigue sin ser firma digital.

Que el ORBE pueda hablar de un trámite estatal no significa que pueda
ejecutarlo. Esa frontera es el proyecto.

## 6. Regla de expansión, actualizada

`v0.1/ORBE_CANON.md` §8 fija que una capacidad nueva entra como contrato
semántico → registro → descriptor de servicio → policy → adapter → pruebas → UI.

Se le antepone un paso:

> **0. Entrada al canon.** Antes de cualquier código, el trámite se declara en
> `data/canon/tramites.json` con su jurisdicción, su fundamento registrado y su
> semáforo por dato. Un trámite que no está en el canon no existe para el ORBE,
> ni para orientar ni para ejecutar.

Y el validador lo hace cumplir en ambos sentidos: el canon no puede prometer
ejecución que el código no registra, y el código no puede tener un contrato
semántico activo que el canon no describa.
