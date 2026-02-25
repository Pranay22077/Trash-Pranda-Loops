#!/bin/bash

echo "🚀 Deploying Trash Panda Loops to GitHub..."

cd /home/pranay22077/trash-panda-web

# Add all changes
git add .

# Commit with message
git commit -m "Complete game: minimalist design, 10 levels, working gameplay"

# Push to GitHub
git push origin main

echo "✅ Pushed to GitHub!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Vercel dashboard"
echo "2. Add environment variables (see DEPLOYMENT_READY.md)"
echo "3. Redeploy"
echo ""
echo "Environment variables to add in Vercel:"
echo "VITE_SUPABASE_URL=https://kfkxhlcolwqpwjnmklma.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma3hobGNvbHdxcHdqbm1rbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTAzNDgsImV4cCI6MjA4NzUyNjM0OH0.MuLwk5YIXSq_rZsy7Pkg_jqm6aPlhQNM8ydyzvHQzDg"
