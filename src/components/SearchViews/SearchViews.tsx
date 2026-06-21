import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* ResultCardList                                                      */
/* ------------------------------------------------------------------ */

export interface ResultCardItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  thumbnail?: React.ReactNode;
  badges?: React.ReactNode;
  href?: string;
}

export interface ResultCardListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: ResultCardItem[];
  /** "list" (rows) or "grid" (cards). */
  layout?: "list" | "grid";
  onSelect?: (item: ResultCardItem) => void;
}

/** Reusable card-based search/browse results view. */
export const ResultCardList = React.forwardRef<
  HTMLDivElement,
  ResultCardListProps
>(function ResultCardList(
  { items, layout = "list", onSelect, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-ResultCards", className)}
      data-layout={layout}
      {...rest}
    >
      {items.map((it) => {
        const Wrapper: React.ElementType = it.href ? "a" : onSelect ? "button" : "div";
        return (
          <Wrapper
            key={it.id}
            href={it.href}
            type={!it.href && onSelect ? "button" : undefined}
            className="msr-ResultCards__card"
            onClick={onSelect ? () => onSelect(it) : undefined}
          >
            {it.thumbnail && (
              <div className="msr-ResultCards__thumb">{it.thumbnail}</div>
            )}
            <div className="msr-ResultCards__body">
              <div className="msr-ResultCards__title">{it.title}</div>
              {it.description && (
                <div className="msr-ResultCards__desc">{it.description}</div>
              )}
              {it.meta && (
                <div className="msr-ResultCards__meta">{it.meta}</div>
              )}
              {it.badges && (
                <div className="msr-ResultCards__badges">{it.badges}</div>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* SearchResultsLayout                                                 */
/* ------------------------------------------------------------------ */

export interface SearchResultsLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The search query echoed in the summary. */
  query?: string;
  /** Total number of results. */
  total?: number;
  /** Filter sidebar (e.g. FacetedFilterPanel). */
  filters?: React.ReactNode;
  /** Sort control node. */
  sort?: React.ReactNode;
  /** Results (e.g. ResultCardList). */
  children?: React.ReactNode;
  pagination?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyState?: React.ReactNode;
}

/** Standard search results page: summary, filters, sort, results, pagination. */
export const SearchResultsLayout = React.forwardRef<
  HTMLDivElement,
  SearchResultsLayoutProps
>(function SearchResultsLayout(
  {
    query,
    total,
    filters,
    sort,
    children,
    pagination,
    loading,
    empty,
    emptyState,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-SearchResults", className)}
      data-has-filters={!!filters}
      {...rest}
    >
      {filters && (
        <aside className="msr-SearchResults__filters">{filters}</aside>
      )}
      <div className="msr-SearchResults__main">
        <div className="msr-SearchResults__summary">
          <span className="msr-SearchResults__count">
            {total != null ? `${total.toLocaleString()} results` : "Results"}
            {query && (
              <>
                {" "}
                for <strong>“{query}”</strong>
              </>
            )}
          </span>
          {sort && <div className="msr-SearchResults__sort">{sort}</div>}
        </div>
        <div className="msr-SearchResults__list">
          {loading ? (
            <div className="msr-SearchResults__loading" aria-busy="true">
              Searching…
            </div>
          ) : empty ? (
            emptyState ?? (
              <div className="msr-SearchResults__empty">
                No results found{query ? ` for “${query}”` : ""}.
              </div>
            )
          ) : (
            children
          )}
        </div>
        {pagination && (
          <div className="msr-SearchResults__pagination">{pagination}</div>
        )}
      </div>
    </div>
  );
});
