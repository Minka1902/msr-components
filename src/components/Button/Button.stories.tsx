import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Core/Button",
  component: Button,
  args: { children: "Button" },
  argTypes: {
    variant: { control: "select", options: ["solid", "soft", "outline", "ghost", "link"] },
    tone: { control: "select", options: ["primary", "neutral", "success", "warning", "danger", "info"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["solid", "soft", "outline", "ghost", "link"] as const).map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["primary", "neutral", "success", "warning", "danger", "info"] as const).map((t) => (
        <Button key={t} {...args} tone={t}>
          {t}
        </Button>
      ))}
    </div>
  ),
};

export const Loading: Story = { args: { loading: true } };
