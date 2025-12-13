import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface GhostTouchCanvasProps {
  x: number; // 0-1 normalized coordinate
  y: number; // 0-1 normalized coordinate
  lastActive: number; // timestamp
}

export function GhostTouchCanvas({ x, y, lastActive }: GhostTouchCanvasProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const isActive = (now - lastActive) < 2000;
    setIsVisible(isActive);

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const stillActive = (currentTime - lastActive) < 2000;
      setIsVisible(stillActive);
    }, 100);

    return () => clearInterval(interval);
  }, [lastActive]);

  const left = `${x * 100}%`;
  const top = `${y * 100}%`;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ touchAction: 'none' }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute"
            style={{
              left,
              top,
              transform: 'translate(-50%, -50%)',
              mixBlendMode: 'screen',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Outer Plasma Aura */}
            <div 
              className="absolute"
              style={{
                width: '120px',
                height: '120px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)',
                filter: 'blur(20px)',
                animation: 'pulse-plasma 2s ease-in-out infinite',
              }}
            />

            {/* Middle Energy Ring */}
            <motion.div 
              className="absolute"
              style={{
                width: '60px',
                height: '60px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: '1px solid rgba(34, 211, 238, 0.4)',
                boxShadow: `
                  0 0 20px rgba(34, 211, 238, 0.4),
                  inset 0 0 20px rgba(34, 211, 238, 0.2)
                `,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Core Liquid Light */}
            <motion.div
              className="absolute bg-cyan-400"
              style={{
                width: '8px',
                height: '8px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                boxShadow: `
                  0 0 10px #22d3ee,
                  0 0 20px #22d3ee,
                  0 0 40px rgba(34, 211, 238, 0.4),
                  inset 0 0 8px rgba(255, 255, 255, 0.8)
                `,
                filter: 'blur(1px)',
              }}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Trail Rings (screen blend) */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: '40px',
                  height: '40px',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  border: '2px solid rgba(34, 211, 238, 0.6)',
                  mixBlendMode: 'screen',
                }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ 
                  scale: 2, 
                  opacity: 0,
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Animation for Plasma Pulse */}
      <style>{`
        @keyframes pulse-plasma {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
