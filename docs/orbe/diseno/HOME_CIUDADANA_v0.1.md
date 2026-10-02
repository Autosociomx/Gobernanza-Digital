# Pantalla de inicio ciudadana con ORBE flotante — especificación v0.1

| Campo | Valor |
|---|---|
| Serie / versión | `orbe-diseno` · v0.1 |
| Estado | **Propuesta canónica.** No es canónica hasta que la persona responsable la apruebe por PR (misma convención que `ORBE_CANON.md`). |
| Parent | `docs/orbe/canon/v0.1/MANIFEST.yaml` · sha256 `8fa4e790b6a5691eb550c52fe39e955cfa403187349a306b226d885e06eaebb9` |
| HEAD revisado | `d5a78aaca3b11c1d459acab154d66b3db87ef4f5` (Merge ORBE P0 v0.2) |
| Fecha | 2026-10-02 |
| Fuentes | Prompt maestro para Google AI Studio (partes A, B y C) y captura [`ref/home-ciudadana-ai-studio.png`](./ref/home-ciudadana-ai-studio.png) |
| Capa del canon | Experience Plane (`ORBE_CANON.md` §2.1). Esta pantalla **no** decide políticas, no autoriza y no ejecuta. |
| Alcance | Especificación. No autoriza implementación (`P0_SCOPE.md`); P0 v0.2 sigue con verificaciones pendientes (`ORBE_P0_REPORTE.md`). |

## 1. Qué es y qué no es

**Es** la superficie ciudadana de entrada del prototipo de Tepic: una persona dice
lo que necesita —por texto o por voz— y la pantalla la **orienta** hacia el
trámite correcto y hacia su enlace oficial, cuando exista uno verificado.

**No es**:

- un sistema oficial del Gobierno de Nayarit ni del Ayuntamiento de Tepic (el aviso
  de prototipo es permanente y no descartable);
- un autorizador: pagos, documentos, firmas, aprobaciones y sanciones quedan fuera;
- Aura presentada como producto público (`GLOSARIO_OFICIAL.md` §1). La capa
  conversacional generativa es Aura (`AURA_VS_ORBE.md`); lo que la persona ve se
  llama ORBE.

Regla que gobierna todo lo demás (canon, `AURA_VS_ORBE.md`): **Aura orienta. ORBE
encuadra una posible acción. Context.OS autoriza o rechaza. El adapter ejecuta
dentro de su modo. Evidence registra.**

## 2. Principios de diseño

1. **Honestidad antes que completitud.** Ningún requisito, costo, plazo, oficina,
   teléfono, fecha ni enlace sin fuente en el catálogo. Dato ausente → se dice que
   no está verificado (semáforo 🟡, `CLAUDE.md` §3).
2. **Cuatro estados de fuente, y solo cuatro:** `verificado`, `por_verificar`,
   `demo`, `propuesto` (`data/municipality/tepic/README.md`). Etiquetas en pantalla:
   *Verificado*, *Por verificar*, *Demo*, *En diseño*.
3. **El enlace nunca viene del modelo.** El servidor devuelve un `servicio_id`; la
   interfaz busca el enlace en el catálogo. Un enlace es válido solo si está en el
   catálogo, es `https` y su host termina en `.gob.mx`. Con `null`, el botón queda
   inactivo y dice "Enlace oficial pendiente de verificación".
4. **La voz es una vía, no la única.** Todo lo que se logra hablando se logra
   escribiendo, con teclado y sin gestos.
5. **Nada simulado que parezca real.** Sin contadores, folios, montos ni avisos
   inventados. El único folio que esta superficie puede mostrar es el folio LAB que
   devuelve Context.OS (§5.4).

## 3. Anatomía de la pantalla

Orden de arriba hacia abajo. Ancho de referencia 390 px; contenido centrado con
máximo 430 px; sin desplazamiento horizontal a 360 px.

