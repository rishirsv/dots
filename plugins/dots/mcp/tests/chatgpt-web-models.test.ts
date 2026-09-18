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
  test("exposes only ChatGPT Web Pro when the account proves it is available", () => {
    expect(availableChatGptWebModelRoutes({ solAvailable: true, proAvailable: false })).toEqual([]);
    expect(availableChatGptWebModelRoutes({ solAvailable: true, proAvailable: true })
      .map(route => [route.slug, route.displayName]))
      .toEqual([["chatgpt-web/pro", "ChatGPT Web — Pro"]]);
  });

  test("routes Pro to the authoritative browser Pro effort", () => {
    const config = defaultConfig();
    config.proAvailable = true;
    const parsed = request("chatgpt-web/pro");
    const route = routeChatGptWebRequest(parsed, config);
    expect(route.backendModel).toBe(CHATGPT_WEB_BACKEND_MODEL);
    expect(route.adapterEffort).toBe("max");
    expect(parsed.options.reasoning).toBe("max");
    expect(resolveChatGptWebContextLimits(route.backendModel, route.adapterEffort, config).autoCompactTokenLimit)
      .toBe(95_000);
  });

  test("fails closed for unavailable and alternate Web routes", () => {
    expect(() => requireChatGptWebModelRoute("chatgpt-web/pro", { solAvailable: true, proAvailable: false }))
      .toThrow("not available");
    expect(() => requireChatGptWebModelRoute("chatgpt-web/high", { solAvailable: true, proAvailable: true }))
      .toThrow("only ChatGPT Web — Pro");
  });
});
