# PARALELO_NACIONAL — Tarea B: qué existe ya en México

- Fecha de consulta: **2026-09-30** · Elaborado por: Claude (líder de la Tarea B) · Propuesta para decisión del responsable humano (Miguel Alexis Pérez Aguilar).
- Siglas: **LNETB** = Ley Nacional para Eliminar Trámites Burocráticos · **ATDT** = Agencia de Transformación Digital y Telecomunicaciones · **DOF** = Diario Oficial de la Federación · **CURP** = Clave Única de Registro de Población · **ECE** = expediente clínico electrónico · **EPC** = Escuela Pública de Código · **IMSS** = Instituto Mexicano del Seguro Social · **NOM** = Norma Oficial Mexicana · **RENAPO** = Registro Nacional de Población.

## Limitación que condiciona todo este documento

En esta sesión el proxy de salida **bloqueó** los dominios `gob.mx`, `dof.gob.mx`, `diputados.gob.mx`, `senado.gob.mx`, `congresonayarit.gob.mx`, `tepic.gob.mx`, `inegi.org.mx` (WebFetch: `EGRESS_BLOCKED`; `curl`: código 000). Solo funcionó el buscador web, que devuelve títulos, URL y un resumen generado por el propio buscador.

Consecuencia, aplicando la regla 2 del prompt: **ninguna fuente de este documento es `LEIDA`**. Todas son `LOCALIZADA` (la URL oficial aparece en resultados de búsqueda; no abrí el texto) y el campo "fragmento citado" es `PENDIENTE`. Los datos numéricos de abajo vienen del resumen del buscador y **no deben citarse en público** hasta abrir la página. Para cerrar esto: agregar los dominios oficiales a la política de red del entorno y repetir la lectura.

## A. Federación

| # | Hallazgo (según resumen del buscador) | Fuente (URL oficial) | Estado | Notas |
|---|---|---|---|---|
| F1 | LNETB publicada en el DOF el 16-jul-2025; entra en vigor el 17-jul. Crea Llave MX como mecanismo de autenticación asociado a la CURP y el Portal Ciudadano Único. | dof.gob.mx/nota_detalle.php?codigo=5763166&fecha=16%2F07%2F2025 · diputados.gob.mx/LeyesBiblio/pdf/LNETB.pdf | LOCALIZADA | Los artículos 2, 3, 66–76 que cita `BIBLIOTECA_LEGAL.md` como VERIFICADO no pude confirmarlos yo. |
| F2 | Llave MX: acceso con CURP, teléfono y correo; niveles "Básica" y "Verificada" (esta con factores adicionales y firma electrónica); "20.5 millones" de usuarios a un año; integrada en "168 sistemas" (36 estatales). | gob.mx/atdt/comunicacion/llave-mx-moderniza-el-acceso-a-tramites-y-servicios-digitales-suma-20-5-millones-de-usuarios · gob.mx/atdt/articulos/llave-mx | LOCALIZADA | Cifras PENDIENTES de lectura. |
| F3 | Lineamientos de Llave MX publicados en el DOF (06-feb-2025). | dof.gob.mx/nota_detalle.php?codigo=5748515&fecha=06%2F02%2F2025 | LOCALIZADA | Base para cualquier integración técnica. |
| F4 | Llave MX Expediente: el buscador reporta un anuncio de lanzamiento "en octubre" (año PENDIENTE) para que "viajen los documentos, no las personas". | Versión estenográfica, conferencia presidencial 18-jun-2026: gob.mx/presidencia/articulos/version-estenografica-conferencia-de-prensa-de-la-presidenta-claudia-sheinbaum-pardo-del-18-de-junio-de-2026 | LOCALIZADA | **Riesgo de traslape con nuestro expediente.** Confirmar fecha y alcance leyendo la versión estenográfica. |
| F5 | Ventanilla 24/7 (CURP inmediata; atención ciudadana con IA 24 h; "2 millones" de atenciones) y Centro de Atención al Bienestar (079). | gob.mx/atdt/comunicacion/llave-mx-moderniza-… (misma liga que F2) | LOCALIZADA | Traslape con el asesor ORBE. Cifra PENDIENTE. |
| F6 | Catálogo Nacional de Trámites. | — | **SIN_FUENTE_OFICIAL** (no la localicé) | PENDIENTE: buscar en gob.mx/atdt y en la LNETB (¿"Catálogo Nacional" o "Registro Nacional de Trámites"? el nombre exacto no está confirmado). |
| F7 | Repositorio Nacional de Tecnología Pública (parte del Centro Nacional de Tecnología Pública): código de soluciones gubernamentales para consultar y reutilizar; destaca Llave MX, Denuncia Digital y Portal de Citas. | repositorionacional.atdt.gob.mx · gob.mx/atdt/comunicacion/atdt-repositorio-nacional-de-tecnologia-publica-abrira-soluciones-tecnologicas-a-todo-el-pais | LOCALIZADA | **Acción:** listar el catálogo completo antes de programar cualquier función (no pude abrirlo). |
| F8 | Escuela Pública de Código (ATDT + INFOTEC): cursos y diplomados para servidores públicos de los tres órdenes; incluye IA y ciberseguridad; meta 2026 de "más de 11,000" servidores (resumen del buscador). | epc.gob.mx · gob.mx/atdt/comunicacion/escuela-publica-de-codigo-ofrece-formacion-gratuita-para-aprender-habilidades-tecnologicas | LOCALIZADA | Cubre la "academia para trabajadores de gobierno". |
| F9 | ECE: convenio Secretaría de Salud–IMSS para impulsar el expediente clínico electrónico interoperable; IMSS-Bienestar transita a expedientes digitales; credencial de salud con QR ligada al ECE. | gob.mx/salud/prensa/213-secretaria-de-salud-e-imss-firman-convenio-para-impulsar-el-expediente-clinico-electronico-y-fortalecer-el-servicio-universal-de-salud · gob.mx/salud/prensa/imss-bienestar-transita-hacia-la-digitalizacion-de-expedientes-para-agilizar-servicios-medicos | LOCALIZADA | **Traslape directo** con nuestro expediente médico. Fecha del convenio PENDIENTE. |
| F10 | Norma de ECE en el DOF. El buscador la titula **NOM-024-SSA3-2010**; nuestra `BIBLIOTECA_LEGAL.md` cita **NOM-024-SSA3-2012** y la marca "PENDIENTE PDF". | dof.gob.mx/normasOficiales/4151/salud/salud.htm | LOCALIZADA | **Discrepancia de año/versión** → ver `DISCREPANCIAS.md` D3. |
| F11 | Verificación de edad / identidad para menores: Llave MX se abre con CURP. No encontré servicio oficial de verificación de edad para menores. RENAPO inició en 2024 vincular biometría a la CURP (fuente secundaria, no oficial en el resultado). | — | **SIN_FUENTE_OFICIAL** | La ausencia en una búsqueda no prueba que no exista. PENDIENTE: consultar a ATDT/RENAPO si Llave MX admite menores. |

