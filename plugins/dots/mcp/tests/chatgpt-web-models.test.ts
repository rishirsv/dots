import { describe, expect, test } from "bun:test";
import {
  availableChatGptWebModelRoutes,
  CHATGPT_WEB_BACKEND_MODEL,
  requireChatGptWebModelRoute,
  resolveChatGptWebContextLimits,
} from "../src/chatgpt-web-models";
import { defaultConfig } from "../src/config";
import { routeChatGptWebRequest } from "../src/server";
import type { CodexParsedRequest } from "../src/types";

function request(modelId: string): CodexParsedRequest {
  return { modelId, context: { messages: [] }, stream: false, options: { reasoning: "low" } };
}

describe("Portal model route", () => {
  test("exposes fixed Sol modes without consuming Pro eligibility", () => {
    expect(availableChatGptWebModelRoutes({ solAvailable: false, proAvailable: false })).toEqual([]);
    expect(availableChatGptWebModelRoutes({ solAvailable: true, proAvailable: false })
      .map(route => route.slug)).toEqual(["chatgpt-web/light", "chatgpt-web/medium", "chatgpt-web/high"]);
    expect(availableChatGptWebModelRoutes({ solAvailable: true, extraHighAvailable: true, proAvailable: true })
      .map(route => [route.slug, route.displayName]))
      .toEqual([
        ["chatgpt-web/light", "ChatGPT Web — Instant"],
        ["chatgpt-web/medium", "ChatGPT Web — Medium"],
        ["chatgpt-web/high", "ChatGPT Web — High"],
        ["chatgpt-web/extra-high", "ChatGPT Web — Extra High"],
        ["chatgpt-web/pro", "ChatGPT Web — Pro"],
      ]);
  });

  test.each([
    ["chatgpt-web/light", "low"],
    ["chatgpt-web/medium", "medium"],
    ["chatgpt-web/high", "high"],
    ["chatgpt-web/extra-high", "xhigh"],
  ] as const)("routes %s to its fixed non-Pro effort", (slug, effort) => {
    const config = defaultConfig();
    config.solAvailable = true;
    config.extraHighAvailable = true;
    const parsed = request(slug);
    const route = routeChatGptWebRequest(parsed, config);
    expect(route.backendModel).toBe(CHATGPT_WEB_BACKEND_MODEL);
    expect(route.adapterEffort).toBe(effort);
    expect(parsed.options.reasoning).toBe(effort);
  });

  test("routes Pro to the authoritative browser Pro effort", () => {
    const config = defaultConfig();
    config.solAvailable = true;
    config.proAvailable = true;
    const parsed = request("chatgpt-web/pro");
    const route = routeChatGptWebRequest(parsed, config);
    expect(route.backendModel).toBe(CHATGPT_WEB_BACKEND_MODEL);
    expect(route.adapterEffort).toBe("max");
    expect(parsed.options.reasoning).toBe("max");
    expect(resolveChatGptWebContextLimits(route.backendModel, route.adapterEffort, config).autoCompactTokenLimit)
      .toBe(95_000);
  });

  test("fails closed for unavailable routes", () => {
    expect(() => requireChatGptWebModelRoute("chatgpt-web/pro", { solAvailable: true, proAvailable: false }))
      .toThrow("not available");
    expect(() => requireChatGptWebModelRoute("chatgpt-web/extra-high", { solAvailable: true, proAvailable: true }))
      .toThrow("not available");
    expect(() => requireChatGptWebModelRoute("chatgpt-web/high", { solAvailable: false, proAvailable: true }))
      .toThrow("without GPT-5.6 Sol");
  });
});
