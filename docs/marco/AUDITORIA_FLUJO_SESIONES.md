# AUDITORÍA DEL FLUJO DE SESIONES DE IA
## Por qué el trabajo se produce y no se termina

**Fecha:** 2026-09-13 · **Base auditada:** `d5a78aa` (main) · **Estatus:** vigente
**Instrumento derivado:** `docs/marco/ESTADO.md` + `docs/marco/estado.json` + `scripts/verificar-estado.mjs`

---

## 0. Qué se auditó, y con qué se comprueba

El encargo fue estudiar y cuestionar cómo trabajan las sesiones de IA sobre este
repositorio, para tener una fuente canónica más sólida y poder cerrar lo
pendiente. Se revisaron cuatro cosas: los documentos que dicen ser el contexto de
una sesión, el registro de lo pendiente, la cadena de entrega (rama → PR → CI →
deploy) y la coherencia de los dos registros de módulos.

Todo lo que sigue es reproducible. Cada afirmación cita el archivo, el comando o
el número de PR que la sostiene, según la regla de anclaje al código del
`PARLAMENTO_PROMPT.md` §3.2.

> **La conclusión, en una frase:** este repositorio no tiene un problema de falta
> de canon. Tiene un problema de **integración**. Produce canon más rápido de lo
> que consigue fusionarlo, porque la compuerta que decide qué entra a `main`
> lleva un mes sin poder ponerse en verde.

---

## 1. El hallazgo principal: la compuerta está rota, no sobrecargada

`CLAUDE.md` §6 exige que toda PR pase la Guardia de regresiones. `netlify.toml`
la corre otra vez antes del build como protección independiente. Es un buen
diseño. Hoy ninguna de las dos puede pasar.

### 1.1 · Bloqueo mecánico: la Guardia no puede terminar en verde en un clon limpio

El workflow ejecuta `npm run lint` y `npx vite build`. Ambos importan, por vía de
`src/firebase.ts:5`, un archivo que no está en git:

```
src/firebase.ts:5:import firebaseConfig from '../firebase-applet-config.json';
```

```
.gitignore:
# Firebase config contiene apiKey real — NO commitear (hallazgo E3 Acta 006)
firebase-applet-config.json
```

El ignore entró el **2026-08-13** en `c6dbb03` («correcciones críticas de
seguridad y falsedad documental»). Desde ese día, en cualquier checkout limpio:

```
$ ./node_modules/.bin/tsc --noEmit
src/firebase.ts(5,28): error TS2307: Cannot find module '../firebase-applet-config.json'

$ npx vite build
✗ Build failed in 3.06s
error during build: Could not resolve "../firebase-applet-config.json" from "src/firebase.ts"
```

`.github/workflows/guardia-regresiones.yml` no materializa ese archivo en ningún
paso. El resultado no es un fallo intermitente: es una compuerta que **no puede**
abrirse, por construcción, desde hace un mes.

`CLAUDE.md` §2 ya documenta este comportamiento y advierte, con razón, que no se
«arregle» tocando `src/firebase.ts`. La advertencia es correcta y aquí se
respeta: **el arreglo va en el workflow**, que es donde está el hueco.

Comprobado que la corrección funciona: copiando
`firebase-applet-config.example.json` al nombre esperado, `tsc --noEmit` sale 0 y
`vite build` compila 2 208 módulos, con el bundle limpio — la cadena `GEMINI` no
aparece en `dist/assets/`. Los valores del ejemplo son marcadores (`TU_API_KEY_ROTADA`),
así que en CI no viaja ninguna credencial real.

### 1.2 · Bloqueo apilado: los jobs de Actions no llegan a ejecutar sus pasos

Detrás del anterior hay un segundo fallo, independiente y anterior en la cadena.
Las 30 corridas más recientes del workflow «Guardia de regresiones» —del 10 de
septiembre hacia atrás— terminan en `failure`, **incluidas tres sobre `main`**,
una de ellas lanzada a mano con `workflow_dispatch`.

Lo revelador no es que fallen, sino cómo:

