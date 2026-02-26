-- ============================================
-- SIMPLE FIX - Run this if the complete script failed
-- ============================================

-- First, let's see what exists
DO $$
BEGIN
  RAISE NOTICE 'Checking current state...';
END $$;

-- Check if profiles table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles')
    THEN 'profiles table EXISTS'
    ELSE 'profiles table MISSING'
  END as status;

-- If you see "profiles table EXISTS", the DROP didn't work
-- Let's force drop everything with CASCADE

DROP TABLE IF EXISTS public.leaderboard_entries CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.game_sessions CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.levels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Now verify they're gone
SELECT 
  COUNT(*) as remaining_tables,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All tables dropped successfully'
    ELSE '❌ Some tables still exist'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'levels', 'achievements', 'user_achievements', 'user_progress', 'game_sessions', 'leaderboard_entries');

-- If you see "✅ All tables dropped successfully", 
-- NOW run the COMPLETE_DATABASE_RESET_AND_SETUP.sql script again
