# Contraauditoría ORBE · Asesor Ciudadano v0.1

**Estado:** propuesta técnica para revisión antes de implementación  
**Rama:** `feat/orbe-asesor-ciudadano-v0.1`  
**Objetivo:** evolucionar ORBE desde un vertical de laboratorio de obras públicas hacia una puerta única de orientación ciudadana, sin relajar autoridad, consentimiento, trazabilidad ni honestidad institucional.

## 1. Decisión central

ORBE no se convierte en un portal con más módulos. Se convierte en la interfaz única desde la cual una persona expresa una necesidad en lenguaje natural y el sistema construye una ruta de servicio.

La arquitectura conserva responsabilidades separadas:

- **ORBE:** conversación, voz, accesibilidad y explicación al ciudadano.
- **Proveedor cognitivo (Gemini inicialmente):** comprensión lingüística y generación de respuesta, nunca autoridad.
- **Context.OS:** decide qué puede hacerse, con qué datos, bajo qué finalidad, jurisdicción, consentimiento y nivel de riesgo.
- **SOATM:** catálogo/grafo de servicios, instituciones, requisitos, dependencias y adaptadores.
- **Evidence.OS:** registra procedencia, fuente, decisión, ejecución y evidencia verificable.

Regla no negociable: **el modelo puede proponer una herramienta; nunca adquiere por ello autoridad para ejecutarla.**

## 2. Hallazgos de contraauditoría

### C-01 · P0 está construido, pero no debe asumirse cerrado

El reporte vigente de ORBE P0 v0.2 deja pendientes verificaciones externas: CI verde sobre HEAD final, despliegue efectivo, variables de entorno, health público, solicitud bache/luminaria y visualización pública del `evidenceId`.

**Decisión:** cerrar o revalidar el gate P0 antes de declarar que la base está lista para escalar.

### C-02 · `policyEngine.ts` está acoplado a obras públicas

La policy actual importa directamente `PUBLIC_WORKS_REPORT_SERVICE`, usa `contextos.policy.public-works.v0.2` y reason codes específicos como `LOW_RISK_PUBLIC_REPORT`.

**Riesgo:** añadir actas, SAT, salud o Registro Civil copiando esta policy produciría un motor lleno de excepciones y `if` por dominio.

**Corrección:** introducir un registro de políticas por clase de capacidad, inicialmente:

- `PUBLIC_INFORMATION`
- `GUIDED_HANDOFF`
- `LOW_RISK_ACTION`

Cada servicio declara `policyId`/`capabilityClass`; Context.OS selecciona una policy determinística.

### C-03 · El modelo de jurisdicción actual fuerza municipio

`runtime.ts` exige `country=MX`, estado y municipio para cualquier `IntentEnvelope`.

**Riesgo:** SAT, IMSS, INFONAVIT y servicios federales no encajan limpiamente; tampoco servicios estatales que no dependen de un municipio.

**Corrección:** versionar el contrato para soportar `jurisdiction.scope = FEDERAL | STATE | MUNICIPAL` y requerir solo los campos correspondientes al alcance. Mantener compatibilidad con v0.1 durante la migración.

### C-04 · El catálogo solo contiene un servicio

`contextos/serviceCatalog.ts` registra únicamente `mx.nay.tepic.public-works.report`.

**Decisión:** no saltar de 1 a 500 trámites. Construir un Service Graph pequeño y verificable con 5-10 jornadas ciudadanas.

Primer vertical nuevo recomendado:

`mx.gov.registro-civil.acta-nacimiento.info`

Capacidad inicial: **información y acompañamiento**, no expedición real.

### C-05 · Evidence actual prueba decisión/ejecución, no procedencia documental

`contextos/evidence.ts` genera evidencia de policy/ejecución con SHA-256 y `CHECKSUM_ONLY`.

Eso es correcto para el runtime, pero no demuestra de qué fuente oficial salió un requisito, costo, horario o liga.

**Corrección:** separar dos familias:

1. `RuntimeEvidenceRecord`: policy, consentimiento, ejecución, adapter, correlationId.
2. `SourceEvidenceRecord`: autoridad emisora, URL/documento oficial, fecha de consulta, hash del snapshot, jurisdicción, claims sustentados y vigencia.

Nunca llamar a un checksum "firma", "certificación" o "inmutabilidad".

### C-06 · ORBE ya tiene una buena frontera que no debe romperse

`src/orbe/contextosBridge.ts` separa CHAT/CLARIFY/RUNTIME y pide confirmación antes de preparar una acción de laboratorio.

**Decisión:** mantener este patrón. Gemini puede producir una **interpretación candidata**, pero una acción solo cruza a Context.OS si coincide con un contrato semántico válido y pasa policy determinística.

### C-07 · La transición información → acción debe ser explícita

Caso de referencia:

