"""
Heads-up display (HUD) for game information
"""
import pygame

class HUD:
    def __init__(self):
        self.font = pygame.font.Font(None, 28)
        self.font_small = pygame.font.Font(None, 20)
    
    def render(self, screen, time_loop, player, loop_count):
        """Render the HUD elements"""
        # Time remaining
        remaining = time_loop.get_remaining_time()
        time_text = self.font.render(f"Time: {remaining:.1f}s", True, (255, 255, 255))
        screen.blit(time_text, (10, 10))
        
        # Loop count
        loop_text = self.font_small.render(f"Loop #{loop_count}", True, (200, 200, 200))
        screen.blit(loop_text, (10, 40))
        
        # Inventory count
        inventory_text = self.font_small.render(f"Snacks: {len(player.inventory)}", True, (255, 200, 100))
        screen.blit(inventory_text, (10, 60))
        
        # Noise level indicator
        noise_color = self.get_noise_color(player.noise_level)
        noise_text = self.font_small.render(f"Noise: {player.noise_level}", True, noise_color)
        screen.blit(noise_text, (10, 80))
        
        # Time loop progress bar
        self.render_progress_bar(screen, time_loop.get_progress())
    
    def render_progress_bar(self, screen, progress):
        """Render a progress bar for the time loop"""
        bar_width = 200
        bar_height = 20
        bar_x = screen.get_width() - bar_width - 10
        bar_y = 10
        
        # Background
        pygame.draw.rect(screen, (50, 50, 50), (bar_x, bar_y, bar_width, bar_height))
        
        # Progress fill
        fill_width = int(bar_width * progress)
        color = self.get_progress_color(progress)
        pygame.draw.rect(screen, color, (bar_x, bar_y, fill_width, bar_height))
        
        # Border
        pygame.draw.rect(screen, (255, 255, 255), (bar_x, bar_y, bar_width, bar_height), 2)
    
    def get_noise_color(self, noise_level):
        """Get color based on noise level"""
        if noise_level < 30:
            return (100, 255, 100)
        elif noise_level < 60:
            return (255, 255, 100)
        else:
            return (255, 100, 100)
    
    def get_progress_color(self, progress):
        """Get color based on time progress"""
        if progress < 0.5:
            return (100, 200, 255)
        elif progress < 0.8:
            return (255, 200, 100)
        else:
            return (255, 100, 100)
