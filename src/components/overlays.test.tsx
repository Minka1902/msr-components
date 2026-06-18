import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./Drawer/Drawer";
import { Stepper } from "./Stepper/Stepper";
import { TreeView, type TreeNode } from "./TreeView/TreeView";

describe("Drawer", () => {
  it("renders when open with the given side and closes on Escape", async () => {
    const onClose = vi.fn();
    render(
      <Drawer open side="left" title="Filters" onClose={onClose}>
        body
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-side", "left");
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});

describe("Stepper", () => {
  it("marks steps complete/active based on `active`", () => {
    render(
      <Stepper
        active={1}
        steps={[
          { id: "a", label: "One" },
          { id: "b", label: "Two" },
          { id: "c", label: "Three" },
        ]}
      />,
    );
    expect(screen.getByText("One").closest(".msr-Stepper2__step")).toHaveAttribute("data-state", "complete");
    expect(screen.getByText("Two").closest(".msr-Stepper2__step")).toHaveAttribute("data-state", "active");
  });
});

describe("TreeView", () => {
  const nodes: TreeNode[] = [
    { id: "src", label: "src", children: [{ id: "index", label: "index.ts" }] },
  ];
  it("expands a node to reveal children on click", async () => {
    render(<TreeView nodes={nodes} />);
    expect(screen.queryByText("index.ts")).toBeNull();
    await userEvent.click(screen.getByText("src"));
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });
});
