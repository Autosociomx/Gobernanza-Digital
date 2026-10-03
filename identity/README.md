# Identity Gateway — P1 LAB

Capa neutral de autenticación para desacoplar la identidad interna de los proveedores externos.

## Principios

- `ActorId`/`CitizenId` son identificadores internos.
- teléfono, CURP, passkey y Llave MX son credenciales o proveedores, no claves primarias.
- biometría no se almacena en este módulo.
- passkeys/WebAuthn deberán apoyarse en el autenticador local del dispositivo.
- Llave MX permanece `NOT_CONNECTED` hasta existir integración institucional autorizada.
- el gateway no concede por sí mismo capacidades administrativas; Context.OS conserva la decisión de política.

## P1

Incluye contratos canónicos y un provider explícito `LlaveMxNotConnectedProvider` para impedir que una demo sea presentada como autenticación oficial.
