# Biblioteca Legal — Nayarit Digital · ConnectX

> Regla de oro (Glosario Oficial): **solo se cita públicamente lo que está en estatus VERIFICADO**.
> Lo POR VERIFICAR se usa internamente pero nunca se afirma en público hasta confirmar texto y vigencia.
> Fuentes primarias de referencia: DOF (dof.gob.mx), Cámara de Diputados (diputados.gob.mx/LeyesBiblio), SIL (sil.gobernacion.gob.mx), Congreso de Nayarit (congresonayarit.gob.mx), Orden Jurídico Nacional (ordenjuridico.gob.mx), Periódico Oficial del Estado de Nayarit, Transparencia Fiscal Tepic (transparenciafiscal.tepic.gob.mx).

Última revisión: 2026-08-01 (segunda pasada — verificación de textos estatales, municipales y NOMs).

---

## 0. Núcleo transversal (el SOATM)

| Ordenamiento | Qué ordena | Estatus |
|---|---|---|
| CPEUM Art. 6 | Transparencia y acceso a la información pública | VERIFICADO |
| CPEUM Art. 115 | Facultades municipales: agua, drenaje, alumbrado, calles, mercados, rastros, panteones, limpieza, catastro/predial (fr. IV), licencias (fr. VI) | VERIFICADO |
| LNETB (federal) Arts. 2, 3, 66–76 | Eliminación de trámites, Llave MX (Art. 3, fr. XVIII), Portal Ciudadano Único (fr. XXV), expediente digital, repositorio | VERIFICADO |
| Ley de Gobierno Digital del Estado de Nayarit Arts. 2, 5, 6 | Obliga a los Ayuntamientos al gobierno digital; expediente digital e interoperabilidad; simplificación administrativa | VERIFICADO |
| LGDNNA Arts. 101 Bis y 101 Bis 3 | Derecho a la identidad de niñas, niños y adolescentes (base de la Llave Infantil) | VERIFICADO |
| LFPDPPP | Datos personales en posesión de sujetos obligados; datos sensibles exigen consentimiento expreso | VERIFICADO |
| Reforma constitucional dic-2024 (transparencia) | Extinción del INAI; funciones pasan a la Secretaría Anticorrupción y Buen Gobierno | VERIFICADO (estudiar la transición) |
| Reforma CPEUM dic-2024 (bienestar animal) | Arts. 3, 4 y 73: bienestar animal como mandato constitucional; habilita Ley General de Bienestar, Cuidado y Protección Animal | VERIFICADO (seguir la ley general cuando se expida) |

## 1. Salud (módulo Salud Inteligente)

| Ordenamiento | Qué ordena | Estatus |
|---|---|---|
| Ley General de Salud | Marco sanitario general; jurisdicciones sanitarias | VERIFICADO |
| **NOM-024-SSA3-2012** | Sistemas de información de registro electrónico para la salud (expediente clínico electrónico, consentimiento, accesos) | PENDIENTE PDF (citada internamente) |
| LFPDPPP (datos de salud = sensibles) | Consentimiento expreso, ARCO, aviso de privacidad | VERIFICADO |
| Patrón propio implementado | Búsqueda por CURP + consentimiento del paciente + bitácora de accesos sellada (módulo Salud ya opera sobre Firestore real) | VERIFICADO (código) |

## 2. Hacienda municipal: Catastro y Tesorería

