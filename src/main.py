"""
Trash Panda Loops - Pygame Frontend
"""
import pygame
import sys
from game import Game, GameState

# Colors
BLACK = (20, 20, 30)
WHITE = (255, 255, 255)
GRAY = (100, 100, 100)
DARK_GRAY = (60, 60, 60)
FLOOR_COLOR = (80, 70, 60)
WALL_COLOR = (60, 60, 60)
FRIDGE_COLOR = (200, 200, 220)
COUNTER_COLOR = (120, 100, 80)
TABLE_COLOR = (100, 80, 60)
RACCOON_COLOR = (150, 150, 150)
RACCOON_HIDING = (100, 100, 100)
HUMAN_COLOR = (255, 200, 150)
PET_COLOR = (200, 150, 100)
SNACK_COMMON = (255, 255, 100)
SNACK_UNCOMMON = (100, 255, 100)
SNACK_RARE = (100, 150, 255)
SNACK_LEGENDARY = (255, 100, 255)
RED = (255, 100, 100)
GREEN = (100, 255, 100)
YELLOW = (255, 255, 100)
BLUE = (100, 200, 255)

class GameRenderer:
    def __init__(self, screen):
        self.screen = screen
        self.font = pygame.font.Font(None, 24)
        self.font_large = pygame.font.Font(None, 48)
        self.font_small = pygame.font.Font(None, 18)
    
    def render_game(self, game):
        """Render the entire game state"""
        self.screen.fill(BLACK)
        
        if game.state == GameState.MENU:
            self.render_menu()
        elif game.state == GameState.PLAYING:
            state = game.get_game_state()
            self.render_kitchen(game.kitchen)
            self.render_snacks(state['snacks'])
            self.render_npcs(state['npcs'])
            self.render_player(state['player'])
            self.render_hud(state)
        
    def render_menu(self):
        """Render main menu"""
        title = self.font_large.render("TRASH PANDA LOOPS", True, (255, 200, 100))
        title_rect = title.get_rect(center=(400, 200))
        self.screen.blit(title, title_rect)
        
        subtitle = self.font.render("Steal snacks in 60-second time loops!", True, WHITE)
        subtitle_rect = subtitle.get_rect(center=(400, 260))
        self.screen.blit(subtitle, subtitle_rect)
        
        start = self.font.render("Press SPACE to start", True, GREEN)
        start_rect = start.get_rect(center=(400, 350))
        self.screen.blit(start, start_rect)
        
        controls = [
            "Controls:",
            "WASD / Arrow Keys - Move",
            "E - Interact",
            "SPACE - Hide",
            "ESC - Pause"
        ]
        
        y = 420
        for line in controls:
            text = self.font_small.render(line, True, GRAY)
            text_rect = text.get_rect(center=(400, y))
            self.screen.blit(text, text_rect)
            y += 25
    
    def render_kitchen(self, kitchen):
        """Render the kitchen tiles"""
        tile_size = kitchen.tile_size
        
        for y in range(kitchen.height):
            for x in range(kitchen.width):
                tile = kitchen.tiles[y][x]
                rect = pygame.Rect(x * tile_size, y * tile_size, tile_size, tile_size)
                
                # Choose color based on tile type
                if tile == 0:  # FLOOR
                    color = FLOOR_COLOR
                elif tile == 1:  # WALL
                    color = WALL_COLOR
                elif tile == 2:  # FRIDGE
                    color = FRIDGE_COLOR
                elif tile == 3:  # COUNTER
                    color = COUNTER_COLOR
                elif tile == 4:  # TABLE
                    color = TABLE_COLOR
                elif tile == 5:  # CABINET
                    color = (140, 120, 100)
                elif tile == 6:  # HIDING_SPOT
                    color = (90, 80, 70)
                else:
                    color = BLACK
                
                pygame.draw.rect(self.screen, color, rect)
                pygame.draw.rect(self.screen, DARK_GRAY, rect, 1)
    
    def render_player(self, player_state):
        """Render the raccoon player"""
        pos = player_state['position']
        color = RACCOON_HIDING if player_state['is_hiding'] else RACCOON_COLOR
        
        # Body
        pygame.draw.circle(self.screen, color, (int(pos[0]), int(pos[1])), 12)
        
        # Mask (eyes)
        pygame.draw.circle(self.screen, (50, 50, 50), (int(pos[0] - 4), int(pos[1] - 2)), 3)
        pygame.draw.circle(self.screen, (50, 50, 50), (int(pos[0] + 4), int(pos[1] - 2)), 3)
        
        # Tail
        pygame.draw.circle(self.screen, color, (int(pos[0]), int(pos[1] + 8)), 6)
    
    def render_npcs(self, npcs):
        """Render NPCs"""
        for npc in npcs:
            pos = npc['position']
            color = HUMAN_COLOR if npc['type'] == 'human' else PET_COLOR
            
            # Body
            pygame.draw.circle(self.screen, color, (int(pos[0]), int(pos[1])), 10)
            
            # State indicator
            if npc['state'] == 'investigating':
                pygame.draw.circle(self.screen, YELLOW, (int(pos[0]), int(pos[1])), 14, 2)
            elif npc['state'] == 'alerted':
                pygame.draw.circle(self.screen, RED, (int(pos[0]), int(pos[1])), 14, 2)
    
    def render_snacks(self, snacks):
        """Render collectible snacks"""
        for snack in snacks:
            pos = snack['position']
            rarity = snack['rarity']
            
            # Color based on rarity
            if rarity == 'common':
                color = SNACK_COMMON
            elif rarity == 'uncommon':
                color = SNACK_UNCOMMON
            elif rarity == 'rare':
                color = SNACK_RARE
            else:
                color = SNACK_LEGENDARY
            
            # Draw snack
            pygame.draw.rect(self.screen, color, 
                           (int(pos[0] - 6), int(pos[1] - 6), 12, 12))
            pygame.draw.rect(self.screen, WHITE, 
                           (int(pos[0] - 6), int(pos[1] - 6), 12, 12), 1)
    
    def render_hud(self, state):
        """Render HUD elements"""
        # Time remaining
        time_text = self.font.render(f"Time: {state['time_remaining']:.1f}s", True, WHITE)
        self.screen.blit(time_text, (10, 10))
        
        # Loop count
        loop_text = self.font_small.render(f"Loop #{state['loop_count']}", True, GRAY)
        self.screen.blit(loop_text, (10, 35))
        
        # Snacks collected
        player = state['player']
        snack_text = self.font_small.render(f"Snacks: {len(player['inventory'])}", True, YELLOW)
        self.screen.blit(snack_text, (10, 55))
        
        # Detection level
        detection = state['detection_level']
        det_color = GREEN if detection < 30 else YELLOW if detection < 70 else RED
        det_text = self.font_small.render(f"Detection: {detection:.0f}%", True, det_color)
        self.screen.blit(det_text, (10, 75))
        
        # Noise level
        noise = player['noise_level']
        noise_color = GREEN if noise < 30 else YELLOW if noise < 60 else RED
        noise_text = self.font_small.render(f"Noise: {noise:.0f}", True, noise_color)
        self.screen.blit(noise_text, (10, 95))
        
        # Hiding indicator
        if player['is_hiding']:
            hiding_text = self.font.render("HIDING", True, BLUE)
            self.screen.blit(hiding_text, (10, 120))
        
        # Progress bar (time)
        bar_width = 200
        bar_height = 20
        bar_x = 590
        bar_y = 10
        progress = 1.0 - (state['time_remaining'] / 60.0)
        
        pygame.draw.rect(self.screen, DARK_GRAY, (bar_x, bar_y, bar_width, bar_height))
        fill_width = int(bar_width * progress)
        bar_color = BLUE if progress < 0.5 else YELLOW if progress < 0.8 else RED
        pygame.draw.rect(self.screen, bar_color, (bar_x, bar_y, fill_width, bar_height))
        pygame.draw.rect(self.screen, WHITE, (bar_x, bar_y, bar_width, bar_height), 2)
        
        # Abilities
        if player['abilities']:
            abilities_text = self.font_small.render(f"Abilities: {', '.join(player['abilities'])}", True, GREEN)
            self.screen.blit(abilities_text, (590, 40))

