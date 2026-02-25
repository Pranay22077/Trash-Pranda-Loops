-- Insert 10 levels with varying difficulty
INSERT INTO levels (level_number, name, difficulty, time_limit, xp_reward, description) VALUES
(1, 'Kitchen Basics', 'easy', 90, 50, 'Learn the basics of sneaking and collecting snacks'),
(2, 'Night Shift', 'easy', 80, 75, 'The humans are asleep, but the dog is awake'),
(3, 'Morning Rush', 'medium', 70, 100, 'Navigate the busy morning kitchen'),
(4, 'Dinner Party', 'medium', 65, 125, 'Lots of snacks, but lots of guests too'),
(5, 'Security Upgrade', 'medium', 60, 150, 'They installed motion sensors'),
(6, 'Chef''s Special', 'hard', 55, 200, 'The professional chef is on duty'),
(7, 'Holiday Feast', 'hard', 50, 250, 'Maximum snacks, maximum danger'),
(8, 'Stealth Master', 'hard', 45, 300, 'Only the best can complete this'),
(9, 'Time Trial', 'expert', 40, 400, 'Speed and stealth combined'),
(10, 'Legendary Heist', 'master', 35, 500, 'The ultimate challenge for trash pandas')
ON CONFLICT (level_number) DO UPDATE SET
  name = EXCLUDED.name,
  difficulty = EXCLUDED.difficulty,
  time_limit = EXCLUDED.time_limit,
  xp_reward = EXCLUDED.xp_reward,
  description = EXCLUDED.description;