| Ordenamiento | Qué ordena | Estatus |
|---|---|---|
| **Ley de Hacienda Municipal del Estado de Nayarit** | **Art. 21:** el valor catastral se determina con valores unitarios de terreno y construcción, fijados al menos cada 3 años. **Art. 22:** el valor catastral puede modificarse *antes* de 3 años cuando — fr. I: se realicen construcciones, reconstrucciones o ampliaciones; fr. II: opere un cambio físico de urbanización; fr. IV: se obtengan elementos de catastración técnica; fr. VI: obras públicas o privadas modifiquen el valor del predio o su zona de influencia. **Art. 34:** pago bimestral; anualidad anticipada con factor 0.85 (enero) y 0.90 (febrero); factor 0.50 para adultos mayores, jubilados, pensionados y personas con discapacidad (casa habitación, ene–feb) | **VERIFICADO** (ordenjuridico.gob.mx/Estatal/NAYARIT — texto con reformas) |
| **Ley de Ingresos para la Municipalidad de Tepic, Nayarit, del Ejercicio Fiscal 2026** | Ley anual de ingresos: predial, derechos, licencias; publicada por Tesorería municipal con fe de erratas (27-04-2026). Dato de contexto: proyecta +173 MDP por cobro de **predial atrasado, recargos y actualizaciones** — la recuperación predial ya es estrategia declarada del municipio | **VERIFICADO** (transparenciafiscal.tepic.gob.mx, H. XLIII Ayuntamiento) |
| Ley de Catastro del Estado de Nayarit | Referida por el Art. 34 fr. I de la Ley de Hacienda Municipal ("declaraciones que señalen la Ley de Catastro") | POR VERIFICAR (localizar texto vigente) |
| Código Fiscal para el Estado de Nayarit | Marco fiscal estatal general (sanciones, recargos) | POR VERIFICAR (alcance exacto sobre municipios) |

**Lectura estratégica (Catastro satelital):** el Art. 22 fracciones I, II, IV y VI de la Ley de Hacienda Municipal **ya autoriza revaluar un predio cuando se detecta construcción nueva o cambio físico** — la detección satelital + verificación de campo con folio es exactamente el "elemento de catastración técnica" de la fr. IV. El océano de Catastro no necesita ninguna reforma legal: la ley ya está escrita.

## 3. Agua potable (organismo operador)

| Ordenamiento | Qué ordena | Estatus |
|---|---|---|
| **SIAPA Tepic** | Organismo operador de agua potable y alcantarillado referido en la Ley de Ingresos de Tepic 2026 (recaudación propia por derechos de agua) | VERIFICADO (existencia y rol; razón social completa y estatuto POR VERIFICAR) |
| Ley de Aguas Nacionales | Marco federal: concesiones, riego, CONAGUA | VERIFICADO (general) |

## 4. Agricultura (módulo Agrovisión 3D)

| Ordenamiento | Qué ordena | Estatus |
|---|---|---|
| Ley de Desarrollo Rural Sustentable (DOF 07-12-2001) | Art. 137–138: Sistema Nacional de Información para el Desarrollo Rural — la información rural es **de interés público** y el Estado debe difundirla al nivel municipal. Art. 140: padrón único de beneficiarios con **CURP**. Arts. 164–168: sustentabilidad, carga animal, tecnificación del riego | VERIFICADO (diputados.gob.mx/LeyesBiblio/pdf/LDRS.pdf) |
| Ley Federal de Sanidad Vegetal (DOF 05-01-1994) | Prevención y control de plagas; SENASICA como autoridad | VERIFICADO |
| Programas SADER vigentes | Producción para el Bienestar, Fertilizantes para el Bienestar, Precios de Garantía, Sembrando Vida — requieren padrón con CURP | VERIFICADO (nombres de programa; reglas de operación anuales POR VERIFICAR cada año) |
| Ley Agraria / RAN | Registro Agrario Nacional: cédulas de inscripción de ejidos y comunidades | VERIFICADO (general; arts. específicos POR VERIFICAR) |

## 5. Ganadería (extensión de Agrovisión — módulo Ganado)

