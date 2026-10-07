# Backlog: qué depende de nosotros vs. qué depende de una conexión externa

**Nayarit Digital · ConnectX** · Octubre 2026 · Documento vivo (se actualiza al cerrar cada bloque)

Regla de lectura: una conexión externa (RENAPO, Llave MX, catastro, SIAPA, SAT, e.firma, Stripe productivo, convenio con Tepic) **no la controlamos**. Lo que sí controlamos es dejar el lado nuestro **completo, probado y apuntado**, de modo que al llegar la conexión solo haya que cambiar una variable o un adaptador, no rediseñar.

Fuentes: `docs/presentacion-tepic/09_ALINEACION_ATDT/MATRIZ_DE_ALINEACION.md`, `docs/AUDITORIA_CODIGO_AGOSTO_2026.md`, `docs/marco/modulos/INDICE.json`.
Estados: ✅ hecho · 🟡 en curso · ⬜ pendiente.

---

## A. Depende SOLO de nosotros (se trabaja por bloques en sesiones)

| # | Tarea | Estado | Bloque |
|---|---|---|---|
| A1 | Envolver la app en `ErrorBoundary` (antes huérfano) | ✅ | 1 |
| A2 | Este backlog y su clasificación | ✅ | 1 |
| A3 | Contrato de conectores (interfaz TypeScript por integración: RENAPO, catastro, SIAPA, SAT, firma) con implementación `LAB_MOCK` y bandera de apagado, mismo patrón que Context.OS | ⬜ | 2 |
| A4 | Variables de entorno de cada conector documentadas en `.env.example` (apagadas por defecto) | ⬜ | 2 |
| A5 | Pruebas de contrato: el mismo test corre contra el mock y, luego, contra el conector real | ⬜ | 2 |
| A6 | Etiquetar con `SIMULADO`/`DEMO` toda cifra sin etiqueta en las 15 maquetas (regla del semáforo) | ⬜ | 3 |
| A7 | Accesibilidad WCAG: auditar con herramienta y corregir lo básico (foco, contraste, `aria`) | ⬜ | 3 |
| A8 | Un trámite de punta a punta con folio sellado (candidato: alta de negocio pyme) | ⬜ | 4 |
| A9 | Aviso de privacidad y archivo/conservación: redactar borradores (Ley de Archivos, LGPDPPSO) | ⬜ | 5 |
| A10 | Inventario de trámites en formato del Catálogo Nacional, dejando la clave nacional en "por verificar" | ⬜ | 5 |
| A11 | Decidir qué hacer con los 6 componentes huérfanos restantes (**decide el usuario**; no se borran solos) | ⬜ | — |
| A12 | One-pager de inversionista con cifras etiquetadas | ⬜ | 6 |
| A13 | Auditoría en `server.ts`: autenticación servicio-a-servicio en `/api/*` | ⬜ | 7 |

## B. Depende de la conexión externa (dejar apuntado, no inventar)

| # | Conexión | Qué falta del otro lado | Qué dejamos listo (bloque 2) |
|---|---|---|---|
| B1 | **RENAPO / Llave MX** (validación CURP) | Acceso o convenio y credenciales | Interfaz `verificarCurp`, mock, bandera `VITE_*_ENABLED=false` |
| B2 | **Expediente Llave MX** | Disponibilidad y lineamientos técnicos de consulta con autorización | Interfaz de consulta con consentimiento (reutiliza el modelo de consentimiento de Context.OS) |
| B3 | **Catastro / SIAPA** (no duplicidad) | Convenio municipal y API | Interfaz `consultarPredio` / `consultarAdeudo` |
| B4 | **SAT** (constancia fiscal) | Convenio o acceso | Interfaz de consulta |
| B5 | **e.firma / firma avanzada** | Proveedor o PSC y reglas | Interfaz `firmar`/`verificarFirma`; hoy el OTP es solo demostrativo |
| B6 | **Stripe productivo** | Cuenta verificada; hoy solo sandbox | El monto ya se valida en servidor; falta solo cambiar llaves |
| B7 | **Firebase real** | `firebase-applet-config.json` local (gitignorado) | Plantilla `firebase-applet-config.example.json` ya existe |
| B8 | **Context.OS productivo** | Almacén transaccional; hoy es `LAB_MOCK` e idempotencia en memoria | Contratos semánticos ya versionados |

## C. Depende de acciones fuera del código (solo tú / el Ayuntamiento)

| # | Acción | Quién |
|---|---|---|
| C1 | Carta de intención o convenio con Tepic | Tú + Ayuntamiento |
| C2 | Designar enlace ATDT | Ayuntamiento |
| C3 | Confirmar costo del trámite en la Ley de Ingresos | Ayuntamiento |
| C4 | Determinación de AIR o exención | Mejora regulatoria municipal |
| C5 | Formalizar figura legal (p. ej. SAS) antes de recibir contratos o inversión | Tú + contador |
| C6 | Verificar convocatorias y programas vigentes (monto, fecha, requisitos) y citar fuente | Tú, con apoyo mío si das los enlaces |
| C7 | Mantener `firebase-applet-config.json` local y rotar llaves si alguna vez se filtraron | Tú |

---

## Orden de bloques propuesto

1. ✅ Backlog + `ErrorBoundary`.
2. Conectores (A3–A5, B1–B5): lo que más cambia la jugada.
3. Honestidad de datos y accesibilidad (A6–A7).
4. Un trámite completo (A8).
5. Borradores legales y catálogo (A9–A10).
6. Material para inversionistas (A12).
7. Seguridad del servidor (A13).

> Nada de esto afirma cumplimiento ni certificación: es alineación. Las citas legales se toman solo de `BIBLIOTECA_LEGAL.md` con estatus VERIFICADO.
