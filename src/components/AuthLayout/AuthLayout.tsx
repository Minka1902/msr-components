import * as React from "react";
import { cx } from "../../lib/cx";

export interface AuthLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  logo?: React.ReactNode;
  /** Optional branding/marketing panel shown beside the form. */
  aside?: React.ReactNode;
  /** Side the aside panel sits on. */
  asidePosition?: "left" | "right";
  footer?: React.ReactNode;
}

/** Centered auth card with an optional branding side panel. */
export const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(function AuthLayout(
  { children, title, subtitle, logo, aside, asidePosition = "left", footer, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-AuthLayout", className)} data-aside={aside ? asidePosition : undefined} {...rest}>
      {aside && <div className="msr-AuthLayout__aside">{aside}</div>}
      <div className="msr-AuthLayout__main">
        <div className="msr-AuthLayout__card">
          {logo && <div className="msr-AuthLayout__logo">{logo}</div>}
          {title && <h1 className="msr-AuthLayout__title">{title}</h1>}
          {subtitle && <p className="msr-AuthLayout__subtitle">{subtitle}</p>}
          <div className="msr-AuthLayout__content">{children}</div>
          {footer && <div className="msr-AuthLayout__footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
});