| # | Bloque | Contenido canónico | Fuente del dato | Notas |
|---|---|---|---|---|
| 1 | Encabezado | "NAYARIT DIGITAL" (pequeño) · "¿Qué necesita hoy?" · botón de avisos · botón de perfil | Estático | El botón de avisos no tiene fuente verificada: ver D-03. Todo botón-icono lleva `aria-label`. |
| 2 | Buscador | "Buscar trámite o servicio". Busca en `name` del catálogo y en los ejemplos de `intents.json`. Sin resultados: "No encontré ese trámite. Pregunte a ORBE." | Catálogo | Campo de 16 px mínimo (evita zoom en iPhone). |
| 3 | Aviso de prototipo | "Prototipo en evaluación. No es un sistema oficial del Gobierno de Nayarit ni del Ayuntamiento de Tepic." | Estático | Permanente, no descartable. |
| 4 | Servicios de uso inmediato | Carrusel de 5 accesos (tabla 3.1) | Catálogo + configuración de presentación | Cada acceso muestra la etiqueta de estado de su servicio (DEF-02). Alcanzables también desde el bloque 7: el carrusel nunca es la única vía. |
| 5 | Tarjeta ORBE (verde) | Saludo, un ejemplo de conversación, campo de texto con botón de micrófono | Estático + canal de orientación | Es la **alternativa escrita** al ORBE flotante. Si puede originar un `IntentEnvelope`, lleva los avisos permanentes del §5.4. El texto de ejemplo no puede prometer un enlace que no exista (DEF-03). |
| 6 | Apoyos y becas | Etiqueta "Por verificar fuente oficial". Texto: "Aquí aparecerán las convocatorias con su fecha límite, solo cuando exista una fuente oficial vigente." Botón "Ver orientación" | `tepic.bienestar_atencion` | **Sin contador** mientras no exista una fecha límite verificada con fuente. El catálogo hoy no tiene campo de fecha límite (§6.2). |
| 7 | Trámites y dependencias | Filtros: Todos · Documentos · Pagos · Servicios públicos · Negocios. Una tarjeta por servicio: icono, nombre, autoridad, categoría, etiqueta de estado. Al tocar: hoja inferior con descripción, estado de la fuente, "Preguntar a ORBE sobre este trámite" y botón de enlace oficial | Catálogo (§6) | Filtros y tarjetas son `<button>`. La hoja inferior atrapa el foco y cierra con Escape. |
| 8 | Salud · TEPICTU | Etiqueta "En diseño". "Orientación inicial según sus síntomas: le indicará si conviene atenderse en casa, en un centro de salud o en un hospital. No sustituye la atención médica." | D-07 | TEPICTU (módulo conceptual `Diseñado`) **no es** el módulo `salud` del C5 (Nayarit ID, estado `real` en `INDICE.json`). No confundirlos en copy ni en enlaces. |
| 9 | Cómo leer las etiquetas | Los cuatro estados con su significado (DEF-04) | Estático | |
| 10 | Barra inferior fija | Inicio · Trámites · Pagos · Perfil | Estático | **ORBE no va en la barra.** "Pagos" muestra solo tarjetas informativas con etiqueta *Demo* (R-08). |

El contenedor de scroll lleva relleno inferior ≥ `92 px + 64 px + 16 px +
safe-area` para que el botón flotante nunca cubra el último bloque (DEF-01).

### 3.1 Accesos del carrusel

Configuración de presentación (datos, no `if`): cada acceso es `{ etiqueta, service_id }`.

| # | Etiqueta | `service_id` (catálogo) | Nota |
|---|---|---|---|
| 1 | Reportar bache o luminaria | `tepic.reporte_servicios_publicos` | Único con servicio en el runtime: `mx.nay.tepic.public-works.report` (§5.3). |
| 2 | Falla de agua | *(sin registro)* | Abre ORBE con la frase precargada. **No se nombra dependencia responsable** hasta tener fuente. Alta en catálogo pendiente (D-06). |
| 3 | Predial | `tepic.predial` | |
| 4 | Constancia de residencia | `tepic.constancia_residencia` | |
| 5 | Acta de nacimiento | `tepic.registro_civil_acta_nacimiento` | Autoridad "por validar" en el catálogo. |

## 4. ORBE flotante — interacción

Se reutiliza `src/components/orbe/OrbeCitizen.tsx` y su máquina de estados
(`idle · listening · thinking · speaking · error · unsupported`). El componente
sigue **sin conocer** Gemini, Firebase, trámites ni Context.OS; recibe callbacks.

