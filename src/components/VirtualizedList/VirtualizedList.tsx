import * as React from "react";
import { cx } from "../../lib/cx";

export interface VirtualizedListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: T[];
  /** Fixed row height in px. */
  rowHeight: number;
  /** Visible viewport height in px. */
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Extra rows rendered above/below the viewport. */
  overscan?: number;
  /** Stable key for a row. */
  rowKey?: (item: T, index: number) => string | number;
}

/** Windowed list: only renders rows near the viewport for huge datasets. */
export function VirtualizedList<T>({
  items,
  rowHeight,
  height,
  renderItem,
  overscan = 4,
  rowKey,
  className,
  style,
  ...rest
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const total = items.length * rowHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(height / rowHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const slice: React.ReactNode[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    slice.push(
      <div
        key={rowKey ? rowKey(items[i], i) : i}
        className="msr-VList__row"
        style={{ position: "absolute", top: i * rowHeight, height: rowHeight, left: 0, right: 0 }}
      >
        {renderItem(items[i], i)}
      </div>,
    );
  }

  return (
    <div
      className={cx("msr-VList", className)}
      style={{ height, overflowY: "auto", ...style }}
      onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      {...rest}
    >
      <div className="msr-VList__sizer" style={{ height: total, position: "relative" }}>
        {slice}
      </div>
    </div>
  );
}
