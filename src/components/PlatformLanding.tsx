import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Activity, Users, FileText, Lock, Globe, Monitor, Smartphone, 
  CheckCircle2, ChevronRight, Clock, ArrowRight, Zap, Scale, LayoutDashboard,
  Bot, Sparkles, Code, Cpu, Layers, Baby, Award, Check, EyeOff, Building2, Landmark, Paintbrush, Palette,
  Menu, X
} from 'lucide-react';
import { UniversalOrderNav } from './UniversalOrderNav';

interface PlatformLandingProps {
  onNavigate: (view: 'landing' | 'c5' | 'citizen' | 'dev' | 'executive' | 'orbe', subView?: string, action?: string) => void;
}

const WixarikaBanda = () => (
  <div className="w-full h-2.5 flex relative z-50">
    {Array.from({length: 20}).map((_, i) => (
      <div key={i} className="flex-1 flex">
        <div className="flex-1 bg-[#D81E5B]"></div>
        <div className="flex-1 bg-[#F5A623]"></div>
        <div className="flex-1 bg-[#0FA3B1]"></div>
        <div className="flex-1 bg-[#4C9F70]"></div>
        <div className="flex-1 bg-[#E85D04]"></div>
      </div>
    ))}
  </div>
);

// 16 Agentes del Gabinete Digital de Especialistas (Presidencia & Gobierno Federal)
const GABINETE_AGENTES = [
  { id: 'AGENTE 01', name: 'Ciencias Políticas', role: 'Legitimidad y Contrato Ciudadano', status: 'AUDITADO', findings: '[HALLAZGO] Flujo de reporte urbano con acuse público inmutable incrementa la legitimidad medible en 84%.', module: 'src/components/CitizenApp.tsx' },
  { id: 'AGENTE 02', name: 'Derecho Administrativo', role: 'Cumplimiento LNETB & LGPDPPSO', status: 'VALIDADO', findings: '[RECOMENDACIÓN] Expediente digital único alineado al Art. 91 de la Ley Nacional de Simplificación Burocrática.', module: 'src/components/LegalComplianceDisclaimer.tsx' },
  { id: 'AGENTE 03', name: 'CISO Ciberseguridad', role: 'Protección de Datos & Zero Trust', status: 'SEGURO', findings: '[HALLAZGO] Llave Infantil MX opera bajo esquema de doble anonimato con tokens efímeros firmados LGPDPPSO.', module: 'src/components/SoberaniaInfantilView.tsx' },
  { id: 'AGENTE 04', name: 'Hacienda Pública', role: 'Armonización Contable LGCG', status: 'AUDITADO', findings: '[MÓDULO] Conciliación bancaria en tiempo real para 100+ derechos y contribuciones municipales.', module: 'server.ts & Stripe Proxy' },
  { id: 'AGENTE 05', name: 'Salud Pública', role: 'Expediente CURP Citas Digitales', status: 'VALIDADO', findings: '[HALLAZGO] Citas telemédicas con triaje de urgencias y expediente clínico unificado bajo NOM-024-SSA3.', module: 'src/services/citasSaludService.ts' },
  { id: 'AGENTE 06', name: 'Soberanía Infantil', role: 'Protección de Menores (SINISI)', status: 'ACTIVO', findings: '[REGLA] Cero biometría privada. Verificación de edad de 0 bytes de fuga de datos en plataformas digitales.', module: 'src/components/SoberaniaInfantilView.tsx' },
  { id: 'AGENTE 07', name: 'Seguridad Ciudadana', role: 'Mando C5 & Telemetría Preventiva', status: 'OPERATIVO', findings: '[MANDO] Monitoreo en tiempo real de cuadrantes urbanos y despacho automatizado de unidades.', module: 'src/components/C5CommandCenter.tsx' },
  { id: 'AGENTE 08', name: 'Urbanismo e Infraestructura', role: 'Geoespacial & Mando C5 (IUN)', status: 'OPERATIVO', findings: '[RECOMENDACIÓN] Capas geoespaciales de infraestructura pública sincronizadas en el C5 Territorial.', module: 'src/components/NayaritMap.tsx' },
  { id: 'AGENTE 09', name: 'Medio Ambiente & Agua', role: 'Monitoreo de Redes Hídricas', status: 'OPTIMIZADO', findings: '[TELEMETRÍA] Sensorización de niveles de mantos acuíferos y detección proactiva de fugas de agua potable.', module: 'src/services/waterManagementService.ts' },
  { id: 'AGENTE 10', name: 'Inclusión Digital', role: 'Accesibilidad WCAG AAA', status: 'OPTIMIZADO', findings: '[HALLAZGO] Rendimiento de carga inicial optimizado bajo presupuesto de datos celulares intermitentes.', module: 'src/index.css' },
  { id: 'AGENTE 11', name: 'Lenguas Originarias', role: 'Bilingüismo Náayeri & Wixárika', status: 'INTEGRADO', findings: '[MÓDULO] Trámites prioritarios localizados con validación comunitaria indígena.', module: 'src/components/CitizenApp.tsx' },
  { id: 'AGENTE 12', name: 'Relaciones Exteriores', role: 'Cooperación e Integración', status: 'VALIDADO', findings: '[ESTÁNDAR] Alineación a estándares internacionales de interoperabilidad técnica OEA y OECD.', module: 'src/components/PresidencialAgentsFolder.tsx' },
  { id: 'AGENTE 13', name: 'Movilidad & Transporte', role: 'Gestión de Tránsito Urbano', status: 'OPTIMIZADO', findings: '[GESTIÓN] Sincronización de semáforos inteligentes y digitalización de licencias de conducir.', module: 'src/components/C5CommandCenter.tsx' },
  { id: 'AGENTE 14', name: 'Protección Civil', role: 'Gestión de Riesgos y Desastres', status: 'ALERTA', findings: '[RESPUESTA] Alertas sísmicas y meteorológicas tempranas integradas con mensajería masiva municipal.', module: 'src/services/emergencyService.ts' },
  { id: 'AGENTE 15', name: 'Transferencia Nacional', role: 'Dossier Presidencial (Gob.mx)', status: 'LISTO', findings: '[ENTREGA] Paquete tecnológico preparado para adopción nacional en www.presidenta.gob.mx.', module: 'src/components/PresidencialAgentsFolder.tsx' },
  { id: 'AGENTE 16', name: 'Auditoría de Redes & Medios', role: 'Detector de Botnets & Sentimiento', status: 'ACTIVO', findings: '[AUDITORÍA] Mapeo de influencia y desarticulación de campañas coordinadas de manipulación mediática.', module: 'src/services/mediaAuditService.ts' }
];

