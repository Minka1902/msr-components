import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type DataTableColumn } from "./DataTable";

interface Row {
  id: string;
  name: string;
  size: number;
}

const data: Row[] = [
  { id: "1", name: "alpha", size: 30 },
  { id: "2", name: "bravo", size: 10 },
  { id: "3", name: "charlie", size: 20 },
];

const columns: Array<DataTableColumn<Row>> = [
  { id: "name", header: "Name", accessor: (r) => r.name, value: (r) => r.name },
  { id: "size", header: "Size", accessor: (r) => r.size, value: (r) => r.size, align: "right" },
];

function bodyRowNames() {
  const table = screen.getByRole("table");
  const rows = within(table).getAllByRole("row").slice(1); // drop header
  return rows.map((r) => within(r).getAllByRole("cell")[0].textContent);
}

describe("DataTable", () => {
  it("filters rows by the search query", async () => {
    render(<DataTable data={data} columns={columns} rowKey={(r) => r.id} />);
    await userEvent.type(screen.getByPlaceholderText("Filter…"), "brav");
    expect(bodyRowNames()).toEqual(["bravo"]);
  });

  it("sorts by a column when its header is clicked", async () => {
    render(<DataTable data={data} columns={columns} rowKey={(r) => r.id} searchable={false} />);
    await userEvent.click(screen.getByRole("button", { name: /Size/ }));
    expect(bodyRowNames()).toEqual(["bravo", "charlie", "alpha"]); // 10,20,30 asc
  });

  it("shows the empty message when there are no rows", () => {
    render(<DataTable data={[]} columns={columns} rowKey={(r) => r.id} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
