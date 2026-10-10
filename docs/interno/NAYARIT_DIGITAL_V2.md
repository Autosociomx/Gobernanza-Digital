# 🧩 El ecosistema Nayarit Digital: una plataforma, todas las aplicaciones

**Una sola cuenta ciudadana (RUTA Digital)**
Con tu CURP o tu teléfono entras a cualquier servicio: pagas predial, reportas una fuga, consultas una obra o recibes orientación médica. Todo queda en tu historial.

---

## 1. Tesorería Digital (antes "Tesorería Municipal")
**Qué hace:**
- Pago de predial, agua, multas y licencias 100% en línea.
- Recordatorios automáticos por WhatsApp y correo.
- Generación de líneas de captura y recibos fiscales.

**Integración con el ecosistema:**
- Los pagos se reflejan automáticamente en el panel ciudadano (el usuario ve sus adeudos y su historial).
- Los reportes de Servicios Públicos pueden derivar en órdenes de trabajo con costo (ej. reposición de medidor) que se pagan aquí.

---

## 2. Trazabilidad de Obras (antes "Obras Públicas")
**Qué hace:**
- Cada obra pública tiene su ficha: contrato, empresa, monto, fechas.
- Avance semanal con fotos y porcentaje real.
- Alertas automáticas si hay retraso o sobrecosto.

**Integración:**
- Los ciudadanos ven las obras cercanas a su domicilio.
- Los reportes ciudadanos de Servicios Públicos pueden elevarse a obra si se requiere intervención mayor.
- El panel de Tesorería muestra cuánto se ha pagado a contratistas vs. avance real (control de recaudación vinculado a obra pública).

---

## 3. Servicios Públicos Inteligente (antes "Servicios Públicos")
**Qué hace:**
- Reporte ciudadano por WhatsApp, chat web o app.
- IA clasifica: bache, luminaria, basura, fuga, poda, etc.
- Seguimiento en tiempo real: Recibido → Asignado → En proceso → Resuelto.
- El ciudadano recibe notificaciones automáticas.

**Integración:**
- Si el reporte requiere obra mayor, pasa a Trazabilidad de Obras como solicitud de intervención.
- Si el reporte tiene costo para el ciudadano (ej. reparación de toma domiciliaria), se genera un pago en Tesorería Digital.
- Los reportes médicos por síntomas se derivan a TEPICTU Salud.

---

## 4. TEPICTU Salud (triaje con IA sin internet)
**Qué hace:**
- Chat de orientación médica que funciona sin conexión (ideal para colonias con mala señal).
- Síntomas → nivel de urgencia → recomendación (casa, centro de salud u hospital).
- Diseñado para DIF y escuelas.

**Integración:**
- El ciudadano accede desde la misma cuenta del ecosistema.
- Los casos de salud pública (brotes, desnutrición, etc.) generan alertas para Bienestar Social.
- Si requiere traslado o apoyo económico, se puede vincular con programas sociales (y su pago vía Tesorería Digital si aplica).

---

## 5. Asistente IA Ciudadano (el cerebro del ecosistema)
**Qué hace:**
- Responde 24/7 en español, wixárika y cora.
- Sabe de trámites, requisitos, horarios, ubicaciones.
- Puede ejecutar acciones: "Págame el predial", "Reporta un bache en mi calle", "¿En qué va la obra del puente?".

**Integración:**
- Es la única interfaz conversacional de todas las aplicaciones.
- El ciudadano no necesita saber si su consulta es de Tesorería, Obras o Salud: el asistente redirige internamente.
- Se conecta en tiempo real a las APIs de cada módulo.

---

## 6. Bienestar Social (conector humano)
**Qué hace:**
- Panel para trabajadores sociales y DIF.
- Gestión de programas: despensas, becas, apoyos.
- Seguimiento de casos vulnerables detectados por TEPICTU Salud o Servicios Públicos (ej. adulto mayor sin agua reportada 3 veces).

**Integración:**
- Los beneficiarios se validan automáticamente con Tesorería Digital (ingreso fiscal indirecto o no pago de predial).
- Los apoyos pueden entregarse como créditos en el ecosistema (ej. descuento en predial por participar en limpieza de colonia).

---

### 📱 ¿Cómo se ve todo esto para un ciudadano?
**Un solo acceso:** su número de WhatsApp o su cuenta web con CURP.

*Ejemplo real:*
> Doña María escribe: "Me duele el pecho y no tengo señal en mi celular".
> → **TEPICTU Salud** (sin internet) le dice: "Ve al centro de salud más cercano. ¿Quieres que avisemos a tu familiar?".
> → Al llegar al centro, el médico ve el triaje en el sistema.
> → Si el diagnóstico requiere medicamento no disponible, el doctor genera un reporte que se vuelve Solicitud de Insumos en **Bienestar Social**.
> → María puede consultar después desde su casa: "**Asistente**, ¿mi reporte médico fue atendido?".

