import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface SortableItem {
  id: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface SortableListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "onChange"> {
  items: SortableItem[];
  onReorder: (items: SortableItem[]) => void;
  /** Show a drag handle instead of dragging the whole row. */
  handle?: boolean;
}

/** Vertical drag-to-reorder list (native HTML5 drag-and-drop). */
export const SortableList = React.forwardRef<HTMLUListElement, SortableListProps>(
  function SortableList({ items, onReorder, handle = true, className, ...rest }, ref) {
    const [dragId, setDragId] = React.useState<string | null>(null);
    const [overId, setOverId] = React.useState<string | null>(null);

    const move = (from: string, to: string) => {
      if (from === to) return;
      const fromIdx = items.findIndex((i) => i.id === from);
      const toIdx = items.findIndex((i) => i.id === to);
      if (fromIdx < 0 || toIdx < 0) return;
      const next = [...items];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      onReorder(next);
    };

    return (
      <ul ref={ref} className={cx("msr-Sortable", className)} {...rest}>
        {items.map((item) => (
          <li
            key={item.id}
            className="msr-Sortable__item"
            data-dragging={dragId === item.id || undefined}
            data-over={overId === item.id && dragId !== item.id || undefined}
            draggable={!handle && !item.disabled}
            onDragStart={(e) => {
              if (item.disabled) return;
              setDragId(item.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setOverId(item.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragId) move(dragId, item.id);
              setDragId(null);
              setOverId(null);
            }}
            onDragEnd={() => { setDragId(null); setOverId(null); }}
          >
            {handle && (
              <span
                className="msr-Sortable__handle"
                draggable={!item.disabled}
                aria-label="Drag to reorder"
                onDragStart={(e) => {
                  if (item.disabled) return;
                  setDragId(item.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <Icon name="moreVertical" size={16} />
              </span>
            )}
            <div className="msr-Sortable__content">{item.content}</div>
          </li>
        ))}
      </ul>
    );
  },
);
