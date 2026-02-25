# 🗄️ Database Setup Guide - Trash Panda Loops

## Overview

Your game now has a complete database integration with:
- ✅ User authentication (sign up, login, logout)
- ✅ Real-time leaderboards
- ✅ User profiles and progress tracking
- ✅ 10 levels with increasing difficulty
- ✅ 17 achievements to unlock
- ✅ Game session tracking
- ✅ Daily challenges (structure ready)

## Step 1: Run the SQL Schema

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/kfkxhlcolwqpwjnmklma

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste**
   - Open `DATABASE_SCHEMA.sql`
   - Copy ALL the content
   - Paste into the SQL Editor

4. **Run the Script**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for completion (~10-15 seconds)
   - You should see "Success. No rows returned"

5. **Verify Tables Created**
   - Click "Table Editor" in sidebar
   - You should see these tables:
     - profiles
     - game_sessions
     - levels
     - achievements
     - user_achievements
     - leaderboard_entries
     - user_progress
     - daily_challenges
     - user_daily_progress

## Step 2: Install Supabase Client

Run this command in your project:

```bash
npm install @supabase/supabase-js
```

## Step 3: Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://kfkxhlcolwqpwjnmklma.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma3hobGNvbHdxcHdqbm1rbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTAzNDgsImV4cCI6MjA4NzUyNjM0OH0.MuLwk5YIXSq_rZsy7Pkg_jqm6aPlhQNM8ydyzvHQzDg
```

## Step 4: Enable Realtime

1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - `leaderboard_entries`
   - `profiles`
   - `user_achievements`

## Step 5: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Confirmation email
   - Password reset email
   - Magic link email

4. Go to **Authentication** → **URL Configuration**
5. Add your site URL:
   - Development: `http://localhost:5173`
   - Production: `https://trashpandaloops.vercel.app`

## Step 6: Test the Database

### Test 1: Create a User

```sql
-- In SQL Editor, run:
SELECT * FROM auth.users;
-- Should be empty initially
```

### Test 2: Check Levels

```sql
SELECT * FROM public.levels ORDER BY level_number;
-- Should show 10 levels
```

### Test 3: Check Achievements

```sql
SELECT * FROM public.achievements ORDER BY points;
-- Should show 17 achievements
```

## Database Structure

### Tables Overview

1. **profiles** - User profiles with stats
   - Extends Supabase auth.users
   - Stores total score, snacks, loops, XP, rank
   - Auto-created on user signup

2. **levels** - Game levels configuration
   - 10 levels from easy to master difficulty
   - Each level has time limit, snack requirements, NPC count
   - Progressive difficulty scaling

3. **game_sessions** - Individual game plays
   - Tracks each game attempt
   - Stores score, time, snacks collected
   - Links to user and level

4. **user_progress** - Per-level progress
   - Best score and time for each level
   - Stars (1-3) based on performance
   - Unlock status

5. **achievements** - Achievement definitions
   - 17 achievements across 5 categories
   - Collection, Stealth, Speed, Mastery, Special

6. **user_achievements** - Unlocked achievements
   - Junction table linking users to achievements
   - Tracks unlock time and progress

7. **leaderboard_entries** - Leaderboard data
   - Best scores per user per level
   - Auto-updated via trigger
   - Supports realtime subscriptions

8. **daily_challenges** - Daily challenge system
   - Structure ready for future implementation
   - Rotating challenges with rewards

9. **user_daily_progress** - Daily challenge progress
   - Tracks completion status
   - Links users to challenges

### Security (Row Level Security)

All tables have RLS enabled:
- Users can only modify their own data
- Everyone can read leaderboards and public profiles
- Achievements and levels are read-only for users

### Realtime Features

