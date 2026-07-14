"""Codex CLI defaults shared by evaluation callers."""

import shutil

DEFAULT_EVAL_MODEL = "gpt-5.6-terra"
DEFAULT_EVAL_REASONING_EFFORT = "medium"


def configure_codex_runtime():
    """Return the system Codex binary path when available."""
    return shutil.which("codex")


def default_codex_model(cwd=None):
    """Return MetaSkill's explicit unattended default model."""
    return DEFAULT_EVAL_MODEL if configure_codex_runtime() else None
