# Modelo de seguridad CI

## Gate

Bloquea cuando una dependencia de producción reporta severidad `high` o superior, o cuando se detecta un patrón común de secreto versionado/bundleado.

## Observación

La auditoría completa se conserva sin convertir automáticamente toda deuda de desarrollo en bloqueo. CodeQL añade análisis estático y Dependency Review inspecciona dependencias nuevas en PRs.

## Limitaciones

La búsqueda por expresiones regulares no sustituye un escáner especializado de secretos y `npm audit` no demuestra ausencia de vulnerabilidades. Son capas de señal, no certificados de seguridad.

## Próxima mejora

Evaluar una herramienta especializada de secret scanning y definir política después de medir falsos positivos sobre el repositorio real.
