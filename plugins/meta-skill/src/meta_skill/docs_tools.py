"""Documentation gates: generated CLI surface and duplication/budget lint."""

import re
from pathlib import Path

from .errors import CliError

PLUGIN_ROOT = Path(__file__).resolve().parents[2]
CLI_MD = PLUGIN_ROOT / "references" / "cli.md"
BEGIN_MARK = "<!-- BEGIN GENERATED: cli-surface (metaskill docs emit-cli --write) -->"
END_MARK = "<!-- END GENERATED: cli-surface -->"
LAUNCHER_PREFIX = "<meta-skill-root>/scripts/metaskill"

SHINGLE_WORDS = 30
BUDGET_WARN_LINES = 6000
BUDGET_FAIL_LINES = 6500


def _iter_leaf_parsers(parser, path=()):
    import argparse

    sub_actions = [a for a in parser._actions if isinstance(a, argparse._SubParsersAction)]
    if not sub_actions:
        if path:
            yield path, parser
        return
    for action in sub_actions:
        for name, sub in action.choices.items():
            yield from _iter_leaf_parsers(sub, path + (name,))


def _flag_token(action):
    opt = sorted(action.option_strings, key=len, reverse=True)[0]
    if action.nargs == 0:
        token = opt
    elif action.choices:
        token = f"{opt} {'|'.join(str(choice) for choice in action.choices)}"
    else:
        token = f"{opt} <{(action.metavar or action.dest).lower().replace('_', '-')}>"
    return token if action.required else f"[{token}]"


def _usage_line(path, parser):
    parts = [LAUNCHER_PREFIX, *path]
    for action in parser._actions:
        if action.option_strings or action.dest == "help":
            continue
        parts.append(f"<{action.dest.replace('_', '-')}>")
    for action in parser._actions:
        if not action.option_strings or set(action.option_strings) & {"-h", "--help"}:
            continue
        parts.append(_flag_token(action))
    return " ".join(parts)


def render_cli_surface():
    from .cli import build_parser

    lines = [_usage_line(path, parser) for path, parser in _iter_leaf_parsers(build_parser())]
    return "\n".join(["```sh", *lines, "```"])


def _split_generated_block(text):
    begin = text.find(BEGIN_MARK)
    end = text.find(END_MARK)
    if begin == -1 or end == -1 or end < begin:
        raise CliError(f"generated cli-surface markers not found in {CLI_MD}", 2)
    head = text[: begin + len(BEGIN_MARK)]
    tail = text[end:]
    current = text[begin + len(BEGIN_MARK) : end].strip("\n")
    return head, current, tail


def emit_cli(write=False, check=False):
    generated = render_cli_surface()
    text = CLI_MD.read_text()
    head, current, tail = _split_generated_block(text)
    in_sync = current == generated
    if write and not in_sync:
        CLI_MD.write_text(f"{head}\n{generated}\n{tail}")
    ok = in_sync or write
    return {
        "ok": ok if check or write else True,
        "in_sync": in_sync,
        "written": bool(write and not in_sync),
        "path": str(CLI_MD),
        "surface": generated,
    }


def _doc_files():
    files = sorted((PLUGIN_ROOT / "references").glob("*.md"))
    files.extend(sorted((PLUGIN_ROOT / "skills").rglob("*.md")))
    return files


def _shingles(words):
    for index in range(len(words) - SHINGLE_WORDS + 1):
        yield index, " ".join(words[index : index + SHINGLE_WORDS])


def docs_lint():
    files = _doc_files()
    total_lines = 0
    seen = {}
    duplicates = {}
    for path in files:
        text = path.read_text()
        total_lines += len(text.splitlines())
        words = re.sub(r"\s+", " ", text.lower()).split(" ")
        rel = str(path.relative_to(PLUGIN_ROOT))
        for index, shingle in _shingles(words):
            owner = seen.get(shingle)
            if owner is None:
                seen[shingle] = (rel, index)
            elif owner[0] != rel:
                key = (owner[0], rel)
                excerpt = " ".join(shingle.split(" ")[:12]) + " …"
                duplicates.setdefault(key, excerpt)
    duplicate_rows = [
        {"files": list(key), "excerpt": excerpt} for key, excerpt in sorted(duplicates.items())
    ]
    budget_status = "ok"
    if total_lines > BUDGET_FAIL_LINES:
        budget_status = "fail"
    elif total_lines > BUDGET_WARN_LINES:
        budget_status = "warn"
    return {
        "ok": not duplicate_rows and budget_status != "fail",
        "files": len(files),
        "total_lines": total_lines,
        "budget": {"warn": BUDGET_WARN_LINES, "fail": BUDGET_FAIL_LINES, "status": budget_status},
        "shingle_words": SHINGLE_WORDS,
        "duplicates": duplicate_rows,
    }
