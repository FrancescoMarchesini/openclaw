import type { XiaozhuMessage } from "./types.js";

/**
 * Parse a raw WebSocket message from a XiaoZhi device.
 * TODO: implement full XiaoZhi protocol framing (Phase 2).
 */
export function parseMessage(data: string | Buffer): XiaozhuMessage {
  const text = typeof data === "string" ? data : data.toString("utf8");
  // TODO: validate against XiaoZhi protocol schema
  return JSON.parse(text) as XiaozhuMessage;
}

/**
 * Build the initial hello frame sent to a connecting device.
 * TODO: fill in protocol fields (Phase 2).
 */
export function buildHello(sessionId: string): string {
  return JSON.stringify({ type: "hello", sessionId });
}
