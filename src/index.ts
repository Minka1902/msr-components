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

// ---- Components: calendar & scheduling ----
export * from "./components/EventCalendar";
export * from "./components/MiniCalendar";
export * from "./components/DateRangePicker";
export * from "./components/TimePicker";
export * from "./components/DateTimePicker";
export * from "./components/Scheduler";

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

// ---- Components: onboarding ----
export * from "./components/ProductTour";
export * from "./components/FeatureSpotlight";
export * from "./components/WhatsNewModal";
export * from "./components/HintBubble";
export * from "./components/OnboardingChecklist";

// ---- Components: collaboration ----
export * from "./components/PresenceAvatars";
export * from "./components/LiveCursors";
export * from "./components/TypingIndicator";
export * from "./components/ReactionBar";
export * from "./components/CommentThread";
export * from "./components/VoteButtons";
export * from "./components/UserCard";
export * from "./components/ShareSheet";

// ---- Components: auth ----
export * from "./components/AuthLayout";
export * from "./components/SocialAuthButtons";
export * from "./components/LoginForm";
export * from "./components/SignupForm";

// ---- Components: states / resilience ----
export * from "./components/ErrorBoundary";
export * from "./components/ResultPage";
export * from "./components/LoadingOverlay";
export * from "./components/MaintenancePage";

// ---- Components: media ----
export * from "./components/AudioPlayer";
export * from "./components/VideoPlayer";
export * from "./components/Waveform";
export * from "./components/ImageCropper";
export * from "./components/EmojiPicker";
export * from "./components/AvatarUploader";

// ---- Components: commerce ----
export * from "./components/PricingTable";
export * from "./components/ProductCard";
export * from "./components/CartLineItem";
export * from "./components/CheckoutSummary";
export * from "./components/CouponInput";
export * from "./components/PaymentMethodCard";

// ---- Components: AI / agent UI ----
export * from "./components/Chat";
export * from "./components/MarkdownRenderer";

// ---- Components: app-building blocks ----
export * from "./components/AppShell";
export * from "./components/Toolbar";
export * from "./components/InlineEdit";
export * from "./components/FormBuilder";

// ---- Components: interaction-rich ----
export * from "./components/SortableList";
export * from "./components/KanbanBoard";
export * from "./components/Carousel";
export * from "./components/ImageComparison";
export * from "./components/PasswordInput";

// ---- Components: dev tools / delight ----
export * from "./components/DiffViewer";
export * from "./components/Terminal";
export * from "./components/Showcase";
export * from "./components/QRCode";

// ---- Components: table power-ups ----
export * from "./components/EditableDataGrid";
export * from "./components/TreeTable";

// ---- Components: overlays & feedback (wave 7) ----
export * from "./components/Tooltip";
export * from "./components/Popconfirm";
export * from "./components/Kbd";
export * from "./components/NotificationBadge";
export * from "./components/Lightbox";

// ---- Components: inputs, navigation & delight (wave 7) ----
export * from "./components/SignaturePad";
export * from "./components/CreditCardInput";
export * from "./components/BottomNavigation";
export * from "./components/Dock";
export * from "./components/Barcode";

// ---- Components: unique & delight (wave 8) ----
export * from "./components/MagneticButton";
export * from "./components/ScratchCard";
export * from "./components/SwipeCards";
export * from "./components/WheelPicker";
export * from "./components/TextScramble";
export * from "./components/Typewriter";
export * from "./components/BorderBeam";
export * from "./components/Meteors";
export * from "./components/Sparkles";
export * from "./components/AnimatedBeam";
export * from "./components/OrbitingIcons";
export * from "./components/LiquidProgress";
export * from "./components/SplitFlapDisplay";
export * from "./components/RippleButton";
export * from "./components/Odometer";
export * from "./components/GradientText";
export * from "./components/ShimmerButton";
export * from "./components/MorphingText";
export * from "./components/RetroGrid";
export * from "./components/Spotlight";
export * from "./components/HoldToConfirm";
export * from "./components/GlitchText";
export * from "./components/CardStack";
export * from "./components/Globe";

// ---- Components: app-building scaffolding (agent-friendly) ----
export * from "./components/PageScaffold";
export * from "./components/SchemaTools";
export * from "./components/ComponentCatalog";
export * from "./components/Filtering";
export * from "./components/TableViews";
export * from "./components/DataImport";
export * from "./components/Validation";
export * from "./components/Guards";
export * from "./components/Audit";

// ---- Components: AI-agent run, code & control UI ----
export * from "./components/AgentRun";
export * from "./components/AgentCode";
export * from "./components/AgentPrompt";
export * from "./components/AgentControl";

// ---- Components: resource pages & app layouts ----
export * from "./components/ResourcePages";
export * from "./components/DetailLayouts";
export * from "./components/EntityViews";

// ---- Components: data-heavy (search, compare, dedup, graphs) ----
export * from "./components/SearchViews";
export * from "./components/Comparison";
export * from "./components/Dedup";
export * from "./components/DataGraph";

// ---- Components: forms & setup flow ----
export * from "./components/FormFlow";
export * from "./components/FormState";
export * from "./components/Setup";

// ---- Components: integration & backend-facing ----
export * from "./components/Integrations";
export * from "./components/Webhooks";
export * from "./components/Secrets";
export * from "./components/Jobs";

// ---- Components: agent conversation, observability & key-value editing ----
export * from "./components/AgentChat";
export * from "./components/Observability";
export * from "./components/KeyValueEditor";

// ---- Components: metrics, status & notifications ----
export * from "./components/Metrics";
export * from "./components/StatusIndicators";
export * from "./components/Notifications";

// ---- Components: files, billing & feedback ----
export * from "./components/FileManager";
export * from "./components/Billing";
export * from "./components/Feedback";

// ---- Components: more inputs & data ----
export * from "./components/VirtualizedList";
export * from "./components/MaskedInput";
export * from "./components/MentionInput";
export * from "./components/JsonEditor";
export * from "./components/RichTextEditor";
