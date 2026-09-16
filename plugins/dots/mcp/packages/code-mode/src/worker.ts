/** Model source is evaluated ONLY in QuickJS/WASM. This Node process is a bounded JSON bridge, never a V8 evaluator. */
import { getQuickJS } from 'quickjs-emscripten';
import readline from 'node:readline';
const input = readline.createInterface({ input: process.stdin });
let runtime: any, vm: any, pump: NodeJS.Timeout | undefined, wall: NodeJS.Timeout | undefined, done = false, seq = 0;
const pending = new Map<number, any>();
function send(value: any) { const encoded = JSON.stringify(value); if (Buffer.byteLength(encoded) > 1048576)
    throw new Error('Code bridge frame exceeds 1 MiB'); process.stdout.write(encoded + '\n'); }
function finish(message: any) { if (done)
    return; done = true; send(message); if (pump)
    clearInterval(pump); if (wall)
    clearTimeout(wall); for (const p of pending.values())
    p.dispose(); pending.clear(); try {
    vm?.dispose();
    runtime?.dispose();
}
catch { } process.exitCode = 0; input.close(); process.stdin.destroy(); }
input.on('line', (line: string) => {
    if (line.length > 1048576) {
        finish({ type: 'error', message: 'Input frame limit exceeded' });
        return;
    }
    void (async () => {
        const m = JSON.parse(line);
        if (m.type === 'reply') {
            const d = pending.get(m.id);
            if (!d)
                return;
            pending.delete(m.id);
            const h = vm.newString(JSON.stringify(m.result));
            d.resolve(h);
            h.dispose();
            d.dispose();
            return;
        }
        if (m.type !== 'start' || vm)
            return;
        const engine = await getQuickJS();
        runtime = engine.newRuntime();
        runtime.setMemoryLimit(32 * 1024 * 1024);
        runtime.setMaxStackSize(512 * 1024);
        const until = performance.now() + m.wallMs;
        runtime.setInterruptHandler(() => performance.now() > until);
        vm = runtime.newContext();
        const bridge = vm.newFunction('__portalBridge', (name: any, json: any) => { const capabilityId = vm.getString(name), args = vm.getString(json); if (Buffer.byteLength(args) > 262144)
            throw new Error('Bridge arguments too large'); const deferred = vm.newPromise(); const id = ++seq; pending.set(id, deferred); send({ type: 'call', id, capabilityId, arguments: JSON.parse(args) }); return deferred.handle; });
        vm.setProp(vm.global, '__portalBridge', bridge);
        bridge.dispose();
        const log = vm.newFunction('__portalLog', (text: any) => { send({ type: 'log', text: vm.getString(text).slice(0, 16384) }); return vm.undefined; });
        vm.setProp(vm.global, '__portalLog', log);
        log.dispose();
        const setup = `const portal=Object.create(null); const __bridge=globalThis.__portalBridge; const __log=globalThis.__portalLog; delete globalThis.__portalBridge; delete globalThis.__portalLog; const __caps=${JSON.stringify(m.capabilityIds)}; for(const id of __caps){ const parts=id.split('.'); let node=portal; for(const p of parts.slice(0,-1)){if(!node[p])node[p]=Object.create(null);node=node[p];} node[parts[parts.length-1]]=async (args={})=>{const result=JSON.parse(await __bridge(id,JSON.stringify(args)));if(result.error){const error=new Error(result.error.message);error.code=result.error.code;error.details=result.error.details;throw error;}return result.data;};} const __freeze=x=>{for(const v of Object.values(x))if(v&&typeof v==='object')__freeze(v);return Object.freeze(x);};__freeze(portal);const console=Object.freeze({log:(...x)=>__log(JSON.stringify(x)),warn:(...x)=>__log(JSON.stringify(x)),error:(...x)=>__log(JSON.stringify(x))});const sleep=async(ms)=>{if(!Number.isInteger(ms)||ms<0||ms>1000)throw new Error('sleep accepts 0..1000 ms');const r=JSON.parse(await __bridge('$sleep',JSON.stringify({ms})));if(r.error)throw new Error(r.error.message);};`;
        let result = vm.evalCode(setup + '\n(async()=>{' + m.code + '\n})().then(value=>JSON.stringify(value===undefined?null:value))', 'portal-code.js');
        if (result.error) {
            const error = vm.dump(result.error);
            result.error.dispose();
            finish({ type: 'error', message: String(error?.message ?? error) });
            return;
        }
        const handle = result.value;
        const resolved = vm.resolvePromise(handle);
        pump = setInterval(() => { if (done)
            return; try {
            const p = runtime.executePendingJobs(100);
            if (p.error) {
                const e = vm.dump(p.error);
                p.error.dispose();
                finish({ type: 'error', message: String(e?.message ?? e) });
            }
        }
        catch (e) {
            finish({ type: 'error', message: e instanceof Error ? e.message : 'Job pump failed' });
        } }, 2);
        wall = setTimeout(() => finish({ type: 'error', message: 'Code wall deadline exceeded' }), m.wallMs + 50);
        resolved.then((value: any) => { try {
            if (value.error) {
                const e = vm.dump(value.error);
                value.error.dispose();
                handle.dispose();
                finish({ type: 'error', message: String(e?.message ?? e) });
            }
            else {
                const json = vm.getString(value.value);
                value.value.dispose();
                handle.dispose();
                if (Buffer.byteLength(json) > 1040000)
                    throw new Error('Return value exceeds artifact limit');
                finish({ type: 'result', value: JSON.parse(json) });
            }
        }
        catch (e) {
            finish({ type: 'error', message: e instanceof Error ? e.message : 'Code return value is not JSON' });
        } }).catch((e: any) => finish({ type: 'error', message: String(e) }));
    })().catch(e => finish({ type: 'error', message: e instanceof Error ? e.message : 'Code worker failed' }));
});
process.stdin.on('end', () => { if (!done)
    finish({ type: 'error', message: 'Parent bridge disconnected' }); });
