# Catálogo municipal de Tepic — **retirado**

> **Este directorio ya no es fuente de verdad.**
> La fuente canónica de trámites y servicios vive ahora en
> [`data/canon/`](../../canon/README.md).

## Qué pasó

`services.json` e `intents.json` vivieron aquí como «la primera base de
conocimiento estructurada del ORBE» y **ninguna línea de código los leyó
jamás**. Su propio README dejaba pendiente, como paso 4, «conectar el catálogo
al resolvedor de intención del ORBE»; nunca ocurrió. Mientras tanto el runtime
resolvía servicios desde `contextos/serviceCatalog.ts`, con otro vocabulario y
otros ids. Dos catálogos, ninguna autoridad.

Además el catálogo asumía municipio por omisión: el acta de nacimiento estaba
registrada como `tepic.registro_civil_acta_nacimiento` cuando la competencia es
**estatal**, con la propia ficha admitiendo «autoridad competente por validar».

## Dónde quedó cada cosa

Los ocho servicios y sus expresiones ciudadanas se migraron íntegros a
`data/canon/tramites.json`, con estos cambios:

- ids reescritos con su jurisdicción real (`mx.nay.tepic.predial`,
  `mx.nay.registro-civil-acta-nacimiento`);
- fundamento normativo vinculado a `data/canon/fuentes.json` en vez de texto
  suelto;
- un semáforo por dato (`dependencia`, `costo`, `plazo`, `canal_oficial`) en vez
  de un solo `source_status` para todo el servicio;
- verificación ejecutable en cada build (`scripts/verificar-canon.mjs`, R9 de la
  Guardia), incluida la regla que impide que el código tenga capacidades que el
  canon no describa.

El contenido original sigue en el historial de git. Auditoría completa:
[`docs/marco/AUDITORIA_FUENTE_CANONICA.md`](../../../docs/marco/AUDITORIA_FUENTE_CANONICA.md).