### 4.1 Posición

- Botón circular de 64 px, `position: fixed`, `right: 16px`,
  `bottom: calc(92px + env(safe-area-inset-bottom))`: siempre visible, **encima**
  de la barra inferior. No abre otra pantalla.
- Hoy `OrbeCitizen` se ancla a `bottom: calc(16px + …)` y el panel de
  `OrbeContextPilot` a `bottom: calc(92px + …)`. Con la nueva posición del botón
  ambos se solaparían: el panel se re-ancla **encima del botón**
  (`bottom ≥ 92 + 64 + 12 px + safe-area`) (R-06).
- Un solo contenedor de panel, anclado sobre el botón, aloja —nunca a la vez— la
  tarjeta "ORBE le escucha", el estado de Context.OS y el recibo de laboratorio.

### 4.2 Gesto "mantener presionado"

1. `pointerdown`: el botón se encoge a 90 % y arranca un temporizador de **800 ms**.
2. Si se suelta antes (`pointerup`, `pointerleave`, `pointercancel`): se cancela y
   el botón vuelve a su tamaño.
3. A los 800 ms ORBE se activa **en la misma pantalla**: tarjeta flotante "ORBE le
   escucha" con barras de sonido animadas y pulso alrededor del botón;
   `navigator.vibrate(30)` si existe.
4. **Soltar el dedo no termina la conversación.** Termina tocando el botón otra vez
   o con el botón "Terminar" de la tarjeta.
5. Sin menú contextual del sistema: `contextmenu` con `preventDefault`;
   `touch-action: none` y `user-select: none` en el botón.
6. Etiqueta "Mantenga presionado para hablar" visible en reposo; desaparece tras el
   primer uso (preferencia por visitante, con `try/catch`; la pantalla debe
   funcionar sin almacenamiento).

**Alternativas (obligatorias):** Enter o Espacio activan y desactivan; doble toque
activa. El cambio de estado se anuncia con `role="status"`. Qué hace un toque simple
en reposo: D-04.

### 4.3 Voz

- Entrada: `SpeechRecognition` / `webkitSpeechRecognition`, `lang = "es-MX"`,
  resultados parciales visibles en la tarjeta.
- Salida: `speechSynthesis` con voz `es-MX` si existe; si no, la mejor voz en español.
- Ciclo: escuchar → al detectar pausa, enviar el texto → leer la respuesta → volver
  a escuchar, hasta que la persona termine.
- Sin soporte de voz: "Su navegador no permite voz. Escriba su pregunta" + se abre
  el campo de texto de la tarjeta ORBE.
- Permiso denegado: mensaje en español con el paso para habilitarlo + campo de texto.
- **Bloqueo en producción (R-09):** `netlify.toml:28` declara
  `Permissions-Policy = "… microphone=()"`, que deshabilita el micrófono para todos
  los orígenes. Mientras no cambie, la interacción principal de este diseño no puede
  funcionar en el sitio desplegado.

### 4.4 Privacidad de la conversación

ORBE nunca pide CURP, INE, domicilio, teléfono ni datos bancarios; si la persona los
escribe, se le pide que no los comparta por este medio. Ningún dato personal real en
código, semillas ni textos (`CLAUDE.md` §3.9).

### 4.5 Avisos permanentes cuando hay acción posible

Cuando una frase puede convertirse en solicitud de acción, la superficie muestra
**permanentemente** lo que ya declara `OrbeContextPilot`: `ORBE · acción trazable ·
Context.OS`, que Aura orienta y conversa, `LAB_MOCK`, `authority: NONE`, sin efecto
administrativo, y que cualquier folio o evidencia es de laboratorio y no constituye
resolución oficial (`P0_ACCEPTANCE.md` §4). Esto aplica a la tarjeta ORBE (bloque 5)
y al botón flotante por igual.

## 5. Rutas de conversación

### 5.1 Quién responde qué

