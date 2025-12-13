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

  // 1. FORCE PRODUCTION LINK (Safety for Mobile)
  const magicLink = user?.id 
    ? `https://www.lilhelper.ai/whisper/${user.id}`
    : `https://www.lilhelper.ai/connect`

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* 2. Ghost Touch Canvas (Invisible Interaction Layer) */}
      <div className="absolute inset-0 z-50 pointer-events-none mix-blend-screen">
        <GhostTouchCanvas />
      </div>

      {/* 3. Main Content - Moved UP for "First Frame" Visibility */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-20">
        
        {/* Headline: Razor Thin, Wide Spacing, Subtle Glass Gradient */}
        <h1 className="text-4xl md:text-5xl font-thin tracking-tight text-center mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent opacity-90">
          Give the Gift of Connection
        </h1>

        {/* Tagline: Muted, High-End */}
        <p className="text-sm md:text-base font-light tracking-[0.2em] text-zinc-500 uppercase text-center mb-12">
          Be there. Even when you're not.
        </p>

        {/* The Orb */}
        <div className="mb-12 scale-90 md:scale-100 opacity-90 hover:opacity-100 transition-opacity duration-1000">
          <LivingOrb isListening={false} isSpeaking={false} />
        </div>

        {/* 4. The "Floating" QR Code (No Boxes, No Borders) */}
        <div className="flex flex-col items-center animate-fade-in gap-6">
          
          <div className="relative group">
            {/* Subtle backlight glow behind QR */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />
            
            {/* QR Code: Cyan on Transparent (Looks like floating data) */}
            <div className="relative z-10 opacity-80 hover:opacity-100 transition-opacity">
              <QRCode 
                value={magicLink}
                size={160}
                bgColor="transparent"
                fgColor="#22d3ee" // Cyan-400 (Electric but thin)
                level="M"
              />
            </div>
          </div>

          {/* Minimal Instruction */}
          <span className="text-[10px] tracking-[0.3em] text-cyan-500/40 uppercase">
            Scan to Pair
          </span>

        </div>

        {/* 5. Minimal Features (Floating Icons) */}
        <div className="absolute bottom-12 flex items-center justify-center gap-12 opacity-30">
           <div className="flex flex-col items-center gap-2">
              <span className="text-cyan-400 text-lg">✦</span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-500">Always Ready</span>
           </div>
           <div className="w-px h-6 bg-zinc-800" />
           <div className="flex flex-col items-center gap-2">
              <span className="text-cyan-400 text-lg">●</span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-500">Human Touch</span>
           </div>
        </div>

      </div>
    </div>
  )
}