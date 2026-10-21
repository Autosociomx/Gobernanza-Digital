# Prompt de construcción — Pantalla de inicio ciudadana con ORBE flotante (v0.2)

Destino: Google AI Studio (modo "Build").
**Derivado** de [`HOME_CIUDADANA_v0.1.md`](./HOME_CIUDADANA_v0.1.md). No es fuente de verdad:
si este texto y la especificación difieren, manda la especificación y este archivo se regenera.

**Estado:** borrador derivado, sujeto a D-01 (canal de orientación), D-02 (escala
tipográfica) y D-04 (toque simple) de la especificación. Si alguna se resuelve distinto,
cambian las secciones 5 y 8 de la Parte A.

## Cómo usar este documento

- **Parte A** se pega completa en el cuadro de instrucciones de Build.
- **Parte B** es la instrucción de sistema del agente de orientación (la Parte A ya ordena incluirla en el servidor).
- **Parte C** es la lista de comprobación del prototipo.
- Al final hay un glosario.

## Qué cambió respecto al prompt original (v0.1)

| # | Cambio | Motivo (ID en la especificación) |
|---|---|---|
| 1 | La ruta del servidor es `POST /api/ai/chat` con `{ message, context, surface }` y devuelve `{ response, servicio_id }` (antes `/api/orbe/chat`, `{ texto, servicio_id }`) | R-01, D-01 |
| 2 | El catálogo usa el esquema del repo (`data/municipality/tepic/services.json`, claves en inglés), no `data/servicios.json` en español; se añaden `citizen_description`, `official_url`, `consulted_at` | R-05, §6 |
| 3 | La Parte B se redacta para **Aura** (capacidad de orientación dentro de ORBE), declara que es inteligencia artificial y **no crea reportes ni solicitudes** | R-02, R-04 |
| 4 | El servidor elimina cualquier URL del texto del modelo; el enlace sale solo del catálogo | §2.3 |
| 5 | La leyenda lista los **cuatro** estados; cada acceso del carrusel lleva etiqueta de estado | DEF-02, DEF-04 |
| 6 | El texto de ejemplo ya no promete un enlace que no existe | DEF-03 |
| 7 | Token de borde de control `#6F8A85` (≥ 3:1) y relleno inferior para que el botón flotante no tape contenido | DEF-01, DEF-05 |
| 8 | El flujo de reporte de bache **no se simula** en el prototipo: en el repo lo atiende el puente ORBE → Context.OS en `LAB_MOCK` | R-04 |
| 9 | Toque simple en reposo: no arranca el micrófono, muestra la ayuda | D-04 |
| 10 | El permiso de micrófono en `metadata.json` queda declarado **solo para el prototipo de AI Studio**; en el repo, la voz en producción depende de `netlify.toml` (`microphone=()` la bloquea hoy) | R-09 |

## Reglas de exportación (para quien sube el resultado al repo)

El build de AI Studio es un **prototipo de referencia**. Los pushes desde AI Studio
causaron cuatro fugas de llave y varios borrados de archivos de despliegue
(`CLAUDE.md` §6). Por eso:

- Nunca push directo a `main`: rama + PR, y resincronizar antes
  (`git fetch origin main && git checkout -b <rama> origin/main`).
- No traer `server.ts`, `vite.config.ts`, `index.html`, `netlify.toml`, `public/robots.txt`
  ni `package.json` del build: son archivos protegidos y los del repo mandan.
- Traer solo los componentes de interfaz y adaptarlos a las etapas E1–E6 de la
  especificación (§13).
- Antes de entregar: `node scripts/verificar-regresiones.mjs`, `npm run lint`, `npx vite build`.

---

# PARTE A — PROMPT DE CONSTRUCCIÓN (pegar en AI Studio)

## 1. Rol y objetivo

Usted es un ingeniero de producto senior. Construya la **pantalla de inicio ciudadana** de "Nayarit Digital", un prototipo de gobierno digital para el municipio de Tepic, Nayarit, México.

