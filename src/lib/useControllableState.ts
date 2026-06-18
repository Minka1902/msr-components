import * as React from "react";

/**
 * Controlled/uncontrolled state helper. If `value` is provided the state is
 * controlled; otherwise it is managed internally starting from `defaultValue`.
 * `onChange` always fires on updates.
 *
 * Not available in msr-hooks@1.1.0 — see MISSING_HOOKS.md.
 */
export function useControllableState<T>(params: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const { value, defaultValue, onChange } = params;
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<T>(defaultValue);

  const state = isControlled ? (value as T) : internal;

  const setState = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      if (!isControlled) setInternal(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange, state],
  );

  return [state, setState];
}
