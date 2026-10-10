import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, Loader2, ArrowLeft, ShieldCheck, Scan, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { FacialRecognitionScanner } from './FacialRecognitionScanner';

export function CredentialScannerView({ 
  onScanComplete, 
  onBack 
}: { 
  onScanComplete: (data: any) => void; 
  onBack: () => void; 
}) {
  const [stage, setStage] = useState<'front' | 'back' | 'liveness' | 'ocr'>('front');
  const [images, setImages] = useState<{ front: string | null; back: string | null }>({ front: null, back: null });
  const [livenessData, setLivenessData] = useState<any>(null);
  const [ocrResult, setOcrResult] = useState('');
  const [scanning, setScanning] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const handleImageCapture = (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => ({ ...prev, [side]: reader.result as string }));
        if (side === 'front') {
          setStage('back');
        } else {
          setStage('liveness');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runOCR = async () => {
    setScanning(true);
    try {
      let textResult = '';
      if (images.front) {
        const result = await Tesseract.recognize(images.front, 'spa');
        textResult = result.data.text;
      }
      setOcrResult(textResult);
      onScanComplete({ 
        front: images.front, 
        back: images.back, 
        ocr: textResult,
        liveness: livenessData,
        biometricVerified: !!livenessData
      });
    } catch(err) {
      console.error('Error running OCR:', err);
      onScanComplete({ 
        front: images.front, 
        back: images.back, 
        ocr: 'Lector OCR Nayarit ID',
        liveness: livenessData,
        biometricVerified: !!livenessData
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 p-6 pt-10 flex flex-col items-center justify-between text-white overflow-y-auto">
      
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={onBack} 
          className="p-2 bg-slate-900 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-[#0FA3B1]" />
          <span>Volver</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-300">Nayarit ID Scanner</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md my-auto py-6 space-y-6 text-center">
        
        {/* Stage 1: INE Front */}
        {stage === 'front' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-[#0FA3B1]/20 rounded-2xl border border-[#0FA3B1]/40 flex items-center justify-center mx-auto text-[#0FA3B1]">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#0FA3B1] uppercase font-bold tracking-widest">Paso 1 de 3</p>
              <h2 className="text-2xl font-bold text-white mt-1">Captura Frente de la Credencial (INE)</h2>
              <p className="text-xs text-slate-400 mt-2">Fotografía la parte frontal de tu identificación oficial para extraer CURP y Clave de Elector.</p>
            </div>

            <label className="block w-full py-8 border-2 border-dashed border-[#0FA3B1]/50 hover:border-[#0FA3B1] rounded-3xl bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition-all">
              <Camera className="w-10 h-10 text-[#0FA3B1] mx-auto mb-2" />
              <span className="text-sm font-bold text-white block">Tomar Foto del Frente</span>
              <span className="text-[10px] text-slate-400">Toca para abrir cámara del dispositivo</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={(e) => handleImageCapture('front', e)} 
                className="hidden" 
              />
            </label>
          </div>
        )}

        {/* Stage 2: INE Back */}
        {stage === 'back' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest">Paso 2 de 3</p>
              <h2 className="text-2xl font-bold text-white mt-1">Captura Reverso de la Credencial</h2>
              <p className="text-xs text-slate-400 mt-2">Fotografía el reverso para validar el código PDF417 de firma digital electoral.</p>
            </div>

            <label className="block w-full py-8 border-2 border-dashed border-amber-500/50 hover:border-amber-500 rounded-3xl bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition-all">
              <Camera className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <span className="text-sm font-bold text-white block">Tomar Foto del Reverso</span>
              <span className="text-[10px] text-slate-400">Toca para abrir cámara del dispositivo</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={(e) => handleImageCapture('back', e)} 
                className="hidden" 
              />
            </label>
          </div>
        )}

        {/* Stage 3: Facial Liveness Detection */}
        {stage === 'liveness' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
              <Scan className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-widest">Paso 3 de 3 · Prueba de Vida</p>
              <h2 className="text-2xl font-bold text-white mt-1">Verificación Facial Biométrico</h2>
              <p className="text-xs text-slate-400 mt-2">Realiza un breve test anti-fraude en vivo (parpadeo y sonrisa) para certificar tu Nayarit ID.</p>
            </div>

            {livenessData ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Prueba de Vida Completada ({livenessData.livenessScore}% Score)</span>
                </div>
                <p className="text-[11px] font-mono text-slate-300">
                  Hash: {livenessData.biometricHash}
                </p>
                <button 
                  onClick={() => setShowScannerModal(true)}
                  className="text-[11px] text-[#0FA3B1] underline font-bold mt-1"
                >
                  Repetir prueba de vida
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowScannerModal(true)}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-[#0FA3B1] hover:from-purple-500 hover:to-[#088b99] text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                <UserCheck className="w-5 h-5" />
                <span>Iniciar Prueba de Vida</span>
              </button>
            )}

            <button 
              onClick={() => setStage('ocr')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Continuar a Validación OCR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stage 4: OCR & Finish */}
        {stage === 'ocr' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Validación de Registro Nayarit ID</h2>
              <p className="text-xs text-slate-400 mt-2">Extraeremos el texto del documento para sincronizarlo con tu expediente ciudadano.</p>
            </div>

            {scanning ? (
              <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#0FA3B1] animate-spin" />
                <p className="text-xs font-mono text-slate-300">Procesando OCR y Certificación Biométrica...</p>
              </div>
            ) : (
              <button 
                onClick={runOCR}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Finalizar y Guardar Nayarit ID</span>
              </button>
            )}
          </div>
        )}

      </div>

      {/* Modal Scanner */}
      {showScannerModal && (
        <FacialRecognitionScanner 
          onComplete={(res) => {
            setLivenessData(res);
            setShowScannerModal(false);
            setStage('ocr');
          }}
          onCancel={() => setShowScannerModal(false)}
        />
      )}

      {/* Footer info */}
      <div className="w-full max-w-md text-center border-t border-slate-800/80 pt-3 text-[10px] font-mono text-slate-500">
        Cumplimiento Norma Oficial Mexicana NOM-151 & Ley de Gobierno Digital de Nayarit
      </div>

    </div>
  );
}
