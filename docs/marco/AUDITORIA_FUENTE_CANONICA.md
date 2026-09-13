# Auditoría de fuente canónica — ¿el ORBE sirve a un municipio o a un ciudadano?

**Fecha:** 2026-09-13 · **Alcance:** repositorio completo · **HEAD auditado:** `d5a78aa`
**Método:** lectura directa del código y de los datos, no de la documentación que los describe.
**Referencias:** `docs/orbe/canon/v0.1/` (línea base congelada), `docs/marco/GLOSARIO_OFICIAL.md`,
`docs/marco/BIBLIOTECA_LEGAL.md`, `docs/fuentes-oficiales-y-alineacion/README.md`.

---

## 1. La pregunta que originó esta auditoría

> «Debemos construir todo como una fuente canónica. El ORBE debe poder ayudar o
> asesorar para cualquier trámite, municipal o estatal. Llevamos dos días
> construyendo; entonces eso está mal.»

La preocupación es correcta y esta auditoría la confirma con evidencia. Pero el
diagnóstico preciso no es el que parecía: **el problema no es que se haya
construido para Tepic. Es que se construyó sin una fuente de verdad, y en
ausencia de una, "municipal" se coló como supuesto por omisión.**

Son dos fallas distintas y solo una es estructural:

| | Falla | Gravedad |
|---|---|---|
| A | No existe una fuente canónica: hay **diez inventarios paralelos** de lo que el ORBE sabe hacer, ninguno autoritativo, y el que más se parecía a un catálogo **no lo leía nadie**. | Estructural |
| B | El único camino de *ejecución* (Context.OS) exige municipio en el tipo del envelope, así que no puede ejecutar un trámite estatal. | Acotada, con corrección especificada |

---

## 2. Hallazgo A · Diez inventarios paralelos, ninguna fuente

Esto es lo que el repositorio consideraba "lo que el ORBE sabe hacer", antes de
esta entrega:

| # | Inventario | Qué declara | ¿Quién lo lee? |
|---|---|---|---|
| 1 | `data/municipality/tepic/services.json` | 8 servicios municipales con `source_status` | **Nadie.** Cero importaciones en todo el repositorio. |
| 2 | `data/municipality/tepic/intents.json` | Expresiones ciudadanas por servicio | **Nadie.** |
| 3 | `contextos/serviceCatalog.ts:6-32` | 1 servicio ejecutable, escrito a mano en TypeScript | El runtime. Es el único que gobierna de verdad. |
| 4 | `shared/semantic/contracts/publicWorksReport.ts` | 1 contrato semántico | La frontera semántica. |
| 5 | `src/components/MunicipalLettersView.tsx:35-65` | 4 plantillas de constancia con `legalBase` escrito a mano | La UI, directo, sin pasar por ningún catálogo. |
| 6 | `docs/marco/modulos/INDICE.json` | 29 módulos de código | Humanos y agentes. |
| 7 | `docs/orbe/modulos.json` | 9 módulos conceptuales | `orbe.html`, `cop.html`, `orbe-3d.html`. |
| 8 | `docs/marco/BIBLIOTECA_LEGAL.md` | Fundamento por materia, con estatus | Humanos. |
| 9 | `docs/presentacion-tepic/02_TRAMITE_PRIORIZADO/FICHA_TECNICA_TRAMITE.md` | 1 trámite con requisitos, costo y plazo | Humanos. |
| 10 | `docs/fuentes-oficiales-y-alineacion/README.md` | El **esquema** de un registro de fuentes (`source_id`, nivel, vigencia, alcance…) | Nadie: el esquema se escribió, los datos nunca. |

La evidencia más dura es la primera fila. `data/municipality/tepic/README.md`
llamaba a su contenido «la primera base de conocimiento estructurada del ORBE»
y listaba como pendiente número 4: «conectar el catálogo al resolvedor de
intención del ORBE». Nunca ocurrió. Durante ese tiempo el runtime resolvía
servicios desde `contextos/serviceCatalog.ts`, con otros ids y otro vocabulario.

**Un catálogo que ningún código lee no es una fuente de verdad: es un PDF con
llaves.** Y es exactamente el problema que el ciudadano sufre afuera —
trescientos portales y miles de PDFs que nadie puede cruzar entre sí —
reproducido dentro del repositorio.

### 2.1 Contradicciones que ya estaban vivas

La auditoría encontró estas discrepancias entre inventarios. Ninguna se
resolvió en silencio; todas quedan registradas:

1. **Acta de nacimiento clasificada como municipal.** `services.json` la
   registraba como `tepic.registro_civil_acta_nacimiento` mientras su propio
   campo `authority` admitía «Autoridad competente por validar». El Registro
   Civil es estatal. Un ciudadano guiado por ese catálogo habría ido al
   ayuntamiento equivocado.
2. **Fundamento de la constancia de residencia.**
   `FICHA_TECNICA_TRAMITE.md` marca 🟢 (verificado) la «Ley Orgánica Municipal
   del Estado de Nayarit»; `BIBLIOTECA_LEGAL.md` no la contiene; y
   `MunicipalLettersView.tsx:438` cita en su lugar la «Ley Municipal para el
   Estado de Nayarit». Tres documentos, tres nombres, uno de ellos afirmado en
   público como verificado. Registrado como `por_verificar` con
   `nota_conflicto` en `data/canon/fuentes.json`.
