import * as React from "react";
import { useEventListener } from "msr-hooks";
import { Modal } from "../Modal/Modal";
import { Kbd } from "../Kbd/Kbd";

export interface Shortcut {
  /** Key combo parts, e.g. ["Ctrl", "K"] or ["Esc"]. */
  keys: string[];
  description: string;
}

export interface ShortcutGroup {
  title: string;
  shortcuts: Shortcut[];
}

export interface KeyboardShortcutOverlayProps {
  open: boolean;
  onClose: () => void;
  groups: ShortcutGroup[];
  title?: React.ReactNode;
}

/** Modal overlay listing available keyboard shortcuts, grouped by section. */
export function KeyboardShortcutOverlay({
  open,
  onClose,
  groups,
  title = "Keyboard shortcuts",
}: KeyboardShortcutOverlayProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <div className="msr-Shortcuts">
        {groups.map((group) => (
          <section key={group.title} className="msr-Shortcuts__group">
            <h3 className="msr-Shortcuts__group-title">{group.title}</h3>
            <ul className="msr-Shortcuts__list">
              {group.shortcuts.map((s, i) => (
                <li key={i} className="msr-Shortcuts__row">
                  <span className="msr-Shortcuts__desc">{s.description}</span>
                  <span className="msr-Shortcuts__keys">
                    {s.keys.map((k, j) => (
                      <React.Fragment key={j}>
                        <Kbd>{k}</Kbd>
                        {j < s.keys.length - 1 && (
                          <span className="msr-Shortcuts__plus">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}

/**
 * Convenience hook: opens the overlay when `key` is pressed (default "?") and
 * not typing into a field. Returns `[open, setOpen]`.
 */
export function useShortcutOverlay(key = "?"): [boolean, (v: boolean) => void] {
  const [open, setOpen] = React.useState(false);
  useEventListener(
    typeof window !== "undefined" ? window : null,
    "keydown",
    (event: Event) => {
      const e = event as KeyboardEvent;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (!typing && e.key === key) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    },
  );
  return [open, setOpen];
}
