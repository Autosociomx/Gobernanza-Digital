# Laboratorio de lenguas originarias en ORBE

**Estado del documento:** diagnóstico y especificación. No es un acuerdo, no describe
integraciones institucionales existentes ni resultados de evaluación.
**Rama de referencia:** `claude/native-translation-guardrails-o4415o`
**Commit contrastado:** `30652265a27450bc398d752166d60ba5f28c8af9`
**Fecha del contraste:** 2026-09-12

---

## 1. Diagnóstico — el contexto recibido contra el repositorio

Cada afirmación se verificó contra el código en el commit citado.

| Afirmación recibida | Verificación |
|---|---|
| Registro en `shared/traduccion/` con origen, fuente, fecha y tres estados | **Confirmada.** `tipos.ts`, `lexico.ts`, `registro.ts` |
| Náayeri 0/10/4 y wixárika 0/9/5 (verificadas/pendientes/rechazadas) | **Confirmada.** Sale de `coberturaPorLengua()` |
| Generador de candidatos con `aptoParaPublicacion: false` | **Confirmada.** Tipado como la constante `false`, no `boolean` |
| Reglas de comprensión de ORBE basadas en expresiones españolas | **Confirmada.** Los `patterns` de `publicWorksReport.ts` son regex en español |
| Voz configurada en español mexicano | **Confirmada.** `VOICE_LOCALE = 'es-MX'`, entrada y salida |
| Flujo bache/luminaria en `LAB_MOCK`, sin efecto administrativo | **Confirmada.** `publicWorksReportAdapter.ts` |
| Evidencia `CHECKSUM_ONLY`, no firma digital ni inmutabilidad | **Confirmada.** Y así debe describirse siempre |
| La función de traducción del grafo no recibe la lengua destino | **Confirmada — era un defecto real. Corregido en esta entrega** |
| No se localizó CodeLens | **Confirmada.** Cero coincidencias en toda la rama |
| 82 pruebas aprobadas | **Precisada.** En el commit contrastado, 82 es lo que corre CI (`test:orbe-contextos`, 4 archivos) y la suite completa daba 91. Con las dos pruebas de la corrección de esta entrega: **84 en CI, 93 en total**. Todas verifican comportamiento del software, no calidad lingüística |

### 1.1 Lo que el contexto no trae y el código sí

**a) `Evidence.OS` no existe como componente.** Hay `contextos/evidence.ts`, un módulo
**dentro** de Context.OS. Nombrarlo como sistema aparte infla la arquitectura.

**b) La jurisdicción está fijada a Tepic.** `publicWorksReport.ts` declara
`{ country: 'MX', state: 'NAY', municipality: 'TEPIC' }`, y
`auditSemanticRuntimeAlignment()` **falla** ante cualquier desalineación de jurisdicción
entre contrato y catálogo de servicios. No es configuración: es un invariante con prueba.

**c) El camino generativo de Aura está abierto y sin guardarraíl.** `server.ts:55` instruye
*"usa el idioma solicitado"*; `CitizenApp` y `C5Dashboard` envían `Idioma de interfaz:
wixarika`; y `public/CONNECTX_SYSTEM_PROMPT.md` no menciona ninguna lengua originaria. Hoy,
al tocar el botón WIXÁRIKA, la plataforma le pide al modelo que conteste en wixárika sin
anclaje alguno. Es el hueco más grande del sistema y no aparece en el contexto recibido.

**d) Límite medido del filtro de deriva.** `cos(x, x) = 1` es identidad matemática: un modelo
que no traduce y devuelve el español **aprueba el guardarraíl con puntaje perfecto**. Fijado
en la prueba *LÍMITE MEDIDO*. Corolario: el coseno no puede sostener ninguna afirmación de
calidad lingüística, y no existe vectorizador que cubra náayeri ni wixárika.

---

## 2. Objeciones al diseño propuesto

El planteamiento recibido es inusualmente disciplinado: separa corpus, consulta y
entrenamiento; prohíbe inventar resultados; exige criterios de éxito previos a la medición.
Las objeciones son de especificidad, no de intención.

