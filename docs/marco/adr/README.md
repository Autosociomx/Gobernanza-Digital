# Registro de decisiones de arquitectura (ADR)

Un ADR —*Architecture Decision Record*— es el acta de una decisión técnica:
qué se decidió, en qué contexto, qué alternativas se descartaron y qué queda
obligado a partir de ahí. No es documentación de diseño ni un manual; es el
registro de un momento.

Este repositorio ya tenía actas institucionales en `docs/actas/`. Los ADR son
lo mismo aplicado a la arquitectura, y siguen la misma regla: **no se borran,
se superan con un ADR posterior** que declara cuál deja obsoleto.

## Cuándo hace falta uno

Hace falta un ADR cuando el cambio mueve una frontera, no cuando cambia una
implementación. En concreto, cuando el cambio:

- amplía la autoridad del sistema (sale de `LAB_MOCK`, deja de declarar
  `authority: NONE`, permite que un modelo decida policy o consentimiento);
- cambia la garantía declarada de la evidencia;
- rompe o versiona un contrato semántico o el esquema de Context.OS;
- introduce un segundo runtime, un segundo motor de política o un segundo
  emisor de evidencia;
- retira o reinterpreta una de las fronteras de
  `docs/marco/fronteras-arquitectura.json`.

La compuerta de arquitectura exige un ADR existente en esos casos y falla si la
declaración de la PR apunta a un archivo que no está en el repositorio. Ver
`docs/marco/COMPUERTA_ARQUITECTURA.md`.

## Cómo se numeran

`ADR-NNNN-titulo-en-minusculas.md`, con `NNNN` consecutivo y sin reutilizar
números. El título describe la decisión, no el problema.

## Estructura mínima

```
# ADR-NNNN · Título

- Estado: propuesto | aceptado | superado por ADR-MMMM
- Fecha:
- Decide:
- Componentes:

## Contexto
## Decisión
## Alternativas descartadas
## Consecuencias
## Cómo se verifica
```

La sección **Cómo se verifica** no es opcional: una decisión de arquitectura
que no se puede comprobar vuelve a ser una opinión en cuanto cambia la sesión
que la escribió.

## Índice

| ADR | Título | Estado | Fecha |
|---|---|---|---|
| [ADR-0001](ADR-0001-compuerta-de-arquitectura.md) | Compuerta de arquitectura: dos ejes, semáforo y cuatro comprobaciones | aceptado | 2026-09-14 |
