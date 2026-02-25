-- MINIMAL FIX - Just get the game working
-- Run this in Supabase SQL Editor

-- 1. Insert just 3 levels to start
INSERT INTO levels (level_number, name, difficulty, time_limit, snacks_required, npc_count, experience_reward) VALUES
(1, 'Level 1', 'easy', 90, 5, 2, 50),
(2, 'Level 2', 'easy', 80, 6, 2, 75),
(3, 'Level 3', 'medium', 70, 7, 3, 100)
ON CONFLICT (level_number) DO NOTHING;

-- 2. Insert just 3 basic achievements
INSERT INTO achievements (code, name, description, icon, points, category, requirement_type, requirement_value, rarity) VALUES
('first_snack', 'First Snack', 'Collect your first snack', '🍪', 10, 'collection', 'snacks_collected', 1, 'common'),
('first_loop', 'First Loop', 'Complete your first level', '🔄', 10, 'mastery', 'loops_completed', 1, 'common'),
('ghost', 'Ghost', 'Perfect stealth', '👻', 50, 'stealth', 'perfect_stealth', 1, 'rare')
ON CONFLICT (code) DO NOTHING;

-- 3. Verify
SELECT COUNT(*) as level_count FROM levels;
SELECT COUNT(*) as achievement_count FROM achievements;
