import React, { useState } from 'react';
import { motion } from 'motion/react';
import { login, auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { Bot, AlertCircle, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';

export function LoginView({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
      onLogin();
    } catch (err: any) {
      console.warn("Google login popup/domain issue, entering demo mode:", err);
      try {
        await signInAnonymously(auth);
      } catch (anonErr: any) {
        console.warn("Anonymous auth restricted on Firebase project console. Activating local demo mode:", anonErr?.message || anonErr);
      }
      onLogin();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.warn("Guest mode activating locally (anonymous auth restricted in project):", err?.message || err);
    } finally {
      onLogin();
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-6 text-center text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-20 h-20 bg-[#0FA3B1] rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-[#0FA3B1]/30"
      >
        <Bot className="w-10 h-10 text-white" />
      </motion.div>
      <h1 className="text-3xl font-serif font-black mb-2">Nayarit Digital</h1>
      <p className="text-slate-400 mb-8 max-w-xs text-sm">Bienvenido al portal ciudadano. Inicia sesión para acceder a tus trámites y servicios.</p>
      
      {error && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl max-w-xs text-left flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200">{error}</p>
        </div>
      )}

      <div className="w-full max-w-xs space-y-3">
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 bg-white text-slate-900 rounded-2xl font-bold shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
          ) : (
            <UserCheck className="w-4 h-4 text-[#0FA3B1]" />
          )}
          <span>{loading ? 'Iniciando sesión…' : 'Iniciar con Google'}</span>
        </button>

        <button 
          onClick={handleGuestLogin}
          disabled={loading}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700 disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Acceder en Modo Demo / Invitado</span>
        </button>
      </div>
    </div>
  );
}

