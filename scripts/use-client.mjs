// Prepends the "use client" directive to each built entry file. esbuild drops a
// banner directive when code-splitting, so we add it here post-build to keep the
// package usable from React Server Components (it ships interactive components).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const entries = [
  "index",
  "dashboard/index",
  "firmware/index",
  "business/index",
  "pets/index",
  "game/index",
  "charts/index",
];
const directive = '"use client";\n';

let patched = 0;
for (const entry of entries) {
  for (const ext of [".js", ".cjs"]) {
    const file = join(dist, entry + ext);
    if (!existsSync(file)) continue;
    const content = readFileSync(file, "utf8");
    if (content.startsWith('"use client"') || content.startsWith("'use client'")) continue;
    writeFileSync(file, directive + content);
    patched++;
  }
}
console.log(`use-client: patched ${patched} entry files`);
