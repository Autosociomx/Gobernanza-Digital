# Invariantes arquitectónicos a convertir en pruebas

La Guardia actual ejecuta contratos existentes. La siguiente evolución es verificar explícitamente:

1. ORBE no ejecuta acciones gobernadas saltando Context.OS.
2. El Policy Decision Point permanece determinístico para la misma entrada/versionado.
3. `REQUIRE_CONSENT` no puede terminar en ejecución sin un consentimiento válido aplicable.
4. Una denegación no invoca adapters con efectos.
5. La evidencia conserva correlación con intención, decisión y resultado.
6. Un LLM puede proponer/interpretar, pero no sustituye una decisión de política o autorización.
7. `LAB_MOCK` no usa adapters institucionales.
8. Los estados de madurez no se derivan del resultado de CI.

Cada invariante debe pasar de texto a test reproducible antes de tratarlo como garantía automatizada.
