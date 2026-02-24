# 🦝 Trash Panda Loops - Setup Instructions

## Current Status

✅ **Backend:** Python Flask API is running on http://localhost:5000
✅ **Game Logic:** Complete and tested
✅ **Frontend:** React app created with all components
⚠️ **Issue:** npm install has permission issues on external drive

## Quick Fix - Run the Website

### Option 1: Copy to Home Directory (Recommended)

```bash
# Copy the UI folder to your home directory
cp -r "UI-Design/Complete Web Design Specification" ~/trash-panda-web

# Go to the new location
cd ~/trash-panda-web

# Install dependencies (should work without permission issues)
npm install

# Start the dev server
npm run dev
```

The website will be available at **http://localhost:5173**

### Option 2: Use --no-bin-links Flag

```bash
cd "UI-Design/Complete Web Design Specification"

# Install without creating symlinks
npm install --no-bin-links

# Run vite directly
npx vite
```

## What's Already Running

1. **Backend API** - http://localhost:5000
   - Game logic endpoints
   - Leaderboard
   - Stats

2. **Pygame Game** - Can be started with:
   ```bash
   python3 src/main.py
   ```

## Complete Setup (Fresh Start)

### 1. Backend Setup
```bash
# Install Python dependencies
pip3 install flask flask-cors --break-system-packages

# Start the API server
python3 api/server.py
```

### 2. Frontend Setup
```bash
# Copy to home directory to avoid permission issues
cp -r "UI-Design/Complete Web Design Specification" ~/trash-panda-web
cd ~/trash-panda-web

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 3. Open in Browser
Navigate to **http://localhost:5173**

## What You'll See

1. **Landing Page** with animated prism background
2. **Hero Section** with game preview
3. **Features Section** showcasing game mechanics
4. **How It Works** timeline
5. **Playable Game Canvas** - Click "Start Game" to play!
6. **Leaderboard** with top players
7. **Stats & Achievements** section
8. **Call-to-Action** section

## Game Controls

- **WASD** or **Arrow Keys** - Move
- **E** - Interact with objects
- **SPACE** - Hide
- **ESC** - Pause

## Troubleshooting

### npm install fails
- Copy project to home directory
- Or use `npm install --no-bin-links`

### Backend not connecting
- Make sure Flask server is running on port 5000
- Check `.env` file has correct API URL

### Port already in use
- Frontend: Change port in vite.config.ts
- Backend: Change port in api/server.py

## Project Structure

```
✅ Complete:
- Python game logic (src/)
- Flask API (api/)
- React frontend (UI-Design/)
- Background animations (Prism, Particles)
- Game canvas component
- All UI components

⏳ In Progress:
- npm install (permission issue on external drive)

📝 To Do:
- Database integration
- User authentication
- Deploy to Vercel
```

## Next Steps

1. Copy frontend to home directory
2. Run `npm install`
3. Start with `npm run dev`
4. Open http://localhost:5173
5. Enjoy the game!

---

**Backend is already running at:** http://localhost:5000
**Just need to start the frontend!**

🦝 Happy gaming!
