import type { IncomingMessage, ServerResponse } from "node:http";
import type { XiaozhuConfig } from "./config.js";

/**
 * Handle OTA firmware update requests from XiaoZhi devices.
 * TODO: implement OTA token validation and firmware dispatch (Phase 2).
 */
export function handleOtaRequest(
  req: IncomingMessage,
  res: ServerResponse,
  config: XiaozhuConfig,
): void {
  void req;
  void config;
  res.writeHead(501, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Implemented" }));
}
