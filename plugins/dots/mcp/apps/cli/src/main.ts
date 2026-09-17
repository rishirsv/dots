import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { runtimeDir, callIpc } from '../../../packages/core/src/ipc.js';
import { check, PortalError, sha, id, sleep } from '../../../packages/protocol/src/index.js';
import { SecretStore } from '../../../packages/core/src/secrets.js';
const ROOT = path.resolve(import.meta.dirname, '../../../..');
export const stateDir = path.resolve(process.env.PORTAL_STATE ?? (process.platform === 'darwin' ? path.join(os.homedir(), 'Library/Application Support/Portal') : path.join(os.homedir(), '.local/share/portal')));
const args = process.argv.slice(2);
function flag(name: string, fallback?: string) { const n = args.indexOf('--' + name); return n < 0 ? fallback : args[n + 1]; }
const has = (name: string) => args.includes('--' + name);
function print(value: any) { console.log(typeof value === 'string' ? value : JSON.stringify(value, null, 2)); }
function releaseDigest(entries: string[]) {
    const files: string[] = [];
    const visit = (absolute: string, relative: string) => {
        const stat = fs.lstatSync(absolute);
        if (stat.isSymbolicLink()) {
            files.push(`${relative}\0link:${fs.readlinkSync(absolute)}`);
            return;
        }
        if (stat.isDirectory()) {
            for (const entry of fs.readdirSync(absolute).sort())
                visit(path.join(absolute, entry), path.join(relative, entry));
            return;
        }
        if (stat.isFile())
            files.push(`${relative}\0${sha(fs.readFileSync(absolute))}`);
    };
    for (const entry of entries) {
        const absolute = path.join(ROOT, entry);
        if (fs.existsSync(absolute))
            visit(absolute, entry);
    }
    return sha(files.join('\n'));
}
async function owner(method: string, arguments_: any = {}) { const token = fs.readFileSync(path.join(stateDir, 'secrets', 'admin'), 'utf8'); const result = await callIpc(path.join(runtimeDir(stateDir), 'admin.sock'), token, method, arguments_, 35000); if (result?.error)
    throw new PortalError(result.error.code, result.error.message, result.error.details); return result; }
async function start() { fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 }); try {
    return await owner('status');
}
catch { } const log = fs.openSync(path.join(stateDir, 'agent.log'), 'a', 0o600); const child = spawn(process.execPath, [path.join(ROOT, 'dist/apps/agent/src/main.js'), stateDir], { detached: true, stdio: ['ignore', log, log], env: { PATH: process.env.PATH ?? '/usr/bin:/bin', HOME: os.homedir(), LANG: 'en_US.UTF-8', TMPDIR: os.tmpdir(), ...(process.env.PORTAL_PYTHON ? { PORTAL_PYTHON: process.env.PORTAL_PYTHON } : {}) } }); fs.closeSync(log); child.unref(); for (let i = 0; i < 60; i++) {
    await sleep(100);
    try {
        return await owner('status');
    }
    catch { }
} throw new PortalError('DEVICE_OFFLINE', 'Agent did not become ready; inspect the protected agent log'); }
function plistPath() { return path.join(os.homedir(), 'Library/LaunchAgents/local.portal.agent.plist'); }
function bootout() { if (process.platform === 'darwin' && fs.existsSync(plistPath()))
    spawnSync('/bin/launchctl', ['bootout', `gui/${process.getuid?.()}`, plistPath()], { stdio: 'ignore', timeout: 10000 }); }
