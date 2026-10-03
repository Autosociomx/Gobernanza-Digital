# 00 — ÍNDICE MAESTRO Y MATRIZ DE TRAZABILIDAD GENERAL

## Laboratorio Municipal de Simplificación y Digitalización
### Ayuntamiento de Tepic, Nayarit

**Versión:** 2.0 · 11 agosto 2026
**Proponente tecnológico:** Miguel Alexis Pérez Aguilar · AutosocioMX
**Proyecto:** Nayarit Digital · ConnectX — SOATM

---

## ⚠️ CLÁUSULA DE PROTECCIÓN INSTITUCIONAL

> El presente expediente constituye una propuesta técnica y documental para evaluación institucional. No constituye autorización, certificación, dictamen jurídico, acto administrativo ni reconocimiento de cumplimiento por parte del Ayuntamiento de Tepic.

---

## 📋 Mapa del expediente

```
docs/presentacion-tepic/
│
├── 00_INDICE_MAESTRO          ← Estás aquí
├── 01_PROBLEMA_PUBLICO        ← ¿Qué problema resolvemos?
├── 02_TRAMITE_PRIORIZADO      ← ¿Qué trámite analizamos?
├── 03_REINGENIERIA            ← ¿Cómo funciona hoy vs cómo proponemos?
├── 04_SOLUCION_DIGITAL        ← ¿Qué construimos?
├── 05_MARCO_JURIDICO          ← ¿Qué dice la ley? (corazón del expediente)
├── 06_EVIDENCIA_TECNICA       ← ¿Qué existe realmente en el código?
├── 07_GOBERNANZA              ← ¿Quién decide qué?
├── 08_PILOTO_TEPIC            ← ¿Cómo lo probamos?
├── 09_ALINEACION_ATDT         ← ¿Cómo se alinea con el Modelo Nacional?
├── 10_RIESGOS                 ← ¿Qué puede salir mal?
└── 11_INSTRUMENTOS            ← Borradores: convenio, acuerdo, AIR
```

---

## 🚦 Semáforo de evidencia (para todo el expediente)

| 🟢 VERIFICADO | 🟡 PREPARADO | 🔵 POR VERIFICAR | 🟠 REQUIERE AUTORIZACIÓN | 🔴 NO EXISTE |
|---|---|---|---|---|
| Evidencia primaria comprobable | Diseño, prototipo o demo | Requiere fuente oficial o autoridad | Depende de autorización institucional | No implementado actualmente |

---

## 🧩 MATRIZ DE TRAZABILIDAD GENERAL

Cada fila conecta: problema → obligación → solución → evidencia → brecha → responsable.

