import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useControllableState } from "../../lib/useControllableState";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Total number of pages. */
  count: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** How many page buttons to show around the current page. */
  siblingCount?: number;
  size?: "sm" | "md";
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** Page navigation with truncation (1 … 4 5 6 … 20). */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { count, page, defaultPage = 1, onPageChange, siblingCount = 1, size = "md", className, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllableState<number>({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });

  const go = (p: number) => setCurrent(Math.max(1, Math.min(count, p)));

  const pages = React.useMemo<Array<number | "…">>(() => {
    const total = siblingCount * 2 + 5;
    if (count <= total) return range(1, count);
    const left = Math.max(current - siblingCount, 1);
    const right = Math.min(current + siblingCount, count);
    const showLeftDots = left > 2;
    const showRightDots = right < count - 1;
    const out: Array<number | "…"> = [1];
    if (showLeftDots) out.push("…");
    out.push(...range(showLeftDots ? left : 2, showRightDots ? right : count - 1));
    if (showRightDots) out.push("…");
    out.push(count);
    return out;
  }, [count, current, siblingCount]);

  return (
    <nav ref={ref} aria-label="Pagination" className={cx("msr-Pagination", className)} data-size={size} {...rest}>
      <button
        type="button"
        className="msr-Pagination__btn"
        aria-label="Previous page"
        disabled={current <= 1}
        onClick={() => go(current - 1)}
      >
        <Icon name="chevronLeft" size={16} />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="msr-Pagination__dots">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className="msr-Pagination__btn"
            data-active={p === current || undefined}
            aria-current={p === current ? "page" : undefined}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className="msr-Pagination__btn"
        aria-label="Next page"
        disabled={current >= count}
        onClick={() => go(current + 1)}
      >
        <Icon name="chevronRight" size={16} />
      </button>
    </nav>
  );
});