| Ordenamiento | Qué ordena | Estatus |
|---|---|---|
| **Ley Ganadera y de Desarrollo Pecuario para el Estado de Nayarit** (decreto del Congreso 10-07-2025; abroga la Ley Ganadera de 2007) | **Art. 79:** cada Municipio debe registrar su fierro para mostrencos. **Art. 94:** cada Municipio llevará el registro de animales mostrencos vendidos. **Arts. 117–123:** identificador SINIIGA obligatorio (orejanos, con herrado); guías de tránsito REEMO; pase de ganado y certificado del rastro de origen para carne. **Arts. 128–131:** registro estatal de rastros; el rastro debe tener clave de Prestador de Servicio Ganadero, reglamento interno y **bitácora con informe mensual**; sacrificio solo con Certificado de Inspección Legal o CFDI + REEMO + fierro + SINIIGA. **Transitorio OCTAVO: los municipios deben adecuar su marco normativo en 90 días** | **VERIFICADO** (congresonayarit.gob.mx — texto completo del decreto) |
| **Ley Federal de Sanidad Animal** (DOF 25-07-2007, reformada 21-05-2024) | Diagnóstico, prevención, control y erradicación de enfermedades animales; bienestar (Arts. 22–23); buenas prácticas; PGN/UPP (Título IV, Cap. I, Arts. 56 y 58). Autoridad: SADER/SENASICA | VERIFICADO |
| Padrón Ganadero Nacional (PGN) y Clave UPP | Alta y actualización de la Unidad de Producción Pecuaria; inventario ganadero (+ LDRS Art. 32 fr. V) | VERIFICADO |
| SINIIGA | Sistema Nacional de Identificación Individual de Ganado (citado expresamente por la ley estatal 2025, Arts. 117, 121, 131) | VERIFICADO |
| Ley de Organizaciones Ganaderas | Asociaciones ganaderas locales y Unión Ganadera Regional (reconocidas por la ley estatal 2025) | VERIFICADO (general) |
| **NOM-009-ZOO-1994 "Proceso sanitario de la carne"** | Procedimientos sanitarios para establecimientos de sacrificio y procesamiento de cárnicos. DOF 16-11-1994; revisiones quinquenales al día (último informe 2022) | **VERIFICADO — VIGENTE** (gob.mx/agricultura) |
| **NOM-008-ZOO-1994** | Especificaciones zoosanitarias para construcción y equipamiento de establecimientos de sacrificio e industrialización de cárnicos | VERIFICADO (referida por NOM-009 y NOM-033) |
| **NOM-033-ZOO-1995 "Sacrificio humanitario de los animales domésticos y silvestres"** | Métodos de insensibilización y sacrificio por especie (incluye animales de compañía: conexión con el módulo de bienestar animal). DOF 16-07-1996, modificación 16-07-1997 | **VERIFICADO** |
| **NOM-051-ZOO-1995 "Trato humanitario en la movilización de los animales"** | Manejo, embarque, vehículos, densidades de carga en la movilización | VERIFICADO |
| **NOM-194-SSA1-2004** | "Productos y servicios. Especificaciones sanitarias en los establecimientos dedicados al sacrificio y faenado de animales para abasto, almacenamiento, transporte y expendio." DOF 18-09-2004; modificaciones 2010 y 2012. Vigilancia: COFEPRIS. Aplica a rastros municipales, carnicerías, empacadoras y transporte | **VERIFICADO — VIGENTE** (gob.mx/cofepris) |
| NOM-213-SSA1-2018 | Productos cárnicos procesados y sus establecimientos (vigente, DOF 03-04-2019) | VERIFICADO (gob.mx/cofepris) |
| NOM-251-SSA1-2009 | Prácticas de higiene en establecimientos de alimentos (base de la capacitación DC-3 del personal cárnico) | VERIFICADO (referida por COFEPRIS) |
| Ley de Salud para el Estado de Nayarit | Requisitos sanitarios de rastros (citada por la Ley Ganadera 2025, Arts. 128–129) | POR VERIFICAR (texto) |
| NOM-040-ZOO-1995 | Requisitos zoosanitarios para movilización (guías) | POR VERIFICAR (vigencia y alcance) |

**Lectura estratégica:** la ley estatal de 2025 es una mina: (1) **obliga al rastro a llevar bitácora con informe mensual** (Art. 128) — el módulo Rastro digital es literalmente la bitácora que la ley exige; (2) **obliga a los municipios a adecuar su marco normativo en 90 días** (Transitorio Octavo) — otro caso de "la ley ya lo ordena; nosotros ya lo programamos"; (3) la cadena SINIIGA + fierro + REEMO + certificado (Art. 131) es trazabilidad obligatoria que hoy se lleva en papel.

## 6. Servicios de uso frecuente ciudadano (mapa de oportunidad)

