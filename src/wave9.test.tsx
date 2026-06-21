import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { RadialBar } from "./charts/RadialBar/RadialBar";
import { Histogram } from "./charts/Histogram/Histogram";
import { BoxPlot } from "./charts/BoxPlot/BoxPlot";
import { StreamGraph } from "./charts/StreamGraph/StreamGraph";
import { ChordDiagram } from "./charts/ChordDiagram/ChordDiagram";
import { Globe } from "./components/Globe/Globe";

describe("RadialBar", () => {
  it("renders a ring per series with a legend", () => {
    const { container } = render(
      <RadialBar
        data={[
          { label: "A", value: 80 },
          { label: "B", value: 50 },
        ]}
      />,
    );
    expect(container.querySelectorAll("path").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

describe("Histogram", () => {
  it("bins values into bars", () => {
    const values = Array.from({ length: 50 }, (_, i) => i % 10);
    const { container } = render(<Histogram values={values} bins={5} />);
    expect(container.querySelectorAll(".msr-Histogram__bar").length).toBe(5);
  });
});

describe("BoxPlot", () => {
  it("renders a box per group and is accessible", async () => {
    const { container } = render(
      <BoxPlot
        groups={[
          { label: "X", values: [1, 2, 3, 4, 5, 6, 7, 8, 20] },
          { label: "Y", values: [3, 4, 4, 5, 6, 7, 9] },
        ]}
      />,
    );
    expect(container.querySelectorAll(".msr-BoxPlot__box").length).toBe(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("StreamGraph", () => {
  it("renders a layer per series", () => {
    const { container } = render(
      <StreamGraph
        series={[
          { label: "a", values: [1, 3, 2, 5] },
          { label: "b", values: [2, 1, 4, 3] },
          { label: "c", values: [1, 2, 1, 2] },
        ]}
      />,
    );
    expect(container.querySelectorAll(".msr-StreamGraph__layer").length).toBe(3);
  });
});

describe("ChordDiagram", () => {
  it("renders node arcs and ribbons", () => {
    const { container } = render(
      <ChordDiagram
        labels={["A", "B", "C"]}
        matrix={[
          [0, 5, 3],
          [2, 0, 4],
          [1, 6, 0],
        ]}
      />,
    );
    expect(container.querySelectorAll(".msr-ChordDiagram__node").length).toBe(3);
    expect(container.querySelectorAll(".msr-ChordDiagram__ribbon").length).toBeGreaterThan(0);
  });
});

describe("Globe", () => {
  it("mounts a canvas", () => {
    const { container } = render(<Globe size={200} markers={[{ lat: 40, lng: -74, label: "NYC" }]} />);
    expect(container.querySelector(".msr-Globe__canvas")).toBeInTheDocument();
  });
});
