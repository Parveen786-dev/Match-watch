import React from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

function Landing() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <h1 className="app-title">🏏 Match Watch</h1>
          <p className="app-tagline">Your Ultimate Cricket Match Companion</p>
        </div>

        <div className="features-section">
          <h2>Why Choose Match Watch?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Live Scores</h3>
              <p>Get real-time cricket match updates and live scores</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Favorite Teams</h3>
              <p>Track your favorite teams and never miss a match</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Match Schedule</h3>
              <p>View past and upcoming matches for your favorite teams</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Login</h3>
              <p>Safe and secure authentication with Supabase</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Get Started Now</h2>
          <p>Join thousands of cricket fans tracking their favorite matches</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Create Account</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>

        <div className="info-section">
          <h3>Features Included:</h3>
          <ul>
            <li>✓ Real-time cricket match scores</li>
            <li>✓ Last 3 matches history for your teams</li>
            <li>✓ Next 3 upcoming matches preview</li>
            <li>✓ Detailed match information and statistics</li>
            <li>✓ Responsive design for all devices</li>
            <li>✓ Secure account management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Landing