| La persona dice… | Clasificación | Ruta | Resultado en pantalla |
|---|---|---|---|
| Pregunta sobre un trámite ("¿qué necesito para…?") | `INFORMATION_REQUEST` | Aura (canal de orientación) | Texto + tarjeta del servicio con estado y botón de enlace (inactivo si `null`). Nunca ejecuta. |
| Aseveración de incidente ("hay un bache en mi calle") | `INCIDENT_ASSERTION` | Puente nativo → `CONFIRM_ACTION` | Pide confirmación. No se convierte en acción sin ella. |
| Solicitud explícita ("quiero reportar un bache") | `ACTION_REQUEST` | Puente nativo → `IntentEnvelope` → Context.OS | Recibo de laboratorio: folio LAB, `evidenceId`, SHA-256, `policyVersion`, estado. |
| Ambigua | `AMBIGUOUS` | Puente nativo → `ASK_INTENT` | Pregunta de aclaración. |
| Síntomas con signos de alarma | — | Aura | Indica llamar al **911**. No cita otros números. |
| Fuera del catálogo | — | Aura | "No cuento con información verificada"; sugiere dependencia probable sin afirmar requisitos. |

La clasificación vive en `shared/semantic/*` + `src/orbe/*`, no en el modelo ni en
un `if` de la pantalla (`ORBE_CANON.md` §8). La caída de Aura no debe impedir el flujo
nativo bache/luminaria mientras Context.OS esté disponible (`AURA_VS_ORBE.md`).

### 5.2 Contrato del canal de orientación (propuesto, D-01)

Entrada `{ message (≤ 500 caracteres), context, surface: "orbe-home" }`; salida
`{ response: string, servicio_id: string | null }` (campo aditivo: compatible con
`useAuraChat`, que lee `data.response`). El servidor:

- rechaza mensajes > 500 caracteres y limita peticiones por minuto por IP;
- elimina cualquier URL del texto devuelto por el modelo;
- ante falla de Gemini o ausencia de llave devuelve "ORBE no está disponible en este
  momento. Puede buscar su trámite en la lista." con `servicio_id: null` y **nunca**
  el error interno;
- recibe el catálogo en cada petición para que solo pueda referirse a esos servicios.

### 5.3 Dos espacios de identificadores

El catálogo usa `tepic.reporte_servicios_publicos`; el runtime usa
`mx.nay.tepic.public-works.report`. No son el mismo identificador y la pantalla no
debe suponerlo: la equivalencia se declara en el catálogo (`runtime_service_id`,
§6.2) y solo para servicios que Context.OS tenga registrados (hoy, uno).

### 5.4 Recibo de laboratorio

Se muestra solo si Context.OS devolvió evidencia. Campos: folio LAB (si existe),
`evidenceId`, `sha256`, `policyVersion`, estado. `CHECKSUM_ONLY` es integridad de
laboratorio: el texto no debe insinuar firma ni inmutabilidad.

## 6. Datos

### 6.1 Fuente única

La fuente es **`data/municipality/tepic/services.json`** (schema `0.1`, 8 servicios,
claves en inglés). El `data/servicios.json` que pedía el prompt original **no se
crea**: sería un segundo catálogo, con otro esquema y 7 registros en lugar de 8.

Servicios con tarjeta ciudadana: `constancia_residencia`, `predial`,
`reporte_servicios_publicos`, `apertura_negocio`, `registro_civil_acta_nacimiento`
(bloque 7) y `bienestar_atencion` (bloque 6). `catastro_inteligente` y
`tesoreria_campo` son herramientas de revisión con humano en el circuito
(`legal_effect: human_review_required`), no trámites ciudadanos: **no se listan**.

### 6.2 Campos que el diseño necesita y el catálogo aún no tiene

Extensión **aditiva** propuesta (schema `0.2`; no se aplica en este documento).
Los dos primeros ya figuran como "Siguiente cierre" 1–2 en el README del catálogo.

| Campo | Tipo | Uso |
|---|---|---|
| `official_url` | `string \| null` | Único origen de enlaces. `https` + host `.gob.mx`. |
| `consulted_at` / `source_authority` | `string \| null` | Fecha de consulta y autoridad emisora de la fuente. Obligatorios si `source_status = verificado`. |
| `runtime_service_id` | `string \| null` | Equivalencia con Context.OS (§5.3). |
| `deadline` | `{ date, source_url } \| null` | Solo apoyos. Habilita el contador del bloque 6 y únicamente si `source_url` es verificable. |

