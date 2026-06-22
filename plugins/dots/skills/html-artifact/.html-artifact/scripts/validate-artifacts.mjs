import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const targetDir = process.argv[2] || path.join(process.cwd(), ".html-artifact", "runs", "manual-html-review", "html");
const files = (await readdir(targetDir)).filter((file) => file.endsWith(".html")).sort();

// Portable-payload contamination: provider names, scratch paths, research
// trail, the skill's own source filenames, and stale accent tokens must never
// appear in a generated artifact or the atlas.
const forbidden = [
  "Claude", "Anthropic", "Thariq", "Derek", "OpenAI", "ChatGPT", "WebFetch",
  "claude.com", "thariqs", ".agents/research", ".agents/", "/Users/",
  "/private/tmp", "scratchpad", "final-plan", "source-card",
  "primitive-catalog", "artifact-recipes", "visual-rules", "browser-qa",
  "lorem ipsum", "Lorem ipsum", "placeholder.png", "example.com",
  "#D97757", "--clay", "orange left", "data-variant=\"rail\""
];

const visualSlop = [
  /border-left\s*:\s*[^;]+solid/i,
  /letter-spacing\s*:\s*-\d/i,
  /text-transform\s*:\s*uppercase/i,
  /gradient\s+blob/i
];

// Required primitives per recipe. The shell carries data-artifact="<recipe>".
const requiredByArtifact = {
  "explainer": ["artifact-shell", "hero-summary", "tldr"],
  "implementation-plan": ["artifact-shell", "hero-summary", "milestone-strip", "risk-table"],
  "code-review": ["artifact-shell", "hero-summary", "finding-card", "diff-review"],
  "research-report": ["artifact-shell", "hero-summary", "claim-evidence-matrix", "audit-trail"],
  "design-qa": ["artifact-shell", "hero-summary", "screenshot-gallery", "finding-card", "token-swatch"],
  "design-qa-detailed": ["artifact-shell", "hero-summary", "meta-strip", "qa-metadata", "screenshot-triptych", "mismatch-ledger", "finding-card", "fidelity-coverage", "evidence-limits"],
  "ux-audit-report": ["artifact-shell", "hero-summary", "meta-strip", "qa-metadata", "screenshot-gallery", "finding-card", "evidence-limits"],
  "comparison-workbench": ["artifact-shell", "hero-summary", "meta-strip", "comparison-grid", "callout"],
  "imagegen-concept-packet": ["artifact-shell", "hero-summary", "meta-strip", "source-manifest", "concept-gallery", "imagegen-prompt-card"],
  "design-handoff-spec": ["artifact-shell", "hero-summary", "meta-strip", "design-system-extract", "asset-inventory", "allowed-copy-list", "acceptance-gate", "handoff-packet"],
  "architecture-map": ["artifact-shell", "hero-summary", "meta-strip", "step-flow", "dependency-map", "scope-boundary"],
  "migration-plan": ["artifact-shell", "hero-summary", "meta-strip", "scope-boundary", "milestone-strip", "risk-table", "owner-matrix", "verification-matrix", "acceptance-gate"],
  "release-readiness": ["artifact-shell", "hero-summary", "meta-strip", "acceptance-gate", "verification-matrix", "risk-table", "callout"],
  "eval-report": ["artifact-shell", "hero-summary", "tldr", "claim-evidence-matrix", "evidence-limits", "audit-trail"],
  "decision-brief": ["artifact-shell", "hero-summary", "tldr", "constraint-ledger", "comparison-grid", "decision-log"],
  "postmortem": ["artifact-shell", "hero-summary", "meta-strip", "step-flow", "decision-log", "callout"]
};

// Required data-slot parts for the expanded primitive families. When a primitive
// appears in a file, its required slots must appear somewhere in that file.
const requiredSlots = {
  "scope-boundary": ["in-scope", "out-scope"],
  "acceptance-gate": ["criterion", "gate-status"],
  "verification-matrix": ["head", "row"],
  "decision-log": ["decision"],
  "owner-matrix": ["head", "row"],
  "dependency-map": ["node"],
  "handoff-packet": ["item", "next-step"],
  "state-grid": ["cell"],
  "constraint-ledger": ["head", "row"],
  "screenshot-triptych": ["source", "render", "revised"],
  "focused-compare": ["region-label", "before", "after"],
  "annotation-pin": ["frame", "pin", "pin-note"],
  "fidelity-coverage": ["dimension"],
  "qa-metadata": ["item"],
  "evidence-limits": ["limit"],
  "mismatch-ledger": ["head", "row"],
  "revision-strip": ["step"],
  "token-delta": ["head", "row"],
  "concept-gallery": ["concept"],
  "source-manifest": ["source"],
  "asset-inventory": ["head", "row"],
  "allowed-copy-list": ["copy"],
  "imagegen-prompt-card": ["intent", "prompt-text"],
  "design-system-extract": ["group"],
  "motion-proof": ["demo", "reduced"],
  "viewport-matrix": ["viewport"],
  "performance-budget": ["head", "row"],
  "render-proof": ["check"]
};

