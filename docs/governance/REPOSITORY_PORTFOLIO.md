# Portafolio oficial de repositorios de ConnectX

**Estado:** propuesta v1  
**Fecha del inventario:** 2026-08-20  
**Responsable:** Miguel Alexis Pérez Aguilar / ConnectX  
**Seguimiento:** [Issue #51](../../issues/51)

## Propósito

Este documento evita que prototipos, demostraciones y repositorios históricos compitan como fuente de verdad. Organiza los 26 repositorios de la cuenta `Autosociomx` sin borrar historial ni alterar su visibilidad.

## Fuente de verdad

`Autosociomx/Gobernanza-digital-` es la fuente de verdad técnica para Nayarit Digital, SOATM, Context.OS y ORBE.

Reglas:

1. Los cambios institucionales deben nacer aquí mediante rama y pull request.
2. Los repositorios públicos deben ser demostraciones sanitizadas, no copias completas del núcleo privado.
3. Alquimia, Aura, COP OS y Ecuación 500/9 se consideran contexto histórico mientras no exista una migración explícita.
4. Ningún repositorio puede declararse canónico sólo por tener el nombre más reciente o mayor tamaño.
5. Antes de archivar, renombrar o cambiar visibilidad se deben verificar despliegues, secretos, dependencias y enlaces externos.

## Clasificación

| Familia | Repositorio | Visibilidad | Estado propuesto | Decisión |
|---|---|---:|---|---|
| Gobernanza | `Gobernanza-digital-` | Privado | **core / canonical** | Fuente de verdad vigente |
| Gobernanza | `gobernanza-digitalcx` | Público | demo-candidate | Evaluar como escaparate público sanitizado |
| Gobernanza | `gorbernanzaconnectx` | Público | review-provenance | Revisar: ~505 MB y README de Open Design |
| Gobernanza | `Soatm` | Privado | placeholder | No usar como fuente hasta integrar propósito y código |
| Gobernanza | `ciencias-politicas` | Público | reference | Conservar como referencia académica/política |
| Gobernanza | `Brigadanx` | Público | vertical | Evaluar como módulo de participación territorial |
| ConnectX | `Conectax-` | Público | prototype | Definir relación con la plataforma principal |
| ConnectX | `ConnectX-intel` | Público | tool | Motor/herramienta; documentar límites |
| ConnectX | `repolink` | Privado | tool / branch-review | Corregir rama por defecto después de revisión |
| Autosocio | `autosocio` | Público | candidate | Comparar contra AUTOSOCIO.CX |
| Autosocio | `AUTOSOCIO.CX` | Público | candidate | Candidato canónico por actividad más reciente |
| Autosocio | `connect-your-world-44` | Privado | prototype | Identificar si contiene el producto operativo |
| AnimalMaster | `-AnimalMaster-IA` | Público | candidate-canonical | Candidato principal por actividad y alcance |
| AnimalMaster | `animalmaster` | Público | prior-version | Comparar funcionalidad |
| AnimalMaster | `AnimalMaster-` | Público | skeleton-review | Posible esqueleto o versión mínima |
| AnimalMaster | `cxanimalmaster-` | Público | skeleton-review | Posible duplicado mínimo |
| Salud | `ConectaX-cl-nica-` | Público | candidate-canonical | Candidato principal |
| Salud | `Conectaxclinical` | Privado | prior-version | Comparar y migrar sólo evidencia útil |
| RoutePro | `Rutepro` | Público | candidate-canonical | Candidato principal |
| RoutePro | `Rutapro-agencia-publicitaria-` | Público | separate-vertical | Mantener separado si es producto comercial distinto |
| RoutePro | `rutapro-leang` | Público | archive-candidate | Repositorio vacío; requiere confirmación antes de archivar |
| Alquimia | `Alquimia-cx` | Privado | legacy | Referencia histórica; no fuente actual |
| Alquimia | `CREA-estudio-alquimia` | Público | legacy-review | Revisar contenido y exposición pública |
| Otros | `Agro` | Público | vertical | Producto independiente |
| Otros | `Mora` | Privado | vertical | Operación/POS independiente |
| Otros | `Luz-en-mi-camino-` | Privado | experimental | Mantener fuera del núcleo institucional |

## Convención de estados

- `core`: infraestructura transversal.
- `canonical`: única fuente de verdad de una familia.
- `vertical`: producto que consume el núcleo sin redefinirlo.
- `demo`: presentación pública sin datos o lógica sensible.
- `tool`: herramienta interna.
- `reference`: investigación o documentación.
- `legacy`: material histórico no vigente.
- `archive-candidate`: requiere aprobación humana antes de archivarse.
- `review-provenance`: contenido cuya procedencia, licencia o relación debe verificarse.

## Puertas obligatorias para consolidar

- [ ] README específico con propósito, estado y responsable.
- [ ] Licencia y procedencia de dependencias verificadas.
- [ ] Sin secretos ni datos personales en el historial.
- [ ] Rama `main` protegida para repositorios activos.
- [ ] Pruebas, build y despliegue identificados.
- [ ] Relación explícita con ORBE, Context.OS, SOATM o un vertical.
- [ ] Repositorio canónico declarado antes de migrar o archivar duplicados.

## Orden de ejecución

1. Auditar los tres repositorios con nombre de Gobernanza.
2. Estabilizar `Gobernanza-digital-` y definir la demo pública.
3. Consolidar RoutePro.
4. Consolidar Autosocio.
5. Consolidar AnimalMaster y Salud.
6. Revisar Alquimia como archivo histórico.
7. Aprobar, uno por uno, renombrados y archivados.

No se autoriza ninguna eliminación automática mediante este documento.
