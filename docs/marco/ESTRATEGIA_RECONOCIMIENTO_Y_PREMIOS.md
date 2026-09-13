# Estrategia de Reconocimiento y Premios

**Nayarit Digital · ConnectX · SOATM** · Documento estratégico · v1.0
Fecha: 2026-09-13 · Estatus: vigente

> **Conclusión por adelantado, para no hacer perder tiempo a nadie:** con lo que
> el proyecto tiene hoy, **no somos elegibles para el Premio IMPI a la Innovación
> Mexicana**, porque esa convocatoria premia **títulos de propiedad industrial
> otorgados** (patente, modelo de utilidad, diseño industrial) y este proyecto es
> software abierto protegido por derecho de autor, sin título alguno. La vía de
> reconocimiento que sí corresponde es otra, y el expediente para recorrerla ya
> está en un 80 % construido.

---

## 1. Verificación de la convocatoria — y su límite

| Dato | Contenido | Estatus |
|---|---|---|
| Convocante | Instituto Mexicano de la Propiedad Industrial (IMPI) | 🔵 POR VERIFICAR con fuente primaria |
| Nombre | Premio IMPI a la Innovación Mexicana 2026 | 🔵 POR VERIFICAR |
| Recepción de postulaciones | 5 de agosto – **15 de octubre de 2026** | 🔵 POR VERIFICAR |
| Requisito de elegibilidad | Personas inventoras de nacionalidad mexicana **con título vigente de patente, modelo de utilidad o diseño industrial otorgado entre el 1-ene-2025 y el 15-oct-2026** | 🔵 POR VERIFICAR — **es el requisito que decide todo** |
| Premio | 500 mil pesos al primer lugar de cada una de cuatro categorías | 🔵 POR VERIFICAR |
| Plataforma | `premioinnovacionmexicana.impi.gob.mx` | 🔵 POR VERIFICAR |

**Por qué todo va en 🔵 y no en 🟢:** la verificación se intentó contra las
fuentes oficiales (`gob.mx/impi` y `innovafest.mx`) y **el entorno de trabajo
tiene bloqueado el acceso a esos dominios**. Lo anterior proviene de resultados
de buscador y notas de prensa, no del PDF de bases. Conforme a la regla de oro de
la `BIBLIOTECA_LEGAL.md`, **esto no se afirma en público hasta descargar las
bases oficiales**. Primera acción de la lista de pendientes (§6).

Fuentes consultadas (secundarias): ficha del IMPI en gob.mx; nota de Quadratín;
convocatoria difundida por la Universidad de Sonora; portal InnovaFest.

---

## 2. Por qué el SOATM no entra por esa puerta

Tres razones, en orden de dureza:

1. **No hay título que presentar.** El proyecto no tiene patente, modelo de
   utilidad ni diseño industrial registrado. La postulación pide un título
   otorgado; no hay forma de improvisarlo en las semanas que restan al cierre.
2. **El software, como regla general, no es materia patentable en México** — se
   protege por derecho de autor. *(Afirmación de principio general: 🔵 pendiente
   de cita a nivel artículo en la Biblioteca Legal antes de usarse en público.)*
3. **La apertura y la patente se estorban entre sí.** La estrategia del proyecto
   es publicar el código y volverlo estándar de facto
   (`ESTRATEGIA_ESTANDAR_ABIERTO.md`). Divulgar antes de solicitar erosiona la
   novedad exigible a una invención. Perseguir un título por el premio
   **contradeciría la tesis central del proyecto** — y la tesis vale más que el
   premio.

### Lo que sí es registrable sin dañar la apertura

| Activo | Vía | Efecto |
|---|---|---|
| **Marca** (Nayarit Digital, ConnectX) y **sello de certificación** | Registro ante el IMPI | Ya está previsto en `ESTRATEGIA_ESTANDAR_ABIERTO.md` §3.4: *el código se licencia, la marca no* |
| **Obra de software** | Registro de obra ante INDAUTOR | Acredita autoría y fecha **sin cerrar el código**: compatible con licencia copyleft |

