import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Map as MapIcon, 
  AlertTriangle, 
  Activity, 
  Bot, 
  HeartHandshake,
  Menu,
  X,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Send,
  Loader2,
  Shield,
  Briefcase,
  AppWindow,
  Package,
  Coins,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Search,
  ChevronLeft,
  Brain,
  Mic,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { NayaritMap } from './NayaritMap';
import { ParlamentoView } from './dashboard/ParlamentoView';
import { AnalisisPoliticoView } from './dashboard/AnalisisPoliticoView';
import { useAuraChat } from '../hooks/useAuraChat';
import { useAuraVoice } from '../hooks/useAuraVoice';
import { listarColaCitas, actualizarEstadoCita, type CitaSalud, type EstadoCita } from '../services/citasSaludService';
import { obtenerPerfil, registrarAcceso, esCurpValido, type PerfilSalud } from '../services/saludPerfilService';
import { useAuth } from './FirebaseProvider';
import { AvisoLenguaOriginaria } from './AvisoLenguaOriginaria';
import {
  descriptorLengua,
  LENGUAS_CLAVES,
  type LenguaClave,
} from '../../shared/traduccion/lenguas';
import { resolverTexto } from '../../shared/traduccion/registro';

type Language = LenguaClave;

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

type ModuleType = 'tesoreria' | 'obras' | 'servicios' | 'salud' | 'bienestar' | 'ia' | 'agrovision' | 'observatorio' | 'metricas' | 'parlamento' | 'analisis_politico' | 'interoperabilidad' | 'gabinete';

