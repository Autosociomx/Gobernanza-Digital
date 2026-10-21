# ORBE · Diseño de la experiencia ciudadana

Serie documental `orbe-diseno`. Complementa —no reemplaza— el canon de
arquitectura en [`../canon/v0.1/`](../canon/v0.1/) (congelado). El canon dice
**qué es ORBE y qué puede decidir**; esta serie dice **cómo se ve y cómo se
comporta** la superficie ciudadana que lo expone.

| Archivo | Qué es | Estado |
|---|---|---|
| [`HOME_CIUDADANA_v0.1.md`](./HOME_CIUDADANA_v0.1.md) | Especificación de la pantalla de inicio ciudadana con ORBE flotante: anatomía, interacción, datos, tokens, accesibilidad, conciliación con el repo, decisiones abiertas, criterios de aceptación | **Propuesta canónica** (pendiente de aprobación por PR) |
| [`PROMPT_AI_STUDIO_v0.2.md`](./PROMPT_AI_STUDIO_v0.2.md) | Prompt de construcción para Google AI Studio, **derivado** de la especificación | Borrador derivado, sujeto a D-01, D-02 y D-04 de la especificación |
| [`ref/home-ciudadana-ai-studio.png`](./ref/home-ciudadana-ai-studio.png) | Captura de lo que AI Studio generó con el prompt original | Referencia ilustrativa, **no normativa** (muestra defectos, ver DEF-01 a DEF-05) |

## Precedencia

Si dos fuentes se contradicen, manda la de arriba:

1. Reglas duras de `CLAUDE.md` §3 y `docs/marco/PROTOCOLO_SEGURIDAD.md`.
2. Canon ORBE v0.1 + `P0_SCOPE.md`, `P0_ACCEPTANCE.md`, `AURA_VS_ORBE.md`.
3. `HOME_CIUDADANA_v0.1.md`.
4. El prompt de construcción.
5. La captura.

## Reglas de la serie

- Una pantalla = un archivo de especificación. El prompt de AI Studio nunca es
  fuente de verdad: se regenera desde la especificación.
- Cuando la especificación sea aprobada, no se edita: una versión nueva
  declara su parent (versión + hash SHA-256 del manifiesto o equivalente), el
  HEAD contra el que fue revisada y el alcance del cambio — misma política que
  `../canon/v0.1/PARENT_POLICY.md`.
- Todo lo que el prompt o la captura afirmen y el repo no respalde se registra
  como conciliación (R-xx), defecto (DEF-xx) o decisión abierta (D-xx); no se
  corrige en silencio.
- **Nada de esta serie autoriza implementación.** `P0_SCOPE.md` sigue siendo el
  único alcance autorizado y P0 aún tiene criterios pendientes de verificación
  (`../ORBE_P0_REPORTE.md`). Implementar esta pantalla es una etapa posterior que
  debe autorizarse por separado.
