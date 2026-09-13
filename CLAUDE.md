# CLAUDE.md

Guía operativa para asistentes de IA que trabajan en este repositorio.
Escrita en español porque el repositorio entero (código, comentarios, commits,
documentación) está en español — mantén ese idioma en todo lo que produzcas.

---

## 1. Qué es este proyecto

**Nayarit Digital · ConnectX · SOATM** (Sistema Operativo de Atención y
Tramitación Municipal) de Tepic, Nayarit: plataforma de gobierno digital
municipal de código abierto. Un solo repositorio contiene tres cosas que
conviven pero no son lo mismo:

1. **La aplicación** (`src/`, `server.ts`) — SPA React + un servidor Express.
2. **Context.OS Runtime** (`contextos/`, `shared/semantic/`) — un plano de
   control institucional experimental, en laboratorio, apagado por defecto.
3. **El marco normativo y documental** (`docs/`) — actas, glosario, biblioteca
   legal, fichas por módulo. **Es parte del producto, no ornamento.**

La tesis central del proyecto (no negociable, aparece en la UI pública): el
SOATM no es una invención — la LNETB federal (Arts. 2, 3, 66–76) y la Ley de
Gobierno Digital de Nayarit ya lo ordenan. Ver
`docs/marco/NOTA_DE_CONTEXTO_PARA_CLAUDE.md`.

---

## 2. Arranque rápido

```bash
nvm use                 # Node 22 (.nvmrc)
npm ci
cp .env.example .env    # llenar llaves; .env nunca se commitea
npm run dev             # tsx server.ts → Express + Vite middleware en :3000
```

**Firebase**: `src/firebase.ts` importa `firebase-applet-config.json`, que está
**gitignorado** (contiene la apiKey real, hallazgo E3 del Acta 006). En un clon
limpio ese archivo no existe, así que `npm run lint` y `vite build` fallan con
`TS2307: Cannot find module '../firebase-applet-config.json'`. **Eso es
esperado, no una regresión que debas "arreglar" tocando `src/firebase.ts`.**
Copia `firebase-applet-config.example.json` y llénalo, o pídeselo al usuario.
`npm test` y la Guardia sí corren sin él.

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Express + Vite en modo middleware) |
| `npm run lint` | `tsc --noEmit` — **solo chequeo de tipos, no hay linter de estilo** |
| `npm test` | Vitest, toda la suite |
| `npm run test:orbe-contextos` | Los 3 archivos que corre CI (runtime + bridge + registry) |
| `npm run test:contextos` | Solo `contextos/__tests__/runtime.test.ts` |
| `npm run test:semantic-registry` | Solo `shared/semantic/__tests__/registry.test.ts` |
| `npm run build` | `vite build` + esbuild bundle de `server.ts` → `dist/server.cjs` |
| `npm run contextos:lab` | Servidor de laboratorio Context.OS en `127.0.0.1:3011` |
| `npm run test:firestore-rules` | Reglas de Firestore contra el emulador (requiere Java 21) |
| `npm run verificar:canon` | Valida `data/canon/` (fuente canónica de trámites) contra su esquema y contra el código |
| `npm run test:canon` | Pruebas del resolvedor del canon (`shared/canon/`) |
| `node scripts/verificar-regresiones.mjs` | **La Guardia** — corre esto antes de entregar (incluye el canon, R9) |

> `npx tsc` instala un paquete distinto y falso. Usa `npm run lint` o
> `./node_modules/.bin/tsc --noEmit`.

### Antes de dar por terminado cualquier cambio

Los tres en verde, sin excepción:

```bash
node scripts/verificar-regresiones.mjs
npm run lint
npx vite build
```

Si tocaste `contextos/`, `shared/semantic/` o `src/orbe/`, añade
`npm run test:orbe-contextos`.

---

## 3. Reglas duras (romperlas es una regresión conocida)

Estas no son preferencias de estilo: cada una corresponde a un incidente real
ya ocurrido, y `scripts/verificar-regresiones.mjs` falla el build si se violan.
Referencia normativa: `docs/marco/PROTOCOLO_SEGURIDAD.md`.

1. **Ninguna llave de API viaja al navegador.** `GEMINI_API_KEY` y
   `STRIPE_SECRET_KEY` viven solo en `server.ts`. Prohibido agregarlas al bloque
   `define` de `vite.config.ts` (inyecta el literal en el bundle público).
   La llave se filtró así **cuatro veces** desde pushes de AI Studio.
