-- Debug: Check if user_progress data is accessible

-- 1. Check your user ID
SELECT auth.uid() as my_user_id;

-- 2. Check user_progress table directly
SELECT * FROM user_progress WHERE user_id = auth.uid();

-- 3. Check RLS policies on user_progress
SELECT * FROM pg_policies WHERE tablename = 'user_progress';

-- 4. Try to read with explicit user check
SELECT 
    up.*,
    l.level_number,
    l.name
FROM user_progress up
JOIN levels l ON up.level_id = l.id
WHERE up.user_id = auth.uid()
ORDER BY l.level_number;
