# Trash Panda Loops - Game Logic Documentation

## Overview
Complete backend implementation of a raccoon-themed roguelike with time loop mechanics. All game logic is functional and testable without a frontend.

## Architecture

### Core Systems

#### 1. Game Manager (`src/game.py`)
Central controller managing all game systems and state.

**Key Methods:**
- `start_game()` - Initialize new game run
- `update(dt, player_action)` - Main game loop tick
- `reset_loop()` - Reset for new time loop iteration
- `get_game_state()` - Export current state for frontend
- `save_game()` / `load_game()` - Persistence

**Game States:**
- MENU - Initial state
- PLAYING - Active gameplay
- PAUSED - Game paused
- DETECTED - Player caught
- LOOP_COMPLETE - Time expired

#### 2. Time Loop System (`src/systems/time_loop.py`)
Manages the 60-second loop cycle.

**Features:**
- Configurable loop duration
- Progress tracking
- Automatic reset trigger
- Remaining time calculation

#### 3. Stealth System (`src/systems/stealth.py`)
Handles detection mechanics.

**Detection Factors:**
- Player noise level
- NPC proximity and line of sight
- Hiding state
- Movement patterns

**Detection accumulates over time and triggers loop reset at threshold.**

#### 4. Progression System (`src/systems/progression.py`)
Meta-progression across loops.

**Features:**
- Point accumulation from loop scores
- Ability unlocking system
- Stat tracking
- Achievement system
- Save/load support

**Unlockable Abilities:**
- Dash - Burst of speed
- Silent Paws - Reduced noise
- Time Sense - See NPC routes

#### 5. Interaction System (`src/systems/interaction.py`)
Manages player-object interactions.

**Interactions:**
- Snack collection
- Fridge opening (spawns snacks)
- Cabinet access
- Hiding spot usage

### Entities

#### Player (`src/entities/player.py`)
The raccoon protagonist.

**Attributes:**
- Position, speed, noise level
- Inventory (collected snacks)
- Hiding state
- Unlocked abilities
- Hunger and stamina

**Actions:**
- Move in 4 directions
- Interact with objects
- Toggle hiding
- Use abilities

#### NPC (`src/entities/npc.py`)
Humans and pets that patrol and detect.

**Types:**
- HUMAN - Slower, better vision
- PET - Faster, better hearing

**Behaviors:**
- PATROLLING - Follow waypoint route
- INVESTIGATING - Check noise source
- ALERTED - Player detected

**Detection:**
- Visual (line of sight based)
- Audio (noise based)
- Accumulation system

#### Snack (`src/entities/snack.py`)
Collectible items with varying value.

**Rarities:**
- Common (50% spawn rate)
- Uncommon (30%)
- Rare (15%)
- Legendary (5%)

**Properties:**
- Value (points)
- Collection noise
- Collection time

### World

#### Kitchen (`src/world/kitchen.py`)
Procedurally generated play area.

**Tile Types:**
- Floor - Walkable
- Wall - Blocks movement and sight
- Fridge - Interactive, contains snacks
- Counter - Obstacle
- Table - Obstacle
- Cabinet - Interactive
- Hiding Spot - Reduces detection

**Features:**
- Collision detection
- Line of sight calculation
- Patrol route generation
- Snack spawn positions
- Interactive object management

## Game Flow

### 1. Game Start
```
Game.start_game()
  → Initialize loop #1
  → Spawn NPCs with patrol routes
  → Spawn snacks at random positions
  → Reset player to spawn point
  → Start 60-second timer
```

### 2. Game Loop
```
Game.update(dt, player_action)
  → Process player action (move/interact/hide)
  → Update time loop timer
  → Update player state (noise decay, abilities)
  → Update NPCs (patrol, detection)
  → Update stealth system (detection accumulation)
  → Check win/lose conditions
  → Return game state
```

### 3. Loop End Conditions

**Detection (Loss):**
- Detection level reaches 100%
- Calculate score (snacks + time + stealth bonus)
- Award progression points
- Reset loop

**Time Complete (Win):**
- 60 seconds elapsed
- Calculate score with time bonus
- Award progression points
- Check for new unlocks
- Reset loop

### 4. Loop Reset
```
Game.reset_loop()
  → Increment loop counter
  → Reset time to 0
  → Reset detection to 0
  → Clear player inventory
  → Respawn NPCs
  → Respawn snacks
  → Maintain unlocked abilities
```

## Scoring System

