"""
CLI interface for testing the game logic
"""
from game import Game
import time

class CLIGame:
    def __init__(self):
        self.game = Game()
        self.running = False
    
    def start(self):
        """Start the CLI game"""
        print("=" * 60)
        print("TRASH PANDA LOOPS - CLI Edition")
        print("=" * 60)
        print("\nA raccoon roguelike about stealing snacks in time loops")
        print("\nCommands:")
        print("  start - Start a new game")
        print("  move <direction> - Move (up/down/left/right)")
        print("  interact - Interact with nearby objects")
        print("  hide - Toggle hiding")
        print("  status - Show current game state")
        print("  unlocks - Show available unlocks")
        print("  unlock <ability_id> - Unlock an ability")
        print("  quit - Exit game")
        print()
        
        self.running = True
        self.command_loop()
    
    def command_loop(self):
        """Main command loop"""
        while self.running:
            try:
                command = input("> ").strip().lower()
                self.process_command(command)
            except KeyboardInterrupt:
                print("\nExiting...")
                break
            except Exception as e:
                print(f"Error: {e}")
    
    def process_command(self, command):
        """Process user command"""
        parts = command.split()
        if not parts:
            return
        
        cmd = parts[0]
        
        if cmd == "start":
            result = self.game.start_game()
            print(f"\n🦝 Game started! Run ID: {result['run_id']}")
            print(f"Loop #1 begins. You have 60 seconds to steal snacks!")
            self.show_status()
        
        elif cmd == "move":
            if len(parts) < 2:
                print("Usage: move <up/down/left/right>")
                return
            
            direction_map = {
                'up': [0, -1],
                'down': [0, 1],
                'left': [-1, 0],
                'right': [1, 0]
            }
            
            direction = direction_map.get(parts[1])
            if not direction:
                print("Invalid direction. Use: up, down, left, right")
                return
            
            action = {'type': 'move', 'direction': direction}
            result = self.game.update(0.5, action)
            self.handle_update_result(result)
        
        elif cmd == "interact":
            action = {'type': 'interact'}
            result = self.game.update(0.1, action)
            self.handle_update_result(result)
        
        elif cmd == "hide":
            action = {'type': 'hide'}
            result = self.game.update(0.1, action)
            print(f"🙈 {'Hiding...' if self.game.player.is_hiding else 'No longer hiding'}")
        
        elif cmd == "status":
            self.show_status()
        
        elif cmd == "unlocks":
            self.show_unlocks()
        
        elif cmd == "unlock":
            if len(parts) < 2:
                print("Usage: unlock <ability_id>")
                return
            
            ability_id = parts[1]
            result = self.game.unlock_ability(ability_id)
            if result['success']:
                print(f"✨ {result['message']}")
            else:
                print(f"❌ {result['message']}")
        
        elif cmd == "wait":
            # Simulate time passing
            duration = float(parts[1]) if len(parts) > 1 else 5.0
            result = self.game.update(duration)
            self.handle_update_result(result)
        
        elif cmd == "quit":
            print("Thanks for playing!")
            self.running = False
        
        else:
            print(f"Unknown command: {cmd}")
    
    def handle_update_result(self, result):
        """Handle game update result"""
        state = result.get('state')
        
        if state == 'detected':
            print("\n🚨 DETECTED! The humans caught you!")
            print(f"Loop #{result['loop_count']} ended")
            print(f"Score: {result['score']}")
            print(f"Snacks collected: {result['snacks_collected']}")
            print("\n⏰ Time loop resets...")
        
        elif state == 'loop_complete':
            print("\n⏰ TIME'S UP! Loop complete!")
            print(f"Loop #{result['loop_count']} ended")
            print(f"Score: {result['score']}")
            print(f"Snacks collected: {result['snacks_collected']}")
            print(f"Points earned: {result['points_earned']}")
            
            if result.get('new_unlocks'):
                print(f"🎉 New unlocks available: {result['new_unlocks']}")
            
            print("\n⏰ Starting next loop...")
    
    def show_status(self):
        """Show current game status"""
        state = self.game.get_game_state()
        
        print("\n" + "=" * 60)
        print(f"Loop #{self.game.loop_count} | Time: {state['time_remaining']:.1f}s")
        print("=" * 60)
        
        player = state['player']
        print(f"\n🦝 Player:")
        print(f"  Position: ({player['position'][0]:.0f}, {player['position'][1]:.0f})")
        print(f"  Noise Level: {player['noise_level']:.0f}/100")
        print(f"  Hiding: {'Yes' if player['is_hiding'] else 'No'}")
        print(f"  Hunger: {player['hunger']:.0f}/100")
        print(f"  Snacks: {len(player['inventory'])}")
        
        if player['abilities']:
            print(f"  Abilities: {', '.join(player['abilities'])}")
        
        print(f"\n👁️  Detection Level: {state['detection_level']:.1f}%")
        
        if state['npcs']:
            print(f"\n👤 NPCs:")
            for npc in state['npcs']:
                print(f"  {npc['type']}: {npc['state']} at ({npc['position'][0]:.0f}, {npc['position'][1]:.0f})")
        
        if state['snacks']:
            print(f"\n🧀 Available Snacks: {len(state['snacks'])}")
            for snack in state['snacks'][:3]:  # Show first 3
                print(f"  {snack['name']} ({snack['rarity']}) - Value: {snack['value']}")
        
        if state['available_interactions']:
            print(f"\n💡 Available Actions: {', '.join(state['available_interactions'])}")
        
        prog = state['progression']
        print(f"\n⭐ Progression:")
        print(f"  Points: {prog['total_points']}")
        print(f"  Unlocked: {len(prog['unlocked_abilities'])} abilities")
        print()
    
    def show_unlocks(self):
        """Show available unlocks"""
        unlocks = self.game.get_available_unlocks()
        
        print("\n" + "=" * 60)
        print("AVAILABLE UNLOCKS")
        print("=" * 60)
        
        if not unlocks:
            print("All abilities unlocked!")
            return
        
        for unlock in unlocks:
            affordable = "✓" if unlock['can_afford'] else "✗"
            print(f"\n{affordable} {unlock['name']} ({unlock['id']})")
            print(f"  Cost: {unlock['cost']} points")
            print(f"  {unlock['description']}")
        
        print(f"\nYour points: {self.game.progression.total_points}")
        print()

if __name__ == "__main__":
    cli = CLIGame()
    cli.start()
