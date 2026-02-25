-- Insert 17 achievements
INSERT INTO achievements (code, name, description, icon, points, category) VALUES
('first_snack', 'First Snack', 'Collect your first snack', '🍪', 10, 'collection'),
('snack_collector', 'Snack Collector', 'Collect 50 total snacks', '🎯', 25, 'collection'),
('snack_hoarder', 'Snack Hoarder', 'Collect 200 total snacks', '🏪', 50, 'collection'),
('snack_master', 'Snack Master', 'Collect 500 total snacks', '👑', 100, 'collection'),
('legendary_collector', 'Legendary Collector', 'Collect 1000 total snacks', '💎', 200, 'collection'),
('first_loop', 'First Loop', 'Complete your first time loop', '🔄', 10, 'progression'),
('loop_veteran', 'Loop Veteran', 'Complete 100 time loops', '🏆', 150, 'progression'),
('ghost', 'Ghost', 'Complete a level with perfect stealth', '👻', 50, 'stealth'),
('speed_demon', 'Speed Demon', 'Complete a level in under 30 seconds', '⚡', 75, 'speed'),
('perfect_stealth', 'Perfect Stealth', 'Complete 10 levels without being detected', '🌟', 100, 'stealth'),
('master_thief', 'Master Thief', 'Complete all levels with 3 stars', '🦝', 250, 'mastery'),
('time_lord', 'Time Lord', 'Master the time loop mechanics', '⏰', 100, 'mastery'),
('completionist', 'Completionist', 'Complete all levels', '✨', 200, 'progression'),
('no_detection', 'Invisible', 'Never get detected in 5 consecutive levels', '🎭', 125, 'stealth'),
('quick_hands', 'Quick Hands', 'Collect 10 snacks in under 20 seconds', '🤲', 50, 'speed'),
('night_owl', 'Night Owl', 'Play 50 games', '🦉', 75, 'dedication'),
('trash_panda_elite', 'Trash Panda Elite', 'Reach max rank', '🔥', 300, 'mastery')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  points = EXCLUDED.points,
  category = EXCLUDED.category;
