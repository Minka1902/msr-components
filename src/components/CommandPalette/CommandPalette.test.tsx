import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette, type CommandItem } from "./CommandPalette";

function makeItems(onA = vi.fn(), onB = vi.fn()): CommandItem[] {
  return [
    { id: "a", label: "Open file", group: "Files", onSelect: onA, keywords: ["document"] },
    { id: "b", label: "Create report", group: "Actions", onSelect: onB },
  ];
}

describe("CommandPalette", () => {
  beforeEach(() => localStorage.clear());

  it("does not render when closed", () => {
    render(<CommandPalette open={false} onClose={() => {}} items={makeItems()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("filters by query and selects via Enter", async () => {
    const onA = vi.fn();
    const onClose = vi.fn();
    render(
      <CommandPalette open onClose={onClose} items={makeItems(onA)} recentsKey="t-recents" />,
    );
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "document");
    // "Open file" matches via keyword; "Create report" filtered out
    expect(screen.getByText("Open file")).toBeInTheDocument();
    expect(screen.queryByText("Create report")).toBeNull();
    await userEvent.keyboard("{Enter}");
    expect(onA).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("navigates with arrow keys", async () => {
    const onA = vi.fn();
    const onB = vi.fn();
    render(<CommandPalette open onClose={() => {}} items={makeItems(onA, onB)} recentsKey="t2" />);
    screen.getByRole("combobox").focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onB).toHaveBeenCalledOnce();
  });
});