| Corrida | Rama | Duración | Logs |
|---|---|---|---|
| #156 (10-sep) | `premio-innovacion-2026-agentic-rebuild` | 3 s | 404 |
| #146 (6-sep, dispatch) | `main` | 5 s | 404 |
| #141 (5-sep) | `codex/orbe-advisor-core-v0.1` | 4 s | 404 |
| #139 (4-sep) | `main` | 5 s | 404 |

Un job que llegara siquiera a `npm ci` tardaría decenas de segundos y dejaría
registro. Estos se completan en 3–5 segundos y no producen logs descargables ni
siquiera para corridas de hace tres días. El patrón corresponde a un runner que
nunca ejecuta sus pasos: límite de gasto de Actions agotado, Actions restringido
por política de la cuenta, o el runner no disponible.

**Esto no es diagnosticable desde el repositorio** y no lo arregla ningún commit.
Requiere que el director mire Settings → Actions y la facturación de Actions.
Es la comprobación de mayor rendimiento disponible hoy: sin ella, el arreglo de
§1.1 queda correcto pero invisible.

### 1.3 · Consecuencia: Netlify lleva rojo desde mediados de agosto

`netlify.toml` compila con
`node scripts/verificar-regresiones.mjs && npm run test:orbe-p0-e2e && npm run build`.
De esos tres tramos, **dos están rotos en `main`**. En el PR #46 (18-ago) los
tres checks de Netlify están en `failure`; en el #60 (1-sep) siguen en `failure`.

El tramo final es el mismo `vite build` que §1.1 rompe. Pero el tramo de en medio
falla antes, y se comprobó ejecutándolo sobre `d5a78aa`:

| # | Caso | Resultado |
|---:|---|---|
| 1–7 | Solicitud completa, aseveración, pregunta informativa, ubicación ausente, ambigüedad, binding incompatible, idempotencia | PASS |
| 8 | **Runtime caído** — ORBE no debe afirmar ejecución | **FAIL:** `'RUNTIME' !== 'ERROR'` |

Es decir: con Context.OS caído, ORBE afirma haber ejecutado. Ese es exactamente
el invariante que el caso 8 vigila, y es el que `contextos/README.md` promete.

Y hay un segundo efecto peor que el fallo: **la suite no termina**. Tras imprimir
el reporte, el proceso sigue vivo; el `labServer` queda huérfano y hay que
matarlo a mano. Dos corridas consecutivas acabaron en `exit 143` por agotar el
temporizador, dejando procesos `contextos/labServer.ts` escuchando después del
final. Un comando de build que se cuelga no falla rápido: consume la ventana
entera del deploy.

El PR #63 (6-sep) corrige precisamente esto —`stopLabServer()` mataba el proceso
`npx` y no el proceso `node` que escucha el puerto— y lleva siete días abierto
con CI en rojo. La corrección existe; no está en `main`.

De ahí una pregunta que solo el director puede responder y que conviene responder
pronto: **si ningún deploy compila desde mediados de agosto, ¿qué está sirviendo
hoy `tepic.netlify.app`?** Lo más probable es un build anterior al 13-ago. Y
mientras el preview no compile, la meta permanente de Lighthouse (97+/100/100/100)
no se está midiendo: es una meta sin instrumento.

### 1.4 · El resultado acumulado: 15 PRs abiertas

| PR | Título | Abierta desde | Días |
|---|---|---|---|
| #34 | Obras Nayarit: monitoreo cívico de obra pública | 27-jul | 48 |
| #46 | Orbe municipal lab v01 | 18-ago | 26 |
| #47 | **Governance Digital source of truth v0.1** (borrador) | 19-ago | 25 |
| #52 | Mapa de gobierno para los 26 repositorios (borrador) | 20-ago | 24 |
| #53 | Runtime federado para reportes de alumbrado (borrador) | 21-ago | 23 |
| #54 | Auditoría de coherencia: 29 módulos + LNETB | 25-ago | 19 |
| #56 | Propuesta «El Orbe Auditor» | 29-ago | 15 |
| #58 | CodeLens v0.1 como compuerta de calidad | 29-ago | 15 |
| #59 | Provider portability para Evidence Auditor (borrador) | 31-ago | 13 |
| #60 | **Constitución de arquitectura v0.1** | 1-sep | 12 |
| #62 | Contraauditoría del asesor ciudadano (borrador) | 5-sep | 8 |
| #63 | Degradación segura cuando Context.OS está caído | 6-sep | 7 |
| #64 | Identity Gateway + Institutional Graph (borrador) | 8-sep | 5 |
| #65 | Banco de pruebas del orbe flotante | 9-sep | 4 |
| #66 | Nayarit Digital NEXT — Premio 2026 (borrador) | 10-sep | 3 |

