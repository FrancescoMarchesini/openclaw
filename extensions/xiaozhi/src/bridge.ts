import type { IncomingMessage } from "node:http";
import type { WebSocket } from "ws";
import type { DeviceSession } from "./types.js";

/**
 * XiaozhiBridge manages WebSocket connections from ESP32-S3-BOX-3 devices.
 * TODO: implement session tracking and message routing (Phase 2).
 */
export class XiaozhiBridge {
  private sessions = new Map<string, DeviceSession>();

  /** Handle a new incoming WebSocket connection from a device. */
  handleConnection(ws: WebSocket, req: IncomingMessage): void {
    // TODO: authenticate, register session, wire audio pipeline (Phase 2)
    void ws;
    void req;
  }

  /** Gracefully stop the bridge and close all device sessions. */
  async stop(): Promise<void> {
    // TODO: close all sessions (Phase 2)
    this.sessions.clear();
  }
}
