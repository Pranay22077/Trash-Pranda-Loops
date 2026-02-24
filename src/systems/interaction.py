"""
Interaction system for player-object interactions
"""

class InteractionSystem:
    def __init__(self):
        self.available_interactions = []
    
    def set_available_interactions(self, objects):
        """Set currently available interactions"""
        self.available_interactions = objects
    
    def interact(self, player, target, game):
        """Handle interaction between player and target"""
        result = {"success": False}
        
        # Check if target is a snack
        if hasattr(target, 'collected'):
            if not target.collected:
                snack_data = target.collect()
                result = {
                    "success": True,
                    "type": "snack_collected",
                    "snack": target,
                    "snack_data": snack_data
                }
        
        # Check if target is a fridge
        elif isinstance(target, dict) and target.get('type') == 'fridge':
            if not target['opened']:
                target['opened'] = True
                # Spawn snacks from fridge
                fridge_snacks = self.spawn_fridge_snacks(target['position'], game)
                result = {
                    "success": True,
                    "type": "fridge_opened",
                    "snacks_spawned": len(fridge_snacks)
                }
                game.snacks.extend(fridge_snacks)
        
        # Check if target is a cabinet
        elif isinstance(target, dict) and target.get('type') == 'cabinet':
            # Similar to fridge
            pass
        
        return result
    
    def spawn_fridge_snacks(self, fridge_position, game):
        """Spawn snacks from opened fridge"""
        from entities.snack import Snack
        import random
        
        snacks = []
        num_snacks = random.randint(2, 4)
        
        for i in range(num_snacks):
            offset_x = random.randint(-20, 20)
            offset_y = random.randint(-20, 20)
            position = [fridge_position[0] + offset_x, fridge_position[1] + offset_y]
            
            snack_data = game.progression.get_random_snack()
            snack = Snack(position, snack_data)
            snacks.append(snack)
        
        return snacks
    
    def get_available_interactions(self):
        """Get list of available interactions"""
        interactions = []
        for obj in self.available_interactions:
            if hasattr(obj, 'name'):
                interactions.append(f"Collect {obj.name}")
            elif isinstance(obj, dict):
                obj_type = obj.get('type', 'object')
                interactions.append(f"Interact with {obj_type}")
        return interactions
