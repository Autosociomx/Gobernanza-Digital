# Transformar, no construir — Diagnóstico del canal ciudadano vigente de Tepic

**Nayarit Digital · ConnectX · SOATM** · Documento estratégico-normativo · v1.0
Fecha: 2026-09-13 · Estatus: vigente

> **Tesis de este documento.** El municipio de Tepic **ya tiene** un canal digital
> de atención ciudadana en producción, con usuarios reales. La decisión correcta
> no es construir otro encima ni pedir que se apague: es **transformarlo en el
> canal de captura de un sistema que hoy no existe detrás de él** —el expediente,
> la trazabilidad y la interoperabilidad que la LNETB y la Ley de Gobierno Digital
> de Nayarit ya ordenan—. Construir compite; transformar absorbe.

---

## 1. Qué se observó, cómo y con qué límites

**Objeto observado:** aplicación móvil **"Click por Tepic"**, publicada en Google
Play bajo la identidad institucional *Gobierno de Tepic · La Ciudad que Sonríe*,
con el nombre de producto interno **"Reporte Ciudadano"**.

**Método:** recorrido completo de usuario nuevo (alta, verificación, levantamiento
de reporte, seguimiento, perfil y pago) documentado en **14 capturas de pantalla
del 12 de septiembre de 2026**, más la ficha pública de la app en Google Play.

**Límites que este documento declara por adelantado** (regla de honestidad,
`GLOSARIO_OFICIAL.md` §4):

- Se acompañó un archivo de video del mismo recorrido que **no pudo procesarse en
  el entorno de trabajo**; el análisis se sostiene únicamente en las capturas y en
  la ficha pública de la tienda. Si el video muestra pantallas adicionales, este
  diagnóstico se corrige por versión, no se reescribe en silencio.
- **No se auditó el backend, el contrato de servicio, el panel interno de la
  dependencia ni el flujo de atención posterior al reporte.** Todo lo que sigue
  describe la **superficie observable para el ciudadano**. Ausencia de evidencia
  no es evidencia de ausencia: donde no se vio, se dice que no se vio.
- **Ningún dato personal del recorrido se incorpora al repositorio** (regla dura
  9 de `CLAUDE.md`): ni teléfono, ni correos, ni el código de verificación
  recibido por SMS.

---

## 2. Lo que hay hoy — inventario funcional observado

| # | Capacidad observada | Detalle verificable en las capturas | Etiqueta |
|---|---|---|---|
| 1 | **Ficha pública en Google Play** | "Aplicación para generar reportes en la ciudad de Tepic"; categoría *Herramientas*; **3.2 ★ con 45 opiniones**; apto para todo público; **23 MB** | VERIFICADO (ficha pública, 12-09-2026) |
| 2 | **Identidad y alta de cuenta** | Login por teléfono, por correo o con Google. El alta pide **teléfono + nombre completo** | VERIFICADO |
| 3 | **Verificación por SMS (OTP)** | Código de 6 dígitos, validez de 5 minutos, remitido **desde un número de larga distancia no institucional (lada 834)** | VERIFICADO |
| 4 | **Catálogo de incidencias** | Cinco tipos visibles en la ficha: **bache en asfalto, luminaria apagada, semáforos, fuga de agua, desbordamiento de drenaje** | VERIFICADO |
| 5 | **Levantamiento de reporte** | Descripción libre + calle + número exterior + colonia + **fotografía** + **geolocalización con pin en mapa** (permiso *Precisa / Aproximada*) | VERIFICADO |
| 6 | **Seguimiento propio** | Pestaña "Tus reportes": *"Aquí podrás dar seguimiento a los reportes que has notificado al Ayuntamiento de Tepic"* | VERIFICADO (existencia de la pantalla) |
| 7 | **Notificaciones push** | Solicitud de permiso de notificaciones al primer arranque | VERIFICADO |
| 8 | **Perfil** | Nombre, teléfono, chip "1 cuenta vinculada", edición de perfil, cierre de sesión | VERIFICADO |
| 9 | **Pago de agua** | Pantalla "Pago en Línea" que **no cobra dentro de la app**: un botón *Continuar* abre el **portal público de SIAPA Tepic dentro de un WebView**, con su propio registro y su botón de WhatsApp | VERIFICADO |

