import * as React from "react";
import { cx } from "../../lib/cx";
import { MapLegend } from "../MapLegend/MapLegend";
import { DEFAULT_SCALE, colorForValue } from "../_lib/scale";
import { WORLD_TILE_GRID, type WorldTile } from "./worldGrid";

export interface TileGridMapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Tile layout. Defaults to the built-in compact world grid. */
  tiles?: WorldTile[];
  /** value-by-country-code, used to color tiles. */
  values?: Record<string, number>;
  /** Highlight specific country codes (e.g. a correct guess). */
  highlight?: string[];
  scale?: string[];
  min?: number;
  max?: number;
  emptyColor?: string;
  /** Show the 2-letter code inside each tile. */
  showLabels?: boolean;
  showLegend?: boolean;
  legendLabel?: string;
  format?: (value: number) => string;
  onTileClick?: (tile: WorldTile) => void;
}

/** Abstract tile-grid world map: one square per country, colored by value. */
export const TileGridMap = React.forwardRef<HTMLDivElement, TileGridMapProps>(function TileGridMap(
  {
    tiles = WORLD_TILE_GRID,
    values,
    highlight,
    scale = DEFAULT_SCALE,
    min,
    max,
    emptyColor = "var(--msr-color-surface-2)",
    showLabels = true,
    showLegend = false,
    legendLabel,
    format,
    onTileClick,
    className,
    ...rest
  },
  ref,
) {
  const cols = React.useMemo(() => Math.max(...tiles.map((t) => t.col)) + 1, [tiles]);
  const rows = React.useMemo(() => Math.max(...tiles.map((t) => t.row)) + 1, [tiles]);

  const vals = values ? Object.values(values) : [];
  const lo = min ?? (vals.length ? Math.min(...vals) : 0);
  const hi = max ?? (vals.length ? Math.max(...vals) : 1);
  const highlightSet = React.useMemo(() => new Set((highlight ?? []).map((c) => c.toUpperCase())), [highlight]);

  const [hovered, setHovered] = React.useState<WorldTile | null>(null);

  return (
    <div ref={ref} className={cx("msr-TileGridMap", className)} {...rest}>
      <div
        className="msr-TileGridMap__grid"
        role="group"
        aria-label="Tile grid map"
        style={{
          gridTemplateColumns: `repeat(${cols}, var(--msr-tgm-cell, 28px))`,
          gridTemplateRows: `repeat(${rows}, var(--msr-tgm-cell, 28px))`,
        }}
      >
        {tiles.map((t) => {
          const v = values?.[t.code];
          const fill = typeof v === "number" ? colorForValue(v, lo, hi, scale) : emptyColor;
          const isHi = highlightSet.has(t.code.toUpperCase());
          return (
            <button
              key={t.code}
              type="button"
              className="msr-TileGridMap__tile"
              data-highlight={isHi || undefined}
              data-active={hovered?.code === t.code || undefined}
              disabled={!onTileClick}
              style={{ gridColumn: t.col + 1, gridRow: t.row + 1, backgroundColor: fill }}
              aria-label={typeof v === "number" ? `${t.name}: ${v}` : t.name}
              title={typeof v === "number" ? `${t.name}: ${v}` : t.name}
              onMouseEnter={() => setHovered(t)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(t)}
              onBlur={() => setHovered(null)}
              onClick={() => onTileClick?.(t)}
            >
              {showLabels && <span className="msr-TileGridMap__code">{t.code}</span>}
            </button>
          );
        })}
      </div>

      <div className="msr-TileGridMap__footer">
        {hovered && (
          <div className="msr-TileGridMap__readout" aria-live="polite">
            <span className="msr-TileGridMap__readoutName">{hovered.name}</span>
            {values && typeof values[hovered.code] === "number" && (
              <span className="msr-TileGridMap__readoutValue">{values[hovered.code]}</span>
            )}
          </div>
        )}
        {showLegend && vals.length > 0 && (
          <MapLegend min={lo} max={hi} scale={scale} label={legendLabel} format={format} />
        )}
      </div>
    </div>
  );
});

export { WORLD_TILE_GRID };
export type { WorldTile };
