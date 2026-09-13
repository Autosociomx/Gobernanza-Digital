# Protocolo de lenguas originarias

**Ámbito:** toda cadena de la interfaz que se muestre en náayeri (cora) o wixárika.
**Estatus:** vigente desde 2026-09-12.
**Código:** `shared/traduccion/`. **Guardia:** regla R9 de `scripts/verificar-regresiones.mjs`.

---

## 1. El hallazgo que lo origina

La plataforma llevaba tiempo con un selector de tres lenguas y con estas cadenas
incrustadas a mano en `src/components/CitizenApp.tsx` y `src/components/C5Dashboard.tsx`.
Al inventariarlas apareció lo siguiente:

- Ninguna tenía autor, fecha ni forma de saber si era correcta. Llegaron en algún
  push desde AI Studio.
- `nav.redes` en el bloque **wixárika** era literalmente la cadena **náayeri**
  copiada.
- `accion.ayuda`, `accion.mapa_obras` y `accion.reportar_bache` eran español
  ("Ayuda", "Mapa", "Reportar") presentado como traducción.
- `app.asistente_en_linea` estaba en **inglés** ("Online · Cora Support"), y además
  usaba el exónimo en lugar del autónimo.
- La landing afirmaba en público: *"La plataforma opera en español, náayeri (cora)
  y wixárika"*. Eso no era verificable.

Bajo el semáforo del proyecto eso es una cifra sin fuente en versión lingüística:
contenido legítimo en su intención, no real todavía, y **sin etiqueta**. La regla
del glosario aplica igual a las palabras que a los porcentajes.

## 2. La regla

> Una traducción a lengua originaria solo se le muestra a un ciudadano **sin
> etiqueta** cuando un hablante identificable la revisó y quedó asentado quién,
> cuándo y con qué fuente. Todo lo demás se etiqueta o se repliega a español.

Tres estados, mismo vocabulario que `BIBLIOTECA_LEGAL.md`:

| Estado | Qué significa | Qué hace la interfaz |
|---|---|---|
| `VERIFICADO` | Revisada por hablante o fuente documental identificable, con fecha | 🟢 Se muestra tal cual |
| `POR_VERIFICAR` | Existe, pero nadie competente la revisó | 🟡 Se muestra con la etiqueta **SIN VERIFICAR** |
| `RECHAZADO` | Se comprobó que no está en la lengua | 🔴 No se muestra; repliegue a español, y queda el motivo asentado |

Nada se borra. Una cadena rechazada conserva su texto, su motivo y su fecha en el
registro — igual que las actas, aquí se corrige con constancia, no se elimina.

## 3. Arquitectura

```
shared/traduccion/
├── lenguas.ts   Catálogo: clave interna, autónimo, locale de voz
├── lexico.ts    EL registro. Único lugar donde puede vivir una cadena
│                en náayeri o wixárika, con estado + origen + fuente
├── tipos.ts     Contratos
├── guardia.ts   GuardiaPreEnvio: política de publicación + filtro de deriva
├── perfil.ts    PerfilIdiolectal: cadencia, frecuencia y modismos del hablante
├── registro.ts  Validación estructural + resolverTexto() + coberturaPorLengua()
└── grafo.ts     GrafoTraduccionNativa: prepara candidatos para revisión humana
```

### 3.1 La separación que sostiene todo

`GuardiaPreEnvio` tiene dos competencias y **no se mezclan**:

- `medirDeriva(vectorFuente, vectorSalida)` — **heurística**. Similitud coseno; detecta
  que un borrador de máquina se fue por otro lado. Puede equivocarse.
- `evaluarPublicacion(unidad)` — **política**. Decide si un texto llega a la pantalla
  de un ciudadano. Es determinística, depende solo del estatus del registro y **nunca
  recibe un embedding ni una salida de modelo**.

Consecuencia práctica: un puntaje de similitud alto jamás convierte una traducción en
publicable. Es el mismo principio que rige `contextos/` — la política es determinística
y ningún LLM la decide.

### 3.2 El grafo prepara, no publica

`GrafoTraduccionNativa.ejecutar()` hace el recorrido completo: inyecta el perfil
idiolectal como instrucción de estilo → pide un borrador (temperatura 0.1) →
vectoriza fuente y borrador → aplica el filtro de deriva (umbral 0.85) → si hay
deriva, replega a decodificación literal estricta (temperatura 0).

