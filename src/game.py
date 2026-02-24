"""
Core game loop and state management
"""
from entities.player import Player
from entities.npc import NPC, NPCType
from entities.snack import Snack
from world.kitchen import Kitchen
from systems.time_loop import TimeLoopSystem
from systems.stealth import StealthSystem
from systems.progression import ProgressionSystem
from systems.interaction import InteractionSystem
import json

class GameState:
    MENU = "menu"
    PLAYING = "playing"
    PAUSED = "paused"
    LOOP_RESET = "loop_reset"
    DETECTED = "detected"
    LOOP_COMPLETE = "loop_complete"

class Game:
    def __init__(self):
        self.state = GameState.MENU
        self.loop_count = 0
        self.run_id = 0
        
        # Load configuration
        self.config = self.load_config()
        
        # Initialize game systems
        self.kitchen = Kitchen()
        self.player = Player(self.kitchen.get_spawn_position())
        self.time_loop = TimeLoopSystem(loop_duration=self.config['game']['loop_duration'])
        self.stealth = StealthSystem(self.config['game']['detection_threshold'])
        self.progression = ProgressionSystem(self.config)
        self.interaction = InteractionSystem()
        
        # Game entities
        self.npcs = []
        self.snacks = []
        
        # Persistent data across loops
        self.total_snacks_collected = 0
        self.best_loop_score = 0
        self.total_loops = 0
        
    def load_config(self):
        """Load game configuration"""
        try:
            with open('data/config.json', 'r') as f:
                return json.load(f)
        except:
            return self.get_default_config()
    
    def get_default_config(self):
        """Default configuration if file not found"""
        return {
            "game": {"loop_duration": 60, "detection_threshold": 100},
            "player": {"speed": 4, "max_noise": 100},
            "snacks": [],
            "unlockables": []
        }
    
    def start_game(self):
        """Start a new game run"""
        self.state = GameState.PLAYING
        self.loop_count = 0
        self.run_id += 1
        self.total_loops = 0
        self.reset_loop()
        return {"status": "started", "run_id": self.run_id}
    
    def update(self, dt, player_action=None):
        """Main game update loop"""
        if self.state != GameState.PLAYING:
            return {"state": self.state}
        
        # Process player action
        if player_action:
            self.process_player_action(player_action)
        
        # Update time loop
        self.time_loop.update(dt)
        
        if self.time_loop.is_loop_complete():
            return self.complete_loop()
        
        # Update player
        self.player.update(dt, self.kitchen)
        
        # Update NPCs
        for npc in self.npcs:
            npc.update(dt, self.kitchen, self.player)
        
        # Update stealth system
        self.stealth.update(self.player, self.npcs, self.kitchen)
        
        # Check for detection
        if self.stealth.is_detected():
            return self.handle_detection()
        
        # Check for interactions
        nearby_objects = self.get_nearby_objects()
        if nearby_objects:
            self.interaction.set_available_interactions(nearby_objects)
        
        return self.get_game_state()
    
    def process_player_action(self, action):
        """Process player input action"""
        action_type = action.get('type')
        
        if action_type == 'move':
            direction = action.get('direction')
            self.player.move(direction, self.kitchen)
        
        elif action_type == 'interact':
            nearby = self.get_nearby_objects()
            if nearby:
                result = self.interaction.interact(self.player, nearby[0], self)
                if result.get('snack_collected'):
                    self.handle_snack_collection(result['snack'])
        
        elif action_type == 'hide':
            self.player.toggle_hide()
        
        elif action_type == 'use_ability':
            ability_id = action.get('ability_id')
            self.player.use_ability(ability_id)
    
    def get_nearby_objects(self):
        """Get objects near the player"""
        nearby = []
        player_pos = self.player.position
        
        # Check snacks
        for snack in self.snacks:
            if not snack.collected and self.calculate_distance(player_pos, snack.position) < 50:
                nearby.append(snack)
        
        # Check kitchen objects (fridge, etc.)
        kitchen_objects = self.kitchen.get_interactive_objects()
        for obj in kitchen_objects:
            if self.calculate_distance(player_pos, obj['position']) < 50:
                nearby.append(obj)
        
        return nearby
    
    def calculate_distance(self, pos1, pos2):
        """Calculate distance between two positions"""
        return ((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2)**0.5
    
    def handle_snack_collection(self, snack):
        """Handle collecting a snack"""
        self.player.collect_snack(snack)
        snack.collected = True
        self.total_snacks_collected += 1
    
    def handle_detection(self):
        """Handle player being detected"""
        self.state = GameState.DETECTED
        score = self.calculate_loop_score()
        
        result = {
            "state": "detected",
            "loop_count": self.loop_count,
            "score": score,
            "snacks_collected": len(self.player.inventory)
        }
        
        # Auto-reset after detection
        self.reset_loop()
        return result
    
    def complete_loop(self):
        """Handle successful loop completion"""
        self.state = GameState.LOOP_COMPLETE
        score = self.calculate_loop_score()
        
        # Award progression points
        points_earned = score
        self.progression.add_points(points_earned)
        
        if score > self.best_loop_score:
            self.best_loop_score = score
        
        result = {
            "state": "loop_complete",
            "loop_count": self.loop_count,
            "score": score,
            "snacks_collected": len(self.player.inventory),
            "points_earned": points_earned,
            "total_points": self.progression.total_points,
            "new_unlocks": self.progression.check_unlocks()
        }
        
        # Reset for next loop
        self.reset_loop()
        return result
    
    def calculate_loop_score(self):
        """Calculate score for current loop"""
        snack_value = sum(snack.value for snack in self.player.inventory)
        time_bonus = int(self.time_loop.get_remaining_time() * 2)
        stealth_bonus = int((100 - self.stealth.get_detection_level()) * 0.5)
        
        return snack_value + time_bonus + stealth_bonus
    
    def reset_loop(self):
        """Reset the time loop while maintaining meta-progression"""
        self.loop_count += 1
        self.total_loops += 1
        self.state = GameState.PLAYING
        
        # Reset systems
        self.time_loop.reset()
        self.stealth.reset()
        
        # Reset player
        self.player.reset_position(self.kitchen.get_spawn_position())
        
        # Regenerate kitchen (with some persistence)
        self.kitchen.reset_for_loop(self.loop_count)
        
        # Respawn NPCs
        self.spawn_npcs()
        
        # Respawn snacks
        self.spawn_snacks()
    
    def spawn_npcs(self):
        """Spawn NPCs in the kitchen"""
        self.npcs = []
        
        # Spawn human
        human_spawn = self.kitchen.get_npc_spawn_position(NPCType.HUMAN)
        human = NPC(human_spawn, NPCType.HUMAN)
        human.set_patrol_route(self.kitchen.get_patrol_route('human'))
        self.npcs.append(human)
        
        # Spawn pet (if unlocked or after certain loops)
        if self.loop_count > 3:
            pet_spawn = self.kitchen.get_npc_spawn_position(NPCType.PET)
            pet = NPC(pet_spawn, NPCType.PET)
            pet.set_patrol_route(self.kitchen.get_patrol_route('pet'))
            self.npcs.append(pet)
    
    def spawn_snacks(self):
        """Spawn snacks in the kitchen"""
        self.snacks = []
        snack_positions = self.kitchen.get_snack_spawn_positions()
        
        for pos in snack_positions:
            snack_data = self.progression.get_random_snack()
            snack = Snack(pos, snack_data)
            self.snacks.append(snack)
    
    def get_game_state(self):
        """Get current game state for external systems"""
        return {
            "state": self.state,
            "loop_count": self.loop_count,
            "time_remaining": self.time_loop.get_remaining_time(),
            "player": self.player.get_state(),
            "npcs": [npc.get_state() for npc in self.npcs],
            "snacks": [snack.get_state() for snack in self.snacks if not snack.collected],
            "detection_level": self.stealth.get_detection_level(),
            "available_interactions": self.interaction.get_available_interactions(),
            "progression": self.progression.get_state()
        }
    
    def unlock_ability(self, ability_id):
        """Unlock an ability using progression points"""
        result = self.progression.unlock_ability(ability_id)
        if result['success']:
            self.player.add_ability(ability_id)
        return result
    
    def get_available_unlocks(self):
        """Get list of available unlocks"""
        return self.progression.get_available_unlocks()
    
    def save_game(self):
        """Save game progress"""
        save_data = {
            "total_loops": self.total_loops,
            "total_snacks": self.total_snacks_collected,
            "best_score": self.best_loop_score,
            "progression": self.progression.get_save_data()
        }
        return save_data
    
    def load_game(self, save_data):
        """Load game progress"""
        self.total_loops = save_data.get("total_loops", 0)
        self.total_snacks_collected = save_data.get("total_snacks", 0)
        self.best_loop_score = save_data.get("best_score", 0)
        self.progression.load_save_data(save_data.get("progression", {}))
