import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QRCode } from "./QRCode/QRCode";
import { MaskedInput } from "./MaskedInput/MaskedInput";
import { JsonEditor } from "./JsonEditor/JsonEditor";
import { VirtualizedList } from "./VirtualizedList/VirtualizedList";

describe("QRCode", () => {
  it("renders an SVG with a path of modules", () => {
    const { container } = render(<QRCode value="https://example.com" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(container.querySelector("path")?.getAttribute("d")?.length).toBeGreaterThan(50);
  });
});

describe("MaskedInput", () => {
  it("formats digits against the mask", async () => {
    const onValueChange = vi.fn();
    render(<MaskedInput mask="(###) ###-####" aria-label="phone" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByLabelText("phone"), "5551234567");
    expect(onValueChange).toHaveBeenLastCalledWith("(555) 123-4567", "5551234567");
  });
});

describe("JsonEditor", () => {
  it("flags invalid JSON and reports valid parses", async () => {
    const onValidChange = vi.fn();
    render(<JsonEditor defaultValue="" onValidChange={onValidChange} />);
    const ta = screen.getByRole("textbox");
    await userEvent.type(ta, '{{"a":1}');
    expect(onValidChange).toHaveBeenLastCalledWith({ a: 1 });
    expect(screen.getByText("Valid")).toBeInTheDocument();
  });
});

describe("VirtualizedList", () => {
  it("only renders a windowed subset of a large list", () => {
    const items = Array.from({ length: 10000 }, (_, i) => i);
    const { container } = render(
      <VirtualizedList items={items} rowHeight={20} height={200} renderItem={(n) => <span>row-{n}</span>} />,
    );
    const rows = container.querySelectorAll(".msr-VList__row");
    // ~ (200/20) + overscan*2 = ~18, definitely far fewer than 10000
    expect(rows.length).toBeLessThan(40);
    expect(rows.length).toBeGreaterThan(5);
  });
});
