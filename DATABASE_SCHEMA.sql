-- ============================================
-- TRASH PANDA LOOPS - DATABASE SCHEMA
-- Supabase PostgreSQL Database
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    total_score INTEGER DEFAULT 0,
    total_snacks_collected INTEGER DEFAULT 0,
    total_loops_completed INTEGER DEFAULT 0,
    total_play_time INTEGER DEFAULT 0, -- in seconds
    highest_level INTEGER DEFAULT 1,
    current_level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'Rookie Raccoon',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_played_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 2. GAME SESSIONS TABLE
-- ============================================
CREATE TABLE public.game_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    level_id INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    snacks_collected INTEGER DEFAULT 0,
    time_taken INTEGER, -- in seconds
    loops_completed INTEGER DEFAULT 0,
    detection_count INTEGER DEFAULT 0,
    perfect_stealth BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    session_data JSONB -- store detailed game state
);

-- ============================================
-- 3. LEVELS TABLE
-- ============================================
CREATE TABLE public.levels (
    id SERIAL PRIMARY KEY,
    level_number INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert', 'master')),
    time_limit INTEGER NOT NULL, -- in seconds
    snacks_required INTEGER NOT NULL,
    npc_count INTEGER NOT NULL,
    npc_speed DECIMAL(3,2) DEFAULT 1.0,
    detection_sensitivity DECIMAL(3,2) DEFAULT 1.0,
    layout_data JSONB, -- kitchen layout configuration
    unlock_requirement INTEGER, -- level required to unlock
    experience_reward INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE public.achievements (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT, -- emoji or icon name
    category TEXT NOT NULL CHECK (category IN ('collection', 'stealth', 'speed', 'mastery', 'special')),
    requirement_type TEXT NOT NULL, -- 'snacks_collected', 'perfect_stealth', 'speed_run', etc.
    requirement_value INTEGER,
    points INTEGER DEFAULT 10,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. USER ACHIEVEMENTS TABLE (junction)
-- ============================================
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0, -- for progressive achievements
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- 6. LEADERBOARD TABLE (materialized view for performance)
-- ============================================
CREATE TABLE public.leaderboard_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES public.levels(id),
    score INTEGER NOT NULL,
    snacks_collected INTEGER NOT NULL,
    time_taken INTEGER NOT NULL,
    perfect_stealth BOOLEAN DEFAULT FALSE,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, level_id)
);

-- ============================================
-- 7. USER PROGRESS TABLE
-- ============================================
CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES public.levels(id),
    best_score INTEGER DEFAULT 0,
    best_time INTEGER,
    attempts INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    stars INTEGER DEFAULT 0, -- 1-3 stars based on performance
    unlocked BOOLEAN DEFAULT FALSE,
    first_completed_at TIMESTAMP WITH TIME ZONE,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, level_id)
);

