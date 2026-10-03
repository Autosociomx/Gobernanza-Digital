# ADR-0002 — Identity Gateway + Institutional Graph

**Estado:** ACCEPTED FOR P1 LAB
**Fecha:** 2026-09-07
**Alcance:** laboratorio y arquitectura canónica. No amplía autoridad institucional.

## Contexto

El repositorio ya contiene ORBE/CitizenApp, C5Dashboard, Context.OS, consentimiento, catálogo de servicios y EvidenceRecord. Sin embargo, no existe todavía una capa neutral de identidad ni un modelo temporal canónico que conecte organización, cargo, ocupación, acto institucional y evidencia.

La arquitectura debe permitir autenticación progresiva y portabilidad de proveedor sin representar teléfono, CURP, biometría o Llave MX como identidad primaria del sistema.

## Decisión

Se crean dos límites canónicos:

1. **Identity Gateway** para autenticar actores mediante proveedores intercambiables.
2. **Institutional Graph** para representar continuidad institucional mediante `Organization -> Post -> Membership -> InstitutionalAct -> Evidence`.

### Invariantes

- `phone_number != CitizenId`.
- `CURP != CitizenId`.
- `LlaveMX != CitizenId`.
- biometría no se almacena como identidad primaria.
- `Person != Post`.
- ocupar un cargo en una fecha no prueba por sí solo autoría o responsabilidad de un acto.
- `checksum != firma electrónica`.
- todo proveedor no integrado oficialmente debe declarar `NOT_CONNECTED`.
- ningún adapter P1 puede ejecutar un acto administrativo real.

## Identity Gateway

El gateway trabaja con `ActorId`/`CitizenId` internos. Los proveedores iniciales son:

- `anonymous`
- `phone_otp`
- `passkey`
- `llave_mx`

En P1, `llave_mx` debe permanecer `NOT_CONNECTED` hasta existir integración institucional autorizada.

## Institutional Graph

Entidades mínimas:

- `Organization`
- `Post`
- `Membership`
- `InstitutionalAct`

Relaciones mínimas:

```text
Organization
    |
   Post
    |
Membership
    |
InstitutionalAct
    |
EvidenceRecord
```

`Membership` expresa quién ocupó un cargo durante un intervalo temporal. `InstitutionalAct` expresa un acto documentado y puede referenciar un `Post` y un `Membership`, sin convertir esa referencia en una determinación de responsabilidad personal.

## Integración con Context.OS

Context.OS conserva la decisión de política y debe poder recibir como contexto:

- `actorId`
- método de autenticación
- nivel de aseguramiento
- capability solicitada
- referencias de caso/cargo cuando existan

Un nivel de autenticación insuficiente debe producir una decisión de step-up, no una elevación implícita de privilegios.

## Estados de conexión institucional

Todo proveedor o adapter externo usará uno de estos estados:

- `NOT_CONNECTED`
- `SANDBOX`
- `AUTHORIZED`
- `CONNECTED`
- `PRODUCTION`

P1 solo puede introducir proveedores `NOT_CONNECTED` o de laboratorio, salvo evidencia verificable en el repositorio de una integración real.

## Primer vertical end-to-end

El primer caso deberá reutilizar el flujo existente de bache/luminaria:

`ORBE -> Identity Gateway -> Context.OS -> Service Catalog -> LAB adapter -> EvidenceRecord`

La primera ampliación del Institutional Graph debe identificar la organización y el cargo institucional responsable del servicio sin afirmar ejecución municipal real.

## No objetivos de P1

- integración real con Llave MX;
- RENAPO;
- e.firma;
- expediente ciudadano nacional;
- Catastro/SIAPA institucional;
- firma biométrica;
- base de datos de rostros o huellas;
- autorización de actos administrativos reales.

## Criterio de salida P1

P1 queda listo cuando existan contratos tipados, validaciones básicas y pruebas que demuestren:

1. identidad interna desacoplada del proveedor;
2. proveedor Llave MX marcado `NOT_CONNECTED`;
3. modelado temporal `Organization/Post/Membership`;
4. `InstitutionalAct` enlazable a evidencia;
5. rechazo de referencias temporalmente inconsistentes;
6. ausencia de autoridad institucional implícita.
