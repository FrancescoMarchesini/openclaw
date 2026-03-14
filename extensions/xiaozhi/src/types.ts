import type { IncomingMessage } from "node:http";
import type { WebSocket } from "ws";
import type { XiaozhuConfig } from "./config.js";

export type { XiaozhuConfig };

export type XiaozhuRuntime = {
  bridge: import("./bridge.js").XiaozhiBridge;
  config: XiaozhuConfig;
  stop: () => Promise<void>;
};

/** Represents a connected ESP32-S3-BOX-3 device session. */
export type DeviceSession = {
  id: string;
  ws: WebSocket;
  req: IncomingMessage;
  connectedAt: number;
  deviceId?: string;
};

/** XiaoZhi protocol message (JSON envelope). */
export type XiaozhuMessage = {
  type: string;
  sessionId?: string;
  payload?: unknown;
};
