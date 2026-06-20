import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Candlestick } from "./Candlestick/Candlestick";
import { Treemap } from "./Treemap/Treemap";
import { Waterfall } from "./Waterfall/Waterfall";
import { BulletChart } from "./BulletChart/BulletChart";
import { Sankey } from "./Sankey/Sankey";
import { EditableDataGrid } from "../components/EditableDataGrid/EditableDataGrid";
import { TreeTable } from "../components/TreeTable/TreeTable";

describe("Candlestick", () => {
  it("draws a body+wick per candle", () => {
    const { container } = render(
      <Candlestick
        data={[
          { open: 10, high: 14, low: 8, close: 12 },
          { open: 12, high: 13, low: 9, close: 10 },
        ]}
      />,
    );
    expect(container.querySelectorAll(".msr-Candlestick__body").length).toBe(2);
  });
});

describe("Treemap", () => {
  it("lays out one rect per datum and has no a11y violations", async () => {
    const { container } = render(
      <Treemap
        data={[
          { label: "A", value: 50 },
          { label: "B", value: 30 },
          { label: "C", value: 20 },
        ]}
      />,
    );
    expect(container.querySelectorAll("rect").length).toBe(3);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Waterfall", () => {
  it("renders a bar per step", () => {
    const { container } = render(
      <Waterfall
        data={[
          { label: "Start", value: 100, type: "total" },
          { label: "Gain", value: 40 },
          { label: "Loss", value: -25 },
        ]}
      />,
    );
    expect(container.querySelectorAll(".msr-Waterfall__bar").length).toBe(3);
  });
});

describe("BulletChart", () => {
  it("renders the measure and target", () => {
    const { container } = render(<BulletChart title="Revenue" value={70} target={80} ranges={[40, 70, 100]} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(container.querySelector(".msr-BulletChart__measure")).toBeInTheDocument();
    expect(container.querySelector(".msr-BulletChart__target")).toBeInTheDocument();
  });
});

describe("Sankey", () => {
  it("renders nodes and links", () => {
    const { container } = render(
      <Sankey
        nodes={[{ id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }]}
        links={[
          { source: "a", target: "b", value: 5 },
          { source: "a", target: "c", value: 3 },
        ]}
      />,
    );
    expect(container.querySelectorAll(".msr-Sankey__link").length).toBe(2);
    expect(container.querySelectorAll(".msr-Sankey__node").length).toBe(3);
  });
});

describe("EditableDataGrid", () => {
  it("edits a cell and commits on Enter", async () => {
    const onCellChange = vi.fn();
    render(
      <EditableDataGrid
        rowKey={(r: { id: string; name: string }) => r.id}
        data={[{ id: "1", name: "Ada" }]}
        columns={[{ id: "name", header: "Name", accessor: (r) => r.name }]}
        onCellChange={onCellChange}
      />,
    );
    await userEvent.dblClick(screen.getByText("Ada"));
    const input = screen.getByDisplayValue("Ada");
    await userEvent.clear(input);
    await userEvent.type(input, "Grace{Enter}");
    expect(onCellChange).toHaveBeenCalledWith(
      expect.objectContaining({ rowKey: "1", columnId: "name", value: "Grace" }),
    );
  });
});

describe("TreeTable", () => {
  it("expands a parent row to reveal children", async () => {
    render(
      <TreeTable
        defaultExpanded={[]}
        data={[
          { id: "root", name: "Root", children: [{ id: "child", name: "Child" }] },
        ]}
        columns={[{ id: "name", header: "Name", accessor: (r: { name: string }) => r.name }]}
      />,
    );
    expect(screen.queryByText("Child")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Expand" }));
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
