import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${units[i]}`;
}

function extOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* FileUploader                                                        */
/* ------------------------------------------------------------------ */

export interface FileUploaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  /** Called with the selected/dropped files. */
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Primary instruction text. */
  label?: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
}

/** Drag-and-drop (or click) file upload zone. */
export const FileUploader = React.forwardRef<HTMLDivElement, FileUploaderProps>(
  function FileUploader(
    {
      onFiles,
      accept,
      multiple = true,
      disabled,
      label = "Drag files here or click to browse",
      hint,
      icon,
      className,
      ...rest
    },
    ref,
  ) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = React.useState(false);

    const handleFiles = (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFiles(Array.from(list));
    };

    return (
      <div
        ref={ref}
        className={cx("msr-Uploader", className)}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        {...rest}
      >
        <input
          ref={inputRef}
          type="file"
          className="msr-Uploader__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="msr-Uploader__icon" aria-hidden="true">
          {icon ?? "⬆"}
        </span>
        <span className="msr-Uploader__label">{label}</span>
        {hint && <span className="msr-Uploader__hint">{hint}</span>}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* UploadList                                                          */
/* ------------------------------------------------------------------ */

export type UploadStatus = "queued" | "uploading" | "done" | "error";

export interface UploadEntry {
  id: string;
  name: string;
  size?: number;
  status: UploadStatus;
  /** 0–100 while uploading. */
  progress?: number;
  error?: React.ReactNode;
}

export interface UploadListProps extends React.HTMLAttributes<HTMLUListElement> {
  uploads: UploadEntry[];
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
  onRemove?: (id: string) => void;
}

/** List of files being uploaded with per-file progress and status. */
export const UploadList = React.forwardRef<HTMLUListElement, UploadListProps>(
  function UploadList(
    { uploads, onCancel, onRetry, onRemove, className, ...rest },
    ref,
  ) {
    return (
      <ul ref={ref} className={cx("msr-Uploads", className)} {...rest}>
        {uploads.map((u) => (
          <li key={u.id} className="msr-Uploads__item" data-status={u.status}>
            <span className="msr-Uploads__ext" aria-hidden="true">
              {extOf(u.name) || "•"}
            </span>
            <div className="msr-Uploads__main">
              <div className="msr-Uploads__nameRow">
                <span className="msr-Uploads__name">{u.name}</span>
                {u.size != null && (
                  <span className="msr-Uploads__size">
                    {formatBytes(u.size)}
                  </span>
                )}
              </div>
              {u.status === "uploading" && (
                <div className="msr-Uploads__track">
                  <div
                    className="msr-Uploads__fill"
                    style={{ width: `${u.progress ?? 0}%` }}
                  />
                </div>
              )}
              {u.status === "error" && u.error && (
                <div className="msr-Uploads__error">{u.error}</div>
              )}
              {u.status === "done" && (
                <div className="msr-Uploads__doneText">Uploaded</div>
              )}
            </div>
            <div className="msr-Uploads__actions">
              {u.status === "uploading" && onCancel && (
                <button
                  type="button"
                  aria-label="Cancel"
                  onClick={() => onCancel(u.id)}
                >
                  ×
                </button>
              )}
              {u.status === "error" && onRetry && (
                <button
                  type="button"
                  aria-label="Retry"
                  onClick={() => onRetry(u.id)}
                >
                  ↻
                </button>
              )}
              {(u.status === "done" || u.status === "error") && onRemove && (
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => onRemove(u.id)}
                >
                  🗑
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  },
);

/* ------------------------------------------------------------------ */
/* AttachmentChip                                                      */
/* ------------------------------------------------------------------ */

export interface AttachmentChipProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  icon?: React.ReactNode;
  href?: string;
  onRemove?: () => void;
}

/** Compact file chip with name, size and optional remove. */
export const AttachmentChip = React.forwardRef<
  HTMLSpanElement,
  AttachmentChipProps
>(function AttachmentChip(
  { name, size, icon, href, onRemove, className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx("msr-Attach", className)} {...rest}>
      <span className="msr-Attach__icon" aria-hidden="true">
        {icon ?? "📎"}
      </span>
      {href ? (
        <a className="msr-Attach__name" href={href} download>
          {name}
        </a>
      ) : (
        <span className="msr-Attach__name">{name}</span>
      )}
      {size != null && (
        <span className="msr-Attach__size">{formatBytes(size)}</span>
      )}
      {onRemove && (
        <button
          type="button"
          className="msr-Attach__remove"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
});

/* ------------------------------------------------------------------ */
/* FilePreviewCard                                                     */
/* ------------------------------------------------------------------ */

export interface FilePreviewCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: number;
  /** Thumbnail node (e.g. an <img>). Falls back to an extension badge. */
  thumbnail?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Card preview for a file (thumbnail/icon, name, meta, actions). */
export const FilePreviewCard = React.forwardRef<
  HTMLDivElement,
  FilePreviewCardProps
>(function FilePreviewCard(
  { name, size, thumbnail, meta, actions, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-FilePreview", className)} {...rest}>
      <div className="msr-FilePreview__thumb">
        {thumbnail ?? (
          <span className="msr-FilePreview__ext">{extOf(name) || "FILE"}</span>
        )}
      </div>
      <div className="msr-FilePreview__body">
        <div className="msr-FilePreview__name" title={name}>
          {name}
        </div>
        <div className="msr-FilePreview__meta">
          {size != null && <span>{formatBytes(size)}</span>}
          {meta}
        </div>
      </div>
      {actions && <div className="msr-FilePreview__actions">{actions}</div>}
    </div>
  );
});
