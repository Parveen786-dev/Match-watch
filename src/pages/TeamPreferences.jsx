import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getUserFavoriteTeams, addFavoriteTeam, removeFavoriteTeam } from '../config/supabase'
import './TeamPreferences.css'

function TeamPreferences({ user }) {
  const [allTeams] = useState([
    'India',
    'Pakistan',
    'Australia',
    'England',
    'South Africa',
    'New Zealand',
    'West Indies',
    'Sri Lanka',
    'Bangladesh',
    'Afghanistan',
    'Ireland',
    'Netherlands',
    'Iran'
  ])

  const [favoriteTeams, setFavoriteTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadFavoriteTeams()
  }, [user])

  const loadFavoriteTeams = async () => {
    try {
      const teams = await getUserFavoriteTeams(user.id)
      setFavoriteTeams(teams)
    } catch (error) {
      console.error('Error loading favorite teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTeamToggle = async (team) => {
    setSaving(true)
    try {
      if (favoriteTeams.includes(team)) {
        await removeFavoriteTeam(user.id, team)
        setFavoriteTeams(favoriteTeams.filter(t => t !== team))
      } else {
        await addFavoriteTeam(user.id, team)
        setFavoriteTeams([...favoriteTeams, team])
      }
    } catch (error) {
      console.error('Error updating favorite teams:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your preferences...</p>
      </div>
    )
  }

  return (
    <div className="preferences-page">
      <header className="preferences-header">
        <div>
          <h1>🏏 Match Watch</h1>
          <p>Manage Your Favorite Teams</p>
        </div>
        <Link to="/dashboard" className="btn btn-back">← Back to Dashboard</Link>
      </header>

      <main className="preferences-content">
        <div className="preferences-container">
          <div className="preferences-info">
            <h2>Select Your Favorite Teams</h2>
            <p>Choose the teams you want to follow. We'll show you their matches first on your dashboard.</p>
            <p className="selected-count">
              {favoriteTeams.length} team{favoriteTeams.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          <div className="teams-grid">
            {allTeams.map((team) => (
              <button
                key={team}
                onClick={() => handleTeamToggle(team)}
                disabled={saving}
                className={`team-button ${favoriteTeams.includes(team) ? 'selected' : ''}`}
              >
                <div className="team-checkbox">
                  {favoriteTeams.includes(team) && '✓'}
                </div>
                <span>{team}</span>
              </button>
            ))}
          </div>

          <div className="action-buttons">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Done
            </button>
            {favoriteTeams.length > 0 && (
              <button
                onClick={() => setFavoriteTeams([])}
                className="btn btn-secondary"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeamPreferences
