# 01 — Piano di Scaffolding: estensione `xiaozhi`

_Data: 2026-03-14_

## Obiettivo

Creare l'estensione `extensions/xiaozhi/` nel repo OpenClaw che fa da bridge tra il firmware XiaoZhi (ESP32-S3-BOX-3) e l'agent loop OpenClaw (LaraGoci AI Companion Device).

## Flusso

```
ESP32 (XiaoZhi firmware)
  --WSS--> OpenClaw Gateway (extensions/xiaozhi bridge)
    --> Agente Claude (sessione main)
```

Il firmware parla protocollo XiaoZhi (7 messaggi JSON + audio Opus binario).
Il bridge traduce: Opus → Whisper STT → agente → TTS → Opus → device.

## File creati nello scaffolding

```
extensions/xiaozhi/
├── openclaw.plugin.json      # manifest plugin
├── package.json              # dipendenze estensione
├── index.ts                  # entry point / registrazione plugin
└── src/
    ├── bridge.ts             # WebSocket bridge (WS upgrade handler)
    ├── protocol.ts           # parser protocollo XiaoZhi
    ├── audio-pipeline.ts     # Opus ↔ PCM, VAD, Whisper STT, TTS
    ├── config.ts             # configurazione estensione
    ├── ota.ts                # endpoint OTA HTTP per aggiornamenti firmware
    └── types.ts              # tipi TypeScript condivisi
```

> **Nota:** `channel.ts` e `tools.ts` non ancora creati — prossimo step.

## Modello architetturale

Studiato `extensions/voice-call/` (Twilio) come riferimento:

- struttura channel plugin
- gestione sessione audio bidirezionale
- integrazione con l'agent loop

## Unica modifica prevista al core

`src/gateway/server-http.ts` → aggiungere path `/xiaozhi/v1/` nel WS upgrade handler.

## Step successivi

1. Completare `src/channel.ts` — Channel plugin "xiaozhi" (come `voice-call/src/channel.ts`)
2. Completare `src/tools.ts` — Tool MCP: `laragoci.speak`, `laragoci.emoji`, `laragoci.volume`
3. Collegare `index.ts` al channel e ai tools
4. Aggiungere path `/xiaozhi/v1/` in `src/gateway/server-http.ts`
5. Test locale con ESP32 fisico
6. Documentazione in `docs/channels/xiaozhi.md`

## Dipendenze da aggiungere

- `ws` — WebSocket server
- `opusscript` o `@discordjs/opus` — codec Opus
- `openai` (Whisper) — già disponibile nel core OpenClaw
