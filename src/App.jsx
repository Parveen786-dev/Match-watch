import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './config/supabase'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import TeamPreferences from './pages/TeamPreferences'
import MatchDetails from './pages/MatchDetails'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    checkUserSession()

    // Subscribe to auth state changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => authListener?.data?.subscription?.unsubscribe()
  }, [])

  const checkUserSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Match Watch...</p>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} /> : <Landing />} />
        <Route path="/login" element={user ? <Dashboard user={user} /> : <Login />} />
        <Route path="/signup" element={user ? <Dashboard user={user} /> : <Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Login />} />
        <Route path="/preferences" element={user ? <TeamPreferences user={user} /> : <Login />} />
        <Route path="/match/:matchId" element={user ? <MatchDetails user={user} /> : <Login />} />
      </Routes>
    </Router>
  )
}

export default App
