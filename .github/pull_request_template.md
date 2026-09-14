<!--
Plantilla de PR — Nayarit Digital / ConnectX · SOATM

Rellena lo que aplique y borra lo que no. Dos cosas no son opcionales:

1. Si tocas un archivo protegido (CLAUDE.md §3), decláralo abajo.
2. Si tocas contextos/, src/orbe/, shared/semantic/, evidencia, adapters,
   contratos, policy, consentimiento o identidad, el bloque «arquitectura» es
   obligatorio: sin él la compuerta de arquitectura falla.
   Guía completa: docs/marco/COMPUERTA_ARQUITECTURA.md
-->

## Qué cambia

<!-- Qué hace esta PR y por qué, en dos o tres párrafos. -->

## Archivos protegidos modificados

<!-- Tabla archivo → qué se cambia. Si no tocas ninguno, escribe «Ninguno». -->

| Archivo | Qué se cambia |
|---|---|
| | |

## Declaración de impacto arquitectónico

<!--
Obligatoria si el cambio toca la arquitectura. Vocabulario válido:

  impact          ARCHITECTURE_CHANGE · CONTRACT_CHANGE · AUTHORITY_CHANGE
                  EVIDENCE_CHANGE · INTEGRATION_CHANGE · NO_ARCH_IMPACT
  evidence_level  E0_DECLARED · E1_DOCUMENTED · E2_CODE_INSPECTED
                  E3_REPRODUCIBLE_EXECUTION · E4_DEPLOYED_VERIFIED
                  E5_INSTITUTIONAL_OPERATION_VERIFIED
  maturity        PROPOSED · EXPERIMENTAL · VALIDATED · PILOT · PRODUCTION · INSTITUTIONAL
  semaforo        VERDE · AMARILLO · ROJO · GRIS

Madurez y evidencia son ejes independientes: un componente EXPERIMENTAL puede
tener evidencia E3. Nadie sube su propio nivel de evidencia sin la prueba que
lo sostiene; la compuerta verifica el nivel declarado y nunca lo eleva.
-->

```arquitectura
component: Context.OS
impact: NO_ARCH_IMPACT
evidence_level: E1_DOCUMENTED
maturity: EXPERIMENTAL
semaforo: AMARILLO
authority_changed: false
institutional_effects: false
verified_at_commit: <sha>
evidence:
  documento: docs/marco/ESTADO.md
  ruta: contextos/runtime.ts
  comando: npm run test:orbe-contextos
  resultado: 45/45
adr:
open_gaps:
  -
```

## Verificación

<!-- Los comandos que corriste y su resultado real. Si algo falla, dilo aquí. -->

```
node scripts/verificar-regresiones.mjs
node scripts/verificar-estado.mjs
node scripts/compuerta-arquitectura.mjs --solo-canon
npm run lint
npm test
npx vite build
```

## Alcance — lo que esta PR NO hace

<!-- Lo que queda fuera, y por qué. Es la parte que evita que una PR se lea
     como una promesa. -->
