# 📋 Expediente Digital Familiar — padres y niños, ligado a CURP

## Qué es

El expediente de salud ligado al **CURP** (no a una cuenta): perfil del
paciente, consultas, documentos (rayos X, laboratorios) y portal de citas del
hospital central. En su **modo pediátrico**, el expediente de un menor solo se
abre con la llave del tutor — es el caso de uso que hace que las familias
adopten la Llave.

## Estado

**Piloto Tepic funcionando** — perfil CURP, portal de citas y reglas de
seguridad verificadas (8/8 tests con el emulador de Firestore). El modo
pediátrico (candado por llave del tutor) está diseñado, no implementado.

## Conexiones

| Con | Qué fluye |
|---|---|
| Llave e Identidad | Consentimiento del tutor para abrir el expediente del menor (llave, nunca datos) |
| TEPICTU Salud | El triaje deriva a cita y la consulta queda enlazada al perfil |
| Bienestar Social | Casos vulnerables detectados generan seguimiento del DIF |
| Orbe Central (Aura) | "Agenda cita para mi hija" desde la conversación |

## Dónde vive

- Documento técnico-operativo: `docs/marco/MODULO_SALUD_CURP.md`
- Reglas de acceso: `firestore.rules`, `storage.rules`
- Componente principal: `src/components/SaludNayaritID.tsx`
- Registro asistido y perfiles: colecciones `perfiles`, `consultas`, `documentos`, `personal_salud`

## Cómo editarlo

- Cambiar quién puede crear/leer perfiles → `firestore.rules` (y correr los tests de reglas antes de mergear).
- Cambiar el flujo de citas o la UI → `src/components/SaludNayaritID.tsx`.
- Cambiar el diseño del modo pediátrico → este archivo + `docs/marco/soberania-digital-infantil/ESCENARIOS_ESTRATEGICOS.md` (escenario B).
- **Candado inviolable**: este módulo jamás comparte base con verificación de edad; comparte la llave del tutor, no los datos.

## Pendientes

- [ ] Implementar el modo pediátrico: expediente de menor exige llave del tutor.
- [ ] Habilitar Cloud Storage en consola Firebase (decisión del propietario — ver pasos manuales en `MODULO_SALUD_CURP.md`).
- [ ] Sembrar códigos de personal en `personal_salud`.
- [ ] Cartilla de vacunación digital como primera vista pediátrica.
