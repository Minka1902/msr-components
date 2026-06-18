import * as React from "react";
import { cx } from "../../lib/cx";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  /** id of the control, used for the label's htmlFor. */
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Render label/control inline (horizontal) instead of stacked. */
  inline?: boolean;
}

/** Label + hint + error wrapper for any input control. */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, htmlFor, hint, error, required, inline, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Field", className)}
      data-inline={inline || undefined}
      data-invalid={error ? true : undefined}
      {...rest}
    >
      {label && (
        <label className="msr-Field__label" htmlFor={htmlFor}>
          {label}
          {required && <span className="msr-Field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="msr-Field__control">
        {children}
        {error ? (
          <div className="msr-Field__error" role="alert">{error}</div>
        ) : hint ? (
          <div className="msr-Field__hint">{hint}</div>
        ) : null}
      </div>
    </div>
  );
});
