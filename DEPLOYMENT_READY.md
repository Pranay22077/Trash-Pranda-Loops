# Deployment Ready - Vercel Setup

## Step 1: Push to GitHub

```bash
cd /home/pranay22077/trash-panda-web
git add .
git commit -m "Complete game with minimalist design"
git push origin main
```

## Step 2: Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these 2 variables:

### Variable 1:
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://kfkxhlcolwqpwjnmklma.supabase.co`
- **Environment**: Production, Preview, Development (select all)

### Variable 2:
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma3hobGNvbHdxcHdqbm1rbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTAzNDgsImV4cCI6MjA4NzUyNjM0OH0.MuLwk5YIXSq_rZsy7Pkg_jqm6aPlhQNM8ydyzvHQzDg`
- **Environment**: Production, Preview, Development (select all)

## Step 3: Vercel Build Settings

Make sure these are set:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 4: Redeploy

After adding environment variables, click "Redeploy" in Vercel.

## What's Deployed:

✅ Minimalist monochrome design
✅ 10 playable levels (all unlocked)
✅ Working game mechanics
✅ Leaderboard (real-time)
✅ Stats tracking
✅ Achievements system
✅ Clean, professional UI

## Supabase is Already Configured:

- ✅ Database tables created
- ✅ 10 levels inserted
- ✅ 10 achievements inserted
- ✅ RLS disabled (no permission issues)
- ✅ Email auth enabled
- ✅ Email confirmation disabled

## No Additional Supabase Env Variables Needed

Supabase doesn't need environment variables in its dashboard. Everything is configured through the Vercel environment variables above.

## After Deployment:

Your site will be live at: `https://trashpandaloops.vercel.app`

Test:
1. Visit the site
2. Click "Select Level"
3. All 10 levels should be unlocked
4. Play the game
5. Check leaderboard and stats

## Troubleshooting:

If something doesn't work:
1. Check Vercel deployment logs
2. Make sure environment variables are set correctly
3. Verify Supabase URL and key are correct
4. Hard refresh browser (Ctrl+Shift+R)
