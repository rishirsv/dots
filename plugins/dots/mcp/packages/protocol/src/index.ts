import { createHash, randomUUID } from 'node:crypto';
export * from './schema.js';
export const VERSION = '0.1.0';
export const PROTOCOL_VERSION = 1;
export const ERROR_CODES = ['UNAUTHENTICATED', 'FORBIDDEN', 'DEVICE_OFFLINE', 'DEVICE_REVOKED', 'STALE_CONNECTION', 'WORKSPACE_CLOSED', 'GRANT_EXPIRED', 'GRANT_CHANGED', 'STALE_WRITER', 'WRITER_BUSY', 'WRITER_NOT_QUIESCENT', 'PATH_OUTSIDE_GRANT', 'SYMLINK_REJECTED', 'SOURCE_CHANGED', 'WRITE_CONFLICT', 'IDEMPOTENCY_CONFLICT', 'EXECUTOR_UPGRADE_REQUIRED', 'CAPABILITY_UNAVAILABLE', 'CAPABILITY_CHANGED', 'SKILL_CHANGED', 'RESULT_EXPIRED', 'OUTPUT_TRUNCATED', 'OUTPUT_QUOTA_EXCEEDED', 'APPROVAL_REQUIRED', 'OVERLOADED', 'DISPATCH_DEADLINE_EXCEEDED', 'CANCEL_REQUESTED', 'OUTCOME_UNKNOWN', 'INTERRUPTED_BEFORE_DISPATCH', 'INVALID_ARGUMENT', 'NOT_FOUND', 'IO_ERROR', 'LIMIT_EXCEEDED', 'UNSUPPORTED_FORMAT', 'PARSER_FAILED', 'CODE_FAILED'] as const;
export type ErrorCode = typeof ERROR_CODES[number];
export type State = 'accepted' | 'queued' | 'running' | 'succeeded' | 'failed' | 'cancel_requested' | 'cancelled' | 'interrupted' | 'outcome_unknown';
export type Retry = 'same_key' | 'after_status_check' | 'new_request' | 'never';
export class PortalError extends Error {
    constructor(public code: ErrorCode, message: string, public details: Record<string, unknown> = {}, public retry: Retry = 'new_request') { super(message); this.name = 'PortalError'; }
}
export interface Result<T = unknown> {
    schemaVersion: 1;
    operationId?: string;
    state?: State;
    data?: T;
    error?: {
        code: string;
        message: string;
        retry: Retry;
        details?: Record<string, unknown>;
    };
    observedAt: string;
    source: 'device' | 'relay-cache';
    freshness: 'live' | 'stale';
    nextCursor?: string;
    truncated?: boolean;
    artifactRefs?: unknown[];
}
export function ok<T>(data: T, extra: Partial<Result<T>> = {}): Result<T> { return { schemaVersion: 1, state: 'succeeded', data, observedAt: new Date().toISOString(), source: 'device', freshness: 'live', ...extra }; }
export function err(error: unknown, extra: Partial<Result> = {}): Result {
    const e = error instanceof PortalError ? error : new PortalError(error instanceof Error && ((error as any).code === 'INVALID_ARGUMENT' || error.name === 'ValidationError') ? 'INVALID_ARGUMENT' : 'IO_ERROR', error instanceof Error ? error.message : 'Operation failed');
    return { schemaVersion: 1, state: e.code === 'OUTCOME_UNKNOWN' ? 'outcome_unknown' : 'failed', error: { code: e.code, message: e.message, retry: e.retry, details: e.details }, observedAt: new Date().toISOString(), source: 'device', freshness: 'live', ...extra };
}
export function check(condition: unknown, code: ErrorCode, message: string, details: Record<string, unknown> = {}): asserts condition { if (!condition)
    throw new PortalError(code, message, details); }
export const sha = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
export const id = (prefix: string) => `${prefix}_${randomUUID()}`;
export function canonical(v: any): string { if (v === null || typeof v !== 'object')
    return JSON.stringify(v); if (Array.isArray(v))
    return '[' + v.map(canonical).join(',') + ']'; return '{' + Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}'; }
export const requestHash = (v: unknown) => sha(canonical(v));
export const TERMINAL = new Set<State>(['succeeded', 'failed', 'cancelled', 'interrupted', 'outcome_unknown']);
export const ACTIVE = new Set<State>(['accepted', 'queued', 'running', 'cancel_requested']);
export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
export function cursor(data: unknown): string { return Buffer.from(JSON.stringify({ v: 1, d: data })).toString('base64url'); }
export function uncursor(value: string | null | undefined): any { if (!value)
    return null; try {
    check(value.length <= 4096, 'INVALID_ARGUMENT', 'Cursor too long');
    const v = JSON.parse(Buffer.from(value, 'base64url').toString());
    check(v.v === 1, 'INVALID_ARGUMENT', 'Unsupported cursor');
    return v.d;
}
catch (e) {
    throw new PortalError('INVALID_ARGUMENT', 'Invalid cursor');
} }
