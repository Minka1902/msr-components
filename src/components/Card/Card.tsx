import * as React from "react";
import { cx } from "../../lib/cx";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Adds hover affordance (lift + pointer) for clickable cards. */
  interactive?: boolean;
}

/** Generic surface container used as the base for most card-style components. */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "elevated", padding = "md", interactive = false, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Card", className)}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive || undefined}
      {...rest}
    />
  );
});

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardHeader({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("msr-Card__header", className)} {...rest} />;
});

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function CardTitle({ className, ...rest }, ref) {
  return <h3 ref={ref} className={cx("msr-Card__title", className)} {...rest} />;
});

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardBody({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("msr-Card__body", className)} {...rest} />;
});

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CardFooter({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("msr-Card__footer", className)} {...rest} />;
});