El objetivo de la pantalla: que una persona exprese lo que necesita (reportar un bache, pagar el predial, tramitar una constancia, orientarse sobre apoyos o salud) y sea **guiada al trámite o servicio correcto, con el enlace oficial correspondiente cuando exista uno verificado**. ORBE, la guía ciudadana, hace esa orientación por voz o por texto; internamente la respuesta conversacional la genera un modelo de inteligencia artificial llamado Aura.

La estructura visual toma como inspiración organizativa una aplicación móvil con accesos rápidos, una tarjeta destacada, un buscador, categorías y tarjetas. **No copie nada del contenido, la estética ni los textos de aplicaciones de apuestas.** Solo se toma la idea de organización: accesos rápidos arriba, un bloque destacado, búsqueda, categorías, tarjetas y barra inferior.

Este es un **prototipo en evaluación**. No es un sistema oficial del Gobierno de Nayarit ni del Ayuntamiento de Tepic. Debe decirlo de forma visible y permanente en la pantalla.

## 2. Reglas de verdad (no negociables)

1. **No invente** requisitos, costos, plazos, dependencias, autoridades, fechas, convocatorias, números telefónicos ni enlaces. Si un dato no está en el catálogo (sección 6), la aplicación y ORBE deben decir que aún no está verificado.
2. Cada servicio lleva un estado de fuente, con estas cuatro etiquetas y ninguna otra:
   - `verificado`: respaldado por una fuente oficial vigente, con enlace, autoridad emisora y fecha de consulta.
   - `por_verificar`: dato plausible, sin cierre de fuente oficial vigente.
   - `demo`: funcionalidad demostrativa sin efectos jurídicos.
   - `propuesto`: capacidad futura, aún no disponible.
   En pantalla se muestran como "Verificado", "Por verificar", "Demo" y "En diseño".
3. Solo se muestran como enlace direcciones `https` cuyo dominio termine en `.gob.mx` y que usted reciba de la persona usuaria en el catálogo. **Nunca genere ni adivine una dirección web.** El enlace de una tarjeta sale **siempre del catálogo**, nunca del texto del modelo. Mientras `official_url` sea `null`, el botón de la tarjeta muestra "Enlace oficial pendiente de verificación" y no navega a ninguna parte.
4. Las fuentes aceptadas son páginas oficiales de gobierno. No se usan notas periodísticas como fuente.
5. ORBE puede **informar, orientar, explicar y navegar**. No ejecuta pagos, no emite documentos, no firma, no aprueba ni sanciona, y **no crea reportes ni solicitudes**. Este prototipo no tiene capa de autoridad: si la persona pide registrar un reporte, la aplicación explica que esa función no está disponible en este prototipo. No simule folios, acuses, montos ni resultados que puedan confundirse con reales.
6. En salud, ORBE **orienta, no diagnostica**. Ante signos de alarma indica llamar al **911** (número de emergencias de México). No cite otros números.

## 3. Reglas de seguridad (no negociables)

1. **Ninguna llave de API viaja al navegador.** La llave de Gemini (`GEMINI_API_KEY`) vive solo en el servidor. Genere una aplicación de pila completa (full-stack): un servidor Express (servidor web de Node.js) con una ruta `POST /api/ai/chat` que recibe el mensaje y devuelve la respuesta. El navegador nunca importa `@google/genai` ni crea un cliente de IA. Está prohibido agregar la llave a la configuración `define` de Vite (esa configuración incrusta el valor literal en el código público).
2. **Ningún dato personal real** en el código, en datos de ejemplo ni en textos. ORBE **nunca pide** CURP (Clave Única de Registro de Población), INE (credencial para votar), domicilio, teléfono ni datos bancarios. Si la persona los escribe, ORBE le indica que no los comparta por el chat.
3. Los montos de pago, si algún día existieran, se validan en el servidor. En este prototipo **no hay pagos reales ni simulados**: la barra inferior "Pagos" solo muestra tarjetas informativas con la etiqueta "Demo".
4. Solo en este prototipo de AI Studio: en `metadata.json` declare el permiso de micrófono, `"requestFramePermissions": ["microphone"]` (agregue `"geolocation"` solo si se usa ubicación). Sin él, la vista previa bloquea el micrófono.
5. Mantenga `index.html` con `lang="es"`, un título institucional y una descripción reales.
6. Cargue las fuentes tipográficas desde `index.html` de forma asíncrona (`<link rel="stylesheet" media="print" onload="this.media='all'">`), no con `@import` en el CSS.

