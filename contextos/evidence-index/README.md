# Evidence Index v0.1 — inventario de evidencia de Context.OS

Convierte los documentos y contratos que **ya existen** en el repositorio en
entradas con identidad estable, checksum, tipo, versión y fecha. Nada más.

No integra Radar MCP, no modifica el runtime (`contextos/runtime.ts`,
`policyEngine.ts`, `evidence.ts` y `contracts.ts` quedan intactos), no descarga
contenido externo y no inventa fuentes: lo que un documento no declara se
**reporta como ausente**, nunca se rellena.

## Lo que sí hace

- recorre una **lista blanca** de rutas del repositorio (solo lectura);
- calcula `checksum` sha256 del contenido y un `evidence_id` determinístico;
- extrae `version` y `date` de los patrones que el repositorio ya usa;
- deriva `kind` de la **ruta**, que es el único hecho que no depende de la prosa;
- copia `status` solo si el documento declara un marcador explícito;
- produce un **reporte de cobertura** y la lista de documentos incompletos;
- compara dos índices (`diffEvidenceIndex`) para detectar documentos que cambiaron;
- se traduce a `CodeLensIndex` **sin cambiar una sola regla de la compuerta**.

## Lo que no hace

- no escribe archivos, no toca red, no usa credenciales ni servicios externos;
- no descarga ni cataloga fuentes externas: **ninguna entrada es `externa`**;
- no decide si algo es verdad: `VERIFICADO` es curaduría humana, no inferencia;
- no vigila el sistema de archivos: para saber que algo cambió hay que comparar
  el índice actual contra uno previo;
- no lee fechas del sistema de archivos (`mtime`), porque no son reproducibles;
- el checksum **no es firma digital, sello de tiempo ni prueba de inmutabilidad
  frente a un atacante** — misma limitación que el runtime.

## Forma de una entrada

```jsonc
{
  "evidence_id": "ev:<sha256 de {uri, checksum}>",
  "uri": "repo:docs/marco/BIBLIOTECA_LEGAL.md",
  "path": "docs/marco/BIBLIOTECA_LEGAL.md",
  "kind": "marco",
  "version": "1.0",          // ausente si el documento no la declara
  "date": "2026-08-01",      // ISO; ausente si la fecha está incompleta
  "status": "POR_VERIFICAR", // VERIFICADO solo con marcador explícito
  "checksum": "sha256:…",
  "hashAlgorithm": "sha256",
  "bytes": 12345,
  "missing": ["version", "estatus"]
}
```

`evidence_id` depende de `(uri, checksum)`: **mismo contenido en la misma ruta ⇒
mismo id en cualquier máquina**; si el documento cambia, cambia el id, y esa es
justamente la señal que Context.OS necesita para revisar lo que ya citó.

## Patrones de metadatos reconocidos

Todos existen hoy en el repositorio; no se inventó ningún formato nuevo:

| Metadato | Patrones | Ejemplo real |
|---|---|---|
| Fecha | ISO en la cabecera; fecha larga en español | `**Fecha:** 2026-07-07`, `**Fecha:** 12 agosto 2026`, `Última revisión: 2026-08-01` |
| Versión | etiqueta o token; campo `version` en JSON; `version`/`*_SCHEMA_VERSION` en TS | `· v1.0`, `**Versión:** 2.0`, `"version": "1.0"`, `CONTEXTOS_SCHEMA_VERSION` |
| Estatus | marcador explícito | `**Estatus:** VERIFICADO` |
| Tipo | prefijo de ruta | `docs/actas/` → `acta` |

Una fecha sin día (`Agosto 2026`) **no** se completa: se reporta ausente.

## Cobertura hoy (`npm run evidencia:reporte`, 2026-08-29)

| Métrica | Valor |
|---|---|
| Entradas indexadas | **138** |
| Con versión declarada | 22 (16 %) |
| Con fecha declarada | 34 (25 %) |
| Con ambas | 2 (1 %) |
| Con estatus `VERIFICADO` | **0 (0 %)** |
| Documentos con metadatos incompletos | 138 (100 %) |

Por tipo: `ficha-modulo` 29 · `marco` 17 · `ficha-orbe` 10 · `expediente-regulatorio` 9 ·
`documento` 9 · `auditoria` 8 · `plataforma` 7 · `presentacion`, `acta`, `agentes`,
`investigacion`, `registro-modulos`, `registro-orbe`, `contrato-semantico`,
`contrato-runtime` con el resto.

**Lectura honesta del 0 %:** el repositorio no tiene hoy una convención de
estatus por documento (`BIBLIOTECA_LEGAL.md` marca VERIFICADO por *fila* de tabla,
no por archivo). Como el índice no infiere, todo entra como `POR_VERIFICAR` y
CodeLens lo trata como procedencia **débil** → `yellow`. Eso es correcto: que un
archivo exista no significa que su contenido esté verificado. Subirlo a verde es
trabajo humano de curaduría —añadir `**Estatus:** VERIFICADO` donde corresponda—
y no requiere ningún cambio de código.

## Uso

```bash
npm run evidencia:reporte           # resumen de cobertura
npm run evidencia:reporte -- --json # índice completo a stdout
npm run test:evidence-index         # pruebas del incremento
```

```ts
import { buildEvidenceIndex, readSourceFiles, toCodeLensIndex } from './contextos/evidence-index';
import { evaluateCandidate } from './contextos/codelens';

const { entries, report } = buildEvidenceIndex(readSourceFiles(process.cwd()));
const verdict = evaluateCandidate(candidato, toCodeLensIndex(entries));
```

El puente acepta la cita por ruta (`repo:docs/…`) o por `evidence_id`, y marca
`digestMismatch` para los URIs que `diffEvidenceIndex` reporte como cambiados.

## Límites conocidos

1. **El índice no prueba que una afirmación sea cierta**: prueba que el documento
   citado existe, con qué contenido y en qué versión declarada.
2. **La extracción es léxica**: si un documento declara su fecha con un formato
   nuevo, el índice dirá "ausente". Es preferible a adivinar.
3. **Sin fuentes externas**: una ley del DOF citada en un documento no se
   descarga ni se cataloga; solo se indexa el documento del repo que la cita.
4. **Sin `mtime` ni git**: el índice no sabe *cuándo* cambió un archivo, solo que
   su checksum difiere del índice previo que se le entregue.
5. **`docs/interno/` queda fuera** por decisión explícita, igual que los `.html`
   de `docs/orbe/` (herramientas, no evidencia) y cualquier binario.
6. **La lista blanca se amplía a mano**: descubrir carpetas nuevas es una
   decisión humana, no un efecto automático del escáner.

## Próximo incremento (no incluido a propósito)

1. convención de `**Estatus:**` por documento y su curaduría humana;
2. persistir un índice sellado para que `diffEvidenceIndex` tenga un previo real;
3. afirmaciones canónicas (`canonicalClaims`) construidas desde los registros;
4. recién entonces, exposición por adaptador — sin mover reglas fuera del núcleo.
