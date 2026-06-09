"""Skill validation bridge."""

import lint_authoring
import validate_skill

from .candidates import resolve_skill_md
from .errors import CliError


FAIL = "Fail"


def validate_report(skill_dir):
    target = resolve_skill_md(skill_dir)
    if not target.exists():
        raise CliError(f"SKILL.md not found: {target}", 2)
    reports = [
        {"task": "validate_skill", **validate_skill.validate(str(target))},
        {"task": "lint_authoring", **lint_authoring.validate(str(target))},
    ]
    passed = sum(item.get("passed", 0) for item in reports)
    total = sum(item.get("total", 0) for item in reports)
    failures = [
        check
        for report in reports
        for check in report.get("checks", [])
        if check.get("result") == FAIL
    ]
    return {
        "ok": not failures,
        "target": str(target),
        "tasks": reports,
        "passed": passed,
        "total": total,
        "validation_percent": round(100 * passed / total) if total else 0,
    }

