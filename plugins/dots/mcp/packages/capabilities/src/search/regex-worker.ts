import { parentPort } from 'node:worker_threads';
parentPort!.on('message', (m: {
    pattern: string;
    flags: string;
    lines: string[];
    limit: number;
}) => { try {
    const re = new RegExp(m.pattern, m.flags), indices: number[] = [];
    for (let i = 0; i < m.lines.length && indices.length < m.limit; i++)
        if (re.test(m.lines[i]))
            indices.push(i);
    parentPort!.postMessage({ indices });
}
catch (e) {
    parentPort!.postMessage({ error: e instanceof Error ? e.message : 'Invalid regex' });
} });
