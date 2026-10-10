import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  ShieldAlert, 
  Star, 
  Clock, 
  UserX, 
  CheckCircle2,
  AlertTriangle,
  Send,
  EyeOff
} from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';

export function MysteryShopperView({ user, onBack }: { user: User | null, onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [dependencia, setDependencia] = useState('');
  const [tramite, setTramite] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [tiempoEspera, setTiempoEspera] = useState('');
  const [intentoCorrupcion, setIntentoCorrupcion] = useState<boolean | null>(null);
  const [comentarios, setComentarios] = useState('');
  const [anonimo, setAnonimo] = useState(true);

  const dependencias = [
    'Tesorería Municipal',
    'Registro Civil',
    'Desarrollo Urbano',
    'Seguridad Pública',
    'Servicios Públicos (Agua/Basura)',
    'Atención Ciudadana'
  ];

  const handleSubmit = async () => {
    if (!dependencia || calificacion === 0 || intentoCorrupcion === null) {
      alert("Por favor, completa los campos clave (Dependencia, Calificación y si hubo solicitud de soborno).");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'auditorias_ciudadanas'), {
        uid: anonimo ? 'ANONIMO' : (user?.uid || 'NO_AUTH'),
        dependencia,
        tramite,
        calificacion,
        tiempoEspera,
        intentoCorrupcion,
        comentarios,
        timestamp: serverTimestamp(),
        estado: 'recibido',
        folioAuditoria: `MS-${Date.now().toString(36).toUpperCase()}-TEP`
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Error al enviar la auditoría.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-2 pb-10 space-y-6 px-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Auditoría Registrada</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
          Tu reporte como <strong>Ciudadano Auditor (Mystery Shopper)</strong> ha sido encriptado y enviado directamente al Órgano Interno de Control.
        </p>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Folio de Seguimiento Ciego</p>
          <p className="text-lg font-mono font-black text-slate-700">MS-{Date.now().toString(36).toUpperCase().slice(-6)}-TEP</p>
        </div>
        <button 
          onClick={onBack}
          className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest w-full"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auditoría Ciudadana</span>
        <div className="w-10" />
      </div>

      <div className="px-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-10 -mt-10 blur-3xl"></div>
           <div className="flex items-center gap-2 mb-4">
              <EyeOff className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Programa Mystery Shopper</span>
           </div>
           <h3 className="text-2xl font-serif font-black mb-2 leading-tight">Auditoría de Servicios Públicos</h3>
           <p className="text-xs text-slate-400 leading-relaxed">
             Evalúa la calidad del servicio gubernamental. Tu reporte es <strong>estrictamente confidencial</strong> y activa protocolos de revisión del Órgano Interno de Control.
           </p>
        </div>
      </div>

      <div className="px-4 space-y-6">
        
        {/* Paso 1: Identificación del Servicio */}
        <div className="space-y-3">
           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
             1. ¿Qué dependencia visitaste?
           </h4>
           <div className="grid grid-cols-2 gap-2">
              {dependencias.map(dep => (
                <button 
                  key={dep}
                  onClick={() => setDependencia(dep)}
                  className={cn(
                    "p-3 rounded-2xl border text-left text-xs font-bold transition-all",
                    dependencia === dep 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                      : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {dep}
                </button>
              ))}
           </div>
           <input 
             type="text" 
             placeholder="¿Qué trámite realizaste? (Opcional)" 
             value={tramite}
             onChange={(e) => setTramite(e.target.value)}
             className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mt-2"
           />
        </div>

        {/* Paso 2: Evaluación */}
        <div className="space-y-3">
           <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
             2. Calidad y Tiempo
           </h4>
           <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Calificación General</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setCalificacion(star)}
                      className="p-2"
                    >
                      <Star className={cn("w-8 h-8 transition-colors", calificacion >= star ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Tiempo aproximado de espera</p>
                <div className="flex flex-wrap gap-2">
                  {['Menos de 15 min', '15-30 min', '30-60 min', 'Más de 1 hora'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTiempoEspera(t)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-xs font-bold transition-colors",
                        tiempoEspera === t ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
           </div>
        </div>

        {/* Paso 3: Integridad */}
        <div className="space-y-3">
           <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
             <AlertTriangle className="w-3 h-3" /> 3. Alerta de Integridad
           </h4>
           <div className="bg-rose-50 p-5 rounded-[2rem] border border-rose-100 space-y-4">
              <p className="text-sm font-bold text-rose-900">¿El servidor público te insinuó o solicitó un pago no oficial (soborno/mordida) para agilizar el trámite?</p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setIntentoCorrupcion(true)}
                   className={cn(
                     "flex-1 py-3 rounded-xl font-bold text-sm transition-colors border",
                     intentoCorrupcion === true ? "bg-rose-600 text-white border-rose-600 shadow-md" : "bg-white text-rose-600 border-rose-200 hover:bg-rose-100"
                   )}
                 >
                   Sí, ocurrió
                 </button>
                 <button 
                   onClick={() => setIntentoCorrupcion(false)}
                   className={cn(
                     "flex-1 py-3 rounded-xl font-bold text-sm transition-colors border",
                     intentoCorrupcion === false ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                   )}
                 >
                   No, todo en orden
                 </button>
              </div>
           </div>
        </div>

        {/* Paso 4: Evidencia y Envio */}
        <div className="space-y-4">
          <textarea 
             placeholder="Detalles adicionales, nombres, ventanillas o descripción de los hechos..."
             value={comentarios}
             onChange={(e) => setComentarios(e.target.value)}
             className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[100px]"
          />

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
             <div 
               onClick={() => setAnonimo(!anonimo)}
               className={cn("w-12 h-6 rounded-full p-1 cursor-pointer transition-colors", anonimo ? "bg-indigo-500" : "bg-slate-300")}
             >
               <div className={cn("w-4 h-4 bg-white rounded-full transition-transform", anonimo ? "translate-x-6" : "translate-x-0")}></div>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-700">Denuncia Anónima</p>
               <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Si se activa, no guardaremos tu Nayarit ID ni datos personales en el reporte.</p>
             </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Enviar Auditoría Oficial'}
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
