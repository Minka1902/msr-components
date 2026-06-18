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

// ---- Components: composable building blocks (layout / content / utility) ----
export * from "./components/Layout";
export * from "./components/Alert";
export * from "./components/Field";
export * from "./components/Tag";
export * from "./components/SegmentedControl";
export * from "./components/Breadcrumbs";
export * from "./components/Pagination";
export * from "./components/CopyButton";
export * from "./components/Text";
export * from "./components/AvatarGroup";
export * from "./components/DataDisplay";
export * from "./components/Collapsible";
export * from "./components/ScrollArea";

// ---- Components: advanced inputs ----
export * from "./components/Combobox";
export * from "./components/Slider";
export * from "./components/NumberStepper";
export * from "./components/PinInput";
export * from "./components/RatingStars";
export * from "./components/ToggleGroup";
export * from "./components/TagInput";
export * from "./components/FileDropzone";
export * from "./components/ColorPicker";
export * from "./components/DatePicker";

// ---- Components: navigation & overlays ----
export * from "./components/Drawer";
export * from "./components/Stepper";
export * from "./components/TreeView";
export * from "./components/HoverCard";
export * from "./components/ScrollToTop";

// ---- Components: motion / delight ----
export * from "./components/AnimatedCounter";
export * from "./components/Motion";
export * from "./components/Effects";
export * from "./components/Confetti";
export * from "./components/AnimatedThemeToggle";

// ---- Components: powered-by-msr-hooks showcases ----
export * from "./components/NetworkStatusBanner";
export * from "./components/CountdownTimer";
export * from "./components/IdleDialog";
export * from "./components/GeoPrompt";