Quince PRs, seis en borrador, la más antigua de hace 48 días. No es desorden: es
el resultado aritmético de una compuerta que no abre. El trabajo se hace, se
empuja y se queda ahí.

---

## 2. Siete documentos compiten por ser el contexto de una sesión

Cualquier sesión que arranque hoy puede tomar su contexto de siete sitios
distintos, y no hay forma de saber cuál manda leyéndolos:

| Documento | Último cambio | Se presenta como | Realidad |
|---|---|---|---|
| `CLAUDE.md` | 26-ago | Guía operativa para asistentes de IA | 🟢 Vigente y bien hecho |
| `docs/orbe/canon/v0.1/` | 3-sep | Canon congelado del Orbe | 🟢 Congelado a propósito, con hashes |
| `docs/marco/NOTA_DE_CONTEXTO_PARA_CLAUDE.md` | 31-jul | «Relevo de sesión · Estatus: **vigente**» | 🟡 44 días sin tocar; su §3 describe un `main` que ya no existe |
| `docs/PARLAMENTO_PROMPT.md` | 30-jul | «Prompt Maestro» de la cámara de decisión | 🟡 45 días; no declara vigencia |
| `docs/agentes/GABINETE_ESPECIALISTAS.md` | 30-jul | Cámara de trabajo, 15 especialistas | 🟡 45 días |
| `public/CONNECTX_SYSTEM_PROMPT.md` | 14-jul | System prompt del chat en producción | 🟡 61 días, y se sirve al público |
| `docs/interno/CONTEXTO_MASTER_CLAUDE.md` | 12-jul | «CONTEXTO MAESTRO Y SYSTEM PROMPT PARA CLAUDE» | 🔴 Ver §3 |

Dos están al día. Cinco llevan entre 44 y 63 días sin tocarse y **ninguno lo
declara**. El peor caso es el que más explícitamente se ofrece como punto de
partida: la nota de relevo lleva seis semanas diciendo «Estatus: vigente», y su
lista de pendientes describe un repositorio anterior a Context.OS, al registro
semántico, al canon del Orbe y a P0.

Esto es precisamente lo que rompe la promesa de la skill `editar-modulo`: «el
usuario no debería tener que re-explicar en cada sesión». Con siete fuentes y
ninguna fechada como caduca, re-explicar sigue siendo más barato que confiar.

---

## 3. El documento que contradice las reglas del propio repositorio

`docs/interno/CONTEXTO_MASTER_CLAUDE.md` merece párrafo aparte porque no es solo
viejo: está **en contra** de lo que `CLAUDE.md` ordena, y pide ser usado como
arranque de sesión. Su segunda línea es literal:

> «Copia y pega todo el texto a continuación en tu primer mensaje con Claude o
> ChatGPT para alinear la inteligencia artificial con todo el contexto
> estratégico, técnico y político de inmediato.»

Y lo que se copiaría enmarca la plataforma como herramienta de consolidación
política de una candidatura, con nombre propio, seguidores y fases de
«acercamiento» y «quick win». Eso es exactamente lo que el semáforo de
`CLAUDE.md` §3 clasifica en 🔴 —nombres de políticos, promesas, cifras sin
fuente— y lo contrario del principio «branding institucional, nunca personal».

Que esté en `docs/interno/` es correcto y la Guardia R8 impide que vuelva a
`public/`. El problema no es dónde vive: es que **se describe a sí mismo como el
prompt de arranque**. Una sesión que lo obedezca queda alineada contra las
reglas del repositorio desde su primer mensaje, y con la voz institucional
equivocada.

