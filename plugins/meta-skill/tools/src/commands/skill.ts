import fs from "node:fs/promises";
import path from "node:path";
import { assertSafeSkillSlug } from "../core/ids.ts";

export async function commandSkillNew(
  cwd: string,
  slug: string,
  opts: { description?: string } = {},
): Promise<void> {
  const safeSlug = assertSafeSkillSlug(slug);
  const target = path.join(cwd, safeSlug);
  await fs.mkdir(target, { recursive: true });

  const skillPath = path.join(target, "SKILL.md");
  const existing = await fs
    .stat(skillPath)
    .then(() => true)
    .catch(() => false);
  if (existing) {
    throw new Error(`SKILL.md already exists at ${skillPath}`);
  }

  const content = `---
name: ${safeSlug}
description: ${opts.description ?? `Meta Skill utility scaffold for ${safeSlug}`}.
---

# ${safeSlug}

Add your runtime payload here.
`;
  await fs.writeFile(skillPath, content, "utf8");
}
