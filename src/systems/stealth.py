"""
Stealth and detection system
"""
import math

class StealthSystem:
    def __init__(self, detection_threshold=100.0):
        self.detection_level = 0.0
        self.detected = False
        self.detection_threshold = detection_threshold
        self.last_seen_position = None
    
    def update(self, player, npcs, kitchen):
        """Update stealth detection based on player actions and NPC proximity"""
        # Decrease detection over time if player is hiding or still
        if player.is_hiding:
            self.detection_level = max(0, self.detection_level - 5)
        elif not player.moving:
            self.detection_level = max(0, self.detection_level - 2)
        
        # Increase detection based on noise
        if player.moving and not player.is_hiding:
            self.detection_level += player.noise_level * 0.05
        
        # Check each NPC for detection
        for npc in npcs:
            distance = self.calculate_distance(player.position, npc.position)
            
            # Visual detection
            if distance < npc.vision_range and not player.is_hiding:
                if kitchen.has_line_of_sight(npc.position, player.position):
                    detection_rate = (npc.vision_range - distance) / npc.vision_range * 3
                    self.detection_level += detection_rate
                    self.last_seen_position = list(player.position)
            
            # Audio detection
            if distance < npc.hearing_range:
                if player.noise_level > 30:
                    detection_rate = (player.noise_level / 100) * 2
                    self.detection_level += detection_rate
        
        # Check if detected
        if self.detection_level >= self.detection_threshold:
            self.detected = True
    
    def calculate_distance(self, pos1, pos2):
        """Calculate Euclidean distance between two positions"""
        return math.sqrt((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2)
    
    def is_detected(self):
        """Check if player has been detected"""
        return self.detected
    
    def reset(self):
        """Reset detection for new loop"""
        self.detection_level = 0.0
        self.detected = False
        self.last_seen_position = None
    
    def get_detection_level(self):
        """Get current detection level as percentage"""
        return min(100, (self.detection_level / self.detection_threshold) * 100)