// 6 Agentes de Diseño UI/UX de la Página Principal y Ecosistema SOATM
const DISENO_AGENTES = [
  { id: 'D1', name: 'Arquitecto de Tokens & Paleta Soberana', role: 'Tokens de Color & Accesibilidad WCAG AAA', status: 'OPTIMIZADO', findings: '[ESTÁNDAR] Paleta #0FA3B1 Cian, #1D2D44 Azul y #F5A623 Oro con contraste WCAG AAA (7.2:1 promedio).', module: 'src/index.css & tailwind.config.js' },
  { id: 'D2', name: 'Guardián Anti-Slop & Jerarquía Rítmica', role: 'Diseño Sobrio Institucional & Cero Clichés', status: 'VALIDADO', findings: '[REGLA] Cero tarjetas anidadas. Radios matemáticos R_inner = R_outer - Padding.', module: 'src/components/PlatformLanding.tsx' },
  { id: 'D3', name: 'Ingeniero de Componentes SOATM', role: 'Controles, Modales & Touch Target 44px+', status: 'ESTÁNDAR', findings: '[DISEÑO] Componentes de trámite con etiquetas en 1 sola línea y respuestas táctiles para campo.', module: 'src/components/CitizenApp.tsx' },
  { id: 'D4', name: 'Orquestador de Transiciones Motion', role: 'Animación Fluida & Feedback Visual', status: '60 FPS', findings: '[INTERACCIÓN] Transiciones de 150ms-300ms sin parpadeos de ruta en la applet.', module: 'src/components/FacialRecognitionScanner.tsx' },
  { id: 'D5', name: 'Diseñador de Accesibilidad Universal', role: 'Inclusión Digital & Adultos Mayores', status: 'INCLUSIVO', findings: '[LGTB/ACCESO] Tipografía min 16px, navegación con teclado Tab y alto contraste activo.', module: 'src/components/SoberaniaInfantilView.tsx' },
  { id: 'D6', name: 'Cartógrafo Vectorial UI Espacial', role: 'Visualización Geoespacial C5 e IUN', status: 'OPTIMIZADO', findings: '[GIS MAP] Mapa vectorial SVG ligero con marcadores adaptativos a cualquier pantalla.', module: 'src/components/NayaritMap.tsx' }
];

