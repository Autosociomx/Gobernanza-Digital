# Compuerta de arquitectura — manual operativo

Cómo se declara un cambio de arquitectura en este repositorio, qué comprueba la
compuerta y qué hacer cuando falla.

- **La decisión** y por qué está tomada así: `docs/marco/adr/ADR-0001-compuerta-de-arquitectura.md`
- **Las fronteras** que vigila: `docs/marco/fronteras-arquitectura.json`
- **El estado del trabajo**: `docs/marco/estado.json` + `docs/marco/ESTADO.md`

---

## 1 · Los dos ejes

No son lo mismo y no se sustituyen.

**Madurez** responde «¿qué tan lejos llegó esto?».

| | |
|---|---|
| `PROPOSED` | Escrito, no construido. |
| `EXPERIMENTAL` | Construido en laboratorio, sin autoridad. |
| `VALIDATED` | Construido y comprobado con pruebas propias. |
| `PILOT` | En uso acotado, con usuarios reales y supervisión. |
| `PRODUCTION` | En operación continua. |
| `INSTITUTIONAL` | En operación con autoridad delegada por la institución. |

**Evidencia** responde «¿con qué se sostiene lo que estás afirmando?».

| | Qué hay que traer |
|---|---|
| `E0_DECLARED` | Nada. Alguien lo dijo. |
| `E1_DOCUMENTED` | `evidence.documento`: una ruta que existe. |
| `E2_CODE_INSPECTED` | `evidence.ruta` + `verified_at_commit`. |
| `E3_REPRODUCIBLE_EXECUTION` | `evidence.comando` + `evidence.resultado` (o `artifact`). |
| `E4_DEPLOYED_VERIFIED` | `evidence.url`. No se verifica desde un clon: **escala a revisión humana**. |
| `E5_INSTITUTIONAL_OPERATION_VERIFIED` | `evidence.autoridad` + `evidence.responsable`. **Escala siempre.** |

Un componente `EXPERIMENTAL` con evidencia `E3` es normal y sano. Un componente
`PILOT` con evidencia `E1` es una señal: se está usando algo que nadie
comprobó.

**Regla que no se negocia:** la compuerta verifica el nivel declarado y **nunca
lo sube**. Que una prueba pase no convierte E2 en E3. Subir de nivel es un acto
humano, con nombre y fecha.

## 2 · El semáforo

| | Cuándo | Qué debe registrar |
|---|---|---|
| 🟢 VERDE | Evidencia suficiente, criterio de cierre cumplido, sin bloqueo abierto, despliegue verificado si aplica | evidencia, commit, fecha, prueba, responsable, criterio |
| 🟡 AMARILLO | Implementación parcial, falta CI, falta validación, falta revisión, hay dependencia externa | qué falta, de qué depende, acción siguiente, riesgo de no cerrarlo |
| 🔴 ROJO | Prueba crítica en fallo, contradicción entre código y canon, intento de ampliar autoridad, afirmación sin evidencia, CI o deploy bloqueado, segunda arquitectura sin ADR | el bloqueo exacto, su impacto, quién decide, criterio de salida |
| ⚪ GRIS | Sólo existe como idea, sin código, sin auditar, o depende de una institución no conectada | la condición de arranque |

El verificador del estado los obliga: 🔴 y 🟡 sin `criterio_cierre` fallan; ⚪
sin `condicion_de_arranque` falla; 🟢 exige entrada resuelta, evidencia E2 o
más, commit, criterio y responsable.

Para ver el semáforo completo:

```bash
npm run estado:semaforo
```

Se genera desde `estado.json`. **No se escribe a mano en ningún documento**: un
semáforo copiado a prosa es un semáforo que envejece.

## 3 · Cómo se declara un cambio

En el cuerpo de la PR, un bloque cercado:

````markdown
```arquitectura
component: Context.OS
impact: CONTRACT_CHANGE, EVIDENCE_CHANGE
evidence_level: E3_REPRODUCIBLE_EXECUTION
maturity: EXPERIMENTAL
semaforo: AMARILLO
authority_changed: false
institutional_effects: false
verified_at_commit: 140f11f
evidence:
  ruta: contextos/contracts.ts
  comando: npm run test:orbe-contextos
  resultado: 45/45
adr: docs/marco/adr/ADR-0001-compuerta-de-arquitectura.md
open_gaps:
  - jurisdiccion
```
````

