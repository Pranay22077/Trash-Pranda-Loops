/**
 * API service for communicating with the Python game backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface GameState {
  state: string;
  loop_count: number;
  time_remaining: number;
  player: {
    position: number[];
    noise_level: number;
    is_hiding: boolean;
    inventory: any[];
    abilities: string[];
    hunger: number;
    stamina: number;
  };
  npcs: Array<{
    type: string;
    position: number[];
    state: string;
    detection: number;
  }>;
  snacks: Array<{
    name: string;
    position: number[];
    value: number;
    rarity: string;
    collected: boolean;
  }>;
  detection_level: number;
  available_interactions: string[];
  progression: {
    total_points: number;
    unlocked_abilities: string[];
    available_unlocks: any[];
    stats: any;
  };
}

export interface GameAction {
  type: 'move' | 'interact' | 'hide' | 'use_ability';
  direction?: number[];
  ability_id?: string;
}

class GameAPI {
  private sessionId: number | null = null;

  async startGame(): Promise<{ sessionId: number; state: GameState }> {
    const response = await fetch(`${API_BASE_URL}/game/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to start game');
    }

    this.sessionId = data.session_id;
    return {
      sessionId: data.session_id,
      state: data.state,
    };
  }

  async getGameState(): Promise<GameState> {
    if (!this.sessionId) {
      throw new Error('No active game session');
    }

    const response = await fetch(`${API_BASE_URL}/game/${this.sessionId}/state`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to get game state');
    }

    return data.state;
  }

  async sendAction(action: GameAction, dt: number = 0.016): Promise<{ result: any; state: GameState }> {
    if (!this.sessionId) {
      throw new Error('No active game session');
    }

    const response = await fetch(`${API_BASE_URL}/game/${this.sessionId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, dt }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to process action');
    }

    return {
      result: data.result,
      state: data.state,
    };
  }

  async unlockAbility(abilityId: string): Promise<any> {
    if (!this.sessionId) {
      throw new Error('No active game session');
    }

    const response = await fetch(`${API_BASE_URL}/game/${this.sessionId}/unlock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ability_id: abilityId }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to unlock ability');
    }

    return data.result;
  }

  async getLeaderboard(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to get leaderboard');
    }

    return data.leaderboard;
  }

  async getStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to get stats');
    }

    return data.stats;
  }

  getSessionId(): number | null {
    return this.sessionId;
  }
}

export const gameApi = new GameAPI();
