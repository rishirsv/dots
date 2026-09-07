import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { ToolError } from './errors.js';

export const CONTROL_PORT = 47693;
export const APP_HOME = process.env.ORACLE_REPO_MCP_HOME ?? path.join(os.homedir(), 'Library', 'Application Support', 'Oracle Repo MCP');
export const PACKAGE_ROOT = fileURLToPath(new URL('../', import.meta.url));
const ConfigSchema = z.object({
  tunnelId: z.string().regex(/^tunnel_[a-f0-9]{32}$/),
  tunnelBinary: z.string().min(1),
  keychainAccount: z.string().min(1).max(200).default('tunnel-runtime'),
}).strict();
export type Config = z.infer<typeof ConfigSchema>;

export async function privateDirectory(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  await fs.chmod(dir, 0o700);
}
export async function writePrivateJson(file: string, data: unknown): Promise<void> {
  await privateDirectory(path.dirname(file));
  const temp = `${file}.${randomBytes(8).toString('hex')}.tmp`;
  try {
    await fs.writeFile(temp, JSON.stringify(data, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
    await fs.rename(temp, file);
  } finally { await fs.rm(temp, { force: true }); }
}
export async function readConfig(home = APP_HOME): Promise<Config> {
  try {
    return ConfigSchema.parse(JSON.parse(await fs.readFile(path.join(home, 'config.json'), 'utf8')));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new ToolError('SETUP_REQUIRED', 'Run oracle-repo-mcp configure --tunnel-id <id> first. Use --local-only only for local verification.');
    throw new ToolError('INVALID_CONFIG', 'The local tunnel configuration is invalid; run configure again.');
  }
}
export async function configure(config: Config, key: string, home = APP_HOME): Promise<void> {
  const validated = ConfigSchema.parse(config);
  await fs.access(validated.tunnelBinary, fs.constants.X_OK);
  if (!key.trim() || key.length > 4096 || /[\r\n\0]/.test(key.trim())) throw new ToolError('INVALID_KEY', 'Enter a single runtime key.');
  await keychain('put', validated.keychainAccount, key.trim());
  await writePrivateJson(path.join(home, 'config.json'), validated);
}
export function keychain(action: 'get' | 'put' | 'delete', account: string, value?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(path.join(PACKAGE_ROOT, 'native', 'keychain-helper'), [action, account], { stdio: ['pipe', 'pipe', 'pipe'] });
    const chunks: Buffer[] = [];
    let bytes = 0;
    let settled = false;
    const timer = setTimeout(() => { child.kill(); fail(new ToolError('KEYCHAIN_TIMEOUT', 'Keychain access did not complete.')); }, 60_000);
    const fail = (error: Error) => { if (!settled) { settled = true; clearTimeout(timer); reject(error); } };
    child.on('error', () => fail(new ToolError('KEYCHAIN_UNAVAILABLE', 'Build the macOS Keychain helper with npm run build:native.')));
    child.stdout.on('data', (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > 4096) { child.kill(); fail(new ToolError('KEYCHAIN_FAILED', 'Unexpected credential size.')); }
      else chunks.push(chunk);
    });
    child.stderr.resume();
    child.stdin.on('error', () => {});
    child.once('close', code => {
      if (settled) return;
      if (code !== 0) { fail(new ToolError(code === 44 ? 'CREDENTIAL_MISSING' : 'KEYCHAIN_FAILED', code === 44 ? 'No tunnel runtime credential is configured.' : 'macOS Keychain denied access.')); return; }
      settled = true; clearTimeout(timer); resolve(Buffer.concat(chunks).toString('utf8'));
    });
    child.stdin.end(value ?? '');
  });
}
