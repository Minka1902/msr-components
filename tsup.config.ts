import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "dashboard/index": "src/dashboard/index.ts",
    "firmware/index": "src/firmware/index.ts",
    "business/index": "src/business/index.ts",
    "pets/index": "src/pets/index.ts",
    "game/index": "src/game/index.ts",
    "charts/index": "src/charts/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  // React Server Components: every entry ships interactive components.
  banner: { js: '"use client";' },
  // react / react-dom / msr-* are resolved by the consumer (peer/deps).
  external: ["react", "react-dom", "msr-hooks", "msr-icons"],
});
