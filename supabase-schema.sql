-- Journey Through Matthew - Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required table

CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  player_location VARCHAR(50) NOT NULL,
  security_code VARCHAR(6) NOT NULL,
  questions_answered JSONB NOT NULL,
  accuracy_score INTEGER NOT NULL,
  time_bonus_score INTEGER NOT NULL,
  final_score DECIMAL(10,2) NOT NULL,
  completion_timestamp TIMESTAMPTZ NOT NULL,
  total_time_seconds INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on final_score for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_final_score ON game_sessions(final_score DESC);

-- Create an index on completion_timestamp for tie-breaking queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_completion_timestamp ON game_sessions(completion_timestamp ASC);

-- Optional: Create a view for leaderboard
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  player_name,
  player_location,
  final_score,
  accuracy_score,
  time_bonus_score,
  completion_timestamp,
  created_at
FROM game_sessions
ORDER BY final_score DESC, completion_timestamp ASC;

