import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  FileText, 
  User, 
  MessageSquare, 
  Plus,
  Bell,
  Search,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  Lightbulb,
  Droplets,
  Send,
  Loader2,
  Barcode,
  QrCode,
  Heart,
  X,
  Users,
  ShieldCheck,
  LayoutGrid,
  Bot,
  Sparkles,
  Map as MapIcon,
  ShieldAlert,
  EyeOff,
  Download,
  Trash2,
  GraduationCap,
  Activity,
  Fingerprint,
  Play,
  Code,
  Zap,
  Network,
  ArrowRight,
  WifiOff,
  Mic,
  Volume2,
  VolumeX
} from 'lucide-react';
  import { motion, AnimatePresence } from 'motion/react';
  import { cn } from '../lib/utils';
  import { NayaritMap } from './NayaritMap';
import { SaludNayaritID } from './SaludNayaritID';
import { ParlamentoView } from './dashboard/ParlamentoView';
import { NotificationView } from './NotificationView';
import { LegalComplianceDisclaimer } from './LegalComplianceDisclaimer';
import { LoginView } from './LoginView';
import { CompleteProfileView } from './CompleteProfileView';
import { CredentialScannerView } from './CredentialScannerView';
import { MysteryShopperView } from './MysteryShopperView';
import { UrbanReportMapView } from './UrbanReportMapView';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';

import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc, onSnapshot, collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getMasterRegistry, InfrastructureAsset } from '../services/infrastructureService';
import { CanjesView } from './CanjesView';
import { ConnectXAcademy } from './ConnectXAcademy';
import { SystemAuditView } from './SystemAuditView';
import { BananaCommandCenter } from './BananaCommandCenter';
import { StrategicAcademyView } from './StrategicAcademyView';
import { MasterStrategicPlan } from './MasterStrategicPlan';
import { MunicipalLettersView } from './MunicipalLettersView';

import { AuraCertificationSeal } from './AuraCertificationSeal';
import { AvisoLenguaOriginaria } from './AvisoLenguaOriginaria';
import {
  descriptorLengua,
  LENGUAS_CLAVES,
  type LenguaClave,
} from '../../shared/traduccion/lenguas';
import { resolverTexto } from '../../shared/traduccion/registro';
import { useAuraChat } from '../hooks/useAuraChat';
import { useAuraVoice } from '../hooks/useAuraVoice';

type TabType = 'home' | 'forum' | 'networks' | 'payments' | 'services' | 'profile' | 'security' | 'canjes' | 'notifications' | 'auditoria' | 'academy' | 'system_audit' | 'banana_command' | 'strategic_academy' | 'strategic_plan' | 'municipal_letters';
type Language = LenguaClave;

