import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { Socket } from 'node:net';
import { McpServer, createMcpHandler, type CallToolResult } from '@modelcontextprotocol/server';
import { localhostHostValidation, localhostOriginValidation, toNodeHandler } from '@modelcontextprotocol/node';
import { z } from 'zod';
import { ToolError } from './errors.js';

export type ToolReply = CallToolResult;
export interface ToolDefinition {
  name: string;
  description: string;
  schema: z.ZodType;
  readOnly: boolean;
  replay: boolean;
  execute(input: unknown): Promise<ToolReply>;
}
export function defineTool<S extends z.ZodType>(
  name: string, description: string, schema: S,
  options: { readOnly: boolean; replay?: boolean },
  execute: (input: z.output<S>) => Promise<ToolReply>,
): ToolDefinition {
  return { name, description, schema, readOnly: options.readOnly, replay: options.replay ?? false,
    execute: input => execute(schema.parse(input)) };
}
export function jsonReply(data: Record<string, unknown>, text = JSON.stringify(data)): ToolReply {
  return { content: [{ type: 'text', text }], structuredContent: data };
}
export function toolFailure(error: unknown): ToolReply {
  const code = error instanceof ToolError ? error.code : error instanceof z.ZodError ? 'INVALID_INPUT' : 'INTERNAL_ERROR';
  const message = error instanceof ToolError ? error.message : error instanceof z.ZodError ? 'Input does not match the tool schema.' : 'The operation failed. Inspect local diagnostics.';
  const data: Record<string, unknown> = { code, message };
  if (error instanceof ToolError && error.details !== undefined) data.details = error.details;
  return { isError: true, ...jsonReply(data, `${code}: ${message}`) };
}
export type Dispatch = (tool: ToolDefinition, input: unknown) => Promise<ToolReply>;
export interface Endpoint {
  readonly url: string;
  readonly probeHeaders: Record<string, string>;
  close(): Promise<void>;
}

