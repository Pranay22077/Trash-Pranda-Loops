# Development Workflow

## Getting Started

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the game:
```bash
python src/main.py
```

## Development Roadmap

### Phase 1: Core Mechanics (Current)
- [x] Basic game loop
- [x] Player movement
- [x] Kitchen layout
- [x] Time loop system
- [x] Basic HUD
- [ ] Fridge interaction
- [ ] Snack collection
- [ ] Detection system refinement

### Phase 2: Content & Variety
- [ ] Multiple kitchen layouts
- [ ] NPC humans with patrol patterns
- [ ] Pet obstacles (dogs/cats)
- [ ] Various snack types with different values
- [ ] Sound effects and visual feedback

### Phase 3: Meta-Progression
- [ ] Unlock system between loops
- [ ] Persistent abilities (dash, silent movement, etc.)
- [ ] Shortcut discovery
- [ ] Achievement tracking
- [ ] Score/leaderboard system

### Phase 4: Polish
- [ ] Sprite art for raccoon and objects
- [ ] Particle effects
- [ ] Menu system improvements
- [ ] Tutorial/onboarding
- [ ] Balance tuning

## Testing Checklist

- [ ] Player can move in all directions
- [ ] Collision detection works correctly
- [ ] Time loop resets properly
- [ ] HUD displays accurate information
- [ ] Detection system responds to player actions
- [ ] Game can be paused and resumed

## Code Structure Guidelines

- Keep game logic separate from rendering
- Use systems for cross-cutting concerns (time, stealth, etc.)
- Entities should be self-contained
- Configuration should be data-driven (config.json)

## Future Ideas

- Multiple raccoon characters with different abilities
- Co-op multiplayer (two raccoons!)
- Daily challenge mode
- Speedrun timer
- Modding support
