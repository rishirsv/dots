"""Model grading through Codex App Server."""

import json

from .client import load_sdk, sdk_version
from .evidence import fold_events
from .policy import APP_SERVER_APPROVAL_POLICY, APP_SERVER_SANDBOX, sdk_policy


GRADE_LABELS = {"pass", "partial", "fail", "unknown", "needs_human_review"}
CHECK_LABELS = {"pass", "fail", "unknown"}


def _number_or_none(value):
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return min(1.0, max(0.0, float(value)))
    return None


def _normalize_checks(raw):
    if not isinstance(raw, list):
        return []
    checks = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        label = item.get("label")
        if label not in CHECK_LABELS:
            label = "unknown"
        check = {
            "name": str(item.get("name") or "criterion"),
            "label": label,
            "level": item.get("level"),
            "evidence": str(item.get("evidence") or ""),
        }
        if item.get("note"):
            check["note"] = str(item.get("note"))
        checks.append(check)
    return checks


def _normalize_detail(parsed, raw):
    if not isinstance(parsed, dict):
        return {
            "score": None,
            "label": "fail",
            "rationale": f"model grader emitted invalid JSON: {raw[:500]}",
            "checks": [],
            "eval_feedback": [],
        }
    label = parsed.get("label")
    if label not in GRADE_LABELS:
        label = "unknown"
    feedback = parsed.get("eval_feedback")
    if not isinstance(feedback, list):
        feedback = []
    return {
        "score": _number_or_none(parsed.get("score")),
        "label": label,
        "rationale": str(parsed.get("rationale") or ""),
        "checks": _normalize_checks(parsed.get("checks")),
        "eval_feedback": [str(item) for item in feedback if str(item).strip()],
    }


def judge_output(*, judge_guidance, task_text, output_text, cwd, event_path, expectations=None, expected_text=None, events_text=None, model=None):
    openai_codex, generated = load_sdk()
    sandbox, approval_mode = sdk_policy(openai_codex)
    expectations = expectations or []
    expected_block = f"\n\nHIDDEN EXPECTED OR REFERENCE OUTPUT:\n{expected_text}" if expected_text else ""
    events_block = f"\n\nTRIAL TRANSCRIPT / EVENTS:\n{events_text}" if events_text else ""
    expectations_block = ""
    if expectations:
        expectations_block = "\n\nEXPECTATIONS TO CHECK:\n" + "\n".join(f"- {item}" for item in expectations)
    prompt = (
        "You are grading one agent-eval trial. Grade only the trial outcome: the final answer, files, artifacts, "
        "or observable state. Use transcript/events only for criteria about process, tool use, skill activation, "
        "or explaining why outcome evidence is missing. Do not infer root cause, diagnose the skill, or reward "
        "surface compliance when the underlying task is wrong. The burden of proof is on a pass.\n\n"
        "Return only JSON with this exact shape:\n"
        "{\"label\":\"pass|partial|fail|unknown|needs_human_review\",\"score\":0.0,"
        "\"rationale\":\"...\",\"checks\":[{\"name\":\"criterion\",\"label\":\"pass|fail|unknown\","
        "\"level\":0,\"evidence\":\"...\",\"note\":\"optional\"}],\"eval_feedback\":[]}\n\n"
        "Rules:\n"
        "- label must be pass only when the outcome satisfies every required criterion with specific evidence.\n"
        "- label may be partial when the outcome materially helps but misses non-gating criteria or has localized defects.\n"
        "- label must be fail when the outcome is wrong, incomplete, unsafe, or misses a required criterion.\n"
        "- label must be unknown when available evidence is insufficient or contradictory.\n"
        "- label must be needs_human_review for domain taste, underspecified criteria, or fairness concerns.\n"
        "- score is 0 to 1 when meaningful; use null when evidence is insufficient.\n"
        "- cite concrete evidence in every check from the outcome, reference material, or allowed transcript.\n"
        "- eval_feedback lists concise notes about weak, unverifiable, missing, always-pass, or unfair criteria.\n\n"
        f"JUDGE GUIDANCE:\n{judge_guidance}\n\n"
        f"TASK SHOWN TO AGENT:\n{task_text}\n\n"
        f"AGENT OUTCOME:\n{output_text}"
        f"{expectations_block}"
        f"{expected_block}"
        f"{events_block}\n"
    )
    config = openai_codex.CodexConfig(cwd=str(cwd), client_name="meta_skill_cli", client_title="Meta Skill CLI")
    with openai_codex.Codex(config=config) as codex:
        thread = codex.thread_start(
            approval_mode=approval_mode,
            cwd=str(cwd),
            sandbox=sandbox,
            ephemeral=False,
            model=model,
        )
        turn = thread.turn([openai_codex.TextInput(text=prompt)], cwd=str(cwd), sandbox=sandbox, model=model)
        folded = fold_events(turn, generated, event_path)
    raw = folded["final_response"]
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = None
    detail = _normalize_detail(parsed, raw)
    return {
        **detail,
        "thread_id": thread.id,
        "turn_id": turn.id,
        "thread_persistence": "persistent",
        "usage": folded["usage"],
        "events": folded["event_count"],
        "sdk_version": sdk_version(),
        "runtime_version": None,
        "sandbox": APP_SERVER_SANDBOX,
        "runtime_approval_policy": APP_SERVER_APPROVAL_POLICY,
        "raw_response": raw,
    }
