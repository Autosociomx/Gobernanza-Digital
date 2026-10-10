# Módulo: Perfil de Salud ligado a CURP + Portal de Citas

**Nayarit Digital / ConnectX** · Documento técnico-operativo · v1.2

## El problema que resuelve

El Centro de Salud / Hospital del Bienestar es gratuito con solo el CURP,
pero no existe ningún expediente que siga al paciente: los estudios (rayos
X, laboratorios) se entregan por WhatsApp sin control, y cada trámite exige
volver a presentar copia del CURP porque no hay un perfil que ya lo tenga
registrado.

## Diseño

El perfil se liga al **CURP**, no a una cuenta de la app — existe aunque la
persona nunca tenga smartphone. Lo puede crear:

- **El propio paciente** (`paciente`), si tiene la app — su perfil queda
  vinculado a su cuenta (`uidVinculado`).
- **Un familiar** (`familiar`) — fricción mínima, sin código, para el caso
  típico de un adulto mayor que no puede usar la app por sí mismo.
- **Personal de salud** (`practicante`, `trabajadora_social`, `promotor`) —
  requiere un **código de personal vigente**, para poder registrar y
  archivar documentos a nombre de alguien más sin abrir la puerta a que
  cualquiera cree perfiles falsos.

Cada consulta de triage queda enlazada al perfil (`consultas`), y los
documentos (`documentos`) reemplazan el envío por WhatsApp con un archivo
real en Firebase Storage.

## Modelo de seguridad (verificado, no solo diseñado)

Las reglas de `firestore.rules` se probaron con el kit oficial
`@firebase/rules-unit-testing` contra el emulador real de Firestore — 8/8
casos pasan:

1. Un usuario anónimo no puede crear un perfil.
2. Un paciente autenticado sí puede crear su propio perfil.
3. Personal sin código válido no puede crear un perfil de otra persona.
4. Personal con código **inactivo** no puede crear un perfil.
5. Personal con código **válido y activo** sí puede.
6. Un familiar puede crear un perfil sin código (fricción mínima, por diseño).
7. El personal que sube un documento **no conserva acceso de lectura**
   después — principio de necesidad de saber.
8. El paciente vinculado a su perfil sí puede leer su propio expediente.

`storage.rules` exige que exista primero el documento correspondiente en
Firestore (que ya pasó el control de código) antes de aceptar el archivo
binario — nadie sube un archivo directamente sin ese paso.

## Pasos manuales pendientes (fuera del alcance del código)

Estos pasos requieren acceso a la consola de Firebase y **decisiones del
propietario del proyecto** — no se pueden automatizar desde el repositorio:

1. **Habilitar Cloud Storage** en el proyecto de Firebase (Build → Storage →
   Comenzar). Dependiendo del plan actual, esto puede requerir cambiar al
   plan Blaze (pago por uso) — verificar costos antes de activarlo en
   producción.
2. **Sembrar códigos de personal** en la colección `personal_salud` desde
   la consola de Firebase (no hay UI de administración de personal todavía):
   ```
   personal_salud/{codigo}
     nombre: string
     rol: 'practicante' | 'trabajadora_social' | 'promotor'
     centroSalud: string
     activo: boolean
   ```
   Cada practicante/trabajadora social del Centro de Salud necesita su
   propio código antes de poder usar el registro asistido.
3. **Desplegar `firestore.rules` y `storage.rules`** actualizadas (vía
   Firebase CLI o consola) — el código del repositorio es la fuente de
   verdad, pero el despliegue a producción es un paso manual separado.

## Limitación conocida (declarada, no oculta)

La lectura de un perfil (`get` en `perfiles_salud/{curp}`) solo exige sesión
iniciada y conocer el CURP exacto — no hay forma de validar un código de
personal efímero en una lectura con las reglas de Firestore sin agregar
autenticación por claims personalizados (fuera de alcance de este v1). Esto
refleja el mismo riesgo que ya existe hoy con el CURP en México (se usa como
identificador semi-público en muchos trámites) — no lo resuelve, pero
tampoco lo empeora. Los **documentos** (la parte más sensible) sí están
protegidos de forma más estricta: solo el paciente vinculado o un admin
pueden releerlos.

## Portal de Citas (v1.1)

Agenda ligada al mismo perfil por CURP — `citas_salud/{citaId}`. A
diferencia del registro asistido (que usa el código de personal para
alguien sin cuenta), la **cola de citas la administra el personal que ya
tiene cuenta en la app**, reutilizando el rol `editor`/`admin` que ya existe
en la colección `users` (el mismo que usan `departments` e
`infrastructure`) — no se inventó un tercer sistema de permisos paralelo.

