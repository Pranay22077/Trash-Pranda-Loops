import { useEffect, useRef } from 'react';

interface PrismProps {
  animationType?: 'rotate' | 'wave' | 'pulse';
  timeScale?: number;
  height?: number;
  baseWidth?: number;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  noise?: number;
  glow?: number;
}

export default function Prism({
  animationType = 'rotate',
  timeScale = 0.5,
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0,
  glow = 1,
}: PrismProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      time += 0.01 * timeScale;

      // Draw prism effect
      const centerX = w / 2;
      const centerY = h / 2;

      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2 + time;
        const radius = 100 + Math.sin(time + i * 0.1) * 50;
        
        const x = centerX + Math.cos(angle) * radius * scale;
        const y = centerY + Math.sin(angle) * radius * scale;

        const hue = (i * colorFrequency * 360 / 50 + hueShift + time * 50) % 360;
        
        ctx.beginPath();
        ctx.arc(x, y, baseWidth, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.1)`;
        ctx.fill();

        if (glow > 0) {
          ctx.shadowBlur = 20 * glow;
          ctx.shadowColor = `hsl(${hue}, 70%, 60%)`;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [animationType, timeScale, height, baseWidth, scale, hueShift, colorFrequency, noise, glow]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}
