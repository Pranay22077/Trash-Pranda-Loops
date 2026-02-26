# Connection Diagnostics

## Current Status

✅ **Supabase API is accessible** - Tested successfully
✅ **Environment variables are set** - .env file exists with correct credentials
✅ **Code structure is correct** - Auth and database modules properly configured
✅ **Dev server is running** - http://localhost:5173/

## Likely Issues

### 1. Database Tables Don't Exist

The old commit code expects these tables:
- profiles
- levels
- achievements
- user_achievements
- user_progress
- game_sessions
- leaderboard_entries

**Check in Supabase:**
1. Go to: Database → Tables
2. Verify all tables exist
3. If missing, run: `COMPLETE_DATABASE_SETUP.sql`

### 2. RLS Policies Blocking Access

Row Level Security might be preventing reads/writes.

**Check in Supabase:**
1. Go to: Authentication → Policies
2. For each table, verify policies allow:
   - SELECT for authenticated users
   - INSERT/UPDATE for own data

**Quick Fix - Temporarily Disable RLS:**
```sql
-- Run in Supabase SQL Editor
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries DISABLE ROW LEVEL SECURITY;
```

### 3. Email Confirmation Required

If email confirmation is enabled, users can't sign in immediately after signup.

**Fix in Supabase:**
1. Go to: Authentication → Providers → Email
2. Disable "Confirm email"
3. Save

### 4. Profile Creation Trigger Missing

When users sign up, a profile should be auto-created.

**Check if trigger exists:**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_trigger WHERE tgname LIKE '%profile%';
```

**If missing, create it:**
```sql
-- Create function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', 'Player')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Testing Steps

### Test 1: Check Database Connection
Open browser console (F12) and run:
```javascript
// Should see no errors
console.log('Testing connection...');
```

### Test 2: Try to Sign Up
1. Click "Sign In / Play" button
2. Switch to "Sign Up" tab
3. Enter:
   - Email: test@example.com
   - Password: test123
   - Username: testuser
4. Click Sign Up

**Expected:** Success message
**If error:** Check browser console for details

### Test 3: Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Logs" → "Postgres Logs"
3. Look for errors related to:
   - Missing tables
   - RLS policy violations
   - Trigger failures

## Common Error Messages

### "relation 'profiles' does not exist"
**Solution:** Run `COMPLETE_DATABASE_SETUP.sql` to create tables

### "new row violates row-level security policy"
**Solution:** Fix RLS policies or temporarily disable them

### "Failed to fetch"
**Solution:** 
- Check if Supabase project is paused
- Verify API keys are correct
- Check CORS settings

### "Email signups are disabled"
**Solution:** Enable email provider in Supabase Auth settings

## Quick Fix Script

Run this in Supabase SQL Editor to fix most issues:

```sql
-- 1. Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries DISABLE ROW LEVEL SECURITY;

-- 2. Create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', 'Player')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'levels', 'achievements', 'user_achievements', 'user_progress', 'game_sessions', 'leaderboard_entries');
```

## Next Steps

1. Open http://localhost:5173/ in browser
2. Open browser console (F12)
3. Try to sign up
4. Check console for errors
5. Report specific error messages

The database connection is working, so the issue is likely:
- Missing tables
- RLS policies blocking access
- Missing profile creation trigger
- Email confirmation enabled
