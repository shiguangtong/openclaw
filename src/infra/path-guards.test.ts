import { describe, expect, it } from "vitest";
import {
  normalizeWindowsPathForComparison,
  isNodeError,
  hasNodeErrorCode,
  isNotFoundPathError,
  isSymlinkOpenError,
  isPathInside,
} from "./path-guards.js";

describe("normalizeWindowsPathForComparison", () => {
  it("normalizes Windows paths", () => {
    expect(normalizeWindowsPathForComparison("C:\\Users\\test")).toBe("c:\\users\\test");
    expect(normalizeWindowsPathForComparison("C:/Users/test")).toBe("c:\\users\\test");
  });

  it("normalizes UNC paths", () => {
    const result = normalizeWindowsPathForComparison("\\\\server\\share");
    expect(result).toBe("\\\\server\\share");
  });
});

describe("isNodeError", () => {
  it("returns true for Node.js errors", () => {
    expect(isNodeError(new Error("test"))).toBe(false);
    expect(isNodeError({ code: "ENOENT" })).toBe(true);
    expect(isNodeError({})).toBe(false);
  });

  it("returns false for non-objects", () => {
    expect(isNodeError("string")).toBe(false);
    expect(isNodeError(null)).toBe(false);
    expect(isNodeError(undefined)).toBe(false);
  });
});

describe("hasNodeErrorCode", () => {
  it("checks error code", () => {
    const err = new Error("test") as NodeJS.ErrnoException;
    err.code = "ENOENT";
    expect(hasNodeErrorCode(err, "ENOENT")).toBe(true);
    expect(hasNodeErrorCode(err, "OTHER")).toBe(false);
  });
});

describe("isNotFoundPathError", () => {
  it("detects ENOENT errors", () => {
    const err = { code: "ENOENT" } as NodeJS.ErrnoException;
    expect(isNotFoundPathError(err)).toBe(true);
  });

  it("detects ENOTDIR errors", () => {
    const err = { code: "ENOTDIR" } as NodeJS.ErrnoException;
    expect(isNotFoundPathError(err)).toBe(true);
  });

  it("returns false for other errors", () => {
    expect(isNotFoundPathError({ code: "EPERM" })).toBe(false);
  });
});

describe("isSymlinkOpenError", () => {
  it("detects symlink-related errors", () => {
    expect(isSymlinkOpenError({ code: "ELOOP" })).toBe(true);
    expect(isSymlinkOpenError({ code: "EINVAL" })).toBe(true);
    expect(isSymlinkOpenError({ code: "ENOTSUP" })).toBe(true);
  });

  it("returns false for other errors", () => {
    expect(isSymlinkOpenError({ code: "ENOENT" })).toBe(false);
  });
});

describe("isPathInside", () => {
  it("returns true for paths inside directory", () => {
    expect(isPathInside("/home/user", "/home/user/file.txt")).toBe(true);
  });

  it("returns false for paths outside directory", () => {
    expect(isPathInside("/home/user", "/home/other/file.txt")).toBe(false);
  });

  it("handles same path", () => {
    expect(isPathInside("/home/user", "/home/user")).toBe(true);
  });

  it("handles parent directory traversal", () => {
    expect(isPathInside("/home/user", "/home/user/../other")).toBe(false);
  });
});
