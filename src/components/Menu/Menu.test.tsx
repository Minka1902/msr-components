import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu, type MenuItem } from "./Menu";

describe("Menu", () => {
  it("opens on trigger click and fires the chosen item", async () => {
    const onEdit = vi.fn();
    const items: MenuItem[] = [
      { id: "edit", label: "Edit", onSelect: onEdit },
      { id: "sep", separator: true },
      { id: "del", label: "Delete", danger: true, onSelect: () => {} },
    ];
    render(<Menu trigger={<button>Actions</button>} items={items} />);

    expect(screen.queryByRole("menu")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
