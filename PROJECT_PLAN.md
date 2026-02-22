# Trash Panda Loops - 8-10 Hour Scope

## Game Concept
A simple roguelike where you're a raccoon stealing snacks from a fridge in 60-second time loops. Learn the layout, avoid the human, grab snacks, escape.

## Core Mechanics (MINIMAL)
- 60-second time loop
- Grid-based movement (simple, no collision complexity)
- One human NPC with predictable patrol
- Collect 3 snack types from fridge
- Get caught = loop resets
- Score tracking across loops

## Game Name
**Trash Panda Loops**

## Tech Stack
- Python + Pygame
- Colored rectangles (no sprites needed)
- Simple text UI

## Simplified Structure
```
trash-panda-loops/
├── src/
│   ├── main.py           # Entry + game loop (150 lines)
│   ├── player.py         # Player entity (80 lines)
│   ├── npc.py            # Simple patrol NPC (60 lines)
│   ├── kitchen.py        # Static grid layout (100 lines)
│   └── config.py         # Constants (30 lines)
├── requirements.txt
└── README.md
```

## 8-10 Hour Timeline
- Hour 1-2: Core game loop, player movement, grid rendering
- Hour 3-4: Time loop system, NPC patrol, collision
- Hour 5-6: Fridge interaction, snack collection, scoring
- Hour 7-8: Detection/reset logic, win condition
- Hour 9-10: Polish, balance, menu, bug fixes

## What's CUT (for speed)
- ❌ Procedural generation (static layout only)
- ❌ Meta-progression/unlocks
- ❌ Multiple NPCs
- ❌ Stealth complexity (just "in sight = caught")
- ❌ Sprites/art (colored shapes only)
- ❌ Sound effects
- ❌ Complex AI
