import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Slot } from "../../lib/Slot";

export type ButtonVariant = "solid" | "soft" | "outline" | "ghost" | "link";
export type ButtonTone =
  | "primary"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Content rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Content rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Render onto the single child element instead of a <button>. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "solid",
      tone = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const dataProps = {
      "data-variant": variant,
      "data-tone": tone,
      "data-size": size,
      "data-loading": loading || undefined,
      "data-full-width": fullWidth || undefined,
    };

    // asChild: merge styling onto a single provided element (no extra wrappers).
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cx("msr-Button", className)}
          aria-busy={loading || undefined}
          {...dataProps}
          {...(rest as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cx("msr-Button", className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...dataProps}
        {...rest}
      >
        {loading && (
          <span className="msr-Button__spinner" aria-hidden="true">
            <Icon name="spinner" size={16} />
          </span>
        )}
        {leftIcon && <span className="msr-Button__icon">{leftIcon}</span>}
        {children != null && <span className="msr-Button__label">{children}</span>}
        {rightIcon && <span className="msr-Button__icon">{rightIcon}</span>}
      </button>
    );
  },
);
