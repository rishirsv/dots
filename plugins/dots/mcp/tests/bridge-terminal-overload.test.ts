import { expect, test } from "bun:test";
import { bridgeToResponsesSSE, buildResponseJSON } from "../src/bridge";
import { AdapterEventOverloadError, AsyncEventQueue } from "../src/event-queue";
import type { AdapterEvent } from "../src/types";
import { defaultConfig } from "../src/config";
import { responseRequest } from "../src/server";

async function stream(events: AdapterEvent[], compaction = false) {
  const body = await new Response(bridgeToResponsesSSE((async function* () { yield* events; })(),
    "chatgpt-web/pro", undefined, undefined, undefined, undefined, 2_000, { compaction })).text();
  const terminal = body.split("\n\n").filter(frame => /event: response\.(completed|incomplete|failed)/.test(frame));
  return terminal.map(frame => JSON.parse(frame.split("data: ")[1]!));
}

test("batch and SSE reject EOF and filtered or max-output termination alike", async () => {
  for (const [events, reason] of [
    [[], "adapter_eof"],
    [[{ type: "text_delta", text: "partial" }], "adapter_eof"],
    [[{ type: "text_delta", text: "partial" }, { type: "done", stopReason: "content_filter" }], "content_filter"],
    [[{ type: "text_delta", text: "partial" }, { type: "done", stopReason: "max_tokens" }], "max_output_tokens"],
  ] as Array<[AdapterEvent[], string]>) {
    const batch = buildResponseJSON(events, "chatgpt-web/pro");
    const frames = await stream(events);
    expect(batch.status).toBe("incomplete");
    expect((batch.incomplete_details as { reason: string }).reason).toBe(reason);
    expect(frames).toHaveLength(1);
    expect(frames[0].response.status).toBe("incomplete");
    expect(frames[0].response.incomplete_details.reason).toBe(reason);
  }
});

test("first terminal wins and only a complete nonempty summary creates compaction", async () => {
  for (const events of [
    [{ type: "text_delta", text: "partial" }, { type: "done", stopReason: "content_filter" }, { type: "done" }],
    [{ type: "text_delta", text: "partial" }],
  ] as AdapterEvent[][]) {
    const batch = buildResponseJSON(events, "chatgpt-web/pro", { compaction: true });
    expect(batch.status).toBe("incomplete");
    expect(batch.output).not.toContainEqual(expect.objectContaining({ type: "compaction" }));
    const frames = await stream(events, true);
    expect(frames).toHaveLength(1);
    expect(frames[0].response.status).toBe("incomplete");
  }
  const empty = buildResponseJSON([{ type: "done" }], "chatgpt-web/pro", { compaction: true });
  expect(empty.status).toBe("incomplete");
  expect(empty.output).toEqual([]);
  expect((await stream([{ type: "done" }], true))[0].response.status).toBe("incomplete");
  const completed = buildResponseJSON([
    { type: "tool_call_start", id: "call", name: "execute" }, { type: "tool_call_end" }, { type: "done", endTurn: false },
    { type: "error", message: "late" },
  ], "chatgpt-web/pro");
  expect(completed.status).toBe("completed");
  expect(completed.end_turn).toBe(false);
  expect((completed.output as Array<{ type: string }>).map(item => item.type)).toEqual(["function_call"]);
});

test("queue bounds entries and bytes with one explicit terminal failure", async () => {
  for (const queue of [new AsyncEventQueue<string>(1, 100), new AsyncEventQueue<string>(10, 5)]) {
    queue.push("one");
    expect(() => queue.push("two")).toThrow(AdapterEventOverloadError);
    expect(await queue[Symbol.asyncIterator]().next()).toEqual({ value: "one", done: false });
    await expect(queue[Symbol.asyncIterator]().next()).rejects.toMatchObject({ code: "adapter_event_overload" });
  }
  const waiting = new AsyncEventQueue<string>(10, 5);
  const next = waiting[Symbol.asyncIterator]().next();
  expect(() => waiting.push("too large")).toThrow(AdapterEventOverloadError);
  await expect(next).rejects.toMatchObject({ code: "adapter_event_overload" });
});

test("stream queue overflow reports exactly one typed failure without an unhandled producer rejection", async () => {
  const queue = new AsyncEventQueue<AdapterEvent>(1, 100);
  queue.push({ type: "text_delta", text: "first" });
  expect(() => queue.push({ type: "text_delta", text: "second" })).toThrow(AdapterEventOverloadError);
  const body = await new Response(bridgeToResponsesSSE(queue, "chatgpt-web/pro")).text();
  const failures = body.split("event: response.failed");
  expect(failures).toHaveLength(2);
  expect(body).not.toContain("event: response.completed");
  expect(body).toContain('"code":"adapter_event_overload"');
});

test("batch collection drains producer yields and caps accumulated bytes", async () => {
  const queue = new AsyncEventQueue<string>(2, 100);
  const collection = queue.collect(1_000);
  const producer = (async () => {
    for (let i = 0; i < 100; i++) {
      queue.push(String(i));
      await Promise.resolve();
    }
    queue.close();
  })();
  expect(await collection).toEqual(Array.from({ length: 100 }, (_, i) => String(i)));
  await producer;
  const oversized = new AsyncEventQueue<string>(10, 100);
  const bounded = oversized.collect(5);
  oversized.push("one");
  oversized.push("two");
  await expect(bounded).rejects.toMatchObject({ code: "adapter_event_overload" });
});

test("batch response drains over ten thousand adapter events during production", async () => {
  const config = defaultConfig();
  config.proAvailable = true;
  const response = await responseRequest(new Request("http://127.0.0.1/v1/responses", {
    method: "POST", body: JSON.stringify({
      model: "chatgpt-web/pro", stream: false,
      input: [{ type: "message", role: "user", content: [{ type: "input_text", text: "Count" }] }],
      client_metadata: { "x-codex-turn-metadata": JSON.stringify({ thread_id: "batch_queue", turn_id: "batch_queue_turn" }) },
    }),
  }), config, () => ({
    name: "batch-event-producer",
    async runTurn(_parsed, _request, emit) {
      for (let i = 0; i < 10_050; i++) {
        emit({ type: "text_delta", text: "." });
        await Promise.resolve();
      }
      emit({ type: "done", endTurn: true });
    },
  }), { rememberState: false });
  const body = await response.json() as { status: string; output: Array<{ content: Array<{ text: string }> }> };
  expect(body.status).toBe("completed");
  expect(body.output[0]?.content[0]?.text.length).toBe(10_050);
});