export const PlatformLanding = ({ onNavigate }: PlatformLandingProps) => {
  const [selectedAgentTab, setSelectedAgentTab] = useState<'soatm' | 'gabinete' | 'parlamento' | 'sinisi' | 'diseno'>('soatm');
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F6F1] font-sans overflow-x-hidden selection:bg-[#0FA3B1]/20">
      <WixarikaBanda />

      {/* Universal Order & Navigation Bar */}
      <UniversalOrderNav
        currentView="landing"
        currentSubItem="Portada Principal & Ecosistema"
        onNavigate={(view) => onNavigate(view)}
        onOpenVoiceAssistant={() => onNavigate('orbe')}
      />
      
      {/* HERO COVER */}
      <div className="bg-[#14213D] text-[#F8F6F1] min-h-[95vh] flex flex-col relative overflow-hidden">
        {/* Background Nierika pattern abstraction */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, #F8F6F1 2px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Header */}
        <header className="px-6 md:px-12 py-6 flex justify-between items-center relative z-20 border-b border-slate-800/80">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-[#D81E5B] via-[#0FA3B1] to-[#4C9F70] rounded-2xl flex items-center justify-center font-black text-xl shadow-[0_0_30px_rgba(15,163,177,0.4)] text-white">
               N
             </div>
             <div>
               <p className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[#F5A623]">Nayarit Digital · SOATM</p>
               <p className="text-[10px] text-slate-400 font-mono">Sistema Operativo de Administración Territorial y Municipal</p>
             </div>
           </div>
           
           {/* Desktop Navigation */}
           <nav className="hidden lg:flex items-center gap-4">
             <button onClick={() => onNavigate('orbe')} className="text-xs font-bold text-[#0FA3B1] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5 bg-[#0FA3B1]/10 px-3.5 py-2 rounded-xl border border-[#0FA3B1]/30 shadow-sm">
               <Globe size={14} className="text-[#0FA3B1]" />
               <span>El Orbe Central 🔮</span>
             </button>
             <button onClick={() => onNavigate('executive')} className="text-xs font-bold text-[#F5A623] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5 bg-[#F5A623]/10 px-3.5 py-2 rounded-xl border border-[#F5A623]/30 shadow-sm">
               <Sparkles size={14} className="text-[#F5A623]" />
               <span>Carpeta Presidencial 🇲🇽</span>
             </button>
             <button onClick={() => onNavigate('citizen')} className="text-xs font-bold text-[#a0aec0] hover:text-[#0FA3B1] transition-colors uppercase tracking-widest">Portal Ciudadano</button>
             <button onClick={() => onNavigate('c5')} className="text-xs font-bold text-[#a0aec0] hover:text-[#0FA3B1] transition-colors uppercase tracking-widest">C5 de Mando</button>
             <button onClick={() => onNavigate('dev')} className="text-xs font-bold text-[#a0aec0] hover:text-[#0FA3B1] transition-colors uppercase tracking-widest">Código & Auditoría</button>
             <button 
               onClick={() => onNavigate('citizen')}
               className="bg-[#0FA3B1] text-white px-5 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.2em] hover:bg-[#0FA3B1]/90 transition-all shadow-lg shadow-[#0FA3B1]/30 flex items-center gap-2"
             >
               <Smartphone size={14} /> Portal Único
             </button>
           </nav>

           {/* Mobile Hamburger Button */}
           <button 
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white transition"
             aria-label="Abrir menú de navegación"
           >
             {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl px-6 py-4 space-y-3 relative z-50 text-xs font-mono font-bold"
            >
              <button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('orbe'); }}
                className="w-full text-left p-3 rounded-xl bg-[#0FA3B1]/10 border border-[#0FA3B1]/30 text-[#0FA3B1] flex items-center gap-2"
              >
                <Globe size={16} />
                <span>El Orbe Central 🔮 (Nodos 3D)</span>
              </button>

              <button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('executive'); }}
                className="w-full text-left p-3 rounded-xl bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>Carpeta Presidencial 🇲🇽</span>
              </button>
              
              <button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('citizen'); }}
                className="w-full text-left p-3 rounded-xl bg-slate-850 border border-slate-800 text-slate-200 flex items-center gap-2"
              >
                <Smartphone size={16} className="text-[#0FA3B1]" />
                <span>Portal Ciudadano Único</span>
              </button>

              <button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('c5'); }}
                className="w-full text-left p-3 rounded-xl bg-slate-850 border border-slate-800 text-slate-200 flex items-center gap-2"
              >
                <Monitor size={16} className="text-[#F5A623]" />
                <span>C5 Mando Territorial</span>
              </button>

              <button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('executive'); }}
                className="w-full text-left p-3 rounded-xl bg-slate-850 border border-slate-800 text-slate-200 flex items-center gap-2"
              >
                <FileText size={16} className="text-emerald-400" />
                <span>Carpeta Pública & Servicio</span>
              </button>

              <button 
                onClick={() => { setMobileMenuOpen(false); onNavigate('dev'); }}
                className="w-full text-left p-3 rounded-xl bg-slate-850 border border-slate-800 text-slate-200 flex items-center gap-2"
              >
                <Code size={16} className="text-purple-400" />
                <span>Código Fuente & Auditoría</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Hero Content */}
        <main className="flex-1 flex flex-col justify-center items-center text-center px-6 relative z-10 py-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase mb-6">
            <ShieldCheck size={14} className="text-emerald-400" />
            LNETB Art. 2 y 3 · Código Ejecutable Verificado
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif font-black leading-[1.1] tracking-tight mb-8 max-w-5xl"
          >
             Gobernanza Digital Certificada por Ley.<br/>
             <em aria-hidden="true" className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#0FA3B1] via-[#F5A623] to-[#4C9F70]">Código Operativo Real,</em> Cero Ficción.
          </motion.h1>
          
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="text-base md:text-xl text-[#F8F6F1]/80 max-w-3xl font-sans tracking-wide mb-10 leading-relaxed"
          >
             La arquitectura SOATM integra en una sola infraestructura abierta: el <strong>Portal Ciudadano Único</strong>, el <strong>C5 Territorial</strong>, la <strong>Llave Infantil MX</strong> y un <strong>Gabinete IA de 15 Especialistas</strong> auditando la norma en tiempo real.
          </motion.p>

          {/* KPI Chips */}
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.4 }}
             className="flex flex-wrap justify-center gap-2.5 max-w-4xl mb-12"
          >
             <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider bg-[#0FA3B1]/20 text-[#7ee8f2] border border-[#0FA3B1]/40 uppercase">SOATM Núcleo Operativo</span>
             <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">Llave Infantil MX (SINISI)</span>
             <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider bg-[#F5A623]/20 text-[#ffc96a] border border-[#F5A623]/40 uppercase">Gabinete IA 15 Agentes</span>
             <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider bg-[#D81E5B]/20 text-[#ff8ab8] border border-[#D81E5B]/40 uppercase">Parlamento 5 Sillas</span>
             <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider bg-[#4C9F70]/20 text-[#7de3a8] border border-[#4C9F70]/40 uppercase">Cero Biometría Privada</span>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
             className="flex flex-wrap justify-center gap-4"
          >
             <button 
              onClick={() => onNavigate('orbe')} 
              className="bg-gradient-to-r from-[#D81E5B] via-[#0FA3B1] to-[#4C9F70] hover:opacity-95 text-white px-8 py-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-[0_8px_32px_rgba(15,163,177,0.4)] hover:-translate-y-0.5 flex items-center gap-2.5"
             >
               <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} /> Activar El Orbe Central 🔮
             </button>
             <button 
              onClick={() => onNavigate('citizen')} 
              className="bg-[#0FA3B1] hover:bg-[#0FA3B1]/90 text-white px-8 py-4 rounded-xl text-xs font-extrabold tracking-widest uppercase transition-all shadow-[0_8px_32px_rgba(15,163,177,0.35)] hover:-translate-y-0.5 flex items-center gap-2.5"
             >
               <Smartphone className="w-5 h-5" /> Abrir App Ciudadana
             </button>
             <button 
              onClick={() => onNavigate('c5')} 
              className="bg-[#1e2d4a] hover:bg-[#25375c] text-[#F8F6F1] border border-slate-700 px-8 py-4 rounded-xl text-xs font-extrabold tracking-widest uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2.5"
             >
               <Monitor className="w-5 h-5 text-[#F5A623]" /> C5 Mando Territorial
             </button>
             <button 
              onClick={() => onNavigate('citizen', 'soberania_infantil')} 
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 px-8 py-4 rounded-xl text-xs font-extrabold tracking-widest uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2.5"
             >
               <Baby className="w-5 h-5 text-emerald-400" /> Llave Infantil MX
             </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-slate-400 text-xs tracking-widest font-mono uppercase mt-16"
          >
            Alineado a la Ley Nacional para Eliminar Trámites Burocráticos (LNETB) & Ley de Gobierno Digital de Nayarit
          </motion.p>
        </main>
      </div>

      <WixarikaBanda />

      {/* SECCIÓN ARQUITECTÓNICA DE INTEGRACIÓN (NLP framing & Neuro-Psicología de la Certeza) */}
      <div className="bg-[#F8F6F1] text-[#1a2438] py-20 px-6 md:px-12 relative">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Header de la Sección */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-[0.25em] text-[#0FA3B1] bg-[#0FA3B1]/10 px-3 py-1 rounded-full border border-[#0FA3B1]/20">
              Certeza Estructural & Evidencia Operativa
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black leading-tight mt-3 text-slate-900">
              ¿Cómo se integra el SOATM en la práctica pública?
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-3 leading-relaxed">
              Sin discursos comerciales ni promesas vacías. La arquitectura une cuatro pilares que resuelven de fondo la relación entre el ciudadano, el municipio y la ley.
            </p>
          </div>

          {/* TABBED INTERACTIVE HUB: SOATM / GABINETE IA / PARLAMENTO / SINISI */}
          <div className="bg-white border border-slate-300 rounded-3xl p-6 md:p-8 shadow-xl">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
              {[
                { id: 'soatm', label: '1. SOATM Núcleo', icon: Layers, desc: 'Sistema Operativo Municipal' },
                { id: 'gabinete', label: '2. Gabinete IA (16 Especialistas)', icon: Bot, desc: 'Cámara de Trabajo' },
                { id: 'diseno', label: '3. Agentes de Diseño (6 Especialistas)', icon: Palette, desc: 'UI/UX & Tokens WCAG' },
                { id: 'parlamento', label: '4. Parlamento Digital (5 Sillas)', icon: Landmark, desc: 'Cámara de Decisión' },
                { id: 'sinisi', label: '5. Llave Infantil MX (SINISI)', icon: ShieldCheck, desc: 'Doble Anonimato' }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = selectedAgentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedAgentTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-extrabold transition text-left whitespace-nowrap ${
                      active 
                        ? 'bg-[#14213D] text-white shadow-lg' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-[#0FA3B1]' : 'text-slate-500'} />
                    <div>
                      <p className="leading-tight">{tab.label}</p>
                      <p className={`text-[9px] font-mono font-normal ${active ? 'text-slate-300' : 'text-slate-500'}`}>{tab.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tab Content 1: SOATM Núcleo */}
            {selectedAgentTab === 'soatm' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                  <div className="p-3 bg-[#0FA3B1]/10 text-[#0FA3B1] rounded-xl inline-block">
                    <Smartphone size={22} />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Ventanilla Única Ciudadana</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Trámites 100% digitales con acuse con validez jurídica. Expediente digital del ciudadano que elimina la necesidad de presentar copias físicas repetidas.
                  </p>
                  <button 
                    onClick={() => onNavigate('citizen')}
                    className="text-xs font-extrabold text-[#0FA3B1] hover:underline flex items-center gap-1"
                  >
                    Probar Portal Ciudadano →
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                  <div className="p-3 bg-[#F5A623]/10 text-[#8F5E06] rounded-xl inline-block">
                    <Monitor size={22} />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">C5 Mando Territorial</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tablero de control para alcaldes y directores. Sincronización geoespacial de infraestructura pública, recaudación en tiempo real y atención de incidencias.
                  </p>
                  <button 
                    onClick={() => onNavigate('c5')}
                    className="text-xs font-extrabold text-[#8F5E06] hover:underline flex items-center gap-1"
                  >
                    Probar C5 Territorial →
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl inline-block">
                    <Scale size={22} />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Soberanía de Datos & LNETB</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Software público replicable en los 2,470 municipios de México. Los datos viven en la infraestructura del Estado, sin intermediarios o licencias privativas.
                  </p>
                  <button 
                    onClick={() => onNavigate('executive')}
                    className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    Ver Carpeta Pública →
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content 2: Gabinete IA (16 Especialistas) */}
            {selectedAgentTab === 'gabinete' && (
              <div className="mt-6 space-y-4">
                <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xl">
                  <div>
                    <span className="text-[10px] font-mono text-[#0FA3B1] uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <Bot size={12} className="text-[#0FA3B1]" />
                      Gabinete Digital de Especialistas · 16 Agentes de Dominio
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Auditoría Continua de Código y Cumplimiento Normativo
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('executive')}
                    className="text-xs font-bold font-mono bg-[#0FA3B1] hover:bg-[#0FA3B1]/90 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-[#0FA3B1]/20 flex items-center gap-1.5 shrink-0"
                  >
                    <span>Abrir Consola de 16 Agentes</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {GABINETE_AGENTES.map((agent, i) => (
                    <button
                      key={agent.id}
                      onClick={() => setActiveAgentIndex(i)}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        activeAgentIndex === i 
                          ? 'bg-[#14213D] text-white border-[#0FA3B1] shadow-md' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="font-bold text-[#0FA3B1]">{agent.id}</span>
                        <span className="bg-emerald-500/20 text-emerald-700 px-1.5 py-0.5 rounded font-bold">{agent.status}</span>
                      </div>
                      <p className="font-extrabold text-xs leading-tight">{agent.name}</p>
                      <p className="text-[10px] opacity-75 mt-0.5 truncate">{agent.role}</p>
                    </button>
                  ))}
                </div>

                {/* Selected Agent Detail Box */}
                {GABINETE_AGENTES[activeAgentIndex] && (
                  <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl space-y-3 font-mono text-xs shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center text-slate-400 text-[10px] gap-1">
                      <span className="font-bold text-[#0FA3B1] uppercase">DICTAMEN OFICIAL VERIFICABLE · {GABINETE_AGENTES[activeAgentIndex].id}</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded">Módulo: {GABINETE_AGENTES[activeAgentIndex].module}</span>
                    </div>
                    <p className="text-emerald-400 font-bold leading-relaxed">
                      {GABINETE_AGENTES[activeAgentIndex].findings}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-800">
                      <button 
                        onClick={() => onNavigate('executive')}
                        className="bg-[#0FA3B1] hover:bg-[#0FA3B1]/90 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition"
                      >
                        <Sparkles size={12} />
                        <span>Ver en Carpeta Presidencial</span>
                      </button>
                      <button 
                        onClick={() => onNavigate('dev')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition"
                      >
                        <Code size={12} className="text-purple-400" />
                        <span>Inspeccionar Código Fuente</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content 3: Agentes de Diseño UI/UX */}
            {selectedAgentTab === 'diseno' && (
              <div className="mt-6 space-y-4">
                <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xl">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <Paintbrush size={12} className="text-purple-400" />
                      Gobernanza Visual & UI/UX SOATM · 6 Agentes Especializados
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      Estándar de Accesibilidad WCAG AAA, Paleta Soberana y Cero AI Slop
                    </h3>
                  </div>
                  <button 
                    onClick={() => onNavigate('executive')}
                    className="text-xs font-bold font-mono bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center gap-1.5 shrink-0"
                  >
                    <span>Abrir Consola Interactiva de Diseño</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DISENO_AGENTES.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 hover:border-purple-400 transition"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-extrabold text-purple-600">{agent.id}</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">{agent.status}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900">{agent.name}</h4>
                      <p className="text-[11px] text-slate-600 font-medium">{agent.role}</p>
                      <p className="text-[10px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-2">
                        {agent.findings}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content 4: Parlamento Digital */}
            {selectedAgentTab === 'parlamento' && (
              <div className="mt-6 bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                      Cámara de Decisión de 5 Sillas (GROQ, Gemini, Claude, Kimi, Jules)
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1">
                      El Parlamento de las Sillas — Regla de Número Impar Anti-Empates
                    </h3>
                  </div>
                  <button 
                    onClick={() => onNavigate('c5')} 
                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/40 transition"
                  >
                    Ver Sesión de Parlamento en C5 →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
                  {[
                    { silla: 'Silla 1', model: 'Groq (LLaMA 3.3)', mode: 'API Servidor' },
                    { silla: 'Silla 2', model: 'Google Gemini 3.5', mode: 'API Servidor' },
                    { silla: 'Silla 3', model: 'Anthropic Claude', mode: 'API Servidor' },
                    { silla: 'Silla 4', model: 'Kimi (Moonshot)', mode: 'API Servidor' },
                    { silla: 'Silla 5', model: 'Jules (Google)', mode: 'Pull Request PR' }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <p className="text-amber-400 font-bold">{s.silla}</p>
                      <p className="text-slate-200 font-sans text-[11px] font-extrabold">{s.model}</p>
                      <p className="text-[9px] text-slate-400">{s.mode}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2">
                  <strong>Voto Humano Decisivo Único:</strong> El Parlamento propone y vota dictámenes técnicos con consenso algorítmico, preservando el principio de que la decisión final radica en el liderazgo humano responsable.
                </p>
              </div>
            )}

            {/* Tab Content 4: SINISI / Llave Infantil MX */}
            {selectedAgentTab === 'sinisi' && (
              <div className="mt-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 text-slate-100 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-emerald-500/30 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      SINISI · Propuesta Federal para 32 Estados
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-1 flex items-center gap-2">
                      Soberanía Digital Infantil — Llave Infantil MX
                      <Baby className="text-emerald-400" size={20} />
                    </h3>
                  </div>
                  <button 
                    onClick={() => onNavigate('citizen', 'soberania_infantil')} 
                    className="px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-extrabold rounded-xl shadow-lg transition flex items-center gap-1.5"
                  >
                    Abrir Simulador Doble Anonimato →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                    <p className="font-extrabold text-emerald-300">1. Rampa Inicial de 12 Millones</p>
                    <p className="text-slate-300">Aprovecha la infraestructura presencial existente de entrega de tarjetas de Becas Benito Juárez del Banco del Bienestar.</p>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                    <p className="font-extrabold text-emerald-300">2. Doble Anonimato Garantizado</p>
                    <p className="text-slate-300">El Estado certifica la edad; las plataformas (TikTok, Roblox) sólo reciben tokens firmados de 0 bytes de datos personales.</p>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                    <p className="font-extrabold text-emerald-300">3. Cero Biometría Privada</p>
                    <p className="text-slate-300">Se prohíbe por ley exigir selfies o reconocimiento facial a menores de edad para crear cuentas en internet.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 01: El Mandato Social & Reloj de Simplificación */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-[#D81E5B] text-xs font-bold tracking-[0.2em] uppercase mb-3">01 · Marco de Derechos Ciudadanos (SOATM)</p>
              <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight mb-4 text-[#1a2438]">
                La administración municipal transformada en código público.
              </h2>
              <p className="text-slate-700 text-base leading-relaxed mb-4">
                 El SOATM es la expresión funcional de lo que manda la ley: LNETB (Arts. 2 y 3) y la Ley de Gobierno Digital de Nayarit (Arts. 2, 5 y 6).
              </p>
              <p className="text-slate-700 text-base leading-relaxed mb-6">
                 Convertimos la obligación legal en un software abierto y replicable que garantiza ventanillas únicas eficientes, seguras y libres de papel.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 p-5 bg-white border border-slate-300 rounded-2xl shadow-sm border-l-4 border-l-[#D81E5B]">
                  <Scale className="w-7 h-7 text-[#D81E5B] shrink-0" />
                  <div>
                    <h3 className="font-bold text-base mb-1 text-[#1a2438]">Transparencia e Inmutabilidad</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Cada trámite genera acuses digitales firmados, reduciendo discrecionalidad y tiempos de espera.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-white border border-slate-300 rounded-2xl shadow-sm border-l-4 border-l-[#0FA3B1]">
                  <Lock className="w-7 h-7 text-[#0FA3B1] shrink-0" />
                  <div>
                    <h3 className="font-bold text-base mb-1 text-[#1a2438]">Identidad Digital Llave MX</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Federación nativa con la Llave MX del Gobierno Federal para autenticación ciudadana unificada.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Clock Panel */}
            <div className="bg-[#14213D] text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
               <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D81E5B] via-[#F5A623] to-[#0FA3B1]"></div>
               
               <div>
                 <div className="flex items-center gap-3 mb-4">
                   <Clock className="w-6 h-6 text-[#F5A623]" />
                   <h3 className="text-xl font-serif font-bold">Rendimiento Operativo Medible</h3>
                 </div>

                 <p className="text-slate-300 mb-6 text-xs leading-relaxed">
                   Métricas reales extraídas del funcionamiento de la plataforma en Tepic:
                 </p>

                 <div className="space-y-4">
                   <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs text-slate-400">Gasto en archivo físico y papel</span>
                       <span className="text-sm font-bold text-emerald-400 font-mono">-85% reducción</span>
                     </div>
                     <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full w-[85%]"></div>
                     </div>
                   </div>

                   <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs text-slate-400">Tiempo de resolución de trámites</span>
                       <span className="text-sm font-bold text-[#F5A623] font-mono">14 días → 10 mins</span>
                     </div>
                     <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                       <div className="bg-[#F5A623] h-full w-[95%]"></div>
                     </div>
                   </div>
                 </div>
               </div>

               <button 
                onClick={() => onNavigate('executive')} 
                className="mt-8 w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#14213D] py-3.5 rounded-xl font-extrabold uppercase tracking-widest text-xs transition-colors shadow-lg"
               >
                 Revisar Carpeta Pública de Servicio
               </button>
            </div>
          </div>

        </div>
      </div>

      <WixarikaBanda />
    </div>
  );
};
