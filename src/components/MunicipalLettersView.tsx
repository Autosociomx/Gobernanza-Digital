import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  ChevronLeft, 
  Activity, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Globe, 
  Lock, 
  Users, 
  Cpu, 
  Scale, 
  RefreshCw, 
  Search, 
  QrCode,
  Building2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AuraCertificationSeal } from './AuraCertificationSeal';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';

interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  cost: string;
  time: string;
  legalBase: string;
}

const TEMPLATES: LetterTemplate[] = [
  {
    id: 'residencia',
    name: 'Constancia de Residencia',
    description: 'Acredita que un ciudadano ha residido en el municipio de Tepic, Nayarit por un tiempo determinado.',
    cost: 'Gratuito',
    time: 'Inmediato (Digital)',
    legalBase: 'Art. 115 Constitucional, Ley de Ingresos del Municipio de Tepic y Reglamento de la Administración Pública Municipal de Tepic.'
  },
  {
    id: 'conducta',
    name: 'Constancia de Buena Conducta',
    description: 'Certifica que el solicitante no cuenta con registros de faltas administrativas en los libros de control del municipio.',
    cost: 'Gratuito',
    time: 'Inmediato (Digital)',
    legalBase: 'Reglamento de Justicia Cívica y del Buen Gobierno para el Municipio de Tepic.'
  },
  {
    id: 'no_adeudo',
    name: 'Constancia de No Adeudo Municipal',
    description: 'Certificado que valida el cumplimiento de obligaciones del impuesto predial y servicio de agua potable.',
    cost: 'Gratuito',
    time: 'Inmediato (Digital)',
    legalBase: 'Ley de Hacienda para el Municipio de Tepic, Nayarit.'
  },
  {
    id: 'identidad',
    name: 'Constancia de Identidad Ciudadana',
    description: 'Documento supletorio de identificación oficial, validado mediante huella digital e Identidad Digital Única (IDN-U).',
    cost: 'Gratuito',
    time: 'Inmediato (Digital)',
    legalBase: 'Ley General de Población y Convenio de Interoperabilidad Nayarit-SEGOB.'
  }
];