**Arquitectura de navegación observada:** tres pestañas —**Denuncia · Mis reportes
· Perfil**—. Es, con precisión técnica, **una aplicación de captación de
incidencias de servicios públicos, más un enlace embebido al organismo operador
de agua**.

Eso **no es poco y no se minimiza aquí**: está desplegada, tiene base instalada
medible públicamente y resuelve un caso real de la fracción III del Art. 115
constitucional. Es infraestructura cívica en operación.

---

## 3. Lo que hay del lado del SOATM — inventario propio, sin inflar

Fuente: `docs/marco/modulos/INDICE.json` (29 módulos reales del código,
verificados contra `origin/main`) y `docs/orbe/modulos.json` (9 módulos
conceptuales del Orbe).

| Medida | Valor | Etiqueta |
|---|---|---|
| Módulos reales en código | **29** (13 en el C5 de gobierno, 16 en la app ciudadana) | VERIFICADO (`INDICE.json`) |
| Con servicio real detrás | **8** (`real`) | VERIFICADO |
| Parciales | **4** (`parcial`) | VERIFICADO |
| Maquetas | **15** (`maqueta`) | VERIFICADO |
| En riesgo | **2** (`riesgo`: pagos ciudadano, cartas municipales) | VERIFICADO |
| Módulos conceptuales del Orbe | 9 (1 desplegado, 1 piloto, 5 diseñados, 2 propuesta) | VERIFICADO (`modulos.json`) |
| Plano de control Context.OS | Vertical slice v0.1, **`LAB_MOCK`, apagado por defecto** (`VITE_CONTEXTOS_BRIDGE_ENABLED=false`) | VERIFICADO (`contextos/README.md`) |
| Marco normativo mapeado | 11 requisitos legales con archivo y flujo señalados | VERIFICADO (`MARCO_CUMPLIMIENTO_LNETB.md`) |
| App en tiendas / base instalada | **No existe** | VERIFICADO (ausencia) |

---

## 4. La comparación honesta — dos ejes, no uno

Comparar "quién tiene más" en un solo eje produce una conclusión falsa en
cualquiera de las dos direcciones. Hay **dos ejes distintos** y cada parte gana
uno.

### Eje A · Superficie funcional y marco normativo — ventaja del SOATM

| Capacidad | Click por Tepic | SOATM |
|---|---|---|
| Reporte de incidencias con foto y geolocalización | **Sí** | Sí (`services`, `parcial`) |
| Catálogo de trámites municipales | No observado | Sí (catálogo de servicios y pagos) |
| Expediente ciudadano único | No observado | Sí (`maqueta`/`parcial` según superficie) |
| Panel de gobierno (C5) | No observado | Sí — 13 módulos |
| Trazabilidad con folio y evidencia con checksum | No observado | Sí — `contextos/` (**`LAB_MOCK`**) |
| Consentimiento explícito ligado a la solicitud | No observado como acto propio del municipio | Sí — `ConsentGate` + contrato semántico |
| Interoperabilidad federal (CURP / Llave MX) | No observado | `Preparado` (falta convenio/credencial) |
| Salud con expediente y bitácora de accesos | No | **Sí — sobre Firestore real** (`salud`, `real`) |
| Predial / catastro (Art. 115 fr. IV) | No | Sí (`tesoreria`, `maqueta`) |
| Licencias (Art. 115 fr. VI) | No | Sí (`maqueta`) |
| Lenguas originarias (náayeri / wixárika) | No observado | Operativo parcial |
| Accesibilidad auditada | No observada | Lighthouse Accessibility 100 verificado |
| Código abierto y reutilizable por otros municipios | No | Sí (AGPL-3.0, `ESTRATEGIA_ESTANDAR_ABIERTO.md`) |

**Conclusión del eje A:** la afirmación *"lo construido del lado del SOATM es
mucho más grande"* **es sostenible en superficie funcional y en marco
normativo**, y se sostiene con inventario, no con adjetivos: 29 módulos contra
un caso de uso; 11 requisitos legales mapeados contra ninguno declarado
públicamente.

### Eje B · Madurez operativa y base instalada — ventaja del canal vigente

