# 🧠 Orbe Central — Aura, núcleo agéntico

## Qué es

El centro del ecosistema: **Aura**, el agente unificado con voz y conciencia
de página. Es la única interfaz conversacional de todos los círculos (24/7, **en
español**) y el orquestador de eventos entre módulos: enruta, no almacena.

Aura **no** responde en lenguas originarias y el servidor se lo impide: no tiene
competencia verificada en náayeri ni wixárika, y una respuesta generada no puede
pasar por la guardia que sí revisa el léxico estático. Estado y alcance reales en
`docs/marco/PROTOCOLO_LENGUAS_ORIGINARIAS.md`.

## Estado

**En construcción** — Aura ya opera como agente unificado con voz y
conciencia de página (commit `34f6155`); la orquestación de eventos entre
módulos está en diseño.

## Conexiones

Todas — es el hub. Regla: los círculos hablan entre sí **a través del
núcleo** (eventos), nunca directo entre bases de datos.

## Dónde vive

- Visión del ecosistema: `docs/interno/NAYARIT_DIGITAL_V2.md` (§5 Asistente IA)
- Contexto maestro: `docs/interno/CONTEXTO_MASTER_CLAUDE.md` (§3 Motor Central de IA)
- Código: `src/App.tsx`, `src/components/CitizenOS.tsx`, `src/components/ModularBrain.tsx`, `src/services/`

## Cómo editarlo

- Cambiar comportamiento conversacional de Aura → `src/services/` y componentes relacionados.
- Agregar un círculo nuevo al Orbe → crear su archivo en `modulos/`, registrarlo en `../modulos.json` y añadirlo al diagrama de `../README.md`.
- Cambiar reglas de orquestación (qué evento dispara qué) → este archivo, sección Conexiones de los módulos implicados.

## Pendientes

- [ ] Definir el bus de eventos formal entre círculos (hoy las integraciones son punto a punto en la UI).
- [ ] Documentar las intenciones (intents) que Aura puede ejecutar por módulo.