**O1 · El piloto no tiene jurisdicción donde correr.** Náayeri y wixárika se hablan
principalmente en Del Nayar, La Yesca y Huajicori. El runtime está fijado a Tepic con un
invariante probado. Hay que decidir antes de escribir código: (a) el piloto es con hablantes
residentes en Tepic, o (b) se extiende el contrato a otra jurisdicción, con lo que eso
implica de convenio con otro ayuntamiento.

**O2 · El recorrido bache/luminaria puede no ser pertinente, y no hay plan B.** Es un
servicio urbano. El contexto lo condiciona correctamente, pero no desarrolla la
consecuencia: es el **único** vertical slice que existe. Si la comunidad dice que no le
sirve, el MVP se queda sin recorrido. Esa es una dependencia dura del piloto.

**O3 · El presupuesto de participantes está doblemente comprometido.** §3 pide 10–15
personas de una comunidad y una variante. §7 pide dos revisiones independientes y que quien
aporta no apruebe lo suyo. §8 pide evaluadores que **no** hayan participado en la
preparación. Con 10–15 personas esos tres conjuntos compiten por el mismo grupo. O crece el
número, o el piloto renuncia explícitamente a una de las tres garantías y dice a cuál.

**O4 · §5 y §9 se contradicen.** §5 propone NotebookLM como cuaderno de fuentes; §9 exige
saber dónde se procesan los materiales y poder cambiar de proveedor. Subir gramáticas,
diccionarios y audios comunitarios a un producto de terceros procesa ese material fuera del
control del proyecto. No es prohibitivo: es una decisión de soberanía que se toma con la
comunidad y por escrito, no se hereda de la herramienta.

**O5 · No se nombran componentes que no existen.** CodeLens no está en la rama. Evidence.OS
tampoco. Asignarles función en un diagrama institucional produce una arquitectura no
falsable — exactamente lo que el semáforo del proyecto prohíbe.

**O6 · La tubería de contenido no sirve mientras el camino generativo siga abierto.** Medir
comprensión sobre contenido aprobado, mientras el asistente improvisa lengua en vivo en la
misma pantalla, mide la cosa equivocada. Cerrar ese camino es **precondición del piloto**,
no una tarea paralela.

**O7 · Las métricas prometen más resolución que la muestra.** "Errores por variante y
situación" con una variante y 10–15 personas no produce tasas por variante. Hay que declarar
antes qué se podrá concluir y qué no.

**O8 · El audio es dato biométrico.** §6 pide "audio autorizado cuando corresponda". La voz
identifica a la persona aunque no se guarde su nombre. Requiere base legal, consentimiento
separado por propósito —el contexto ya separa consultar/publicar/entrenar, y eso está bien—
y mínimo de retención declarado.

**O9 · Cien expresiones no es una unidad de medida útil por sí sola.** Mejor medida:
**cobertura del recorrido** — qué porcentaje de los pasos de un trámite tiene contenido
aprobado. Es lo que determina si un ciudadano puede terminarlo.

---

## 3. Explicación institucional (196 palabras)

El municipio ya ofrece una plataforma digital con un selector de tres lenguas. Al auditarlo
se encontró que las cadenas en náayeri y wixárika no tenían autor, fecha ni forma de saber
si eran correctas: algunas eran español, una estaba en inglés y otra era la cadena náayeri
copiada al bloque wixárika.

La plataforma ya no las presenta como traducciones válidas. Cada cadena carga hoy su estado,
su origen y su fuente; lo que ningún hablante ha revisado se muestra etiquetado, y lo que se
comprobó que no está en la lengua se repliega a español dejando constancia del motivo.

Lo que falta no es código: falta que hablantes revisen. El laboratorio propone hacerlo con
participación comunitaria remunerada, donde la aprobación lingüística corresponde a
hablantes competentes de la variante y cada contenido publicado queda ligado a quién lo
revisó y bajo qué norma de escritura.

La inteligencia artificial ordena materiales y prepara candidatos. No aprueba. El registro
de verificación humana es el activo, y es verificable por cualquiera.

Nayarit sería el primer territorio donde se construye y evalúa este modelo. El formato del
registro es abierto y reutilizable por otros estados.

---

## 4. Alcance del MVP y dependencias

### Dentro del alcance