2. **Nada bajo `src/` crea un cliente de IA.** Ni `new GoogleGenAI`, ni SDK de
   Anthropic, ni nada equivalente. El navegador llama a `/api/ai/chat` o
   `/api/ai/risk-analysis`.
3. **`src/App.tsx` mantiene `React.lazy` + `Suspense`** para las vistas pesadas.
   Importarlas de forma eager hace que la landing descargue recharts, tesseract
   y jspdf (Performance cae de ~100 a ~70).
4. **No borres archivos de despliegue**: `netlify.toml`, `public/robots.txt`.
5. **`index.html` conserva sus metadatos reales** (`lang="es"`, meta
   description, título institucional — no "My Google AI Studio App").
6. **Sin `@import` de Google Fonts en `src/index.css`** (bloquea ~780ms el
   primer render). Las fuentes se cargan asíncronas desde `index.html`.
7. **`public/` se sirve al mundo.** Solo pueden vivir ahí `robots.txt` y
   `CONNECTX_SYSTEM_PROMPT.md`. Cualquier otro `.md`/`.pdf`/`.docx` queda
   expuesto en producción (ya pasó en julio de 2026). Los documentos internos
   van en `docs/interno/`.
8. **Los montos de pago se validan en el servidor** (`server.ts`, entero
   positivo). El navegador nunca decide cuánto se cobra.
9. **Ningún dato personal real** en el repositorio, ni en semillas de demo, ni
   en actas.
10. **`data/canon/` es la fuente canónica de trámites y servicios.** Un trámite
    que no está ahí no existe para el ORBE — ni para orientar ni para ejecutar.
    Se declara contra una jurisdicción (`federal` / `estatal` / `municipal`),
    **nunca contra "el municipio" por omisión**: el acta de nacimiento es
    estatal, el predial es municipal con fundamento estatal, y un ORBE que
    asume municipio manda al ciudadano a la ventanilla equivocada. Prohibido
    abrir un catálogo paralelo de trámites en un componente, un JSON suelto o
    una tabla de Markdown; ya pasó diez veces (`docs/marco/AUDITORIA_FUENTE_CANONICA.md`).
    R9 de la Guardia falla el build en las dos direcciones: si el canon promete
    una ejecución que el código no registra, y si el código tiene un contrato
    semántico activo que el canon no describe.

### Archivos protegidos

Cambiar cualquiera de estos exige mención explícita en la descripción del PR:
`index.html`, `vite.config.ts`, `netlify.toml`, `public/robots.txt`,
`src/App.tsx`, `server.ts`, `docs/` completo, `data/canon/` completo,
`scripts/verificar-regresiones.mjs`, `scripts/verificar-canon.mjs`,
`.github/workflows/`.

### Honestidad de datos (el "semáforo")

Es la regla cultural más importante del proyecto y se aplica al código de la UI,
no solo a la prosa:

- 🔴 **Se elimina**: nombres de políticos en componentes públicos, promesas
  electorales, cifras sin fuente.
- 🟡 **Se etiqueta**: lo legítimo pero aún no real → `SIMULADO`, `PROYECCIÓN`,
  `META`, banda `DEMO`. **Ninguna cifra simulada sin etiqueta.**
- 🟢 **Se exhibe**: lo verificable (código abierto, ley citada, bitácora).

Las citas legales solo se toman de `docs/marco/BIBLIOTECA_LEGAL.md` y solo si
están en estatus VERIFICADO. Lo "POR VERIFICAR" no se afirma en público.

---

## 4. Arquitectura

### 4.1 Frontend — SPA sin router

`src/App.tsx` (~100 líneas) es todo el ruteo: un `useState<ViewType>` con cinco
vistas. **No hay react-router y es deliberado.**

```
landing   → PlatformLanding      (~350 líneas, única vista eager)
c5        → C5Dashboard          (~1,630 líneas — panel de gobierno)
citizen   → CitizenApp           (~2,130 líneas — app ciudadana) + OrbeContextPilot
dev       → DeveloperChecklist
executive → ExecutiveFolder
```

Enlaces profundos: `?view=c5&modulo=agrovision`, `?view=citizen&tab=services`.
Se leen **una sola vez** al cargar (`getInitialStateFromUrl`). Los usan las
herramientas de `docs/orbe/*.html` para mandar al usuario a la pantalla real.

`C5Dashboard.tsx` y `CitizenApp.tsx` son archivos gigantes que contienen
**decenas de vistas-módulo como funciones internas**. Al editarlos, lee y
edita solo el rango de líneas del módulo (ver §5); nunca hagas una reescritura
amplia que arrastre vistas vecinas.