Y devuelve `aptoParaPublicacion: false`. Siempre. El tipo es la constante `false`,
no `boolean`: el compilador impide que alguien, más adelante, abra ese camino sin
darse cuenta.

**Por qué.** Los modelos de hoy no tienen competencia demostrada en náayeri ni en
wixárika. La similitud coseno detecta que un borrador cambió de tema; no detecta
que esté mal dicho, y para estas lenguas el propio vectorizador está fuera de su
dominio. El grafo sirve para **preparar candidatos que un hablante revisa**, no
para traducir en vivo frente a un ciudadano.

Por eso `embed` y `traducir` se **inyectan** en lugar de instanciarse: así
`shared/traduccion/` no crea ningún cliente de IA y puede importarse desde el
navegador sin violar la regla dura 2 (ninguna llave viaja al cliente). Hoy no
existe endpoint ciudadano de traducción automática, y es deliberado.

### 3.3 El perfil idiolectal describe cómo se habla, no qué se dice

`PerfilIdiolectal` lleva frecuencia fundamental (Hz), cadencia (palabras por minuto)
y modismos del hablante. Sirve para dos cosas: normalizar `rate`/`pitch` de la Web
Speech API contra la referencia del español mexicano (150 ppm, 120 Hz), y pedirle al
traductor que conserve los modismos. **No influye en la decisión de publicar.** Un
perfil muy detallado no vuelve confiable una traducción que nadie revisó.

## 4. Cobertura real hoy

14 cadenas de interfaz en el registro. **Ninguna verificada.**

| Lengua | Total | Verificadas | Por verificar | Rechazadas |
|---|---|---|---|---|
| Náayeri (cora) | 14 | **0** | 10 | 4 |
| Wixárika | 14 | **0** | 9 | 5 |

Estas cifras las calcula `coberturaPorLengua()` desde el registro; el aviso
`AvisoLenguaOriginaria` las lee de ahí en vez de repetir un texto escrito a mano
que se desactualiza. La prueba `ninguna cadena embarcada se presenta hoy como
verificada` falla el día que alguien marque `VERIFICADO`: debe venir con el acta de
revisión en el mismo PR.

## 5. Cómo verificar una cadena

1. Sacar el candidato del registro (o prepararlo con `GrafoTraduccionNativa`).
2. Llevarlo a revisión con hablantes. Debe quedar asentado **qué instancia** revisó
   —institución, comunidad o documento—, nunca el nombre de una persona física:
   regla dura 9, ningún dato personal en el repositorio.
3. Actualizar la entrada en `shared/traduccion/lexico.ts`:
   `estado: 'VERIFICADO'`, `origen: 'HABLANTE_NATIVO'` o `'FUENTE_DOCUMENTAL'`,
   `fuente` con la referencia y `revisadoEn` con la fecha ISO.
4. Actualizar la expectativa de la prueba de cobertura y levantar el acta.

El validador rechaza el atajo: `VERIFICADO` con `origen: 'MAQUINA'` o
`'SIN_TRAZABILIDAD'`, o sin `revisadoEn`, revienta al importar el módulo.

## 5.bis Límites medidos del filtro de deriva

Tres cosas que el filtro vectorial **no** puede hacer, y que por eso no pueden
delegarse en él. La primera está medida y fijada en la suite de pruebas.

**a) Aprueba el paso directo del español, con puntaje perfecto.**
`cos(x, x) = 1` es una identidad matemática: se cumple con cualquier función de
embedding, incluida una real. Un modelo que no traduce y devuelve el español tal
cual obtiene 1.0000 y pasa el filtro. Es exactamente el defecto que traían las
cadenas heredadas — "Ayuda" → "Ayuda", "Mapa" → "Mapa" — así que el filtro que
supuestamente las habría detectado es justo el que las habría aprobado. Lo que
las detiene es el estatus `RECHAZADO` en el registro. Fijado en la prueba
*LÍMITE MEDIDO: el filtro vectorial aprueba el paso directo del español*.

**b) No hay vectorizador que cubra náayeri ni wixárika.**
El filtro compara el vector del español fuente contra el de la salida. Eso
funciona con modelos multilingües en los pares que sí conocen; estas dos lenguas
no están representadas en ningún modelo de embeddings disponible. En
consecuencia una traducción **correcta** puntúa bajo por estar en otra lengua, no
por ser infiel — y el repliegue literal, que sale en la misma lengua, puntúa
igual de bajo. El filtro es un detector de deriva sobre el texto fuente, no un
validador de traducción.

