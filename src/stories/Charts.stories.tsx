import type { Meta, StoryObj } from "@storybook/react";
import {
  Sparkline,
  LineChart,
  BarChart,
  StackedBarChart,
  DonutChart,
  RadialProgress,
  Gauge,
  Heatmap,
  RadarChart,
  ScatterPlot,
  FunnelChart,
  Candlestick,
  Treemap,
  Waterfall,
  BulletChart,
  Sankey,
  CalendarHeatmap,
  Gantt,
  RadialBar,
  Histogram,
  BoxPlot,
  StreamGraph,
  ChordDiagram,
} from "../charts";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Charts" };
export default meta;
type Story = StoryObj;

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const Y = new Date().getFullYear();

export const Trends: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="Sparkline" minWidth={160}>
        <Sparkline data={[4, 8, 5, 10, 7, 12, 9]} />
      </Cell>
      <Cell title="LineChart" minWidth={320}>
        <LineChart area labels={labels} series={[{ label: "Scans", data: [12, 18, 9, 24, 30] }]} />
      </Cell>
      <Cell title="BarChart" minWidth={300}>
        <BarChart data={labels.map((l, i) => ({ label: l, value: [12, 18, 9, 24, 30][i] }))} />
      </Cell>
      <Cell title="StackedBarChart" minWidth={320}>
        <StackedBarChart
          series={[
            { key: "a", label: "A" },
            { key: "b", label: "B" },
          ]}
          data={labels.map((l, i) => ({ label: l, values: { a: [4, 6, 3, 8, 9][i], b: [3, 2, 5, 4, 6][i] } }))}
        />
      </Cell>
    </Grid>
  ),
};

export const Radial: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="DonutChart">
        <DonutChart centerLabel="248" data={[{ label: "A", value: 12 }, { label: "B", value: 36 }, { label: "C", value: 80 }]} />
      </Cell>
      <Cell title="RadialProgress">
        <RadialProgress value={72} />
      </Cell>
      <Cell title="Gauge">
        <Gauge value={64} label="64" />
      </Cell>
      <Cell title="RadialBar" minWidth={300}>
        <RadialBar data={[{ label: "Risk", value: 80 }, { label: "Cov", value: 55 }, { label: "Trust", value: 65 }]} />
      </Cell>
      <Cell title="RadarChart" minWidth={280}>
        <RadarChart
          axes={[{ label: "Risk" }, { label: "Cov" }, { label: "Fresh" }, { label: "Trust" }]}
          series={[{ label: "A", values: [70, 90, 50, 60] }]}
        />
      </Cell>
    </Grid>
  ),
};

export const Distributions: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="Histogram" minWidth={360}>
        <Histogram values={Array.from({ length: 200 }, () => Math.round((Math.random() + Math.random()) * 25))} />
      </Cell>
      <Cell title="BoxPlot" minWidth={360}>
        <BoxPlot
          groups={[
            { label: "A", values: [3, 5, 6, 7, 8, 9, 10, 22] },
            { label: "B", values: [4, 5, 5, 6, 7, 8, 9] },
            { label: "C", values: [2, 6, 7, 8, 9, 11, 12] },
          ]}
        />
      </Cell>
      <Cell title="ScatterPlot" minWidth={320}>
        <ScatterPlot
          series={[{ label: "S", points: Array.from({ length: 24 }, () => ({ x: Math.random() * 100, y: Math.random() * 100 })) }]}
        />
      </Cell>
      <Cell title="Heatmap" minWidth={320}>
        <Heatmap rows={7} data={Array.from({ length: 70 }, (_, i) => ({ date: String(i), value: Math.random() }))} />
      </Cell>
    </Grid>
  ),
};

export const Flows: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="FunnelChart" minWidth={300}>
        <FunnelChart stages={[{ label: "Visits", value: 1000 }, { label: "Signups", value: 420 }, { label: "Paid", value: 110 }]} />
      </Cell>
      <Cell title="Waterfall" minWidth={360}>
        <Waterfall
          data={[
            { label: "Start", value: 100, type: "total" },
            { label: "Sales", value: 60 },
            { label: "Refund", value: -25 },
            { label: "End", value: 135, type: "total" },
          ]}
        />
      </Cell>
      <Cell title="Sankey" minWidth={420}>
        <Sankey
          nodes={[{ id: "a", label: "Source" }, { id: "b", label: "Mid" }, { id: "c", label: "X" }, { id: "d", label: "Y" }]}
          links={[
            { source: "a", target: "b", value: 8 },
            { source: "b", target: "c", value: 5 },
            { source: "b", target: "d", value: 3 },
          ]}
        />
      </Cell>
      <Cell title="ChordDiagram" minWidth={360}>
        <ChordDiagram
          labels={["A", "B", "C", "D"]}
          matrix={[
            [0, 5, 3, 1],
            [4, 0, 2, 6],
            [1, 3, 0, 4],
            [2, 1, 5, 0],
          ]}
        />
      </Cell>
      <Cell title="StreamGraph" minWidth={420}>
        <StreamGraph
          series={[
            { label: "a", values: [2, 4, 6, 5, 7, 6, 8] },
            { label: "b", values: [3, 3, 4, 6, 5, 7, 6] },
            { label: "c", values: [1, 2, 2, 3, 4, 3, 5] },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const Specialized: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="Candlestick" minWidth={420}>
        <Candlestick
          data={Array.from({ length: 14 }, (_, i) => {
            const o = 10 + Math.sin(i) * 3;
            const c = o + (Math.random() - 0.5) * 4;
            return { open: o, close: c, high: Math.max(o, c) + 1.5, low: Math.min(o, c) - 1.5 };
          })}
        />
      </Cell>
      <Cell title="Treemap" minWidth={360}>
        <Treemap data={[{ label: "A", value: 50 }, { label: "B", value: 30 }, { label: "C", value: 18 }, { label: "D", value: 12 }]} />
      </Cell>
      <Cell title="BulletChart" minWidth={360}>
        <BulletChart title="Revenue" value={72} target={80} ranges={[40, 70, 100]} />
      </Cell>
      <Cell title="Gantt" minWidth={460}>
        <Gantt
          tasks={[
            { id: "1", label: "Design", start: new Date(Y, 0, 1), end: new Date(Y, 0, 12), progress: 0.6 },
            { id: "2", label: "Build", start: new Date(Y, 0, 10), end: new Date(Y, 1, 2) },
            { id: "3", label: "Ship", start: new Date(Y, 1, 1), end: new Date(Y, 1, 10) },
          ]}
        />
      </Cell>
      <Cell title="CalendarHeatmap" minWidth={460}>
        <CalendarHeatmap
          year={Y}
          values={Array.from({ length: 120 }, () => ({
            date: new Date(Y, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            count: Math.floor(Math.random() * 6),
          }))}
        />
      </Cell>
    </Grid>
  ),
};
