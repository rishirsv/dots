/** Core mixed-workload soak. This does not qualify tunnel, command, or physical-Mac reliability. */
import fs from 'node:fs';
import path from 'node:path';
import { fixture, data } from '../support/fixture.js';
import { sha } from '../../packages/protocol/src/index.js';
const args = process.argv.slice(2), arg = (name: string, fallback: string) => { const i = args.indexOf('--' + name); return i < 0 ? fallback : args[i + 1]; };
const operations = Number(arg('operations', '10000')), seconds = Number(arg('seconds', '0')), output = path.resolve(arg('output', 'evidence/soak-core.json'));
if (!Number.isInteger(operations) || operations < 1 || operations > 100000000 || !Number.isFinite(seconds) || seconds < 0 || seconds > 259200)
    throw new Error('Bound operations and duration; max 72 hours');
const f = await fixture(), start = performance.now(), baseline = process.memoryUsage().rss, samples: any[] = [];
let i = 0, hash = f.put('counter.txt', '0'), last: any = null, peak = baseline;
const kinds: Record<string, number> = { read: 0, write: 0, duplicate: 0, stat: 0 };
let failure: string | undefined;
try {
    while (i < operations || performance.now() - start < seconds * 1000) {
        const n = i % 4;
        if (n === 0) {
            data(await f.call('files.read', { path: 'counter.txt' }));
            kinds.read++;
        }
        else if (n === 1) {
            const text = String(i), a = { path: 'counter.txt', text, expectedSha256: hash }, key = 'write-' + i;
            const r = await f.call('files.write', a, key);
            data(r);
            hash = sha(text);
            last = { a, key, operationId: r.operationId };
            kinds.write++;
        }
        else if (n === 2) {
            const r = await f.call('files.write', last.a, last.key);
            data(r);
            if (r.operationId !== last.operationId)
                throw new Error('Duplicate execution identity changed');
            kinds.duplicate++;
        }
        else {
            data(await f.call('files.stat', { path: 'counter.txt' }));
            kinds.stat++;
        }
        i++;
        if (i % 100 === 0) {
            const rss = process.memoryUsage().rss;
            peak = Math.max(peak, rss);
            samples.push({ operations: i, elapsedMs: performance.now() - start, rss, heapUsed: process.memoryUsage().heapUsed, spoolBytes: f.store.one('SELECT COALESCE(SUM(end_offset-start_offset),0) n FROM job_output_segments WHERE evicted=0').n });
            if (samples.length > 5000)
                samples.splice(1, 1);
            await new Promise(r => setTimeout(r, 1));
        }
    }
}
catch (e) {
    failure = (e as Error).message;
}
finally {
    const result = { suite: 'core-mixed-workload', complete: !failure, platform: process.platform, arch: process.arch, node: process.version, operations: i, kinds, durationMs: performance.now() - start, baselineRss: baseline, peakRss: peak, samples, failure, notQualified: ['72-hour mixed remote workload unless full duration is actually recorded', 'transport interruption recovery', 'sandboxed command execution', 'physical Mac sleep/wake'] };
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ ...result, samples: result.samples.length }, null, 2));
    await f.close();
    if (failure)
        process.exitCode = 1;
}
