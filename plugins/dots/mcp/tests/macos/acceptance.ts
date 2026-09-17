/** Disposable physical-Mac execution check. Network/sleep disruption remains manual. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApplication } from '../../packages/core/src/application.js';
import { qualifyCodex } from '../../scripts/probe-codex.js';
import { until } from '../support/dependencies.js';
import { data } from '../support/fixture.js';
if (process.platform !== 'darwin' || process.arch !== 'arm64' || !process.env.PORTAL_CODEX_BINARY) {
    console.error(JSON.stringify({ status: 'blocked', reason: 'Requires an Apple Silicon Mac and PORTAL_CODEX_BINARY pointing to the native Codex executable. No fallback executor.' }));
    process.exit(2);
}
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-physical-mac-')), root = path.join(dir, 'root'), state = path.join(dir, 'state');
fs.mkdirSync(root);
const report: any = { platform: process.platform, arch: process.arch, node: process.version, checks: [], manualStillRequired: ['sleep/wake', 'Wi-Fi interruption', 'privacy-denied folder', 'iCloud placeholder stall', 'signed update', 'ChatGPT host scenarios', '72-hour soak'] };
let app: ReturnType<typeof createApplication> | undefined;
try {
    report.executor = await qualifyCodex(state, process.env.PORTAL_CODEX_BINARY!);
    if (!report.executor.qualified)
        throw new Error('Exact-native-executor qualification failed');
    app = createApplication(state);
    const actor = app.broker.localActor();
    app.broker.addGrant({ root, alias: 'physical-fixture', access: 'write', families: ['files', 'terminal', 'jobs', 'code', 'search', 'instructions'], toolchainRoots: ['/Applications/Xcode.app/Contents/Developer', '/Library/Developer/CommandLineTools'].filter(p => fs.existsSync(p)) });
    const ws = data(await app.frontDoor.call(actor, 'open_workspace', { deviceId: actor.deviceId, rootAlias: 'physical-fixture', access: 'write', idempotencyKey: 'open' }));
    fs.writeFileSync(path.join(root, 'Package.swift'), '// swift-tools-version: 5.9\nimport PackageDescription\nlet package = Package(name: "PortalFixture", products: [.library(name:"PortalFixture",targets:["PortalFixture"])], targets:[.target(name:"PortalFixture"), .testTarget(name:"PortalFixtureTests",dependencies:["PortalFixture"])])\n');
    fs.mkdirSync(path.join(root, 'Sources/PortalFixture'), { recursive: true });
    fs.writeFileSync(path.join(root, 'Sources/PortalFixture/Value.swift'), 'public func portalValue() -> Int { 7 }\n');
    fs.mkdirSync(path.join(root, 'Tests/PortalFixtureTests'), { recursive: true });
    fs.writeFileSync(path.join(root, 'Tests/PortalFixtureTests/ValueTests.swift'), 'import XCTest\n@testable import PortalFixture\nfinal class ValueTests:XCTestCase { func testValue(){ XCTAssertEqual(portalValue(),7) } }\n');
    for (const argv of [['/bin/sh', '-c', 'printf stdout; printf stderr >&2; exit 7'], ['/usr/bin/swift', 'test', '--scratch-path', '.build']]) {
        const started = await app.frontDoor.call(actor, 'exec_command', { workspaceId: ws.workspaceId, writerEpoch: ws.writerEpoch, idempotencyKey: 'command-' + report.checks.length, argv, cwd: '.', timeoutMs: 120000, yieldMs: 0 });
        data(started);
        const result = await until(() => app!.broker.getOperation(actor, { operationId: started.operationId }), r => !['accepted', 'running', 'queued'].includes(r.state ?? ''), 150000);
        const output = await app.frontDoor.call(actor, 'read_output', { workspaceId: ws.workspaceId, jobId: started.data.jobId, maxBytes: 65536 });
        report.checks.push({ argv, result, output });
        if (result.data.exitCode !== (argv[0] === '/bin/sh' ? 7 : 0))
            throw new Error('Unexpected command exit; inspect the exact required toolchain permissions');
    }
    report.status = 'passed-executed-subset';
}
catch (e) {
    report.status = 'failed';
    report.error = (e as Error).message;
    process.exitCode = 1;
}
finally {
    const output = path.resolve(process.env.PORTAL_MAC_EVIDENCE ?? 'tmp/macos.json');
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ status: report.status, evidence: output, fixture: dir }, null, 2));
    app?.store.close(); /* Keep fixture for diagnosis. Clean it explicitly after checking that no jobs remain. */
}
