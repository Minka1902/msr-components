/** Small shared helpers for the dependency-free SVG charts. */

export interface Point {
  x: number;
  y: number;
}

/** Build an SVG polyline/points string. */
export function toPoints(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

/**
 * Map a series of numbers to SVG coordinates within a [width,height] box,
 * with vertical padding so strokes are not clipped.
 */
export function mapSeries(
  values: number[],
  width: number,
  height: number,
  pad = 2,
): Point[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const h = height - pad * 2;
  return values.map((v, i) => ({
    x: i * stepX,
    y: pad + h - ((v - min) / span) * h,
  }));
}

/** Smooth-ish area path (line + baseline close). */
export function areaPath(points: Point[], width: number, height: number): string {
  if (points.length === 0) return "";
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  return `${line} L${width},${height} L0,${height} Z`;
}

export function linePath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
}

/** Describe an SVG arc path for donut/gauge segments. */
export function arc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const polar = (angle: number) => ({
    x: cx + r * Math.cos((angle - 90) * (Math.PI / 180)),
    y: cy + r * Math.sin((angle - 90) * (Math.PI / 180)),
  });
  const start = polar(endAngle);
  const end = polar(startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}
