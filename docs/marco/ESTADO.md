# ESTADO — fuente canónica del trabajo pendiente

**Actualizado:** 2026-09-14 · **Verificado contra:** `140f11f` · **Vigencia:** 21 días
**Datos:** `docs/marco/estado.json` · **Verificador:** `node scripts/verificar-estado.mjs`
**Semáforo generado:** `npm run estado:semaforo`

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

## 0. Cómo se lee cada entrada: dos ejes y un semáforo

Desde `ADR-0001` cada entrada declara tres cosas que no significan lo mismo.

**Madurez** (`PROPOSED` → `EXPERIMENTAL` → `VALIDATED` → `PILOT` → `PRODUCTION`
→ `INSTITUTIONAL`) dice qué tan lejos llegó el componente. Sólo la llevan las
entradas que describen un componente; un pendiente de triaje no tiene madurez.

**Fuerza de evidencia** (`E0_DECLARED` → `E1_DOCUMENTED` → `E2_CODE_INSPECTED` →
`E3_REPRODUCIBLE_EXECUTION` → `E4_DEPLOYED_VERIFIED` →
`E5_INSTITUTIONAL_OPERATION_VERIFIED`) dice con qué se sostiene la afirmación.
La llevan todas.

**No son el mismo eje.** `EXPERIMENTAL` + `E3` es normal y sano. `PILOT` + `E1`
es una señal: se está usando algo que nadie comprobó.

**Semáforo:** 🟢 cerrado con evidencia · 🟡 en proceso, con lo que falta escrito
· 🔴 bloqueado o contradictorio, con criterio de salida · ⚪ no iniciado ni
auditado, con su condición de arranque.

**Regla de honestidad del registro:** ninguna sesión sube un `evidence_level`
por su cuenta. En esta entrega sólo llevan E2 o más las entradas verificadas en
la propia sesión; lo que se apoya en la auditoría de #67 se quedó en
`E1_DOCUMENTED` aunque el trabajo detrás fuese más sólido. El verificador
comprueba que E2 traiga commit, que E3 traiga comando y resultado, que 🔴 y 🟡
traigan criterio de cierre, que ⚪ traiga condición de arranque y que 🟢 traiga
responsable. Manual completo: `docs/marco/COMPUERTA_ARQUITECTURA.md`.

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
| **ORBE-P0-E2E-008** 🔴 | El caso 8 de la suite E2E —degradación segura con Context.OS caído— falla en `main` afirmando ejecución que no ocurrió. Corregido y verificado en la rama del PR #63 (8/8), sin cerrar hasta que corra en CI | director |
| **PR-03** | El PR #67, que trae este registro y el arreglo de CI-01, sigue sin fusionarse. Sus cuatro comandos de verificación se reprodujeron aquí en verde | director |
| **ARCH-01** | Compuerta de arquitectura v0.1 (impacto, evidencia, autoridad, deriva de canon): corre en local con 35/35 pruebas y 10/10 fronteras, sin poder demostrarse en CI mientras CI-02 siga vivo | director |

**ORBE-P0-E2E-008 tiene evidencia E3 y sigue en 🔴 a propósito.** El caso 8
vigila que ORBE no afirme haber ejecutado cuando el runtime está caído: es la
frontera de autoridad puesta a prueba. Que pase en una máquina no la protege;
protegerla es que corra en cada fusión. Por eso su criterio de cierre es 8/8 en
CI real con el #63 fusionado, no 8/8 en local.

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

## 3.bis Arquitectura: lo que el canon dice y el código todavía no (P1)

| id | Qué pasa | Decide |
|---|---|---|
| **NEXT-01** 🔴 | El PR #66 construye en `next/` un segundo `ExecutionMode`, un segundo motor de política y un segundo emisor de evidencia, ninguno conectado a `contextos/` ni a `shared/semantic/`, y sin ADR que lo justifique | director |
| **CTX-01** | Context.OS es multidominio en el diseño y monodominio en el código: `shared/semantic/registry.ts` registra un único contrato activo y el catálogo un único servicio | director |
| **ID-01** | Identity Gateway e Institutional Graph siguen en borrador (PR #64); sin EXT-01 detrás, un gateway de identidad no autentica a nadie | director |

Sobre NEXT-01: el riesgo no es el experimento —su propio README dice que no
reemplaza nada y la PR es borrador— sino que se fusione sin decidir cuál de los
dos runtimes es el canónico. Además su política admite `executionMode:
INSTITUTIONAL` cuando el actor declara `assurance: institutional`, que es una
ruta de ampliación de autoridad sin ADR. Revisado sobre `ea0643f`.

Sobre CTX-01: un solo contrato activo **es** el alcance declarado del vertical
slice v0.1 y no es un defecto. Se registra para que ninguna presentación
describa la plataforma como multidominio en operación.

---

## 3.ter Lo que no ha empezado (⚪ gris)

Gris no significa «no importa»: significa que no hay código, no hay integración
y no se ha auditado. Cada una lleva escrito qué la desbloquea.

| id | Qué falta | Arranca con |
|---|---|---|
| **EXT-01** | Identidad institucional real: Llave MX, RENAPO, e.firma | Convenio con la institución que opera el servicio y credenciales de su ambiente de pruebas |
| **EXT-02** | Adapters municipales reales; el único que existe rechaza todo lo que no sea `LAB_MOCK` | Un sistema municipal receptor con interfaz documentada y autorización para escribir en él |
| **EXT-03** | Firma institucional de la evidencia; hoy la garantía declarada es `CHECKSUM_ONLY` | Una autoridad certificadora y una política de firma aprobadas |
| **EXT-04** | Operación institucional verificada (E5) y piloto gubernamental completo | Convenio de piloto, autoridad delegada por escrito y un responsable con nombre |
| **DRIVE-01** | Sincronización Drive ↔ GitHub: mencionada en el plan, sin rastro auditable en el repositorio | Que el director diga qué vive en Drive y qué debe terminar versionado aquí |

**Ninguna entrada de este registro puede declarar E5** mientras
`contextos/labServer.ts` siga declarando `authority: 'NONE'`. El verificador lo
comprueba: nada opera institucionalmente con autoridad nula.

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
2. Se pasa la compuerta: Guardia + verificador de estado + `npm run lint` +
   `vite build` (y `npm run test:orbe-contextos` si se tocó `contextos/`,
   `shared/semantic/` o `src/orbe/`).
3. Si el cambio toca la arquitectura, se declara el impacto en el cuerpo de la
   PR y se corre `npm run compuerta:canon`. Ver
   `docs/marco/COMPUERTA_ARQUITECTURA.md`.
4. Se cambia `estado` a `resuelto` en `docs/marco/estado.json`, se sube
   `actualizado`, se ajusta el semáforo y se ajusta esta prosa.
5. Se corre `node scripts/verificar-estado.mjs` antes de entregar.

Una entrada marcada `resuelto` sin PR fusionada que lo respalde es exactamente
el tipo de afirmación que el semáforo clasifica en 🔴. No se hace.

**Para pasar a 🟢 no basta con terminar el trabajo.** El verificador exige, en
la misma entrada: `estado: resuelto`, evidencia `E2` o superior,
`verified_at_commit`, `criterio_cierre` cumplido y escrito, y `responsable` con
nombre. Un cierre sin responsable no es un cierre.

---

*Diagnóstico completo con la evidencia detrás de cada entrada:
`docs/marco/AUDITORIA_FLUJO_SESIONES.md`.*
