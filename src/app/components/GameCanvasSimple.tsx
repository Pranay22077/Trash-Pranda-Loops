import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Particles from './backgrounds/Particles';

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

export function GameCanvasSimple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 100, y: 500 });
  const [isHiding, setIsHiding] = useState(false);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [detection, setDetection] = useState(0);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  
  const animationFrameRef = useRef<number>();
  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  const lastUpdateTime = useRef<number>(Date.now());

  // Colors
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
    human: '#ffb380',
    humanClothes: '#4a90e2',
    pet: '#d4a574',
    snackCommon: '#ffd93d',
    snackUncommon: '#6bcf7f',
    snackRare: '#6c9fff',
    snackLegendary: '#ff6bff',
    detectionLow: '#6bcf7f',
    detectionMed: '#ffd93d',
    detectionHigh: '#ff6b6b',
  };

  // Initialize game
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setPlayerPos({ x: 100, y: 500 });
    setIsHiding(false);
    setTimeRemaining(60);
    setDetection(0);
    setScore(0);
    
    // Spawn snacks
    const newSnacks: Snack[] = [
      { id: 1, position: { x: 200, y: 150 }, rarity: 'common', collected: false, value: 10 },
      { id: 2, position: { x: 400, y: 300 }, rarity: 'uncommon', collected: false, value: 25 },
      { id: 3, position: { x: 600, y: 200 }, rarity: 'rare', collected: false, value: 50 },
      { id: 4, position: { x: 300, y: 450 }, rarity: 'legendary', collected: false, value: 100 },
      { id: 5, position: { x: 650, y: 450 }, rarity: 'common', collected: false, value: 10 },
    ];
    setSnacks(newSnacks);
    
    // Spawn NPCs
    const newNPCs: NPC[] = [
      { id: 1, position: { x: 400, y: 200 }, type: 'human', state: 'patrolling', direction: 1, patrolIndex: 0 },
      { id: 2, position: { x: 600, y: 400 }, type: 'pet', state: 'patrolling', direction: 1, patrolIndex: 0 },
    ];
    setNPCs(newNPCs);
    
    lastUpdateTime.current = Date.now();
    setShowMessage('Collect snacks and avoid detection!');
    setTimeout(() => setShowMessage(null), 2000);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = () => {
      const now = Date.now();
      const dt = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      // Update time
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - dt);
        if (newTime <= 0) {
          setIsPlaying(false);
          setShowMessage(`Loop Complete! Score: ${score}`);
        }
        return newTime;
      });

      // Update player movement
      let dx = 0;
      let dy = 0;
      const speed = 3;

      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) dy -= speed;
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) dy += speed;
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) dx -= speed;
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) dx += speed;

      if (!isHiding && (dx !== 0 || dy !== 0)) {
        setPlayerPos(prev => ({
          x: Math.max(20, Math.min(780, prev.x + dx)),
          y: Math.max(20, Math.min(580, prev.y + dy))
        }));
      }

      // Decrease detection slowly over time when not near NPCs
      setDetection(prev => Math.max(0, prev - 0.3));

      // Decrease detection faster when hiding
      if (isHiding) {
        setDetection(prev => Math.max(0, prev - 2));
      }

      // Update NPCs
      setNPCs(prevNPCs => prevNPCs.map(npc => {
        const newNPC = { ...npc };
        
        // Simple patrol movement
        if (npc.type === 'human') {
          newNPC.position.x += npc.direction * 2;
          if (newNPC.position.x > 700 || newNPC.position.x < 300) {
            newNPC.direction *= -1;
          }
        } else {
          newNPC.position.y += npc.direction * 1.5;
          if (newNPC.position.y > 500 || newNPC.position.y < 200) {
            newNPC.direction *= -1;
          }
        }

        // Check distance to player
        const dist = Math.sqrt(
          Math.pow(newNPC.position.x - playerPos.x, 2) +
          Math.pow(newNPC.position.y - playerPos.y, 2)
        );

        // Detection only increases when near NPCs
        if (dist < 60 && !isHiding) {
          // Very close - rapid detection increase
          newNPC.state = 'alerted';
          setDetection(prev => Math.min(100, prev + 3));
        } else if (dist < 120 && !isHiding) {
          // Medium distance - moderate detection increase
          newNPC.state = 'investigating';
          setDetection(prev => Math.min(100, prev + 1));
        } else if (dist < 180 && !isHiding) {
          // Far distance - slow detection increase
          newNPC.state = 'investigating';
          setDetection(prev => Math.min(100, prev + 0.3));
        } else {
          // Out of range - no detection
          newNPC.state = 'patrolling';
        }

        return newNPC;
      }));

      // Check snack collection
      setSnacks(prevSnacks => prevSnacks.map(snack => {
        if (snack.collected) return snack;

        const dist = Math.sqrt(
          Math.pow(snack.position.x - playerPos.x, 2) +
          Math.pow(snack.position.y - playerPos.y, 2)
        );

        if (dist < 30) {
          setScore(prev => prev + snack.value);
          setShowMessage(`+${snack.value} points!`);
          setTimeout(() => setShowMessage(null), 1000);
          return { ...snack, collected: true };
        }

        return snack;
      }));

      // Check for detection game over
      if (detection >= 100) {
        setIsPlaying(false);
        setShowMessage('Detected! Game Over');
      }
    };

    gameLoopRef.current = window.setInterval(gameLoop, 1000 / 60);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, playerPos, isHiding, score, detection]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear and draw floor
      ctx.fillStyle = COLORS.floor;
      ctx.fillRect(0, 0, 800, 600);

      // Draw floor tiles
      const tileSize = 48;
      for (let x = 0; x < 800; x += tileSize) {
        for (let y = 0; y < 600; y += tileSize) {
          if ((x / tileSize + y / tileSize) % 2 === 0) {
            ctx.fillStyle = COLORS.floorTile;
            ctx.fillRect(x, y, tileSize, tileSize);
          }
        }
      }

      // Draw kitchen elements
      // Fridge
      ctx.fillStyle = COLORS.fridge;
      ctx.fillRect(700, 50, 80, 150);
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
      ctx.strokeRect(400, 350, 150, 100);

      // Draw snacks
      snacks.forEach(snack => {
        if (snack.collected) return;

        const color = 
          snack.rarity === 'common' ? COLORS.snackCommon :
          snack.rarity === 'uncommon' ? COLORS.snackUncommon :
          snack.rarity === 'rare' ? COLORS.snackRare :
          COLORS.snackLegendary;

        // Glow
        const gradient = ctx.createRadialGradient(
          snack.position.x, snack.position.y, 0,
          snack.position.x, snack.position.y, 20
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(snack.position.x - 20, snack.position.y - 20, 40, 40);

        // Snack
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(snack.position.x, snack.position.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw NPCs
      npcs.forEach(npc => {
        // Draw detection range (subtle)
        if (npc.state !== 'patrolling') {
          ctx.strokeStyle = npc.state === 'alerted' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 217, 61, 0.1)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(npc.position.x, npc.position.y, npc.state === 'alerted' ? 60 : 120, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (npc.type === 'human') {
          // Body
          ctx.fillStyle = COLORS.humanClothes;
          ctx.fillRect(npc.position.x - 8, npc.position.y, 16, 20);
          // Head
          ctx.fillStyle = COLORS.human;
          ctx.beginPath();
          ctx.arc(npc.position.x, npc.position.y - 5, 10, 0, Math.PI * 2);
          ctx.fill();

          // Alert indicator
          if (npc.state === 'alerted') {
            ctx.fillStyle = COLORS.detectionHigh;
            ctx.font = 'bold 24px Arial';
            ctx.fillText('!', npc.position.x - 6, npc.position.y - 30);
          } else if (npc.state === 'investigating') {
            ctx.fillStyle = COLORS.detectionMed;
            ctx.font = 'bold 20px Arial';
            ctx.fillText('?', npc.position.x - 5, npc.position.y - 28);
          }
        } else {
          // Pet
          ctx.fillStyle = COLORS.pet;
          ctx.beginPath();
          ctx.ellipse(npc.position.x, npc.position.y, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Alert indicator for pet
          if (npc.state === 'alerted') {
            ctx.fillStyle = COLORS.detectionHigh;
            ctx.font = 'bold 20px Arial';
            ctx.fillText('!', npc.position.x - 5, npc.position.y - 20);
          }
        }
      });

      // Draw player
      const alpha = isHiding ? 0.5 : 1.0;
      ctx.globalAlpha = alpha;

      // Body
      ctx.fillStyle = COLORS.raccoon;
      ctx.beginPath();
      ctx.ellipse(playerPos.x, playerPos.y, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(playerPos.x, playerPos.y - 8, 12, 0, Math.PI * 2);
      ctx.fill();

      // Mask
      ctx.fillStyle = COLORS.raccoonMask;
      ctx.beginPath();
      ctx.ellipse(playerPos.x - 5, playerPos.y - 8, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(playerPos.x + 5, playerPos.y - 8, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = COLORS.raccoonEye;
      ctx.beginPath();
      ctx.arc(playerPos.x - 5, playerPos.y - 8, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(playerPos.x + 5, playerPos.y - 8, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1.0;

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playerPos, snacks, npcs, isHiding]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);

      if (key === ' ') {
        e.preventDefault();
        setIsHiding(prev => !prev);
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
  }, []);

  return (
    <section id="play" className="py-20 relative overflow-hidden">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-[var(--bg-card)] rounded-3xl border-3 border-[var(--accent-primary)] shadow-[0_30px_80px_rgba(0,217,255,0.3)] overflow-hidden">
            <div className="relative aspect-[4/3] bg-[var(--bg-secondary)]">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full"
              />

              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                </motion.div>
              )}

              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4"
                  >
                    <div className="bg-black/90 backdrop-blur-md rounded-2xl p-4 border-2 border-[var(--accent-primary)]/30 space-y-3 min-w-[180px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-sm">Time</span>
                        <span className="text-white font-[var(--font-mono)] text-2xl font-bold">
                          {timeRemaining.toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)] text-sm">Score</span>
                        <span className="text-[var(--accent-warning)] font-[var(--font-mono)] text-lg">
                          {score}
                        </span>
                      </div>
                    </div>

                    <div className="bg-black/90 backdrop-blur-md rounded-2xl p-4 border-2 border-[var(--accent-primary)]/30 space-y-2 min-w-[180px]">
                      <div className="text-sm text-[var(--text-secondary)] text-center">Detection</div>
                      <div className="relative w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            width: `${detection}%`,
                            background: detection < 30 
                              ? COLORS.detectionLow
                              : detection < 70
                              ? COLORS.detectionMed
                              : COLORS.detectionHigh,
                          }}
                          animate={{ width: `${detection}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="text-center text-white font-[var(--font-mono)] text-sm">
                        {detection.toFixed(0)}%
                      </div>
                      {isHiding && (
                        <div className="text-center text-[var(--accent-success)] text-xs font-bold">
                          🌿 HIDDEN
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

            <div className="bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-card)] p-6 border-t border-[var(--accent-primary)]/20">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-5 py-3 rounded-xl border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 transition-colors">
                  <kbd className="px-3 py-2 bg-[var(--bg-card)] rounded-lg text-sm font-[var(--font-mono)] font-bold text-[var(--accent-primary)] shadow-inner">W A S D</kbd>
                  <span className="text-sm text-[var(--text-secondary)]">Move</span>
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
