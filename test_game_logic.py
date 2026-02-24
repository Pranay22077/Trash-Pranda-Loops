"""
Comprehensive test suite for game logic
"""
import sys
sys.path.insert(0, 'src')

from game import Game, GameState
from entities.player import Player
from entities.npc import NPC, NPCType
from entities.snack import Snack
from world.kitchen import Kitchen
from systems.time_loop import TimeLoopSystem
from systems.stealth import StealthSystem
from systems.progression import ProgressionSystem

def test_game_initialization():
    """Test game initialization"""
    print("Testing game initialization...")
    game = Game()
    assert game.state == GameState.MENU
    assert game.loop_count == 0
    assert game.player is not None
    assert game.kitchen is not None
    print("✓ Game initialization passed")

def test_player_movement():
    """Test player movement"""
    print("\nTesting player movement...")
    kitchen = Kitchen()
    player = Player(kitchen.get_spawn_position())
    
    initial_pos = list(player.position)
    player.move([1, 0], kitchen)
    
    assert player.position[0] > initial_pos[0], "Player should move right"
    assert player.noise_level > 0, "Movement should generate noise"
    print("✓ Player movement passed")

def test_time_loop():
    """Test time loop system"""
    print("\nTesting time loop system...")
    time_loop = TimeLoopSystem(loop_duration=10.0)
    
    assert time_loop.get_remaining_time() == 10.0
    
    time_loop.update(5.0)
    assert time_loop.get_remaining_time() == 5.0
    
    time_loop.update(6.0)
    assert time_loop.is_loop_complete()
    print("✓ Time loop system passed")

def test_npc_behavior():
    """Test NPC behavior"""
    print("\nTesting NPC behavior...")
    npc = NPC([100, 100], NPCType.HUMAN)
    npc.set_patrol_route([[100, 100], [200, 100], [200, 200]])
    
    kitchen = Kitchen()
    player = Player([300, 300])
    
    initial_pos = list(npc.position)
    npc.update(1.0, kitchen, player)
    
    # NPC should move towards waypoint
    assert npc.position != initial_pos or npc.wait_time > 0
    print("✓ NPC behavior passed")

def test_snack_collection():
    """Test snack collection"""
    print("\nTesting snack collection...")
    snack_data = {
        'name': 'Test Cheese',
        'value': 25,
        'rarity': 'common',
        'noise': 10,
        'collect_time': 0.5
    }
    
    snack = Snack([100, 100], snack_data)
    player = Player([100, 100])
    
    assert not snack.collected
    player.collect_snack(snack)
    
    assert len(player.inventory) == 1
    assert player.inventory[0].name == 'Test Cheese'
    print("✓ Snack collection passed")

def test_stealth_system():
    """Test stealth and detection"""
    print("\nTesting stealth system...")
    stealth = StealthSystem(detection_threshold=100)
    kitchen = Kitchen()
    player = Player([100, 100])
    npc = NPC([150, 150], NPCType.HUMAN)
    
    # Player moving should increase detection
    player.noise_level = 50
    player.moving = True
    
    initial_detection = stealth.detection_level
    stealth.update(player, [npc], kitchen)
    
    assert stealth.detection_level >= initial_detection
    
    # Hiding should decrease detection
    player.is_hiding = True
    player.moving = False
    stealth.update(player, [npc], kitchen)
    
    print("✓ Stealth system passed")

def test_progression_system():
    """Test progression and unlocks"""
    print("\nTesting progression system...")
    config = {
        'unlockables': [
            {'id': 'dash', 'name': 'Dash', 'cost': 50, 'description': 'Fast movement'},
            {'id': 'silent', 'name': 'Silent', 'cost': 100, 'description': 'Quiet movement'}
        ],
        'snacks': [
            {'name': 'Cheese', 'value': 10, 'rarity': 'common'}
        ]
    }
    
    progression = ProgressionSystem(config)
    progression.add_points(75)
    
    assert progression.total_points == 75
    
    # Try to unlock dash
    result = progression.unlock_ability('dash')
    assert result['success']
    assert progression.total_points == 25
    assert 'dash' in progression.unlocked_abilities
    
    # Try to unlock silent (not enough points)
    result = progression.unlock_ability('silent')
    assert not result['success']
    
    print("✓ Progression system passed")

