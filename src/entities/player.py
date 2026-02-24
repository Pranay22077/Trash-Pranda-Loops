"""
Player (Raccoon) entity
"""

class Player:
    def __init__(self, position):
        self.position = list(position)
        self.speed = 4
        self.inventory = []
        self.noise_level = 0
        self.is_hiding = False
        self.moving = False
        
        # Abilities
        self.abilities = {}
        self.active_ability = None
        self.ability_cooldowns = {}
        
        # Stats
        self.hunger = 100
        self.stamina = 100
    
    def move(self, direction, kitchen):
        """Move player in a direction"""
        if self.is_hiding:
            return False
        
        # Calculate new position
        move_speed = self.speed
        if 'dash' in self.abilities and self.active_ability == 'dash':
            move_speed *= 2
        
        new_pos = [
            self.position[0] + direction[0] * move_speed,
            self.position[1] + direction[1] * move_speed
        ]
        
        # Check collision
        if kitchen.is_walkable(new_pos):
            self.position = new_pos
            
            # Generate noise
            noise_multiplier = 0.5 if 'silent_paws' in self.abilities else 1.0
            self.noise_level = min(100, self.noise_level + 2 * noise_multiplier)
            
            self.moving = True
            return True
        
        return False
    
    def update(self, dt, kitchen):
        """Update player state"""
        # Decay noise over time
        if not self.moving:
            self.noise_level = max(0, self.noise_level - 1)
        
        self.moving = False
        
        # Update ability cooldowns
        for ability_id in list(self.ability_cooldowns.keys()):
            self.ability_cooldowns[ability_id] -= dt
            if self.ability_cooldowns[ability_id] <= 0:
                del self.ability_cooldowns[ability_id]
        
        # Hunger decreases over time
        self.hunger = max(0, self.hunger - dt * 0.5)
    
    def toggle_hide(self):
        """Toggle hiding state"""
        self.is_hiding = not self.is_hiding
        if self.is_hiding:
            self.moving = False
    
    def collect_snack(self, snack):
        """Add snack to inventory"""
        self.inventory.append(snack)
        self.hunger = min(100, self.hunger + snack.value * 0.5)
        self.noise_level = min(100, self.noise_level + snack.noise_on_collect)
    
    def add_ability(self, ability_id):
        """Add an unlocked ability"""
        self.abilities[ability_id] = True
    
    def use_ability(self, ability_id):
        """Use an ability"""
        if ability_id not in self.abilities:
            return False
        
        if ability_id in self.ability_cooldowns:
            return False
        
        # Activate ability
        self.active_ability = ability_id
        
        # Set cooldown
        cooldowns = {
            'dash': 5.0,
            'silent_paws': 0,  # Passive
            'time_sense': 0    # Passive
        }
        
        if cooldowns.get(ability_id, 0) > 0:
            self.ability_cooldowns[ability_id] = cooldowns[ability_id]
        
        return True
    
    def reset_position(self, position):
        """Reset player position for new loop"""
        self.position = list(position)
        self.inventory = []
        self.noise_level = 0
        self.is_hiding = False
        self.moving = False
        self.active_ability = None
        self.hunger = 100
        self.stamina = 100
    
    def get_state(self):
        """Get player state for external systems"""
        return {
            "position": self.position,
            "noise_level": self.noise_level,
            "is_hiding": self.is_hiding,
            "inventory": [snack.get_state() for snack in self.inventory],
            "abilities": list(self.abilities.keys()),
            "hunger": self.hunger,
            "stamina": self.stamina
        }