### 🧭 Resumen visual para el documento

| Aplicación | Rol en el ecosistema |
| :--- | :--- |
| **Tesorería Digital** | Pagos y recaudación |
| **Trazabilidad de Obras** | Control de obra pública |
| **Servicios Públicos Inteligente** | Reportes y seguimiento |
| **TEPICTU Salud** | Salud preventiva sin internet |
| **Asistente IA Ciudadano** | Interfaz única para todo |
| **Bienestar Social** | Gestión de apoyos y casos vulnerables |

**Todos comparten:**
✅ Cuenta ciudadana única (CURP/teléfono)
✅ Historial unificado
✅ Notificaciones por WhatsApp
✅ Panel ciudadano web
✅ API común para gobierno


<br><br>
---
<br><br>


# PROPUESTA DE INFRAESTRUCTURA DIGITAL PARA LA GOBERNANZA DEL SIGLO XXI
## Nayarit Digital: El Sistema Operativo Municipal de Tepic
**Versión 2.0 – Documento de política pública, arquitectura tecnológica y modelo de datos**

---

### Índice
1. Hipótesis central y marco conceptual
2. Gobernanza de datos y cumplimiento normativo
3. Índice de Madurez Digital Municipal (IMDM)
4. Arquitectura del ecosistema: del trámite al dato
5. El activo estratégico: Observatorio Digital de Nayarit
6. Versiones diferenciadas para audiencias clave
7. Hoja de ruta estratégica: de Tepic a Nayarit y más allá

---

### 1. Hipótesis central y marco conceptual

**Hipótesis explícita**
> "La digitalización municipal basada en interoperabilidad, inclusión y datos abiertos incrementa simultáneamente la recaudación, la eficiencia administrativa y la confianza ciudadana."

Esta hipótesis es falsable y será probada con los datos generados por la propia plataforma durante los primeros 12 meses de operación. Los indicadores de la Sección 2 (política pública) han sido diseñados para contrastarla empíricamente.

**Marco conceptual**
Nayarit Digital no es un conjunto de aplicaciones. Es una infraestructura institucional que reposa sobre tres pilares:

| Pilar | Definición operativa |
| :--- | :--- |
| **Interoperabilidad** | Todos los módulos comparten lenguaje, API y estándares. No hay silos de información. |
| **Inclusión digital** | El sistema no excluye a quien no tiene internet, smartphone o alfabetización digital. Kioscos, asistencia humana y modo offline garantizan acceso universal. |
| **Datos abiertos por diseño** | Toda métrica agregada y no personal es pública y consultable en tiempo real. La transparencia es una característica, no un añadido. |

---

### 2. Gobernanza de datos y cumplimiento normativo

**2.1 Titularidad y roles**

| Concepto | Responsable | Fundamento |
| :--- | :--- | :--- |
| **Propietario de los datos** | Municipio de Tepic | Ley General de Protección de Datos Personales (LGPDP) |
| **Procesador tecnológico** | ConnectX (como encargado del tratamiento) | Contrato de servicios específico |
| **Responsable de seguridad** | Dirección de Informática Municipal | Reglamento interior |
| **Supervisor ciudadano** | Comité de Transparencia y Datos Abiertos (nuevo, propuesto) | Participación social |

**2.2 Clasificación de datos y medidas**

| Tipo de dato | Ejemplo | Tratamiento | Plazo de conservación |
| :--- | :--- | :--- | :--- |
| **Personales sensibles** | Diagnósticos de TEPICTU Salud | Cifrado, acceso solo a personal DIF autorizado | 90 días (anonimización automática) |
| **Personales no sensibles** | CURP, teléfono, dirección | Cifrado, usado solo para autenticación y notificaciones | Mientras dure la relación ciudadana |
| **Anonimizados / agregados** | Tiempo promedio de resolución de baches, recaudación por colonia | Públicos en el Observatorio Digital | Indefinido (bien público) |

**2.3 Cumplimiento legal explícito**
- **LFPDPPP** (Ley Federal de Protección de Datos Personales en Posesión de Particulares) aplica a ConnectX como procesador.
- **Ley General de Transparencia** – todos los dashboards públicos cumplen con la obligación de datos abiertos.
- **Lineamientos de IA Confiable** (estándar ISO/IEC 42001:2023) aplicados al asistente ciudadano: explicabilidad, no sesgo, supervisión humana.

