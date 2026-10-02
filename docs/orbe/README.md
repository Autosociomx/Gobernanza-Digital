# Orbe Central — Mapa modular del ecosistema

**Nayarit Digital / ConnectX / SOATM** · Núcleo de inteligencia y gobernanza agéntica

> **Herramientas de este directorio:**
> [`orbe.html`](./orbe.html) es el diagrama-espejo de consulta (qué módulo hace qué).
> [`cop.html`](./cop.html) es la herramienta de trabajo: un lienzo con el mismo
> grafo y un panel COP 1.0 para declarar la intención de un cambio, ver qué
> módulos conectados hay que cuidar, y generar un bloque de contexto listo
> para pegarle a un asistente de IA antes de tocar código.
> [`orbe-3d.html`](./orbe-3d.html) es el Orbe navegable: cada círculo es un
> Ojo de Dios en 3D real (perspective + translateZ, sin CDNs ni WebGL) con
> paleta propia, y al tocarlo te manda directo a la pantalla real del módulo
> en `tepic.netlify.app` (`?view=…&modulo=…`/`&tab=…`) cuando existe. Los
> módulos que todavía son propuesta sin código (Llave e Identidad, Protección
> Digital) se muestran en gris y sin enlace falso — nunca se inventa un
> destino que no existe. Los tres leen el mismo grafo que `modulos.json` —
> si agregas o cambias un módulo ahí, actualiza también `cop.html` y
> `orbe-3d.html`.

> **Diseño de la experiencia ciudadana:** [`diseno/`](./diseno/) contiene la
> especificación de la pantalla de inicio con ORBE flotante y el prompt de
> construcción derivado de ella. Complementa el canon de arquitectura en
> [`canon/v0.1/`](./canon/v0.1/) (congelado) sin modificarlo.

> Regla de oro de este directorio: **un círculo = un módulo = un archivo.**
> Para editar un módulo (su alcance, su estado, sus integraciones) se edita
> únicamente su archivo en [`modulos/`](./modulos/). El registro
> [`modulos.json`](./modulos.json) es el índice legible por máquina que la
> aplicación y los agentes pueden consumir.

## El Orbe

```mermaid
flowchart TB
    ORBE(("🧠 ORBE CENTRAL<br/>Aura · núcleo agéntico<br/>voz + conciencia de página"))

    LLAVE["🔑 Llave e Identidad<br/>Llave MX + Llave Infantil"]
    EXP["📋 Expediente Digital Familiar<br/>padres y niños · CURP"]
    TEPICTU["🩺 TEPICTU Salud<br/>triaje IA offline"]
    TESO["💰 Tesorería Digital"]
    OBRAS["🏗️ Trazabilidad de Obras"]
    SERV["🔧 Servicios Públicos<br/>Inteligente"]
    BIEN["🤝 Bienestar Social"]
    PULSO["📊 Pulso Nayarit<br/>auditoría cívica"]
    PROT["🛡️ Protección Digital<br/>denuncia 24/7"]

    ORBE --- LLAVE
    ORBE --- EXP
    ORBE --- TEPICTU
    ORBE --- TESO
    ORBE --- OBRAS
    ORBE --- SERV
    ORBE --- BIEN
    ORBE --- PULSO
    ORBE --- PROT

    LLAVE -.->|"la llave del tutor<br/>abre el expediente"| EXP
    TEPICTU -.->|"triaje deriva a citas"| EXP
    SERV -.->|"reporte con costo"| TESO
    SERV -.->|"obra mayor"| OBRAS
    TEPICTU -.->|"casos vulnerables"| BIEN
    LLAVE -.->|"consentimiento parental"| PROT
```

- **Línea sólida** = el módulo vive en el Orbe (misma cuenta ciudadana, mismo
  núcleo agéntico).
- **Línea punteada** = flujo de datos/eventos entre módulos (siempre a través
  del núcleo, nunca directo entre bases de datos).

## Los círculos

| Módulo | Archivo | Estado |
|---|---|---|
| Orbe Central (Aura, núcleo agéntico) | [`modulos/ORBE_NUCLEO.md`](./modulos/ORBE_NUCLEO.md) | En construcción |
| Llave e Identidad (Llave MX + Llave Infantil) | [`modulos/LLAVE_IDENTIDAD.md`](./modulos/LLAVE_IDENTIDAD.md) | Propuesta aterrizada |
| Expediente Digital Familiar (padres y niños) | [`modulos/EXPEDIENTE_FAMILIAR.md`](./modulos/EXPEDIENTE_FAMILIAR.md) | Piloto Tepic funcionando |
| TEPICTU Salud (triaje IA) | [`modulos/TEPICTU_SALUD.md`](./modulos/TEPICTU_SALUD.md) | Diseñado |
| Tesorería Digital | [`modulos/TESORERIA.md`](./modulos/TESORERIA.md) | Diseñado |
| Trazabilidad de Obras | [`modulos/OBRAS.md`](./modulos/OBRAS.md) | Diseñado |
| Servicios Públicos Inteligente | [`modulos/SERVICIOS_PUBLICOS.md`](./modulos/SERVICIOS_PUBLICOS.md) | Diseñado |
| Bienestar Social | [`modulos/BIENESTAR.md`](./modulos/BIENESTAR.md) | Diseñado |
| Pulso Nayarit (auditoría cívica) | [`modulos/PULSO_NAYARIT.md`](./modulos/PULSO_NAYARIT.md) | Backend desplegado |
| Protección Digital (denuncia 24/7) | [`modulos/PROTECCION_DIGITAL.md`](./modulos/PROTECCION_DIGITAL.md) | Propuesta aterrizada |

## Cómo editar un módulo (el flujo)

1. Abre **solo** el archivo del módulo en `modulos/`.
2. Cada archivo sigue la misma plantilla de 6 secciones — no agregues
   secciones nuevas sin actualizar la plantilla para todos:
   - **Qué es** (2-3 líneas)
   - **Estado** (Diseñado / En construcción / Piloto / Producción)
   - **Conexiones** (con qué círculos habla y qué evento fluye)
   - **Dónde vive** (docs y código fuente reales, con rutas)
   - **Cómo editarlo** (qué archivos tocar para cada tipo de cambio)
   - **Pendientes**
3. Si el cambio altera nombre, estado o conexiones, refleja lo mismo en
   [`modulos.json`](./modulos.json) y en el diagrama de este README.
4. Un PR por módulo siempre que sea posible: cambios acotados, revisión fácil.

## Principios del Orbe

1. **El núcleo orquesta, no almacena**: los datos viven en cada módulo; el
   Orbe enruta eventos y conversación (Aura).
2. **La llave del tutor es transversal**: cualquier módulo que toque datos de
   un menor consume el consentimiento del círculo Llave e Identidad — nunca
   implementa el suyo propio.
3. **Separación de bases con candado**: verificación de edad y expediente
   médico jamás comparten base de datos; comparten llave, no datos.
4. **Estándar abierto**: congruente con `docs/marco/ESTRATEGIA_ESTANDAR_ABIERTO.md`.
