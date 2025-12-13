import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export type OrbState = "idle" | "listening" | "speaking" | "error";

interface LivingOrbProps {
  state: OrbState;
  onTap: () => void;
  disabled?: boolean;
  showHint?: boolean;
}

export function LivingOrb({ state, onTap, disabled = false, showHint = false }: LivingOrbProps) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  // Animation variants based on state
  const getAnimationDuration = () => {
    switch (state) {
      case "speaking":
        return 1; // Fast breathing when speaking
      case "listening":
        return 2; // Medium breathing when listening
      case "idle":
      default:
        return 3; // Slow breathing when idle
    }
  };

  const breatheAnimation = shouldReduceMotion ? {} : {
    scale: [1, 1.05, 1],
    transition: {
      duration: getAnimationDuration(),
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const floatAnimation = shouldReduceMotion ? {} : {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Opacity pulse for thinking/processing
  const thinkingAnimation = state === "error" ? {
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  } : {};

  // Glow effect for listening state
  const getGlowStyle = () => {
    switch (state) {
      case "listening":
        return {
          filter: "drop-shadow(0 0 30px rgba(94, 234, 212, 0.8)) drop-shadow(0 0 60px rgba(94, 234, 212, 0.5))",
          transform: "scale(1.08)",
        };
      case "speaking":
        return {
          filter: "drop-shadow(0 0 20px rgba(94, 234, 212, 0.6))",
        };
      default:
        return {
          filter: "drop-shadow(0 0 15px rgba(94, 234, 212, 0.3))",
        };
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center"
      data-testid="magic-orb-container"
    >
      <motion.button
        onClick={onTap}
        disabled={disabled}
        className="relative focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50 rounded-full"
        animate={floatAnimation}
        whileTap={{ scale: 0.96 }}
        aria-label={getAriaLabel(state)}
        data-testid="button-magic-orb"
      >
        {/* Glassmorphism container */}
        <div 
          className="relative p-8 rounded-full"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          {/* Christmas Orb Image */}
          <motion.img
            src="/christmas-orb.png"
            alt="Crystal"
            className="w-64 h-64 rounded-full object-cover"
            animate={{
              ...breatheAnimation,
              ...thinkingAnimation,
            }}
            style={getGlowStyle()}
          />

          {/* Error overlay */}
          {state === "error" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white text-lg font-medium">
                Just a moment...
              </span>
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Hint text for idle state */}
      {showHint && state === "idle" && (
        <motion.p
          className="mt-6 text-teal-300 text-lg text-center font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          data-testid="orb-hint-text"
        >
          {t.touchToSpeak}
        </motion.p>
      )}

      {/* Status text */}
      {state !== "idle" && (
        <div className="mt-6">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-teal-300 text-xl text-center font-semibold"
            data-testid="orb-status-text"
          >
            {state === "listening" ? t.listening : state === "speaking" ? t.speaking : t.oneSecond}
          </motion.p>
        </div>
      )}
    </div>
  );
}

function getAriaLabel(state: OrbState): string {
  switch (state) {
    case "idle":
      return "Touch to speak with Crystal";
    case "listening":
      return "Crystal is listening. Touch to stop.";
    case "speaking":
      return "Crystal is speaking. Touch to interrupt.";
    case "error":
      return "Connection paused. Crystal is resting. Touch to try again.";
    default:
      return "Crystal companion";
  }
}
