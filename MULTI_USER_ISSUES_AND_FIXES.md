# Multi-User Issues Analysis & Fixes

## Issues Found

### 1. **CRITICAL: Race Conditions in Profile Stats Updates**
**Location:** `src/lib/database.ts` - `updateProfileStats()` function

**Problem:** When multiple users play simultaneously, the function does:
1. Read current profile stats
2. Add new stats to old stats
3. Write back

If two game sessions complete at the same time, both read the same old value, add their scores, and one update overwrites the other = LOST DATA.

**Example:**
- User has 100 points
- Game 1 completes: reads 100, adds 50 = 150
- Game 2 completes: reads 100, adds 30 = 130
- Game 1 writes 150
- Game 2 writes 130 (overwrites Game 1!)
- Final: 130 instead of 180

**Fix:** Use PostgreSQL atomic increment operations

### 2. **Achievement Unlock Race Condition**
**Location:** `src/lib/database.ts` - `checkAndUnlockAchievements()` function

**Problem:** Multiple simultaneous game completions can try to unlock the same achievement, causing duplicate insert errors or missed unlocks.

### 3. **Level Progress Race Condition**
**Location:** `src/lib/database.ts` - `updateLevelProgress()` function

**Problem:** Similar to stats - reads current best score, compares, writes back. Two simultaneous completions can overwrite each other.

### 4. **Missing Database Indexes**
**Problem:** Leaderboard queries will be SLOW with many users. No indexes on frequently queried columns.

### 5. **No Connection Pooling Configuration**
**Problem:** Each user creates new database connections. With 10-15 simultaneous users, you'll hit connection limits.

### 6. **Email Confirmation Might Be Enabled**
**Problem:** If email confirmation is required in Supabase, users can't play immediately after signup.

### 7. **No Error Retry Logic**
**Problem:** Network timeouts aren't retried, causing permanent failures for temporary issues.

### 8. **Leaderboard Polling Every 10 Seconds**
**Location:** `src/app/components/LeaderboardSection.tsx`

**Problem:** 15 users = 90 database queries per minute just for leaderboard. Should use Supabase realtime subscriptions.

---

## Fixes to Apply

### Fix 1: Atomic Profile Stats Updates

Replace the `updateProfileStats` function with atomic SQL operations:

```typescript
async updateProfileStats(userId: string, stats: {
  score?: number;
  snacks?: number;
  loops?: number;
  playTime?: number;
  level?: number;
  xp?: number;
}) {
  const updates: any = {
    last_played_at: new Date().toISOString(),
  };

  // Build atomic increment expressions
  const increments: string[] = [];
  
  if (stats.score) {
    increments.push(`total_score = total_score + ${stats.score}`);
  }
  if (stats.snacks) {
    increments.push(`total_snacks_collected = total_snacks_collected + ${stats.snacks}`);
  }
  if (stats.loops) {
    increments.push(`total_loops_completed = total_loops_completed + ${stats.loops}`);
  }
  if (stats.playTime) {
    increments.push(`total_play_time = total_play_time + ${stats.playTime}`);
  }

  // Use RPC function for atomic updates
  const { data, error } = await supabase.rpc('increment_profile_stats', {
    p_user_id: userId,
    p_score: stats.score || 0,
    p_snacks: stats.snacks || 0,
    p_loops: stats.loops || 0,
    p_play_time: stats.playTime || 0,
    p_level: stats.level || 0,
    p_xp: stats.xp || 0,
  });

  if (error) throw error;
  return data;
}
```

### Fix 2: Create Database Function for Atomic Updates

Run this SQL in Supabase:

```sql
CREATE OR REPLACE FUNCTION increment_profile_stats(
  p_user_id UUID,
  p_score INTEGER DEFAULT 0,
  p_snacks INTEGER DEFAULT 0,
  p_loops INTEGER DEFAULT 0,
  p_play_time INTEGER DEFAULT 0,
  p_level INTEGER DEFAULT 0,
  p_xp INTEGER DEFAULT 0
)
RETURNS profiles AS $$
DECLARE
  v_profile profiles;
  v_new_xp INTEGER;
  v_new_rank TEXT;
BEGIN
  -- Atomic update with increments
  UPDATE profiles
  SET
    total_score = total_score + p_score,
    total_snacks_collected = total_snacks_collected + p_snacks,
    total_loops_completed = total_loops_completed + p_loops,
    total_play_time = total_play_time + p_play_time,
    highest_level = GREATEST(highest_level, p_level),
    experience_points = experience_points + p_xp,
    last_played_at = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING * INTO v_profile;

  -- Calculate and update rank if XP changed
  IF p_xp > 0 THEN
    v_new_xp := v_profile.experience_points;
    v_new_rank := CASE
      WHEN v_new_xp >= 10000 THEN 'Legendary Heist Master'
      WHEN v_new_xp >= 5000 THEN 'Trash Panda Elite'
      WHEN v_new_xp >= 3000 THEN 'Shadow Legend'
      WHEN v_new_xp >= 1500 THEN 'Master Thief'
      WHEN v_new_xp >= 500 THEN 'Sneaky Bandit'
      ELSE 'Rookie Raccoon'
    END;

    UPDATE profiles
    SET rank = v_new_rank
    WHERE id = p_user_id
    RETURNING * INTO v_profile;
  END IF;

  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Fix 3: Atomic Level Progress Updates

```sql
CREATE OR REPLACE FUNCTION update_level_progress_atomic(
  p_user_id UUID,
  p_level_id INTEGER,
  p_score INTEGER,
  p_time INTEGER,
  p_completed BOOLEAN,
  p_stars INTEGER
)
RETURNS user_progress AS $$
DECLARE
  v_progress user_progress;
