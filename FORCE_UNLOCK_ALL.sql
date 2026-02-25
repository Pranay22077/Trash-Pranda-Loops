-- FORCE UNLOCK ALL LEVELS FOR ALL USERS
-- This will work regardless of login status

-- First, make sure you have a profile
-- (This creates one if you don't)
INSERT INTO profiles (id, username, display_name)
SELECT 
    id,
    COALESCE(email, 'user_' || id::text),
    COALESCE(email, 'User')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Now unlock ALL levels for ALL users in profiles table
INSERT INTO user_progress (user_id, level_id, unlocked, attempts, best_score, best_time, completed, stars)
SELECT 
    p.id as user_id,
    l.id as level_id,
    true as unlocked,
    0 as attempts,
    0 as best_score,
    NULL as best_time,
    false as completed,
    0 as stars
FROM profiles p
CROSS JOIN levels l
ON CONFLICT (user_id, level_id) 
DO UPDATE SET 
    unlocked = true;

-- Verify: Show all user progress
SELECT 
    p.username,
    l.level_number,
    l.name,
    up.unlocked
FROM user_progress up
JOIN profiles p ON up.user_id = p.id
JOIN levels l ON up.level_id = l.id
ORDER BY p.username, l.level_number;

-- Count unlocked levels per user
SELECT 
    p.username,
    COUNT(*) as total_levels,
    SUM(CASE WHEN up.unlocked THEN 1 ELSE 0 END) as unlocked_levels
FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
GROUP BY p.username;
