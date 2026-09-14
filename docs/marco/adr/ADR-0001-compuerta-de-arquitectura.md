# ADR-0001 · Compuerta de arquitectura: dos ejes, semáforo y cuatro comprobaciones

- **Estado:** aceptado
- **Fecha:** 2026-09-14
- **Decide:** dirección del proyecto (issue #68)
- **Componentes:** Context.OS, ORBE, Evidence.OS, registro semántico

---

## Contexto

Este repositorio produce canon más rápido de lo que consigue fusionarlo. La
auditoría del flujo de sesiones (`docs/marco/AUDITORIA_FLUJO_SESIONES.md`) lo
midió: quince PRs abiertas sin triaje, siete documentos compitiendo por ser el
contexto de una sesión de IA, y una nota de relevo que llevaba seis semanas
declarándose vigente. El problema no es falta de arquitectura escrita; es que
nada obliga a que la arquitectura escrita y el código sigan diciendo lo mismo.

A eso se suman dos confusiones que aparecen en casi todas las presentaciones
del proyecto:

1. **Madurez y evidencia se mezclan.** «Está en piloto» se usa como si fuera
   prueba de que funciona, y «lo probamos» como si fuera prueba de que está
   maduro. Son cosas distintas: un componente puede ser `EXPERIMENTAL` y tener
   evidencia reproducible; otro puede ser `PILOT` y no tener más que un
   documento que lo afirma.
2. **La palabra «listo» no significa nada verificable.** El semáforo de
   honestidad del proyecto ya obliga a etiquetar lo simulado en la interfaz;
   no existía el equivalente para las afirmaciones técnicas de una PR.

Y hay una frontera que este proyecto defiende de forma explícita: ningún
modelo —ORBE, Aura, Gemini, Claude, GPT— autoriza actos institucionales. Hoy
esa frontera vive en prosa (`CLAUDE.md` §4.4, el canon de ORBE) y en pruebas
sueltas. Basta una PR distraída para moverla.

## Decisión

Se adopta una **compuerta de arquitectura** en CI, con cuatro comprobaciones
sobre el parche propuesto, y dos ejes de clasificación que no se mezclan.

### 1 · Dos ejes independientes

**Madurez** — qué tan lejos llegó el componente:

`PROPOSED` · `EXPERIMENTAL` · `VALIDATED` · `PILOT` · `PRODUCTION` · `INSTITUTIONAL`

**Fuerza de evidencia** — con qué se sostiene la afirmación:

| Nivel | Qué exige |
|---|---|
| `E0_DECLARED` | Nada. Alguien lo dijo. |
| `E1_DOCUMENTED` | Un documento citado que existe en el repositorio. |
| `E2_CODE_INSPECTED` | Una ruta de código **y** el commit sobre el que se inspeccionó. |
| `E3_REPRODUCIBLE_EXECUTION` | Un comando que cualquiera puede volver a correr, con resultado o artefacto. |
| `E4_DEPLOYED_VERIFIED` | Un entorno desplegado verificado. No comprobable desde un clon. |
| `E5_INSTITUTIONAL_OPERATION_VERIFIED` | Operación institucional real, con autoridad delegada y trazabilidad. |

Nunca se confunden. `EXPERIMENTAL` + `E3` es una combinación legítima y
frecuente; `PILOT` + `E1` también existe y es justo la que conviene ver
señalada.

### 2 · Semáforo operativo

🟢 **VERDE** sólo con evidencia suficiente, criterio de cierre cumplido, sin
bloqueo abierto, con responsable y commit. 🟡 **AMARILLO** cuando falta algo y
está escrito qué falta y cuál es la acción siguiente. 🔴 **ROJO** cuando hay
contradicción, bloqueo o afirmación sin evidencia, con criterio explícito para
salir. ⚪ **GRIS** cuando no hay nada construido ni auditado, con la condición
que lo desbloquea.

### 3 · Un solo MASTER_STATE

`docs/marco/estado.json` es el registro operativo del estado del trabajo, y
lleva los dos ejes y el semáforo en cada entrada. **No se crea ningún registro
paralelo.** Los otros dos inventarios del repositorio siguen midiendo lo que
medían: `docs/marco/modulos/INDICE.json` la completitud de código por módulo,
`docs/orbe/modulos.json` la madurez conceptual del Orbe.

`docs/marco/fronteras-arquitectura.json` no es un cuarto registro: es la forma
ejecutable de reglas que el canon ya enuncia en prosa, y sólo existe para que
el detector de deriva tenga dónde anclarlas.

### 4 · Cuatro comprobaciones

- **B · Impacto** — toda PR que toque `contextos/`, `src/orbe/`,
  `shared/semantic/`, evidencia, adapters, contratos, policy o consentimiento
  declara qué mueve: `ARCHITECTURE_CHANGE`, `CONTRACT_CHANGE`,
  `AUTHORITY_CHANGE`, `EVIDENCE_CHANGE`, `INTEGRATION_CHANGE` o
  `NO_ARCH_IMPACT`. Sin declaración, la compuerta falla. Con una declaración
  que contradice el parche —`NO_ARCH_IMPACT` mientras cambia un contrato—
  también.
- **C · Evidencia** — si la PR afirma que algo funciona, está resuelto,
  validado o listo, debe declarar el nivel y traer lo que ese nivel exige. La
  compuerta verifica; **nunca eleva** el nivel declarado.
- **D · Autoridad** — si el parche retira `LAB_MOCK`, `authority: NONE` o
  `CHECKSUM_ONLY`, introduce un `executionMode` institucional, mete un
  proveedor de modelo en policy, consentimiento o evidencia, o ejecuta un
  adapter fuera de Context.OS, se bloquea. Con ADR y declaración explícita deja
  de bloquear y pasa a **escalar**: revisión humana. La compuerta no aprueba
  ampliaciones de autoridad.
- **E · Deriva** — compara canon y código en las dos direcciones. Si el código
  dejó de sostener lo que el canon afirma, 🔴. Si el parche mueve una frontera
  sin actualizar su canon ni declarar ADR, se bloquea.

### 5 · Recibo de arquitectura

Cada corrida emite un recibo (`artifacts/recibo-arquitectura.yml`, subido como
artifact de CI) con `change_id`, componente, impacto, nivel de evidencia,
madurez, semáforo, si cambió la autoridad, el commit verificado, las pruebas
declaradas, las fronteras movidas y las brechas abiertas. Los recibos que valga
la pena conservar se versionan en `docs/marco/recibos/`.

## Alternativas descartadas

**Un canon nuevo.** Ya hay dos propuestas de canon abiertas sin resolver (#47 y
#60) y el diagnóstico de #67 fue explícito: el problema es de integración, no
de falta de canon. Escribir un tercero habría repetido el error.

**Revisión humana como única compuerta.** Es lo que había. Funciona mientras
alguien lee cada PR completa; deja de funcionar en cuanto hay quince abiertas.

**Confiar la clasificación a un modelo.** Sería exactamente lo que la fase D
prohíbe: que un modelo decida sobre la frontera de autoridad. La clasificación
la declara una persona y la verifica un script determinístico.

**Un solo eje «estado del componente».** Es la confusión que este ADR viene a
deshacer.

**Declaración en un archivo versionado en vez del cuerpo de la PR.** La
clasificación es una afirmación de quien propone el cambio, no parte del
producto. Lo que sí queda versionado es el recibo.

## Consecuencias

- Toda PR sobre la arquitectura cuesta un bloque de diez líneas más. Es
  fricción deliberada: es el producto, no un efecto secundario.
- Las afirmaciones de las PRs se vuelven comparables entre sí y con el
  MASTER_STATE.
- Salir de `LAB_MOCK` deja de ser un cambio de una línea y pasa a exigir ADR,
  evidencia y revisión humana.
- El canon que nadie actualiza se vuelve visible en el momento en que el código
  se mueve, no seis semanas después.
- Aparece una obligación nueva: mantener `docs/marco/fronteras-arquitectura.json`
  cuando un archivo se renombra. Si no se mantiene, la compuerta falla —que es
  el comportamiento correcto: prefiere un falso bloqueo a una deriva silenciosa.

## Cómo se verifica

```bash
npm run test:compuerta        # 35 pruebas de las cuatro fases
npm run compuerta:canon       # deriva entre canon y código, sin PR
npm run estado:semaforo       # el semáforo, generado desde el MASTER_STATE
node scripts/verificar-estado.mjs
```

En local, sobre esta rama: 35/35 pruebas y 10/10 fronteras sin deriva. El
commit exacto queda registrado en el recibo `docs/marco/recibos/ARCH-2026-001.yml`.

Además se corrieron los cuatro escenarios negativos del criterio de cierre de
la issue #68, sobre el propio parche de esta entrega:

| Escenario | Resultado |
|---|---|
| PR sin declaración | bloqueada · `B1` |
| PR que declara `NO_ARCH_IMPACT` tocando la compuerta | bloqueada · `B12`, `B17` |
| PR que declara `E3` sin comando ni resultado | bloqueada · `C4`, `C5` |
| PR que retira la barrera `LAB_MOCK` del adapter declarando `authority_changed: false` | bloqueada · `D1` y `FR-01` en tres frentes: el código dejó de sostener el canon, falta el ADR que la frontera exige, y el impacto declarado no incluye `AUTHORITY_CHANGE` |

El cuarto se ejecutó sobre un árbol desechable creado con `git worktree`, que
se eliminó después: la barrera del adapter nunca se movió en esta rama.

**Lo que todavía no está demostrado:** que la compuerta corra en CI real. Los
jobs de GitHub Actions de este repositorio terminan en 3–5 segundos sin
producir logs desde principios de septiembre (entrada `CI-02` del MASTER_STATE),
así que ninguna de estas comprobaciones ha llegado a ejecutarse en un runner.
Por eso la entrada `ARCH-01` está en 🟡 y no en 🟢, y por eso el criterio de
cierre de la issue #68 sigue abierto.