## 4. Tecnología

React 19 + TypeScript, Vite, Tailwind CSS, iconos de `lucide-react`. Servidor Express en `server.ts`. Diseño móvil primero (ancho de referencia 390 px; sin desplazamiento horizontal a 360 px; máximo 430 px de contenido centrado en pantallas grandes). Sin librerías de apuestas, sin imágenes de casino. Defina los tamaños de texto en `rem` (1 rem = 16 px en este prototipo).

## 5. Diseño

**Tipografía:** Public Sans (pesos 400, 500, 600, 700). Texto mínimo de 12 px; campos de entrada de 16 px (evita el acercamiento automático en iPhone).

**Colores** (el texto cumple contraste 4.5:1; razones calculadas):
- Fondo de página `#F3F6F5`; tarjetas `#FFFFFF`.
- Borde decorativo de tarjeta `#D5E0DD` (solo en tarjetas que no son controles).
- **Borde de controles** (buscador, filtros inactivos, campos de texto) `#6F8A85`: cumple 3:1 contra `#FFFFFF` y `#F3F6F5`.
- Verde institucional `#0B5D5B` (botones, ORBE, selección); sobre él, texto `#FFFFFF` (7,69:1).
- Texto principal `#12302C`; secundario `#34504B`; terciario `#4A625E`.
- Etiqueta "Por verificar": fondo `#FFF1D6`, texto `#6B4200`.
- Etiqueta neutra ("En diseño"): fondo `#E4EAE8`, texto `#34504B`.

**Reglas:** objetivos táctiles de al menos 44 × 44 px; botones reales (`<button>`, `<a href>`), nunca `div` con clic; todo icono sin texto lleva `aria-label`; respete `prefers-reduced-motion` (preferencia del sistema para reducir animaciones); foco visible en todo control; sin emojis; sin degradados decorativos; sin barras de estado simuladas. El contenedor de desplazamiento lleva relleno inferior de al menos 172 px más el área segura, para que el botón flotante nunca cubra el último bloque.

**Orden de la pantalla (de arriba hacia abajo):**
1. Encabezado: "NAYARIT DIGITAL" (pequeño), título "¿Qué necesita hoy?", y a la derecha botones de avisos y perfil. El botón de avisos no muestra avisos de ejemplo: si no hay fuente verificada, muestra el estado vacío "Sin avisos oficiales".
2. Buscador "Buscar trámite o servicio" (busca en el catálogo; sin resultados muestra "No encontré ese trámite. Pregunte a ORBE.").
3. Aviso de prototipo permanente y no descartable: "Prototipo en evaluación. No es un sistema oficial del Gobierno de Nayarit ni del Ayuntamiento de Tepic."
4. **Servicios de uso inmediato:** carrusel horizontal de 5 accesos, **cada uno con la etiqueta de estado de su servicio**: Reportar bache o luminaria, Falla de agua, Predial, Constancia de residencia, Acta de nacimiento. El carrusel se opera con teclado y no es la única vía a ningún servicio.
5. **Tarjeta ORBE** (verde): saludo, un ejemplo de conversación y un campo de texto con botón de micrófono. Es la alternativa escrita al ORBE flotante. El ejemplo de respuesta dice: "Le oriento. Cuando exista un enlace oficial verificado, se lo indico; mientras tanto le digo a qué dependencia acudir." (no prometa un enlace que no exista).
6. **Apoyos y becas:** tarjeta con etiqueta "Por verificar fuente oficial". Texto: "Aquí aparecerán las convocatorias con su fecha límite, solo cuando exista una fuente oficial vigente." Si algún día una convocatoria tiene fecha límite verificada con enlace a su fuente, se muestra un contador de tiempo restante; mientras no la tenga, **no se muestra ningún contador**.
7. **Trámites y dependencias:** filtros (Todos, Documentos, Pagos, Servicios públicos, Negocios) y una tarjeta por servicio con: icono, nombre, autoridad, categoría y etiqueta de estado. Al tocar una tarjeta se abre una hoja inferior (foco atrapado, cierra con Escape) con: descripción, estado de la fuente, botón "Preguntar a ORBE sobre este trámite" y el botón de enlace oficial (inactivo si es `null`). En la hoja de "Reporte de bache o luminaria" añada: "El registro de reportes no está disponible en este prototipo."
8. **Salud · TEPICTU:** tarjeta con etiqueta "En diseño" (TEPICTU es el nombre del módulo de triaje; triaje significa orientación inicial sobre la urgencia de los síntomas). Texto: "Orientación inicial según sus síntomas: le indicará si conviene atenderse en casa, en un centro de salud o en un hospital. No sustituye la atención médica."
9. Leyenda "Cómo leer las etiquetas" con los **cuatro** estados: Verificado (respaldado por fuente oficial), Por verificar (dato aún sin cierre de fuente oficial), Demo (demostración sin efectos jurídicos), En diseño (capacidad futura, aún no disponible).
10. **Barra inferior fija** con cuatro opciones: Inicio, Trámites, Pagos, Perfil. **El ORBE no va en la barra inferior.**

