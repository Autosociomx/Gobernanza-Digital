# Escenarios estratégicos — visión CEO

**Convergencia: Nayarit ID · Llave MX · Hospital central CURP / expediente médico · Identidad digital infantil**

> Lectura ejecutiva: no tenemos cuatro proyectos, tenemos **una sola columna
> vertebral de identidad anclada al CURP** con cuatro expresiones. El que
> entienda esto primero define el estándar nacional; el que lo entienda
> tarde, lo renta.

## 1. El tablero: los cuatro activos

| Activo | Estado actual | Qué aporta a la columna vertebral |
|---|---|---|
| **Nayarit ID (RUTA Digital)** | Diseñado en el ecosistema Nayarit Digital: una cuenta ciudadana para predial, obras, reportes y salud | El **laboratorio vivo**: un estado completo donde probar identidad + servicios reales con gobierno aliado |
| **Llave MX (federal, CURP)** | Identidad digital del Gobierno de México para personas adultas, anclada al CURP | La **autenticación del tutor**: el padre o madre ya tendrá (o tiene) una identidad federal; no hay que crearle otra |
| **Hospital central CURP + expediente médico** | Ya construido y verificado en este repo (`MODULO_SALUD_CURP.md`): perfil de salud ligado a CURP, portal de citas piloto Tepic, reglas de acceso probadas 8/8 | El **caso de uso que la gente ama**: nadie pelea contra un expediente que evita repetir estudios y cargar papeles |
| **Identidad digital infantil (SINISI / Llave de Protección)** | Propuesta aterrizada en este módulo: doble anonimato, consentimiento parental, ficha legislativa | El **foso defensivo (moat)**: la capa que ningún privado puede replicar, porque exige validación presencial estatal del vínculo tutor-menor |

La tesis: **el CURP es el eje, el tutor es la llave, el menor es el
protegido, y la salud es la puerta de entrada emocional.** La verificación de
edad para redes sociales es el argumento político; el expediente médico
infantil es el argumento que convence a una madre en dos minutos.

## 2. Escenario A — "Columna vertebral" (apuesta base)

**Qué pasa:** Los cuatro activos se integran deliberadamente. El tutor se
autentica con Llave MX; la Llave de Protección infantil cuelga de esa
identidad; el expediente médico del menor queda protegido por el
consentimiento parental; Nayarit ID es la implementación de referencia
estatal.

**Movimientos:**
1. En Tepic, el perfil de salud CURP ya existente agrega el **modo pediátrico**:
   el expediente de un menor solo se abre con la llave del tutor (misma
   lógica de doble anonimato: el hospital ve el expediente, terceros ven nada).
2. Nayarit ID incorpora la "capa infancia": la misma cuenta del tutor gestiona
   beca, citas médicas del hijo y autorizaciones digitales.
3. Con el piloto funcionando, la propuesta federal (SINISI) se presenta no
   como idea sino como **sistema operando con métricas**.

**Resultado a 24 meses:** Nayarit se vuelve el estado que el resto copia;
la conversación federal se negocia desde la fuerza ("ya funciona") y no desde
el papel.

## 3. Escenario B — "Pediatría protegida" (el caballo de Troya bueno)

**Qué pasa:** Se lidera con salud, no con redes sociales. El primer contacto
de la familia con la identidad infantil no es "controla el Instagram de tu
hijo" sino **"la cartilla de vacunación, los estudios y el historial de tu
hijo, en tu teléfono, y nadie más puede verlos sin tu llave"**.

**Por qué es la jugada emocionalmente correcta:**
- La verificación de edad genera debate (libertad, vigilancia); el expediente
  pediátrico genera gratitud. Se construye la base de usuarios con lo segundo
  y se activa lo primero sobre esa base ya instalada.
- El hospital central con CURP ya resuelve el caso real documentado en este
  repo: estudios entregados por WhatsApp sin control. Con menores, ese
  desorden no es ineficiencia — es un riesgo de protección infantil.
- Cada consulta pediátrica, cada vacuna, cada triaje de TEPICTU Salud se
  convierte en un momento de activación de la Llave.

