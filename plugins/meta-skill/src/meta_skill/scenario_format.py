"""Authored evaluation scenarios and MetaSkill experiment settings."""

import json
from pathlib import Path

from .errors import CliError
from .ids import require_id


CRITERIA_TYPE = "weighted_checklist"
CRITERIA_CATEGORIES = {
    "INTENT", "DESIGN", "MUST_NOT", "MINIMALITY", "REUSE", "INTEGRATION", "EDGE_CASE",
}


def _read_object(path, label):
    try:
        value = json.loads(Path(path).read_text())
    except (OSError, json.JSONDecodeError) as exc:
        raise CliError(f"invalid {label}: {path}", 2) from exc
    if not isinstance(value, dict):
        raise CliError(f"{label} must be a JSON object: {path}", 2)
    return value


def load_criteria(path, scenario_id):
    data = _read_object(path, "criteria.json")
    if data.get("type") != CRITERIA_TYPE:
        raise CliError(f"scenario {scenario_id} criteria.type must be weighted_checklist", 2)
    if not isinstance(data.get("context"), str) or not data["context"].strip():
        raise CliError(f"scenario {scenario_id} criteria.context must be a non-empty string", 2)
    checklist = data.get("checklist")
    if not isinstance(checklist, list) or not checklist:
        raise CliError(f"scenario {scenario_id} criteria.checklist must be non-empty", 2)
    seen = set()
    for item in checklist:
        if not isinstance(item, dict):
            raise CliError(f"scenario {scenario_id} checklist entries must be objects", 2)
        name = require_id(f"scenario {scenario_id} criterion name", item.get("name"))
        if name in seen:
            raise CliError(f"scenario {scenario_id} duplicate criterion: {name}", 2)
        seen.add(name)
        if not isinstance(item.get("description"), str) or not item["description"].strip():
            raise CliError(f"scenario {scenario_id} criterion {name} needs a description", 2)
        score = item.get("max_score")
        if isinstance(score, bool) or not isinstance(score, (int, float)) or score <= 0:
            raise CliError(f"scenario {scenario_id} criterion {name} max_score must be positive", 2)
        if item.get("category") not in CRITERIA_CATEGORIES:
            allowed = ", ".join(sorted(CRITERIA_CATEGORIES))
            raise CliError(f"scenario {scenario_id} criterion {name} category must be one of {allowed}", 2)
        unknown = set(item) - {"name", "description", "max_score", "category"}
        if unknown:
            raise CliError(
                f"scenario {scenario_id} criterion {name} has unsupported fields: {', '.join(sorted(unknown))}",
                2,
            )
    unknown = set(data) - {"context", "type", "checklist"}
    if unknown:
        raise CliError(f"scenario {scenario_id} criteria.json has unsupported fields: {', '.join(sorted(unknown))}", 2)
    return data


def load_scenario_suite(evals_root, experiment=None):
    root = Path(evals_root).resolve()
    if not root.is_dir():
        raise CliError(f"evals directory not found: {root}", 2)
    cases = []
    for case_root in sorted(path for path in root.iterdir() if path.is_dir() and not path.name.startswith(".")):
        scenario_id = require_id("scenario id", case_root.name)
        task_path = case_root / "task.md"
        criteria_path = case_root / "criteria.json"
        scenario_path = case_root / "scenario.json"
        missing = [path.name for path in (task_path, criteria_path, scenario_path) if not path.is_file()]
        if missing:
            raise CliError(f"scenario {scenario_id} missing: {', '.join(missing)}", 2)
        if not task_path.read_text().strip():
            raise CliError(f"scenario {scenario_id} task.md must be non-empty", 2)
        criteria = load_criteria(criteria_path, scenario_id)
        scenario = _read_object(scenario_path, "scenario.json")
        cases.append({
            "id": scenario_id,
            "type": scenario.get("type", "capability"),
            "outcome": scenario.get("outcome", "response"),
            "priority": scenario.get("priority"),
            "split": scenario.get("split"),
            "coverage": list(scenario.get("coverage") or []),
            "repetitions": scenario.get("repetitions"),
            "prompt": {"path": "task.md"},
            "expected_output": None,
            "expectations": [item["description"] for item in criteria["checklist"]],
            "fixtures": list(scenario.get("fixtures") or []),
            "criteria": criteria,
            "scenario": scenario,
            "graders": [{
                "kind": "weighted_checklist",
                "id": "weighted-checklist",
                "metric": "weighted-checklist",
            }],
        })
    if not cases:
        raise CliError(f"evals directory contains no scenarios: {root}", 2)
    settings = dict(experiment or {})
    variants = settings.get("variants") or [
        {"variant": "without-skill", "display": "Without skill", "skill": {"kind": "none"}},
        {"variant": "current", "display": "Current skill", "skill": {"kind": "current_worktree", "ref": "."}},
    ]
    return {
        "schema_version": 3,
        "format": "scenario",
        "skill_name": settings.get("skill_name") or root.parent.name,
        "evaluation_mode": settings.get("evaluation_mode", "diagnostic"),
        "objective": settings.get("objective"),
        "target": settings.get("target") or {"type": "skill", "ref": "SKILL.md"},
        "defaults": settings.get("defaults") or {"repetitions": 1, "timeout_seconds": 600},
        "coverage_requirements": list(settings.get("coverage_requirements") or []),
        "validity_review": settings.get("validity_review"),
        "benchmark": settings.get("benchmark"),
        "variants": variants,
        "evals": cases,
    }


def weighted_checklist_score(criteria, checks):
    """Return the weighted percentage from criterion awards."""
    awards = {row.get("name"): row for row in checks or [] if isinstance(row, dict)}
    total = sum(float(row["max_score"]) for row in criteria["checklist"])
    earned = 0.0
    normalized = []
    for criterion in criteria["checklist"]:
        raw = awards.get(criterion["name"], {}).get("score", 0)
        score = 0.0 if isinstance(raw, bool) or not isinstance(raw, (int, float)) else float(raw)
        score = max(0.0, min(score, float(criterion["max_score"])))
        earned += score
        normalized.append({**criterion, "score": score})
    return {"earned": earned, "available": total, "score": earned / total, "percentage": earned / total * 100, "checks": normalized}
