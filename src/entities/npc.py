"""
NPC (Non-Player Character) entities - humans and pets
"""
import random

class NPCType:
    HUMAN = "human"
    PET = "pet"

class NPCState:
    IDLE = "idle"
    PATROLLING = "patrolling"
    INVESTIGATING = "investigating"
    ALERTED = "alerted"

class NPC:
    def __init__(self, position, npc_type):
        self.position = list(position)
        self.npc_type = npc_type
        self.state = NPCState.PATROLLING
        
        # Movement
        self.speed = 2 if npc_type == NPCType.HUMAN else 3
        self.patrol_route = []
        self.current_waypoint = 0
        self.wait_time = 0
        self.wait_duration = 2.0
        
        # Detection
        self.vision_range = 150 if npc_type == NPCType.HUMAN else 100
        self.hearing_range = 100 if npc_type == NPCType.HUMAN else 120
        self.detection_accumulation = 0
        
        # Behavior
        self.investigation_point = None
        self.alert_timer = 0
    
    def set_patrol_route(self, waypoints):
        """Set the patrol route for this NPC"""
        self.patrol_route = waypoints
        self.current_waypoint = 0
    
    def update(self, dt, kitchen, player):
        """Update NPC behavior"""
        if self.state == NPCState.PATROLLING:
            self.update_patrol(dt)
        elif self.state == NPCState.INVESTIGATING:
            self.update_investigation(dt, player)
        elif self.state == NPCState.ALERTED:
            self.update_alerted(dt)
        
        # Check for player detection
        self.check_player_detection(player, kitchen)
    
    def update_patrol(self, dt):
        """Update patrol behavior"""
        if not self.patrol_route:
            return
        
        if self.wait_time > 0:
            self.wait_time -= dt
            return
        
        # Move towards current waypoint
        target = self.patrol_route[self.current_waypoint]
        direction = [target[0] - self.position[0], target[1] - self.position[1]]
        distance = (direction[0]**2 + direction[1]**2)**0.5
        
        if distance < 5:
            # Reached waypoint
            self.current_waypoint = (self.current_waypoint + 1) % len(self.patrol_route)
            self.wait_time = self.wait_duration
        else:
            # Move towards waypoint
            direction[0] /= distance
            direction[1] /= distance
            self.position[0] += direction[0] * self.speed
            self.position[1] += direction[1] * self.speed
    
    def update_investigation(self, dt, player):
        """Update investigation behavior"""
        if not self.investigation_point:
            self.state = NPCState.PATROLLING
            return
        
        # Move towards investigation point
        direction = [
            self.investigation_point[0] - self.position[0],
            self.investigation_point[1] - self.position[1]
        ]
        distance = (direction[0]**2 + direction[1]**2)**0.5
        
        if distance < 10:
            # Reached investigation point
            self.wait_time = 3.0
            self.investigation_point = None
            self.state = NPCState.PATROLLING
        else:
            direction[0] /= distance
            direction[1] /= distance
            self.position[0] += direction[0] * self.speed * 1.5
            self.position[1] += direction[1] * self.speed * 1.5
    
    def update_alerted(self, dt):
        """Update alerted behavior"""
        self.alert_timer -= dt
        if self.alert_timer <= 0:
            self.state = NPCState.PATROLLING
            self.detection_accumulation = 0
    
    def check_player_detection(self, player, kitchen):
        """Check if NPC can detect the player"""
        if player.is_hiding:
            self.detection_accumulation = max(0, self.detection_accumulation - 5)
            return
        
        distance = self.calculate_distance(self.position, player.position)
        
        # Visual detection
        if distance < self.vision_range:
            # Check line of sight
            if kitchen.has_line_of_sight(self.position, player.position):
                detection_rate = (self.vision_range - distance) / self.vision_range * 10
                self.detection_accumulation += detection_rate
        
        # Audio detection
        if distance < self.hearing_range and player.noise_level > 30:
            detection_rate = player.noise_level / 10
            self.detection_accumulation += detection_rate
            
            # Investigate noise source
            if self.detection_accumulation > 20 and self.state == NPCState.PATROLLING:
                self.investigation_point = list(player.position)
                self.state = NPCState.INVESTIGATING
        
        # Alert if detection threshold reached
        if self.detection_accumulation > 100:
            self.state = NPCState.ALERTED
            self.alert_timer = 5.0
    
    def calculate_distance(self, pos1, pos2):
        """Calculate distance between two positions"""
        return ((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2)**0.5
    
    def get_state(self):
        """Get NPC state for external systems"""
        return {
            "type": self.npc_type,
            "position": self.position,
            "state": self.state,
            "detection": self.detection_accumulation
        }
