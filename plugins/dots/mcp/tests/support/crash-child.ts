/** Disposable fault injector. Never imported by production code. */
import fs from 'node:fs';
import path from 'node:path';
import { createApplication } from '../../packages/core/src/application.js';
import { sha } from '../../packages/protocol/src/index.js';
const [state, phase] = process.argv.slice(2), app = createApplication(state), actor = app.broker.localActor();
const ws = app.store.one("SELECT * FROM workspaces WHERE access='write' AND state='open'");
const kill = () => process.kill(process.pid, 'SIGKILL');
const accept = app.store.accept.bind(app.store), run = app.store.run.bind(app.store), finish = app.store.finish.bind(app.store);
app.store.accept = (p: any) => { if (phase === 'before-accept')
    kill(); const result = accept(p); if (phase === 'after-accept')
    kill(); return result; };
app.store.run = (sql: string, ...args: any[]) => { if (phase === 'after-rename' && sql.startsWith("UPDATE file_commits SET state='committed'"))
    kill(); const result = run(sql, ...args); if (phase === 'after-intent' && sql.startsWith('INSERT INTO file_commits'))
    kill(); return result; };
app.store.finish = (op: string, result: any) => { finish(op, result); if (phase === 'after-result')
    kill(); };
await app.broker.invoke(actor, { workspaceId: ws.id, writerEpoch: ws.writer_epoch, idempotencyKey: 'crash-append', capabilityId: 'files.append', arguments: { path: 'target', text: 'B', expectedSha256: sha('A') } });
app.store.close();