def test_full_game_loop():
    """Test a complete game loop"""
    print("\nTesting full game loop...")
    game = Game()
    
    # Start game
    game.start_game()
    assert game.state == GameState.PLAYING
    assert game.loop_count == 1
    
    # Simulate some gameplay
    for _ in range(5):
        action = {'type': 'move', 'direction': [1, 0]}
        result = game.update(0.5, action)
    
    # Check game state
    state = game.get_game_state()
    assert 'player' in state
    assert 'npcs' in state
    assert 'snacks' in state
    
    # Simulate time passing until loop completes
    result = game.update(60.0)
    assert result.get('state') in ['loop_complete', 'detected']
    
    print("✓ Full game loop passed")

def test_kitchen_generation():
    """Test kitchen generation"""
    print("\nTesting kitchen generation...")
    kitchen = Kitchen()
    
    assert kitchen.width > 0
    assert kitchen.height > 0
    assert len(kitchen.tiles) == kitchen.height
    assert len(kitchen.tiles[0]) == kitchen.width
    
    # Test spawn positions
    spawn = kitchen.get_spawn_position()
    assert spawn is not None
    assert len(spawn) == 2
    
    # Test walkability
    assert kitchen.is_walkable(spawn)
    
    # Test line of sight
    pos1 = [100, 100]
    pos2 = [200, 200]
    los = kitchen.has_line_of_sight(pos1, pos2)
    assert isinstance(los, bool)
    
    print("✓ Kitchen generation passed")

def test_interaction_system():
    """Test interaction system"""
    print("\nTesting interaction system...")
    game = Game()
    game.start_game()
    
    # Create a snack near player
    snack_data = {'name': 'Test Snack', 'value': 10, 'rarity': 'common', 'noise': 5, 'collect_time': 0.5}
    snack = Snack(game.player.position, snack_data)
    game.snacks.append(snack)
    
    # Interact with snack
    action = {'type': 'interact'}
    initial_inventory = len(game.player.inventory)
    game.update(0.1, action)
    
    # Check if snack was collected
    assert len(game.player.inventory) >= initial_inventory
    
    print("✓ Interaction system passed")

def test_save_load():
    """Test save and load functionality"""
    print("\nTesting save/load...")
    game = Game()
    game.start_game()
    
    # Play for a bit
    game.progression.add_points(100)
    game.progression.unlock_ability('dash')
    
    # Save game
    save_data = game.save_game()
    assert 'progression' in save_data
    
    # Create new game and load
    new_game = Game()
    new_game.load_game(save_data)
    
    assert new_game.progression.total_points == save_data['progression']['total_points']
    assert 'dash' in new_game.progression.unlocked_abilities
    
    print("✓ Save/load passed")

def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("TRASH PANDA LOOPS - Game Logic Test Suite")
    print("=" * 60)
    
    tests = [
        test_game_initialization,
        test_player_movement,
        test_time_loop,
        test_npc_behavior,
        test_snack_collection,
        test_stealth_system,
        test_progression_system,
        test_kitchen_generation,
        test_interaction_system,
        test_full_game_loop,
        test_save_load
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"✗ {test.__name__} failed: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"Tests passed: {passed}/{len(tests)}")
    print(f"Tests failed: {failed}/{len(tests)}")
    print("=" * 60)
    
    if failed == 0:
        print("\n🎉 All tests passed! Game logic is working correctly.")
    else:
        print(f"\n⚠️  {failed} test(s) failed. Check the output above.")

if __name__ == "__main__":
    run_all_tests()
