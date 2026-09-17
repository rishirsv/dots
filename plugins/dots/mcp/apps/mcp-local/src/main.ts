import fs from 'node:fs';
import path from 'node:path';
import { runtimeDir, callIpc } from '../../../packages/core/src/ipc.js';
import { makeMcpServer } from './server.js';
export async function runStdio(stateDir: string) { const socket = path.join(runtimeDir(stateDir), 'tools.sock'), token = fs.readFileSync(path.join(stateDir, 'secrets', 'frontend'), 'utf8'), call = (name: string, args: any) => callIpc(socket, token, name, args, 35000); const metadata = await call('meta.tools', {}); const skills: any = { staticList: (cursor?: string) => call('skills/list', { cursor }), staticGet: (uri: string) => call('skills/get', { uri }), resource: (uri: string) => call('resources/read', { uri }) }; const server = await makeMcpServer(metadata.tools, call, skills); const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js'); await server.connect(new StdioServerTransport()); }