**c) La latencia no es local.**
La operación coseno son microsegundos, pero obtener los dos vectores es una
llamada al proveedor de embeddings. En esta plataforma eso es un viaje de red
desde el servidor, no una comparación en memoria. No es apto para un camino
síncrono frente al ciudadano; es apto para preparar candidatos fuera de línea.

Nada de esto invalida el filtro: lo ubica. Sirve para lo que sí hace —detectar
que un borrador se fue de tema respecto de la fuente— y esa es la razón de que
`evaluarPublicacion()` no lo consulte.

## 5.ter Frontera con el dato biométrico

`PerfilIdiolectal` recibe hoy tres valores y no captura nada: es un objeto de
valor que alguien construye a mano, y en la plataforma solo se usa el perfil
neutro. Esa frontera es deliberada.

En el momento en que la frecuencia fundamental, el timbre o las pausas
respiratorias se **midan de la voz de un ciudadano**, dejan de ser parámetros de
estilo y pasan a ser dato biométrico personal: identifican a la persona aunque
no se guarde el audio. Eso exige base legal, consentimiento explícito ligado al
propósito y mínimo de retención — el mismo tratamiento que Context.OS ya le da al
contacto personal, no menos. Mientras eso no esté resuelto y asentado, el perfil
se construye a mano o se queda en `PERFIL_NEUTRO`; regla dura 9.

## 6. Lo que este subsistema **no** hace

- No traduce en vivo para el ciudadano. No hay endpoint de traducción automática.
- No erradica alucinaciones: acota una clase de ellas (deriva respecto de la
  fuente) y deja pasar otras, entre ellas la no-traducción (§5.bis a).
- No produce evidencia inmutable. El runtime declara `integrityAssurance:
  'CHECKSUM_ONLY'`: hay checksum SHA-256 y `correlationId`, que no son firma
  digital ni prueba de inmutabilidad, y la documentación no debe insinuar que
  lo sean.
- No valida calidad lingüística. El filtro de deriva detecta cambio de tema, no
  corrección gramatical ni pertinencia cultural.
- No da voz sintética en lengua originaria. Ni náayeri ni wixárika tienen voz en
  ningún navegador: la síntesis sigue en `es-MX` y así se declara en pantalla.
- No traduce el contenido dinámico del asistente. Aura responde en español, y
  eso ahora está **aplicado, no solo declarado**: `server.ts` compone su prompt
  con `componerPromptDelSistema()` (`shared/traduccion/asistente.ts`), que
  prohíbe generar náayeri o wixárika —ni una palabra suelta, ni aunque el
  ciudadano lo pida— y manda ofrecer atención humana en su lugar. La restricción
  se adjunta en el servidor para que editar `public/CONNECTX_SYSTEM_PROMPT.md` no
  pueda retirarla, y la regla R10 de la Guardia falla el build si desaparece.

## 7. Base normativa

**Pendiente.** El derecho lingüístico aplicable no está todavía en
`docs/marco/BIBLIOTECA_LEGAL.md`, y la regla de citación del proyecto solo permite
afirmar en público lo que esté en estatus VERIFICADO. Por eso este documento no cita
artículos: incorporarlos a la biblioteca legal, con verificación de fuente oficial,
es el siguiente paso de este expediente.

## 8. Reglas de la Guardia (R9 y R10)

`scripts/verificar-regresiones.mjs` falla el build si:

**R9 — el léxico no vuelve a incrustarse.** Falta `shared/traduccion/lexico.ts`, o
aparece en `src/` una clave de objeto `cora:`, `wixarika:` o `nayeri:` — el patrón
exacto con el que llegaron las cadenas originales.

**R10 — el asistente no vuelve a intentar hablar la lengua.** Falta
`shared/traduccion/asistente.ts`, o `server.ts` deja de componer su prompt con
`componerPromptDelSistema()`, o reaparece la instrucción "usa el idioma
solicitado" que hacía que el modelo contestara en wixárika sin anclaje.

Es la misma lógica que las otras ocho reglas: cada una corresponde a un incidente
que ya ocurrió.
