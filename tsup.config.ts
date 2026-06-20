import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "dashboard/index": "src/dashboard/index.ts",
    "inspector/index": "src/inspector/index.ts",
    "modules/index": "src/modules/index.ts",
    "profile/index": "src/profile/index.ts",
    "quiz/index": "src/quiz/index.ts",
    "charts/index": "src/charts/index.ts",
    "geo/index": "src/geo/index.ts",
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
