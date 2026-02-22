"""
Kitchen world - static grid layout
"""
import pygame
from config import (
    GRID_WIDTH, GRID_HEIGHT, TILE_SIZE,
    COLOR_FLOOR, COLOR_WALL, COLOR_FRIDGE, COLOR_SNACK
)

class TileType:
    FLOOR = 0
    WALL = 1
    FRIDGE = 2

class Kitchen:
    def __init__(self):
        self.width = GRID_WIDTH
        self.height = GRID_HEIGHT
        self.tiles = []
        self.snacks = []  # List of (x, y) positions
        self.fridge_pos = None
        
        self.generate()
    
    def generate(self):
        """Generate a simple static kitchen layout"""
        # Initialize with floor
        self.tiles = [[TileType.FLOOR for _ in range(self.width)] for _ in range(self.height)]
        
        # Add walls around perimeter
        for x in range(self.width):
            self.tiles[0][x] = TileType.WALL
            self.tiles[self.height - 1][x] = TileType.WALL
        for y in range(self.height):
            self.tiles[y][0] = TileType.WALL
            self.tiles[y][self.width - 1] = TileType.WALL
        
        # Add fridge (top-right corner)
        self.fridge_pos = (self.width - 3, 2)
        self.tiles[2][self.width - 3] = TileType.FRIDGE
        
        # Place snacks near fridge
        self.snacks = [
            (self.width - 4, 2),
            (self.width - 3, 3),
            (self.width - 2, 2)
        ]
    
    def is_walkable(self, grid_x, grid_y):
        """Check if a grid position is walkable"""
        if grid_x < 0 or grid_x >= self.width or grid_y < 0 or grid_y >= self.height:
            return False
        
        tile = self.tiles[grid_y][grid_x]
        return tile == TileType.FLOOR
    
    def has_snack(self, grid_x, grid_y):
        """Check if there's a snack at this position"""
        return (grid_x, grid_y) in self.snacks
    
    def collect_snack(self, grid_x, grid_y):
        """Remove snack from position"""
        if (grid_x, grid_y) in self.snacks:
            self.snacks.remove((grid_x, grid_y))
            return True
        return False
    
    def render(self, screen):
        """Render the kitchen"""
        for y in range(self.height):
            for x in range(self.width):
                tile = self.tiles[y][x]
                rect = pygame.Rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                
                # Draw tile
                if tile == TileType.WALL:
                    pygame.draw.rect(screen, COLOR_WALL, rect)
                elif tile == TileType.FRIDGE:
                    pygame.draw.rect(screen, COLOR_FRIDGE, rect)
                else:
                    pygame.draw.rect(screen, COLOR_FLOOR, rect)
                
                # Grid lines
                pygame.draw.rect(screen, (40, 40, 40), rect, 1)
        
        # Draw snacks
        for snack_x, snack_y in self.snacks:
            x = snack_x * TILE_SIZE + TILE_SIZE // 2
            y = snack_y * TILE_SIZE + TILE_SIZE // 2
            pygame.draw.circle(screen, COLOR_SNACK, (x, y), 6)
    
    def reset_snacks(self):
        """Reset snacks for new loop"""
        self.snacks = [
            (self.width - 4, 2),
            (self.width - 3, 3),
            (self.width - 2, 2)
        ]
    
    def get_spawn_position(self):
        """Get player spawn position (bottom-left)"""
        return (2, self.height - 3)
    
    def get_npc_patrol(self):
        """Get NPC patrol path"""
        # Simple patrol around the kitchen
        return [
            (5, 5),
            (15, 5),
            (15, 10),
            (5, 10)
        ]
