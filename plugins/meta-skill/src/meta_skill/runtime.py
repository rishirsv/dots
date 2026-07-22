"""Codex CLI defaults shared by evaluation callers."""

import shutil

DEFAULT_EVAL_MODEL = "gpt-5.6-terra"
DEFAULT_EVAL_REASONING_EFFORT = "medium"
DEFAULT_EVAL_PARALLELISM = 4


def resolve_parallelism(requested, total):
    """Resolve an explicit limit or the bounded parallel default."""
    available = max(1, int(total or 0))
    limit = DEFAULT_EVAL_PARALLELISM if requested is None else max(1, int(requested))
    return min(limit, available)


def configure_codex_runtime():
    """Return the system Codex binary path when available."""
    return shutil.which("codex")


def default_codex_model(cwd=None):
    """Return MetaSkill's explicit unattended default model."""
    return DEFAULT_EVAL_MODEL if configure_codex_runtime() else None
