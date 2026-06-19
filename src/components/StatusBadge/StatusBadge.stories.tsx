import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge, type BadgeTone } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Core/StatusBadge",
  component: StatusBadge,
  args: { children: "Status", tone: "success" },
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

const TONES: BadgeTone[] = ["success", "warning", "danger", "info", "muted", "processing", "new"];

export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {TONES.map((t) => (
        <StatusBadge key={t} tone={t} dot>
          {t}
        </StatusBadge>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      {(["soft", "solid", "outline"] as const).map((v) => (
        <StatusBadge key={v} tone="success" variant={v}>
          {v}
        </StatusBadge>
      ))}
    </div>
  ),
};
