"""Rubric-backed model grading through Codex App Server."""

import json

from .client import load_sdk, sdk_version
from .evidence import fold_events
from .policy import APP_SERVER_APPROVAL_POLICY, APP_SERVER_SANDBOX, sdk_policy


def judge_output(*, rubric, task_text, output_text, cwd, event_path, model=None):
    openai_codex, generated = load_sdk()
    sandbox, approval_mode = sdk_policy(openai_codex)
    prompt = (
        "You are grading one eval result. Return only JSON with keys: "
        "score, label, rationale, checks. score must be a number from 0 to 1; "
        "label must be pass, partial, or fail; checks must be a list.\n\n"
        f"RUBRIC:\n{rubric}\n\n"
        f"TASK SHOWN TO SOLVER:\n{task_text}\n\n"
        f"SOLVER OUTPUT:\n{output_text}\n"
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
        parsed = {
            "score": None,
            "label": "fail",
            "rationale": f"judge emitted invalid JSON: {raw[:500]}",
            "checks": [],
        }
    return {
        "score": parsed.get("score"),
        "label": parsed.get("label") or "fail",
        "rationale": parsed.get("rationale") or "",
        "checks": parsed.get("checks", []),
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

