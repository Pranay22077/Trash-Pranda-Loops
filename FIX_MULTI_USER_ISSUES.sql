-- ============================================
-- FIX MULTI-USER RACE CONDITIONS AND PERFORMANCE
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ATOMIC PROFILE STATS UPDATE FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION increment_profile_stats(
  p_user_id UUID,
  p_score INTEGER DEFAULT 0,
  p_snacks INTEGER DEFAULT 0,
  p_loops INTEGER DEFAULT 0,
  p_play_time INTEGER DEFAULT 0,
  p_level INTEGER DEFAULT 0,
  p_xp INTEGER DEFAULT 0
)
RETURNS profiles AS $$
DECLARE
  v_profile profiles;
  v_new_xp INTEGER;
  v_new_rank TEXT;
BEGIN
  -- Atomic update with increments (prevents race conditions)
  UPDATE profiles
  SET
    total_score = total_score + p_score,
    total_snacks_collected = total_snacks_collected + p_snacks,
    total_loops_completed = total_loops_completed + p_loops,
    total_play_time = total_play_time + p_play_time,
    highest_level = GREATEST(highest_level, p_level),
    experience_points = experience_points + p_xp,
    last_played_at = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING * INTO v_profile;

  -- Calculate and update rank if XP changed
  IF p_xp > 0 THEN
    v_new_xp := v_profile.experience_points;
    v_new_rank := CASE
      WHEN v_new_xp >= 10000 THEN 'Legendary Heist Master'
      WHEN v_new_xp >= 5000 THEN 'Trash Panda Elite'
      WHEN v_new_xp >= 3000 THEN 'Shadow Legend'
      WHEN v_new_xp >= 1500 THEN 'Master Thief'
      WHEN v_new_xp >= 500 THEN 'Sneaky Bandit'
      ELSE 'Rookie Raccoon'
    END;

    UPDATE profiles
    SET rank = v_new_rank
    WHERE id = p_user_id
    RETURNING * INTO v_profile;
  END IF;

  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. ATOMIC LEVEL PROGRESS UPDATE FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_level_progress_atomic(
  p_user_id UUID,
  p_level_id INTEGER,
  p_score INTEGER,
  p_time INTEGER,
  p_completed BOOLEAN,
  p_stars INTEGER
)
RETURNS user_progress AS $$
DECLARE
  v_progress user_progress;
BEGIN
  -- Upsert with atomic best score/time comparison
  INSERT INTO user_progress (
    user_id,
    level_id,
    best_score,
    best_time,
    attempts,
    completed,
    stars,
    unlocked,
    first_completed_at,
    last_played_at
  ) VALUES (
    p_user_id,
    p_level_id,
    p_score,
    p_time,
    1,
    p_completed,
    p_stars,
    true,
    CASE WHEN p_completed THEN NOW() ELSE NULL END,
    NOW()
  )
  ON CONFLICT (user_id, level_id) DO UPDATE SET
    best_score = GREATEST(user_progress.best_score, p_score),
    best_time = CASE
      WHEN user_progress.best_time IS NULL THEN p_time
      WHEN p_time IS NULL THEN user_progress.best_time
      ELSE LEAST(user_progress.best_time, p_time)
    END,
    attempts = user_progress.attempts + 1,
    completed = user_progress.completed OR p_completed,
    stars = GREATEST(user_progress.stars, p_stars),
    first_completed_at = COALESCE(
      user_progress.first_completed_at,
      CASE WHEN p_completed THEN NOW() ELSE NULL END
    ),
    last_played_at = NOW()
  RETURNING * INTO v_progress;

  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. SAFE ACHIEVEMENT UNLOCK FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION unlock_achievement_safe(
  p_user_id UUID,
  p_achievement_code TEXT
)
RETURNS user_achievements AS $$
DECLARE
  v_achievement_id INTEGER;
  v_user_achievement user_achievements;