| Capacidad | Click por Tepic | SOATM |
|---|---|---|
| App nativa publicada en tienda | **Sí (23 MB)** | No |
| Base instalada de ciudadanos reales | **Sí — 45 opiniones públicas lo evidencian** | No declarada |
| Notificaciones push a dispositivo | **Sí** | No |
| Cadena de atención con una dependencia municipal | **Presumible** (no auditada) | **No demostrada** |
| Operación sostenida en producción | **Sí** | Parcial (2 servicios sobre Firestore real) |

**Conclusión del eje B:** el canal vigente **tiene lo único que no se puede
programar en una noche: gente que ya lo instaló y lo usa.** Quince de nuestros
29 módulos son maqueta y dos están en riesgo. Decir lo contrario en una mesa nos
costaría las diez afirmaciones verdaderas del eje A.

**Por eso la estrategia correcta es transformar.** No es una concesión
diplomática: es la lectura fría de los dos ejes. Quien tiene superficie sin base
instalada y se enfrenta a quien tiene base instalada sin superficie, gana
absorbiendo, no compitiendo.

---

## 5. Hallazgos de gobernanza del canal vigente

Cada hallazgo se expresa como **brecha entre lo observado y lo que la ley ya
ordena**, con cita solo de ordenamientos en estatus VERIFICADO de la
`BIBLIOTECA_LEGAL.md`. Ninguno es una imputación: son puntos que el SOATM puede
cerrar y que el proveedor actual, por sí solo, no tiene mandato para cerrar.

| # | Hallazgo observado | Por qué importa | Fundamento |
|---|---|---|---|
| H1 | **El consentimiento de identidad se otorga a un particular.** La pantalla de Google declara que *"Google permitirá que **Tidingo Software** acceda a esta información sobre ti"*, y remite a la **política de privacidad y condiciones del proveedor**, no a un aviso de privacidad del municipio | En un servicio público, el **responsable del tratamiento debe ser el sujeto obligado municipal**. Hoy el ciudadano contrata con el proveedor para hablarle a su gobierno | LFPDPPP (datos personales; consentimiento) — VERIFICADO. Régimen de sujetos obligados: `MARCO_CUMPLIMIENTO_LNETB.md` §3 |
| H2 | **Muro de registro previo.** *"Crea tu cuenta para poder levantar reportes ciudadanos"*: sin alta no hay reporte ni consulta | Tensiona la **gratuidad y no discriminación del canal digital**. El SOATM ya tiene por principio el modo visitante: consultar sin muro, identificarse solo cuando el acto lo exige | LNETB (federal) Arts. 2, 3, 66–76 — VERIFICADO; `MARCO_CUMPLIMIENTO_LNETB.md` fila 11 |
| H3 | **La identidad no es la que la ley señala.** Alta por SMS/Google/proveedor; **Llave MX no aparece** | La LNETB nombra **Llave MX** como identidad digital federal (Art. 3, fr. XVIII). Cada padrón paralelo es un expediente que después hay que reconciliar | LNETB Art. 3 fr. XVIII — VERIFICADO |
| H4 | **Una app por función, no un Portal Ciudadano Único.** El reporte vive aquí; el pago del agua vive en el portal de SIAPA dentro de un WebView; el resto de los trámites, fuera | La LNETB ordena **Portal Ciudadano Único** (Art. 3, fr. XXV). Multiplicar apps multiplica padrones, avisos de privacidad y puntos de falla | LNETB Art. 3 fr. XXV — VERIFICADO |
| H5 | **Sin expediente digital ni interoperabilidad observables.** El reporte se levanta, pero no se observa folio verificable, evidencia sellada ni cruce con otro sistema | La Ley de Gobierno Digital de Nayarit **obliga a los Ayuntamientos** a expediente digital e interoperabilidad — no lo sugiere | Ley de Gobierno Digital de Nayarit Arts. 2, 5 y 6 — VERIFICADO |
| H6 | **El cobro ocurre fuera del sistema.** "Pago en Línea" es un enlace embebido; el municipio no conserva folio unificado de la operación | Sin cobro trazable dentro del expediente no hay trazabilidad para fiscalización. Regla dura 8 del proyecto: **el monto se valida en el servidor** | `MARCO_CUMPLIMIENTO_LNETB.md` fila 6 (ASF/SFP); `CLAUDE.md` §3 regla 8 |
| H7 | **Cobertura parcial del Art. 115.** Cubre servicios (fr. I y III). **Quedan fuera predial/catastro (fr. IV) y licencias (fr. VI)** — donde está la recaudación | Es exactamente el hueco donde el municipio ya declaró estrategia: la Ley de Ingresos 2026 proyecta **+173 MDP** por predial atrasado, recargos y actualizaciones | CPEUM Art. 115 fr. IV y VI — VERIFICADO; Ley de Ingresos Tepic 2026 — VERIFICADO |
| H8 | **OTP desde número no institucional.** El código llega de una lada foránea sin identidad municipal verificable | Es el patrón exacto que usa la suplantación. La confianza en el canal es un activo público | Buenas prácticas; `PROTOCOLO_SEGURIDAD.md` |
| H9 | **Código cerrado.** No auditable ni reutilizable por los demás municipios | Contra el candado del estándar abierto: lo reutilizable por los 2,457 municipios es lo que se vuelve estándar nacional | `ESTRATEGIA_ESTANDAR_ABIERTO.md` §§2–3 |

