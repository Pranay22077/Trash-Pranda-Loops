import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kfkxhlcolwqpwjnmklma.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma3hobGNvbHdxcHdqbm1rbG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTAzNDgsImV4cCI6MjA4NzUyNjM0OH0.MuLwk5YIXSq_rZsy7Pkg_jqm6aPlhQNM8ydyzvHQzDg';

// Only create client in browser environment
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Return a mock client during SSR/build
    return null as any;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'trash-panda-auth',
        storage: window.localStorage,
        flowType: 'pkce',
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-client-info': 'trash-panda-loops',
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return supabaseInstance;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client?.[prop as keyof typeof client];
  },
});

// Types
export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_score: number;
  total_snacks_collected: number;
  total_loops_completed: number;
  total_play_time: number;
  highest_level: number;
  current_level: number;
  experience_points: number;
  rank: string;
  created_at: string;
  updated_at: string;
  last_played_at: string | null;
}

export interface Level {
  id: number;
  level_number: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
  time_limit: number;
  snacks_required: number;
  npc_count: number;
  npc_speed: number;
  detection_sensitivity: number;
  unlock_requirement: number | null;
  experience_reward: number;
  layout_data: any;
}

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: 'collection' | 'stealth' | 'speed' | 'mastery' | 'special';
  requirement_type: string;
  requirement_value: number;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: number;
  unlocked_at: string;
  progress: number;
  achievement: Achievement;
}

export interface GameSession {
  id: string;
  user_id: string;
  level_id: number;
  score: number;
  snacks_collected: number;
  time_taken: number | null;
  loops_completed: number;
  detection_count: number;
  perfect_stealth: boolean;
  completed: boolean;
  started_at: string;
  completed_at: string | null;
  session_data: any;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  level_id: number;
  score: number;
  snacks_collected: number;
  time_taken: number;
  perfect_stealth: boolean;
  rank: number | null;
  created_at: string;
  profile: Profile;
}

export interface UserProgress {
  id: string;
  user_id: string;
  level_id: number;
  best_score: number;
  best_time: number | null;
  attempts: number;
  completed: boolean;
  stars: number;
  unlocked: boolean;
  first_completed_at: string | null;
  last_played_at: string;
}
