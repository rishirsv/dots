/** A deliberately small JSON-Schema subset. The SAME tree validates and generates public schemas. */
export type Json = null | boolean | number | string | Json[] | {
    [key: string]: Json;
};
export type Obj = {
    [key: string]: any;
}; // JSON boundary values are validated before reaching capabilities.
export type Schema = {
    type?: string | string[];
    properties?: Record<string, Schema>;
    required?: string[];
    additionalProperties?: boolean | Schema;
    items?: Schema;
    enum?: Json[];
    const?: Json;
    anyOf?: Schema[];
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minimum?: number;
    maximum?: number;
    minItems?: number;
    maxItems?: number;
    description?: string;
    default?: Json;
    [key: string]: unknown;
};
export const s = {
    string: (max = 65536, desc?: string): Schema => ({ type: 'string', maxLength: max, ...(desc ? { description: desc } : {}) }),
    key: (): Schema => ({ type: 'string', minLength: 1, maxLength: 160, pattern: '^[A-Za-z0-9_.:@/+-]+$' }),
    path: (): Schema => ({ type: 'string', minLength: 1, maxLength: 4096, description: 'Root-relative UTF-8 path. No traversal or symlinks. Use . for the root.' }),
    bool: (): Schema => ({ type: 'boolean' }),
    int: (min = 0, max = Number.MAX_SAFE_INTEGER): Schema => ({ type: 'integer', minimum: min, maximum: max }),
    number: (): Schema => ({ type: 'number' }),
    enum: (...v: (string | string[])[]): Schema => ({ type: 'string', enum: v.flat() }),
    array: (items: Schema, max = 100, min = 0): Schema => ({ type: 'array', items, maxItems: max, minItems: min }),
    object: (properties: Record<string, Schema>, required = Object.keys(properties)): Schema => ({ type: 'object', properties, required, additionalProperties: false }),
    record: (values: Schema, max = 100): Schema => ({ type: 'object', additionalProperties: values, maxProperties: max }),
    nullable: (inner: Schema): Schema => ({ anyOf: [inner, { type: 'null' }] }),
    json: (): Schema => ({ description: 'Bounded JSON value; no functions or prototype-control keys.' }),
    sha: (): Schema => ({ type: 'string', pattern: '^[a-f0-9]{64}$', minLength: 64, maxLength: 64 }),
};
export class SchemaValidationError extends Error {
    readonly code = 'INVALID_ARGUMENT';
    constructor(message: string) { super(message); this.name = 'SchemaValidationError'; }
}
export const dangerous = new Set(['__proto__', 'prototype', 'constructor']);
export function safeJson(value: unknown, maxBytes = 1048576): void {
    let nodes = 0;
    function visit(v: any, depth: number) {
        if (++nodes > 100000 || depth > 64)
            throw new SchemaValidationError('JSON structure limit exceeded');
        if (v === null || typeof v === 'boolean' || typeof v === 'string')
            return;
        if (typeof v === 'number' && Number.isFinite(v))
            return;
        if (Array.isArray(v)) {
            for (const x of v)
                visit(x, depth + 1);
            return;
        }
        if (typeof v === 'object' && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null)) {
            for (const [k, x] of Object.entries(v)) {
                if (dangerous.has(k))
                    throw new SchemaValidationError('Unsafe control property');
                visit(x, depth + 1);
            }
            return;
        }
        throw new SchemaValidationError('Expected finite JSON value');
    }
    visit(value, 0);
    if (Buffer.byteLength(JSON.stringify(value)) > maxBytes)
        throw new SchemaValidationError('JSON byte limit exceeded');
}
export function validate(schema: Schema, value: unknown, path = '$'): void {
    const fail = (m: string): never => { throw new SchemaValidationError(`${path}: ${m}`); };
    if (schema.anyOf) {
        for (const x of schema.anyOf) {
            try {
                validate(x, value, path);
                return;
            }
            catch { }
        }
        fail('does not match any allowed shape');
    }
    if (schema.const !== undefined && value !== schema.const)
        fail('unexpected constant');
    if (schema.enum && !schema.enum.includes(value as Json))
        fail('unexpected enum value');
    if (schema.type === 'null') {
        if (value !== null)
            fail('expected null');
        return;
    }
    if (schema.type === 'object') {
        if (value === null || typeof value !== 'object' || Array.isArray(value))
            fail('expected object');
        const obj = value as Obj;
        const keys = Object.keys(obj);
        if (keys.length > Number(schema.maxProperties ?? 200))
            fail('too many properties');
        for (const k of schema.required ?? [])
            if (!Object.hasOwn(obj, k))
                fail('missing ' + k);
        for (const k of keys) {
            if (dangerous.has(k))
                fail('unsafe key');
            if (schema.properties?.[k])
                validate(schema.properties[k], obj[k], path + '.' + k);
            else if (schema.additionalProperties === false)
                fail('unknown field ' + k);
            else if (typeof schema.additionalProperties === 'object')
                validate(schema.additionalProperties, obj[k], path + '.' + k);
        }
        return;
    }
    if (schema.type === 'array') {
        if (!Array.isArray(value))
            fail('expected array');
        const arr = value as unknown[];
        if (arr.length < Number(schema.minItems ?? 0) || arr.length > Number(schema.maxItems ?? 10000))
            fail('array length out of bounds');
        arr.forEach((v, i) => schema.items && validate(schema.items, v, `${path}[${i}]`));
        return;
    }
    if (schema.type === 'string') {
        if (typeof value !== 'string')
            fail('expected string');
        const text = value as string;
        if (text.length < Number(schema.minLength ?? 0) || Buffer.byteLength(text) > Number(schema.maxLength ?? 1048576))
            fail('string byte length out of bounds');
        if (schema.pattern && !new RegExp(schema.pattern).test(text))
            fail('invalid string format');
        return;
    }
    if (schema.type === 'boolean' && typeof value !== 'boolean')
        fail('expected boolean');
    if (schema.type === 'number' || schema.type === 'integer') {
        if (typeof value !== 'number' || !Number.isFinite(value) || schema.type === 'integer' && !Number.isSafeInteger(value))
            fail('expected finite ' + schema.type);
        if ((value as number) < Number(schema.minimum ?? -Infinity) || (value as number) > Number(schema.maximum ?? Infinity))
            fail('number out of bounds');
    }
}
export function declaration(schema: Schema): string {
    if (schema.anyOf)
        return schema.anyOf.map(declaration).join(' | ');
    if (schema.enum)
        return schema.enum.map(x => JSON.stringify(x)).join(' | ');
    switch (schema.type) {
        case 'object': return '{ ' + Object.entries(schema.properties ?? {}).map(([k, v]) => `${JSON.stringify(k)}${schema.required?.includes(k) ? '' : '?'}: ${declaration(v)}`).join('; ') + (typeof schema.additionalProperties === 'object' ? `; [key:string]: ${declaration(schema.additionalProperties)}` : '') + ' }';
        case 'array': return `Array<${declaration(schema.items ?? {})}>`;
        case 'integer':
        case 'number': return 'number';
        case 'string': return 'string';
        case 'boolean': return 'boolean';
        case 'null': return 'null';
        default: return 'unknown';
    }
}
