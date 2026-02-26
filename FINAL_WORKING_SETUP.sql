-- ============================================
-- FINAL WORKING DATABASE SETUP
-- This version handles duplicate usernames
-- ============================================

-- ============================================
-- STEP 1: FORCE DROP EVERYTHING
-- ============================================

DROP TABLE IF EXISTS public.leaderboard_entries CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.game_sessions CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.levels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================
-- STEP 2: CREATE PROFILES TABLE
-- ============================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    total_score INTEGER DEFAULT 0 NOT NULL,
    total_snacks_collected INTEGER DEFAULT 0 NOT NULL,
    total_loops_completed INTEGER DEFAULT 0 NOT NULL,
    total_play_time INTEGER DEFAULT 0 NOT NULL,
    highest_level INTEGER DEFAULT 1 NOT NULL,
    current_level INTEGER DEFAULT 1 NOT NULL,
    experience_points INTEGER DEFAULT 0 NOT NULL,
    rank TEXT DEFAULT 'Rookie Raccoon' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_played_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- STEP 3: CREATE OTHER TABLES
-- ============================================

CREATE TABLE public.levels (
    id SERIAL PRIMARY KEY,
    level_number INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert', 'master')),
    time_limit INTEGER NOT NULL,
    snacks_required INTEGER NOT NULL,
    npc_count INTEGER NOT NULL,
    npc_speed DECIMAL(3,2) DEFAULT 1.0,
    detection_sensitivity DECIMAL(3,2) DEFAULT 1.0,
    layout_data JSONB,
    unlock_requirement INTEGER,
    experience_reward INTEGER DEFAULT 100 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE public.achievements (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    category TEXT NOT NULL CHECK (category IN ('collection', 'stealth', 'speed', 'mastery', 'special')),
    requirement_type TEXT NOT NULL,
    requirement_value INTEGER,
    points INTEGER DEFAULT 10 NOT NULL,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id INTEGER REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    progress INTEGER DEFAULT 0,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level_id INTEGER REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
    best_score INTEGER DEFAULT 0 NOT NULL,
    best_time INTEGER,
    attempts INTEGER DEFAULT 0 NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    stars INTEGER DEFAULT 0 NOT NULL,
    unlocked BOOLEAN DEFAULT FALSE NOT NULL,
    first_completed_at TIMESTAMP WITH TIME ZONE,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, level_id)
);

CREATE TABLE public.game_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level_id INTEGER REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
    score INTEGER DEFAULT 0 NOT NULL,
    snacks_collected INTEGER DEFAULT 0 NOT NULL,
    time_taken INTEGER,
    loops_completed INTEGER DEFAULT 0 NOT NULL,
    detection_count INTEGER DEFAULT 0 NOT NULL,
    perfect_stealth BOOLEAN DEFAULT FALSE NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    session_data JSONB
);

CREATE TABLE public.leaderboard_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level_id INTEGER REFERENCES public.levels(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL,
    snacks_collected INTEGER NOT NULL,
    time_taken INTEGER NOT NULL,
    perfect_stealth BOOLEAN DEFAULT FALSE NOT NULL,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, level_id)
);

-- ============================================
-- STEP 4: DISABLE RLS
-- ============================================

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: INSERT LEVELS
-- ============================================

INSERT INTO public.levels (level_number, name, difficulty, time_limit, snacks_required, npc_count, experience_reward) VALUES
(1, 'Kitchen Basics', 'easy', 90, 5, 2, 50),
(2, 'Night Shift', 'easy', 80, 6, 2, 75),
(3, 'Morning Rush', 'medium', 70, 7, 3, 100),
(4, 'Dinner Party', 'medium', 65, 8, 3, 125),
(5, 'Security Upgrade', 'medium', 60, 9, 4, 150),
(6, 'Chef''s Special', 'hard', 55, 10, 4, 200),
(7, 'Holiday Feast', 'hard', 50, 12, 5, 250),
(8, 'Stealth Master', 'hard', 45, 12, 5, 300),
(9, 'Time Trial', 'expert', 40, 15, 6, 400),
(10, 'Legendary Heist', 'master', 35, 15, 7, 500);

-- ============================================
-- STEP 6: INSERT ACHIEVEMENTS
-- ============================================

