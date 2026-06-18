// Concatenates all library CSS into a single dist/styles.css.
// Order matters: reset -> tokens -> themes -> component styles.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcStyles = join(root, "src", "styles");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (name.endsWith(".css")) acc.push(full);
  }
  return acc;
}

const reset = join(srcStyles, "reset.css");
const tokens = join(srcStyles, "tokens.css");
const themesDir = join(srcStyles, "themes");
const themeFiles = readdirSync(themesDir)
  .filter((f) => f.endsWith(".css"))
  .sort()
  .map((f) => join(themesDir, f));

// Everything under src/ that is a component stylesheet (not the foundation files).
const foundation = new Set([reset, tokens, join(srcStyles, "index.css"), ...themeFiles]);
const componentCss = walk(join(root, "src"))
  .filter((f) => !foundation.has(f))
  .sort();

const ordered = [reset, tokens, ...themeFiles, ...componentCss];

const banner = "/* msr-components — generated bundle. Do not edit directly. */\n";
const out = banner + ordered.map((f) => `/* ${f.replace(root + "/", "")} */\n` + readFileSync(f, "utf8").trim()).join("\n\n");

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "styles.css"), out + "\n");
console.log(`build-css: wrote dist/styles.css from ${ordered.length} files`);
