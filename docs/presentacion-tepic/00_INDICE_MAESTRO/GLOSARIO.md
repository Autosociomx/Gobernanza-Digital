# Glosario Oficial — Nayarit Digital · ConnectX · SOATM

Vocabulario normativo del proyecto. Toda superficie pública (componentes, docs, oficios, ponencias) debe usar estas formas. La Guardia de regresiones valida estas reglas en CI.

## 1. Identidad nominal

| Capa | Forma oficial | Prohibido / corregir |
|---|---|---|
| Programa público | **Nayarit Digital · ConnectX** | "ConnectX" a secas en material institucional |
| Arquitectura | **SOATM — Sistema Operativo de Atención de Trámites Mexicanos** | "la plataforma", "el sistema" a secas en docs formales |
| Núcleo técnico | Orbe Central (Aura) | Usar "Aura" como si fuera el producto público |
| Identidad municipal | Nayarit ID | "ID Nayarit", "NayaritID" (variantes) |

## 2. Tesis SOATM (forma oficial de explicarlo)

> "El SOATM no lo inventamos: la ley ya lo ordena —LNETB federal (Arts. 2 y 3), Ley de Gobierno Digital de Nayarit (Arts. 2, 5 y 6) y marco municipal de Tepic—. Nosotros lo descubrimos y lo convertimos en software abierto que le pertenece al municipio, no a un proveedor ni a una administración."

## 3. Estados de módulo (fuente: `docs/orbe/modulos.json`)

`Diseñado` · `Propuesta` · `En construcción` · `Piloto` · `Desplegado` · `Producción`.
Prohibido decir "funciona", "ya opera" o "live" sin declarar el estado.

## 4. Números y datos

Todo dato en pantalla pública lleva etiqueta: **META** (objetivo declarado) · **SIMULADO** (dato de demostración) · **PROYECCIÓN** (estimación) · **VERIFICADO** (dato real con fuente).
Prohibido KPI desnudo. Prohibido atribuir cifras a leyes sin artículo verificado en la Biblioteca Legal.

## 5. "Soberanía" — solo tres usos permitidos

1. **Soberanía del dato ciudadano** — los datos son de la gente, en infraestructura pública.
2. **Soberanía tecnológica** — sin proveedor cautivo; código abierto AGPL.
3. **Soberanía digital infantil (SINISI)** — protección de la identidad de menores.

Prohibido: como porcentaje ("Soberanía 98.4%"), como adjetivo decorativo, "soberanía profesional".

## 6. Estrategia interna vs. discurso público

| Uso interno (docs/estrategia) | Equivalente público |
|---|---|
| Océano azul | Diferenciador nacional / capacidad nueva del municipio |
| Blueprint Estratégico | Plan Estratégico |
| Marketplace | Venta directa / mercado directo |
| Pitch | Presentación institucional |
| Escalera de valor | Ruta de valor público |

## 7. Personas y territorio

- Componentes públicos: **"la administración municipal", "la presidencia municipal", "la titular del ejecutivo"**. Jamás nombres de personas en cargos ni candidaturas.
- Territorio público: **Tepic** (piloto) y "ruta estatal a los 20 municipios". Otros municipios solo en estrategia interna.

## 8. Sindicato y plantilla

- "Pacto de cero despidos", "amplificación de capacidades", "certificación con doble sello (municipio y sindicato)".
- Prohibido: PNL, "técnicas de persuasión", eufemismos sobre reemplazo. La honestidad es la estrategia.

## 9. Citas legales

Toda cita legal en código o docs debe existir en la **Biblioteca Legal (Tepic · Nayarit · Federación)** con artículo verificado. La Guardia falla si un componente cita "Art. N" sin referencia cruzada.
