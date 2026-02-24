# 🦝 Trash Panda Loops

A roguelike game about a raccoon stealing snacks from a kitchen in repeating 60-second time loops.

## 🎮 What Is This?

You're a clever raccoon stuck in a temporal anomaly. Every 60 seconds, time resets, but you remember everything. Use your knowledge to master the perfect heist, avoid detection, and unlock new abilities.

**Status:** ✅ Complete game logic (backend) | 🎯 Frontend coming soon

## ⚡ Quick Start

### Play Now (CLI Version)
```bash
python src/cli_game.py
```

**Commands:** `start`, `move up/down/left/right`, `interact`, `hide`, `status`, `unlocks`

### Run Tests
```bash
python test_game_logic.py
```

### Watch Simulation
```bash
python simulate_game.py
```

## 🎯 Core Mechanics

- **Time Loop:** 60 seconds per loop, collect snacks before time runs out
- **Stealth:** Movement generates noise, NPCs detect via sight and sound
- **Progression:** Earn points to unlock permanent abilities (Dash, Silent Paws, Time Sense)
- **Risk vs Reward:** Better snacks are harder to reach and make more noise

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Detailed getting started guide
- **[GAME_DESIGN.md](GAME_DESIGN.md)** - Complete game design document
- **[GAME_LOGIC_DOCUMENTATION.md](GAME_LOGIC_DOCUMENTATION.md)** - Technical API reference
- **[ROADMAP.md](ROADMAP.md)** - Development roadmap and future plans

## 🏗️ Project Structure

```
trash-panda-loops/
├── src/
│   ├── game.py              # Main game controller
│   ├── cli_game.py          # CLI interface
│   ├── entities/            # Player, NPCs, snacks
│   ├── world/               # Kitchen generation
│   └── systems/             # Time loop, stealth, progression
├── data/config.json         # Game configuration
├── test_game_logic.py       # Test suite (11 tests)
└── simulate_game.py         # Auto-play demo
```

## ✨ Features

- ✅ Complete game logic (no frontend required)
- ✅ Time loop system with 60-second cycles
- ✅ NPC AI with patrol and detection
- ✅ Stealth and noise mechanics
- ✅ Progression and unlock system
- ✅ Save/load functionality
- ✅ Comprehensive test suite (11/11 passing)

## 🚀 Next Steps

**Phase 2:** Add Pygame frontend with graphics, animations, and UI

See [ROADMAP.md](ROADMAP.md) for full development plan.

## 🎨 Game Design

- **Genre:** Stealth Roguelike
- **Loop Duration:** 60 seconds
- **Perspective:** Top-down
- **Art Style:** Pixel art (planned)
- **Target:** Short sessions, high replayability

## 🤝 Contributing

The game logic is complete and ready for frontend integration. Check [GAME_LOGIC_DOCUMENTATION.md](GAME_LOGIC_DOCUMENTATION.md) for API details.

---

**Built with Python** | **Game logic complete** | **Frontend coming soon**

🦝 Happy trash panda heisting! 🦝
