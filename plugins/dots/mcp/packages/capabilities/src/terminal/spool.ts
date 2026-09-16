import fs from 'node:fs';
import path from 'node:path';
import { LocalStore } from '../../../storage/src/local.js';
import { check, id, sha, cursor, uncursor } from '../../../protocol/src/index.js';
export class OutputSpool {
    constructor(public store: LocalStore, public perJobBytes = 64 * 1024 * 1024, public totalBytes = 2 * 1024 * 1024 * 1024) { }
    append(jobId: string, stream: 'stdout' | 'stderr' | 'pty', bytes: Buffer) { for (let pos = 0; pos < bytes.length; pos += 65536) {
        const part = bytes.subarray(pos, pos + 65536), segment = id('segment'), name = path.join(this.store.dir, 'spool', segment);
        const fd = fs.openSync(name, 'wx', 0o600);
        try {
            fs.writeFileSync(fd, part);
            fs.fsyncSync(fd);
        }
        finally {
            fs.closeSync(fd);
        }
        this.store.tx(() => { const job = this.store.one('SELECT committed_end FROM jobs WHERE id=?', jobId); check(job, 'NOT_FOUND', 'Job missing'); this.store.run('INSERT INTO job_output_segments(id,job_id,stream,start_offset,end_offset,path,sha256,created_at) VALUES(?,?,?,?,?,?,?,?)', segment, jobId, stream, job.committed_end, job.committed_end + part.length, name, sha(part), Date.now()); this.store.run('UPDATE jobs SET committed_end=?,updated_at=? WHERE id=?', job.committed_end + part.length, Date.now(), jobId); });
        this.evict(jobId);
    } }
    private evict(jobId: string) { const evict = (rows: any[]) => { for (const s of rows) {
        this.store.run('UPDATE job_output_segments SET evicted=1 WHERE id=?', s.id);
        try {
            fs.unlinkSync(s.path);
        }
        catch { }
        const start = this.store.one('SELECT MIN(start_offset) n FROM job_output_segments WHERE job_id=? AND evicted=0', s.job_id).n;
        this.store.run('UPDATE jobs SET retained_start=COALESCE(?,committed_end) WHERE id=?', start, s.job_id);
        this.store.run('DELETE FROM job_output_segments WHERE id=? AND evicted=1', s.id);
    } }; const end = this.store.one('SELECT committed_end FROM jobs WHERE id=?', jobId).committed_end; evict(this.store.all('SELECT * FROM job_output_segments WHERE job_id=? AND evicted=0 AND end_offset<=? ORDER BY start_offset', jobId, end - this.perJobBytes)); let total = this.store.one('SELECT COALESCE(SUM(end_offset-start_offset),0) n FROM job_output_segments WHERE evicted=0').n; while (total > this.totalBytes) {
        const s = this.store.one('SELECT * FROM job_output_segments WHERE evicted=0 ORDER BY created_at,start_offset LIMIT 1');
        if (!s)
            break;
        evict([s]);
        total -= s.end_offset - s.start_offset;
    } }
    read(workspaceId: string, jobId: string, cursorValue?: string | null, maxBytes = 65536) {
        check(maxBytes > 0 && maxBytes <= 65536, 'INVALID_ARGUMENT', 'Output page is bounded at 64 KiB');
        const j = this.store.one('SELECT * FROM jobs WHERE id=? AND workspace_id=?', jobId, workspaceId);
        check(j, 'NOT_FOUND', 'Job not found in workspace');
        const c = uncursor(cursorValue);
        check(!c || (c.jobId === jobId && Number.isSafeInteger(c.offset) && c.offset >= 0), 'INVALID_ARGUMENT', 'Output cursor does not belong to this job');
        let offset = c?.offset ?? 0;
        const omittedRanges: any[] = [], chunks: any[] = [];
        if (offset < j.retained_start) {
            omittedRanges.push({ startOffset: offset, endOffset: j.retained_start, reason: 'retention-quota' });
            offset = j.retained_start;
        }
        const end = Math.min(j.committed_end, offset + maxBytes);
        for (const s of this.store.all('SELECT * FROM job_output_segments WHERE job_id=? AND end_offset>? AND start_offset<? ORDER BY start_offset', jobId, offset, end)) {
            const start = Math.max(s.start_offset, offset), stop = Math.min(s.end_offset, end);
            if (s.evicted) {
                omittedRanges.push({ startOffset: start, endOffset: stop, reason: 'retention-quota' });
                continue;
            }
            try {
                const b = fs.readFileSync(s.path);
                check(sha(b) === s.sha256, 'SOURCE_CHANGED', 'Output segment corrupted');
                const slice = b.subarray(start - s.start_offset, stop - s.start_offset);
                let text: string | undefined;
                try {
                    text = new TextDecoder('utf8', { fatal: true }).decode(slice);
                }
                catch { }
                chunks.push({ stream: s.stream, startOffset: start, endOffset: stop, ...(text === undefined ? { base64: slice.toString('base64'), encoding: 'base64' } : { text, encoding: 'utf8' }) });
            }
            catch {
                omittedRanges.push({ startOffset: start, endOffset: stop, reason: 'segment-unavailable' });
            }
        }
        return { jobId, jobState: j.state, chunks, retainedStartOffset: j.retained_start, committedEndOffset: j.committed_end, omittedRanges, exitCode: j.exit_code, signal: j.signal, nextCursor: cursor({ jobId, offset: end }), truncated: omittedRanges.length > 0 };
    }
}
