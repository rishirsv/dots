"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServerCaseRunner = void 0;
const node_fs_1 = require("node:fs");
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
const client_1 = require("./client");
class AppServerCaseRunner {
    client;
    clientFactory;
    turnTimeoutMs;
    maxCaseRespawns;
    rpcPath;
    constructor(options = {}) {
        this.clientFactory = options.clientFactory || ((onLine) => new client_1.AppServerJsonClient(onLine));
        this.turnTimeoutMs = options.turnTimeoutMs || 120000;
        this.maxCaseRespawns = options.maxCaseRespawns ?? 1;
    }
    async run(input) {
        for (let attempt = 0;; attempt += 1) {
            try {
                return await this.runOnce(input);
            }
            catch (error) {
                if (!(error instanceof client_1.AppServerUnavailableError) || attempt >= this.maxCaseRespawns)
                    throw error;
                this.close();
            }
        }
    }
    async runOnce(input) {
        if (input.skill_activation === "discoverable") {
            throw new Error("Discoverable skill activation requires an App Server availability-only skill API.");
        }
        const rawRoot = node_path_1.default.join(input.runRoot, "cases", input.case.folder);
        await (0, project_1.ensureDir)(rawRoot);
        const runtimeRoot = await node_fs_1.promises.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "meta-skill-case-"));
        const forceSkill = input.skill_activation === "forced";
        const attachmentName = forceSkill && input.skillRoot ? await runtimeSkillName(input.skillRoot) : undefined;
        const workspaceRoots = await runtimeWorkspaceRoots(runtimeRoot, input.case.path);
        try {
            const rpcPath = node_path_1.default.join(rawRoot, "rpc.jsonl");
            await this.client?.flush?.();
            this.rpcPath = rpcPath;
            const client = await this.ensureClient(input.appServer);
            const start = await client.request("thread/start", {
                cwd: runtimeRoot,
                runtimeWorkspaceRoots: workspaceRoots,
                approvalPolicy: "never",
                sandbox: "read-only",
                experimentalRawEvents: true,
                persistExtendedHistory: false,
                ephemeral: true,
                baseInstructions: forceSkill ? "You are executing a Meta Skill eval case. Follow the mounted skill payload exactly and answer the user's task." : "You are executing a Meta Skill eval case without an attached skill. Answer the user's task directly.",
                developerInstructions: [
                    forceSkill ? "Use the skill mounted in this turn as the only runtime skill guidance." : "No skill is mounted for this case. Answer without skill-specific runtime guidance.",
                    "The user messages are supplied directly by the harness. Solver-visible fixture files, when present, are mounted as read-only workspace roots.",
                    forceSkill ? "Do not modify files. Produce the final answer that the skill would give the user." : "Do not modify files. Produce the final answer you would give without a skill."
                ].join("\n")
            });
            const thread = start.thread;
            const threadId = thread?.id;
            if (!threadId)
                throw new Error("App Server thread/start response did not include thread.id");
            const turnRecords = [];
            let finalCumulativeUsage;
            let final = "";
            const turns = [{ content: input.case.task, source: "case.md#Task" }, ...input.case.turns.map((turn, index) => ({ content: turn.content, source: `case.md#Turn ${index + 2}` }))];
            for (const [index, turn] of turns.entries()) {
                turnRecords.push({ role: "user", index, source: turn.source, content: turn.content, status: "sent" });
                const result = await runTurn(client, threadId, runtimeRoot, workspaceRoots, turn.content, index === 0 && forceSkill, this.turnTimeoutMs, attachmentName, input.skillRoot);
                final = result.final || final;
                finalCumulativeUsage = result.cumulativeTokenUsage;
                turnRecords.push({
                    role: "assistant",
                    index,
                    source: "app-server",
                    content: result.final,
                    status: "completed",
                    turn_id: result.turnId
                });
            }
            await client.flush?.();
            const caseSummary = summarizeCaseUsage(finalCumulativeUsage);
            await (0, project_1.writeJson)(node_path_1.default.join(rawRoot, "thread.json"), {
                schema_version: 1,
                thread_id: threadId,
                turn_ids: turnRecords.filter((row) => row.role === "assistant").map((row) => row.turn_id),
                parent_thread_id: null,
                forked_from_id: null,
                resume_from_id: null,
                app_server: input.appServer,
                status: "completed",
                error: null
            });
            await (0, project_1.writeText)(node_path_1.default.join(rawRoot, "turns.jsonl"), turnRecords.map((row) => JSON.stringify(row)).join("\n"));
            await (0, project_1.writeJson)(node_path_1.default.join(rawRoot, "usage.json"), caseSummary);
            await (0, project_1.writeText)(node_path_1.default.join(rawRoot, "final.md"), final || "(no final assistant message captured)");
            return {
                execution_status: "completed",
                token_usage: caseSummary,
                final_path: node_path_1.default.join(rawRoot, "final.md"),
                evidence_path: node_path_1.default.relative(input.runRoot, rawRoot)
            };
        }
        finally {
            await node_fs_1.promises.rm(runtimeRoot, { recursive: true, force: true });
        }
    }
    close() {
        this.client?.close();
        this.client = undefined;
    }
    async ensureClient(appServer) {
        if (!this.client) {
            this.client = this.clientFactory(async (line) => {
                if (!this.rpcPath)
                    return;
                await (0, project_1.appendJsonl)(this.rpcPath, {
                    schema_version: 1,
                    direction: line.direction,
                    message: line.message
                });
            });
            if (this.client instanceof client_1.AppServerJsonClient)
                await this.client.connect(appServer);
        }
        return this.client;
    }
}
exports.AppServerCaseRunner = AppServerCaseRunner;
async function runTurn(client, threadId, runtimeRoot, workspaceRoots, content, includeSkill, turnTimeoutMs, attachmentName, skillRoot) {
    const mark = client.eventCount();
    const input = [
        ...(includeSkill && attachmentName && skillRoot ? [{ type: "skill", name: attachmentName, path: skillRoot }] : []),
        { type: "text", text: content, text_elements: [] }
    ];
    const started = await client.request("turn/start", {
        threadId,
        input,
        cwd: runtimeRoot,
        runtimeWorkspaceRoots: workspaceRoots,
        approvalPolicy: "never",
        sandboxPolicy: { type: "readOnly", networkAccess: false }
    });
    const turn = started.turn;
    const turnId = turn?.id;
    if (!turnId)
        throw new Error("App Server turn/start response did not include turn.id");
    await client.waitFor((message) => message.method === "turn/completed" && message.params?.threadId === threadId && message.params?.turn?.id === turnId, turnTimeoutMs);
    const events = client.eventsSince(mark);
    const final = events
        .filter((message) => message.method === "item/agentMessage/delta" && message.params?.threadId === threadId && message.params?.turnId === turnId)
        .map((message) => String(message.params.delta || ""))
        .join("");
    const tokenEvent = [...events]
        .reverse()
        .find((message) => message.method === "thread/tokenUsage/updated" && message.params?.threadId === threadId && message.params?.turnId === turnId);
    if (!tokenEvent)
        return { turnId, final };
    const params = tokenEvent.params;
    const tokenUsage = params.tokenUsage;
    const modelContextWindow = numberOrNull(params.modelContextWindow);
    return {
        turnId,
        final,
        cumulativeTokenUsage: tokenUsage?.total ? toTokenUsage(tokenUsage.total, `App Server cumulative token metrics were unavailable for turn ${turnId}.`, modelContextWindow) : undefined
    };
}
function toTokenUsage(raw, reason = "App Server token metrics were unavailable.", modelContextWindow = null) {
    const metrics = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : undefined;
    if (!metrics)
        return (0, project_1.unavailableTokenUsage)(reason);
    const input = numberOrNull(metrics.inputTokens);
    const output = numberOrNull(metrics.outputTokens);
    const total = numberOrNull(metrics.totalTokens);
    const cachedInput = numberOrNull(metrics.cachedInputTokens);
    const reasoning = numberOrNull(metrics.reasoningOutputTokens);
    const unavailableReason = input === null || output === null || total === null ? reason : null;
    return {
        input_tokens: input,
        output_tokens: output,
        total_tokens: total,
        cached_input_tokens: cachedInput,
        reasoning_tokens: reasoning,
        model_context_window: modelContextWindow,
        unavailable_reason: unavailableReason
    };
}
function summarizeCaseUsage(finalCumulativeUsage) {
    if (finalCumulativeUsage?.total_tokens !== null && finalCumulativeUsage?.total_tokens !== undefined)
        return finalCumulativeUsage;
    return (0, project_1.unavailableTokenUsage)("App Server completed without tokenUsage.total on the final turn.");
}
function numberOrNull(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
async function runtimeWorkspaceRoots(runtimeRoot, casePath) {
    const roots = [runtimeRoot];
    const fixtures = node_path_1.default.join(casePath, "fixtures");
    if (await (0, project_1.exists)(fixtures))
        roots.push(fixtures);
    return roots;
}
async function runtimeSkillName(skillRoot) {
    const frontmatter = await (0, project_1.parseSkillFrontmatter)(node_path_1.default.join(skillRoot, "SKILL.md"));
    return frontmatter.name || node_path_1.default.basename(skillRoot);
}
