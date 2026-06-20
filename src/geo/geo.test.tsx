import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { CountryFlag, codeToFlagEmoji } from "./CountryFlag";
import { TileGridMap, WORLD_TILE_GRID } from "./TileGridMap";
import { Choropleth } from "./Choropleth";
import { MapLegend } from "./MapLegend";
import { colorForValue, interpolateColor } from "./_lib/scale";

describe("codeToFlagEmoji", () => {
  it("converts a 2-letter code to regional-indicator flag", () => {
    expect(codeToFlagEmoji("US")).toBe("🇺🇸");
    expect(codeToFlagEmoji("fr")).toBe("🇫🇷");
    expect(codeToFlagEmoji("X")).toBe("");
  });
});

describe("color scale", () => {
  it("interpolates between stops and clamps", () => {
    expect(interpolateColor(["#000000", "#ffffff"], 0)).toBe("#000000");
    expect(interpolateColor(["#000000", "#ffffff"], 1)).toBe("#ffffff");
    expect(colorForValue(5, 0, 10, ["#000000", "#ffffff"])).toBe("#808080");
  });
});

describe("CountryFlag", () => {
  it("renders an accessible flag", () => {
    render(<CountryFlag code="jp" showCode />);
    expect(screen.getByRole("img", { name: "JP" })).toBeInTheDocument();
    expect(screen.getByText("JP")).toBeInTheDocument();
  });
});

describe("TileGridMap", () => {
  it("ships a built-in world layout and fires onTileClick", async () => {
    expect(WORLD_TILE_GRID.length).toBeGreaterThan(50);
    const onTileClick = vi.fn();
    render(<TileGridMap values={{ US: 10, BR: 5 }} onTileClick={onTileClick} />);
    await userEvent.click(screen.getByRole("button", { name: /United States/ }));
    expect(onTileClick).toHaveBeenCalledWith(expect.objectContaining({ code: "US" }));
  });
});

describe("Choropleth", () => {
  it("renders regions and a legend with no a11y violations", async () => {
    const { container } = render(
      <Choropleth
        viewBox="0 0 100 100"
        regions={[
          { id: "a", name: "Alpha", d: "M0 0 H50 V50 H0 Z", value: 10 },
          { id: "b", name: "Beta", d: "M50 0 H100 V50 H50 Z", value: 40 },
        ]}
      />,
    );
    expect(container.querySelectorAll("path").length).toBe(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("MapLegend", () => {
  it("renders discrete steps", () => {
    render(<MapLegend min={0} max={100} variant="steps" steps={3} label="Pop" />);
    expect(screen.getByText("Pop")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
