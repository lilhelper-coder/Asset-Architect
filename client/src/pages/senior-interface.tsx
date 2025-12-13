import { useState, useEffect, useRef } from "react";
import { ChristmasOrb } from "@/components/ChristmasOrb";
import { useVoiceConnection } from "@/hooks/useVoiceConnection";
import { useGhostSession } from "@/hooks/useGhostSession";
import { motion } from "framer-motion";
import { GhostTouchCanvas } from "@/components/GhostTouchCanvas";
import { FounderQR } from "@/components/FounderQR";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";

export default function SeniorInterface() {
  const [hasInteracted, setHasInteracted] = useState(false);
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

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-y-auto"
      style={{ 
        background: "#050505",
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
        style={{ minHeight: "100vh", paddingTop: "20vh" }}
        aria-label="LilHelper Voice Assistant"
      >
        {/* The Orb - Hero Position */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-16"
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
          className="text-center max-w-3xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <h2 
            className="text-6xl md:text-7xl font-thin tracking-tight mb-8"
            style={{
              background: "linear-gradient(to bottom, #99f6e4 0%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Give the Gift of Connection
          </h2>
          <p 
            className="text-xl font-light tracking-wide mb-12"
            style={{ color: "rgba(153, 246, 228, 0.6)" }}
          >
            No apps. No setup. Just presence.
          </p>

          {/* Instant Access QR + Link */}
          <FounderQR />
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
          <p 
            className="text-2xl md:text-3xl font-light tracking-tight mb-4"
            style={{ color: "rgba(153, 246, 228, 1)" }}
          >
            Whisper in her ear from 3,000 miles away.
          </p>
          <p 
            className="text-sm font-light uppercase"
            style={{
              color: "rgba(153, 246, 228, 0.4)",
              letterSpacing: "0.2em",
            }}
          >
            Real-time touch • Voice connection • No apps
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <p 
          className="text-xs font-light uppercase"
          style={{
            color: "rgba(153, 246, 228, 0.3)",
            letterSpacing: "0.2em",
          }}
        >
          Made with love for families
        </p>
      </footer>

      {/* Ghost Touch Canvas Overlay */}
      <GhostTouchCanvas 
        x={ghostTouch.x}
        y={ghostTouch.y}
        lastActive={ghostTouch.lastActive}
      />
    </div>
  );
}
