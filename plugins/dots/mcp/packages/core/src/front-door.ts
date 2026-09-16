import { OperationBroker } from './broker.js';
import { SkillCatalogue } from '../../skills/src/catalogue.js';
import type { Actor } from './types.js';
import { s, Schema, validate, check, err, ok, id, cursor, uncursor, requestHash } from '../../protocol/src/index.js';
export interface Tool {
    name: string;
    description: string;
    inputSchema: Schema;
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
    };
}
export class FrontDoor {
    readonly tools: Tool[];
    constructor(public broker: OperationBroker, public skills: SkillCatalogue) {
        const ws = { workspaceId: s.key() }, write = { ...ws, writerEpoch: s.int(1), idempotencyKey: s.key() };
        const tools: Tool[] = [];
        const add = (name: string, description: string, inputSchema: Schema, read = true, open = false) => tools.push({ name, description, inputSchema, annotations: { readOnlyHint: read, destructiveHint: !read, idempotentHint: read, openWorldHint: open } });
        add('status', 'Show permitted device/workspace/job health, actual permissions and unavailable dependencies.', s.object({ deviceId: s.key(), workspaceId: s.key() }, []));
        add('open_workspace', 'Open a read or coordinated write context inside an existing locally approved root. Never approves new roots.', s.object({ deviceId: s.key(), rootAlias: s.key(), access: s.enum('read', 'write'), idempotencyKey: s.key() }), false);
        add('discover', 'Find up to ten relevant capabilities or skills without loading all schemas/bodies.', s.object({ ...ws, query: s.string(300), kind: s.enum('capabilities', 'skills', 'all'), cursor: s.nullable(s.string(4096)) }, ['query', 'kind']));
        add('describe', 'Get focused schemas/type declarations or skill metadata for up to eight exact IDs.', s.object({ ...ws, capabilityIds: s.array(s.string(120), 8), skillIds: s.array(s.string(120), 8) }, ['workspaceId']));
        add('load_skill', 'Read one approved skill body or reference with provenance and exact source digest; never executes scripts.', s.object({ ...ws, skillId: s.string(120), expectedHash: s.sha(), reference: s.path() }, ['workspaceId', 'skillId']));
        const direct = (name: string, capability: string, description: string, mutate = false) => { const cap = broker.registry.get(capability); add(name, description, s.object({ ...ws, ...(mutate ? { writerEpoch: s.int(1), idempotencyKey: s.key() } : {}), ...cap.input.properties }, [...Object.keys(ws), ...(mutate ? ['idempotencyKey'] : []), ...(cap.input.required ?? [])]), !mutate, cap.effect === 'spawn'); };
        direct('read_file', 'files.read', 'Read exact bounded file lines or bytes; preserve its SHA before editing.');
        direct('apply_patch', 'files.apply_patch', 'Apply a focused Codex-style patch with explicit source/absence preconditions and durable per-file receipts.', true);
        direct('exec_command', 'terminal.exec', 'Start a durable sandboxed command once, then poll its job. Nonzero exit is a command result, not transport failure.', true);
        direct('write_stdin', 'terminal.stdin', 'Send explicit stdin or EOF once to an existing interactive command.', true);
        add('get_operation', 'Recover by operationId OR workspaceId plus original idempotencyKey. Never replay an uncertain effect with a new key.', s.object({ operationId: s.key(), workspaceId: s.key(), idempotencyKey: s.key() }, []));
        direct('read_output', 'jobs.output', 'Read committed output using an independent cursor; two readers never consume each other’s position.');
        direct('cancel_job', 'jobs.cancel', 'Persist cancellation intent and distinguish it from confirmed termination.', true);
        direct('view_image', 'images.view', 'Return actual MCP image content from a bounded authorized rendition.');
        const codeProps = broker.registry.get('code.run').input.properties!;
        add('run_code_read', 'Compose selected read capabilities in QuickJS using portal.<family>.<method>; no mutation, spawn, stdin, network or host APIs.', s.object({ ...ws, ...codeProps }, ['workspaceId', 'code', 'capabilityIds']), true);
        add('run_code', 'Compose selected capabilities in QuickJS; each side effect needs a stable stepKey and ordinary broker permission.', s.object({ ...write, ...codeProps }, ['workspaceId', 'writerEpoch', 'idempotencyKey', 'code', 'capabilityIds']), false, true);
        add('invoke', 'Invoke an exact discovered capability/revision with validated arguments. Worst-case mutating and network capable; policy is enforced per call.', s.object({ ...write, capabilityId: s.string(120), revision: s.sha(), arguments: s.record(s.json(), 100) }, ['workspaceId', 'capabilityId', 'revision', 'arguments']), false, true);
        add('close_workspace', 'Close only this workspace. Refuse while jobs run, or explicitly request drain/cancel; keep the agent paired.', s.object({ ...ws, idempotencyKey: s.key(), behavior: s.enum('refuse_if_busy', 'drain', 'cancel'), report: s.string(65536) }, ['workspaceId', 'idempotencyKey', 'behavior']), false);
        this.tools = tools;
    }
    async call(actor: Actor, name: string, args: any) {
        try {
            const tool = this.tools.find(t => t.name === name);
            check(tool, 'NOT_FOUND', 'Unknown front-door tool');
            validate(tool.inputSchema, args);
            this.broker.authenticate(actor);
            this.broker.scope(actor, 'portal:read');
            if (name === 'status') {
                if (args.deviceId)
                    check(args.deviceId === actor.deviceId, 'FORBIDDEN', 'Wrong device');
                if (args.workspaceId)
                    this.broker.context(actor, args.workspaceId);
                return this.broker.status(actor);
            }
            if (name === 'open_workspace')
                return this.broker.openWorkspace(actor, args);
            if (name === 'get_operation')
                return this.broker.getOperation(actor, args);
            if (name === 'close_workspace')
                return this.broker.closeWorkspace(actor, args);
            if (name === 'discover') {
                const context = args.workspaceId ? this.broker.context(actor, args.workspaceId) : null;
                const families = context?.grant.policy.families ?? [];
                const capabilities = args.kind === 'skills' ? [] : this.broker.registry.discover(args.query, families);
                const skillResult = args.kind === 'capabilities' ? { skills: [], errors: [] } : args.workspaceId ? this.skills.discover(args.query, context!.grant.id) : { skills: this.skills.builtins().map(b => ({ ...this.skills.summary(b), score: 0 })), errors: [] };
                const entries = [...capabilities, ...skillResult.skills].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
                const digest = requestHash(entries), cur = uncursor(args.cursor);
                check(!cur || (cur.digest === digest && Number.isSafeInteger(cur.offset) && cur.offset >= 0), 'SOURCE_CHANGED', 'Discovery catalogue changed');
                const offset = cur?.offset ?? 0;
                return ok({ entries: entries.slice(offset, offset + 10), errors: skillResult.errors, nextCursor: offset + 10 < entries.length ? cursor({ digest, offset: offset + 10 }) : null });
            }
            const { grant } = this.broker.context(actor, args.workspaceId);
            if (name === 'describe') {
                check((args.capabilityIds?.length ?? 0) + (args.skillIds?.length ?? 0) <= 8, 'LIMIT_EXCEEDED', 'Describe at most eight IDs');
                return ok({ capabilities: this.broker.registry.describe(args.capabilityIds ?? []), skills: (args.skillIds ?? []).map((id: string) => { const b = this.skills.catalogue(grant.id).bundles.find(b => b.id === id); check(b, 'NOT_FOUND', 'Skill not found'); return this.skills.summary(b); }) });
            }
            if (name === 'load_skill')
                return ok(this.skills.load(args.skillId, grant.id, args.expectedHash, args.reference));
            const routes: Record<string, string> = { read_file: 'files.read', apply_patch: 'files.apply_patch', exec_command: 'terminal.exec', write_stdin: 'terminal.stdin', read_output: 'jobs.output', cancel_job: 'jobs.cancel', view_image: 'images.view', run_code: 'code.run', run_code_read: 'code.run_read' };
            const { workspaceId, writerEpoch, idempotencyKey, revision, ...rest } = args;
            const capabilityId = name === 'invoke' ? args.capabilityId : routes[name];
            const body = name === 'invoke' ? args.arguments : rest;
            return this.broker.invoke(actor, { workspaceId, writerEpoch, idempotencyKey: name === 'run_code_read' ? id('read-code') : idempotencyKey, revision, capabilityId, arguments: body, readOnly: false });
        }
        catch (e) {
            return err(e);
        }
    }
}
