import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Activity, Users, FileText, Lock, Globe, Monitor, Smartphone, CheckCircle2, ChevronRight, Clock, ArrowRight, Zap, Scale, LayoutDashboard
} from 'lucide-react';

interface PlatformLandingProps {
  onNavigate: (view: 'landing' | 'c5' | 'citizen' | 'dev' | 'executive', subView?: string, action?: string) => void;
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

export const PlatformLanding = ({ onNavigate }: PlatformLandingProps) => {
  return (
    <div className="min-h-screen bg-[#F8F6F1] font-sans overflow-x-hidden selection:bg-[#D81E5B]/20">
      <WixarikaBanda />
      
      {/* HERO COVER */}
      <div className="bg-[#14213D] text-[#F8F6F1] min-h-[95vh] flex flex-col relative overflow-hidden">
        {/* Background Nierika pattern abstraction */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, #F8F6F1 2px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Header */}
        <header className="px-6 md:px-12 py-8 flex justify-between items-center relative z-20">
           <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-gradient-to-br from-[#D81E5B] to-[#0FA3B1] rounded-full flex items-center justify-center font-black text-2xl shadow-[0_0_40px_rgba(216,30,91,0.4)] text-white">
               N
             </div>
             <div>
               <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#F5A623]">Nayarit Digital · ConnectX</p>
             </div>
           </div>
           
           <nav className="hidden lg:flex items-center gap-8">
             <button onClick={() => onNavigate('citizen')} className="text-xs font-bold text-[#a0aec0] hover:text-[#0FA3B1] transition-colors uppercase tracking-widest">Portal Ciudadano</button>
             <button onClick={() => onNavigate('c5')} className="text-xs font-bold text-[#a0aec0] hover:text-[#0FA3B1] transition-colors uppercase tracking-widest">C5 de Gestión Pública</button>
             <button onClick={() => onNavigate('executive')} className="text-xs font-bold text-[#a0aec0] hover:text-[#0FA3B1] transition-colors uppercase tracking-widest">Carpeta de Servicio</button>
             <button 
               onClick={() => onNavigate('citizen')}
               className="bg-[#D81E5B] text-white px-6 py-3 rounded text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#D81E5B]/80 transition-all shadow-lg"
             >
               Iniciar Trámite
             </button>
           </nav>
        </header>

        {/* Main Hero Content */}
        <main className="flex-1 flex flex-col justify-center items-center text-center px-6 relative z-10 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-[4.8rem] font-serif font-normal leading-[1.1] tracking-tight mb-8 max-w-5xl"
          >
             El ecosistema digital<br/>
             para el <em aria-hidden="true" className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#D81E5B] to-[#0FA3B1]">bienestar ciudadano</em><span className="sr-only">bienestar ciudadano</span><br/>
             de Nayarit
          </motion.h1>
          
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="text-lg md:text-xl text-[#F8F6F1]/70 max-w-2xl font-sans tracking-wider mb-14 leading-relaxed"
          >
             Portal de Trámites y Servicios Simplificados. El canal digital oficial del municipio de Tepic, diseñado por y para la ciudadanía.
          </motion.p>

          {/* KPI Chips */}
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.4 }}
             className="flex flex-wrap justify-center gap-3 max-w-3xl mb-16"
          >
             <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-[#4C9F70]/20 text-[#7de3a8] border border-[#4C9F70]/40 uppercase cursor-default shadow-sm">Piloto: Tepic — Constancia de Residencia</span>
             <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-[#0FA3B1]/20 text-[#7ee8f2] border border-[#0FA3B1]/40 uppercase cursor-default shadow-sm">CURP (demo · sin verificación RENAPO)</span>
             <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-[#F5A623]/20 text-[#ffc96a] border border-[#F5A623]/40 uppercase cursor-default shadow-sm">Stack de demo</span>
             <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-[#D81E5B]/20 text-[#ff8ab8] border border-[#D81E5B]/40 uppercase cursor-default shadow-sm">Trámite digital (demo)</span>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
             className="flex flex-wrap justify-center gap-6"
          >
             <button onClick={() => onNavigate('citizen')} className="bg-[#D81E5B] hover:bg-[#D81E5B]/90 text-white px-8 py-4 rounded-md text-sm font-bold tracking-widest uppercase transition-all shadow-[0_8px_32px_rgba(216,30,91,0.35)] hover:shadow-[0_12px_40px_rgba(216,30,91,0.5)] hover:-translate-y-1 flex items-center gap-3">
               <Smartphone className="w-5 h-5" /> Ingresar al Portal
             </button>
             <button onClick={() => onNavigate('c5')} className="bg-[#F8F6F1]/10 hover:bg-[#F8F6F1]/20 text-[#F8F6F1] border border-[#F8F6F1]/30 px-8 py-4 rounded-md text-sm font-bold tracking-widest uppercase transition-all hover:shadow-[0_12px_40px_rgba(248,246,241,0.15)] hover:-translate-y-1 flex items-center gap-3">
               <Monitor className="w-5 h-5" /> C5 SOATM (Gestión)
             </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-[#a0aec0] text-xs tracking-[0.2em] uppercase mt-20"
          >
            Julio 2026 · Sistema Operativo de Atención de Trámites Mexicanos (SOATM) · v3.0
          </motion.p>
        </main>
      </div>

      <WixarikaBanda />

      {/* CONTENT SECTION (Light Theme) */}
      <div className="bg-[#F8F6F1] text-[#1a2438] py-24 px-6 md:px-12 relative">
        
        {/* 01: El Mandato Social & Reloj de Simplificación */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <div>
            <p className="text-[#D81E5B] text-xs font-bold tracking-[0.2em] uppercase mb-4">01 · Marco de Derechos Ciudadanos (SOATM)</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black leading-[1.1] mb-6 text-[#1a2438]">La nueva forma de gobernar a través del territorio.</h2>
            <p className="text-[#4a5568] text-lg leading-relaxed mb-4">
               El SOATM no es un invento: es el nombre técnico de lo que la ley ya ordena. La LNETB (Arts. 2 y 3) exige Portal Ciudadano Único, Llave MX, Expediente Digital y Repositorio Nacional; la Ley de Gobierno Digital de Nayarit (Arts. 2, 5 y 6) obliga a los Ayuntamientos a operar con interoperabilidad, expediente digital y simplificación administrativa.
            </p>
            <p className="text-[#4a5568] text-lg leading-relaxed mb-8">
               Nosotros lo descubrimos y lo convertimos en software abierto: un Sistema Operativo de Atención de Trámites Mexicanos que transiciona a ventanillas únicas eficientes, seguras y libres de papel, bajo una óptica de territorio y bienestar — y que le pertenece al municipio, no a un proveedor ni a una administración.
            </p>

            <div className="space-y-6">
              <div className="flex gap-5 p-6 bg-white border border-[#d4ccc2] rounded-xl border-l-4 border-l-[#D81E5B] shadow-sm">
                <Scale className="w-8 h-8 text-[#D81E5B] shrink-0" />
                <div>
                  <h3 className="font-bold text-[17px] mb-2 text-[#1a2438]">Gobernanza y Transparencia</h3>
                  <p className="text-sm text-[#4a5568] leading-relaxed">Cada trámite completado genera un acuse digital firmado y auditable, reduciendo tiempos de espera y discrecionalidad.</p>
                </div>
              </div>
              <div className="flex gap-5 p-6 bg-white border border-[#d4ccc2] rounded-xl border-l-4 border-l-[#0FA3B1] shadow-sm">
                <Lock className="w-8 h-8 text-[#0FA3B1] shrink-0" />
                <div>
                  <h3 className="font-bold text-[17px] mb-2 text-[#1a2438]">Identidad Digital (propuesta)</h3>
                  <p className="text-sm text-[#4a5568] leading-relaxed">Preparado para federación con LlaveMx como propuesta; hoy la protección de datos personales no está implementada.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Clock Panel */}
          <div className="bg-[#14213D] text-white rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col justify-center">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D81E5B] via-[#F5A623] to-[#0FA3B1]"></div>
             
             <div className="flex items-center gap-3 mb-6">
               <Clock className="w-7 h-7 text-[#F5A623]" />
               <h3 className="text-2xl font-serif font-normal tracking-wide">La digitalización ya está en marcha</h3>
             </div>

             <p className="text-[#a0aec0] mb-8 text-[15px] leading-relaxed">
               La LNETB impulsa una transición ágil de servicios municipales hacia plataformas autogestionables para optimizar recursos e incrementar el bienestar.
             </p>

             <div className="space-y-8">
               <div>
                 <h3 className="text-[#FF7AA8] text-[11px] font-bold uppercase tracking-widest mb-3">Riesgo de Rezago — Continuar con la inercia</h3>
                 <ul className="space-y-2 text-[14px] text-[#e8e0d4]">
                   <li className="flex gap-3"><span className="text-[#D81E5B] font-bold">✖</span> <span>Largas filas, burocracia lenta y uso ineficiente de recursos públicos.</span></li>
                   <li className="flex gap-3"><span className="text-[#D81E5B] font-bold">✖</span> <span>Falta de trazabilidad e incertidumbre para el ciudadano sobre su trámite.</span></li>
                 </ul>
               </div>
               <div>
                 <h3 className="text-[#4C9F70] text-[11px] font-bold uppercase tracking-widest mb-3">Impacto Social — Transformación de Servicio</h3>
                 <ul className="space-y-2 text-[14px] text-[#e8e0d4]">
                   <li className="flex gap-3"><span className="text-[#4C9F70] font-bold">✅</span> <span>Transparencia total y certeza jurídica inmediata para cada hogar.</span></li>
                   <li className="flex gap-3"><span className="text-[#4C9F70] font-bold">✅</span> <span>Expediente único digital que elimina el requisito de entregar papeles duplicados.</span></li>
                 </ul>
               </div>
             </div>

             <button onClick={() => onNavigate('executive')} className="mt-10 w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-[#14213D] py-4 rounded-md font-bold uppercase tracking-widest text-[11px] transition-colors shadow-lg">
               Revisar Propuesta de Servicio Público
             </button>
          </div>
        </div>

        {/* 03: 5 Capas */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
             <p className="text-[#0A6B75] text-xs font-bold tracking-[0.2em] uppercase mb-4">03 · Arquitectura del SOATM</p>
             <h2 className="text-4xl md:text-5xl font-serif font-black leading-tight text-[#1a2438]">5 capas de integración para una nueva gobernanza.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
             <div className="bg-white border border-[#d4ccc2] p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 left-0 right-0 h-1 bg-[#D81E5B]"></div>
               <div className="w-12 h-12 bg-[#D81E5B]/10 text-[#D81E5B] rounded-lg flex items-center justify-center font-serif font-bold text-xl mb-5">1</div>
               <h3 className="font-bold text-[#1a2438] mb-2 text-lg">Landing Page</h3>
               <p className="text-[13px] text-[#4a5568] leading-relaxed mb-6">La cara pública del ecosistema. Identidad visual y posicionamiento social.</p>
               <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="text-[#D81E5B] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Inicio <ChevronRight className="w-3 h-3"/></button>
             </div>
             
             <div className="bg-white border border-[#d4ccc2] p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 left-0 right-0 h-1 bg-[#0FA3B1]"></div>
               <div className="w-12 h-12 bg-[#0FA3B1]/10 text-[#0B7C87] rounded-lg flex items-center justify-center font-serif font-bold text-xl mb-5">2</div>
               <h3 className="font-bold text-[#1a2438] mb-2 text-lg">C5 de Gestión</h3>
               <p className="text-[13px] text-[#4a5568] leading-relaxed mb-6">Centro de mando de gestión. 14 módulos de atención, tesorería y auditoría.</p>
               <button onClick={() => onNavigate('c5')} className="text-[#0B7C87] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Ver Gestión <ChevronRight className="w-3 h-3"/></button>
             </div>
             
             <div className="bg-white border border-[#d4ccc2] p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 left-0 right-0 h-1 bg-[#4C9F70]"></div>
               <div className="w-12 h-12 bg-[#4C9F70]/10 text-[#3B7A56] rounded-lg flex items-center justify-center font-serif font-bold text-xl mb-5">3</div>
               <h3 className="font-bold text-[#1a2438] mb-2 text-lg">CitizenApp</h3>
               <p className="text-[13px] text-[#4a5568] leading-relaxed mb-6">El gobierno en el bolsillo. Trámites, ventanilla única y expediente digital (demo).</p>
               <button onClick={() => onNavigate('citizen')} className="text-[#3B7A56] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Abrir App <ChevronRight className="w-3 h-3"/></button>
             </div>
             
             <div className="bg-white border border-[#d4ccc2] p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5A623]"></div>
               <div className="w-12 h-12 bg-[#F5A623]/10 text-[#8F5E06] rounded-lg flex items-center justify-center font-serif font-bold text-xl mb-5">4</div>
               <h3 className="font-bold text-[#1a2438] mb-2 text-lg">Asistencia Aura</h3>
               <p className="text-[13px] text-[#4a5568] leading-relaxed mb-6">Asistencia ciudadana en lenguaje amigable para acompañar trámites y resolver dudas.</p>
               <button onClick={() => onNavigate('citizen', 'home', 'chat')} className="text-[#8F5E06] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Ver Aura <ChevronRight className="w-3 h-3"/></button>
             </div>
             
             <div className="bg-white border border-[#d4ccc2] p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 left-0 right-0 h-1 bg-[#E85D04]"></div>
               <div className="w-12 h-12 bg-[#E85D04]/10 text-[#B54903] rounded-lg flex items-center justify-center font-serif font-bold text-xl mb-5">5</div>
               <h3 className="font-bold text-[#1a2438] mb-2 text-lg">Carpeta Pública</h3>
               <p className="text-[13px] text-[#4a5568] leading-relaxed mb-6">Estrategia técnica y marco normativo institucional para la simplificación administrativa.</p>
               <button onClick={() => onNavigate('executive')} className="text-[#B54903] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Carpeta <ChevronRight className="w-3 h-3"/></button>
             </div>
          </div>
        </div>

        {/* 04: Pueblos Originarios */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
             <p className="text-[#35704E] text-xs font-bold tracking-[0.2em] uppercase mb-4">04 · Pueblos Originarios Primero</p>
             <h2 className="text-4xl md:text-5xl font-serif font-black leading-tight text-[#1a2438]">Las ciudades indígenas<br/>dejan de ser las últimas de la fila.</h2>
             <p className="text-[#4a5568] text-lg leading-relaxed max-w-3xl mx-auto mt-6">
                La transformación digital que solo llega a las cabeceras urbanas no es transformación: es privilegio.
                El piloto arranca en Tepic — y la ruta continúa hacia la sierra y los 20 municipios de Nayarit,
                para que el gobierno llegue al teléfono sin que nadie tenga que bajar a hacer fila.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#14213D] text-white p-8 rounded-xl relative overflow-hidden shadow-lg">
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D81E5B] via-[#F5A623] to-[#0FA3B1]"></div>
               <Users className="w-8 h-8 text-[#F5A623] mb-5" />
               <h3 className="font-bold text-lg mb-3">Del Nayar en la hoja de ruta</h3>
               <p className="text-[14px] text-[#a0aec0] leading-relaxed mb-5">
                  El municipio más remoto del estado — corazón náayeri y wixárika — proyecta pasar
                  del lugar <span className="text-white font-bold">#2,344</span> al
                  <span className="text-[#F5A623] font-bold"> #198</span> nacional en gobierno digital
                  al sumarse a la plataforma. Ese dato es el argumento para toda la sierra:
                  La Yesca y Huajicori siguen la misma ruta.
               </p>
               <p className="text-[10px] uppercase tracking-widest font-bold text-[#4C9F70]">Meta 20/20 · Nadie se queda fuera</p>
             </div>

             <div className="bg-white border border-[#d4ccc2] p-8 rounded-xl relative overflow-hidden shadow-sm">
               <div className="absolute top-0 left-0 right-0 h-1 bg-[#4C9F70]"></div>
               <Globe className="w-8 h-8 text-[#4C9F70] mb-5" />
               <h3 className="font-bold text-lg mb-3 text-[#1a2438]">En su lengua, no solo en español</h3>
               <p className="text-[14px] text-[#4a5568] leading-relaxed mb-5">
                  La plataforma opera en español, náayeri (cora) y wixárika. Un trámite que no se
                  entiende es una fila disfrazada: aquí el ciudadano de la sierra lee su gobierno
                  en su propia lengua.
               </p>
               <p className="text-[10px] uppercase tracking-widest font-bold text-[#35704E]">3 lenguas · Selector integrado en el C5</p>
             </div>

             <div className="bg-white border border-[#d4ccc2] p-8 rounded-xl relative overflow-hidden shadow-sm">
               <div className="absolute top-0 left-0 right-0 h-1 bg-[#E85D04]"></div>
               <Smartphone className="w-8 h-8 text-[#E85D04] mb-5" />
               <h3 className="font-bold text-lg mb-3 text-[#1a2438]">Infraestructura con fondo propio</h3>
               <p className="text-[14px] text-[#4a5568] leading-relaxed mb-5">
                  El FAISPIAM — el fondo federal de infraestructura para pueblos indígenas y
                  afromexicanos — está integrado en la tesorería del sistema: cada peso destinado
                  a la sierra queda trazado y auditable.
               </p>
               <p className="text-[10px] uppercase tracking-widest font-bold text-[#B54903]">Trazabilidad ASF · Bienestar social</p>
             </div>
          </div>
        </div>

        {/* 07: Modelo Financiero & Ranking */}
        <div className="max-w-6xl mx-auto bg-white border border-[#d4ccc2] rounded-2xl p-8 md:p-14 shadow-sm">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <div className="inline-block border border-[#F5A623]/50 text-[#7A5210] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 bg-[#F5A623]/10">Índice de Gobierno Abierto</div>
                 <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight mb-6 text-[#1a2438]">Tepic: líder en simplificación.</h2>
                 <p className="text-[#4a5568] text-[16px] leading-relaxed mb-8">
                    Con la implementación progresiva de ConnectX en Tepic, el municipio lidera la transición nacional hacia el expediente único sin costo tecnológico excesivo — como tecnología pública replicable en los 2,470 municipios del país.
                 </p>
                 <div className="flex gap-12">
                    <div>
                       <h3 className="text-4xl font-black text-[#8F5E06] font-sans">#1</h3>
                       <p className="text-[10px] uppercase tracking-widest text-[#4a5568] mt-2 font-bold">Lugar Regional</p>
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-[#4C9F70] font-sans">3/3</h3>
                       <p className="text-[10px] uppercase tracking-widest text-[#4a5568] mt-2 font-bold">Municipios Piloto</p>
                    </div>
                 </div>
              </div>

              <div className="bg-[#F8F6F1] p-8 rounded-xl border border-[#d4ccc2]">
                 <h3 className="font-bold text-xl mb-6 text-[#1a2438] flex items-center gap-3">
                   <Activity className="w-5 h-5 text-[#D81E5B]" />
                   Sustentabilidad y Ahorros
                 </h3>
                 <p className="text-sm text-[#4a5568] mb-6">La digitalización elimina el gasto operativo en archivo físico, fotocopias y almacenamiento redundante, canalizando recursos al bienestar social.</p>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#d4ccc2] pb-3">
                       <span className="text-[#4a5568] text-sm">Gasto en Papel y Archivo</span>
                       <span className="font-bold text-[#D81E5B] font-mono">-85% de ahorro</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#d4ccc2] pb-3">
                       <span className="text-[#4a5568] text-sm">Tiempo promedio de Trámite</span>
                       <span className="font-bold text-[#35704E] font-mono">De 14 días a 10 mins</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#d4ccc2] pb-3">
                       <span className="text-[#4a5568] text-sm">Validaciones Automáticas</span>
                       <span className="font-bold text-[#35704E] font-mono">100% Digital</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-[#1a2438] font-black uppercase text-xs tracking-widest">Ahorro Social Estimado</span>
                       <span className="font-black text-[#D81E5B] font-mono">Millones en productividad</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <WixarikaBanda />
    </div>
  );
};