**Nota deliberada de encuadre:** H1–H9 **no son culpa del proveedor**. Un
proveedor entrega el alcance que se le contrató, y el alcance contratado fue
*"una app de reportes"*. Lo que falta no es esfuerzo del proveedor: **falta el
sistema operativo municipal debajo**. Eso es precisamente lo que el SOATM es.

---

## 6. La coincidencia que decide la estrategia

El *vertical slice* v0.1 del **Context.OS Runtime** —el subsistema más
disciplinado del repositorio— implementa exactamente **un** caso de uso:

> reporte ciudadano de **bache o luminaria** en Tepic.

Es, literalmente, **el mismo caso de uso que la app en producción**, con dos de
sus cinco tipos de incidencia. Pero cada sistema tiene la mitad que al otro le
falta:

| Mitad | Quién la tiene hoy |
|---|---|
| Canal de captura con usuarios, foto, GPS y push | **Click por Tepic** (producción) |
| Plano de control: política determinística, consentimiento ligado a la solicitud, catálogo de servicios, evidencia con checksum SHA-256 y `correlationId` | **Context.OS Runtime** (`LAB_MOCK`, apagado por defecto) |

No hay que construir el canal: **existe y tiene gente adentro**. No hay que
construir el plano de control: **existe y está probado, aunque en laboratorio**.
Lo que falta es **el contrato entre ambos**. Eso no es un proyecto de obra
nueva: es una integración.

> Advertencia de honestidad, obligatoria en toda presentación de esto: los
> adapters del runtime responden `executionMode: 'LAB_MOCK'`; la evidencia es
> `integrityAssurance: 'CHECKSUM_ONLY'` —**no es firma digital ni prueba de
> inmutabilidad**— y nada de esto autoriza actos administrativos reales. Pasar
> de `LAB_MOCK` a producción es trabajo declarado, no una promesa cumplida.

---

## 7. Doctrina: transformar, no construir

**Definición operativa.** *Transformar* significa que el canal ciudadano vigente
**sigue funcionando, conserva su base instalada y no se le pide a nadie que
desinstale nada**; lo que cambia es **qué hay detrás de él**: deja de terminar en
una bandeja de incidencias y pasa a alimentar el expediente municipal.

Cinco consecuencias que se derivan y que este documento fija como criterio:

1. **No se propone cancelar la app ni desplazar al proveedor.** Se propone que el
   municipio adopte un **estándar de interoperabilidad** y que todo canal —el
   vigente y los que vengan— lo cumpla. Es el Candado 2 de
   `ESTRATEGIA_ESTANDAR_ABIERTO.md`: el ayuntamiento no puede decretar "usen
   ConnectX", pero **sí puede aprobar por acuerdo de cabildo sus estándares**.
2. **El proveedor actual no es el rival: es el primer integrador del estándar.**
   Un proveedor que ya opera y se vuelve interoperable es la mejor prueba pública
   de que el estándar funciona sin proveedor cautivo.
3. **El expediente, el consentimiento y la evidencia son del municipio**, vivan en
   la app que vivan. Ahí se corrigen H1, H5 y H6 sin tocar una sola pantalla del
   canal vigente.
4. **Ninguna capacidad nueva se entrega como app nueva.** Predial, licencias,
   salud y bienestar entran **por catálogo de servicios** del mismo portal
   (H4, H7).
