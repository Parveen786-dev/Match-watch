import { createClient } from '@supabase/supabase-js'

// Replace these with your Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nkndogbnuutdqswgkcpe.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbmRvZ2JudXV0ZHFzd2drY3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMzUzMTMsImV4cCI6MjA4NjgxMTMxM30.zlgIWhMAwhqImzX7m4VQaZ-7rrY8UExycSOi80tuDWoyour-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper functions for database operations
export const favoriteTeamsTable = 'favorite_teams'

export async function getUserFavoriteTeams(userId) {
  try {
    const { data, error } = await supabase
      .from(favoriteTeamsTable)
      .select('team_name')
      .eq('user_id', userId)
    
    if (error) throw error
    return data.map(item => item.team_name)
  } catch (error) {
    console.error('Error fetching favorite teams:', error)
    return []
  }
}

export async function addFavoriteTeam(userId, teamName) {
  try {
    const { data, error } = await supabase
      .from(favoriteTeamsTable)
      .insert([{ user_id: userId, team_name: teamName }])
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding favorite team:', error)
    return null
  }
}

export async function removeFavoriteTeam(userId, teamName) {
  try {
    const { error } = await supabase
      .from(favoriteTeamsTable)
      .delete()
      .eq('user_id', userId)
      .eq('team_name', teamName)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error removing favorite team:', error)
    return false
  }
}
