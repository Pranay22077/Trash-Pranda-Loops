-- TEMPORARY: Disable RLS to test
-- This makes user_progress readable by everyone (not secure for production!)

ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_progress';
