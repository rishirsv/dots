import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
export class PowerMonitor extends EventEmitter {
    private timer?: NodeJS.Timeout;
    private child?: ReturnType<typeof spawn>;
    start() { let wall = Date.now(), mono = performance.now(); this.timer = setInterval(() => { const w = Date.now(), m = performance.now(); if (w - wall > 45000 || Math.abs((w - wall) - (m - mono)) > 30000)
        this.emit('change', { type: 'elapsed-gap', wallGap: w - wall, monotonicGap: m - mono }); wall = w; mono = m; }, 10000); if (process.platform === 'darwin') {
        const binary = path.resolve(import.meta.dirname, '../../../..', 'native/macos/build/power');
        if (fs.existsSync(binary)) {
            this.child = spawn(binary, [], { env: { PATH: '/usr/bin:/bin' }, stdio: ['ignore', 'pipe', 'ignore'] });
            this.child.stdout?.on('data', b => { for (const line of b.toString().trim().split('\n'))
                try {
                    this.emit('change', JSON.parse(line));
                }
                catch { } });
            this.child.on('error', () => this.emit('change', { type: 'native-monitor-unavailable' }));
        }
    } }
    stop() { if (this.timer)
        clearInterval(this.timer); this.child?.kill(); }
}
