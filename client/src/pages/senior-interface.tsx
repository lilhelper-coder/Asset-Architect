import { useState, useEffect, useRef } from "react";
import { ChristmasOrb } from "@/components/ChristmasOrb";
import { useVoiceConnection } from "@/hooks/useVoiceConnection";
import { useGhostSession } from "@/hooks/useGhostSession";
import { motion } from "framer-motion";
import { SignInModal } from "@/components/SignInModal";
import { GhostTouchCanvas } from "@/components/GhostTouchCanvas";
import { Button } from "@/components/ui/button";
import { Smartphone, QrCode } from "lucide-react";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";

export default function SeniorInterface() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [seniorConfig, setSeniorConfig] = useState<{
    seniorName: string;
    gifterName: string;
    bioContext: string;
  } | null>(null);

  // Get user ID for Ghost Session
  useEffect(() => {
    if (isSupabaseAvailable() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserId(session?.user?.id || null);
      });
    }
  }, []);

  // Initialize Ghost Session for touch receiving
  const { ghostTouch } = useGhostSession({
    roomId: userId || 'guest',
    role: 'senior',
  });

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
    // Scroll to demo section instead of Stripe
    const demoSection = document.getElementById("demo-section");
    demoSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-y-auto"
      style={{ 
        background: "#000000",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
      data-testid="senior-interface"
    >
      <h1 className="sr-only">LilHelper: The Gift of Connection</h1>

      {/* Hero Section */}
      <section 
        className="flex flex-col items-center px-6 relative"
        style={{ minHeight: "100vh", paddingTop: "12vh" }}
        aria-label="LilHelper Voice Assistant"
      >
        {/* Top Right Sign In */}
        <motion.button
          className="absolute top-6 right-6 z-20 transition-colors font-light tracking-luxury"
          style={{
            fontSize: "14px",
            fontWeight: "300",
            color: "rgba(34, 211, 238, 0.7)",
            letterSpacing: "0.02em",
          }}
          onClick={() => setIsSignInOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(34, 211, 238, 1)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(34, 211, 238, 0.7)"}
          aria-label="Sign in"
        >
          Sign In
        </motion.button>

        {/* The Orb - Hero Position */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12"
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
          className="text-center max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <h2 
            className="text-5xl md:text-7xl font-light tracking-luxury mb-6 text-white"
            style={{
              textShadow: "0 0 40px rgba(34, 211, 238, 0.3)",
            }}
          >
            Give the Gift of Connection
          </h2>
          <p className="text-lg md:text-xl text-slate-400 font-light tracking-luxury mb-10">
            No apps. No setup. Just presence.
          </p>

          {/* Glass Pill CTA */}
          <Button
            onClick={handleFounderCTA}
            className="backdrop-blur-xl bg-white/5 border border-white/20 hover:bg-white/10 text-white rounded-full px-10 py-4 font-light tracking-luxury transition-all duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(34, 211, 238, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 rgba(34, 211, 238, 0)";
            }}
          >
            Try the Magic Connection
          </Button>
        </motion.div>
      </section>

      {/* Live Demo Section */}
      <section 
        id="demo-section"
        className="py-32 px-6"
      >
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div 
            className="backdrop-blur-xl border border-white/10 rounded-3xl p-12"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <h3 className="text-3xl font-light tracking-luxury text-white text-center mb-8">
              Pair Your Phone
            </h3>

            {userId ? (
              <>
                <div 
                  className="p-6 rounded-2xl mx-auto w-fit border"
                  style={{
                    background: "#000000",
                    borderColor: "rgba(34, 211, 238, 0.3)",
                    boxShadow: "0 0 30px rgba(34, 211, 238, 0.15)",
                  }}
                >
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=svg&color=22d3ee&bgcolor=000000&data=${encodeURIComponent(`${window.location.origin}/whisper/${userId}`)}`}
                    alt="Scan to Pair"
                    className="rounded-xl"
                    width="240"
                    height="240"
                  />
                </div>

                <button
                  onClick={async () => {
                    const url = `${window.location.origin}/whisper/${userId}`;
                    await navigator.clipboard.writeText(url);
                    alert('Link copied! Send it to your family.');
                  }}
                  className="mt-8 w-full backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full px-6 py-3 font-light tracking-luxury transition-all duration-300"
                >
                  Copy Link 🔗
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-slate-400 font-light mb-6">
                  Sign in to get your personal pairing link
                </p>
                <Button
                  onClick={() => setIsSignInOpen(true)}
                  className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full px-8 py-3 font-light tracking-luxury transition-all duration-300"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Whisper Teaser - Minimal */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-2xl md:text-3xl font-light tracking-luxury text-white mb-4">
            Whisper in her ear from 3,000 miles away.
          </p>
          <p className="text-sm text-slate-500 font-light tracking-luxury">
            Real-time touch. Voice connection. No apps required.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-xs font-light tracking-luxury text-slate-600">
          Made with love for families.
        </p>
      </footer>

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />

      {/* Ghost Touch Canvas Overlay */}
      <GhostTouchCanvas 
        x={ghostTouch.x}
        y={ghostTouch.y}
        lastActive={ghostTouch.lastActive}
      />
    </div>
  );
}
