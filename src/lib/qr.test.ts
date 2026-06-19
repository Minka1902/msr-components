import { describe, it, expect } from "vitest";
import { encodeQR } from "./qr";

describe("encodeQR", () => {
  it("produces a square matrix with the correct size for short text", () => {
    const m = encodeQR("HELLO", "M");
    expect(m.length).toBeGreaterThanOrEqual(21); // version 1 = 21x21
    expect(m.length).toBe(m[0].length);
    // size must be of the form 4*version+17
    expect((m.length - 17) % 4).toBe(0);
  });

  it("places the three finder patterns (7x7 dark border corners)", () => {
    const m = encodeQR("https://example.com", "M");
    const n = m.length;
    // top-left finder: corner module dark, and the ring at offset (0,3) dark
    expect(m[0][0]).toBe(true);
    expect(m[6][6]).toBe(true);
    // separator just inside is light
    expect(m[7][7]).toBe(false);
    // top-right + bottom-left finders present
    expect(m[0][n - 1]).toBe(true);
    expect(m[n - 1][0]).toBe(true);
  });

  it("grows the version as data grows", () => {
    const small = encodeQR("hi", "M").length;
    const big = encodeQR("x".repeat(200), "M").length;
    expect(big).toBeGreaterThan(small);
  });

  it("throws when the data is too long even for version 40", () => {
    expect(() => encodeQR("a".repeat(5000), "H")).toThrow();
  });
});
