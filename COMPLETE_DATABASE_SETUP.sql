-- ============================================
-- TRASH PANDA LOOPS - COMPLETE DATABASE SETUP
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- This will populate all levels and achievements
-- ============================================

-- ============================================
-- 1. INSERT 10 LEVELS
-- ============================================
INSERT INTO levels (level_number, name, difficulty, time_limit, snacks_required, npc_count, experience_reward) VALUES
(1, 'Kitchen Basics', 'easy', 90, 5, 2, 50),
(2, 'Night Shift', 'easy', 80, 6, 2, 75),
(3, 'Morning Rush', 'medium', 70, 7, 3, 100),
(4, 'Dinner Party', 'medium', 65, 8, 3, 125),
(5, 'Security Upgrade', 'medium', 60, 9, 4, 150),
(6, 'Chef''s Special', 'hard', 55, 10, 4, 200),
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

-- ============================================
-- 2. INSERT 17 ACHIEVEMENTS
-- ============================================
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
('perfect_stealth', 'Perfect Stealth', 'Complete 10 levels without being detected', '🌟', 100, 'stealth', 'perfect_stealth', 10, 'epic'),
('master_thief', 'Master Thief', 'Complete all levels with 3 stars', '🦝', 250, 'mastery', 'three_stars', 10, 'legendary'),
('time_lord', 'Time Lord', 'Master the time loop mechanics', '⏰', 100, 'mastery', 'loops_completed', 50, 'epic'),
('completionist', 'Completionist', 'Complete all levels', '✨', 200, 'mastery', 'levels_completed', 10, 'legendary'),
('no_detection', 'Invisible', 'Never get detected in 5 consecutive levels', '🎭', 125, 'stealth', 'perfect_stealth', 5, 'epic'),
('quick_hands', 'Quick Hands', 'Collect 10 snacks in under 20 seconds', '🤲', 50, 'speed', 'quick_collect', 10, 'rare'),
('night_owl', 'Night Owl', 'Play 50 games', '🦉', 75, 'special', 'games_played', 50, 'rare'),
('trash_panda_elite', 'Trash Panda Elite', 'Reach max rank', '🔥', 300, 'mastery', 'rank_achieved', 6, 'legendary')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  points = EXCLUDED.points,
  category = EXCLUDED.category,
  requirement_type = EXCLUDED.requirement_type,
  requirement_value = EXCLUDED.requirement_value,
  rarity = EXCLUDED.rarity;

-- ============================================
-- 3. UNLOCK LEVEL 1 FOR ALL EXISTING USERS
-- ============================================
INSERT INTO user_progress (user_id, level_id, unlocked, attempts, best_score)
SELECT 
  p.id as user_id,
  l.id as level_id,
  true as unlocked,
  0 as attempts,
  0 as best_score
FROM profiles p
CROSS JOIN levels l
WHERE l.level_number = 1
ON CONFLICT (user_id, level_id) DO UPDATE SET unlocked = true;

-- ============================================
-- 4. VERIFICATION QUERIES
-- ============================================
-- Check levels were inserted
SELECT 
  level_number, 
  name, 
  difficulty, 
  time_limit, 
  experience_reward 
FROM levels 
ORDER BY level_number;

-- Check achievements were inserted
SELECT 
  code, 
  name, 
  points, 
  category 
FROM achievements 
ORDER BY points;

-- Count records
SELECT 
  (SELECT COUNT(*) FROM levels) as total_levels,
  (SELECT COUNT(*) FROM achievements) as total_achievements,
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM user_progress WHERE unlocked = true) as unlocked_levels;

-- ============================================
-- EXPECTED RESULTS:
-- - 10 levels (level_number 1-10)
-- - 17 achievements
-- - All existing users have level 1 unlocked
-- ============================================

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE '✅ 10 levels inserted';
  RAISE NOTICE '✅ 17 achievements inserted';
  RAISE NOTICE '✅ Level 1 unlocked for all users';
  RAISE NOTICE '';
  RAISE NOTICE '🎮 You can now:';
  RAISE NOTICE '   - Select from 10 levels';
  RAISE NOTICE '   - Earn 17 achievements';
  RAISE NOTICE '   - Progress through levels';
  RAISE NOTICE '   - Earn XP and rank up';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Refresh your browser to see changes!';
END $$;
