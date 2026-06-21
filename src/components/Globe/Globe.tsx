import * as React from "react";
import { cx } from "../../lib/cx";
import { useAnimationFrame } from "../../lib/useAnimationFrame";

export interface GlobeMarker {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
}

export interface GlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  /** Auto-rotation speed in degrees/second (0 to disable). */
  speed?: number;
  /** Vertical tilt of the view, degrees. */
  tilt?: number;
  dotColor?: string;
  markerColor?: string;
  markers?: GlobeMarker[];
  /** Allow dragging to spin. */
  interactive?: boolean;
}

const DEG = Math.PI / 180;

/** Auto-rotating dotted globe with plottable markers (canvas, no deps). */
export const Globe = React.forwardRef<HTMLDivElement, GlobeProps>(function Globe(
  { size = 300, speed = 14, tilt = 18, dotColor = "var(--msr-color-fg-muted)", markerColor = "var(--msr-color-primary)", markers = [], interactive = true, className, style, ...rest },
  ref,
) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rotation = React.useRef(0);
  const dragging = React.useRef<{ x: number; rot: number } | null>(null);
  const resolved = React.useRef({ dot: "#888", marker: "#3b82f6" });

  // Resolve CSS-var colors to concrete values for canvas.
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const probe = (val: string, fallback: string) => {
      const m = val.match(/var\((--[^)]+)\)/);
      if (!m) return val;
      const v = cs.getPropertyValue(m[1]).trim();
      return v || fallback;
    };
    resolved.current = {
      dot: probe(dotColor, "#888"),
      marker: probe(markerColor, "#3b82f6"),
    };
  }, [dotColor, markerColor]);

  const grid = React.useMemo(() => {
    const pts: Array<{ lat: number; lng: number }> = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      const ring = Math.max(1, Math.round(Math.cos(lat * DEG) * 24));
      for (let k = 0; k < ring; k++) pts.push({ lat, lng: -180 + (k * 360) / ring });
    }
    return pts;
  }, []);

  useAnimationFrame((dt) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    if (!dragging.current && speed) rotation.current += (speed * dt) / 1000;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const R = (size / 2) * 0.9;
    const c = size / 2;
    const φ0 = tilt * DEG;

    const project = (lat: number, lng: number) => {
      const φ = lat * DEG;
      const λ = (lng + rotation.current) * DEG;
      const cosc = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ);
      const x = Math.cos(φ) * Math.sin(λ);
      const y = Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ);
      return { sx: c + R * x, sy: c - R * y, depth: cosc };
    };

    // Sphere disc.
    ctx.beginPath();
    ctx.arc(c, c, R, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(125,125,125,0.06)";
    ctx.fill();

    // Dots.
    for (const p of grid) {
      const { sx, sy, depth } = project(p.lat, p.lng);
      if (depth < 0) continue;
      ctx.globalAlpha = 0.25 + depth * 0.6;
      ctx.fillStyle = resolved.current.dot;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8 + depth * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Markers.
    for (const m of markers) {
      const { sx, sy, depth } = project(m.lat, m.lng);
      if (depth < 0) continue;
      ctx.globalAlpha = 0.4 + depth * 0.6;
      ctx.fillStyle = m.color ?? resolved.current.marker;
      ctx.beginPath();
      ctx.arc(sx, sy, 3 + depth * 1.5, 0, Math.PI * 2);
      ctx.fill();
      if (m.label && depth > 0.3) {
        ctx.globalAlpha = depth;
        ctx.fillStyle = resolved.current.marker;
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillText(m.label, sx + 6, sy + 3);
      }
    }
    ctx.globalAlpha = 1;
  });

  const setRefs = (node: HTMLDivElement | null) => {
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  return (
    <div ref={setRefs} className={cx("msr-Globe", className)} style={{ width: size, height: size, ...style }} {...rest}>
      <canvas
        ref={canvasRef}
        className="msr-Globe__canvas"
        style={{ width: size, height: size, cursor: interactive ? "grab" : undefined, touchAction: "none" }}
        onPointerDown={
          interactive
            ? (e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragging.current = { x: e.clientX, rot: rotation.current };
              }
            : undefined
        }
        onPointerMove={
          interactive
            ? (e) => {
                if (dragging.current) rotation.current = dragging.current.rot + (e.clientX - dragging.current.x) * 0.5;
              }
            : undefined
        }
        onPointerUp={interactive ? () => (dragging.current = null) : undefined}
        aria-hidden="true"
      />
    </div>
  );
});
