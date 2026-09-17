/** Verify the unpacked engineering handoff before editing. Requires Node only. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const manifest = path.join(root, 'RELEASE-CONTENTS.sha256');
if (!fs.existsSync(manifest)) {
  console.error('Missing RELEASE-CONTENTS.sha256. This is not a finalized handoff archive.');
  process.exit(2);
}
let count = 0;
for (const line of fs.readFileSync(manifest, 'utf8').split('\n').filter(Boolean)) {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
  if (!match || match[2].split('/').some(x => x === '..' || x === '') || path.isAbsolute(match[2])) {
    throw new Error('Invalid content inventory entry');
  }
  const file = path.join(root, match[2]);
  if (fs.lstatSync(file).isSymbolicLink()) throw new Error('Unexpected symlink: ' + match[2]);
  const digest = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (digest !== match[1]) throw new Error('Content mismatch: ' + match[2]);
  count++;
}
console.log(JSON.stringify({ verifiedFiles: count, contentsMatch: true, releaseQualification: 'See evidence/build-status.json; content integrity is not functional qualification.' }, null, 2));
