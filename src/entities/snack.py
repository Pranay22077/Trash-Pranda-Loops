"""
Snack items that can be collected
"""

class SnackRarity:
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    LEGENDARY = "legendary"

class Snack:
    def __init__(self, position, snack_data):
        self.position = list(position)
        self.name = snack_data['name']
        self.value = snack_data['value']
        self.rarity = snack_data['rarity']
        self.collected = False
        
        # Special properties
        self.noise_on_collect = snack_data.get('noise', 10)
        self.time_to_collect = snack_data.get('collect_time', 0.5)
    
    def collect(self):
        """Mark snack as collected"""
        self.collected = True
        return {
            "name": self.name,
            "value": self.value,
            "rarity": self.rarity
        }
    
    def get_state(self):
        """Get snack state for external systems"""
        return {
            "name": self.name,
            "position": self.position,
            "value": self.value,
            "rarity": self.rarity,
            "collected": self.collected
        }