Estilo: Tailwind 4 vía `@tailwindcss/vite`, tokens en `src/index.css`
(`@theme`), helper `cn()` en `src/lib/utils.ts`. `html { font-size: 20px }` es
intencional (legibilidad en servicios públicos), igual que las utilidades
`.text-legible` / `.high-contrast-card` / `.accessible-focus`.

### 4.2 Backend — `server.ts` (Express, un solo archivo)

Siete endpoints reales; en desarrollo monta Vite como middleware, en producción
sirve `dist/` y hace fallback SPA.

| Ruta | Backing store / servicio |
|---|---|
| `GET/POST/PUT/DELETE /api/departments` | **SQLite** (`better-sqlite3`, `government_data.db`) — no Firestore |
| `POST /api/ai/chat` | Gemini; system prompt desde `public/CONNECTX_SYSTEM_PROMPT.md` |
| `POST /api/ai/risk-analysis` | Gemini con `responseSchema` JSON fijo |
| `POST /api/create-payment-intent` | Stripe |

No hay autenticación servicio-a-servicio en estos endpoints todavía; ver
`docs/plataforma/05-MANUAL-DESARROLLADORES.md`.

### 4.3 Datos — Firebase + SQLite + Supabase (tres almacenes, a propósito)

- **Firestore/Auth/Storage** (`src/firebase.ts`, `firestore.rules`,
  `storage.rules`) — el almacén principal del cliente. Roles `admin`/`editor`/
  `viewer`/`citizen` en la colección `users`, más el caso especial de
  `perfiles_salud`, que autoriza por código de personal (`personal_salud/{codigo}`)
  para permitir registro asistido de gente sin cuenta.
- **SQLite** — solo la tabla `departments` de `server.ts`.
- **Supabase/Postgres** — solo `pulso-nayarit/`, elegido deliberadamente sobre
  Firebase; la justificación está en `pulso-nayarit/ARCHITECTURE.md`.

Servicios con Firestore real: `citasSaludService.ts`, `saludPerfilService.ts`.
Los demás en `src/services/` son en buena parte datos simulados en memoria —
verifica antes de asumir que algo persiste.

### 4.4 Context.OS Runtime (`contextos/` + `shared/semantic/` + `src/orbe/`)

El subsistema más disciplinado del repo, y el que más fácil se rompe. Es un
plano de control institucional en **vertical slice v0.1**: un solo caso de uso
(reporte ciudadano de bache o luminaria en Tepic).

Flujo completo:

```
ciudadano habla
  → src/orbe/metalinguistics.ts     interpreta el acto de habla contra el
                                     contrato semántico (NO con un LLM)
  → src/orbe/contextosBridge.ts     máquina de estados de la conversación
                                     (CONFIRM_ACTION / LOCATION / null)
  → src/services/contextosRuntimeClient.ts   HTTP, valida y da timeout
  → contextos/runtime.ts            IntentEnvelope → Policy → Consent →
                                     Service Catalog → adapter → Evidence
```

Invariantes que las pruebas defienden y que **no debes relajar**:

- Los adapters siempre responden `executionMode: 'LAB_MOCK'`. Nada aquí
  autoriza actos administrativos ni crea órdenes municipales reales.
- La política es **determinística**; ningún LLM decide políticas.
- El consentimiento es obligatorio antes de compartir contacto personal, y
  queda ligado a la solicitud (y al sujeto autenticado, si existe).
- La evidencia lleva checksum SHA-256 y `correlationId`, declarados como
  `integrityAssurance: 'CHECKSUM_ONLY'` — **no** es firma digital ni prueba de
  inmutabilidad, y la documentación no debe insinuar que lo sea.
- Los actos de habla informativos (`INFORMATION_REQUEST`) **nunca** ejecutan.
- Idempotencia en memoria; no sustituye un almacén transaccional.

El puente está **apagado por defecto**: `VITE_CONTEXTOS_BRIDGE_ENABLED=false`.
Con el flag apagado `OrbeContextPilot` devuelve `null` y debe quedarse inerte.

`shared/semantic/` es el registro de contratos semánticos versionados
(`orbe.semantic-registry.v0.1`): sujetos, actos de habla, deixis,
confirmaciones y mensajes al ciudadano viven **en el contrato**, no
hardcodeados en el código de la UI. Al agregar un caso nuevo, agrega un
contrato — no un `if`.

---

## 5. Los registros (no los confundas)