export function C5Dashboard({ onLogout, initialModule }: { onLogout: () => void; initialModule?: ModuleType }) {
  const [activeModule, setActiveModule] = useState<ModuleType>(() => initialModule || (localStorage.getItem('activeModule') as ModuleType) || 'tesoreria');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('activeModule', activeModule);
  }, [activeModule]);

  const modules = [
    { id: 'tesoreria', name: 'Tesorería Digital', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'obras', name: 'Trazabilidad Obras', icon: MapIcon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'servicios', name: 'Servicios Públicos', icon: AlertTriangle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'salud', name: 'Salud Inteligente Nayarit ID', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'bienestar', name: 'Bienestar Social', icon: HeartHandshake, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'gabinete', name: 'Gabinete en Tiempo Real', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'ia', name: 'Asistente IA', icon: Bot, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'agrovision', name: 'Agrovisión 3D', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'observatorio', name: 'Observatorio Digital', icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'metricas', name: 'Métricas Integrales', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'parlamento', name: 'Parlamento Municipal', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { id: 'analisis_politico', name: 'Análisis Estratégico', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 'interoperabilidad', name: 'Nodo Transparencia', icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen bg-[#161920] border-r border-slate-800 flex flex-col flex-shrink-0 relative z-20"
          >
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-rose-500 flex items-center justify-center font-bold text-white shadow-lg">
                  N
                </div>
                <div>
                  <h1 className="font-serif font-black text-lg text-white tracking-tight leading-none mb-1">Nayarit Digital</h1>
                  <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">C5 Governance Hub</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <div className="text-xs font-semibold text-slate-500 mb-4 px-2 tracking-wider">MÓDULOS DEL ECOSISTEMA</div>
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id as ModuleType)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left",
                    activeModule === m.id 
                      ? "bg-slate-800/50 text-white" 
                      : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200"
                  )}
                >
                  <div className={cn("p-1.5 rounded-md transition-colors", activeModule === m.id ? m.bg : "bg-slate-800/50 group-hover:bg-slate-800")}>
                    <m.icon className={cn("w-4 h-4", activeModule === m.id ? m.color : "text-slate-400")} />
                  </div>
                  {m.name}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
                Salir a Portal Público
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0c]">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#161920]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-1.5 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-4 w-px bg-slate-800"></div>
            <h2 className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <span className="text-slate-500">Módulo /</span> 
              {modules.find(m => m.id === activeModule)?.name}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
              <span className="text-xs font-mono text-emerald-400">STATE: ONLINE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-orange-400 border-2 border-slate-800 overflow-hidden">
               <img src="/geraldine-perfil.jpg" alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1586996292898-71f4036c4e07?w=100&h=100&fit=crop&crop=faces" }}/>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              {activeModule === 'tesoreria' && <TesoreriaView />}
              {activeModule === 'obras' && <ObrasView />}
              {activeModule === 'servicios' && <ServiciosView />}
              {activeModule === 'salud' && <SaludView />}
              {activeModule === 'bienestar' && <BienestarView />}
              {activeModule === 'gabinete' && <GabineteView />}
              {activeModule === 'ia' && <IAView />}
              {activeModule === 'agrovision' && <AgrovisionView />}
              {activeModule === 'observatorio' && <ObservatorioView />}
              {activeModule === 'metricas' && <MetricView />}
              {activeModule === 'parlamento' && <ParlamentoView />}
              {activeModule === 'analisis_politico' && <AnalisisPoliticoView />}
              {activeModule === 'interoperabilidad' && <InteroperabilidadView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- SUB-VIEWS --- //

function InteroperabilidadView() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Infraestructura Digital ConnectX</p>
        <h3 className="text-4xl font-serif font-black text-white tracking-tighter">Nodo de Transparencia Activa</h3>
        <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">Arquitectura de bus de servicios (propuesta de interoperabilidad). La integridad de datos bajo la Ley de Gobierno Digital del Estado de Nayarit está diseñada, no implementada.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#161920] border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Endpoints de API Activos</p>
            <p className="text-4xl font-serif font-black text-white">12<span className="text-sm text-emerald-400 ml-2">REST / SOAP</span></p>
         </div>
         <div className="bg-[#161920] border border-cyan-500/20 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Identidades Validadas</p>
            <p className="text-4xl font-serif font-black text-white">14.2k<span className="text-sm text-cyan-400 ml-2">Nayarit ID</span></p>
         </div>
         <div className="bg-[#161920] border border-purple-500/20 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mensajes de Datos (Sellados)</p>
            <p className="text-4xl font-serif font-black text-white">8,401<span className="text-sm text-purple-400 ml-2">Folios</span></p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-[#161920] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
               <ShieldCheck className="w-5 h-5 text-emerald-400" />
               <h4 className="text-sm font-semibold text-white uppercase">Trazabilidad Inter-Institucional</h4>
            </div>
            <div className="space-y-4">
               {[
                 { target: 'Tesorería Municipal', status: 'Sincronizado', ping: '12ms', query: 'GET /api/v1/taxpayer' },
                 { target: 'Registro Público Federal', status: 'Sincronizado', ping: '45ms', query: 'POST /api/v2/verify_identity' },
                 { target: 'Padrón de Obras', status: 'Sincronizado', ping: '18ms', query: 'GET /api/v1/projects' },
                 { target: 'Sistema DIF Estatal', status: 'Sincronizado', ping: '30ms', query: 'POST /api/v2/benefits' },
               ].map((api, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <div>
                       <p className="text-xs font-bold text-white mb-1">{api.target}</p>
                       <p className="text-[9px] font-mono text-slate-500">{api.query}</p>
                    </div>
                    <div className="text-right">
                       <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded block mb-1">
                          {api.status}
                       </span>
                       <span className="text-[9px] font-mono text-slate-400">{api.ping}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-[#161920] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
               <Briefcase className="w-5 h-5 text-purple-400" />
               <h4 className="text-sm font-semibold text-white uppercase">Blockchain Municipal (Hashes)</h4>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 pr-8">
               Muestreo en tiempo real de Mensajes de Datos sellados criptográficamente para auditoría federal.
            </p>
            <div className="space-y-2 h-[240px] overflow-hidden relative">
               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#161920] to-transparent z-10"></div>
               {[
                 { id: 'TPC-2026-9902', hash: 'e3b0c44298fc1c149afbf4c8996fb924', date: '2 min ago' },
                 { id: 'TPC-2026-9901', hash: '4a0a19218e082a343a1b17e5333409af', date: '5 min ago' },
                 { id: 'TPC-2026-9900', hash: '8f14e45fceea167a5a36dedd4bea2543', date: '12 min ago' },
                 { id: 'TPC-2026-9899', hash: 'f2c7a407e324efdc4cf611daaaa5a1f2', date: '18 min ago' },
                 { id: 'TPC-2026-9898', hash: 'bb18a5df1ab03994e410a56f6aa6a0e6', date: '21 min ago' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 p-3 bg-[#0f1115] border border-slate-800/50 rounded-lg">
                    <div className="text-[10px] font-mono text-magenta-400 border-r border-slate-800 pr-3">{log.id}</div>
                    <div className="flex-1 text-[8px] font-mono text-slate-500 truncate leading-relaxed">
                       SHA256: {log.hash}...<br/>
                       {log.date}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function TesoreriaView() {
  const data = [
    { name: 'Lun', ingresos: 4000, meta: 2400 },
    { name: 'Mar', ingresos: 3000, meta: 1398 },
    { name: 'Mié', ingresos: 2000, meta: 9800 },
    { name: 'Jue', ingresos: 2780, meta: 3908 },
    { name: 'Vie', ingresos: 1890, meta: 4800 },
    { name: 'Sáb', ingresos: 2390, meta: 3800 },
    { name: 'Dom', ingresos: 3490, meta: 4300 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Tesorería Digital</h3>
        <p className="text-slate-400 text-sm mt-1">Recaudación centralizada e historial único por ciudadano.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Recaudación Semanal', value: '$2.4M', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Pagos Digitales', value: '84%', icon: CheckCircle2, color: 'text-purple-400' },
          { label: 'Trámites Activos', value: '1,240', icon: Activity, color: 'text-blue-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#161920] border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/0 to-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
              <div className="p-2 bg-slate-800/50 rounded-lg">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-6">Proyección de Ingresos (Predial & Agua)</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontFamily="'JetBrains Mono', monospace" tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" fontSize={11} fontFamily="'JetBrains Mono', monospace" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000)}k`} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#10B981', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                cursor={{ stroke: '#1e293b', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" activeDot={{ r: 6, fill: '#10B981', stroke: '#0f1115', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ObrasView() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Trazabilidad de Obras</h3>
        <p className="text-slate-400 text-sm mt-1">Monitoreo en tiempo real de infraestructura estatal con alertas de sobrecosto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-semibold text-slate-300">Mapa de Obras Activas</h4>
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium">42 en proceso</span>
          </div>
          <div className="aspect-video bg-slate-800/30 rounded-lg border border-slate-800 relative overflow-hidden">
             <NayaritMap 
               center={{ lat: 21.5090, lng: -104.8947 }}
               zoom={14}
               markers={[
                 { lat: 21.5090, lng: -104.8947, title: "Obra Principal Centro", color: "#F59E0B" },
                 { lat: 21.5150, lng: -104.9050, title: "Frente de Trabajo Norte", color: "#10B981" },
                 { lat: 21.5020, lng: -104.8850, title: "Reporte Crítico", color: "#F43F5E" }
               ]}
             />
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-6">Alertas Automáticas</h4>
          <div className="space-y-4">
            {[
              { title: 'Retraso Crítico: Puente Insurgentes', desc: 'Desfase de 15 días detectado en cronograma.', status: 'rojo' },
              { title: 'Requisición de Material', desc: 'Aprobación pendiente para asfalto.', status: 'ambar' },
              { title: 'Entrega Exitosa', desc: 'Unidad médica rehabilitada en tiempo.', status: 'verde' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-800/50">
                <div className={cn(
                  "w-2 rounded-full flex-shrink-0",
                  alert.status === 'rojo' ? 'bg-rose-500' : alert.status === 'ambar' ? 'bg-amber-500' : 'bg-emerald-500'
                )}></div>
                <div>
                  <h5 className="font-semibold text-sm text-slate-200">{alert.title}</h5>
                  <p className="text-xs text-slate-500 mt-1">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiciosView() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Reporte CSV generado exitosamente. Se ha enviado una copia al correo institucional.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Servicios Públicos Inteligentes</h3>
        <p className="text-slate-400 text-sm mt-1">Clasificador de IA y asignación de cuadrillas automáticas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {/* KPI Cards */}
         {[
           { label: 'Reportes Hoy', val: '184', change: '+12%' },
           { label: 'Tiempo Resp.', val: '2.4h', change: '-15%' },
           { label: 'Baches Report.', val: '45', change: '0%' },
           { label: 'Luminarias', val: '89', change: '+5%' },
         ].map((kpi, i) => (
           <div key={i} className="bg-[#161920] border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-500 font-semibold">{kpi.label}</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{kpi.val}</span>
                <span className={cn("text-xs", kpi.change.startsWith('+') ? "text-emerald-400" : "text-emerald-400")}>{kpi.change}</span>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-[#161920] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
          <h4 className="text-sm font-semibold text-slate-300">Flujo de Reportes en Tiempo Real</h4>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            {isExporting ? 'Procesando...' : 'Exportar CSV'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-800/30 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">ID Ticket</th>
                <th className="px-6 py-3 font-medium">Ciudadano RUTA</th>
                <th className="px-6 py-3 font-medium">Categoría (IA)</th>
                <th className="px-6 py-3 font-medium">Ubicación</th>
                <th className="px-6 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                { id: 'TK-092', user: 'Juan Pérez', cat: 'Fuga de Agua', loc: 'Zona Centro', status: 'Asignado' },
                { id: 'TK-093', user: 'Ana G.', cat: 'Bacheo', loc: 'Colonia X', status: 'Recibido' },
                { id: 'TK-094', user: 'Luis M.', cat: 'Luminaria', loc: 'Libramiento', status: 'Resuelto' },
                { id: 'TK-095', user: 'María D.', cat: 'Basura', loc: 'Parque', status: 'En Proceso' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{row.id}</td>
                  <td className="px-6 py-4 text-slate-300">{row.user}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{row.cat}</span></td>
                  <td className="px-6 py-4 text-slate-400">{row.loc}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      row.status === 'Resuelto' ? 'text-emerald-400' :
                      row.status === 'En Proceso' ? 'text-amber-400' :
                      row.status === 'Asignado' ? 'text-blue-400' : 'text-slate-400'
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full",
                         row.status === 'Resuelto' ? 'bg-emerald-400' :
                         row.status === 'En Proceso' ? 'bg-amber-400' :
                         row.status === 'Asignado' ? 'bg-blue-400' : 'bg-slate-400'
                      )}></div>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SaludView() {
  const { user } = useAuth();
  const [citas, setCitas] = useState<CitaSalud[]>([]);
  const [cargandoCitas, setCargandoCitas] = useState(true);
  const [errorCitas, setErrorCitas] = useState(false);

  const cargarCitas = React.useCallback(() => {
    setCargandoCitas(true);
    setErrorCitas(false);
    listarColaCitas()
      .then(setCitas)
      .catch(() => setErrorCitas(true))
      .finally(() => setCargandoCitas(false));
  }, []);

  useEffect(() => { cargarCitas(); }, [cargarCitas]);

  const cambiarEstado = async (cita: CitaSalud, nuevoEstado: EstadoCita) => {
    try {
      await actualizarEstadoCita(cita, nuevoEstado);
      cargarCitas();
    } catch {
      alert('No se pudo actualizar la cita. Verifica que tu cuenta tenga rol de editor/admin.');
    }
  };

  // Expediente de Urgencias — búsqueda por CURP con consentimiento y
  // bitácora de acceso obligatoria (ver docs/marco/MODULO_SALUD_CURP.md).
  const [curpBusqueda, setCurpBusqueda] = useState('');
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [perfilEncontrado, setPerfilEncontrado] = useState<PerfilSalud | null>(null);
  const [accesoRegistrado, setAccesoRegistrado] = useState(false);
  const [motivoEmergencia, setMotivoEmergencia] = useState('');
  const [registrandoEmergencia, setRegistrandoEmergencia] = useState(false);

  const nombrePersonal = user?.displayName || user?.email || 'Personal sin nombre registrado';

  const buscarPaciente = async () => {
    const curp = curpBusqueda.toUpperCase().trim();
    setErrorBusqueda('');
    setPerfilEncontrado(null);
    setAccesoRegistrado(false);
    setMotivoEmergencia('');
    if (!esCurpValido(curp)) {
      setErrorBusqueda('El CURP no tiene un formato válido.');
      return;
    }
    setBuscandoPaciente(true);
    try {
      const perfil = await obtenerPerfil(curp);
      if (!perfil) {
        setErrorBusqueda('No existe un perfil de salud con ese CURP todavía.');
        return;
      }
      setPerfilEncontrado(perfil);
      if (perfil.consentimientoActivo ?? true) {
        await registrarAcceso(curp, nombrePersonal, true).catch(() => {});
        setAccesoRegistrado(true);
      }
    } catch {
      setErrorBusqueda('No se pudo consultar. Verifica que tu cuenta tenga rol de editor/admin.');
    } finally {
      setBuscandoPaciente(false);
    }
  };

  const solicitarAccesoEmergencia = async () => {
    if (!perfilEncontrado || !motivoEmergencia.trim()) return;
    setRegistrandoEmergencia(true);
    try {
      await registrarAcceso(perfilEncontrado.curp, nombrePersonal, false, motivoEmergencia.trim());
      setAccesoRegistrado(true);
    } catch {
      alert('No se pudo registrar el acceso de emergencia. Verifica que tu cuenta tenga rol de editor/admin.');
    } finally {
      setRegistrandoEmergencia(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight text-rose-500">Salud Inteligente Nayarit ID</h3>
          <p className="text-slate-400 text-sm mt-1">Triaje médico Offline + Alertas Epidemiológicas (Conecta C-11).</p>
        </div>
        <div className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-mono flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
          SISTEMA OFFLINE ACTIVO EN LA SIERRA
        </div>
      </div>

      {/* Portal de Citas — cola real ligada a Firestore (citas_salud), a
          diferencia del resto del panel que sigue siendo una maqueta visual. */}
      <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-semibold text-slate-300">Portal de Citas — Cola de Solicitudes</h4>
          <span className="text-[10px] font-mono text-slate-500">{citas.length} solicitud{citas.length === 1 ? '' : 'es'}</span>
        </div>

        {cargandoCitas && <p className="text-slate-500 text-sm">Cargando…</p>}
        {errorCitas && (
          <p className="text-amber-400 text-sm">
            No se pudo cargar la cola. Necesitas una cuenta con rol "editor" o "admin" en la colección users.
          </p>
        )}
        {!cargandoCitas && !errorCitas && citas.length === 0 && (
          <p className="text-slate-500 text-sm">No hay citas solicitadas todavía.</p>
        )}

        <div className="space-y-3">
          {citas.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{c.nombrePaciente} · {c.especialidad}</p>
                <p className="text-[10px] font-mono text-slate-500">{c.curp} · {c.fechaSolicitada}{c.motivo ? ` · ${c.motivo}` : ''}</p>
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest shrink-0",
                c.estado === 'confirmada' ? "bg-emerald-500/20 text-emerald-400" :
                c.estado === 'cancelada' ? "bg-red-500/20 text-red-400" :
                c.estado === 'atendida' ? "bg-slate-700 text-slate-300" :
                "bg-amber-500/20 text-amber-400"
              )}>
                {c.estado}
              </span>
              {c.estado === 'solicitada' && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => cambiarEstado(c, 'confirmada')} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold uppercase">Confirmar</button>
                  <button onClick={() => cambiarEstado(c, 'cancelada')} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-[10px] font-bold uppercase">Cancelar</button>
                </div>
              )}
              {c.estado === 'confirmada' && (
                <button onClick={() => cambiarEstado(c, 'atendida')} className="px-3 py-1.5 bg-slate-700 text-slate-300 border border-slate-600 rounded-lg text-[10px] font-bold uppercase shrink-0">Marcar atendida</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expediente de Urgencias — búsqueda real por CURP, ligada al mismo
          perfiles_salud que usa el ciudadano. El consentimiento del paciente
          decide si el acceso es directo o requiere motivo de emergencia;
          cualquiera de los dos caminos queda en la bitácora del paciente. */}
      <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-4">Expediente de Urgencias — Buscar Paciente por CURP</h4>
        <div className="flex gap-3">
          <input
            value={curpBusqueda}
            onChange={(e) => setCurpBusqueda(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && buscarPaciente()}
            maxLength={18}
            placeholder="AAAA000000HNTXXX00"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
          />
          <button
            onClick={buscarPaciente}
            disabled={buscandoPaciente || !curpBusqueda}
            className="px-4 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-40"
          >
            {buscandoPaciente ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Consultar
          </button>
        </div>

        {errorBusqueda && <p className="text-amber-400 text-xs mt-3">{errorBusqueda}</p>}

        {perfilEncontrado && (
          <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{perfilEncontrado.nombre}</p>
                <p className="text-[10px] font-mono text-slate-500">{perfilEncontrado.curp}</p>
              </div>
              {(perfilEncontrado.consentimientoActivo ?? true) ? (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> Consentimiento activo
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400">
                  <ShieldAlert className="w-3 h-3" /> Sin consentimiento
                </span>
              )}
            </div>

            {perfilEncontrado.telefono && <p className="text-xs text-slate-400">Teléfono: {perfilEncontrado.telefono}</p>}
            {perfilEncontrado.contactoFamiliar && <p className="text-xs text-slate-400">Contacto de emergencia: {perfilEncontrado.contactoFamiliar}</p>}

            {(perfilEncontrado.consentimientoActivo ?? true) ? (
              accesoRegistrado && (
                <p className="text-[11px] text-emerald-400">Acceso autorizado registrado en la bitácora del paciente.</p>
              )
            ) : accesoRegistrado ? (
              <p className="text-[11px] text-amber-400">Acceso de emergencia registrado en la bitácora del paciente.</p>
            ) : (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-[11px] text-amber-400">El paciente no ha autorizado consultas fuera de una urgencia.</p>
                <textarea
                  value={motivoEmergencia}
                  onChange={(e) => setMotivoEmergencia(e.target.value)}
                  rows={2}
                  placeholder="Motivo del acceso de emergencia (obligatorio, queda en la bitácora)…"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={solicitarAccesoEmergencia}
                  disabled={!motivoEmergencia.trim() || registrandoEmergencia}
                  className="px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-bold uppercase disabled:opacity-40"
                >
                  {registrandoEmergencia ? 'Registrando…' : 'Solicitar acceso de emergencia'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-6">Mapa de Calor: Alertas de Salud Pública</h4>
          <div className="aspect-[21/9] bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.15] mix-blend-screen"></div>
            {/* Heat map blobs */}
            <div className="absolute top-[40%] left-[30%] w-32 h-32 bg-rose-500/30 rounded-full blur-2xl"></div>
            <div className="absolute top-[20%] left-[60%] w-20 h-20 bg-amber-500/30 rounded-full blur-xl"></div>
            
            <div className="relative z-10 text-center">
               <Activity className="w-8 h-8 text-rose-500 mx-auto mb-2 opacity-50" />
               <p className="text-sm text-slate-400">Generando inferencias geográficas en tiempo real.</p>
               <div className="mt-4 flex gap-2 justify-center">
                 <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">Dengue (+12 casos detectados)</span>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-6">Incidencias Recientes</h4>
          <div className="space-y-4">
            {[
              { time: 'Hace 5m', desc: 'Triaje Nivel 4 (Urgencia Urgente) reportado en zona norte.', type: 'critical' },
              { time: 'Hace 12m', desc: 'Consulta automatizada off-line completada en Puga.', type: 'normal' },
              { time: 'Hace 1h', desc: 'Alerta de desabasto en Centro de Salud #4.', type: 'warning' },
            ].map((feed, i) => (
              <div key={i} className="flex gap-3 text-sm border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                <span className="text-xs text-slate-500 font-mono flex-shrink-0 w-16">{feed.time}</span>
                <p className={cn(
                  feed.type === 'critical' ? 'text-rose-400' :
                  feed.type === 'warning' ? 'text-amber-400' : 'text-slate-300'
                )}>{feed.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IAView() {
  const [lang, setLang] = useState<Language>('es');
  const auraVoice = useAuraVoice();
  const [autoSpeak, setAutoSpeak] = useState(false);

  // El saludo vive en shared/traduccion/lexico.ts con estatus y fuente. Se
  // le retiró el nombre de la titular del Ayuntamiento: el semáforo del
  // proyecto prohíbe nombres de políticos en componentes de la plataforma.
  const saludoAura = React.useCallback(
    (lengua: Language) => resolverTexto('c5.aura.saludo', lengua).texto,
    [],
  );

  const getPageContext = React.useCallback(() => {
    return `El usuario está en el módulo "Asistente IA" del C5 Governance Hub (panel administrativo de gobierno municipal). ` +
      `Rol: funcionario de gobierno. ` +
      `Interfaz pintada en ${descriptorLengua(lang).nombre}; el asistente responde en español.`;
  }, [lang]);

  const { messages, isTyping, sendMessage, resetGreeting } = useAuraChat({
    initialGreeting: saludoAura('es'),
    getPageContext,
    onReply: (respuesta) => { if (autoSpeak) auraVoice.speak(respuesta); },
  });

  useEffect(() => {
    resetGreeting(saludoAura(lang));
  }, [lang, saludoAura, resetGreeting]);

  const [inputValue, setInputValue] = useState('');

  const strategicShortcuts = [
    "Resumen Recaudación",
    "Optimización Bacheo",
    "Reporte Bienestar",
    "Visión Tepic 2027"
  ];

  const handleSendMessage = (text?: string) => {
    const userMsg = text ?? inputValue.trim();
    if (!userMsg) return;
    if (!text) setInputValue('');
    sendMessage(userMsg);
  };

  const handleVoiceInput = () => {
    if (auraVoice.isListening) {
      auraVoice.stopListening();
      return;
    }
    setAutoSpeak(true);
    auraVoice.startListening((texto) => sendMessage(texto));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black text-white flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 shadow-xl">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            Nucleo ConnectX AI
          </h3>
          <p className="text-slate-500 text-xs mt-2 uppercase font-black tracking-widest flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             GOBERNANZA DATA-DRIVEN · COBERTURA TOTAL
          </p>
        </div>
        <div className="flex gap-2">
          {auraVoice.isSupported && (
            <button
              onClick={() => {
                if (autoSpeak) auraVoice.stopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              aria-label={autoSpeak ? 'Desactivar respuesta por voz' : 'Activar respuesta por voz'}
              className={cn(
                "w-12 h-12 rounded-xl font-black shadow-lg transition-all flex items-center justify-center",
                autoSpeak ? "bg-purple-600 text-white ring-2 ring-purple-500/40" : "bg-slate-800 text-slate-500 hover:bg-slate-700"
              )}
            >
              {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          )}
          {LENGUAS_CLAVES.map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-label={`Interfaz en ${descriptorLengua(l).nombre}`}
              className={cn(
                "h-12 px-3 rounded-xl font-black text-[10px] uppercase shadow-lg transition-all",
                lang === l ? "bg-purple-600 text-white ring-2 ring-purple-500/40" : "bg-slate-800 text-slate-500 hover:bg-slate-700"
              )}
            >
              {descriptorLengua(l).etiquetaBoton}
            </button>
          ))}
        </div>
      </div>

      {lang !== 'es' && <AvisoLenguaOriginaria lengua={lang} tono="oscuro" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        <div className="bg-[#12141a] border border-slate-800 rounded-[2.5rem] p-8 flex flex-col h-[650px] shadow-3xl">
          <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}
              >
                 <div className={cn(
                   "p-6 rounded-[2rem] text-[1.1rem] leading-relaxed shadow-xl max-w-[90%] font-medium",
                   msg.role === 'assistant' 
                    ? "bg-slate-800/80 text-white border border-slate-700 rounded-tl-none" 
                    : "bg-purple-600 text-white rounded-tr-none shadow-purple-600/20"
                 )}>
                   {msg.content}
                 </div>
                 <span className="text-[10px] text-slate-600 mt-3 font-black uppercase tracking-widest px-2">
                   {msg.role === 'user' ? 'G. Ponce' : 'ConnectX Strategic AI'} · {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-3 p-6 bg-slate-800/50 rounded-[2rem] rounded-tl-none border border-slate-700 w-28">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50 space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
               {strategicShortcuts.map(s => (
                 <button 
                  key={s} 
                  onClick={() => handleSendMessage(s)}
                  className="px-6 py-3 bg-slate-800/50 hover:bg-purple-600 text-[10px] text-slate-400 hover:text-white uppercase font-black tracking-widest rounded-xl border border-slate-700 hover:border-purple-500 transition-all active:scale-95 whitespace-nowrap shadow-lg"
                 >
                   {s}
                 </button>
               ))}
            </div>
            <div className="relative flex items-center gap-3">
              {auraVoice.isSupported && (
                <button
                  onClick={handleVoiceInput}
                  aria-label={auraVoice.isListening ? 'Detener grabación de voz' : 'Hablar con el Asistente IA'}
                  className={cn(
                    "shrink-0 p-4 rounded-2xl shadow-xl transition-all active:scale-90",
                    auraVoice.isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
              <div className="relative flex-1">
                <input
                  type="text"
                  aria-label="Introducir comando ejecutivo"
                  placeholder={auraVoice.isListening ? 'Escuchando…' : 'Introducir comando ejecutivo...'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={auraVoice.isListening}
                  className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white text-[1rem] pr-20 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-bold placeholder:text-slate-800 disabled:opacity-60"
                />
                <button
                  onClick={() => handleSendMessage()}
                  aria-label="Enviar"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-purple-600 text-white rounded-xl shadow-xl hover:bg-purple-500 transition-all active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#161920] border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl">
              <h4 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.3em] border-l-4 border-purple-500 pl-4">Eficacia del Sistema</h4>
              <div className="space-y-10">
                 {[
                   { label: 'Indice de Recaudación Digital', val: 94.2, color: 'bg-emerald-500' },
                   { label: 'Resolución Autónoma IA', val: 78.5, color: 'bg-purple-500' },
                   { label: 'Satisfacción Ciudadana (UX)', val: 91.0, color: 'bg-blue-500' },
                 ].map((item, i) => (
                   <div key={i} className="space-y-3">
                     <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white text-lg">{item.val}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.val}%` }}
                          transition={{ delay: 1, duration: 1.5 }}
                          className={`h-full ${item.color} shadow-lg`}
                        />
                     </div>
                   </div>
                 ))}
              </div>
              <div className="mt-12 p-6 bg-purple-600/5 rounded-3xl border border-purple-600/20">
                 <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-3">Reporte Algorítmico:</p>
                 <p className="text-sm text-slate-400 italic leading-relaxed font-medium">
                   "La integración del módulo de recaudación digital en Tepic ha superado las proyecciones iniciales, eliminando el 100% de la opacidad en transferencias de ventanilla."
                 </p>
              </div>
           </div>
           
           <div className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-3xl">
              <TrendingUp className="w-12 h-12 mb-6 text-white/40" />
              <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Vanguardia Digital</h4>
              <p className="text-sm text-white/60 leading-relaxed font-medium mb-8">
                ConnectX es ahora el sistema operativo municipal más avanzado de México, diseñado para la trazabilidad absoluta.
              </p>
              <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                Consultar Auditoría Google Cloud
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function AgrovisionView() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Certificado de Producción generado exitosamente. Disponible en la bitácora del productor.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Agrovisión 3D</h3>
        <p className="text-slate-400 text-sm mt-1">Monitoreo satelital y modelado 3D de la producción agropecuaria en Nayarit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-6">Visualización de Parcelas / NDVI</h4>
          <div className="aspect-[16/9] bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden group cursor-crosshair">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"></div>
            
            {/* Hex Grid Overlay */}
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5z' fill='none' stroke='%234ADE80' stroke-width='1'/%3E%3C/svg%3E\")"}}></div>

            <div className="relative z-10 p-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg text-center">
              <p className="text-xs font-mono text-emerald-400 mb-2 tracking-widest">ANALYZING CROP HEALTH</p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">0.82</div>
                  <div className="text-[10px] text-slate-400 uppercase">NDVI Promedio</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">12%</div>
                  <div className="text-[10px] text-slate-400 uppercase">Humedad Suelo</div>
                </div>
              </div>
            </div>
            
            {/* 3D Mock Overlay */}
            <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-slate-400 border border-white/10">RENDER: OCTANE 3D ENGINE</div>
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-6">Inteligencia de Mercado</h4>
          <div className="space-y-4">
            {[
              { product: 'Caña de Azúcar', price: '$820/t', trend: 'up' },
              { product: 'Mango Barracuda', price: '$12/kg', trend: 'down' },
              { product: 'Cacao Real', price: '$140/kg', trend: 'stable' },
              { product: 'Maíz Híbrido', price: '$6,200/t', trend: 'up' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-800/20 border border-slate-800 rounded-lg">
                <span className="text-sm text-slate-200">{item.product}</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{item.price}</div>
                  <div className={cn(
                    "text-[10px] font-bold uppercase",
                    item.trend === 'up' ? 'text-emerald-400' : item.trend === 'down' ? 'text-rose-400' : 'text-slate-500'
                  )}>
                    {item.trend === 'up' ? '↑ Alza' : item.trend === 'down' ? '↓ Baja' : '↔ Estable'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-6 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            {isGenerating ? 'Generando...' : 'Generar Certificado de Producción'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ObservatorioView() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStrategyTab, setActiveStrategyTab] = useState<'federal' | 'blueocean' | 'business'>('federal');

  const citizenData = [
    { name: 'Ene', total: 12400 },
    { name: 'Feb', total: 18900 },
    { name: 'Mar', total: 24500 },
    { name: 'Abr', total: 31200 },
    { name: 'May', total: 38700 },
    { name: 'Jun', total: 45210 },
  ];

  const worksData = [
    { name: 'Libramiento', progress: 84 },
    { name: 'Mercado Centro', progress: 62 },
    { name: 'CD. Salud', progress: 92 },
    { name: 'Red Agua Nayar', progress: 45 },
    { name: 'Parque Lineal', progress: 30 },
  ];

  const oceanData = [
    { category: 'Agrotech', potential: 95, stability: 80, color: '#06b6d4' },
    { category: 'Fintech Local', potential: 88, stability: 70, color: '#a855f7' },
    { category: 'Eco-Luxury', potential: 82, stability: 65, color: '#10b981' },
    { category: 'Health-Gov', potential: 91, stability: 85, color: '#f59e0b' },
  ];

  const handleReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Informe de Gobernanza estratégica 2026 generado. El mapa prospectivo de Océanos Azules para Tepic está listo para visualización presidencial.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
       <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Mando Estratégico & Proyección 2026</h3>
        <p className="text-slate-400 text-sm mt-1">Inteligencia territorial aplicada a la Ley de Gobierno Digital y Fondos Federales de Desarrollo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Índice Madurez (IMDM)', val: '72/100', status: '+4 pts este mes', color: 'text-cyan-400' },
          { label: 'Gobernanza Digital', val: 'Ley Art. 42', status: 'Firma E. Activa', color: 'text-emerald-400' },
          { label: 'Ciudadanos Registrados', val: '45,210', status: '↑ 14% vs mayo', color: 'text-purple-400' },
          { label: 'Presupuesto Federal', val: 'FORTAMUN', status: 'Ejecución: 92%', color: 'text-amber-400' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#161920] border border-slate-800 rounded-xl p-5 border-b-[3px] border-b-cyan-500/50">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={cn("text-2xl font-black mb-1", kpi.color)}>{kpi.val}</p>
            <p className="text-[10px] text-slate-400 font-medium tracking-tighter uppercase">{kpi.status}</p>
          </div>
        ))}
      </div>

      {/* Main Strategy Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Navigation / Strategy Tabs */}
        <div className="bg-[#161920] border border-slate-800 rounded-2xl p-6 lg:col-span-2">
           <div className="flex gap-4 border-b border-slate-800 mb-6 pb-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveStrategyTab('federal')}
                className={cn("text-[10px] font-black uppercase tracking-widest pb-3 px-2 transition-all whitespace-nowrap", activeStrategyTab === 'federal' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300")}
              >
                Gobernanza & Leyes
              </button>
              <button 
                onClick={() => setActiveStrategyTab('blueocean')}
                className={cn("text-[10px] font-black uppercase tracking-widest pb-3 px-2 transition-all whitespace-nowrap", activeStrategyTab === 'blueocean' ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-300")}
              >
                Océanos Azules (Oro 20%)
              </button>
              <button 
                onClick={() => setActiveStrategyTab('business')}
                className={cn("text-[10px] font-black uppercase tracking-widest pb-3 px-2 transition-all whitespace-nowrap", activeStrategyTab === 'business' ? "text-emerald-400 border-b-2 border-emerald-400" : "text-slate-500 hover:text-slate-300")}
              >
                Negocios Escalables
              </button>
           </div>

           <AnimatePresence mode="wait">
              {activeStrategyTab === 'federal' && (
                <motion.div key="federal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                         <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-cyan-400" />
                            <h5 className="text-sm font-bold text-white uppercase tracking-tight">Ley de Gobierno Digital Nayarit</h5>
                         </div>
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            Marco legal vigente que habilita la interoperabilidad entre dependencias municipales y estatales. El 100% de los trámites deben ser digitales para el cierre de 2026.
                         </p>
                         <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded font-bold uppercase">Art. 12: Firma Electrónica</span>
                            <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded font-bold uppercase">Art. 45: Pagos Digitales</span>
                         </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 hover:border-amber-500/50 transition-colors group">
                         <div className="flex items-center gap-3 mb-4">
                            <Briefcase className="w-5 h-5 text-amber-400" />
                            <h5 className="text-sm font-bold text-white uppercase tracking-tight">Recursos Federales (PND)</h5>
                         </div>
                         <p className="text-[11px] text-slate-400 leading-relaxed">
                            Fondos **FORTAMUN** y **FAIS** reasignados a seguridad preventiva (drones/C5) y salud pública digital. Presupuesto escalable mediante ahorros operativos.
                         </p>
                         <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-[8px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded font-bold uppercase">FORTAMUN: Modernización</span>
                            <span className="text-[8px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded font-bold uppercase">FAIS: Digitalización Social</span>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeStrategyTab === 'blueocean' && (
                <motion.div key="blueocean" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                   <div className="flex flex-col lg:flex-row gap-8 items-center">
                      <div className="w-full lg:w-1/2 h-[260px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                 data={oceanData}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={60}
                                 outerRadius={80}
                                 paddingAngle={5}
                                 dataKey="potential"
                               >
                                 {oceanData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                               </Pie>
                               <Tooltip 
                                 contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }}
                                 itemStyle={{ color: '#fff' }}
                               />
                               <Legend verticalAlign="bottom" height={36} wrapperStyle={{fontSize: '10px', textTransform: 'uppercase'}}/>
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="w-full lg:w-1/2 space-y-4">
                         <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                               <TrendingUp className="w-3 h-3" /> Salud-Turismo Inteligente
                            </h5>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                               Tepic como el **Hub de Salud Preventiva** de occidente. Telemedicina para comunidades rurales integrada a la red de turismo salud certificada.
                            </p>
                         </div>
                         <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                            <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                               <Activity className="w-3 h-3" /> Agrotech (Oro de Océanos)
                            </h5>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                               Digitalización del 20% de los productores que generan el 80% del valor. Marketplace directo al consumidor eliminando intermediarios físicos.
                            </p>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeStrategyTab === 'business' && (
                <motion.div key="business" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: 'Municipio as a Service', icon: AppWindow, desc: 'Franquiciar el modelo Nayarit ID a otros municipios de la región occidente.', roi: '6.2x', color: 'bg-blue-500' },
                        { title: 'Tepic Logistics ID', icon: Package, desc: 'Red de entrega y mensajería oficial certificando domicilios con Nayarit ID.', roi: '4.8x', color: 'bg-indigo-500' },
                        { title: 'Agro Tokenization', icon: Coins, desc: 'Esquema de inversión digital en cosechas mediante contratos inteligentes.', roi: '12.5x', color: 'bg-emerald-500' },
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-slate-700 transition-all">
                           <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                              <item.icon className="w-4 h-4 text-white" />
                           </div>
                           <h6 className="text-xs font-black text-white mb-2 uppercase tracking-tight leading-tight">{item.title}</h6>
                           <p className="text-[10px] text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                           <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest">
                              <span className="text-slate-500">ROI Proyectado</span>
                              <span className="text-emerald-400">{item.roi}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Global Performance Radar / Quick Actions */}
        <div className="space-y-6">
           <div className="bg-[#161920] border border-slate-800 rounded-2xl p-6">
              <h4 className="text-sm font-semibold text-slate-200 mb-6">Eficiencia de Gobernanza</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Transparencia Fiscal', pct: 94, color: 'bg-cyan-500' },
                   { label: 'Digitalización Pagos', pct: 82, status: '↑ 12%', color: 'bg-purple-500' },
                   { label: 'Confianza Ciudadana', pct: 76, color: 'bg-emerald-500' },
                   { label: 'Respuesta Servicios', pct: 89, color: 'bg-amber-500' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                         <span className="text-[10px] font-black text-white">{stat.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${stat.pct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${stat.color} rounded-full`} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleReport}
             disabled={isGenerating}
             className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-4 flex items-center justify-center gap-3 transition-colors shadow-lg shadow-cyan-900/40 active:scale-[0.98] disabled:opacity-50"
           >
             {isGenerating ? (
               <Loader2 className="w-4 h-4 animate-spin" />
             ) : (
               <>
                 <FileText className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Generar Reporte Estratégico 2026</span>
               </>
             )}
           </button>
        </div>
      </div>

      {/* Real-time Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161920] border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Adopción Nayarit ID</h4>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Crecimiento Mensual de Usuarios</p>
            </div>
            <div className="flex items-center gap-2 text-purple-400 bg-purple-500/10 px-2 py-1 rounded text-[10px] font-bold">
              <Users className="w-3 h-3" />
              LIVE
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citizenData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontFamily="'JetBrains Mono', monospace" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} fontFamily="'JetBrains Mono', monospace" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#a855f7', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
                  cursor={{ fill: 'rgba(168, 85, 247, 0.05)' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={24}>
                  {citizenData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === citizenData.length - 1 ? '#a855f7' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Avance de Infraestructura</h4>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Cumplimiento de Metas por Proyecto</p>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded text-[10px] font-bold">
              <Activity className="w-3 h-3" />
              89.2% GLOBAL
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={worksData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" horizontal={false} opacity={0.5} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} fontFamily="'JetBrains Mono', monospace" tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#06b6d4', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
                  cursor={{ fill: 'rgba(6, 182, 212, 0.05)' }}
                  formatter={(value: any) => [`${value}%`, 'Avance']}
                />
                <Bar dataKey="progress" radius={[0, 4, 4, 0]} barSize={12}>
                  {worksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.progress > 80 ? '#06b6d4' : entry.progress > 50 ? '#0891b2' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#161920] border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-6">Mapas de Calor: Demanda Ciudadana Integrada</h4>
          <div className="aspect-video bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 grayscale"></div>
             {/* Dynamic Blobs */}
             <div className="absolute top-[30%] left-[40%] w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px] animate-pulse"></div>
             <div className="absolute bottom-[20%] right-[30%] w-32 h-32 bg-magenta-500/20 rounded-full blur-[50px] animate-pulse" style={{backgroundColor: 'rgba(229,0,122,0.1)'}}></div>
             
             <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded border border-white/10">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase leading-none block mb-1">Capa Activa</span>
                      <span className="text-xs font-bold text-white uppercase tracking-tight">Obras vs Quejas de Agua</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                      <div className="w-3 h-3 rounded-full bg-magenta-500" style={{backgroundColor:'var(--magenta)'}}></div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="text-[10px] font-mono text-slate-400 p-2 bg-black/40 rounded">LAT: 21.5090° N</div>
                   <div className="text-[10px] font-mono text-slate-400 p-2 bg-black/40 rounded">LNG: 104.8947° W</div>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-[#161920] border border-slate-800 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-6">Implementación Territorial (Top Colonias)</h4>
          <div className="space-y-4">
             {[
               { name: 'Linda Vista', growth: 88, status: 'Saturado', color: 'bg-emerald-500' },
               { name: 'San Juan', growth: 64, status: 'Campaña', color: 'bg-cyan-500' },
               { name: 'Lomas Altas', growth: 42, status: 'Alerta', color: 'bg-rose-500' },
               { name: 'Puga', growth: 28, status: 'Pendiente', color: 'bg-slate-700' },
             ].map((col, i) => (
               <div key={i} className="space-y-2 p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-1">
                     <p className="text-[11px] font-bold text-white">{col.name}</p>
                     <span className={cn(
                       "text-[8px] font-black uppercase px-2 py-1 rounded",
                       col.status === 'Saturado' ? "bg-emerald-500/10 text-emerald-400" : 
                       col.status === 'Alerta' ? "bg-rose-500/10 text-rose-400" : "bg-cyan-500/10 text-cyan-400"
                     )}>{col.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${col.growth}%` }} className={`h-full ${col.color}`} />
                     </div>
                     <span className="text-[10px] font-black text-white">{col.growth}%</span>
                  </div>
               </div>
             ))}
          </div>
          <button 
            onClick={handleReport}
            disabled={isGenerating}
            className="w-full mt-6 py-2.5 rounded-lg bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isGenerating ? 'Generando...' : 'Desbloquear Estrategia Barrio'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BienestarView() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-6 pt-12">
      <div className="rounded-full bg-pink-500/10 w-24 h-24 flex items-center justify-center mx-auto border border-pink-500/20">
         <HeartHandshake className="w-12 h-12 text-pink-400" />
      </div>
      <h3 className="text-3xl font-bold text-white">Bienestar Social</h3>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
        Integración programática. <br/>
        El padrón único alinea a los beneficiarios de Estado y Municipio mediante la IDN-U, eliminando duplicidad de apoyos sociales y correlacionando datos del triaje médico con despensas o subsidios.
      </p>
      
      <div className="pt-8">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-300">
          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
          Sincronizando padrones...
        </span>
      </div>
    </div>
  );
}

function MetricView() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Métricas Integrales de Gobierno</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161920] border border-slate-800 p-6 rounded-2xl">
          <h4 className="text-sm font-semibold text-slate-400 mb-4">Adopción de Servicios Digitales</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontFamily="'JetBrains Mono', monospace" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontFamily="'JetBrains Mono', monospace" tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#8b5cf6', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function GabineteView() {
  const officials = [
    {
      name: "Geraldine Ponce",
      title: "Presidenta Municipal",
      department: "Presidencia",
      kpiName: "Aprobación Ciudadana",
      kpiValue: "84%",
      kpiStatus: "positive",
      avatar: "https://images.unsplash.com/photo-1586996292898-71f4036c4e07?w=200&h=200&fit=crop&crop=faces",
      responseTime: "< 24h",
      projects: 12
    },
    {
      name: "Alejandro Galván",
      title: "Jefe de Gabinete",
      department: "Gabinete",
      kpiName: "Eficiencia Operativa",
      kpiValue: "92%",
      kpiStatus: "positive",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces",
      responseTime: "< 12h",
      projects: 8
    },
    {
      name: "Mtra. Blanca Simancas",
      title: "Secretaria del Ayuntamiento",
      department: "Secretaría",
      kpiName: "Trámites Digitalizados",
      kpiValue: "80%",
      kpiStatus: "neutral",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
      responseTime: "< 48h",
      projects: 5
    },
    {
      name: "Lic. Carlos Robles",
      title: "Director de Obras Públicas",
      department: "Infraestructura",
      kpiName: "Obras en Tiempo",
      kpiValue: "88%",
      kpiStatus: "positive",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces",
      responseTime: "< 72h",
      projects: 24
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-black text-white mb-2">Gabinete en Tiempo Real</h2>
        <p className="text-slate-400">Adiós al directorio web tradicional. Aquí los ciudadanos evalúan el desempeño real, el tiempo de respuesta y la eficiencia de cada servidor público. Cuentas claras para construir confianza.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#161920] rounded-xl p-6 border border-slate-800">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Gabinete</div>
          <div className="text-3xl font-black text-white">42</div>
          <div className="text-emerald-400 text-sm font-bold mt-2">100% Declaración 3de3</div>
        </div>
        <div className="bg-[#161920] rounded-xl p-6 border border-slate-800">
          <div className="text-slate-400 text-sm font-medium mb-1">Promedio Respuesta</div>
          <div className="text-3xl font-black text-white">18h</div>
          <div className="text-emerald-400 text-sm font-bold mt-2">-40% vs Administración Anterior</div>
        </div>
        <div className="bg-[#161920] rounded-xl p-6 border border-slate-800">
          <div className="text-slate-400 text-sm font-medium mb-1">Evaluación Ciudadana</div>
          <div className="text-3xl font-black text-emerald-400">8.9/10</div>
          <div className="text-slate-500 text-sm mt-2">Basado en NayaritID</div>
        </div>
        <div className="bg-[#161920] rounded-xl p-6 border border-slate-800">
          <div className="text-slate-400 text-sm font-medium mb-1">Iniciativas Cumplidas</div>
          <div className="text-3xl font-black text-white">142</div>
          <div className="text-emerald-400 text-sm font-bold mt-2">Validadas por C5</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {officials.map((official, i) => (
          <div key={i} className="bg-[#161920] rounded-xl border border-slate-800 overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-slate-800 group-hover:border-emerald-500/50 transition-colors">
                <img src={official.avatar} alt={official.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-white text-lg">{official.name}</h3>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">{official.title}</p>
              <p className="text-slate-500 text-sm">{official.department}</p>
            </div>
            <div className="border-t border-slate-800 bg-[#0a0a0c] p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-400 text-xs">{official.kpiName}</span>
                <span className={cn("text-sm font-bold", official.kpiStatus === 'positive' ? "text-emerald-400" : "text-amber-400")}>{official.kpiValue}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-400 text-xs">Tiempo Respuesta</span>
                <span className="text-slate-300 text-sm font-mono">{official.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Proyectos C5</span>
                <span className="text-slate-300 text-sm font-mono">{official.projects} Activos</span>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/10 border-t border-emerald-500/20 text-center cursor-pointer hover:bg-emerald-500/20 transition-colors">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Auditar Funcionario</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
