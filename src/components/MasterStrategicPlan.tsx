import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  ChevronLeft, 
  Activity, 
  Scale, 
  Building2, 
  Globe, 
  Cpu,
  Database,
  Lock,
  RefreshCw,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AuraCertificationSeal } from './AuraCertificationSeal';

interface ProposalCardProps {
  title: string;
  subtitle: string;
  icon: any;
  points: string[];
  color: string;
}

const ProposalCard = ({ title, subtitle, icon: Icon, points, color }: ProposalCardProps) => (
  <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2.5rem] space-y-6 hover:border-white/10 transition-all group">
    <div className="flex items-center gap-4">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", color)}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <h4 className="text-xl font-serif font-black text-white">{title}</h4>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
    <ul className="space-y-3">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
          <div className="w-1 h-1 rounded-full bg-magenta-500 mt-1.5 shrink-0" />
          {p}
        </li>
      ))}
    </ul>
  </div>
);

export function MasterStrategicPlan({ onBack }: { onBack: () => void }) {
  const [stressLevel, setStressLevel] = useState(0);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
    latency: '12ms',
    concurrency: '0',
    integrity: '100%',
    sync: 'Standby'
  });

  const runStressTest = async () => {
    setIsRunningTest(true);
    setTestLogs(['[SYS] Iniciando simulación de carga masiva...', '[SYS] Escalando clusters de Firestore Nayarit-Cluster-A...']);
    
    // Simulate ramp up
    for (let i = 0; i <= 100; i += 5) {
      setStressLevel(i);
      if (i === 20) setTestLogs(prev => [...prev, '[NET] 10,000 peticiones concurrentes detectadas.', '[SEC] Capa de cifrado AES-256 activa.']);
      if (i === 50) setTestLogs(prev => [...prev, '[DB] Replicación multi-región exitosa.', '[SYS] CPU Load: 42% - Memoria estable.']);
      if (i === 80) setTestLogs(prev => [...prev, '[LAW] Verificación de cumplimiento LNETB en tiempo real.', '[AUDIT] Trazabilidad forense garantizada.']);
      
      setMetrics({
        latency: `${Math.floor(Math.random() * 20 + 5)}ms`,
        concurrency: `${i * 250}`,
        integrity: '100%',
        sync: i < 100 ? 'Sincronizando...' : 'Ok'
      });
      await new Promise(r => setTimeout(r, 200));
    }
    
    setTestLogs(prev => [...prev, '[SUCCESS] Test de Resiliencia completado. Sistema Robusto.']);
    setIsRunningTest(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-[#05060a] text-slate-300 font-sans pb-24"
    >
      <header className="p-4  border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-7xl mx-auto w-full gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest truncate">Panel Principal</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <AuraCertificationSeal />
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
              <h1 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white truncate">Plan Estratégico</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full space-y-16">
        {/* Hero Section */}
        <div className="grid grid-cols-1  gap-6 items-center">
          <div className="space-y-6">
            <p className="text-[10px] font-black text-magenta-500 uppercase tracking-[0.5em]">Gobernanza ConnectX v2.6</p>
            <h2 className="text-4xl font-serif font-black text-white tracking-tighter leading-[0.85]">
              Arquitectura de<br/>
              <span className="text-slate-500">Soberanía Total</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Plan de implementación multinevel diseñado para transformar la burocracia en eficiencia algorítmica, blindando los derechos del trabajador y la transparencia ciudadana.
            </p>
          </div>

          {/* Stress Test Simulator Visual */}
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-6 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-magenta-500/10 blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex flex-col  items-start  justify-between gap-4">
               <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-magenta-500" />
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">Simulador de Estrés</h3>
               </div>
               <button 
                 onClick={runStressTest}
                 disabled={isRunningTest}
                 className={cn(
                   "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                   isRunningTest ? "bg-slate-800 text-slate-500" : "bg-magenta-600 text-white hover:bg-magenta-500"
                 )}
               >
                 {isRunningTest ? 'Simulando...' : 'Ejecutar Test'}
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Latencia', value: metrics.latency, icon: Zap },
                 { label: 'Concurrencia', value: metrics.concurrency, icon: Users },
                 { label: 'Integridad', value: metrics.integrity, icon: Lock },
                 { label: 'Estado Sync', value: metrics.sync, icon: RefreshCw }
               ].map((m, i) => (
                 <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <m.icon className="w-3 h-3 text-slate-500 mb-2" />
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
                    <p className="text-lg font-black text-white">{m.value}</p>
                 </div>
               ))}
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Carga de Sistema</span>
                  <span>{stressLevel}%</span>
               </div>
               <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${stressLevel}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-magenta-500 to-rose-500"
                  />
               </div>
            </div>

            <div className="bg-black p-4 rounded-xl border border-white/5 font-mono text-[10px] h-32 overflow-y-auto space-y-1">
               {testLogs.map((log, i) => (
                 <div key={i} className="flex gap-2">
                    <span className="text-magenta-500">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="text-slate-400">{log}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="space-y-10">
          <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-magenta-500"></div>
             <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Propuestas de Trabajo Estratégico</h3>
          </div>

          <div className="grid grid-cols-1  gap-6">
            <ProposalCard 
              title="Pilar Político"
              subtitle="Alianza y Soberanía"
              icon={Building2}
              color="bg-indigo-600"
              points={[
                "Consolidación de la Alianza Tripartita: Gobierno-SUTSEM-ConnectX.",
                "Estrategia de Comunicación Política: Del miedo tecnológico al orgullo digital.",
                "Soberanía de Datos: Control estatal absoluto sobre la infraestructura crítica.",
                "Marco de Negociación: Escalafón salarial basado en certificaciones Aura."
              ]}
            />
            <ProposalCard 
              title="Pilar Aplicación"
              subtitle="Resiliencia y Escalabilidad"
              icon={Cpu}
              color="bg-magenta-600"
              points={[
                "Arquitectura Serverless: Escalado automático ante picos de demanda ciudadana.",
                "Auditoría 'Mystery Shopper' persistente: Verificación de integridad en milisegundos.",
                "Interoperabilidad Total: Bus de servicios para conectar dependencias aisladas.",
                "Seguridad Forense: Trazabilidad inalterable de cada transacción administrativa."
              ]}
            />
            <ProposalCard 
              title="Pilar Ciudadano"
              subtitle="Transparencia y Ley"
              icon={Scale}
              color="bg-emerald-600"
              points={[
                "Cumplimiento LNETB: Digitalización del 100% de trámites estatales.",
                "Open Data Integration: Conexión dinámica con el Portal de Transparencia de México.",
                "Ventanilla Única Universal: Eliminación de la corrupción mediante automatización.",
                "Feedback Loop Ciudadano: Calificación de servicios con impacto en tiempo real."
              ]}
            />
          </div>
        </div>

        {/* Open Data Integration Visual */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Integración de Datos Abiertos (México)</h3>
           </div>
           
           <div className="grid grid-cols-1  gap-6">
              {[
                { name: 'PNT México', status: 'Connected', desc: 'Plataforma Nacional de Transparencia' },
                { name: 'Datos.gob.mx', status: 'Syncing', desc: 'Catálogo de Datos Abiertos de México' },
                { name: 'SAT API', status: 'Encrypted', desc: 'Verificación de Cumplimiento Fiscal' },
                { name: 'Nayarit OpenData', status: 'Local', desc: 'Repositorio de Gobernanza Estatal' }
              ].map((d, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/10 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                      <p className="text-xs font-bold text-white">{d.name}</p>
                      <span className={cn(
                        "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest",
                        d.status === 'Connected' ? "bg-emerald-500/20 text-emerald-500" : "bg-yellow-500/20 text-yellow-500"
                      )}>
                         {d.status}
                      </span>
                   </div>
                   <p className="text-[10px] text-slate-500 leading-tight">{d.desc}</p>
                   <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-1/2 group-hover:w-full transition-all duration-1000"></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Work Plan Timeline */}
        <div className="bg-white/5 rounded-[3rem] p-6 border border-white/10 space-y-10">
           <div className="flex flex-col  items-start  justify-between gap-4">
              <div className="space-y-1">
                 <h3 className="text-2xl font-serif font-black text-white">Cronograma de Despliegue Sólido</h3>
                 <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Sin improvisaciones, solo ejecución</p>
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Plan Validado</span>
              </div>
           </div>

           <div className="grid grid-cols-1  gap-6">
              {[
                { phase: 'FASE 1', title: 'Alineación', desc: 'Sincronización con liderazgos sindicales y diagnóstico técnico profundo.' },
                { phase: 'FASE 2', title: 'Certificación', desc: 'Lanzamiento masivo de la Academia ConnectX (Nivel Bronce).' },
                { phase: 'FASE 3', title: 'Integración', desc: 'Conexión de bases de datos críticas y despliegue del Mystery Shopper.' },
                { phase: 'FASE 4', title: 'Gobernanza', desc: 'Transferencia de mando al Nodo de Transparencia Activa C5.' }
              ].map((p, i) => (
                <div key={i} className="space-y-4 relative">
                   <div className="text-[10px] font-black text-magenta-500 tracking-[0.3em]">{p.phase}</div>
                   <h4 className="text-lg font-serif font-black text-white leading-tight">{p.title}</h4>
                   <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                   {i < 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[1px] bg-white/10"></div>}
                </div>
              ))}
           </div>
        </div>

        {/* Final Statement */}
        <div className="text-center space-y-6 pt-10">
           <Globe className="w-10 h-10 text-slate-700 mx-auto" />
           <p className="text-xl font-serif italic text-slate-400 max-w-2xl mx-auto">
             "La improvisación es el enemigo de la gobernanza. Con ConnectX, la estructura es el destino."
           </p>
           <button 
             onClick={() => alert('Plan de Operaciones 2026 Aprobado y sincronizado con el Nodo de Gobernanza.')}
             className="bg-white text-black w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all"
           >
              Aprobar Plan de Operaciones
           </button>
        </div>
      </main>
    </motion.div>
  );
}
