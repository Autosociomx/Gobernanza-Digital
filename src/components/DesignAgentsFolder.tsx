import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Layers, 
  Sparkles, 
  Eye, 
  Monitor, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  Terminal, 
  Play, 
  RefreshCw, 
  Maximize2, 
  Layout, 
  Type, 
  Sliders, 
  ShieldCheck, 
  Compass, 
  Sun, 
  Moon, 
  Contrast, 
  ArrowLeft,
  Paintbrush,
  Code2,
  Boxes,
  MapPin,
  Cpu
} from 'lucide-react';

export interface DesignAgent {
  id: string;
  codeNumber: string;
  name: string;
  roleTitle: string;
  focusArea: 'PÁGINA_PRINCIPAL' | 'ECOSISTEMA_SOATM' | 'ACCESIBILIDAD_TOKENS' | 'CARTOGRAFIA_UI';
  icon: any;
  status: 'OPTIMIZADO' | 'EN_EJECUCION' | 'ESTANDAR_NACIONAL';
  codeAnchor: string;
  description: string;
  designRule: string;
  soatmImpact: string;
  palettePreview?: { name: string; hex: string }[];
  sampleCommand: string;
  agentResponse: string;
}

export const DESIGN_AGENTS_DATA: DesignAgent[] = [
  {
    id: 'design-agent-01',
    codeNumber: 'DISEÑO 01',
    name: 'Arquitecto de Tokens & Paleta Soberana',
    roleTitle: 'Controlador de Colorimetría, Tipografía y Tokens de Gobierno Digital',
    focusArea: 'ACCESIBILIDAD_TOKENS',
    icon: Palette,
    status: 'OPTIMIZADO',
    codeAnchor: 'src/index.css & tailwind.config.js (WCAG AAA)',
    description: 'Establece y audita los valores cromáticos oficiales (#0FA3B1 Cian Nayarit, #1D2D44 Azul Soberano, #F5A623 Oro Institucional) e implementa la escala tipográfica armónica con Playfair Display para encabezados ceremoniales y Plus Jakarta Sans para legibilidad en pantalla.',
    designRule: 'Prohibidos los degradados morado-azul genéricos y textos cian brillantes en fondos claros. Relación de contraste mínima de 4.5:1 para texto normal y 3:1 para texto grande.',
    soatmImpact: 'Unifica la identidad visual en los 42 componentes del ecosistema SOATM sin discrepancias de color entre municipios.',
    palettePreview: [
      { name: 'Cian Nayarit', hex: '#0FA3B1' },
      { name: 'Azul Soberano', hex: '#1D2D44' },
      { name: 'Oro Institucional', hex: '#F5A623' },
      { name: 'Gris Grafito', hex: '#0F172A' },
      { name: 'Blanco Papel', hex: '#F8FAFC' }
    ],
    sampleCommand: 'auditar_contraste_tokens_soatm()',
    agentResponse: '✓ Inspección Cromática Superada: 100% de los botones y etiquetas cumplen norma WCAG AAA (Contraste 7.2:1 promedio).'
  },
  {
    id: 'design-agent-02',
    codeNumber: 'DISEÑO 02',
    name: 'Guardián Anti-Slop & Jerarquía Rítmica',
    roleTitle: 'Inspector de Maquetación Sobria y Eliminación de Clichés IA',
    focusArea: 'PÁGINA_PRINCIPAL',
    icon: Layout,
    status: 'EN_EJECUCION',
    codeAnchor: 'src/components/PlatformLanding.tsx & CitizenOS.tsx',
    description: 'Aplica reglas estrictas de diagramación: elimina tarjetas anidadas dentro de tarjetas, remueve bordes laterales de adorno, impone la matemática de bordes redondeados anidados (R_inner = R_outer - Padding) y balancea el espacio negativo.',
    designRule: 'Padding exterior de contenedor siempre >= padding interior de elementos hijos. Radios de esquina limitados a 12px-24px sin sombras excesivas ni brillos neón.',
    soatmImpact: 'Garantiza una estética de gobierno de clase mundial que inspira confianza institucional en la ciudadanía y la Presidencia.',
    sampleCommand: 'verificar_regla_anti_slop_landing()',
    agentResponse: '✓ Cero Clichés Detectados: Estructura plana pulida, separación limpia por espaciado rítmico y tipografía de alta jerarquía.'
  },
  {
    id: 'design-agent-03',
    codeNumber: 'DISEÑO 03',
    name: 'Ingeniero de Componentes del Ecosistema SOATM',
    roleTitle: 'Estandarizador de Controles, Botones y Formularios de Trámites',
    focusArea: 'ECOSISTEMA_SOATM',
    icon: Boxes,
    status: 'ESTANDAR_NACIONAL',
    codeAnchor: 'src/components/CitizenApp.tsx & MunicipalLettersView.tsx',
    description: 'Diseña la biblioteca modular de componentes interactivos: botones primarios con área de toque mínima de 44px para móviles de campo, badges con estados de luz pulsante, campos de texto con iconos limpios y tarjetas de trámites LNETB.',
    designRule: 'Las etiquetas dentro de botones y chips deben mantenerse estrictamente en 1 sola línea (white-space: nowrap). Las zonas táctiles en móvil deben responder sin demoras.',
    soatmImpact: 'Experiencia fluida e intuitiva para ciudadanos en el campo y funcionarios en oficinas municipales.',
    sampleCommand: 'validar_componentes_formulario_tramite()',
    agentResponse: '✓ Sistema de Componentes Validado: 100% de controles optimizados para pantallas táctiles y teclado.'
  },
  {
    id: 'design-agent-04',
    codeNumber: 'DISEÑO 04',
    name: 'Orquestador de Transiciones & Micro-Interacciones',
    roleTitle: 'Especialista en Animación Fluida y Retroalimentación Háptica Visual',
    focusArea: 'PÁGINA_PRINCIPAL',
    icon: Sparkles,
    status: 'OPTIMIZADO',
    codeAnchor: 'src/components/FacialRecognitionScanner.tsx & Motion Layouts',
    description: 'Implementa animaciones con Framer Motion / Motion react: entradas suaves (fade-in/slide-up), loaders de procesamiento biométrico, transiciones de pantalla sin parpadeos y animaciones de radar en el C5.',
    designRule: 'Duración de animación acotada entre 150ms y 300ms con curvas de aceleración naturales. Prohibidas animaciones distractoras en bucle continuo.',
    soatmImpact: 'Sensación de velocidad instantánea y modernidad en cada interacción dentro de la applet.',
    sampleCommand: 'simular_microinteraccion_escaneo_facial()',
    agentResponse: '✓ Secuencia Renderizada: Órbita de escaneo biométrico efectuada a 60fps con transición limpia a confirmación de folio.'
  },
  {
    id: 'design-agent-05',
    codeNumber: 'DISEÑO 05',
    name: 'Diseñador de Accesibilidad Universal y Lectura Ciudadana',
    roleTitle: 'Garante de Inclusión Digital y Lectura para Adultos Mayores y Comunidades',
    focusArea: 'ACCESIBILIDAD_TOKENS',
    icon: Eye,
    status: 'ESTANDAR_NACIONAL',
    codeAnchor: 'src/components/SoberaniaInfantilView.tsx & CompleteProfileView.tsx',
    description: 'Garantiza que la interfaz sea utilizable por cualquier persona independientemente de su edad o capacidad visual. Proporciona soporte para lectores de pantalla, modos de alto contraste y tipografía escalable dinámicamente.',
    designRule: 'Tamaño de fuente mínimo para texto principal: 16px. Altura de línea entre 1.5 y 1.7. Soporte completo de navegación con tecla Tab.',
    soatmImpact: 'Inclusión efectiva para más del 100% de los perfiles poblacionales de Nayarit y el país.',
    sampleCommand: 'evaluar_accesibilidad_lectura_ciudadana()',
    agentResponse: '✓ Certificación de Accesibilidad Aprobada: Soporte completo para lectores de pantalla y modo de alto contraste activable.'
  },
  {
    id: 'design-agent-06',
    codeNumber: 'DISEÑO 06',
    name: 'Cartógrafo Vectorial & UI Espacial Territorial',
    roleTitle: 'Diseñador de Capas Visuales de Mapas e Infraestructura IUN',
    focusArea: 'CARTOGRAFIA_UI',
    icon: MapPin,
    status: 'OPTIMIZADO',
    codeAnchor: 'src/components/NayaritMap.tsx & SovereignMap.tsx',
    description: 'Diseña la representación gráfica del mapa de Nayarit y los planos urbanos en el C5, Padrón IUN y Reportes Ciudadanos, utilizando SVG interactivo, marcadores estilizados y leyendas de bajo consumo de datos.',
    designRule: 'Los mapas deben adaptarse dinámicamente con ResizeObserver y mantener iconos legibles incluso a baja resolución.',
    soatmImpact: 'Visualización clara e intuitiva de la distribución de patrullas, centros de salud y obras comunitarias en todo el territorio.',
    sampleCommand: 'renderizar_capa_cartografica_c5()',
    agentResponse: '✓ Mapa Vectorial Creado: 20 municipios representados con coordenadas de precisión y balanceador visual de densidad.'
  }
];

