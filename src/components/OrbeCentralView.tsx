import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, ShieldCheck, HeartPulse, Wallet, HardHat, Wrench, 
  Users, Activity, Lock, Bot, ArrowLeft, ChevronRight, Sparkles,
  Mic, MicOff, Volume2, VolumeX, Send, RefreshCw, CheckCircle2,
  AlertCircle, FileText, Compass, Award, Brain, Zap, ExternalLink,
  MessageSquare, Languages, MapPin, Radio, RotateCw, Shield, Layers, LayoutGrid
} from 'lucide-react';
import { useAuraVoice, TONOS_VOZ_AURA, AuraVoiceTone } from '../hooks/useAuraVoice';
import { WixarikaOjoDeDiosOrb } from './WixarikaOjoDeDiosOrb';
import { UniversalOrderNav } from './UniversalOrderNav';

// Lenguas y Dialectos soportados para el Orbe Central
const LENGUAS = [
  { id: 'es', nombre: 'Español (ES)', bandera: '🇲🇽', region: 'Estatal & Nacional', vozSimulada: 'Atención oficial en español.' },
  { id: 'cr', nombre: 'Náayeri / Cora (CR)', bandera: '🌿', region: 'Sierra de El Nayar / Jesús María', vozSimulada: 'Neiuka náayeri... Ne\'e ne te\'atsa tateikáita.' },
  { id: 'wx', nombre: 'Wixárika / Huichol (WX)', bandera: '🪶', region: 'Santa Catarina / Guadalupe Ocotán', vozSimulada: 'Niuki wixárika... Paxeira tateikari.' },
  { id: 'tp', nombre: 'O\'dam / Tepehuano (TP)', bandera: '🌲', region: 'Límites Serranos del Norte', vozSimulada: 'O\'dam ñio\'ok... A\'m mañ d\'iat.' },
  { id: 'mx', nombre: 'Mexicanero / Náhuatl (MX)', bandera: '📜', region: 'Comunidades Indígenas del Sur', vozSimulada: 'Mequisenko... Tlazohcamati nopiltzin.' },
  { id: 'en', nombre: 'English (EN)', bandera: '🌐', region: 'Soporte Internacional & Inversores', vozSimulada: 'International citizen assistance.' }
];

