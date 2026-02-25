# CRITICAL: Database Setup Required

## The Problem
The database tables are EMPTY! No levels, no achievements exist yet.

## Solution: Run These SQL Commands in Supabase

### Step 1: Go to Supabase SQL Editor
1. Open https://supabase.com/dashboard/project/kfkxhlcolwqpwjnmklma/sql/new
2. You should see the SQL Editor

### Step 2: Insert Levels (Copy & Run This)

```sql
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
```

### Step 3: Insert Achievements (Copy & Run This)

```sql
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
```

### Step 4: Verify Data Was Inserted

```sql
-- Check levels
SELECT level_number, name, difficulty, time_limit, xp_reward FROM levels ORDER BY level_number;

-- Check achievements  
SELECT code, name, points, category FROM achievements ORDER BY points;

-- Count records
SELECT 
  (SELECT COUNT(*) FROM levels) as level_count,
  (SELECT COUNT(*) FROM achievements) as achievement_count;
```

You should see:
- ✅ 10 levels (1-10)
- ✅ 17 achievements

### Step 5: Unlock Level 1 for Existing Users

```sql
-- Automatically unlock level 1 for all existing users
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
```

## After Running These Commands

1. Refresh the website (http://localhost:5173)
2. Click "Select Level" - you should see 10 levels
3. Level 1 should be unlocked
4. Click "Achievements" - you should see 17 achievements
5. Play level 1 and complete it
6. Level 2 should unlock automatically

## What Was Fixed in Code

1. ✅ LevelSelector now auto-unlocks level 1 for logged-in users
2. ✅ Achievement unlocking wrapped in try-catch (won't break if achievement missing)
3. ✅ Better error messages showing what actually failed
4. ✅ unlockNextLevel handles edge cases properly
5. ✅ Level progression works correctly

## If Still Having Issues

Check browser console (F12) for error messages. The new error handling will show exactly what's failing.
