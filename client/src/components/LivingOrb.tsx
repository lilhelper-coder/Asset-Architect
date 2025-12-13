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

  // Glow effect - Pure Cyan/Teal Oceanic Depth
  const getGlowStyle = () => {
    switch (state) {
      case "listening":
        return {
          filter: "drop-shadow(0 0 30px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 60px rgba(20, 184, 166, 0.5))",
          transform: "scale(1.08)",
        };
      case "speaking":
        return {
          filter: "drop-shadow(0 0 25px rgba(34, 211, 238, 0.6)) drop-shadow(0 0 50px rgba(20, 184, 166, 0.4))",
        };
      default:
        return {
          filter: "drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 40px rgba(20, 184, 166, 0.3))",
        };
    }
  };

  // Breathing glow animation
  const glowBreatheAnimation = shouldReduceMotion ? {} : {
    filter: state === "idle" 
      ? [
          "drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 40px rgba(20, 184, 166, 0.3))",
          "drop-shadow(0 0 30px rgba(34, 211, 238, 0.6)) drop-shadow(0 0 60px rgba(20, 184, 166, 0.4))",
          "drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 40px rgba(20, 184, 166, 0.3))",
        ]
      : undefined,
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div 
      className="flex flex-col items-center justify-center"
      data-testid="magic-orb-container"
    >
      <motion.button
        onClick={onTap}
        disabled={disabled}
        className="relative focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/50 rounded-full"
        animate={floatAnimation}
        whileTap={{ scale: 0.96 }}
        aria-label={getAriaLabel(state)}
        data-testid="button-magic-orb"
      >
        {/* Breathing Data Ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '340px',
            height: '340px',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
          }}
          animate={{
            rotate: 360,
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            rotate: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* Glassmorphism container */}
        <div 
          className="relative p-8 rounded-full backdrop-blur-xl"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(34, 211, 238, 0.15)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.36), 0 0 20px rgba(34, 211, 238, 0.1)",
          }}
        >
          {/* Pure CSS Glass Sphere - High-End ChatGPT Style */}
          <motion.div
            className="w-[300px] h-[300px] rounded-full relative overflow-hidden"
            animate={{
              ...breatheAnimation,
              ...thinkingAnimation,
              ...(state === "idle" ? glowBreatheAnimation : {}),
            }}
            style={{
              background: "#000000",
              ...(state !== "idle" ? getGlowStyle() : {}),
            }}
          >
            {/* Layer 1: Deep Ocean Gradient */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.2) 0%, transparent 60%)",
              }}
            />

            {/* Layer 2: Secondary Depth Gradient */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle at 70% 70%, rgba(20,184,166,0.15) 0%, transparent 50%)",
              }}
            />

            {/* Layer 3: Glass Surface (Inner Glow) */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "inset 0 0 20px rgba(255,255,255,0.1), inset 10px 10px 20px rgba(255,255,255,0.05)",
              }}
            />

            {/* Layer 4: Edge Glow */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "0 0 50px rgba(34,211,238,0.3), 0 0 100px rgba(20,184,166,0.2)",
              }}
            />

            {/* Highlight Reflection (Top Left) */}
            <div 
              className="absolute rounded-full"
              style={{
                top: "15%",
                left: "20%",
                width: "80px",
                height: "80px",
                background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                filter: "blur(10px)",
              }}
            />
          </motion.div>

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
          className="mt-8 text-slate-400 text-base font-light tracking-wide text-center"
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
        <div className="mt-8">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-300 text-lg font-light tracking-wide text-center"
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
