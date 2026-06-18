import * as React from "react";

export interface UseListNavigationOptions {
  count: number;
  onSelect?: (index: number) => void;
  loop?: boolean;
  orientation?: "vertical" | "horizontal";
}

export interface ListNavigation {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

/**
 * Generic roving keyboard navigation over a flat list. Arrow keys move the
 * active index, Enter/Space select, Home/End jump.
 *
 * msr-hooks' `useKeyboardNavigation` is byte-grid specific, so this generic
 * version lives here — see MISSING_HOOKS.md.
 */
export function useListNavigation({
  count,
  onSelect,
  loop = true,
  orientation = "vertical",
}: UseListNavigationOptions): ListNavigation {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (activeIndex > count - 1) setActiveIndex(count > 0 ? count - 1 : 0);
  }, [count, activeIndex]);

  const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
  const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (count === 0) return;
      switch (event.key) {
        case next:
          event.preventDefault();
          setActiveIndex((i) => (i >= count - 1 ? (loop ? 0 : i) : i + 1));
          break;
        case prev:
          event.preventDefault();
          setActiveIndex((i) => (i <= 0 ? (loop ? count - 1 : 0) : i - 1));
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(count - 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onSelect?.(activeIndex);
          break;
      }
    },
    [count, loop, next, prev, onSelect, activeIndex],
  );

  return { activeIndex, setActiveIndex, onKeyDown };
}
