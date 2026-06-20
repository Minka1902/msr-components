# msr-components

A themeable, highly customizable React component library. Every component is
driven by one shared design-token system with **15 built-in themes**, styled with
CSS custom properties + `data-*` attributes (no Tailwind required by consumers),
and built on the zero-dependency [`msr-hooks`](https://www.npmjs.com/package/msr-hooks)
and [`msr-icons`](https://www.npmjs.com/package/msr-icons) packages.

> Status: **foundation + complete core/general-UI module.** The theming system
> (15 themes, density scale, OS `system` theme), build pipeline, all base/form
> primitives, the full general-UI set, and a representative component in every
> domain module are in place. Remaining domain components are being added on the
> same pattern (see [Roadmap](#roadmap)).

## Install

```bash
npm install msr-components msr-hooks msr-icons
```

`react` and `react-dom` (>=18) are peer dependencies.

## Usage

```tsx
import "msr-components/styles.css";
import { ThemeProvider, Button, StatusBadge, useToast, ToastProvider } from "msr-components";
import { MetricCard } from "msr-components/dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ToastProvider>
        <Button tone="primary">Save</Button>
        <StatusBadge tone="success" dot>Active</StatusBadge>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

Import the stylesheet **once** in your app entry. Components also work without a
`ThemeProvider` (the `light` theme is the `:root` default).

## Theming

Themes are pure CSS-variable overrides scoped by `[data-theme="…"]`. Switch themes
by setting the attribute (via `ThemeProvider`) — no component re-styling needed.

```tsx
const { theme, setTheme, themes } = useTheme(); // themes = all 15 names
setTheme("dracula");
```

**The 15 themes:** `light`, `dark`, `midnight`, `slate`, `sand`, `ocean`,
`forest`, `sunset`, `rose`, `grape`, `nord`, `dracula`, `solarized`, `mono`,
`contrast` (high-contrast a11y).

**Follow the OS preference** with `defaultTheme="system"`, and adjust **density**
(`compact` | `comfortable` | `spacious`), which scales control sizes:

```tsx
<ThemeProvider defaultTheme="system" density="compact">…</ThemeProvider>
```

### Customizing

Override tokens globally or per-scope:

```css
:root { --msr-color-primary: #ff5a5f; --msr-radius-md: 10px; }
```

Every component also accepts `className` / `style` and renders stable
`.msr-*` class names you can target. Add your own theme by defining a new
`[data-theme="brand"] { … }` block — no component changes required.

## Subpath exports

| Import | Contents |
| --- | --- |
| `msr-components` | **Primitives:** Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Avatar, Spinner, Divider, Popover, Menu, Accordion, Card, StatusBadge, Skeleton. **Polish:** AnimatedTabs, CopyableCodeBlock, PopoverHelp, Toast, Modal, ConfirmDialog, ContextMenu, FloatingActionButton, KeyboardShortcutOverlay, ThemePreviewCard, EmptyState. **General UI:** CommandPalette, SmartSearchInput, ResizableSplitPanel, DataTable, JsonViewer, FilePathViewer. Plus theme + hooks. |
| `msr-components/dashboard` | MetricCard, ActivityTimeline, HealthScoreCard, SetupProgress, InsightCards, NotificationCenter, QuickActionsPanel, RecentItemsPanel |
| `msr-components/inspector` | FileTreeExplorer, HashMatchExplorer, GroupAccordion, CommonNameDetector, FileDiffViewer, ResultCard, SeverityPanel, FileMetadataCard, ExportToolbar, GroupSummaryRow, ConfidenceBadge, BinaryFilePreviewPanel |
| `msr-components/modules` | Marketplace, SetupWizard, DependencyGraph, AccessGate, FeatureToggleCard, SetupChecklist, RolePermissionMatrix, OnboardingDashboard |
| `msr-components/profile` | ProfileHeader, RoutineTimeline, TrainingSessionCard, MedicalRecordCard, QRProfileCard, AccessManager, TrackerMapCard |
| `msr-components/quiz` | GuessInput, DistanceFeedbackCard, MapHint, FactReveal, ProximityMeter, DailyChallenge, ResultSummary |
| `msr-components/charts` | Sparkline, LineChart, BarChart, DonutChart, RadialProgress, Gauge, Heatmap, ProgressBar, RadarChart, ScatterPlot, FunnelChart, StackedBarChart, Candlestick, Treemap (squarified), Waterfall, BulletChart, Sankey (dependency-free SVG/CSS) |
| `msr-components/geo` | CountryFlag (code→emoji), MapLegend (color scale), Choropleth (consumer-supplied region paths), TileGridMap (built-in compact world tile grid) — dependency-free SVG/CSS |
| `msr-components/styles.css` | The full stylesheet (tokens + 15 themes + all components) |

**Interaction-rich**: SortableList (drag-reorder), KanbanBoard (drag-drop
columns), Carousel, ImageComparison (before/after slider), PasswordInput
(show/hide + strength meter).

**Dev tools / delight**: DiffViewer (LCS line diff, unified/split), Terminal
(console output), JsonEditor (live-validating), QRCode (real dependency-free
encoder), BentoGrid + BentoItem, FlipCard, AuroraBackground.

**More inputs & data**: VirtualizedList (windowed), RichTextEditor
(contentEditable toolbar), MaskedInput + PhoneInput, MentionInput (@-mentions),
plus charts RadarChart, ScatterPlot, FunnelChart, StackedBarChart
(`msr-components/charts`).

**App-building blocks**: AppShell (header + collapsible sidebar + content),
Sidebar, Toolbar, InlineEdit, and **FormBuilder** — render a complete, validated
form from a JSON field schema (great for AI-generated UIs).

**Auth**: LoginForm, SignupForm (password strength), AuthLayout (branding side
panel), SocialAuthButtons.

**States & resilience**: ErrorBoundary (recoverable fallback), ResultPage
(success/404/500), LoadingOverlay (inline/fullscreen), MaintenancePage.

**Media**: AudioPlayer (waveform scrubber), VideoPlayer (custom controls),
Waveform, ImageCropper (pan/zoom → canvas export), EmojiPicker (searchable,
grouped), AvatarUploader.

**Commerce**: PricingTable, ProductCard, CartLineItem, CheckoutSummary,
CouponInput, PaymentMethodCard.

**Onboarding**: ProductTour (spotlight coachmarks with step popovers),
FeatureSpotlight (pulsing highlight), WhatsNewModal (changelog dialog),
HintBubble (anchored callout), OnboardingChecklist (progress + tasks).

**Collaboration**: PresenceAvatars (status stack), LiveCursors
(`useBroadcastChannel`), TypingIndicator, ReactionBar (emoji reactions),
CommentThread (nested replies), VoteButtons, UserCard, ShareSheet.

**AI / agent UI**: ChatThread, ChatMessage, StreamingText, PromptInput
(⌘↵ to send), ToolCallCard, TokenUsageMeter, MarkdownRenderer (dependency-free,
reuses CopyableCodeBlock).

**Navigation & overlays**: Drawer/Sheet, Stepper, TreeView, HoverCard,
ScrollToTop.

**Motion & delight**: AnimatedCounter, ScrollProgressBar, ScrollReveal, Confetti,
TiltCard, SpotlightCard, Marquee, ShimmerText, AnimatedThemeToggle.

**Powered by `msr-hooks`** (showcase components): NetworkStatusBanner,
CountdownTimer, IdleDialog, GeoPrompt.

**Advanced inputs** (in core `msr-components`): Combobox/Autocomplete (single +
multi), Slider, RangeSlider, NumberStepper, PinInput, RatingStars, ToggleGroup,
TagInput, FileDropzone, ColorPicker, DatePicker (+ standalone Calendar).

**Table power-ups** (in core `msr-components`): EditableDataGrid (inline
text/number/select cell editing) and TreeTable (expandable hierarchical rows),
alongside the existing DataTable.

**Calendar & scheduling** (in core `msr-components`): EventCalendar (month grid
with event pills), MiniCalendar (compact, marked days), DateRangePicker
(two-month range with hover preview), TimePicker (stepped time list),
DateTimePicker (DatePicker + TimePicker), Scheduler (day/week timeline of events).

**Composable building blocks** (in core `msr-components`): layout primitives
(Stack, Inline, Grid, Container, Center, AspectRatio, Spacer), Alert/Banner,
Field, Tag, SegmentedControl, Breadcrumbs, Pagination, CopyButton, Highlight,
ClampText, RelativeTime, Stat, DescriptionList, AvatarGroup, Collapsible,
ScrollArea — designed to be assembled (incl. from JSON by an AI agent) into
larger UIs.

Each subpath is independently tree-shakeable.

## Architecture

- **Zero-runtime-CSS, token-driven** styling. Two token layers: primitives
  (spacing/radius/typography/motion) + semantic colors (overridden per theme).
- **Behavior from `msr-hooks`** (portals, escape, click-outside, scroll-lock,
  clipboard, keyboard, …). Gaps not covered upstream (`useFocusTrap`,
  `usePosition`, `useControllableState`, `useListNavigation`) ship as small local
  fallbacks and are tracked in [`MISSING_HOOKS.md`](./MISSING_HOOKS.md).
- **Icons from `msr-icons`** via a central registry (`Icon` + `glyphs`). Aliased
  names are tracked in [`MISSING_ICONS.md`](./MISSING_ICONS.md).
- **Build:** `tsup` → dual ESM/CJS + `.d.ts`, per-entry tree-shaking, `"use client"`
  directive for RSC compatibility.

## Scripts

```bash
npm run build           # tsup + "use client" + bundle styles.css
npm run typecheck       # tsc --noEmit
npm test                # vitest (unit + jest-axe a11y)
npm run lint            # eslint (flat config)
npm run format          # prettier --write
npm run storybook       # dev: Storybook with a 15-theme + density toolbar
npm run build-storybook # static Storybook build
```

CI (`.github/workflows/ci.yml`) runs typecheck → lint → test → build on every
push/PR. `prepublishOnly` rebuilds before `npm publish`.

## Roadmap

The full catalog (~60 components across general UI, dashboard, inspector, modules,
profile, and quiz domains) is being built on the established pattern. See the project
plan for the complete list. Contributions follow the per-component structure:
`Component.tsx` + `Component.css` + `index.ts` (+ tests), variants via `data-*`
attributes, behavior via `msr-hooks`.

## License

MIT
