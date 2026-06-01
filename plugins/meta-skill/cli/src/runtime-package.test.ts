import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

describe("runtime package layout", () => {
  it("keeps tests out of the shipped app build while preserving one runtime folder", async () => {
    const root = process.cwd();
    const packageJson = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8")) as { scripts: Record<string, string> };
    const tsconfig = JSON.parse(await fs.readFile(path.join(root, "tsconfig.json"), "utf8")) as { compilerOptions: { outDir: string }; exclude: string[] };
    const testTsconfig = JSON.parse(await fs.readFile(path.join(root, "tsconfig.test.json"), "utf8")) as { compilerOptions: { outDir: string } };
    const bin = await fs.readFile(path.join(root, "..", "bin", "meta-skill"), "utf8");

    assert.equal(tsconfig.compilerOptions.outDir, "app");
    assert.equal(testTsconfig.compilerOptions.outDir, "app");
    assert.equal(tsconfig.exclude.includes("src/**/*.test.ts"), true);
    assert.match(packageJson.scripts.build, /rm -rf app && tsc -p tsconfig\.json/);
    assert.match(packageJson.scripts["build:test"], /rm -rf app && tsc -p tsconfig\.test\.json/);
    assert.match(packageJson.scripts.test, /node --test "app\/\*\*\/\*\.test\.js"/);
    assert.match(packageJson.scripts.test, /npm run build$/);
    assert.match(bin, /app\/main\.js/);
  });
});
