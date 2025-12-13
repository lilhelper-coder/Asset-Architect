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
          className="text-center max-w-3xl mb-12 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <h2 
            className="text-4xl md:text-5xl font-light tracking-tight mb-6 text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Give the Gift of Connection
          </h2>
          <p 
            className="text-lg font-light tracking-wide mb-3"
            style={{ color: "rgba(153, 246, 228, 0.8)" }}
          >
            Be there. Even when you're not.
          </p>
          <p 
            className="text-xs font-light uppercase mb-12"
            style={{
              color: "rgba(34, 211, 238, 0.6)",
              letterSpacing: "0.3em",
            }}
          >
            AI Companion • Family Connected • Zero Setup
          </p>

          {/* Instant Access QR + Link */}
          <FounderQR />
        </motion.div>
      </section>

      {/* Dual Core Features - Floating Icons */}
      <section className="py-32 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* AI Listening */}
            <div className="text-center">
              <div 
                className="inline-block mb-4"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-cyan-400"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" x2="12" y1="19" y2="22"/>
                </svg>
              </div>
              <p 
                className="text-lg font-light"
                style={{ color: "rgba(153, 246, 228, 0.6)" }}
              >
                Always Listening
              </p>
            </div>

            {/* Human Touch */}
            <div className="text-center">
              <div 
                className="inline-block mb-4"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-cyan-400"
                >
                  <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/>
                  <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"/>
                  <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
                  <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
                  <path d="M8.65 22c.21-.66.45-1.32.57-2"/>
                  <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
                  <path d="M2 16h.01"/>
                  <path d="M21.8 16c.2-2 .131-5.354 0-6"/>
                  <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2"/>
                </svg>
              </div>
              <p 
                className="text-lg font-light"
                style={{ color: "rgba(153, 246, 228, 0.6)" }}
              >
                Human Touch
              </p>
            </div>
          </div>
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
