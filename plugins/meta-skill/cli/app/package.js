"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageProject = packageProject;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const lint_1 = require("./lint");
const project_1 = require("./project");
async function packageProject(options) {
    const root = await (0, project_1.requirePortableSkill)(options.project);
    const p = (0, project_1.projectPaths)(root);
    const releaseExists = await (0, project_1.exists)(node_path_1.default.join(p.releaseSkill, "SKILL.md"));
    const source = options.source || (releaseExists ? "release" : undefined);
    if (!source)
        throw new project_1.CliError("no release snapshot exists; pass --source candidate to package the current working payload");
    const sourceRoot = source === "release" ? p.releaseSkill : root;
    if (source === "candidate") {
        const lint = await (0, lint_1.lintProject)(root);
        if (!lint.ok)
            throw new project_1.CliError(`candidate package validation failed:\n${lint.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
    }
    else {
        const lint = await (0, lint_1.lintProject)(sourceRoot);
        if (!lint.ok)
            throw new project_1.CliError(`release package validation failed:\n${lint.failures.map((failure) => `- ${failure.message}`).join("\n")}`);
    }
    const files = await (0, project_1.listPortablePayloadFiles)(sourceRoot);
    if (options.outDir) {
        const outDir = node_path_1.default.resolve(options.outDir);
        await (0, project_1.copyPortablePayload)(sourceRoot, outDir);
        const metadata = node_path_1.default.join(outDir, "..", `${node_path_1.default.basename(outDir)}.meta-skill-package.json`);
        await writePackageMetadata(metadata, { source, sourceRoot, artifact: outDir, files });
        return { artifact: outDir, metadata, files };
    }
    const artifact = node_path_1.default.resolve(options.out || node_path_1.default.join(root, `${node_path_1.default.basename(root)}-${source}.zip`));
    await writeZip(sourceRoot, artifact, files);
    const metadata = `${artifact}.metadata.json`;
    await writePackageMetadata(metadata, { source, sourceRoot, artifact, files });
    return { artifact, metadata, files };
}
async function writePackageMetadata(target, data) {
    await (0, project_1.writeJson)(target, {
        schema_version: 1,
        created_at: (0, project_1.utcNow)(),
        source: data.source,
        source_path: data.sourceRoot,
        artifact: data.artifact,
        files: data.files
    });
}
async function writeZip(sourceRoot, target, files) {
    await (0, project_1.ensureDir)(node_path_1.default.dirname(target));
    const records = [];
    const chunks = [];
    let offset = 0;
    for (const file of files) {
        const name = file.split(node_path_1.default.sep).join("/");
        const data = await node_fs_1.promises.readFile(node_path_1.default.join(sourceRoot, file));
        const nameBytes = Buffer.from(name);
        const crc = crc32(data);
        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(0, 6);
        local.writeUInt16LE(0, 8);
        local.writeUInt16LE(0, 10);
        local.writeUInt16LE(0, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(data.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(nameBytes.length, 26);
        local.writeUInt16LE(0, 28);
        chunks.push(local, nameBytes, data);
        records.push({ name, crc, size: data.length, offset });
        offset += local.length + nameBytes.length + data.length;
    }
    const centralStart = offset;
    for (const record of records) {
        const nameBytes = Buffer.from(record.name);
        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0, 8);
        central.writeUInt16LE(0, 10);
        central.writeUInt16LE(0, 12);
        central.writeUInt16LE(0, 14);
        central.writeUInt32LE(record.crc, 16);
        central.writeUInt32LE(record.size, 20);
        central.writeUInt32LE(record.size, 24);
        central.writeUInt16LE(nameBytes.length, 28);
        central.writeUInt16LE(0, 30);
        central.writeUInt16LE(0, 32);
        central.writeUInt16LE(0, 34);
        central.writeUInt16LE(0, 36);
        central.writeUInt32LE(0, 38);
        central.writeUInt32LE(record.offset, 42);
        chunks.push(central, nameBytes);
        offset += central.length + nameBytes.length;
    }
    const centralSize = offset - centralStart;
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(0, 4);
    end.writeUInt16LE(0, 6);
    end.writeUInt16LE(records.length, 8);
    end.writeUInt16LE(records.length, 10);
    end.writeUInt32LE(centralSize, 12);
    end.writeUInt32LE(centralStart, 16);
    end.writeUInt16LE(0, 20);
    chunks.push(end);
    await node_fs_1.promises.writeFile(target, Buffer.concat(chunks));
    await (0, project_1.sha256File)(target);
}
let crcTable;
function crc32(buffer) {
    const table = crcTable || (crcTable = makeCrcTable());
    let crc = 0xffffffff;
    for (const byte of buffer) {
        crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
}
function makeCrcTable() {
    const table = [];
    for (let n = 0; n < 256; n += 1) {
        let c = n;
        for (let k = 0; k < 8; k += 1) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
}
