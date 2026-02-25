-- Temporarily unlock all levels for testing
-- Run this to unlock all 10 levels for your user

INSERT INTO user_progress (user_id, level_id, unlocked, attempts, best_score)
SELECT 
    auth.uid() as user_id,
    l.id as level_id,
    true as unlocked,
    0 as attempts,
    0 as best_score
FROM levels l
ON CONFLICT (user_id, level_id) 
DO UPDATE SET unlocked = true;

-- Verify all levels are unlocked
SELECT 
    l.level_number,
    l.name,
    up.unlocked
FROM user_progress up
JOIN levels l ON up.level_id = l.id
WHERE up.user_id = auth.uid()
ORDER BY l.level_number;