## B. Estados y municipios (evidencia oficial localizada)

| # | Hallazgo | Fuente | Estado | Notas |
|---|---|---|---|---|
| E1 | Ciudad de México: Llave CDMX (acceso único, repositorio de documentos, consulta de trámites) y "Expediente Digital"; "50 trámites digitalizados". | llave.cdmx.gob.mx · adip.cdmx.gob.mx/blog/post/blog-expediente · gobierno.cdmx.gob.mx/noticias/digitalizamos-50-tramites-en-la-cdmx | LOCALIZADA | Referente de identidad digital local. |
| E2 | CDMX: Escuela de Código local. | escuelasdecodigo.cdmx.gob.mx | LOCALIZADA | Capacitación. |
| E3 | Guanajuato Digital: metas de plataforma única, apps ciudadanas y "asistente virtual por WhatsApp". El resumen habla de **metas**, no de servicio operando. | boletines.guanajuato.gob.mx/tag/guanajuato-digital/ | LOCALIZADA | No afirmar que ya opera. |
| E4 | Querétaro y Guerrero firmaron convenios con ATDT (galerías en gob.mx/atdt). Aguascalientes y Morelos se suman al Modelo Nacional. | gob.mx/atdt/galerias/… | LOCALIZADA | Contexto: Nayarit no es el único. |
| E5 | Jalisco, Nuevo León, Yucatán, Puebla, Zapopan, Monterrey, San Pedro Garza García, Mérida, León. | — | **PENDIENTE** | No los investigué a fondo (bloqueo + tiempo). **Este documento no permite decir quién va "más adelantado".** |

## C. Nayarit

| # | Hallazgo | Fuente | Estado | Notas |
|---|---|---|---|---|
| N1 | Convenio ATDT–Nayarit (anunciado 10-jun-2025): capacidades tecnológicas, repositorio, acompañamiento a estado y municipios, simplificación; **EPC para servidores estatales y municipales**; Ventanilla Digital Nacional de Inversiones: trámites de apertura de negocio de 13 a 10, requisitos de 93 a 55, días de respuesta de 283 a 140 (cifras del resumen). | gob.mx/atdt/prensa/atdt-y-nayarit-firman-convenio-para-simplificacion-y-digitalizacion-de-tramites | LOCALIZADA | Apertura de negocio ya tiene ruta federal. Cifras PENDIENTES. |
| N2 | Reforma local: el 17-sep-2026 la 34.ª Legislatura votó la simplificación y digitalización; el Estado y los 20 municipios tendrán una autoridad responsable, con funciones unificadas. | congresonayarit.gob.mx/avanza-nayarit-en-igualdad-y-modernizacion-administrativa/ | LOCALIZADA | Coincide con lo que afirma el prompt. No leí el decreto; número y publicación en el Periódico Oficial PENDIENTES. |
| N3 | Portal estatal de Gobierno Digital y registro estatal de trámites. | gobiernodigital.nayarit.gob.mx · tramites.nayarit.gob.mx | LOCALIZADA | No los inspeccioné. |
| N4 | Tepic: sistema municipal de trámites (requisitos y citas), portal de predial y **Click por Tepic** (app para reportar baches, alumbrado, basura, fugas; con folio y seguimiento). | tramites.tepic.gob.mx · predial.tepic.gob.mx · app.tepic.gob.mx/click/ | LOCALIZADA | **Traslape directo** con el caso de uso del runtime (bache/luminaria) y con el pago de predial. |
| N5 | Bahía de Banderas: portal de trámites, portal de pagos en línea (multas, impuestos), pago de predial en línea con descuentos 2026, organismo de agua OROMAPAS. | pagosenlinea.bahiadebanderas.gob.mx · tramites.bahiadebanderas.gob.mx · bahiadebanderas.gob.mx/no-hagas-filas-… | LOCALIZADA | Pago en línea de predial/agua ya existe. |
| N6 | Sitios `pesqueria.gob.mx/…predial…` aparecen en resultados sobre predial de Bahía de Banderas. No parecen fuente del ayuntamiento. | pesqueria.gob.mx | **SIN_FUENTE_OFICIAL** (origen dudoso) | No usar. |

