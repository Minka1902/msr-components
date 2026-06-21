import type { Meta, StoryObj } from "@storybook/react";
import { CountryFlag, MapLegend, Choropleth, TileGridMap } from "../geo";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Geo" };
export default meta;
type Story = StoryObj;

export const Flags: Story = {
  render: () => (
    <Grid>
      {["US", "GB", "JP", "BR", "DE", "FR", "IN", "AU"].map((c) => (
        <Cell key={c} title={c} minWidth={80}>
          <CountryFlag code={c} size="lg" showCode />
        </Cell>
      ))}
    </Grid>
  ),
};

export const Legend: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="MapLegend (gradient)" minWidth={220}>
        <MapLegend min={0} max={100} label="Population" />
      </Cell>
      <Cell title="MapLegend (steps)" minWidth={260}>
        <MapLegend min={0} max={100} variant="steps" steps={5} label="Density" />
      </Cell>
    </Grid>
  ),
};

export const Maps: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="Choropleth" minWidth={260}>
        <Choropleth
          viewBox="0 0 100 100"
          regions={[
            { id: "a", name: "North", d: "M0 0 H50 V50 H0 Z", value: 80 },
            { id: "b", name: "East", d: "M50 0 H100 V50 H50 Z", value: 40 },
            { id: "c", name: "South", d: "M50 50 H100 V100 H50 Z", value: 95 },
            { id: "d", name: "West", d: "M0 50 H50 V100 H0 Z", value: 20 },
          ]}
        />
      </Cell>
      <Cell title="TileGridMap" minWidth={420}>
        <TileGridMap values={{ US: 90, BR: 60, CN: 80, IN: 70, DE: 50, AU: 40, ZA: 30 }} showLegend />
      </Cell>
    </Grid>
  ),
};
