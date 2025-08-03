-- Create the niranjan_avatars table
CREATE TABLE IF NOT EXISTS niranjan_avatars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    voice_type TEXT NOT NULL,
    persona_tag TEXT NOT NULL CHECK (persona_tag IN ('funny', 'serious', 'quirky', 'techy', 'diva', 'hacker')),
    script TEXT NOT NULL,
    heygen_video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the niranjan_votes table
CREATE TABLE IF NOT EXISTS niranjan_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    avatar_id UUID NOT NULL REFERENCES niranjan_avatars(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(avatar_id, device_id) -- Prevent duplicate votes from same device
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_niranjan_avatars_persona_tag ON niranjan_avatars(persona_tag);
CREATE INDEX IF NOT EXISTS idx_niranjan_avatars_created_at ON niranjan_avatars(created_at);
CREATE INDEX IF NOT EXISTS idx_niranjan_votes_avatar_id ON niranjan_votes(avatar_id);
CREATE INDEX IF NOT EXISTS idx_niranjan_votes_device_id ON niranjan_votes(device_id);
CREATE INDEX IF NOT EXISTS idx_niranjan_votes_vote_type ON niranjan_votes(vote_type);
CREATE INDEX IF NOT EXISTS idx_niranjan_votes_created_at ON niranjan_votes(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE niranjan_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE niranjan_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for niranjan_avatars
CREATE POLICY "Allow public read access to avatars" ON niranjan_avatars
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert to avatars" ON niranjan_avatars
    FOR INSERT WITH CHECK (true);

-- Create policies for niranjan_votes
CREATE POLICY "Allow public read access to votes" ON niranjan_votes
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to votes" ON niranjan_votes
    FOR INSERT WITH CHECK (true);

-- Insert some sample data
INSERT INTO niranjan_avatars (image_url, voice_type, persona_tag, script, heygen_video_url) VALUES
('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'male_confident', 'hacker', 'I''ve just breached the firewalls of three rogue AIs — swipe right if you want in.', null),
('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', 'female_elegant', 'diva', 'Darling, I''m too glamorous to be swiped left. Prove your taste.', null),
('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'male_friendly', 'funny', 'I''m 90% caffeine and 10% bad decisions. Swipe accordingly.', null),
('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 'female_professional', 'serious', 'Excellence isn''t a skill, it''s an attitude. Are you ready to elevate?', null),
('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', 'male_quirky', 'quirky', 'I collect vintage rubber ducks and existential thoughts. Interested?', null),
('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', 'female_tech', 'techy', 'I debug code by day and debug my life by night. Both need work.', null),
('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', 'male_mysterious', 'hacker', 'Zero-day exploits are my morning coffee. Care to join the dark side?', null),
('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', 'female_glamorous', 'diva', 'I don''t do ordinary, sweetie. My aura is premium subscription only.', null),
('https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face', 'male_casual', 'funny', 'My life is like a romantic comedy, except it''s more comedy than romance.', null),
('https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face', 'female_confident', 'serious', 'I believe in meaningful connections and purposeful conversations. You?', null);

-- Create a view for leaderboard with vote counts
CREATE OR REPLACE VIEW avatar_leaderboard AS
SELECT 
    a.*,
    COALESCE(v.total_votes, 0) as vote_count,
    COALESCE(v.up_votes, 0) as up_votes,
    COALESCE(v.down_votes, 0) as down_votes,
    CASE 
        WHEN COALESCE(v.total_votes, 0) = 0 THEN 0
        ELSE ROUND((COALESCE(v.up_votes, 0)::float / COALESCE(v.total_votes, 0)::float) * 100, 2)
    END as approval_rate
FROM niranjan_avatars a
LEFT JOIN (
    SELECT 
        avatar_id,
        COUNT(*) as total_votes,
        COUNT(CASE WHEN vote_type = 'up' THEN 1 END) as up_votes,
        COUNT(CASE WHEN vote_type = 'down' THEN 1 END) as down_votes
    FROM niranjan_votes
    GROUP BY avatar_id
) v ON a.id = v.avatar_id
ORDER BY vote_count DESC, approval_rate DESC;