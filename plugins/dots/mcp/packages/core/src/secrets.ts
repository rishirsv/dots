import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { check } from '../../protocol/src/index.js';
export class SecretStore {
    constructor(public stateDir: string, public testOnly = false) { }
    private helper() { return path.resolve(import.meta.dirname, '../../../..', 'native/macos/build/keychain'); }
    private file(ref: string) { check(/^[A-Za-z0-9_.:-]{1,150}$/.test(ref), 'INVALID_ARGUMENT', 'Invalid secret reference'); check(this.testOnly, 'CAPABILITY_UNAVAILABLE', 'Production credentials require macOS Keychain'); return path.join(this.stateDir, 'secrets', ref); }
    put(ref: string, value: string) { if (process.platform !== 'darwin') {
        fs.writeFileSync(this.file(ref), value, { mode: 0o600, flag: 'wx' });
        return;
    } const p = spawnSync(this.helper(), ['put', ref], { input: value, encoding: 'utf8', timeout: 30000, env: { PATH: '/usr/bin:/bin' } }); check(p.status === 0, 'CAPABILITY_UNAVAILABLE', 'Keychain write failed; no credential was logged'); }
    get(ref: string) { if (process.platform !== 'darwin')
        return fs.readFileSync(this.file(ref), 'utf8'); const p = spawnSync(this.helper(), ['get', ref], { encoding: 'utf8', maxBuffer: 8192, timeout: 30000, env: { PATH: '/usr/bin:/bin' } }); check(p.status === 0, 'CAPABILITY_UNAVAILABLE', 'Keychain credential is unavailable'); return p.stdout; }
    delete(ref: string) { if (process.platform !== 'darwin') {
        try {
            fs.unlinkSync(this.file(ref));
        }
        catch { }
        return;
    } const p = spawnSync(this.helper(), ['delete', ref], { encoding: 'utf8', timeout: 30000, env: { PATH: '/usr/bin:/bin' } }); check(p.status === 0, 'CAPABILITY_UNAVAILABLE', 'Keychain delete failed'); }
}
