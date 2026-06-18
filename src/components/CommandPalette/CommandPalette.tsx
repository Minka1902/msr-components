import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey, useLocalStorage } from "msr-hooks";
import { Icon, type IconName } from "../../lib/icons";
import { useFocusTrap } from "../../lib/useFocusTrap";

export interface CommandItem {
  id: string;
  label: string;
  /** Optional group/section heading this item belongs to. */
  group?: string;
  icon?: IconName | React.ReactNode;
  /** Extra searchable keywords. */
  keywords?: string[];
  /** Trailing shortcut hint, e.g. "⌘P". */
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  /** Persist recent selections under this localStorage key. */
  recentsKey?: string;
  /** Max recents to surface when the query is empty. */
  maxRecents?: number;
  emptyMessage?: React.ReactNode;
}

function renderIcon(icon: IconName | React.ReactNode, size: number) {
  return typeof icon === "string" ? <Icon name={icon as IconName} size={size} /> : icon;
}

// Stable reference: msr-hooks' useLocalStorage re-reads whenever initialValue
// changes identity, so an inline [] would loop. Keep one shared empty array.
const EMPTY_RECENTS: string[] = [];

/** ⌘K command palette: fuzzy search, grouped results, keyboard-first, recents. */
export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Type a command or search…",
  recentsKey = "msr-command-recents",
  maxRecents = 5,
  emptyMessage = "No results found",
}: CommandPaletteProps) {
  const portal = usePortal("msr-command-root");
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [recents, setRecents] = useLocalStorage<string[]>(recentsKey, EMPTY_RECENTS);

  useEscapeKey(() => open && onClose());
  useFocusTrap(dialogRef, open);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const recentItems = (recents ?? [])
        .map((id) => items.find((it) => it.id === id))
        .filter((x): x is CommandItem => !!x)
        .slice(0, maxRecents);
      return recentItems.length ? recentItems : items;
    }
    return items.filter((it) => {
      const haystack = [it.label, it.group, ...(it.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((token) => haystack.includes(token));
    });
  }, [query, items, recents, maxRecents]);

  const isRecents = !query.trim() && (recents ?? []).length > 0;

  React.useEffect(() => {
    if (active > filtered.length - 1) setActive(filtered.length ? filtered.length - 1 : 0);
  }, [filtered, active]);

  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  const select = (item: CommandItem | undefined) => {
    if (!item) return;
    setRecents([item.id, ...(recents ?? []).filter((id) => id !== item.id)].slice(0, 20));
    item.onSelect();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(filtered[active]);
    }
  };

  if (!open || !portal) return null;

  // Group while preserving order of first appearance.
  const groups: Array<{ name: string | undefined; items: CommandItem[] }> = [];
  filtered.forEach((it) => {
    const name = isRecents ? "Recent" : it.group;
    let g = groups.find((x) => x.name === name);
    if (!g) {
      g = { name, items: [] };
      groups.push(g);
    }
    g.items.push(it);
  });

  let runningIndex = -1;

  return createPortal(
    <div
      className="msr-Command__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="msr-Command"
        onKeyDown={onKeyDown}
      >
        <div className="msr-Command__search">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            className="msr-Command__input"
            placeholder={placeholder}
            value={query}
            role="combobox"
            aria-expanded
            aria-controls="msr-command-list"
            aria-activedescendant={filtered[active] ? `msr-cmd-${filtered[active].id}` : undefined}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
          />
          <kbd className="msr-Command__esc">Esc</kbd>
        </div>
        <div ref={listRef} id="msr-command-list" role="listbox" className="msr-Command__list">
          {filtered.length === 0 ? (
            <div className="msr-Command__empty">{emptyMessage}</div>
          ) : (
            groups.map((group) => (
              <div key={group.name ?? "_"} className="msr-Command__group">
                {group.name && <div className="msr-Command__group-title">{group.name}</div>}
                {group.items.map((item) => {
                  runningIndex++;
                  const index = runningIndex;
                  return (
                    <div
                      key={item.id}
                      id={`msr-cmd-${item.id}`}
                      role="option"
                      aria-selected={index === active}
                      data-index={index}
                      data-active={index === active || undefined}
                      className="msr-Command__item"
                      onMouseEnter={() => setActive(index)}
                      onClick={() => select(item)}
                    >
                      {item.icon && (
                        <span className="msr-Command__item-icon">{renderIcon(item.icon, 16)}</span>
                      )}
                      <span className="msr-Command__item-label">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="msr-Command__item-shortcut">{item.shortcut}</kbd>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    portal,
  );
}
