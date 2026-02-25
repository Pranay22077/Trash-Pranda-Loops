-- ============================================
-- COMPLETE DATABASE RESET AND SETUP
-- Run this ENTIRE file in Supabase SQL Editor
-- This will fix everything in one go
-- ============================================

-- 1. DISABLE RLS TEMPORARILY
ALTER TABLE IF EXISTS user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS game_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;

-- 2. INSERT LEVELS (with ON CONFLICT to avoid duplicates)
INSERT INTO levels (level_number, name, difficulty, time_limit, snacks_required, npc_count, experience_reward) VALUES
(1, 'Kitchen Basics', 'easy', 90, 5, 2, 50),
(2, 'Night Shift', 'easy', 80, 6, 2, 75),
(3, 'Morning Rush', 'medium', 70, 7, 3, 100),
(4, 'Dinner Party', 'medium', 65, 8, 3, 125),
(5, 'Security Upgrade', 'medium', 60, 9, 4, 150),
(6, 'Chef Special', 'hard', 55, 10, 4, 200),
(7, 'Holiday Feast', 'hard', 50, 12, 5, 250),
(8, 'Stealth Master', 'hard', 45, 12, 5, 300),
(9, 'Time Trial', 'expert', 40, 15, 6, 400),
(10, 'Legendary Heist', 'master', 35, 15, 7, 500)
ON CONFLICT (level_number) DO UPDATE SET
  name = EXCLUDED.name,
  difficulty = EXCLUDED.difficulty,
  time_limit = EXCLUDED.time_limit,
  snacks_required = EXCLUDED.snacks_required,
  npc_count = EXCLUDED.npc_count,
  experience_reward = EXCLUDED.experience_reward;

-- 3. INSERT ACHIEVEMENTS
INSERT INTO achievements (code, name, description, icon, points, category, requirement_type, requirement_value, rarity) VALUES
('first_snack', 'First Snack', 'Collect your first snack', '🍪', 10, 'collection', 'snacks_collected', 1, 'common'),
('snack_collector', 'Snack Collector', 'Collect 50 total snacks', '🎯', 25, 'collection', 'snacks_collected', 50, 'common'),
('snack_hoarder', 'Snack Hoarder', 'Collect 200 total snacks', '🏪', 50, 'collection', 'snacks_collected', 200, 'rare'),
('snack_master', 'Snack Master', 'Collect 500 total snacks', '👑', 100, 'collection', 'snacks_collected', 500, 'epic'),
('legendary_collector', 'Legendary Collector', 'Collect 1000 total snacks', '💎', 200, 'collection', 'snacks_collected', 1000, 'legendary'),
('first_loop', 'First Loop', 'Complete your first time loop', '🔄', 10, 'mastery', 'loops_completed', 1, 'common'),
('loop_veteran', 'Loop Veteran', 'Complete 100 time loops', '🏆', 150, 'mastery', 'loops_completed', 100, 'epic'),
('ghost', 'Ghost', 'Complete a level with perfect stealth', '👻', 50, 'stealth', 'perfect_stealth', 1, 'rare'),
('speed_demon', 'Speed Demon', 'Complete a level in under 30 seconds', '⚡', 75, 'speed', 'time_taken', 30, 'rare'),
('perfect_stealth', 'Perfect Stealth', 'Complete 10 levels without being detected', '🌟', 100, 'stealth', 'perfect_stealth', 10, 'epic')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  points = EXCLUDED.points,
  category = EXCLUDED.category,
  requirement_type = EXCLUDED.requirement_type,
  requirement_value = EXCLUDED.requirement_value,
  rarity = EXCLUDED.rarity;

-- 4. UNLOCK ALL LEVELS FOR ALL USERS (for testing)
-- This will work for any user who is logged in
DO $$
DECLARE
    user_record RECORD;
    level_record RECORD;
BEGIN
    -- For each user in profiles
    FOR user_record IN SELECT id FROM profiles LOOP
        -- For each level
        FOR level_record IN SELECT id FROM levels LOOP
            -- Insert or update user_progress
            INSERT INTO user_progress (user_id, level_id, unlocked, attempts, best_score)
            VALUES (user_record.id, level_record.id, true, 0, 0)
            ON CONFLICT (user_id, level_id) 
            DO UPDATE SET unlocked = true;
        END LOOP;
    END LOOP;
END $$;

-- 5. VERIFICATION
SELECT 
    'Levels' as table_name, 
    COUNT(*) as count 
FROM levels
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'User Progress', COUNT(*) FROM user_progress
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles;

-- 6. SHOW UNLOCKED LEVELS FOR CURRENT USER
SELECT 
    l.level_number,
    l.name,
    l.difficulty,
    COALESCE(up.unlocked, false) as unlocked
FROM levels l
LEFT JOIN user_progress up ON l.id = up.level_id AND up.user_id = auth.uid()
ORDER BY l.level_number;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ DATABASE SETUP COMPLETE!';
    RAISE NOTICE '✅ 10 levels inserted';
    RAISE NOTICE '✅ 10 achievements inserted';
    RAISE NOTICE '✅ All levels unlocked for all users';
    RAISE NOTICE '✅ RLS disabled for testing';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 NOW: Refresh your browser (Ctrl+R)';
    RAISE NOTICE '🎮 All 10 levels should be unlocked and playable!';
END $$;
