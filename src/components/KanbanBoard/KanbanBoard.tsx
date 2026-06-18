import * as React from "react";
import { cx } from "../../lib/cx";

export interface KanbanCard {
  id: string;
  content: React.ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: React.ReactNode;
  cards: KanbanCard[];
  /** Accent color for the column header. */
  color?: string;
}

export interface KanbanBoardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  columns: KanbanColumn[];
  /** Called with the updated columns after a card is moved. */
  onChange: (columns: KanbanColumn[]) => void;
}

/** Drag-and-drop Kanban board (native HTML5 DnD). */
export const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  function KanbanBoard({ columns, onChange, className, ...rest }, ref) {
    const drag = React.useRef<{ cardId: string; fromCol: string } | null>(null);
    const [overCol, setOverCol] = React.useState<string | null>(null);

    const moveCard = (cardId: string, fromCol: string, toCol: string, beforeCardId?: string) => {
      if (fromCol === toCol && !beforeCardId) return;
      const next = columns.map((c) => ({ ...c, cards: [...c.cards] }));
      const from = next.find((c) => c.id === fromCol);
      const to = next.find((c) => c.id === toCol);
      if (!from || !to) return;
      const idx = from.cards.findIndex((c) => c.id === cardId);
      if (idx < 0) return;
      const [card] = from.cards.splice(idx, 1);
      const insertAt = beforeCardId ? to.cards.findIndex((c) => c.id === beforeCardId) : to.cards.length;
      to.cards.splice(insertAt < 0 ? to.cards.length : insertAt, 0, card);
      onChange(next);
    };

    return (
      <div ref={ref} className={cx("msr-Kanban", className)} {...rest}>
        {columns.map((col) => (
          <div
            key={col.id}
            className="msr-Kanban__col"
            data-over={overCol === col.id || undefined}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
            onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              if (drag.current) moveCard(drag.current.cardId, drag.current.fromCol, col.id);
              drag.current = null;
              setOverCol(null);
            }}
          >
            <div className="msr-Kanban__col-header">
              {col.color && <span className="msr-Kanban__dot" style={{ backgroundColor: col.color }} />}
              <span className="msr-Kanban__title">{col.title}</span>
              <span className="msr-Kanban__count">{col.cards.length}</span>
            </div>
            <div className="msr-Kanban__cards">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className="msr-Kanban__card"
                  draggable
                  onDragStart={(e) => {
                    drag.current = { cardId: card.id, fromCol: col.id };
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (drag.current) moveCard(drag.current.cardId, drag.current.fromCol, col.id, card.id);
                    drag.current = null;
                    setOverCol(null);
                  }}
                >
                  {card.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
);