-- ============================================
-- 8. DAILY CHALLENGES TABLE
-- ============================================
CREATE TABLE public.daily_challenges (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
    challenge_type TEXT NOT NULL,
    challenge_data JSONB NOT NULL,
    reward_points INTEGER DEFAULT 50,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. USER DAILY PROGRESS TABLE
-- ============================================
CREATE TABLE public.user_daily_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES public.daily_challenges(id),
    completed BOOLEAN DEFAULT FALSE,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, challenge_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_total_score ON public.profiles(total_score DESC);
CREATE INDEX idx_game_sessions_user ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_level ON public.game_sessions(level_id);
CREATE INDEX idx_leaderboard_score ON public.leaderboard_entries(score DESC);
CREATE INDEX idx_leaderboard_level ON public.leaderboard_entries(level_id);
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Game Sessions: Users can only see and modify their own
CREATE POLICY "Users can view own game sessions"
    ON public.game_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game sessions"
    ON public.game_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game sessions"
    ON public.game_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- User Achievements: Users can view own achievements
CREATE POLICY "Users can view own achievements"
    ON public.user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
    ON public.user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Leaderboard: Everyone can read
CREATE POLICY "Leaderboard is viewable by everyone"
    ON public.leaderboard_entries FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own leaderboard entries"
    ON public.leaderboard_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User Progress: Users can view and modify own progress
CREATE POLICY "Users can view own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Levels and Achievements: Everyone can read
CREATE POLICY "Levels are viewable by everyone"
    ON public.levels FOR SELECT
    USING (true);

CREATE POLICY "Achievements are viewable by everyone"
    ON public.achievements FOR SELECT
    USING (true);

-- Daily Challenges: Everyone can read
CREATE POLICY "Daily challenges are viewable by everyone"
    ON public.daily_challenges FOR SELECT
    USING (true);

CREATE POLICY "Users can view own daily progress"
    ON public.user_daily_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily progress"
    ON public.user_daily_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily progress"
    ON public.user_daily_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'Trash Panda')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.leaderboard_entries (user_id, level_id, score, snacks_collected, time_taken, perfect_stealth)
    VALUES (NEW.user_id, NEW.level_id, NEW.score, NEW.snacks_collected, NEW.time_taken, NEW.perfect_stealth)
    ON CONFLICT (user_id, level_id)
    DO UPDATE SET
        score = GREATEST(leaderboard_entries.score, NEW.score),
        snacks_collected = GREATEST(leaderboard_entries.snacks_collected, NEW.snacks_collected),
        time_taken = LEAST(leaderboard_entries.time_taken, NEW.time_taken),
        perfect_stealth = leaderboard_entries.perfect_stealth OR NEW.perfect_stealth;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update leaderboard on game completion
CREATE TRIGGER on_game_session_completed
    AFTER INSERT OR UPDATE ON public.game_sessions
    FOR EACH ROW
    WHEN (NEW.completed = TRUE)
    EXECUTE FUNCTION update_leaderboard();

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_achievements;

-- ============================================
-- INITIAL DATA - LEVELS
-- ============================================

INSERT INTO public.levels (level_number, name, difficulty, time_limit, snacks_required, npc_count, npc_speed, detection_sensitivity, unlock_requirement, experience_reward) VALUES
(1, 'Midnight Snack', 'easy', 90, 3, 1, 0.8, 0.7, NULL, 100),
(2, 'Early Morning Raid', 'easy', 80, 4, 1, 0.9, 0.8, 1, 150),
(3, 'Breakfast Heist', 'medium', 75, 5, 2, 1.0, 0.9, 2, 200),
(4, 'Lunch Rush', 'medium', 70, 6, 2, 1.1, 1.0, 3, 250),
(5, 'Afternoon Delight', 'medium', 65, 7, 2, 1.2, 1.1, 4, 300),
(6, 'Dinner Time Danger', 'hard', 60, 8, 3, 1.3, 1.2, 5, 400),
(7, 'Late Night Feast', 'hard', 55, 9, 3, 1.4, 1.3, 6, 500),
(8, 'Party Crasher', 'hard', 50, 10, 3, 1.5, 1.4, 7, 600),
(9, 'Master Thief', 'expert', 45, 12, 4, 1.6, 1.5, 8, 800),
(10, 'Legendary Heist', 'master', 40, 15, 4, 1.8, 1.6, 9, 1000);

-- ============================================
-- INITIAL DATA - ACHIEVEMENTS
-- ============================================

INSERT INTO public.achievements (code, name, description, icon, category, requirement_type, requirement_value, points, rarity) VALUES
-- Collection Achievements
('first_snack', 'First Bite', 'Collect your first snack', '🧀', 'collection', 'snacks_collected', 1, 10, 'common'),
('snack_collector', 'Snack Collector', 'Collect 50 snacks', '🍕', 'collection', 'snacks_collected', 50, 25, 'common'),
('snack_hoarder', 'Snack Hoarder', 'Collect 200 snacks', '🍔', 'collection', 'snacks_collected', 200, 50, 'rare'),
('snack_master', 'Snack Master', 'Collect 500 snacks', '🌮', 'collection', 'snacks_collected', 500, 100, 'epic'),
('legendary_collector', 'Legendary Collector', 'Collect 1000 snacks', '🦝', 'collection', 'snacks_collected', 1000, 200, 'legendary'),

