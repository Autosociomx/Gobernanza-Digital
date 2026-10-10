import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Layers,
  CheckCircle2,
  Printer,
  Share2,
  Zap,
  ChevronLeft,
  BookOpen,
  Swords,
  Map,
  Copy,
  Check,
  Building2,
  Landmark,
  Scale,
  Sparkles,
  Smartphone,
  Send,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrigadaStrategy } from './BrigadaStrategy';
import { BrigadaFieldView } from './BrigadaFieldView';
import { Whitepaper } from './Whitepaper';
import { PitchDefense } from './PitchDefense';
import { RoadmapArchitectureView } from './dashboard/RoadmapArchitectureView';
import { PresidencialAgentsFolder } from './PresidencialAgentsFolder';
import { UniversalOrderNav } from './UniversalOrderNav';

type ExecutiveViewTab = 'presidencial' | 'dossier' | 'whitepaper' | 'warroom' | 'roadmap' | 'email' | 'demo';

export function ExecutiveFolder({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<ExecutiveViewTab>('presidencial');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const emailSubject = "Propuesta Institucional: Implementación de la Estrategia Nayarit Digital y Simplificación Administrativa";
  const emailBody = `Estimados coordinadores y coordinadoras del equipo municipal de Tepic,

Me permito presentarles el dossier público de la plataforma Nayarit Digital / SOATM, un ecosistema integrado diseñado para consolidar administraciones eficientes, cercanas y totalmente transparentes para la ciudadanía.

Puntos clave de la propuesta de implementación:
1. Expediente Único Digital: Reducimos en más de un 80% los tiempos de espera del ciudadano mediante la unificación de validaciones y cero fotocopias.
2. Empoderamiento y Certificación: A través de la Academia Digital ConnectX, certificamos a los servidores públicos sindicalizados para convertirlos en gestores clave de la digitalización.
3. Soberanía Tecnológica: Diseñamos flujos autogestionados de código abierto que evitan licencias de software privativas y costosas a las arcas municipales.
4. Cumplimiento LNETB: Implementación directa de las obligaciones de la Ley Nacional para Eliminar Trámites Burocráticos (Arts. 2, 3, 66-76) y la Ley de Gobierno Digital de Nayarit.

Pueden consultar la Carpeta Pública de Servicio completa en: ${typeof window !== 'undefined' ? window.location.origin + '?view=executive' : 'https://ais-dev-ptlq76gigwmfitt2oa6kym-255576656958.us-east1.run.app?view=executive'}

Quedo a su entera disposición para coordinar una mesa técnica de trabajo institucional.

Atentamente,
Coordinación de Estrategia Institucional
Nayarit Digital OS / SOATM Municipal`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Asunto: ${emailSubject}\n\n${emailBody}`);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Carpeta Pública de Servicio - Nayarit Digital OS',
        text: 'Dossier institucional para la transformación y simplificación digital en Tepic y municipios de Nayarit.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#0FA3B1] selection:text-white flex flex-col">
      
      {/* Universal Order & Navigation Bar */}
      <UniversalOrderNav
        currentView="executive"
        currentSubItem={activeTab === 'presidencial' ? 'Auditoría de Gabinete IA' : activeTab === 'dossier' ? 'Dossier Técnico' : activeTab === 'whitepaper' ? 'Whitepaper Estratégico' : activeTab === 'warroom' ? 'Pitch Defense' : activeTab === 'roadmap' ? 'Roadmap de Expansión' : activeTab}
        onNavigate={(view) => {
          if (view === 'landing') onBack();
          else if (typeof window !== 'undefined') {
            window.location.href = `?view=${view}`;
          }
        }}
      />

      {/* Top Bar Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              title="Volver a la página principal"
            >
              <ChevronLeft className="w-4 h-4 text-[#0FA3B1]" />
              <span className="hidden sm:inline">Volver a la Plataforma</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                Carpeta Pública de Servicio Municipal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Imprimir / PDF</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors relative"
              title="Compartir enlace"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0FA3B1]" />
              <span className="hidden md:inline">Compartir</span>
              {shareToast && (
                <span className="absolute top-full mt-2 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                  ¡Enlace copiado!
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('email')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0FA3B1] hover:bg-[#088b99] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Email Propuesta</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 'presidencial', label: 'Carpeta Presidencial 🇲🇽', icon: Sparkles, badge: '15 Agentes' },
            { id: 'dossier', label: 'Dossier Ejecutivo', icon: Landmark, badge: 'Visión' },
            { id: 'whitepaper', label: 'Whitepaper LNETB', icon: BookOpen, badge: 'Ley' },
            { id: 'warroom', label: 'Mesa Técnica (War Room)', icon: Swords, badge: 'Objeciones' },
            { id: 'roadmap', label: 'Roadmap Despliegue', icon: Map, badge: '4 Fases' },
            { id: 'email', label: 'Email Institucional', icon: Send, badge: '1-Click' },
            { id: 'demo', label: 'Simulador Móvil', icon: Smartphone, badge: 'Demo Campo' },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ExecutiveViewTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active 
                    ? 'bg-[#0FA3B1] text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <AnimatePresence mode="wait">
          {/* TAB 0: CARPETA PRESIDENCIAL 15 AGENTES */}
          {activeTab === 'presidencial' && (
            <motion.div 
              key="presidencial"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <PresidencialAgentsFolder onBack={onBack} />
            </motion.div>
          )}

          {/* TAB 1: DOSSIER EJECUTIVO */}
          {activeTab === 'dossier' && (
            <motion.div 
              key="dossier"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Header Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0FA3B1]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 space-y-6">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0FA3B1]/20 border border-[#0FA3B1]/40 flex items-center justify-center text-[#0FA3B1] font-extrabold text-xl">
                        N
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#F5A623] font-bold">Documento Oficial de Servicio Público</p>
                        <h2 className="text-sm font-bold text-slate-200">ConnectX · Nayarit Digital OS</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                        Documento ID: NAY-DIG-2026-V1
                      </span>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-5xl font-serif font-black text-white leading-tight mb-4">
                      Estrategia <span className="text-[#0FA3B1] italic">Nayarit Digital</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
                      Dossier institucional para la transformación y simplificación digital en <strong>Tepic</strong>, con ruta de réplica a los 20 municipios de Nayarit. Un plan integral para dignificar la labor del servidor público sindicalizado y elevar la calidad de vida ciudadana mediante la transparencia y la eliminación de trámites burocráticos.
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Ahorro en Licencias</p>
                      <p className="text-xl font-bold text-emerald-400">$0 MXN</p>
                      <p className="text-[10px] text-slate-500">Soberanía Abierta</p>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Tiempos de Espera</p>
                      <p className="text-xl font-bold text-amber-400">-90% Ventanilla</p>
                      <p className="text-[10px] text-slate-500">Expediente Único</p>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Marco Legal</p>
                      <p className="text-xl font-bold text-[#0FA3B1]">LNETB Cumplida</p>
                      <p className="text-[10px] text-slate-500">Arts. 2, 3, 66-76</p>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Seguridad de Datos</p>
                      <p className="text-xl font-bold text-purple-400">E2EE Cifrado</p>
                      <p className="text-[10px] text-slate-500">Zero Trust Privacy</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3 text-[#0FA3B1]">
                    <ShieldCheck className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">1. Visión: Soberanía Digital</h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    La digitalización no es solo "subir trámites a internet", es crear un ecosistema unificado que sea el centro de la vida ciudadana, validado de forma transparente y ágil.
                  </p>
                  <ul className="space-y-2 pt-2">
                    {[
                      'Validación ágil y transparente de identidad ciudadana sin pedir fotocopias.',
                      'Academia Digital ConnectX: Certificación en Competencias Digitales para personal sindicalizado.',
                      'Gobernanza de Datos local bajo principios de soberanía tecnológica.',
                      'Transparencia total en el seguimiento de trámites, servicios y obras municipales.'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3 text-[#F5A623]">
                    <Scale className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">2. Marco Legal y Simplificación</h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Sustentado en la Ley Nacional para Eliminar Trámites Burocráticos y la Ley de Gobierno Digital del Estado de Nayarit.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-white mb-1">Ley de Gobierno Digital</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">Habilita el expediente único digital y la firma electrónica para la simplificación total.</p>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-white mb-1">Empoderamiento Laboral</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">La Academia Digital impulsa la formación continua, garantizando una transición justa e incluyente.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-components Preview Row */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight">Anexo Técnico Estratégico</h3>
                    <p className="text-xs text-slate-400">Explore la hoja de ruta detallada por roles institucionales.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setActiveTab('whitepaper')} 
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Whitepaper Ley
                    </button>
                    <button 
                      onClick={() => setActiveTab('warroom')} 
                      className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Swords className="w-3.5 h-3.5" /> War Room Objeciones
                    </button>
                    <button 
                      onClick={() => setActiveTab('demo')} 
                      className="px-3 py-1.5 rounded-lg bg-[#0FA3B1]/30 hover:bg-[#0FA3B1]/50 text-cyan-300 border border-[#0FA3B1]/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Simulador Móvil
                    </button>
                  </div>
                </div>

                <BrigadaStrategy />
              </div>

            </motion.div>
          )}

          {/* TAB 2: WHITEPAPER LNETB */}
          {activeTab === 'whitepaper' && (
            <motion.div 
              key="whitepaper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white text-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden"
            >
              <Whitepaper />
            </motion.div>
          )}

          {/* TAB 3: WAR ROOM & OBJECIONES */}
          {activeTab === 'warroom' && (
            <motion.div 
              key="warroom"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <PitchDefense />
            </motion.div>
          )}

          {/* TAB 4: ROADMAP DE LANZAMIENTO */}
          {activeTab === 'roadmap' && (
            <motion.div 
              key="roadmap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl"
            >
              <div className="max-w-4xl mx-auto">
                <RoadmapArchitectureView />
              </div>
            </motion.div>
          )}

          {/* TAB 5: BORRADOR DE EMAIL INSTITUCIONAL */}
          {activeTab === 'email' && (
            <motion.div 
              key="email"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
                
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-widest">Comunicación Oficial</p>
                      <h2 className="text-xl font-bold text-white">Email Listo para Enviar a Coordinadores Municipal</h2>
                    </div>
                  </div>

                  <button 
                    onClick={handleCopyEmail}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                      copiedEmail 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Copiado al Portapapeles!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Borrador Completo</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 leading-relaxed space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <span className="text-slate-500 uppercase font-bold text-[10px] block mb-1">Asunto:</span>
                    <p className="font-bold text-white text-sm">{emailSubject}</p>
                  </div>
                  
                  <div className="whitespace-pre-line text-slate-300">
                    {emailBody}
                  </div>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    <strong>Consejo para Coordinadores:</strong> Puede copiar este borrador de mensaje con un solo clic y adaptarlo para enviarlo vía correo electrónico institucional o mensajería a directores de área, regidores y síndicos.
                  </p>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 6: SIMULADOR MÓVIL DE CAMPO */}
          {activeTab === 'demo' && (
            <motion.div 
              key="demo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-4 flex flex-col items-center justify-center space-y-6"
            >
              <div className="text-center max-w-lg mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0FA3B1] bg-[#0FA3B1]/10 px-3 py-1 rounded-full border border-[#0FA3B1]/20">
                  Simulador de Campo en Vivo
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">Aplicación Móvil Offline-First</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Simule el flujo que realizan los servidores públicos en territorio para levantar solicitudes y validar identidades con firma digital.
                </p>
              </div>

              <BrigadaFieldView />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0FA3B1]"></span>
            <span>Nayarit Digital OS / SOATM Municipal 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="hover:text-slate-300 transition-colors">Inicio</button>
            <span>·</span>
            <button onClick={() => setActiveTab('dossier')} className="hover:text-slate-300 transition-colors">Dossier</button>
            <span>·</span>
            <button onClick={() => setActiveTab('whitepaper')} className="hover:text-slate-300 transition-colors">LNETB</button>
            <span>·</span>
            <button onClick={() => setActiveTab('email')} className="hover:text-slate-300 transition-colors">Email Propuesta</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
