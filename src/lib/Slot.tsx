import * as React from "react";
import { cx } from "./cx";

/**
 * Minimal `asChild` implementation: merges the given props (including className,
 * style, event handlers and ref) onto a single child element instead of
 * rendering a wrapper. Used by components that accept `asChild`.
 */
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  if (!React.isValidElement(children)) {
    return null;
  }

  const child = children as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props;

  const merged: Record<string, unknown> = { ...childProps, ...slotProps };

  // Merge className and style rather than overwrite.
  if (slotProps.className || (childProps.className as string)) {
    merged.className = cx(childProps.className as string, slotProps.className);
  }
  if (slotProps.style || childProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  // Chain event handlers (slot first, then child's own).
  for (const key in slotProps) {
    if (/^on[A-Z]/.test(key)) {
      const slotHandler = (slotProps as Record<string, unknown>)[key];
      const childHandler = childProps[key];
      if (typeof slotHandler === "function" && typeof childHandler === "function") {
        merged[key] = (...args: unknown[]) => {
          (childHandler as (...a: unknown[]) => void)(...args);
          (slotHandler as (...a: unknown[]) => void)(...args);
        };
      }
    }
  }

  merged.ref = mergeRefs(forwardedRef, (child as { ref?: React.Ref<unknown> }).ref);

  return React.cloneElement(child, merged);
});

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export { mergeRefs };
