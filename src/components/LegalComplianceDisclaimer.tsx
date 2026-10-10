import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function LegalComplianceDisclaimer({ onViewCert }: { onViewCert?: () => void }) {
  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-lg border border-slate-700">
      <div className="flex items-start gap-4">
        <ShieldCheck className="w-10 h-10 text-emerald-400 flex-shrink-0" />
        <div>
          <h3 className="font-serif font-black text-lg mb-2">Fundamento Legal y Cumplimiento Federal</h3>
          <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Nuestra plataforma opera en estricto cumplimiento con la <strong>Ley Federal de Digitalización</strong>, garantizando la validez, integridad y seguridad de todos los trámites y transacciones realizadas. Cada pago efectuado a través de nuestra billetera digital cuenta con plena validez jurídica y trazabilidad institucional, cumpliendo con los estándares de autenticación y firma electrónica avanzada requeridos.
          </p>
          <button 
            onClick={onViewCert}
            className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:underline"
          >
              Ver Certificación Legal
          </button>
        </div>
      </div>
    </div>
  );
}
