-- Run this to check what's actually in your database

-- Check if tables exist
SELECT 
  'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'levels', COUNT(*) FROM levels
UNION ALL
SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'user_progress', COUNT(*) FROM user_progress
UNION ALL
SELECT 'game_sessions', COUNT(*) FROM game_sessions;

-- Check levels structure
SELECT * FROM levels LIMIT 1;

-- Check achievements structure  
SELECT * FROM achievements LIMIT 1;

-- Check if you're logged in
SELECT id, username, email FROM auth.users;