const checks = [];
for (const file of files) {
  const html = await readFile(path.join(targetDir, file), "utf8");
  const artifact = html.match(/data-artifact="([^"]+)"/)?.[1] || "";
  const primitives = [...new Set([...html.matchAll(/data-primitive="([^"]+)"/g)].map((m) => m[1]))];
  const slots = new Set([...html.matchAll(/data-slot="([^"]+)"/g)].map((m) => m[1]));

  checks.push({ name: `${file}: one html document`, passed: /<!DOCTYPE html>/i.test(html) && /<main\b/.test(html), evidence: artifact || "no artifact" });
  checks.push({ name: `${file}: inline css`, passed: /<style>[\s\S]+<\/style>/.test(html), evidence: "looked for style block" });
  checks.push({ name: `${file}: shell anatomy`, passed: /data-artifact="[^"]+"/.test(html) && /data-primitive="artifact-shell"/.test(html), evidence: artifact || "missing artifact" });
  checks.push({ name: `${file}: no external runtime`, passed: !/(https?:\/\/|cdn\.|<link\b|<script\s+src=)/i.test(html), evidence: "checked links/scripts" });
  checks.push({ name: `${file}: no contamination`, passed: !forbidden.some((term) => html.includes(term)), evidence: forbidden.filter((term) => html.includes(term)).join(", ") || "none" });
  checks.push({ name: `${file}: no default accent rails`, passed: !visualSlop.some((pattern) => pattern.test(html)), evidence: visualSlop.filter((pattern) => pattern.test(html)).map(String).join(", ") || "none" });

  const required = requiredByArtifact[artifact] || [];
  checks.push({ name: `${file}: required primitives`, passed: required.every((p) => primitives.includes(p)), evidence: `${artifact}: needs ${required.join(", ") || "(none mapped)"}` });

  // Required slots for any expanded primitive present in this file.
  const slotGaps = [];
  for (const prim of primitives) {
    const need = requiredSlots[prim];
    if (!need) continue;
    const missing = need.filter((s) => !slots.has(s));
    if (missing.length) slotGaps.push(`${prim} missing ${missing.join("/")}`);
  }
  checks.push({ name: `${file}: required slots`, passed: slotGaps.length === 0, evidence: slotGaps.join("; ") || "all present" });

  // Viewport safety: device-width meta + at least one max-width media query.
  const hasViewportMeta = /<meta\s+name="viewport"[^>]*width=device-width/i.test(html);
  const hasResponsiveRule = /@media\s*\(\s*max-width/i.test(html);
  checks.push({ name: `${file}: viewport safety`, passed: hasViewportMeta && hasResponsiveRule, evidence: `viewport-meta=${hasViewportMeta} responsive-rule=${hasResponsiveRule}` });
  checks.push({ name: `${file}: mobile containment hooks`, passed: /table-wrap|overflow-x:\s*auto|max-width:\s*100%|grid-template-columns:\s*1fr/.test(html), evidence: "looked for containment CSS/hooks" });

  // Reduced motion: if the artifact animates or carries a motion-proof, it must
  // declare a prefers-reduced-motion path so the final state is reachable.
  const animates = /@keyframes|animation\s*:|data-primitive="motion-proof"/i.test(html);
  if (animates) {
    checks.push({ name: `${file}: reduced-motion hook`, passed: /prefers-reduced-motion/i.test(html), evidence: "animation present; checked for prefers-reduced-motion" });
  }

  // Image hygiene: where raster screenshots appear, require dimensions, alt, and
  // lazy loading for galleries (2+ images). Inline SVG schematics are exempt.
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  if (imgs.length) {
    const allDimensioned = imgs.every((t) => /\bwidth=/.test(t) && /\bheight=/.test(t));
    const allAlt = imgs.every((t) => /\balt=/.test(t));
    const lazyOk = imgs.length < 2 || imgs.some((t) => /loading=["']?lazy/.test(t));
    checks.push({ name: `${file}: image dimensions`, passed: allDimensioned, evidence: `${imgs.length} img(s); all width+height=${allDimensioned}` });
    checks.push({ name: `${file}: image alt`, passed: allAlt, evidence: `all img have alt=${allAlt}` });
    checks.push({ name: `${file}: image lazy-loading`, passed: lazyOk, evidence: `lazy below the fold=${lazyOk}` });
  }
}

const passed = checks.filter((check) => check.passed).length;
const total = checks.length;
const result = { passed, total, ok: passed === total, checks };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
