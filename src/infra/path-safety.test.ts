import { describe, expect, it } from "vitest";
import { resolveSafeBaseDir, isWithinDir } from "./path-safety.js";

describe("resolveSafeBaseDir", () => {
  it("resolves and appends separator", () => {
    const result = resolveSafeBaseDir("/home/user");
    expect(result).toMatch(/^\\/home\\/user[\\/]?$/);
  });

  it("handles paths without trailing separator", () => {
    const result = resolveSafeBaseDir("/tmp");
    expect(result).toMatch(/\/tmp\/?$/);
  });

  it("handles Windows paths", () => {
    const result = resolveSafeBaseDir("C:\\Users\\test");
    expect(result).toMatch(/C:\\Users\\test[\\/]?$/i);
  });
});

describe("isWithinDir", () => {
  it("returns true for paths within directory", () => {
    expect(isWithinDir("/home/user", "/home/user/file.txt")).toBe(true);
  });

  it("returns false for paths outside directory", () => {
    expect(isWithinDir("/home/user", "/home/other/file.txt")).toBe(false);
  });

  it("handles edge cases", () => {
    expect(isWithinDir("/home", "/home")).toBe(true);
    expect(isWithinDir("/home", "/homeuser")).toBe(false);
  });
});
