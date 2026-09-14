# Recibos de arquitectura

Cada corrida de la compuerta emite un recibo con lo que se declaró y lo que se
verificó: componente, impacto, nivel de evidencia, madurez, semáforo, si cambió
la autoridad, el commit sobre el que se comprobó, las pruebas citadas, las
fronteras que se movieron y las brechas que quedan abiertas.

En CI el recibo viaja como artifact de la corrida
(`artifacts/recibo-arquitectura.yml`) y desaparece con ella. Esta carpeta
guarda los que conviene conservar: los de cambios que movieron una frontera,
ampliaron autoridad o cerraron una entrada del MASTER_STATE.

## Qué registra un recibo que no registre el diff

El diff dice qué líneas cambiaron. El recibo dice **qué se afirmó al
cambiarlas**: con qué evidencia, sobre qué commit, con qué semáforo y qué quedó
sin resolver. Seis semanas después, el diff sigue ahí y la afirmación no.

Un detalle del formato importa: `evidence_level_elevado_por_la_compuerta` es
siempre `false`. La compuerta verifica el nivel declarado y nunca lo sube; si
alguien declaró E3 y la comprobación falló, el recibo lo deja escrito en
`bloqueos` en vez de corregir el nivel.

## Nombres

`ARCH-AAAA-NNN.yml`, con el `change_id` que emitió la compuerta. Los recibos de
corridas locales salen como `ARCH-AAAA-LOCAL`; sólo se versiona el que
corresponde a un cambio fusionado o en revisión.

## Índice

| Recibo | Cambio | Veredicto |
|---|---|---|
| [ARCH-2026-001](ARCH-2026-001.yml) | Compuerta de arquitectura v0.1 y adopción del MASTER_STATE | ver archivo |
