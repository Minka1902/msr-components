/**
 * Tiny classname joiner. Accepts strings, falsy values, and objects whose keys
 * are emitted when their value is truthy. Avoids pulling in `clsx`.
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>;

export function cx(...parts: ClassValue[]): string {
  const out: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (typeof part === "string" || typeof part === "number") {
      out.push(String(part));
    } else {
      for (const key in part) {
        if (part[key]) out.push(key);
      }
    }
  }
  return out.join(" ");
}