def main():
    pygame.init()
    
    # Screen setup
    SCREEN_WIDTH = 800
    SCREEN_HEIGHT = 600
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Trash Panda Loops")
    
    # Game setup
    clock = pygame.time.Clock()
    game = Game()
    renderer = GameRenderer(screen)
    
    # Input state
    keys_pressed = set()
    
    running = True
    while running:
        dt = clock.tick(60) / 1000.0
        
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    if game.state == GameState.PLAYING:
                        game.state = GameState.PAUSED
                    elif game.state == GameState.PAUSED:
                        game.state = GameState.PLAYING
                
                elif event.key == pygame.K_SPACE:
                    if game.state == GameState.MENU:
                        game.start_game()
                    elif game.state == GameState.PLAYING:
                        action = {'type': 'hide'}
                        game.update(0.01, action)
                
                elif event.key == pygame.K_e:
                    if game.state == GameState.PLAYING:
                        action = {'type': 'interact'}
                        game.update(0.01, action)
        
        # Continuous movement
        if game.state == GameState.PLAYING:
            keys = pygame.key.get_pressed()
            direction = [0, 0]
            
            if keys[pygame.K_w] or keys[pygame.K_UP]:
                direction[1] = -1
            elif keys[pygame.K_s] or keys[pygame.K_DOWN]:
                direction[1] = 1
            
            if keys[pygame.K_a] or keys[pygame.K_LEFT]:
                direction[0] = -1
            elif keys[pygame.K_d] or keys[pygame.K_RIGHT]:
                direction[0] = 1
            
            if direction != [0, 0]:
                action = {'type': 'move', 'direction': direction}
                result = game.update(dt, action)
            else:
                result = game.update(dt)
            
            # Check for loop end
            if result and result.get('state') in ['detected', 'loop_complete']:
                # Show result briefly
                if result['state'] == 'detected':
                    msg = f"DETECTED! Score: {result['score']}"
                else:
                    msg = f"LOOP COMPLETE! Score: {result['score']}"
                
                text = renderer.font_large.render(msg, True, RED if result['state'] == 'detected' else GREEN)
                text_rect = text.get_rect(center=(400, 300))
                renderer.screen.blit(text, text_rect)
                pygame.display.flip()
                pygame.time.wait(1500)
        
        # Render
        renderer.render_game(game)
        pygame.display.flip()
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
