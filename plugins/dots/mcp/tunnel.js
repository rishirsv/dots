import { fork, spawn } from 'node:child_process';
import { open, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The guardian outlives a crashed service just long enough to reap its tunnel.
export function startTunnel(config, runDir, port, onFailure) {
  return new Promise((resolve, reject) => {
    const guard = fork(fileURLToPath(import.meta.url), ['--guard'], { stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
    let ready = false;
    let stopping = false;
    guard.on('message', message => {
      if (message.ready) {
        ready = true;
        resolve({ close: () => {
          stopping = true;
          return new Promise(done => {
            if (guard.exitCode !== null || guard.signalCode !== null) return done();
            const timer = setTimeout(() => { guard.kill('SIGKILL'); done(); }, 4000);
            guard.once('exit', () => { clearTimeout(timer); done(); });
            if (guard.connected) guard.send({ stop: true });
          });
        } });
      } else if (message.error) {
        const error = new Error(message.error);
        if (!ready) reject(error);
        else if (!stopping) onFailure(error);
      }
    });
    guard.on('error', reject);
    guard.on('exit', code => {
      if (!ready) reject(new Error(`Tunnel failed to become ready (exit ${code}); see ${join(runDir, 'tunnel.log')}`));
      else if (!stopping) onFailure(new Error(`Tunnel exited (${code})`));
    });
    guard.send({ config, runDir, port });
  });
}

if (process.argv[2] === '--guard') {
  let child;
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    if (!child) return process.exit(0);
    child.kill('SIGTERM');
    const timer = setTimeout(() => child.kill('SIGKILL'), 2000);
    child.once('exit', () => { clearTimeout(timer); process.exit(0); });
    if (child.exitCode !== null) process.exit(0);
  };
  process.on('disconnect', stop);
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
  process.on('message', async message => {
    if (message.stop) return stop();
    if (child || stopping) return;
    const { config, runDir, port } = message;
    try {
      const log = await open(join(runDir, 'tunnel.log'), 'a', 0o600);
      const healthFile = join(runDir, 'tunnel-health.url');
      child = spawn('tunnel-client', ['run',
        '--control-plane.tunnel-id', config.tunnelId,
        '--control-plane.api-key', config.keyRef,
        '--mcp.server-url', `http://127.0.0.1:${port}/mcp`,
        '--health.listen-addr', '127.0.0.1:0', '--health.url-file', healthFile,
      ], { stdio: ['ignore', log.fd, log.fd] });
      child.on('error', error => { process.send?.({ error: error.message }); child = undefined; stop(); });
      child.once('exit', code => {
        if (!stopping) {
          process.send?.({ error: `tunnel-client exited (${code}); see ${join(runDir, 'tunnel.log')}` });
          process.exit(1);
        }
      });
      await log.close();
      const deadline = Date.now() + 45000;
      while (!stopping && Date.now() < deadline) {
        try {
          const url = (await readFile(healthFile, 'utf8')).trim();
          const response = await fetch(`${url.replace(/\/$/, '')}/readyz`, { signal: AbortSignal.timeout(1000) });
          if (response.ok) { process.send?.({ ready: true }); return; }
        } catch {}
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      if (!stopping) { process.send?.({ error: `Tunnel readiness timed out; see ${join(runDir, 'tunnel.log')}` }); stop(); }
    } catch (error) { process.send?.({ error: error.message }); stop(); }
  });
}
