-- ============================================
-- MULTI-USER TEST SCRIPT
-- Run this to verify everything is working
-- ============================================

-- ============================================
-- 1. VERIFY FUNCTIONS EXIST
-- ============================================
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM information_schema.routines
  WHERE routine_schema = 'public'
    AND routine_name IN (
      'increment_profile_stats',
      'update_level_progress_atomic',
      'unlock_achievement_safe'
    );

  IF v_count = 3 THEN
    RAISE NOTICE '✅ All 3 functions exist';
  ELSE
    RAISE WARNING '❌ Missing functions! Found % of 3', v_count;
  END IF;
END $$;

-- ============================================
-- 2. VERIFY INDEXES EXIST
-- ============================================
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%';

  IF v_count >= 10 THEN
    RAISE NOTICE '✅ Performance indexes created (% indexes)', v_count;
  ELSE
    RAISE WARNING '❌ Missing indexes! Found only %', v_count;
  END IF;
END $$;

-- ============================================
-- 3. VERIFY RLS POLICIES
-- ============================================
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM pg_policies
  WHERE schemaname = 'public';

  IF v_count >= 10 THEN
    RAISE NOTICE '✅ RLS policies configured (% policies)', v_count;
  ELSE
    RAISE WARNING '⚠️  Only % RLS policies found', v_count;
  END IF;
END $$;

-- ============================================
-- 4. VERIFY TABLES EXIST
-- ============================================
DO $$
DECLARE
  v_tables TEXT[];
  v_missing TEXT[];
BEGIN
  v_tables := ARRAY[
    'profiles',
    'levels',
    'achievements',
    'user_achievements',
    'user_progress',
    'game_sessions',
    'leaderboard_entries'
  ];

  SELECT ARRAY_AGG(t)
  INTO v_missing
  FROM UNNEST(v_tables) AS t
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = t
  );

  IF v_missing IS NULL THEN
    RAISE NOTICE '✅ All required tables exist';
  ELSE
    RAISE WARNING '❌ Missing tables: %', v_missing;
  END IF;
END $$;

-- ============================================
-- 5. TEST ATOMIC FUNCTION (SAFE TEST)
-- ============================================
DO $$
DECLARE
  v_test_user_id UUID;
  v_result profiles;
BEGIN
  -- Get first user or skip if no users
  SELECT id INTO v_test_user_id FROM profiles LIMIT 1;

  IF v_test_user_id IS NULL THEN
    RAISE NOTICE '⚠️  No users to test with (this is OK for new database)';
    RETURN;
  END IF;

  -- Test increment function (adds 0 to everything, safe test)
  SELECT * INTO v_result
  FROM increment_profile_stats(
    v_test_user_id,
    0, 0, 0, 0, 0, 0
  );

  IF v_result IS NOT NULL THEN
    RAISE NOTICE '✅ increment_profile_stats function works';
  ELSE
    RAISE WARNING '❌ increment_profile_stats function failed';
  END IF;
END $$;

-- ============================================
-- 6. CHECK DATA INTEGRITY
-- ============================================
DO $$
DECLARE
  v_profile_count INTEGER;
  v_level_count INTEGER;
  v_achievement_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_profile_count FROM profiles;
  SELECT COUNT(*) INTO v_level_count FROM levels;
  SELECT COUNT(*) INTO v_achievement_count FROM achievements;

  RAISE NOTICE '';
  RAISE NOTICE '📊 DATABASE STATISTICS:';
  RAISE NOTICE '   Users: %', v_profile_count;
  RAISE NOTICE '   Levels: %', v_level_count;
  RAISE NOTICE '   Achievements: %', v_achievement_count;

  IF v_level_count < 10 THEN
    RAISE WARNING '⚠️  Expected 10 levels, found %', v_level_count;
  END IF;

  IF v_achievement_count < 17 THEN
    RAISE WARNING '⚠️  Expected 17 achievements, found %', v_achievement_count;
  END IF;
END $$;

-- ============================================
-- 7. CHECK FOR DUPLICATE ACHIEVEMENTS
-- ============================================
DO $$
DECLARE
  v_duplicates INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_duplicates
  FROM (
    SELECT user_id, achievement_id, COUNT(*)
    FROM user_achievements
    GROUP BY user_id, achievement_id
    HAVING COUNT(*) > 1
  ) AS dupes;

  IF v_duplicates = 0 THEN
    RAISE NOTICE '✅ No duplicate achievements';
  ELSE
    RAISE WARNING '❌ Found % duplicate achievements!', v_duplicates;
  END IF;
END $$;

-- ============================================
-- 8. PERFORMANCE CHECK
-- ============================================
DO $$
DECLARE
  v_start TIMESTAMP;
  v_end TIMESTAMP;
  v_duration INTERVAL;
BEGIN
  v_start := clock_timestamp();
  
  -- Simulate leaderboard query
  PERFORM *
  FROM profiles
  ORDER BY total_score DESC
  LIMIT 100;
  
  v_end := clock_timestamp();
  v_duration := v_end - v_start;

  IF v_duration < INTERVAL '100 milliseconds' THEN
    RAISE NOTICE '✅ Leaderboard query fast: %', v_duration;
  ELSE
    RAISE WARNING '⚠️  Leaderboard query slow: %', v_duration;
  END IF;
END $$;

-- ============================================
-- 9. FINAL SUMMARY
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '  MULTI-USER SETUP VERIFICATION';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'If you see all ✅ above, you are ready!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Disable email confirmation in Auth settings';
  RAISE NOTICE '2. Enable connection pooling in Database settings';
  RAISE NOTICE '3. Enable Realtime for profiles table';
  RAISE NOTICE '4. Deploy updated code to Vercel';
  RAISE NOTICE '5. Test with multiple users';
  RAISE NOTICE '';
END $$;

-- ============================================
-- 10. DETAILED DIAGNOSTICS (OPTIONAL)
-- ============================================

-- List all functions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%profile%' OR routine_name LIKE '%achievement%'
ORDER BY routine_name;

-- List all indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- List all RLS policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
