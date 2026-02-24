# 🦝 Trash Panda Loops - Complete Game Website

A fully integrated web-based roguelike game with React frontend and Python backend.

## 🎮 What's Included

### Frontend (React + Vite + TypeScript)
- ✅ Beautiful dark-themed UI with neon accents
- ✅ Animated backgrounds (Prism & Particles)
- ✅ Fully playable game canvas
- ✅ Real-time game state updates
- ✅ Leaderboard integration
- ✅ Stats and achievements display
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions

### Backend (Python + Flask)
- ✅ Complete game logic (from src/)
- ✅ RESTful API endpoints
- ✅ Game session management
- ✅ Real-time state updates
- ✅ Leaderboard system
- ✅ Stats tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- npm or pnpm (for package management)

### 1. Install Dependencies

**Frontend:**
```bash
cd "UI-Design/Complete Web Design Specification"
npm install
# or
pnpm install
```

**Backend:**
```bash
cd api
pip install -r requirements.txt
```

### 2. Start the Backend Server
```bash
cd api
python server.py
```

The API will be available at `http://localhost:5000`

### 3. Start the Frontend
```bash
cd "UI-Design/Complete Web Design Specification"
npm run dev
# or
pnpm dev
```

The website will be available at `http://localhost:5173`

### 4. Play the Game!
Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
trash-panda-loops/
├── src/                          # Python game logic
│   ├── game.py                   # Main game controller
│   ├── entities/                 # Player, NPCs, snacks
│   ├── world/                    # Kitchen generation
│   └── systems/                  # Game systems
│
├── api/                          # Flask API server
│   ├── server.py                 # API endpoints
│   └── requirements.txt          # Python dependencies
│
└── UI-Design/Complete Web Design Specification/
    ├── src/
    │   ├── app/
    │   │   ├── App.tsx           # Main app component
    │   │   ├── components/       # React components
    │   │   │   ├── HeroSection.tsx
    │   │   │   ├── GameCanvas.tsx
    │   │   │   ├── backgrounds/
    │   │   │   │   ├── Prism.tsx
    │   │   │   │   └── Particles.tsx
    │   │   │   └── ...
    │   │   └── services/
    │   │       └── gameApi.ts    # API client
    │   └── styles/
    │       └── index.css         # Global styles
    ├── package.json
    └── vite.config.ts
```

## 🎨 Features

### Home Page
- Animated prism background
- Hero section with game preview
- Feature cards
- How-to-play timeline
- Call-to-action buttons

### Game Canvas
- Fully playable game
- Real-time rendering
- Keyboard controls (WASD, E, Space)
- HUD with timer, detection, and stats
- Particle background effects

### Leaderboard
- Top 10 players
- Real-time updates
- Medal icons for top 3

### Stats & Achievements
- Total loops, snacks, best score
- Achievement badges
- Progress tracking

## 🔌 API Endpoints

### Game Management
- `POST /api/game/start` - Start new game session
- `GET /api/game/:id/state` - Get current game state
- `POST /api/game/:id/action` - Send player action
- `POST /api/game/:id/unlock` - Unlock ability

### Data
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/stats` - Get player stats

## 🎮 Game Controls

- **W/↑** - Move up
- **S/↓** - Move down
- **A/←** - Move left
- **D/→** - Move right
- **E** - Interact with objects
- **Space** - Toggle hiding

## 🎯 Game Mechanics

### Time Loop
- Each loop lasts 60 seconds
- Collect snacks before time runs out
- Avoid detection by NPCs
- Loop resets on detection or completion

### Stealth
- Movement generates noise
- NPCs detect via sight and sound
- Hiding reduces detection
- Detection accumulates to 100% = caught

### Progression
- Earn points from loop scores
- Unlock permanent abilities
- Track stats and achievements

## 🛠️ Development

### Frontend Development
```bash
cd "UI-Design/Complete Web Design Specification"
npm run dev
```

### Backend Development
```bash
cd api
python server.py
```

### Build for Production
```bash
cd "UI-Design/Complete Web Design Specification"
npm run build
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `VITE_API_URL=https://your-api-url.com/api`
4. Deploy

### Backend (Heroku/Railway/Render)
1. Create new app
2. Connect repository
3. Set buildpack to Python
4. Deploy from `api/` directory

## 🎨 Customization

### Colors
Edit `src/styles/index.css`:
```css
:root {
  --bg-primary: #0f1419;
  --accent-primary: #00d9ff;
  --accent-secondary: #b537f2;
  /* ... */
}
```

### Game Balance
Edit `data/config.json`:
```json
{
  "game": {
    "loop_duration": 60,
    "detection_threshold": 100
  },
  "snacks": [...],
  "unlockables": [...]
}
```

## 📝 TODO

- [ ] Add user authentication
- [ ] Implement database for leaderboard
- [ ] Add more kitchen layouts
- [ ] Create achievement system
- [ ] Add sound effects
- [ ] Implement multiplayer
- [ ] Mobile touch controls
- [ ] PWA support

## 🐛 Known Issues

- Game state is stored in memory (use Redis for production)
- Leaderboard is mock data (needs database)
- No user authentication yet

## 📄 License

MIT License - feel free to use for your own projects!

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ and 🦝**

🎮 Happy gaming!
