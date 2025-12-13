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
    // Check if touch is recent (within 2 seconds)
    const now = Date.now();
    const isActive = (now - lastActive) < 2000;
    setIsVisible(isActive);

    // Set up interval to check expiry
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const stillActive = (currentTime - lastActive) < 2000;
      setIsVisible(stillActive);
    }, 100);

    return () => clearInterval(interval);
  }, [lastActive]);

  // Convert normalized coordinates to screen percentages
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
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.15,
              ease: "easeOut"
            }}
          >
            {/* Outer Cyber Glow Ring */}
            <div 
              className="absolute inset-0"
              style={{
                width: '80px',
                height: '80px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(45, 212, 191, 0.4) 0%, rgba(34, 211, 238, 0.2) 50%, transparent 70%)',
                boxShadow: `
                  0 0 40px rgba(45, 212, 191, 0.6),
                  0 0 60px rgba(34, 211, 238, 0.4),
                  0 0 80px rgba(20, 184, 166, 0.3)
                `,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />

            {/* Middle Glow */}
            <div 
              className="absolute"
              style={{
                width: '40px',
                height: '40px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(45, 212, 191, 0.8) 0%, rgba(34, 211, 238, 0.4) 70%, transparent 100%)',
                filter: 'blur(8px)',
              }}
            />

            {/* Main Dot - Glowing Teal Spark */}
            <motion.div
              className="absolute bg-teal-400"
              style={{
                width: '20px',
                height: '20px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                filter: 'blur(4px)',
                boxShadow: `
                  0 0 20px rgba(45, 212, 191, 1),
                  0 0 30px rgba(34, 211, 238, 0.8),
                  inset 0 0 10px rgba(255, 255, 255, 0.5)
                `,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Trail Effect - Expanding Ring */}
            <motion.div
              className="absolute border-2 border-teal-500/50"
              style={{
                width: '30px',
                height: '30px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'transparent',
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1.5, 
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Animation for Pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
