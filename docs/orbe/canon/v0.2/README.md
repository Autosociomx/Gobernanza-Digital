# Canon del ORBE — v0.2

**Parent:** [`v0.1`](../v0.1/) (congelado, no se reescribe)
**Estado:** activo

Esta versión añade a la definición canónica del ORBE la dimensión que faltaba:
**el orden de gobierno**.

| Documento | Contenido |
|---|---|
| [`ORBE_CANON_JURISDICCIONAL.md`](./ORBE_CANON_JURISDICCIONAL.md) | La decisión, su evidencia, lo ya entregado y la especificación completa de Context.OS v0.2 con sus pruebas de aceptación. |
| [`MANIFEST.yaml`](./MANIFEST.yaml) | Parent, hash del manifiesto parent, HEAD auditado y alcance, según `v0.1/PARENT_POLICY.md`. |

## En una línea

El ORBE no sirve a un orden de gobierno: sirve a una persona. La jurisdicción
es un dato del trámite, resuelto por el canon (`data/canon/`), nunca un
supuesto del sistema.

## Qué cambió respecto de v0.1

- **Entregado:** la orientación ya cubre los tres órdenes de gobierno, con
  fuente canónica verificada en cada build (`data/canon/`, `shared/canon/`,
  `scripts/verificar-canon.mjs`).
- **Especificado, no ejecutado:** la ejecución sigue siendo municipal.
  `contextos/runtime.ts` exige municipio; el rediseño a `contextos.v0.2` está
  escrito con sus pruebas de aceptación y requiere su propio PR, porque cambia
  el formato de cable y la ruta HTTP del LAB desplegado.
- **Sin cambios:** los diez invariantes constitucionales de v0.1. Ampliar la
  jurisdicción no amplía la autoridad.
