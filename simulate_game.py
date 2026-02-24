"""
Automated game simulation to demonstrate full gameplay
"""
import sys
sys.path.insert(0, 'src')

from game import Game
import random
import time

class GameSimulator:
    def __init__(self):
        self.game = Game()
    
    def simulate_loop(self, loop_number, max_duration=60):
        """Simulate one complete loop"""
        print(f"\n{'='*60}")
        print(f"🦝 LOOP #{loop_number}")
        print(f"{'='*60}")
        
        elapsed = 0
        dt = 0.5
        actions_taken = 0
        
        while elapsed < max_duration:
            # Choose random action
            action = self.choose_action()
            
            # Update game
            result = self.game.update(dt, action)
            elapsed += dt
            actions_taken += 1
            
            # Log interesting events
            if actions_taken % 20 == 0:
                self.log_status(elapsed)
            
            # Check if loop ended
            state = result.get('state')
            if state == 'detected':
                print(f"\n🚨 DETECTED at {elapsed:.1f}s!")
                print(f"   Score: {result['score']}")
                print(f"   Snacks: {result['snacks_collected']}")
                return 'detected'
            elif state == 'loop_complete':
                print(f"\n⏰ LOOP COMPLETE at {elapsed:.1f}s!")
                print(f"   Score: {result['score']}")
                print(f"   Snacks: {result['snacks_collected']}")
                print(f"   Points earned: {result['points_earned']}")
                return 'complete'
        
        return 'timeout'
    
    def choose_action(self):
        """Choose a random action"""
        actions = [
            {'type': 'move', 'direction': [1, 0]},
            {'type': 'move', 'direction': [-1, 0]},
            {'type': 'move', 'direction': [0, 1]},
            {'type': 'move', 'direction': [0, -1]},
            {'type': 'interact'},
        ]
        
        # Sometimes hide if detection is high
        if self.game.stealth.get_detection_level() > 60:
            if random.random() < 0.3:
                return {'type': 'hide'}
        
        return random.choice(actions)
    
    def log_status(self, elapsed):
        """Log current game status"""
        state = self.game.get_game_state()
        player = state['player']
        
        print(f"\n[{elapsed:.1f}s] Status:")
        print(f"  Position: ({player['position'][0]:.0f}, {player['position'][1]:.0f})")
        print(f"  Snacks: {len(player['inventory'])}")
        print(f"  Detection: {state['detection_level']:.1f}%")
        print(f"  Noise: {player['noise_level']:.0f}")
    
    def run_simulation(self, num_loops=5):
        """Run a full game simulation"""
        print("=" * 60)
        print("🦝 TRASH PANDA LOOPS - Game Simulation")
        print("=" * 60)
        print("\nStarting automated gameplay simulation...")
        print("This will demonstrate the full game logic in action.")
        
        # Start game
        self.game.start_game()
        print(f"\n✓ Game started (Run ID: {self.game.run_id})")
        
        # Simulate multiple loops
        results = []
        for i in range(1, num_loops + 1):
            result = self.simulate_loop(i)
            results.append(result)
            
            # Check for unlocks after each loop
            if self.game.progression.total_points >= 50:
                unlocks = self.game.get_available_unlocks()
                if unlocks:
                    unlock = unlocks[0]
                    if unlock['can_afford']:
                        result = self.game.unlock_ability(unlock['id'])
                        if result['success']:
                            print(f"\n✨ Unlocked: {unlock['name']}!")
            
            time.sleep(1)  # Pause between loops
        
        # Final summary
        self.print_summary(results)
    
    def print_summary(self, results):
        """Print final game summary"""
        print("\n" + "=" * 60)
        print("📊 SIMULATION SUMMARY")
        print("=" * 60)
        
        print(f"\nTotal loops: {len(results)}")
        print(f"Completed: {results.count('complete')}")
        print(f"Detected: {results.count('detected')}")
        
        save_data = self.game.save_game()
        print(f"\nTotal snacks collected: {save_data['total_snacks']}")
        print(f"Best loop score: {save_data['best_score']}")
        print(f"Progression points: {save_data['progression']['total_points']}")
        
        unlocked = save_data['progression']['unlocked_abilities']
        if unlocked:
            print(f"Unlocked abilities: {', '.join(unlocked)}")
        
        print("\n" + "=" * 60)
        print("🎮 Simulation complete!")
        print("=" * 60)

def main():
    """Main entry point"""
    simulator = GameSimulator()
    
    # Run simulation
    try:
        simulator.run_simulation(num_loops=3)
    except KeyboardInterrupt:
        print("\n\nSimulation interrupted by user.")
    except Exception as e:
        print(f"\n\nError during simulation: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
