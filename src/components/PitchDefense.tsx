import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Target, 
  Lock, 
  Coins, 
  Cpu,
  Swords
} from 'lucide-react';
import { cn } from '../lib/utils';

export function PitchDefense() {
  const [activeId, setActiveId] = useState<number | null>(0);

  const objections = [
    {
      id: 0,
      category: "Presupuesto",
      icon: Coins,
      question: "¿Cómo se financia este proyecto de digitalización si el presupuesto municipal es limitado?",
      context: "Inquietud del Tesorero o Responsable de Presupuestos.",
      answer: "No requiere licencias de software privativas ni dependencias de grandes consorcios de TI externos. Se basa en soberanía tecnológica y el marco de ConnectX. La inversión se amortiza de inmediato a través del ahorro masivo en consumibles de oficina (papel, toner, archivo físico) y la optimización de tiempos en los procesos de atención municipal de Tepic.",
      keywords: ["Soberanía Tecnológica", "Ahorro Operativo", "Amortización Rápida"]
    },
    {
      id: 1,
      category: "Seguridad y Privacidad",
      icon: Lock,
      question: "¿Cómo garantizamos que los datos personales de la ciudadanía estén totalmente seguros?",
      context: "Preocupación del Síndico o Responsable Jurídico.",
      answer: "La plataforma cuenta con un diseño de Privacidad desde el Origen (Privacy-by-Design). Los datos sensibles no se almacenan en texto plano. Toda la transferencia de información cuenta con cifrado de extremo a extremo (E2EE) y cumple estrictamente con la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados.",
      keywords: ["Privacy-by-Design", "Cifrado E2EE", "Cumplimiento de Ley"]
    },
    {
      id: 2,
      category: "TI e Infraestructura",
      icon: Cpu,
      question: "¿Por qué optar por la plataforma ConnectX y no por desarrollos de grandes proveedores como Oracle o SAP?",
      context: "Objeción del Director de Informática o TI.",
      answer: "Las soluciones corporativas conllevan costos recurrentes de licenciamiento asfixiantes y tiempos de despliegue sumamente lentos. ConnectX es una solución ligera, modular, y construida sobre estándares abiertos que permite autonomía completa para el municipio, capacitando al propio personal del ayuntamiento bajo principios de autogestión local.",
      keywords: ["Estándares Abiertos", "Autonomía de TI", "Sin Costos de Licencia"]
    },
    {
      id: 3,
      category: "Adopción Laboral",
      icon: Target,
      question: "¿Qué ocurre si el personal o los usuarios de mayor edad presentan resistencia a la adopción digital?",
      context: "Inquietud de Recursos Humanos y del Enlace Sindical.",
      answer: "El plan contempla la Academia Digital ConnectX con tres niveles de certificación (Bronce, Plata y Oro) diseñados específicamente para capacitar paso a paso. No se busca reemplazar al trabajador, sino elevar su rol para liberarlo de tareas mecánicas repetitivas. Para ciudadanos que lo requieran, el personal actúa como facilitador amigable utilizando Aura.",
      keywords: ["Academia Digital", "Empoderamiento Sindical", "Inclusión Ciudadana"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/30">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Mesa de Análisis Técnico</h2>
              <p className="text-sm text-slate-400">Preguntas de Validación Institucional y Viabilidad</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Objection List */}
            <div className="md:col-span-5 space-y-2">
              {objections.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setActiveId(obj.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-3",
                    activeId === obj.id 
                      ? "bg-slate-800/80 border-rose-500/50 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]" 
                      : "bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    activeId === obj.id ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
                  )}>
                    <obj.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{obj.category}</p>
                    <p className={cn(
                      "text-xs font-bold truncate",
                      activeId === obj.id ? "text-white" : "text-slate-300"
                    )}>
                      {obj.question}
                    </p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 shrink-0 transition-transform", activeId === obj.id ? "text-rose-500 rotate-90" : "text-slate-600")} />
                </button>
              ))}
            </div>

            {/* Answer Panel */}
            <div className="md:col-span-7">
              <AnimatePresence mode="wait">
                {objections.map((obj) => obj.id === activeId && (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-6 h-full flex flex-col"
                  >
                    <div className="flex items-start gap-3 mb-6">
                      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">La Pregunta / Objeción</p>
                        <h3 className="text-lg font-bold text-white leading-tight">"{obj.question}"</h3>
                        <p className="text-xs text-slate-500 mt-2 font-mono">{obj.context}</p>
                      </div>
                    </div>

                    <div className="flex-1 bg-slate-900 rounded-xl p-5 border border-slate-800/50 mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Respuesta Técnica</p>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {obj.answer}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2">
                       {obj.keywords.map((kw, i) => (
                         <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-700">
                           {kw}
                         </span>
                       ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
