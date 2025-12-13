import { useEffect, useState } from 'react'

export default function LivingOrb({ isListening = false, isSpeaking = false }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const scale = isSpeaking ? 1.05 : 1
  
  return (
    <div className="relative flex items-center justify-center">
      <div 
        className="relative w-[300px] h-[300px] transition-all duration-1000 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        {/* 1. Deep Void (Base) */}
        <div className="absolute inset-0 rounded-full bg-black" />

        {/* 2. Ocean Depth (Dark Teal Gradient) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-950/40 via-transparent to-transparent" />

        {/* 3. Ethereal Mist (The "Ghost" Vibe) */}
        <div 
          className="absolute inset-0 rounded-full opacity-30 mix-blend-screen animate-pulse-slow"
          style={{
            background: 'radial-gradient(circle at 40% 30%, rgba(34,211,238,0.15) 0%, transparent 50%)'
          }}
        />

        {/* 4. Glass Reflection (Top Shine) */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_20px_rgba(255,255,255,0.02)]" />

        {/* 5. Rim Light (Very Thin) */}
        <div className="absolute inset-0 rounded-full border border-white/5 opacity-20" />
      </div>
    </div>
  )
}