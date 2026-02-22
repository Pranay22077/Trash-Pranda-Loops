"""
Kitchen world generation and management
"""
import pygame
import random

class TileType:
    FLOOR = 0
    WALL = 1
    FRIDGE = 2
    COUNTER = 3
    TABLE = 4

class Kitchen:
    def __init__(self):
        self.tile_size = 32
        self.width = 20
        self.height = 15
        self.tiles = []
        self.items = []
        self.npcs = []
        
        self.generate()
    
    def generate(self):
        """Generate a simple kitchen layout"""
        # Initialize with floor
        self.tiles = [[TileType.FLOOR for _ in range(self.width)] for _ in range(self.height)]
        
        # Add walls around perimeter
        for x in range(self.width):
            self.tiles[0][x] = TileType.WALL
            self.tiles[self.height - 1][x] = TileType.WALL
        for y in range(self.height):
            self.tiles[y][0] = TileType.WALL
            self.tiles[y][self.width - 1] = TileType.WALL
        
        # Add fridge (top-right area)
        self.tiles[2][self.width - 3] = TileType.FRIDGE
        
        # Add counter (along right wall)
        for y in range(4, 8):
            self.tiles[y][self.width - 3] = TileType.COUNTER
        
        # Add table (center)
        for y in range(6, 9):
            for x in range(8, 11):
                self.tiles[y][x] = TileType.TABLE
    
    def is_walkable(self, position):
        """Check if a position is walkable"""
        tile_x = int(position[0] // self.tile_size)
        tile_y = int(position[1] // self.tile_size)
        
        if tile_x < 0 or tile_x >= self.width or tile_y < 0 or tile_y >= self.height:
            return False
        
        tile = self.tiles[tile_y][tile_x]
        return tile in (TileType.FLOOR,)
    
    def get_spawn_position(self):
        """Get the player spawn position (bottom-left)"""
        return [self.tile_size * 2, self.tile_size * (self.height - 3)]
    
    def render(self, screen):
        """Render the kitchen"""
        colors = {
            TileType.FLOOR: (80, 70, 60),
            TileType.WALL: (60, 60, 60),
            TileType.FRIDGE: (200, 200, 220),
            TileType.COUNTER: (120, 100, 80),
            TileType.TABLE: (100, 80, 60),
        }
        
        for y in range(self.height):
            for x in range(self.width):
                tile = self.tiles[y][x]
                color = colors.get(tile, (0, 0, 0))
                rect = pygame.Rect(x * self.tile_size, y * self.tile_size, self.tile_size, self.tile_size)
                pygame.draw.rect(screen, color, rect)
                pygame.draw.rect(screen, (40, 40, 40), rect, 1)  # Grid lines
    
    def reset_items(self):
        """Reset items for new loop"""
        self.items = []
