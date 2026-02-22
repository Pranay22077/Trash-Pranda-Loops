"""
NPC (Human) with simple patrol behavior
"""
import pygame
from config import TILE_SIZE, COLOR_NPC, NPC_SPEED

class NPC:
    def __init__(self, patrol_path):
        """
        patrol_path: list of (x, y) grid positions
        """
        self.patrol_path = patrol_path
        self.current_waypoint = 0
        self.grid_x = patrol_path[0][0]
        self.grid_y = patrol_path[0][1]
        
        self.move_timer = 0
        self.move_delay = 1.0 / NPC_SPEED
    
    def update(self, dt):
        """Update NPC patrol"""
        self.move_timer += dt
        
        if self.move_timer >= self.move_delay:
            self.move_timer = 0
            
            # Get target waypoint
            target_x, target_y = self.patrol_path[self.current_waypoint]
            
            # Move towards target
            if self.grid_x < target_x:
                self.grid_x += 1
            elif self.grid_x > target_x:
                self.grid_x -= 1
            elif self.grid_y < target_y:
                self.grid_y += 1
            elif self.grid_y > target_y:
                self.grid_y -= 1
            else:
                # Reached waypoint, move to next
                self.current_waypoint = (self.current_waypoint + 1) % len(self.patrol_path)
    
    def render(self, screen):
        """Render the NPC"""
        x = self.grid_x * TILE_SIZE + TILE_SIZE // 2
        y = self.grid_y * TILE_SIZE + TILE_SIZE // 2
        
        # Body
        pygame.draw.circle(screen, COLOR_NPC, (x, y), 14)
        
        # Simple face
        pygame.draw.circle(screen, (50, 50, 50), (x - 4, y - 3), 2)
        pygame.draw.circle(screen, (50, 50, 50), (x + 4, y - 3), 2)
    
    def reset(self):
        """Reset NPC for new loop"""
        self.current_waypoint = 0
        self.grid_x = self.patrol_path[0][0]
        self.grid_y = self.patrol_path[0][1]
        self.move_timer = 0
    
    def get_position(self):
        """Get grid position as tuple"""
        return (self.grid_x, self.grid_y)
    
    def can_see(self, target_pos, vision_range):
        """Check if NPC can see target position"""
        dx = abs(self.grid_x - target_pos[0])
        dy = abs(self.grid_y - target_pos[1])
        return dx <= vision_range and dy <= vision_range