BEGIN
  INSERT INTO user_progress (
    user_id,
    level_id,
    best_score,
    best_time,
    attempts,
    completed,
    stars,
    unlocked,
    first_completed_at,
    last_played_at
  ) VALUES (
    p_user_id,
    p_level_id,
    p_score,
    p_time,
    1,
    p_completed,
    p_stars,
    true,
    CASE WHEN p_completed THEN NOW() ELSE NULL END,
    NOW()
  )
  ON CONFLICT (user_id, level_id) DO UPDATE SET
    best_score = GREATEST(user_progress.best_score, p_score),
    best_time = CASE
      WHEN user_progress.best_time IS NULL THEN p_time
      WHEN p_time IS NULL THEN user_progress.best_time
      ELSE LEAST(user_progress.best_time, p_time)
    END,
    attempts = user_progress.attempts + 1,
    completed = user_progress.completed OR p_completed,
    stars = GREATEST(user_progress.stars, p_stars),
    first_completed_at = COALESCE(user_progress.first_completed_at, CASE WHEN p_completed THEN NOW() ELSE NULL END),
    last_played_at = NOW()
  RETURNING * INTO v_progress;

  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Fix 4: Add Database Indexes

```sql
-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_score ON profiles(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_level_id ON game_sessions(level_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_level_id ON user_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entries_level_score ON leaderboard_entries(level_id, score DESC);
```

### Fix 5: Use Realtime Subscriptions for Leaderboard

Replace polling with realtime:

```typescript
useEffect(() => {
  loadLeaderboard();
  
  // Subscribe to profile changes for realtime updates
  const channel = supabase
    .channel('leaderboard-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
      },
      () => {
        loadLeaderboard();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Fix 6: Disable Email Confirmation

In Supabase Dashboard:
1. Go to Authentication → Email Templates
2. Disable "Confirm email" requirement
3. Or set `emailRedirectTo: undefined` in signup (already done)

### Fix 7: Add Retry Logic

```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      
      // Only retry on network errors
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Fix 8: Achievement Unlock with Conflict Handling

```sql
CREATE OR REPLACE FUNCTION unlock_achievement_safe(
  p_user_id UUID,
  p_achievement_code TEXT
)
RETURNS user_achievements AS $$
DECLARE
  v_achievement_id INTEGER;
  v_user_achievement user_achievements;
BEGIN
  -- Get achievement ID
  SELECT id INTO v_achievement_id
  FROM achievements
  WHERE code = p_achievement_code;

  IF v_achievement_id IS NULL THEN
    RAISE EXCEPTION 'Achievement not found: %', p_achievement_code;
  END IF;

  -- Insert with conflict handling
  INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
  VALUES (p_user_id, v_achievement_id, NOW())
  ON CONFLICT (user_id, achievement_id) DO NOTHING
  RETURNING * INTO v_user_achievement;

  RETURN v_user_achievement;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Summary of Required Actions

### In Supabase Dashboard:

1. **Authentication Settings:**
   - Settings → Authentication → Email
   - Disable "Confirm email" or ensure it's set to "Disabled"
   - Verify "Enable email signups" is ON

2. **Run SQL Scripts:**
   - Copy all the SQL functions above
   - Run in SQL Editor
   - Run the indexes script

3. **Check RLS Policies:**
   - Make sure profiles table allows SELECT for authenticated users
   - Run the FIX_RLS_POLICIES.sql script

4. **Connection Pooling:**
   - Settings → Database → Connection Pooling
   - Enable it
   - Set mode to "Transaction"

### In Code:

1. Update `src/lib/database.ts` with atomic operations
2. Update `src/app/components/LeaderboardSection.tsx` with realtime subscriptions
3. Add retry logic wrapper for critical operations
4. Test with multiple browser tabs/incognito windows

---

## Testing Checklist

- [ ] Create 3-5 test accounts
- [ ] Open game in multiple browser tabs (different accounts)
- [ ] Play simultaneously and complete games
- [ ] Verify all scores are recorded correctly
- [ ] Check leaderboard updates in realtime
- [ ] Verify no duplicate achievements
- [ ] Check database for orphaned sessions
- [ ] Monitor Supabase logs for errors