/** Adapted from Chat On Steroids' loopback server; MIT, see NOTICE.md. */
export async function openMcpEndpoint(options: {
  tools: ToolDefinition[];
  instructions: string;
  dispatch: Dispatch;
  onToolCall?: () => void;
}): Promise<Endpoint> {
  const path = `/mcp/${randomBytes(32).toString('base64url')}`;
  const probeToken = randomBytes(24).toString('base64url');
  const hostValid = localhostHostValidation();
  const originValid = localhostOriginValidation();
  const sessions = new Set<McpServer>();
  const sockets = new Set<Socket>();
  const responses = new Set<Promise<void>>();
  let closing = false;
  const handler = toNodeHandler(createMcpHandler(() => {
    const mcp = new McpServer({ name: 'oracle-repo-mcp', version: '0.1.0' }, { instructions: options.instructions });
    sessions.add(mcp);
    for (const tool of options.tools) {
      mcp.registerTool(tool.name, {
        description: tool.description,
        inputSchema: tool.schema,
        annotations: { readOnlyHint: tool.readOnly, destructiveHint: !tool.readOnly, idempotentHint: tool.readOnly, openWorldHint: !tool.readOnly },
      }, async input => {
        // Only a tool invocation counts, not initialize/list or the tunnel health probe.
        options.onToolCall?.();
        try {
          const reply = await options.dispatch(tool, input);
          if (Buffer.byteLength(JSON.stringify(reply)) > 3 * 1024 * 1024) {
            throw new ToolError('OUTPUT_LIMIT', 'Response exceeds the wire budget; narrow the request.');
          }
          return reply;
        } catch (error) { return toolFailure(error); }
      });
    }
    mcp.server.onclose = () => { sessions.delete(mcp); };
    return mcp;
  }));
  const server = http.createServer(async (req, res) => {
    if (!hostValid(req, res) || !originValid(req, res)) return;
    const suppliedPath = (req.url ?? '').split('?')[0] ?? '';
    if (!constantEqual(suppliedPath, path)) { res.writeHead(404).end(); return; }
    if (closing) { res.writeHead(503).end('Server stopping'); return; }
    if(req.method==='POST'){
      const finished=new Promise<void>(resolve=>{res.once('finish',resolve);res.once('close',resolve);});
      responses.add(finished);void finished.then(()=>responses.delete(finished));
    }
    try {
      const length = Number(req.headers['content-length'] ?? 0);
      if (!Number.isFinite(length) || length > 2 * 1024 * 1024) { res.writeHead(413).end(); return; }
      if (req.method === 'POST') {
        let size = 0;
        const chunks: Buffer[] = [];
        for await (const raw of req) {
          const chunk = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
          size += chunk.length;
          if (size > 2 * 1024 * 1024) { res.writeHead(413).end(); return; }
          chunks.push(chunk);
        }
        const body: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        await handler(req, res, body);
      } else { await handler(req, res); }
    } catch {
      if (!res.headersSent) res.writeHead(400).end('Invalid MCP request');
      else res.end();
    }
  });
  server.requestTimeout = 35_000;
  server.headersTimeout = 10_000;
  server.on('connection', socket => { sockets.add(socket); socket.on('close', () => sockets.delete(socket)); });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => { server.removeListener('error', reject); resolve(); });
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Expected TCP address');
  return {
    url: `http://127.0.0.1:${address.port}${path}`,
    probeHeaders: { 'x-oracle-tunnel-probe': probeToken },
    async close() {
      closing = true;
      // Allow completed effects to flush their HTTP responses before closing sessions.
      let drainTimer:NodeJS.Timeout|undefined;
      await Promise.race([Promise.allSettled([...responses]),new Promise<void>(resolve=>{drainTimer=setTimeout(resolve,2000);})]);
      if(drainTimer)clearTimeout(drainTimer);
      await Promise.allSettled([...sessions].map(session => session.close()));
      const closed = new Promise<void>(resolve => server.close(() => resolve()));
      for (const socket of sockets) socket.destroy();
      await closed;
    },
  };
}
export function constantEqual(a: string, b: string): boolean {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

// Native Codex tool fields are preserved inside the explicit MCP scope/retry envelope.
// apply_patch is freeform in Codex; MCP carries that same grammar in `patch`.
import type { Repository } from './repo.js';
import type { CommandPool } from './commands.js';
const scope = { instance_id: z.string().regex(/^run_[a-f0-9]{32}$/).describe('Instance ID from the Oracle handoff; never substitute a different checkout.'), access_epoch: z.number().int().positive().describe('Access epoch from the current handoff. Obtain a renewed handoff after pause/resume; never adopt an epoch from status.') };
const receipt = { request_id: z.string().min(1).max(128).describe('Unique action ID. Reuse it unchanged only when retrying this exact call after a lost response.') };
const positive = z.number().int().positive();
const yieldTime = z.number().int().min(0).max(300_000).optional();
const outputTokens = z.number().int().min(1).max(32_000).optional();
const searchFields = { query:z.string().min(1).max(2000),path:z.string().optional(),glob:z.string().max(500).optional(),regex:z.boolean().optional(),case_sensitive:z.boolean().optional(),limit:positive.max(500).optional(),cursor:z.string().max(1000).optional() };
export function createTools(repo: Repository, commands: CommandPool, getStatus: () => Promise<Record<string,unknown>>,
  acknowledge: (requests: Array<{tool:string;request_id:string}>) => Record<string,unknown>, listReceipts: (offset?: number, limit?: number) => Record<string,unknown>): ToolDefinition[] {
  return [
    defineTool('repo_status','Discover the one active repository and inspect HEAD, staged/unstaged changes, instance ID and connection health. A different instance needs a new Oracle handoff.',
      z.object({instance_id:scope.instance_id.optional(),access_epoch:scope.access_epoch.optional()}).strict(),{readOnly:true},async()=>jsonReply(await getStatus())),
    defineTool('repo_receipts','List action IDs, tool names, disposition and timestamps without replaying arguments or reply payloads. Page with next_offset. Retired IDs never execute again.',
      z.object({...scope,offset:z.number().int().nonnegative().optional(),limit:positive.max(100).optional()}).strict(),{readOnly:true},async input=>jsonReply(listReceipts(input.offset,input.limit))),
    defineTool('repo_read','Read numbered file ranges or directory listings inside this repository. Batch related paths; use {path,start_line,end_line} entries for different ranges per file. Returns complete-file hashes for patch preconditions. Continue byte-limited files at next_line; oversized_line requires a larger max_bytes or narrower shell inspection. Use exec_command for general shell-based inspection.',
      z.object({...scope,paths:z.array(z.union([z.string().min(1),z.object({path:z.string().min(1),start_line:positive.optional(),end_line:positive.optional()}).strict()])).min(1).max(20),start_line:positive.optional(),end_line:positive.optional(),commit:z.string().min(1).max(200).optional(),max_bytes:positive.max(512*1024).optional()}).strict(),{readOnly:true},async input=>jsonReply(await repo.read(input))),
    defineTool('repo_search','Find filenames/text in tracked and nonignored untracked source. Use query for one search or queries for up to four related searches in one call. Search cursors retain independent bounded snapshots for ten minutes, until eviction or control handoff. Repeat without cursor for fresh results; narrow incomplete searches.',
      z.object({...scope,...searchFields,query:searchFields.query.optional(),queries:z.array(z.object({...searchFields,limit:positive.max(50).optional()}).strict()).min(1).max(4).optional()}).strict().superRefine((input,ctx)=>{
        if ((input.query === undefined) === (input.queries === undefined)) ctx.addIssue({code:'custom',message:'Supply query or queries, exclusively.'});
        if (input.queries && Object.keys(searchFields).some(key=>key!=='query' && input[key as keyof typeof input] !== undefined)) ctx.addIssue({code:'custom',message:'For a batch, put search options inside each query.'});
      }),{readOnly:true},async input=>{
        if (!input.queries) return jsonReply(await repo.search({...input,query:input.query!}));
        const results: Array<Record<string,unknown>>=[];
        for (const query of input.queries) {
          try { results.push({query:query.query,...await repo.search({...query,limit:query.limit??25})}); }
          catch(error) { results.push({query:query.query,error:toolFailure(error).structuredContent}); }
        }
        return jsonReply({results});
      }),
    defineTool('repo_acknowledge','Discard saved reply payloads only after you have safely consumed the results. Retired action IDs remain reserved and can never execute again. Acknowledgement is idempotent, does not touch files, and does not consume another action receipt. Inspect receipt capacity in repo_status.',
      z.object({...scope,requests:z.array(z.object({tool:z.enum(['apply_patch','exec_command','write_stdin','cancel_command']),request_id:receipt.request_id}).strict()).min(1).max(100)}).strict(),{readOnly:false},async input=>jsonReply(acknowledge(input.requests))),
    defineTool('repo_diff','Inspect staged, unstaged, or explicit commit-to-commit changes without modifying Git state. Untracked files are reported separately; read them with repo_read.',
      z.object({...scope,mode:z.enum(['staged','unstaged','commits']).default('unstaged'),base:z.string().max(200).optional(),head:z.string().max(200).optional(),paths:z.array(z.string()).max(100).optional(),max_bytes:positive.max(512*1024).optional()}).strict(),{readOnly:true},async input=>jsonReply(await repo.diff(input))),
    defineTool('repo_history','Read bounded commit history, optionally scoped to a repository path. Use repo_diff to inspect a commit.',
      z.object({...scope,path:z.string().optional(),limit:positive.max(100).optional(),skip:z.number().int().min(0).max(100_000).optional()}).strict(),{readOnly:true},async input=>jsonReply(await repo.history(input))),
    defineTool('view_image','View a local repository image. Codex path/detail semantics; image bytes are returned as native MCP image content. high resizes within the image budget; original preserves resolution within hard limits.',
      z.object({...scope,path:z.string().min(1),detail:z.enum(['high','original']).optional()}).strict(),{readOnly:true},async input=>{
        const image=await repo.image(input);
        return {content:[{type:'image',data:image.data,mimeType:image.mimeType},{type:'text',text:`Image: ${input.path} (detail=${image.detail})`}],structuredContent:{detail:image.detail}};
      }),
    defineTool('apply_patch','Apply a Codex patch: *** Begin Patch, Add/Update/Delete File, optional Move to, @@ context hunks, *** End Patch. The patch field is the JSON envelope for native Codex freeform text. expected supplies the last observed full-file SHA256 or absent for every target, including move destinations. Preserve unrelated changes. No Git staging or publishing.',
      z.object({...scope,...receipt,patch:z.string().min(1).max(1024*1024),expected:z.record(z.string(),z.discriminatedUnion('kind',[z.object({kind:z.literal('absent')}).strict(),z.object({kind:z.literal('file'),sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict()]))}).strict(),{readOnly:false,replay:true},async input=>{
        const result=await repo.patch(input);
        return {...jsonReply(result,result.text),...(result.exit_code===0?{}:{isError:true})};
      }),
    defineTool('exec_command','Run a command using Codex exec_command semantics. Commands run with normal macOS user permissions and network access; workdir starts inside the selected repo but is not a sandbox. Default tty=false, login=true, yield_time_ms=10000. The wait is a maximum: useful output wakes it early; prefer login:false when shell startup configuration is unnecessary. Use write_stdin to poll ongoing sessions. Follow the handoff task; do not stage, commit, switch branches or publish.',
      z.object({...scope,...receipt,cmd:z.string().min(1).max(128*1024),workdir:z.string().optional(),shell:z.string().optional(),login:z.boolean().optional(),tty:z.boolean().optional(),yield_time_ms:yieldTime,max_output_tokens:outputTokens}).strict(),{readOnly:false,replay:true},async input=>{
        const result=await commands.exec(input);return jsonReply(result,execText(result));
      }),
    defineTool('write_stdin','Write to or collect output from an existing Codex-style exec session. Omit chars to poll. Empty polls drain output: reuse the request_id only to recover this exact response; use a new request_id for the next poll.',
      z.object({...scope,...receipt,session_id:positive,chars:z.string().max(64*1024).optional(),yield_time_ms:yieldTime,max_output_tokens:outputTokens}).strict(),{readOnly:false,replay:true},async input=>{
        const result=await commands.write(input);return jsonReply(result,execText(result));
      }),
    defineTool('cancel_command','Cancel a command owned by this instance and return its retained final output. This MCP lifecycle addition does not undo files the command already wrote.',
      z.object({...scope,...receipt,session_id:positive}).strict(),{readOnly:false,replay:true},async input=>{
        const result=await commands.cancel(input.session_id);return jsonReply(result,execText(result));
      }),
  ];
}
function execText(result: {chunk_id?:string;wall_time_seconds:number;output:string;session_id?:number;exit_code?:number;original_token_count?:number}): string {
  return [result.chunk_id ? `Chunk ID: ${result.chunk_id}`:null,`Wall time: ${result.wall_time_seconds.toFixed(4)} seconds`,
    result.exit_code===undefined?null:`Process exited with code ${result.exit_code}`,result.session_id===undefined?null:`Process running with session ID ${result.session_id}`,
    result.original_token_count===undefined?null:`Original token count: ${result.original_token_count}`,'Output:',result.output].filter(v=>v!==null).join('\n');
}
