# Runbook CI

## 1. Workflow no ejecuta el primer step

Clasificar como infraestructura/runner. Revisar disponibilidad de Actions, límites de cuenta y aprovisionamiento. No modificar código de aplicación para perseguir ese síntoma.

## 2. Falla `npm ci`

Revisar sincronía `package.json`/`package-lock.json`, versión Node y scripts de instalación. No sustituir por `npm install` en CI para ocultar drift.

## 3. Falla TypeScript

Corregir tipos/imports/contratos. No desactivar `tsc --noEmit` como solución.

## 4. Falla test

Identificar unidad/contrato afectado y reproducir. No actualizar expectativas únicamente para recuperar verde sin justificar el nuevo comportamiento.

## 5. Falla seguridad

Determinar si la vulnerabilidad está en producción o desarrollo, si existe ruta de explotación y qué actualización/cambio la resuelve. El Observatorio puede conservar deuda no bloqueante; `high` de producción permanece como gate.

## 6. Falla build

Reproducir desde checkout limpio. No depender de archivos locales no versionados salvo que exista un paso explícito para generarlos.

## 7. Todo pasa

No detener optimización. Revisar Observatorio, cobertura pendiente, duración, bundle, accesibilidad, permisos, dependencias y deuda arquitectónica.
