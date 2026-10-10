import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Star, Award } from 'lucide-react';

export function AuraCertificationSeal() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-magenta-600 to-indigo-600 rounded-full border border-white/20 shadow-lg shadow-magenta-500/20"
    >
      <div className="flex -space-x-1">
         <Star className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
         <Star className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
         <Star className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
      </div>
      <span className="text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap">Certificación Aura v2.6</span>
      <Award className="w-3 h-3 text-white" />
    </motion.div>
  );
}
