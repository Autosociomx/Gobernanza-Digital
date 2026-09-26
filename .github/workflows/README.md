# Workflows

La carpeta separa deliberadamente cuatro funciones:

- `guardia-regresiones.yml`: gate principal por garantías técnicas.
- `architecture-guard.yml`: contratos e invariantes de Context.OS/ORBE.
- `quality-observatory.yml`: observación periódica no bloqueante para encontrar deuda aun con CI verde.
- `ci-startup-probe.yml`: diagnóstico mínimo para distinguir un runner que no arranca de un fallo del repositorio.
- `ci-config-lint.yml`: validación estática de la configuración de GitHub Actions.

Un check verde significa únicamente que la garantía descrita por ese check pasó para ese SHA. No representa certificación institucional, ausencia total de deuda ni finalización del producto.