| Trámite/servicio | Base normativa | Módulo SOATM | Estatus de la cita |
|---|---|---|---|
| Actas de nacimiento/matrimonio/defunción | Ley General de Población + Código Civil del Estado de Nayarit (Registro Civil) | Registro Civil digital | VERIFICADO (general) |
| CURP | RENAPO / Ley General de Población | Identidad (Nayarit ID la usa como llave) | VERIFICADO |
| Predial y catastro | **Ley de Hacienda Municipal del Estado de Nayarit Arts. 21, 22, 34** + Ley de Ingresos Tepic 2026 + CPEUM 115 fr. IV | Tesorería Digital / Catastro | **VERIFICADO (nivel artículo)** |
| Agua potable y drenaje | Ley de Aguas Nacionales + SIAPA Tepic (Ley de Ingresos 2026) + CPEUM 115 fr. I | Servicios / Tesorería | VERIFICADO |
| Licencias de funcionamiento | CPEUM 115 fr. VI + Ley de Desarrollo Urbano del Estado de Nayarit | Ventanilla de licencias | VERIFICADO (general; ley estatal POR VERIFICAR texto) |
| Rastro municipal | CPEUM 115 fr. III + **Ley Ganadera y de Desarrollo Pecuario 2025 Arts. 128–131** + NOM-009-ZOO-1994 / NOM-033-ZOO-1995 / NOM-194-SSA1-2004 / NOM-008-ZOO-1994 | Módulo Ganado / Rastro | **VERIFICADO (nivel artículo)** |
| Limpieza pública / basura | CPEUM 115 + NOM-083-SEMARNAT-2003 (separación y manejo de RSU) | Servicios Públicos | VERIFICADO |
| Alumbrado, baches, calles | CPEUM 115 | Servicios Públicos (reporte con folio — ya demo) | VERIFICADO |
| Tránsito y movilidad | Ley de Movilidad y Seguridad Vial del Estado de Nayarit | Módulo futuro | POR VERIFICAR (nombre exacto y vigencia) |
| Protección civil | Ley General de Protección Civil (2012) + ley estatal | C5 / alertas | VERIFICADO (general) |
| DIF y asistencia social | Ley de Asistencia Social (federal/estatal) | Bienestar Social | VERIFICADO (general) |
| Bienestar animal doméstico | Reforma CPEUM dic-2024 + NOM-033-ZOO-1995 (animales de compañía) + Código Penal estatal | Módulo futuro (censo/clínica veterinaria municipal) | VERIFICADO |
| Mostrencos y fierros municipales | Ley Ganadera y de Desarrollo Pecuario 2025 Arts. 79 y 94 | Módulo Ganado | VERIFICADO |

## 7. Pendientes de la biblioteca (conseguir PDF oficial)

- [ ] NOM-024-SSA3-2012 (texto completo, DOF)
- [ ] Iniciativa 18 Bis (PDF del SIL — la descarga Miguel desde su red)
- [ ] Ley de Catastro del Estado de Nayarit (texto vigente)
- [ ] Razón social completa y estatuto orgánico del SIAPA Tepic
- [ ] Ley de Salud para el Estado de Nayarit (texto vigente — rastros)
- [ ] Ley de Movilidad y Seguridad Vial de Nayarit (nombre/vigencia)
- [ ] Reglamento de Rastro del Municipio de Tepic
- [ ] Reglamento de la Ley Ganadera y de Desarrollo Pecuario 2025 (plazo de 60 días desde su vigencia)
- [ ] Presupuesto de Egresos de Tepic 2026
- [ ] Plan Nacional de Desarrollo 2025–2030
- [ ] Legislación de armonización de Nayarit con la LNETB
- [ ] Régimen de datos personales en posesión de **sujetos obligados** (LGPDPPSO):
      hoy referido en `MARCO_CUMPLIMIENTO_LNETB.md` §3 y en
      `TRANSFORMACION_VS_CONSTRUCCION.md` (H1) sin ficha propia con estatus

---

*Cada módulo del SOATM tiene su ley. La ley ya lo ordena; el código ya lo ejecuta; la bitácora ya lo comprueba.*
