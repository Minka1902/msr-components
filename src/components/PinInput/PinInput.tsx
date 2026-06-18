import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface PinInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired when all cells are filled. */
  onComplete?: (value: string) => void;
  /** Restrict input. */
  type?: "numeric" | "alphanumeric";
  mask?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

/** Segmented one-time-code / PIN input. */
export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  { length = 6, value, defaultValue, onValueChange, onComplete, type = "numeric", mask, disabled, size = "md", className, ...rest },
  ref,
) {
  const [val, setVal] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange: onValueChange,
  });
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const chars = val.split("").slice(0, length);
  const pattern = type === "numeric" ? /[^0-9]/g : /[^a-zA-Z0-9]/g;

  const setChar = (index: number, char: string) => {
    const clean = char.replace(pattern, "").slice(-1);
    const arr = Array.from({ length }, (_, i) => chars[i] ?? "");
    arr[index] = clean;
    const joined = arr.join("");
    setVal(joined);
    if (clean && index < length - 1) refs.current[index + 1]?.focus();
    if (arr.every((c) => c !== "")) onComplete?.(joined);
  };

  const onKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[index] && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(pattern, "").slice(0, length);
    setVal(text);
    if (text.length === length) onComplete?.(text);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div ref={ref} className={cx("msr-PinInput", className)} data-size={size} data-disabled={disabled || undefined} role="group" {...rest}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className="msr-PinInput__cell"
          inputMode={type === "numeric" ? "numeric" : "text"}
          type={mask ? "password" : "text"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          value={chars[i] ?? ""}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={onKeyDown(i)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
});
