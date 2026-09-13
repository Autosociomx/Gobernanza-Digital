# Canon del ORBE — fuente canónica de trámites y servicios

Este directorio es **la** fuente de verdad sobre qué trámites existe, quién es
la autoridad competente, con qué fundamento, hasta dónde puede llegar el ORBE
y qué está todavía sin verificar.

No es documentación. Es dato verificado en cada build por
`scripts/verificar-canon.mjs`, ejecutado por la Guardia (R9) y por CI.

---

## 1. Por qué existe

Antes de este canon el repositorio tenía **diez inventarios paralelos** de lo
que el ORBE sabe hacer — catálogos JSON que ningún módulo leía, arreglos
`const` dentro de componentes de React, tablas en Markdown, fichas sueltas —
y ninguno era autoritativo. El detalle completo está en
[`docs/marco/AUDITORIA_FUENTE_CANONICA.md`](../../docs/marco/AUDITORIA_FUENTE_CANONICA.md).

El caso que obliga a esto: `data/municipality/tepic/services.json` declaraba
ocho servicios municipales y **ninguna línea de código lo leía**. Su propio
README listaba como pendiente «conectar el catálogo al resolvedor de intención
del ORBE». Nunca ocurrió. Una fuente canónica que nadie verifica no es
canónica: es un PDF con llaves.

## 2. La regla que cambia todo: neutralidad jurisdiccional

Un trámite **no se declara contra "el municipio"**. Se declara contra una
jurisdicción del registro, que puede ser federal, estatal o municipal.

Esto no es abstracción anticipada: es la realidad del ciudadano. Quien pide un
acta de nacimiento en Tepic está pidiendo un trámite **estatal**. Quien paga el
predial paga un trámite **municipal** cuyo fundamento es una ley **estatal**
(Ley de Hacienda Municipal del Estado de Nayarit). Quien va a mover ganado
necesita fierro municipal, guía estatal e identificador federal — una sola
pregunta, tres órdenes de gobierno.

Un ORBE que asume "municipio" por omisión le miente al ciudadano o lo manda a
la ventanilla equivocada. El canon lo impide por construcción: el id de cada
trámite debe empezar con su jurisdicción, y el validador lo exige.

## 3. Los tres registros

| Archivo | Qué es |
|---|---|
| `jurisdicciones.json` | Quién puede ser autoridad. Jerarquía federal → estatal → municipal, con `codigo_contextos`: la **única** traducción autorizada hacia `jurisdictionCode()` de `contextos/serviceCatalog.ts`. |
| `fuentes.json` | De dónde sale cada afirmación. Implementa el esquema que `docs/fuentes-oficiales-y-alineacion/README.md` declaraba en prosa desde hace meses sin datos detrás. Indexa a `docs/marco/BIBLIOTECA_LEGAL.md`; si discrepan, **manda la Biblioteca Legal**. |
| `tramites.json` | El catálogo. Qué trámite es, de quién, con qué fundamento, qué puede hacer el ORBE y qué tiene prohibido. |

El contrato publicado está en `schema/canon.schema.json` — JSON Schema
2020-12, artefacto de estándar abierto: cualquier municipio o estado puede
publicar su catálogo con esta forma y el ORBE lo entiende sin código nuevo
(ver `docs/marco/ESTRATEGIA_ESTANDAR_ABIERTO.md`, candado 2). El validador usa
ese mismo esquema como regla ejecutable, así que esquema y validador no pueden
desviarse uno del otro.

## 4. El semáforo, ahora ejecutable

La regla cultural del proyecto (🔴 se elimina · 🟡 se etiqueta · 🟢 se exhibe)
dejó de ser una convención de redacción y pasó a ser una regla de compilación.

Cada dato operativo — `dependencia`, `costo`, `plazo`, `canal_oficial` — lleva
su propio estatus. El estatus del trámite **no puede ser más fuerte que el más
débil de sus datos**, y el validador falla el build si alguien lo infla:

```
propuesto  <  demo  <  por_verificar  <  verificado
```

En consecuencia, hoy **ningún trámite del canon está en `verificado`**, y eso
es correcto: no hemos cerrado con las autoridades ni un costo, ni un plazo, ni
una dependencia responsable. El canon lo dice en voz alta en vez de disimularlo.

`fundamentoPublicable()` aplica la regla de oro del Glosario en código: solo
sale a boca del asistente la fuente con estatus `vigente`. Lo `por_verificar`
existe, sirve internamente y **no se afirma en público**.

## 5. Qué verifica la Guardia (`scripts/verificar-canon.mjs`)

| Regla | Qué impide |
|---|---|
| **C1 · Forma** | Un campo inventado, un enum fuera de vocabulario, un registro incompleto. |
| **C2 · Jerarquía** | Un municipio colgando de un municipio; un `codigo_contextos` que no extiende al de su padre. |
| **C3 · Integridad referencial** | Citar una ley que no está en `fuentes.json`; un id que miente sobre la competencia; una fuente `por_verificar` sin decir por qué. |
| **C4 · Semáforo** | Presentar un trámite mejor respaldado de lo que está. |
| **C5 · Acciones** | Vocabulario abierto; una acción a la vez permitida y prohibida; un trámite sin límites declarados. |
| **C6 · Canon ↔ código** | Prometer una ejecución que `contextos/serviceCatalog.ts` no registra — **y al revés**: que el código tenga un contrato semántico activo que el canon no describa. Esto último es lo que convierte al canon en fuente y no en adorno. |
| **C7 · Destinos reales** | Un enlace profundo a una vista o pestaña que no existe. Misma regla que `orbe-3d.html`: nunca se inventa un destino. |
| **C8 · Datos personales** | CURP, teléfono o correo dentro del catálogo. |

## 6. Cómo agregar un trámite

1. Si su autoridad no existe todavía, agrégala a `jurisdicciones.json`.
2. Si su fundamento no está registrado, agrégalo a `fuentes.json` — con
   `fecha_consulta` real y, si no está cerrado, `estatus: "por_verificar"` **y**
   `nota_conflicto` explicando qué falta.
3. Agrega el trámite a `tramites.json`. El `id` empieza con su jurisdicción.
   Declara siempre `acciones_restringidas`: todo trámite tiene un límite que el
   ORBE no cruza, y omitirlo es la puerta por la que un asistente termina
   "autorizando".
4. `npm run verificar:canon && npm run test:canon`.

Para que además sea **ejecutable** (no solo orientación) hace falta el camino
completo que fija `docs/orbe/canon/v0.1/ORBE_CANON.md` §8: contrato semántico
versionado → registro → descriptor de servicio → policy → adapter → pruebas.
El canon describe la capacidad; no la autoriza.

## 7. Lo que este canon todavía no hace

- **No lo consume la UI.** `shared/canon/resolver.ts` está probado y listo;
  `CitizenApp` sigue sin usarlo. Conectarlo es trabajo aparte y acotado.
- **No amplía Context.OS.** El runtime sigue exigiendo `municipality` en el
  `IntentEnvelope` (`contextos/runtime.ts:70`), así que hoy solo puede
  *ejecutar* trámites municipales. La orientación ya es de los tres órdenes;
  la ejecución no. El rediseño está especificado en
  [`docs/orbe/canon/v0.2/`](../../docs/orbe/canon/v0.2/).
- **No sustituye a la Biblioteca Legal.** La indexa.
- **No verifica nada con las autoridades.** Eso es trabajo humano, y mientras
  no ocurra el canon lo dirá en cada respuesta.
