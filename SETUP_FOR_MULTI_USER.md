# Setup Guide for Multi-User Support

## Step-by-Step Instructions

### 1. Run SQL Fixes in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `kfkxhlcolwqpwjnmklma`
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `FIX_MULTI_USER_ISSUES.sql`
6. Paste into the SQL editor
7. Click "Run" button
8. Wait for success message: "✅ Multi-user fixes applied successfully!"

### 2. Configure Supabase Settings

#### A. Disable Email Confirmation (Critical!)

1. Go to: Authentication → Providers
2. Click on "Email" provider
3. Scroll to "Email Confirmation"
4. Toggle OFF "Enable email confirmations"
5. Click "Save"

**Why:** Users need to play immediately after signup without waiting for email confirmation.

#### B. Enable Connection Pooling

1. Go to: Settings → Database
2. Scroll to "Connection Pooling" section
3. Toggle ON "Enable connection pooling"
4. Set "Pool Mode" to "Transaction"
5. Click "Save"

**Why:** Prevents running out of database connections with many simultaneous users.

#### C. Check CORS Settings

1. Go to: Settings → API
2. Scroll to "API Settings"
3. Under "Additional Settings", find CORS
4. Make sure your Vercel domain is allowed: `https://trash-pr*.vercel.app`
5. Or set to `*` to allow all origins (less secure but works)

**Why:** Prevents CORS errors when users access from different domains.

#### D. Verify Network Restrictions

1. Go to: Settings → Database
2. Look for "Network Restrictions" or "Connection Security"
3. Make sure "Restrict connections" is OFF
4. Or if ON, add `0.0.0.0/0` to allow all IPs

**Why:** Users from different networks need to connect.

#### E. Enable Realtime

1. Go to: Database → Replication
2. Find the "profiles" table
3. Toggle ON "Enable Realtime"
4. Click "Save"

**Why:** Leaderboard updates in realtime without polling.

### 3. Verify Database Setup

Run these queries in SQL Editor to verify:

```sql
-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'increment_profile_stats',
    'update_level_progress_atomic',
    'unlock_achievement_safe'
  );

-- Should return 3 rows

-- Check indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- Should return multiple indexes including idx_profiles_total_score

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- Should return policies for viewing and updating profiles
```

### 4. Deploy Updated Code

The code has been updated with:
- ✅ Atomic database operations (no more race conditions)
- ✅ Realtime leaderboard subscriptions (no more polling)
- ✅ Better error handling

Deploy to Vercel:

```bash
git add .
git commit -m "Fix multi-user race conditions and performance"
git push
```

Vercel will auto-deploy.

### 5. Test Multi-User Functionality

#### Test Plan:

1. **Create Test Accounts:**
   - Open 5 incognito/private browser windows
   - In each window, go to your game URL
   - Sign up with different emails:
     - test1@example.com
     - test2@example.com
     - test3@example.com
     - test4@example.com
     - test5@example.com
   - Use password: `test123` for all

2. **Test Simultaneous Play:**
   - In all 5 windows, start playing at the same time
   - Complete games and collect snacks
   - Watch the leaderboard update in realtime

3. **Verify Data Integrity:**
   - Go to Supabase → Table Editor → profiles
   - Check that all scores are correct (no missing data)
   - Verify no duplicate achievements in user_achievements table

4. **Test Leaderboard:**
   - Open the game in a 6th window
   - Watch leaderboard update automatically when others play
   - Should NOT see "Loading..." repeatedly

5. **Check for Errors:**
   - Open browser console (F12)
   - Look for any red errors
   - Common issues:
     - "Failed to fetch" = Network/CORS issue
     - "RPC function not found" = SQL script not run
     - "Permission denied" = RLS policy issue

### 6. Monitor Performance

#### In Supabase Dashboard:

1. Go to: Reports → Database
2. Check "Active Connections" - should stay under 10
3. Check "Query Performance" - queries should be fast (<100ms)

#### In Browser:

1. Open DevTools → Network tab
2. Filter by "supabase.co"
3. Check response times - should be <500ms
4. Look for failed requests (red)

### 7. Common Issues & Solutions

#### Issue: "Failed to fetch" errors

**Solution:**
- Check Supabase project is not paused
- Verify CORS settings allow your domain
- Check network restrictions are disabled

#### Issue: "Function does not exist"

**Solution:**
- Re-run the FIX_MULTI_USER_ISSUES.sql script
- Check you're in the correct project
- Verify functions with the verification query above

#### Issue: Leaderboard not updating

**Solution:**
- Enable Realtime for profiles table
- Check browser console for subscription errors
- Verify RLS policies allow reading profiles

#### Issue: Scores not saving

**Solution:**
- Check RLS policies allow INSERT/UPDATE
- Verify user is authenticated
- Check browser console for errors

#### Issue: Duplicate achievements

**Solution:**
- Re-run the SQL script (it includes conflict handling)
- Check unique constraint exists on user_achievements

### 8. Performance Optimization Checklist

- [x] Atomic database operations implemented
- [x] Database indexes created
- [x] Connection pooling enabled
- [x] Realtime subscriptions instead of polling
- [x] RLS policies optimized
- [ ] Email confirmation disabled
- [ ] CORS configured
- [ ] Network restrictions removed
- [ ] Realtime enabled for profiles table

### 9. Final Verification

Run this test:

1. Open game in 3 browser tabs
2. Sign in with 3 different accounts
3. All 3 play and complete a level at the EXACT same time
4. Check Supabase → profiles table
5. Verify all 3 scores were recorded correctly
6. If any score is missing or wrong = race condition still exists

### 10. Rollback Plan (If Something Breaks)

If the new code causes issues:

```sql
-- Rollback: Drop the new functions
DROP FUNCTION IF EXISTS increment_profile_stats;
DROP FUNCTION IF EXISTS update_level_progress_atomic;
DROP FUNCTION IF EXISTS unlock_achievement_safe;
```

Then revert the code changes:

```bash
git revert HEAD
git push
```

---

## Success Criteria

✅ 10+ users can play simultaneously without errors
✅ All scores are recorded correctly (no lost data)
✅ Leaderboard updates in realtime
✅ No duplicate achievements
✅ No "Failed to fetch" errors
✅ Page loads in <2 seconds
✅ Database queries complete in <100ms

---

## Support

If you encounter issues:

1. Check Supabase logs: Logs → Postgres Logs
2. Check browser console for errors
3. Verify all steps above were completed
4. Test with a single user first, then add more

The main issues were:
- Race conditions in stats updates (FIXED with atomic SQL)
- Excessive polling (FIXED with realtime subscriptions)
- Missing indexes (FIXED with performance indexes)
- Connection limits (FIXED with connection pooling)
