import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LivingOrb, type OrbState } from "./LivingOrb";
import { Sparkles } from "lucide-react";

interface ChristmasOrbProps {
  state: OrbState;
  onTap: () => void;
  disabled?: boolean;
  showHint?: boolean;
  scrollY: number;
}

export function ChristmasOrb({ 
  state, 
  onTap, 
  disabled = false, 
  showHint = false,
  scrollY 
}: ChristmasOrbProps) {
  const shouldReduceMotion = useReducedMotion();
  const [showChristmas, setShowChristmas] = useState(false);

  useEffect(() => {
    const shouldShow = scrollY > 100;
    if (shouldShow !== showChristmas) {
      setShowChristmas(shouldShow);
    }
  }, [scrollY, showChristmas]);

  return (
    <div className="relative" data-testid="christmas-orb-wrapper">
      <AnimatePresence>
        {showChristmas && (
          <motion.div
            className="absolute -top-20 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotate: shouldReduceMotion ? 0 : [-5, 5, -5],
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5,
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            data-testid="santa-hat"
          >
            <SantaHat />
          </motion.div>
        )}
      </AnimatePresence>

      <LivingOrb 
        state={state} 
        onTap={onTap}
        disabled={disabled}
        showHint={showHint && !showChristmas}
      />

      <AnimatePresence>
        {showChristmas && (
          <motion.div
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            data-testid="holiday-badge"
          >
            <HolidayBadge />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SantaHat() {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="72" rx="55" ry="10" fill="#fff" opacity="0.95" />
      <path
        d="M10 70 Q60 -10 110 70"
        fill="#c41e3a"
        stroke="#8b0000"
        strokeWidth="2"
      />
      <path
        d="M60 5 Q80 25 95 55 Q60 45 25 55 Q45 20 60 5"
        fill="#c41e3a"
      />
      <ellipse cx="60" cy="72" rx="50" ry="8" fill="#fff" />
      <circle cx="98" cy="12" r="10" fill="#fff" />
      <circle cx="98" cy="12" r="6" fill="#f8f8f8" />
    </svg>
  );
}

function HolidayBadge() {
  return (
    <motion.div
      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg border border-red-500/30"
      animate={{ 
        scale: [1, 1.03, 1],
        boxShadow: [
          "0 4px 20px rgba(220, 38, 38, 0.3)",
          "0 4px 30px rgba(220, 38, 38, 0.5)",
          "0 4px 20px rgba(220, 38, 38, 0.3)"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles className="w-5 h-5 text-yellow-300" aria-hidden="true" />
      <span className="text-lg tracking-wide">LIFETIME DEAL $99</span>
    </motion.div>
  );
}
