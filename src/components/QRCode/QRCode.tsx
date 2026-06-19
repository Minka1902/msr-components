import * as React from "react";
import { cx } from "../../lib/cx";
import { encodeQR, type EccLevel } from "../../lib/qr";

export interface QRCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The text/URL to encode. */
  value: string;
  /** Error-correction level (L/M/Q/H). Higher = more robust, larger. */
  level?: EccLevel;
  /** Rendered size in px. */
  size?: number;
  /** Quiet-zone border in modules (spec recommends 4). */
  margin?: number;
  /** Module (dark) color. Defaults to currentColor-ish dark token. */
  color?: string;
  /** Background color. */
  background?: string;
  /** Accessible label; defaults to the value. */
  title?: string;
}

/** Renders a scannable QR code as crisp SVG (dependency-free encoder). */
export const QRCode = React.forwardRef<HTMLDivElement, QRCodeProps>(function QRCode(
  { value, level = "M", size = 160, margin = 4, color = "#000000", background = "#ffffff", title, className, style, ...rest },
  ref,
) {
  const matrix = React.useMemo(() => {
    try {
      return encodeQR(value || " ", level);
    } catch {
      return null;
    }
  }, [value, level]);

  if (!matrix) {
    return (
      <div ref={ref} className={cx("msr-QRCode", "msr-QRCode--error", className)} style={style} {...rest}>
        Value too long
      </div>
    );
  }

  const count = matrix.length;
  const dim = count + margin * 2;

  // Build a single path string of all dark modules for compactness.
  let path = "";
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (matrix[y][x]) path += `M${x + margin},${y + margin}h1v1h-1z`;
    }
  }

  return (
    <div
      ref={ref}
      className={cx("msr-QRCode", className)}
      style={{ width: size, height: size, ...style }}
      role="img"
      aria-label={title ?? `QR code for ${value}`}
      {...rest}
    >
      <svg viewBox={`0 0 ${dim} ${dim}`} width="100%" height="100%" shapeRendering="crispEdges">
        <rect width={dim} height={dim} fill={background} />
        <path d={path} fill={color} />
      </svg>
    </div>
  );
});
