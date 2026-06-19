import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./DonutChart/DonutChart";
import { LineChart } from "./LineChart/LineChart";
import { RadarChart } from "./RadarChart/RadarChart";
import { Gauge } from "./Gauge/Gauge";

const meta: Meta = { title: "Charts/Gallery" };
export default meta;
type Story = StoryObj;

export const Donut: Story = {
  render: () => (
    <DonutChart
      centerLabel="248"
      data={[
        { label: "Critical", value: 12 },
        { label: "High", value: 36 },
        { label: "Medium", value: 80 },
        { label: "Low", value: 120 },
      ]}
    />
  ),
};

export const Line: Story = {
  render: () => (
    <LineChart
      area
      labels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
      series={[
        { label: "Scans", data: [12, 18, 9, 24, 30] },
        { label: "Reports", data: [4, 8, 6, 10, 14] },
      ]}
    />
  ),
};

export const Radar: Story = {
  render: () => (
    <RadarChart
      axes={[{ label: "Risk" }, { label: "Coverage" }, { label: "Freshness" }, { label: "Completeness" }, { label: "Trust" }]}
      series={[{ label: "Firmware A", values: [70, 90, 50, 85, 60] }]}
    />
  ),
};

export const GaugeStory: Story = {
  name: "Gauge",
  render: () => <Gauge value={72} label="72" />,
};