export function DesignAgentsFolder({ onBack }: { onBack?: () => void }) {
  const [selectedAgent, setSelectedAgent] = useState<DesignAgent>(DESIGN_AGENTS_DATA[0]);
  const [filter, setFilter] = useState<string>('TODOS');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);
  
  // Interactive Design Preview States
  const [previewTheme, setPreviewTheme] = useState<'OFICIAL' | 'NOCTURNO' | 'ALTO_CONTRASTE'>('OFICIAL');
  const [fontSizeScale, setFontSizeScale] = useState<number>(100);

  const filteredAgents = filter === 'TODOS'
    ? DESIGN_AGENTS_DATA
    : DESIGN_AGENTS_DATA.filter(a => a.focusArea === filter);

  const handleRunCommand = (agent: DesignAgent) => {
    setIsSimulating(true);
    setSimOutput(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimOutput(agent.agentResponse);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Banner Principal de Agentes de Diseño */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-[#0FA3B1]/20 border border-purple-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-purple-400" />
                Agentes de Diseño UI/UX
              </span>
              <span className="text-slate-400 text-xs font-mono">Página Principal & Ecosistema SOATM</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
              Sistema de Agentes de Diseño & Gobernanza Visual
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Los 6 Agentes Especializados en Diseño UI/UX velan por la consistencia cromática, accesibilidad universal (WCAG AAA), ausencia de clichés visuales (Anti-Slop) y rendimiento responsivo en cada pantalla de Nayarit Digital y el portal nacional de la Presidencia.
            </p>
          </div>

          {onBack && (
            <button 
              onClick={onBack}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#0FA3B1]" />
              <span>Volver</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Theme & Typography Live Studio Controls */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#0FA3B1]" />
          <span className="font-bold text-white">Simulador de Tema & Accesibilidad:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewTheme('OFICIAL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              previewTheme === 'OFICIAL' ? 'bg-[#0FA3B1] text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Oficial Institucional</span>
          </button>

          <button
            onClick={() => setPreviewTheme('NOCTURNO')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              previewTheme === 'NOCTURNO' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Nocturno C5</span>
          </button>

          <button
            onClick={() => setPreviewTheme('ALTO_CONTRASTE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              previewTheme === 'ALTO_CONTRASTE' ? 'bg-yellow-400 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span>Alto Contraste</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Type className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Escala Tipográfica:</span>
          <input 
            type="range" 
            min="90" 
            max="125" 
            value={fontSizeScale} 
            onChange={(e) => setFontSizeScale(Number(e.target.value))}
            className="w-24 accent-[#0FA3B1]" 
          />
          <span className="font-mono font-bold text-cyan-300">{fontSizeScale}%</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'TODOS', label: 'Los 6 Agentes de Diseño' },
          { id: 'PÁGINA_PRINCIPAL', label: 'Página Principal Landing' },
          { id: 'ECOSISTEMA_SOATM', label: 'Ecosistema SOATM' },
          { id: 'ACCESIBILIDAD_TOKENS', label: 'Tokens y Accesibilidad' },
          { id: 'CARTOGRAFIA_UI', label: 'Cartografía UI' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filter === f.id
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Master Grid: Agent Selector + Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of Design Agents */}
        <div className="lg:col-span-5 space-y-3">
          {filteredAgents.map((agent) => {
            const IconComp = agent.icon;
            const isSelected = selectedAgent.id === agent.id;

            return (
              <motion.div
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent);
                  setSimOutput(null);
                }}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-purple-500 shadow-xl shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-850 hover:bg-slate-900'
                }`}
              >
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500"></div>}

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-extrabold text-purple-400">{agent.codeNumber}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold">
                        {agent.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate">{agent.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{agent.roleTitle}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Agent Deep Inspector & Interactive Sandbox */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  {React.createElement(selectedAgent.icon, { className: 'w-7 h-7' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-purple-400">{selectedAgent.codeNumber}</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs font-mono text-slate-400">{selectedAgent.focusArea}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedAgent.name}</h3>
                  <p className="text-xs text-slate-400">{selectedAgent.roleTitle}</p>
                </div>
              </div>
            </div>

            {/* Code Anchor */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
              <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Anclaje en Código Fuente</p>
                <p className="text-xs font-mono font-bold text-purple-300 truncate">{selectedAgent.codeAnchor}</p>
              </div>
            </div>

            {/* Description & Design Rule */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                <h5 className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Función Principal de Diseño</span>
                </h5>
                <p className="text-slate-300">{selectedAgent.description}</p>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                <h5 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Regla Inviolable de Diseño (Anti-Slop / WCAG)</span>
                </h5>
                <p className="text-slate-300">{selectedAgent.designRule}</p>
              </div>

              {/* Palette Preview if available */}
              {selectedAgent.palettePreview && (
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80 space-y-2">
                  <h5 className="font-bold text-white text-xs">Muestrario de Tokens Cromáticos:</h5>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedAgent.palettePreview.map((c, idx) => (
                      <div key={idx} className="text-center space-y-1">
                        <div 
                          className="h-10 rounded-xl border border-white/10 shadow-inner" 
                          style={{ backgroundColor: c.hex }}
                        ></div>
                        <p className="text-[9px] font-bold text-slate-300 truncate">{c.name}</p>
                        <p className="text-[9px] font-mono text-slate-500">{c.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Interactive Agent Terminal */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-bold font-mono">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Consola del Agente de Diseño</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Test en Tiempo Real</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between gap-2 text-slate-400">
                <span className="text-purple-300 font-bold">$ {selectedAgent.sampleCommand}</span>
                <button
                  onClick={() => handleRunCommand(selectedAgent)}
                  disabled={isSimulating}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-sans font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {isSimulating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  <span>{isSimulating ? 'Analizando...' : 'Ejecutar'}</span>
                </button>
              </div>

              {simOutput && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 bg-slate-900 border border-purple-500/30 rounded-xl text-purple-300 text-[11px] leading-relaxed"
                >
                  {simOutput}
                </motion.div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