Regla de validación (prueba automatizable): `source_status = verificado` ⇒
`official_url`, `consulted_at` y `source_authority` no nulos.

### 6.3 Mapeos de presentación

| `family` (catálogo) | Categoría en pantalla |
|---|---|
| `documental`, `registro_civil` | Documentos |
| `tesoreria` | Pagos |
| `servicios_publicos` | Servicios públicos |
| `actividad_economica` | Negocios |
| `atencion_ciudadana` | Apoyos (bloque 6, fuera del filtro) |

| `source_status` | Etiqueta en pantalla | Equivalente en `GLOSARIO_OFICIAL.md` §4 |
|---|---|---|
| `verificado` | Verificado | VERIFICADO |
| `por_verificar` | Por verificar | *(sin equivalente)* |
| `demo` | Demo (banda DEMO) | SIMULADO |
| `propuesto` | En diseño | *(sin equivalente)* |

El glosario rige las **cifras** (META · SIMULADO · PROYECCIÓN · VERIFICADO); el
catálogo rige el **estado de fuente de un servicio**. Son vocabularios distintos y
no se mezclan en una misma etiqueta (D-08).

## 7. Tokens visuales

Razones de contraste calculadas (WCAG 2.x, luminancia relativa), no declaradas.

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| Fondo de página | `#F3F6F5` | Fondo | — |
| Tarjeta | `#FFFFFF` | Superficie | — |
| Verde institucional | `#0B5D5B` | Botones, ORBE, selección | 7,69:1 con texto `#FFFFFF` |
| Texto principal | `#12302C` | Cuerpo | 13,01:1 sobre fondo · 14,14:1 sobre tarjeta |
| Texto secundario | `#34504B` | Apoyo | 8,06:1 · 8,77:1 |
| Texto terciario | `#4A625E` | Metadatos | 6,04:1 · 6,56:1 |
| Etiqueta "por verificar" | `#6B4200` sobre `#FFF1D6` | Estado | 7,82:1 |
| Etiqueta neutra "en diseño" | `#34504B` sobre `#E4EAE8` | Estado | 7,20:1 |
| Borde decorativo de tarjeta | `#D5E0DD` | Solo tarjetas no interactivas | 1,24:1 sobre fondo (no cumple 3:1; aceptable solo si no es el único indicador) |
| **Borde de control** (nuevo) | `#6F8A85` | Buscador, filtros inactivos, campos | 3,72:1 sobre `#FFFFFF` · 3,42:1 sobre `#F3F6F5` (cumple 3:1, WCAG 1.4.11) |

Tipografía: Public Sans 400/500/600/700, cargada de forma asíncrona desde
`index.html` (nunca `@import` en CSS, regla dura 6). Hoy `index.html` carga Inter,
Playfair Display, Space Grotesk y JetBrains Mono, no Public Sans (R-10).
Sin emojis, sin degradados decorativos, sin barras de estado simuladas.

Escala: el repo fija `html { font-size: 20px }` a propósito (legibilidad en servicios
públicos). El prompt original dimensiona en px sobre 16 px. Cómo conciliarlo: D-02.

## 8. Accesibilidad

- Objetivos táctiles ≥ 44 × 44 px; chips de filtro y botón de micrófono incluidos.
- Botones reales (`<button>`, `<a href>`); nunca `div` con clic.
- Todo icono sin texto con `aria-label`.
- Estados de ORBE anunciados con `role="status"` (educado, no asertivo).
- `prefers-reduced-motion`: sin barras animadas ni pulso; el estado se comunica con
  texto e icono.
- Foco visible en todo control (utilidad `.accessible-focus` del repo).
- Texto ≥ 4,5:1 (§7) y bordes de control ≥ 3:1.
- Carrusel operable con teclado y no es la única ruta a ningún servicio.
- Hoja inferior: foco atrapado, cierre con Escape, el foco vuelve a la tarjeta.

## 9. Conciliación con el prompt original

Lo que el prompt pide y el repo (o el canon) contradice. Columna **Resuelto** =
esta especificación ya fija la respuesta; **Decisión** = depende de una persona
(§11).

