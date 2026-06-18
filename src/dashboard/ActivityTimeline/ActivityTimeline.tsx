import * as React from "react";
import { cx } from "../../lib/cx";
import type { BadgeTone } from "../../components/StatusBadge/StatusBadge";

export interface ActivityItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Pre-formatted time string or node. */
  timestamp?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: BadgeTone;
}

export interface ActivityTimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  items: ActivityItem[];
  /** Compact spacing. */
  dense?: boolean;
}

/** Chronological vertical timeline of events/changes/actions. */
export const ActivityTimeline = React.forwardRef<
  HTMLOListElement,
  ActivityTimelineProps
>(function ActivityTimeline({ items, dense = false, className, ...rest }, ref) {
  return (
    <ol
      ref={ref}
      className={cx("msr-Timeline", className)}
      data-dense={dense || undefined}
      {...rest}
    >
      {items.map((item) => (
        <li key={item.id} className="msr-Timeline__item">
          <div className="msr-Timeline__marker" data-tone={item.tone ?? "muted"}>
            {item.icon ?? <span className="msr-Timeline__dot" />}
          </div>
          <div className="msr-Timeline__content">
            <div className="msr-Timeline__head">
              <span className="msr-Timeline__title">{item.title}</span>
              {item.timestamp && (
                <time className="msr-Timeline__time">{item.timestamp}</time>
              )}
            </div>
            {item.description && (
              <div className="msr-Timeline__description">{item.description}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
});
