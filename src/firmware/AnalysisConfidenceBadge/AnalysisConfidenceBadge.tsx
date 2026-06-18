import { StatusBadge, type BadgeTone } from "../../components/StatusBadge/StatusBadge";

export interface AnalysisConfidenceBadgeProps {
  /** Confidence as 0–1 or 0–100. Values > 1 are treated as percentages. */
  confidence: number;
  /** Override the computed label. */
  label?: string;
  showValue?: boolean;
  className?: string;
}

function level(pct: number): { tone: BadgeTone; label: string } {
  if (pct >= 80) return { tone: "success", label: "High confidence" };
  if (pct >= 50) return { tone: "warning", label: "Medium confidence" };
  return { tone: "danger", label: "Low confidence" };
}

/** Confidence indicator for extracted/inferred metadata. */
export function AnalysisConfidenceBadge({
  confidence,
  label,
  showValue = true,
  className,
}: AnalysisConfidenceBadgeProps) {
  const pct = Math.round(confidence <= 1 ? confidence * 100 : confidence);
  const { tone, label: autoLabel } = level(pct);
  return (
    <StatusBadge tone={tone} variant="soft" dot className={className}>
      {label ?? autoLabel}
      {showValue && ` · ${pct}%`}
    </StatusBadge>
  );
}
