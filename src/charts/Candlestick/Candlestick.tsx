import * as React from "react";
import { cx } from "../../lib/cx";

export interface Candle {
  label?: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Candle[];
  width?: number;
  height?: number;
  upColor?: string;
  downColor?: string;
  /** Show min/max price gridlines. */
  showGrid?: boolean;
}

/** OHLC candlestick chart (dependency-free SVG). */
export const Candlestick = React.forwardRef<HTMLDivElement, CandlestickProps>(function Candlestick(
  {
    data,
    width = 480,
    height = 220,
    upColor = "var(--msr-tone-success-fg)",
    downColor = "var(--msr-tone-danger-fg)",
    showGrid = true,
    className,
    ...rest
  },
  ref,
) {
  const pad = 8;
  const lows = data.map((d) => d.low);
  const highs = data.map((d) => d.high);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const span = max - min || 1;
  const innerH = height - pad * 2;

  const y = (v: number) => pad + innerH - ((v - min) / span) * innerH;
  const slot = width / Math.max(data.length, 1);
  const candleW = Math.max(2, Math.min(slot * 0.6, 18));

  return (
    <div ref={ref} className={cx("msr-Candlestick", className)} {...rest}>
      <svg className="msr-Candlestick__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Candlestick chart" preserveAspectRatio="none">
        {showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              className="msr-Candlestick__grid"
              x1={0}
              x2={width}
              y1={pad + innerH * t}
              y2={pad + innerH * t}
            />
          ))}
        {data.map((d, i) => {
          const cx0 = i * slot + slot / 2;
          const up = d.close >= d.open;
          const color = up ? upColor : downColor;
          const yOpen = y(d.open);
          const yClose = y(d.close);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyH = Math.max(1, Math.abs(yClose - yOpen));
          return (
            <g key={i} style={{ color }}>
              <line className="msr-Candlestick__wick" x1={cx0} x2={cx0} y1={y(d.high)} y2={y(d.low)} stroke="currentColor" />
              <rect
                className="msr-Candlestick__body"
                x={cx0 - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyH}
                fill={up ? "currentColor" : "var(--msr-color-surface)"}
                stroke="currentColor"
              >
                {d.label && <title>{`${d.label} · O${d.open} H${d.high} L${d.low} C${d.close}`}</title>}
              </rect>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
