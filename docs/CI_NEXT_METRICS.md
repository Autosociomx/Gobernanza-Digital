# Siguientes métricas

No fijar umbrales arbitrarios antes de tener línea base. Medir primero:

- duración p50/p95 de Guardia;
- tiempo de `npm ci`;
- tiempo de tests;
- tiempo de build;
- número de tests y relación tests/fuentes;
- tamaño total y chunks principales de `dist/assets`;
- vulnerabilidades por severidad y producción/desarrollo;
- frecuencia de workflows cancelados/skipped;
- regresiones detectadas antes de merge;
- accesibilidad y performance de Deploy Preview cuando el entorno sea estable.

Después de varias ejecuciones reproducibles se pueden convertir métricas seleccionadas en presupuestos o gates. Antes de eso, un número inventado solo produciría otro semáforo ornamental.
