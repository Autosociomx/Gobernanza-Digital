# ESTADO — fuente canónica del trabajo pendiente

**Actualizado:** 2026-09-13 · **Verificado contra:** `d5a78aa` (main) · **Vigencia:** 21 días
**Datos:** `docs/marco/estado.json` · **Verificador:** `node scripts/verificar-estado.mjs`

---

## Para qué existe este documento

`CLAUDE.md` dice **cómo se trabaja aquí** y casi no cambia. Este documento dice
**en qué va el trabajo** y cambia cada semana. Separarlos es deliberado: mezclar
reglas estables con estado volátil es lo que convirtió a
`NOTA_DE_CONTEXTO_PARA_CLAUDE.md` en un documento que sigue declarándose
«vigente» desde el 1 de agosto.

**Regla de uso, en dos líneas:**

1. Al abrir una sesión se lee esto **después** de `CLAUDE.md` y **antes** de tocar nada.
2. Al cerrarla se actualiza la entrada trabajada y la fecha de arriba. Si no se
   actualizó, el trabajo no está terminado.

El verificador falla el build si el archivo caduca, si una evidencia citada no
existe, si una entrada apunta a una dependencia inexistente o si esta prosa deja
de mencionar alguna entrada del JSON. No es burocracia: es la misma disciplina
que la Guardia aplica al bundle, aplicada al registro.

**Lo que este documento no es.** No sustituye a `docs/marco/modulos/INDICE.json`
(completitud de código, 29 módulos) ni a `docs/orbe/modulos.json` (madurez
conceptual, 9 módulos). Aquellos miden **módulos**; este mide **trabajo**.
Tampoco sustituye a las actas: las actas son el registro histórico y no se
borran; esto es la foto del presente y se reescribe.

---

## 1. Lo que está bloqueando todo lo demás (P0)

Ninguna de las cuatro se resuelve escribiendo documentación. Mientras sigan
abiertas, el trabajo terminado se acumula en ramas sin poder integrarse.

| id | Qué pasa | Decide |
|---|---|---|
| **CI-01** | En un clon limpio la Guardia no puede terminar en verde: `src/firebase.ts` importa `firebase-applet-config.json`, que está gitignoreado desde el 13-ago, y el workflow ejecuta `npm run lint` y `vite build` sin materializarlo | sesión |
| **CI-02** | Los jobs de Actions se completan en 3–5 s sin producir logs, en todas las corridas recientes y también sobre `main`: el runner no llega a ejecutar sus pasos | director |
| **PR-02** | La suite E2E que `netlify.toml` exige antes de compilar falla en `main` (caso 8, «Runtime caído») y encima no termina: deja el `labServer` huérfano. El PR #63 la corrige y lleva 7 días abierto | director |
| **CI-03** | Los deploy previews de Netlify están en rojo desde mediados de agosto: de los tres tramos de su comando de build, dos están rotos en `main` (PR-02 y CI-01) | director |
| **PR-01** | 15 pull requests abiertas sin triaje, la más antigua de hace 48 días, ninguna capaz de cerrar en verde mientras CI-01 y CI-02 sigan vivos | director |

**CI-01 se corrige en esta misma entrega**, en el workflow y no en
`src/firebase.ts` — `CLAUDE.md` §2 prohíbe expresamente «arreglar» ese import, y
tiene razón: el archivo está fuera de git porque contiene una llave real.

**CI-02 no es diagnosticable desde el repositorio.** Un job que llegara a
`npm ci` tardaría decenas de segundos y dejaría logs; estos no dejan ninguno.
Hay que mirar Settings → Actions y la facturación de Actions de la cuenta.
Es la comprobación de mayor rendimiento que puede hacer el director hoy.

---

## 2. Canon y contexto de sesión (P1)

| id | Qué pasa | Decide |
|---|---|---|
| **CANON-01** | Siete documentos compiten por ser el contexto canónico de una sesión de IA; solo dos están al día y ninguno de los caducados lo declara | director |
| **CANON-02** | `docs/interno/CONTEXTO_MASTER_CLAUDE.md` se ofrece como prompt de arranque («copia y pega todo el texto») y su contenido es 🔴 según el semáforo del propio repositorio | director |
| **CANON-03** | Dos propuestas previas de fuente canónica —PR #47 y PR #60— llevan semanas abiertas; mientras no se decida cuál vive, cada intento nuevo añade un canon paralelo | director |