export function CitizenApp({ 
  onLogout, 
  initialTab = 'home',
  initialAction = null 
}: { 
  onLogout: () => void,
  initialTab?: TabType,
  initialAction?: 'chat' | 'triage' | 'map' | null
}) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>({
    name: "",
    documentId: "",
    phone: "",
    email: "",
    address: "",
    neighborhood: "",
    registrationVerified: false
  });
  const [publicWorks, setPublicWorks] = useState<Array<{ lat: number, lng: number, title: string, color?: string }>>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingMapData, setLoadingMapData] = useState(true);
  const isProfileComplete = profile.name && profile.address && profile.documentId;

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: any) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }
  }, []);

  useEffect(() => {
    // Fetch infrastructure
    const fetchWorks = async () => {
        try {
            const works = await getMasterRegistry();
            const markers = works.map((work: InfrastructureAsset) => ({
                lat: work.location.lat,
                lng: work.location.lng,
                title: work.name,
                color: work.status === 'CRITICAL' ? '#EF4444' : work.status === 'RISK' ? '#F59E0B' : '#E5007A'
            }));
            setPublicWorks(markers);
        } catch (err) {
            console.error("Error fetching works:", err);
        } finally {
            setLoadingMapData(false);
        }
    };
    fetchWorks();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Fetch real profile
        const userDoc = doc(db, 'users', u.uid);
        const unsubDoc = onSnapshot(userDoc, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as any);
          } else {
            // Initial profile if not exists
            const initial = {
              name: u.displayName || "Usuario Nayarit",
              email: u.email || "",
              role: 'citizen',
              documentId: "",
              phone: u.phoneNumber || "",
              address: "",
              neighborhood: "",
              registrationVerified: false,
              createdAt: new Date().toISOString()
            };
            setProfile(initial as any);
            setDoc(userDoc, initial).catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${u.uid}`));
          }
          setLoadingProfile(false);
          setIsLoggingIn(false);
        }, (err) => {
          console.error("Firestore snapshot error:", err);
          setLoadingProfile(false);
          setIsLoggingIn(false);
        });
        return () => unsubDoc();
      } else {
        setLoadingProfile(false);
        setIsLoggingIn(false);
      }
    });

    // Fallback security timeout for profile loading
    const timer = setTimeout(() => {
        if (loadingProfile) {
            console.warn("Profile loading timed out.");
            setLoadingProfile(false);
            setIsLoggingIn(false);
        }
    }, 8000);

    return () => {
        unsubscribe();
        clearTimeout(timer);
    };
  }, []);
  
  // ... (rest of the component)

  // In the showMap rendering (near line 478):
  {/* <NayaritMap 
    center={{ lat: 21.5090, lng: -104.8947 }}
    zoom={15}
    markers={publicWorks}
  /> */}


  const [showChat, setShowChat] = useState(initialAction === 'chat');
  const [showMap, setShowMap] = useState(initialAction === 'map');
  const [showTriage, setShowTriage] = useState(initialAction === 'triage');
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [payingItem, setPayingItem] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success' | 'cash_instructions'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [lang, setLang] = useState<Language>('es');
  
  // Las cadenas en náayeri y wixárika ya no viven aquí: viven en
  // shared/traduccion/lexico.ts con estatus, fuente y fecha, y pasan por
  // GuardiaPreEnvio antes de pintarse. La Guardia de regresiones (R9)
  // impide que vuelvan a incrustarse en este archivo.
  const nombreCorto = profile.name ? profile.name.split(' ')[0] : '';
  const t = React.useCallback(
    (clave: string) => resolverTexto(clave, lang, { valores: { nombre: nombreCorto } }).texto,
    [lang, nombreCorto],
  );
  // El encabezado pinta el nombre resaltado aparte, así que parte la plantilla
  // por el marcador {nombre}: no todas las lenguas separan el saludo con coma.
  const [saludoAntes, saludoDespues = ''] = resolverTexto('app.saludo', lang)
    .texto.split('{nombre}');

  // AI Chat State — motor compartido useAuraChat: arma el contexto real de
  // la página (pestaña activa + datos del perfil) en vez del truco anterior
  // de pegar "(Language selected: es)" al final del mensaje.
  const auraVoice = useAuraVoice();
  const [autoSpeak, setAutoSpeak] = useState(false);

  const getPageContext = React.useCallback(() => {
    return `El ciudadano está en la App Ciudadana de Nayarit Digital, en la pestaña "${activeTab}". ` +
      `Nombre: ${profile.name || 'no registrado'}. ` +
      `Interfaz pintada en ${descriptorLengua(lang).nombre}; el asistente responde en español. ` +
      `Conexión: ${isOnline ? 'en línea' : 'sin conexión'}.`;
  }, [activeTab, profile.name, lang, isOnline]);

  const { messages, isTyping, isOnlineMode: isAiMode, sendMessage, resetGreeting } = useAuraChat({
    initialGreeting: t('app.aura.saludo'),
    getPageContext,
    onReply: (respuesta) => { if (autoSpeak) auraVoice.speak(respuesta); },
  });

  useEffect(() => {
    resetGreeting(t('app.aura.saludo'));
  }, [t, resetGreeting]);

  const updateProfile = async (updatedData: any) => {
    if (!user) return;
    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { ...updatedData, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const [inputValue, setInputValue] = useState('');
  const [useThinking, setUseThinking] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [useSearch, setUseSearch] = useState(false);

  const handleShowMap = React.useCallback(() => setShowMap(true), []);
  const handleShowTriage = React.useCallback(() => setShowTriage(true), []);
  const handleGoToForum = React.useCallback(() => setActiveTab('forum'), []);
  const handleGoToProfile = React.useCallback(() => setActiveTab('profile'), []);
  const handleGoToPayments = React.useCallback(() => setActiveTab('payments'), []);
  const handleGoToServices = React.useCallback(() => setActiveTab('services'), []);
  const handleGoToAcademy = React.useCallback(() => setActiveTab('academy'), []);
  const handleGoToSystemAudit = React.useCallback(() => setActiveTab('system_audit'), []);
  const handleGoToBanana = React.useCallback(() => setActiveTab('banana_command'), []);
  const handleGoToStrategy = React.useCallback(() => setActiveTab('strategic_academy'), []);
  const handleGoToStrategicPlan = React.useCallback(() => setActiveTab('strategic_plan'), []);
  const handleGoToLetters = React.useCallback(() => setActiveTab('municipal_letters'), []);
  const handleGoToHome = React.useCallback(() => setActiveTab('home'), []);
  const handleGoToAuditoria = React.useCallback(() => setActiveTab('auditoria'), []);
  const handleGoToSecurity = React.useCallback(() => setActiveTab('security'), []);
  const handleGoToCanjes = React.useCallback(() => setActiveTab('canjes'), []);

  const quickActions = [
    'accion.pagar_predial',
    'accion.reportar_bache',
    'accion.mapa_obras',
    'accion.ayuda',
  ].map((clave) => ({ clave, texto: t(clave) }));

  const handleSendMessage = (text?: string) => {
    const userMsg = text ?? inputValue.trim();
    if (!userMsg) return;
    if (!text) setInputValue('');
    sendMessage(userMsg, { useThinking, useMaps, useSearch });
  };

  const handleVoiceInput = () => {
    if (auraVoice.isListening) {
      auraVoice.stopListening();
      return;
    }
    setAutoSpeak(true);
    auraVoice.startListening((texto) => {
      sendMessage(texto, { useThinking, useMaps, useSearch });
    });
  };

  const generatePaymentRef = async () => {
    const curp = "PEGJ900101HNT";
    const servicio = payingItem?.title || "SERVICIO";
    const seed = `${curp}|${servicio}|${Date.now()}|${Math.random()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const idPago = hashHex.substring(0, 16);
    const ref = (parseInt(idPago.slice(0, 14), 16) % 100000000000000).toString().padStart(14, '0');
    setPaymentRef(ref);
    return ref;
  };

  const barcodeRef = React.useRef<SVGSVGElement>(null);
  const mapMarkers = React.useMemo(() => [
    { lat: 21.5090, lng: -104.8947, title: "Obra Reencarpetamiento San Juan", color: "#E5007A" },
    { lat: 21.5120, lng: -104.8970, title: "Luminaria Reportada", color: "#FACC15" }
  ], []);

  const renderedTab = React.useMemo(() => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            profile={profile}
            isOnline={isOnline}
            reducedMotion={reducedMotion}
            onShowMap={handleShowMap} 
            onShowTriage={handleShowTriage}
            onGoToForum={handleGoToForum}
            onGoToProfile={handleGoToProfile}
            onGoToPayments={handleGoToPayments}
            onGoToServices={handleGoToServices}
            onGoToAcademy={handleGoToAcademy}
            onGoToSystemAudit={handleGoToSystemAudit}
            onGoToBanana={handleGoToBanana}
            onGoToStrategy={handleGoToStrategy}
            onGoToStrategicPlan={handleGoToStrategicPlan}
            onViewManifest={handleGoToStrategicPlan}
            onGoToLetters={handleGoToLetters}
          />
        );
      case 'networks': return <RedesCiudadanasView profile={profile} onBack={handleGoToHome} />;
      case 'forum': return <ParlamentoView onBack={handleGoToHome} />;
      case 'payments': return <TesoreriaYTramitesView onPay={(item: any) => setPayingItem(item)} onBack={handleGoToHome} />;
      case 'services': return <ServiciosYReportesView onShowTriage={handleShowTriage} onGoToAuditoria={handleGoToAuditoria} onBack={handleGoToHome} />;
      case 'profile': return <ProfileView profile={profile} onUpdate={updateProfile} onLogout={onLogout} onBack={handleGoToHome} onGoToSecurity={handleGoToSecurity} onGoToCanjes={handleGoToCanjes} />;
      case 'security': return <SecurityCenterView user={user} onBack={handleGoToProfile} />;
      case 'canjes': return <CanjesView user={user!} onBack={handleGoToProfile} />;
      case 'auditoria': return <MysteryShopperView user={user} onBack={handleGoToServices} />;
      case 'notifications': return <NotificationView onBack={handleGoToHome} />;
      case 'academy': return <ConnectXAcademy onGoToStrategy={handleGoToStrategy} onBack={handleGoToHome} />;
      case 'system_audit': return <SystemAuditView onBack={handleGoToHome} />;
      case 'banana_command': return <BananaCommandCenter onBack={handleGoToHome} />;
      case 'strategic_academy': return <StrategicAcademyView onBack={handleGoToHome} />;
      case 'strategic_plan': return <MasterStrategicPlan onBack={handleGoToHome} />;
      case 'municipal_letters': return <MunicipalLettersView onBack={handleGoToHome} profile={profile} />;
      default: return null;
    }
  }, [
    activeTab, profile, isOnline, reducedMotion, user,
    handleShowMap, handleShowTriage, handleGoToForum, handleGoToProfile,
    handleGoToPayments, handleGoToServices, handleGoToAcademy, handleGoToSystemAudit,
    handleGoToBanana, handleGoToStrategy, handleGoToStrategicPlan, handleGoToLetters,
    handleGoToHome, handleGoToAuditoria, handleGoToSecurity, handleGoToCanjes
  ]);

  useEffect(() => {
    if (paymentStep === 'cash_instructions' && paymentRef && barcodeRef.current) {
      JsBarcode(barcodeRef.current, paymentRef, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 12,
        margin: 10
      });
    }
  }, [paymentStep, paymentRef]);

  return (
    <>
      {loadingProfile ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-magenta-500" />
          <p className="mt-4 font-bold text-slate-400">Verificando sesión...</p>
        </div>
      ) : !user ? (
        <LoginView onLogin={() => setIsLoggingIn(true)} />
      ) : !isProfileComplete ? (
        <CompleteProfileView profile={profile} onUpdate={updateProfile} />
      ) : isLoggingIn ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-magenta-500" />
          <p className="mt-4 font-bold text-slate-400">Autenticando...</p>
        </div>
      ) : (
        <div className="flex justify-center bg-slate-100 min-h-screen">
          {/* Mobile Frame Simulation */}
          <div className="w-full max-w-[430px] bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden border-x border-slate-200">
            
            {/* Offline Banner */}
            {!isOnline && (
              <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest z-[100] shadow-md w-full shrink-0">
                <WifiOff className="w-4 h-4" /> Modo Sin Conexión Activado
              </div>
            )}

            {/* StatusBar Mock */}
        <div className="px-6 pt-4 pb-2 flex justify-between items-center text-[10px] font-bold text-slate-800 shrink-0">
          <span>9:41</span>
          <div className="flex gap-1.5 items-center">
            <span className="w-4 h-3 border border-slate-800 rounded-[2px] relative after:content-[''] after:absolute after:-right-1 after:top-0.5 after:w-0.5 after:h-2 after:bg-slate-800"></span>
            <span className="w-3 h-3 bg-slate-800 rounded-full"></span>
          </div>
        </div>

        {/* Header */}
        <header className="px-6 py-8 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-magenta-500" style={{color:'var(--magenta)'}}>S.O. Municipal de Tepic</span>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full text-[8px] font-black tracking-widest border border-indigo-500/20">VER 18.0</span>
            </div>
            <h1 className="text-3xl font-serif font-black text-slate-900 leading-[0.9] tracking-tighter">
              {saludoAntes.trim()}<br/>
              <span className="text-magenta-600" style={{color:'var(--magenta)'}}>{nombreCorto}{saludoDespues}</span>
            </h1>
            <div className="flex items-center gap-3 mt-4">
               <AuraCertificationSeal />
               <div className="flex gap-2">
               {LENGUAS_CLAVES.map(l => {
                 let activeClass = "";
                 let inlineStyle: any = {};
                 
                 if (lang === l) {
                   if (l === 'es') {
                     activeClass = "bg-magenta-500 text-white";
                     inlineStyle = { backgroundColor: 'var(--magenta)' };
                   } else if (l === 'cora') {
                     // Colores terrosos/cálidos tradicionales Cora
                     activeClass = "bg-orange-600 text-white shadow-sm shadow-orange-500/20";
                     inlineStyle = { backgroundColor: '#ea580c' }; 
                   } else if (l === 'wixarika') {
                     // Colores vibrantes tradicionales Huichol (Wixárika)
                     activeClass = "text-white bg-gradient-to-r from-cyan-400 via-purple-500 to-yellow-400 shadow-sm shadow-cyan-500/20";
                     inlineStyle = {}; 
                   }
                 } else {
                   activeClass = "bg-slate-100 text-slate-400 hover:bg-slate-200";
                 }

                 return (
                   <button 
                     key={l}
                     onClick={() => setLang(l)}
                     className={cn(
                       "text-[8px] font-bold uppercase px-3 py-1 rounded-full transition-all",
                       activeClass
                     )}
                     style={inlineStyle}
                     aria-label={`Interfaz en ${descriptorLengua(l).nombre}`}
                   >
                     {descriptorLengua(l).etiquetaBoton}
                   </button>
                 );
               })}
            </div>
          </div>
        </div>
        <div className="relative">
             <button onClick={() => setActiveTab('notifications')} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center cursor-pointer transition-colors hover:bg-slate-200">
                <Bell className="w-5 h-5 text-slate-400" />
             </button>
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">2</div>
          </div>
        </header>

        {lang !== 'es' && (
          <div className="px-6 pb-4">
            <AvisoLenguaOriginaria lengua={lang} />
          </div>
        )}

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto px-6 pb-24 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderedTab}
            </motion.div>
          </AnimatePresence>

          {/* Floating AI Assistant Button */}
          <button 
            onClick={() => setShowChat(true)}
            className="fixed bottom-32 right-6 w-14 h-14 bg-magenta-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-magenta-500/30 transform hover:scale-110 transition-transform active:scale-95 z-40"
            style={{backgroundColor:'var(--magenta)'}}
          >
            <Bot className="w-6 h-6" />
          </button>
        </main>

        {/* Navigation Bar */}
        <nav className={cn("absolute bottom-0 left-0 right-0 border-t border-slate-100 px-2 py-3 pb-8 flex justify-around items-center z-40", (!reducedMotion && isOnline) ? "bg-white/80 backdrop-blur-md" : "bg-white")}>
           <TabButton icon={Home} label={t('nav.inicio')} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
           <TabButton icon={Users} label={t('nav.redes')} active={activeTab === 'networks'} onClick={() => setActiveTab('networks')} />
           <TabButton icon={MessageSquare} label={t('nav.campana')} active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
           <TabButton icon={CreditCard} label={t('nav.tesoreria')} active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
           <TabButton icon={User} label={t('nav.perfil')} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>


        {/* AI Chat Overlay */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute inset-0 z-50 bg-white flex flex-col"
            >
               {/* Chat Header */}
               <div className="px-6 py-6 border-b border-slate-100 flex flex-col gap-4 bg-slate-900 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-magenta-500 flex items-center justify-center text-white shadow-lg ring-2 ring-white/20"><Bot className="w-6 h-6" /></div>
                      <div>
                        <p className="text-[1.1rem] font-black uppercase tracking-tight leading-none mb-1">{isAiMode ? 'Aura IA (ConnectX)' : 'Modo Offline'}</p>
                        <p className={cn("text-[10px] font-bold uppercase flex items-center gap-1", isAiMode ? "text-emerald-400" : "text-amber-400")}>
                          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isAiMode ? "bg-emerald-400" : "bg-amber-400")}></span>
                          {isAiMode ? t('app.asistente_en_linea') : 'Fallback Mode'}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => setShowChat(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="flex gap-2 border-t border-white/10 pt-4 flex-wrap">
                     <button
                        onClick={() => {
                          setUseThinking(!useThinking);
                          if (!useThinking) { setUseMaps(false); setUseSearch(false); }
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 border",
                          useThinking ? "bg-purple-500/20 text-purple-300 border-purple-500/50" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                        )}
                     >
                        <div className={cn("w-1.5 h-1.5 rounded-full", useThinking ? "bg-purple-400 animate-pulse" : "bg-white/30")}></div>
                        Thinking Mode
                     </button>
                     <button
                        onClick={() => {
                          setUseMaps(!useMaps);
                          if (!useMaps) { setUseThinking(false); setUseSearch(false); }
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 border",
                          useMaps ? "bg-blue-500/20 text-blue-300 border-blue-500/50" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                        )}
                     >
                        <div className={cn("w-1.5 h-1.5 rounded-full", useMaps ? "bg-blue-400 animate-pulse" : "bg-white/30")}></div>
                        Maps Grounding
                     </button>
                     <button
                        onClick={() => {
                          setUseSearch(!useSearch);
                          if (!useSearch) { setUseThinking(false); setUseMaps(false); }
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 border",
                          useSearch ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                        )}
                     >
                        <div className={cn("w-1.5 h-1.5 rounded-full", useSearch ? "bg-emerald-400 animate-pulse" : "bg-white/30")}></div>
                        Search Grounding
                     </button>
                     {auraVoice.isSupported && (
                       <button
                          onClick={() => {
                            if (autoSpeak) auraVoice.stopSpeaking();
                            setAutoSpeak(!autoSpeak);
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 border ml-auto",
                            autoSpeak ? "bg-magenta-500/20 text-magenta-200 border-magenta-500/50" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                          )}
                          style={autoSpeak ? { color: '#ff8ab8', borderColor: 'rgba(216,30,91,0.5)' } : {}}
                       >
                          {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          {autoSpeak ? 'Voz activada' : 'Voz desactivada'}
                       </button>
                     )}
                  </div>
               </div>

               {/* Messages Console */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f0f2f5] custom-scrollbar">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "max-w-[85%] p-4 rounded-3xl text-[1rem] shadow-sm font-medium leading-relaxed",
                        msg.role === 'assistant' 
                          ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" 
                          : "bg-magenta-500 text-white ml-auto rounded-tr-none shadow-magenta-500/20"
                      )}
                      style={msg.role === 'user' ? {backgroundColor: 'var(--magenta)'} : {}}
                    >
                      {msg.content}
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 p-4 bg-white rounded-3xl rounded-tl-none border border-slate-200 w-20 shadow-sm">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  )}
               </div>

               {/* Quick Actions (WhatsApp Style Chips) */}
               <div className="px-4 py-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar scroll-smooth">
                  {quickActions.map((action) => (
                    <button 
                      key={action.clave}
                      onClick={() => handleSendMessage(action.texto)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-magenta-500 hover:text-white rounded-full text-xs font-black transition-all border border-slate-200 uppercase tracking-widest whitespace-nowrap active:scale-95 shadow-sm"
                    >
                      {action.texto}
                    </button>
                  ))}
               </div>

               {/* Input Area */}
               <div className="p-6 pb-12 bg-white border-t border-slate-100 flex items-center gap-3">
                  {auraVoice.isSupported && (
                    <button
                      onClick={handleVoiceInput}
                      aria-label={auraVoice.isListening ? 'Detener grabación de voz' : 'Hablar con Aura'}
                      className={cn(
                        "shrink-0 p-4 rounded-2xl shadow-lg transition-all active:scale-90",
                        auraVoice.isListening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                  )}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={auraVoice.isListening ? 'Escuchando…' : 'Escribe o toca el micrófono para hablar...'}
                      disabled={auraVoice.isListening}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-[1.1rem] focus:outline-none focus:border-magenta-500 transition-colors pr-14 font-medium disabled:opacity-60"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-magenta-500 text-white rounded-xl shadow-lg hover:shadow-magenta-500/40 transition-all active:scale-90"
                      style={{backgroundColor:'var(--magenta)'}}
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trazabilida Map Overlay */}
        <AnimatePresence>
          {showTriage && (
            <SaludNayaritID
              onClose={() => setShowTriage(false)}
              uid={user?.uid}
              curpSugerido={profile.documentId}
              nombreSugerido={profile.name}
            />
          )}
          {showMap && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 z-[60] bg-white flex flex-col"
             >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                   <h3 className="font-serif font-black text-lg">Avance de Obra en Vivo</h3>
                   <button onClick={() => { setShowMap(false); setSelectedWork(null); }} className="p-2 bg-slate-100 rounded-full">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                   </button>
                </div>
                <div className="flex-1 relative">
                   <NayaritMap 
                     center={{ lat: 21.5090, lng: -104.8947 }}
                     zoom={15}
                     markers={mapMarkers}
                   />
                   
                   {/* Floating Project Info */}
                   {!selectedWork && (
                     <motion.button 
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       onClick={() => setSelectedWork({ 
                         title: 'Reencarpetamiento San Juan', 
                         progress: 65, 
                         image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&q=80',
                         desc: 'Renovación total de 2,400m2 de carpeta asfáltica. Instalación de nueva señalética vertical.'
                       })}
                       className="absolute bottom-6 left-6 right-6 bg-slate-900 p-4 rounded-2xl flex items-center justify-between group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-magenta-500 flex items-center justify-center text-white">🏗️</div>
                           <div className="text-left">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Obra en proceso</p>
                              <p className="text-xs font-bold text-white">Ver Detalles del Proyecto</p>
                           </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white" />
                     </motion.button>
                   )}
                </div>

                {selectedWork && (
                   <motion.div 
                     initial={{ y: '100%' }}
                     animate={{ y: 0 }}
                     className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-2xl p-6 z-50 overflow-y-auto max-h-[80%]"
                   >
                      <button 
                        onClick={() => setSelectedWork(null)}
                        className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"
                      ></button>
                      <div className="flex justify-between items-start mb-4">
                         <h2 className="text-2xl font-serif font-black text-slate-900 leading-tight">{selectedWork.title}</h2>
                         <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Activo</span>
                      </div>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 border border-slate-100 shadow-lg">
                         <img src={selectedWork.image} alt="Public Work" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-4 mb-8">
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avance Real</p>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                               <div className="bg-magenta-500 h-full transition-all duration-1000" style={{ width: `${selectedWork.progress}%`, backgroundColor:'var(--magenta)' }}></div>
                            </div>
                            <p className="text-right text-[10px] font-bold text-magenta-500 mt-2" style={{color:'var(--magenta)'}}>{selectedWork.progress}% Completado</p>
                         </div>
                         <p className="text-sm text-slate-600 leading-relaxed">{selectedWork.desc}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Presupuesto</p>
                            <p className="text-lg font-black text-slate-900">$1,450,200</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Finalización</p>
                            <p className="text-lg font-black text-slate-900">14 AGO 2026</p>
                         </div>
                      </div>
                   </motion.div>
                )}
             </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Flow Overlay */}
        <AnimatePresence>
          {payingItem && (
             <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               className="absolute inset-x-0 bottom-0 top-0 z-[100] bg-white flex flex-col"
             >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                   <h3 className="font-serif font-black text-lg">Finalizar Pago</h3>
                   <button onClick={() => { setPayingItem(null); setPaymentStep('idle'); }} className="p-2 bg-slate-100 rounded-full">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                   </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                   {paymentStep === 'idle' && (
                      <div className="space-y-8">
                         <div className="text-center">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                               <CreditCard className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold">{payingItem.title}</h4>
                            <p className="text-slate-500 text-sm">{payingItem.status}</p>
                         </div>
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                               <span className="text-slate-500 text-sm">Subtotal</span>
                               <span className="font-bold">{payingItem.val}</span>
                            </div>
                            <div className="flex justify-between items-center text-magenta-500 font-bold text-sm mb-6">
                               <span>Descuento "Pronto Pago"</span>
                               <span>-15%</span>
                            </div>
                            <div className="h-px bg-slate-200 mb-6"></div>
                            <div className="flex justify-between items-center">
                               <span className="font-black text-lg">Total a Pagar</span>
                               <span className="font-black text-3xl text-slate-900">$204.00</span>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Método de Pago</p>
                            <button 
                              onClick={() => setPaymentMethod('card')}
                              className={cn(
                                "w-full p-4 border rounded-2xl flex items-center justify-between transition-all",
                                paymentMethod === 'card' ? "bg-white border-magenta-500 ring-2 ring-magenta-500/10 shadow-lg" : "bg-white border-slate-100"
                              )}
                            >
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-5 bg-slate-100 rounded"></div>
                                  <span className="font-bold text-sm">VISA •••• 4412</span>
                               </div>
                               <div className={cn(
                                 "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                 paymentMethod === 'card' ? "border-magenta-500 bg-white" : "border-slate-200"
                               )}>
                                 {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-magenta-500"></div>}
                               </div>
                            </button>
                            
                            <button 
                              onClick={() => setPaymentMethod('cash')}
                              className={cn(
                                "w-full p-4 border rounded-2xl flex items-center justify-between transition-all",
                                paymentMethod === 'cash' ? "bg-white border-magenta-500 ring-2 ring-magenta-500/10 shadow-lg" : "bg-white border-slate-100"
                              )}
                            >
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                     <Barcode className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <span className="font-bold text-sm block">Pago en Efectivo</span>
                                     <span className="text-[10px] text-slate-400 uppercase block">OXXO / CASINO / TELECOMM</span>
                                  </div>
                               </div>
                               <div className={cn(
                                 "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                 paymentMethod === 'cash' ? "border-magenta-500 bg-white" : "border-slate-200"
                               )}>
                                 {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-magenta-500"></div>}
                               </div>
                            </button>
                         </div>
                      </div>
                   )}

                   {paymentStep === 'cash_instructions' && (
                      <div className="flex flex-col items-center">
                         <div className="bg-slate-50 w-full rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                            <div className="text-center space-y-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Referencia de Pago</p>
                               <h1 className="text-xl font-mono font-black text-slate-900 tracking-tighter">{paymentRef}</h1>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                               <svg ref={barcodeRef} className="w-full h-auto"></svg>
                            </div>

                            <div className="flex justify-center py-2">
                               <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
                                  <QRCodeSVG 
                                    value={`https://gobernanza.digital/pago?ref=${paymentRef}&monto=204&curp=PEGJ900101HNT`}
                                    size={140}
                                    level="H"
                                    includeMargin={true}
                                  />
                               </div>
                            </div>

                            <div className="space-y-3">
                               <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-500">Monto:</span>
                                  <span className="font-bold text-slate-900">$204.00 MXN</span>
                               </div>
                               <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-500">Vence:</span>
                                  <span className="font-bold text-slate-900">15 JUN 2026</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="mt-8 text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-magenta-500 font-bold text-xs" style={{color:'var(--magenta)'}}>
                               <div className="w-2 h-2 rounded-full bg-magenta-500 animate-pulse"></div>
                               ESPERANDO PAGO EN CAJA
                            </div>
                            <p className="text-xs text-slate-400 italic px-4 leading-relaxed">
                               Muestra este código en cualquier OXXO, Casino o Telecomm. El cajero escaneará el código de barras y recibirás tu ticket de confirmación.
                            </p>
                         </div>
                      </div>
                   )}

                   {paymentStep === 'processing' && (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                         <div className="relative">
                            <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-magenta-500 border-t-transparent rounded-full animate-spin"></div>
                         </div>
                         <p className="mt-8 font-serif font-black text-2xl">Procesando Pago...</p>
                         <p className="text-slate-500 text-sm mt-2">Seguridad Bancaria ConnectX</p>
                      </div>
                   )}

                   {paymentStep === 'success' && (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                         <motion.div 
                           initial={{ scale: 0.5, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8"
                         >
                            <Plus className="w-12 h-12 rotate-45 scale-125" />
                         </motion.div>
                         <h4 className="font-serif font-black text-3xl mb-2">¡Pago Exitoso!</h4>
                         <p className="text-slate-500 text-sm mb-8">El comprobante ha sido enviado a tu correo y guardado en tu perfil.</p>
                         <div className="w-full bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-left font-mono">
                            <p className="text-[10px] text-slate-400 flex justify-between">AUT: <span>889210-XC</span></p>
                            <p className="text-[10px] text-slate-400 flex justify-between">FECHA: <span>13 JUN 2026</span></p>
                            <p className="text-sm font-bold mt-4 flex justify-between font-sans">TOTAL: <span>$204.00 MXN</span></p>
                         </div>
                      </div>
                   )}
                </div>

                <div className="p-6 pb-12">
                   {paymentStep === 'idle' && (
                      <button 
                        onClick={async () => {
                          if (paymentMethod === 'card') {
                            setPaymentStep('processing');
                            setTimeout(() => setPaymentStep('success'), 2000);
                          } else {
                            await generatePaymentRef();
                            setPaymentStep('cash_instructions');
                          }
                        }}
                        className="w-full py-4 bg-slate-900 text-white rounded-full font-black shadow-xl transition-transform active:scale-95"
                      >
                         {paymentMethod === 'card' ? 'Pagar $204.00 MNX' : 'Generar Código de Pago'}
                      </button>
                   )}
                   {paymentStep === 'cash_instructions' && (
                      <button 
                        onClick={() => { setPayingItem(null); setPaymentStep('idle'); setActiveTab('home'); }}
                        className="w-full py-4 bg-slate-900 text-white rounded-full font-black shadow-xl"
                      >
                         Volver al Inicio
                      </button>
                   )}
                   {paymentStep === 'success' && (
                      <button 
                        onClick={() => { setPayingItem(null); setPaymentStep('idle'); setActiveTab('home'); }}
                        className="w-full py-4 bg-slate-900 text-white rounded-full font-black shadow-xl"
                      >
                         Entendido
                      </button>
                   )}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    )}
    </>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
      <Icon className={cn("w-5 h-5 transition-colors", active ? "text-magenta-500" : "text-slate-400 group-hover:text-slate-600")} style={active ? {color:'var(--magenta)'} : {}} />
      <span className={cn("text-[9px] font-bold uppercase tracking-wider transition-colors", active ? "text-magenta-500" : "text-slate-400")} style={active ? {color:'var(--magenta)'} : {}}>{label}</span>
    </button>
  );
}

const HomeView = React.memo(function HomeView({ 
  profile,
  isOnline = true,
  reducedMotion = false,
  onShowMap, 
  onShowTriage, 
  onGoToForum, 
  onGoToProfile, 
  onGoToPayments, 
  onGoToServices,
  onGoToAcademy,
  onGoToSystemAudit,
  onGoToBanana,
  onGoToStrategy,
  onGoToStrategicPlan,
  onViewManifest,
  onGoToLetters
}: { 
  profile: any,
  isOnline?: boolean,
  reducedMotion?: boolean,
  onShowMap: () => void, 
  onShowTriage: () => void, 
  onGoToForum: () => void, 
  onGoToProfile: () => void, 
  onGoToPayments: () => void, 
  onGoToServices: () => void,
  onGoToAcademy: () => void,
  onGoToSystemAudit: () => void,
  onGoToBanana: () => void,
  onGoToStrategy: () => void,
  onGoToStrategicPlan: () => void,
  onViewManifest?: () => void,
  onGoToLetters?: () => void
}) {
  return (
    <div className="space-y-6 pt-2">

      {/* Visual Hero ConnectX - Neuro-Experience */}
      <div className="px-1 mb-2">
        <div className="relative h-64 w-full rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-white/5">
          {/* Animated Background Simulation */}
          <div className="absolute inset-0 bg-slate-950">
             {(!reducedMotion && isOnline) && (
               <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.15),transparent_70%)] animate-pulse"></div>
                  <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-magenta-500/10 rounded-full blur-[100px] animate-bounce duration-[10000ms]"></div>
                  <div className="absolute bottom-[10%] left-[5%] w-72 h-72 bg-emerald-500/5 rounded-full blur-[120px] animate-pulse duration-[8000ms]"></div>
               </div>
             )}
             {/* Tech Grid Overlay */}
             <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-magenta-500 animate-pulse"></div>
                 <p className="text-[10px] font-black text-magenta-500 uppercase tracking-[0.4em]">Protocolo SSS-2026</p>
              </div>
              <h2 className="text-3xl font-serif font-black text-white leading-[1] tracking-tight">
                Soberanía Digital<br/>
                <span className="text-slate-400">en Evolución</span>
              </h2>
              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={onViewManifest}
                  className={cn("flex items-center gap-3 border border-white/20 px-6 py-3 rounded-2xl group/play hover:bg-white/20 transition-all", (!reducedMotion && isOnline) ? "bg-white/10 backdrop-blur-md" : "bg-slate-900/50")}
                >
                  <div className="w-8 h-8 rounded-full bg-magenta-600 flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Ver Manifiesto</span>
                </button>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                        {String.fromCharCode(64 + i)}
                     </div>
                   ))}
                   <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-magenta-500 flex items-center justify-center text-[10px] font-black text-white">
                      +1k
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Top Indicators */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
             <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Nayarit Digital</span>
                <span className="text-[10px] font-mono text-white/80">LAT: 21.50 N / LON: 104.89 W</span>
             </div>
             <div className={cn("px-3 py-1.5 border border-white/10 rounded-xl flex items-center gap-2", (!reducedMotion && isOnline) ? "bg-black/40 backdrop-blur-md" : "bg-black/80")}>
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Soberanía: 98.4%</span>
             </div>
          </div>
        </div>
      </div>

      {/* Portal Ciudadano Fusión */}
      <div 
        className="bg-slate-950 rounded-3xl p-6 shadow-2xl shadow-slate-900/50 relative overflow-hidden group"
      >
        {(!reducedMotion && isOnline) && <div className="absolute top-0 right-0 w-40 h-40 bg-magenta-500/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-magenta-500/20 transition-colors"></div>}
        <div className="relative z-10">
          <h2 className="text-[10px] font-black text-magenta-500 uppercase tracking-[0.4em] mb-4">Núcleo de Ciudadanía</h2>
          <p className="text-white font-serif text-2xl font-black leading-none tracking-tighter mb-8">Gestión de<br/><span className="text-slate-400">Poder Digital</span></p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Nayarit ID Card */}
            <div 
               onClick={onGoToProfile}
               className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white flex flex-col cursor-pointer transition-all hover:bg-slate-800 active:scale-95 group/card"
            >
               <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover/card:bg-slate-700 transition-colors">
                  <Fingerprint className="w-5 h-5 text-magenta-500" />
               </div>
               <h3 className="font-bold text-sm leading-tight mb-1">Nayarit ID</h3>
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Identidad Biométrica</p>
            </div>
  
            {/* Ventanilla Única */}
            <div 
               onClick={onGoToServices}
               className="bg-magenta-600 rounded-3xl p-6 text-white flex flex-col cursor-pointer transition-all hover:bg-magenta-500 active:scale-95 shadow-xl shadow-magenta-600/20 group/card"
               style={{backgroundColor:'var(--magenta)'}}
            >
               <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover/card:bg-white/30 transition-colors">
                  <Zap className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-sm leading-tight mb-1">Ventanilla</h3>
               <p className="text-[9px] text-magenta-100 font-bold uppercase tracking-widest">Servicio Directo</p>
            </div>
          </div>
        </div>
      </div>


      {/* Asistente de Acciones Directas */}
      <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-2xl shadow-emerald-900/30 relative overflow-hidden group">
        {(!reducedMotion && isOnline) && <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16 group-hover:bg-white/20 transition-colors"></div>}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-serif font-black text-2xl tracking-tighter">Operaciones Directas</h3>
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">IA Predictiva: Acción requerida</p>
            </div>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", (!reducedMotion && isOnline) ? "bg-white/20 backdrop-blur-md" : "bg-white/30")}>
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <button 
            onClick={onGoToPayments}
            className="w-full bg-white text-emerald-700 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 group/btn"
          >
            <CreditCard className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            Liquidar Pago Pendiente
          </button>
        </div>
      </div>

      {/* Marco Legal (demo — sin cumplimiento verificado) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LegalComplianceDisclaimer onViewCert={onGoToStrategicPlan} />
      </motion.div>
      
      {/* Novedades V18 - Most Visible Progress */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-3">
           <div className="w-6 h-[1px] bg-indigo-500"></div>
           Novedades v18.0 - Ecosistema Municipal
        </h2>

        {/* Cartas Municipales Digitales CTA */}
        <button 
          onClick={onGoToLetters}
          className="w-full bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 flex items-center justify-between border border-indigo-500/30 shadow-2xl relative overflow-hidden group"
        >
          {(!reducedMotion && isOnline) && <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(99,102,241,0.15),transparent_50%)]"></div>}
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-400/20 rounded-3xl flex items-center justify-center text-indigo-400 shadow-2xl group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
             </div>
             <div className="text-left">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-1">Trámites e Identidad Digital</p>
                <p className="font-serif font-black text-2xl leading-tight text-white">Cartas Municipales</p>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-snug">Constancia de Residencia, Buena Conducta y No Adeudo con Firma Criptográfica SHA-256</p>
             </div>
          </div>
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:bg-white transition-all shrink-0">
            <ChevronRight className="w-6 h-6 text-white group-hover:text-indigo-950" />
          </div>
        </button>

        {/* Master Strategic Plan CTA */}
        <button 
          onClick={onGoToStrategicPlan}
          className="w-full bg-gradient-to-r from-slate-950 to-[#0a0a14] rounded-3xl p-6 flex items-center justify-between border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-slate-600 transition-colors"
        >
          {(!reducedMotion && isOnline) && <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>}
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-3xl flex items-center justify-center text-slate-300 shadow-2xl group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8" />
             </div>
             <div className="text-left">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">Estrategia & Resiliencia</p>
                <p className="font-serif font-black text-2xl leading-tight text-white">Plan Maestro 2026</p>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">Simulación de Estrés y Pilares de Trabajo Político-Tecnológico</p>
             </div>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center shadow-lg group-hover:bg-white transition-all shrink-0">
            <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
          </div>
        </button>
      </div>

      {/* Primary Services Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
             <div className="w-6 h-[1px] bg-slate-300"></div>
             Gobernanza Dinámica
          </h2>
          <LayoutGrid className="w-4 h-4 text-slate-300" />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <QuickAction icon={Droplets} label="Tesorería" color="bg-slate-50 text-slate-900 border-slate-100" onClick={onGoToPayments} description="Finanzas Públicas" />
           <QuickAction icon={ShieldCheck} label="Reporte GPS" color="bg-slate-50 text-slate-900 border-slate-100" onClick={onGoToServices} description="Gestión Territorial" />
           <QuickAction icon={Stethoscope} label="Salud IA" color="bg-slate-50 text-slate-900 border-slate-100" onClick={onShowTriage} description="Triaje Preventivo" />
           <QuickAction icon={Lightbulb} label="Servicios" color="bg-slate-50 text-slate-900 border-slate-100" onClick={onGoToServices} description="Atención Urbana" />
        </div>
      </div>

      {/* Academy CTA for Workers */}
      <button 
        onClick={onGoToAcademy}
        className="w-full bg-magenta-50 rounded-3xl p-6 flex items-center justify-between border border-magenta-100 shadow-xl shadow-magenta-500/5 group relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
           <GraduationCap className="w-24 h-24 text-magenta-500" />
        </div>
        <div className="flex items-center gap-5 relative z-10">
           <div className="w-12 h-12 bg-magenta-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-magenta-500/30">
              <Sparkles className="w-6 h-6" />
           </div>
           <div className="text-left">
              <p className="font-serif font-black text-xl leading-tight text-slate-900">Academia ConnectX</p>
              <p className="text-[10px] text-magenta-500 font-bold uppercase tracking-widest">Formación propuesta: Servidor Público Digital</p>
           </div>
        </div>
        <div className="w-10 h-10 bg-magenta-100 rounded-full flex items-center justify-center group-hover:bg-magenta-500 transition-colors shrink-0">
          <ChevronRight className="w-5 h-5 text-magenta-500 group-hover:text-white" />
        </div>
      </button>

      {/* Strategic Blueprint CTA */}
      <button 
        onClick={onGoToStrategy}
        className="w-full bg-[#0a0a0a] rounded-3xl p-6 flex items-center justify-between border border-yellow-500/20 shadow-2xl relative overflow-hidden group"
      >
        {(!reducedMotion && isOnline) && <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.05),transparent_50%)]"></div>}
        <div className="flex items-center gap-5 relative z-10">
           <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500 shadow-lg shadow-yellow-500/5">
              <Network className="w-6 h-6" />
           </div>
           <div className="text-left">
              <p className="font-serif font-black text-xl leading-tight text-white">Blueprint Estratégico</p>
              <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Modelo de Soberanía y Sostenibilidad</p>
           </div>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-all shrink-0">
          <ArrowRight className="w-5 h-5 text-yellow-500 group-hover:text-black" />
        </div>
      </button>

      {/* System Integrity Auditor (Mystery Shopper) */}
      <button 
        onClick={onGoToSystemAudit}
        className="w-full bg-slate-900 rounded-3xl p-6 flex items-center justify-between border border-slate-800 shadow-2xl relative overflow-hidden group"
      >
        {(!reducedMotion && isOnline) && <div className="absolute top-0 right-0 w-32 h-32 bg-magenta-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-magenta-500/20 transition-colors"></div>}
        <div className="flex items-center gap-5 relative z-10">
           <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-magenta-500 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <div className="text-left">
              <p className="font-serif font-black text-xl leading-tight text-white">Integridad de Sistema</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Auditoría "Mystery Shopper" ConnectX</p>
           </div>
        </div>
        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-magenta-600 transition-all">
          <Activity className="w-5 h-5 text-magenta-500 group-hover:text-white" />
        </div>
      </button>

      {/* Forum CTA for Neighborhood Networks */}
      <button 
        onClick={onGoToForum}
        className="w-full bg-slate-900 rounded-3xl p-6 flex items-center justify-between text-white shadow-xl overflow-hidden relative group"
      >
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
           <Users className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-5 relative z-10">
           <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🤝</div>
           <div className="text-left">
              <p className="font-serif font-black text-xl leading-tight">Redes Ciudadanas</p>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Foros por Colonia y Comités</p>
           </div>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      {/* Transparency / Obras */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-inner">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-magenta-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trazabilidad en Tiempo Real</span>
            </div>
            <Bell className="w-4 h-4 text-slate-300" />
         </div>
         <p className="text-sm font-bold text-slate-900 leading-tight">Reencarpetamiento San Juan: 65% de avance.</p>
         <button 
           onClick={onShowMap}
           className="mt-5 w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 flex items-center justify-center gap-2 transition-all hover:bg-slate-100"
         >
           AUDITAR OBRA PÚBLICA <ChevronRight className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
});

