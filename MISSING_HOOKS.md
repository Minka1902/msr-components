# Missing hooks

Hooks needed by `msr-components` that are **not** provided by `msr-hooks@1.1.0`.
Each has a local fallback under `src/lib/` for now; these are candidates to
upstream into `msr-hooks` so the whole ecosystem benefits.

| Hook | Used by | Intended signature | Local fallback | Notes |
| --- | --- | --- | --- | --- |
| `useControllableState` | Tabs, Tooltip, ContextMenu, ConfirmDialog, many | `useControllableState<T>({ value?, defaultValue, onChange? }): [T, (v: T) => void]` | `src/lib/useControllableState.ts` | Standard controlled/uncontrolled merge. Very common; good upstream candidate. |
| `useFocusTrap` | ConfirmDialog, CommandPalette, Modal | `useFocusTrap(ref, active): void` | `src/lib/useFocusTrap.ts` | Traps Tab/Shift+Tab within a container and restores focus on close. |
| `usePosition` | Tooltip, ContextMenu, Popover | `usePosition({ anchor, floating, placement }): { x, y, placement }` | `src/lib/usePosition.ts` | Lightweight anchored positioning with viewport flipping. |
| `useListNavigation` | CommandPalette, ContextMenu, SmartSearchInput | `useListNavigation({ count, onSelect, loop }): { activeIndex, setActiveIndex, onKeyDown }` | `src/lib/useListNavigation.ts` | `msr-hooks`' `useKeyboardNavigation` is byte-grid specific (totalBytes/bytesPerRow), so a generic roving-list hook was needed. |

## Hooks reused directly from `msr-hooks` (no fallback needed)

`usePortal`, `useEscapeKey`, `useClickOutsideObject`, `useClipboard`,
`useLockBodyScroll`, `useToggle`, `useMediaQuery`, `useHoverIntent`,
`useDebounce`, `useEventListener`, `useLocalStorage`, `useId` (React built-in).

## Caveats discovered

- **`useLocalStorage(key, initialValue)`** re-reads storage in an effect keyed on
  `initialValue`'s identity, so passing an inline literal (e.g. `[]`/`{}`) causes an
  infinite render loop. Always pass a **stable reference**. We use a module-level
  `const EMPTY_RECENTS: string[] = []` in `CommandPalette` and `SmartSearchInput`.
  Worth fixing upstream (memoize the initial value or read once).
