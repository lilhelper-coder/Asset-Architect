import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

export type OrbState = "idle" | "listening" | "speaking" | "error";

interface LivingOrbProps {
  state: OrbState;
  onTap: () => void;
  disabled?: boolean;
  showHint?: boolean;
}

const stateToClass: Record<OrbState, string> = {
  idle: "state-idle",
  listening: "state-listening",
  speaking: "state-speaking",
  error: "state-error",
};

export function LivingOrb({ state, onTap, disabled = false, showHint = false }: LivingOrbProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.className = `living-orb-container ${stateToClass[state]}`;
    }
  }, [state]);

  const coreAnimation = shouldReduceMotion ? {} : {
    scale: [1, 1.05, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: [0.4, 0.0, 0.2, 1],
    },
  };

  const floatAnimation = shouldReduceMotion ? {} : {
    y: [-8, 8, -8],
    transition: {
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const ringDurations = [20, 35, 50];
  const ringDirections = [1, -1, 1];

  return (
    <div 
      ref={containerRef}
      className={`living-orb-container ${stateToClass[state]}`}
      data-testid="magic-orb-container"
    >
      <motion.button
        onClick={onTap}
        disabled={disabled}
        className="living-orb-wrapper focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50"
        animate={floatAnimation}
        whileTap={{ scale: 0.96 }}
        aria-label={getAriaLabel(state)}
        data-testid="button-magic-orb"
      >
        <div className="living-orb-stage">
          <div className="orb-ambient-glow" />

          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="orb-ring-layer"
              animate={shouldReduceMotion ? {} : {
                rotate: 360 * ringDirections[index],
              }}
              transition={{
                duration: ringDurations[index],
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                opacity: 0.6 - index * 0.1,
              }}
            >
              <svg
                viewBox="0 0 200 200"
                className="orb-ring-svg"
                style={{
                  transform: `skewX(${index * 5}deg) skewY(${index * 3}deg)`,
                }}
              >
                <defs>
                  <filter id={`blur-ring-${index}`}>
                    <feGaussianBlur in="SourceGraphic" stdDeviation={4 + index * 2} />
                  </filter>
                </defs>
                <ellipse
                  cx="100"
                  cy="100"
                  rx={85 - index * 8}
                  ry={75 - index * 5}
                  fill="none"
                  stroke="var(--orb-ring-color)"
                  strokeWidth={3 - index * 0.5}
                  filter={`url(#blur-ring-${index})`}
                  style={{
                    mixBlendMode: "screen",
                  }}
                />
              </svg>
            </motion.div>
          ))}

          <motion.div 
            className="orb-core"
            animate={coreAnimation}
          >
            <div className="orb-core-inner">
              <div className="orb-highlight" />
            </div>
          </motion.div>

          {state === "error" && (
            <motion.div
              className="orb-error-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="orb-error-text">
                Just a moment...
              </span>
            </motion.div>
          )}
        </div>
      </motion.button>

      {showHint && state === "idle" && (
        <motion.p
          className="orb-hint-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          data-testid="orb-hint-text"
        >
          touch to speak
        </motion.p>
      )}

      {state !== "idle" && (
        <div className="orb-status-container">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="orb-status-text"
            data-testid="orb-status-text"
          >
            {getStatusText(state)}
          </motion.p>
        </div>
      )}
    </div>
  );
}

function getStatusText(state: OrbState): string {
  switch (state) {
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