**Riesgo propio del escenario:** mezclar datos de salud con identidad exige
separación estricta de bases (la plataforma de verificación de edad JAMÁS
toca el expediente; comparten llave del tutor, no datos). Ese candado va en
el articulado y en la arquitectura.

**Resultado a 24 meses:** cientos de miles de familias con la Llave activa
por razones de salud; la adopción de la capa de redes sociales es un clic,
no una campaña.

## 4. Escenario C — "Montarse en Llave MX" (jugada federal)

**Qué pasa:** No competimos con la identidad federal; nos volvemos su módulo
de infancia. Llave MX autentica adultos; **nadie ha resuelto la identidad de
los 38 millones de menores** — no pueden firmar, no tienen INE, y su
biometría es legalmente intocable para privados. SINISI es exactamente esa
pieza faltante.

**Movimientos:**
- La ficha legislativa ya lo prevé: la ley reconoce "el sistema oficial que
  cumpla el estándar de doble anonimato" — eso permite que SINISI viva dentro
  de Llave MX sin reescribir la ley.
- ConnectX/Nayarit Digital se posiciona como **integrador certificado y
  implementación de referencia**, no como dueño del padrón (el padrón siempre
  es del Estado — eso es lo que hace la propuesta políticamente aceptable).
- Modelo B2G: licenciamiento de los módulos estatales (mesas de Ciudadanía
  Digital, panel de fiscalías, capa pediátrica hospitalaria) a las 32
  entidades, congruente con el esquema SaaS gubernamental ya definido para
  ConnectX.

**Resultado a 24 meses:** el estándar es federal, la implementación de
referencia es nuestra, y cada estado que se suma licencia los módulos
operativos.

## 5. Escenario D — Riesgos existenciales (lo que un CEO no delega)

| Riesgo | Gravedad | Seguro contratado |
|---|---|---|
| **Fuga de datos de salud infantil** | Existencial — un solo incidente mata el proyecto y la marca | Nunca ser dueños del dato: el expediente vive en infraestructura del Estado; nosotros certificamos e integramos. Reglas de acceso ya probadas con tests (8/8) como cultura, no como excepción |
| **La federación construye sin nosotros** | Alta — Llave MX podría absorber la idea | Estándar abierto (`ESTRATEGIA_ESTANDAR_ABIERTO.md`): si el estándar es nuestro y es público, cualquier implementación federal nos valida en lugar de desplazarnos |
| **Cambio político 2027** | Alta | Anclar en Ley General (no en programa de gobierno) + caso de uso de salud que ningún gobierno entrante quiere apagar |
| **Percepción "el Estado vigila a los niños"** | Media-alta | Doble anonimato auditable + código abierto + prohibición penal de uso indebido del padrón. La narrativa correcta: *protegemos al niño DE las plataformas, no lo vigilamos* |
| **Mezcla indebida salud ↔ verificación de edad** | Media | Separación arquitectónica de bases con candado en ley; auditoría independiente anual |

## 6. La jugada recomendada

**B dentro de A, negociando C, asegurados contra D.** En secuencia:

1. **Hoy → 6 meses:** modo pediátrico del perfil de salud CURP en Tepic
   (extensión natural de lo ya construido). La llave del tutor nace aquí.
2. **6 → 12 meses:** capa infancia en Nayarit ID; los foros (NL, Chiapas,
   Guerrero) y la iniciativa federal corren en paralelo con Nayarit como
   demostración viva.
3. **12 → 24 meses:** integración con Llave MX como módulo de infancia;
   piloto SINISI en los 3 estados; licenciamiento B2G del stack estatal.
4. **Siempre:** el dato del niño es del Estado y de su familia. Nosotros
   somos el estándar, la implementación de referencia y el integrador — ese
   es el negocio defendible y la posición políticamente sostenible.

**La frase para el pitch:** *"Llave MX identifica a los adultos. Nadie ha
resuelto a los niños. Nosotros ya lo tenemos funcionando en un hospital de
Tepic."*
