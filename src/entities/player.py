"""
Player (Raccoon) entity
"""
import pygame

class Player:
    def __init__(self, position):
        self.position = list(position)
        self.tile_size = 32
        self.speed = 4
        self.inventory = []
        self.noise_level = 0
        self.is_hiding = False
        
        # Movement
        self.moving = False
        self.move_direction = [0, 0]
    
    def handle_input(self, event):
        if event.type == pygame.KEYDOWN:
            if event.key in (pygame.K_w, pygame.K_UP):
                self.move_direction[1] = -1
            elif event.key in (pygame.K_s, pygame.K_DOWN):
                self.move_direction[1] = 1
            elif event.key in (pygame.K_a, pygame.K_LEFT):
                self.move_direction[0] = -1
            elif event.key in (pygame.K_d, pygame.K_RIGHT):
                self.move_direction[0] = 1
            elif event.key == pygame.K_e:
                self.interact()
            elif event.key == pygame.K_SPACE:
                self.toggle_hide()
        
        elif event.type == pygame.KEYUP:
            if event.key in (pygame.K_w, pygame.K_UP, pygame.K_s, pygame.K_DOWN):
                self.move_direction[1] = 0
            elif event.key in (pygame.K_a, pygame.K_LEFT, pygame.K_d, pygame.K_RIGHT):
                self.move_direction[0] = 0
    
    def update(self, dt, kitchen):
        # Movement
        if self.move_direction != [0, 0] and not self.is_hiding:
            new_pos = [
                self.position[0] + self.move_direction[0] * self.speed,
                self.position[1] + self.move_direction[1] * self.speed
            ]
            
            # Check collision with kitchen
            if kitchen.is_walkable(new_pos):
                self.position = new_pos
                self.noise_level = min(100, self.noise_level + 2)
            
            self.moving = True
        else:
            self.moving = False
            self.noise_level = max(0, self.noise_level - 1)
    
    def render(self, screen):
        # Simple raccoon representation (will be replaced with sprite)
        color = (100, 100, 100) if self.is_hiding else (150, 150, 150)
        pygame.draw.circle(screen, color, (int(self.position[0]), int(self.position[1])), 12)
        
        # Raccoon mask (black circles for eyes)
        pygame.draw.circle(screen, (50, 50, 50), (int(self.position[0] - 4), int(self.position[1] - 2)), 3)
        pygame.draw.circle(screen, (50, 50, 50), (int(self.position[0] + 4), int(self.position[1] - 2)), 3)
    
    def interact(self):
        """Interact with nearby objects (open fridge, grab snacks)"""
        pass
    
    def toggle_hide(self):
        """Toggle hiding state"""
        self.is_hiding = not self.is_hiding
    
    def reset_position(self, position):
        """Reset player position for new loop"""
        self.position = list(position)
        self.inventory = []
        self.noise_level = 0
        self.is_hiding = False
        self.move_direction = [0, 0]
    
    def collect_snack(self, snack):
        """Add snack to inventory"""
        self.inventory.append(snack)
