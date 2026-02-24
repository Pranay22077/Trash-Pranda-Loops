"""
Progression and unlock system
"""
import random

class ProgressionSystem:
    def __init__(self, config):
        self.config = config
        self.total_points = 0
        self.unlocked_abilities = set()
        self.unlockables = config.get('unlockables', [])
        self.snacks = config.get('snacks', [])
        
        # Stats tracking
        self.stats = {
            'total_snacks_collected': 0,
            'loops_completed': 0,
            'times_detected': 0,
            'best_loop_score': 0
        }
    
    def add_points(self, points):
        """Add progression points"""
        self.total_points += points
    
    def unlock_ability(self, ability_id):
        """Unlock an ability using points"""
        # Find the ability
        ability = None
        for unlock in self.unlockables:
            if unlock['id'] == ability_id:
                ability = unlock
                break
        
        if not ability:
            return {"success": False, "message": "Ability not found"}
        
        if ability_id in self.unlocked_abilities:
            return {"success": False, "message": "Already unlocked"}
        
        cost = ability.get('cost', 0)
        if self.total_points < cost:
            return {"success": False, "message": "Not enough points"}
        
        # Unlock the ability
        self.total_points -= cost
        self.unlocked_abilities.add(ability_id)
        
        return {
            "success": True,
            "message": f"Unlocked {ability['name']}!",
            "ability": ability
        }
    
    def get_available_unlocks(self):
        """Get list of unlockable abilities"""
        available = []
        for unlock in self.unlockables:
            if unlock['id'] not in self.unlocked_abilities:
                available.append({
                    **unlock,
                    'can_afford': self.total_points >= unlock.get('cost', 0)
                })
        return available
    
    def check_unlocks(self):
        """Check for any new unlocks based on achievements"""
        new_unlocks = []
        
        # Achievement-based unlocks
        if self.stats['loops_completed'] >= 10 and 'veteran' not in self.unlocked_abilities:
            new_unlocks.append('veteran')
        
        if self.stats['total_snacks_collected'] >= 50 and 'glutton' not in self.unlocked_abilities:
            new_unlocks.append('glutton')
        
        return new_unlocks
    
    def get_random_snack(self):
        """Get a random snack based on rarity"""
        if not self.snacks:
            return {
                'name': 'Mystery Snack',
                'value': 10,
                'rarity': 'common',
                'noise': 10,
                'collect_time': 0.5
            }
        
        # Weighted random selection based on rarity
        weights = {
            'common': 50,
            'uncommon': 30,
            'rare': 15,
            'legendary': 5
        }
        
        total_weight = sum(weights.get(s['rarity'], 10) for s in self.snacks)
        rand = random.uniform(0, total_weight)
        
        current = 0
        for snack in self.snacks:
            current += weights.get(snack['rarity'], 10)
            if rand <= current:
                return snack
        
        return self.snacks[0]
    
    def update_stat(self, stat_name, value):
        """Update a stat"""
        if stat_name in self.stats:
            self.stats[stat_name] += value
    
    def get_state(self):
        """Get progression state"""
        return {
            'total_points': self.total_points,
            'unlocked_abilities': list(self.unlocked_abilities),
            'available_unlocks': self.get_available_unlocks(),
            'stats': self.stats
        }
    
    def get_save_data(self):
        """Get data for saving"""
        return {
            'total_points': self.total_points,
            'unlocked_abilities': list(self.unlocked_abilities),
            'stats': self.stats
        }
    
    def load_save_data(self, data):
        """Load saved data"""
        self.total_points = data.get('total_points', 0)
        self.unlocked_abilities = set(data.get('unlocked_abilities', []))
        self.stats = data.get('stats', self.stats)
