"""Deterministic structural and authoring checks for skill payloads."""

import re
from pathlib import Path

import yaml

from .candidates import resolve_skill_md
from .errors import CliError


PASS, WARN, FAIL = "Pass", "Warning", "Fail"
LINE_LIMIT = 500
DESC_SOFT_LIMIT = 500
DESC_HARD_LIMIT = 1024
HARD_COMMAND_LIMIT = 3
KNOWN_KEYS = {
    "name", "description", "compatibility", "allowed-tools", "metadata",
    "license", "disable-model-invocation",
}
PERSON_WORDS = ["I", "me", "my", "we", "our", "us", "you", "your", "yours"]
HARD_TOKENS = ["MUST", "ALWAYS", "NEVER", "SHALL", "DO NOT", "DON'T"]


def _split_frontmatter(text):
    if not text.startswith("---"):
        return None, text
    lines = text.splitlines()
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            return "\n".join(lines[1:index]), "\n".join(lines[index + 1:])
    return None, text


def _parse_frontmatter(raw):
    if raw is None:
        return {}, False
    try:
        data = yaml.safe_load(raw)
    except yaml.YAMLError:
        return {}, False
    return (data, True) if isinstance(data, dict) else ({}, False)


def _add(rows, name, result, message):
    rows.append({"check": name, "result": result, "message": message})


def _report(skill_md, checks, percent_key):
    passed = sum(row["result"] == PASS for row in checks)
    total = len(checks)
    return {
        "skill_md": str(skill_md),
        "checks": checks,
        "passed": passed,
        "total": total,
        percent_key: round(100 * passed / total) if total else 0,
    }


def _structural_report(skill_md, text, frontmatter, parsed, body):
    rows = []
    _add(
        rows,
        "frontmatter_valid",
        PASS if parsed and frontmatter else FAIL,
        "Frontmatter syntax is valid"
        if parsed and frontmatter
        else "No valid `---` frontmatter block found",
    )
    name = frontmatter.get("name")
    valid_name = bool(
        isinstance(name, str)
        and re.fullmatch(r"[a-z0-9][a-z0-9-]*", name.strip())
        and len(name.strip()) <= 64
    )
    _add(
        rows,
        "name_field",
        PASS if valid_name else FAIL,
        f"'name' field is valid: '{name.strip()}'"
        if valid_name
        else "'name' must be non-empty kebab-case and at most 64 characters",
    )
    description = frontmatter.get("description")
    valid_description = isinstance(description, str) and bool(description.strip())
    _add(
        rows,
        "description_field",
        PASS if valid_description else FAIL,
        f"'description' field is valid ({len(description.strip())} chars)"
        if valid_description
        else "'description' field missing or empty",
    )
    unknown = [key for key in frontmatter if key not in KNOWN_KEYS]
    _add(
        rows,
        "frontmatter_unknown_keys",
        WARN if unknown else PASS,
        f"Unknown frontmatter key(s): {', '.join(map(str, unknown))}"
        if unknown
        else "No unknown frontmatter keys",
    )
    for field in ("compatibility", "license"):
        if field not in frontmatter:
            continue
        valid = isinstance(frontmatter[field], str) and bool(frontmatter[field].strip())
        _add(rows, f"{field}_field", PASS if valid else FAIL, f"'{field}' must be a non-empty string")
    if "allowed-tools" in frontmatter:
        value = frontmatter["allowed-tools"]
        valid = (
            isinstance(value, str) and bool(value.strip())
        ) or (
            isinstance(value, list)
            and bool(value)
            and all(isinstance(item, str) and item.strip() for item in value)
        )
        _add(rows, "allowed_tools_field", PASS if valid else FAIL, "'allowed-tools' must contain tool names")
    if "metadata" in frontmatter:
        valid = isinstance(frontmatter["metadata"], dict)
        _add(rows, "metadata_field", PASS if valid else FAIL, "'metadata' must be a mapping")
    if "disable-model-invocation" in frontmatter:
        valid = isinstance(frontmatter["disable-model-invocation"], bool)
        _add(rows, "disable_model_invocation_field", PASS if valid else FAIL, "'disable-model-invocation' must be boolean")
    line_count = len(text.splitlines())
    _add(
        rows,
        "skill_md_line_count",
        PASS if line_count <= LINE_LIMIT else FAIL,
        f"SKILL.md line count is {line_count} ({'<=' if line_count <= LINE_LIMIT else '>'} {LINE_LIMIT})",
    )
    _add(rows, "body_present", PASS if body.strip() else FAIL, "SKILL.md body is present" if body.strip() else "SKILL.md body is empty")
    return _report(skill_md, rows, "validation_percent")


