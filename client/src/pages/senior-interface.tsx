import { useState, useEffect } from "react";
import { MagicOrb } from "@/components/MagicOrb";
import { useVoiceConnection } from "@/hooks/useVoiceConnection";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Settings } from "lucide-react";

export default function SeniorInterface() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [seniorConfig, setSeniorConfig] = useState<{
    seniorName: string;
    gifterName: string;
    bioContext: string;
  } | null>(null);

  useEffect(() => {
    const storedConfig = localStorage.getItem("lilhelper_senior_config");
    if (storedConfig) {
      try {
        setSeniorConfig(JSON.parse(storedConfig));
      } catch {
        setSeniorConfig({
          seniorName: "Friend",
          gifterName: "Someone who loves you",
          bioContext: "",
        });
      }
    } else {
      setSeniorConfig({
        seniorName: "Friend",
        gifterName: "Someone who loves you",
        bioContext: "",
      });
    }
  }, []);

  const { orbState, toggleConnection } = useVoiceConnection({
    seniorName: seniorConfig?.seniorName,
    gifterName: seniorConfig?.gifterName,
    bioContext: seniorConfig?.bioContext,
  });

  const handleWakeUp = () => {
    setHasInteracted(true);
  };

  const handleOrbTap = () => {
    if (!hasInteracted) {
      handleWakeUp();
    }
    toggleConnection();
  };

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col overflow-hidden"
      style={{ 
        paddingTop: "env(safe-area-inset-top, 16px)",
        paddingBottom: "env(safe-area-inset-bottom, 16px)",
        paddingLeft: "env(safe-area-inset-left, 16px)",
        paddingRight: "env(safe-area-inset-right, 16px)",
      }}
      data-testid="senior-interface"
    >
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
            style={{ 
              padding: "24px",
              paddingTop: "env(safe-area-inset-top, 24px)",
              paddingBottom: "env(safe-area-inset-bottom, 24px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="wake-overlay"
          >
            <motion.button
              onClick={handleWakeUp}
              className="w-full max-w-md rounded-md font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/50"
              style={{ 
                fontSize: "32px",
                minHeight: "80px",
                height: "80px",
                backgroundColor: "#0d9488",
              }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-wake"
              aria-label="Tap to start talking with Scout"
            >
              TAP TO START
            </motion.button>
            <p 
              className="mt-8 text-center"
              style={{ 
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              This allows Scout to hear you
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="flex justify-between items-center z-40"
        style={{ 
          minHeight: "64px",
          padding: "8px",
        }}
      >
        <button
          className="flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/50"
          style={{ 
            minWidth: "64px", 
            minHeight: "64px",
            width: "64px",
            height: "64px",
            color: "#0d9488",
            backgroundColor: "transparent",
          }}
          data-testid="button-help-mirror"
          aria-label="Get help from family"
        >
          <QrCode className="w-8 h-8" />
        </button>
        
        <button
          className="flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/50"
          style={{ 
            minWidth: "64px", 
            minHeight: "64px",
            width: "64px",
            height: "64px",
            color: "#0d9488",
            backgroundColor: "transparent",
          }}
          data-testid="button-settings"
          aria-label="Settings"
        >
          <Settings className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <MagicOrb 
          state={orbState} 
          onTap={handleOrbTap}
          disabled={!hasInteracted}
        />
      </div>

      <div 
        className="flex justify-center items-center"
        style={{ minHeight: "80px" }}
      >
        {seniorConfig?.seniorName && seniorConfig.seniorName !== "Friend" && (
          <motion.p
            className="text-center px-4"
            style={{ 
              fontSize: "20px",
              color: "rgba(255, 255, 255, 0.5)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-testid="text-welcome"
          >
            Hi {seniorConfig.seniorName}, Scout is here for you
          </motion.p>
        )}
      </div>
    </div>
  );
}
