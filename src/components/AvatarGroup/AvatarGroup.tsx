import * as React from "react";
import { cx } from "../../lib/cx";
import { Avatar, type AvatarSize } from "../Avatar/Avatar";

export interface AvatarGroupItem {
  name?: string;
  src?: string;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AvatarGroupItem[];
  /** Show at most this many; the rest collapse into a "+N". */
  max?: number;
  size?: AvatarSize;
}

/** Overlapping stack of avatars with an overflow count. */
export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup({ items, max = 4, size = "md", className, ...rest }, ref) {
    const shown = items.slice(0, max);
    const overflow = items.length - shown.length;
    return (
      <div ref={ref} className={cx("msr-AvatarGroup", className)} data-size={size} {...rest}>
        {shown.map((it, i) => (
          <span key={i} className="msr-AvatarGroup__item">
            <Avatar name={it.name} src={it.src} size={size} />
          </span>
        ))}
        {overflow > 0 && (
          <span className="msr-AvatarGroup__item msr-AvatarGroup__more" data-size={size} aria-label={`${overflow} more`}>
            +{overflow}
          </span>
        )}
      </div>
    );
  },
);