| ID | El prompt dice | El repo / canon dice | Tratamiento |
|---|---|---|---|
| R-01 | Ruta nueva `POST /api/orbe/chat` con `{ mensaje, contexto }` → `{ texto, servicio_id }` | Regla dura 2: el navegador llama a `/api/ai/chat` o `/api/ai/risk-analysis`. `useAuraChat` envía `{ message, context }` y lee `data.response` | **Decisión D-01.** Propuesta: extender `/api/ai/chat` con `surface` y `servicio_id` aditivo. |
| R-02 | El agente se llama ORBE y "orienta" | Canon: la IA generativa es Aura, opcional y reemplazable; ORBE es interfaz + frontera semántica | **Resuelto.** La instrucción de sistema se redacta para Aura (modo orientación ciudadana); la pantalla dice ORBE. |
| R-03 | Parte B: sin lenguaje persuasivo ni comercial | `public/CONNECTX_SYSTEM_PROMPT.md` (el prompt que usa hoy `/api/ai/chat`) manda "Lenguaje de Conquista", "Psicología del Usuario", "Anclaje de Valor", "Garantizar", "autoridad de quien domina los datos y la ley". `GLOSARIO_OFICIAL.md` §8 prohíbe PNL y "técnicas de persuasión" (en su apartado sobre la plantilla), y el prompt global las usa de forma explícita | **Hallazgo previo, fuera de alcance.** El canal actual **no es apto** para esta pantalla con su prompt vigente. Por eso la Parte B se aplica como instrucción selectiva por `surface`. Corregir el prompt global es otra tarea. |
| R-04 | Reportar bache = orientar a un servicio | Canon: `ACTION_REQUEST` → `IntentEnvelope` → Context.OS, con avisos `LAB_MOCK` / `authority: NONE` y recibo con `evidenceId` | **Resuelto** en §4.5, §5.1 y §5.4. El prompt no tenía esa ruta. |
| R-05 | Crear `data/servicios.json` con claves en español y 7 registros | Ya existe `data/municipality/tepic/services.json` (8 registros, claves en inglés) | **Resuelto** en §6.1: fuente única; extensión aditiva `0.2`. |
| R-06 | Botón a 92 px del borde inferior; mantener 800 ms | `OrbeCitizen` hoy: toque alterna, anclado a 16 px; `OrbeContextPilot` ancla su panel a 92 px | **Resuelto** en §4.1–4.2 (re-anclaje). Cómo trata el toque simple: D-04. |
| R-07 | Barra Inicio · Trámites · Pagos · Perfil | `CitizenApp` tiene 16 pestañas (`TabType`); su barra muestra Home · Networks · Forum · Payments · Profile | **Decisión D-05** (dónde vive la pantalla). |
| R-08 | "Pagos" solo con tarjetas informativas *Demo* | `payments` (CitizenApp, `INDICE.json`) está en estado `riesgo`: simula un pago que puede confundirse con real | **Resuelto.** La nueva pestaña no reutiliza `TesoreriaYTramitesView` ni simula cobro. Montos: siempre en servidor (regla dura 8). |
| R-09 | `metadata.json` con `"microphone"` | `metadata.json` hoy declara `["geolocation","camera"]`; `netlify.toml:28` fija `microphone=()` | **Bloqueante para voz en producción.** Cambiar la cabecera a `microphone=(self)` toca un archivo protegido: requiere mención explícita en el PR y verificación en deploy preview (A-05). |
| R-10 | Public Sans | `index.html` no la carga | Añadirla toca `index.html` (protegido); mantener patrón asíncrono (`media="print"` + `onload`). |
| R-11 | Texto mín. 12 px, campos 16 px, base 16 px | `html { font-size: 20px }` intencional | **Decisión D-02.** |
| R-12 | Leyenda con 3 etiquetas | Existen 4 estados de fuente | **Resuelto** (DEF-04): leyenda con los cuatro. |
| R-13 | "Nunca devuelva el error interno"; límite de 500 caracteres; límite por IP | `server.ts:96-134`: sin límite de longitud ni de tasa; devuelve `error.message` (l. 132) y una pista de configuración (l. 100-102) | **Brecha previa** a exponer la pantalla; se corrige al implementar §5.2 (server.ts es archivo protegido). |
| R-14 | App full-stack independiente en AI Studio | `CLAUDE.md` §6: los pushes desde AI Studio causaron 4 fugas de llave y borrados de archivos de despliegue | El build de AI Studio es **prototipo de referencia**: su código no entra a `main` tal cual. Ver reglas de exportación en el prompt v0.2. |

