import * as React from "react";
import { cx } from "../../lib/cx";
import { MapLegend } from "../MapLegend/MapLegend";
import { DEFAULT_SCALE, colorForValue } from "../_lib/scale";

export interface ChoroplethRegion {
  id: string;
  /** SVG path data (`d` attribute) for the region outline. */
  d: string;
  name?: string;
  value?: number;
}

export interface ChoroplethProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Regions to draw — geography is supplied by the consumer (we ship none). */
  regions: ChoroplethRegion[];
  /** SVG viewBox matching the supplied path coordinates. */
  viewBox: string;
  scale?: string[];
  /** Domain bounds; inferred from region values when omitted. */
  min?: number;
  max?: number;
  /** Fill for regions without a value. */
  emptyColor?: string;
  showLegend?: boolean;
  legendLabel?: string;
  format?: (value: number) => string;
  onRegionClick?: (region: ChoroplethRegion) => void;
  onRegionHover?: (region: ChoroplethRegion | null) => void;
}

/** Value-shaded map of consumer-supplied SVG region paths. */
export const Choropleth = React.forwardRef<HTMLDivElement, ChoroplethProps>(function Choropleth(
  {
    regions,
    viewBox,
    scale = DEFAULT_SCALE,
    min,
    max,
    emptyColor = "var(--msr-color-surface-2)",
    showLegend = true,
    legendLabel,
    format,
    onRegionClick,
    onRegionHover,
    className,
    ...rest
  },
  ref,
) {
  const values = regions.map((r) => r.value).filter((v): v is number => typeof v === "number");
  const lo = min ?? (values.length ? Math.min(...values) : 0);
  const hi = max ?? (values.length ? Math.max(...values) : 1);

  const [hovered, setHovered] = React.useState<ChoroplethRegion | null>(null);
  const setHover = (r: ChoroplethRegion | null) => {
    setHovered(r);
    onRegionHover?.(r);
  };

  return (
    <div ref={ref} className={cx("msr-Choropleth", className)} {...rest}>
      <svg
        className="msr-Choropleth__svg"
        viewBox={viewBox}
        role="group"
        aria-label="Choropleth map"
        preserveAspectRatio="xMidYMid meet"
      >
        {regions.map((r) => {
          const fill = typeof r.value === "number" ? colorForValue(r.value, lo, hi, scale) : emptyColor;
          return (
            <path
              key={r.id}
              className="msr-Choropleth__region"
              d={r.d}
              fill={fill}
              data-active={hovered?.id === r.id || undefined}
              tabIndex={onRegionClick ? 0 : undefined}
              role={onRegionClick ? "button" : undefined}
              aria-label={onRegionClick ? (r.name ?? r.id) : undefined}
              onMouseEnter={() => setHover(r)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(r)}
              onBlur={() => setHover(null)}
              onClick={() => onRegionClick?.(r)}
              onKeyDown={(e) => {
                if (onRegionClick && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onRegionClick(r);
                }
              }}
            >
              <title>{r.name ?? r.id}{typeof r.value === "number" ? `: ${r.value}` : ""}</title>
            </path>
          );
        })}
      </svg>

      <div className="msr-Choropleth__footer">
        {hovered && (
          <div className="msr-Choropleth__readout" aria-live="polite">
            <span className="msr-Choropleth__readoutName">{hovered.name ?? hovered.id}</span>
            {typeof hovered.value === "number" && (
              <span className="msr-Choropleth__readoutValue">{hovered.value}</span>
            )}
          </div>
        )}
        {showLegend && values.length > 0 && (
          <MapLegend min={lo} max={hi} scale={scale} label={legendLabel} format={format} />
        )}
      </div>
    </div>
  );
});
