import * as React from "react";
import { cx } from "../../lib/cx";
import { useAnimationFrame } from "../../lib/useAnimationFrame";

export interface SparklesProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Number of sparkles. */
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  /** Twinkle speed multiplier. */
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  phase: number;
  rate: number;
  color: string;
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(a + Math.PI / 4) * r * 0.32, y + Math.sin(a + Math.PI / 4) * r * 0.32);
  }
  ctx.closePath();
  ctx.fill();
}

/** Twinkling sparkle particles layered around `children` (canvas). */
export const Sparkles = React.forwardRef<HTMLDivElement, SparklesProps>(function Sparkles(
  { children, count = 24, colors = ["#fde047", "#fef9c3", "var(--msr-color-primary)"], minSize = 4, maxSize = 10, speed = 1, className, ...rest },
  ref,
) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const particles = React.useRef<Particle[]>([]);
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  // Track container size.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // (Re)seed particles when size/count changes.
  React.useEffect(() => {
    if (size.w === 0 || size.h === 0) return;
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * size.w,
      y: Math.random() * size.h,
      size: minSize + Math.random() * (maxSize - minSize),
      phase: Math.random() * Math.PI * 2,
      rate: 0.6 + Math.random() * 1.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, [size, count, minSize, maxSize, colors]);

  useAnimationFrame((dt) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || size.w === 0) return;
    ctx.clearRect(0, 0, size.w, size.h);
    for (const p of particles.current) {
      p.phase += (dt / 1000) * p.rate * speed * 2;
      const tw = (Math.sin(p.phase) + 1) / 2;
      if (tw < 0.04) {
        p.x = Math.random() * size.w;
        p.y = Math.random() * size.h;
      }
      ctx.globalAlpha = tw;
      ctx.fillStyle = p.color;
      drawStar(ctx, p.x, p.y, p.size * (0.4 + tw * 0.6));
    }
    ctx.globalAlpha = 1;
  }, size.w > 0);

  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  return (
    <div ref={setRefs} className={cx("msr-Sparkles", className)} {...rest}>
      <canvas ref={canvasRef} className="msr-Sparkles__canvas" style={{ width: size.w, height: size.h }} aria-hidden="true" />
      <div className="msr-Sparkles__content">{children}</div>
    </div>
  );
});
