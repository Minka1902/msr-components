import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders first/last and truncates the middle for large counts", () => {
    render(<Pagination count={20} defaultPage={10} />);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });

  it("fires onPageChange and disables prev on first page", async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={5} defaultPage={1} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