Enabled for:
- Leaderboard updates (see others' scores in real-time)
- Profile updates (see rank changes)
- Achievement unlocks (celebrate together!)

## Level Configuration

| Level | Name | Difficulty | Time | Snacks | NPCs | XP |
|-------|------|------------|------|--------|------|-----|
| 1 | Midnight Snack | Easy | 90s | 3 | 1 | 100 |
| 2 | Early Morning Raid | Easy | 80s | 4 | 1 | 150 |
| 3 | Breakfast Heist | Medium | 75s | 5 | 2 | 200 |
| 4 | Lunch Rush | Medium | 70s | 6 | 2 | 250 |
| 5 | Afternoon Delight | Medium | 65s | 7 | 2 | 300 |
| 6 | Dinner Time Danger | Hard | 60s | 8 | 3 | 400 |
| 7 | Late Night Feast | Hard | 55s | 9 | 3 | 500 |
| 8 | Party Crasher | Hard | 50s | 10 | 3 | 600 |
| 9 | Master Thief | Expert | 45s | 12 | 4 | 800 |
| 10 | Legendary Heist | Master | 40s | 15 | 4 | 1000 |

## Achievement Categories

### Collection (5 achievements)
- First Bite - Collect 1 snack
- Snack Collector - Collect 50 snacks
- Snack Hoarder - Collect 200 snacks
- Snack Master - Collect 500 snacks
- Legendary Collector - Collect 1000 snacks

### Stealth (3 achievements)
- Ghost - Complete level without detection
- Shadow Master - 10 perfect stealth levels
- Invisible Panda - 25 perfect stealth levels

### Speed (3 achievements)
- Speed Demon - Complete level in <30s
- Lightning Fast - 5 levels in <30s each
- Time Lord - 15 levels in <30s each

### Mastery (3 achievements)
- Level Master - Complete all levels
- Three Star Hero - Get 3 stars on 5 levels
- Perfectionist - Get 3 stars on all levels

### Special (3 achievements)
- First Loop - Complete first time loop
- Loop Veteran - Complete 100 loops
- Dedicated Player - Play for 10 hours
- Trash Panda Legend - Reach max rank

## Rank System

Based on Experience Points (XP):

| XP Range | Rank |
|----------|------|
| 0 - 499 | Rookie Raccoon |
| 500 - 1,499 | Sneaky Bandit |
| 1,500 - 2,999 | Master Thief |
| 3,000 - 4,999 | Shadow Legend |
| 5,000 - 9,999 | Trash Panda Elite |
| 10,000+ | Legendary Heist Master |

## API Usage Examples

### Create User
```typescript
import { authService } from './lib/auth';

await authService.signUp({
  email: 'player@example.com',
  password: 'securepassword',
  username: 'TrashMaster',
  displayName: 'Trash Master'
});
```

### Start Game Session
```typescript
import { db } from './lib/database';

const session = await db.createGameSession(userId, levelId);
```

### Complete Game
```typescript
await db.completeGameSession(sessionId, {
  score: 2500,
  snacksCollected: 10,
  timeTaken: 45,
  loopsCompleted: 1,
  detectionCount: 2,
  perfectStealth: false
});

// Update user stats
await db.updateProfileStats(userId, {
  score: 2500,
  snacks: 10,
  loops: 1,
  xp: 200
});

// Check for achievements
const unlocked = await db.checkAndUnlockAchievements(userId, {
  snacksCollected: 10,
  perfectStealth: false,
  timeTaken: 45,
  loopsCompleted: 1
});
```

### Get Leaderboard
```typescript
const leaderboard = await db.getGlobalLeaderboard(100);
const levelLeaderboard = await db.getLevelLeaderboard(levelId, 50);
```

### Subscribe to Realtime Updates
```typescript
const unsubscribe = db.subscribeToLeaderboard(levelId, (payload) => {
  console.log('Leaderboard updated!', payload);
  // Refresh leaderboard display
});

// Later: unsubscribe()
```

## Next Steps

1. ✅ Run SQL schema
2. ✅ Install Supabase client
3. ✅ Configure environment variables
4. ✅ Enable realtime
5. ✅ Configure authentication
6. [ ] Integrate into game components
7. [ ] Test authentication flow
8. [ ] Test game session tracking
9. [ ] Test leaderboard updates
10. [ ] Deploy to production

## Troubleshooting

### "relation does not exist"
- Make sure you ran the entire SQL schema
- Check that you're in the correct project

### "permission denied"
- Check RLS policies are created
- Verify user is authenticated

### Realtime not working
- Enable replication for tables
- Check realtime is enabled in project settings

### Authentication errors
- Verify email provider is enabled
- Check site URL is configured
- Confirm anon key is correct

---

**Your database is now ready!** 🗄️✨

Next: Integrate into the game UI!