### 5.1 El canon de trámites — `data/canon/`

**Es la fuente canónica**, y es un eje distinto de los dos registros de módulos:
aquellos inventarian *pantallas y código*; el canon inventaria *trámites del
ciudadano*, con jurisdicción, fundamento registrado y semáforo por dato
(`dependencia`, `costo`, `plazo`, `canal_oficial` llevan cada uno su estatus, y
el trámite no puede declararse más fuerte que su dato más débil). Lo verifica
`scripts/verificar-canon.mjs` en cada build. Lee `data/canon/README.md` antes
de tocarlo. El resolvedor tipado vive en `shared/canon/`.

### 5.2 Los dos registros de módulos

El repo tiene **dos** inventarios de "módulos", con vocabularios distintos a
propósito:

| Registro | Cobertura | Eje que mide |
|---|---|---|
| `docs/marco/modulos/INDICE.json` + `docs/marco/modulos/<id>.md` | **29 módulos reales del código** (13 en C5, 16 en CitizenApp), con `archivo` y `lineas` verificados contra `origin/main` | Completitud de código/UI: `real` / `parcial` / `maqueta` / `riesgo` |
| `docs/orbe/modulos.json` + `docs/orbe/modulos/*.md` | **9 módulos conceptuales del Orbe** (visión del ecosistema) | Madurez conceptual: `propuesta` / `disenado` / `en_construccion` / `piloto` / `desplegado` / `produccion` |

Ninguno reemplaza al otro. Si hay contradicción de estado entre ambos,
**señálala al usuario en vez de elegir una en silencio**.

Para editar un módulo concreto existe la skill `.claude/skills/editar-modulo/` —
úsala: localiza el módulo en `INDICE.json`, lee solo su ficha, lee solo su
rango de líneas, y al terminar actualiza la ficha y el índice si cambió el
estado. Un registro solo sirve si se mantiene honesto.

`docs/orbe/` también tiene tres herramientas HTML que leen el mismo grafo:
`orbe.html` (diagrama-espejo), `cop.html` (lienzo de trabajo + generador de
contexto para IA) y `orbe-3d.html` (navegable, enlaza a las pantallas reales).
**Si agregas o cambias un módulo en `modulos.json`, actualiza también
`cop.html` y `orbe-3d.html`** — y nunca inventes un destino que no existe: los
módulos sin código se muestran en gris, sin enlace.

---

## 6. Flujo de trabajo con git

- **Todo cambio entra por rama + PR hacia `main`.** Nunca push directo.
- Ramas: `feat/<módulo>`, `fix/<ámbito>`, `docs/<tema>`, `chore/<tarea>`.
  Sin nombres de personas ni de sesiones de IA.
- Commits: Conventional Commits en español — `fix(oficios): …`,
  `docs(marco): …`, `feat(salud): …`. En trabajo ligado a un PR se usa
  también `fix(#49): …`, `test(#50): …`.
- Antes de editar un módulo, resincroniza:
  `git fetch origin main && git checkout -b <rama> origin/main`.
  `main` avanza rápido y ya se ha pisado trabajo ajeno por no hacerlo.
- Cada PR debe pasar la **Guardia de regresiones**
  (`.github/workflows/guardia-regresiones.yml`: guardia + `tsc` +
  `test:orbe-contextos` + build con verificación de que la cadena `GEMINI` no
  aparece en `dist/assets/`). Netlify corre la Guardia otra vez antes del build
  — protección independiente de GitHub Actions.
- Meta permanente de Lighthouse en el deploy preview: 97+ / 100 / 100 / 100.

### Cuidado con AI Studio

Parte del código llega vía pushes desde Google AI Studio, desde una copia local
que puede estar días atrás de `main`. Es la causa raíz de las cuatro fugas de
llave y de varios borrados de archivos de despliegue. Si ves un cambio que
"simplifica el proyecto" borrando `netlify.toml`, `robots.txt`, `docs/`,
endpoints del servidor o el lazy loading: es una regresión, no una mejora.

---

## 7. Mapa del repositorio