| ID | Problema | Obligación | Norma · Artículo | Solución propuesta | Evidencia actual | Estado | Brecha | Responsable |
|---|---|---|---|---|---|---|---|---|
| **TEP-001** | Trámite 100% presencial requiere 2 visitas y 4 documentos | Simplificación administrativa y digitalización | LNETB Art. 34; Ley de Gobierno Digital de Nayarit Arts. 2, 5, 6 | Flujo digital punta a punta para Constancia de Residencia | `demo/constancia-residencia/index.html` — prototipo funcional | 🟡 Preparado | Validación del proceso por el Ayuntamiento; datos reales del AS-IS | Área responsable del trámite |
| **TEP-002** | Se solicitan documentos que el municipio ya posee (comprobante domicilio, copia CURP) | No duplicidad de información | LNETB Art. 19; Art. 34, fr. III | Consulta interoperable a catastro y SIAPA en vez de solicitar comprobantes | Diseño de conectores documentado en Carpeta 04 | 🔴 NO EXISTE | Sin conexiones reales a catastro ni SIAPA | Dirección de Catastro / SIAPA Tepic |
| **TEP-003** | Identificación física (INE) requerida cuando la CURP contiene los mismos datos | Identidad digital única (CURP) | LNETB Art. 66 | CURP verificada electrónicamente como identidad digital | Validación sintáctica CURP en prototipo (algoritmo RENAPO) | 🟡 Demo | Conexión a RENAPO requiere convenio SEGOB | SEGOB/RENAPO + Ayuntamiento |
| **TEP-004** | La constancia se emite en papel sin mecanismo de verificación de autenticidad | Firma electrónica con validez jurídica | LNETB Art. 67; Ley de Firma Electrónica Avanzada | Firma institucional del funcionario autorizado (e.firma) | OTP + hash demostrativo en prototipo (NO es firma electrónica) | 🔴 NO EXISTE | Sin infraestructura PKI, sin HSM, sin designación de firmante | SAT + Ayuntamiento |
| **TEP-005** | Sin trazabilidad de quién hizo qué y cuándo en el trámite | Expediente electrónico único con auditoría | LNETB Art. 68 | Expediente digital con eventos inmutables por trámite | Firestore configurado; esquema de expediente diseñado pero no implementado | 🟡 Preparado | Implementar esquema en Firestore; política de conservación | Proponente (desarrollo) + Ayuntamiento (política) |
| **TEP-006** | Ciudadano no puede verificar si su constancia es auténtica | Verificación pública de documentos | LNETB Art. 69 (principio de transparencia) | QR de verificación conectado a endpoint público | QR estático en prototipo (sin backend de verificación) | 🟡 Demo | Endpoint de verificación no implementado | Proponente tecnológico |
| **TEP-007** | Sin medición de tiempos, costos ni satisfacción | Indicadores de desempeño | LNETB Art. 38, fr. V; Lineamientos del Modelo Nacional | KPIs definidos: tiempo, visitas, documentos, satisfacción | Indicadores definidos en Carpeta 03 | 🟡 Preparado | Sin línea base real (datos del Ayuntamiento) | Ayuntamiento (levantamiento AS-IS) |
| **TEP-008** | Sin determinación de si el trámite requiere AIR o exención | Mejora regulatoria | LNETB Arts. 35, 36, 38 | Minuta AIR preparada como insumo | `FICHA_AIR_O_EXENCION.md` en Carpeta 11 | 🔵 POR VERIFICAR | Determinación formal del área de mejora regulatoria | Mejora regulatoria municipal |
| **TEP-009** | Datos personales sin aviso de privacidad publicado | Protección de datos | LGPDPPSO | Sistema diseñado con minimización, hash de CURP, consentimiento | Minuta de aviso de privacidad en Carpeta 05 | 🟡 Preparado | Publicación del aviso por la Unidad de Transparencia | Unidad de Transparencia municipal |
| **TEP-010** | Sin instrumento jurídico que autorice el piloto | Autorización institucional | Ley Orgánica Municipal de Nayarit; normativa municipal | Propuesta de Acuerdo de Cabildo o acto administrativo del titular | Borrador en Carpeta 11 | 🔴 NO EXISTE | El Ayuntamiento debe determinar el instrumento y aprobarlo | Cabildo / Presidencia Municipal |
| **TEP-011** | Sin conexión a fuentes oficiales de identidad y datos | Interoperabilidad gubernamental | LNETB Art. 71; Lineamientos del Modelo Nacional | Conectores a RENAPO, catastro, SIAPA (diseñados, no implementados) | Arquitectura documentada; cero endpoints en server.ts | 🔴 NO EXISTE | Convenios, autorizaciones, APIs, credenciales | Ayuntamiento + dependencias + ATDT |
| **TEP-012** | El trámite puede tener costo según Ley de Ingresos | Gratuidad o costo reglado | LNETB Art. 34; Ley de Ingresos Tepic 2026 | Determinar si la constancia tiene derechos y habilitar pago digital | Stripe configurado en server.ts (sandbox) | 🔵 POR VERIFICAR | Verificar costo en Ley de Ingresos; autorizar Stripe | Tesorería Municipal |

---

## 📊 Resumen de trazabilidad

| Estado | Cantidad |
|---|---|
| 🟡 Preparado / Demo | 5 |
| 🔴 NO EXISTE | 3 |
| 🔵 POR VERIFICAR | 2 |
| 🟡 + 🔵 (combinados) | 2 |

**12 problemas/obligaciones identificados. Ninguno marcado como 🟢 VERIFICADO en su totalidad.** Esto es correcto — el proyecto está en fase de propuesta, no de implementación autorizada.

---

## 🗺️ Ruta de lectura recomendada

**Para Presidencia Municipal:** `00_INDICE_MAESTRO` → esta página es suficiente para entender el expediente en 5 minutos.

**Para el Área Jurídica:** `05_MARCO_JURIDICO/05.01_MATRIZ_NORMA_ARTICULO_EVIDENCIA.md` → 19 normas analizadas con cadena de evidencia.

**Para Tecnologías/Sistemas:** `06_EVIDENCIA_TECNICA` → inventario real del repositorio, lo que existe y lo que no.

**Para Mejora Regulatoria:** `11_INSTRUMENTOS_INSTITUCIONALES/FICHA_AIR_O_EXENCION.md` → minuta AIR.

**Para la dependencia responsable del trámite:** `01_PROBLEMA_PUBLICO` + `03_REINGENIERIA` → el problema y la propuesta de simplificación.

---

## 🔑 Conceptos clave (Glosario Oficial)

| Término | Significado en este expediente |
|---|---|
| **Laboratorio** | Prototipo en entorno controlado — sin efectos jurídicos |
| **Piloto** | Prueba autorizada con alcance limitado — requiere aprobación del Ayuntamiento |
| **Producción** | Sistema oficialmente operativo — solo después de todas las autorizaciones |
| **SOATM** | Sistema Operativo de Atención de Trámites Mexicanos — arquitectura del proyecto |
| **Proponente** | Quien desarrolla y presenta la propuesta (no es autoridad) |
| **Sujeto obligado** | El Ayuntamiento de Tepic — quien debe cumplir la LNETB |

---

*Índice maestro del expediente de presentación institucional.*
*No constituye autorización ni dictamen de cumplimiento.*
