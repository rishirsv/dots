import fs from "node:fs/promises";
import path from "node:path";

export async function commandSkillNew(
  cwd: string,
  slug: string,
  opts: { description?: string } = {},
): Promise<void> {
  const target = path.join(cwd, slug);
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
name: ${slug}
description: ${opts.description ?? `Meta Skill utility scaffold for ${slug}`}.
---

# ${slug}

Add your runtime payload here.
`;
  await fs.writeFile(skillPath, content, "utf8");
}