function QuickAction({ icon: Icon, label, color, description, onClick }: { icon: any, label: string, color: string, description?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-5 rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-sm border border-transparent hover:border-slate-200 text-left",
        color
      )}
    >
      <Icon className="w-8 h-8" />
      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">{label}</p>
        {description && <p className="text-[8px] opacity-60 font-bold uppercase tracking-tighter leading-none">{description}</p>}
      </div>
    </button>
  );
}

function ViewHeader({ title, onBack }: { title: string, onBack?: () => void }) {
  return (
    <div className="flex items-center gap-4 py-4 mb-2">
      {onBack && (
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
      )}
      <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
  );
}

function RedesCiudadanasView({ profile, onBack }: { profile: any, onBack: () => void }) {
  const [networks, setNetworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, 'neighborhood_networks');
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNetworks(docs);
      
      // Auto-seed if empty
      if (snap.empty && !loading) {
        const seedData = [
          { name: 'Comité San Juan Unido', colony: 'Col. San Juan', memberCount: 156, leaderName: 'M. Lozano', createdAt: new Date() },
          { name: 'Red Vecinal Centro', colony: 'Centro Tepic', memberCount: 89, leaderName: 'R. Garcia', createdAt: new Date() },
          { name: 'Comité Ciudad del Valle', colony: 'Cd. del Valle', memberCount: 210, leaderName: 'S. Peña', createdAt: new Date() }
        ];
        seedData.forEach(async (d) => {
          await addDoc(collection(db, 'neighborhood_networks'), d);
        });
      }
      
      setLoading(false);
    });
    return () => unsub();
  }, [loading]);

  const joinNetwork = async (networkId: string) => {
    if (!auth.currentUser) return;
    try {
      // In a real app we'd update a members subcollection
      // For now we just link the user's profile neighborhood if they want
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-2 pb-10 space-y-6">
      <ViewHeader title="Red de Apoyo" onBack={onBack} />
      
      {/* Intro Stats */}
      <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-magenta-500/10 rounded-full blur-3xl"></div>
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-serif font-black">{profile.neighborhood || 'Tepic'} Unida</h3>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
               <Users className="w-5 h-5 text-magenta-300" />
            </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Miembros en {profile.neighborhood || 'Tepic'}</p>
               <p className="text-xl font-black">2,410</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Metas Alcanzadas</p>
               <p className="text-xl font-black">94%</p>
            </div>
         </div>
      </div>

      {/* Neighborhood List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comités en Tepic</h3>
           <button className="text-[10px] font-black text-magenta-500 uppercase tracking-widest">Ver Mapa</button>
        </div>

        <div className="space-y-3">
           {loading ? (
             <div className="flex justify-center p-6">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
             </div>
           ) : (
             <>
               {networks.length === 0 && (
                 <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center">
                    <p className="text-sm font-bold text-slate-900 mb-2">Aún no hay comités registrados</p>
                    <p className="text-xs text-slate-400">Sé el primero en organizar tu colonia.</p>
                 </div>
               )}
               {networks.map((net: any) => (
                 <div key={net.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-magenta-50 transition-colors">
                             🏘️
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 mb-0.5">{net.name}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{net.colony}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-magenta-500">{net.memberCount || 0} Miembros</p>
                       </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-magenta-500 flex items-center justify-center text-[8px] text-white font-bold">
                             +
                          </div>
                       </div>
                       <button onClick={() => joinNetwork(net.id)} className="px-5 py-2 bg-slate-900 border border-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-800 transition-colors">
                          Unirme al Comité
                       </button>
                    </div>
                 </div>
               ))}
             </>
           )}
        </div>
      </div>

      {/* Campaign Support CTA */}
      <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-inner">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
               <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Súmate al Cambio</p>
               <h4 className="text-sm font-black text-emerald-900">Registrar a un nuevo Nayarita</h4>
            </div>
         </div>
         <p className="text-xs text-emerald-700 leading-relaxed mb-5">
            ¿Tienes familiares o vecinos que aún no tienen su Nayarit ID? Ayúdalos a registrarse y intégralos a la red ciudadana.
         </p>
         <button className="w-full py-4 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-colors active:scale-95">
            Comenzar Registro Externo
         </button>
      </div>
    </div>
  );
}


