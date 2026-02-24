# Trash Panda Loops - Game Design Document

## High Concept
A stealth roguelike where you play as a raccoon stuck in a 60-second time loop, repeatedly raiding a kitchen to steal the ultimate snack while learning NPC patterns and unlocking new abilities.

## Core Pillars

### 1. Time Loop Mastery
- Each run is exactly 60 seconds
- Knowledge persists across loops
- Learn optimal routes and timing
- Unlock shortcuts and abilities

### 2. Risk vs Reward
- Better snacks are harder to reach
- More valuable items make more noise
- Push your luck or play it safe
- Balance speed with stealth

### 3. Emergent Gameplay
- NPC patrol patterns create puzzles
- Multiple solutions to each loop
- Player creativity rewarded
- Speedrun potential

## Game Loop

```
Start Loop (60s timer begins)
    ↓
Explore Kitchen
    ↓
Avoid/Evade NPCs
    ↓
Collect Snacks
    ↓
[Detection] → Loop Resets → Keep Unlocks
    ↓
[Time Expires] → Score → Earn Points → Unlock Abilities
    ↓
Next Loop (with new abilities)
```

## Core Mechanics

### Movement
- Grid-based or free movement
- 4-directional (up/down/left/right)
- Speed affected by abilities
- Collision with obstacles

### Stealth
**Noise Generation:**
- Walking: Low noise
- Running: High noise
- Collecting items: Variable noise
- Opening containers: High noise

**Detection:**
- Visual: NPCs have cone of vision
- Audio: NPCs hear noise in radius
- Accumulation: Detection builds over time
- Threshold: 100% = caught

**Hiding:**
- Reduces detection rate
- Cannot move while hiding
- Strategic positioning important

### Time Loop
**Loop Duration:** 60 seconds

**Loop End Conditions:**
1. Detected (caught by NPC)
2. Time expires (success)

**Persistence:**
- Unlocked abilities carry over
- Knowledge of layout/patterns
- Progression points
- Statistics

**Reset:**
- Player position
- NPC positions
- Item locations
- Detection level

### Progression

**Scoring:**
```
Base Score = Σ(Snack Values)
Time Bonus = Remaining Seconds × 2
Stealth Bonus = (100 - Detection%) × 0.5
Final Score = Base + Time + Stealth
```

**Points:**
- Earned from loop scores
- Spent on permanent unlocks
- Accumulate across sessions

**Unlockable Abilities:**

| Ability | Cost | Effect |
|---------|------|--------|
| Trash Dash | 50 | Burst of speed (cooldown) |
| Silent Paws | 100 | 50% noise reduction (passive) |
| Time Sense | 150 | See NPC patrol routes (passive) |
| Veteran | Achievement | +10% score bonus |
| Glutton | Achievement | Larger inventory |

## Entities

### Player (Raccoon)
**Attributes:**
- Position
- Speed: 4 units/sec
- Noise Level: 0-100
- Inventory: Collected snacks
- Abilities: Unlocked powers

**States:**
- Moving
- Hiding
- Interacting

### NPCs

#### Human
**Behavior:**
- Slow patrol (speed: 2)
- Good vision (range: 150)
- Moderate hearing (range: 100)
- Investigates suspicious sounds

**Patrol Pattern:**
- Fixed waypoint route
- Pauses at waypoints
- Predictable timing

**Detection:**
- Visual: Line of sight required
- Audio: Responds to noise >30

#### Pet (Dog/Cat)
**Behavior:**
- Fast patrol (speed: 3)
- Moderate vision (range: 100)
- Excellent hearing (range: 120)
- More erratic movement

**Patrol Pattern:**
- Faster waypoint traversal
- Shorter pauses
- Less predictable

### Snacks

| Rarity | Spawn Rate | Value Range | Examples |
|--------|------------|-------------|----------|
| Common | 50% | 10-20 | Cheese, Crackers |
| Uncommon | 30% | 25-40 | Pizza, Sandwich |
| Rare | 15% | 50-75 | Cake, Pie |
| Legendary | 5% | 100+ | Birthday Cake, Feast |

**Properties:**
- Collection time (0.5-2s)
- Noise on collect (5-30)
- Special effects (future)

## World Design

### Kitchen Layout
**Size:** 20×15 tiles (640×480 pixels at 32px/tile)

**Zones:**
1. **Entry** (bottom-left) - Player spawn, safe zone
2. **Counter Area** (right side) - Common snacks, moderate risk
3. **Fridge Zone** (top-right) - Best snacks, high risk
4. **Table Area** (center) - Obstacle, hiding spots
5. **Cabinet Zone** (top-left) - Medium snacks, medium risk

**Tile Types:**
- Floor: Walkable
- Wall: Blocks movement and sight
- Counter: Obstacle, snack spawn
- Table: Obstacle, hiding spot
- Fridge: Interactive, best loot
- Cabinet: Interactive, medium loot
- Hiding Spot: Reduces detection

**Procedural Elements:**
- Snack positions randomized
- NPC patrol routes vary
- Obstacle placement shifts
- Unlock-gated shortcuts

