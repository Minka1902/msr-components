import * as React from "react";

export interface ConfettiProps {
  /** Increment/change this to fire a burst. */
  fire?: number | boolean;
  /** Number of particles per burst. */
  count?: number;
  /** Origin as fractions of the viewport (0–1). */
  originX?: number;
  originY?: number;
  colors?: string[];
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  color: string;
  size: number;
}

const DEFAULT_COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

/** Lightweight canvas confetti burst. Trigger by changing `fire`. */
export function Confetti({
  fire,
  count = 120,
  originX = 0.5,
  originY = 0.5,
  colors = DEFAULT_COLORS,
  duration = 2500,
}: ConfettiProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number>();

  React.useEffect(() => {
    if (fire === undefined || fire === false) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const ox = window.innerWidth * originX;
    const oy = window.innerHeight * originY;
    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
      };
    });

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.vy += 0.18; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fire, count, originX, originY, colors, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="msr-Confetti"
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", width: "100%", height: "100%", zIndex: 9999 }}
    />
  );
}
