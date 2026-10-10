import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Baby, 
  QrCode, 
  KeyRound, 
  Users, 
  FileText, 
  CheckCircle2, 
  Lock, 
  EyeOff, 
  Smartphone, 
  Building2, 
  AlertTriangle, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Award, 
  BookOpen, 
  Landmark, 
  ChevronRight, 
  Download, 
  ShieldAlert,
  ArrowRight,
  Fingerprint,
  FileCode,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

type Tab = 'simulador' | 'ley' | 'foros' | 'denuncia' | 'arquitectura';

export function SoberaniaInfantilView({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('simulador');

  // Simulator State
  const [tutorName, setTutorName] = useState('María Elena González');
  const [tutorIne, setTutorIne] = useState('1892837482931');
  const [childName, setChildName] = useState('Mateo González');
  const [childCurp, setChildCurp] = useState('GOMA120518HNTNNM04');
  const [childAge, setChildAge] = useState(13);
  const [selectedState, setSelectedState] = useState('Nayarit');
  const [selectedPlatform, setSelectedPlatform] = useState('Roblox');
  
  const [isActivated, setIsActivated] = useState(true);
  const [verifyingPlatform, setVerifyingPlatform] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<any>(null);
  const [tokenNonce, setTokenNonce] = useState('SINISI-7890-3482-AURA-2026');

  // Denuncia 24/7 State
  const [denunciaType, setDenunciaType] = useState('grooming');
  const [denunciaDesc, setDenunciaDesc] = useState('');
  const [denunciaSent, setDenunciaSent] = useState(false);

  const handleSimulateVerification = () => {
    setVerifyingPlatform(true);
    setVerifiedResult(null);

    setTimeout(() => {
      const newNonce = 'SINISI-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-AURA-2026';
      setTokenNonce(newNonce);
      setVerifyingPlatform(false);
      setVerifiedResult({
        timestamp: new Date().toLocaleTimeString('es-MX'),
        token: newNonce,
        isMinorUnder16: childAge < 16,
        isParentAuthorized: isActivated,
        platform: selectedPlatform,
        dataExposed: 'NINGUNO (0 bytes de datos personales, CURP o biometría compartidos)'
      });
    }, 1200);
  };

  const handleSendDenuncia = (e: React.FormEvent) => {
    e.preventDefault();
    setDenunciaSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 border-b border-emerald-500/30 px-4 py-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                SINISI · Propuesta Federal 32 Estados
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold tracking-widest">
                Llave Infantil MX
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Soberanía Digital Infantil
              <Baby className="text-emerald-400" size={32} />
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Sistema Nacional de Identidad y Soberanía Digital Infantil sobre la infraestructura de Becas Benito Juárez y Banco del Bienestar. Doble anonimato y cero biometría privada.
            </p>
          </div>

          {onBack && (
            <button 
              onClick={onBack}
              className="self-start md:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-2"
            >
              ← Volver al Portal
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {[
            { id: 'simulador', label: 'Simulador Doble Anonimato', icon: QrCode },
            { id: 'ley', label: 'Iniciativa de Ley General', icon: FileText },
            { id: 'foros', label: 'Discursos Foros 2026', icon: Landmark },
            { id: 'denuncia', label: 'Agencia Denuncia 24/7', icon: ShieldAlert },
            { id: 'arquitectura', label: 'Arquitectura & Océano Azul', icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  active 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        
        {/* TAB 1: SIMULADOR DOBLE ANONIMATO */}
        {activeTab === 'simulador' && (
          <div className="space-y-6">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400">
                  <EyeOff size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-200">Principio de Doble Anonimato (Modelo Ley SREN / France Identité)</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                    El Estado certifica la minoridad y la autorización parental. La plataforma (Roblox, TikTok, Discord) <strong>sólo recibe un token firmado anónimo</strong>. NUNCA se entrega la CURP, nombre, biometría o dirección del menor.
                  </p>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30">
                12M Becarios Rampa Inicial
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Tutor App Control */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="text-emerald-400" size={20} />
                    <h3 className="font-bold text-sm text-slate-100">App del Tutor (Llave Digital)</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    ACTIVADO EN BANCO BIENESTAR
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tutor Legal (INE Validado)</label>
                    <input 
                      type="text" 
                      value={tutorName}
                      onChange={(e) => setTutorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nombre del Menor</label>
                      <input 
                        type="text" 
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Edad del Menor</label>
                      <input 
                        type="number" 
                        value={childAge}
                        onChange={(e) => setChildAge(parseInt(e.target.value) || 12)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Entidad Federativa</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-emerald-500 outline-none"
                    >
                      {['Nayarit', 'Nuevo León', 'Chiapas', 'Guerrero', 'Ciudad de México', 'Jalisco', 'Veracruz', 'Oaxaca', 'Puebla'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-200">Estado del Permiso Parental</p>
                      <p className="text-[10px] text-slate-400">Controlable en tiempo real por el tutor</p>
                    </div>
                    <button
                      onClick={() => setIsActivated(!isActivated)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isActivated 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {isActivated ? <Check size={14} /> : <X size={14} />}
                      {isActivated ? 'AUTORIZADO' : 'REVOCADO'}
                    </button>
                  </div>
                </div>

                {/* QR Dinámico del Menor en el dispositivo del Tutor */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-3">
                  <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">QR Dinámico de Verificación Presencial/Remota</p>
                  <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
                    <QRCodeSVG 
                      value={`https://sinisi.gob.mx/verify?nonce=${tokenNonce}&state=${selectedState}&age=${childAge}`} 
                      size={140} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Token criptográfico firmado con clave privada local.<br />Caduca en 120 segundos.
                  </p>
                </div>
              </div>

              {/* Right Column: Platform Simulator */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="text-indigo-400" size={20} />
                    <h3 className="font-bold text-sm text-slate-100">Plataforma Digital Externa (Integrador API Ley General)</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold border border-indigo-500/30">
                    OBLIGACIÓN ART. 3 LEY GENERAL
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seleccionar Plataforma</label>
                      <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 outline-none"
                      >
                        {['Roblox', 'TikTok', 'Discord', 'Instagram Kids', 'Minecraft Server', 'YouTube Kids'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mecanismo Exigido por Ley</label>
                      <input 
                        type="text" 
                        disabled 
                        value="Botón Oficial Gobierno de México" 
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 text-center space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-200">Simulación de intento de creación de cuenta en {selectedPlatform}</h4>
                      <p className="text-xs text-slate-400">El menor intenta registrarse. La ley prohíbe pedirle selfie o biometría.</p>
                    </div>

                    <button
                      onClick={handleSimulateVerification}
                      disabled={verifyingPlatform}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {verifyingPlatform ? (
                        <>
                          <RefreshCw className="animate-spin" size={16} />
                          Verificando con SINISI (Doble Anonimato)...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          Verificar Edad con Gobierno de México
                        </>
                      )}
                    </button>
                  </div>

                  {/* Result Box */}
                  <AnimatePresence>
                    {verifiedResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 size={16} />
                            Respuesta Firmada Recibida por {verifiedResult.platform}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{verifiedResult.timestamp}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase">¿Menor de 16 años?</span>
                            <span className={verifiedResult.isMinorUnder16 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                              {verifiedResult.isMinorUnder16 ? 'SÍ (Protección Aplica)' : 'NO (Mayor de 16)'}
                            </span>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-slate-400 block text-[10px] uppercase">¿Autorizado por Tutor?</span>
                            <span className={verifiedResult.isParentAuthorized ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {verifiedResult.isParentAuthorized ? 'AUTORIZADO Y FIRMADO' : 'REVOCADO / SIN PERMISO'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                          <p className="text-[10px] font-mono text-slate-400 uppercase">Token de Sesión Criptográfico (Rotatorio & No Correlacionable):</p>
                          <p className="text-xs font-mono text-indigo-300 break-all">{verifiedResult.token}</p>
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-[11px] text-emerald-300 font-medium flex items-center gap-2">
                          <Lock size={14} className="shrink-0 text-emerald-400" />
                          <span><strong>Garantía de Soberanía:</strong> {verifiedResult.dataExposed}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INICIATIVA DE LEY GENERAL */}
        {activeTab === 'ley' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                    FICHA LEGISLATIVA OFICIAL
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-100 mt-2">
                    Ley General de Soberanía Digital de Niñas, Niños y Adolescentes
                  </h2>
                  <p className="text-xs text-slate-400">Fundamento: Art. 73 Constitucional Fracc. XXIX-P y Art. 4º (Interés Superior de la Niñez)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">Costo Presupuestal:</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">MARGINAL (Aprovecha Banco del Bienestar)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    num: 'Artículo 1',
                    title: 'Derecho a la Soberanía Digital Infantil',
                    content: 'Derecho de NNA a acreditar edad sin revelar identidad, consentimiento parental verificable obligatorio para menores de 16 años, y prohibición expresa de que particulares traten datos biométricos de menores con fines de verificación de edad.'
                  },
                  {
                    num: 'Artículo 2',
                    title: 'Sistema Nacional (SINISI)',
                    content: 'Creación del Sistema Nacional de Identidad y Soberanía Digital Infantil a cargo de la Federación. Funciona bajo el principio de doble anonimato: el Estado certifica, la plataforma solo recibe tokens firmados sin datos personales.'
                  },
                  {
                    num: 'Artículo 3',
                    title: 'Obligaciones de Plataformas Digitales',
                    content: 'Obliga a integrar la verificación oficial, prohíbe exigir biometría propia, exige aplicar configuración de máxima privacidad por defecto a cuentas de menores y prohíbe publicidad perfilada a menores de edad.'
                  },
                  {
                    num: 'Artículo 4',
                    title: 'Agencia Nacional de Protección Digital',
                    content: 'Órgano con autonomía técnica para auditar algoritmos de recomendación dirigidos a menores, operar sistema de denuncia 24/7 en las 32 entidades y ordenar retiro de contenido dañino en máximo 24 horas.'
                  },
                  {
                    num: 'Artículo 5',
                    title: 'Candados de Voluntariedad y Privacidad',
                    content: 'La activación es gratuita y voluntaria. Prohibición estricta de condicionar la entrega o monto de cualquier programa social (Becas) a la activación de la Llave. Sanción penal por uso indebido del padrón.'
                  },
                  {
                    num: 'Transitorio Clave',
                    title: 'Rampa de Infraestructura de Becas Juárez',
                    content: 'Implementación del SINISI aprovechando la red presencial de entrega de tarjetas del Banco del Bienestar y "Lunes de becas". Programa piloto inicial en 3 entidades (Nuevo León, Chiapas, Guerrero) en los primeros 12 meses.'
                  }
                ].map((art, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-emerald-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">{art.num}</span>
                      <ShieldCheck size={16} className="text-slate-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-200">{art.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{art.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DISCURSOS FOROS 2026 */}
        {activeTab === 'foros' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                  CALENDARIO DE FOROS REGIONALES 2026
                </span>
                <h2 className="text-xl font-extrabold text-slate-100 mt-2">
                  Discursos y Postura Técnica para los Foros Estatales
                </h2>
                <p className="text-xs text-slate-400">Intervenciones preparadas de 3 minutos para convocar al respaldo legislativo federal y local.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    date: '19-AGO-2026',
                    state: 'Nuevo León',
                    focus: 'Alta Conectividad y Ecosistema Tecnológico',
                    quote: '"Nuevo León demuestra que no necesitamos elegir entre innovación tecnológica y la seguridad de nuestros hijos. Con el doble anonimato, le quitamos la excusa a las plataformas."'
                  },
                  {
                    date: '03-SEP-2026',
                    state: 'Chiapas',
                    focus: 'Ruralidad, Pueblos Indígenas e Inclusión Universal',
                    quote: '"Soberanía digital significa que una niña tzotzil en los Altos de Chiapas tenga exactamente el mismo escudo de protección ante corporaciones globales que un menor en la capital."'
                  },
                  {
                    date: '17-SEP-2026',
                    state: 'Guerrero',
                    focus: 'Seguridad Infantil y Prevención de Grooming',
                    quote: '"En Guerrero sabemos lo que significa defender el territorio. Hoy el nuevo territorio es digital y no dejaremos a nuestra niñez desarmada frente a redes de acoso."'
                  }
                ].map((foro, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
                        <span>{foro.date}</span>
                        <MapPin size={14} />
                      </div>
                      <h3 className="text-base font-bold text-slate-200">{foro.state}</h3>
                      <p className="text-[11px] text-slate-400 font-medium mb-3">{foro.focus}</p>
                      <blockquote className="text-xs italic text-slate-300 bg-slate-900 p-3 rounded-lg border-l-2 border-amber-500">
                        {foro.quote}
                      </blockquote>
                    </div>
                    <button className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center justify-center gap-1.5">
                      <BookOpen size={14} /> Leer Discurso Completo (3 min)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DENUNCIA 24/7 */}
        {activeTab === 'denuncia' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/40 text-rose-400">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-100">
                    Agencia Nacional de Protección Digital — Sistema de Denuncia 24/7
                  </h2>
                  <p className="text-xs text-slate-400">Retiro obligatorio de contenido vulneratorio en un plazo máximo de 24 horas y coordinación inmediata con fiscalías locales.</p>
                </div>
              </div>

              {!denunciaSent ? (
                <form onSubmit={handleSendDenuncia} className="space-y-4 bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tipo de Riesgo Identificado</label>
                      <select
                        value={denunciaType}
                        onChange={(e) => setDenunciaType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-200 focus:border-rose-500 outline-none"
                      >
                        <option value="grooming">Acoso o Contacto Inapropiado (Grooming)</option>
                        <option value="biometrics">Exigencia Ilegal de Biometría a Menores</option>
                        <option value="content">Contenido Violento o Inapropiado</option>
                        <option value="ads">Publicidad Perfilada Dirigida a Menores</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Entidad Federativa / Enlace Local</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={`${selectedState} — Fiscalía de Protección Digital`}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Descripción de los Hechos o URL / Plataforma</label>
                    <textarea
                      rows={3}
                      required
                      value={denunciaDesc}
                      onChange={(e) => setDenunciaDesc(e.target.value)}
                      placeholder="Ingrese los detalles, usuario o enlace de la plataforma afectada..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-rose-500 outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Emitir Denuncia Prioritaria 24/7 (Orden de Retiro en 24h)
                  </button>
                </form>
              ) : (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/40">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="text-base font-bold text-emerald-300">Denuncia Registrada con Éxito</h3>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Se ha notificado a la Agencia Nacional de Protección Digital y al Enlace de la Fiscalía de {selectedState}. La plataforma ha sido notificada bajo el apercibimiento del Art. 4 para el retiro preventivo en 24 horas.
                  </p>
                  <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                    Folio: ANPD-2026-NAY-0892
                  </span>
                  <div>
                    <button 
                      onClick={() => setDenunciaSent(false)}
                      className="mt-2 text-xs text-slate-400 hover:text-white underline font-mono"
                    >
                      Emitir otra denuncia
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ARQUITECTURA & OCÉANO AZUL */}
        {activeTab === 'arquitectura' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/30">
                  ESTRATEGIA OCÉANO AZUL DE ESTADO
                </span>
                <h2 className="text-xl font-extrabold text-slate-100 mt-2">
                  ¿Por qué SINISI es imbatible frente a soluciones privadas?
                </h2>
                <p className="text-xs text-slate-400">Reutilización estratégica de activos estatales sin duplicar costos ni pedir presupuestos millonarios.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                    <Award size={18} />
                    Ventaja Única de Infraestructura
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ninguna empresa de tecnología ni gobierno local puede igualar la verificación presencial de tutoría que el Estado ya realiza al entregar tarjetas de las Becas Benito Juárez a 12 millones de familias.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
                    <Sparkles size={18} />
                    Convergencia con Nayarit ID & Llave MX
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Se conecta nativamente con la Llave MX del Gobierno Federal y el Expediente Único de Salud CURP, creando un continuo de protección digital desde el nacimiento hasta la mayoría de edad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
