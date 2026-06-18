import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export type TagTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";
export type TagSize = "sm" | "md";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
  size?: TagSize;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Show a remove (×) button and call this when clicked. */
  onRemove?: () => void;
}

/** Compact label / chip, optionally removable. */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = "neutral", size = "md", icon, onRemove, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx("msr-Tag", className)} data-tone={tone} data-size={size} {...rest}>
      {icon && <span className="msr-Tag__icon">{icon}</span>}
      <span className="msr-Tag__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="msr-Tag__remove"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
});
