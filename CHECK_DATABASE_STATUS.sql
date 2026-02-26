-- ============================================
-- CHECK DATABASE STATUS
-- Run this in Supabase SQL Editor to diagnose issues
-- ============================================

-- 1. Check if tables exist
SELECT 
  'Tables Check' as check_type,
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'levels', 
    'achievements',
    'user_achievements',
    'user_progress',
    'game_sessions',
    'leaderboard_entries'
  )
ORDER BY table_name;

-- 2. Check RLS status
SELECT 
  'RLS Status' as check_type,
  tablename as table_name,
  CASE 
    WHEN rowsecurity THEN '🔒 ENABLED (might block access)'
    ELSE '🔓 DISABLED'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'levels',
    'achievements', 
    'user_achievements',
    'user_progress',
    'game_sessions',
    'leaderboard_entries'
  )
ORDER BY tablename;

-- 3. Check if profile trigger exists
SELECT 
  'Trigger Check' as check_type,
  tgname as trigger_name,
  '✅ EXISTS' as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 4. Check if any users exist
SELECT 
  'User Count' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Users exist'
    ELSE '⚠️  No users yet'
  END as status
FROM auth.users;

-- 5. Check if any profiles exist
SELECT 
  'Profile Count' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Profiles exist'
    ELSE '⚠️  No profiles yet'
  END as status
FROM profiles;

-- 6. Check if levels are populated
SELECT 
  'Level Count' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ Levels populated'
    WHEN COUNT(*) > 0 THEN '⚠️  Some levels exist'
    ELSE '❌ No levels - run COMPLETE_DATABASE_SETUP.sql'
  END as status
FROM levels;

-- 7. Check if achievements are populated
SELECT 
  'Achievement Count' as check_type,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 17 THEN '✅ Achievements populated'
    WHEN COUNT(*) > 0 THEN '⚠️  Some achievements exist'
    ELSE '❌ No achievements - run COMPLETE_DATABASE_SETUP.sql'
  END as status
FROM achievements;

-- 8. Check RLS policies
SELECT 
  'RLS Policies' as check_type,
  tablename as table_name,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Has policies'
    ELSE '⚠️  No policies (might need to add)'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'levels',
    'achievements',
    'user_achievements',
    'user_progress',
    'game_sessions',
    'leaderboard_entries'
  )
GROUP BY tablename
ORDER BY tablename;

-- 9. Summary
DO $$
DECLARE
  v_table_count INTEGER;
  v_level_count INTEGER;
  v_achievement_count INTEGER;
  v_trigger_exists BOOLEAN;
BEGIN
  -- Count tables
  SELECT COUNT(*) INTO v_table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'profiles', 'levels', 'achievements',
      'user_achievements', 'user_progress',
      'game_sessions', 'leaderboard_entries'
    );

  -- Count levels
  SELECT COUNT(*) INTO v_level_count FROM levels;

  -- Count achievements
  SELECT COUNT(*) INTO v_achievement_count FROM achievements;

  -- Check trigger
  SELECT EXISTS(
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) INTO v_trigger_exists;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '  DATABASE STATUS SUMMARY';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '';
  
  IF v_table_count = 7 THEN
    RAISE NOTICE '✅ All 7 tables exist';
  ELSE
    RAISE NOTICE '❌ Missing tables! Found % of 7', v_table_count;
    RAISE NOTICE '   → Run COMPLETE_DATABASE_SETUP.sql';
  END IF;

  IF v_level_count >= 10 THEN
    RAISE NOTICE '✅ Levels populated (% levels)', v_level_count;
  ELSE
    RAISE NOTICE '❌ Levels not populated! Found % levels', v_level_count;
    RAISE NOTICE '   → Run COMPLETE_DATABASE_SETUP.sql';
  END IF;

  IF v_achievement_count >= 17 THEN
    RAISE NOTICE '✅ Achievements populated (% achievements)', v_achievement_count;
  ELSE
    RAISE NOTICE '❌ Achievements not populated! Found % achievements', v_achievement_count;
    RAISE NOTICE '   → Run COMPLETE_DATABASE_SETUP.sql';
  END IF;

  IF v_trigger_exists THEN
    RAISE NOTICE '✅ Profile creation trigger exists';
  ELSE
    RAISE NOTICE '❌ Profile creation trigger missing!';
    RAISE NOTICE '   → Run the trigger creation script';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. If tables/data missing: Run COMPLETE_DATABASE_SETUP.sql';
  RAISE NOTICE '2. If RLS blocking: Temporarily disable with ALTER TABLE ... DISABLE ROW LEVEL SECURITY';
  RAISE NOTICE '3. If trigger missing: Run trigger creation script';
  RAISE NOTICE '4. Disable email confirmation in Auth settings';
  RAISE NOTICE '';
END $$;
