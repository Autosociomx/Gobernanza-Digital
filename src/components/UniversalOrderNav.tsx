import React, { useState } from 'react';
import { 
  Folder, 
  Globe, 
  Users, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Bot, 
  Mic, 
  Menu, 
  X,
  Home,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UniversalFolder {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  bgColor: string;
  borderColor: string;
  viewTarget: 'landing' | 'orbe' | 'citizen' | 'c5' | 'executive' | 'dev';
  description: string;
  submodules: Array<{ id: string; name: string; tab?: string; modulo?: string }>;
}

export const UNIVERSAL_FOLDERS: UniversalFolder[] = [
  {
    id: 'folder-orbe',
    name: 'Carpeta 1: Ventanilla Única & Orbe Central',
    shortName: '1. Orbe Central IA',
    icon: Globe,
    color: 'text-[#0EA5E9]',
    bgColor: 'bg-[#0EA5E9]/10',
    borderColor: 'border-[#0EA5E9]/30',
    viewTarget: 'orbe',
    description: 'Atención conversacional multilingüe por voz, cero formularios y reaseguro emocional.',
    submodules: [
      { id: 'orbe-conversacion', name: 'Diálogo Natural Multilingüe' },
      { id: 'orbe-3d', name: 'Holograma 3D de Nodos' },
      { id: 'orbe-matriz', name: 'Matriz de Módulos Conversacionales' },
    ]
  },
  {
    id: 'folder-citizen',
    name: 'Carpeta 2: Portal Ciudadano & Servicios Municipal',
    shortName: '2. Portal Ciudadano',
    icon: Users,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    viewTarget: 'citizen',
    description: 'Trámites de residencia, pagos prediales, servicios públicos y atención médica.',
    submodules: [
      { id: 'citizen-home', name: 'Inicio & Resumen', tab: 'home' },
      { id: 'citizen-[#services]', name: 'Reporte de Servicios Públicos', tab: 'services' },
      { id: 'citizen-letters', name: 'Constancias de Residencia', tab: 'municipal_letters' },
      { id: 'citizen-payments', name: 'Tesoreria & Pagos', tab: 'payments' },
      { id: 'citizen-forum', name: 'Redes de Vecinos & Foro', tab: 'forum' },
    ]
  },
  {
    id: 'folder-c5',
    name: 'Carpeta 3: C5 Centro de Control & Gobernanza',
    shortName: '3. C5 Gobernanza Hub',
    icon: Building2,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    viewTarget: 'c5',
    description: 'Panel de control de presupuesto, obras públicas, agrovisión y mapa en tiempo real.',
    submodules: [
      { id: 'c5-tesoreria', name: 'Tesorería Digital', modulo: 'tesoreria' },
      { id: 'c5-obras', name: 'Trazabilidad de Obras', modulo: 'obras' },
      { id: 'c5-servicios', name: 'Atención a Servicios', modulo: 'servicios' },
      { id: 'c5-gabinete', name: 'Gabinete en Tiempo Real', modulo: 'gabinete' },
      { id: 'c5-agrovision', name: 'Agrovisión 3D', modulo: 'agrovision' },
      { id: 'c5-observatorio', name: 'Observatorio Digital', modulo: 'observatorio' },
    ]
  },
  {
    id: 'folder-executive',
    name: 'Carpeta 4: Carpeta Estratégica & Presidencia',
    shortName: '4. Carpeta Presidencial',
    icon: ShieldCheck,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    viewTarget: 'executive',
    description: 'Dossier institucional, agentes de presidencia, defensa de pitch y whitepaper.',
    submodules: [
      { id: 'exec-presidencial', name: 'Agentes Presidenciales' },
      { id: 'exec-dossier', name: 'Dossier Institucional' },
      { id: 'exec-whitepaper', name: 'Whitepaper Soberanía' },
    ]
  },
  {
    id: 'folder-dev',
    name: 'Carpeta 5: Guía & Auditoría LNETB',
    shortName: '5. Guía & Auditoría',
    icon: CheckCircle2,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    viewTarget: 'dev',
    description: 'Verificación de la Ley Nacional para Eliminar Trámites Burocráticos.',
    submodules: [
      { id: 'dev-checklist', name: 'Checklist LNETB' },
      { id: 'dev-matrix', name: 'Matriz de Cumplimiento' },
    ]
  }
];

interface UniversalOrderNavProps {
  currentView: 'landing' | 'orbe' | 'citizen' | 'c5' | 'executive' | 'dev';
  currentSubItem?: string;
  onNavigate: (view: 'landing' | 'orbe' | 'citizen' | 'c5' | 'executive' | 'dev', options?: { tab?: string; modulo?: string }) => void;
  onOpenVoiceAssistant?: () => void;
}

export const UniversalOrderNav: React.FC<UniversalOrderNavProps> = ({
  currentView,
  currentSubItem,
  onNavigate,
  onOpenVoiceAssistant
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);

  // Find active folder
  const activeFolder = UNIVERSAL_FOLDERS.find(f => f.viewTarget === currentView) || UNIVERSAL_FOLDERS[0];

  return (
    <nav className="w-full bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Bar Row */}
        <div className="flex items-center justify-between h-14 md:h-16 gap-3">
          
          {/* Left: Brand & Universal Breadcrumb */}
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 group shrink-0"
              title="Volver a la portada principal"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-center font-serif font-black text-amber-400 group-hover:border-amber-400 transition-colors">
                N
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-black text-white tracking-tight leading-none block">Nayarit Digital</span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block">Orden Funcional 2026</span>
              </div>
            </button>

            <div className="h-5 w-px bg-slate-800 shrink-0" />

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-1.5 text-xs font-mono truncate">
              <span className="text-slate-500 hidden lg:inline">Orden:</span>
              
              {/* Folder Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFolderDropdownOpen(!folderDropdownOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${activeFolder.bgColor} ${activeFolder.color} ${activeFolder.borderColor}`}
                >
                  <activeFolder.icon size={14} className="shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-[200px]">{activeFolder.shortName}</span>
                  <ChevronRight size={12} className={`shrink-0 transition-transform ${folderDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Dropdown Menu for Folders */}
                <AnimatePresence>
                  {folderDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 w-72 md:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1"
                    >
                      <div className="text-[10px] font-mono font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                        Estructura de Carpetas Funcionales:
                      </div>
                      {UNIVERSAL_FOLDERS.map((f) => {
                        const isCurrent = f.viewTarget === currentView;
                        return (
                          <button
                            key={f.id}
                            onClick={() => {
                              setFolderDropdownOpen(false);
                              onNavigate(f.viewTarget);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                              isCurrent ? 'bg-slate-800 text-white border border-slate-700' : 'hover:bg-slate-800/60 text-slate-300'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${f.bgColor} ${f.color} shrink-0 mt-0.5`}>
                              <f.icon size={16} />
                            </div>
                            <div>
                              <div className="text-xs font-bold flex items-center gap-1">
                                {f.shortName}
                                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                              </div>
                              <p className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                                {f.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {currentSubItem && (
                <>
                  <ChevronRight size={12} className="text-slate-600 shrink-0" />
                  <span className="text-slate-300 font-semibold truncate max-w-[100px] sm:max-w-[180px]">
                    {currentSubItem}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Official GitHub Repo Button */}
            <a
              href="https://github.com/Autosociomx/Gobernanza-digital-.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-medium transition"
              title="Repositorio Oficial en GitHub"
            >
              <Code size={14} className="text-amber-400" />
              <span>GitHub Repo</span>
            </a>

            {/* Quick Aura Voice Assistant Trigger */}
            {onOpenVoiceAssistant && (
              <button
                onClick={onOpenVoiceAssistant}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0EA5E9]/15 hover:bg-[#0EA5E9]/25 text-[#0EA5E9] border border-[#0EA5E9]/30 text-xs font-bold transition shadow-sm"
                title="Hablar con Aura IA en cualquier momento"
              >
                <Bot size={15} className="animate-pulse" />
                <span className="hidden sm:inline">Hablar con Aura</span>
                <Mic size={12} className="text-emerald-400 animate-pulse" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Abrir menú de carpetas"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Horizontal Desktop Folder Tabs Row */}
        <div className="hidden md:flex items-center gap-2 py-2 overflow-x-auto border-t border-slate-800/60 no-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold shrink-0 mr-1">
            Carpetas:
          </span>
          {UNIVERSAL_FOLDERS.map((folder) => {
            const isActive = folder.viewTarget === currentView;
            return (
              <button
                key={folder.id}
                onClick={() => onNavigate(folder.viewTarget)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition font-mono shrink-0 border ${
                  isActive
                    ? `${folder.bgColor} ${folder.color} ${folder.borderColor} shadow-sm ring-1 ring-white/10`
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <folder.icon size={14} />
                <span>{folder.shortName}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Mobile Drawer Menu for Folders & Order */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3"
          >
            <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Carpetas de Orden Funcional:</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 text-[10px]">Cerrar [X]</button>
            </div>

            <div className="space-y-2">
              {UNIVERSAL_FOLDERS.map((f) => {
                const isActive = f.viewTarget === currentView;
                return (
                  <div key={f.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate(f.viewTarget);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition text-left ${
                        isActive 
                          ? `${f.bgColor} ${f.color} ${f.borderColor}` 
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <f.icon size={18} />
                        <div>
                          <div>{f.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal font-sans">{f.description}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('landing');
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 font-mono hover:text-white"
              >
                <Home size={14} />
                <span>Portada Principal</span>
              </button>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Ventanilla Única 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
