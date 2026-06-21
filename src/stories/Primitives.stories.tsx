import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  StatusBadge,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Avatar,
  AvatarGroup,
  Spinner,
  Divider,
  Tag,
  Card,
  Skeleton,
  Kbd,
  NotificationBadge,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Primitives" };
export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <Grid>
      {(["solid", "soft", "outline", "ghost", "link"] as const).map((v) => (
        <Cell key={v} title={v} minWidth={120}>
          <Button variant={v}>Button</Button>
        </Cell>
      ))}
      <Cell title="tones" minWidth={320}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["primary", "neutral", "success", "warning", "danger", "info"] as const).map((t) => (
            <Button key={t} tone={t}>
              {t}
            </Button>
          ))}
        </div>
      </Cell>
      <Cell title="loading" minWidth={120}>
        <Button loading>Saving</Button>
      </Cell>
    </Grid>
  ),
};

export const Badges: Story = {
  render: () => (
    <Grid>
      <Cell title="StatusBadge" minWidth={320}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["success", "warning", "danger", "info", "muted", "processing", "new"] as const).map((t) => (
            <StatusBadge key={t} tone={t} dot>
              {t}
            </StatusBadge>
          ))}
        </div>
      </Cell>
      <Cell title="Tag (removable)">
        <div style={{ display: "flex", gap: 8 }}>
          <Tag>Default</Tag>
          <Tag tone="primary" onRemove={() => {}}>
            Removable
          </Tag>
        </div>
      </Cell>
      <Cell title="NotificationBadge">
        <NotificationBadge count={8}>
          <Button variant="soft">Inbox</Button>
        </NotificationBadge>
      </Cell>
      <Cell title="Kbd">
        <Kbd keys="Ctrl+K" />
      </Cell>
    </Grid>
  ),
};

export const FormControls: Story = {
  render: () => (
    <Grid>
      <Cell title="Input">
        <Input placeholder="Type here" />
      </Cell>
      <Cell title="Textarea">
        <Textarea placeholder="Multi-line" rows={3} />
      </Cell>
      <Cell title="Select">
        <Select
          options={[
            { value: "1", label: "One" },
            { value: "2", label: "Two" },
            { value: "3", label: "Three" },
          ]}
        />
      </Cell>
      <Cell title="Checkbox / Switch" minWidth={240}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Checkbox label="Checkbox" defaultChecked />
          <Switch defaultChecked />
        </div>
      </Cell>
      <Cell title="RadioGroup" minWidth={200}>
        <RadioGroup
          name="r"
          defaultValue="b"
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const Avatars: Story = {
  render: () => (
    <Grid>
      <Cell title="Avatar (initials)">
        <Avatar name="Ada Lovelace" />
      </Cell>
      <Cell title="AvatarGroup">
        <AvatarGroup
          max={3}
          items={[{ name: "Ada L" }, { name: "Grace H" }, { name: "Alan T" }, { name: "Linus T" }]}
        />
      </Cell>
      <Cell title="Spinner">
        <Spinner size={28} />
      </Cell>
    </Grid>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Grid>
      <Cell title="Card" minWidth={240}>
        <Card style={{ padding: 16 }}>Card content with a divider below.</Card>
      </Cell>
      <Cell title="Divider" minWidth={240}>
        <div>
          Above
          <Divider />
          Below
        </div>
      </Cell>
      <Cell title="Skeleton" minWidth={240}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Skeleton style={{ height: 14, width: "80%" }} />
          <Skeleton style={{ height: 14, width: "60%" }} />
        </div>
      </Cell>
    </Grid>
  ),
};
