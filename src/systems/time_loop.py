"""
Time loop system - manages the 60-second loop cycle
"""

class TimeLoopSystem:
    def __init__(self, loop_duration=60.0):
        self.loop_duration = loop_duration
        self.current_time = 0.0
        self.is_complete = False
    
    def update(self, dt):
        """Update the time loop timer"""
        self.current_time += dt
        
        if self.current_time >= self.loop_duration:
            self.is_complete = True
    
    def reset(self):
        """Reset the loop for a new cycle"""
        self.current_time = 0.0
        self.is_complete = False
    
    def is_loop_complete(self):
        """Check if the loop has completed"""
        return self.is_complete
    
    def get_remaining_time(self):
        """Get remaining time in the loop"""
        return max(0, self.loop_duration - self.current_time)
    
    def get_progress(self):
        """Get loop progress as a percentage (0.0 to 1.0)"""
        return min(1.0, self.current_time / self.loop_duration)
