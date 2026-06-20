import * as React from "react";
import { cx } from "../../lib/cx";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Shortcut string ("⌘+K", "Ctrl+Shift+P") or list of keys. Splits on "+". */
  keys?: string | string[];
  size?: "sm" | "md";
}

const ALIASES: Record<string, string> = {
  cmd: "⌘", command: "⌘", meta: "⌘",
  ctrl: "Ctrl", control: "Ctrl",
  shift: "⇧", alt: "⌥", option: "⌥",
  enter: "↵", return: "↵", esc: "Esc", escape: "Esc",
  tab: "⇥", up: "↑", down: "↓", left: "←", right: "→",
  backspace: "⌫", delete: "⌦", space: "Space",
};

function display(key: string): string {
  const k = key.trim();
  return ALIASES[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k);
}

/** Renders keyboard keys / shortcuts as styled `<kbd>` elements. */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, size = "md", className, children, ...rest },
  ref,
) {
  const parts =
    keys != null
      ? Array.isArray(keys)
        ? keys
        : keys.split("+")
      : null;

  if (!parts) {
    return (
      <kbd ref={ref} className={cx("msr-Kbd", className)} data-size={size} {...rest}>
        {children}
      </kbd>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={cx("msr-Kbd-group", className)} data-size={size} {...rest}>
      {parts.map((p, i) => (
        <kbd key={i} className="msr-Kbd">
          {display(p)}
        </kbd>
      ))}
    </span>
  );
});
