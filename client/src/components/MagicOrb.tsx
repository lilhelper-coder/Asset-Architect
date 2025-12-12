import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useState, useEffect } from "react";

export type OrbState = "idle" | "listening" | "speaking" | "error";

interface MagicOrbProps {
  state: OrbState;
  onTap: () => void;
  disabled?: boolean;
}

const glowColors = {
  idle: "rgba(13, 148, 136, 0.6)",
  listening: "rgba(13, 148, 136, 0.9)",
  speaking: "rgba(13, 148, 136, 0.75)",
  error: "rgba(245, 158, 11, 0.7)",
};

const orbColors = {
  idle: "#0d9488",
  listening: "#14b8a6",
  speaking: "#0d9488",
  error: "#F59E0B",
};

export function MagicOrb({ state, onTap, disabled = false }: MagicOrbProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hasOrbImage, setHasOrbImage] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasOrbImage(true);
    img.onerror = () => setHasOrbImage(false);
    img.src = "/assets/magic-orb.png";
  }, []);

  const handleTap = useCallback(() => {
    if (!disabled) {
      onTap();
    }
  }, [onTap, disabled]);

  const orbSize = "clamp(280px, 70vw, 400px)";
  
  const soulAnimation = shouldReduceMotion ? {} : {
    scale: [0.95, 1.05, 1.02, 1.1, 0.95],
    opacity: [0.3, 0.6, 0.5, 0.7, 0.3],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: [0.4, 0.0, 0.2, 1],
    },
  };
  
  const shellAnimation = shouldReduceMotion ? {} : {
    rotate: 360,
    transition: {
      duration: 60,
      repeat: Infinity,
      ease: "linear",
    },
  };
  
  const floatAnimation = shouldReduceMotion ? {} : {
    y: [0, -12, 0],
    transition: {
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const stateAnimations = {
    idle: shouldReduceMotion ? {} : {
      scale: [1, 1.03, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
    listening: shouldReduceMotion ? {} : {
      scale: [1, 1.08, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    },
    speaking: shouldReduceMotion ? {} : {
      scale: [1, 1.05, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
    error: shouldReduceMotion ? {} : {
      scale: [1, 1.02, 1],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      data-testid="magic-orb-container"
    >
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: `calc(${orbSize} * 1.2)`,
          height: `calc(${orbSize} * 1.2)`,
          background: `radial-gradient(circle, ${glowColors[state]} 0%, rgba(13, 148, 136, 0.2) 40%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={soulAnimation}
        data-testid="orb-soul"
      />

      <motion.div
        className="relative"
        animate={floatAnimation}
      >
        <motion.button
          data-testid="button-magic-orb"
          onClick={handleTap}
          disabled={disabled}
          className="relative z-10 rounded-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50"
          style={{
            width: orbSize,
            height: orbSize,
            minWidth: "280px",
            minHeight: "280px",
          }}
          animate={{
            ...shellAnimation,
            ...stateAnimations[state],
          }}
          whileTap={{ scale: 0.96 }}
          aria-label={getAriaLabel(state)}
        >
          {hasOrbImage ? (
            <motion.img
              src="/assets/magic-orb.png"
              alt="Scout Orb"
              className="w-full h-full object-contain"
              style={{
                filter: state === "error" 
                  ? `hue-rotate(35deg) saturate(1.5) drop-shadow(0 0 40px ${glowColors[state]})`
                  : `drop-shadow(0 0 40px ${glowColors[state]})`,
              }}
              draggable={false}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `
                  radial-gradient(circle at 30% 25%, rgba(255,255,255,0.4) 0%, transparent 30%),
                  radial-gradient(circle at 70% 75%, rgba(0,0,0,0.3) 0%, transparent 40%),
                  radial-gradient(circle at 50% 50%, ${orbColors[state]}ee 0%, ${orbColors[state]}99 40%, ${orbColors[state]}66 70%, ${orbColors[state]}33 100%)
                `,
                boxShadow: `
                  0 0 60px ${glowColors[state]},
                  0 0 120px ${glowColors[state]}66,
                  inset 0 0 80px rgba(255,255,255,0.15),
                  inset -20px -20px 60px rgba(0,0,0,0.3)
                `,
              }}
            >
              <div 
                className="absolute inset-4 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35) 0%, transparent 45%)",
                }}
              />
              <div 
                className="absolute rounded-full"
                style={{
                  top: "15%",
                  left: "20%",
                  width: "15%",
                  height: "10%",
                  background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)",
                  transform: "rotate(-20deg)",
                }}
              />
            </div>
          )}
          
          <AnimatePresence>
            {state === "error" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <div className="absolute" style={{ bottom: "-70px" }}>
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-medium"
          style={{ 
            color: state === "error" ? "#F59E0B" : "#5eead4",
            fontSize: "clamp(22px, 5vw, 28px)",
            minHeight: "40px",
            textShadow: `0 0 20px ${state === "error" ? "rgba(245, 158, 11, 0.5)" : "rgba(94, 234, 212, 0.3)"}`,
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
      return "";
    case "listening":
      return "Listening...";
    case "speaking":
      return "Speaking";
    case "error":
      return "One moment...";
    default:
      return "";
  }
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
