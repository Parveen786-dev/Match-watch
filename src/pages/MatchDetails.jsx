import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getUpcomingMatches, getCompletedMatches, getLiveMatches } from '../config/cricketApi'
import './MatchDetails.css'

function MatchDetails({ user }) {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatchDetails()
  }, [matchId])

  const loadMatchDetails = async () => {
    try {
      const upcoming = await getUpcomingMatches()
      const completed = await getCompletedMatches()
      const live = await getLiveMatches()

      const allMatches = [...live, ...upcoming, ...completed]
      const foundMatch = allMatches.find(m => m.unique_id === matchId)

      if (foundMatch) {
        setMatch(foundMatch)
      }
    } catch (error) {
      console.error('Error loading match details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading match details...</p>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="details-page">
        <header className="details-header">
          <Link to="/dashboard" className="btn btn-back">← Back to Dashboard</Link>
        </header>
        <div className="details-container">
          <div className="not-found">
            <h2>Match Not Found</h2>
            <p>The match details could not be loaded.</p>
            <Link to="/dashboard" className="btn btn-primary">Go Back</Link>
          </div>
        </div>
      </div>
    )
  }

  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="details-page">
      <header className="details-header">
        <Link to="/dashboard" className="btn btn-back">← Back to Dashboard</Link>
      </header>

      <main className="details-container">
        <div className="match-details-card">
          {isLive && <div className="live-badge-large">🔴 LIVE</div>}
          {isCompleted && <div className="completed-badge">✓ COMPLETED</div>}

          <div className="match-main-info">
            <div className="team-section">
              <h2 className="team-name-large">{match.team_a}</h2>
              {isLive && <p className="team-score-large">{match.team_a_score || '-'}</p>}
              {isCompleted && (
                <>
                  <p className="team-score-large">{match.team_a_score || '-'}</p>
                  {match.winner === match.team_a && <p className="winner-badge">WINNER</p>}
                </>
              )}
            </div>

            <div className="vs-section">
              <p className="vs-text">VS</p>
              {isLive && <p className="match-type">{match.overs || '-'}</p>}
              {!isLive && isCompleted && <p className="match-result">Final</p>}
              {!isLive && !isCompleted && <p className="match-time">{formatDate(match.date)}</p>}
            </div>

            <div className="team-section">
              <h2 className="team-name-large">{match.team_b}</h2>
              {isLive && <p className="team-score-large">{match.team_b_score || '-'}</p>}
              {isCompleted && (
                <>
                  <p className="team-score-large">{match.team_b_score || '-'}</p>
                  {match.winner === match.team_b && <p className="winner-badge">WINNER</p>}
                </>
              )}
            </div>
          </div>

          <div className="match-details-info">
            <div className="info-grid">
              <div className="info-item">
                <h3>Match Type</h3>
                <p>{match.match_type}</p>
              </div>

              <div className="info-item">
                <h3>Stage</h3>
                <p>{match.stage || 'Not specified'}</p>
              </div>

              <div className="info-item">
                <h3>Venue</h3>
                <p>{match.venue || 'Not specified'}</p>
              </div>

              <div className="info-item">
                <h3>Date & Time</h3>
                <p>{formatDate(match.date)}</p>
              </div>

              {isLive && (
                <>
                  <div className="info-item">
                    <h3>Overs</h3>
                    <p>{match.overs || '-'}</p>
                  </div>

                  <div className="info-item">
                    <h3>Run Rate</h3>
                    <p>{match.run_rate || '-'}</p>
                  </div>

                  {match.team_b_wickets !== undefined && (
                    <div className="info-item">
                      <h3>Wickets Down</h3>
                      <p>{match.team_b_wickets}/11</p>
                    </div>
                  )}
                </>
              )}

              {isCompleted && match.winner && (
                <div className="info-item winner-info">
                  <h3>Winner</h3>
                  <p>{match.winner}</p>
                </div>
              )}
            </div>
          </div>

          {isLive && (
            <div className="live-info">
              <p>🔄 Scores update automatically every 10 seconds</p>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
          <Link to="/preferences" className="btn btn-secondary">Manage Teams</Link>
        </div>
      </main>
    </div>
  )
}

export default MatchDetails
