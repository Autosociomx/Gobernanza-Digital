# Gobernanza del Repositorio

**Nayarit Digital / ConnectX** · Documento normativo · v1.0

## 1. Principio

El repositorio es la fuente única de verdad del proyecto. Ninguna herramienta
externa (AI Studio, editores, agentes) tiene autoridad para degradar lo que
`main` ya conquistó: seguridad, accesibilidad 100, rendimiento 100 y los
documentos de gobernanza.

## 2. Flujo de cambios

1. Todo cambio entra por **rama + Pull Request hacia `main`** — nunca push directo.
2. Cada PR debe pasar la **Guardia de regresiones** (CI) antes de fusionarse.
3. El deploy preview de Netlify con su auditoría Lighthouse acompaña cada PR:
   la meta permanente es 97+ / 100 / 100 / 100.
4. Trabajo desde AI Studio: sincronizar con `main` **antes** de editar
   (ver `PROTOCOLO_SEGURIDAD.md` §3).

> Recomendación pendiente de activar en GitHub: protección de la rama `main`
> (Settings → Branches) exigiendo el check "Guardia de regresiones" en verde
> para poder fusionar. Con eso, las regresiones quedan bloqueadas por sistema
> y no por vigilancia humana.

## 3. Archivos protegidos

Estos archivos no se eliminan ni degradan; cualquier cambio sobre ellos exige
mención explícita en la descripción del PR:

- `index.html` (metadatos, fuentes asíncronas)
- `vite.config.ts` (define sin llaves, manualChunks)
- `netlify.toml`, `public/robots.txt`
- `src/App.tsx` (lazy loading)
- `server.ts` (endpoints de IA del lado servidor)
- `docs/` completo (marco normativo, actas, agentes)
- `scripts/verificar-regresiones.mjs`, `.github/workflows/`

## 4. Órganos de revisión y decisión

- **Parlamento de las Sillas** — revisa, cuestiona y recomienda dirección (prompt maestro en `docs/`); no aprueba ni ejecuta cambios materiales por consenso propio.
- **Gabinete de 15 Especialistas** — revisa por dominio y propone mejoras
  ancladas a módulos reales (`docs/agentes/GABINETE_ESPECIALISTAS.md`)
- **Autoridad humana responsable** — aprueba decisiones materiales, cambios
  irreversibles y adopción normativa, conforme a
  `docs/marco/CONSTITUCION_ARQUITECTURA_v0.1.md`.
- Toda sesión produce **acta** en `docs/actas/` con numeración consecutiva.
  Las actas son el registro institucional: no se borran; se corrigen con actas
  posteriores.

## 5. Clasificación de la información

| Nivel | Qué incluye | Dónde vive |
|---|---|---|
| **Público** | Código de la plataforma, marco de cumplimiento, protocolos, README | Repositorio (apto para código abierto) |
| **Interno** | Estrategia de negociación, doctrina de comunicación, análisis político, Carpeta Ejecutiva | Fuera del repositorio público — nunca se commitea a `main` si el repo va a abrirse |
| **Sensible** | Datos personales, llaves, credenciales | Jamás en git — solo variables de entorno y sistemas del municipio |

Regla de oro: **antes de commitear, pregunta si lo leería un periodista.**
Si el contenido daña al proyecto en primera plana, es Interno o Sensible.

## 6. Versionado y actas de release

Cada despliegue a producción que cambie funcionalidad ciudadana se acompaña de
una entrada en el acta vigente: qué cambió, quién lo aprobó y qué verificación
pasó (Guardia + Lighthouse). Eso construye el expediente que la ASF pedirá.
