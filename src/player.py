"""
Player (Raccoon) entity - simplified grid-based movement
"""
import pygame
from config import TILE_SIZE, COLOR_PLAYER, COLOR_PLAYER_EYES, PLAYER_SPEED

class Player:
    def __init__(self, grid_x, grid_y):
        self.grid_x = grid_x
        self.grid_y = grid_y
        self.spawn_x = grid_x
        self.spawn_y = grid_y
        self.snacks_collected = 0
        
        # Movement
        self.move_cooldown = 0
        self.move_delay = 1.0 / PLAYER_SPEED
    
    def handle_input(self, keys):
        """Handle keyboard input for movement"""
        if self.move_cooldown > 0:
            return None
        
        dx, dy = 0, 0
        if keys[pygame.K_w] or keys[pygame.K_UP]:
            dy = -1
        elif keys[pygame.K_s] or keys[pygame.K_DOWN]:
            dy = 1
        elif keys[pygame.K_a] or keys[pygame.K_LEFT]:
            dx = -1
        elif keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            dx = 1
        
        if dx != 0 or dy != 0:
            self.move_cooldown = self.move_delay
            return (dx, dy)
        
        return None
    
    def move(self, dx, dy):
        """Move player by grid offset"""
        self.grid_x += dx
        self.grid_y += dy
    
    def update(self, dt):
        """Update player state"""
        if self.move_cooldown > 0:
            self.move_cooldown = max(0, self.move_cooldown - dt)
    
    def render(self, screen):
        """Render the player"""
        x = self.grid_x * TILE_SIZE + TILE_SIZE // 2
        y = self.grid_y * TILE_SIZE + TILE_SIZE // 2
        
        # Body
        pygame.draw.circle(screen, COLOR_PLAYER, (x, y), 12)
        
        # Eyes (raccoon mask)
        pygame.draw.circle(screen, COLOR_PLAYER_EYES, (x - 4, y - 2), 3)
        pygame.draw.circle(screen, COLOR_PLAYER_EYES, (x + 4, y - 2), 3)
    
    def reset(self):
        """Reset player for new loop"""
        self.grid_x = self.spawn_x
        self.grid_y = self.spawn_y
        self.snacks_collected = 0
        self.move_cooldown = 0
    
    def get_position(self):
        """Get grid position as tuple"""
        return (self.grid_x, self.grid_y)