## 6. Catálogo de datos (archivo `data/municipality/tepic/services.json`)

Use el esquema del repositorio (claves en inglés). Cree el archivo con exactamente estos registros. Todos los `official_url` y `consulted_at` son `null` hasta que la persona usuaria los complete con fuentes de páginas oficiales de gobierno.

```json
{
  "schema_version": "0.2",
  "municipality": "Tepic",
  "state": "Nayarit",
  "status_model": ["verificado", "por_verificar", "demo", "propuesto"],
  "services": [
    { "id": "tepic.constancia_residencia", "name": "Constancia de Residencia", "family": "documental", "authority": "Ayuntamiento de Tepic", "citizen_description": "Orientación para acreditar residencia en el municipio.", "source_status": "por_verificar", "official_url": null, "consulted_at": null },
    { "id": "tepic.predial", "name": "Predial", "family": "tesoreria", "authority": "Ayuntamiento de Tepic", "citizen_description": "Orientación sobre consulta, pago y aclaración del impuesto predial.", "source_status": "por_verificar", "official_url": null, "consulted_at": null },
    { "id": "tepic.reporte_servicios_publicos", "name": "Reporte de bache o luminaria", "family": "servicios_publicos", "authority": "Ayuntamiento de Tepic", "citizen_description": "Registro y seguimiento de reportes urbanos como baches y luminarias.", "source_status": "por_verificar", "official_url": null, "consulted_at": null },
    { "id": "tepic.apertura_negocio", "name": "Apertura de negocio", "family": "actividad_economica", "authority": "Ayuntamiento de Tepic", "citizen_description": "Orientación para identificar la ruta municipal aplicable a la apertura de un establecimiento.", "source_status": "por_verificar", "official_url": null, "consulted_at": null },
    { "id": "tepic.registro_civil_acta_nacimiento", "name": "Acta de nacimiento / Registro Civil", "family": "registro_civil", "authority": "Autoridad competente por validar", "citizen_description": "Orientación para obtener o localizar el canal oficial de actas de nacimiento.", "source_status": "por_verificar", "official_url": null, "consulted_at": null },
    { "id": "tepic.bienestar_atencion", "name": "Orientación y beneficios sociales", "family": "atencion_ciudadana", "authority": "Ayuntamiento de Tepic", "citizen_description": "Orientación hacia programas, apoyos o canales de atención disponibles.", "source_status": "por_verificar", "official_url": null, "consulted_at": null },
    { "id": "salud.tepictu", "name": "Salud · TEPICTU (triaje)", "family": "salud", "authority": "Por definir", "citizen_description": "Orientación inicial según síntomas. Capacidad futura, aún no disponible.", "source_status": "propuesto", "official_url": null, "consulted_at": null }
  ]
}
```

Categorías en pantalla según `family`: `documental` y `registro_civil` → Documentos; `tesoreria` → Pagos; `servicios_publicos` → Servicios públicos; `actividad_economica` → Negocios; `atencion_ciudadana` → bloque "Apoyos y becas"; `salud` → bloque "Salud · TEPICTU".

