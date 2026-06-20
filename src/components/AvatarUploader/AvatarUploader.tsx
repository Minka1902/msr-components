import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { FileDropzone } from "../FileDropzone/FileDropzone";

export interface AvatarUploaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onError"> {
  /** Current avatar URL or data URL. */
  value?: string | null;
  /** Fired with the chosen file and a preview data URL. */
  onChange?: (file: File | null, dataUrl: string | null) => void;
  shape?: "circle" | "square";
  size?: number;
  accept?: string;
  /** Max file size in bytes; larger files are rejected via onError. */
  maxSize?: number;
  onError?: (message: string) => void;
  disabled?: boolean;
}

/** Avatar upload control: preview + drag-drop/browse, with remove. */
export const AvatarUploader = React.forwardRef<HTMLDivElement, AvatarUploaderProps>(function AvatarUploader(
  { value, onChange, shape = "circle", size = 96, accept = "image/*", maxSize, onError, disabled, className, ...rest },
  ref,
) {
  const [preview, setPreview] = React.useState<string | null>(value ?? null);
  const controlled = value !== undefined;
  const current = controlled ? value ?? null : preview;

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (maxSize && file.size > maxSize) {
      onError?.("File is too large");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      if (!controlled) setPreview(url);
      onChange?.(file, url);
    };
    reader.readAsDataURL(file);
  };

  const remove = () => {
    if (!controlled) setPreview(null);
    onChange?.(null, null);
  };

  return (
    <div ref={ref} className={cx("msr-AvatarUploader", className)} data-shape={shape} {...rest}>
      {current ? (
        <div className="msr-AvatarUploader__preview" style={{ width: size, height: size }}>
          <img src={current} alt="Avatar preview" className="msr-AvatarUploader__img" />
          {!disabled && (
            <div className="msr-AvatarUploader__overlay">
              <label className="msr-AvatarUploader__action" aria-label="Change avatar">
                <Icon name="upload" size={16} />
                <input
                  type="file"
                  accept={accept}
                  hidden
                  onChange={(e) => {
                    const f = e.target.files ? Array.from(e.target.files) : [];
                    handleFiles(f);
                    e.target.value = "";
                  }}
                />
              </label>
              <button type="button" className="msr-AvatarUploader__action" aria-label="Remove avatar" onClick={remove}>
                <Icon name="trash" size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <FileDropzone
          className="msr-AvatarUploader__drop"
          style={{ width: size, height: size }}
          onFiles={handleFiles}
          accept={accept}
          multiple={false}
          disabled={disabled}
          icon={<Icon name="user" size={22} />}
          title="Upload"
          description="Drag or click"
        />
      )}
    </div>
  );
});
