import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Particles from './backgrounds/Particles';
import { gameApi, GameState } from '../services/gameApi';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();
  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  // Enhanced Colors - More aesthetic and modern
  const COLORS = {
    floor: '#2d2416',
    floorTile: '#3a2f1e',
    wall: '#1a1410',
    fridge: '#e8f4f8',
    fridgeHighlight: '#b8d4e8',
    counter: '#8b6f47',
    counterTop: '#a88b5f',
    table: '#6b5442',
    raccoon: '#7a7a7a',
    raccoonMask: '#2d2d2d',
    raccoonEye: '#ffffff',
    raccoonHiding: '#4a4a4a',
    human: '#ffb380',
    humanClothes: '#4a90e2',
    pet: '#d4a574',
    snackCommon: '#ffd93d',
    snackUncommon: '#6bcf7f',
    snackRare: '#6c9fff',
    snackLegendary: '#ff6bff',
    snackGlow: 'rgba(255, 217, 61, 0.3)',
    detectionLow: '#6bcf7f',
    detectionMed: '#ffd93d',
    detectionHigh: '#ff6b6b',
    uiBackground: 'rgba(0, 0, 0, 0.85)',
    uiBorder: '#00d9ff',
  };

  // Start game with backend
  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { state } = await gameApi.startGame();
      setGameState(state);
      setIsPlaying(true);
      setShowMessage('Game Started! Collect snacks and avoid detection!');
      setTimeout(() => setShowMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
      console.error('Failed to start game:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Game loop - update from backend
  useEffect(() => {
    if (!isPlaying || !gameState) return;

    const updateGame = async () => {
      try {
        // Check for movement keys
        let dx = 0;
        let dy = 0;
        
        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) dy -= 1;
        if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) dy += 1;
        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) dx -= 1;
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) dx += 1;

        // Send movement action if keys are pressed
        if (dx !== 0 || dy !== 0) {
          const { state } = await gameApi.sendAction({ 
            type: 'move', 
            direction: [dx, dy] 
          }, 0.1);
          setGameState(state);
        } else {
          // Just update state without action
          const { state } = await gameApi.sendAction({ 
            type: 'move', 
            direction: [0, 0] 
          }, 0.1);
          setGameState(state);
        }

        // Check for game over
        if (gameState.time_remaining <= 0) {
          setShowMessage(`Loop Complete! Collected ${gameState.player.inventory.length} snacks!`);
          setTimeout(() => {
            setIsPlaying(false);
          }, 3000);
        }
      } catch (err) {
        console.error('Game update error:', err);
      }
    };

    gameLoopRef.current = window.setInterval(updateGame, 100);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameState]);

  // Enhanced rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear and draw floor with tile pattern
      ctx.fillStyle = COLORS.floor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floor tiles
      const tileSize = 48;
      for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
          if ((x / tileSize + y / tileSize) % 2 === 0) {
            ctx.fillStyle = COLORS.floorTile;
            ctx.fillRect(x, y, tileSize, tileSize);
          }
        }
      }

      // Draw kitchen elements (fridge, counters, etc.)
      drawKitchen(ctx);

      // Draw snacks with glow effect
      gameState.snacks.forEach((snack) => {
        if (snack.collected) return;

        const color = 
          snack.rarity === 'common' ? COLORS.snackCommon :
          snack.rarity === 'uncommon' ? COLORS.snackUncommon :
          snack.rarity === 'rare' ? COLORS.snackRare :
          COLORS.snackLegendary;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          snack.position[0], snack.position[1], 0,
          snack.position[0], snack.position[1], 20
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(snack.position[0] - 20, snack.position[1] - 20, 40, 40);

        // Snack icon
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(snack.position[0], snack.position[1], 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw NPCs with better visuals
      gameState.npcs.forEach((npc) => {
        const x = npc.position[0];
        const y = npc.position[1];

        if (npc.type === 'human') {
          // Human body
          ctx.fillStyle = COLORS.humanClothes;
          ctx.fillRect(x - 8, y, 16, 20);

          // Human head
          ctx.fillStyle = COLORS.human;
          ctx.beginPath();
          ctx.arc(x, y - 5, 10, 0, Math.PI * 2);
          ctx.fill();

          // Detection indicator
          if (npc.state === 'investigating' || npc.state === 'alerted') {
            ctx.strokeStyle = npc.state === 'alerted' ? COLORS.detectionHigh : COLORS.detectionMed;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.stroke();

            // Exclamation mark
            if (npc.state === 'alerted') {
              ctx.fillStyle = COLORS.detectionHigh;
              ctx.font = 'bold 20px Arial';
              ctx.fillText('!', x - 5, y - 30);
            }
          }
        } else {
          // Pet
          ctx.fillStyle = COLORS.pet;
          ctx.beginPath();
          ctx.ellipse(x, y, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pet ears
          ctx.beginPath();
          ctx.moveTo(x - 8, y - 6);
          ctx.lineTo(x - 12, y - 12);
          ctx.lineTo(x - 6, y - 8);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(x + 8, y - 6);
          ctx.lineTo(x + 12, y - 12);
          ctx.lineTo(x + 6, y - 8);
          ctx.fill();
        }
      });

      // Draw player (raccoon) with enhanced visuals
      drawRaccoon(ctx, gameState.player.position[0], gameState.player.position[1], gameState.player.is_hiding);

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState]);

  // Draw kitchen elements
  const drawKitchen = (ctx: CanvasRenderingContext2D) => {
    // Fridge
    ctx.fillStyle = COLORS.fridge;
    ctx.fillRect(700, 50, 80, 150);
    ctx.fillStyle = COLORS.fridgeHighlight;
    ctx.fillRect(705, 55, 70, 140);
    ctx.strokeStyle = COLORS.wall;
    ctx.lineWidth = 2;
    ctx.strokeRect(700, 50, 80, 150);

    // Counter
    ctx.fillStyle = COLORS.counter;
    ctx.fillRect(50, 500, 300, 80);
    ctx.fillStyle = COLORS.counterTop;
    ctx.fillRect(50, 500, 300, 15);

    // Table
    ctx.fillStyle = COLORS.table;
    ctx.fillRect(400, 350, 150, 100);
    ctx.strokeStyle = COLORS.wall;
    ctx.lineWidth = 2;
    ctx.strokeRect(400, 350, 150, 100);
  };

  // Draw raccoon with details
  const drawRaccoon = (ctx: CanvasRenderingContext2D, x: number, y: number, isHiding: boolean) => {
    const alpha = isHiding ? 0.5 : 1.0;
    ctx.globalAlpha = alpha;

    // Body
    ctx.fillStyle = COLORS.raccoon;
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(x, y - 8, 12, 0, Math.PI * 2);
    ctx.fill();

    // Mask
    ctx.fillStyle = COLORS.raccoonMask;
    ctx.beginPath();
    ctx.ellipse(x - 5, y - 8, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 5, y - 8, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = COLORS.raccoonEye;
    ctx.beginPath();
    ctx.arc(x - 5, y - 8, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y - 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = COLORS.raccoon;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 16);
    ctx.lineTo(x - 12, y - 22);
    ctx.lineTo(x - 6, y - 18);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 16);
    ctx.lineTo(x + 12, y - 22);
    ctx.lineTo(x + 6, y - 18);
    ctx.fill();

    // Tail
    ctx.strokeStyle = COLORS.raccoon;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.quadraticCurveTo(x - 10, y + 20, x - 15, y + 25);
    ctx.stroke();

    ctx.globalAlpha = 1.0;
  };

  // Keyboard handling
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);

      // Handle special keys
      if (key === ' ') {
        e.preventDefault();
        if (gameState) {
          gameApi.sendAction({ type: 'hide' }, 0.016).then(({ state }) => {
            setGameState(state);
            setShowMessage(state.player.is_hiding ? 'Hiding...' : 'Moving...');
            setTimeout(() => setShowMessage(null), 1000);
          });
        }
      } else if (key === 'e') {
        e.preventDefault();
        if (gameState && gameState.available_interactions.length > 0) {
          gameApi.sendAction({ type: 'interact' }, 0.016).then(({ state }) => {
            setGameState(state);
            setShowMessage('Interacted!');
            setTimeout(() => setShowMessage(null), 1000);
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, gameState]);

  return (
    <section id="play" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]">
        <Particles
          particleColors={['#ffffff']}
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-[var(--accent-primary)] font-[var(--font-mono)] text-sm uppercase tracking-wider mb-4">
            LIVE PREVIEW
          </div>
          <h2 className="font-[var(--font-heading)] font-bold text-4xl sm:text-5xl text-[var(--text-primary)] mb-4">
            Play Now
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Experience the time-loop heist in your browser
          </p>
        </motion.div>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-[var(--bg-card)] rounded-3xl border-3 border-[var(--accent-primary)] shadow-[0_30px_80px_rgba(0,217,255,0.3)] overflow-hidden">
            {/* Canvas */}
            <div className="relative aspect-[4/3] bg-[var(--bg-secondary)]">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full"
              />

              {/* Start Overlay */}
              {!isPlaying && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
                >
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🦝</div>
                    <h3 className="text-3xl font-bold text-white">Trash Panda Loops</h3>
                    <p className="text-[var(--text-secondary)] max-w-md">
                      Sneak through the kitchen, collect snacks, and escape before time runs out!
                    </p>
                  </div>
                  <button
                    onClick={startGame}
                    className="group relative px-12 py-6 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[var(--accent-primary)]/50"
                  >
                    <span className="relative z-10">Start Game</span>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </button>
                  {error && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg px-6 py-3 text-red-200">
                      {error}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <div className="animate-spin text-6xl">🦝</div>
                    <p className="text-white text-xl">Loading game...</p>
                  </div>
                </motion.div>
              )}

              {/* HUD */}
              <AnimatePresence>
                {isPlaying && gameState && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4"
                  >
                    {/* Left HUD */}
                    <div className="bg-black/90 backdrop-blur-md rounded-2xl p-4 border-2 border-[var(--accent-primary)]/30 space-y-3 min-w-[180px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-sm">Time</span>
                        <span className="text-white font-[var(--font-mono)] text-2xl font-bold">
                          {gameState.time_remaining.toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-sm">Loop</span>
                        <span className="text-[var(--accent-primary)] font-[var(--font-mono)] text-lg">
                          #{gameState.loop_count}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-sm">Snacks</span>
                        <span className="text-[var(--accent-warning)] font-[var(--font-mono)] text-lg">
                          🧀 {gameState.player.inventory.length}
                        </span>
                      </div>
                    </div>

                    {/* Right HUD - Detection */}
                    <div className="bg-black/90 backdrop-blur-md rounded-2xl p-4 border-2 border-[var(--accent-primary)]/30 space-y-2 min-w-[180px]">
                      <div className="text-sm text-[var(--text-secondary)] text-center">Detection</div>
                      <div className="relative w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            width: `${gameState.detection_level}%`,
                            background: gameState.detection_level < 30 
                              ? COLORS.detectionLow
                              : gameState.detection_level < 70
                              ? COLORS.detectionMed
                              : COLORS.detectionHigh,
                          }}
                          animate={{ width: `${gameState.detection_level}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="text-center text-white font-[var(--font-mono)] text-sm">
                        {gameState.detection_level.toFixed(0)}%
                      </div>
                      {gameState.player.is_hiding && (
                        <div className="text-center text-[var(--accent-success)] text-xs font-bold">
                          🌿 HIDDEN
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Overlay */}
              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="bg-black/90 backdrop-blur-md rounded-2xl px-8 py-4 border-2 border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/50">
                      <p className="text-white text-xl font-bold text-center">{showMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-card)] p-6 border-t border-[var(--accent-primary)]/20">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-5 py-3 rounded-xl border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 transition-colors">
                  <kbd className="px-3 py-2 bg-[var(--bg-card)] rounded-lg text-sm font-[var(--font-mono)] font-bold text-[var(--accent-primary)] shadow-inner">W A S D</kbd>
                  <span className="text-sm text-[var(--text-secondary)]">Move</span>
                </div>
                <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-5 py-3 rounded-xl border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 transition-colors">
                  <kbd className="px-3 py-2 bg-[var(--bg-card)] rounded-lg text-sm font-[var(--font-mono)] font-bold text-[var(--accent-primary)] shadow-inner">E</kbd>
                  <span className="text-sm text-[var(--text-secondary)]">Interact</span>
                </div>
                <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-5 py-3 rounded-xl border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 transition-colors">
                  <kbd className="px-3 py-2 bg-[var(--bg-card)] rounded-lg text-sm font-[var(--font-mono)] font-bold text-[var(--accent-primary)] shadow-inner">SPACE</kbd>
                  <span className="text-sm text-[var(--text-secondary)]">Hide</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