El acceso "Falla de agua" del carrusel no tiene registro propio todavía: debe mostrarse con la etiqueta "Por verificar" y abrir a ORBE con la frase "Tengo una falla de agua" precargada, **sin nombrar una dependencia responsable**; ORBE responde que no cuenta con información verificada.

## 7. ORBE flotante (la interacción principal)

**Posición:** botón circular de 64 px, fijo en el **borde derecho, por encima de la barra inferior** (`right: 16px`, `bottom: calc(92px + env(safe-area-inset-bottom))`), siempre visible al desplazarse. No abre otra pantalla. La tarjeta flotante se ancla **encima del botón**, nunca encima de la barra ni del botón.

**Gesto "mantener presionado":**
1. Al presionar (`pointerdown`), el botón se encoge a 90 % y comienza un temporizador de **800 ms**.
2. Si la persona suelta antes (`pointerup`, `pointerleave` o `pointercancel`), se cancela y el botón vuelve a su tamaño.
3. Al cumplirse los 800 ms, ORBE se activa **en la misma pantalla**: aparece sobre el botón una tarjeta flotante "ORBE le escucha" con barras de sonido animadas y un pulso alrededor del botón. Vibre brevemente (`navigator.vibrate(30)`) si el dispositivo lo permite.
4. Soltar el dedo **no** termina la conversación. Se termina tocando el botón una vez más, o con el botón "Terminar" de la tarjeta.
5. Un menú contextual del sistema no debe aparecer al mantener presionado (`contextmenu` con `preventDefault`; estilos `touch-action: none` y `user-select: none` en el botón).
6. Un toque simple en reposo **no** arranca el micrófono: muestra la ayuda "Mantenga presionado para hablar".
7. Con la etiqueta pequeña "Mantenga presionado para hablar" visible mientras el botón está en reposo, colocada a la izquierda del botón para no cubrir contenido; desaparece tras el primer uso (use `localStorage` dentro de `try/catch`; la pantalla debe funcionar sin él).

**Voz:**
- Entrada: `SpeechRecognition` / `webkitSpeechRecognition` (reconocimiento de voz del navegador) con `lang = "es-MX"` y resultados parciales. Muestre en la tarjeta lo que se va entendiendo.
- Salida: `speechSynthesis` (síntesis de voz del navegador) con voz `es-MX` si existe; si no, la mejor voz en español disponible.
- Ciclo: escuchar → al detectar pausa enviar el texto a `POST /api/ai/chat` → leer la respuesta en voz alta → volver a escuchar, hasta que la persona termine.
- Si el navegador no soporta reconocimiento de voz (por ejemplo, Firefox), muestre: "Su navegador no permite voz. Escriba su pregunta" y abra el campo de texto de la tarjeta ORBE.
- Si el permiso de micrófono es denegado, muestre un mensaje claro en español con el paso para habilitarlo y ofrezca el campo de texto.

**Accesibilidad del gesto:** el botón también se activa y desactiva con teclado (Enter o Espacio) y con un doble toque como alternativa; el gesto de mantener presionado nunca es la única vía. Anuncie los cambios de estado con `role="status"`. Con `prefers-reduced-motion`, sin barras animadas ni pulso: el estado se comunica con texto e icono.

**Respuesta de ORBE:** cuando la respuesta corresponde a un servicio del catálogo, muestre debajo del texto una tarjeta de ese servicio con su estado y su botón de enlace oficial (inactivo si es `null`), **tomando el enlace del catálogo**. El servidor devuelve `{ "response": string, "servicio_id": string | null }`.

## 8. Servidor (`server.ts`)

- `POST /api/ai/chat` recibe `{ message, context, surface }`, donde `context` indica la pantalla activa y `surface` vale `"orbe-home"`. Llama a Gemini con la **Parte B** como instrucción de sistema y devuelve `{ response, servicio_id }`. El modelo responde con `{ texto, servicio_id }` (use `responseSchema`); el servidor devuelve `texto` como `response`.
- Incluya en el mensaje enviado al modelo el contenido de `data/municipality/tepic/services.json`, para que Aura solo pueda referirse a esos servicios. Si `servicio_id` no existe en el catálogo, el servidor lo reemplaza por `null`.
- **Elimine del texto devuelto por el modelo cualquier URL** (`https?://…` y dominios sueltos).
- Límite de longitud del mensaje (500 caracteres; si lo excede, responda 400 con un mensaje en español) y límite de peticiones por minuto por dirección IP (responda 429).
- Si Gemini falla o no hay llave, devuelva el texto: "ORBE no está disponible en este momento. Puede buscar su trámite en la lista." con `servicio_id: null`. Nunca devuelva el error interno ni pistas de configuración.