`.github/pull_request_template.md` ya lo trae. El formato es un subconjunto
pequeño de YAML: `clave: valor`, listas con `- ` y un nivel de anidamiento. Lo
que el subconjunto no entiende se reporta como error, no se adivina.

**Cuándo es obligatorio.** Cuando el cambio toca `contextos/`, `src/orbe/`,
`shared/semantic/`, `src/components/orbe/`, `src/services/contextosRuntimeClient.ts`,
`scripts/test-orbe-p0-e2e.mts`, la propia compuerta o las fronteras. Si no toca
nada de eso, el bloque es opcional y, si aparece, igual se valida.

**Vocabulario de impacto:**

| | |
|---|---|
| `ARCHITECTURE_CHANGE` | Cambia una pieza estructural o cómo se conectan. |
| `CONTRACT_CHANGE` | Cambia un contrato semántico o el esquema de Context.OS. |
| `AUTHORITY_CHANGE` | Cambia qué puede autorizar el sistema. |
| `EVIDENCE_CHANGE` | Cambia cómo se emite o qué garantiza la evidencia. |
| `INTEGRATION_CHANGE` | Cambia una conexión con algo externo. |
| `NO_ARCH_IMPACT` | No mueve nada de lo anterior. No se combina con otros. |

Algunos impactos no son opinión: tocar `contextos/contracts.ts`,
`shared/semantic/types.ts` o `shared/semantic/contracts/` es `CONTRACT_CHANGE`
por definición, y la compuerta lo exige.

## 4 · Qué comprueba, fase por fase

### B · Impacto

Falla si: no hay declaración y el cambio la exigía; el vocabulario está
inventado; `NO_ARCH_IMPACT` aparece junto a otro impacto o sobre un cambio de
contrato; falta `component`, `evidence_level` o `semaforo`; falta `maturity`,
`authority_changed` o `verified_at_commit` en un cambio con impacto.

`authority_changed` se declara siempre de forma explícita. **Omitirlo no
equivale a `false`.**

### C · Evidencia

Se activa cuando el título o el cuerpo de la PR afirman: *funciona, resuelto,
validado, demostrado, listo, estable, integrado, cerrado, terminado, probado*.
Las palabras que aparecen dentro del propio bloque de declaración no cuentan:
ahí son etiquetas del formato.

Falla si el nivel declarado no trae lo que exige (§1), si el comando invoca un
script de npm que no existe, si el artefacto citado no está en el repositorio,
o si el semáforo es VERDE con evidencia E0 o E1.

E4 y E5 **nunca pasan solos**: escalan a revisión humana. E5 además es
incompatible con el estado actual del sistema mientras el runtime declare
`authority: NONE`.

### D · Autoridad

Lee el parche, no el árbol: le importa el movimiento. Señala el retiro **neto**
de `LAB_MOCK`, `authority: 'NONE'` o `CHECKSUM_ONLY`; la aparición de
`executionMode: 'INSTITUTIONAL'` o `'SANDBOX'`; una `authority` distinta de
`NONE`; un proveedor de modelo dentro de `policyEngine.ts`, `consent.ts`,
`runtime.ts`, `evidence.ts` o los adapters; la importación de un adapter desde
`src/` o `server.ts`; y el lenguaje de firma digital o inmutabilidad en el
emisor de evidencia.

Sin `authority_changed: true` → **bloqueo**. Con `authority_changed: true` pero
sin ADR válido → **bloqueo**. Con las dos cosas → **escalamiento**, nunca
aprobación automática.

### E · Deriva del canon

Lee `docs/marco/fronteras-arquitectura.json` y comprueba, para cada frontera:

- que el archivo de código siga conteniendo el literal que la sostiene —si no,
  🔴: *el canon afirma algo que el código no sostiene*;
- que cada documento de canon siga enunciándola —si no, *el código sostiene la
  frontera pero el canon dejó de decirla*;