BEGIN
  -- Get achievement ID
  SELECT id INTO v_achievement_id
  FROM achievements
  WHERE code = p_achievement_code;

  IF v_achievement_id IS NULL THEN
    RAISE EXCEPTION 'Achievement not found: %', p_achievement_code;
  END IF;

  -- Insert with conflict handling (prevents duplicates)
  INSERT INTO user_achievements (user_id, achievement_id, unlocked_at, progress)
  VALUES (p_user_id, v_achievement_id, NOW(), 100)
  ON CONFLICT (user_id, achievement_id) DO NOTHING
  RETURNING * INTO v_user_achievement;

  RETURN v_user_achievement;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. PERFORMANCE INDEXES
-- ============================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_total_score 
  ON profiles(total_score DESC);
  
CREATE INDEX IF NOT EXISTS idx_profiles_username 
  ON profiles(username);
  
CREATE INDEX IF NOT EXISTS idx_profiles_last_played 
  ON profiles(last_played_at DESC);

-- Game sessions indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id 
  ON game_sessions(user_id);
  
CREATE INDEX IF NOT EXISTS idx_game_sessions_level_id 
  ON game_sessions(level_id);
  
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed 
  ON game_sessions(completed, completed_at DESC);

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id 
  ON user_progress(user_id);
  
CREATE INDEX IF NOT EXISTS idx_user_progress_level_id 
  ON user_progress(level_id);
  
CREATE INDEX IF NOT EXISTS idx_user_progress_composite 
  ON user_progress(user_id, level_id);

-- User achievements indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id 
  ON user_achievements(user_id);
  
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id 
  ON user_achievements(achievement_id);

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_level_score 
  ON leaderboard_entries(level_id, score DESC);
  
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_user 
  ON leaderboard_entries(user_id);

-- ============================================
-- 5. RLS POLICIES (ENSURE PROPER ACCESS)
-- ============================================

-- Profiles: Users can read all profiles (for leaderboard)
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Profiles: Users can update only their own
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Levels: Anyone can read (public data)
DROP POLICY IF EXISTS "Anyone can view levels" ON public.levels;
CREATE POLICY "Anyone can view levels"
  ON public.levels FOR SELECT
  TO authenticated
  USING (true);

-- Achievements: Anyone can read (public data)
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (true);

-- User Progress: Users can read their own
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User Progress: Users can insert their own
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Progress: Users can update their own
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Achievements: Users can read their own
DROP POLICY IF EXISTS "Users can view own achievements" ON public.user_achievements;
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User Achievements: Users can insert their own
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Game Sessions: Users can manage their own
DROP POLICY IF EXISTS "Users can view own sessions" ON public.game_sessions;
CREATE POLICY "Users can view own sessions"
  ON public.game_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.game_sessions;
CREATE POLICY "Users can insert own sessions"
  ON public.game_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON public.game_sessions;
CREATE POLICY "Users can update own sessions"
  ON public.game_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Leaderboard: Anyone can read
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON public.leaderboard_entries;
CREATE POLICY "Anyone can view leaderboard"
  ON public.leaderboard_entries FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 6. GRANT EXECUTE PERMISSIONS ON FUNCTIONS
-- ============================================

GRANT EXECUTE ON FUNCTION increment_profile_stats TO authenticated;
GRANT EXECUTE ON FUNCTION update_level_progress_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION unlock_achievement_safe TO authenticated;

-- ============================================
-- 7. VERIFICATION QUERIES
-- ============================================

-- Check indexes were created
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'game_sessions', 'user_progress', 'user_achievements', 'leaderboard_entries')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check functions were created
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('increment_profile_stats', 'update_level_progress_atomic', 'unlock_achievement_safe');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Multi-user fixes applied successfully!';
  RAISE NOTICE '✅ Atomic functions created';
  RAISE NOTICE '✅ Performance indexes added';
  RAISE NOTICE '✅ RLS policies configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update your TypeScript code to use the new RPC functions';
  RAISE NOTICE '2. Enable connection pooling in Supabase dashboard';
  RAISE NOTICE '3. Test with multiple simultaneous users';
END $$;
