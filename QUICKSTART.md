# Quick Start Guide - Trash Panda Loops

## What You Have

A **fully functional roguelike game engine** with:
- ✅ Complete game logic (no frontend required)
- ✅ Time loop mechanics
- ✅ Stealth and detection system
- ✅ NPC AI with patrol and investigation
- ✅ Progression and unlock system
- ✅ Snack collection and scoring
- ✅ Save/load functionality
- ✅ Comprehensive test suite

## Testing the Game (No Frontend Needed!)

### 1. Run the Test Suite
```bash
python test_game_logic.py
```
This runs 11 comprehensive tests covering all game systems.

### 2. Play via CLI
```bash
python src/cli_game.py
```

**CLI Commands:**
- `start` - Begin a new game
- `move up/down/left/right` - Move the raccoon
- `interact` - Collect snacks or open objects
- `hide` - Toggle hiding to reduce detection
- `status` - See full game state
- `wait 5` - Simulate 5 seconds passing
- `unlocks` - View available abilities
- `unlock dash` - Purchase an ability
- `quit` - Exit

**Example Session:**
```
> start
> move right
> move right
> interact
> status
> move up
> hide
> wait 10
> status
```

### 3. Watch Automated Simulation
```bash
python simulate_game.py
```
This runs 3 complete loops automatically, demonstrating:
- Random movement and exploration
- Snack collection
- Detection avoidance
- Ability unlocking
- Score calculation

## Game Mechanics Summary

### Time Loop
- Each loop lasts 60 seconds
- Collect as many snacks as possible
- Avoid detection by humans and pets
- Loop resets on detection or time expiration
- Progress (unlocks) persists across loops

### Stealth
- Movement generates noise
- NPCs detect via sight and sound
- Hiding reduces detection
- Detection accumulates to 100% = caught

### Scoring
```
Score = Snack Value + Time Bonus + Stealth Bonus
```

### Progression
- Earn points from loop scores
- Spend points on abilities:
  - **Dash** (50pts) - Burst of speed
  - **Silent Paws** (100pts) - Reduced noise
  - **Time Sense** (150pts) - See NPC routes

## Project Structure

```
trash-panda-loops/
├── src/
│   ├── game.py              # Main game controller
│   ├── cli_game.py          # CLI interface
│   ├── entities/
│   │   ├── player.py        # Raccoon player
│   │   ├── npc.py           # Humans and pets
│   │   └── snack.py         # Collectible items
│   ├── world/
│   │   └── kitchen.py       # Level generation
│   └── systems/
│       ├── time_loop.py     # 60-second timer
│       ├── stealth.py       # Detection logic
│       ├── progression.py   # Unlocks and stats
│       └── interaction.py   # Object interactions
├── data/
│   └── config.json          # Game balance data
├── test_game_logic.py       # Test suite
├── simulate_game.py         # Auto-play demo
└── GAME_LOGIC_DOCUMENTATION.md  # Full API docs
```

## Next Steps

### Option 1: Add Pygame Frontend
The game is designed to work with Pygame. Key integration points:
- `Game.get_game_state()` - Get all data for rendering
- `Game.update(dt, action)` - Process input and update
- Render based on positions in game state

### Option 2: Add Web Frontend
Use the same game logic with a web interface:
- Run game in Python backend
- Send state via WebSocket/REST
- Render in HTML5 Canvas or WebGL

### Option 3: Extend Game Logic
Add more features:
- New NPC types (cats, dogs, roommates)
- Multiple kitchen layouts
- More abilities and snacks
- Challenge modes
- Multiplayer support

## Configuration

Edit `data/config.json` to modify:
- Loop duration
- Detection threshold
- Player speed
- Snack types and rarities
- Unlock costs

## API Example

```python
from game import Game

# Create game
game = Game()

# Start playing
game.start_game()

# Game loop
while True:
    # Get player input (from keyboard, AI, etc.)
    action = {'type': 'move', 'direction': [1, 0]}
    
    # Update game (0.016 = 60 FPS)
    result = game.update(0.016, action)
    
    # Check for loop end
    if result.get('state') in ['detected', 'loop_complete']:
        print(f"Loop ended! Score: {result['score']}")
    
    # Get state for rendering
    state = game.get_game_state()
    # Render state.player, state.npcs, state.snacks, etc.
```

## Troubleshooting

**Import errors?**
- Make sure you're running from the project root
- Python 3.7+ required

**Tests failing?**
- Check that all files in `src/` are present
- Verify `data/config.json` exists

**Want to modify game balance?**
- Edit `data/config.json`
- Adjust speeds, detection rates, costs

## Have Fun!

The game is fully playable via CLI right now. Try to:
- 🎯 Collect 10 snacks in one loop
- 🥷 Complete a loop with <20% detection
- ⭐ Unlock all abilities
- 🏆 Beat your high score

Enjoy your trash panda adventure! 🦝