- que, si el parche mueve el literal, se actualice el canon de esa frontera o
  se declare un ADR;
- que el impacto declarado incluya el que corresponde a la frontera movida;
- que `docs/marco/estado.json` se actualice cuando el impacto es de
  arquitectura, contrato, autoridad o evidencia.

Corre también sin PR, sobre `main`:

```bash
npm run compuerta:canon
```

## 5 · Correrla en local

```bash
git commit …                                   # la compuerta clasifica commits, no el árbol de trabajo
node scripts/compuerta-arquitectura.mjs --base=origin/main --cabeza=HEAD --cuerpo=cuerpo-pr.md
```

`--cuerpo` apunta a un archivo con el texto de la PR (el bloque incluido).
También sirven las variables `COMPUERTA_BASE`, `COMPUERTA_CABEZA`,
`COMPUERTA_CUERPO`, `COMPUERTA_TITULO` y `COMPUERTA_PR`, que son las que usa el
workflow.

Salidas: `0` sin bloqueos · `1` bloqueado · `2` escalado a revisión humana.

## 6 · El recibo

Cada corrida escribe `artifacts/recibo-arquitectura.yml` y `.json`, que el
workflow sube como artifact:

```yaml
change_id: ARCH-2026-PR68
component: Context.OS
impact:
  - CONTRACT_CHANGE
evidence_level: E3_REPRODUCIBLE_EXECUTION
evidence_level_elevado_por_la_compuerta: false
maturity: EXPERIMENTAL
semaforo: AMARILLO
authority_changed: false
verified_at_commit: 140f11f…
fronteras_movidas: []
requiere_revision_humana: false
veredicto: PASA
```

Registra **lo declarado y lo verificado por separado**. Si alguien declaró E3 y
la comprobación falló, el recibo lo dice en vez de corregirlo. Los recibos que
convenga conservar se versionan en `docs/marco/recibos/`.

## 7 · Cuando falla

La compuerta imprime el identificador del hallazgo (`B13`, `C4`, `D1`, `FR-03`)
y qué falta. Tres casos frecuentes:

- **`B1` · no declaraste impacto.** Copia el bloque de la plantilla y rellénalo.
- **`FR-xx` en rojo tras renombrar un archivo.** La frontera apunta a la ruta
  vieja: actualiza `fronteras-arquitectura.json`. Esto es mantenimiento del
  canon, no un rodeo a la compuerta.
- **`D1`–`D8` · tocaste la frontera de autoridad.** Si es deliberado, escribe
  el ADR primero. Si no lo es, es justo el aviso que la compuerta existe para
  dar.

Lo que **no** se hace para pasar la compuerta: bajar una frontera de
`fronteras-arquitectura.json`, relajar una prueba, o editar un documento de
canon sólo para que contenga la palabra que el detector busca. Si una frontera
ya no aplica, se retira con un ADR que lo diga.

## 8 · Límites de esta versión

Declarados para que nadie los descubra creyendo que encontró un defecto:

- **No corre en CI todavía.** Los jobs de Actions de este repositorio terminan
  en 3–5 segundos sin logs (`CI-02`). El workflow está escrito y la compuerta
  corre en local; que funcione en un runner sigue sin demostrarse.
- **La fase C sólo bloquea cuando el cambio toca la arquitectura.** Una PR de
  documentación que diga «resuelto» recibe un aviso, no un bloqueo. Ampliarlo a
  todo el repositorio se decidirá cuando la compuerta tenga historial.
- **La detección de deriva es por literales, no semántica.** Comprueba que un
  texto siga estando donde el canon dice; no entiende el código. Es deliberado:
  una comprobación que se puede leer en diez segundos y que nunca depende de un
  modelo.
- **Las fronteras son diez.** Cubren modo de laboratorio, autoridad nula,
  garantía de la evidencia, las dos versiones de contrato, el puente apagado,
  el acto de habla informativo, la política determinística, el consentimiento
  previo y el aviso permanente de la interfaz. Faltan las de identidad y
  jurisdicción, que no existen todavía en el código.
