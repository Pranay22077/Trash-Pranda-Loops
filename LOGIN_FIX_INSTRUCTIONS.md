# Fix Login Issue - Step by Step

## The Problem

You see "Signed in successfully!" but the app doesn't work because:
- ✅ Authentication works (user logs in)
- ❌ Profile doesn't exist in database
- ❌ App tries to load profile and fails
- ❌ Leaderboard/achievements can't load

## The Solution

Run ONE SQL script to fix everything.

### Step 1: Run the Fix Script

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the entire contents of `FIX_LOGIN_ISSUE.sql`
4. Paste and click "Run"
5. Wait for success message

### What This Does:

1. ✅ Creates auto-profile trigger (profiles created on signup)
2. ✅ Creates profiles for existing users
3. ✅ Unlocks level 1 for all users
4. ✅ Temporarily disables RLS (for testing)
5. ✅ Verifies everything worked

### Step 2: Test Login

1. Refresh your browser (http://localhost:5173/)
2. Click "Sign In / Play"
3. Log in with your existing account
4. Should work now!

### Step 3: If Still Not Working

Check browser console (F12) for errors:

**"Error loading profile"**
- Profile still doesn't exist
- Check Supabase → Table Editor → profiles
- Manually add a row with your user ID

**"Error loading leaderboard"**
- No profiles in database yet
- This is OK if you're the only user
- Will work once you have data

**"Error loading achievements"**
- Achievements table is empty
- Run: `COMPLETE_DATABASE_SETUP.sql` to populate

## Quick Manual Fix (if SQL doesn't work)

### Create Profile Manually:

1. Go to Supabase → Authentication → Users
2. Copy your user ID (UUID)
3. Go to Table Editor → profiles
4. Click "Insert row"
5. Fill in:
   - id: (paste your user ID)
   - username: your_username
   - display_name: Your Name
   - total_score: 0
   - total_snacks_collected: 0
   - total_loops_completed: 0
   - total_play_time: 0
   - highest_level: 1
   - current_level: 1
   - experience_points: 0
   - rank: Rookie Raccoon
6. Click "Save"
7. Refresh browser and log in

## Why This Happened

The old commit code expects:
1. A database trigger to auto-create profiles
2. RLS policies configured
3. Tables populated with data

When you restored the old code, the database wasn't set up, so:
- Users can authenticate (Supabase Auth works)
- But profiles don't exist (no trigger)
- App fails to load user data

## After This Fix

✅ New signups will auto-create profiles
✅ Existing users will have profiles created
✅ Login will work properly
✅ App will load user data

## Re-enable RLS Later

Once everything works, re-enable RLS with proper policies:

```sql
-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
-- etc.

-- Add policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

But for now, keep it disabled to test.
