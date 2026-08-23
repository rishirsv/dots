import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const htmlRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = resolve(htmlRoot, "..");

function inside(root, target) {
  return target.startsWith(`${root}${sep}`);
}

function localAsset(root, value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.equal(value.startsWith("/"), false, `${label} must be relative`);
  const target = resolve(root, value);
  assert.ok(inside(root, target), `${label} must stay inside its skill package`);
  assert.ok(existsSync(target), `${label} does not resolve: ${target}`);
  return target;
}

test("every HTML template package has a valid local manifest and assets", () => {
  const packages = readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(skillsRoot, entry.name))
    .filter((root) => existsSync(join(root, "artifact-template.json")));

  assert.ok(packages.length > 0, "expected at least one HTML template package");

  for (const root of packages) {
    const manifestPath = join(root, "artifact-template.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    assert.equal(manifest.schemaVersion, 1, `${manifestPath}: unsupported schema`);
    assert.equal(manifest.kind, "html", `${manifestPath}: unsupported kind`);

    const reference = localAsset(root, manifest.reference, `${manifestPath}: reference`);
    const preview = localAsset(root, manifest.preview, `${manifestPath}: preview`);
    assert.equal(extname(reference), ".html", `${reference}: expected HTML reference`);
    assert.equal(extname(preview), ".png", `${preview}: expected PNG preview`);

    const png = readFileSync(preview).subarray(0, 8);
    assert.deepEqual([...png], [137, 80, 78, 71, 13, 10, 26, 10], `${preview}: invalid PNG`);
  }
});

test("HTML gallery links and local preview sources resolve", () => {
  const galleryFiles = [
    resolve(htmlRoot, "assets/outcomes/index.html"),
    resolve(htmlRoot, "assets/atlas.html"),
  ];

  for (const gallery of galleryFiles) {
    const source = readFileSync(gallery, "utf8");
    for (const match of source.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
      const value = match[1];
      if (value.startsWith("#") || value.startsWith("data:") || /^[a-z]+:/i.test(value)) continue;
      const target = resolve(dirname(gallery), value);
      assert.ok(existsSync(target), `${relative(htmlRoot, gallery)}: missing ${value}`);
    }
  }

  const registryRoot = resolve(htmlRoot, "assets/outcomes");
  const registry = JSON.parse(readFileSync(join(registryRoot, "registry.json"), "utf8"));
  for (const item of registry.items) {
    assert.ok(existsSync(resolve(registryRoot, item.file)), `missing outcome ${item.name}: ${item.file}`);
  }
});
