# Modelo operativo de CI

La CI no existe para producir un botón verde. Cada gate representa una garantía concreta y debe dejar evidencia reproducible asociada al SHA.

## Gates

- **Preflight:** checkout limpio, Node fijado, instalación desde lockfile, configuración efímera y Guardia de regresiones.
- **Tipos:** TypeScript.
- **Tests:** suite Vitest completa.
- **Seguridad:** vulnerabilidades de producción y detección de secretos comunes.
- **Build:** compilación completa y verificación del bundle.

## Reglas

1. Un workflow que no ejecutó su primer paso no constituye evidencia sobre el código.
2. `skipped` o `cancelled` no equivalen a aprobado.
3. Un check verde valida únicamente su propia garantía.
4. CI no certifica madurez institucional.
5. Los umbrales nuevos deben basarse en una línea base medida.

## Mejora continua

Después de estabilizar esta base se medirán duración, cobertura, tamaño de bundle, vulnerabilidades y accesibilidad. Los nuevos gates se incorporarán solo cuando sean reproducibles, accionables y tengan falsos positivos aceptables.


## Dependencias y seguridad

- `package-lock.json` es la fuente reproducible para `npm ci`.
- `package.json` fija `@grpc/grpc-js` mediante override a `^1.14.6`, porque Firebase arrastra una rama transitoria anterior con avisos de seguridad.
- La actualización se acepta únicamente si `npm audit --omit=dev --audit-level=high` pasa y la suite, TypeScript y build siguen ejecutándose.
- No usar `npm audit fix --force` como atajo: puede degradar Firebase o introducir cambios mayores no revisados.


## Configuración Firebase de cliente

La configuración web de Firebase es pública por diseño; su API key identifica el proyecto, no autoriza acceso por sí sola. La CI reemplaza la configuración de trabajo con un placeholder si no se proporciona el secreto de configuración. El escáner del bundle permite únicamente la API key declarada en esa configuración y rechaza otros patrones Google API y marcadores de `GEMINI_API_KEY`. Mantener restricciones de API, Firebase Security Rules y App Check; nunca incluir una clave de Gemini Developer API ni claves privadas de cuentas de servicio. Referencia: documentación oficial de Firebase sobre API keys.
