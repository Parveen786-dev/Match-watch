-- Cricket Match Application Database Migration
-- Created: 2026-02-17
-- This file contains all database schema setup for the Match Watch application

-- ============================================================================
-- Create favorite_teams table for storing user's favorite cricket teams
-- ============================================================================
CREATE TABLE IF NOT EXISTS favorite_teams (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, team_name)
);

-- ============================================================================
-- Create indexes for better query performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_favorite_teams_user_id ON favorite_teams(user_id);

-- ============================================================================
-- Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE favorite_teams ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies for favorite_teams table
-- ============================================================================

-- Policy: Users can view their own favorite teams
DROP POLICY IF EXISTS "Users can view their own favorite teams" ON favorite_teams;
CREATE POLICY "Users can view their own favorite teams" ON favorite_teams
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own favorite teams
DROP POLICY IF EXISTS "Users can insert their own favorite teams" ON favorite_teams;
CREATE POLICY "Users can insert their own favorite teams" ON favorite_teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorite teams
DROP POLICY IF EXISTS "Users can delete their own favorite teams" ON favorite_teams;
CREATE POLICY "Users can delete their own favorite teams" ON favorite_teams
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- End of Migration
-- ============================================================================
