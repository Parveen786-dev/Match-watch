import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import { getUserFavoriteTeams } from '../config/supabase'
import { getUpcomingMatches, getCompletedMatches, getLiveMatches, filterMatchesByTeam } from '../config/cricketApi'
import './Dashboard.css'

function Dashboard({ user }) {
  const [favoriteTeams, setFavoriteTeams] = useState([])
  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [completedMatches, setCompletedMatches] = useState([])
  const [liveMatches, setLiveMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredMatches, setFilteredMatches] = useState({
    last3: [],
    next3: []
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load favorite teams
      const teams = await getUserFavoriteTeams(user.id)
      setFavoriteTeams(teams)

      // Load matches
      const upcoming = await getUpcomingMatches()
      const completed = await getCompletedMatches()
      const live = await getLiveMatches()

      setUpcomingMatches(upcoming)
      setCompletedMatches(completed)
      setLiveMatches(live)

      // Filter matches by favorite teams
      if (teams.length > 0) {
        filterMatches(teams, upcoming, completed)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMatches = (teams, upcoming, completed) => {
    let last3 = []
    let next3 = []

    teams.forEach(team => {
      const team_completed = filterMatchesByTeam(completed, team)
      const team_upcoming = filterMatchesByTeam(upcoming, team)

      last3 = [...last3, ...team_completed.slice(0, 3)]
      next3 = [...next3, ...team_upcoming.slice(0, 3)]
    })

    // Remove duplicates
    last3 = last3.filter((match, index, self) =>
      index === self.findIndex(m => m.unique_id === match.unique_id)
    ).slice(0, 3)

    next3 = next3.filter((match, index, self) =>
      index === self.findIndex(m => m.unique_id === match.unique_id)
    ).slice(0, 3)

    setFilteredMatches({ last3, next3 })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🏏 Match Watch</h1>
          <p>Welcome, {user?.email}</p>
        </div>
        <div className="header-right">
          <Link to="/preferences" className="btn btn-secondary">Manage Teams</Link>
          <button onClick={handleLogout} className="btn btn-logout">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Live Matches Section */}
        {liveMatches && liveMatches.length > 0 && (
          <section className="matches-section live-section">
            <h2>🔴 Live Matches</h2>
            <div className="matches-grid">
              {liveMatches.slice(0, 3).map((match) => (
                <Link
                  to={`/match/${match.unique_id}`}
                  key={match.unique_id}
                  className="match-card live-match"
                >
                  <div className="live-badge">LIVE</div>
                  <div className="match-teams">
                    <div className="team">
                      <p className="team-name">{match.team_a}</p>
                      <p className="team-score">{match.team_a_score || '-'}</p>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <p className="team-name">{match.team_b}</p>
                      <p className="team-score">{match.team_b_score || '-'}</p>
                    </div>
                  </div>
                  <div className="match-info">
                    <p className="match-type">{match.match_type}</p>
                    <p className="overs">{match.overs || '-'} overs</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches Section */}
        {filteredMatches.next3.length > 0 ? (
          <section className="matches-section">
            <h2>📅 Next 3 Matches</h2>
            <div className="matches-grid">
              {filteredMatches.next3.map((match) => (
                <Link
                  to={`/match/${match.unique_id}`}
                  key={match.unique_id}
                  className="match-card"
                >
                  <div className="match-teams">
                    <div className="team">
                      <p className="team-name">{match.team_a}</p>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <p className="team-name">{match.team_b}</p>
                    </div>
                  </div>
                  <div className="match-info">
                    <p className="match-date">{formatDate(match.date)}</p>
                    <p className="match-type">{match.match_type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="empty-state">
            <p>No upcoming matches for your favorite teams</p>
            <Link to="/preferences" className="btn btn-primary">Select Favorite Teams</Link>
          </section>
        )}

        {/* Past Matches Section */}
        {filteredMatches.last3.length > 0 ? (
          <section className="matches-section">
            <h2>📊 Last 3 Matches</h2>
            <div className="matches-grid">
              {filteredMatches.last3.map((match) => (
                <Link
                  to={`/match/${match.unique_id}`}
                  key={match.unique_id}
                  className="match-card completed"
                >
                  <div className="match-teams">
                    <div className="team">
                      <p className="team-name">{match.team_a}</p>
                      <p className="team-score">{match.team_a_score || '-'}</p>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <p className="team-name">{match.team_b}</p>
                      <p className="team-score">{match.team_b_score || '-'}</p>
                    </div>
                  </div>
                  <div className="match-info">
                    <p className="winner">Winner: {match.winner || 'TBA'}</p>
                    <p className="match-date">{formatDate(match.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* No Favorite Teams */}
        {favoriteTeams.length === 0 && (
          <section className="empty-state">
            <h3>👋 Get Started</h3>
            <p>You haven't selected any favorite teams yet</p>
            <Link to="/preferences" className="btn btn-primary">Select Your Favorite Teams</Link>
          </section>
        )}
      </main>
    </div>
  )
}

export default Dashboard
