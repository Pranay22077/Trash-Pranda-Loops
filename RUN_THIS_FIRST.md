# 🚀 FIX EVERYTHING - Run This First

## ONE Script to Rule Them All

This will completely reset and set up your database from scratch.

### Step 1: Open Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar

### Step 2: Run the Complete Setup

1. Click "New Query"
2. Open the file: `COMPLETE_DATABASE_RESET_AND_SETUP.sql`
3. Copy the ENTIRE file (Ctrl+A, Ctrl+C)
4. Paste into Supabase SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Wait 5-10 seconds

### Step 3: Verify Success

You should see output like:

```
✅ DATABASE SETUP COMPLETE
Tables Created: 7 of 7
Levels Inserted: 10 (expected 10)
Achievements Inserted: 17 (expected 17)
Users in System: 1
Profiles Created: 1
Auto-Profile Trigger: ENABLED ✅
RLS Status: DISABLED (for testing)
```

### Step 4: Test Login

1. Go back to your browser: http://localhost:5173/
2. Press F5 to refresh
3. Click "Sign In / Play"
4. Log in with your account
5. Should work now! ✅

## What This Script Does

1. ✅ Drops all existing tables (clean slate)
2. ✅ Creates all 7 tables from scratch
3. ✅ Inserts 10 levels
4. ✅ Inserts 17 achievements
5. ✅ Creates auto-profile trigger
6. ✅ Creates profiles for existing users
7. ✅ Unlocks level 1 for all users
8. ✅ Disables RLS (for testing)
9. ✅ Sets up all indexes
10. ✅ Grants all permissions

## If It Still Doesn't Work

### Check 1: Verify Tables Exist

In Supabase:
- Go to: Table Editor
- You should see: profiles, levels, achievements, user_achievements, user_progress, game_sessions, leaderboard_entries

### Check 2: Verify Your Profile Exists

1. Go to: Table Editor → profiles
2. Look for your user ID
3. If not there, something went wrong

### Check 3: Check Browser Console

1. Open browser (F12)
2. Go to Console tab
3. Look for specific error messages
4. Share the error with me

### Check 4: Verify Supabase Settings

1. Go to: Authentication → Providers → Email
2. Make sure "Enable email signups" is ON
3. Make sure "Confirm email" is OFF

## Common Issues

### "relation does not exist"
- The script didn't run completely
- Run it again

### "Error loading profile"
- Your profile wasn't created
- Check Table Editor → profiles
- Manually add a row with your user ID

### "Failed to fetch"
- Supabase project might be paused
- Check project status in dashboard

## Need Help?

If still not working:
1. Take a screenshot of the SQL output
2. Take a screenshot of browser console errors
3. Check if your user ID exists in profiles table
4. Share the specific error message

---

## TL;DR

1. Open Supabase SQL Editor
2. Copy entire `COMPLETE_DATABASE_RESET_AND_SETUP.sql`
3. Paste and Run
4. Refresh browser and log in
5. Done! ✅
