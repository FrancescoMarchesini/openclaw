import { z } from "zod";

export const XiaozhuConfigSchema = z
  .object({
    enabled: z.boolean().default(true),
    /** HMAC-SHA256 key for OTA token authentication */
    secret: z.string().optional(),
    /** WebSocket path for device connections */
    wsPath: z.string().default("/xiaozhi/v1/"),
    /** HTTP path for OTA endpoint */
    otaPath: z.string().default("/xiaozhi/ota/"),
  })
  .strict();

export type XiaozhuConfig = z.infer<typeof XiaozhuConfigSchema>;

export function parseXiaozhuConfig(value: unknown): XiaozhuConfig {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return XiaozhuConfigSchema.parse(raw);
}