1. Cerrar el camino generativo: el asistente no emite lengua originaria no revisada.
2. Un recorrido ciudadano, una comunidad, una variante, acordados con la comunidad.
3. Consola de dictamen para revisores, con norma ortográfica e instancia obligatorias.
4. Circuito de revisión: aporte → dos revisiones independientes → mediación → publicación.
5. Publicación solo de contenido aprobado, con repliegue a español y vía de apoyo humano.
6. Evaluación independiente con criterios registrados antes de medir.

### Fuera del alcance

Entrenamiento o ajuste de modelos; reconocimiento o síntesis de voz en lengua originaria;
más de una variante; traducción automática en vivo frente al ciudadano.

### Dependencias que bloquean

| Dependencia | Sin esto no se puede |
|---|---|
| Acuerdo comunitario (participación, remuneración, atribución, uso) | Nada. Es la primera. |
| Elección de comunidad y variante | Definir el recorrido y el reclutamiento |
| Pertinencia del recorrido (O2) | Saber si el MVP tiene caso de uso |
| Jurisdicción (O1) | Que el runtime acepte el `IntentEnvelope` |
| Norma ortográfica de referencia | Que cualquier dictamen sea verificable |
| Base legal del tratamiento de voz (O8) | Recoger audio |
| Derecho lingüístico en `BIBLIOTECA_LEGAL.md` | Citar un solo artículo en público |

---

## 5. Recorridos

### Participante (aporta)
Entra al Taller desde el celular · elige aportar o revisar · aporta por texto o voz con el
contexto de uso · ve su aportación en estado *pendiente* · recibe aviso cuando se dictamina,
con el motivo si se corrigió o se retiró. **No puede aprobar lo propio.**

### Revisor (dictamina)
Declara instancia y norma ortográfica antes de poder dictaminar · ve la expresión, su
contexto y el candidato · responde *se entiende* / *lo diría diferente* / *depende de la
comunidad* / *no sé* · corrige el texto si procede · distingue **corrección lingüística** de
**pertinencia para el servicio**, que son dos dictámenes separados. Dos revisiones
independientes; el desacuerdo va a mediación, nunca a mayoría automática.

### Ciudadano (consume)
Elige su lengua · ve solo contenido aprobado · lo no aprobado se repliega a español sin
fingir cobertura · en cualquier punto puede pedir apoyo humano, y el sistema lo ofrece él
mismo cuando no tiene contenido aprobado para el paso.

---

## 6. Modelo de datos y reglas de publicación

**Son dos registros distintos y conflarlos sería un error.**

**a) Léxico de interfaz — CONSTRUIDO.** `shared/traduccion/lexico.ts`. Cadenas fijas de la
UI. Campos: `clave`, `es`, `glosa`, y por lengua `texto`, `estado`, `origen`, `fuente`,
`revisadoEn`. Le faltan `normaOrtografica` y `variante` (PROPUESTO).

**b) Corpus de expresiones — PENDIENTE DE CONSTRUIR.** Expresiones espontáneas de hablantes.
Campos propuestos: expresión, significado, contexto de uso, lengua, variante, comunidad,
escritura utilizada, intención, fuente, referencia al audio autorizado, versión, historial de
revisiones y permisos de uso separados en *consultar* / *publicar* / *entrenar*.

**Reglas de publicación.** Se publica solo lo aprobado. Una aportación nueva **nunca**
modifica automáticamente lo publicado. Se conservan versiones anteriores. Se puede corregir
o retirar, y el retiro conserva el motivo. Cada publicación queda ligada a su revisión.

**Fuera del repositorio público, sin excepción:** datos personales, consentimientos, audio y
cualquier vínculo entre una aportación y una persona física. Regla dura 9. En el repositorio
solo viaja la instancia o comunidad que revisó, nunca quién.

---

## 7. Plan por etapas

Los responsables son **propuestos**; ningún acuerdo existe todavía.

