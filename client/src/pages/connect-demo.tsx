import { useState, useEffect } from "react";
import { GhostTouchCanvas } from "@/components/GhostTouchCanvas";
import { motion } from "framer-motion";

export default function ConnectDemo() {
  const [touches, setTouches] = useState<{ x: number; y: number; lastActive: number }[]>([]);

  useEffect(() => {
    const handleTouch = (e: TouchEvent | MouseEvent) => {
      const touch = 'touches' in e ? e.touches[0] : e;
      const x = touch.clientX / window.innerWidth;
      const y = touch.clientY / window.innerHeight;
      
      setTouches([{ x, y, lastActive: Date.now() }]);
    };

    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);
    window.addEventListener('mousemove', handleTouch);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('mousemove', handleTouch);
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Instruction Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <h1 
          className="text-5xl md:text-6xl font-thin tracking-tight mb-6"
          style={{
            background: "linear-gradient(to bottom, #99f6e4 0%, #22d3ee 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Touch Your Screen
        </h1>
        <p 
          className="text-xl font-light"
          style={{
            color: "rgba(153, 246, 228, 0.6)",
            letterSpacing: "0.1em",
          }}
        >
          See the magic connection
        </p>
      </motion.div>

      {/* Ghost Touch Canvas Overlay */}
      {touches.map((touch, index) => (
        <GhostTouchCanvas
          key={index}
          x={touch.x}
          y={touch.y}
          lastActive={touch.lastActive}
        />
      ))}
    </div>
  );
}

