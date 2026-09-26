# Checklist de revisión CI

Antes de fusionar esta intervención:

- [ ] La sonda demuestra que el runner ejecuta pasos.
- [ ] actionlint valida todos los workflows.
- [ ] `npm ci` funciona desde checkout limpio.
- [ ] TypeScript pasa o existe un fallo concreto documentado.
- [ ] Suite completa y contratos producen resultados reproducibles.
- [ ] El gate de seguridad no tiene falsos positivos conocidos.
- [ ] Build genera `dist` sin patrones sensibles de Gemini.
- [ ] Los artefactos incluyen SHA.
- [ ] CodeQL/Dependency Review son compatibles con la configuración del repositorio.
- [ ] La duración y duplicación inicial son aceptables como baseline.
- [ ] Ningún documento afirma madurez institucional basándose en CI.

Los checks vacíos son trabajo pendiente, no una invitación a marcarlos para que se vea bonito.
