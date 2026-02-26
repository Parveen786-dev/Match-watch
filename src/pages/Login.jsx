import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabase'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const RESEND_COOLDOWN = 60 // seconds
  const [resendCooldown, setResendCooldown] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
        if (/confirm/i.test(error.message)) {
          setUnconfirmed(true)
        } else {
          setUnconfirmed(false)
        }
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setResendMessage('')
    setResendLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) {
        setResendMessage(error.message)
      } else {
        localStorage.setItem('resend_last', String(Date.now()))
        setResendMessage('A magic link has been sent to your email. Use it to sign in.')
        setResendCooldown(RESEND_COOLDOWN)
      }
    } catch (err) {
      console.error('Resend error:', err)
      setResendMessage('Unable to send verification email. Try again later.')
    } finally {
      setResendLoading(false)
    }
  }

  useEffect(() => {
    // initialize cooldown from localStorage
    const last = Number(localStorage.getItem('resend_last') || 0)
    if (last) {
      const rem = Math.max(0, RESEND_COOLDOWN - Math.floor((Date.now() - last) / 1000))
      setResendCooldown(rem)
    }
    const t = setInterval(() => {
      const lastInner = Number(localStorage.getItem('resend_last') || 0)
      const remInner = Math.max(0, RESEND_COOLDOWN - Math.floor((Date.now() - lastInner) / 1000))
      setResendCooldown(remInner)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🏏 Match Watch</h1>
          <p>Sign In to Your Account</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {unconfirmed && (
            <div className="resend-section">
              <p className="info-message">Your email is not confirmed. Check your inbox or resend verification.</p>
              {resendMessage && (
                <div className="info-message">{resendMessage}</div>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResendVerification}
                disabled={resendLoading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : (resendLoading ? 'Sending...' : 'Resend Verification')}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-submit"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Create one</Link></p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>

        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123456</p>
        </div>
      </div>
    </div>
  )
}

export default Login