## 9. Entregables

1. Aplicación funcionando en la vista previa de AI Studio.
2. `data/municipality/tepic/services.json` con el catálogo.
3. `server.ts` con la ruta de orientación y la Parte B como constante.
4. `metadata.json` con permiso de micrófono (solo prototipo).
5. Un archivo `README.md` en español que explique cada archivo, cómo completar los enlaces oficiales del catálogo y que este build es un prototipo de referencia que no se sube a `main` tal cual.

---

# PARTE B — INSTRUCCIÓN DE SISTEMA DEL AGENTE DE ORIENTACIÓN

(Constante de texto dentro de `server.ts`. Se envía como `systemInstruction` a Gemini cuando `surface` es `"orbe-home"`.)

```
Usted es Aura, la capacidad de orientación conversacional que opera dentro de ORBE, la guía ciudadana de Nayarit Digital, un prototipo de gobierno digital para el municipio de Tepic, Nayarit, México. Ante la persona preséntese como ORBE. Usted es inteligencia artificial: si la persona pregunta si habla con una persona o con una máquina, acláreselo. No es un sistema oficial del Gobierno de Nayarit ni del Ayuntamiento de Tepic, y debe aclararlo si la persona lo pregunta.

MISIÓN
Orientar a la persona hacia el trámite o servicio correcto y llevarla a su enlace oficial cuando exista uno verificado. Usted informa, orienta, explica y navega. No ejecuta pagos, no emite documentos, no firma ni aprueba nada, y no crea reportes ni solicitudes.

REGLA DE VERDAD
1. Solo puede hablar de los servicios del catálogo que recibe en cada mensaje.
2. Jamás invente requisitos, costos, plazos, horarios, oficinas, teléfonos, fechas ni enlaces.
3. Si el catálogo marca un servicio como "por_verificar" o "propuesto", dígalo con claridad: "Este dato aún no está verificado con una fuente oficial".
4. Si "official_url" es null, diga: "Todavía no cuento con el enlace oficial verificado de este trámite" y recomiende acudir directamente a la dependencia que indica el catálogo. Si la autoridad del catálogo dice "por validar" o "por definir", dígalo sin sugerir otra.
5. Si la consulta está fuera del catálogo, responda que no cuenta con información verificada y sugiera la dependencia que probablemente corresponda, sin afirmar requisitos. No nombre una dependencia para fallas de agua ni para temas que el catálogo no cubra.
6. Las fuentes válidas son páginas oficiales de gobierno. Nunca cite notas periodísticas.
7. No escriba direcciones web en su respuesta. La aplicación muestra el enlace oficial desde el catálogo.

PRIVACIDAD
No solicite ni acepte CURP, INE, domicilio, teléfono ni datos bancarios. Si la persona los escribe, pídale que no los comparta por este medio.

SALUD
Usted orienta, no diagnostica ni receta. Ante dolor de pecho, dificultad para respirar, desmayo, sangrado abundante, convulsiones, signos de embolia o cualquier urgencia, indique de inmediato llamar al 911. Para casos leves, sugiera acudir a un centro de salud y recuerde que su orientación no sustituye la atención médica. No cite otros números telefónicos.

REPORTES CIUDADANOS
Para baches, luminarias o fallas de servicios, indique que ese servicio existe en el catálogo y remita a él. Usted no registra reportes: si la persona pide hacerlo, explique que el registro de reportes no está disponible en este prototipo. No prometa plazos de reparación.

ESTILO
- Español de México en registro formal, cordial y claro. Sin modismos ni coloquialismos.
- Respuestas aptas para ser leídas en voz alta: de dos a cuatro oraciones, sin viñetas, sin asteriscos, sin encabezados, sin emojis. Si debe enumerar, use "primero", "segundo".
- Explique cualquier sigla la primera vez que la use.
- Cierre con el siguiente paso concreto.
- No use lenguaje persuasivo ni comercial. No prometa ni garantice resultados. Su propósito es orientar, no convencer.

SALIDA
Responda en JSON con dos campos: "texto" (lo que se leerá en voz alta) y "servicio_id" (el identificador del servicio del catálogo al que se refiere la respuesta, o null si ninguno).
```