```
Score = Snack Value + Time Bonus + Stealth Bonus

Snack Value: Sum of all collected snacks
Time Bonus: Remaining seconds × 2
Stealth Bonus: (100 - Detection Level) × 0.5
```

## Progression System

### Point Earning
- Points = Loop Score
- Accumulate across all loops
- Persist between game sessions

### Unlocks
Each ability has a point cost:
- Dash: 50 points
- Silent Paws: 100 points
- Time Sense: 150 points

### Stats Tracked
- Total snacks collected
- Loops completed
- Times detected
- Best loop score

## Testing

### Unit Tests (`test_game_logic.py`)
Comprehensive test suite covering:
- Game initialization
- Player movement and collision
- Time loop mechanics
- NPC behavior and detection
- Snack collection
- Stealth system
- Progression and unlocks
- Kitchen generation
- Interaction system
- Save/load functionality

**Run tests:**
```bash
python test_game_logic.py
```

### CLI Interface (`src/cli_game.py`)
Interactive command-line interface for manual testing.

**Commands:**
- `start` - Begin new game
- `move <direction>` - Move player
- `interact` - Interact with nearby objects
- `hide` - Toggle hiding
- `status` - Show game state
- `unlocks` - View available unlocks
- `unlock <id>` - Purchase ability
- `wait <seconds>` - Simulate time passing

**Run CLI:**
```bash
python src/cli_game.py
```

### Simulation (`simulate_game.py`)
Automated gameplay demonstration.

**Features:**
- Runs multiple loops automatically
- Random action selection
- Smart hiding when detection high
- Automatic ability unlocking
- Final statistics summary

**Run simulation:**
```bash
python simulate_game.py
```

## Configuration

### Game Config (`data/config.json`)
```json
{
  "game": {
    "loop_duration": 60,
    "detection_threshold": 100
  },
  "player": {
    "speed": 4,
    "max_noise": 100
  },
  "snacks": [...],
  "unlockables": [...]
}
```

## API for Frontend Integration

### Starting a Game
```python
game = Game()
result = game.start_game()
# Returns: {"status": "started", "run_id": 1}
```

### Game Update Loop
```python
# Player action format
action = {
    'type': 'move',  # or 'interact', 'hide', 'use_ability'
    'direction': [1, 0],  # for move actions
    'ability_id': 'dash'  # for ability actions
}

result = game.update(delta_time, action)
# Returns full game state or loop end result
```

### Getting Game State
```python
state = game.get_game_state()
# Returns:
{
    "state": "playing",
    "loop_count": 1,
    "time_remaining": 45.5,
    "player": {...},
    "npcs": [...],
    "snacks": [...],
    "detection_level": 25.0,
    "available_interactions": [...],
    "progression": {...}
}
```

### Unlocking Abilities
```python
result = game.unlock_ability('dash')
# Returns: {"success": True/False, "message": "..."}
```

### Save/Load
```python
# Save
save_data = game.save_game()

# Load
game.load_game(save_data)
```

## Extension Points

### Adding New Snacks
Edit `data/config.json`:
```json
{
  "name": "Golden Donut",
  "value": 75,
  "rarity": "rare",
  "noise": 20,
  "collect_time": 1.0
}
```

### Adding New Abilities
1. Add to `data/config.json` unlockables
2. Implement logic in `Player.use_ability()`
3. Add cooldown in `Player.ability_cooldowns`

### Adding New NPC Types
1. Add type to `NPCType` class
2. Configure in `NPC.__init__()`
3. Add spawn logic in `Game.spawn_npcs()`

### Procedural Generation
Modify `Kitchen.generate()` to create varied layouts based on seed or loop count.

## Performance Considerations

- Game loop runs at configurable tick rate
- Spatial queries use simple distance checks
- Line of sight uses step-based raycasting
- NPC count limited to prevent slowdown
- State serialization for save/load is lightweight

## Future Enhancements

1. **Multiple Kitchen Layouts** - Procedural generation with themes
2. **More NPC Types** - Cats, dogs, roommates with unique behaviors
3. **Combo System** - Bonus for collecting specific snack combinations
4. **Challenge Modes** - Speed runs, stealth only, maximum snacks
5. **Persistent World Elements** - Some objects remember state across loops
6. **Narrative Elements** - Story progression through loops
7. **Multiplayer** - Co-op raccoon heists

## Conclusion

The game logic is fully implemented and testable. All core systems work together to create a complete roguelike experience. The architecture is modular and extensible, making it easy to add new features or connect different frontends (Pygame, web, mobile, etc.).
