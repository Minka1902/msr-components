import * as React from "react";
import { cx } from "../../lib/cx";

export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon or illustration node shown above the title. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Primary action(s), e.g. a <Button>. */
  action?: React.ReactNode;
  size?: EmptyStateSize;
}

/** Reusable placeholder for empty/zero-data views. */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    { icon, title, description, action, size = "md", className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("msr-EmptyState", className)}
        data-size={size}
        {...rest}
      >
        {icon && <div className="msr-EmptyState__icon">{icon}</div>}
        <div className="msr-EmptyState__title">{title}</div>
        {description && (
          <div className="msr-EmptyState__description">{description}</div>
        )}
        {action && <div className="msr-EmptyState__action">{action}</div>}
      </div>
    );
  },
);
