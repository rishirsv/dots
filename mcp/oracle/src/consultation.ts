import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { ToolError } from './errors.js';

const identity = z.string().min(1).max(200);
export function conversationUrl(value: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new ToolError('INVALID_CONVERSATION', 'Use a plain ChatGPT conversation URL.'); }
  if (url.origin !== 'https://chatgpt.com' || !/^\/(?:g\/[^/]+\/)?c\/[^/]+$/.test(url.pathname) || url.username || url.password || url.search || url.hash || value.length > 1000) {
    throw new ToolError('INVALID_CONVERSATION', 'Use a plain https://chatgpt.com/.../c/... conversation URL.');
  }
  return url.href;
}
const canonicalUrl = (url: string) => /\/c\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(url);
export const beginSchema = z.object({ browser_id: identity, tab_id: identity, conversation_url: z.string().optional() }).strict();
export const observationSchema = z.object({
  turn_id: identity, browser_id: identity, tab_id: identity,
  response_state: z.enum(['submitted', 'thinking', 'tool_running', 'finished', 'blocked', 'unknown']),
  observed_at: z.number().int().nonnegative(), conversation_url: z.string().optional()
}).strict();
type Observation = z.infer<typeof observationSchema>;
export class Consultation {
  private current?: Observation & { source: 'browser'; access_epoch: number };
  begin(input: unknown, epoch: number) {
    const data = beginSchema.parse(input);
    this.current = { ...data, ...(data.conversation_url ? { conversation_url: conversationUrl(data.conversation_url) } : {}),
      turn_id: randomUUID(), response_state: 'unknown', observed_at: 0, source: 'browser', access_epoch: epoch };
    return this.status();
  }
  observe(input: unknown, epoch: number, now = Date.now()) {
    const data = observationSchema.parse(input), current = this.current;
    if (!current || data.turn_id !== current.turn_id || data.browser_id !== current.browser_id || data.tab_id !== current.tab_id || current.access_epoch !== epoch) {
      throw new ToolError('STALE_CONSULTATION', 'Observation must match this turn, browser, tab, and handoff epoch.');
    }
    if (data.observed_at <= current.observed_at || data.observed_at > now + 5000 || now - data.observed_at > 60_000) {
      throw new ToolError('STALE_OBSERVATION', 'Use a fresh browser observation with an increasing timestamp.');
    }
    const url = data.conversation_url ? conversationUrl(data.conversation_url) : current.conversation_url;
    if (current.conversation_url && url !== current.conversation_url && (canonicalUrl(current.conversation_url) || !url || !canonicalUrl(url))) {
      throw new ToolError('CONVERSATION_CHANGED', 'Only the same verified tab transitioning from a provisional to a canonical conversation URL may update this turn.');
    }
    this.current = { ...current, ...data, conversation_url: url };
    return this.status(now);
  }
  invalidate() { if (this.current) this.current.observed_at = 0; }
  status(now = Date.now()) {
    if (!this.current) return { response_state: 'unknown' as const, source: 'none' as const };
    const fresh = now - this.current.observed_at <= 60_000;
    return { ...this.current, last_observed_state: this.current.response_state,
      response_state: fresh ? this.current.response_state : 'unknown', fresh,
      url_kind: this.current.conversation_url ? canonicalUrl(this.current.conversation_url) ? 'canonical' : 'provisional' : 'unknown' };
  }
}

/** Local bounded journal. Events contain metadata, never command arguments or output. */
export class Events {
  private entries: { cursor: number; type: string; at: number }[] = [];
  private listeners = new Set<() => void>();
  cursor = 0;
  publish(type: string) {
    this.entries.push({ cursor: ++this.cursor, type, at: Date.now() });
    if (this.entries.length > 128) this.entries.shift();
    for (const wake of this.listeners) wake();
  }
  async wait(after: number, timeout: number, signal?: AbortSignal) {
    if (!Number.isSafeInteger(after) || after < 0 || after > this.cursor || !Number.isSafeInteger(timeout) || timeout < 0 || timeout > 55_000) {
      throw new ToolError('INVALID_CURSOR', 'Use this instance cursor and a timeout from 0 to 55000 ms.');
    }
    if (after === this.cursor && timeout && !signal?.aborted) await new Promise<void>(resolve => {
      const wake = () => { clearTimeout(timer); this.listeners.delete(wake); signal?.removeEventListener('abort', wake); resolve(); };
      const timer = setTimeout(wake, timeout);
      this.listeners.add(wake); signal?.addEventListener('abort', wake, { once: true });
    });
    return { cursor: this.cursor, events: this.entries.filter(event => event.cursor > after),
      cursor_expired: after < (this.entries[0]?.cursor ?? 1) - 1 };
  }
}
