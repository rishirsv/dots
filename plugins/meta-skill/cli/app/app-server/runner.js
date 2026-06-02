"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServerScenarioRunner = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const project_1 = require("../project");
const client_1 = require("./client");
class AppServerScenarioRunner {
    client;
    clientFactory;
    turnTimeoutMs;
    rpcPath;
    constructor(options = {}) {
        this.clientFactory = options.clientFactory || ((onLine) => new client_1.AppServerJsonClient(onLine));
        this.turnTimeoutMs = options.turnTimeoutMs || 120000;
    }
    async run(input) {
        const rawRoot = node_path_1.default.join(input.runRoot, "scenarios", input.scenario.folder, input.side);
        await (0, project_1.ensureDir)(rawRoot);
        await (0, project_1.ensureDir)(node_path_1.default.join(rawRoot, "artifacts"));
        const stageRoot = node_path_1.default.join(rawRoot, "stage");
        await stageWorkspace(input, stageRoot);
        const rpcPath = node_path_1.default.join(rawRoot, "rpc.jsonl");
        await this.client?.flush?.();
        this.rpcPath = rpcPath;
        const client = await this.ensureClient(input.appServer);
        const start = await client.request("thread/start", {
            cwd: stageRoot,
            runtimeWorkspaceRoots: [stageRoot],
            approvalPolicy: "never",
            sandbox: "read-only",
            experimentalRawEvents: true,
            persistExtendedHistory: false,
            ephemeral: true,
            baseInstructions: "You are executing a Meta Skill scenario. Follow the staged skill payload exactly and answer the user's task.",
            developerInstructions: [
                "Use the skill mounted in this turn as the only runtime skill guidance.",
                "Treat stage/scenario/task.md as the first user request and stage/scenario/turns.json as follow-up user turns.",
                "Do not modify files. Produce the final answer that the skill would give the user."
            ].join("\n")
        });
        const thread = start.thread;
        const threadId = thread?.id;
        if (!threadId)
            throw new Error("App Server thread/start response did not include thread.id");
        const turnRecords = [];
        let tokenUsage = (0, project_1.unavailableTokenUsage)("App Server completed without token metrics.");
        let final = "";
        const turns = [{ content: input.scenario.task, source: "task.md" }, ...input.scenario.turns.map((turn) => ({ content: turn.content, source: "turns.json" }))];
        for (const [index, turn] of turns.entries()) {
            turnRecords.push({ role: "user", index, source: turn.source, content: turn.content, status: "sent" });
            const result = await runTurn(client, threadId, stageRoot, input.scenario, turn.content, index === 0, this.turnTimeoutMs);
            final = result.final || final;
            tokenUsage = result.tokenUsage || tokenUsage;
            turnRecords.push({ role: "assistant", index, source: "app-server", content: result.final, status: "completed", turn_id: result.turnId });
        }
        await client.flush?.();
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
        await (0, project_1.writeText)(node_path_1.default.join(rawRoot, "final.md"), final || "(no final assistant message captured)");
        return {
            status: "needs_review",
            token_usage: tokenUsage,
            final_path: node_path_1.default.join(rawRoot, "final.md"),
            evidence_path: node_path_1.default.relative(input.runRoot, rawRoot)
        };
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
exports.AppServerScenarioRunner = AppServerScenarioRunner;
async function runTurn(client, threadId, stageRoot, scenario, content, includeSkill, turnTimeoutMs) {
    const mark = client.eventCount();
    const input = [
        ...(includeSkill ? [{ type: "skill", name: "candidate", path: node_path_1.default.join(stageRoot, "skill") }] : []),
        { type: "text", text: content, text_elements: [] }
    ];
    const started = await client.request("turn/start", {
        threadId,
        input,
        cwd: stageRoot,
        runtimeWorkspaceRoots: [stageRoot],
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
    return { turnId, final, tokenUsage: tokenEvent ? toTokenUsage(tokenEvent.params.tokenUsage?.last) : undefined };
}
function toTokenUsage(raw) {
    const metrics = raw;
    if (!metrics)
        return (0, project_1.unavailableTokenUsage)("App Server token metrics were unavailable.");
    return {
        input_tokens: { available: true, value: Number(metrics.inputTokens || 0) },
        output_tokens: { available: true, value: Number(metrics.outputTokens || 0) },
        total_tokens: { available: true, value: Number(metrics.totalTokens || 0) }
    };
}
async function stageWorkspace(input, stageRoot) {
    await node_fs_1.promises.rm(stageRoot, { recursive: true, force: true });
    await (0, project_1.ensureDir)(stageRoot);
    await (0, project_1.copyPortablePayload)(input.skillRoot, node_path_1.default.join(stageRoot, "skill"));
    await (0, project_1.ensureDir)(node_path_1.default.join(stageRoot, "scenario"));
    for (const name of ["task.md", "criteria.json", "scenario.json", "turns.json", "capability.txt"]) {
        const source = node_path_1.default.join(input.scenario.path, name);
        try {
            await node_fs_1.promises.copyFile(source, node_path_1.default.join(stageRoot, "scenario", name));
        }
        catch {
            // Optional scenario files are simply absent from the staged workspace.
        }
    }
    const resources = node_path_1.default.join(input.scenario.path, "resources");
    try {
        await node_fs_1.promises.cp(resources, node_path_1.default.join(stageRoot, "scenario", "resources"), { recursive: true });
    }
    catch {
        // Scenario resources are optional.
    }
    await (0, project_1.writeText)(node_path_1.default.join(stageRoot, "HARNESS.md"), `# Meta Skill App Server Harness\n\nRun ${input.runId}, scenario ${input.scenario.id}, side ${input.side}.\n`);
}
