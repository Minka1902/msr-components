import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Tooltip,
  Popover,
  Popconfirm,
  HoverCard,
  Menu,
  ContextMenu,
  Modal,
  Drawer,
  Lightbox,
  Button,
  UserCard,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Overlays" };
export default meta;
type Story = StoryObj;

export const Anchored: Story = {
  render: () => (
    <Grid gap={40}>
      <Cell title="Tooltip">
        <Tooltip content="Helpful hint about this action">
          <Button variant="soft">Hover me</Button>
        </Tooltip>
      </Cell>
      <Cell title="Popover">
        <Popover trigger={<Button variant="soft">Open popover</Button>}>
          <div style={{ padding: 12, maxWidth: 220 }}>Any content can live in a popover panel.</div>
        </Popover>
      </Cell>
      <Cell title="Popconfirm">
        <Popconfirm title="Delete this item?" description="This cannot be undone." onConfirm={() => {}}>
          <Button tone="danger" variant="soft">
            Delete
          </Button>
        </Popconfirm>
      </Cell>
      <Cell title="HoverCard">
        <HoverCard trigger={<Button variant="link">@ada</Button>}>
          <UserCard name="Ada Lovelace" handle="@ada" bio="First programmer." />
        </HoverCard>
      </Cell>
      <Cell title="Menu">
        <Menu
          trigger={<Button variant="soft">Actions ▾</Button>}
          items={[
            { id: "edit", label: "Edit" },
            { id: "dupe", label: "Duplicate" },
            { id: "del", label: "Delete" },
          ]}
        />
      </Cell>
      <Cell title="ContextMenu">
        <ContextMenu
          items={[
            { id: "copy", label: "Copy" },
            { id: "paste", label: "Paste" },
          ]}
        >
          <div
            style={{
              padding: 24,
              border: "1px dashed var(--msr-color-border)",
              borderRadius: 8,
              color: "var(--msr-color-fg-muted)",
            }}
          >
            Right-click here
          </div>
        </ContextMenu>
      </Cell>
    </Grid>
  ),
};

function ModalDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm changes" footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
        A centered, focus-trapped dialog.
      </Modal>
    </>
  );
}

function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title="Filters">
        Slide-over panel content.
      </Drawer>
    </>
  );
}

function LightboxDemo() {
  const [open, setOpen] = React.useState(false);
  const images = [
    { src: "https://picsum.photos/id/1015/800/600", alt: "Lake" },
    { src: "https://picsum.photos/id/1025/800/600", alt: "Dog" },
    { src: "https://picsum.photos/id/1043/800/600", alt: "City" },
  ];
  return (
    <>
      <Button variant="soft" onClick={() => setOpen(true)}>
        Open lightbox
      </Button>
      <Lightbox open={open} onClose={() => setOpen(false)} images={images} />
    </>
  );
}

export const Portals: Story = {
  render: () => (
    <Grid gap={24}>
      <Cell title="Modal">
        <ModalDemo />
      </Cell>
      <Cell title="Drawer">
        <DrawerDemo />
      </Cell>
      <Cell title="Lightbox">
        <LightboxDemo />
      </Cell>
    </Grid>
  ),
};
