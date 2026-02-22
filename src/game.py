"""
Core game loop and state management
"""
import pygame
from entities.player import Player
from world.kitchen import Kitchen
from systems.time_loop import TimeLoopSystem
from systems.stealth import StealthSystem
from ui.hud import HUD

class GameState:
    MENU = "menu"
    PLAYING = "playing"
    PAUSED = "paused"
    LOOP_RESET = "loop_reset"
    GAME_OVER = "game_over"

class Game:
    def __init__(self, screen):
        self.screen = screen
        self.state = GameState.MENU
        self.loop_count = 0
        
        # Initialize game systems
        self.kitchen = Kitchen()
        self.player = Player(self.kitchen.get_spawn_position())
        self.time_loop = TimeLoopSystem(loop_duration=60.0)
        self.stealth = StealthSystem()
        self.hud = HUD()
        
        # Persistent data across loops
        self.unlocked_abilities = set()
        self.total_snacks_collected = 0
    
    def handle_event(self, event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                if self.state == GameState.PLAYING:
                    self.state = GameState.PAUSED
                elif self.state == GameState.PAUSED:
                    self.state = GameState.PLAYING
            
            if self.state == GameState.MENU:
                if event.key == pygame.K_SPACE:
                    self.start_game()
            
            if self.state == GameState.PLAYING:
                self.player.handle_input(event)
    
    def update(self, dt):
        if self.state == GameState.PLAYING:
            # Update time loop
            self.time_loop.update(dt)
            
            if self.time_loop.is_loop_complete():
                self.reset_loop()
                return
            
            # Update game entities
            self.player.update(dt, self.kitchen)
            self.stealth.update(self.player, self.kitchen.npcs)
            
            # Check if detected
            if self.stealth.is_detected():
                self.reset_loop()
    
    def render(self):
        self.screen.fill((20, 20, 30))  # Dark background
        
        if self.state == GameState.MENU:
            self.render_menu()
        elif self.state == GameState.PLAYING:
            self.kitchen.render(self.screen)
            self.player.render(self.screen)
            self.hud.render(self.screen, self.time_loop, self.player, self.loop_count)
        elif self.state == GameState.PAUSED:
            self.kitchen.render(self.screen)
            self.player.render(self.screen)
            self.render_pause_menu()
    
    def render_menu(self):
        font = pygame.font.Font(None, 74)
        title = font.render("TRASH PANDA LOOPS", True, (255, 200, 100))
        title_rect = title.get_rect(center=(self.screen.get_width() // 2, 200))
        self.screen.blit(title, title_rect)
        
        font_small = pygame.font.Font(None, 36)
        prompt = font_small.render("Press SPACE to start", True, (200, 200, 200))
        prompt_rect = prompt.get_rect(center=(self.screen.get_width() // 2, 400))
        self.screen.blit(prompt, prompt_rect)
    
    def render_pause_menu(self):
        overlay = pygame.Surface(self.screen.get_size())
        overlay.set_alpha(128)
        overlay.fill((0, 0, 0))
        self.screen.blit(overlay, (0, 0))
        
        font = pygame.font.Font(None, 48)
        text = font.render("PAUSED", True, (255, 255, 255))
        text_rect = text.get_rect(center=(self.screen.get_width() // 2, self.screen.get_height() // 2))
        self.screen.blit(text, text_rect)
    
    def start_game(self):
        self.state = GameState.PLAYING
        self.loop_count = 0
        self.reset_loop()
    
    def reset_loop(self):
        """Reset the time loop while maintaining meta-progression"""
        self.loop_count += 1
        self.time_loop.reset()
        self.player.reset_position(self.kitchen.get_spawn_position())
        self.kitchen.reset_items()
        self.stealth.reset()
