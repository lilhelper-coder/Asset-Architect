import { useState, useEffect } from "react";
import { LivingOrb } from "@/components/LivingOrb";
import { useVoiceConnection } from "@/hooks/useVoiceConnection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/SignInModal";
import { InteractiveFAQ } from "@/components/InteractiveFAQ";
import { ChristmasPricing } from "@/components/ChristmasPricing";
import { ChevronDown } from "lucide-react";

export default function SeniorInterface() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
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

  const handleOrbTap = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    toggleConnection();
  };

  const scrollToContent = () => {
    const element = document.getElementById("content-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div 
      className="min-h-screen overflow-y-auto"
      style={{ 
        background: "radial-gradient(ellipse at 50% 30%, #0a1f24 0%, #050a0c 50%, #000000 100%)",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
      data-testid="senior-interface"
    >
      <h1 className="sr-only">Crystal: The AI Companion for Seniors</h1>

      <section 
        className="min-h-screen flex flex-col items-center px-6 relative"
        style={{ paddingTop: "15vh" }}
        aria-label="Crystal Voice Assistant"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <LivingOrb 
            state={orbState} 
            onTap={handleOrbTap}
            disabled={false}
            showHint={!hasInteracted && orbState === "idle"}
          />
        </motion.div>

        <motion.p
          className="text-center max-w-sm"
          style={{ 
            marginTop: "48px",
            fontSize: "20px",
            color: "rgba(13, 148, 136, 0.7)",
            letterSpacing: "0.02em",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 300,
            lineHeight: 1.4,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          data-testid="tagline"
        >
          Your Lil' Helper for Tech & Life
        </motion.p>

        <motion.div 
          className="flex justify-center"
          style={{ marginTop: "36px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Button
            variant="outline"
            className="px-10 rounded-full border-teal-600/40 text-teal-500 hover:border-teal-500 hover:text-teal-400 bg-transparent"
            style={{
              fontSize: "17px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.04em",
              minHeight: "48px",
            }}
            onClick={() => setIsSignInOpen(true)}
            data-testid="button-enter"
          >
            Begin
          </Button>
        </motion.div>

        <motion.button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-teal-500 transition-colors p-4"
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          aria-label="Scroll to learn more"
          data-testid="button-scroll-down"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </section>

      <section 
        id="content-section"
        className="py-16"
        style={{ 
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))" 
        }}
      >
        <InteractiveFAQ />
        
        <div className="border-t border-zinc-800/50 my-8" />
        
        <ChristmasPricing />
      </section>

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />
    </div>
  );
}
