import * as React from "react";
import { useDebounce, useClickOutsideObject, useLocalStorage } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface SearchSuggestion {
  id: string;
  label: string;
  icon?: IconName | React.ReactNode;
  group?: string;
}

export interface SearchFilter {
  id: string;
  label: string;
}

export interface SmartSearchInputProps {
  suggestions?: SearchSuggestion[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired (debounced) as the query changes. */
  onSearch?: (query: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  /** Filter chips shown in the dropdown header; toggling is controlled by the consumer. */
  filters?: SearchFilter[];
  activeFilters?: string[];
  onFilterToggle?: (id: string) => void;
  /** Persist recent searches under this key. Pass null to disable. */
  recentsKey?: string | null;
  debounceMs?: number;
  /** Do local label filtering of `suggestions` by the query (default true). */
  localFilter?: boolean;
  className?: string;
}

function renderIcon(icon: IconName | React.ReactNode, size: number) {
  return typeof icon === "string" ? <Icon name={icon as IconName} size={size} /> : icon;
}

// Stable reference (see CommandPalette): avoids a useLocalStorage render loop.
const EMPTY_RECENTS: string[] = [];

/** Search input with recent searches, suggestions, filters and keyboard nav. */
export function SmartSearchInput({
  suggestions = [],
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  onSelect,
  placeholder = "Search…",
  filters,
  activeFilters = [],
  onFilterToggle,
  recentsKey = "msr-search-recents",
  debounceMs = 200,
  localFilter = true,
  className,
}: SmartSearchInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const query = value ?? internal;
  const setQuery = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [recents, setRecents] = useLocalStorage<string[]>(
    recentsKey ?? "msr-search-recents-disabled",
    EMPTY_RECENTS,
  );

  const debounced = useDebounce(query, debounceMs);
  React.useEffect(() => {
    onSearch?.(debounced);
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  useClickOutsideObject(wrapperRef, () => setOpen(false));

  const trimmed = query.trim().toLowerCase();
  const visibleSuggestions =
    localFilter && trimmed
      ? suggestions.filter((s) => s.label.toLowerCase().includes(trimmed))
      : suggestions;

  const showRecents = !trimmed && recentsKey !== null && (recents ?? []).length > 0;
  const rows: Array<{ kind: "recent" | "suggestion"; label: string; suggestion?: SearchSuggestion }> =
    showRecents
      ? (recents ?? []).slice(0, 5).map((r) => ({ kind: "recent", label: r }))
      : visibleSuggestions.map((s) => ({ kind: "suggestion", label: s.label, suggestion: s }));

  const commitRecent = (term: string) => {
    if (recentsKey === null || !term.trim()) return;
    setRecents([term, ...(recents ?? []).filter((r) => r !== term)].slice(0, 10));
  };

  const choose = (row: (typeof rows)[number]) => {
    if (row.kind === "recent") {
      setQuery(row.label);
      onSearch?.(row.label);
    } else if (row.suggestion) {
      commitRecent(row.suggestion.label);
      onSelect?.(row.suggestion);
    }
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (rows.length ? (i + 1) % rows.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (rows.length ? (i - 1 + rows.length) % rows.length : -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && rows[active]) {
        e.preventDefault();
        choose(rows[active]);
      } else {
        commitRecent(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className={cx("msr-Search", className)}>
      <div className="msr-Search__field" data-open={open || undefined}>
        <Icon name="search" size={16} />
        <input
          className="msr-Search__input"
          role="combobox"
          aria-expanded={open}
          aria-controls="msr-search-list"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button
            type="button"
            className="msr-Search__clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              onSearch?.("");
            }}
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {open && (rows.length > 0 || filters?.length) && (
        <div className="msr-Search__dropdown">
          {filters && filters.length > 0 && (
            <div className="msr-Search__filters">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="msr-Search__filter"
                  data-active={activeFilters.includes(f.id) || undefined}
                  onClick={() => onFilterToggle?.(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
          <ul id="msr-search-list" role="listbox" className="msr-Search__list">
            {showRecents && <li className="msr-Search__section">Recent</li>}
            {rows.map((row, i) => (
              <li
                key={`${row.kind}-${row.label}-${i}`}
                role="option"
                aria-selected={i === active}
                data-active={i === active || undefined}
                className="msr-Search__row"
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(row);
                }}
              >
                <span className="msr-Search__row-icon">
                  {row.kind === "recent" ? (
                    <Icon name="clock" size={14} />
                  ) : row.suggestion?.icon ? (
                    renderIcon(row.suggestion.icon, 14)
                  ) : (
                    <Icon name="search" size={14} />
                  )}
                </span>
                <span className="msr-Search__row-label">{row.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