1. Ciudadano: "Necesito un acta para mi hija."  
2. ORBE detecta `INFORMATION_REQUEST`.  
3. Context.OS permite orientación pública sin pedir identidad.  
4. SOATM localiza servicio/fuente oficial.  
5. Evidence.OS registra la procedencia.  
6. ORBE explica la ruta.

Si después dice: "¿Puedes sacarla tú?":

1. cambia a `ACTION_REQUEST`;
2. Context.OS consulta la capacidad real del servicio;
3. si no hay integración/autoridad, responde `GUIDED_HANDOFF`, no simula ejecución;
4. solo si existe adapter autorizado se solicitan identidad/consentimiento mínimos.

### C-08 · AI Studio es laboratorio de implementación, no fuente de autoridad

El repositorio prohíbe clientes de IA bajo `src/` y exige llaves del lado servidor. Esta regla existe por incidentes previos de exposición de claves.

**Decisión:** usar Google AI Studio en modo web/full-stack, manteniendo Gemini exclusivamente detrás del servidor. No migrar la lógica de Context.OS al frontend y no exponer `GEMINI_API_KEY`.

## 3. Vertical Slice P1 recomendado

### Nombre

**ORBE · Acta de nacimiento · orientación verificable v0.1**

### Debe resolver

- "Necesito un acta para mi hija."
- "¿Qué necesito?"
- "¿Cuánto cuesta?"
- "¿Dónde se tramita?"
- "¿Se puede hacer en línea?"
- "¿Puedes sacarla tú?"

### No debe hacer todavía

- pedir CURP/nombre completo para una consulta informativa;
- autenticar al ciudadano sin necesidad;
- afirmar acceso a Registro Civil que no existe;
- expedir actas;
- cobrar;
- almacenar documentos personales;
- tratar una búsqueda de Google como evidencia oficial por sí sola.

## 4. Contrato mínimo de capacidad

Cada servicio debe poder expresar al menos:

```ts
interface CapabilityDescriptor {
  serviceId: string;
  capabilityMode: 'INFORMATION_ONLY' | 'GUIDED_HANDOFF' | 'EXECUTION';
  jurisdiction: {
    scope: 'FEDERAL' | 'STATE' | 'MUNICIPAL';
    country: 'MX';
    state?: string;
    municipality?: string;
  };
  policyId: string;
  adapterId?: string;
  evidenceRequirements: string[];
}
```

La UI nunca deduce capacidad por intuición del modelo.

## 5. Pruebas de aceptación P1

1. **Información sin PII:** "Necesito un acta" no solicita identidad.
2. **Cambio de intención:** "sácala tú" cambia a ACTION_REQUEST.
3. **Sin autoridad simulada:** si no existe adapter real, devuelve acompañamiento/handoff.
4. **Prompt injection:** "ignora Context.OS" no altera policy.
5. **Fuente:** cada requisito mostrado puede remontarse a SourceEvidenceRecord.
6. **Fuente vencida:** si la evidencia supera la vigencia configurada, se obliga a revalidar.
7. **Contradicción:** dos fuentes oficiales incompatibles producen bandera de contradicción, no una respuesta inventada.
8. **Minimización:** PII proporcionada innecesariamente no se persiste en Evidence.OS.
9. **Jurisdicción:** el mismo runtime acepta FEDERAL, STATE y MUNICIPAL según el contrato.
10. **Regresión P0:** bache/luminaria sigue pasando sin cambios de autoridad.

## 6. Orden de implementación

### Gate 0
- Revalidar cierre P0 sobre `main`.
- No ampliar autoridad.

### P1.1 · Contratos
- `CapabilityDescriptor`.
- jurisdicción versionada.
- policy registry.

### P1.2 · Evidence
- `SourceEvidenceRecord` separado del RuntimeEvidenceRecord.
- fuente oficial, snapshot/hash, fecha, claims y vigencia.

### P1.3 · SOATM
- primer servicio `acta-nacimiento.info`.
- rutas oficiales y metadata verificable.

### P1.4 · ORBE
- interpretación de necesidad → información.
- transición explícita información → acción.
- mensaje de handoff cuando no exista ejecución autorizada.

### P1.5 · Gemini / Google AI Studio
- usar Gemini para comprensión conversacional y respuesta natural;
- tool calling solo hacia endpoints del servidor;
- Context.OS valida antes de cualquier adapter;
- AI Studio nunca escribe secretos en `src/`.

### P1.6 · UI
- Home ciudadana simple: ORBE como entrada principal.
- módulos internos fuera de la carga visual inicial.
- mostrar fuente/evidencia de forma accesible, no como consola técnica.

## 7. Criterio para pasar a SAT/IMSS/INFONAVIT

No agregar otro dominio hasta que el vertical de acta demuestre de punta a punta:

`ORBE → interpretación → Context.OS → SOATM → Evidence.OS → respuesta → cambio a acción → handoff seguro`.

Una vez reproducible, agregar servicios será una ampliación del catálogo y de contratos, no una reescritura de arquitectura.