5. **Lo que hoy es maqueta no se presenta como operativo por estar cerca de algo
   que sí opera.** Recibir flujo real de un canal externo no convierte
   automáticamente un módulo `maqueta` en `real`: el estado se actualiza en
   `INDICE.json` cuando hay servicio detrás, y no antes.

---

## 8. Ruta de absorción — cuatro fases, sin fechas inventadas

Ninguna fase lleva fecha: este documento no proyecta calendarios que no dependen
de nosotros. Cada fase declara **qué la habilita** y **cómo se comprueba**.

**F0 · Diagnóstico asentado** *(esta entrega)*
Queda por escrito qué existe, qué falta y con qué límites se observó.
*Comprobación:* este documento en `docs/marco/`, revisable y corregible por
versión.

**F1 · Estándar municipal de folio y expediente**
Redacción del estándar de interoperabilidad —estructura de folio verificable,
esquema de consentimiento, formato del expediente, API de pagos— para acuerdo de
cabildo.
*Habilitador:* facultad municipal existente; LNETB y Ley de Gobierno Digital de
Nayarit ya lo promueven. *Comprobación:* documento normativo publicado + la
implementación de referencia abierta.

**F2 · Conector del canal vigente**
El canal de captura publica cada incidencia contra el contrato semántico
(`shared/semantic/`), y el expediente, el consentimiento y la evidencia quedan en
infraestructura municipal.
*Habilitador:* F1 aprobada + voluntad del operador del canal. *Comprobación:*
una incidencia levantada en la app existente con folio consultable del lado
municipal.

**F3 · Superficie de gobierno con flujo real**
El C5 deja de mostrar únicamente datos `SIMULADO` en servicios públicos porque
recibe el flujo real que ya se está captando.
*Habilitador:* F2 en operación. *Comprobación:* actualización de estado en
`INDICE.json` con servicio real detrás, y banda `DEMO` retirada solo de lo que
efectivamente dejó de ser demo.

**F4 · Ampliación por catálogo, no por app**
Predial/catastro, licencias, salud y bienestar se incorporan como servicios del
catálogo.
*Habilitador:* F1–F3 + los convenios de datos de cada materia.
*Comprobación:* cada servicio nuevo con su ficha de módulo y su fundamento en la
Biblioteca Legal.

---

## 9. Cómo se dice esto en público

Forma recomendada, coherente con la tesis SOATM del `GLOSARIO_OFICIAL.md` §2:

> "Tepic ya dio el primer paso y tiene un canal digital con ciudadanos usándolo:
> eso hay que reconocerlo y conservarlo. Lo que la ley ordena —LNETB federal y
> Ley de Gobierno Digital de Nayarit— no es una app de reportes: es un expediente
> digital único, interoperable y trazable. Nuestra propuesta no es reemplazar lo
> que existe: es ponerle debajo el sistema que la ley ya mandaba, con estándares
> abiertos que cualquier proveedor pueda cumplir, incluido el actual."

**Lo que está prohibido decir** en cualquier material derivado de este documento:

- Que el canal vigente "no sirve" o "está mal hecho" — no se auditó su backend y
  su base instalada es real.
- Que el SOATM "ya opera" en las materias donde su estado es `maqueta`.
- Que la evidencia con checksum equivale a firma digital o inmutabilidad.
- Cualquier cifra de ahorro, cobertura o impacto sin fuente en la Biblioteca
  Legal o en el propio código.

---

## 10. Pendientes que este diagnóstico deja abiertos

- [ ] Procesar el video del recorrido y corregir por versión si aparecen pantallas
      no cubiertas por las 14 capturas.
- [ ] Alta en la `BIBLIOTECA_LEGAL.md` del régimen de datos personales en posesión
      de **sujetos obligados** (hoy referido en `MARCO_CUMPLIMIENTO_LNETB.md` §3
      pero sin ficha propia con estatus).
- [ ] Confirmar si el canal vigente publica su aviso de privacidad a nombre del
      municipio en algún punto no observado del flujo.
- [ ] Conocer, si el municipio lo autoriza, el panel interno de atención y el
      tiempo de respuesta real — es el dato que falta para medir la cadena
      completa, y hoy **nadie de los dos lados lo tiene publicado**.

---

*El canal ya existe. El sistema debajo, no. Esa frase es todo el diagnóstico:
por eso se transforma, no se construye.*
