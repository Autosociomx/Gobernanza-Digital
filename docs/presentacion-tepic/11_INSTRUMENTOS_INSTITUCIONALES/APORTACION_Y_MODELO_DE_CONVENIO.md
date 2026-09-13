# APORTACIÓN DEL PROPONENTE Y MODELO DE CONVENIO

## Qué aporta Nayarit Digital · ConnectX si se formaliza un instrumento

**Expediente de presentación institucional · Carpeta 11 — Instrumentos**
Cubre el entregable **B03** (`RESPONSABILIDADES_DEL_PROPONENTE.md` §3), hasta hoy
marcado 🔴 *por redactar*.

> ⚠️ **BORRADOR.** No constituye oferta vinculante, cotización, acto
> administrativo ni dictamen jurídico. No sustituye la revisión, modificación y
> emisión por parte del H. Ayuntamiento de Tepic ni la opinión de su Área
> Jurídica. Ninguna cifra económica aparece en este documento: el precio no se
> propone aquí, se determina en el procedimiento de contratación que la
> autoridad decida.

---

## Ficha estándar

| Campo | Respuesta |
|---|---|
| **Problema** | El expediente describe qué se propone hacer, pero no declara **qué aporta cada parte** ni bajo qué figura. Sin eso no hay instrumento que firmar |
| **Afectados** | Área Jurídica, Tesorería, Contraloría, Secretaría del Ayuntamiento, proponente |
| **Obligación/Necesidad** | Declarar el objeto de la aportación, su titularidad, su modelo económico y sus candados de salida |
| **Propuesta** | Cuatro capas de aportación + figura jurídica + cláusulas indispensables + declaración de conflicto de interés |
| **Evidencia** | Repositorio público, expediente documental, biblioteca legal |
| **Brecha** | **Cinco bloqueantes P0 abiertos** (§7). Sin cerrarlos, la aportación no puede formalizarse tal como se describe |
| **Responsable** | El Ayuntamiento decide figura, procedimiento y precio. El proponente solo declara qué puede aportar |
| **Estado** | 🟡 Borrador preparado — sin validez hasta emisión por autoridad |

---

## 1. El principio que ordena toda la aportación

> **No se vende el software. Se aporta el software y se contratan servicios sobre él.**

Esa frase no es retórica: es la que hace compatible el negocio con la tesis
pública del proyecto. Si se cobrara licencia, el municipio quedaría cautivo y la
narrativa de soberanía tecnológica sería falsa el primer día. Si se aporta la
licencia y se cobran servicios, el municipio puede despedir al proveedor **sin
perder el sistema** — y precisamente por eso el proveedor tiene que ser bueno
para conservarlo.

Consecuencia directa, que debe quedar escrita en el instrumento: **el
Ayuntamiento conserva el sistema aunque termine la relación.**

---

## 2. Las cuatro capas de aportación

### Capa 1 · El activo de software, bajo licencia abierta irrevocable

Lo que se aporta no es una promesa de desarrollo: es un cuerpo de software que
**ya existe y es verificable hoy** en el repositorio público, con su estado
declarado sin adornos.

| Aportación | Alcance verificable | Estado |
|---|---|---|
| Plataforma SOATM (29 módulos: 13 de gobierno, 16 ciudadanos) | `docs/marco/modulos/INDICE.json`, verificado contra `origin/main` | 🟢 Existe · **8 con servicio real, 4 parciales, 15 maqueta, 2 en riesgo** |
| Módulo de Salud con expediente, consentimiento y bitácora de accesos | `citasSaludService.ts`, `saludPerfilService.ts` sobre Firestore real | 🟢 El más maduro del sistema |
| Context.OS Runtime — política determinística, consentimiento ligado a la solicitud, evidencia con checksum | `contextos/`, `shared/semantic/` | 🟡 `LAB_MOCK`, apagado por defecto. **No autoriza actos administrativos** |
| Prototipo del flujo Constancia de Residencia | `demo/constancia-residencia/` | 🟡 Demo |
| Guardia de regresiones en CI (R1–R8) + cabeceras de seguridad | `scripts/verificar-regresiones.mjs`, `netlify.toml` | 🟢 Corre en cada cambio |
| Pulso Nayarit (auditoría cívica, backend propio) | `pulso-nayarit/` | 🟢 Desplegado |

**Lo que el instrumento debe decir sobre esta capa:** licencia **abierta,
irrevocable, no exclusiva, libre de regalías y perpetua** a favor del municipio,
con entrega del código fuente completo y sin cláusula que permita retirarla.
Ver bloqueante **P0-1**: hoy el repositorio **no tiene archivo de licencia**.

### Capa 2 · El estándar de interoperabilidad (la aportación que más vale)

No es código: es la especificación que permite que **cualquier proveedor**
—incluido el que hoy opera el canal ciudadano— se conecte al expediente
municipal.

