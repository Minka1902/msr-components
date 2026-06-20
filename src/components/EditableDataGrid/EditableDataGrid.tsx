import * as React from "react";
import { cx } from "../../lib/cx";

export interface EditableOption {
  label: React.ReactNode;
  value: string;
}

export interface EditableColumn<T> {
  id: string;
  header: React.ReactNode;
  /** Current cell value. */
  accessor: (row: T) => string | number;
  /** Editor type; "none" makes the cell read-only. Default "text". */
  editor?: "text" | "number" | "select" | "none";
  /** Options for the "select" editor. */
  options?: EditableOption[];
  /** Override how the value is displayed (read mode). */
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: number | string;
}

export interface EditableDataGridProps<T> {
  data: T[];
  columns: Array<EditableColumn<T>>;
  rowKey: (row: T) => string;
  /** Commit handler: fired on blur/Enter with the new value. */
  onCellChange?: (info: { rowKey: string; columnId: string; value: string | number; row: T }) => void;
  stickyHeader?: boolean;
  emptyMessage?: React.ReactNode;
  className?: string;
}

interface EditingCell {
  rowKey: string;
  columnId: string;
}

/** Spreadsheet-like grid with inline cell editing (text/number/select). */
export function EditableDataGrid<T>({
  data,
  columns,
  rowKey,
  onCellChange,
  stickyHeader = true,
  emptyMessage = "No rows",
  className,
}: EditableDataGridProps<T>) {
  const [editing, setEditing] = React.useState<EditingCell | null>(null);
  const [draft, setDraft] = React.useState("");

  const startEdit = (rk: string, col: EditableColumn<T>, row: T) => {
    if ((col.editor ?? "text") === "none") return;
    setDraft(String(col.accessor(row)));
    setEditing({ rowKey: rk, columnId: col.id });
  };

  const commit = (col: EditableColumn<T>, row: T, rk: string, raw: string) => {
    const value = col.editor === "number" ? Number(raw) : raw;
    onCellChange?.({ rowKey: rk, columnId: col.id, value, row });
    setEditing(null);
  };

  const isEditing = (rk: string, colId: string) =>
    editing?.rowKey === rk && editing?.columnId === colId;

  return (
    <div className={cx("msr-EditableDataGrid", className)} data-sticky={stickyHeader || undefined}>
      <div className="msr-EditableDataGrid__scroll">
        <table className="msr-EditableDataGrid__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id} style={{ width: col.width, textAlign: col.align ?? "left" }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className="msr-EditableDataGrid__empty" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rk = rowKey(row);
                return (
                  <tr key={rk}>
                    {columns.map((col) => {
                      const editor = col.editor ?? "text";
                      const editable = editor !== "none";
                      const active = isEditing(rk, col.id);
                      return (
                        <td
                          key={col.id}
                          className="msr-EditableDataGrid__cell"
                          style={{ textAlign: col.align ?? "left" }}
                          data-editable={editable || undefined}
                          data-editing={active || undefined}
                          tabIndex={editable && !active ? 0 : undefined}
                          onDoubleClick={() => startEdit(rk, col, row)}
                          onKeyDown={(e) => {
                            if (!active && editable && e.key === "Enter") {
                              e.preventDefault();
                              startEdit(rk, col, row);
                            }
                          }}
                        >
                          {active ? (
                            editor === "select" ? (
                              <select
                                className="msr-EditableDataGrid__editor"
                                autoFocus
                                value={draft}
                                onChange={(e) => {
                                  setDraft(e.target.value);
                                  commit(col, row, rk, e.target.value);
                                }}
                                onBlur={() => setEditing(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Escape") setEditing(null);
                                }}
                              >
                                {(col.options ?? []).map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {typeof o.label === "string" ? o.label : o.value}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                className="msr-EditableDataGrid__editor"
                                autoFocus
                                type={editor === "number" ? "number" : "text"}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onBlur={() => commit(col, row, rk, draft)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    commit(col, row, rk, draft);
                                  } else if (e.key === "Escape") {
                                    setEditing(null);
                                  }
                                }}
                              />
                            )
                          ) : (
                            <span className="msr-EditableDataGrid__value">
                              {col.render ? col.render(row) : col.accessor(row)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