## 10. Defectos observados en la captura

La captura es una imagen de página completa de 390 × 1900 px; el botón flotante y la
barra inferior aparecen al final porque son `fixed`. Los defectos se leen con esa
salvedad.

| ID | Observación | Corrección |
|---|---|---|
| DEF-01 | Al final del scroll, la etiqueta "Mantenga presionado para hablar" y el botón cubren la leyenda "Cómo leer las etiquetas" (tapan "respaldado por fuente oficial") | Relleno inferior del contenedor (§3) y etiqueta que no cubra texto (a la izquierda del botón, y se oculta tras el primer uso) |
| DEF-02 | Los accesos del carrusel no llevan etiqueta de estado, aunque el prompt exige "Por verificar" en *Falla de agua* y los demás apuntan a servicios `por_verificar` | Etiqueta de estado en cada acceso (bloque 4) |
| DEF-03 | La burbuja de ejemplo dice "Le oriento **y le llevo al sitio oficial**", pero ningún servicio tiene `official_url` | Copy: "Le oriento. Cuando exista un enlace oficial verificado, se lo indico; mientras tanto le digo a qué dependencia acudir." |
| DEF-04 | La leyenda enumera 3 estados; falta *Demo* | Cuatro estados (§6.3) |
| DEF-05 | Buscador, filtros inactivos y campos solo se distinguen por un borde `#D5E0DD` (1,24–1,35:1) | Token de borde de control `#6F8A85` (§7) |

## 11. Decisiones abiertas

| ID | Pregunta | Recomendación |
|---|---|---|
| D-01 | ¿Canal de orientación: extender `/api/ai/chat` con `surface`, o crear `/api/orbe/chat`? | Extender `/api/ai/chat`: la regla dura 2 solo nombra esas dos rutas y límites, errores seguros y recorte de URLs quedan en un único sitio. |
| D-02 | ¿Raíz de 20 px del repo, o contenedor de la pantalla a 16 px? | Respetar los 20 px y re-basar los mínimos (texto ≥ 0,75 rem = 15 px). Validar a 360 y 390 px. |
| D-03 | ¿Qué abre el botón de avisos si no hay fuente verificada de avisos? | Ocultarlo hasta que exista fuente; si se conserva, estado vacío "Sin avisos oficiales". Nunca avisos de ejemplo sin etiqueta. |
| D-04 | ¿Qué hace un toque simple en reposo? Hoy `OrbeCitizen` arranca con un toque | No arrancar el micrófono (evita activaciones accidentales); mostrar la ayuda "Mantenga presionado…". Enter/Espacio y doble toque siguen arrancando. |
| D-05 | ¿Dónde vive la pantalla: pestaña `home` de `CitizenApp` o vista nueva? | Componente nuevo con `React.lazy`, montado solo en el render de la pestaña `home`; edición acotada a ese rango (skill `editar-modulo`). No tocar `App.tsx` más de lo necesario. |
| D-06 | *Falla de agua*: ¿qué fuente oficial define autoridad y trámite? | Aportar la fuente; mientras tanto no existe registro y ORBE responde "no verificado". |
| D-07 | ¿Se da de alta `salud.tepictu` (`propuesto`, autoridad "por definir") en el catálogo para respaldar el bloque 8? | Sí, como `propuesto`, sin enlace y sin autoridad inventada. |
| D-08 | Los estados `por_verificar` y `propuesto` no tienen equivalente en `GLOSARIO_OFICIAL.md` §4 | Añadir en el glosario una tabla de equivalencia (PR aparte de `docs/marco/`). |

## 12. Criterios de aceptación

Fusiona la Parte C del prompt, `P0_ACCEPTANCE.md` y lo detectado arriba.
"Cómo" indica el tipo de verificación.

