import * as React from "react";
import { cx } from "../../lib/cx";

export interface BarcodeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text to encode (Code 39 charset: 0-9 A-Z space - . $ / + %). */
  value: string;
  height?: number;
  /** Width of a narrow bar, px. */
  narrowWidth?: number;
  /** Wide:narrow ratio (2–3). */
  ratio?: number;
  showText?: boolean;
  lineColor?: string;
  background?: string;
}

// Code 39 patterns: 9 elements (bar,space,…) per char; "w"=wide, "n"=narrow.
const CODE39: Record<string, string> = {
  "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw",
  "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn",
  A: "wnnnnwnnw", B: "nnwnnwnnw", C: "wnwnnwnnn", D: "nnnnwwnnw", E: "wnnnwwnnn",
  F: "nnwnwwnnn", G: "nnnnnwwnw", H: "wnnnnwwnn", I: "nnwnnwwnn", J: "nnnnwwwnn",
  K: "wnnnnnnww", L: "nnwnnnnww", M: "wnwnnnnwn", N: "nnnnwnnww", O: "wnnnwnnwn",
  P: "nnwnwnnwn", Q: "nnnnnnwww", R: "wnnnnnwwn", S: "nnwnnnwwn", T: "nnnnwnwwn",
  U: "wwnnnnnnw", V: "nwwnnnnnw", W: "wwwnnnnnn", X: "nwnnwnnnw", Y: "wwnnwnnnn",
  Z: "nwwnwnnnn", "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", $: "nwnwnwnnn",
  "/": "nwnwnnnwn", "+": "nwnnnwnwn", "%": "nnnwnwnwn", "*": "nwnnwnwnn",
};

interface Bar { x: number; w: number }

function encode(text: string, narrow: number, wide: number): { bars: Bar[]; width: number } {
  const chars = ("*" + text.toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, "") + "*").split("");
  const bars: Bar[] = [];
  let x = 0;
  chars.forEach((ch, ci) => {
    const pattern = CODE39[ch];
    if (!pattern) return;
    for (let i = 0; i < pattern.length; i++) {
      const w = pattern[i] === "w" ? wide : narrow;
      if (i % 2 === 0) bars.push({ x, w }); // even index = bar
      x += w;
    }
    if (ci < chars.length - 1) x += narrow; // inter-character gap
  });
  return { bars, width: x };
}

/** Renders a Code 39 barcode as crisp SVG bars (no dependencies). */
export const Barcode = React.forwardRef<HTMLDivElement, BarcodeProps>(function Barcode(
  { value, height = 64, narrowWidth = 2, ratio = 2.5, showText = true, lineColor = "var(--msr-color-fg)", background = "transparent", className, ...rest },
  ref,
) {
  const wide = narrowWidth * ratio;
  const { bars, width } = React.useMemo(() => encode(value, narrowWidth, wide), [value, narrowWidth, wide]);

  return (
    <div ref={ref} className={cx("msr-Barcode", className)} {...rest}>
      <svg
        className="msr-Barcode__svg"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={`Barcode: ${value}`}
        preserveAspectRatio="none"
        style={{ background }}
      >
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={lineColor} />
        ))}
      </svg>
      {showText && <div className="msr-Barcode__text">{value}</div>}
    </div>
  );
});
