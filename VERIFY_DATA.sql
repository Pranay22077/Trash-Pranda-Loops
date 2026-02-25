-- Check what's actually in the database

-- 1. How many levels exist?
SELECT COUNT(*) as total_levels FROM levels;

-- 2. Show all levels
SELECT level_number, name, difficulty FROM levels ORDER BY level_number;

-- 3. How many achievements exist?
SELECT COUNT(*) as total_achievements FROM achievements;

-- 4. Show all achievements
SELECT code, name, points FROM achievements ORDER BY points;

-- 5. Check your user progress
SELECT 
    l.level_number,
    l.name,
    up.unlocked,
    up.completed,
    up.best_score
FROM user_progress up
JOIN levels l ON up.level_id = l.id
WHERE up.user_id = auth.uid()
ORDER BY l.level_number;

-- 6. Check if level 2 exists and what its ID is
SELECT id, level_number, name FROM levels WHERE level_number = 2;