-- Stealth Achievements
('ghost', 'Ghost', 'Complete a level without being detected', '👻', 'stealth', 'perfect_stealth', 1, 30, 'rare'),
('shadow_master', 'Shadow Master', 'Complete 10 levels with perfect stealth', '🌑', 'stealth', 'perfect_stealth', 10, 75, 'epic'),
('invisible_panda', 'Invisible Panda', 'Complete 25 levels with perfect stealth', '🥷', 'stealth', 'perfect_stealth', 25, 150, 'legendary'),

-- Speed Achievements
('speed_demon', 'Speed Demon', 'Complete a level in under 30 seconds', '⚡', 'speed', 'speed_run', 30, 40, 'rare'),
('lightning_fast', 'Lightning Fast', 'Complete 5 levels in under 30 seconds each', '🌩️', 'speed', 'speed_run', 5, 80, 'epic'),
('time_lord', 'Time Lord', 'Complete 15 levels in under 30 seconds each', '⏰', 'speed', 'speed_run', 15, 150, 'legendary'),

-- Mastery Achievements
('level_master', 'Level Master', 'Complete all levels', '🏆', 'mastery', 'levels_completed', 10, 200, 'legendary'),
('three_star_hero', 'Three Star Hero', 'Get 3 stars on 5 levels', '⭐', 'mastery', 'three_stars', 5, 100, 'epic'),
('perfectionist', 'Perfectionist', 'Get 3 stars on all levels', '💎', 'mastery', 'three_stars', 10, 300, 'legendary'),

-- Special Achievements
('first_loop', 'First Loop', 'Complete your first time loop', '🔄', 'special', 'loops_completed', 1, 15, 'common'),
('loop_veteran', 'Loop Veteran', 'Complete 100 time loops', '🔁', 'special', 'loops_completed', 100, 75, 'epic'),
('dedicated_player', 'Dedicated Player', 'Play for 10 hours total', '🎮', 'special', 'play_time', 36000, 100, 'epic'),
('trash_panda_legend', 'Trash Panda Legend', 'Reach rank "Legendary Thief"', '👑', 'special', 'rank', 1, 500, 'legendary');

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- Global Leaderboard View
CREATE OR REPLACE VIEW public.global_leaderboard AS
SELECT 
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    p.total_score,
    p.total_snacks_collected,
    p.total_loops_completed,
    p.rank,
    ROW_NUMBER() OVER (ORDER BY p.total_score DESC) as position
FROM public.profiles p
ORDER BY p.total_score DESC
LIMIT 100;

-- Level Leaderboard View
CREATE OR REPLACE VIEW public.level_leaderboards AS
SELECT 
    l.level_number,
    l.name as level_name,
    p.username,
    p.display_name,
    le.score,
    le.snacks_collected,
    le.time_taken,
    le.perfect_stealth,
    ROW_NUMBER() OVER (PARTITION BY l.id ORDER BY le.score DESC) as rank
FROM public.leaderboard_entries le
JOIN public.profiles p ON le.user_id = p.id
JOIN public.levels l ON le.level_id = l.id
ORDER BY l.level_number, le.score DESC;

-- User Stats View
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    p.id,
    p.username,
    p.total_score,
    p.total_snacks_collected,
    p.total_loops_completed,
    p.highest_level,
    p.experience_points,
    p.rank,
    COUNT(DISTINCT ua.achievement_id) as achievements_unlocked,
    COUNT(DISTINCT CASE WHEN up.completed = TRUE THEN up.level_id END) as levels_completed
FROM public.profiles p
LEFT JOIN public.user_achievements ua ON p.id = ua.user_id
LEFT JOIN public.user_progress up ON p.id = up.user_id
GROUP BY p.id;

-- ============================================
-- DONE!
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- Then use the Supabase client in your app
-- ============================================
