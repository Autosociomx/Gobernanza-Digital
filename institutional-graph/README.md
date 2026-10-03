# Institutional Graph — P1 LAB

Modelo temporal mínimo para representar continuidad institucional sin confundir cargo, persona y responsabilidad.

## Núcleo

```text
Organization -> Post -> Membership -> InstitutionalAct -> Evidence
```

- `Organization`: institución o dependencia.
- `Post`: cargo que puede existir aunque cambie su ocupante.
- `Membership`: ocupación temporal de un `Post` por una persona.
- `InstitutionalAct`: acto documentado asociado a organización/cargo y, cuando exista evidencia suficiente, a una ocupación concreta.
- `Evidence`: referencia probatoria externa al grafo.

## Regla probatoria

La coincidencia temporal entre una persona y un cargo **no** determina responsabilidad personal.

Por defecto, un acto debe usar `responsibilityStatus: INSTITUTIONAL_LINK_ONLY`. Solo puede elevarse a estados documentales cuando la evidencia soporte expresamente firma, autorización o determinación formal.

## P1

Este módulo no ejecuta actos administrativos ni conecta sistemas municipales. Su objetivo es proveer contratos y validaciones para el primer vertical bache/luminaria ya existente en Context.OS.
