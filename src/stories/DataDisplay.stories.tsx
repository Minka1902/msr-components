import type { Meta, StoryObj } from "@storybook/react";
import {
  DataTable,
  TreeTable,
  EditableDataGrid,
  JsonViewer,
  DescriptionList,
  Stat,
  RelativeTime,
  CopyButton,
  Highlight,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Data Display" };
export default meta;
type Story = StoryObj;

interface Row {
  id: string;
  name: string;
  role: string;
  score: number;
}
const rows: Row[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", score: 98 },
  { id: "2", name: "Grace Hopper", role: "Admiral", score: 95 },
  { id: "3", name: "Alan Turing", role: "Researcher", score: 99 },
];

export const Tables: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 640 }}>
      <DataTable
        data={rows}
        rowKey={(r) => r.id}
        columns={[
          { id: "name", header: "Name", accessor: (r) => r.name, sortable: true },
          { id: "role", header: "Role", accessor: (r) => r.role },
          { id: "score", header: "Score", accessor: (r) => r.score, align: "right", sortable: true },
        ]}
      />
      <TreeTable
        defaultExpanded={["eng"]}
        columns={[{ id: "name", header: "Team", accessor: (r: { name: string }) => r.name }]}
        data={[
          {
            id: "eng",
            name: "Engineering",
            children: [
              { id: "fe", name: "Frontend" },
              { id: "be", name: "Backend" },
            ],
          },
          { id: "design", name: "Design" },
        ]}
      />
      <EditableDataGrid
        rowKey={(r: Row) => r.id}
        data={rows}
        columns={[
          { id: "name", header: "Name", accessor: (r) => r.name },
          { id: "role", header: "Role", accessor: (r) => r.role, editor: "text" },
          { id: "score", header: "Score", accessor: (r) => r.score, editor: "number", align: "right" },
        ]}
      />
    </div>
  ),
};

export const KeyValue: Story = {
  render: () => (
    <Grid>
      <Cell title="DescriptionList" minWidth={280}>
        <DescriptionList
          items={[
            { term: "Status", description: "Active" },
            { term: "Plan", description: "Pro" },
            { term: "Seats", description: "12 / 20" },
          ]}
        />
      </Cell>
      <Cell title="Stat">
        <Stat label="Revenue" value="$48.2k" />
      </Cell>
      <Cell title="JsonViewer" minWidth={280}>
        <JsonViewer data={{ id: 1, name: "msr", tags: ["ui", "react"], nested: { ok: true } }} />
      </Cell>
    </Grid>
  ),
};

export const Inline: Story = {
  render: () => (
    <Grid>
      <Cell title="RelativeTime">
        <RelativeTime date={new Date(Date.now() - 3600_000)} />
      </Cell>
      <Cell title="CopyButton">
        <CopyButton value="npm i msr-components" />
      </Cell>
      <Cell title="Highlight" minWidth={280}>
        <Highlight query="quick">The quick brown fox</Highlight>
      </Cell>
    </Grid>
  ),
};
