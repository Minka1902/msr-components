import * as React from "react";
import { cx } from "../../lib/cx";
import { SegmentedControl } from "../../components/SegmentedControl/SegmentedControl";
import { DescriptionList, type DescriptionItem } from "../../components/DataDisplay/DataDisplay";
import { QRCode } from "../../components/QRCode/QRCode";

export interface QRCollarPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value encoded in the QR (e.g. a public profile URL). */
  qrValue: string;
  /** Fields visible when scanned publicly. */
  publicFields: DescriptionItem[];
  /** Fields visible only to the owner. */
  ownerFields?: DescriptionItem[];
  audience?: "public" | "owner";
  defaultAudience?: "public" | "owner";
  onAudienceChange?: (a: "public" | "owner") => void;
}

/**
 * Shows what data appears when scanning a dog's collar QR, toggled between
 * public and owner views. (Renders a placeholder QR; pair with <QRCode> for a
 * scannable code.)
 */
export const QRCollarPreview = React.forwardRef<HTMLDivElement, QRCollarPreviewProps>(
  function QRCollarPreview(
    { qrValue, publicFields, ownerFields = [], audience, defaultAudience = "public", onAudienceChange, className, ...rest },
    ref,
  ) {
    const controlled = audience !== undefined;
    const [internal, setInternal] = React.useState<"public" | "owner">(defaultAudience);
    const view = controlled ? audience! : internal;
    const setView = (a: string) => {
      const next = a as "public" | "owner";
      if (!controlled) setInternal(next);
      onAudienceChange?.(next);
    };
    const fields = view === "owner" ? [...publicFields, ...ownerFields] : publicFields;

    return (
      <div ref={ref} className={cx("msr-QRCollar", className)} {...rest}>
        <QRCode className="msr-QRCollar__qr" value={qrValue} size={104} title="Collar QR code" />
        <div className="msr-QRCollar__body">
          {ownerFields.length > 0 && (
            <SegmentedControl
              size="sm"
              value={view}
              onValueChange={setView}
              options={[
                { value: "public", label: "Public" },
                { value: "owner", label: "Owner" },
              ]}
            />
          )}
          <DescriptionList items={fields} inline />
        </div>
      </div>
    );
  },
);
