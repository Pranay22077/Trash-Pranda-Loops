#!/bin/bash

echo "🦝 Deploying Trash Panda Loops to Vercel..."
echo ""

# Add all changes
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: Update game files for Vercel"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Pushed to GitHub!"
echo ""
echo "Now Vercel will automatically deploy your changes."
echo "Check your deployment at: https://trashpandaloops.vercel.app"
echo ""
echo "Or manually trigger deployment:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Click 'Redeploy' on the latest deployment"
echo ""
echo "🦝 Done!"