INSERT INTO public.achievements (code, name, description, icon, points, category, requirement_type, requirement_value, rarity) VALUES
('first_snack', 'First Snack', 'Collect your first snack', '🍪', 10, 'collection', 'snacks_collected', 1, 'common'),
('snack_collector', 'Snack Collector', 'Collect 50 total snacks', '🎯', 25, 'collection', 'snacks_collected', 50, 'common'),
('snack_hoarder', 'Snack Hoarder', 'Collect 200 total snacks', '🏪', 50, 'collection', 'snacks_collected', 200, 'rare'),
('snack_master', 'Snack Master', 'Collect 500 total snacks', '👑', 100, 'collection', 'snacks_collected', 500, 'epic'),
('legendary_collector', 'Legendary Collector', 'Collect 1000 total snacks', '💎', 200, 'collection', 'snacks_collected', 1000, 'legendary'),
('first_loop', 'First Loop', 'Complete your first time loop', '🔄', 10, 'mastery', 'loops_completed', 1, 'common'),
('loop_veteran', 'Loop Veteran', 'Complete 100 time loops', '🏆', 150, 'mastery', 'loops_completed', 100, 'epic'),
('ghost', 'Ghost', 'Complete a level with perfect stealth', '👻', 50, 'stealth', 'perfect_stealth', 1, 'rare'),
('speed_demon', 'Speed Demon', 'Complete a level in under 30 seconds', '⚡', 75, 'speed', 'time_taken', 30, 'rare'),
('perfect_stealth', 'Perfect Stealth', 'Complete 10 levels without being detected', '🌟', 100, 'stealth', 'perfect_stealth', 10, 'epic'),
('master_thief', 'Master Thief', 'Complete all levels with 3 stars', '🦝', 250, 'mastery', 'three_stars', 10, 'legendary'),
('time_lord', 'Time Lord', 'Master the time loop mechanics', '⏰', 100, 'mastery', 'loops_completed', 50, 'epic'),
('completionist', 'Completionist', 'Complete all levels', '✨', 200, 'mastery', 'levels_completed', 10, 'legendary'),
('no_detection', 'Invisible', 'Never get detected in 5 consecutive levels', '🎭', 125, 'stealth', 'perfect_stealth', 5, 'epic'),
('quick_hands', 'Quick Hands', 'Collect 10 snacks in under 20 seconds', '🤲', 50, 'speed', 'quick_collect', 10, 'rare'),
('night_owl', 'Night Owl', 'Play 50 games', '🦉', 75, 'special', 'games_played', 50, 'rare'),
('trash_panda_elite', 'Trash Panda Elite', 'Reach max rank', '🔥', 300, 'mastery', 'rank_achieved', 6, 'legendary');

-- ============================================
-- STEP 7: CREATE PROFILES FOR EXISTING USERS
-- (Handles duplicate usernames by adding numbers)
-- ============================================

INSERT INTO public.profiles (
  id,
  username,
  display_name,
  total_score,
  total_snacks_collected,
  total_loops_completed,
  total_play_time,
  highest_level,
  current_level,
  experience_points,
  rank,
  created_at,
  updated_at
)
SELECT 
  u.id,
  -- Generate unique username by adding row number if duplicate
  COALESCE(
    u.raw_user_meta_data->>'username',
    'user_' || substr(u.id::text, 1, 8)
  ) || CASE 
    WHEN COUNT(*) OVER (PARTITION BY COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8))) > 1
    THEN '_' || ROW_NUMBER() OVER (PARTITION BY COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8)) ORDER BY u.created_at)
    ELSE ''
  END as username,
  COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'username', 'Player'),
  0,
  0,
  0,
  0,
  1,
  1,
  0,
  'Rookie Raccoon',
  u.created_at,
  NOW()
FROM auth.users u;

-- ============================================
-- STEP 8: UNLOCK LEVEL 1 FOR ALL USERS
-- ============================================

INSERT INTO public.user_progress (
  user_id,
  level_id,
  unlocked,
  attempts,
  best_score,
  completed,
  stars
)
SELECT 
  p.id as user_id,
  l.id as level_id,
  true as unlocked,
  0 as attempts,
  0 as best_score,
  false as completed,
  0 as stars
FROM public.profiles p
CROSS JOIN public.levels l
WHERE l.level_number = 1;

-- ============================================
-- STEP 9: CREATE AUTO-PROFILE TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_username TEXT;
  v_counter INTEGER := 0;
BEGIN
  -- Generate base username
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8));
  
  -- Check if username exists and add number if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) LOOP
    v_counter := v_counter + 1;
    v_username := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)) || '_' || v_counter;
  END LOOP;
  
  -- Insert profile
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    total_score,
    total_snacks_collected,
    total_loops_completed,
    total_play_time,
    highest_level,
    current_level,
    experience_points,
    rank,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', 'Player'),
    0, 0, 0, 0, 1, 1, 0,
    'Rookie Raccoon',
    NOW(),
    NOW()
  );
  
  -- Unlock level 1
  INSERT INTO public.user_progress (user_id, level_id, unlocked, attempts, best_score, completed, stars)
  SELECT NEW.id, id, true, 0, 0, false, 0
  FROM public.levels
  WHERE level_number = 1;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 10: GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================
-- STEP 11: VERIFICATION
-- ============================================

DO $$
DECLARE
  v_profiles INTEGER;
  v_levels INTEGER;
  v_achievements INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_profiles FROM public.profiles;
  SELECT COUNT(*) INTO v_levels FROM public.levels;
  SELECT COUNT(*) INTO v_achievements FROM public.achievements;

  RAISE NOTICE '';
  RAISE NOTICE '✅ DATABASE SETUP COMPLETE';
  RAISE NOTICE 'Profiles: %', v_profiles;
  RAISE NOTICE 'Levels: %', v_levels;
  RAISE NOTICE 'Achievements: %', v_achievements;
  RAISE NOTICE '';
  RAISE NOTICE 'Refresh browser and log in!';
END $$;
