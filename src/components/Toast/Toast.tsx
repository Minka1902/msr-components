import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal } from "msr-hooks";
import { Icon, type IconName } from "../../lib/icons";

export type ToastTone = "info" | "success" | "warning" | "danger" | "loading";

export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  /** Auto-dismiss after ms. `0` disables auto-dismiss (default 4000; loading = 0). */
  duration?: number;
  /** Optional action node (e.g. an undo button). */
  action?: React.ReactNode;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface ToastContextValue {
  toast: (opts: ToastOptions) => string;
  success: (title: React.ReactNode, opts?: Partial<ToastOptions>) => string;
  error: (title: React.ReactNode, opts?: Partial<ToastOptions>) => string;
  info: (title: React.ReactNode, opts?: Partial<ToastOptions>) => string;
  loading: (title: React.ReactNode, opts?: Partial<ToastOptions>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, IconName> = {
  info: "info",
  success: "checkCircle",
  warning: "warning",
  danger: "alert",
  loading: "spinner",
};

export interface ToastProviderProps {
  children?: React.ReactNode;
  position?: ToastPosition;
  /** Max simultaneously visible toasts. */
  max?: number;
}

export function ToastProvider({
  children,
  position = "bottom-right",
  max = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const portal = usePortal("msr-toast-root");
  const counter = React.useRef(0);

  const dismiss = React.useCallback((id: string) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (opts: ToastOptions) => {
      const id = `msr-toast-${counter.current++}`;
      const tone = opts.tone ?? "info";
      const duration = opts.duration ?? (tone === "loading" ? 0 : 4000);
      setToasts((cur) => [...cur, { ...opts, tone, id }].slice(-max));
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss, max],
  );

  const make = React.useCallback(
    (tone: ToastTone) =>
      (title: React.ReactNode, opts?: Partial<ToastOptions>) =>
        toast({ title, tone, ...opts }),
    [toast],
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toast,
      success: make("success"),
      error: make("danger"),
      info: make("info"),
      loading: make("loading"),
      dismiss,
    }),
    [toast, make, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {portal &&
        createPortal(
          <div
            className="msr-ToastViewport"
            data-position={position}
            role="region"
            aria-label="Notifications"
          >
            {toasts.map((t) => (
              <div
                key={t.id}
                className="msr-Toast"
                data-tone={t.tone}
                role={t.tone === "danger" ? "alert" : "status"}
              >
                <span className="msr-Toast__icon" data-spin={t.tone === "loading" || undefined}>
                  <Icon name={TONE_ICON[t.tone ?? "info"]} size={18} />
                </span>
                <div className="msr-Toast__body">
                  <div className="msr-Toast__title">{t.title}</div>
                  {t.description && (
                    <div className="msr-Toast__description">{t.description}</div>
                  )}
                  {t.action && <div className="msr-Toast__action">{t.action}</div>}
                </div>
                <button
                  type="button"
                  className="msr-Toast__close"
                  aria-label="Dismiss"
                  onClick={() => dismiss(t.id)}
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            ))}
          </div>,
          portal,
        )}
    </ToastContext.Provider>
  );
}

/** Access the toast API. Must be rendered within a `ToastProvider`. */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>.");
  return ctx;
}
