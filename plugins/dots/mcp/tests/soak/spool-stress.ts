import fs from 'node:fs';
import path from 'node:path';
import { fixture, seedJob } from '../support/fixture.js';
import { OutputSpool } from '../../packages/capabilities/src/terminal/spool.js';
const f = await fixture(), bytes = Number(process.env.PORTAL_STRESS_BYTES ?? 1073741824), started = performance.now(), samples: any[] = [];
try {
    const job = seedJob(f), spool = new OutputSpool(f.store, 4 * 1024 * 1024, 8 * 1024 * 1024), block = Buffer.alloc(1048576, 65);
    for (let done = 0; done < bytes; done += block.length) {
        spool.append(job.jobId, 'stdout', block.subarray(0, Math.min(block.length, bytes - done)));
        if (done % (32 * 1048576) === 0)
            samples.push({ written: done + block.length, elapsedMs: performance.now() - started, rss: process.memoryUsage().rss, retainedBytes: f.store.one('SELECT COALESCE(SUM(end_offset-start_offset),0) n FROM job_output_segments WHERE evicted=0').n });
    }
    const result = spool.read(f.ws.workspaceId, job.jobId, null, 65536);
    const report = { suite: 'spool-generated-output', generatedBytes: bytes, durationMs: performance.now() - started, retainedBytes: f.store.one('SELECT SUM(end_offset-start_offset) n FROM job_output_segments WHERE evicted=0').n, committedEndOffset: result.committedEndOffset, retainedStartOffset: result.retainedStartOffset, omittedRanges: result.omittedRanges, baselineRss: samples[0]?.rss, peakRss: Math.max(...samples.map(x => x.rss)), samples, qualification: 'Spool component only. Does not prove sandboxed producer cancellation, transport responsiveness or a 72-hour soak.' };
    console.log(JSON.stringify(report, null, 2));
    if (report.retainedBytes > 4 * 1048576 || report.committedEndOffset !== bytes || !result.truncated)
        process.exitCode = 1;
}
finally {
    await f.close();
}
