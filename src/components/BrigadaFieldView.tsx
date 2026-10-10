import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  UserPlus, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Scan, 
  WifiOff, 
  RefreshCw,
  ChevronRight,
  ClipboardList,
  Coins,
  Target,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function BrigadaFieldView() {
  const [step, setStep] = useState<'welcome' | 'map' | 'survey' | 'success' | 'legal'>('welcome');
  const [activePriority, setActivePriority] = useState<'recaudacion' | 'servicios' | 'voto'>('recaudacion');
  const [isOnline, setIsOnline] = useState(true);
  const [scanning, setScanning] = useState(false);

  const priorities = {
    recaudacion: { label: 'Deuda Predial', color: 'text-amber-400', icon: Coins },
    servicios: { label: 'Reportes Fallas', color: 'text-cyan-400', icon: AlertCircle },
    voto: { label: 'Potencial Voto', color: 'text-magenta-400', icon: Target }
  };
  
  // Simulation of offline detection
  useEffect(() => {
    const timer = setInterval(() => {
      setIsOnline(prev => !prev);
    }, 15000); // Toggle every 15s for demo
    return () => clearInterval(timer);
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setStep('survey');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto h-[700px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col font-sans">
      {/* Top Bar / Status */}
      <div className="p-6 flex justify-between items-center bg-slate-900/50">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-magenta-500 overflow-hidden flex items-center justify-center text-white text-[10px] font-black">
               JD
            </div>
            <div>
               <p className="text-[10px] text-white font-black leading-none Uppercase">Juan Delgado</p>
               <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Distrito 01 · Tepic</p>
            </div>
         </div>
         <div className={cn(
           "px-2 py-1 rounded-full flex items-center gap-1.5 transition-colors",
           isOnline ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
         )}>
           {isOnline ? <CheckCircle2 className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
           <span className="text-[9px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative">
         <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-magenta-500 uppercase tracking-widest">Turno Activo</p>
                    <h2 className="text-3xl font-black text-white leading-tight uppercase">Bienvenido al Campo</h2>
                    <p className="text-slate-500 text-xs">Tienes **12 casas** asignadas para hoy en la Col. Linda Vista.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Filtro de Ruta Inteligente</span>
                    </div>
                    <div className="flex gap-2">
                       {(Object.keys(priorities) as Array<keyof typeof priorities>).map((key) => {
                         const P = priorities[key];
                         return (
                           <button 
                             key={key}
                             onClick={() => setActivePriority(key)}
                             className={cn(
                               "flex-1 py-2 rounded-xl border transition-all flex flex-col items-center gap-1",
                               activePriority === key 
                                 ? "bg-slate-800 border-slate-600 shadow-lg" 
                                 : "bg-slate-900/50 border-slate-800 opacity-50"
                             )}
                           >
                             <P.icon className={cn("w-3 h-3", P.color)} />
                             <span className="text-[7px] font-black uppercase tracking-tighter text-white">{P.label}</span>
                           </button>
                         );
                       })}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Dominio en Colonia</span>
                          <span className="text-[10px] font-black text-white">42% (Linda Vista)</span>
                       </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full w-1/4 bg-magenta-500 rounded-full" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                       "Juan, estás a 4 registros del Top 10 del distrito. ¡Sigue así!"
                    </p>
                 </div>
                 </div>

                 <button 
                   onClick={() => setStep('map')}
                   className="w-full bg-magenta-600 hover:bg-magenta-500 text-white rounded-2xl py-4 flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                 >
                   <MapPin className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ver Siguiente Punto</span>
                 </button>
              </motion.div>
            )}

            {step === 'map' && (
              <motion.div 
                key="map"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                 <div className="h-48 bg-slate-900 rounded-3xl border border-slate-800 relative overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-full object-cover opacity-50 contrast-125 saturate-0" 
                      alt="Map Placeholder"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-8 h-8 bg-magenta-500 rounded-full animate-ping absolute" />
                       <div className="w-4 h-4 bg-white rounded-full border-2 border-magenta-500 relative z-10" />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase italic">Calle Morelos 421</h3>
                    <p className="text-xs text-slate-500 font-bold tracking-tight">Col. Centro · Puerta Blanca · 2do Piso</p>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl py-8 flex flex-col items-center gap-2 hover:bg-slate-800 transition-colors"
                      onClick={() => setStep('welcome')}
                    >
                       <XCircle className="w-6 h-6" />
                       <span className="text-[8px] font-black uppercase tracking-widest">No Abrieron</span>
                    </button>
                    <button 
                      className="bg-magenta-500 text-white rounded-2xl py-8 flex flex-col items-center gap-2 animate-pulse"
                      onClick={handleScan}
                    >
                       <Scan className="w-6 h-6" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Digitalizar INE</span>
                    </button>
                 </div>

                 {scanning && (
                   <div className="fixed inset-0 bg-black/90 z-50 flex flex-center items-center justify-center">
                     <div className="w-64 h-40 border-2 border-magenta-500 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-magenta-500 animate-[scan_2s_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-[10px] font-bold uppercase italic">
                           Alinee Credencial MRZ
                        </div>
                     </div>
                   </div>
                 )}
              </motion.div>
            )}

            {step === 'survey' && (
              <motion.div 
                key="survey"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Ciudadano Identificado: Ricardo P.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <p className="text-[10px] text-slate-500 uppercase font-bold">Pregunta 1 de 3</p>
                       <h4 className="text-lg font-black text-white leading-tight uppercase">¿Cuál es el servicio público más urgente en su calle?</h4>
                    </div>

                    <div className="space-y-2">
                       {['Alumbrado', 'Seguridad', 'Recolección de Basura', 'Pavimentación'].map((opt, i) => (
                         <button 
                           key={i} 
                           onClick={() => i === 0 ? setStep('legal') : null}
                           className="w-full bg-slate-900 border border-slate-800 text-slate-300 p-4 rounded-xl text-left text-xs font-bold hover:bg-magenta-500 hover:text-white hover:border-magenta-500 transition-all flex justify-between items-center"
                         >
                           {opt}
                           <ChevronRight className="w-4 h-4 opacity-30" />
                         </button>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}

            {step === 'legal' && (
               <motion.div
                 key="legal"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-magenta-500 uppercase tracking-widest">Firma Electrónica Simple</p>
                    <h2 className="text-2xl font-black text-white leading-tight uppercase">Validación Legal</h2>
                    <p className="text-slate-400 text-[10px]">Alta en la plataforma Nayarit ID de acuerdo a la Ley de Gobierno Digital.</p>
                 </div>

                 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <p className="text-[9px] text-slate-300 leading-relaxed font-mono">
                      "Autorizo al H. Ayuntamiento de Tepic a procesar mis datos para la Ventanilla Única de Gobierno Digital, conforme a la Ley de Gobierno Digital del Estado de Nayarit y leyes aplicables de protección de datos."
                    </p>
                    
                    <div className="h-32 bg-slate-950 border border-slate-800 rounded-xl relative flex items-center justify-center">
                       <p className="text-slate-600 text-[10px] uppercase font-bold absolute pointer-events-none">Firme aquí (Touch)</p>
                       {/* Simulated signature area */}
                       <svg width="100%" height="100%" className="absolute inset-0">
                         <motion.path 
                           d="M 50 60 Q 80 20 120 50 T 200 60" 
                           stroke="var(--magenta)" 
                           strokeWidth="3" 
                           fill="none" 
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition={{ duration: 1.5, delay: 0.5 }}
                         />
                       </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[8px] text-slate-500 font-mono">
                       <p>TIMESTAMP: {new Date().toISOString().split('T')[1].slice(0,8)}</p>
                       <p>GEO: 21.504,-104.894</p>
                       <p>HASH: a7x...9f2</p>
                       <p>DEVICE: iPad Pro</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => setStep('success')}
                   className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-4 flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                 >
                   <CheckCircle2 className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sellar Mensaje de Datos</span>
                 </button>
               </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-12"
              >
                 <div className="w-24 h-24 bg-magenta-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-magenta-500/50">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase italic">Folio Generado</h3>
                    <p className="text-slate-500 text-xs px-6">Expediente sellado. TPC-2026-00001-SHA256 con validez jurídica.</p>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-2xl text-[10px] font-bold text-emerald-400 font-mono">
                    VALIDACIÓN C5 CONFIRMADA
                 </div>
                 <button 
                   onClick={() => setStep('welcome')}
                   className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest"
                 >
                   Regresar al Dashboard
                 </button>
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}} />
    </div>
  );
}