async function install() { check(process.platform === 'darwin' || has('development'), 'CAPABILITY_UNAVAILABLE', 'Per-user installation targets macOS; --development is for disposable Linux verification'); fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 }); const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')); const release = path.join(stateDir, 'runtime/releases', `${packageJson.version}-${releaseDigest(['dist', 'packages', 'native', 'skills', 'migrations', 'manifests', 'bin', 'package.json', 'package-lock.json', 'compatibility']).slice(0, 12)}`); if (!fs.existsSync(release)) {
    fs.mkdirSync(release, { recursive: true, mode: 0o700 });
    for (const entry of ['dist', 'packages', 'native', 'skills', 'migrations', 'manifests', 'bin', 'package.json', 'node_modules', 'compatibility'])
        if (fs.existsSync(path.join(ROOT, entry)))
            fs.cpSync(path.join(ROOT, entry), path.join(release, entry), { recursive: true, dereference: false });
} const current = path.join(stateDir, 'runtime/current'); const staging = current + '.next'; try {
    fs.unlinkSync(staging);
}
catch { } fs.symlinkSync(release, staging); fs.renameSync(staging, current); const bin = path.join(os.homedir(), '.local/bin'); fs.mkdirSync(bin, { recursive: true }); const quoted = (s: string) => "'" + s.replaceAll("'", "'\\''") + "'"; fs.writeFileSync(path.join(bin, 'portal'), `#!/bin/sh\nexec ${quoted(process.execPath)} ${quoted(path.join(current, 'bin/portal.mjs'))} "$@"\n`, { mode: 0o755 }); if (has('start-at-login')) {
    check(process.platform === 'darwin', 'CAPABILITY_UNAVAILABLE', 'LaunchAgent installation requires macOS');
    const xml = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    fs.mkdirSync(path.dirname(plistPath()), { recursive: true });
    fs.writeFileSync(plistPath(), `<?xml version="1.0"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>local.portal.agent</string><key>ProgramArguments</key><array><string>${xml(process.execPath)}</string><string>${xml(path.join(current, 'dist/apps/agent/src/main.js'))}</string><string>${xml(stateDir)}</string></array><key>RunAtLoad</key><true/><key>KeepAlive</key><true/><key>StandardOutPath</key><string>${xml(path.join(stateDir, 'agent.log'))}</string><key>StandardErrorPath</key><string>${xml(path.join(stateDir, 'agent.log'))}</string></dict></plist>`, { mode: 0o600 });
} return { installed: true, release, launcher: path.join(bin, 'portal'), startAtLogin: has('start-at-login'), next: 'portal start; portal doctor; grant only a disposable fixture root initially' }; }
async function pair() { const origin = new URL(flag('relay')!); const test = has('test'); check(origin.protocol === 'https:' || (test && ['127.0.0.1', 'localhost'].includes(origin.hostname)), 'FORBIDDEN', 'Production pairing requires HTTPS'); check(origin.pathname === '/' && !origin.username && !origin.password && !origin.search && !origin.hash, 'INVALID_ARGUMENT', 'Supply a relay origin, not a path or credentials'); const identity = await owner('identity'), key = randomBytes(32).toString('base64url'), poll = randomBytes(32).toString('base64url'), ref = 'device-' + id('key'), secrets = new SecretStore(stateDir, test); secrets.put(ref, key); const body = { installationId: identity.installation_id, label: identity.label, credentialHash: sha(key), pollingHash: sha(poll), fingerprint: sha(key).slice(0, 16) }; const start = await fetch(new URL('/device/pair/start', origin), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); check(start.ok, 'FORBIDDEN', 'Pairing intent was not accepted'); const intent: any = await start.json(); print({ pairingId: intent.pairingId, code: intent.code, fingerprint: body.fingerprint, ownerUrl: intent.ownerUrl }); const until = Date.now() + 600000; while (Date.now() < until) {
    await sleep(2000);
    const res = await fetch(new URL('/device/pair/status/' + intent.pairingId, origin), { headers: { Authorization: 'Bearer ' + poll } });
    check(res.ok, 'FORBIDDEN', 'Pairing polling failed');
    const result: any = await res.json();
    if (result.state === 'approved')
        return owner('pair.bind', { deviceId: result.deviceId, accountId: result.accountId, generation: result.generation, credentialRef: ref, relay: origin.origin, testProfile: test });
    check(!['expired', 'denied'].includes(result.state), 'FORBIDDEN', 'Pairing was denied or expired');
} throw new PortalError('GRANT_EXPIRED', 'Pairing expired; local pending key remains protected for explicit cleanup'); }
async function migrate() { const source = fs.realpathSync(flag('source')!), found: any[] = []; const stack = [source]; while (stack.length) {
    const dir = stack.pop()!;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isSymbolicLink() || ['node_modules', '.git'].includes(e.name))
            continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) {
            check(found.length < 10000, 'LIMIT_EXCEEDED', 'Migration inventory too large');
            stack.push(p);
        }
        else if (/\.(md|json|js|ts)$/.test(e.name) && fs.statSync(p).size < 1048576) {
            const text = fs.readFileSync(p, 'utf8');
            if (/dots-advisor|advisor\.js|consultation|call finish/.test(text))
                found.push({ path: path.relative(source, p), sha256: sha(text), wouldChange: false });
        }
    }
} check(!has('apply'), 'CAPABILITY_UNAVAILABLE', 'Live legacy edits are not automated in this release; inventory is read-only and requires a separate reviewed patch'); return { dryRun: true, source, files: found, credentialsCopied: false, legacyServiceChanged: false }; }
async function main() {
    const command = args[0];
    if (!command || command === 'help' || has('help'))
        return print('Portal\n\nportal install [--start-at-login]\nportal start | status | restart | stop | doctor\nportal mcp --stdio\nportal configure transport --mode local|tunnel|relay\nportal configure python --path /absolute/venv/bin/python3\nportal configure tunnel --tunnel-id ID --key-ref REF\nportal pair --relay https://relay.example\nportal grant add --root PATH --alias NAME --access read|write [--network enabled] [--families files,search,terminal,jobs,code,skills,documents,images,artifacts,instructions,tasks]\nportal grant list | revoke ID\nportal skills add-root PATH --alias NAME | list | refresh\nportal approval list | approve ID\nportal call TOOL --json JSON\nportal jobs list | inspect ID | output ID | cancel ID --workspace ID\nportal executor qualify --binary /absolute/codex\nportal diagnostics export --output PATH\nportal backup --output PATH\nportal migrate advisor --source PATH\nportal uninstall [--delete-data]');
    if (command === 'install')
        return print(await install());
    if (command === 'start')
        return print(await start());
    if (command === 'status' || command === 'doctor')
        return print(await owner(command === 'doctor' ? 'diagnostics' : 'status'));
    if (command === 'stop') {
        bootout();
        return print(await owner('stop'));
    }
    if (command === 'restart') {
        bootout();
        try {
            await owner('restart');
        }
        catch { }
        await sleep(300);
        return print(await start());
    }
    if (command === 'mcp') {
        const { runStdio } = await import('../../mcp-local/src/main.js');
        return runStdio(stateDir);
    }
    if (command === 'call')
        return print(await owner('call', { tool: args[1], arguments: JSON.parse(flag('json', '{}')!) }));
    if (command === 'grant') {
        if (args[1] === 'list')
            return print(await owner('grant.list'));
        if (args[1] === 'revoke')
            return print(await owner('grant.revoke', { grantId: args[2] }));
        return print(await owner('grant.add', { root: flag('root'), alias: flag('alias'), access: flag('access', 'read'), network: flag('network') === 'enabled', ...(flag('families') ? { families: flag('families')!.split(',') } : {}), ...(flag('toolchain-roots') ? { toolchainRoots: flag('toolchain-roots')!.split(',') } : {}), ...(flag('max-job-ms') ? { maxJobMs: Number(flag('max-job-ms')) } : {}) }));
    }
    if (command === 'skills') {
        if (args[1] === 'add-root')
            return print(await owner('skills.add-root', { path: args[2], alias: flag('alias'), grantId: flag('grant-id') }));
        return print(await owner(args[1] === 'refresh' ? 'skills.refresh' : 'skills.list'));
    }
    if (command === 'approval')
        return print(await owner(args[1] === 'approve' ? 'approval.approve' : 'approval.list', { approvalId: args[2] }));
    if (command === 'configure') {
        const key = args[1], value = key === 'transport' ? flag('mode') : key === 'python' ? flag('path') : key === 'tunnel' ? { tunnelId: flag('tunnel-id'), keyRef: flag('key-ref') } : undefined;
        check(value, 'INVALID_ARGUMENT', 'Missing configuration');
        return print(await owner('configure', { key, value }));
    }
    if (command === 'pair')
        return print(await pair());
    if (command === 'jobs') {
        const ws = flag('workspace');
        check(ws, 'INVALID_ARGUMENT', 'Supply --workspace ID');
        const sub = args[1], tool = sub === 'output' ? 'read_output' : sub === 'cancel' ? 'cancel_job' : 'invoke';
        const capability = sub === 'list' ? 'jobs.list' : 'jobs.get';
        if (tool !== 'invoke')
            return print(await owner('call', { tool, arguments: { workspaceId: ws, jobId: args[2], ...(sub === 'cancel' ? { idempotencyKey: id('cancel') } : {}) } }));
        const desc: any = await owner('call', { tool: 'describe', arguments: { workspaceId: ws, capabilityIds: [capability] } });
        return print(await owner('call', { tool: 'invoke', arguments: { workspaceId: ws, capabilityId: capability, revision: desc.data.capabilities[0].revision, arguments: sub === 'list' ? {} : { jobId: args[2] } } }));
    }
    if (command === 'executor') {
        const { qualifyCodex } = await import('../../../scripts/probe-codex.js');
        return print(await qualifyCodex(stateDir, flag('binary')!));
    }
    if (command === 'diagnostics') {
        const report = await owner('diagnostics');
        const output = path.resolve(flag('output', 'portal-diagnostics.json')!);
        fs.writeFileSync(output, JSON.stringify(report, null, 2), { mode: 0o600, flag: 'wx' });
        return print({ exported: output, includesContent: false, includesCredentials: false });
    }
    if (command === 'backup')
        return print(await owner('backup', { destination: path.resolve(flag('output')!) }));
    if (command === 'migrate')
        return print(await migrate());
    if (command === 'emergency-stop')
        return print(await owner('emergency-revoke'));
    if (command === 'unpair') {
        const identity = await owner('identity');
        if (has('revoke') && identity.credential_ref) {
            const key = new SecretStore(stateDir, has('test')).get(identity.credential_ref);
            const response = await fetch(identity.relay + '/device/unpair', { method: 'POST', headers: { Authorization: 'Bearer ' + key } });
            check(response.ok, 'DEVICE_OFFLINE', 'Remote revocation failed; local emergency-stop remains available');
        }
        return print(await owner('emergency-revoke'));
    }
    if (command === 'uninstall') {
        bootout();
        try {
            await owner('stop');
        }
        catch { }
        for (const p of [plistPath(), path.join(os.homedir(), '.local/bin/portal')])
            try {
                fs.unlinkSync(p);
            }
            catch { }
        if (has('delete-data'))
            fs.rmSync(stateDir, { recursive: true, force: true });
        else
            fs.rmSync(path.join(stateDir, 'runtime'), { recursive: true, force: true });
        return print({ uninstalled: true, dataPreserved: !has('delete-data') });
    }
    throw new PortalError('INVALID_ARGUMENT', 'Unknown command; use portal help');
}
main().catch(e => { console.error(JSON.stringify({ error: { code: e.code ?? 'IO_ERROR', message: e.message, details: e.details } }, null, 2)); process.exitCode = 1; });
