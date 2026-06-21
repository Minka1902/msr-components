import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Breadcrumbs,
  Pagination,
  Stepper,
  AnimatedTabs,
  BottomNavigation,
  Dock,
  TreeView,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Navigation" };
export default meta;
type Story = StoryObj;

function PaginationDemo() {
  const [page, setPage] = React.useState(3);
  return <Pagination count={10} page={page} onPageChange={setPage} />;
}

export const Bars: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 560 }}>
      <Cell title="Breadcrumbs">
        <Breadcrumbs
          items={[
            { label: "Home", href: "#" },
            { label: "Library", href: "#" },
            { label: "Components" },
          ]}
        />
      </Cell>
      <Cell title="Pagination">
        <PaginationDemo />
      </Cell>
      <Cell title="AnimatedTabs">
        <AnimatedTabs
          defaultValue="overview"
          items={[
            { value: "overview", label: "Overview" },
            { value: "activity", label: "Activity" },
            { value: "settings", label: "Settings" },
          ]}
        />
      </Cell>
      <Cell title="Stepper">
        <Stepper
          active={1}
          steps={[
            { id: "cart", label: "Cart" },
            { id: "ship", label: "Shipping" },
            { id: "pay", label: "Payment" },
            { id: "done", label: "Done" },
          ]}
        />
      </Cell>
    </div>
  ),
};

export const Menus: Story = {
  render: () => (
    <Grid gap={40}>
      <Cell title="TreeView" minWidth={240}>
        <TreeView
          defaultExpanded={["src"]}
          nodes={[
            {
              id: "src",
              label: "src",
              children: [
                { id: "index", label: "index.ts" },
                { id: "app", label: "App.tsx" },
              ],
            },
            { id: "pkg", label: "package.json" },
          ]}
        />
      </Cell>
      <Cell title="BottomNavigation" minWidth={300}>
        <BottomNavigation
          defaultValue="home"
          items={[
            { id: "home", label: "Home", icon: "folder" },
            { id: "search", label: "Search", icon: "search" },
            { id: "alerts", label: "Alerts", icon: "bell", badge: 3 },
            { id: "me", label: "Profile", icon: "user" },
          ]}
        />
      </Cell>
      <Cell title="Dock" minWidth={300}>
        <Dock
          items={[
            { id: "files", label: "Files", icon: "folder" },
            { id: "search", label: "Search", icon: "search" },
            { id: "settings", label: "Settings", icon: "settings" },
            { id: "trash", label: "Trash", icon: "trash" },
          ]}
        />
      </Cell>
    </Grid>
  ),
};
