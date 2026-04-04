import { describe, expect, it, vi, afterEach } from "vitest";
import {
  registerAgentRunContext,
  getAgentRunContext,
  clearAgentRunContext,
  resetAgentRunContextForTest,
  emitAgentEvent,
  onAgentEvent,
  resetAgentEventsForTest,
} from "./agent-events.js";

afterEach(() => {
  resetAgentRunContextForTest();
  resetAgentEventsForTest();
});

describe("registerAgentRunContext", () => {
  it("registers context for run", () => {
    registerAgentRunContext("run-1", { sessionKey: "session-1" });
    expect(getAgentRunContext("run-1")).toBeDefined();
  });

  it("ignores empty runId", () => {
    registerAgentRunContext("", { sessionKey: "session-1" });
    expect(getAgentRunContext("")).toBeUndefined();
  });

  it("merges context updates", () => {
    registerAgentRunContext("run-1", { sessionKey: "session-1" });
    registerAgentRunContext("run-1", { verboseLevel: 1 });
    const context = getAgentRunContext("run-1");
    expect(context?.sessionKey).toBe("session-1");
    expect(context?.verboseLevel).toBe(1);
  });
});

describe("clearAgentRunContext", () => {
  it("removes context for run", () => {
    registerAgentRunContext("run-1", { sessionKey: "session-1" });
    clearAgentRunContext("run-1");
    expect(getAgentRunContext("run-1")).toBeUndefined();
  });
});

describe("emitAgentEvent", () => {
  it("emits event with seq and ts", () => {
    const received: any[] = [];
    onAgentEvent((evt) => received.push(evt));
    emitAgentEvent({ runId: "run-1", stream: "test", data: {} });
    expect(received.length).toBe(1);
    expect(received[0].seq).toBe(1);
    expect(received[0].ts).toBeDefined();
  });

  it("increments seq for same run", () => {
    const received: any[] = [];
    onAgentEvent((evt) => received.push(evt));
    emitAgentEvent({ runId: "run-1", stream: "test", data: {} });
    emitAgentEvent({ runId: "run-1", stream: "test", data: {} });
    expect(received[0].seq).toBe(1);
    expect(received[1].seq).toBe(2);
  });
});

describe("onAgentEvent", () => {
  it("registers listener and returns unsubscribe", () => {
    const received: any[] = [];
    const unsubscribe = onAgentEvent((evt) => received.push(evt));
    emitAgentEvent({ runId: "run-1", stream: "test", data: {} });
    expect(received.length).toBe(1);
    unsubscribe();
    emitAgentEvent({ runId: "run-1", stream: "test", data: {} });
    expect(received.length).toBe(1);
  });
});
