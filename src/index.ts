// msr-components — core entry (general UI + UI polish).
// Import the stylesheet once in your app: `import "msr-components/styles.css";`

// ---- Theme ----
export { ThemeProvider } from "./theme/ThemeProvider";
export type { ThemeProviderProps, Density } from "./theme/ThemeProvider";
export { useTheme } from "./theme/useTheme";
export type { UseThemeResult } from "./theme/useTheme";
export { THEMES, LIGHT_THEMES } from "./theme/themes";
export type { ThemeName } from "./theme/themes";

// ---- Primitives / utilities ----
export { cx } from "./lib/cx";
export type { ClassValue } from "./lib/cx";
export { Slot, mergeRefs } from "./lib/Slot";
export { VisuallyHidden } from "./lib/VisuallyHidden";
export { Icon, glyphs } from "./lib/icons";
export type { IconName, IconProps } from "./lib/icons";

// Re-export the fallback hooks (also useful to consumers).
export { useControllableState } from "./lib/useControllableState";
export { useFocusTrap } from "./lib/useFocusTrap";
export { usePosition } from "./lib/usePosition";
export type { Placement, PositionResult } from "./lib/usePosition";
export { useListNavigation } from "./lib/useListNavigation";

// ---- Components: base / form primitives ----
export * from "./components/Spinner";
export * from "./components/Divider";
export * from "./components/Avatar";
export * from "./components/Input";
export * from "./components/Textarea";
export * from "./components/Checkbox";
export * from "./components/Radio";
export * from "./components/Switch";
export * from "./components/Select";
export * from "./components/Popover";
export * from "./components/Menu";
export * from "./components/Accordion";

// ---- Components: core UI + polish ----
export * from "./components/Button";
export * from "./components/StatusBadge";
export * from "./components/Card";
export * from "./components/Skeleton";
export * from "./components/EmptyState";
export * from "./components/AnimatedTabs";
export * from "./components/CopyableCodeBlock";
export * from "./components/PopoverHelp";
export * from "./components/Toast";
export * from "./components/Modal";
export * from "./components/ConfirmDialog";
export * from "./components/ContextMenu";
export * from "./components/FloatingActionButton";
export * from "./components/KeyboardShortcutOverlay";
export * from "./components/ThemePreviewCard";

// ---- Components: heavier general UI ----
export * from "./components/CommandPalette";
export * from "./components/SmartSearchInput";
export * from "./components/ResizableSplitPanel";
export * from "./components/DataTable";
export * from "./components/JsonViewer";
export * from "./components/FilePathViewer";