| ID | Criterio | Cómo |
|---|---|---|
| A-01 | El orden de bloques cumple §3 y no hay desplazamiento horizontal a 360 y 390 px | Captura Playwright |
| A-02 | ORBE flotante a la derecha, sobre la barra inferior; la barra tiene exactamente 4 opciones; el último bloque queda libre | Captura + prueba de layout |
| A-03 | Mantener ~0,8 s activa la escucha en la misma pantalla; soltar no la termina; tocar de nuevo sí; Enter, Espacio y doble toque equivalen | Prueba de componente |
| A-04 | Sin voz o sin permiso aparece el campo de texto con mensaje en español | Prueba de componente |
| A-05 | El micrófono no queda bloqueado por `Permissions-Policy` en el deploy | Deploy preview |
| A-06 | Ningún enlace fuera del catálogo; `null` ⇒ botón inactivo que lo explica; el enlace no proviene del texto del modelo; solo `https` + `.gob.mx` | Prueba unitaria + revisión de red |
| A-07 | Sin contador en "Apoyos y becas" mientras no haya `deadline` con fuente | Prueba de componente |
| A-08 | Toda etiqueta ∈ {Verificado, Por verificar, Demo, En diseño}; la leyenda lista las cuatro; cada acceso del carrusel está etiquetado | Prueba de componente |
| A-09 | Guardia (R1–R8), `npm run lint`, `npx vite build` y `npm run test:orbe-contextos` en verde; la cadena `GEMINI` no aparece en `dist/assets/` | CI |
| A-10 | "Me duele el pecho y no puedo respirar" ⇒ indica llamar al 911, sin otro número | Caso de prueba |
| A-11 | Costo o plazo no registrado ⇒ "no está verificado", no inventado | Caso de prueba |
| A-12 | "Quiero reportar un bache" ⇒ ruta nativa a Context.OS con recibo (folio LAB, `evidenceId`, SHA-256, policy, estado) y avisos `LAB_MOCK` / `authority: NONE` | `test:orbe-p0-e2e` |
| A-13 | Una pregunta o una aseveración de incidente no se convierten en acción sin confirmación (invariantes 1–2 del canon) | `test:orbe-contextos` |
| A-14 | Texto ≥ 4,5:1; bordes de control ≥ 3:1; objetivos ≥ 44 px; iconos con `aria-label`; `prefers-reduced-motion` respetado | Auditoría automática + manual |
| A-15 | `surface: "orbe-home"`: mensaje > 500 caracteres rechazado; ráfaga ⇒ 429; falla de Gemini ⇒ texto genérico sin detalle interno | Prueba de servidor |
| A-16 | ORBE no pide CURP, INE, domicilio, teléfono ni datos bancarios | Caso de prueba |
| A-17 | `canon/v0.1/MANIFEST.yaml` conserva su hash | Comparación SHA-256 |
| A-18 | Lighthouse del deploy preview ≥ 97 / 100 / 100 / 100 | Lighthouse |

## 13. Ruta de implementación (no iniciada)

Precondición: P0 v0.2 cerrado según `P0_ACCEPTANCE.md` y etapa posterior autorizada.
Un PR por etapa, ramas `feat/<módulo>` según `CLAUDE.md` §6.

| Etapa | Contenido | Archivos | ¿Protegido? |
|---|---|---|---|
| E1 · Datos | Schema `0.2` del catálogo (§6.2) + prueba de validación; alta de `salud.tepictu` (D-07) | `data/municipality/tepic/*`, prueba nueva | No |
| E2 · Servidor | `surface`, límites, errores seguros, recorte de URLs (§5.2) | `server.ts` | **Sí** |
| E3 · Despliegue | `microphone=(self)` (R-09); Public Sans (R-10) | `netlify.toml`, `index.html` | **Sí** |
| E4 · UI | Componentes de la pantalla; gesto y re-anclaje en `OrbeCitizen` / `OrbeContextPilot`; todo lazy | `src/components/…`, `src/index.css` | No |
| E5 · Integración | Montaje acotado en `CitizenApp` (D-05); fichas `INDICE.json` y `docs/orbe/modulos.json` si cambia el estado; `cop.html` y `orbe-3d.html` si cambia un módulo | `src/components/CitizenApp.tsx`, `docs/` | `docs/` sí |
| E6 · Cierre | A-01 a A-18 | — | — |

Cada etapa describe en el PR los archivos protegidos que toca.
