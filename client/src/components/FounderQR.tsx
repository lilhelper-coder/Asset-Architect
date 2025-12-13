import QRCodeSVG from 'react-qr-code';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

export function FounderQR() {
  const [, setLocation] = useLocation();

  const handleInstantAccess = () => {
    setLocation('/connect');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="backdrop-blur-xl rounded-2xl p-6 inline-block shadow-2xl"
      style={{
        background: "rgba(0, 0, 0, 0.4)",
        border: "0.5px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* QR Code - Dark Mode */}
      <div 
        className="p-3 rounded-xl mx-auto w-fit mb-4"
        style={{
          background: "transparent",
        }}
      >
        <QRCodeSVG
          value={`${window.location.origin}/connect`}
          size={180}
          fgColor="#14b8a6"
          bgColor="transparent"
          level="H"
        />
      </div>

      {/* Label */}
      <p 
        className="text-center font-light text-xs mb-4"
        style={{
          color: "rgba(113, 113, 122, 0.8)", // zinc-500
          letterSpacing: "0.1em",
        }}
      >
        Scan to Connect
      </p>

      {/* Instant Click Button */}
      <button
        onClick={handleInstantAccess}
        className="w-full rounded-full px-6 py-3 text-sm font-light tracking-wide transition-all duration-300 text-cyan-400"
        style={{
          background: "rgba(34, 211, 238, 0.08)",
          border: "0.5px solid rgba(34, 211, 238, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(34, 211, 238, 0.15)";
          e.currentTarget.style.boxShadow = "0 0 15px rgba(34, 211, 238, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(34, 211, 238, 0.08)";
          e.currentTarget.style.boxShadow = "0 0 0 rgba(34, 211, 238, 0)";
        }}
      >
        Click to Experience Magic
      </button>
    </motion.div>
  );
}

