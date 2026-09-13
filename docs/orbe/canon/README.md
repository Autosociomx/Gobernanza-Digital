# Canon del ORBE — serie documental

Definición canónica del ORBE, versionada. Cada versión declara su parent y el
hash del manifiesto parent (`v0.1/PARENT_POLICY.md`). **Una versión no se
reescribe para reflejar cambios posteriores: se emite la siguiente.**

| Versión | Estado | Qué fija |
|---|---|---|
| [`v0.1`](./v0.1/) | Congelado (2026-09-03) | Definición canónica, taxonomía, contrato ORBE↔Context.OS, inventario y brechas. Línea base evidenciaria previa a la implementación P0. |
| [`v0.2`](./v0.2/) | Activo (2026-09-13) | Neutralidad jurisdiccional: el ORBE sirve a una persona, no a un orden de gobierno. Entrega la fuente canónica de trámites y especifica Context.OS v0.2. |

## Cómo emitir la siguiente versión

1. Carpeta nueva `vX.Y/`. Nunca se edita una versión ya emitida.
2. `MANIFEST.yaml` con: `parent`, `parent_hash` (SHA-256 del manifiesto parent),
   `audited_head`, alcance y hashes de integridad de sus propios archivos.
3. Lo que cambia respecto del parent, explícito en `scope.changes_vs_parent`.
4. Lo que **no** cambia — en particular los invariantes constitucionales — también explícito.
