import { useState, useEffect, useRef } from "react";
import { ChristmasOrb } from "@/components/ChristmasOrb";
import { useVoiceConnection } from "@/hooks/useVoiceConnection";
import { motion } from "framer-motion";
import { SignInModal } from "@/components/SignInModal";
import { InteractiveFAQ } from "@/components/InteractiveFAQ";
import { ChristmasPricing } from "@/components/ChristmasPricing";
import { LanguagePicker } from "@/components/LanguagePicker";
import { ChevronDown, QrCode, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export default function SeniorInterface() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
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

  const scrollToContent = () => {
    const element = document.getElementById("content-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFounderCTA = () => {
    // Direct to Stripe Payment Link
    const stripeUrl = "https://buy.stripe.com/6oUfZgDU5L9ixa3izgA801";
    window.open(stripeUrl, '_blank');
  };

  return (
    <div 
      ref={containerRef}
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
        style={{ paddingTop: "18vh" }}
        aria-label="Crystal Voice Assistant"
      >
        {/* Scarcity Badge */}
        <motion.div
          className="absolute top-6 left-6 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Founder's Club Closing: Dec 25th
          </div>
        </motion.div>

        <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <LanguagePicker />
          </motion.div>
          <motion.button
            className="transition-colors"
            style={{
              fontSize: "15px",
              fontFamily: "'Poppins', system-ui, sans-serif",
              fontWeight: 400,
              color: "rgba(94, 234, 212, 0.6)",
            }}
            onClick={() => setIsSignInOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            onMouseEnter={(e) => e.currentTarget.style.color = "rgba(94, 234, 212, 0.9)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(94, 234, 212, 0.6)"}
            aria-label="Sign in or sign up"
            data-testid="button-enter"
          >
            {t.loginSignup}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <ChristmasOrb 
            state={orbState} 
            onTap={handleOrbTap}
            disabled={false}
            showHint={!hasInteracted && orbState === "idle"}
            scrollY={scrollY}
          />
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          className="text-center mt-8 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #5eead4 0%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Give the Gift of Connection
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 px-4">
            Don't give another gadget. Give a companion. Join the Founder's Club for exclusive early access to the first AI designed for family.
          </p>

          {/* Primary CTA Button */}
          <motion.div
            animate={{ 
              scale: [1, 1.03, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={handleFounderCTA}
              className="text-lg px-8 py-6 font-semibold shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #fbbf24 100%)",
                border: "2px solid rgba(251, 191, 36, 0.3)",
              }}
            >
              Get Founder's Access - $49 (Holiday Special)
            </Button>
          </motion.div>
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
        {/* Ghost Mode Teaser Section */}
        <motion.div
          className="max-w-4xl mx-auto px-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div 
            className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
            style={{
              background: "rgba(13, 148, 136, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(94, 234, 212, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(13, 148, 136, 0.3)",
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <QrCode className="w-8 h-8 text-teal-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Introducing Ghost Mode
                </h2>
              </div>
              
              <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                Pop in from anywhere. Scan a QR code and type to speak through Crystal. Be there, even when you can't.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-teal-300">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Real-time family connection</span>
                </div>
                <div className="flex items-center gap-2 text-teal-300">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">No app install required</span>
                </div>
              </div>
            </div>

            {/* Decorative gradient overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: "radial-gradient(circle at top right, #5eead4 0%, transparent 50%)",
              }}
            />
          </div>
        </motion.div>

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
