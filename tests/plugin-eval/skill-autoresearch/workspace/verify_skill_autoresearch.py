from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parent
skill_root = root / "fixtures" / "weak-summary-skill"
skill_md = skill_root / "SKILL.md"
session_root = skill_root / ".autoresearch"

errors = []

if not skill_md.exists():
    errors.append("Missing rewritten SKILL.md")
else:
    text = skill_md.read_text()
    if "## Inputs" not in text:
        errors.append("Missing ## Inputs section")
    if "## Workflow" not in text:
        errors.append("Missing ## Workflow section")
    if "## Guardrails" not in text:
        errors.append("Missing ## Guardrails section")
    lower = text.lower()
    if "summar" not in lower:
        errors.append("Skill no longer clearly targets summarization")
    if "invent" not in lower:
        errors.append("Skill does not explicitly address invention or fact fidelity")
    if "clarif" not in lower and "ask" not in lower:
        errors.append("Skill does not say how to handle missing detail")
    if "multiple" not in lower or "source" not in lower:
        errors.append("Skill does not explain multiple-source handling")
    if "length" not in lower:
        errors.append("Skill does not explain output length handling")

    translation_lines = [line.strip().lower() for line in text.splitlines() if "translat" in line.lower()]
    for line in translation_lines:
        if not any(marker in line for marker in ["do not", "out of scope", "not ", "avoid"]):
            errors.append("Skill drifted into translation scope")
            break

    frontmatter_match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not frontmatter_match:
        errors.append("Missing frontmatter block")
    else:
        frontmatter = frontmatter_match.group(1).lower()
        if "description:" not in frontmatter:
            errors.append("Missing description in frontmatter")
        elif "use when" not in frontmatter and "use for" not in frontmatter:
            errors.append("Description does not clearly say when to use the skill")

expected_files = [
    session_root / "session.md",
    session_root / "results.jsonl",
    session_root / "reports" / "baseline.md",
    session_root / "reports" / "final.md",
]
for file_path in expected_files:
    if not file_path.exists():
        errors.append(f"Missing expected session artifact: {file_path.relative_to(root)}")

results_path = session_root / "results.jsonl"
if results_path.exists():
    lines = [line for line in results_path.read_text().splitlines() if line.strip()]
    if not lines:
        errors.append("results.jsonl is empty")
    else:
        for line in lines:
            try:
                json.loads(line)
            except json.JSONDecodeError as exc:
                errors.append(f"results.jsonl contains invalid JSON: {exc}")
                break

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("skill-autoresearch benchmark verification passed")