- Estructura de folio verificable y expediente ciudadano
- Esquema de consentimiento y su ligadura a la solicitud
- Contrato semántico versionado (`shared/semantic/`) como implementación de referencia
- Formato de evidencia con checksum y `correlationId`

**Por qué importa al municipio:** es lo que convierte a Tepic en quien **escribe
la cancha** en vez de alquilarla. Es el Candado 2 de
`docs/marco/ESTRATEGIA_ESTANDAR_ABIERTO.md`: el Ayuntamiento no puede decretar
proveedor, pero sí puede aprobar por acuerdo de cabildo sus estándares.

**Por qué importa al proponente:** un estándar que otros adoptan sobrevive a los
trienios; un contrato, no.

### Capa 3 · Los servicios (lo único facturable)

| Servicio | Qué incluye |
|---|---|
| Implementación y despliegue | Puesta en marcha en infraestructura que el municipio elija |
| Integración | Conectores hacia sistemas municipales y, previo convenio de la autoridad, fuentes externas |
| Migración de datos | Scripts, validación y respaldo |
| Capacitación y certificación | Formación de servidores públicos con doble sello (municipio y sindicato), bajo pacto de cero despidos |
| Operación y soporte | Mesa de ayuda, niveles de servicio y escalamiento, mientras el municipio lo contrate |
| Evolución | Nuevos módulos del catálogo, que nacen abiertos igual que los anteriores |

**Candado que protege al municipio:** ningún servicio de esta capa puede
condicionar el uso del software de la Capa 1. Si termina el contrato de
servicios, el sistema sigue operando.

### Capa 4 · El marco documental de defensa

Es la capa que un ayuntamiento normalmente **no recibe** de un proveedor, y la
que lo protege ante la ASF, la Contraloría y la prensa:

- Biblioteca Legal con ordenamientos y estatus de verificación por artículo
- Matriz norma → artículo → evidencia (19 normas)
- Contra-auditoría LNETB con 25 objeciones adversariales ya corregidas
- Inventario honesto de limitaciones (`LIMITACIONES_CONOCIDAS.md`)
- Actas y bitácora institucional que no se borran, se corrigen con actas posteriores

---

## 3. Qué aporta cada parte (y qué hoy no aporta nadie)

| Aporta el proponente | Aporta el Ayuntamiento | Hoy no lo aporta nadie |
|---|---|---|
| Software con licencia abierta | Autorización y fundamento (Cabildo) | Convenio RENAPO / Llave MX |
| Estándar de interoperabilidad | Designación de enlace y firmante | Firma electrónica avanzada conforme a LFEA |
| Servicios de implementación y soporte | Datos y sistemas municipales | Auditoría de seguridad externa |
| Capacitación y certificación | Aviso de privacidad publicado como responsable | Auditoría de accesibilidad WCAG (**ver P0-3**) |
| Expediente documental y contra-auditoría | Determinación AIR/exención | Pruebas de carga y plan de respaldos |
| Transferencia de conocimiento | Presupuesto y procedimiento de contratación | Convenio con el organismo operador de agua |

La tercera columna es deliberada: **es lo que una propuesta deshonesta
presentaría como ya resuelto.** Aquí se declara abierta.

---

## 4. Figura jurídica — tres rutas, y quién decide

El proponente **no elige** la figura. La determina el Área Jurídica y, en su
caso, el Cabildo. Las tres rutas plausibles, con su consecuencia:

| Ruta | Cuándo aplica | Consecuencia |
|---|---|---|
| **A · Convenio de colaboración sin contraprestación** | Fase de laboratorio/piloto, sin datos reales y sin efectos jurídicos | La más limpia para empezar: no hay erogación, no hay adjudicación que impugnar. **Es la recomendada para la Etapa C del piloto** |
| **B · Donación / aportación del software + contrato de servicios** | Cuando el municipio decide operar en producción | Separa el activo (aportado) del servicio (contratado). Exige procedimiento de contratación conforme a la normativa aplicable |
| **C · Contrato de servicios integral** | Si el municipio prefiere un solo instrumento | Más simple de administrar, pero **debe conservar explícitamente la licencia irrevocable**, o reintroduce el cautiverio que el proyecto dice combatir |

> Cualquiera de las tres exige que el procedimiento de contratación lo determine
> la autoridad conforme a la normativa aplicable en materia de adquisiciones.
> Este documento **no opina** sobre adjudicación directa, invitación o
> licitación: no es materia del proponente.

---

## 5. Cláusulas indispensables (checklist para el Área Jurídica)

**Protegen al municipio:**

