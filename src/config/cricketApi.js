import axios from 'axios'

// Cricket API configuration
// Using free cricket API - no key required for basic usage
const API_BASE_URL = 'https://cricketdata.com/api'

// Alternative free API: https://api.cricketdata.org
// For production, consider using RapidAPI's Cricket APIs

const cricketApi = axios.create({
  baseURL: 'https://cricketdata.com/api',
  timeout: 10000
})

// Fetch upcoming matches
export async function getUpcomingMatches() {
  try {
    const response = await axios.get('https://cricketdata.com/api/upcoming/')
    return response.data.upcoming || []
  } catch (error) {
    console.error('Error fetching upcoming matches:', error)
    // Return mock data for demonstration
    return getMockUpcomingMatches()
  }
}

// Fetch completed matches
export async function getCompletedMatches() {
  try {
    // Using a different cricket API endpoint
    const response = await axios.get('https://api.cricketdata.org/v1/matches')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching completed matches:', error)
    return getMockCompletedMatches()
  }
}

// Get live matches
export async function getLiveMatches() {
  try {
    const response = await axios.get('https://cricketdata.com/api/live/')
    return response.data.live || []
  } catch (error) {
    console.error('Error fetching live matches:', error)
    return getMockLiveMatches()
  }
}

// Mock data for demonstration and testing
function getMockUpcomingMatches() {
  return [
    {
      unique_id: 'upcoming1',
      match_id: 'test1',
      team_a: 'India',
      team_b: 'Australia',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      match_type: 'T20',
      stage: 'Group Stage',
      venue: 'MCG, Melbourne'
    },
    {
      unique_id: 'upcoming2',
      match_id: 'test2',
      team_a: 'Pakistan',
      team_b: 'South Africa',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      match_type: 'T20',
      stage: 'Group Stage',
      venue: 'Wanderers Stadium, Johannesburg'
    },
    {
      unique_id: 'upcoming3',
      match_id: 'test3',
      team_a: 'England',
      team_b: 'West Indies',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      match_type: 'T20',
      stage: 'Group Stage',
      venue: 'Eden Gardens, Kolkata'
    }
  ]
}

function getMockCompletedMatches() {
  return [
    {
      unique_id: 'completed1',
      match_id: 'test4',
      team_a: 'Sri Lanka',
      team_b: 'Bangladesh',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      match_type: 'T20',
      stage: 'Group Stage',
      venue: 'Arun Jaitley Stadium, Delhi',
      status: 'completed',
      winner: 'Sri Lanka',
      team_a_score: 165,
      team_b_score: 142
    },
    {
      unique_id: 'completed2',
      match_id: 'test5',
      team_a: 'New Zealand',
      team_b: 'Iran',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      match_type: 'T20',
      stage: 'Group Stage',
      venue: 'Dubai International Cricket Stadium',
      status: 'completed',
      winner: 'New Zealand',
      team_a_score: 174,
      team_b_score: 88
    },
    {
      unique_id: 'completed3',
      match_id: 'test6',
      team_a: 'Afghanistan',
      team_b: 'Netherlands',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      match_type: 'T20',
      stage: 'Group Stage',
      venue: 'Sheikh Zayed Stadium, Abu Dhabi',
      status: 'completed',
      winner: 'Afghanistan',
      team_a_score: 188,
      team_b_score: 115
    }
  ]
}

function getMockLiveMatches() {
  return [
    {
      unique_id: 'live1',
      match_id: 'test7',
      team_a: 'India',
      team_b: 'Pakistan',
      date: new Date().toISOString(),
      match_type: 'T20',
      stage: 'Group Stage',
      venue: 'Nassau County International Cricket Stadium, NY',
      status: 'live',
      team_a_score: 98,
      team_b_score: 45,
      team_b_wickets: 3,
      overs: '10.2',
      run_rate: '4.41'
    }
  ]
}

// Filter matches by team
export function filterMatchesByTeam(matches, teamName) {
  return matches.filter(match => 
    match.team_a?.toLowerCase().includes(teamName.toLowerCase()) || 
    match.team_b?.toLowerCase().includes(teamName.toLowerCase())
  )
}

// Get last N matches for a team
export function getLastNMatches(matches, teamName, n = 3) {
  const filtered = filterMatchesByTeam(matches, teamName)
  return filtered.slice(0, n)
}

// Get next N matches for a team
export function getNextNMatches(matches, teamName, n = 3) {
  const filtered = filterMatchesByTeam(matches, teamName)
  return filtered.slice(0, n)
}
