import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useControllableState } from "../../lib/useControllableState";

export interface RatingStarsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  max?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Display only, no interaction. */
  readOnly?: boolean;
  size?: number;
  label?: string;
}

/** Star rating input/display (supports half values when read-only). */
export const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  function RatingStars(
    { max = 5, value, defaultValue, onValueChange, readOnly, size = 20, label = "Rating", className, ...rest },
    ref,
  ) {
    const [val, setVal] = useControllableState<number>({
      value,
      defaultValue: defaultValue ?? 0,
      onChange: onValueChange,
    });
    const [hover, setHover] = React.useState<number | null>(null);
    const shown = hover ?? val;

    return (
      <div
        ref={ref}
        className={cx("msr-Rating", className)}
        data-readonly={readOnly || undefined}
        role={readOnly ? "img" : "slider"}
        aria-label={`${label}: ${val} of ${max}`}
        aria-valuenow={readOnly ? undefined : val}
        aria-valuemin={readOnly ? undefined : 0}
        aria-valuemax={readOnly ? undefined : max}
        tabIndex={readOnly ? undefined : 0}
        onKeyDown={(e) => {
          if (readOnly) return;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setVal(Math.min(max, val + 1)); }
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setVal(Math.max(0, val - 1)); }
        }}
        {...rest}
      >
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.round(shown);
          return (
            <span
              key={i}
              className="msr-Rating__star"
              data-filled={filled || undefined}
              style={{ fontSize: size }}
              onMouseEnter={() => !readOnly && setHover(i + 1)}
              onMouseLeave={() => !readOnly && setHover(null)}
              onClick={() => !readOnly && setVal(i + 1)}
            >
              <Icon name="star" size={size} />
            </span>
          );
        })}
      </div>
    );
  },
);
