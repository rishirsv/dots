import type { LocalStore } from '../../storage/src/local.js';
import type { RootedFs } from './rooted-fs.js';
import type { Schema, Obj, Result } from '../../protocol/src/index.js';
export interface Actor {
    accountId: string;
    deviceId: string;
    scopes: string[];
    transport: 'local' | 'relay' | 'private';
    connectionEpoch?: number;
}
export interface CapabilityContext {
    store: LocalStore;
    workspace: any;
    grant: any;
    actor: Actor;
    fs: RootedFs;
    operationId: string;
    signal: AbortSignal;
    parentId?: string;
    invoke: (id: string, args: Obj, stepKey?: string) => Promise<Result>;
}
export type Effect = 'read' | 'write' | 'spawn' | 'network' | 'control';
export interface Capability {
    id: string;
    description: string;
    input: Schema;
    output: Schema;
    effect: Effect;
    family: string;
    revision: string;
    dependencies: string[];
    approval?: boolean;
    availability: () => {
        available: boolean;
        reason?: string;
    };
    handler: (ctx: CapabilityContext, args: Obj) => Promise<any> | any;
    examples?: unknown[];
}
