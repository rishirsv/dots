import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { CodexClient, REQUIRED_PROBES, safeEnvironment, sandboxPolicy } from '../packages/codex-adapter/src/index.js';
import { sha, requestHash, id, check, sleep } from '../packages/protocol/src/index.js';
/** Local-owner-only qualification. Missing evidence never becomes a true capability flag. */
export async function qualifyCodex(stateDir: string, binary: string) {
    fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
    const report: any = { qualified: false, platform: process.platform, arch: process.arch, verifiedAt: new Date().toISOString(), probes: Object.fromEntries(REQUIRED_PROBES.map(x => [x, false])), evidence: [], noInference: true };
    let client: CodexClient | undefined;
    let fixture: string | undefined;
    let listener: http.Server | undefined;
    try {
        check(binary && path.isAbsolute(binary), 'INVALID_ARGUMENT', 'Supply the absolute native Codex binary path');
        binary = fs.realpathSync(binary);
        const data = fs.readFileSync(binary);
        check(data[0] !== 35, 'EXECUTOR_UPGRADE_REQUIRED', 'Pass the native binary rather than an npm/shell wrapper so its actual executable hash is pinned');
        report.binary = binary;
        report.binarySha256 = sha(data);
        const version = spawnSync(binary, ['--version'], { encoding: 'utf8', timeout: 10000, env: { PATH: '/usr/bin:/bin', HOME: os.homedir() } });
        check(version.status === 0, 'EXECUTOR_UPGRADE_REQUIRED', 'Codex --version failed');
        report.version = version.stdout.trim();
        const generated = path.join(stateDir, 'generated/codex');
        fs.mkdirSync(generated, { recursive: true, mode: 0o700 });
        for (const [kind, sub] of [['generate-ts', 'typescript'], ['generate-json-schema', 'json']]) {
            const out = path.join(generated, sub);
            fs.mkdirSync(out, { recursive: true });
            const p = spawnSync(binary, ['app-server', kind, '--out', out], { encoding: 'utf8', timeout: 30000, maxBuffer: 1048576, env: { PATH: '/usr/bin:/bin', HOME: os.homedir() } });
            check(p.status === 0, 'EXECUTOR_UPGRADE_REQUIRED', `Exact binary schema generation failed: ${kind}`);
        }
        const files: string[] = [];
        const walk = (dir: string) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const p = path.join(dir, e.name);
            e.isDirectory() ? walk(p) : files.push(p);
        } };
        walk(generated);
        const text = files.map(p => fs.readFileSync(p, 'utf8')).join('\n');
        check(['readOnlyAccess', 'readableRoots', 'streamStdoutStderr', 'processId', 'deltaBase64', 'disableOutputCap'].every(x => text.includes(x)), 'EXECUTOR_UPGRADE_REQUIRED', 'Generated schemas lack required restricted execution/control fields');
        report.schemaSha256 = requestHash(files.sort().map(p => [path.relative(generated, p), sha(fs.readFileSync(p))]));
        report.schemaDirectory = generated;
        fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-qualify-'));
        fs.mkdirSync(fixture + '/root');
        fs.mkdirSync(fixture + '/scratch');
        fs.writeFileSync(fixture + '/outside-secret', 'portal-denial-control');
        fs.writeFileSync(fixture + '/root/inside', 'portal-inside');
        const root = fs.realpathSync(fixture + '/root'), scratch = fs.realpathSync(fixture + '/scratch');
        client = new CodexClient(binary, safeEnvironment({}, os.homedir()));
        await client.start();
        const policy = sandboxPolicy(root, scratch, [], true, false);
        const probe = async (name: string, fn: () => Promise<boolean>) => { try {
            const passed = await fn();
            report.probes[name] = passed;
            report.evidence.push({ name, passed });
        }
        catch (e) {
            report.evidence.push({ name, passed: false, error: e instanceof Error ? e.message : 'Probe failed' });
        } };
        const exec = async (command: string[], sandbox = policy, extra: any = {}) => client!.call('command/exec', { command, cwd: root, sandboxPolicy: sandbox, timeoutMs: 5000, ...extra }, 10000);
        await probe('argv', async () => { const r = await exec(['/bin/echo', 'literal; $(whoami)', 'two words']); return r.exitCode === 0 && r.stdout.trim() === 'literal; $(whoami) two words'; });
        await probe('cwd', async () => { const r = await exec(['/bin/pwd']); return r.exitCode === 0 && fs.realpathSync(r.stdout.trim()) === root; });
        await probe('read-denied', async () => { const good = await exec(['/bin/cat', root + '/inside']), bad = await exec(['/bin/cat', fixture + '/outside-secret']); return good.exitCode === 0 && bad.exitCode !== 0 && !String(bad.stdout).includes('portal-denial-control'); });
        await probe('write-denied', async () => { const r = await exec(['/usr/bin/touch', fixture + '/escaped']); return r.exitCode !== 0 && !fs.existsSync(fixture + '/escaped'); });
        await probe('read-only-write-denied', async () => { const r = await exec(['/usr/bin/touch', root + '/read-only-escape'], sandboxPolicy(root, scratch, [], false, false)); return r.exitCode !== 0 && !fs.existsSync(root + '/read-only-escape'); });
        let requests = 0;
        listener = http.createServer((_req, res) => { requests++; res.end('network-control'); });
        await new Promise<void>(resolve => listener!.listen(0, '127.0.0.1', resolve));
        const port = (listener.address() as any).port;
        await fetch(`http://127.0.0.1:${port}`);
        const positive = requests;
        await probe('network-denied', async () => { const r = await exec(['/usr/bin/curl', '--connect-timeout', '1', '--max-time', '2', `http://127.0.0.1:${port}`]); return r.exitCode !== 0 && requests === positive; });
        const collect = async (command: string[], action?: (processId: string) => Promise<void>, tty = false) => { const processId = id('probe'), streams: {
            stdout: Buffer[];
            stderr: Buffer[];
        } = { stdout: [], stderr: [] }; let bytes = 0; const output = (p: any) => { if (p.processId !== processId)
            return; bytes += Buffer.byteLength(p.deltaBase64 ?? '', 'base64'); if (bytes <= 2 * 1024 * 1024 && (p.stream === 'stdout' || p.stream === 'stderr'))
            streams[p.stream as 'stdout' | 'stderr'].push(Buffer.from(p.deltaBase64, 'base64')); }; client!.on('output', output); try {
            const pending = exec(command, policy, { processId, streamStdoutStderr: true, disableOutputCap: true, tty, size: { rows: 24, cols: 80 } });
            if (action) {
                await sleep(150);
                await action(processId);
            }
            const result = await pending;
            return { result, bytes, stdout: Buffer.concat(streams.stdout).toString(), stderr: Buffer.concat(streams.stderr).toString() };
        }
        finally {
            client!.off('output', output);
        } };
        await probe('stdout-stderr', async () => { const r = await collect(['/bin/sh', '-c', 'printf stdout; printf stderr >&2; exit 7']); return r.result.exitCode === 7 && r.stdout === 'stdout' && r.stderr === 'stderr'; });
        await probe('output-stream', async () => { const r = await collect(['/usr/bin/head', '-c', '1048576', '/dev/zero']); return r.result.exitCode === 0 && r.bytes === 1048576; });
        await probe('stdin-eof', async () => { const r = await collect(['/bin/cat'], p => client!.call('command/exec/write', { processId: p, deltaBase64: Buffer.from('portal-stdin\n').toString('base64'), closeStdin: true })); return r.result.exitCode === 0 && r.stdout === 'portal-stdin\n'; });
        await probe('pty', async () => { const r = await collect(['/bin/sh', '-c', 'test -t 0 && stty size'], undefined, true); return r.result.exitCode === 0 && /24\s+80/.test(r.stdout); });
        await probe('resize', async () => { const r = await collect(['/bin/sh', '-c', 'test -t 0 || exit 23; read answer; stty size'], async (p) => { await client!.call('command/exec/resize', { processId: p, size: { rows: 42, cols: 120 } }); await client!.call('command/exec/write', { processId: p, deltaBase64: Buffer.from('\n').toString('base64') }); }, true); return r.result.exitCode === 0 && /42\s+120/.test(r.stdout); });
        await probe('cancel-descendants', async () => { const processId = id('cancel'), chunks: Buffer[] = []; const onOutput = (p: any) => { if (p.processId === processId)
            chunks.push(Buffer.from(p.deltaBase64, 'base64')); }; client!.on('output', onOutput); try {
            const pending = exec(['/bin/sh', '-c', 'sleep 60 & child=$!; printf "%s\\n" "$child"; wait'], policy, { processId, streamStdoutStderr: true });
            await sleep(300);
            const pid = Number(Buffer.concat(chunks).toString().trim());
            check(Number.isInteger(pid) && pid > 1, 'CAPABILITY_UNAVAILABLE', 'Could not identify disposable descendant');
            await client!.call('command/exec/terminate', { processId });
            await pending;
            await sleep(200);
            try {
                process.kill(pid, 0);
                return false;
            }
            catch (e) {
                return (e as any).code === 'ESRCH';
            }
        }
        finally {
            client!.off('output', onOutput);
        } });
        report.rpcTrace = client.trace;
        report.qualified = REQUIRED_PROBES.every(x => report.probes[x]);
        if (!report.qualified)
            report.blocker = 'One or more live sandbox/PTY/teardown probes failed; terminal capability stays unavailable';
    }
    catch (e) {
        report.blocker = e instanceof Error ? e.message : String(e);
    }
    finally {
        client?.stop();
        listener?.close();
        if (fixture)
            fs.rmSync(fixture, { recursive: true, force: true });
        fs.writeFileSync(path.join(stateDir, 'codex-qualification.json'), JSON.stringify(report, null, 2), { mode: 0o600 });
    }
    return report;
}
if (import.meta.url === new URL('file://' + process.argv[1]).href) {
    const report = await qualifyCodex(process.env.PORTAL_STATE ?? path.join(os.homedir(), 'Library/Application Support/Portal'), process.argv[2]);
    console.log(JSON.stringify(report, null, 2));
    if (!report.qualified)
        process.exitCode = 2;
}
