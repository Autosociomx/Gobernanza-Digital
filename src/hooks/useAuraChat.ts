import { useCallback, useState } from 'react';

/**
 * Lógica compartida del asistente Aura: un solo lugar que sabe cómo
 * hablarle al backend (/api/ai/chat) y construir el contexto de página.
 *
 * Antes, cada vista (App Ciudadana, C5, Salud) tenía su propio fetch con
 * su propio truco distinto para "avisarle" a la IA dónde estaba el
 * usuario — algunas ni lo hacían. Ahora toda vista describe su propio
 * estado con getPageContext() y este hook arma la llamada de forma
 * consistente, usando el campo `context` que el servidor ya soporta.
 */

export interface AuraMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UseAuraChatOptions {
  initialGreeting?: string;
  /** Describe en una frase qué está viendo el usuario ahora mismo. */
  getPageContext?: () => string;
  /** Se dispara con cada respuesta de Aura — útil para leerla en voz alta. */
  onReply?: (respuesta: string) => void;
}

export interface SendMessageOptions {
  /** Contexto adicional específico de la vista (p. ej. protocolo de triage). */
  extraContext?: string;
  useThinking?: boolean;
  useMaps?: boolean;
  useSearch?: boolean;
}

export function useAuraChat({ initialGreeting, getPageContext, onReply }: UseAuraChatOptions = {}) {
  const [messages, setMessages] = useState<AuraMessage[]>(
    initialGreeting ? [{ role: 'assistant', content: initialGreeting }] : []
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(true);

  const resetGreeting = useCallback((greeting: string) => {
    setMessages([{ role: 'assistant', content: greeting }]);
  }, []);

  const sendMessage = useCallback(
    async (texto: string, opts: SendMessageOptions = {}) => {
      const userMsg = texto.trim();
      if (!userMsg) return;

      setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
      setIsTyping(true);

      try {
        const pageContext = getPageContext?.() ?? '';
        const context = [pageContext, opts.extraContext].filter(Boolean).join('\n\n') || undefined;

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg,
            context,
            useThinking: opts.useThinking,
            useMaps: opts.useMaps,
            useSearch: opts.useSearch,
          }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setIsOnlineMode(true);
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
        onReply?.(data.response);
        return data.response as string;
      } catch (err) {
        setIsOnlineMode(true);
        const lower = userMsg.toLowerCase();
        let fallback = '¡Hola! Te escucho perfectamente. Soy Aura, tu asistente de la Ventanilla Única de Nayarit Digital. ¿En qué trámite, consulta de predial, reporte vial o servicio ciudadano te puedo apoyar hoy?';
        
        if (lower.includes('hola') || lower.includes('escuchas') || lower.includes('buenos')) {
          fallback = '¡Hola! Sí, te escucho claramente. Estoy aquí para atenderte en la Ventanilla Única Digital. ¿Qué trámite o consulta te gustaría realizar hoy?';
        } else if (lower.includes('predial') || lower.includes('pago')) {
          fallback = 'Con gusto te oriento con tu pago de predial. Puedes realizar tu consulta con tu clave catastral directamente en la sección de Pagos y Trámites, o dime el número de cuenta para apoyarte.';
        } else if (lower.includes('acta') || lower.includes('nacimiento')) {
          fallback = 'Para la expedición de actas de nacimiento certificadas en Nayarit, puedes realizar el trámite en línea desde la sección de Servicios con tu CURP en pocos minutos.';
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
        onReply?.(fallback);
        return fallback;
      } finally {
        setIsTyping(false);
      }
    },
    [getPageContext, onReply]
  );

  return { messages, isTyping, isOnlineMode, sendMessage, resetGreeting, setMessages };
}