## Progression Curve

### Early Game (Loops 1-5)
- Learn basic mechanics
- Discover kitchen layout
- Understand NPC patterns
- Collect common snacks
- Earn first 50 points

### Mid Game (Loops 6-15)
- Unlock Trash Dash
- Optimize routes
- Take calculated risks
- Target uncommon/rare snacks
- Earn 100-200 points

### Late Game (Loops 16+)
- All abilities unlocked
- Perfect runs possible
- Speedrun strategies
- Legendary snack hunting
- High score chasing

## Difficulty Scaling

**Dynamic Difficulty:**
- More NPCs after loop 5
- Faster NPC movement after loop 10
- Reduced snack spawn after loop 15
- Increased detection sensitivity

**Player Skill Curve:**
- Knowledge of patterns
- Unlocked abilities
- Optimized routes
- Risk management

## Meta Systems

### Statistics Tracking
- Total loops completed
- Total snacks collected
- Times detected
- Best loop score
- Average score
- Fastest completion
- Stealth runs (low detection)

### Achievements
- **First Heist** - Complete first loop
- **Trash Master** - Collect 100 total snacks
- **Ghost Panda** - Complete loop with <10% detection
- **Speed Demon** - Complete loop in <30 seconds
- **Glutton** - Collect 10 snacks in one loop
- **Veteran** - Complete 50 loops
- **Legendary Thief** - Collect a legendary snack

### Challenge Modes (Future)
- **Speed Run** - Fastest completion
- **Stealth Only** - Maximum detection limit
- **Pacifist** - No NPC alerts
- **Collector** - All snacks in one loop
- **Daily Challenge** - Fixed seed, leaderboard

## Audio Design (Future)

### Sound Effects
- Footsteps (volume = noise level)
- Snack collection (crunch, rustle)
- Fridge opening (loud)
- NPC alerts (gasp, bark)
- Detection warning (heartbeat)
- Loop reset (whoosh)
- Ability activation (swoosh)

### Music
- Ambient kitchen sounds
- Tension builds with detection
- Victory jingle on loop complete
- Calm menu theme

## Visual Design (Future)

### Art Style
- Pixel art (32×32 sprites)
- Top-down perspective
- Warm kitchen colors
- Cute raccoon design
- Expressive animations

### UI Elements
- Timer (prominent, color-coded)
- Detection meter (fills red)
- Noise indicator
- Minimap (with Time Sense)
- Inventory display
- Score popup

### Animations
- Raccoon waddle
- Hiding crouch
- Snack grab
- NPC patrol
- Detection alert
- Loop reset effect

## Narrative (Light)

### Setup
You're a clever raccoon who discovered a temporal anomaly in a suburban kitchen. Every 60 seconds, time resets, but you remember everything. Use this power to execute the perfect heist and claim the legendary snack hidden in the fridge.

### Environmental Storytelling
- Photos on fridge (family)
- Shopping list (hints at snacks)
- Pet bowl (warns of dog)
- Calendar (birthday = cake)

### Progression Flavor
- Unlock descriptions tell story
- Achievement text adds personality
- Loop counter = "attempts"

## Replayability

### Short-Term
- Optimize current run
- Try different routes
- Experiment with abilities
- Beat personal best

### Long-Term
- Unlock all abilities
- Complete all achievements
- Master speedruns
- Challenge modes
- Daily challenges

### Emergent
- NPC pattern variations
- Random snack spawns
- Player creativity
- Community strategies

## Technical Considerations

### Performance
- Target: 60 FPS
- Max NPCs: 3-4
- Efficient pathfinding
- Optimized collision detection

### Scalability
- Modular systems
- Data-driven design
- Easy to add content
- Frontend-agnostic logic

### Accessibility
- Colorblind modes
- Adjustable difficulty
- Pause functionality
- Clear visual feedback

## Future Expansions

### Content
- New kitchen layouts
- More NPC types (roommate, baby)
- Seasonal events
- New abilities
- More snack types

### Features
- Co-op multiplayer (2 raccoons)
- Level editor
- Custom challenges
- Replay system
- Leaderboards

### Platforms
- Desktop (Windows/Mac/Linux)
- Web browser
- Mobile (touch controls)
- Console (gamepad support)

## Success Metrics

### Engagement
- Average session length
- Loops per session
- Return rate
- Completion rate

### Progression
- Time to first unlock
- Unlock distribution
- Achievement completion
- Score progression

### Difficulty
- Detection rate
- Average loop score
- Ability usage
- Route diversity

## Conclusion

Trash Panda Loops combines the addictive loop of roguelikes with the tension of stealth games and the satisfaction of mastery through repetition. The time loop mechanic creates a unique gameplay experience where failure is learning and every run makes you better.

The game is designed to be:
- **Easy to learn** - Simple controls, clear goals
- **Hard to master** - Deep optimization, skill expression
- **Endlessly replayable** - Procedural elements, progression
- **Satisfying** - Immediate feedback, tangible improvement

Perfect for short play sessions or extended optimization marathons. 🦝