```
/
├── index.html                  Metadatos institucionales + fuentes asíncronas
├── server.ts                   Express: /api/departments, /api/ai/*, Stripe
├── vite.config.ts              define SIN llaves, manualChunks vendor-react
├── netlify.toml                Guardia pre-build, redirect SPA, cabeceras
├── firestore.rules             Roles + perfiles_salud por código de personal
├── storage.rules
├── scripts/
│   ├── verificar-regresiones.mjs   La Guardia (R1–R9)
│   ├── verificar-canon.mjs         Verificador del canon (C1–C8)
│   └── test-firestore-rules.mjs    Pruebas de reglas contra el emulador
├── src/
│   ├── App.tsx                 Ruteo por useState + enlaces profundos
│   ├── firebase.ts             SDK + handleFirestoreError
│   ├── components/             Vistas de plataforma (~35 archivos)
│   │   ├── dashboard/          Sub-vistas del C5
│   │   └── orbe/               OrbeContextPilot, OrbeCitizen
│   ├── hooks/                  useAuraChat, useAuraVoice, useOrbeContextPilot
│   ├── services/               Firestore real + simulaciones + cliente Context.OS
│   ├── orbe/                   metalinguistics.ts, contextosBridge.ts
│   └── lib/utils.ts            cn()
├── contextos/                  Context.OS Runtime v0.1 (servidor, LAB_MOCK)
├── shared/semantic/            Registro de contratos semánticos versionados
├── shared/canon/               Resolvedor tipado del canon (types + resolver)
├── pulso-nayarit/              Módulo con backend propio (Supabase/Postgres)
├── data/canon/                 **Fuente canónica**: jurisdicciones, fuentes,
│                               trámites + JSON Schema publicado
├── demo/                       Demos HTML autocontenidas
└── docs/
    ├── marco/                  Gobernanza pública: glosario, biblioteca legal,
    │                           protocolo de seguridad, actas, fichas de módulo
    ├── plataforma/             Visión de producto y manual de desarrolladores
    ├── orbe/                   Grafo de módulos + herramientas HTML
    ├── agentes/                Gabinete de especialistas, inventario de skills
    ├── actas/                  Registro institucional (no se borran)
    ├── interno/                Material de uso interno — fuera del build público
    └── auditoria-orbe/, expediente-regulatorio/, investigacion/, …
```

---

## 8. Documentos que conviene leer antes de proponer algo grande

En este orden:

1. `docs/marco/GLOSARIO_OFICIAL.md` — vocabulario, etiquetas, regla de citación.
2. `docs/marco/NOTA_DE_CONTEXTO_PARA_CLAUDE.md` — relevo de sesión, principios.
3. `docs/marco/PROTOCOLO_SEGURIDAD.md` — llaves, guardia, incidentes.
4. `docs/marco/GOBERNANZA_REPOSITORIO.md` — flujo de cambios, archivos protegidos.
5. `docs/marco/BIBLIOTECA_LEGAL.md` — base normativa por módulo, con estatus.
6. `docs/plataforma/05-MANUAL-DESARROLLADORES.md` — qué APIs existen hoy.
7. `contextos/README.md` — alcance exacto del runtime y, sobre todo, **lo que
   no hace**.
8. `data/canon/README.md` — la fuente canónica de trámites y sus ocho reglas.
9. `docs/marco/AUDITORIA_FUENTE_CANONICA.md` — por qué existe el canon y qué
   diez inventarios paralelos reemplazó.
10. `docs/orbe/canon/` — la definición canónica del ORBE, versionada. `v0.2`
    fija la neutralidad jurisdiccional.

Las actas de `docs/actas/` son el registro institucional: no se borran, se
corrigen con actas posteriores.

---

## 9. Deuda técnica conocida (no la "descubras" de nuevo)

`docs/AUDITORIA_CODIGO_AGOSTO_2026.md` ya la levantó:

- ~7 componentes huérfanos que compilan y nunca se renderizan (`CitizenOS`,
  `DepartmentManager`, `ErrorBoundary`, `MandoCentral`, `ModularBrain`,
  `TesisCienciaPolitica`, `SovereignMap`). No los borres por tu cuenta:
  algunos tienen CRUD real y el usuario puede quererlos reconectados.
- `ErrorBoundary` existe pero no envuelve nada.
- 15 de los 29 módulos del código están en estado `maqueta` y 2 en `riesgo`.
  Eso es información conocida y etiquetada, no un hallazgo nuevo.
- No hay linter de estilo ni formateador configurado; sigue el estilo del
  archivo que estés tocando.

---

## 10. Cómo comunicarte aquí

Español, directo, con jerga correcta de gobierno digital mexicano. El
interlocutor piensa en hechos, folios y trazabilidad. Si una propuesta no se
sostiene con la ley, el código o la bitácora, no se propone. Cuando pida
"estructura", entrega documentos en `docs/marco/` empujados por PR — no
párrafos en el chat.
