import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Dashboard from './pages/dashboard'
import SeniorInterface from './pages/senior-interface'
import Helper from './pages/helper'
import Mirror from './pages/mirror'
import AuthCallback from './pages/auth-callback'

function App() {
  const [session, setSession] = useState(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Routes>
        <Route path="/" element={<SeniorInterface />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* THIS FIXES THE BROKEN LINK: */}
        <Route path="/connect" element={<Helper />} />
        <Route path="/whisper/:userId" element={<Helper />} />
        <Route path="/mirror/:userId" element={<Mirror />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </div>
  )
}

export default App