La decisión es del director (`PARLAMENTO_PROMPT.md` Regla 4). Esta entrega se
limita a marcarlo como antecedente histórico, sin retirar contenido.

### 3.1 · Y el mismo problema, pero en producción

El caso anterior es interno: hace daño si alguien lo copia. Hay uno peor, porque
ya está sirviendo al público.

`server.ts:58` carga `public/CONNECTX_SYSTEM_PROMPT.md` como system prompt de
`/api/ai/chat`. Es literalmente la voz con la que el asistente le habla hoy a un
ciudadano de Tepic. Su segunda sección se titula:

> `## ARQUITECTURA DE COMUNICACIÓN (NLP & ASERCIÓN)`
> — «**Lenguaje de Conquista**», «**Psicología del Usuario**: […] El cambio no es
> una opción», «**Anclaje de Valor**: […] el escudo del trabajador contra la
> obsolescencia».

Y más abajo el propio archivo se refiere a «el tono **comercial** de este
documento», y define a Aura como «Arquitecto de Casos de Éxito **Comerciales**».

El semáforo clasifica «PNL/manipulación» en 🔴 —*se elimina*— y `CLAUDE.md` §3
exige branding institucional. Un municipio no le aplica técnicas de persuasión a
sus propios vecinos para que acepten un trámite: eso es exactamente el reproche
que el proyecto le hace a los demás.

Lo llamativo es la fecha: el archivo no se toca desde el **14 de julio**, un mes
antes de la purga del 13 de agosto (`c6dbb03`, «correcciones críticas de
seguridad y falsedad documental») que retiró esa categoría del resto del
repositorio. **La purga no llegó hasta `public/`.** Se limpió la documentación y
se dejó encendido el prompt.

Los dos últimos bloques del archivo —contexto de página y formato apto para
voz— están bien hechos y deben conservarse: son los que hacen que el asistente
responda a la pantalla real y que la síntesis de voz suene natural.

Reescribir la voz del asistente ciudadano es una decisión de producto del
propietario, no de una sesión de trabajo. Esta auditoría la registra
(`PROMPT-01`) y **no modifica el archivo**.

---

## 4. Ya hubo dos intentos de fuente canónica; ninguno se resolvió

Antes de proponer nada conviene decirlo con claridad: **este no es el primer
intento**.

- **PR #47**, «Governance Digital source of truth v0.1» (19-ago, borrador).
  1 170 líneas en `docs/source-of-truth/`: constitución, contexto maestro,
  arquitectura, registro de ADR y matriz de realidad. CI en rojo. Sin movimiento
  desde el día que se abrió.
- **PR #60**, «Constitución de arquitectura v0.1» (1-sep). 415 líneas en
  `docs/marco/`, con la regla canónica «Context.OS autoriza. ConnectX conecta.
  Evidence.OS prueba. CodeLens verifica. ORBE acompaña. El humano decide.»
  CI en rojo.

Las dos son buenas piezas y las dos están donde está todo lo demás: esperando
una compuerta que no abre. **Escribir ahora un tercer canon de mil líneas sería
repetir el patrón que esta auditoría describe.**

Por eso esta entrega no lo hace. Añade lo único que a los dos intentos les
faltaba, que es también lo que impide cerrar pendientes: un **registro de estado
que no puede caducar en silencio**.

---

## 5. Los dos registros de módulos: sanos, con dos contradicciones que hay que declarar

Hallazgo honesto y en contra de lo que esta auditoría esperaba encontrar: el
inventario de código **está bien mantenido**. `docs/marco/modulos/INDICE.json`
declara estar verificado contra `f6536a6` (22-jul). Desde entonces `main` avanzó
161 commits y los dos archivos indexados cambiaron. Aun así, comprobando los 29
módulos uno por uno, **28 rangos siguen apuntando al componente correcto**. El
único desfase es `municipal_letters`: declara `1-759` y el archivo tiene 760
líneas. Eso es un registro cuidado, no uno abandonado.

