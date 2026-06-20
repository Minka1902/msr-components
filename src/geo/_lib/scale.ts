/** Dependency-free color-scale helpers for the geo components. */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function parseHex(hex: string): RgbColor {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex({ r, g, b }: RgbColor): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interpolate across a list of hex color stops. `t` is clamped to [0, 1].
 * With two stops this is a simple two-color gradient.
 */
export function interpolateColor(stops: string[], t: number): string {
  if (stops.length === 0) return "#000000";
  if (stops.length === 1) return stops[0];
  const clamped = Math.max(0, Math.min(1, t));
  const seg = clamped * (stops.length - 1);
  const i = Math.min(Math.floor(seg), stops.length - 2);
  const local = seg - i;
  const a = parseHex(stops[i]);
  const b = parseHex(stops[i + 1]);
  return toHex({
    r: lerp(a.r, b.r, local),
    g: lerp(a.g, b.g, local),
    b: lerp(a.b, b.b, local),
  });
}

/** Map a value within [min, max] to a color along the stops. */
export function colorForValue(
  value: number,
  min: number,
  max: number,
  stops: string[],
): string {
  if (max <= min) return interpolateColor(stops, 0);
  return interpolateColor(stops, (value - min) / (max - min));
}

/** Build `steps` evenly spaced threshold/color pairs for a discrete legend. */
export function legendSteps(
  min: number,
  max: number,
  stops: string[],
  steps = 5,
): Array<{ value: number; color: string }> {
  const out: Array<{ value: number; color: string }> = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    out.push({ value: min + (max - min) * t, color: interpolateColor(stops, t) });
  }
  return out;
}

/** Default sequential blue scale. */
export const DEFAULT_SCALE = ["#e0f2fe", "#0284c7", "#0c4a6e"];