function TesoreriaYTramitesView({ onPay, onBack }: { onPay: (item: any) => void, onBack: () => void }) {
  return (
    <div className="pt-2 space-y-6 pb-20">
      <ViewHeader title="Tesorería Digital" onBack={onBack} />
      
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
         <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Demo · sin cumplimiento verificado</span>
         </div>
         <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Datos de demostración</p>
         <h3 className="text-4xl font-serif font-black mb-1">$240.00</h3>
         <p className="text-xs text-white/60">Documento de demostración — integración con Llave MX propuesta, no implementada</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 flex items-center gap-2">
           <Barcode className="w-3 h-3" />
           Módulo 01 — Ecosistema de Pagos Digitales
        </h3>
        {[
          { icon: Droplets, title: 'Servicio de Agua - Junio 2026', val: '$240.00', status: 'Demo', color: 'text-blue-500' },
          { icon: FileText, title: 'Renovación de Licencia', val: '$850.00', status: 'Demo', color: 'text-magenta-500' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-emerald-200 transition-colors">
             <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl bg-slate-50", item.color)}>
                   <item.icon className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900">{item.title}</p>
                   <p className="text-[9px] text-emerald-600 uppercase font-black tracking-widest flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      {item.status}
                   </p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm font-black text-slate-900 mb-2">{item.val}</p>
                <button 
                  onClick={() => onPay(item)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform flex items-center gap-2" 
                >
                  <QrCode className="w-3 h-3" /> QR Mágico
                </button>
             </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 flex items-center gap-2">
           <FileText className="w-3 h-3" />
           Módulo 03 — Ventanilla Única y Actas
        </h3>
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
           {['Licencia de Funcionamiento Criptográfica', 'Permiso de Construcción Georreferenciado', 'Uso de Suelo Digital', 'Actas del Registro Civil (Firma Avanzada)'].map(s => (
             <button key={s} className="w-full px-8 py-6 flex justify-between items-center hover:bg-slate-50 active:bg-slate-100 transition-colors text-left group">
                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{s}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
             </button>
           ))}
        </div>
        <p className="text-[10px] text-slate-400 text-center px-6 leading-relaxed">
           Documentos de demostración. La firma electrónica avanzada y la validez ante autoridades son propuestas de integración, no capacidades implementadas.
        </p>
      </div>
    </div>
  );
}

function ServiciosYReportesView({ onShowTriage, onGoToAuditoria, onBack }: { onShowTriage: () => void, onGoToAuditoria: () => void, onBack: () => void }) {
  return (
    <div className="pt-2 space-y-8 pb-20">
      <ViewHeader title="Centro de Operaciones" onBack={onBack} />
      
      <div className="space-y-6">
         {/* Salud Inteligente Priority */}
         <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-magenta-500 rounded-3xl blur opacity-20"></div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 relative">Módulo 05 — Prioridad de Salud Pública</h3>
            <button 
               onClick={onShowTriage}
               className="w-full flex justify-between items-center p-6 bg-slate-900 rounded-3xl cursor-pointer group shadow-xl relative text-left"
            >
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30">
                   <Stethoscope className="w-6 h-6 text-rose-400" />
                 </div>
                 <div>
                    <span className="text-lg font-black text-white block mb-1">Triaje de Salud (IA)</span>
                    <span className="text-[9px] text-rose-300 font-bold uppercase tracking-widest">Atención Médica (demo de orientación, no diagnóstico)</span>
                 </div>
               </div>
               <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-rose-400 transition-colors" />
            </button>
         </div>

         {/* Urban Reports Map */}
         <div className="px-4">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapIcon className="w-3 h-3" />
              Monitor C5 Comunitario (Google Maps)
           </h3>
           <UrbanReportMapView onBack={onBack} />
         </div>

         {/* Urban Services */}
         <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 flex items-center gap-2">
               <ShieldCheck className="w-3 h-3" />
               Módulo 02 — Reportar Incidencias
            </h3>
            <div className="grid grid-cols-1 gap-3">
               {[
                 { label: 'Auditoría de Luminaria', desc: 'Evidencia Fotográfica Geolocalizada', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
                 { label: 'Auditoría de Bacheo', desc: 'Evidencia Fotográfica Geolocalizada', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
                 { label: 'Falla Hídrica Estratégica', desc: 'Evidencia Fotográfica Geolocalizada', icon: Droplets, color: 'text-sky-500', bg: 'bg-sky-50' }
               ].map((s, i) => (
                 <button key={i} className="w-full flex justify-between items-center p-5 bg-white border border-slate-200 rounded-[1.5rem] hover:border-slate-400 active:bg-slate-50 transition-all group text-left shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", s.bg, s.color)}>
                          <s.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 mb-1">{s.label}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                             <MapIcon className="w-3 h-3" /> {s.desc}
                          </p>
                       </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                       <Plus className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                 </button>
               ))}
            </div>
         </div>

         {/* RoutePro */}
         <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Módulo 06 — Logística Municipal (RoutePro)</h3>
            <div className="grid grid-cols-1 gap-3">
               <button className="w-full flex justify-between items-center p-5 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] hover:bg-emerald-100 active:scale-[0.99] transition-all group text-left">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                        <MapIcon className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-emerald-900 mb-1">Seguimiento Recolección Basura</p>
                        <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-widest">Visibilidad GPS en tiempo real</p>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-700 transition-colors" />
               </button>
            </div>
         </div>

         {/* Mystery Shopper Module */}
         <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-4 flex items-center gap-2">
               <ShieldAlert className="w-3 h-3" />
               Módulo 07 — Auditoría Ciudadana
            </h3>
            <div className="grid grid-cols-1 gap-3">
               <button 
                  onClick={onGoToAuditoria}
                  className="w-full flex justify-between items-center p-5 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] hover:bg-indigo-100 active:scale-[0.99] transition-all group text-left"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <EyeOff className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-indigo-900 mb-1">Programa Mystery Shopper</p>
                        <p className="text-[9px] text-indigo-700 font-bold uppercase tracking-widest leading-tight">Auditoría anónima al servicio de gobierno</p>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:text-indigo-700 transition-colors" />
               </button>
            </div>
         </div>

      </div>
    </div>
  );
}

function ProfileView({ 
  profile, 
  onLogout, 
  onBack, 
  onGoToSecurity,
  onGoToCanjes,
  onUpdate
}: { 
  profile: any,
  onLogout: () => void, 
  onBack: () => void, 
  onGoToSecurity: () => void,
  onGoToCanjes: () => void,
  onUpdate: (data: any) => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleSave = () => {
    onUpdate(localProfile);
    setIsEditing(false);
  };

  return (
    <div className="pt-2 pb-10 space-y-6">
      {showScanner && (
         <CredentialScannerView 
            onBack={() => setShowScanner(false)}
            onScanComplete={(data) => {
               console.log("Scan Data:", data);
               setShowScanner(false);
               // Here we could update the profile
            }}
         />
      )}
      <ViewHeader title="Mi Perfil Nayarit ID" onBack={onBack} />
      
      {/* Block 1: Profile Header & Stats */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col items-center relative">
        <button 
           onClick={() => setIsEditing(!isEditing)}
           className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
           {isEditing ? <ChevronLeft className="w-5 h-5 text-slate-900" /> : <ShieldCheck className="w-5 h-5" />}
        </button>

        <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-2xl overflow-hidden mb-6 ring-1 ring-slate-100">
           <img src={auth.currentUser?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80"} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-center mb-10 w-full">
           {isEditing ? (
             <div className="space-y-3 w-full text-left">
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nombre Completo</label>
                   <input type="text" value={localProfile.name} onChange={e => setLocalProfile({...localProfile, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Documento de Identidad (INE/CURP)</label>
                    <button onClick={() => setShowScanner(true)} className="w-full bg-magenta-100 text-magenta-700 py-3 rounded-xl text-xs font-bold my-2">Escanear INE / OCR</button>
                    <input type="text" value={localProfile.documentId} onChange={e => setLocalProfile({...localProfile, documentId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Teléfono</label>
                   <input type="text" value={localProfile.phone} onChange={e => setLocalProfile({...localProfile, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
                   <input type="email" value={localProfile.email} onChange={e => setLocalProfile({...localProfile, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Dirección (Domicilio)</label>
                   <input type="text" value={localProfile.address} onChange={e => setLocalProfile({...localProfile, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Colonia / Barrio</label>
                   <input type="text" value={localProfile.neighborhood} onChange={e => setLocalProfile({...localProfile, neighborhood: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mt-1" />
                </div>
                <button 
                  onClick={handleSave}
                  className="w-full bg-slate-900 text-white rounded-xl py-4 text-xs font-black uppercase tracking-widest mt-4 shadow-lg active:scale-[0.98] transition-transform"
                >
                  Confirmar Datos Nayarit ID
                </button>
             </div>
           ) : (
             <>
               <h2 className="text-2xl font-serif font-black text-slate-900 tracking-tight">{profile.name}</h2>
               <p className="text-xs font-mono text-slate-500 mt-1">{profile.documentId || 'ID No Registrada'}</p>
               <p className="text-xs text-slate-600 mt-2">{profile.email} · {profile.phone}</p>
               <p className="text-xs text-slate-600 mt-1 italic">{profile.neighborhood || 'Sin Colonia Asignada'}</p>
               <p className="text-xs text-slate-600 mt-1">{profile.address}</p>
               <p className="text-[10px] font-mono text-emerald-500 mt-3 uppercase tracking-[0.2em] font-bold inline-flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                 <ShieldCheck className="w-3 h-3" /> Estado: {profile.registrationVerified ? 'Identidad Verificada' : 'Pendiente de Verificación'}
               </p>
             </>
           )}
        </div>

        
        <div className="w-full">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3 text-left">Panel de Métricas Ciudadanas</p>
           <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-6 bg-slate-50/50 rounded-3xl text-center border border-slate-100">
                <p className="text-3xl font-black text-slate-900 mb-1">12</p>
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-tight">Reportes Urbanos Resueltos</p>
              </div>
              <div className="p-6 bg-magenta-50/50 rounded-3xl text-center border border-magenta-100 cursor-pointer group hover:bg-magenta-50 transition-colors" onClick={onGoToCanjes}>
                 <p className="text-3xl font-black text-magenta-500 mb-1">450</p>
                 <p className="text-[9px] text-magenta-400 uppercase font-black tracking-widest leading-tight">Puntos Recompensa Conecta</p>
                 <button className="mt-3 px-3 py-1 bg-magenta-500 text-white rounded-full text-[8px] uppercase tracking-widest font-black shadow-lg shadow-magenta-500/20 opacity-90 group-hover:opacity-100 transition-opacity">Canjear &rarr;</button>
              </div>
           </div>
        </div>

        {/* AI Certification Badge */}
        <div className="w-full mt-8 p-4 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-between group cursor-help transition-all hover:bg-slate-800">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-inner">
                 <Sparkles className="w-5 h-5 text-magenta-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white uppercase tracking-tight">Stack de demostración</p>
                 <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-tight">Sin certificación oficial · Google Cloud · Gemini</p>
              </div>
           </div>
           <div className="px-3 py-1 bg-magenta-500/10 rounded-full border border-magenta-500/20">
              <span className="text-[8px] font-black text-magenta-500 uppercase">Demo</span>
           </div>
        </div>
      </div>

      {/* Block 2: Menu Items */}
      <div className="space-y-3">
         <button 
           onClick={onGoToSecurity}
           className="w-full bg-white px-8 py-6 rounded-3xl shadow-sm border border-slate-100/50 text-left flex items-center justify-between group transition-all hover:bg-slate-50"
         >
            <span className="text-lg font-bold text-slate-800">Seguridad y Nayarit ID</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
         </button>
      </div>

      {/* Block 3: Navigation Actions */}
      <div className="space-y-4 pt-4">
         <button 
           onClick={onLogout}
           className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-center shadow-lg transition-transform active:scale-[0.98]"
         >
           VOLVER AL PORTAL DE ESTRATEGIA
         </button>
         
         <button 
           onClick={() => window.location.reload()} 
           className="w-full py-6 bg-red-50 text-red-500 rounded-3xl font-black text-center border border-red-100/50 transition-colors hover:bg-red-100"
         >
           CERRAR SESIÓN NAYARIT ID
         </button>
      </div>
    </div>
  );
}

function SecurityCenterView({ user, onBack }: { user: FirebaseUser | null, onBack: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);

  const handleDownloadData = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const expDoc = await getDoc(doc(db, 'expediente_unico', user.uid));
      const tramitesQuery = query(collection(db, 'tramites'), where('uid', '==', user.uid));
      const tramitesDocs = await getDocs(tramitesQuery);
      const puntosDoc = await getDoc(doc(db, 'puntos', user.uid));
      
      const data = {
        user: userDoc.exists() ? userDoc.data() : null,
        expediente: expDoc.exists() ? expDoc.data() : null,
        tramites: tramitesDocs.docs.map(d => d.data()),
        puntos: puntosDoc.exists() ? puntosDoc.data() : null,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nayarit-id-datos-${user.uid}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error al descargar datos');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteStep === 0) {
      setDeleteStep(1);
      return;
    }
    if (!user) return;
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'expediente_unico', user.uid));
      await deleteDoc(doc(db, 'puntos', user.uid));
      
      const tramitesQuery = query(collection(db, 'tramites'), where('uid', '==', user.uid));
      const tramitesDocs = await getDocs(tramitesQuery);

      await Promise.all(tramitesDocs.docs.map(d => deleteDoc(doc(db, 'tramites', d.id))));

      await deleteDoc(doc(db, 'users', user.uid));
      await user.delete();
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/requires-recent-login') {
         alert('Por seguridad, necesitas volver a iniciar sesión para eliminar tu cuenta.');
         auth.signOut();
      } else {
         alert('Error al eliminar cuenta');
      }
    } finally {
      setDeleting(false);
      setDeleteStep(0);
    }
  };

  return (
    <div className="pt-2 pb-10 space-y-6">
      <ViewHeader title="Seguridad y Nayarit ID" onBack={onBack} />
      
      {/* Block 1: Stack de demostración — sin certificación */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-magenta-500/20 rounded-full -mr-10 -mt-10 blur-3xl"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-magenta-400" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Estado de prototipo</p>
            </div>
            <h3 className="text-xl font-serif font-black mb-6 leading-tight">Demo construida sobre Google Cloud & Gemini — sin auditoría oficial</h3>
            
            <div className="space-y-4">
               <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Infraestructura</span>
                  <span className="text-xs font-mono text-magenta-400">Google Cloud Platform</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Base de Datos</span>
                  <span className="text-xs font-mono text-magenta-400">Firestore (GCP Instance)</span>
               </div>
               <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Inteligencia</span>
                  <span className="text-xs font-mono text-magenta-400">Gemini (prototipo)</span>
               </div>
               <div className="flex items-center justify-between py-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase">Protocolo ID</span>
                  <span className="text-xs font-mono text-magenta-400">Propuesta — sin integración real</span>
               </div>
            </div>
         </div>
      </div>

      {/* Block 2: House-to-House Protocol (New) */}
      <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Validación Casa por Casa</h4>
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Protocolo de Registro 2026</p>
            </div>
         </div>
         <div className="space-y-3">
            <div className="flex items-start gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
               <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                  Los datos de **Identificación, Teléfono, Correo y Domicilio** se validarían físicamente por personal autorizado (flujo propuesto, no implementado).
               </p>
            </div>
            <div className="flex items-start gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
               <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                  **Sincronización (propuesta)**: La información se vincularía a la red de gobernanza para servicios de emergencia — no implementado.
               </p>
            </div>
         </div>
      </div>

      <div className="space-y-4">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Mis Derechos ARCO (LFPDPPP)</h4>
         <p className="text-[10px] px-4 text-slate-500 font-medium leading-relaxed">
            Conforme al artículo 22 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), tienes derecho a conocer, rectificar y cancelar tus datos.
         </p>
         <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm space-y-2">
            <button 
               onClick={handleDownloadData}
               className="w-full p-4 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between group"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                     <Download className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-slate-900">Descargar mis datos</p>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Derecho de Acceso</p>
                  </div>
               </div>
            </button>
            <button 
               onClick={handleDeleteAccount}
               disabled={deleting}
               className="w-full p-4 rounded-3xl bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-between group"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-500">
                     <Trash2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-bold text-red-600">{deleteStep === 0 ? 'Eliminar mi cuenta y datos' : '¿Confirmas eliminar cuenta?'}</p>
                     <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">{deleting ? 'Eliminando...' : 'Derecho de Cancelación'}</p>
                  </div>
               </div>
            </button>
         </div>
      </div>

      <div className="space-y-4">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Configuración de Acceso</h4>
         <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            {[
              { label: 'Autenticación Biométrica', isToggle: true, enabled: isBiometricEnabled, onToggle: () => setIsBiometricEnabled(!isBiometricEnabled) },
              { label: 'Cifrado de Extremo a Extremo', status: 'No implementado (demo)', color: 'text-amber-500' },
              { label: 'Verificación en Dos Pasos', status: 'Configurado', color: 'text-emerald-500' },
              { label: 'Nivel de Privacidad', status: 'Máximo', color: 'text-blue-500' }
            ].map((item, i) => (
              <div key={i} className="px-8 py-6 flex justify-between items-center">
                 <span className="font-bold text-slate-700">{item.label}</span>
                 {item.isToggle ? (
                   <button 
                     onClick={item.onToggle}
                     className={cn(
                       "w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out",
                       item.enabled ? "bg-emerald-500" : "bg-slate-300"
                     )}
                   >
                     <div className={cn(
                       "bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ease-in-out",
                       item.enabled ? "translate-x-6" : "translate-x-0"
                     )} />
                   </button>
                 ) : (
                   <span className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.status}</span>
                 )}
              </div>
            ))}
         </div>
      </div>

      <div className="space-y-4">
         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Sesiones Activas</h4>
         <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">📱</div>
                  <div>
                     <p className="text-sm font-bold text-slate-900">Este Dispositivo (Tepic)</p>
                     <p className="text-[10px] text-slate-400">Hace un momento</p>
                  </div>
               </div>
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
         </div>
      </div>
    </div>
  );
}