def _local_links(text):
    for match in re.finditer(r"\[[^\]]*\]\(([^)]+)\)", text):
        target = match.group(1).strip()
        if target.startswith(("http://", "https://", "#", "mailto:")):
            continue
        target = target.split("#", 1)[0]
        if target:
            yield target


def _authoring_report(skill_md, frontmatter, parsed, body):
    rows = []
    description = frontmatter.get("description") if parsed else None
    if isinstance(description, str) and description.strip():
        description = description.strip()
        length = len(description)
        status = FAIL if length > DESC_HARD_LIMIT else WARN if length > DESC_SOFT_LIMIT else PASS
        _add(rows, "description_length", status, f"description is {length} chars")
        found = sorted({
            word for word in PERSON_WORDS
            if re.search(rf"(?i)\b{re.escape(word)}\b", description)
        })
        _add(
            rows,
            "description_neutral_voice",
            WARN if found else PASS,
            f"description uses first/second person: {', '.join(found)}"
            if found
            else "description uses neutral active voice",
        )
        lower = description.lower()
        stepy = bool(
            ("first" in lower and "then" in lower)
            or re.search(r"\bthen\b.*\bthen\b", lower)
            or re.search(r"(?m)^\s*\d+\.", description)
            or re.search(r":\s*(first\b|step 1|1\.)", lower)
        )
        _add(
            rows,
            "description_no_workflow_steps",
            WARN if stepy else PASS,
            "description reads like a workflow" if stepy else "description is not a workflow list",
        )
    if body.strip():
        hard_commands = sum(len(re.findall(rf"\b{re.escape(token)}\b", body)) for token in HARD_TOKENS)
        _add(
            rows,
            "hard_command_density",
            WARN if hard_commands > HARD_COMMAND_LIMIT else PASS,
            f"{hard_commands} hard-command tokens",
        )
    markdown_files = [skill_md]
    references = skill_md.parent / "references"
    if references.is_dir():
        markdown_files.extend(sorted(references.rglob("*.md")))
    missing = []
    for markdown in markdown_files:
        for target in _local_links(markdown.read_text()):
            if not (markdown.parent / target).exists():
                missing.append(f"{markdown.name} → {target}")
    metadata_path = skill_md.parent / "agents" / "openai.yaml"
    if metadata_path.is_file():
        for match in re.finditer(
            r"(?m)^\s*icon_(?:small|large):\s*['\"]?([^'\"\n]+)['\"]?\s*$",
            metadata_path.read_text(),
        ):
            target = match.group(1).strip()
            if not target.startswith(("http://", "https://", "data:")) and not (skill_md.parent / target).exists():
                missing.append(f"agents/openai.yaml → {target}")
    _add(
        rows,
        "dead_references",
        FAIL if missing else PASS,
        f"broken local links: {'; '.join(missing[:5])}" if missing else "all local links resolve",
    )
    return _report(skill_md, rows, "authoring_percent")


def validate_report(skill_dir):
    target = resolve_skill_md(skill_dir)
    if not target.exists():
        raise CliError(f"SKILL.md not found: {target}", 2)
    text = target.read_text()
    raw_frontmatter, body = _split_frontmatter(text)
    frontmatter, parsed = _parse_frontmatter(raw_frontmatter)
    reports = [
        {"task": "validate_skill", **_structural_report(target, text, frontmatter, parsed, body)},
        {"task": "lint_authoring", **_authoring_report(target, frontmatter, parsed, body)},
    ]
    failures = [
        check
        for report in reports
        for check in report["checks"]
        if check["result"] == FAIL
    ]
    passed = sum(report["passed"] for report in reports)
    total = sum(report["total"] for report in reports)
    return {
        "ok": not failures,
        "target": str(target),
        "tasks": reports,
        "passed": passed,
        "total": total,
        "validation_percent": round(100 * passed / total) if total else 0,
    }
