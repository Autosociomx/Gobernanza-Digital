import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Motor de voz de Aura — Web Speech API del navegador, sin dependencias
 * ni costo por uso. Soportado en Chrome, Edge y Safari.
 */

const VOICE_LOCALE = 'es-MX';

export type AuraVoiceTone = 'formal' | 'amigable' | 'institucional';

export interface VoiceToneConfig {
  id: AuraVoiceTone;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  pitch: number;
  rate: number;
  badge: string;
  sampleText: string;
}

export const TONOS_VOZ_AURA: VoiceToneConfig[] = [
  {
    id: 'formal',
    nombre: 'Formal & Sobrio',
    subtitulo: 'Atención Técnica y Legal',
    descripcion: 'Voz pausada, estructurada y firme para trámites oficiales, actas e inspección fiscal.',
    pitch: 0.9,
    rate: 0.95,
    badge: 'bg-slate-800 text-slate-200 border-slate-700',
    sampleText: 'Hola. Soy Aura en tono formal. Procederé a orientarte con rigurosidad técnica y absoluta claridad en tu trámite oficial.'
  },
  {
    id: 'amigable',
    nombre: 'Amigable & Cálido',
    subtitulo: 'Asistencia Cotidiana',
    descripcion: 'Voz fluida, expresiva y cercana para acompañar al ciudadano sin tecnicismos.',
    pitch: 1.15,
    rate: 1.05,
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    sampleText: '¡Hola! Soy Aura. Estoy aquí para ayudarte de forma cercana y amigable con todo lo que necesites hoy.'
  },
  {
    id: 'institucional',
    nombre: 'Institucional & Protocolar',
    subtitulo: 'Protocolo de Presidencia',
    descripcion: 'Voz equilibrada y oficial para avisos de gobernanza y boletines públicos de Nayarit.',
    pitch: 1.0,
    rate: 1.0,
    badge: 'bg-[#0FA3B1]/20 text-[#0FA3B1] border-[#0FA3B1]/40',
    sampleText: 'Hola. Transmitiendo desde la conciencia de Aura. Informando la actualización en tiempo real de la administración estatal.'
  }
];

function getSpeechRecognitionCtor(): any {
  if (typeof window === 'undefined') return undefined;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

function paraVoz(texto: string): string {
  return texto
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .replace(/^[-•]\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

export function useAuraVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceTone, setVoiceToneState] = useState<AuraVoiceTone>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_voice_tone');
      if (saved === 'formal' || saved === 'amigable' || saved === 'institucional') {
        return saved;
      }
    }
    return 'amigable';
  });

  const recognitionRef = useRef<any>(null);

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const recognitionSupported = !!getSpeechRecognitionCtor();
  const isSupported = speechSupported && recognitionSupported;

  const setVoiceTone = useCallback((tone: AuraVoiceTone) => {
    setVoiceToneState(tone);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_voice_tone', tone);
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (onResult: (texto: string) => void, onError?: () => void) => {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) return;

      window.speechSynthesis?.cancel();

      const recognition = new Ctor();
      recognition.lang = VOICE_LOCALE;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const texto = event.results?.[0]?.[0]?.transcript ?? '';
        if (texto) onResult(texto);
      };
      recognition.onerror = () => {
        setIsListening(false);
        onError?.();
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
        onError?.();
      }
    },
    []
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((texto: string, overrideTone?: AuraVoiceTone) => {
    if (!speechSupported || !texto) return;
    window.speechSynthesis.cancel();

    const selectedToneId = overrideTone || voiceTone;
    const toneConfig = TONOS_VOZ_AURA.find(t => t.id === selectedToneId) || TONOS_VOZ_AURA[1];

    const utterance = new SpeechSynthesisUtterance(paraVoz(texto));
    utterance.lang = VOICE_LOCALE;
    utterance.rate = toneConfig.rate;
    utterance.pitch = toneConfig.pitch;

    // Intentar seleccionar voz en español si existe
    if (window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices();
      const esVoice = voices.find(v => v.lang.startsWith('es-MX')) || voices.find(v => v.lang.startsWith('es'));
      if (esVoice) {
        utterance.voice = esVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [speechSupported, voiceTone]);

  const previewTone = useCallback((tone: AuraVoiceTone) => {
    const cfg = TONOS_VOZ_AURA.find(t => t.id === tone);
    if (cfg) {
      speak(cfg.sampleText, tone);
    }
  }, [speak]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    isSupported,
    isListening,
    isSpeaking,
    voiceTone,
    setVoiceTone,
    startListening,
    stopListening,
    speak,
    previewTone,
    stopSpeaking,
  };
}
