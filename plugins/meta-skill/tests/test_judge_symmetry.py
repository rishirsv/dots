"""Tests for model-judge failure normalization."""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.app_server.judge import _normalize_detail, judge_output  # noqa: E402
from meta_skill.app_server.trial import app_server_run  # noqa: E402


class JudgeSymmetryTests(unittest.TestCase):
    def test_garbage_output_is_unknown_grader_error(self):
        detail = _normalize_detail(None, "not json")

        self.assertEqual(detail["label"], "unknown")
        self.assertIsNone(detail["score"])
        self.assertEqual(detail["rationale"], "model grader returned no usable JSON: not json")
        self.assertEqual(detail["checks"], [])
        self.assertEqual(detail["eval_feedback"], [])
        self.assertTrue(detail["grader_error"])

    def test_bad_label_is_unknown_grader_error(self):
        detail = _normalize_detail(
            {"label": "confused", "score": 0.75, "rationale": "bad label", "checks": [], "eval_feedback": []},
            "{}",
        )

        self.assertEqual(detail["label"], "unknown")
        self.assertEqual(detail["score"], 0.75)
        self.assertEqual(detail["rationale"], "bad label")
        self.assertTrue(detail["grader_error"])

    def test_well_formed_output_has_no_grader_error_key(self):
        detail = _normalize_detail(
            {"label": "pass", "score": 1, "rationale": "ok", "checks": [], "eval_feedback": []},
            "{}",
        )

        self.assertEqual(detail["label"], "pass")
        self.assertNotIn("grader_error", detail)

    def test_retry_once_on_invalid_json_then_uses_valid_response(self):
        state = {"turn_inputs": [], "thread_starts": 0}
        openai_codex, generated = fake_sdk(
            state,
            [
                "garbage",
                json.dumps(
                    {
                        "label": "pass",
                        "score": 1.0,
                        "rationale": "retry ok",
                        "checks": [],
                        "eval_feedback": [],
                    }
                ),
            ],
        )

        with tempfile.TemporaryDirectory() as tmp:
            event_path = Path(tmp) / "judge-grade-fixed.jsonl"
            with patch("meta_skill.app_server.judge.load_sdk", return_value=(openai_codex, generated)), patch(
                "meta_skill.app_server.judge.sdk_version", return_value="fake"
            ):
                detail = judge_output(
                    judge_guidance="Grade it.",
                    task_text="Say ok.",
                    output_text="ok",
                    cwd=Path(tmp),
                    event_path=event_path,
                )

            self.assertEqual(detail["label"], "pass")
            self.assertEqual(detail["score"], 1.0)
            self.assertEqual(detail["rationale"], "retry ok")
            self.assertEqual(detail["events"], 4)
            self.assertNotIn("grader_error", detail)
            self.assertEqual(state["thread_starts"], 1)
            self.assertTrue(state["thread_options"][0]["ephemeral"])
            self.assertEqual(detail["thread_persistence"], "ephemeral")
            self.assertEqual(len(state["turn_inputs"]), 2)
            self.assertEqual(
                state["turn_inputs"][1],
                "Your previous reply was not valid JSON. Respond now with only the JSON object specified earlier. No prose or code fences.",
            )
            events = [json.loads(line) for line in event_path.read_text().splitlines()]
            self.assertEqual(len(events), 4)
            self.assertEqual(
                [event["method"] for event in events],
                ["thread.item_completed", "turn.completed", "thread.item_completed", "turn.completed"],
            )

    def test_trial_uses_ephemeral_thread(self):
        state = {"turn_inputs": [], "thread_starts": 0, "thread_options": []}
        openai_codex, generated = fake_sdk(state, ["done"])
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            payload = root / "skill"
            payload.mkdir()
            (payload / "SKILL.md").write_text("# Demo\n")
            with patch("meta_skill.app_server.trial.load_sdk", return_value=(openai_codex, generated)), patch(
                "meta_skill.app_server.trial.sdk_version", return_value="fake"
            ):
                detail = app_server_run(
                    {"trial_id": "a.current.t1"},
                    "Do A",
                    {"cwd": str(root), "payload_path": str(payload)},
                    root / "events.jsonl",
                    root / "response.md",
                )
        self.assertTrue(state["thread_options"][0]["ephemeral"])
        self.assertEqual(detail["thread_persistence"], "ephemeral")


def fake_sdk(state, responses):
    class MessagePhase:
        final_answer = "final_answer"

    class AgentMessageThreadItem:
        def __init__(self, text, phase):
            self.text = text
            self.phase = phase

    class ItemCompletedNotification:
        def __init__(self, turn_id, item):
            self.turn_id = turn_id
            self.item = item

    class TurnCompletedNotification:
        def __init__(self, turn):
            self.turn = turn

    class Event:
        def __init__(self, method, payload):
            self.method = method
            self.payload = payload

    class Turn:
        def __init__(self, turn_id, response):
            self.id = turn_id
            self.response = response
            self.status = SimpleNamespace(value="completed")
            self.error = None
            self.duration_ms = 1

        def stream(self):
            yield Event(
                "thread.item_completed",
                ItemCompletedNotification(self.id, AgentMessageThreadItem(self.response, MessagePhase.final_answer)),
            )
            yield Event("turn.completed", TurnCompletedNotification(self))

    class Thread:
        id = "thread-fake"

        def turn(self, inputs, **_kwargs):
            state["turn_inputs"].append(inputs[-1].text)
            index = len(state["turn_inputs"]) - 1
            return Turn(f"turn-{index + 1}", responses[index])

    class TextInput:
        def __init__(self, text):
            self.text = text

    class SkillInput:
        def __init__(self, name, path):
            self.name = name
            self.path = path

    class Codex:
        def __init__(self, config):
            self.config = config

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

        def thread_start(self, **kwargs):
            state["thread_starts"] += 1
            state.setdefault("thread_options", []).append(kwargs)
            return Thread()

    openai_codex = SimpleNamespace(
        Sandbox=SimpleNamespace(workspace_write="workspace_write"),
        ApprovalMode=SimpleNamespace(deny_all="deny_all"),
        CodexConfig=SimpleNamespace,
        Codex=Codex,
        SkillInput=SkillInput,
        TextInput=TextInput,
    )
    generated = SimpleNamespace(
        AgentMessageThreadItem=AgentMessageThreadItem,
        ItemCompletedNotification=ItemCompletedNotification,
        MessagePhase=MessagePhase,
        TurnCompletedNotification=TurnCompletedNotification,
    )

    return openai_codex, generated


if __name__ == "__main__":
    unittest.main()