// Ejemplos de Diálogo Natural (Sin Formularios)
const EJEMPLOS_CONVERSACIONALES = [
  {
    id: 'mantenimiento',
    icono: Wrench,
    titulo: 'Mantenimiento Urbano (Bacheo & Agua)',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    promptUsuario: 'Hola Aura, frente a mi casa en Av. Insurgentes 450 hay un bache muy grande y la lámpara de la esquina no prende desde ayer.',
    respuestaAura: '¡Entendido! He registrado el reporte de Mantenimiento Urbano con folio C5 #REP-8492. Asigné la cuadrilla de Obras e Iluminación a las coordenadas GPS de Av. Insurgentes 450. No necesitas llenar ningún formulario.',
    ahorroFormulario: 'Omitidos 14 campos de formulario de reporte urbano.',
    tiempo: 'Generado en 3 segundos · Folio C5 Activo',
    moduloTarget: 'servicios-publicos',
    targetView: 'citizen' as const,
    targetTab: 'services'
  },
  {
    id: 'identidad',
    icono: ShieldCheck,
    titulo: 'Carta de Residencia e Identidad',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    promptUsuario: 'Aura, necesito tramitar mi Constancia de Residencia para entregarla en mi nuevo trabajo esta misma tarde.',
    respuestaAura: 'Con tu Identidad Soberana Llave MX verificada, he generado tu Constancia de Residencia firmada criptográficamente con sello SHA-256. Ya está disponible en tu expediente digital en formato PDF con validez oficial.',
    ahorroFormulario: 'Omitidas 3 filas presenciales y 5 impresiones físicas.',
    tiempo: 'Emisión instantánea · Cero burocracia',
    moduloTarget: 'llave-identidad',
    targetView: 'citizen' as const,
    targetTab: 'soberania'
  },
  {
    id: 'salud',
    icono: HeartPulse,
    titulo: 'Triaje de Salud & Citas Médicas',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    promptUsuario: 'Me siento mal desde la mañana, me duele la cabeza, tengo fiebre y me cuesta tragar.',
    respuestaAura: 'Analizando tus síntomas bajo el protocolo NOM-024-SSA3. Sugiero valoración preventiva. Agendé una consulta telemédica con el Dr. Ramírez para hoy a las 4:30 PM en el Centro de Salud más cercano a tu ubicación.',
    ahorroFormulario: 'Omitidos formularios de admisión médica presencial.',
    tiempo: 'Cita programada · Triaje preventivo activo',
    moduloTarget: 'tepictu-salud',
    targetView: 'c5' as const,
    targetModulo: 'salud'
  },
  {
    id: 'tesoreria',
    icono: Wallet,
    titulo: 'Consulta & Pago de Predial',
    color: 'text-[#0FA3B1] bg-[#0FA3B1]/10 border-[#0FA3B1]/30',
    promptUsuario: 'Aura, ¿cuánto debo de predial de mi casa y cómo puedo pagarlo sin ir a la presidencia?',
    respuestaAura: 'Tu saldo del impuesto predial 2026 para la cuenta catastral registra $840 MXN con el descuento del 15% por pago puntual aplicado. Puedes autorizar el cobro con un toque o escanear este código QR.',
    ahorroFormulario: 'Omitidos formatos de liquidación en ventanilla.',
    tiempo: 'Conciliación contable LGCG inmediata',
    moduloTarget: 'tesoreria',
    targetView: 'c5' as const,
    targetModulo: 'tesoreria'
  },
  {
    id: 'dialecto',
    icono: Sparkles,
    titulo: 'Atención Inclusiva Náayeri / Cora',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    promptUsuario: 'Neiuka náayeri... Ne\'e ne te\'atsa tateikáita tewisome (Atención en lengua Náayeri)',
    respuestaAura: 'Neiuka tateikari. Aura tu\'i ka\'iyame. He procesado tu solicitud en lengua Náayeri para la entrega directa de apoyos comunitarios en la Sierra de El Nayar.',
    ahorroFormulario: 'Inclusión lingüística total sin barreras de alfabetización en español.',
    tiempo: 'Traducción agéntica multilingüe en tiempo real',
    moduloTarget: 'bienestar',
    targetView: 'c5' as const,
    targetModulo: 'bienestar'
  }
];

const ORBE_MODULOS = [
  {
    id: 'servicios-publicos',
    nombre: 'Mantenimiento Urbano & GPS',
    subtitulo: 'Atención a Baches, Agua e Iluminación',
    icon: Wrench,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    desc: 'Atención inmediata a reportes ciudadanos mediante conversación natural. Captura geolocalización sin formularios.',
    targetView: 'citizen' as const,
    targetTab: 'services'
  },
  {
    id: 'llave-identidad',
    nombre: 'Identidad & Cartas Oficiales',
    subtitulo: 'Constancias de Residencia con Firma SHA-256',
    icon: ShieldCheck,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    desc: 'Emisión de cartas de residencia, buena conducta y trámites municipales con verificación de firma inmutable.',
    targetView: 'citizen' as const,
    targetTab: 'soberania'
  },
  {
    id: 'tepictu-salud',
    nombre: 'Salud IA & Triaje NOM-024',
    subtitulo: 'Citas Médicas & Recetas Electrónicas',
    icon: HeartPulse,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    desc: 'Triaje médico preventivo conversacional sin filas, agendamiento de citas y expedientes clínicos familiares.',
    targetView: 'c5' as const,
    targetModulo: 'salud'
  },
  {
    id: 'tesoreria',
    nombre: 'Tesorería & Predial Transparente',
    subtitulo: 'LGCG & Recaudación sin Ventanilla',
    icon: Wallet,
    color: 'text-[#0FA3B1]',
    borderColor: 'border-[#0FA3B1]/40',
    desc: 'Consulta de saldos, pago de predial, licencias y contribuciones con conciliación contable automatizada.',
    targetView: 'c5' as const,
    targetModulo: 'tesoreria'
  },
  {
    id: 'obras',
    nombre: 'Supervisión de Obras C5',
    subtitulo: 'Auditoría Física FAISPIAM & Avances',
    icon: HardHat,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    desc: 'Trazabilidad y supervisión ciudadana de infraestructura comunitaria con evidencia fotográfica.',
    targetView: 'c5' as const,
    targetModulo: 'obras'
  },
  {
    id: 'dialectos',
    nombre: 'Pueblos Originarios & Dialectos',
    subtitulo: 'Náayeri, Wixárika, O\'dam & Mexicanero',
    icon: Languages,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    desc: 'Entrenamiento agéntico multilingüe para diálogo en lenguas nativas de la sierra de Nayarit.',
    targetView: 'c5' as const,
    targetModulo: 'bienestar'
  }
];

