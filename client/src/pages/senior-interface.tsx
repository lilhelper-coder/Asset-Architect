import { useState, useEffect, useRef } from "react";
import { ChristmasOrb } from "@/components/ChristmasOrb";
import { useVoiceConnection } from "@/hooks/useVoiceConnection";
import { motion } from "framer-motion";
import { SignInModal } from "@/components/SignInModal";
import { Button } from "@/components/ui/button";
import { Smartphone, QrCode } from "lucide-react";

export default function SeniorInterface() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollY(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
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

  const handleFounderCTA = () => {
    const stripeUrl = "https://buy.stripe.com/6oUfZgDU5L9ixa3izgA801";
    window.open(stripeUrl, '_blank');
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-y-auto"
      style={{ 
        background: "linear-gradient(180deg, #0a0e0f 0%, #0d1613 100%)",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
      data-testid="senior-interface"
    >
      <h1 className="sr-only">LilHelper: The Gift of Connection</h1>

      {/* Hero Section - 40% height */}
      <section 
        className="flex flex-col items-center px-6 relative"
        style={{ minHeight: "40vh", paddingTop: "12vh" }}
        aria-label="LilHelper Voice Assistant"
      >
        {/* Top Right Sign In */}
        <motion.button
          className="absolute top-6 right-6 z-20 transition-colors font-light tracking-breathe"
          style={{
            fontSize: "14px",
            color: "rgba(250, 173, 20, 0.7)",
          }}
          onClick={() => setIsSignInOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(250, 173, 20, 1)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(250, 173, 20, 0.7)"}
          aria-label="Sign in"
        >
          Sign In
        </motion.button>

        {/* Hero Headline */}
        <motion.div
          className="text-center max-w-4xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <h2 
            className="text-5xl md:text-7xl font-whisper tracking-luxury mb-6"
            style={{
              background: "linear-gradient(135deg, #faad14 0%, #d4380d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Give the Gift of Connection
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-light tracking-breathe mb-10">
            No apps. No setup. Just presence.
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleFounderCTA}
              className="text-base px-12 py-7 font-soft tracking-breathe relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #faad14 0%, #d4380d 100%)",
                border: "1px solid rgba(212, 56, 13, 0.4)",
              }}
            >
              <span className="relative z-10">Gift Founder's Access - $49</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                }}
              />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* The Orb Demo - Center Stage */}
      <section className="flex flex-col items-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
        >
          <ChristmasOrb 
            state={orbState} 
            onTap={handleOrbTap}
            disabled={false}
            showHint={!hasInteracted && orbState === "idle"}
            scrollY={scrollY}
          />
        </motion.div>
      </section>

      {/* Whisper Teaser */}
      <section className="py-32 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-2xl md:text-3xl font-whisper tracking-luxury text-white mb-8">
            Whisper in her ear from 3,000 miles away.
          </p>

          {/* Visual: Phone scanning QR code (CSS mockup) */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Smartphone className="w-16 h-16 text-gold" />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              <QrCode className="w-20 h-20 text-ember" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-xs font-light tracking-breathe text-gray-600">
          Made with love for families.
        </p>
      </footer>

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />
    </div>
  );
}