**2.4 Aviso de privacidad integrado**
El ciudadano, al usar el asistente IA por primera vez, recibe un mensaje claro:
> “Tus datos están seguros. Solo los usa el Municipio de Tepic para atender tu trámite. Nunca los vendemos ni los usamos para publicidad. Puedes borrar tu historial en cualquier momento diciendo ‘olvida mis datos’.”

---

### 3. Índice de Madurez Digital Municipal (IMDM)

**3.1 ¿Qué es?**
Un puntaje de 0 a 100 que mide el nivel de digitalización, transparencia y participación ciudadana de Tepic. Se calcula automáticamente con los datos de la plataforma y se actualiza mensualmente.

**3.2 Dimensiones y ponderación**

| Dimensión | Peso | Indicadores base (ejemplos) |
| :--- | :--- | :--- |
| **Trámites digitales** | 25% | % trámites disponibles en línea / % realizados en línea |
| **Transparencia activa** | 20% | % de obras con avance público / % de presupuesto ejecutado visible |
| **Participación ciudadana** | 15% | % de reportes ciudadanos respondidos / tiempo de respuesta |
| **Interoperabilidad** | 15% | Número de módulos integrados (0-6) / API públicas documentadas |
| **Inclusión digital** | 15% | % de trámites accesibles sin internet / número de kioscos / lenguas originarias atendidas |
| **Analítica e IA** | 10% | % de decisiones asistidas por datos / dashboards automáticos |

**3.3 Escala de madurez**

| Rango | Nivel | Implicación política |
| :--- | :--- | :--- |
| 0-20 | Tradicional | Trámites en papel, opacidad |
| 21-40 | Emergente | Algunos trámites en línea, datos dispersos |
| 41-60 | Digital básico | Mayoría de trámites en línea, transparencia pasiva |
| 61-80 | Gobierno inteligente | Interoperabilidad, participación, IA asistiva |
| 81-100 | Gobernanza aumentada | Datos abiertos en tiempo real, ciudadanía co-diseña |

**3.4 Línea base y meta**
- Línea base estimada de Tepic hoy: 22 puntos (Emergente bajo)
- Meta a 12 meses con Nayarit Digital: 68 puntos (Gobierno inteligente)

> “Recibimos Tepic con 22 puntos de madurez digital y hoy tiene 78.” – Esta frase, verificable con datos públicos, es el mejor argumento político.

---

### 4. El activo estratégico: Observatorio Digital de Nayarit

**4.1 ¿Qué es?**
Un portal público, alimentado en tiempo real por la plataforma, que visualiza:
- Mapa de calor de reportes ciudadanos (baches, luminarias, basura) por colonia.
- Tablero de obra pública con avance financiero y físico.
- Recaudación por tipo de impuesto y zona, anonimizada.
- Salud comunitaria: tendencias de síntomas reportados (sin identificar personas).
- Indicadores de desempeño municipal (tiempos de respuesta, satisfacción).

**4.2 Por qué es el verdadero activo**
El software se vuelve obsoleto. El dataset longitudinal (años de datos confiables a nivel colonia) es único. Ese conjunto de datos permite:
- Políticas públicas basadas en evidencia (ej. dónde poner un nuevo centro de salud según reportes de síntomas).
- Atracción de inversión (mostrar a empresarios la trazabilidad de obras y seguridad jurídica).
- Monitor ciudadano independiente – periodistas, académicos y oposición pueden ver los mismos datos que el gobierno.

**4.3 Escalabilidad**
Este modelo, replicado en otros municipios de Nayarit, construiría el Observatorio Digital de Nayarit – una inteligencia territorial estatal. Ningún otro estado de México tendría algo similar.

---

### 5. Versiones diferenciadas para audiencias clave

**5.1 Versión Política (10 páginas)**
- **Formato:** Reporte ejecutivo con gráficos, fotos de la plataforma, citas de alcaldes de otros municipios (futuro).
- **Contenido:** Hipótesis, resultados esperados, beneficio ciudadano, visión estatal, índice de madurez, observatorio.
- **Audiencia:** Presidenta municipal, síndico, regidores, jefes de prensa y comunicación social.

**5.2 Versión Técnica (arquitectura, APIs, seguridad)**
- **Formato:** Documento de ingeniería con diagramas de flujo, especificaciones de API, modelos de datos, plan de contingencia.
- **Contenido:** Capas de software, estándares de interoperabilidad, cifrado, respaldos, SLAs, costos de infraestructura cloud.
- **Audiencia:** Dirección de Informática, Contraloría (para auditoría tecnológica), posibles licitadores futuros.

