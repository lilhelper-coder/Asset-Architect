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
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)",
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
          className="text-center mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <h1 
            className="text-5xl md:text-7xl font-thin tracking-wide mb-8"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #eab308 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Give the Gift of Connection
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide mb-12 px-4 leading-relaxed">
            Don't give another gadget. Give a companion.
          </p>

          {/* Primary CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleFounderCTA}
              className="text-base px-10 py-7 font-light tracking-wide relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #eab308 100%)",
                border: "1px solid rgba(234, 179, 8, 0.4)",
              }}
            >
              <span className="relative z-10">Get Founder's Access - $49</span>
              {/* Subtle shine effect on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                }}
              />
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
        className="py-32"
        style={{ 
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))" 
        }}
      >
        {/* Ghost Mode Teaser Section */}
        <motion.div
          className="max-w-4xl mx-auto px-6 mb-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div 
            className="relative rounded-3xl p-12 md:p-16 overflow-hidden"
            style={{
              background: "rgba(220, 38, 38, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(220, 38, 38, 0.1)",
              boxShadow: "0 8px 32px 0 rgba(220, 38, 38, 0.2)",
            }}
          >
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <QrCode className="w-10 h-10 text-red-400" />
                <h2 className="text-4xl md:text-5xl font-thin tracking-wider text-white">
                  Ghost Mode
                </h2>
              </div>
              
              {/* Ultra-short bullet points */}
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-12">
                <div className="flex flex-col items-center gap-2">
                  <QrCode className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-light tracking-wide text-gray-400">Scan to join</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-light tracking-wide text-gray-400">Type to speak</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Sparkles className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-light tracking-wide text-gray-400">Be there instantly</span>
                </div>
              </div>
            </div>

            {/* Decorative gradient overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: "radial-gradient(circle at top right, #dc2626 0%, transparent 50%)",
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
