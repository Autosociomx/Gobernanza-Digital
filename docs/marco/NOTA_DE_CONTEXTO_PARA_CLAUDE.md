# Nota de Contexto para Claude — Relevo de Sesión

> **⏳ Antecedente histórico — no es el estado actual del repositorio.**
> Redactada el 1 de agosto de 2026 y sin revisión de fondo desde entonces.
> Sus §1 y §2 (la tesis SOATM y los principios del Parlamento) siguen vigentes y
> están recogidos en `CLAUDE.md` §1 y §3. Sus §3 y §4 describen un `main`
> anterior a Context.OS, al registro semántico y al canon del Orbe: **no los uses
> como estado**. Para eso: `docs/marco/ESTADO.md`.
> No se borra, por `docs/marco/GOBERNANZA_REPOSITORIO.md`; se corrige hacia adelante.

**De:** la sesión del Parlamento (Kimi) · **Para:** Claude (y cualquier sesión futura)
Fecha: 2026-08-01 · Estatus: antecedente histórico (ver bandera arriba)

> Lee primero, en este orden: (1) `docs/marco/GLOSARIO_OFICIAL.md`, (2) esta nota, (3) `docs/marco/BIBLIOTECA_LEGAL.md`, (4) `docs/marco/ACTA_005_SANEAMIENTO_REPOSITORIO.md`. Con esos cuatro documentos tienes el contexto completo del proyecto. No improvises fuera de ellos.

## 1. Qué es este proyecto

**Nayarit Digital · ConnectX** es el SOATM (Sistema Operativo de Atención y Tramitación Municipal) de Tepic, Nayarit: una plataforma de gobierno digital municipal, de código abierto, dirigida por Miguel Alexis. Stack: React 19 + TypeScript + Vite 6 + Tailwind 4 + Firebase (Firestore/Auth) + Netlify.

**La tesis central (no negociable):** el SOATM no es una invención del proyecto. La LNETB federal (Arts. 2, 3, 66–76) y la Ley de Gobierno Digital del Estado de Nayarit (Arts. 2, 5 y 6) **ya lo ordenan**. *"La ley ya lo mandaba; nosotros lo descubrimos y lo convertimos en software abierto."* Toda comunicación parte de ahí.

## 2. Los principios del Parlamento (cómo se trabaja aquí)

1. **Frase escudo:** *"En gobernanza digital, todo lo comprobamos con hechos."* Se defiende con cuatro hechos en orden: la ley (verificable), el código (abierto y auditable), el módulo que ya opera en vivo (Portal de Citas sobre Firestore real), la bitácora (todo acceso sellado).
2. **Semáforo de honestidad:** 🔴 lo indefendible se elimina (nombres de políticos en componentes públicos, promesas electorales, PNL/manipulación, cifras sin fuente). 🟡 lo legítimo pero aún no real se etiqueta (SIMULADO / PROYECCIÓN / META). 🟢 lo verificable se exhibe.
3. **Ninguna cifra simulada sin etiqueta.** La banda DEMO del C5 no es una debilidad: es la prueba de integridad. "En esta plataforma hasta la maqueta es honesta."
4. **Branding institucional, nunca personal.** Se firma "Presidencia Municipal de Tepic", no personas. Foco público: Tepic (ruta estatal a los 20 municipios que la LGD obliga).
5. **Sindicato co-autor:** pacto de cero despidos; comunicación honesta, sin eufemismos.
6. **Citas legales solo desde la Biblioteca Legal**, y solo en estatus VERIFICADO. Lo POR VERIFICAR no se afirma en público.
7. **Cada botón lleva a su vista real** — el ruteo se audita completo antes de cualquier entrega.
8. **Antes de dar por terminado:** `node scripts/verificar-regresiones.mjs` (la Guardia) + `./node_modules/.bin/tsc --noEmit` + `vite build`, los tres en verde. (`npx tsc` instala un paquete falso — usar el binario local.)

## 3. Estado del repositorio (2026-08-01)

- `main` contiene la **corrección institucional integral** (PR #37, merge `ab3faa1`): tesis SOATM en PitchDefense/Whitepaper/Landing, citas legales reales, purga electoral y de nombres personales, prompt sindical honesto, glosario oficial, Biblioteca Legal.
- PR #38 (abierta): Acta 005 (auditoría de las 37 PRs y 36 ramas) + esta nota + estructura + océanos azules.
- El historial tiene 7 eras (ver Acta 005). Las eras II–IV contienen residuos electorales **ya corregidos y documentados** — no se ocultan, se explican.
- Ramas: purga de ~28 obsoletas autorizada (ejecuta el director desde la UI). Convención vigente: `feat/ fix/ docs/ chore/`.

## 4. Pendientes (en orden de prioridad)

1. **Reaplicar sobre el `main` actual** el modo visitante de CitizenApp (portal público sin muro de login; pestañas perfil/seguridad/canjes degradan a LoginView) y la banda DEMO persistente del C5 + gabinete institucional + tarjetas LGD del Observatorio. OJO: `main` avanzó (Orbe 3D, enlaces profundos `?view=&modulo=`); **resincronizar antes de editar — no pisar trabajo ajeno**.
2. **HTML del triaje médico** que el director anunció y aún no entrega: integrarlo/revisarlo con estos mismos estándares.
3. Votos del Acta 005 pendientes: PR #34 (rehacer Obras Nayarit sobre main), PR #35 (fusionar si es solo docs), protección de `main` en Settings.
4. Pasos manuales del director: reglas Firestore/Storage en producción, env vars en Netlify, **rotar la key de Gemini**, decisión sobre Cloud Function de subida de staff.
5. Biblioteca pendiente: NOM-024-SSA3-2012 (PDF), Iniciativa 18 Bis (SIL), Presupuesto Egresos Tepic 2026, PND 2025–2030, Ley Ganadera de Nayarit.

## 5. Cómo hablarle al director

Español, directo, con jerga correcta de gobierno digital mexicano. Él piensa en términos de hechos, folios y trazabilidad. Si una propuesta no puede sostenerse con la ley, el código o la bitácora, no se propone. Cuando pida "estructura", entrega documentos en `docs/marco/` empujados por PR — nunca solo palabras en el chat.

*Registrado en sesión del Parlamento. El relevo es un hecho: queda escrito.*