3. **Cifras de contexto sin fuente en la UI.** `PlatformLanding.tsx:303` habla
   de «2,470 municipios del país» y `ESTRATEGIA_ESTANDAR_ABIERTO.md` de «2,457».
   Es una cifra menor, pero es exactamente el tipo de dato que la regla del
   semáforo obliga a cerrar o etiquetar.
4. Los **dos registros de módulos** (`INDICE.json` y `modulos.json`) no se
   contradicen: miden ejes distintos y ambos lo declaran. No es hallazgo.

---

## 3. Hallazgo B · El candado municipal está en el tipo, no en los datos

El supuesto "municipio" no está esparcido por el código: está concentrado en
seis lugares, y todos cuelgan de una sola decisión de tipo.

| Evidencia | Qué hace |
|---|---|
| `contextos/contracts.ts:8-12` | `Jurisdiction` declara `municipality: string` — **obligatorio**. No existe la noción de orden de gobierno. |
| `contextos/runtime.ts:64-73` | Rechaza con `JURISDICTION_REQUIRED` cualquier envelope sin municipio no vacío. **Aquí muere un trámite estatal**, antes de llegar a la política. |
| `shared/semantic/types.ts:44-48` | El contrato semántico repite la misma forma, con `municipality` obligatorio. |
| `shared/semantic/contracts/publicWorksReport.ts:12` | `{ country: 'MX', state: 'NAY', municipality: 'TEPIC' }`. |
| `contextos/serviceCatalog.ts:42-46` | `jurisdictionCode()` recibe tres partes y siempre exige las tres. |
| `src/orbe/metalinguistics.ts:185` | El envelope copia la jurisdicción del contrato. Correcto — pero hereda el candado. |

Hay un segundo candado, más silencioso, que aparecerá al **segundo** trámite
ejecutable:

- `contextos/policyEngine.ts:4` — `POLICY_VERSION = 'contextos.policy.public-works.v0.2'`.
  Es una constante global, nombrada por un servicio, que `runtime.ts:13` estampa
  en **toda** evidencia, incluida la de envelopes inválidos. Un segundo dominio
  produciría evidencia firmada con la versión de política de obras públicas.
  `ORBE_TAXONOMIA.md` §7 ya advirtió esto: «no debe reutilizar por comodidad la
  policy de obras públicas».
- `src/orbe/metalinguistics.ts:16, 63-67, 162-171` — el tipo `PublicWorksSubject`,
  el `defaultContract()` que resuelve a obras públicas y
  `buildPublicWorksIntentEnvelope()` que lanza si el dominio no es
  `public_works`. La frontera semántica es genérica; su constructor de envelope
  no.

### 3.1 La distinción que ordena el problema

**Orientar no es ejecutar**, y el candado solo afecta a lo segundo:

- **Orientar / asesorar** — explicar qué es el trámite, quién es la autoridad,
  qué fundamento lo sostiene, a dónde ir. Es el 95% de lo que el ciudadano
  necesita y lo que la petición describe. **Aquí no había ningún dato: no había
  candado municipal, había vacío.**
- **Ejecutar** — iniciar un acto con política, consentimiento y evidencia. Solo
  existe para un trámite, en `LAB_MOCK`. Aquí sí hay candado municipal.

Construir la ejecución multi-jurisdiccional antes de tener el catálogo habría
sido generalizar un tubo sin nada que pasarle.

---

## 4. Lo que estaba bien y no se tocó

Auditar es también no destruir lo que ya sostiene. Se verificó y se conserva:

- **`docs/orbe/canon/v0.1/`** — la línea base congelada es correcta, honesta y
  con política de parentesco. Esta entrega la respeta: no la reescribe, la
  extiende en `v0.2`.
- **La separación ORBE ↔ Context.OS.** El Experience Plane no autoriza; la
  política es determinística; ningún LLM decide. Es la parte más disciplinada
  del repositorio y es la que permite que el canon sea posible.
- **Los invariantes del runtime** (`LAB_MOCK`, consentimiento previo,
  `CHECKSUM_ONLY` sin pretender firma, `INFORMATION_REQUEST` nunca ejecuta).
  45 pruebas los defienden y siguen en verde.
- **El registro semántico versionado.** «Al agregar un caso nuevo, agrega un
  contrato — no un `if`» es la regla correcta, y el canon la adopta.
- **La Biblioteca Legal.** Es material serio, con artículos y estatus. El canon
  no la sustituye: la indexa en forma legible por máquina.

---

## 5. Qué se corrigió en esta entrega

Se creó `data/canon/` como **la** fuente canónica, verificada en cada build.

1. **Neutralidad jurisdiccional por construcción.** Un trámite se declara contra
   una jurisdicción del registro (`federal` / `estatal` / `municipal`), nunca
   contra "el municipio" por omisión. El id debe empezar con su jurisdicción y
   el validador lo exige: `mx.nay.registro-civil-acta-nacimiento` no puede
   volver a disfrazarse de municipal.
