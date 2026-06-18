import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  /** Indeterminate (tri-state) visual. */
  indeterminate?: boolean;
}

/** Accessible checkbox built on a native input. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, indeterminate, className, disabled, id, ...rest }, ref) {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const setRef = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
    }, [indeterminate]);

    return (
      <label className={cx("msr-Checkbox", className)} data-disabled={disabled || undefined} htmlFor={inputId}>
        <span className="msr-Checkbox__box">
          <input
            ref={setRef}
            id={inputId}
            type="checkbox"
            className="msr-Checkbox__input"
            disabled={disabled}
            {...rest}
          />
          <span className="msr-Checkbox__mark" aria-hidden="true">
            <Icon name={indeterminate ? "minus" : "check"} size={12} />
          </span>
        </span>
        {label != null && <span className="msr-Checkbox__label">{label}</span>}
      </label>
    );
  },
);
