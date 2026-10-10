import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, MapPin, User, Loader2, Check, ShieldCheck, Scan, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { FacialRecognitionScanner } from './FacialRecognitionScanner';

export function CompleteProfileView({ profile, onUpdate }: { profile: any, onUpdate: (data: any) => void }) {
  const [data, setData] = useState({ 
    name: profile.name || '', 
    address: profile.address || '',
    documentId: profile.documentId || '',
    biometricVerified: profile.biometricVerified || false,
    biometricHash: profile.biometricHash || '',
    biometricPhotoUrl: profile.biometricPhotoUrl || ''
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(profile.biometricPhotoUrl || null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showBiometricScanner, setShowBiometricScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setData({...data, documentId: 'uploaded_photo'});
    }
  };

  const getUserLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setData({...data, address: `${position.coords.latitude}, ${position.coords.longitude}`});
          setLoadingLocation(false);
        },
        () => {
          alert('No se pudo obtener la ubicación.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocalización no soportada.');
      setLoadingLocation(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#0FA3B1]/20 border border-[#0FA3B1]/40 flex items-center justify-center text-[#0FA3B1]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-black text-white">Nayarit ID</h2>
            <p className="text-[10px] font-mono text-[#0FA3B1] uppercase font-bold">Registro de Identidad Digital</p>
          </div>
        </div>

        <div className="space-y-4">
            <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input 
                  className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 rounded-2xl text-white text-sm focus:border-[#0FA3B1] focus:outline-none transition-colors" 
                  placeholder="Nombre completo" 
                  value={data.name} 
                  onChange={(e) => setData({...data, name: e.target.value})} 
                />
            </div>

            <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input 
                  className="w-full bg-slate-900 border border-slate-800 p-4 pl-12 pr-12 rounded-2xl text-white text-sm focus:border-[#0FA3B1] focus:outline-none transition-colors" 
                  placeholder="Dirección o coordenadas" 
                  value={data.address} 
                  onChange={(e) => setData({...data, address: e.target.value})} 
                />
                <button 
                  onClick={getUserLocation}
                  className="absolute right-2 top-2 p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                  title="Obtener ubicación"
                >
                  {loadingLocation ? <Loader2 className="w-5 h-5 animate-spin text-[#0FA3B1]"/> : <MapPin className="w-5 h-5 text-slate-300" />}
                </button>
            </div>
            
            {/* Liveness Verification Button */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block px-1">
                Verificación de Prueba de Vida (Biometría Facial)
              </label>

              {data.biometricVerified ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-emerald-300">Prueba de Vida Verificada</p>
                      <p className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                        {data.biometricHash}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBiometricScanner(true)}
                    className="text-[10px] text-[#0FA3B1] font-bold underline"
                  >
                    Repetir
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowBiometricScanner(true)}
                  className="w-full py-4 bg-gradient-to-r from-[#0FA3B1] to-purple-600 hover:opacity-90 text-white rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Scan className="w-4 h-4" />
                  <span>Realizar Prueba de Vida Facial</span>
                </button>
              )}
            </div>

            {/* Standard INE Document Upload Optional */}
            <div className="text-center pt-2">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" capture="environment" className="hidden" />
              <button 
                  onClick={handleCameraClick}
                  className={cn(
                    "w-full py-4 border border-dashed rounded-2xl flex items-center justify-center gap-2 transition-all text-xs font-semibold",
                    imagePreview ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400"
                  )}
              >
                  {imagePreview ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Credencial de Identificación Cargada</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 text-slate-400" />
                      <span>Adjuntar Foto de INE (Opcional)</span>
                    </>
                  )}
              </button>
            </div>
            
            <button 
                onClick={() => onUpdate({ ...data, registrationVerified: data.biometricVerified || !!data.documentId })}
                className="w-full py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition-all"
            >
                Guardar y Activar Nayarit ID
            </button>
        </div>
      </motion.div>

      {/* Facial Recognition Modal */}
      {showBiometricScanner && (
        <FacialRecognitionScanner 
          onComplete={(res) => {
            setData(prev => ({
              ...prev,
              biometricVerified: true,
              biometricHash: res.biometricHash,
              biometricPhotoUrl: res.photoUrl,
              documentId: prev.documentId || res.biometricHash
            }));
            setImagePreview(res.photoUrl);
            setShowBiometricScanner(false);
          }}
          onCancel={() => setShowBiometricScanner(false)}
        />
      )}
    </div>
  );
}
