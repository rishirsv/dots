import { describe, expect, test } from "bun:test";
import { defaultConfig } from "../src/config";
import { augmentNativeModelCatalog } from "../src/model-catalog";

function source(): Record<string, unknown> {
  return { models: [{
    slug: "gpt-5.6-sol",
    display_name: "5.6 Sol",
    description: "native",
    priority: 2,
    visibility: "list",
    supported_in_api: true,
    multi_agent_version: "v2",
    supported_reasoning_levels: [{ effort: "ultra", description: "Ultra" }],
    tool_mode: "code_mode_only",
    context_window: 300_000,
    max_context_window: 320_000,
    auto_compact_token_limit: 270_000,
  }] };
}

describe("Portal model catalog", () => {
  test("preserves native models and appends fixed Web thinking levels", () => {
    const config = defaultConfig();
    config.solAvailable = true;
    config.proAvailable = true;
    const models = augmentNativeModelCatalog(source(), config).models as Array<Record<string, unknown>>;
    expect(models.map(model => model.slug)).toEqual([
      "gpt-5.6-sol", "chatgpt-web/light", "chatgpt-web/medium", "chatgpt-web/high", "chatgpt-web/pro",
    ]);
    expect(models[1]).toMatchObject({
      display_name: "ChatGPT Web — Instant",
      default_reasoning_level: "low",
      supported_in_api: true,
      tool_mode: null,
    });
    expect(models[4]).toMatchObject({
      display_name: "ChatGPT Web — Pro",
      default_reasoning_level: "ultra",
      supported_in_api: true,
      tool_mode: null,
    });
  });

  test("preserves native passthrough while advertising verified non-Pro routes", () => {
    const config = defaultConfig();
    config.solAvailable = true;
    config.proAvailable = false;
    const models = augmentNativeModelCatalog(source(), config).models as Array<Record<string, unknown>>;
    expect(models.map(model => model.slug)).toEqual([
      "gpt-5.6-sol", "chatgpt-web/light", "chatgpt-web/medium", "chatgpt-web/high",
    ]);
  });
});
