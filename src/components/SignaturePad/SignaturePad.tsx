import * as React from "react";
import { cx } from "../../lib/cx";

export interface SignaturePadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  width?: number;
  height?: number;
  penColor?: string;
  lineWidth?: number;
  /** Fired (debounced to stroke end) with a PNG data URL, or null when cleared. */
  onChange?: (dataUrl: string | null) => void;
  clearLabel?: string;
  /** Hide the built-in clear button. */
  hideClear?: boolean;
}

/** Canvas signature capture with smoothing, clear, and PNG export. */
export const SignaturePad = React.forwardRef<HTMLDivElement, SignaturePadProps>(function SignaturePad(
  { width = 360, height = 160, penColor = "#111827", lineWidth = 2.2, onChange, clearLabel = "Clear", hideClear = false, className, ...rest },
  ref,
) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);
  const last = React.useRef<{ x: number; y: number } | null>(null);
  const [empty, setEmpty] = React.useState(true);

  const ctxOf = () => canvasRef.current?.getContext("2d") ?? null;

  const point = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  };

  const start = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = ctxOf();
    const p = point(e);
    if (!ctx || !last.current) return;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (empty) setEmpty(false);
  };
  const end = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    onChange?.(canvasRef.current?.toDataURL("image/png") ?? null);
  };

  const clear = () => {
    const ctx = ctxOf();
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setEmpty(true);
    onChange?.(null);
  };

  return (
    <div ref={ref} className={cx("msr-SignaturePad", className)} {...rest}>
      <div className="msr-SignaturePad__surface" style={{ width, height }}>
        <canvas
          ref={canvasRef}
          width={width * 2}
          height={height * 2}
          className="msr-SignaturePad__canvas"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
        {empty && <span className="msr-SignaturePad__placeholder">Sign here</span>}
        <span className="msr-SignaturePad__baseline" aria-hidden="true" />
      </div>
      {!hideClear && (
        <button type="button" className="msr-SignaturePad__clear" onClick={clear} disabled={empty}>
          {clearLabel}
        </button>
      )}
    </div>
  );
});
