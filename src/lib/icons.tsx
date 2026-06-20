import * as React from "react";
import {
  Search,
  Check,
  CheckCircle,
  X,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  AlertTriangle,
  AlertCircle,
  Info,
  InfoCircle,
  CirclePlus,
  CircleMinus,
  ClipboardCopy,
  Bell,
  FileDownload,
  CloudUpload,
  ExportData,
  Trash,
  Settings,
  File,
  Folder,
  Clock,
  Star,
  AiSparkles,
  CommandMenu,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Dot,
  Spinner,
  Hashtag,
  Shield,
  ShieldAlert,
  Pulse,
  TrendingUp,
  TrendingDown,
  MapPin,
  Battery2,
  QrCode,
  Heart,
  Stethoscope,
  Pill,
  ServiceDog,
  Paw,
  Flag2,
  FlagCheckered,
  Globe,
  Map as MapIcon,
  Eye,
  EyeOff,
  Columns,
  MoreVertical2,
  MoreHorizontal2,
  Adjust,
  Printer,
  Link as LinkIcon,
  User,
  Users,
  Calendar,
  PlayCircle2,
  Play,
  Keyboard,
  Gauge,
  Send,
  Comment,
  MessageDots,
  Reply,
  ThumbsUp,
  ThumbsDown,
} from "msr-icons";
import { cx } from "./cx";

/**
 * Centralized icon registry. All component iconography flows through here so the
 * library has a single place to swap/alias icons. Names that `msr-icons` does
 * not ship under a plain name are aliased here (and tracked in MISSING_ICONS.md).
 */
// msr-icons components accept a loose prop bag (onClick/backgroundColor/etc are
// untyped and required in their generated types), so we accept any component here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Glyph = React.ComponentType<any>;

export const glyphs = {
  search: Search,
  check: Check,
  checkCircle: CheckCircle,
  close: X,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  warning: AlertTriangle,
  alert: AlertCircle,
  info: Info,
  infoCircle: InfoCircle,
  plus: CirclePlus, // alias: no plain `Plus`
  minus: CircleMinus, // alias: no plain `Minus`
  copy: ClipboardCopy, // alias: no plain `Copy`
  bell: Bell,
  download: FileDownload, // alias
  upload: CloudUpload, // alias
  export: ExportData, // alias
  trash: Trash,
  settings: Settings,
  file: File,
  folder: Folder,
  clock: Clock,
  star: Star,
  sparkles: AiSparkles, // alias
  command: CommandMenu, // alias
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  dot: Dot,
  spinner: Spinner,
  hash: Hashtag, // alias
  shield: Shield,
  shieldAlert: ShieldAlert,
  activity: Pulse, // alias: no `Activity`
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  mapPin: MapPin,
  battery: Battery2, // alias
  qrCode: QrCode,
  heart: Heart,
  stethoscope: Stethoscope,
  pill: Pill,
  dog: ServiceDog, // alias: no plain `Dog`
  paw: Paw,
  flag: Flag2, // alias
  flagCheckered: FlagCheckered,
  globe: Globe,
  map: MapIcon,
  eye: Eye,
  eyeOff: EyeOff,
  columns: Columns,
  moreVertical: MoreVertical2, // alias
  moreHorizontal: MoreHorizontal2, // alias
  filter: Adjust, // alias: no neutral `Filter`
  printer: Printer,
  link: LinkIcon,
  user: User,
  users: Users,
  calendar: Calendar,
  play: Play,
  playCircle: PlayCircle2, // alias
  keyboard: Keyboard,
  gauge: Gauge,
  send: Send,
  share: Send, // alias: no plain `Share` glyph in msr-icons
  comment: Comment,
  message: MessageDots,
  reply: Reply,
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof glyphs;

export interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Registry key for the glyph to render. */
  name: IconName;
  /** Pixel size (applied to both width & height). Defaults to 16. */
  size?: number;
  /** Stroke width forwarded to the underlying SVG. */
  strokeWidth?: number;
}

/**
 * Renders a registry icon at a given size. The glyph inherits `currentColor`
 * (via `isColored={false}`) so it matches surrounding text/theme automatically.
 */
export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { name, size = 16, strokeWidth = 1.5, className, style, ...rest },
  ref,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Glyph = glyphs[name] as React.ComponentType<any>;
  return (
    <span
      ref={ref}
      className={cx("msr-Icon", className)}
      aria-hidden="true"
      style={{ fontSize: size, ...style }}
      {...rest}
    >
      <Glyph isColored={false} strokeWidth={strokeWidth} />
    </span>
  );
});