1. **Licencia irrevocable, perpetua, no exclusiva y libre de regalías** sobre el software aportado, con código fuente completo.
2. **Continuidad ante terminación:** el sistema sigue operando y el municipio conserva datos, código y documentación.
3. **Titularidad de los datos:** todos los datos ciudadanos son del municipio. El proponente es **encargado**, nunca responsable del tratamiento.
4. **Reversibilidad y salida:** exportación de datos en formatos abiertos, scripts de migración y periodo de acompañamiento a quien lo sustituya.
5. **No exclusividad:** el municipio puede contratar a otro proveedor sobre el mismo software, y otros proveedores pueden integrarse al estándar.
6. **Confidencialidad y datos personales** conforme al régimen de sujetos obligados, con obligación de notificación de incidentes.
7. **Prohibición de uso comercial de los datos** ciudadanos para cualquier fin del proveedor.

**Protegen al proponente:**

8. **Titularidad de marca y sello** (Nayarit Digital, ConnectX, la certificación): el código se licencia, la marca no.
9. **Límite de responsabilidad por el alcance declarado:** lo entregado en `LAB_MOCK` o en demo no produce efectos jurídicos y así queda asentado.
10. **Dependencias fuera de control:** los plazos que dependen de convenios de terceros (RENAPO, organismo de agua) no corren contra el proponente.
11. **Atribución de autoría** conforme a la licencia.

---

## 6. Declaración de conflicto de interés

Debe ir **en el instrumento**, no en una nota al pie:

> El proponente es, simultáneamente, **autor del estándar de interoperabilidad
> que se propone adoptar** y **oferente de los servicios** para implementarlo.
> Esa doble posición es un conflicto de interés que se declara de forma expresa.

Mitigaciones que el proyecto se impone a sí mismo:

- El estándar se publica **completo y abierto**, de modo que cualquier tercero pueda implementarlo sin contratar al proponente.
- El municipio conserva la facultad de modificar el estándar; el proponente no tiene voto en el Cabildo.
- La certificación de personas se emite con **doble sello** (municipio y sindicato), no por el proponente en solitario.
- Ningún material del proyecto puede insinuar exclusividad "por ley" — prohibición ya vigente en `ESTRATEGIA_ESTANDAR_ABIERTO.md` §4.

Declararlo es lo que impide que un tercero lo use como objeción. La objeción
existe; se responde por adelantado.

---

## 7. Bloqueantes P0 — lo que debe cerrarse ANTES de firmar

| # | Bloqueante | Evidencia | Por qué bloquea |
|---|---|---|---|
| **P0-1** | **El repositorio no tiene archivo de licencia.** `package.json` declara `"license": none`, `"private": true`, `"name": "react-example"` | Verificado en el repositorio | Sin licencia expresa, el código es "todos los derechos reservados": **legalmente lo contrario de lo que el proyecto afirma en público**. No se puede aportar licencia abierta que no existe. Ya está listado sin marcar en `PROTOCOLO_SEGURIDAD.md` §7 |
| **P0-2** | **Decisión de licencia no tomada por el titular** | `ESTRATEGIA_ESTANDAR_ABIERTO.md` la recomienda (AGPL-3.0); nadie la ha ejecutado | Otorgar una licencia libre es **irreversible** para las copias distribuidas. Es decisión exclusiva del titular de los derechos, no del equipo técnico |
| **P0-3** | **Contradicción interna de estados.** `MARCO_CUMPLIMIENTO_LNETB.md` declara accesibilidad "Verificado" y lenguas originarias "Operativo parcial"; `LIMITACIONES_CONOCIDAS.md` declara que nunca hubo auditoría WCAG y que no hay traducción de interfaz | Ambos documentos en el repositorio | Un revisor jurídico que lea los dos encuentra la inconsistencia. **Una afirmación desmentible tira las verdaderas** |
| **P0-4** | **Aviso de privacidad no publicado por el municipio** | `LIMITACIONES_CONOCIDAS.md` | Sin responsable del tratamiento declarado no debe tocarse un solo dato real |
| **P0-5** | **Sin auditoría de seguridad externa ni pruebas de carga** | `LIMITACIONES_CONOCIDAS.md` | Comprometerse a producción sin esto traslada al municipio un riesgo no medido |

---

## 8. Lo que este documento NO promete

- ❌ No promete cumplimiento legal: el cumplimiento **solo lo declara la autoridad**.
- ❌ No promete integración con RENAPO, Llave MX, catastro o el organismo de agua: **ninguna existe hoy** y todas dependen de convenios que el proponente no puede firmar.
- ❌ No promete firma electrónica avanzada: lo implementado es OTP demostrativo.
- ❌ No promete que los 29 módulos estén operativos: **15 son maqueta y 2 están en riesgo**.
- ❌ No promete plazos que dependan de terceros.
- ❌ No propone precio, ni figura de adjudicación, ni procedimiento de contratación.

---

*Borrador preparado como insumo para el Área Jurídica del H. Ayuntamiento de
Tepic. Septiembre 2026 · Nayarit Digital · ConnectX · SOATM.*