Lo que sí hay que declarar, porque `CLAUDE.md` §5 lo ordena expresamente
—«si hay contradicción de estado entre ambos, señálala al usuario en vez de
elegir una en silencio»— son dos choques entre los registros:

| Módulo | `docs/orbe/modulos.json` | `docs/marco/modulos/INDICE.json` | Lectura |
|---|---|---|---|
| `tepictu-salud` | `disenado` (no construido) | `salud` → `real`, con Firestore detrás | El registro conceptual va **por detrás** del código: hay servicios reales (`citasSaludService.ts`, `saludPerfilService.ts`) que el Orbe todavía describe como diseño |
| `pulso-nayarit` | `desplegado` (el estado más alto) | sin entrada | Existe `pulso-nayarit/` con backend propio en Supabase, pero «desplegado» es una afirmación pública que necesita URL y fecha para sostenerse |

Los otros siete módulos del Orbe son coherentes con el código. No son la misma
escala y no tienen por qué coincidir —`INDICE.json` mide completitud de código y
el Orbe mide madurez conceptual—, pero `disenado` frente a `real` y `desplegado`
frente a inexistente sí son contradicciones, no diferencias de vocabulario.

---

## 6. Deriva de convención: los commits se fueron al inglés

`CLAUDE.md` §6 fija Conventional Commits **en español**. Los 27 commits del
bloque ORBE P0 v0.2 (3 y 4 de septiembre) están en inglés:

```
ci(orbe): gate Netlify deploy on P0 E2E suite
docs(orbe): freeze canon baseline v0.1
chore(orbe): mark canon v0.1 frozen
```

No es un detalle estético en un repositorio cuyo argumento público es la
trazabilidad institucional en español. Y es posterior al merge de `CLAUDE.md` en
`main`, así que no es desconocimiento de la regla sino deriva de la práctica.

El historial no se reescribe. Se corrige hacia adelante.

---

## 7. Lo que esta entrega cambia, y lo que deja al director

### Cambia (en esta PR)

1. **`docs/marco/ESTADO.md` + `docs/marco/estado.json`** — la fuente canónica del
   trabajo pendiente. Quince entradas con id estable, prioridad, evidencia
   citada, dependencias y quién decide cada una. Corta a propósito: es el estado,
   no la doctrina.
2. **`scripts/verificar-estado.mjs`** — siete comprobaciones (E1–E7) que fallan
   el build si el registro caduca, si una evidencia citada no existe, si una
   dependencia apunta a una entrada inexistente o si la prosa y los datos
   divergen. Es a `estado.json` lo que la Guardia es al bundle.
3. **`.github/workflows/guardia-regresiones.yml`** y **`netlify.toml`** —
   materializan la config de Firebase antes de `lint` y `build`, y el workflow
   corre además el verificador de estado. Corrige CI-01 sin tocar
   `src/firebase.ts`. En Netlify la vía es la variable `FIREBASE_APPLET_CONFIG`
   con el JSON completo: si falta, el build lo dice en vez de morir con un
   «Could not resolve» opaco.

   **Honestidad sobre el alcance:** este cambio, por sí solo, no pone la Guardia
   en verde. Quedan dos cosas delante: el runner no arranca (CI-02, del director)
   y el paso de la suite E2E sigue fallando en `main` hasta que se fusione el
   PR #63 (PR-02). Los tres son independientes y hay que resolver los tres.
   Portar aquí el arreglo del #63 habría sido pisar trabajo ajeno, que es
   justamente lo que `CLAUDE.md` §6 advierte.
4. **`CLAUDE.md`** — señala `ESTADO.md` como segunda lectura obligatoria y añade
   el verificador a la lista de compuertas.
5. **Bandera de vigencia** en cuatro documentos de contexto caducados
   (`NOTA_DE_CONTEXTO_PARA_CLAUDE.md`, `PARLAMENTO_PROMPT.md`,
   `GABINETE_ESPECIALISTAS.md`, `CONTEXTO_MASTER_CLAUDE.md` y el
   `Parlamento.MD` de la raíz): dicen desde cuándo no se tocan y a dónde ir por
   el estado actual. No se retira contenido ni se borra ningún acta.

