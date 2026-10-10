import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Users, 
  Map as MapIcon, 
  Database, 
  Zap,
  Target,
  BarChart3,
  ChevronRight,
  ClipboardCheck,
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function BrigadaStrategy() {
  const [activeRole, setActiveRole] = useState<'manager' | 'dev' | 'consultant'>('manager');

  const strategies = {
    manager: {
      title: "Coordinación de Participación Social",
      focus: "Vinculación Comunitaria & Atención Ciudadana",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      icon: Target,
      points: [
        {
          title: "Validación y Cercanía Social",
          desc: "Enviar gestores de servicio público capacitados para censar las necesidades de trámites prioritarios colonia por colonia, asegurando que nadie se quede atrás.",
          metric: "+22% de cobertura de trámites"
        },
        {
          title: "Capacitación en Territorio",
          desc: "Talleres interactivos (Academia Digital Nivel Bronce) impartidos por personal sindicalizado para familiarizar a la población con el portal autogestionable.",
          metric: "Soporte comunitario activo"
        },
        {
          title: "Monitoreo del Clima de Servicio",
          desc: "Cada reporte de ventanilla alimenta un sistema ágil para corregir cuellos de botella operativos en un plazo menor a 24 horas.",
          metric: "Atención ágil en ventanilla"
        }
      ]
    },
    dev: {
      title: "Líder de Desarrollo y Arquitectura",
      focus: "Infraestructura Offline-First y Expediente Seguro",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      icon: Cpu,
      points: [
        {
          title: "PWA Offline-First (Sincronización Local)",
          desc: "Uso de IndexedDB y Service Workers para que se puedan registrar solicitudes incluso en zonas rurales con conectividad limitada, sincronizando al detectar red.",
          metric: "0% pérdida de solicitudes"
        },
        {
          title: "Validación Digital Ágil",
          desc: "Optimización del cargado de documentos mediante procesamiento local y automatización del llenado de formularios, eliminando la duplicidad de copias.",
          metric: "Trámites en < 5 minutos"
        },
        {
          title: "Seguridad de Datos de Nivel Bancario",
          desc: "Cifrado de extremo a extremo (E2EE). Los datos personales sensibles están protegidos bajo estricto cumplimiento de la ley mexicana de protección de datos.",
          metric: "Cumplimiento legal garantizado"
        }
      ]
    },
    consultant: {
      title: "Gestión de Procesos y Simplificación",
      focus: "Soberanía Tecnológica y Sustentabilidad",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      icon: TrendingUp,
      points: [
        {
          title: "Estrategia del 20% (Pareto Social)",
          desc: "Identificación y simplificación inmediata de los 5 trámites que concentran el 80% de las colas de ventanilla física, descongestionando las oficinas públicas.",
          metric: "Impacto inmediato de bienestar"
        },
        {
          title: "Soberanía y Ahorro Colectivo",
          desc: "Reducción drástica del gasto operativo en papel, fotocopias y consumibles, canalizando los ahorros directamente hacia programas de bienestar comunitario.",
          metric: "Eficiencia presupuestaria social"
        },
        {
          title: "Resolución y Trazabilidad",
          desc: "El ciudadano recibe notificaciones en tiempo real del estatus de su trámite, eliminando la incertidumbre y previniendo la discrecionalidad administrativa.",
          metric: "Transparencia y certidumbre"
        }
      ]
    }
  };

  const role = strategies[activeRole];

  return (
    <div className="pt-2 pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-2">
          <Zap className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">
           Estrategia de <em className="text-rose-500 italic">Transformación Digital</em>
        </h2>
        <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
           Hoja de ruta técnica e institucional para la implementación del portal municipal unificado y la digitalización de trámites.
        </p>
      </div>

      {/* Role Selector */}
      <div className="flex justify-center p-1 bg-slate-100 rounded-2xl w-fit mx-auto">
        {(Object.keys(strategies) as Array<keyof typeof strategies>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveRole(key)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeRole === key 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {key === 'manager' ? 'Atención Social' : key === 'dev' ? 'Tecnología' : 'Simplificación'}
          </button>
        ))}
      </div>

      {/* Role Detailed Strategy */}
      <motion.div 
        key={activeRole}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className={cn("absolute top-0 right-0 w-64 h-64 blur-3xl opacity-20 -mr-20 -mt-20", role.bgColor)}></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
           <div className={cn("p-6 rounded-3xl shrink-0", role.bgColor)}>
              <role.icon className={cn("w-10 h-10", role.color)} />
           </div>
           
           <div className="space-y-8 flex-1">
              <div>
                 <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em] mb-2", role.color)}>{role.focus}</p>
                 <h3 className="text-4xl font-serif font-black text-slate-900 leading-none">{role.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {role.points.map((pt, i) => (
                   <div key={i} className="group cursor-default">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                         <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{pt.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{pt.desc}</p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                         <BarChart3 className="w-3 h-3" />
                         {pt.metric}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </motion.div>

      {/* Unified Roadmap Table */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rose-300">Hoja de Ruta de Simplificación</h4>
                  <p className="text-lg font-serif">Plan Piloto: Tepic (ruta estatal a los 20 municipios)</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { phase: "Fase 1", title: "Censo & Nayarit ID", date: "Jul-Sep", icon: Smartphone },
                { phase: "Fase 2", title: "Mapeo Regulatorio", date: "Oct-Nov", icon: Database },
                { phase: "Fase 3", title: "Ventanilla Abierta", date: "Dic-Ene", icon: Globe },
                { phase: "Fase 4", title: "Soberanía Digital", date: "Feb-Mar", icon: ShieldCheck }
              ].map((step, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center text-center group hover:bg-white/10 transition-colors">
                   <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <step.icon className="w-4 h-4 text-white" />
                   </div>
                   <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">{step.phase}</p>
                   <p className="text-[10px] font-black text-white uppercase mb-1">{step.title}</p>
                   <p className="text-[9px] font-mono text-rose-400">{step.date}</p>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
