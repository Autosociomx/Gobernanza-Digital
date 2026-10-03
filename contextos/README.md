# Context.OS Runtime v0.1 — Vertical Slice 001

Primer núcleo ejecutable del **Institutional Control Plane** de Context.OS.

## Alcance

Implementa únicamente un flujo de laboratorio de bajo riesgo:

`ORBE/cliente -> IntentEnvelope -> Policy -> Consent (si aplica) -> Service Catalog -> LAB adapter -> EvidenceRecord`

Caso: reporte ciudadano de **bache o luminaria** en Tepic.

## Lo que sí hace

- contratos tipados y versionados;
- resolución explícita de servicio, sin adivinar;
- política determinística;
- minimización de datos;
- consentimiento obligatorio si se comparte contacto personal;
- consentimiento ligado a la solicitud y, cuando existe, al sujeto autenticado;
- idempotencia en memoria para impedir dobles ejecuciones durante el laboratorio;
- adapter `LAB_MOCK` sin efectos institucionales;
- evidencia con checksum SHA-256 y `correlationId`;
- pruebas del flujo permitido, bloqueos y manipulación de evidencia.

## Lo que no hace

- no autoriza actos administrativos;
- no crea órdenes municipales reales;
- no integra Llave MX;
- no usa LLM para decidir políticas;
- no persiste expediente ciudadano;
- el checksum no es firma digital, sello de tiempo ni prueba de inmutabilidad frente a un atacante;
- la idempotencia v0.1 vive en memoria y no sustituye un almacén transaccional;
- no sustituye Context.OS Observatory;
- no expone un conector institucional real.

## Evidence Index — inventario de evidencia

`contextos/evidence-index/` cataloga en solo lectura los documentos y contratos
que ya existen en el repositorio: `evidence_id` determinístico, ruta, versión,
fecha, tipo y checksum, más un reporte de cobertura (`npm run evidencia:reporte`).
No descarga nada, no inventa metadatos y no toca el runtime. Alimenta a CodeLens
sin cambiarle una regla. Detalle: `contextos/evidence-index/README.md`.

## CodeLens — compuerta de calidad

`contextos/codelens/` evalúa *candidatos* a conocimiento (procedencia,
reproducibilidad, contradicción, riesgo y utilidad) y devuelve un veredicto.
No promueve, no borra, no ejecuta y no guarda nada: el estado canónico, la
evidencia y la decisión humana siguen siendo de Context.OS. Toda promoción exige
`HUMAN_SIGNATURE_REQUIRED`. Detalle y límites: `contextos/codelens/README.md`.

## Servidor de laboratorio

Ejecutar:

```bash
npm run contextos:lab
```

Por defecto enlaza únicamente a `127.0.0.1:3011`.

Endpoints:

- `GET /api/contextos/v0.1/health`
- `POST /api/contextos/v0.1/execute`

La respuesta de un adapter siempre indica `executionMode: LAB_MOCK` para impedir que una demo sea presentada como integración oficial.

## Pruebas

```bash
npm run test:contextos
```

## Próximo incremento

1. conectar ORBE mediante `IntentEnvelope`;
2. persistir `EvidenceRecord` en un store append-only de laboratorio;
3. separar PDP (Policy Decision Point) y PEP (Policy Enforcement Point);
4. introducir un adapter institucional sólo cuando exista sistema, contrato, autenticación y autoridad verificables.
