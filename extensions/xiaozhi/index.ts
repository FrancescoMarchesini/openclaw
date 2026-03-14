import type { GatewayRequestHandlerOptions, OpenClawPluginApi } from "openclaw/plugin-sdk";
import { XiaozhiBridge } from "./src/bridge.js";
import { parseXiaozhuConfig, type XiaozhuConfig } from "./src/config.js";
import { handleOtaRequest } from "./src/ota.js";
import type { XiaozhuRuntime } from "./src/types.js";

const xiaozhiConfigSchema = {
  parse(value: unknown): XiaozhuConfig {
    return parseXiaozhuConfig(value);
  },
};

const xiaozhiPlugin = {
  id: "xiaozhi",
  name: "XiaoZhi",
  description: "Bridge between XiaoZhi ESP32-S3-BOX-3 firmware and the OpenClaw agent loop",
  configSchema: xiaozhiConfigSchema,
  register(api: OpenClawPluginApi) {
    const config = xiaozhiConfigSchema.parse(api.pluginConfig);

    let runtimePromise: Promise<XiaozhuRuntime> | null = null;
    let runtime: XiaozhuRuntime | null = null;

    const ensureRuntime = async (): Promise<XiaozhuRuntime> => {
      if (!config.enabled) {
        throw new Error("xiaozhi disabled in plugin config");
      }
      if (runtime) {
        return runtime;
      }
      if (!runtimePromise) {
        runtimePromise = (async () => {
          const bridge = new XiaozhiBridge();
          const rt: XiaozhuRuntime = {
            bridge,
            config,
            stop: async () => {
              await bridge.stop();
            },
          };
          return rt;
        })();
      }
      runtime = await runtimePromise;
      return runtime;
    };

    // OTA endpoint — stub (501 Not Implemented)
    api.registerHttpRoute({
      path: config.otaPath,
      handler(req, res) {
        handleOtaRequest(req, res, config);
      },
    });

    // Gateway method stub
    api.registerGatewayMethod(
      "xiaozhi.status",
      async ({ respond }: GatewayRequestHandlerOptions) => {
        try {
          const rt = runtime;
          respond(true, {
            enabled: config.enabled,
            wsPath: config.wsPath,
            otaPath: config.otaPath,
            sessions: rt ? "bridge running" : "not started",
          });
        } catch (err) {
          respond(false, { error: err instanceof Error ? err.message : String(err) });
        }
      },
    );

    // Service lifecycle
    api.registerService({
      id: "xiaozhi",
      start: async () => {
        if (!config.enabled) {
          return;
        }
        try {
          await ensureRuntime();
        } catch (err) {
          api.logger.error(
            `[xiaozhi] Failed to start runtime: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      },
      stop: async () => {
        if (!runtimePromise) {
          return;
        }
        try {
          const rt = await runtimePromise;
          await rt.stop();
        } finally {
          runtimePromise = null;
          runtime = null;
        }
      },
    });
  },
};

export default xiaozhiPlugin;