Ninguno de los dos habilita el Premio IMPI a la Innovación Mexicana —ese premia
invenciones—, pero ambos son el candado patrimonial correcto para este proyecto.

---

## 3. Las vías de reconocimiento que sí corresponden

| Vía | Por qué encaja | Qué exige de nosotros |
|---|---|---|
| **A · Premios de innovación en la gestión pública / gobierno abierto / gobierno digital** | Premian el *resultado público*, no el título de propiedad industrial. Es exactamente lo que el proyecto produce | Identificar convocatoria vigente y sus bases (🔵 pendiente) |
| **B · Desafíos de transformación digital tipo InnovaFest** | Los resultados de búsqueda indican desafíos nacionales con eje de transformación digital, sin requisito de patente | Verificar bases, elegibilidad y si admite postulación con contraparte municipal |
| **C · Reconocimiento federal como software público reutilizable (ATDT)** | **Es la vía de mayor valor estratégico**, y ya está escrita en `ESTRATEGIA_ESTANDAR_ABIERTO.md` §3: presentar el repositorio como reutilizable por los 2,457 municipios | Cerrar el checklist de apertura de `PROTOCOLO_SEGURIDAD.md` §7 |

**Recomendación:** perseguir **C como prioridad y A/B como oportunidad**. Un
reconocimiento federal de software público reutilizable no reparte 500 mil pesos,
pero instala el estándar — que es el objetivo declarado del proyecto. El premio
es un medio; el estándar es el fin.

---

## 4. Cómo se presentaría — la narrativa en cinco piezas

Sirve igual para A, B o C. Cada pieza se sostiene con evidencia **ya existente en
el repositorio**, no con adjetivos.

**Pieza 1 · El hallazgo, no la ocurrencia.**
> "No inventamos el sistema: la LNETB federal y la Ley de Gobierno Digital de
> Nayarit ya lo ordenan. Lo que hicimos fue descubrir que la ley ya lo mandaba y
> convertirlo en software abierto que le pertenece al municipio, no a un
> proveedor ni a una administración."

Es el diferenciador más difícil de copiar: casi toda postulación de gobierno
digital presenta una idea; ésta presenta **una obligación legal incumplida y su
implementación**. Evidencia: `BIBLIOTECA_LEGAL.md`, matriz norma → artículo →
evidencia (19 normas).

**Pieza 2 · Transformar en vez de construir.**
El municipio **ya tiene** un canal ciudadano en producción. La propuesta no lo
reemplaza: le pone debajo el expediente y la trazabilidad que le faltan, con un
estándar abierto que cualquier proveedor puede cumplir. Evidencia:
`TRANSFORMACION_VS_CONSTRUCCION.md`.

Es, además, la pieza que responde a la objeción que todo jurado hace —
*"¿por qué otro sistema más?"* — antes de que la formule.

**Pieza 3 · La honestidad como método, no como disculpa.**
El proyecto declara sus maquetas (15 de 29), sus módulos en riesgo (2), sus
limitaciones (`LIMITACIONES_CONOCIDAS.md`) y su contra-auditoría con 25
objeciones adversariales corregidas. **Ninguna postulación competidora va a
entregar su propia lista de fallas.** Bien presentado, deja de ser debilidad y
pasa a ser el rasgo distintivo: *"en esta plataforma hasta la maqueta es
honesta."*

**Pieza 4 · Replicabilidad, que es lo que de verdad puntúa.**
Código abierto + estándar publicado + implementación de referencia = cualquier
municipio lo despliega sin pagar licencia. Se presenta con la ruta de los 20
municipios que la Ley de Gobierno Digital obliga, y con el caso Tepic como
piloto. **Requiere P0-1 cerrado** (§5): sin licencia declarada, la replicabilidad
es una afirmación sin respaldo.

**Pieza 5 · Lo verificable, exhibido.**
Repositorio público auditable, Guardia de regresiones en CI, protocolo de
seguridad con incidentes documentados, actas que no se borran. Evidencia que el
jurado puede comprobar **sin pedirnos permiso**.

