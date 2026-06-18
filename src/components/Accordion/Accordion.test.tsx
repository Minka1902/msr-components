import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, type AccordionItem } from "./Accordion";

const items: AccordionItem[] = [
  { id: "one", title: "Section one", content: "Body one" },
  { id: "two", title: "Section two", content: "Body two" },
];

describe("Accordion", () => {
  it("expands a panel on click (single mode collapses others)", async () => {
    render(<Accordion items={items} defaultValue={["one"]} />);
    expect(screen.getByText("Body one")).toBeInTheDocument();
    expect(screen.queryByText("Body two")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Section two" }));
    expect(screen.getByText("Body two")).toBeInTheDocument();
    expect(screen.queryByText("Body one")).toBeNull();
  });

  it("keeps multiple panels open in multiple mode", async () => {
    render(<Accordion items={items} multiple defaultValue={["one"]} />);
    await userEvent.click(screen.getByRole("button", { name: "Section two" }));
    expect(screen.getByText("Body one")).toBeInTheDocument();
    expect(screen.getByText("Body two")).toBeInTheDocument();
  });
});
