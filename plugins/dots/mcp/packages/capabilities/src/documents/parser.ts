import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { check, PortalError } from '../../../protocol/src/index.js';
const ROOT = path.resolve(import.meta.dirname, '../../../../..');
let cached: {
    key: string;
    available: boolean;
    reason?: string;
} | undefined;
export function parserAvailability() {
    const binary = process.platform === 'darwin' ? '/usr/bin/sandbox-exec' : path.join(ROOT, 'native/parser-sandbox/build/parser-sandbox');
    const python = process.env.PORTAL_PYTHON ?? '/usr/local/bin/python3', key = binary + ':' + python;
    if (cached?.key === key)
        return cached;
    if (!fs.existsSync(binary) || !fs.existsSync(python))
        return cached = { key, available: false, reason: 'Pinned Python parser environment or OS containment helper unavailable' };
    if (process.platform === 'darwin')
        return cached = { key, available: true, reason: 'macOS parser sandbox present; physical-Mac qualification is still required' };
    const probe = spawnSync(binary, ['--probe'], { encoding: 'utf8', timeout: 2000, env: { PATH: '/usr/bin:/bin' } });
    return cached = { key, available: probe.status === 0, reason: probe.status === 0 ? undefined : 'Kernel denied the required Landlock parser sandbox. Parsing remains disabled; fixture-only transformations do not qualify containment.' };
}
export interface ParseResult {
    result: any;
    output?: Buffer;
}
export async function parseDocument(family: string, args: any, inputs: Buffer[] = [], signal?: AbortSignal): Promise<ParseResult> {
    const available = parserAvailability();
    check(available.available, 'CAPABILITY_UNAVAILABLE', available.reason ?? 'Parser unavailable');
    check(inputs.reduce((n, b) => n + b.length, 0) <= 100 * 1024 * 1024, 'LIMIT_EXCEEDED', 'Document inputs exceed 100 MiB');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-parser-'));
    fs.chmodSync(dir, 0o700);
    let child: ReturnType<typeof spawn> | undefined;
    try {
        const staged = inputs.map((b, i) => { const p = path.join(dir, 'input' + i); fs.writeFileSync(p, b, { mode: 0o600 }); return p; });
        const output = path.join(dir, family === 'pdf' && args.mode === 'render' ? 'output.png' : 'output');
        const payload = { ...args, family, input: staged[0], additionalInputs: staged.slice(1), output };
        const python = path.resolve(process.env.PORTAL_PYTHON ?? '/usr/local/bin/python3'), script = path.join(ROOT, 'packages/capabilities/src/documents/worker.py');
        // These are trusted runtime installation roots, never workspace or credential roots.
        const readRoots = [python, path.dirname(path.dirname(python)), path.dirname(script), '/usr/lib', '/usr/local/lib', '/lib', '/lib64', '/usr/share/fonts', '/usr/share/fontconfig', '/etc/fonts', '/etc/ld.so.cache', '/dev/null', '/dev/urandom'].filter(p => fs.existsSync(p));
        let command: string, argv: string[];
        if (process.platform === 'darwin') {
            const prefixes = [path.dirname(path.dirname(python)), '/System/Library', '/usr/lib', '/Library/Frameworks/Python.framework', path.dirname(script), '/usr/share', '/dev/null', '/dev/urandom'].filter(p => fs.existsSync(p));
            const quote = (s: string) => JSON.stringify(s);
            const policy = `(version 1)(deny default)(allow process-exec (literal ${quote(python)}))(allow process-fork)(allow sysctl-read)(allow mach-lookup)(allow file-read* ${prefixes.map(p => `(subpath ${quote(p)})`).join(' ')} (subpath ${quote(dir)}))(allow file-write* (subpath ${quote(dir)}))(deny network*)`;
            const profile = path.join(dir, 'profile.sb');
            fs.writeFileSync(profile, policy, { mode: 0o600 });
            command = '/usr/bin/sandbox-exec';
            argv = ['-f', profile, python, '-I', script];
        }
        else {
            command = path.join(ROOT, 'native/parser-sandbox/build/parser-sandbox');
            argv = [...readRoots.flatMap(p => ['--read', p]), '--write', dir, '--', python, '-I', script];
        }
        const result = await new Promise<any>((resolve, reject) => { const chunks: Buffer[] = []; let bytes = 0, diagnostics = ''; child = spawn(command, argv, { cwd: dir, env: { PATH: '/usr/bin:/bin', HOME: dir, TMPDIR: dir, LANG: 'C.UTF-8', PYTHONDONTWRITEBYTECODE: '1' }, stdio: ['pipe', 'pipe', 'pipe'] }); const kill = () => child?.kill('SIGKILL'), timer = setTimeout(kill, 30000); const onabort = () => kill(); signal?.addEventListener('abort', onabort, { once: true }); child.stdout!.on('data', b => { bytes += b.length; if (bytes > 4 * 1024 * 1024) {
            kill();
            return;
        } chunks.push(b); }); child.stderr!.on('data', b => { diagnostics = (diagnostics + b.toString()).slice(-4000); }); child.once('error', reject); child.once('close', (code, sig) => { clearTimeout(timer); signal?.removeEventListener('abort', onabort); if (sig || bytes > 4 * 1024 * 1024)
            return reject(new PortalError(signal?.aborted ? 'CANCEL_REQUESTED' : 'LIMIT_EXCEEDED', 'Parser terminated by cancellation, timeout or output limit')); try {
            const v = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            if (v.error)
                reject(new PortalError('PARSER_FAILED', v.error.message));
            else if (code !== 0)
                reject(new PortalError('PARSER_FAILED', 'Parser failed', { diagnostic: diagnostics }));
            else
                resolve(v);
        }
        catch {
            reject(new PortalError('PARSER_FAILED', 'Parser did not return valid bounded JSON', { diagnostic: diagnostics }));
        } }); child.stdin!.on('error', () => { }); child.stdin!.end(JSON.stringify(payload)); });
        if (fs.existsSync(output)) {
            const st = fs.statSync(output);
            check(st.isFile() && st.size <= 100 * 1024 * 1024, 'LIMIT_EXCEEDED', 'Parser output too large');
            return { result, output: fs.readFileSync(output) };
        }
        return { result };
    }
    finally {
        child?.kill('SIGKILL');
        fs.rmSync(dir, { recursive: true, force: true });
    }
}
