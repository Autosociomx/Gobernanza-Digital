# COMPONENTES_PARA_SENADO

Fecha: 2026-09-30 · Autor: Claude · Estado: propuesta para decisión del responsable humano.

**Advertencia de método.** (1) Ninguna fuente oficial pudo *leerse* en esta sesión (bloqueo de red; ver `PARALELO_NACIONAL.md`). (2) No localicé ninguna fuente del Senado que formule las objeciones sobre IA, ciberseguridad o concentración de datos; la columna "objeción" es **hipótesis de trabajo con fuente PENDIENTE**: buscar en la Gaceta del Senado y en el Sistema de Información Legislativa. No se presenta ninguna objeción como postura oficial. (3) "Diferente" está limitado a una búsqueda parcial.

Se proponen **cuatro** componentes (el prompt pedía 3 a 5). Ninguno llega a PILOTO.

## 1. Política determinista para acciones asistidas por IA (Context.OS + contrato semántico)
- **Para un legislador:** "Un asistente ciudadano no puede ejecutar nada por su cuenta: un reglamento en código, sin IA, decide si procede y exige el consentimiento de la persona."
- **Prueba:** `npm run test:orbe-contextos` → 3 archivos, 45 pruebas en verde (2026-09-30). `npm test` → 54/54. E2E HTTP `npm run test:orbe-p0-e2e` → **7/8; el caso 8 falla** (runtime caído), ver `INVENTARIO_REPOSITORIO.md`. No se puede presentar el E2E como verde hasta corregirlo o explicarlo.
- **Objeción a la que respondería (hipótesis):** supervisión humana de la IA y límites a que un sistema automatizado actúe. Fuente oficial: **PENDIENTE**.
- **No prometer:** que sea producción; que autorice actos administrativos (los adapters responden siempre `LAB_MOCK`, autoridad `NONE`); que sea infalible (hay un E2E fallando); que interprete lenguaje natural con un LLM (no lo hace, lo cual limita su cobertura: un solo caso de uso, bache o luminaria en Tepic).

## 2. Protección del expediente de salud por consentimiento (reglas de Firestore)
- **Para un legislador:** "Nadie abre el expediente de otra persona sin que el paciente vinculado lo haya autorizado, y el personal de salud solo registra con un código activo."
- **Prueba:** `npm run test:firestore-rules` → `11 pasadas / 0 fallidas / 11 total` (2026-09-30, emulador, Java 21).
- **Objeción (hipótesis):** concentración y uso indebido de datos personales sensibles. Fuente oficial: **PENDIENTE** (la Biblioteca Legal del repo cita la LFPDPPP, pero no la leí yo).
- **No prometer:** cumplimiento de la NOM de ECE (año y texto en discrepancia, PENDIENTE); interoperabilidad con IMSS/IMSS-Bienestar (no existe); que la interfaz esté probada (`SaludNayaritID.tsx` no tiene pruebas); que sustituya al ECE federal, que ya existe (F9).

## 3. Guardia de regresiones de seguridad
- **Para un legislador:** "El proyecto impide por diseño que una llave de IA o de pagos llegue al navegador: si alguien lo intenta, la publicación falla."
- **Prueba:** `node scripts/verificar-regresiones.mjs` → `✔ Guardia de regresiones: todo en orden.` (2026-09-30); corre también en CI (`.github/workflows/guardia-regresiones.yml`; resultado en CI **NO_VERIFICADO** por mí).
- **Objeción (hipótesis):** ciberseguridad de plataformas públicas. Fuente oficial: **PENDIENTE**.
- **No prometer:** que el sistema esté "seguro" o certificado. `CLAUDE.md` §3 admite que la llave se filtró **cuatro veces** antes de existir esta guardia; es un control reactivo, con alcance R1–R8, no una auditoría de seguridad. `server.ts` no autentica sus endpoints (`CLAUDE.md` §4.2).

