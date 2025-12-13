import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import LivingOrb from '../components/LivingOrb'
import GhostTouchCanvas from '../components/GhostTouchCanvas'

export default function SeniorInterface() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  // Forces the Live URL (Not Localhost)
  const magicLink = user?.id 
    ? `https://www.lilhelper.ai/whisper/${user.id}`
    : `https://www.lilhelper.ai/connect`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(magicLink)
    alert("Link copied! Send it to your phone.")
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-light overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Ghost Touch Layer */}
      <div className="absolute inset-0 z-50 pointer-events-none mix-blend-screen">
        <GhostTouchCanvas />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 pt-32 pb-20">
        
        {/* The Orb */}
        <div className="mb-16">
          <LivingOrb isListening={false} isSpeaking={false} />
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-thin tracking-tight text-center mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          Give the Gift of Connection
        </h1>

        <p className="text-lg md:text-xl font-light tracking-wide text-zinc-500 text-center mb-16 max-w-lg">
          Be there. Even when you're not.
        </p>

        {/* The Connection Card */}
        <div className="flex flex-col items-center gap-8 w-full max-w-md animate-fade-in">
          
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative group">
            
            {/* QR CODE */}
            <div className="p-4 bg-white/5 rounded-xl mb-6">
              <QRCode 
                value={magicLink}
                size={180}
                bgColor="transparent"
                fgColor="#22d3ee" 
                level="M"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 w-full">
               {!user && (
                 <button 
                   onClick={() => navigate('/dashboard')}
                   className="mb-4 text-xs text-center text-cyan-400 hover:text-cyan-300 tracking-widest uppercase"
                 >
                   Sign in to Pair
                 </button>
               )}

              <button 
                onClick={handleCopyLink}
                className="w-full py-4 px-6 rounded-full bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 font-light tracking-widest text-sm hover:bg-cyan-500/10 transition-all"
              >
                COPY MAGIC LINK 🔗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}