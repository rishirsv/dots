"""Run one eval trial through Codex App Server."""

import threading

from ..candidates import skill_input_name
from .client import load_sdk, sdk_version
from .evidence import fold_events
from .policy import APP_SERVER_APPROVAL_POLICY, APP_SERVER_SANDBOX, sdk_policy


class TurnControl:
    """Thread-safe bridge used by the runner to interrupt an active SDK turn."""

    def __init__(self):
        self._lock = threading.Lock()
        self._turn = None
        self._interrupt_requested = False
        self.interrupt_supported = None
        self.interrupt_sent = False
        self.interrupt_error = None

    def attach(self, turn):
        with self._lock:
            self._turn = turn
            self.interrupt_supported = callable(getattr(turn, "interrupt", None))
            requested = self._interrupt_requested
        if requested:
            self.interrupt()

    def interrupt(self):
        with self._lock:
            self._interrupt_requested = True
            turn = self._turn
            supported = callable(getattr(turn, "interrupt", None)) if turn is not None else None
            if turn is None or not supported or self.interrupt_sent:
                return False
            self.interrupt_sent = True
        try:
            turn.interrupt()
            return True
        except Exception as exc:
            self.interrupt_error = str(exc)
            return False

    def detail(self):
        return {
            "interrupt_supported": self.interrupt_supported,
            "interrupt_requested": self._interrupt_requested,
            "interrupt_sent": self.interrupt_sent,
            "interrupt_error": self.interrupt_error,
        }


def app_server_run(trial, prompt, candidate_info, event_path, output_path, model=None, control=None):
    openai_codex, generated = load_sdk()
    sandbox, approval_mode = sdk_policy(openai_codex)
    config = openai_codex.CodexConfig(
        cwd=candidate_info["cwd"],
        client_name="meta_skill_cli",
        client_title="Meta Skill CLI",
    )
    with openai_codex.Codex(config=config) as codex:
        thread = codex.thread_start(
            approval_mode=approval_mode,
            cwd=candidate_info["cwd"],
            sandbox=sandbox,
            ephemeral=True,
            model=model,
        )
        inputs = []
        if candidate_info.get("payload_path"):
            inputs.append(openai_codex.SkillInput(name=skill_input_name(candidate_info["payload_path"]), path=candidate_info["payload_path"]))
        inputs.append(openai_codex.TextInput(text=prompt))
        turn = thread.turn(inputs, cwd=candidate_info["cwd"], sandbox=sandbox, model=model)
        if control is not None:
            control.attach(turn)
        folded = fold_events(turn, generated, event_path)
        completed = folded["completed"]
        if completed is None:
            raise RuntimeError("turn completed event not received")
        status = getattr(completed.status, "value", completed.status)
        if status == "failed":
            error = getattr(completed, "error", None)
            message = getattr(error, "message", None)
            raise RuntimeError(message or "turn failed")
        final = folded["final_response"]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(final)
        return {
            "status": str(status),
            "thread_id": thread.id,
            "turn_id": turn.id,
            "thread_persistence": "ephemeral",
            "sandbox": APP_SERVER_SANDBOX,
            "runtime_approval_policy": APP_SERVER_APPROVAL_POLICY,
            "duration_ms": completed.duration_ms,
            "usage": folded["usage"],
            "events": folded["event_count"],
            "final_response_chars": len(final),
            "sdk_version": sdk_version(),
            "runtime_version": None,
        }
