import { LENGUAS } from './lenguas';

/**
 * Restricción de lengua del asistente conversacional.
 *
 * Antes, tres piezas conspiraban para que Aura intentara hablar wixárika:
 * `server.ts` instruía "usa el idioma solicitado", el prompt público ordenaba
 * obedecer el contexto de página "incluido idioma", y la interfaz enviaba
 * `Idioma de interfaz: wixarika`. El resultado era que al tocar el botón de una
 * lengua originaria la plataforma le pedía al modelo una respuesta en una lengua
 * en la que no tiene competencia demostrada, sin nada que revisara la salida.
 *
 * El léxico estático pasa por `GuardiaPreEnvio` y se etiqueta o se repliega. La
 * respuesta generada no puede pasar por ahí: no hay forma de validarla —el filtro
 * de deriva ni siquiera cubre estas lenguas— así que la única política sostenible
 * es que el asistente no las produzca, y lo diga.
 */
const NOMBRES_ORIGINARIAS = LENGUAS.filter((lengua) => lengua.clave !== 'es')
  .map((lengua) => lengua.nombre)
  .join(', ');

export const MARCA_RESTRICCION_LENGUAS = 'LENGUAS ORIGINARIAS (RESTRICCIÓN INVIOLABLE)';

export const RESTRICCION_LENGUAS_ASISTENTE = `
## ${MARCA_RESTRICCION_LENGUAS}

Responde SIEMPRE en español, aunque el contexto de página diga que la interfaz
está en ${NOMBRES_ORIGINARIAS} u otra lengua originaria. Ese dato describe en qué
idioma está pintada la pantalla; NO es una instrucción de idioma para ti.

Nunca generes texto en una lengua originaria: ni una palabra suelta, ni un saludo,
ni una traducción de cortesía, ni aunque el ciudadano te lo pida. No tienes
competencia verificada en esas lenguas, y el municipio solo puede publicar en
ellas lo que un hablante revisó y quedó asentado en el registro de traducción.
Inventar una frase aquí es exactamente el daño que ese registro existe para evitar.

Si el ciudadano escribe en una lengua originaria o pide respuesta en ella, dilo en
español con claridad y sin rodeos: el asistente todavía no habla esa lengua, la
plataforma solo muestra en ella lo que hablantes ya revisaron, y ofrécele atención
humana para continuar su trámite.
`.trim();

/**
 * Adjunta la restricción al prompt del sistema, venga de donde venga.
 *
 * `server.ts` reemplaza su prompt por el contenido de
 * `public/CONNECTX_SYSTEM_PROMPT.md` cuando ese archivo existe. Si la restricción
 * viviera solo ahí, editar ese archivo la borraría en silencio — el patrón exacto
 * de las regresiones que llegan desde AI Studio. Por eso se compone en el servidor
 * y no se puede quitar desde el documento.
 */
export function componerPromptDelSistema(base: string): string {
  const limpio = base.trim();
  if (limpio.includes(MARCA_RESTRICCION_LENGUAS)) return limpio;
  return limpio ? `${limpio}\n\n${RESTRICCION_LENGUAS_ASISTENTE}` : RESTRICCION_LENGUAS_ASISTENTE;
}
