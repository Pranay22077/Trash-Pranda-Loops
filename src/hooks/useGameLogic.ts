import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/database';
import { Level } from '../lib/supabase';

interface Position {
  x: number;
  y: number;
}

interface Snack {
  id: number;
  position: Position;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  collected: boolean;
  value: number;
}

interface NPC {
  id: number;
  position: Position;
  type: 'human' | 'pet';
  state: 'patrolling' | 'investigating' | 'alerted';
  direction: number;
  patrolIndex: number;
}

export function useGameLogic() {
  const { user, profile, refreshProfile } = useAuth();
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [levelNumber, setLevelNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 100, y: 500 });
  const [isHiding, setIsHiding] = useState(false);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [detection, setDetection] = useState(0);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  
  const keysPressed = useRef<Set<string>>(new Set());
  const lastUpdateTime = useRef<number>(Date.now());
  const gameLoopRef = useRef<number>();

  // Load level from database
  const loadLevel = useCallback(async (levelNum: number) => {
    try {
      const level = await db.getLevelByNumber(levelNum);
      if (level) {
        setCurrentLevel(level);
        setTimeRemaining(level.time_limit);
        return level;
      }
    } catch (error) {
      console.error('Error loading level:', error);
    }
    return null;
  }, []);

  // Start game
  const startGame = useCallback(async () => {
    if (!user) {
      setShowMessage('Please sign in to play!');
      return;
    }

    const level = await loadLevel(levelNumber);
    if (!level) {
      setShowMessage('Level not found!');
      return;
    }

    // Create game session in database
    try {
      const session = await db.createGameSession(user.id, level.id);
      setSessionId(session.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }

    setIsPlaying(true);
    setPlayerPos({ x: 100, y: 500 });
    setIsHiding(false);
    setDetection(0);
    setScore(0);
    setGameStartTime(Date.now());
    
    // Spawn snacks based on level
    const newSnacks: Snack[] = [];
    for (let i = 0; i < level.snacks_required; i++) {
      newSnacks.push({
        id: i + 1,
        position: {
          x: 150 + Math.random() * 600,
          y: 100 + Math.random() * 400
        },
        rarity: i === level.snacks_required - 1 ? 'legendary' : 
               i >= level.snacks_required - 3 ? 'rare' :
               i >= level.snacks_required - 5 ? 'uncommon' : 'common',
        collected: false,
        value: i === level.snacks_required - 1 ? 100 :
               i >= level.snacks_required - 3 ? 50 :
               i >= level.snacks_required - 5 ? 25 : 10
      });
    }
    setSnacks(newSnacks);
    
    // Spawn NPCs based on level
    const newNPCs: NPC[] = [];
    for (let i = 0; i < level.npc_count; i++) {
      newNPCs.push({
        id: i + 1,
        position: {
          x: 300 + i * 150,
          y: 200 + i * 100
        },
        type: i % 2 === 0 ? 'human' : 'pet',
        state: 'patrolling',
        direction: 1,
        patrolIndex: 0
      });
    }
    setNPCs(newNPCs);
    
    lastUpdateTime.current = Date.now();
    setShowMessage(`Level ${level.level_number}: ${level.name}`);
    setTimeout(() => setShowMessage(null), 2000);
  }, [user, levelNumber, loadLevel]);

  // Complete level and progress
  const completeLevel = useCallback(async (success: boolean) => {
    if (!user || !sessionId || !currentLevel) return;

    const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);
    const snacksCollected = snacks.filter(s => s.collected).length;
    const perfectStealth = detection < 30;

    try {
      // Complete session in database
      await db.completeGameSession(sessionId, {
        score,
        snacksCollected,
        timeTaken,
        loopsCompleted: 1,
        detectionCount: Math.floor(detection),
        perfectStealth
      });

      // Update user stats
      await db.updateProfileStats(user.id, {
        score,
        snacks: snacksCollected,
        loops: 1,
        playTime: timeTaken,
        level: levelNumber,
        xp: currentLevel.experience_reward
      });

      // Update level progress
      const stars = perfectStealth && snacksCollected === currentLevel.snacks_required ? 3 :
                    snacksCollected === currentLevel.snacks_required ? 2 : 1;
      
      await db.updateLevelProgress(user.id, currentLevel.id, {
        score,
        time: timeTaken,
        completed: success,
        stars
      });

      // Check achievements
      const unlockedAchievements = await db.checkAndUnlockAchievements(user.id, {
        snacksCollected,
        perfectStealth,
        timeTaken,
        loopsCompleted: 1
      });

      if (unlockedAchievements.length > 0) {
        setShowMessage(`🏆 Achievement Unlocked!`);
      }

      // Unlock next level
      if (success && levelNumber < 10) {
        await db.unlockNextLevel(user.id, levelNumber);
      }

      // Refresh profile
      await refreshProfile();

      if (success) {
        setShowMessage(`Level Complete! Score: ${score} | Next Level in 3s...`);
        setTimeout(() => {
          setLevelNumber(prev => Math.min(prev + 1, 10));
          setIsPlaying(false);
        }, 3000);
      } else {
        setShowMessage(`Time's Up! Score: ${score} | Try Again`);
        setTimeout(() => setIsPlaying(false), 3000);
      }
    } catch (error) {
      console.error('Error completing level:', error);
    }
  }, [user, sessionId, currentLevel, score, snacks, detection, levelNumber, gameStartTime, refreshProfile]);

  return {
    // State
    currentLevel,
    levelNumber,
    isPlaying,
    playerPos,
    isHiding,
    snacks,
    npcs,
    timeRemaining,
    detection,
    score,
    showMessage,
    keysPressed,
    lastUpdateTime,
    gameLoopRef,
    
    // Actions
    setLevelNumber,
    setIsPlaying,
    setPlayerPos,
    setIsHiding,
    setSnacks,
    setNPCs,
    setTimeRemaining,
    setDetection,
    setScore,
    setShowMessage,
    startGame,
    completeLevel,
    loadLevel
  };
}
