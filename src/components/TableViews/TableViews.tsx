import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* SavedViewsManager                                                   */
/* ------------------------------------------------------------------ */

export interface SavedView {
  id: string;
  name: string;
  /** Opaque snapshot of table state (filters, sort, columns…). */
  state?: unknown;
  isDefault?: boolean;
}

export interface SavedViewsManagerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  views: SavedView[];
  activeId?: string;
  onSelect?: (view: SavedView) => void;
  /** Persist the current table state under a new name. */
  onSave?: (name: string) => void;
  onDelete?: (id: string) => void;
}

/** Save & switch named table views (filters, sort, columns, layout). */
export const SavedViewsManager = React.forwardRef<
  HTMLDivElement,
  SavedViewsManagerProps
>(function SavedViewsManager(
  { views, activeId, onSelect, onSave, onDelete, className, ...rest },
  ref,
) {
  const [name, setName] = React.useState("");
  return (
    <div ref={ref} className={cx("msr-SavedViews", className)} {...rest}>
      <ul className="msr-SavedViews__list">
        {views.map((v) => (
          <li key={v.id} className="msr-SavedViews__item">
            <button
              type="button"
              className="msr-SavedViews__select"
              data-active={v.id === activeId || undefined}
              onClick={() => onSelect?.(v)}
            >
              {v.name}
              {v.isDefault && (
                <span className="msr-SavedViews__default">default</span>
              )}
            </button>
            {onDelete && !v.isDefault && (
              <button
                type="button"
                className="msr-SavedViews__delete"
                aria-label={`Delete ${v.name}`}
                onClick={() => onDelete(v.id)}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      {onSave && (
        <form
          className="msr-SavedViews__save"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              onSave(name.trim());
              setName("");
            }
          }}
        >
          <input
            value={name}
            placeholder="Save current view as…"
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={!name.trim()}>
            Save
          </button>
        </form>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ColumnVisibilityManager                                             */
/* ------------------------------------------------------------------ */

export interface ColumnDef {
  key: string;
  label: string;
  visible?: boolean;
  pinned?: boolean;
  /** Columns that can never be hidden (e.g. the row identifier). */
  locked?: boolean;
}

export interface ColumnVisibilityManagerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  columns: ColumnDef[];
  onChange: (columns: ColumnDef[]) => void;
  /** Allow pinning columns. */
  allowPin?: boolean;
}

/** Toggle, pin and reorder table columns. */
export const ColumnVisibilityManager = React.forwardRef<
  HTMLDivElement,
  ColumnVisibilityManagerProps
>(function ColumnVisibilityManager(
  { columns, onChange, allowPin = true, className, ...rest },
  ref,
) {
  const setAt = (i: number, patch: Partial<ColumnDef>) =>
    onChange(columns.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= columns.length) return;
    const next = columns.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div ref={ref} className={cx("msr-Columns", className)} {...rest}>
      <div className="msr-Columns__head">
        <span>Columns</span>
        <button
          type="button"
          className="msr-Columns__all"
          onClick={() =>
            onChange(
              columns.map((c) => (c.locked ? c : { ...c, visible: true })),
            )
          }
        >
          Show all
        </button>
      </div>
      <ul className="msr-Columns__list">
        {columns.map((c, i) => (
          <li key={c.key} className="msr-Columns__item">
            <label className="msr-Columns__toggle">
              <input
                type="checkbox"
                checked={c.visible !== false}
                disabled={c.locked}
                onChange={(e) => setAt(i, { visible: e.target.checked })}
              />
              <span>{c.label}</span>
            </label>
            <div className="msr-Columns__actions">
              {allowPin && (
                <button
                  type="button"
                  className="msr-Columns__pin"
                  data-pinned={c.pinned || undefined}
                  aria-label={c.pinned ? "Unpin" : "Pin"}
                  onClick={() => setAt(i, { pinned: !c.pinned })}
                >
                  ⌖
                </button>
              )}
              <button
                type="button"
                aria-label="Move up"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Move down"
                onClick={() => move(i, 1)}
                disabled={i === columns.length - 1}
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});
