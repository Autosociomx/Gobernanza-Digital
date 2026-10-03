# Registro de dependencias — Tepic, tres niveles de gobierno (versión 0.4)

Archivos de esta carpeta:

- `dependencias.json` — 238 instituciones de los tres órdenes de gobierno, cada una con fundamento legal, fuente y fecha de consulta.
- `rutas-tepic.json` — servicios ciudadanos de Tepic ligados a su unidad responsable según el Reglamento de la Administración Pública Municipal vigente.

Quién los usa: el agente de enrutamiento SOATM (`next/modules/soatm/agent.ts`) y sus pruebas (`next/modules/soatm/agent.test.ts`), que además validan la consistencia del registro: ninguna dependencia sin fundamento, fuente ni fecha; ninguna ruta verificada hacia una dependencia inexistente; ningún organismo coordinado hacia una coordinadora inexistente.

## Cómo enruta el agente SOATM

1. Si la jurisdicción es Tepic y la necesidad coincide con una ruta de `rutas-tepic.json`:
   - atribución **verificada** → `FOUND`, con dependencia, unidad, artículo y fracción;
   - atribución **no expresa** (hoy: baches) → `REQUIRE_HUMAN`. No se adivina una dependencia.
2. Si el texto nombra una dependencia de cualquier nivel (por nombre oficial o por las siglas que su nombre oficial declara) → `FOUND`, o `AMBIGUOUS` si existe en más de un nivel (por ejemplo, "Secretaría de Turismo" federal y estatal).
3. En otro caso → `NOT_FOUND`.

## Cómo se actualiza

Toda modificación entra por rama y solicitud de fusión. Al cambiar un registro: actualizar `fecha_consulta`, `fuente` y `estado_fuente`; registrar el cambio en `cambios_detectados`; correr `npx vitest run next/modules/soatm`.

## Principio de diseño: "qué" y "dónde" van separados

| Nivel | El trámite (qué, requisitos) | El punto de atención (dónde) |
|---|---|---|
| Federal | Igual en todo el país | Cambia por municipio |
| Estatal | Igual en todo Nayarit | Cambia por municipio |
| Municipal | Cambia por municipio | En el propio municipio |

## Meta nacional

Según la ATDT (Agencia de Transformación Digital y Telecomunicaciones), el Pacto Nacional para implementar la Ley Nacional para Eliminar Trámites Burocráticos se integra por 10 compromisos para adoptar el **Catálogo Único de Trámites: 300 estatales y 100 municipales**. Fuente: comunicado de la ATDT en gob.mx, "Estados y municipios de todo el país firman Pacto Nacional para simplificar y digitalizar trámites burocráticos" (la copia proporcionada no muestra la fecha de publicación).

## Estado actual (consulta del 3 de octubre de 2026): 238 registros

| Capa | Registros | Estado | Fuente |
|---|---|---|---|
| Federal centralizada | 22 | Verificado | LOAPF art. 26, última reforma DOF 07-05-2026 (Cámara de Diputados) |
| Federal paraestatal | 181 | Verificado | Relación de las Entidades Paraestatales, DOF 12-08-2026, apartado A (no incluye las 12 en proceso de desincorporación) |
| Federal desconcentrada | 0 | Pendiente | Reglamentos interiores de cada secretaría |
| Estatal centralizada | 13 | Verificado | Ley Orgánica del Poder Ejecutivo de Nayarit art. 31, compilación del Congreso con última enmienda P.O. 13-02-2026 |
| Estatal paraestatal | 0 | Pendiente | Relación de entidades paraestatales del Estado |
| Municipal Tepic | 22 | Verificado | Reglamento de la Administración Pública Municipal de Tepic, texto vigente con la reforma de la Gaceta Municipal Extraordinaria núm. 27 (22-12-2025): art. 20 (11 dependencias), art. 54 bis (Juzgado Cívico), art. 54 (6 órganos desconcentrados), art. 57 (4 organismos descentralizados) |
| Oficinas federales y estatales en Tepic | 0 | Pendiente | Directorios oficiales de cada dependencia |

## Cambios detectados entre versiones

- Estatal, art. 31 fracción XI: la Secretaría de Bienestar e Igualdad Sustantiva (vigente en la compilación al 9-10-2023) fue derogada (P.O. 16-01-2026).
- Estatal, art. 31 fracción VIII: pasó de Secretaría de Economía a Secretaría de Desarrollo Económico y Social (P.O. 13-02-2026).
- La copia de la Ley Orgánica del Poder Ejecutivo con enmiendas al 9-10-2023 está desactualizada; se usa la del 13-02-2026.
- Municipal: las reformas del 23-12-2024 (Oficina de la Presidencia, art. 21) y del 22-12-2025 (Servicios Públicos y Obras Públicas, arts. 41 a 45) cambiaron estructuras internas, pero no las listas de los arts. 20, 54, 54 bis y 57.
- Municipal: el Reglamento vigente no nombra una Autoridad Municipal de Simplificación y Digitalización (art. 11 de la Ley Nacional para Eliminar Trámites Burocráticos). La unidad más cercana es la Dirección de Innovación Gubernamental de la Tesorería (art. 33, fracc. III). Pudo designarse por otro acuerdo de Cabildo: por verificar.

## Servicios ligados a su unidad responsable (Reglamento de Tepic vigente)

| Servicio | Unidad responsable |
|---|---|
| Predial | Tesorería Municipal → Dirección de Catastro e Impuesto Predial, Departamento de Impuesto Predial (art. 33, fracc. VI) |
| Luminarias | Dirección General de Servicios Públicos Municipales → Departamento de Alumbrado Público (art. 42, fracc. VI) |
| Baches | El Reglamento no asigna la atribución de forma expresa; por verificar |
| Acta de nacimiento | Secretaría del Ayuntamiento → Dirección del Registro Civil y sus oficialías (art. 29, fracc. III) |
- Federal: de la Relación 2025 a la 2026 pasaron a desincorporación la Comisión Nacional de las Zonas Áridas, Aerolínea del Estado Mexicano, el Instituto Nacional para el Desarrollo de Capacidades del Sector Rural y FONATUR Tren Maya; se incorporaron la Comisión Nacional Antimonopolio, la Agencia de Trenes y Transporte Público Integrado y el Instituto Nacional de Estudios Históricos de las Revoluciones de México.

## Reglas

1. Ninguna dependencia entra sin fundamento (ley, artículo y fracción, o numeral de la Relación) y fuente con fecha de consulta.
2. `verificado` solo cuando la fuente es el publicador oficial vigente (DOF, Periódico Oficial del Estado, Gaceta Municipal o compilación oficial del Congreso).
3. Se revisa con cada reforma publicada, cada agosto (nueva Relación de Entidades Paraestatales) y con cada cambio de administración municipal.

## Glosario

- **LOAPF:** Ley Orgánica de la Administración Pública Federal.
- **DOF:** Diario Oficial de la Federación. **P.O.:** Periódico Oficial del Estado de Nayarit. **G.M.:** Gaceta Municipal de Tepic.
- **Dependencia centralizada:** secretaría o dirección que depende directamente del titular del Ejecutivo.
- **Órgano desconcentrado:** unidad que pertenece a una dependencia, con cierta autonomía técnica.
- **Paraestatal / paramunicipal:** organismo descentralizado, empresa de participación pública o fideicomiso público con personalidad jurídica propia.
- **Sectorizado:** organismo coordinado por una secretaría ("coordinadora de sector").