**Lo que deliberadamente no se toca:** `public/CONNECTX_SYSTEM_PROMPT.md`. Es el
system prompt que `server.ts` carga en caliente; cualquier línea añadida ahí
—incluida una bandera de vigencia— entra en el contexto del modelo y cambia lo
que el asistente le responde a un ciudadano. Queda registrado en `PROMPT-01` y
esperando decisión.

### Queda al director (`PARLAMENTO_PROMPT.md` Regla 4: el humano decide)

| Decisión | Entrada | Por qué no la toma una sesión |
|---|---|---|
| Revisar Settings → Actions y facturación | CI-02 | No es diagnosticable ni corregible desde el repositorio |
| Confirmar qué está sirviendo hoy el sitio publicado | CI-03 | Requiere acceso a Netlify |
| Triaje de las 15 PRs: fusionar, rebasar o cerrar | PR-01 | Cerrar trabajo ajeno es irreversible y no es decisión de una sesión |
| Qué pasa con PR #47 y PR #60 | CANON-03 | Precede a cualquier canon nuevo |
| Qué pasa con `CONTEXTO_MASTER_CLAUDE.md` | CANON-02 | Es contenido del propietario, no deuda técnica |
| Reescribir la voz de Aura en `public/CONNECTX_SYSTEM_PROMPT.md` | PROMPT-01 | Cambia lo que el asistente le responde hoy a un ciudadano |
| Nombres reales en el módulo Gabinete | PUB-01 | Bloquea abrir el repositorio desde el 13-jul |
| Resolver `tepictu-salud` y `pulso-nayarit` | MOD-01 | Afirmaciones públicas de estado |
| Confirmar los pendientes manuales del 1-ago | DIR-01 | Solo el director sabe si se ejecutaron |

---

## 8. El orden en que conviene hacerlo

Está en este orden porque cada paso desbloquea al siguiente, no por importancia:

1. **CI-02** — mirar Actions. Sin runner, nada de lo demás se puede comprobar.
2. **CI-01** — fusionar esta PR. La compuerta ya puede abrir.
3. **PR-02** — fusionar el PR #63, que arregla la suite E2E que `netlify.toml`
   exige antes de compilar.
4. **CI-03** — con 1–3 hechos, el deploy vuelve a compilar y Lighthouse vuelve a
   medirse.
5. **PR-01 y CANON-03** — con la compuerta abierta, el triaje de las 15 PRs deja
   de ser teórico: las que pasen en verde se fusionan.
6. **ORBE-01** — las cinco verificaciones de P0 ya son ejecutables.
7. El resto (MOD-01, PUB-01, DIR-01, MOD-02, GIT-01) según decida el director.

---

## 9. Lo que esta auditoría comprobó que está sano

Contra la tentación de que toda auditoría encuentre todo mal, esto pasó en verde
sobre `d5a78aa`:

```
$ node scripts/verificar-regresiones.mjs
✔ Guardia de regresiones: todo en orden.

$ npm run test:orbe-contextos
Test Files  3 passed (3)
     Tests  45 passed (45)

$ ./node_modules/.bin/tsc --noEmit        # con la config de Firebase presente
(sin errores)

$ npx vite build
✓ 2208 modules transformed · ✓ built in 13.29s
$ grep -rl "GEMINI" dist/assets/ → sin coincidencias
```

Las reglas duras se respetan, el code-splitting sigue en pie, la llave no viaja
al cliente y `public/` solo contiene lo permitido. El problema de este
repositorio nunca fue la calidad del trabajo. Fue que el trabajo no llega a
`main`.

---

*Auditoría registrada según `docs/marco/GOBERNANZA_REPOSITORIO.md`. Entra por
rama y PR. El estado vivo derivado de este documento se mantiene en
`docs/marco/ESTADO.md`; esta auditoría es la foto del 13 de septiembre de 2026 y
no se actualiza: se corrige con auditorías posteriores.*
