import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./Combobox";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Combobox", () => {
  it("filters options by typed query and selects one (single)", async () => {
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "ban");
    expect(screen.getByRole("option", { name: /Banana/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Apple/ })).toBeNull();
    await userEvent.click(screen.getByRole("option", { name: /Banana/ }));
    expect(onChange).toHaveBeenCalledWith("banana");
  });

  it("accumulates selections in multiple mode", async () => {
    const onChange = vi.fn();
    render(<Combobox multiple options={options} onChange={onChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: /Apple/ }));
    await userEvent.click(screen.getByRole("option", { name: /Cherry/ }));
    expect(onChange).toHaveBeenLastCalledWith(["apple", "cherry"]);
  });
});
