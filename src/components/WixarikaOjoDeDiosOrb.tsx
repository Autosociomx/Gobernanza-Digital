import React from 'react';
import { motion } from 'motion/react';
import { Mic, Volume2, Sparkles } from 'lucide-react';

interface WixarikaOjoDeDiosOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isListening?: boolean;
  isSpeaking?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const WixarikaOjoDeDiosOrb: React.FC<WixarikaOjoDeDiosOrbProps> = ({
  size = 'md',
  isListening = false,
  isSpeaking = false,
  onClick,
  showLabel = true,
  label,
  className = ''
}) => {
  // Dimensions
  const sizeMap = {
    sm: { box: 'w-12 h-12', svg: 48, labelText: 'text-[9px]', outerRing: 'w-16 h-16' },
    md: { box: 'w-16 h-16', svg: 64, labelText: 'text-[10px]', outerRing: 'w-24 h-24' },
    lg: { box: 'w-24 h-24', svg: 96, labelText: 'text-xs', outerRing: 'w-32 h-32' },
    xl: { box: 'w-36 h-36', svg: 144, labelText: 'text-sm', outerRing: 'w-48 h-48' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Outer Glowing Energy Rings (Cyan & Orange) */}
      <div className="relative flex items-center justify-center cursor-pointer group" onClick={onClick}>
        
        {/* Pulsing Ripple 1 - Cyan Outer Glow */}
        <motion.div
          animate={{
            scale: isListening ? [1, 1.35, 1] : isSpeaking ? [1, 1.25, 1] : [1, 1.12, 1],
            opacity: isListening ? [0.6, 0.9, 0.6] : [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: isListening ? 1.2 : isSpeaking ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute rounded-full border-2 border-[#0FA3B1] bg-[#0FA3B1]/10 blur-sm pointer-events-none ${currentSize.outerRing}`}
        />

        {/* Pulsing Ripple 2 - Orange Sacred Glow */}
        <motion.div
          animate={{
            scale: isListening ? [1.2, 1, 1.2] : isSpeaking ? [1.15, 1, 1.15] : [1.08, 1, 1.08],
            opacity: isListening ? [0.8, 0.4, 0.8] : [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: isListening ? 1.4 : 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute rounded-full border-2 border-[#FF6B35] bg-[#FF6B35]/10 blur-xs pointer-events-none ${currentSize.outerRing}`}
        />

        {/* Main Interactive Orb Body */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            rotate: isListening ? [0, 90, 180, 270, 360] : isSpeaking ? [0, 45, 0] : [0, 360],
            scale: isListening ? [1, 1.16, 0.96, 1.16, 1] : isSpeaking ? [1, 1.06, 1] : 1,
          }}
          transition={{
            rotate: {
              duration: isListening ? 8 : isSpeaking ? 4 : 20,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: isListening ? 1.2 : isSpeaking ? 1.6 : 0.3,
              repeat: isListening || isSpeaking ? Infinity : 0,
              ease: "easeInOut"
            }
          }}
          className={`relative rounded-full bg-slate-950 p-2 shadow-2xl flex items-center justify-center border-2 border-amber-400/80 shadow-[#0FA3B1]/40 ${currentSize.box}`}
        >
          {/* Wixárika Ojo de Dios SVG Geometry */}
          <svg
            width={currentSize.svg}
            height={currentSize.svg}
            viewBox="0 0 100 100"
            className="drop-shadow-[0_0_12px_rgba(15,163,177,0.8)]"
          >
            <defs>
              {/* Radial Glows */}
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FFD166" />
                <stop offset="100%" stopColor="#FF6B35" />
              </radialGradient>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0FA3B1" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
              <linearGradient id="magentaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D81E5B" />
                <stop offset="100%" stopColor="#FF4081" />
              </linearGradient>
            </defs>

            {/* Wooden Cross Axis (Ejes de Madera de Bambú/Sacro) */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="#8D5B4C" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#8D5B4C" strokeWidth="4" strokeLinecap="round" />

            {/* Diagonal Axis (Ejes Diagonales Wixárikas) */}
            <line x1="20" y1="20" x2="80" y2="80" stroke="#6F4336" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#6F4336" strokeWidth="2.5" strokeLinecap="round" />

            {/* Diamond Layer 1 (Outer - Cyan / Turquoise - Agua y Cielos) */}
            <polygon points="50,14 86,50 50,86 14,50" fill="none" stroke="url(#cyanGrad)" strokeWidth="5" />

            {/* Diamond Layer 2 (Orange / Fuego y Sol) */}
            <polygon points="50,22 78,50 50,78 22,50" fill="none" stroke="#FF6B35" strokeWidth="4.5" />

            {/* Diamond Layer 3 (Magenta / Vida y Protección) */}
            <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke="url(#magentaGrad)" strokeWidth="4" />

            {/* Diamond Layer 4 (Gold / Sabiduría Ancestral) */}
            <polygon points="50,37 63,50 50,63 37,50" fill="none" stroke="#FFD166" strokeWidth="3.5" />

            {/* Diamond Layer 5 (Deep Purple / Conciencia Agéntica) */}
            <polygon points="50,43 57,50 50,57 43,50" fill="#7209B7" stroke="#00E5FF" strokeWidth="2" />

            {/* Central Glowing Core (El Ojo Central) */}
            <circle cx="50" cy="50" r="5" fill="url(#centerGlow)" className="animate-pulse" />

            {/* Outer Corner Dots / Wixárika Beads */}
            <circle cx="50" cy="14" r="2.5" fill="#FFD166" />
            <circle cx="86" cy="50" r="2.5" fill="#FFD166" />
            <circle cx="50" cy="86" r="2.5" fill="#FFD166" />
            <circle cx="14" cy="50" r="2.5" fill="#FFD166" />
          </svg>

          {/* Center Mic / Status Overlay Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isListening ? (
              <div className="bg-red-500/90 text-white p-1.5 rounded-full animate-bounce shadow-md border border-white">
                <Mic className="w-4 h-4" />
              </div>
            ) : isSpeaking ? (
              <div className="bg-[#0FA3B1]/90 text-white p-1.5 rounded-full animate-pulse shadow-md border border-white">
                <Volume2 className="w-4 h-4" />
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>

      {/* Label for Senior Citizens & Digital Inclusion */}
      {showLabel && (
        <div className="mt-2 text-center pointer-events-none">
          <p className={`font-black uppercase tracking-wider ${currentSize.labelText} flex items-center justify-center gap-1.5 ${isListening ? 'text-red-500 animate-pulse' : 'text-[#0FA3B1]'}`}>
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            {label || (isListening ? 'Aura te escucha...' : 'Toca el Orbe para Hablar')}
          </p>
          <span className="text-[8px] text-slate-600 uppercase font-extrabold tracking-tight block">
            Ojo de Dios · Ventanilla Única
          </span>
        </div>
      )}
    </div>
  );
};
