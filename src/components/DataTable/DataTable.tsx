import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { Popover } from "../Popover/Popover";
import { Checkbox } from "../Checkbox/Checkbox";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  /** Cell renderer. */
  accessor: (row: T) => React.ReactNode;
  /** Value used for sorting / filtering / export when the cell is not plain text. */
  value?: (row: T) => string | number;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  defaultHidden?: boolean;
  width?: number | string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  rowKey: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  exportable?: boolean;
  exportFileName?: string;
  /** Render expandable detail content for a row. */
  renderExpanded?: (row: T) => React.ReactNode;
  stickyHeader?: boolean;
  emptyMessage?: React.ReactNode;
  className?: string;
}

type SortState = { id: string; dir: "asc" | "desc" } | null;

function cellText<T>(col: DataTableColumn<T>, row: T): string {
  if (col.value) return String(col.value(row));
  const out = col.accessor(row);
  return typeof out === "string" || typeof out === "number" ? String(out) : "";
}

/** Feature-rich data table: sort, filter, column visibility, expansion, export. */
export function DataTable<T>({
  data,
  columns,
  rowKey,
  searchable = true,
  searchPlaceholder = "Filter…",
  exportable = false,
  exportFileName = "export.csv",
  renderExpanded,
  stickyHeader = true,
  emptyMessage = "No data",
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>(null);
  const [query, setQuery] = React.useState("");
  const [hidden, setHidden] = React.useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.id)),
  );
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const visibleColumns = columns.filter((c) => !hidden.has(c.id));

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      visibleColumns.some((col) => cellText(col, row).toLowerCase().includes(q)),
    );
  }, [data, query, visibleColumns]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.id);
    if (!col) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = col.value ? col.value(a) : cellText(col, a);
      const bv = col.value ? col.value(b) : cellText(col, b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, sort, columns]);

  const toggleSort = (col: DataTableColumn<T>) => {
    if (col.sortable === false) return;
    setSort((cur) => {
      if (!cur || cur.id !== col.id) return { id: col.id, dir: "asc" };
      if (cur.dir === "asc") return { id: col.id, dir: "desc" };
      return null;
    });
  };

  const exportCsv = () => {
    const header = visibleColumns.map((c) => `"${String(typeof c.header === "string" ? c.header : c.id)}"`);
    const lines = sorted.map((row) =>
      visibleColumns.map((c) => `"${cellText(c, row).replace(/"/g, '""')}"`).join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cx("msr-DataTable", className)}>
      {/* toolbar always shows (column-visibility lives here) */}
      {(
        <div className="msr-DataTable__toolbar">
          {searchable && (
            <Input
              inputSize="sm"
              leftIcon={<Icon name="search" size={14} />}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          <div className="msr-DataTable__toolbar-actions">
            <Popover
              placement="bottom"
              trigger={
                <Button variant="outline" tone="neutral" size="sm" leftIcon={<Icon name="columns" size={14} />}>
                  Columns
                </Button>
              }
            >
              <div className="msr-DataTable__cols">
                {columns.map((c) => (
                  <Checkbox
                    key={c.id}
                    checked={!hidden.has(c.id)}
                    label={typeof c.header === "string" ? c.header : c.id}
                    onChange={(e) => {
                      setHidden((prev) => {
                        const next = new Set(prev);
                        if (e.target.checked) next.delete(c.id);
                        else next.add(c.id);
                        return next;
                      });
                    }}
                  />
                ))}
              </div>
            </Popover>
            {exportable && (
              <Button
                variant="outline"
                tone="neutral"
                size="sm"
                leftIcon={<Icon name="export" size={14} />}
                onClick={exportCsv}
              >
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="msr-DataTable__scroll">
        <table className="msr-DataTable__table" data-sticky={stickyHeader || undefined}>
          <thead>
            <tr>
              {renderExpanded && <th className="msr-DataTable__expander-col" aria-label="Expand" />}
              {visibleColumns.map((col) => {
                const isSorted = sort?.id === col.id;
                return (
                  <th
                    key={col.id}
                    data-align={col.align}
                    aria-sort={isSorted ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                    style={{ width: col.width }}
                  >
                    {col.sortable === false ? (
                      <span className="msr-DataTable__th-label">{col.header}</span>
                    ) : (
                      <button
                        type="button"
                        className="msr-DataTable__sort"
                        onClick={() => toggleSort(col)}
                      >
                        <span>{col.header}</span>
                        <span className="msr-DataTable__sort-icon" data-state={isSorted ? sort!.dir : "none"}>
                          <Icon name={isSorted && sort!.dir === "desc" ? "chevronDown" : "chevronUp"} size={12} />
                        </span>
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td className="msr-DataTable__empty" colSpan={visibleColumns.length + (renderExpanded ? 1 : 0)}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row) => {
                const key = rowKey(row);
                const isOpen = expanded.has(key);
                return (
                  <React.Fragment key={key}>
                    <tr data-expanded={isOpen || undefined}>
                      {renderExpanded && (
                        <td className="msr-DataTable__expander-col">
                          <button
                            type="button"
                            className="msr-DataTable__expander"
                            aria-expanded={isOpen}
                            aria-label={isOpen ? "Collapse row" : "Expand row"}
                            onClick={() =>
                              setExpanded((prev) => {
                                const next = new Set(prev);
                                if (next.has(key)) next.delete(key);
                                else next.add(key);
                                return next;
                              })
                            }
                          >
                            <span className="msr-DataTable__expander-icon" data-open={isOpen || undefined}>
                              <Icon name="chevronRight" size={14} />
                            </span>
                          </button>
                        </td>
                      )}
                      {visibleColumns.map((col) => (
                        <td key={col.id} data-align={col.align}>
                          {col.accessor(row)}
                        </td>
                      ))}
                    </tr>
                    {renderExpanded && isOpen && (
                      <tr className="msr-DataTable__detail-row">
                        <td colSpan={visibleColumns.length + 1}>{renderExpanded(row)}</td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