**5.3 Versión Académica (formato tesis)**
- **Formato:** Papel de investigación tipo CIDE o FLACSO.
- **Contenido:** Marco teórico (gobernanza digital, inclusión, economía política de datos), hipótesis formal, metodología cuasiexperimental, diseño de indicadores, revisión de literatura, anexo con instrumentos.
- **Audiencia:** Universidades (UAN, ITTepic), organismos internacionales (BID, CEPAL), fondos de innovación pública.

*(Nota: Las tres versiones cuentan la misma historia, pero para audiencias distintas. ConnectX puede entregar las tres en un plazo de 15 días hábiles.)*

---

### 6. Hoja de ruta estratégica: de Tepic a Nayarit y más allá

**Evolución natural del proyecto**

| Fase | Nombre | Alcance | Indicador de éxito |
| :--- | :--- | :--- | :--- |
| 1 (2026-2027) | Trámite Digital Tepic | módulos piloto | 60% de trámites en línea |
| 2 (2027-2028) | Gobierno Digital Tepic | ecosistema completo | IMDM > 68 puntos |
| 3 (2028-2029) | Gobierno Inteligente | Expansión a 3 municipios de Nayarit | Observatorio Digital de Nayarit lanzado |
| 4 (2029-2030) | Inteligencia Territorial | 10+ municipios, alianza con CONACYT | Dataset público reconocido como política de estado |
| 5 (2031+) | Observatorio Nacional de Datos Públicos | Replicación en otros estados | Modelo adoptado por la Conferencia Nacional de Gobernadores (CONAGO) |

**Modelo de negocio de ConnectX en esta evolución**

| Fase | Ingresos de ConnectX | Activo construido |
| :--- | :--- | :--- |
| 1-2 | Contrato de desarrollo y soporte | Código base + documentación |
| 3-4 | Consultoría para expansión + capacitación | Modelo de interoperabilidad estatal |
| 5 | Licencia de uso del Observatorio (opcional) + servicios de analítica | Dataset longitudinal (propiedad municipal, pero conocimiento acumulado de ConnectX para interpretarlo) |

*Diferenciador final: ConnectX no vende software. Vende certidumbre institucional y capacidad de aprender de los datos. El software es el vehículo.*

---

### 7. Estrategia de Implementación: Primero Tepic, Colonia por Colonia

La implementación de Nayarit Digital no es un "big bang" tecnológico, sino un despliegue táctico centrado en resultados inmediatos para la ciudadana Geraldine Ponce y los habitantes de Tepic.

**Fase 1: El Modelo "Colonia Inteligente" (4-6 semanas)**
*   **Zona Piloto:** Selección de una colonia estratégica (ej. Lomas de la Cruz o San Juan).
*   **Acción:** Despliegue del Asistente IA + Reporte de Servicios Públicos + Censo Digital de Bienestar.
*   **Hito:** En 30 días, la Presidenta puede mostrar un mapa de calor real de esa colonia con cada bache resuelto y cada lámpara encendida, vinculando el dato al rostro del ciudadano atendido.

**Fase 2: Escalabilidad Municipal Automatizada (3-6 meses)**
*   **Integración de Tesorería:** Una vez probada la confianza en el reporte ciudadano, se activa el módulo de pagos. "Tepic paga donde ve resultados".
*   **Despliegue General:** Expansión a las 11 demarcaciones de Tepic de forma secuencial.

---

### 8. El Rol de la Infraestructura de Google Cloud

ConnectX utiliza la tecnología más avanzada del mundo para garantizar que el sistema de Tepic nunca caiga y sea infranqueable.

| Herramienta de Google | Función en Nayarit Digital |
| :--- | :--- |
| **Vertex AI (Gemini 1.5 Pro)** | El "cerebro" del Asistente IA. Permite procesar lenguaje natural en wixárika y cora, y clasificar reportes con precisión humana. |
| **Google Maps Platform** | La base visual para la Trazabilidad de Obras y reportes. Permite seguir en tiempo real la ubicación de cuadrillas y maquinaria. |
| **BigQuery (Data Warehouse)** | El motor del **Observatorio Digital**. Procesa millones de registros de recaudación y salud en milisegundos para generar los tableros del C5. |
| **Cloud Firestore** | Base de datos para la interoperabilidad. Garantiza que si un ciudadano paga en Tesorería, el Asistente IA lo sepa instantáneamente. |
| **Google Kubernetes Engine** | Infraestructura de grado militar que escala automáticamente. Si 100,000 personas entran a pagar el predial al mismo tiempo, el sistema no se satura. |

---

### 9. Próximos pasos concretos
1. **Reunión con Geraldine Ponce:** Presentar el "Dashboard del Despacho" (C5) para control directo.
2. **Selección de la Colonia Piloto.**
3. **Inicio de Auditoría de Datos:** Conectar APIs existentes de Tesorería y Agua a la nube de Google.
