import { describe, expect, it } from "vitest";
import {
  shouldAckReaction,
  shouldAckReactionForWhatsApp,
} from "./ack-reactions.js";

describe("shouldAckReaction", () => {
  it("returns false for off/none scope", () => {
    expect(shouldAckReaction({ scope: "off", isDirect: true, isGroup: false, isMentionableGroup: false, requireMention: false, canDetectMention: false, effectiveWasMentioned: false })).toBe(false);
    expect(shouldAckReaction({ scope: "none", isDirect: true, isGroup: false, isMentionableGroup: false, requireMention: false, canDetectMention: false, effectiveWasMentioned: false })).toBe(false);
  });

  it("returns true for all scope", () => {
    expect(shouldAckReaction({ scope: "all", isDirect: false, isGroup: false, isMentionableGroup: false, requireMention: false, canDetectMention: false, effectiveWasMentioned: false })).toBe(true);
  });

  it("returns true for direct scope when isDirect", () => {
    expect(shouldAckReaction({ scope: "direct", isDirect: true, isGroup: false, isMentionableGroup: false, requireMention: false, canDetectMention: false, effectiveWasMentioned: false })).toBe(true);
  });

  it("returns false for direct scope when not isDirect", () => {
    expect(shouldAckReaction({ scope: "direct", isDirect: false, isGroup: false, isMentionableGroup: false, requireMention: false, canDetectMention: false, effectiveWasMentioned: false })).toBe(false);
  });

  it("returns true for group-all scope when isGroup", () => {
    expect(shouldAckReaction({ scope: "group-all", isDirect: false, isGroup: true, isMentionableGroup: true, requireMention: false, canDetectMention: false, effectiveWasMentioned: false })).toBe(true);
  });

  it("handles group-mentions scope", () => {
    // not mentionable group
    expect(shouldAckReaction({ scope: "group-mentions", isDirect: false, isGroup: true, isMentionableGroup: false, requireMention: true, canDetectMention: true, effectiveWasMentioned: true })).toBe(false);
    // mentionable but no mention detected
    expect(shouldAckReaction({ scope: "group-mentions", isDirect: false, isGroup: true, isMentionableGroup: true, requireMention: true, canDetectMention: true, effectiveWasMentioned: false })).toBe(false);
    // mention detected
    expect(shouldAckReaction({ scope: "group-mentions", isDirect: false, isGroup: true, isMentionableGroup: true, requireMention: true, canDetectMention: true, effectiveWasMentioned: true })).toBe(true);
    // bypass
    expect(shouldAckReaction({ scope: "group-mentions", isDirect: false, isGroup: true, isMentionableGroup: true, requireMention: true, canDetectMention: true, effectiveWasMentioned: false, shouldBypassMention: true })).toBe(true);
  });
});

describe("shouldAckReactionForWhatsApp", () => {
  it("returns false for empty emoji", () => {
    expect(shouldAckReactionForWhatsApp({ emoji: "", isDirect: true, isGroup: false, directEnabled: true, groupMode: "never", wasMentioned: false, groupActivated: false })).toBe(false);
  });

  it("returns directEnabled for direct messages", () => {
    expect(shouldAckReactionForWhatsApp({ emoji: "👍", isDirect: true, isGroup: false, directEnabled: true, groupMode: "never", wasMentioned: false, groupActivated: false })).toBe(true);
    expect(shouldAckReactionForWhatsApp({ emoji: "👍", isDirect: true, isGroup: false, directEnabled: false, groupMode: "never", wasMentioned: false, groupActivated: false })).toBe(false);
  });

  it("returns false for never group mode", () => {
    expect(shouldAckReactionForWhatsApp({ emoji: "👍", isDirect: false, isGroup: true, directEnabled: true, groupMode: "never", wasMentioned: true, groupActivated: true })).toBe(false);
  });

  it("returns true for always group mode", () => {
    expect(shouldAckReactionForWhatsApp({ emoji: "👍", isDirect: false, isGroup: true, directEnabled: false, groupMode: "always", wasMentioned: false, groupActivated: false })).toBe(true);
  });

  it("delegates to shouldAckReaction for mentions mode", () => {
    expect(shouldAckReactionForWhatsApp({ emoji: "👍", isDirect: false, isGroup: true, directEnabled: false, groupMode: "mentions", wasMentioned: true, groupActivated: true })).toBe(true);
  });
});
