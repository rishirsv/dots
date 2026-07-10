"""Caller-side Codex runtime selection for the vendored App Server adapter."""

import importlib
import shutil
import threading

_LOCK = threading.Lock()
_CONFIGURED_PATH = None
_DEFAULT_MODEL = None


def _accept_runtime_reasoning_efforts():
    """Keep model discovery forward-compatible with new runtime effort labels."""
    try:
        from openai_codex.generated import v2_all

        field = v2_all.ReasoningEffortOption.model_fields["reasoning_effort"]
        if field.annotation is str:
            return
        field.annotation = str
        v2_all.ReasoningEffortOption.model_rebuild(force=True)
        v2_all.Model.model_rebuild(force=True)
        v2_all.ModelListResponse.model_rebuild(force=True)
    except (AttributeError, ImportError, KeyError):
        return


def configure_codex_runtime():
    """Prefer the authenticated system Codex binary when one is available."""
    global _CONFIGURED_PATH
    with _LOCK:
        if _CONFIGURED_PATH is not None:
            return _CONFIGURED_PATH
        binary = shutil.which("codex")
        if not binary:
            return None
        try:
            openai_codex = importlib.import_module("openai_codex")
        except Exception:
            return None
        original = openai_codex.CodexConfig
        if getattr(original, "_metaskill_system_binary", None):
            _CONFIGURED_PATH = original._metaskill_system_binary
            return _CONFIGURED_PATH

        def system_codex_config(*args, **kwargs):
            if not args:
                kwargs.setdefault("codex_bin", binary)
            return original(*args, **kwargs)

        system_codex_config._metaskill_system_binary = binary
        openai_codex.CodexConfig = system_codex_config
        _CONFIGURED_PATH = binary
        return binary


def default_codex_model(cwd=None):
    """Ask Codex for the account's supported default instead of trusting stale config."""
    global _DEFAULT_MODEL
    configure_codex_runtime()
    with _LOCK:
        if _DEFAULT_MODEL is not None:
            return _DEFAULT_MODEL
        try:
            openai_codex = importlib.import_module("openai_codex")
            _accept_runtime_reasoning_efforts()
            with openai_codex.Codex(openai_codex.CodexConfig(cwd=str(cwd) if cwd else None)) as codex:
                models = codex.models()
            selected = next((row.model for row in models.data if row.is_default), None)
        except Exception:
            return None
        _DEFAULT_MODEL = selected
        return selected