2. **Migración con corrección de competencia.** Los 8 servicios de
   `services.json` entraron al canon; el acta de nacimiento se reclasificó a
   estatal. Se agregaron 3 trámites que demuestran los tres órdenes sobre una
   misma necesidad ciudadana (fierro municipal → guía estatal → identificador
   federal) y la identidad digital nacional.
3. **El semáforo dejó de ser convención de redacción.** Cada dato operativo
   lleva su propio estatus y el trámite no puede declararse más fuerte que su
   dato más débil. El build falla si alguien lo infla. Consecuencia inmediata y
   deliberada: **ningún trámite está hoy en `verificado`**, porque no hemos
   cerrado con ninguna autoridad un costo, un plazo ni una dependencia.
4. **La regla de citación es ejecutable.** `fundamentoPublicable()` solo devuelve
   fuentes `vigente`. Lo `por_verificar` sirve internamente y no sale a boca del
   asistente.
5. **El canon no puede volverse dato muerto.** La regla C6 del validador falla
   el build en las dos direcciones: si el canon promete una ejecución que el
   código no registra, y si el código tiene un contrato semántico activo que el
   canon no describe. Es la corrección directa del fracaso de `services.json`.
6. **El registro de fuentes existe.** `data/canon/fuentes.json` implementa el
   esquema que `docs/fuentes-oficiales-y-alineacion/README.md` declaraba en
   prosa desde hace meses, con 12 fuentes y sus discrepancias registradas.
7. **Estándar abierto.** `data/canon/schema/canon.schema.json` es el contrato
   publicado: cualquier municipio o estado puede publicar su catálogo con esa
   forma y el ORBE lo entiende sin código nuevo — el candado 2 de
   `ESTRATEGIA_ESTANDAR_ABIERTO.md`, ahora con un artefacto real detrás.
8. **Verificación en CI.** `scripts/verificar-canon.mjs` (8 reglas), R9 de la
   Guardia, paso propio en el workflow y 16 pruebas en
   `shared/canon/__tests__/`.

---

## 6. Lo que queda abierto, en orden

| # | Pendiente | Por qué importa |
|---|---|---|
| 1 | **Conectar `shared/canon/resolver.ts` a la UI ciudadana.** Está probado y sin consumir. | Mientras no se conecte, el ciudadano sigue viendo catálogos escritos a mano en los componentes. |
| 2 | **Context.OS v0.2 — jurisdicción con orden de gobierno.** Especificado en `docs/orbe/canon/v0.2/`. | Sin esto no se puede *ejecutar* un trámite estatal, solo orientarlo. |
| 3 | **Política por servicio.** Separar `POLICY_VERSION` de obras públicas antes del segundo dominio. | La evidencia quedaría firmada con la política equivocada. |
| 4 | **Cerrar fuentes `por_verificar` con las autoridades.** Especialmente el fundamento de la constancia de residencia. | Hoy ningún trámite puede llegar a `verificado`, y así debe seguir hasta que alguien lo verifique de verdad. |
| 5 | **Migrar `MunicipalLettersView.tsx` al canon.** Sus 4 plantillas tienen `legalBase` escrito a mano, fuera de toda verificación. | Es el último inventario paralelo que sigue afirmando fundamento en público. |

---

## 7. El diferenciador, dicho con precisión

La pregunta era: ¿cuál es el diferenciador si el ciudadano ya no tiene que
navegar trescientos portales ni auditar miles de PDFs?

El diferenciador no es la conversación. Cualquiera pone un chat sobre un
portal, y un chat sobre datos que nadie verificó solo automatiza la
desinformación más rápido.

**El diferenciador es que cada respuesta del ORBE es rastreable hasta una
fuente registrada, o el ORBE dice que no lo sabe.** Eso solo es posible
teniendo, al mismo tiempo:

1. **Una fuente canónica, no un portal.** Un solo lugar donde vive quién es la
   autoridad, con qué fundamento y con qué estatus — legible por máquina,
   auditable por cualquiera, verificado en cada build.
2. **Neutralidad jurisdiccional.** El ciudadano no sabe — ni tiene por qué
   saber — si su trámite es municipal, estatal o federal. Eso lo resuelve el
   canon. Un asistente que asume "municipio" reproduce la fragmentación que
   dice combatir.
3. **Honestidad ejecutable.** «No sé el costo todavía» es una respuesta
   correcta; inventarlo es la única falla que destruye el proyecto. El semáforo
   por dato hace que la respuesta honesta sea la única que compila.
4. **La frontera que ya existe.** Orientar es gratis; ejecutar pasa por
   política, consentimiento y evidencia. Ninguna cantidad de conversación
   convierte una en la otra.

Dicho en una línea: **el ORBE no es un buscador de trámites con voz. Es el
registro público de la competencia administrativa, con una conversación
encima.** Lo primero es lo que nadie más tiene y lo que sobrevive a un cambio
de administración; lo segundo es la parte fácil.

---

*Auditoría realizada sobre el código, no sobre la documentación. Cada
afirmación de este documento es verificable en el archivo y la línea citados.*