---

# PARTE C — COMPROBACIÓN DEL PROTOTIPO

El prototipo está listo cuando se cumple todo lo siguiente (la numeración remite a los criterios A-xx de la especificación; los criterios A-05, A-09, A-12, A-13, A-17 y A-18 se verifican en el repositorio, no en AI Studio):

- [ ] A-01 La pantalla sigue el orden de la sección 5 y se ve bien a 390 px, sin desplazamiento horizontal a 360 px.
- [ ] A-02 El ORBE flotante está a la derecha, sobre la barra inferior; la barra inferior solo tiene 4 opciones; el último bloque queda libre.
- [ ] A-03 Mantener presionado ~0,8 s activa la escucha en la misma pantalla; soltar no la termina; tocar de nuevo sí; Enter, Espacio y doble toque equivalen.
- [ ] A-04 Sin soporte de voz o sin permiso, aparece el campo de texto con mensaje en español.
- [ ] A-06 Ninguna tarjeta muestra un enlace que no esté en el catálogo; con `null`, el botón está inactivo y lo explica; ningún enlace procede del texto del modelo.
- [ ] A-07 No existe ningún contador de tiempo en "Apoyos y becas" mientras no haya una fecha verificada con fuente.
- [ ] A-08 Toda etiqueta es "Verificado", "Por verificar", "Demo" o "En diseño"; la leyenda lista las cuatro; cada acceso del carrusel tiene etiqueta.
- [ ] A-10 Ante "me duele el pecho y no puedo respirar", ORBE indica llamar al 911 y no cita otro número.
- [ ] A-11 Al preguntarle por un costo o plazo no registrado, ORBE responde que no está verificado en vez de inventarlo.
- [ ] A-14 Texto ≥ 4,5:1; bordes de control ≥ 3:1; todo botón táctil mide al menos 44 px; todo icono sin texto tiene `aria-label`; `prefers-reduced-motion` respetado.
- [ ] A-15 Un mensaje de más de 500 caracteres es rechazado; una ráfaga de peticiones recibe 429; si Gemini falla, la respuesta es genérica y sin detalle interno.
- [ ] A-16 ORBE no pide CURP, INE, domicilio, teléfono ni datos bancarios.
- [ ] Buscar en el código del navegador (herramientas del desarrollador → Fuentes) no revela la llave de Gemini.

---

# GLOSARIO

- **AI Studio / modo Build:** herramienta de Google para crear aplicaciones describiéndolas en lenguaje natural.
- **API:** interfaz mediante la cual un programa pide servicios a otro (aquí, a Gemini).
- **Llave de API:** contraseña que autoriza el uso de la API; no debe viajar al navegador.
- **Full-stack (pila completa):** aplicación con parte visible (navegador) y parte servidora.
- **Express:** biblioteca para crear el servidor web en Node.js.
- **JSON:** formato de texto para guardar datos estructurados.
- **ORBE:** guía ciudadana de Nayarit Digital (interfaz y frontera semántica). **Aura:** capacidad conversacional generativa, opcional y reemplazable, que orienta dentro de ORBE; no autoriza nada. **Context.OS:** plano de control que, en el repositorio, decide política, consentimiento, ejecución y evidencia; no forma parte de este prototipo.
- **TEPICTU:** nombre del módulo de salud con orientación inicial (triaje).
- **CURP:** Clave Única de Registro de Población. **INE:** Instituto Nacional Electoral (credencial para votar).
- **Contraste 4.5:1 / 3:1:** relación mínima de brillo entre texto y fondo (4.5:1), y entre un control y su entorno (3:1), recomendada para que sea legible.
- **`prefers-reduced-motion`:** ajuste del sistema para quienes prefieren menos animación.
- **`LAB_MOCK`:** modo de laboratorio de Context.OS: no produce ningún efecto administrativo.
