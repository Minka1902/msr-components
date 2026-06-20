import * as React from "react";
import { cx } from "../../lib/cx";

export interface ScratchCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  width?: number;
  height?: number;
  /** Foil color painted over the content. */
  coverColor?: string;
  /** Optional image URL used as the scratch foil. */
  coverImage?: string;
  brushSize?: number;
  /** Fraction cleared (0–1) at which it auto-reveals. */
  revealThreshold?: number;
  onChange?: (percentCleared: number) => void;
  onComplete?: () => void;
  /** Hint shown on the foil. */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

/** Scratch-to-reveal foil over hidden content (canvas compositing). */
export const ScratchCard = React.forwardRef<HTMLDivElement, ScratchCardProps>(function ScratchCard(
  {
    width = 280,
    height = 160,
    coverColor = "#9ca3af",
    coverImage,
    brushSize = 26,
    revealThreshold = 0.5,
    onChange,
    onComplete,
    label = "Scratch here",
    children,
    className,
    ...rest
  },
  ref,
) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);
  const [revealed, setRevealed] = React.useState(false);
  const completedRef = React.useRef(false);

  const paintCover = React.useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.globalCompositeOperation = "source-over";
    if (coverImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.src = coverImage;
    } else {
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < c.width; i += 14) ctx.fillRect(i, 0, 6, c.height);
    }
  }, [coverColor, coverImage]);

  React.useEffect(() => {
    paintCover();
  }, [paintCover]);

  const clearedPct = (): number => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0;
    // Sample every 16th pixel's alpha for speed.
    for (let i = 3; i < data.length; i += 64) if (data[i] === 0) clear++;
    return clear / (data.length / 64);
  };

  const scratch = (e: React.PointerEvent) => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) * (c.width / r.width);
    const y = (e.clientY - r.top) * (c.height / r.height);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (revealed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    scratch(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current || revealed) return;
    scratch(e);
  };
  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const pct = clearedPct();
    onChange?.(pct);
    if (!completedRef.current && pct >= revealThreshold) {
      completedRef.current = true;
      setRevealed(true);
      onComplete?.();
    }
  };

  return (
    <div
      ref={ref}
      className={cx("msr-ScratchCard", className)}
      data-revealed={revealed || undefined}
      style={{ width, height }}
      {...rest}
    >
      <div className="msr-ScratchCard__content">{children}</div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="msr-ScratchCard__canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      {label && !revealed && <span className="msr-ScratchCard__label">{label}</span>}
    </div>
  );
});
