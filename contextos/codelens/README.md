# CodeLens v0.1 — compuerta de calidad de Context.OS

CodeLens **no es memoria, no es un agente autónomo y no es una arquitectura
paralela**. Es una función determinística que evalúa *candidatos* a conocimiento
y devuelve un veredicto. Nada más.

`Context.OS` sigue siendo el dueño de: políticas, permisos, evidencia, versiones,
decisiones humanas y estado canónico. `MCP`, cuando exista, seguirá siendo
adaptador de transporte: no debe contener reglas de negocio ni llamar a esta
compuerta con criterios propios.

## Lo que sí hace

- evalúa **procedencia** (`pass` / `weak` / `missing`) contra el índice de
  evidencia que Context.OS le entrega;
- evalúa **reproducibilidad** (`pass` / `unknown` / `fail`): una fuente sin huella
  o no replicable en laboratorio no aprueba, y una huella que dejó de coincidir
  reprueba;
- detecta **contradicciones** contra afirmaciones ya canónicas, por comparación
  léxica (polaridad y cifras);
- detecta **posibles datos personales** (CURP, RFC, correo, teléfono, CLABE) y
  bloquea el candidato sin repetir el dato en la salida;
- marca **baja utilidad** cuando la afirmación es demasiado corta para evaluarse;
- exige **firma humana** en toda solicitud de promoción.

## Lo que no hace

- no promueve, no borra, no edita y no ejecuta acciones externas;
- no escribe en ningún almacén: devuelve el registro, no lo guarda;
- no lee disco, no abre red y no usa credenciales ni servicios externos;
- no consulta un LLM: **ningún modelo decide el veredicto**;
- no entiende el texto: la detección de contradicciones es conteo de palabras, y
  por eso toda contradicción es una señal para revisión humana, nunca un fallo;
- el checksum del registro **no es firma digital, sello de tiempo ni prueba de
  inmutabilidad frente a un atacante** (misma limitación que el runtime).

## Contrato

```jsonc
// entrada
{ "candidate_id": "…", "claim": "…", "evidence_refs": ["…"],
  "origin": "radar|human|agent|import", "requested_action": "read|propose|promote" }

// salida
{ "verdict": "green|yellow|red|pending_review",
  "provenance": "pass|missing|weak",
  "reproducibility": "pass|unknown|fail",
  "contradictions": [], "risk_flags": [], "reason_codes": [],
  "required_human_review": true, "evidence_ids": [] }
```

### Cómo se decide el veredicto

Orden fijo, sin excepciones:

| Condición | Veredicto |
|---|---|
| candidato inválido, sin procedencia, huella alterada o posible dato personal | `red` |
| contradicción con el estado canónico, o `requested_action: "promote"` | `pending_review` |
| procedencia débil, reproducibilidad no `pass`, o cualquier bandera de riesgo | `yellow` |
| todo lo anterior limpio | `green` |

Dos aclaraciones que evitan malentendidos caros:

1. **`green` no significa "promovido".** Significa "pasó la compuerta de calidad".
   La promoción a conocimiento canónico siempre exige `HUMAN_SIGNATURE_REQUIRED`.
2. **`required_human_review: false` solo aparece en `green`** para acciones `read`
   y `propose`. Una promoción nunca llega ahí.

Un origen de máquina (`agent`, `import`) tiene techo en `yellow` aunque la
evidencia sea impecable: lo que produjo una máquina sin curaduría no entra como
verde por sí solo.

## Uso

```ts
import { evaluateCandidate, buildEvaluationRecord } from './contextos/codelens';

const verdict = evaluateCandidate(candidato, indiceQueEntregaContextOS);
const registro = buildEvaluationRecord(candidato, verdict); // Context.OS decide si lo persiste
```

## Pruebas

```bash
npm run test:codelens        # solo la compuerta
npm run test:orbe-contextos  # lo que corre la Guardia en CI
```

Los seis casos exigidos están cubiertos: evidencia suficiente, fuente faltante,
contradicción detectada, posible dato personal, intento de promoción sin firma
humana y resultado reproducible con la misma evidencia.

## Próximo incremento (no incluido aquí a propósito)

1. que Context.OS persista `CodeLensEvaluationRecord` en el almacén append-only;
2. índice de evidencia real construido desde `docs/` y el código, con huellas;
3. detección de contradicciones con contrato semántico, no solo léxica;
4. exposición por adaptador (MCP u HTTP) **sin** mover ninguna regla de negocio
   fuera de este módulo.