---

## 5. Mapeo criterio → evidencia → brecha

Criterios típicos de evaluación en este tipo de convocatorias
(🔵 confirmar contra las bases reales antes de usar esta tabla):

| Criterio probable | Evidencia que ya existe | Brecha honesta |
|---|---|---|
| **Originalidad** | Tesis SOATM (ley preexistente → software); Context.OS con política determinística y consentimiento ligado a la solicitud | El runtime está en `LAB_MOCK`, apagado por defecto |
| **Impacto público** | Módulo de Salud sobre Firestore real; Pulso Nayarit desplegado | **Sin usuarios municipales reales ni métricas de atención**: el impacto es potencial, no medido |
| **Replicabilidad** | Estándar abierto + documentación de despliegue | **P0-1: no hay licencia declarada en el repositorio** |
| **Sostenibilidad** | Modelo de servicios sin cobro de licencia; certificación con doble sello | Sin contrato ni presupuesto asignado |
| **Evidencia y trazabilidad** | Biblioteca Legal, actas, Guardia en CI, contra-auditoría | **P0-3: contradicción interna de estados** entre `MARCO_CUMPLIMIENTO_LNETB.md` y `LIMITACIONES_CONOCIDAS.md` |
| **Alianza institucional** | Expediente de presentación a Tepic (12 carpetas) | **Sin autorización del Ayuntamiento**: no hay respaldo institucional que exhibir |

Las dos brechas de la última columna en negrita son las mismas que bloquean la
firma de un instrumento (`APORTACION_Y_MODELO_DE_CONVENIO.md` §7). **No son dos
problemas: es uno solo, y cerrarlo sirve para las dos cosas.**

---

## 6. Lo que NO se afirma en una postulación

Un jurado que verifica una sola afirmación falsa descarta el expediente completo,
y con razón. Prohibido escribir, en cualquier formulario:

- ❌ "Cumple la LNETB" — el cumplimiento **solo lo declara la autoridad**.
- ❌ "Sistema en operación en el municipio de Tepic" — no hay autorización.
- ❌ "Interoperable con RENAPO / Llave MX / catastro / organismo de agua" — cero conexiones.
- ❌ "Firma electrónica avanzada" — es OTP demostrativo.
- ❌ "WCAG 2.1 AA verificado" — **en disputa interna** hasta cerrar P0-3.
- ❌ "Sello criptográfico" — `AuraCertificationSeal.tsx` es decorativo.
- ❌ "Blockchain / evidencia inmutable" — la evidencia es `CHECKSUM_ONLY`.
- ❌ Cualquier cifra de impacto, ahorro o cobertura sin fuente.

Fuente de esta lista: `presentacion-tepic/06_EVIDENCIA_TECNICA/LIMITACIONES_CONOCIDAS.md`.

---

## 7. Pendientes en orden de ejecución

1. **Descargar las bases oficiales** del Premio IMPI 2026 y de InnovaFest desde
   una red sin bloqueo, y convertir los 🔵 de §1 en 🟢 o descartar la vía.
2. **Decisión del titular sobre la licencia** (P0-1/P0-2): sin ella no hay
   replicabilidad defendible ni aportación contractual posible.
3. **Cerrar la contradicción de estados** (P0-3): auditar accesibilidad de verdad,
   o retirar la afirmación de los documentos que la declaran.
4. **Registro de marca (IMPI) y de obra (INDAUTOR)** — candado patrimonial que no
   depende de ningún premio ni de ninguna administración.
5. Identificar convocatoria vigente de innovación en gestión pública y su calendario.
6. Preparar la ruta ATDT conforme al checklist de apertura de
   `PROTOCOLO_SEGURIDAD.md` §7.

---

*Un premio se gana con evidencia verificable. Este proyecto tiene la evidencia;
lo que le falta es la licencia que la vuelve reutilizable y el acuerdo que la
vuelve institucional. Ese es el trabajo, no el formulario.*
