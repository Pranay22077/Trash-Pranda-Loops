# Populate Database with Levels and Achievements

## Step 1: Insert Levels

Go to your Supabase dashboard:
1. Open https://supabase.com/dashboard
2. Select your project: kfkxhlcolwqpwjnmklma
3. Go to SQL Editor
4. Copy and paste the contents of `INSERT_LEVELS.sql`
5. Click "Run"

## Step 2: Insert Achievements

In the same SQL Editor:
1. Copy and paste the contents of `INSERT_ACHIEVEMENTS.sql`
2. Click "Run"

## Step 3: Verify Data

Run these queries to verify:

```sql
-- Check levels
SELECT * FROM levels ORDER BY level_number;

-- Check achievements
SELECT * FROM achievements ORDER BY points;

-- Count records
SELECT 
  (SELECT COUNT(*) FROM levels) as level_count,
  (SELECT COUNT(*) FROM achievements) as achievement_count;
```

You should see:
- 10 levels (level_number 1-10)
- 17 achievements

## Step 4: Initialize First Level for Users

For existing users, unlock level 1:

```sql
-- Unlock level 1 for all users
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

## Alternative: Run via psql

If you have psql installed:

```bash
# Set your connection string
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.kfkxhlcolwqpwjnmklma.supabase.co:5432/postgres"

# Run the scripts
psql $DATABASE_URL -f INSERT_LEVELS.sql
psql $DATABASE_URL -f INSERT_ACHIEVEMENTS.sql
```
