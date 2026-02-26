import { supabase, Profile, Level, Achievement, UserAchievement, GameSession, LeaderboardEntry, UserProgress } from './supabase';

export const db = {
  // ============================================
  // PROFILE OPERATIONS
  // ============================================
  
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfileStats(userId: string, stats: {
    score?: number;
    snacks?: number;
    loops?: number;
    playTime?: number;
    level?: number;
    xp?: number;
  }) {
    const profile = await this.getProfile(userId);
    if (!profile) throw new Error('Profile not found');

    const updates: any = {
      last_played_at: new Date().toISOString(),
    };

    if (stats.score) updates.total_score = profile.total_score + stats.score;
    if (stats.snacks) updates.total_snacks_collected = profile.total_snacks_collected + stats.snacks;
    if (stats.loops) updates.total_loops_completed = profile.total_loops_completed + stats.loops;
    if (stats.playTime) updates.total_play_time = profile.total_play_time + stats.playTime;
    if (stats.level && stats.level > profile.highest_level) updates.highest_level = stats.level;
    if (stats.xp) {
      updates.experience_points = profile.experience_points + stats.xp;
      // Update rank based on XP
      updates.rank = this.calculateRank(updates.experience_points);
    }

    return this.updateProfile(userId, updates);
  },

  calculateRank(xp: number): string {
    if (xp < 500) return 'Rookie Raccoon';
    if (xp < 1500) return 'Sneaky Bandit';
    if (xp < 3000) return 'Master Thief';
    if (xp < 5000) return 'Shadow Legend';
    if (xp < 10000) return 'Trash Panda Elite';
    return 'Legendary Heist Master';
  },

  // ============================================
  // LEVEL OPERATIONS
  // ============================================

  async getAllLevels(): Promise<Level[]> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('level_number');
    
    if (error) throw error;
    return data || [];
  },

  async getLevel(levelId: number): Promise<Level | null> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .eq('id', levelId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getLevelByNumber(levelNumber: number): Promise<Level | null> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .eq('level_number', levelNumber)
      .single();
    
    if (error) throw error;
    return data;
  },

  // ============================================
  // GAME SESSION OPERATIONS
  // ============================================

  async createGameSession(userId: string, levelId: number): Promise<GameSession> {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        user_id: userId,
        level_id: levelId,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateGameSession(sessionId: string, updates: Partial<GameSession>) {
    const { data, error } = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async completeGameSession(sessionId: string, results: {
    score: number;
    snacksCollected: number;
    timeTaken: number;
    loopsCompleted: number;
    detectionCount: number;
    perfectStealth: boolean;
  }) {
    return this.updateGameSession(sessionId, {
      score: results.score,
      snacks_collected: results.snacksCollected,
      time_taken: results.timeTaken,
      loops_completed: results.loopsCompleted,
      detection_count: results.detectionCount,
      perfect_stealth: results.perfectStealth,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  },

  // ============================================
  // USER PROGRESS OPERATIONS
  // ============================================

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('level_id');
    
    if (error) throw error;
    return data || [];
  },

  async getLevelProgress(userId: string, levelId: number): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('level_id', levelId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  async updateLevelProgress(userId: string, levelId: number, progress: {
    score?: number;
    time?: number;
    completed?: boolean;
    stars?: number;
  }) {
    const existing = await this.getLevelProgress(userId, levelId);
    
    if (!existing) {
      // Create new progress entry
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          level_id: levelId,
          best_score: progress.score || 0,
          best_time: progress.time,
          attempts: 1,
          completed: progress.completed || false,
          stars: progress.stars || 0,
          unlocked: true,
          first_completed_at: progress.completed ? new Date().toISOString() : null,
          last_played_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Update existing progress
      const updates: any = {
        attempts: existing.attempts + 1,
        last_played_at: new Date().toISOString(),
      };

      if (progress.score && progress.score > existing.best_score) {
        updates.best_score = progress.score;
      }

      if (progress.time && (!existing.best_time || progress.time < existing.best_time)) {
        updates.best_time = progress.time;
      }

      if (progress.completed && !existing.completed) {
        updates.completed = true;
        updates.first_completed_at = new Date().toISOString();
      }

      if (progress.stars && progress.stars > existing.stars) {
        updates.stars = progress.stars;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .update(updates)
        .eq('user_id', userId)
        .eq('level_id', levelId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  async unlockNextLevel(userId: string, currentLevelNumber: number) {
    try {
      const nextLevel = await this.getLevelByNumber(currentLevelNumber + 1);
      if (!nextLevel) {
        console.log('No next level to unlock');
        return null;
      }

      // Check if already unlocked
      const existing = await this.getLevelProgress(userId, nextLevel.id);
      if (existing?.unlocked) {
        console.log('Next level already unlocked');
        return existing;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          level_id: nextLevel.id,
          unlocked: true,
          attempts: 0,
          best_score: 0,
        }, {
          onConflict: 'user_id,level_id'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error unlocking next level:', error);
      return null;
    }
  },

  // ============================================
  // LEADERBOARD OPERATIONS
  // ============================================

  async getGlobalLeaderboard(limit: number = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, total_score, total_snacks_collected, rank')
      .order('total_score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async getLevelLeaderboard(levelId: number, limit: number = 50): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select(`
        *,
        profile:profiles(username, display_name, avatar_url, rank)
      `)
      .eq('level_id', levelId)
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async getUserRank(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('profiles')
      .select('total_score')
      .order('total_score', { ascending: false });
    
    if (error) throw error;
    
    const userIndex = data?.findIndex(p => p.id === userId);
    return userIndex !== undefined && userIndex !== -1 ? userIndex + 1 : 0;
  },

  // Subscribe to leaderboard changes (realtime)
  subscribeToLeaderboard(levelId: number | null, callback: (payload: any) => void) {
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard_entries',
          filter: levelId ? `level_id=eq.${levelId}` : undefined,
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // ============================================
  // ACHIEVEMENT OPERATIONS
  // ============================================

  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('points');
    
    if (error) throw error;
    return data || [];
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async unlockAchievement(userId: string, achievementCode: string) {
    // Get achievement by code
    const { data: achievement, error: achError } = await supabase
      .from('achievements')
      .select('*')
      .eq('code', achievementCode)
      .single();
    
    if (achError) throw achError;
    if (!achievement) throw new Error('Achievement not found');

    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievement.id)
      .single();
    
    if (existing) return existing; // Already unlocked

    // Unlock achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async checkAndUnlockAchievements(userId: string, stats: {
    snacksCollected?: number;
    perfectStealth?: boolean;
    timeTaken?: number;
    loopsCompleted?: number;
  }) {
    const profile = await this.getProfile(userId);
    if (!profile) return [];

    const unlockedAchievements: string[] = [];

    const tryUnlock = async (code: string) => {
      try {
        await this.unlockAchievement(userId, code);
        unlockedAchievements.push(code);
      } catch (error) {
        console.log(`Achievement ${code} not found or already unlocked`);
      }
    };

    // Check snack collection achievements
    if (stats.snacksCollected) {
      if (profile.total_snacks_collected >= 1 && profile.total_snacks_collected < 50) {
        await tryUnlock('first_snack');
      }
      if (profile.total_snacks_collected >= 50 && profile.total_snacks_collected < 200) {
        await tryUnlock('snack_collector');
      }
      if (profile.total_snacks_collected >= 200 && profile.total_snacks_collected < 500) {
        await tryUnlock('snack_hoarder');
      }
      if (profile.total_snacks_collected >= 500 && profile.total_snacks_collected < 1000) {
        await tryUnlock('snack_master');
      }
      if (profile.total_snacks_collected >= 1000) {
        await tryUnlock('legendary_collector');
      }
    }

    // Check stealth achievements
    if (stats.perfectStealth) {
      await tryUnlock('ghost');
    }

    // Check speed achievements
    if (stats.timeTaken && stats.timeTaken < 30) {
      await tryUnlock('speed_demon');
    }

    // Check loop achievements
    if (stats.loopsCompleted) {
      if (profile.total_loops_completed === 1) {
        await tryUnlock('first_loop');
      }
      if (profile.total_loops_completed >= 100) {
        await tryUnlock('loop_veteran');
      }
    }

    return unlockedAchievements;
  },
};
