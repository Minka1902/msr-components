import * as React from "react";
import { useClipboard } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Text to copy. */
  value: string;
  /** Optional visible label (icon-only if omitted). */
  label?: string;
  copiedLabel?: string;
  size?: number;
}

/** Button that copies `value` to the clipboard and shows a check on success. */
export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  function CopyButton({ value, label, copiedLabel = "Copied", size = 14, className, ...rest }, ref) {
    const [copy, copied] = useClipboard();
    return (
      <button
        ref={ref}
        type="button"
        className={cx("msr-CopyButton", className)}
        data-copied={copied || undefined}
        aria-label={label ?? (copied ? copiedLabel : "Copy")}
        onClick={() => void copy(value)}
        {...rest}
      >
        <Icon name={copied ? "check" : "copy"} size={size} />
        {label && <span>{copied ? copiedLabel : label}</span>}
      </button>
    );
  },
);
