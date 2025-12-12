import { motion, AnimatePresence } from "framer-motion";
import { useCallback } from "react";

export type OrbState = "idle" | "listening" | "speaking" | "error";

interface MagicOrbProps {
  state: OrbState;
  onTap: () => void;
  disabled?: boolean;
}

const orbAnimations = {
  idle: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  listening: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  speaking: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  error: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const glowColors = {
  idle: "rgba(13, 148, 136, 0.6)",
  listening: "rgba(13, 148, 136, 0.9)",
  speaking: "rgba(13, 148, 136, 0.75)",
  error: "rgba(245, 158, 11, 0.7)",
};

const orbColors = {
  idle: "#0d9488",
  listening: "#0d9488",
  speaking: "#0d9488",
  error: "#F59E0B",
};

export function MagicOrb({ state, onTap, disabled = false }: MagicOrbProps) {
  const handleTap = useCallback(() => {
    if (!disabled) {
      onTap();
    }
  }, [onTap, disabled]);

  return (
    <div 
      className="relative flex items-center justify-center"
      data-testid="magic-orb-container"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "clamp(300px, 80vw, 400px)",
            height: "clamp(300px, 80vw, 400px)",
            background: `radial-gradient(circle, ${glowColors[state]} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      <motion.button
        data-testid="magic-orb-button"
        onClick={handleTap}
        disabled={disabled}
        className="relative z-10 rounded-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50"
        style={{
          width: "clamp(300px, 80vw, 400px)",
          height: "clamp(300px, 80vw, 400px)",
          background: `radial-gradient(circle at 30% 30%, ${orbColors[state]}dd, ${orbColors[state]}88 50%, ${orbColors[state]}44 100%)`,
          boxShadow: `0 0 60px ${glowColors[state]}, inset 0 0 60px rgba(255,255,255,0.1)`,
          minWidth: "300px",
          minHeight: "300px",
        }}
        animate={orbAnimations[state]}
        whileTap={{ scale: 0.95 }}
        aria-label={getAriaLabel(state)}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)",
          }}
        />
        
        {state === "error" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span 
              className="text-white/90 text-center px-8 font-medium"
              style={{ fontSize: "clamp(20px, 5vw, 28px)" }}
            >
              Just resting...
            </span>
          </motion.div>
        )}
      </motion.button>

      <div className="absolute bottom-[-60px] text-center">
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-medium"
          style={{ 
            color: state === "error" ? "#F59E0B" : "#0d9488",
            minHeight: "40px",
          }}
          data-testid="orb-status-text"
        >
          {getStatusText(state)}
        </motion.p>
      </div>
    </div>
  );
}

function getStatusText(state: OrbState): string {
  switch (state) {
    case "idle":
      return "Tap to talk";
    case "listening":
      return "I'm listening...";
    case "speaking":
      return "Scout is speaking";
    case "error":
      return "Just a moment...";
    default:
      return "";
  }
}

function getAriaLabel(state: OrbState): string {
  switch (state) {
    case "idle":
      return "Tap to start talking with Scout";
    case "listening":
      return "Scout is listening. Tap to stop.";
    case "speaking":
      return "Scout is speaking. Tap to interrupt.";
    case "error":
      return "Connection paused. Scout is resting. Tap to try again.";
    default:
      return "Scout companion";
  }
}
