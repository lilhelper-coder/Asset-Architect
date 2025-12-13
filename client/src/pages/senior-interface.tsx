import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import QRCode from 'react-qr-code'
import LivingOrb from '../components/LivingOrb'
import GhostTouchCanvas from '../components/GhostTouchCanvas'

export default function SeniorInterface() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  // FORCE PRODUCTION LINK: Ensures mobile phones always go to the live site
  const magicLink = user?.id 
    ? `https://www.lilhelper.ai/whisper/${user.id}`
    : `https://www.lilhelper.ai/connect`

  const handleCopy = () => {
    navigator.clipboard.writeText(magicLink)
    alert("Link copied!")
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 overflow-hidden relative selection:bg-cyan-500/30 font-light">
      
      {/* 1. Ghost Touch Layer (Invisible Background) */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
        <GhostTouchCanvas />
      </div>

      {/* 2. Main Content - Pure Void Layout */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pb-20">
        
        {/* HEADLINE: Razor Thin, Maximum Elegance */}
        <h1 className="text-4xl md:text-6xl font-thin tracking-tight text-center mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mt-12">
          Give the Gift of Connection
        </h1>

        {/* TAGLINE: Minimalist */}
        <p className="text-sm md:text-base tracking-[0.2em] text-zinc-600 uppercase text-center mb-16">
          Be there. Even when you're not.
        </p>

        {/* ORB: Floating in Void */}
        <div className="mb-16 scale-100 opacity-90 transition-all duration-1000 hover:scale-105 hover:opacity-100">
          <LivingOrb isListening={false} isSpeaking={false} />
        </div>

        {/* QR CODE: The Monolith (No Box, No Border, Just Data) */}
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          
          <div className="relative group cursor-pointer" onClick={handleCopy}>
            {/* Ambient Glow behind QR */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            
            {/* The Code itself - Cyan on Transparent */}
            <div className="relative z-10 p-2">
              <QRCode 
                value={magicLink}
                size={220} // Massive size for easy scanning
                bgColor="transparent"
                fgColor="#22d3ee" // Cyan-400
                level="M"
              />
            </div>
          </div>

          {/* Minimal Instruction */}
          <span className="text-[10px] tracking-[0.4em] text-cyan-500/40 uppercase mt-4">
            Scan to Pair
          </span>

        </div>
      </div>
    </div>
  )
}