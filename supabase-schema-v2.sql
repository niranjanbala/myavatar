-- Enhanced schema for user-generated content with HeyGen API integration
-- Version 2.0 - Community-driven avatar platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for managing contributors
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  heygen_api_key TEXT, -- Encrypted HeyGen API key
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced avatars table with user attribution
CREATE TABLE IF NOT EXISTS niranjan_avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  heygen_video_url TEXT,
  heygen_avatar_id TEXT,
  script TEXT NOT NULL,
  persona_tag VARCHAR(20) NOT NULL CHECK (persona_tag IN ('hacker', 'diva', 'funny', 'serious', 'quirky', 'techy')),
  voice_type VARCHAR(50) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE, -- Moderation status
  is_featured BOOLEAN DEFAULT FALSE, -- Featured content
  submission_notes TEXT, -- Creator notes
  moderation_notes TEXT, -- Admin notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced votes table
CREATE TABLE IF NOT EXISTS niranjan_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avatar_id UUID NOT NULL REFERENCES niranjan_avatars(id) ON DELETE CASCADE,
  device_id VARCHAR(255) NOT NULL,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional user attribution
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(avatar_id, device_id)
);

-- Avatar submissions tracking
CREATE TABLE IF NOT EXISTS avatar_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  avatar_id UUID REFERENCES niranjan_avatars(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing')),
  submission_data JSONB, -- Store form data and HeyGen response
  rejection_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User API key usage tracking
CREATE TABLE IF NOT EXISTS heygen_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  avatar_id UUID REFERENCES niranjan_avatars(id) ON DELETE SET NULL,
  api_call_type VARCHAR(50) NOT NULL, -- 'create_avatar', 'generate_video', etc.
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,4) DEFAULT 0,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_avatars_creator ON niranjan_avatars(creator_id);
CREATE INDEX IF NOT EXISTS idx_avatars_approved ON niranjan_avatars(is_approved);
CREATE INDEX IF NOT EXISTS idx_avatars_persona ON niranjan_avatars(persona_tag);
CREATE INDEX IF NOT EXISTS idx_votes_avatar ON niranjan_votes(avatar_id);
CREATE INDEX IF NOT EXISTS idx_votes_device ON niranjan_votes(device_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON avatar_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON avatar_submissions(status);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE niranjan_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE niranjan_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE heygen_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read all public user profiles
CREATE POLICY "Public user profiles are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Approved avatars are viewable by everyone
CREATE POLICY "Approved avatars are viewable by everyone" ON niranjan_avatars
  FOR SELECT USING (is_approved = true);

-- Users can view their own submitted avatars
CREATE POLICY "Users can view own avatars" ON niranjan_avatars
  FOR SELECT USING (auth.uid() = creator_id);

-- Users can insert their own avatars
CREATE POLICY "Users can create avatars" ON niranjan_avatars
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Anyone can vote (anonymous voting supported)
CREATE POLICY "Anyone can vote" ON niranjan_votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view votes" ON niranjan_votes
  FOR SELECT USING (true);

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON avatar_submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create submissions
CREATE POLICY "Users can create submissions" ON avatar_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own API usage
CREATE POLICY "Users can view own usage" ON heygen_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Seed data - Your initial profile and avatars
INSERT INTO users (id, email, username, display_name, is_verified, is_admin) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'niranjan@example.com', 'niranjan', 'Niranjan Bala', true, true)
ON CONFLICT (email) DO NOTHING;

-- Your initial avatars (approved by default since you're the creator)
INSERT INTO niranjan_avatars (id, creator_id, image_url, script, persona_tag, voice_type, is_approved, is_featured) VALUES
  (
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440000',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'Hey there! I''m a tech enthusiast who loves building the future. When I''m not coding, you''ll find me exploring AI, blockchain, or the latest startup trends. Let''s innovate together!',
    'techy',
    'male_confident',
    true,
    true
  ),
  (
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440000',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'Welcome to the neural network! I''m here to hack the matrix of boring conversations. My code compiles, my jokes execute, and my personality has zero bugs. Ready to debug life together?',
    'hacker',
    'male_tech',
    true,
    true
  ),
  (
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440000',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    'Life''s too short for serious conversations! I''m the guy who finds humor in everything - from debugging code to debugging relationships. Warning: May cause excessive laughter and good vibes!',
    'funny',
    'male_friendly',
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Functions for common operations

-- Function to get avatar stats
CREATE OR REPLACE FUNCTION get_avatar_stats(avatar_uuid UUID)
RETURNS TABLE (
  total_votes BIGINT,
  up_votes BIGINT,
  down_votes BIGINT,
  approval_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_votes,
    COUNT(*) FILTER (WHERE vote_type = 'up') as up_votes,
    COUNT(*) FILTER (WHERE vote_type = 'down') as down_votes,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE vote_type = 'up')::NUMERIC / COUNT(*)) * 100, 2)
      ELSE 0
    END as approval_rate
  FROM niranjan_votes 
  WHERE avatar_id = avatar_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get leaderboard with creator info
CREATE OR REPLACE FUNCTION get_leaderboard_with_creators(
  persona_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  creator_username TEXT,
  creator_display_name TEXT,
  image_url TEXT,
  heygen_video_url TEXT,
  script TEXT,
  persona_tag TEXT,
  voice_type TEXT,
  vote_count BIGINT,
  up_votes BIGINT,
  down_votes BIGINT,
  approval_rate NUMERIC,
  is_featured BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    u.username,
    u.display_name,
    a.image_url,
    a.heygen_video_url,
    a.script,
    a.persona_tag,
    a.voice_type,
    COALESCE(v.vote_count, 0) as vote_count,
    COALESCE(v.up_votes, 0) as up_votes,
    COALESCE(v.down_votes, 0) as down_votes,
    COALESCE(v.approval_rate, 0) as approval_rate,
    a.is_featured,
    a.created_at
  FROM niranjan_avatars a
  LEFT JOIN users u ON a.creator_id = u.id
  LEFT JOIN (
    SELECT 
      avatar_id,
      COUNT(*) as vote_count,
      COUNT(*) FILTER (WHERE vote_type = 'up') as up_votes,
      COUNT(*) FILTER (WHERE vote_type = 'down') as down_votes,
      CASE 
        WHEN COUNT(*) > 0 THEN 
          ROUND((COUNT(*) FILTER (WHERE vote_type = 'up')::NUMERIC / COUNT(*)) * 100, 2)
        ELSE 0
      END as approval_rate
    FROM niranjan_votes 
    GROUP BY avatar_id
  ) v ON a.id = v.avatar_id
  WHERE a.is_approved = true
    AND (persona_filter IS NULL OR a.persona_tag = persona_filter)
  ORDER BY 
    a.is_featured DESC,
    COALESCE(v.vote_count, 0) DESC,
    COALESCE(v.approval_rate, 0) DESC,
    a.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avatars_updated_at BEFORE UPDATE ON niranjan_avatars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();