CANON-03 es la más importante de las tres y la razón por la que esta entrega
**no** crea un canon nuevo de mil líneas: sería el tercero. Lo que añade es el
registro de estado que ninguno de los dos incluía, más el verificador que impide
que caduque en silencio.

---

## 3. Producto y registros (P1–P2)

| id | Qué pasa | Decide |
|---|---|---|
| **PROMPT-01** | El system prompt que `server.ts` carga hoy para `/api/ai/chat` está construido sobre PNL comercial («NLP & ASERCIÓN», «Lenguaje de Conquista», «Psicología del Usuario»): la categoría 🔴 del semáforo, viva en producción | director |
| **ORBE-01** | ORBE P0 no está cerrado: su propio reporte declara cinco verificaciones pendientes, y las tres primeras dependen de CI-01, CI-02, CI-03 y PR-02 | director |
| **MOD-01** | Los dos registros de módulos se contradicen en `tepictu-salud` (Orbe: `disenado`; código: `real`) y en `pulso-nayarit` (Orbe: `desplegado`; sin entrada en `INDICE.json`) | director |
| **PUB-01** | El módulo Gabinete muestra personas reales con KPIs inventados y fotos de stock como oficiales; bloquea abrir el repositorio desde el 13-jul | director |
| **DIR-01** | Pendientes manuales heredados del relevo del 1-ago sin confirmación posterior: rotar la llave de Gemini, reglas de Firestore/Storage en producción, variables de entorno en Netlify, Cloud Function de carga de personal | director |
| **MOD-02** | `INDICE.json` declara `1-759` para `municipal_letters` y el archivo tiene 760 líneas | sesión |
| **GIT-01** | Los 27 commits del bloque ORBE P0 v0.2 están en inglés, contra la convención en español de `CLAUDE.md` §6, y son posteriores a su merge | sesión |

Sobre MOD-01: `CLAUDE.md` §5 ordena señalar la contradicción en vez de elegir en
silencio, y eso es lo que se hace aquí. En `tepictu-salud` el registro conceptual
va por detrás del código. En `pulso-nayarit`, «desplegado» es el estado más alto
de su escala y en público necesita URL y fecha para sostenerse.

Sobre DIR-01: se listan como **por confirmar**, no como incumplidos. Ninguno
tiene registro posterior que los cierre, y solo el director puede cerrarlos.

---

## 4. Lo que está sano (y no hay que volver a auditar)

Registrado aquí para que ninguna sesión futura gaste su presupuesto
redescubriéndolo:

- **La Guardia de regresiones pasa.** `node scripts/verificar-regresiones.mjs` →
  «todo en orden», R1–R8 en verde.
- **Las pruebas pasan.** `npm run test:orbe-contextos` → 45/45 en 3 archivos.
- **El build compila.** Con la config de Firebase presente, `vite build`
  transforma 2 208 módulos y el bundle sale limpio: la cadena `GEMINI` no
  aparece en `dist/assets/`.
- **`INDICE.json` está al día.** 28 de 29 rangos siguen apuntando al componente
  correcto pese a los 161 commits transcurridos desde su commit de verificación
  (`f6536a6`, 22-jul). El único desfase es MOD-02, de una línea.
- **El canon congelado del Orbe está bien hecho.** `docs/orbe/canon/v0.1/`
  declara HEAD auditado, fecha, parent y hashes SHA-256, y prohíbe la edición
  silenciosa. Es el patrón a imitar, no a reemplazar.

---

## 5. Cómo se cierra una entrada

1. Se hace el trabajo en rama, según `CLAUDE.md` §6.
2. Se pasa la compuerta: Guardia + `npm run lint` + `vite build` (y
   `npm run test:orbe-contextos` si se tocó `contextos/`, `shared/semantic/` o
   `src/orbe/`).
3. Se cambia `estado` a `resuelto` en `docs/marco/estado.json`, se sube
   `actualizado` y se ajusta esta prosa.
4. Se corre `node scripts/verificar-estado.mjs` antes de entregar.

Una entrada marcada `resuelto` sin PR fusionada que lo respalde es exactamente
el tipo de afirmación que el semáforo clasifica en 🔴. No se hace.

---

*Diagnóstico completo con la evidencia detrás de cada entrada:
`docs/marco/AUDITORIA_FLUJO_SESIONES.md`.*
