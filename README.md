# Protocolo de Gobernanza Digital AI 

Aplicación de Gobernanza Digital y Portal Ciudadano.

## Arranque rápido

```bash
nvm use                 # Node 22 (.nvmrc)
npm ci
cp .env.example .env    # llenar las llaves; .env nunca se commitea
cp firebase-applet-config.example.json firebase-applet-config.json  # llenar con tus llaves de Firebase
npm run dev             # Express + Vite en http://localhost:3000
```

> **Nota:** `firebase-applet-config.json` está gitignorado (contiene la apiKey real).
> Sin ese archivo `npm run lint` y `npm run build` fallan con `TS2307` — es esperado,
> no una regresión. `npm test` y la Guardia sí corren sin él.

`metadata.json` es el descriptor de la app para Google AI Studio (nombre, permisos
de geolocalización/cámara); se conserva en la raíz porque esa herramienta lo espera ahí.

Guía operativa completa para colaborar (reglas duras, arquitectura, flujo de git):
[**CLAUDE.md**](./CLAUDE.md).

## Módulos

- [**Orbe Central — mapa modular del ecosistema**](./docs/orbe/README.md) — Un círculo = un módulo = un archivo. Índice de todos los círculos (Llave e Identidad, Expediente Familiar, TEPICTU Salud, Tesorería, Obras, Servicios Públicos, Bienestar, Pulso, Protección Digital) con registro `modulos.json` legible por máquina.
- [**Pulso Nayarit**](./pulso-nayarit/README.md) — Auditoría cívica open source: preferencia electoral ciudadana en tiempo real con libro mayor auditable. Backend Supabase/Postgres desplegado (consulta demo activa).
- [**Soberanía Digital Infantil (SINISI)**](./docs/marco/soberania-digital-infantil/README.md) — Propuesta federal: identidad digital soberana para niñas, niños y adolescentes sobre la infraestructura de las Becas Benito Juárez, con verificación de edad de doble anonimato, ficha legislativa, discursos para foros y diagramas de flujo.
