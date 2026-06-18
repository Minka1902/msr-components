import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface FileDropzoneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "title"> {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

/** Drag-and-drop file upload area (also click-to-browse). */
export const FileDropzone = React.forwardRef<HTMLDivElement, FileDropzoneProps>(
  function FileDropzone(
    { onFiles, accept, multiple = true, disabled, title = "Drop files here", description = "or click to browse", icon, className, ...rest },
    ref,
  ) {
    const [dragOver, setDragOver] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handle = (list: FileList | null) => {
      if (!list) return;
      const files = Array.from(list);
      onFiles(multiple ? files : files.slice(0, 1));
    };

    return (
      <div
        ref={ref}
        className={cx("msr-Dropzone", className)}
        data-dragover={dragOver || undefined}
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
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) handle(e.dataTransfer.files);
        }}
        {...rest}
      >
        <input
          ref={inputRef}
          type="file"
          className="msr-Dropzone__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handle(e.target.files)}
        />
        <span className="msr-Dropzone__icon">{icon ?? <Icon name="upload" size={28} />}</span>
        <span className="msr-Dropzone__title">{title}</span>
        <span className="msr-Dropzone__desc">{description}</span>
      </div>
    );
  },
);
