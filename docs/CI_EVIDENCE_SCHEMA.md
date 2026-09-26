# Contrato mínimo de evidencia CI

Cada garantía automatizada debe poder responder:

| Campo | Significado |
|---|---|
| `sha` | commit exacto evaluado |
| `check` | garantía que se intentó validar |
| `tool` | herramienta/comando ejecutado |
| `result` | success/failure/cancelled/skipped |
| `artifact` | evidencia conservada cuando aplique |
| `timestamp` | momento de la observación |

## Regla de interpretación

- `success`: la garantía específica pasó para ese SHA.
- `failure`: la garantía específica no pasó o la herramienta encontró un problema.
- `cancelled`: no existe evidencia suficiente para decidir.
- `skipped`: no existe evidencia suficiente para decidir.
- workflow sin primer step ejecutado: problema de infraestructura/runner, no evidencia sobre el código.

Ninguno de estos estados cambia automáticamente la madurez institucional del componente.
