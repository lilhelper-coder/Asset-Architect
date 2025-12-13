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
      className="backdrop-blur-xl rounded-2xl p-8 inline-block"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "0.5px solid rgba(34, 211, 238, 0.2)",
      }}
    >
      {/* QR Code */}
      <div 
        className="p-4 rounded-xl mx-auto w-fit mb-6"
        style={{
          background: "#ffffff",
        }}
      >
        <QRCodeSVG
          value={`${window.location.origin}/connect`}
          size={200}
          fgColor="#22d3ee"
          bgColor="transparent"
          level="H"
        />
      </div>

      {/* Instant Click Button */}
      <button
        onClick={handleInstantAccess}
        className="w-full rounded-full px-8 py-4 text-lg font-light tracking-wide transition-all duration-300 text-cyan-400"
        style={{
          background: "rgba(34, 211, 238, 0.1)",
          border: "0.5px solid rgba(34, 211, 238, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(34, 211, 238, 0.2)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(34, 211, 238, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(34, 211, 238, 0.1)";
          e.currentTarget.style.boxShadow = "0 0 0 rgba(34, 211, 238, 0)";
        }}
      >
        Click to Experience Magic
      </button>

      {/* Label */}
      <p 
        className="text-center font-light text-sm mt-4"
        style={{
          color: "rgba(153, 246, 228, 0.6)", // teal-200/60
          letterSpacing: "0.2em",
        }}
      >
        SCAN OR CLICK FOR INSTANT ACCESS
      </p>
    </motion.div>
  );
}

