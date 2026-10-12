# Registro de dependencias — Tepic

Registro agregado versión **0.4**, con fecha de corte 3 de octubre de 2026.
El archivo [`registro.json`](./registro.json) conserva las cifras, fuentes,
estatus, cambios detectados y unidades responsables entregadas para este corte.

## Alcance de esta entrega

El insumo recibido reporta 238 registros, pero no incluye el listado
individualizado de nombres de dependencias ni el fundamento y la fecha de
consulta por cada una. Por esa razón, `resumen.total_registros_reportado` es un
total declarado y `resumen.registros_individuales_incluidos` permanece en cero:
no se inventan filas para completar ese total.

Los estados `verificado` aquí describen el corte reportado y sus referencias;
antes de publicar cada entidad como registro individual conviene enlazar la
fuente oficial consultada y conservar su fundamento puntual. Los rubros
pendientes no deben presentarse como dependencias ya verificadas.

## Estructura y uso

- `registro.json`: un resumen del corte, agregado por nivel y tipo, no un
  catálogo transaccional de trámites ni un padrón de las 238 entidades.
- `servicios_tepic`: relaciona cuatro servicios con las unidades y
  fundamentos citados en el insumo; la atribución de baches queda
  explícitamente `por_verificar`.
- El trámite (qué y requisitos) y el punto de atención (dónde) deben mantenerse
  como conceptos separados. Este corte solo relaciona unidades responsables
  para los cuatro servicios indicados; no agrega requisitos ni domicilios.

En el repositorio actual no se encontró `gobernanza-digital-inicio.html` ni
`integrar_datos.py`. Por tanto, no se incrustó el registro en un HTML ni se
ejecutó ese flujo; si el artefacto vive en otro repositorio o rama, habrá que
integrarlo allí por separado.

## Revisión

Actualizar las fuentes con cada reforma, cada agosto al publicarse la nueva
Relación de Entidades Paraestatales y con cada cambio de administración
municipal. Consultar `registro.json` como snapshot y no asumir que su conteo
agregado equivale a que el detalle individual ya esté capturado.
