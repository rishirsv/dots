import { expect, test } from "bun:test";
import { defaultConfig } from "../src/config";
import { modelsRequest } from "../src/server";

const nativeModel = {
  slug: "gpt-5.6-sol", display_name: "5.6 Sol", priority: 1,
  visibility: "list", supported_in_api: true, multi_agent_version: "v2",
  supported_reasoning_levels: [{ effort: "ultra", description: "Ultra" }],
  tool_mode: "code_mode_only", context_window: 300_000,
  max_context_window: 320_000, auto_compact_token_limit: 270_000,
};

test("proxies native models and appends only ChatGPT Web Pro", async () => {
  const request = new Request("http://127.0.0.1:17841/v1/models?client_version=1.2.3", {
    headers: { authorization: "Bearer codex-oauth-token", "if-none-match": "native-etag" },
  });
  const config = defaultConfig("full");
  config.subagentProtocol = "native";
  config.proAvailable = true;
  let upstream: Request | undefined;
  const response = await modelsRequest(request, config, async input => {
    upstream = input;
    return Response.json({ models: [nativeModel] }, { headers: { etag: "native-etag" } });
  }, () => ({ contextWindow: 371_851 }));
  expect(upstream!.url).toBe("https://chatgpt.com/backend-api/codex/models?client_version=1.2.3");
  expect(upstream!.headers.get("authorization")).toBe("Bearer codex-oauth-token");
  expect(upstream!.headers.get("if-none-match")).toBeNull();
  expect(response.headers.get("etag")).not.toBe("native-etag");
  const body = await response.json() as { models: Array<Record<string, unknown>> };
  expect(body.models.map(model => model.slug)).toEqual(["gpt-5.6-sol", "chatgpt-web/pro"]);
  expect(body.models[0]).toMatchObject({ max_context_window: 371_851, multi_agent_version: "v2" });
  expect(body.models[1]).toMatchObject({
    display_name: "ChatGPT Web — Pro", default_reasoning_level: "ultra",
    supported_in_api: true, tool_mode: null, multi_agent_version: "v2",
  });
});