- `src/services/citasSaludService.ts`: solicitar cita, listar mis citas
  (paciente), listar la cola completa (personal editor/admin), cambiar
  estado (confirmar/cancelar/marcar atendida)
- UI ciudadana: dentro de "Mi Expediente" en `SaludNayaritID.tsx`
- UI de personal: nueva sección "Portal de Citas — Cola de Solicitudes"
  en el módulo Salud del C5, **claramente separada** del resto del panel
  — el resto de `SaludView` (mapa de calor, incidencias) sigue siendo una
  maqueta visual con datos fijos, sin cambios en este commit; se deja
  señalado aquí para que se sepa cuál parte es real y cuál no.

**Verificado con el mismo rigor** (`@firebase/rules-unit-testing` contra el
emulador real, 7 casos nuevos, 15/15 en total con los del perfil):
paciente vinculado crea su cita, un ciudadano ajeno no puede suplantarlo,
familiar sin fricción, personal editor lista y gestiona toda la cola,
un ciudadano ajeno no puede ni leer ni modificar la cola.

**Nota de honestidad**: `ESPECIALIDADES_COMUNES` en el servicio es una
lista de categorías genéricas de cualquier centro de salud (Medicina
General, Odontología, etc.) — **no** es el catálogo real de especialidades
del Centro de Salud o el Hospital del Bienestar de Tepic. Poblar el
catálogo real, y confirmar horarios/disponibilidad reales, es un paso
posterior con datos que el Centro de Salud tendría que proporcionar.

## Consentimiento + Bitácora de Acceso (v1.2)

Resuelve un vacío del propio diseño v1: antes, cualquier personal con
cuenta editor/admin podía leer el perfil básico de cualquier CURP sin que
quedara registro ni el paciente tuviera forma de controlarlo. Ahora:

- **`consentimientoActivo`** (booleano, default `true` al crear el perfil):
  decide si personal de otro centro puede consultar el expediente sin que
  sea una urgencia. Es el único campo del perfil que **solo el paciente
  vinculado o un admin pueden tocar** — ni el registro asistido por
  familiar/practicante (que sigue teniendo fricción mínima para el resto
  de los campos) puede cambiarlo. Una escritura que lo modifique no puede
  tocar ningún otro campo a la vez (evita colar cambios junto al toggle).
- **`perfiles_salud/{curp}/accesos`**: bitácora inmutable (solo `create`).
  El personal con cuenta en la app (mismo rol `editor`/`admin` reutilizado
  del resto del módulo) la escribe al consultar un perfil — con
  `autorizado: true` si el consentimiento estaba activo, o `autorizado:
  false` + `motivo` obligatorio si fue un acceso de emergencia sin
  consentimiento. Solo el paciente vinculado (o un admin) puede leerla —
  **ni siquiera el personal que generó la entrada puede releerla después**,
  mismo principio de necesidad de saber que ya aplicaba a `documentos`.
- UI ciudadana: toggle de consentimiento + sección "Quién ha visto tu
  expediente" dentro de "Mi Expediente" en `SaludNayaritID.tsx`.
- UI de personal: nueva sección "Expediente de Urgencias — Buscar
  Paciente por CURP" en el módulo Salud del C5 — búsqueda real, con el
  flujo de acceso de emergencia cuando el paciente no ha dado consentimiento.

**Verificado con el mismo rigor** (`@firebase/rules-unit-testing` contra el
emulador real, 12 casos nuevos, 27/27 en total con los de perfil y citas):
el paciente vinculado sí puede desactivar su propio consentimiento; un
ciudadano ajeno no puede cambiarlo haciéndose pasar por "familiar"; el
personal editor tampoco puede cambiarlo; no se puede colar un cambio de
consentimiento junto con otro campo; un perfil creado por familiar (sin
`uidVinculado`) queda protegido porque nadie más que un admin puede tocar
su consentimiento; el personal editor sí puede registrar accesos
autorizados y de emergencia (con motivo), pero no sin motivo; un
ciudadano cualquiera no puede escribir en la bitácora de otro; el
paciente vinculado sí puede leer su propia bitácora, pero el personal que
la generó no puede releerla, y un ciudadano ajeno tampoco.

**Limitación conocida heredada**: como ya se documentaba arriba, `get` en
`perfiles_salud/{curp}` solo exige sesión iniciada y conocer el CURP
exacto — cualquier personal con cuenta puede ver los datos básicos del
perfil (nombre, teléfono, contacto de emergencia) antes incluso de que el
flujo de consentimiento decida si puede ver más. El consentimiento y la
bitácora protegen el **acceso deliberado y registrado** al expediente, no
esa lectura básica — igual que antes, no se oculta esta limitación.