| Etapa | Termina cuando | Responsable propuesto |
|---|---|---|
| 0 · Cerrar el camino generativo | El asistente no emite lengua no revisada, con prueba | Equipo de plataforma |
| 1 · Acuerdo comunitario | Convenio firmado: participación, remuneración, atribución, uso, retiro | Ayuntamiento + comunidad |
| 2 · Base normativa y norma ortográfica | Derecho lingüístico VERIFICADO en la biblioteca legal; norma declarada por escrito | Jurídico + instancia lingüística |
| 3 · Pertinencia del recorrido | La comunidad confirma o sustituye bache/luminaria | Comunidad + equipo de producto |
| 4 · Taller y circuito de revisión | Un revisor completa un dictamen de punta a punta | Equipo de plataforma |
| 5 · Ronda de dictamen | Cobertura del recorrido ≥ meta acordada en la etapa 3 | Hablantes revisores |
| 6 · Evaluación independiente | Informe con criterios registrados antes de medir | Evaluador externo |

---

## 8. Protocolo de evaluación independiente

Criterios de éxito **registrados y fechados antes de observar resultados**. Ejemplos
reservados desde el inicio; nunca reutilizados para preparar ni seleccionar propuestas.
Evaluadores que no participaron en la preparación (ver O3: exige ampliar el grupo).

Comparación: orientación actual contra ORBE, mismo servicio y mismo contenido, con protocolo
acordado con la comunidad.

Se mide: comprensión de requisitos y siguiente paso; conservación de preguntas, solicitudes,
**negaciones y autorizaciones** — la clase de error más costosa, porque invierte el sentido
de un trámite; necesidad, motivo y eficacia del apoyo humano; tiempo y esfuerzo de revisión;
errores por situación; trazabilidad de lo publicado.

**Lo que este piloto no podrá concluir** (O7): tasas de error por variante, suficiencia para
entrenar un modelo, ni dominio de la lengua. Declararlo antes evita presentarlo después.
Satisfacción no es comprensión, y nada simulado se presenta como evidencia.

---

## 9. Semáforo

### 🟢 Construido y comprobado
Registro con estado, origen, fuente y fecha · guardia pre-envío determinística, independiente
de todo embedding · repliegue a español con constancia · etiqueta SIN VERIFICAR en la interfaz
· `aptoParaPublicacion: false` garantizado por el compilador · lengua destino, norma y variante
en la instrucción de traducción · **el asistente no genera lengua originaria**, restricción
compuesta en el servidor e imposible de retirar editando el prompt público · reglas R9 y R10
de la Guardia · 100 pruebas · límite del filtro
medido y fijado.

### 🟡 Pendiente de validar
Cobertura real: 0 verificadas de 14 en ambas lenguas · pertinencia del recorrido bache/luminaria
· jurisdicción del piloto · adecuación de la consola de dictamen para revisores reales · si el
formato del registro sirve a otra lengua distinta de estas dos.

### 🔴 Pendiente de construir
Taller de nuestra lengua · corpus de expresiones espontáneas ·
circuito de dos revisiones con mediación · vía de apoyo humano · cuaderno de fuentes con
referencia a documento y ubicación · exportación de datos, versiones y permisos · derecho
lingüístico en la biblioteca legal · acuerdos comunitarios · CodeLens (no existe).

---

## 10. Las tres siguientes tareas

*(La tarea que encabezaba esta lista —cerrar el camino generativo— quedó hecha:
`shared/traduccion/asistente.ts`, compuesta en `server.ts`, protegida por R10.)*

**1. Llevar la pregunta de pertinencia y jurisdicción a la comunidad, antes de
programar.** O1 y O2 deciden si el MVP tiene caso de uso: el recorrido
bache/luminaria es urbano y el runtime está fijado a Tepic con un invariante
probado. Escribir el Taller antes de esa conversación es construir sobre un
supuesto, y es la única tarea que no depende de nosotros.

**2. Incorporar el derecho lingüístico a `BIBLIOTECA_LEGAL.md` con verificación
de fuente oficial.** Sin eso, ni este documento ni el protocolo pueden citar un
artículo, y el argumento que sostiene al resto del proyecto —la ley ya lo
ordena— todavía no aplica aquí.

**3. Añadir `normaOrtografica` y `variante` a `UnidadTraducida`.** La consola de
dictamen ya los captura y el grafo ya los transporta, pero el registro todavía no
puede guardarlos: hoy una cadena verificada no diría bajo qué norma se verificó.
Es el último eslabón que falta para que la primera ronda de dictamen sea
registrable, y cuesta poco con 14 entradas.