## D. Titularidad y continuidad institucional (aporte del responsable humano, 2026-09-30)

**Afirmación recibida (no verificada):** las aplicaciones municipales actuales (Click por Tepic; en Bahía de Banderas "ofrecen otra") dependen de convenios ligados a la administración en turno y **dejarían de existir al concluir el periodo**, porque no pertenecen al municipio como institución. El objetivo del proyecto es **una sola aplicación cuya titularidad sea del municipio, no de una persona**. Se audita el cargo y la dependencia, no a personas.

| # | Hallazgo | Fuente | Estado | Notas |
|---|---|---|---|---|
| C1 | Titularidad, contrato o convenio, desarrollador y fecha de término de Click por Tepic. | — | **SIN_FUENTE_OFICIAL** | Dos búsquedas no devolvieron ningún aviso de privacidad, contrato ni convenio de la app. **No confirmo ni desmiento la afirmación.** Ruta: solicitud de transparencia al Ayuntamiento de Tepic (contrato/convenio, titular de derechos patrimoniales, acceso al código y a la base de datos, vigencia) y revisar la Plataforma Nacional de Transparencia. |
| C2 | Bahía de Banderas: aplicación móvil de reportes. | bahiadebanderas.gob.mx/servicios-en-linea/ | **SIN_FUENTE_OFICIAL** (para la app) | Solo encontré portales web de trámites y pagos (N5). La app que mencionas no apareció. PENDIENTE: nombre de la app y tienda. |
| C3 | La LNETB obliga a los sujetos obligados a compartir con la autoridad nacional el código fuente de soluciones desarrolladas por ellos **o por terceros**, para integrarlas al Repositorio Nacional. | diputados.gob.mx/LeyesBiblio/pdf/LNETB.pdf · gob.mx/atdt/comunicacion/atdt-repositorio-nacional-… | LOCALIZADA | Es el ancla legal más fuerte para la tesis "el código es del Estado". Artículo exacto PENDIENTE (resumen del buscador). Si aplica a Click por Tepic, el código debería estar o llegar al Repositorio Nacional: verificarlo en F7. |
| C4 | Ley Municipal de Nayarit: en el cambio de administración el ayuntamiento entrante debe recibir el sitio web, el portal de transparencia y el sistema de acceso a la información "en funcionamiento", con respaldos y manuales; el síndico elabora el acta de entrega-recepción. | congresonayarit.gob.mx/…/municipal_para_el_estado_de_nayarit_ley.pdf | LOCALIZADA | Cubre sitio y transparencia; **el resumen no menciona aplicaciones móviles ni código fuente** → posible vacío que explicaría la tesis. Artículo PENDIENTE. |
| C5 | Ley de Gobierno Digital de Nayarit: sujetos obligados cumplen normas y directrices técnicas del Consejo (estandarización de datos y plataformas comunes). | congresonayarit.gob.mx/…/gobierno_digital_para_el_estado_de_nayarit_ley_de.pdf | LOCALIZADA | Base para exigir interoperabilidad y continuidad; sin lectura. |
| C6 | Existen apps estatales con aviso de privacidad propio (p. ej. Secretaría de Movilidad de Nayarit). | semovi.nayarit.gob.mx/aviso-de-privacidad-apps-semovi-nayarit/ | LOCALIZADA | Modelo de documento a exigir para cualquier app municipal. |

## E. Lo que este documento no afirma

1. No afirma que algo "funcione" en Llave MX, Click por Tepic o los portales (no los probé).
2. No ordena a los estados por avance (E5 pendiente).
3. No afirma que la iniciativa Senado/Gaceta sobre las objeciones del Congreso exista: no se localizó ninguna fuente del Senado sobre IA, ciberseguridad o concentración de datos → ver `COMPONENTES_PARA_SENADO.md`.