interface OrbeCentralViewProps {
  onNavigate: (view: 'landing' | 'c5' | 'citizen' | 'dev' | 'executive' | 'orbe', options?: { tab?: string; modulo?: string }) => void;
}

export const OrbeCentralView: React.FC<OrbeCentralViewProps> = ({ onNavigate }) => {
  const [lenguaActual, setLenguaActual] = useState(LENGUAS[0]);
  const [ejemploSeleccionado, setEjemploSeleccionado] = useState(EJEMPLOS_CONVERSACIONALES[0]);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'aura',
      text: '¡Hola! Soy Aura, la conciencia del Orbe Central. Puedes hablarme o escribirme libremente sobre cualquier reporte de mantenimiento, trámite o cita de salud. Sin llenar formularios.',
      timestamp: 'Ahora'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vistaModo, setVistaModo] = useState<'conversacion' | 'orbe3d' | 'matriz'>('conversacion');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showPnl, setShowPnl] = useState(false);

  const voice = useAuraVoice();

  // Rotación del Orbe
  useEffect(() => {
    if (!autoRotate || vistaModo !== 'orbe3d') return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoRotate, vistaModo]);

  // Cargar ejemplo seleccionado
  const handleSelectEjemplo = (ej: typeof EJEMPLOS_CONVERSACIONALES[0]) => {
    setEjemploSeleccionado(ej);
    setInputText(ej.promptUsuario);
    
    // Agregar al chat
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: ej.promptUsuario, timestamp: 'Ahora' },
      { sender: 'aura', text: ej.respuestaAura, timestamp: 'Ahora' }
    ]);

    if (voice.isSupported) {
      voice.speak(ej.respuestaAura);
    }
  };

  // Enviar mensaje de voz/texto
  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    setIsProcessing(true);
    setChatHistory(prev => [...prev, { sender: 'user', text: textToSend, timestamp: 'Ahora' }]);
    setInputText('');

    setTimeout(() => {
      let auraResp = `Entendido en ${lenguaActual.nombre}. He procesado tu solicitud de forma natural sin formularios. Asigné el reporte a las dependencias municipales correspondientes.`;
      
      if (textToSend.toLowerCase().includes('bache') || textToSend.toLowerCase().includes('luminaria') || textToSend.toLowerCase().includes('agua')) {
        auraResp = `¡Reporte Urbano Registrado! Geolocalicé el reporte de mantenimiento con Folio C5 #REP-9102. La cuadrilla de Obras e Infraestructura está notificada.`;
      } else if (textToSend.toLowerCase().includes('constancia') || textToSend.toLowerCase().includes('residencia') || textToSend.toLowerCase().includes('tramite')) {
        auraResp = `Identidad Soberana confirmada. Generé tu Constancia Oficial firmada con algoritmo SHA-256 en tu expediente digital.`;
      } else if (textToSend.toLowerCase().includes('salud') || textToSend.toLowerCase().includes('cita') || textToSend.toLowerCase().includes('fiebre')) {
        auraResp = `Triaje médico completado bajo la NOM-024. Cita agendada para consulta en tu Centro de Salud con código de confirmación en pantalla.`;
      }

      setChatHistory(prev => [...prev, { sender: 'aura', text: auraResp, timestamp: 'Ahora' }]);
      setIsProcessing(false);

      if (voice.isSupported) {
        voice.speak(auraResp);
      }
    }, 800);
  };

  // Escuchar por micrófono
  const handleMicClick = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening((transcript) => {
        setInputText(transcript);
        handleSendMessage(transcript);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans relative overflow-hidden selection:bg-[#0EA5E9]/30">
      
      {/* Background Ambient Layers - Refined Deep Slate & Gold Atmospheric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,#0F172A_0%,#090D16_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#0EA5E9]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Universal Persistent Functional Order Bar */}
      <UniversalOrderNav
        currentView="orbe"
        currentSubItem={vistaModo === 'conversacion' ? 'Diálogo Natural Multilingüe' : vistaModo === 'orbe3d' ? 'Holograma 3D' : 'Matriz de Módulos'}
        onNavigate={(view, options) => onNavigate(view, options)}
        onOpenVoiceAssistant={() => handleMicClick()}
      />

      {/* Header Bar - Institutional Sobriety */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl flex flex-wrap justify-between items-center gap-4 relative z-40 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('landing')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition flex items-center gap-2 text-xs font-bold font-mono border border-slate-800/80 hover:border-slate-700"
          >
            <ArrowLeft size={16} />
            <span>Volver</span>
          </button>
          
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 shadow-md">
              <Globe size={20} className="text-[#0EA5E9]" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
                El Orbe Central <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30 font-mono font-bold">AURA IA</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">Nayarit Digital · Ventanilla Única Institucional por Voz</p>
            </div>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800/80 flex items-center gap-1">
            <button
              onClick={() => setVistaModo('conversacion')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                vistaModo === 'conversacion' ? 'bg-[#0EA5E9] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare size={14} />
              <span>Diálogo Natural</span>
            </button>

            <button
              onClick={() => setVistaModo('orbe3d')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                vistaModo === 'orbe3d' ? 'bg-[#0EA5E9] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe size={14} />
              <span>Holograma 3D</span>
            </button>

            <button
              onClick={() => setVistaModo('matriz')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                vistaModo === 'matriz' ? 'bg-[#0EA5E9] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Módulos</span>
            </button>
          </div>

          <button
            onClick={() => setShowPnl(!showPnl)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 ${
              showPnl ? 'bg-amber-950/40 border-amber-500/60 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Brain size={15} className="text-amber-400" />
            <span className="hidden md:inline">Fundamentos PNL</span>
          </button>
        </div>
      </header>

      {/* PNL Drawer */}
      <AnimatePresence>
        {showPnl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900/95 text-white px-6 py-4 border-b border-amber-500/30 relative z-40 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-xs uppercase tracking-wider text-amber-300 font-mono flex items-center gap-2">
                  <Brain size={16} className="text-amber-400" />
                  Sustento de Psicología Cognitiva & Programación Neurolingüística (PNL)
                </span>
                <button onClick={() => setShowPnl(false)} className="text-slate-400 hover:text-white text-xs font-mono font-bold">Cerrar [X]</button>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                El Orbe Central elimina la ansiedad del trámite gubernamental mediante la <strong>comunicación hablada natural</strong>. Al reemplazar formularios extensos por conversación fluida en la lengua materna del ciudadano, se logra la <strong>Cero Carga Cognitiva</strong> (Sweller, 1988) y se genera <strong>Reaseguro Emocional</strong> (PNL) para personas de cualquier edad, alfabetización o región originaria.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6 flex flex-col justify-between">
        
        {/* Executive Presentation Concept Banner */}
        <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800/90 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                  PRESIDENCIA DEL ESTADO DE NAYARIT
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Ventanilla Única Unificada · Cero Burocracia
                </span>
              </div>

              <h2 className="text-base md:text-lg font-black text-white leading-tight">
                Comunicación Humana & Natural para Mantenimiento Urbano y Servicios Públicos
              </h2>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                El ciudadano habla o escribe como si platicara con una persona. Aura procesa la intención, geolocaliza el problema de mantenimiento urbano o convalida la identidad, y emite folios oficiales instantáneos en dialectos nativos o español.
              </p>
            </div>

            {/* Language / Dialect Selector Bar */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-2 self-stretch md:self-auto shrink-0">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block px-1">
                Atención en Lengua Originaria:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {LENGUAS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLenguaActual(l);
                      if (voice.isSupported) voice.speak(l.vozSimulada);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition flex items-center gap-1.5 ${
                      lenguaActual.id === l.id 
                        ? 'bg-[#0EA5E9] text-white shadow-md' 
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800/60'
                    }`}
                  >
                    <span>{l.bandera}</span>
                    <span className="truncate">{l.nombre.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* VISTA 1: DIÁLOGO NATURAL INTERACTIVO */}
        {vistaModo === 'conversacion' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Quick Natural Prompt Presets (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#0EA5E9]" />
                  Casos de Uso de Mantenimiento & Trámites
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Toca para probar</span>
              </div>

              <div className="space-y-3">
                {EJEMPLOS_CONVERSACIONALES.map((ej) => {
                  const IconComp = ej.icono;
                  const isSelected = ejemploSeleccionado.id === ej.id;

                  return (
                    <div
                      key={ej.id}
                      onClick={() => handleSelectEjemplo(ej)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden group ${
                        isSelected 
                          ? 'bg-slate-900/90 border-[#0EA5E9] ring-1 ring-[#0EA5E9]/40 shadow-md' 
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border ${ej.color}`}>
                            <IconComp size={18} />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                              {ej.titulo}
                            </h3>
                            <span className="text-[10px] text-[#0EA5E9] font-mono font-bold block">
                              {ej.tiempo}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(ej.targetView, { tab: ej.targetTab, modulo: ej.moduloTarget });
                          }}
                          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-[#0EA5E9] text-slate-300 hover:text-white transition"
                          title="Ir al módulo"
                        >
                          <ExternalLink size={13} />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-300 font-sans italic bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                        "{ej.promptUsuario}"
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold pt-1">
                        <Zap size={12} />
                        <span>{ej.ahorroFormulario}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Live Conversational Stage with Aura (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900/80 rounded-3xl border border-slate-800/90 p-5 md:p-6 shadow-xl flex flex-col h-[560px] justify-between relative backdrop-blur-sm">
              
              {/* Stage Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-[#0EA5E9]/50 flex items-center justify-center text-[#0EA5E9] shadow-sm">
                    <Bot size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      Conciencia del Orbe Central
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Atención en <span className="text-[#0EA5E9] font-bold">{lenguaActual.nombre}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {voice.isSpeaking && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 animate-pulse font-bold">
                      <Volume2 size={12} /> Hablando
                    </span>
                  )}
                  <button
                    onClick={() => setChatHistory([chatHistory[0]])}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Reiniciar conversación"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Selector de Tono de Voz Aura (Voz IA) */}
              <div className="bg-slate-950/90 p-2 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs font-mono my-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 hidden sm:inline">
                  Tono Institucional de Voz:
                </span>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  {TONOS_VOZ_AURA.map((t) => {
                    const active = voice.voiceTone === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          voice.setVoiceTone(t.id);
                          voice.previewTone(t.id);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 border ${
                          active
                            ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                        title={`${t.nombre}: ${t.descripcion}`}
                      >
                        <span>{t.id === 'formal' ? '👔 Formal' : t.id === 'amigable' ? '😊 Cercano' : '🏛️ Presidencial'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Stream Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 my-2">
                {chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-1.5 shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-[#0EA5E9] text-white rounded-br-none font-medium'
                          : 'bg-slate-950 text-slate-100 border border-slate-800/90 rounded-bl-none'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] opacity-80 font-mono font-bold">
                        <span>{msg.sender === 'user' ? 'Ciudadano' : 'Aura IA (Orbe Central)'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-sans leading-relaxed text-xs">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-2">
                      <Bot size={16} className="text-[#0EA5E9] animate-spin" />
                      <span>Procesando conversación agéntica con firma digital...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Natural Input Controls */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Habla o escribe tu solicitud en ${lenguaActual.nombre}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-[#0EA5E9] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
                  />

                  {/* Microphone Button */}
                  <button
                    onClick={handleMicClick}
                    className={`p-3 rounded-2xl transition flex items-center justify-center ${
                      voice.isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                    title={voice.isListening ? "Detener micrófono" : "Hablar por micrófono"}
                  >
                    {voice.isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage()}
                    className="p-3 rounded-2xl bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white shadow-md shadow-[#0EA5E9]/20 transition"
                  >
                    <Send size={18} />
                  </button>
                </div>

                {/* Proof of Zero Form Impact Banner */}
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Zap size={12} /> Impacto: 100% Conversacional (0 formularios)
                  </span>
                  <span className="hidden sm:inline text-slate-500">Soberanía Digital Nayarit</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VISTA 2: HOLOGRAMA 3D ESPACIAL */}
        {vistaModo === 'orbe3d' && (
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800/90 p-6 shadow-xl relative min-h-[580px] flex flex-col justify-between overflow-hidden backdrop-blur-sm">
            
            <div className="flex justify-between items-center z-20">
              <div>
                <span className="text-[10px] font-mono font-extrabold text-[#0EA5E9] uppercase tracking-widest">
                  Núcleo de Inteligencia Espacial
                </span>
                <h3 className="text-base font-black text-white">Nodos Agénticos del Orbe Central</h3>
              </div>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center gap-2 border border-slate-700"
              >
                <RotateCw size={14} className={autoRotate ? "animate-spin" : ""} />
                <span>{autoRotate ? 'Pausar Orbe' : 'Reanudar'}</span>
              </button>
            </div>

            {/* Orbit Stage */}
            <div className="relative w-full h-[450px] flex items-center justify-center my-4">
              <div className="absolute w-[460px] h-[460px] rounded-full border border-sky-500/20 pointer-events-none animate-pulse" />
              <div className="absolute w-[320px] h-[320px] rounded-full border border-dashed border-[#0EA5E9]/30 pointer-events-none animate-spin" style={{ animationDuration: '40s' }} />

              {/* Central Core — Ojo de Dios Wixárika */}
              <div 
                onClick={() => setVistaModo('conversacion')}
                className="z-30 cursor-pointer transform hover:scale-105 transition-all"
                title="Toca el Orbe Central para iniciar interacción por voz"
              >
                <WixarikaOjoDeDiosOrb 
                  size="xl"
                  isSpeaking={voice.isSpeaking}
                  isListening={voice.isListening}
                  label="Orbe Central · Toca para Hablar"
                />
              </div>

              {/* Satellites */}
              {ORBE_MODULOS.map((mod, idx) => {
                const total = ORBE_MODULOS.length;
                const angleDeg = (idx * (360 / total) + rotationAngle) % 360;
                const angleRad = (angleDeg * Math.PI) / 180;

                const posX = Math.cos(angleRad) * 220;
                const posY = Math.sin(angleRad) * 150;

                const IconComp = mod.icon;

                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      onNavigate(mod.targetView, { tab: mod.targetTab, modulo: mod.targetModulo });
                    }}
                    style={{ transform: `translate(${posX}px, ${posY}px)` }}
                    className={`absolute w-14 h-14 rounded-2xl bg-slate-950 border ${mod.borderColor} flex flex-col items-center justify-center shadow-lg hover:scale-125 transition-all z-20 group`}
                  >
                    <IconComp size={22} className={mod.color} />
                    <span className="absolute -bottom-6 text-[9px] font-mono font-bold text-slate-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap group-hover:bg-[#0EA5E9] group-hover:text-white transition">
                      {mod.nombre}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Orbit Footer */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Navegación Esférica de Mantenimiento Urbano & Servicios Públicos</span>
              <button
                onClick={() => setVistaModo('conversacion')}
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <span>Probar Conversación</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* VISTA 3: MATRIZ DE MÓDULOS */}
        {vistaModo === 'matriz' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ORBE_MODULOS.map((mod) => {
              const IconComp = mod.icon;

              return (
                <div
                  key={mod.id}
                  className={`bg-slate-900/80 rounded-3xl p-6 border ${mod.borderColor} space-y-4 flex flex-col justify-between shadow-lg hover:shadow-xl transition backdrop-blur-sm`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${mod.color}`}>
                        <IconComp size={22} />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                        CONVERSACIONAL
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white">{mod.nombre}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{mod.subtitulo}</p>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(mod.targetView, { tab: mod.targetTab, modulo: mod.targetModulo })}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-[#0EA5E9] text-white font-mono font-bold text-xs transition flex items-center justify-between"
                  >
                    <span>Abrir Módulo</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
};
