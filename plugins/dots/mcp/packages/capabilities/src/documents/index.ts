import path from 'node:path';
import { Registry } from '../../../core/src/registry.js';
import type { CapabilityContext } from '../../../core/src/types.js';
import { s, check, Schema } from '../../../protocol/src/index.js';
import { parseDocument, parserAvailability } from './parser.js';
import { putArtifact } from '../artifacts/index.js';
export async function documentText(bytes: Buffer, ext: string, signal?: AbortSignal) { return (await parseDocument(ext === '.docx' ? 'docx' : 'sheet', { mode: 'text' }, [bytes], signal)).result.text as string; }
export function addDocuments(r: Registry) {
    const pathInput = { path: s.path(), expectedSha256: s.sha() };
    const output = { outputPath: s.path(), expectedOutputSha256: s.nullable(s.sha()) };
    const cells = s.array(s.object({ cell: { ...s.string(12), pattern: '^[A-Z]{1,3}[1-9][0-9]{0,6}$' }, value: { anyOf: [s.string(32000), s.number(), s.bool(), { type: 'null' }] }, formula: s.string(8000), styleId: s.int(0, 100000), format: s.object({ bold: s.bool(), numberFormat: s.string(200) }, []) }, ['cell']), 10000);
    const define = (family: 'docx' | 'sheet' | 'pdf', mode: string, input: Schema, write = false) => r.add({ id: `documents.${family}.${mode}`, family: 'documents', effect: write ? 'write' : 'read', description: `${mode} ${family.toUpperCase()} with staged parser isolation, explicit source hashes and preservation diagnostics. PDF pages are one-based; sheet coordinates use A1.`, input, dependencies: ['python-parser', 'os-parser-containment'], availability: parserAvailability, handler: async (c, a) => {
            const inputs: Buffer[] = [];
            let sourceHash: string | undefined;
            if (a.path) {
                const src = c.fs.read(a.path);
                if (a.expectedSha256)
                    check(src.sha256 === a.expectedSha256, 'SOURCE_CHANGED', 'Document source changed');
                inputs.push(src.bytes);
                sourceHash = src.sha256;
                const ext = path.extname(a.path).toLowerCase();
                check(!(family === 'sheet' && ext === '.xls'), 'UNSUPPORTED_FORMAT', 'Legacy XLS parser is not established');
                check(!(family === 'sheet' && mode === 'edit' && ext === '.xlsm'), 'CAPABILITY_UNAVAILABLE', 'XLSM editing is unavailable; VBA preservation is not qualified');
            }
            for (const src of a.additionalSources ?? []) {
                const snap = c.fs.read(src.path);
                check(snap.sha256 === src.expectedSha256, 'SOURCE_CHANGED', 'PDF merge source changed');
                inputs.push(snap.bytes);
            }
            if (write) {
                check(a.outputPath, 'INVALID_ARGUMENT', 'A separate output path and output precondition are required');
                if (a.path)
                    check(a.path !== a.outputPath, 'FORBIDDEN', 'Document transforms preserve the source; choose a separate output path');
                check(c.fs.hash(a.outputPath) === a.expectedOutputSha256, 'WRITE_CONFLICT', 'Output precondition failed');
            }
            const { result, output: bytes } = await parseDocument(family, { ...a, mode }, inputs, c.signal);
            if (write) {
                check(bytes, 'PARSER_FAILED', 'Parser produced no document');
                const receipt = c.fs.write(a.outputPath, bytes, a.expectedOutputSha256, c.store, c.operationId);
                const mime = family === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : family === 'sheet' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf';
                return { ...result, sourceSha256: sourceHash, ...receipt, artifact: putArtifact(c.store, c.workspace.id, c.actor.accountId, bytes, mime) };
            }
            if (mode === 'render') {
                check(bytes, 'PARSER_FAILED', 'Parser produced no page image');
                const artifact = putArtifact(c.store, c.workspace.id, c.actor.accountId, bytes, 'image/png');
                return { ...result, sourceSha256: sourceHash, artifact, image: { mimeType: 'image/png', data: bytes.toString('base64') } };
            }
            return { ...result, sourceSha256: sourceHash };
        } });
    define('docx', 'inspect', s.object(pathInput, ['path']));
    define('docx', 'read', s.object({ ...pathInput, offset: s.int(0, 100000), limit: s.int(1, 200) }, ['path']));
    define('docx', 'create', s.object({ ...output, markdown: s.string(262144), paragraphs: s.array(s.object({ text: s.string(16000), style: s.enum('Normal', 'Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5', 'Heading6') }, ['text']), 1000), tables: s.array(s.array(s.array(s.string(16000), 100), 100), 20) }, ['outputPath', 'expectedOutputSha256']), true);
    define('docx', 'edit', s.object({ ...pathInput, ...output, edits: s.array(s.object({ locator: s.string(100), oldText: { ...s.string(32000), minLength: 1 }, newText: s.string(32000), expectedReplacements: s.int(1, 1000) }, ['locator', 'oldText', 'newText']), 100) }, ['path', 'expectedSha256', 'outputPath', 'expectedOutputSha256', 'edits']), true);
    define('sheet', 'inspect', s.object(pathInput, ['path']));
    define('sheet', 'read', s.object({ ...pathInput, sheet: s.string(31), range: s.string(30) }, ['path', 'sheet']));
    define('sheet', 'create', s.object({ ...output, sheets: s.array(s.object({ name: s.string(31), cells }, ['name']), 100, 1) }), true);
    define('sheet', 'edit', s.object({ ...pathInput, ...output, sheet: s.string(31), cells }), true);
    for (const mode of ['legacy_read', 'xlsm_edit'])
        r.add({ id: 'documents.sheet.' + mode, description: mode === 'legacy_read' ? 'Legacy XLS reading: baseline fidelity not established.' : 'Macro workbook edits: disabled until VBA preservation is proven.', input: s.object(pathInput, ['path']), effect: mode === 'xlsm_edit' ? 'write' : 'read', family: 'documents', availability: () => ({ available: false, reason: 'Format fidelity is not qualified for this release' }), handler: () => { throw new Error('Unreachable unavailable capability'); } });
    define('pdf', 'inspect', s.object(pathInput, ['path']));
    define('pdf', 'read', s.object({ ...pathInput, startPage: s.int(1, 2000), maxPages: s.int(1, 20) }, ['path']));
    define('pdf', 'render', s.object({ ...pathInput, page: s.int(1, 2000), maxEdge: s.int(64, 2048) }, ['path', 'page']));
    define('pdf', 'create', s.object({ ...output, markdown: s.string(262144) }), true);
    define('pdf', 'edit', s.object({ ...pathInput, ...output, additionalSources: s.array(s.object(pathInput), 20), pages: s.array(s.object({ source: s.int(0, 20), page: s.int(1, 2000) }, ['page']), 2000, 1) }, ['path', 'expectedSha256', 'outputPath', 'expectedOutputSha256', 'pages']), true);
}
