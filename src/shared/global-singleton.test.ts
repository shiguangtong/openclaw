import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { resolveGlobalSingleton, resolveGlobalMap } from "./global-singleton.js";

describe("resolveGlobalSingleton", () => {
  const testKey = Symbol.for("test.singleton." + Math.random());

  afterEach(() => {
    delete (globalThis as any)[testKey];
  });

  it("creates singleton on first call", () => {
    const value = { created: true };
    const result = resolveGlobalSingleton(testKey, () => value);
    expect(result).toBe(value);
  });

  it("returns same instance on subsequent calls", () => {
    const value = { id: 1 };
    const first = resolveGlobalSingleton(testKey, () => value);
    const second = resolveGlobalSingleton(testKey, () => ({ id: 2 }));
    expect(first).toBe(second);
    expect(first).toEqual({ id: 1 });
  });

  it("creates instances with factory function", () => {
    let createCount = 0;
    const factory = () => { createCount++; return { count: createCount }; };
    resolveGlobalSingleton(testKey, factory);
    resolveGlobalSingleton(testKey, factory);
    expect(createCount).toBe(1);
  });
});

describe("resolveGlobalMap", () => {
  const testKey = Symbol.for("test.map." + Math.random());

  afterEach(() => {
    delete (globalThis as any)[testKey];
  });

  it("creates map on first call", () => {
    const result = resolveGlobalMap<number, string>(testKey);
    result.set(1, "one");
    expect(result.get(1)).toBe("one");
  });

  it("returns same map on subsequent calls", () => {
    const first = resolveGlobalMap<number, string>(testKey);
    const second = resolveGlobalMap<number, string>(testKey);
    expect(first).toBe(second);
  });

  it("persists values between calls", () => {
    const map = resolveGlobalMap<string, number>(testKey);
    map.set("key", 42);
    const result = resolveGlobalMap<string, number>(testKey);
    expect(result.get("key")).toBe(42);
  });
});
