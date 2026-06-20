// msr-components/geo — dependency-free SVG/CSS maps & geography helpers.
export * from "./CountryFlag";
export * from "./MapLegend";
export * from "./Choropleth";
export * from "./TileGridMap";
export {
  interpolateColor,
  colorForValue,
  legendSteps,
  DEFAULT_SCALE,
} from "./_lib/scale";
