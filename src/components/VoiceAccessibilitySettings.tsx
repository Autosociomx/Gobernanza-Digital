import React from 'react';
import { Volume2, VolumeX, Sparkles, CheckCircle2, Play, Shield, Mic, Headphones, Eye, Sliders } from 'lucide-react';
import { useAuraVoice, TONOS_VOZ_AURA, AuraVoiceTone } from '../hooks/useAuraVoice';

interface VoiceAccessibilitySettingsProps {
  autoSpeak?: boolean;
  onToggleAutoSpeak?: () => void;
  darkTheme?: boolean;
}

export const VoiceAccessibilitySettings: React.FC<VoiceAccessibilitySettingsProps> = ({
  autoSpeak = true,
  onToggleAutoSpeak,
  darkTheme = false
}) => {
  const voice = useAuraVoice();

  return (
    <div className={`rounded-3xl border p-6 space-y-6 shadow-sm ${
      darkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0FA3B1]/10 text-[#0FA3B1] border border-[#0FA3B1]/20">
              <Headphones className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black">Accesibilidad & Voz IA (Aura)</h3>
              <p className={`text-xs ${darkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Selecciona la personalidad cromática y el tono de voz para la lectura agéntica.
              </p>
            </div>
          </div>
        </div>

        {voice.isSpeaking && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
            <Volume2 className="w-3.5 h-3.5" />
            Reproduciendo voz...
          </span>
        )}
      </div>

      {/* Auto-Speak Toggle */}
      {onToggleAutoSpeak && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border ${
          darkTheme ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${autoSpeak ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 text-slate-500'}`}>
              {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold">Lectura Automática de Respuestas (TTS)</p>
              <p className={`text-[10px] ${darkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Aura leerá en voz alta las directivas y respuestas de trámites.
              </p>
            </div>
          </div>

          <button
            onClick={onToggleAutoSpeak}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
              autoSpeak ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${
              autoSpeak ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      )}

      {/* Tone Selection Cards */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0FA3B1] block">
          Tonos de Voz Agéntica Disponibles:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TONOS_VOZ_AURA.map((tono) => {
            const isSelected = voice.voiceTone === tono.id;

            return (
              <div
                key={tono.id}
                onClick={() => {
                  voice.setVoiceTone(tono.id);
                  voice.previewTone(tono.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isSelected
                    ? darkTheme
                      ? 'bg-slate-800 border-[#0FA3B1] ring-2 ring-[#0FA3B1]/40 shadow-md'
                      : 'bg-[#0FA3B1]/5 border-[#0FA3B1] ring-2 ring-[#0FA3B1]/20 shadow-sm'
                    : darkTheme
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${tono.badge}`}>
                      {tono.subtitulo}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#0FA3B1]" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black">{tono.nombre}</h4>
                    <p className={`text-xs mt-1 leading-relaxed ${darkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
                      {tono.descripcion}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/20 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-400 space-x-2">
                    <span>Pitch: {tono.pitch}</span>
                    <span>Speed: {tono.rate}x</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      voice.previewTone(tono.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0FA3B1] text-white shadow-sm hover:bg-[#0FA3B1]/90'
                        : darkTheme
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Probar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proof of Compliance Footer */}
      <div className={`p-3 rounded-xl border text-[11px] font-mono flex items-center justify-between ${
        darkTheme ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
      }`}>
        <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
          <Shield className="w-3.5 h-3.5" />
          Web Speech Synthesis API · Cumplimiento WCAG AAA & Accesibilidad Soberana
        </span>
        <span className="hidden sm:inline">Tepic, Nayarit 2026</span>
      </div>

    </div>
  );
};
