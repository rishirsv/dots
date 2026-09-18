import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import {
  chatGptExecutionErrorCode,
  chatGptExecutionReference,
  emitChatGptExecutionEvidence,
} from "./turn-execution";

/** Content-free receipt/reply observations. A sent MCP result is not proof of tool execution. */
export function observeMcpToolCalls(
  transport: Transport,
  knownTools: ReadonlySet<string>,
  write: (event: Record<string, unknown>) => void = event => console.error(`[chatgpt-web-mcp] transport=${JSON.stringify(event)}`),
): Transport {
  let sequence = 0;
  const pending = new Map<string | number, {
    call: number;
    tool: string;
    started: number;
    requestRef: string;
  } | null>();
  const emit = (event: Record<string, unknown>) => {
    // Logging is observational: a broken sink cannot change the invocation or its result.
    try { write({ pid: process.pid, ...event }); } catch { /* Preserve transport semantics. */ }
  };
  const evidence = (event: Parameters<typeof emitChatGptExecutionEvidence>[0]): void => {
    emitChatGptExecutionEvidence(event, value => write({ ...value }));
  };
  const receive = transport.onmessage;
  transport.onmessage = (message, extra) => {
    if ("method" in message && message.method === "tools/call" && "id" in message) {
      const name = message.params?.name;
      const tool = typeof name === "string" && knownTools.has(name) ? name : "unknown";
      const requestRef = chatGptExecutionReference(message.id);
      if (pending.has(message.id)) {
        // An ambiguous protocol ID cannot safely correlate either reply.
        pending.set(message.id, null);
        emit({
          event: "uncorrelated_call",
          reason: "duplicate_id",
          tool,
          mcp_request_ref: requestRef,
          stage: "unknown",
          outcome: "unknown",
          execution_proven: false,
          retry_guidance: "do_not_retry",
        });
        evidence({
          stage: "unknown",
          outcome: "unknown",
          mcp_request_ref: requestRef,
          tool,
          execution_proven: false,
          retry_guidance: "do_not_retry",
        });
      } else if (pending.size >= 1_024) {
        emit({
          event: "uncorrelated_call",
          reason: "tracking_limit",
          tool,
          mcp_request_ref: requestRef,
          stage: "unknown",
          outcome: "unknown",
          execution_proven: false,
          retry_guidance: "unknown",
        });
        evidence({
          stage: "unknown",
          outcome: "unknown",
          mcp_request_ref: requestRef,
          tool,
          execution_proven: false,
          retry_guidance: "unknown",
        });
      } else {
        const call = { call: ++sequence, tool, started: performance.now(), requestRef };
        pending.set(message.id, call);
        emit({
          event: "call_received",
          call: call.call,
          tool,
          mcp_request_ref: requestRef,
          stage: "receipt",
          outcome: "accepted",
          execution_proven: false,
          retry_guidance: "unknown",
        });
        evidence({
          stage: "receipt",
          outcome: "accepted",
          mcp_request_ref: requestRef,
          tool,
          execution_proven: false,
          retry_guidance: "unknown",
        });
      }
    }
    receive?.(message, extra);
  };
  const send = transport.send.bind(transport);
  transport.send = async (message, options) => {
    const id = "id" in message ? message.id : undefined;
    const call = id !== undefined && id !== null && !("method" in message) ? pending.get(id) : undefined;
    try {
      await send(message, options);
      if (call) {
        const result = "result" in message ? message.result : undefined;
        const elapsed = Math.round(performance.now() - call.started);
        emit({
          event: "reply_sent",
          call: call.call,
          tool: call.tool,
          mcp_request_ref: call.requestRef,
          stage: "reply_delivery",
          outcome: "delivered",
          execution_proven: false,
          retry_guidance: "unknown",
          elapsed_ms: elapsed,
          ...("result" in message ? { is_error: result?.isError === true } : {}),
        });
        evidence({
          stage: "reply_delivery",
          outcome: "delivered",
          mcp_request_ref: call.requestRef,
          tool: call.tool,
          elapsed_ms: elapsed,
          execution_proven: false,
          retry_guidance: "unknown",
        });
      }
    } catch (error) {
      if (call) {
        const elapsed = Math.round(performance.now() - call.started);
        emit({
          event: "reply_send_failed",
          call: call.call,
          tool: call.tool,
          mcp_request_ref: call.requestRef,
          stage: "reply_delivery",
          outcome: "failed",
          execution_proven: false,
          retry_guidance: "do_not_retry",
          elapsed_ms: elapsed,
          error_code: chatGptExecutionErrorCode(error),
        });
        evidence({
          stage: "reply_delivery",
          outcome: "failed",
          mcp_request_ref: call.requestRef,
          tool: call.tool,
          elapsed_ms: elapsed,
          error_code: chatGptExecutionErrorCode(error),
          execution_proven: false,
          retry_guidance: "do_not_retry",
        });
      }
      throw error;
    } finally {
      if (call && id !== undefined && id !== null) pending.delete(id);
    }
  };
  const close = transport.onclose;
  transport.onclose = () => {
    if (pending.size) {
      emit({
        event: "transport_closed",
        tracked_calls: pending.size,
        stage: "unknown",
        outcome: "unknown",
        error_code: "mcp_transport_closed",
        execution_proven: false,
        retry_guidance: "do_not_retry",
      });
      evidence({
        stage: "unknown",
        outcome: "unknown",
        error_code: "mcp_transport_closed",
        execution_proven: false,
        retry_guidance: "do_not_retry",
      });
    }
    pending.clear();
    close?.();
  };
  return transport;
}
