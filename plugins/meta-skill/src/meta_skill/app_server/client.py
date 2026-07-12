"""OpenAI Codex SDK import boundary."""

import importlib

from ..errors import CliError


REQUIRED_TOP_LEVEL = ("ApprovalMode", "Codex", "CodexConfig", "Sandbox", "SkillInput", "TextInput")
REQUIRED_GENERATED = ("ItemCompletedNotification", "TurnCompletedNotification")


def sdk_version():
    try:
        module = importlib.import_module("openai_codex")
    except Exception:
        return None
    return getattr(module, "__version__", "unknown")


def load_sdk():
    try:
        openai_codex = importlib.import_module("openai_codex")
        generated = importlib.import_module("openai_codex.generated.v2_all")
    except Exception as exc:
        raise CliError(f"openai-codex SDK unavailable: {exc}", 2) from exc
    missing = [name for name in REQUIRED_TOP_LEVEL if not hasattr(openai_codex, name)]
    missing.extend(name for name in REQUIRED_GENERATED if not hasattr(generated, name))
    if missing:
        raise CliError(f"openai-codex SDK missing required symbols: {', '.join(sorted(missing))}", 2)
    return openai_codex, generated


def app_server_readiness():
    try:
        openai_codex, generated = load_sdk()
    except CliError as exc:
        return False, exc.message, exc.detail
    symbols = [getattr(openai_codex, name) for name in REQUIRED_TOP_LEVEL]
    symbols.extend(getattr(generated, name) for name in REQUIRED_GENERATED)
    turn_handle = getattr(openai_codex, "TurnHandle", None)
    interrupt_supported = bool(turn_handle and callable(getattr(turn_handle, "interrupt", None)))
    return all(symbols), "required App Server SDK symbols available", {
        "sdk_version": sdk_version(),
        "turn_interrupt": interrupt_supported,
        "ephemeral_threads": True,
    }
