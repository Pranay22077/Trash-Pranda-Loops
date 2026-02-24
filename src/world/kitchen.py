"""
Kitchen world generation and management
"""
import random

class TileType:
    FLOOR = 0
    WALL = 1
    FRIDGE = 2
    COUNTER = 3
    TABLE = 4
    CABINET = 5
    HIDING_SPOT = 6

class Kitchen:
    def __init__(self):
        self.tile_size = 32
        self.width = 20
        self.height = 15
        self.tiles = []
        self.interactive_objects = []
        
        self.generate()
    
    def generate(self):
        """Generate a kitchen layout"""
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
        fridge_x, fridge_y = self.width - 3, 2
        self.tiles[fridge_y][fridge_x] = TileType.FRIDGE
        self.interactive_objects.append({
            'type': 'fridge',
            'position': [fridge_x * self.tile_size, fridge_y * self.tile_size],
            'opened': False
        })
        
        # Add counter (along right wall)
        for y in range(4, 8):
            self.tiles[y][self.width - 3] = TileType.COUNTER
        
        # Add table (center)
        for y in range(6, 9):
            for x in range(8, 11):
                self.tiles[y][x] = TileType.TABLE
        
        # Add cabinets
        for x in range(3, 6):
            self.tiles[2][x] = TileType.CABINET
        
        # Add hiding spots
        self.tiles[10][3] = TileType.HIDING_SPOT
        self.tiles[5][15] = TileType.HIDING_SPOT
    
    def is_walkable(self, position):
        """Check if a position is walkable"""
        tile_x = int(position[0] // self.tile_size)
        tile_y = int(position[1] // self.tile_size)
        
        if tile_x < 0 or tile_x >= self.width or tile_y < 0 or tile_y >= self.height:
            return False
        
        tile = self.tiles[tile_y][tile_x]
        return tile in (TileType.FLOOR, TileType.HIDING_SPOT)
    
    def has_line_of_sight(self, pos1, pos2):
        """Check if there's line of sight between two positions"""
        # Simple implementation - check if any walls block the path
        steps = 20
        for i in range(steps + 1):
            t = i / steps
            check_pos = [
                pos1[0] + (pos2[0] - pos1[0]) * t,
                pos1[1] + (pos2[1] - pos1[1]) * t
            ]
            
            tile_x = int(check_pos[0] // self.tile_size)
            tile_y = int(check_pos[1] // self.tile_size)
            
            if tile_x < 0 or tile_x >= self.width or tile_y < 0 or tile_y >= self.height:
                return False
            
            tile = self.tiles[tile_y][tile_x]
            if tile in (TileType.WALL, TileType.FRIDGE, TileType.COUNTER, TileType.CABINET):
                return False
        
        return True
    
    def get_spawn_position(self):
        """Get the player spawn position (bottom-left)"""
        return [self.tile_size * 2, self.tile_size * (self.height - 3)]
    
    def get_npc_spawn_position(self, npc_type):
        """Get spawn position for NPCs"""
        if npc_type == "human":
            return [self.tile_size * 10, self.tile_size * 3]
        else:  # pet
            return [self.tile_size * 5, self.tile_size * 10]
    
    def get_patrol_route(self, npc_type):
        """Get patrol route for NPCs"""
        if npc_type == "human":
            return [
                [self.tile_size * 10, self.tile_size * 3],
                [self.tile_size * 15, self.tile_size * 3],
                [self.tile_size * 15, self.tile_size * 8],
                [self.tile_size * 10, self.tile_size * 8],
            ]
        else:  # pet
            return [
                [self.tile_size * 5, self.tile_size * 10],
                [self.tile_size * 12, self.tile_size * 10],
                [self.tile_size * 12, self.tile_size * 5],
                [self.tile_size * 5, self.tile_size * 5],
            ]
    
    def get_snack_spawn_positions(self):
        """Get positions where snacks can spawn"""
        positions = []
        
        # In fridge
        positions.append([self.tile_size * (self.width - 3), self.tile_size * 2])
        
        # On counter
        positions.append([self.tile_size * (self.width - 3), self.tile_size * 5])
        
        # On table
        positions.append([self.tile_size * 9, self.tile_size * 7])
        
        # In cabinet
        positions.append([self.tile_size * 4, self.tile_size * 2])
        
        # Random floor positions
        for _ in range(3):
            x = random.randint(3, self.width - 4)
            y = random.randint(3, self.height - 4)
            if self.tiles[y][x] == TileType.FLOOR:
                positions.append([self.tile_size * x, self.tile_size * y])
        
        return positions
    
    def get_interactive_objects(self):
        """Get list of interactive objects"""
        return self.interactive_objects
    
    def reset_for_loop(self, loop_count):
        """Reset kitchen state for new loop"""
        # Reset interactive objects
        for obj in self.interactive_objects:
            obj['opened'] = False
        
        # Potentially add procedural variation based on loop count
        if loop_count % 5 == 0:
            # Every 5 loops, slightly randomize layout
            pass