## 4. Registro con huella de integridad (evidencia del runtime)
- **Para un legislador:** "Cada acción del asistente deja un registro con una huella digital de su contenido, para detectar alteraciones."
- **Prueba:** cubierto por `contextos/__tests__/runtime.test.ts` (dentro de los 45 en verde, 2026-09-30); `contextos/evidence.ts`, 63 líneas.
- **Objeción (hipótesis):** trazabilidad y rendición de cuentas de sistemas automatizados. Fuente oficial: **PENDIENTE**.
- **No prometer:** "inmutable", "firmado", "con validez jurídica" ni "Evidence OS" como producto: es `CHECKSUM_ONLY`, sin firma ni sellado de tiempo, y no es un componente independiente.

## Tesis transversal: titularidad institucional (aún no es un componente)
- **Para un legislador:** "La plataforma debe ser del municipio como institución: si cambia la administración, el código, los datos y las llaves se quedan."
- **Por qué no la propongo como componente:** hoy no hay prueba. No existe `LICENSE` en la raíz del repositorio, el repositorio está en una organización personal y la estrategia interna (`ESTRATEGIA_ESTANDAR_ABIERTO.md`) propone "candados" (certificación de personas, costo político de cambiar de proveedor, marca de propiedad exclusiva) que **contradicen** la tesis: ante un legislador se leerían como dependencia del proveedor, que es justamente lo que se quiere evitar.
- **Objeción a la que respondería (hipótesis):** dependencia de un proveedor y pérdida de continuidad al cambiar la administración. Anclas localizadas, sin leer: LNETB (código de terceros al Repositorio Nacional) y Ley Municipal (entrega-recepción). Fuente de la objeción en el Senado: **PENDIENTE**.
- **No prometer:** que sea "del municipio" mientras no exista la cesión o el acuerdo; que Click por Tepic "desaparece" (no verificado, C1).

## Actualización 2026-09-30: lo más fuerte está en ramas sin fusionar
Tras revisar las 84 ramas (ver `INVENTARIO_REPOSITORIO.md` §4), los candidatos con más sustancia para el encuadre de "interoperabilidad cívica" **no están en `main`**:
- **Federación** (`feat/federated-intent-runtime-v01`): 58 pruebas en verde, incluida la de que no se fabrica un folio oficial.
- **Identidad** (`feat/identity-institutional-graph-p1`): 61 pruebas; Llave MX como proveedor `NOT_CONNECTED` (integra, no sustituye; coherente con el ADR-0004 real).
- **Degradación segura** (`fix/orbe-p0-e2e-008-safe-degradation`): E2E 8/8.
- **Agentes con `REQUIRE_HUMAN`** (`premio-innovacion-…`): 57 pruebas; el agente de salud no diagnostica (pero su triaje es de 7 frases).
Antes de llevarlos al Senado hay que fusionarlos pasando la Guardia y el CI. Hasta entonces, lo presentable con prueba en `main` sigue siendo lo listado arriba.

## Orden de solidez (mi juicio, sujeto a contraauditoría de Codex)
3 > 2 > 1 > 4. El 2 y el 3 son los únicos con pruebas ejecutadas y reproducibles sin depender de una falla abierta.

## Qué NO llevar al Senado
Ver la lista cerrada de 9 puntos en `INVENTARIO_REPOSITORIO.md` §3 (cartas con hash falso y dominio `nayarit.gob.mx`, "Potencial Voto", maquetas, pagos, cifras no leídas, nombres que sugieren servicios oficiales, lenguas originarias).

## Lo que el Senado probablemente preguntará y hoy no podemos responder
- ¿Qué hace esto que Llave MX, el ECE federal, la Ventanilla 24/7 y Click por Tepic no hagan? Respuesta honesta hoy: **la capa de política y consentimiento**, y aún sin confirmar que no exista.
- ¿Quién es el responsable legal y qué vínculo tiene con un gobierno? `ESTADO_MADUREZ_TECNOLOGICA.md` declara que **no** es sistema oficial de Nayarit ni de Tepic.