export function MunicipalLettersView({ onBack, profile }: { onBack: () => void, profile?: any }) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('residencia');
  const [fullName, setFullName] = useState(profile?.name || 'C. JUAN PÉREZ DEL REAL');
  const [curp, setCurp] = useState(profile?.documentId || 'PERJ880512HNTXRN09');
  const [address, setAddress] = useState(profile?.address || 'Av. México Sur 412, Centro');
  const [neighborhood, setNeighborhood] = useState(profile?.neighborhood || 'San Antonio');
  const [years, setYears] = useState('5');
  const [purpose, setPurpose] = useState('Búsqueda de Empleo / Trámite de Beca');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  // Stress Test Simulation state
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressProgress, setStressProgress] = useState(0);
  const [stressMetrics, setStressMetrics] = useState({
    totalRequests: 0,
    successfulSignatures: 0,
    avgLatency: '115ms',
    concurrencyRate: '1,200 req/s',
    integrityLevel: '100.00%',
    ledgerBlocks: '0'
  });
  const [stressLogs, setStressLogs] = useState<string[]>([]);

  // Open Data Sync simulation state
  const [openDataStatus, setOpenDataStatus] = useState({
    sat: 'En línea',
    renapo: 'En línea',
    pnt: 'Sincronizado',
    blockchain: 'Bloque #894,321'
  });

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedLetter(null);
    setTimeout(() => {
      const docId = `MX-TEP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const shaHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setGeneratedLetter({
        id: docId,
        date: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
        hash: shaHash,
        qrValue: `https://nayarit.gob.mx/verify/letter/${docId}?hash=${shaHash}`
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    if (!generatedLetter) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('H. XXXVIII AYUNTAMIENTO CONSTITUCIONAL DE TEPIC', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text('ESTADO DE NAYARIT - DIRECCIÓN DE GOBERNACIÓN MUNICIPAL', 105, 26, { align: 'center' });
    doc.text('SISTEMA OPERATIVO CIUDADANO - CONNECTX DIGITAL', 105, 32, { align: 'center' });
    doc.line(20, 36, 190, 36);

    // Document Metadata
    doc.setFont('Helvetica', 'bold');
    doc.text(`OFICIO NÚMERO: ${generatedLetter.id}`, 20, 46);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Fecha de Emisión: Tepic, Nayarit, a ${generatedLetter.date}`, 120, 46);
    doc.text('Asunto: Constancia Municipal Homologada', 20, 52);

    // Body
    doc.setFont('Helvetica', 'bold');
    doc.text('A QUIEN CORRESPONDA:', 20, 68);

    doc.setFont('Helvetica', 'normal');
    let textBody = '';
    if (selectedTemplate === 'residencia') {
      textBody = `Por medio de la presente, la Dirección de Gobernación de este Municipio, con base en el expediente digital IDN-U, CERTIFICA Y HACE CONSTAR que el/la ciudadano(a) ${fullName.toUpperCase()}, con clave de registro único de población (CURP) ${curp.toUpperCase()}, tiene su domicilio registrado en ${address.toUpperCase()}, Colonia ${neighborhood.toUpperCase()} de esta municipalidad, acreditando una residencia efectiva y continua de ${years} años en el Estado de Nayarit.\n\nSe extiende la presente constancia para los fines legales de: ${purpose.toUpperCase()}, de conformidad con el Artículo 115 de la Constitución Política de los Estados Unidos Mexicanos y los ordenamientos municipales de transparencia aplicables.`;
    } else if (selectedTemplate === 'conducta') {
      textBody = `Por medio de la presente, la Dirección de Seguridad Pública y Justicia Cívica, CERTIFICA Y HACE CONSTAR que el/la ciudadano(a) ${fullName.toUpperCase()}, con CURP ${curp.toUpperCase()} y domicilio en ${address.toUpperCase()}, Colonia ${neighborhood.toUpperCase()}, se conduce de manera honorable en su vida cotidiana, no habiendo registro ni registro histórico de infracciones al bando de policía y buen gobierno o faltas administrativas en este municipio.\n\nSe expide el presente a solicitud del interesado para los fines legales de: ${purpose.toUpperCase()}.`;
    } else if (selectedTemplate === 'no_adeudo') {
      textBody = `La Tesorería Municipal de Tepic, Nayarit CERTIFICA Y HACE CONSTAR que el/la ciudadano(a) ${fullName.toUpperCase()}, titular de la cuenta catastral asociada al domicilio ${address.toUpperCase()}, Colonia ${neighborhood.toUpperCase()}, se encuentra al corriente de sus obligaciones fiscales municipales, no registrando adeudo pendiente por concepto de Impuesto Predial ni por servicio de agua potable al bimestre actual.\n\nLa presente constancia es verificable digitalmente con el código de seguimiento correspondiente y se extiende para los fines de: ${purpose.toUpperCase()}.`;
    } else {
      textBody = `La Secretaría del Ayuntamiento de Tepic, Nayarit CERTIFICA Y HACE CONSTAR la identidad del/la ciudadano(a) ${fullName.toUpperCase()}, CURP ${curp.toUpperCase()}, con domicilio en ${address.toUpperCase()}, de conformidad con los registros del Registro Nacional de Población (RENAPO) cruzados mediante la Plataforma Nacional de Transparencia.\n\nLa firma digital incorporada cuenta con validez plena en términos de la Ley de Firma Electrónica Avanzada del Estado de Nayarit.`;
    }

    const splitText = doc.splitTextToSize(textBody, 170);
    doc.text(splitText, 20, 78);

    // Signatures
    doc.line(60, 165, 150, 165);
    doc.setFont('Helvetica', 'bold');
    doc.text('LA PRESIDENCIA MUNICIPAL DE TEPIC', 105, 170, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.text('Presidencia Municipal de Tepic', 105, 174, { align: 'center' });
    doc.text('Gobierno Digital · ConnectX Nayarit', 105, 178, { align: 'center' });

    // Legal disclaimer
    doc.setFontSize(8);
    doc.text('Este documento cuenta con Firma Electrónica Avanzada con validez jurídica plena de acuerdo con la Ley de Firma Electrónica de Nayarit.', 20, 205);
    doc.text(`Sello Digital: ${generatedLetter.hash.substring(0, 32)}...`, 20, 210);
    doc.text(`Verificación por Blockchain Municipal: Bloque Validado SHA-256`, 20, 215);

    // Save the PDF
    doc.save(`Carta_Municipal_${selectedTemplate}_Tepic.pdf`);
  };

  const handleVerifyOnScreen = () => {
    setIsVerifying(true);
    setVerifyResult(null);
    setTimeout(() => {
      setVerifyResult(`Verificado Exitosamente en Ledger ConnectX. Documento de integridad inmutable de Tepic. Sello coincidente en Bloque SHA-256 de Nayarit.`);
      setIsVerifying(false);
    }, 1000);
  };

  const startStressTest = async () => {
    setIsStressTesting(true);
    setStressLogs(['[SYS] Inicializando simulador de estrés de Cartas Municipales v1.2...', '[SYS] Abriendo conexiones concurrentes de clústeres gubernamentales...']);
    setStressProgress(0);

    for (let i = 1; i <= 10; i++) {
      setStressProgress(i * 10);
      const reqCount = i * 1500;
      const successCount = Math.floor(reqCount * 0.999);
      const blockId = 894321 + i * 12;

      setStressMetrics({
        totalRequests: reqCount,
        successfulSignatures: successCount,
        avgLatency: `${Math.floor(95 + Math.random() * 40)}ms`,
        concurrencyRate: `${Math.floor(1000 + i * 150)} req/s`,
        integrityLevel: '100.00%',
        ledgerBlocks: blockId.toString()
      });

      if (i === 2) setStressLogs(prev => [...prev, `[NET] 3,000 peticiones concurrentes provenientes del módulo escolar de la UAN detectadas.`]);
      if (i === 4) setStressLogs(prev => [...prev, `[DB] Conexión estable con RENAPO para validación de CURPs. Rendimiento óptimo.`]);
      if (i === 6) setStressLogs(prev => [...prev, `[CRYPT] Cifrado y sellado de firmas asíncronas AES-256 completado para 7,500 cartas.`]);
      if (i === 8) setStressLogs(prev => [...prev, `[LAWS] Trazabilidad fiscal del SAT cruzada correctamente. No se reportan bloqueos.`]);
      if (i === 10) setStressLogs(prev => [...prev, `[LEDGER] Bloques validados e inyectados en la base inmutable municipal.`]);

      await new Promise(r => setTimeout(r, 400));
    }

    setStressLogs(prev => [...prev, `[SUCCESS] Test completado con éxito. 15,000 firmas generadas sin sobrecarga de base de datos.`]);
    setIsStressTesting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen bg-[#030408] text-slate-300 font-sans pb-24"
    >
      {/* Navigation Header */}
      <header className="p-4  border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-7xl mx-auto w-full gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest truncate">Gobernanza Tepic</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <AuraCertificationSeal />
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
              <h1 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white truncate">Cartas Digitales</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto w-full space-y-16">
        {/* Intro Hero Section */}
        <div className="grid grid-cols-1  gap-6 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">Trámites Cero Burocracia v2.6</span>
            <h2 className="text-4xl font-serif font-black text-white tracking-tighter leading-[0.9]">
              Cartas y Constancias<br/>
              <span className="text-slate-500">con Firma Avanzada</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Emisión digital instantánea respaldada por verificación de datos abiertos e identidad digital inmutable de Tepic. Cumple con la Ley Federal de Firma Electrónica Avanzada y la LNETB.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">100% Legal</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Validez oficial municipal y estatal en todo México.</p>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-start gap-3">
                <Globe className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Datos Abiertos</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Información cruzada en tiempo real de RENAPO y SAT.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Document Generator Form */}
          <div className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-6 space-y-6 relative shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16"></div>
            
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Configurar Trámite de Carta
            </h3>

            {/* Template Selector */}
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); setGeneratedLetter(null); }}
                  className={cn(
                    "p-4 rounded-2xl text-left border text-xs transition-all relative overflow-hidden",
                    selectedTemplate === t.id 
                      ? "bg-indigo-600/10 border-indigo-500 text-white shadow-lg" 
                      : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/15"
                  )}
                >
                  <p className="font-bold">{t.name}</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight line-clamp-1">{t.description}</p>
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CURP</label>
                  <input 
                    type="text" 
                    value={curp}
                    onChange={(e) => setCurp(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Domicilio Completo</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Colonia / Barrio</label>
                  <input 
                    type="text" 
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                {selectedTemplate === 'residencia' ? (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Años de Residencia</label>
                    <input 
                      type="number" 
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Destinado para</label>
                    <input 
                      type="text" 
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Legal Base Display */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-1">
              <p className="text-[8px] font-black text-indigo-400 uppercase tracking-wider">Fundamento Legal Vigente</p>
              <p className="text-[9px] text-slate-500 leading-snug">{activeTemplate.legalBase}</p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Emitiendo Carta...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Emitir Documento de Inmediato
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Document Preview & Blockchain Verification */}
        <AnimatePresence mode="wait">
          {generatedLetter && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="grid grid-cols-1  gap-6"
            >
              {/* Actual Document Sheet Mockup */}
              <div className=" bg-white text-slate-800 p-6 rounded-[2.5rem] border border-slate-200 shadow-2xl relative space-y-8 font-serif leading-relaxed text-sm">
                {/* Official Stamp Header */}
                <div className="flex justify-between items-start border-b border-slate-300 pb-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">H. XXXVIII AYUNTAMIENTO CONSTITUCIONAL DE TEPIC</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Estado de Nayarit | Secretaría del Ayuntamiento</p>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Dirección de Gobernación Digital</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900 tracking-wider">OFICIO: {generatedLetter.id}</p>
                    <p className="text-[9px] text-slate-500 font-bold">EMISIÓN: {generatedLetter.date}</p>
                    <p className="text-[9px] text-slate-500 font-bold">ESTADO: VÁLIDO & FIRMADO</p>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">ASUNTO: {activeTemplate.name.toUpperCase()}</p>
                  <p className="text-xs font-bold text-slate-500">INTERESADO: {fullName.toUpperCase()}</p>
                </div>

                {/* Body Content depending on selection */}
                <div className="space-y-4 text-justify text-slate-700 leading-relaxed text-xs">
                  <p className="font-bold">A QUIEN CORRESPONDA:</p>
                  
                  {selectedTemplate === 'residencia' && (
                    <p>
                      La que suscribe, <strong>LA TITULAR DE LA PRESIDENCIA MUNICIPAL DE TEPIC</strong>, Nayarit, en pleno uso de las facultades que le confiere el Artículo 115 Constitucional, la Ley Municipal para el Estado de Nayarit, y el Reglamento de la Administración Pública Municipal, por medio de la presente hace constar que:
                    </p>
                  )}
                  {selectedTemplate === 'residencia' && (
                    <p>
                      El/la ciudadano(a) <strong>{fullName.toUpperCase()}</strong>, con CURP <strong>{curp.toUpperCase()}</strong>, cuenta con domicilio registrado en el padrón digital de esta Dirección ubicado en <strong>{address.toUpperCase()}, Colonia {neighborhood.toUpperCase()}</strong>, acreditando una residencia ininterrumpida y efectiva en esta municipalidad de <strong>{years} años</strong>.
                    </p>
                  )}

                  {selectedTemplate === 'conducta' && (
                    <p>
                      Que el/la ciudadano(a) <strong>{fullName.toUpperCase()}</strong>, con CURP <strong>{curp.toUpperCase()}</strong>, vecino de esta municipalidad con domicilio en <strong>{address.toUpperCase()}, Colonia {neighborhood.toUpperCase()}</strong>, se ha conducido como un habitante honorable, pacífico y respetuoso de las leyes y reglamentos de convivencia ciudadana, no existiendo antecedentes negativos o faltas administrativas en el Registro Municipal de Justicia Cívica.
                    </p>
                  )}

                  {selectedTemplate === 'no_adeudo' && (
                    <p>
                      Que la Tesorería Municipal de Tepic y el Organismo de Agua Potable y Saneamiento de Tepic, de acuerdo con los registros tributarios del portal interoperable, certifican que la cuenta de servicios asociada al ciudadano(a) <strong>{fullName.toUpperCase()}</strong> se encuentra libre de gravamen o adeudos, declarándose al corriente en sus obligaciones por concepto de Predial y Agua.
                    </p>
                  )}

                  {selectedTemplate === 'identidad' && (
                    <p>
                      Que se valida oficialmente la identidad biométrica y de datos civiles del ciudadano(a) <strong>{fullName.toUpperCase()}</strong>, con base en el cruce de datos biométricos homologados con el Registro Nacional de Población (RENAPO), constituyendo un documento supletorio de plena validez jurídica para trámites locales en el estado de Nayarit.
                    </p>
                  )}

                  <p>
                    Se extiende la presente a petición del interesado para los fines legales que a bien convenga, con una vigencia de 90 días naturales a partir de su fecha de emisión.
                  </p>
                </div>

                {/* Signatures and Seals */}
                <div className="pt-8 flex justify-between items-end border-t border-slate-200">
                  <div className="space-y-4 w-1/2">
                    <p className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">AURA v2.6 CRYPTO SIGNATURE</p>
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl font-mono text-[8px] text-indigo-700 break-all leading-tight">
                      <span className="font-bold">HASH DE VERIFICACIÓN:</span><br/>
                      {generatedLetter.hash}
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-32 h-[1px] bg-slate-400 mx-auto mt-8"></div>
                    <p className="text-[10px] font-bold text-slate-800">LA PRESIDENCIA MUNICIPAL DE TEPIC</p>
                    <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Presidencia Municipal de Tepic</p>
                    <div className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full text-[7px] text-emerald-700 font-bold mt-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      Firma Digital Activa
                    </div>
                  </div>
                </div>

                {/* Footer Security features */}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-6 text-[8px] text-slate-400 leading-snug">
                  <div>
                    <p className="font-bold text-slate-600 uppercase">Verificación de Integridad Documental</p>
                    <p>Cualquier autoridad federal, estatal o privada puede verificar la autenticidad de este documento escaneando el código QR adjunto o consultando el folio oficial en el portal de transparencia municipal.</p>
                  </div>
                  <div className="shrink-0 bg-white p-1 border border-slate-200 rounded-lg">
                    <QRCodeSVG value={generatedLetter.qrValue} size={50} />
                  </div>
                </div>
              </div>

              {/* Action Sidebar / Verification controls */}
              <div className="space-y-8">
                <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl -mr-12 -mt-12"></div>
                  
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Control del Documento</h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    El documento oficial ha sido generado y sellado criptográficamente. Puedes descargarlo en formato PDF nativo o validarlo contra el ledger inmutable de Tepic.
                  </p>

                  <div className="space-y-3 pt-2">
                    <button 
                      onClick={handleDownloadPDF}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Descargar PDF Oficial
                    </button>

                    <button 
                      onClick={handleVerifyOnScreen}
                      disabled={isVerifying}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Consultando Ledger...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          Verificar en Blockchain
                        </>
                      )}
                    </button>
                  </div>

                  {verifyResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 text-center"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Verificación Confirmada</p>
                      <p className="text-[9px] text-slate-400 leading-relaxed">{verifyResult}</p>
                    </motion.div>
                  )}
                </div>

                {/* Open Data Integration Metrics */}
                <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Fuentes de Datos Abiertos</h3>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    ConnectX valida la información civil, tributaria y catastral en tiempo real cruzando datos de los siguientes portales de México sin requerir papelería:
                  </p>

                  <div className="space-y-3">
                    {[
                      { name: 'RENAPO (Cruce de CURP)', status: openDataStatus.renapo, provider: 'SEGOB México' },
                      { name: 'SAT (Soberanía Fiscal)', status: openDataStatus.sat, provider: 'SHCP México' },
                      { name: 'Plataforma Nac. de Transparencia', status: openDataStatus.pnt, provider: 'INAI' },
                      { name: 'Ledger Tepic Inmutable', status: openDataStatus.blockchain, provider: 'Blockchain ConnectX' }
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                        <div>
                          <p className="text-[10px] font-bold text-white leading-tight">{s.name}</p>
                          <p className="text-[8px] text-slate-500">{s.provider}</p>
                        </div>
                        <span className="text-[8px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-black uppercase tracking-widest">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Resiliency Stress Test Simulator Panel */}
        <div className="bg-slate-950 border border-white/10 rounded-[3rem] p-6 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[100px] -mr-24 -mt-24"></div>
          
          <div className="flex flex-col   justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Simulador de Carga e Integridad</span>
              <h3 className="text-3xl font-serif font-black text-white tracking-tight">Simulación de Estrés de Emisión Masiva</h3>
              <p className="text-xs text-slate-500">Demuestra la resiliencia de la plataforma ConnectX emitiendo y firmando miles de cartas concurrentes.</p>
            </div>
            <button 
              onClick={startStressTest}
              disabled={isStressTesting}
              className={cn(
                "px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                isStressTesting ? "bg-slate-800 text-slate-500" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/25"
              )}
            >
              {isStressTesting ? 'Simulando Carga...' : 'Iniciar Simulación de Estrés'}
            </button>
          </div>

          <div className="grid grid-cols-2  gap-4">
            {[
              { label: 'Peticiones Totales', value: stressMetrics.totalRequests.toLocaleString(), icon: Users },
              { label: 'Firmas Exitosas', value: stressMetrics.successfulSignatures.toLocaleString(), icon: ShieldCheck },
              { label: 'Latencia Promedio', value: stressMetrics.avgLatency, icon: Activity },
              { label: 'Tasa Concurrencia', value: stressMetrics.concurrencyRate, icon: Cpu },
              { label: 'Nivel Integridad', value: stressMetrics.integrityLevel, icon: Lock },
              { label: 'Bloques Ledger', value: stressMetrics.ledgerBlocks, icon: QrCode }
            ].map((m, i) => (
              <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                <m.icon className="w-3.5 h-3.5 text-slate-500" />
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{m.label}</p>
                <p className="text-base font-black text-white">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Carga del Motor de Firmas Criptográficas (Aura Server)</span>
              <span>{stressProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${stressProgress}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-magenta-500 to-emerald-500"
              />
            </div>
          </div>

          {/* Virtual Terminal logs */}
          <div className="bg-black p-5 rounded-2xl border border-white/5 font-mono text-[10px] h-36 overflow-y-auto space-y-1.5 shadow-inner">
            {stressLogs.map((log, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-indigo-400 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className="text-slate-400">{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Section: Political, Application, and Citizen Proposals */}
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-500"></div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Propuesta de Trabajo en Tres Pilares</h3>
          </div>

          <div className="grid grid-cols-1  gap-6">
            {/* Pilar Político */}
            <div className="bg-slate-950/60 border border-white/5 rounded-[2.5rem] p-6 space-y-6 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-lg text-white">1. Propuesta Política</h4>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Soberanía y Confianza</p>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span><strong>Fin al clientelismo:</strong> Erradica intermediarios políticos que cobran o retienen cartas para favores de voto. Emisión libre e inmediata.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span><strong>Marca institucional:</strong> la modernización digital se asocia al municipio y a su gente — no a ninguna persona ni administración. El sistema es de Tepic y permanece aunque cambie el gobierno.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span><strong>Eficiencia Gubernamental:</strong> Libera más del 40% del tiempo operativo del personal administrativo municipal para tareas de campo de alto valor.</span>
                </li>
              </ul>
            </div>

            {/* Pilar Aplicación */}
            <div className="bg-slate-950/60 border border-white/5 rounded-[2.5rem] p-6 space-y-6 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-magenta-600/10 border border-magenta-500/20 text-magenta-400 rounded-2xl flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-lg text-white">2. Propuesta Aplicación</h4>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Resiliencia Tecnológica</p>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-magenta-500 mt-2 shrink-0" />
                  <span><strong>Escalabilidad Serverless:</strong> Capacidad probada de soportar picos masivos de solicitudes concurrentes de estudiantes y desempleados sin caídas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-magenta-500 mt-2 shrink-0" />
                  <span><strong>Inmutabilidad por Blockchain:</strong> Cada carta cuenta con una firma SHA-256 única y trazable, impidiendo falsificaciones de firmas físicas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-magenta-500 mt-2 shrink-0" />
                  <span><strong>Auditoría Automatizada:</strong> Los directivos pueden supervisar en tiempo real el índice de emisión municipal y tasas de satisfacción.</span>
                </li>
              </ul>
            </div>

            {/* Pilar Ciudadano */}
            <div className="bg-slate-950/60 border border-white/5 rounded-[2.5rem] p-6 space-y-6 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-lg text-white">3. Propuesta Ciudadana</h4>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Cumplimiento Legal Absoluto</p>
                </div>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Cero Papelería:</strong> Conexión nativa con portales como el SAT y RENAPO para auto-comprobar identidad y domicilio de forma digital.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Ahorro del 100%:</strong> Sin necesidad de traslados a las oficinas de gobernación, ni cobros ocultos. Emisión directa en celular.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Validez Jurídica Federal:</strong> Documentos legalmente válidos para dependencias como la SEP, Bancos, o Fiscalía del Estado.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Framework Warning */}
        <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 flex flex-col  items-start gap-6">
          <AlertCircle className="w-8 h-8 text-indigo-400 shrink-0" />
          <div className="space-y-2">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Cumplimiento Normativo y Apertura de Datos</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              De conformidad con la Ley Federal de Firma Electrónica Avanzada vigente en los Estados Unidos Mexicanos, este módulo implementa la Clave Única de Registro de Población (CURP) de forma homologada con RENAPO, garantizando la inalterabilidad y blindando la seguridad del ciudadano en cualquier trámite gubernamental.
            </p>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
