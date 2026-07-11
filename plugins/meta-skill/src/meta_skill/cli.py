#!/usr/bin/env python3
"""Compact automation surface for the MetaSkill workbench."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

from .app_server.client import app_server_readiness
from .errors import CliError
from .grading import grade_run, record_human_grade
from .io import emit, fail
from .linting import FATAL_SUITE_WARNINGS, lint_suite
from .manifest import (
    load_manifest,
    project_from_suite,
    runs_from_suite,
    skill_id_from_suite,
    suite_path,
    workbench_from_suite,
    worktrees_from_suite,
)
from .packaging import package_skill
from .report import build_report, list_runs, render_markdown, write_report
from .runtime import default_codex_model
from .runner import run_eval
from .sessions import list_threads, render_thread_list, show_thread
from .validation import validate_report
from .workbench import init_target, status_snapshot


def command_doctor(args):
    checks = []

    def add(name, ok, message, detail=None):
        checks.append({"name": name, "ok": bool(ok), "message": message, "detail": detail})

    add("python_version", sys.version_info >= (3, 10), sys.version.split()[0])
    add("validators", all((Path(__file__).parent / name).exists() for name in ("validate_skill.py", "lint_authoring.py")), "bundled validators")
    try:
        import openai_codex

        add("openai_codex_sdk", True, getattr(openai_codex, "__version__", "installed"))
    except Exception as exc:
        add("openai_codex_sdk", False, str(exc))
    ready, message, detail = app_server_readiness()
    add("codex_app_server_sdk", ready, message, detail)
    codex = shutil.which("codex")
    add("codex_binary", bool(codex), codex or "codex not found on PATH")
    if codex:
        try:
            proc = subprocess.run([codex, "login", "status"], capture_output=True, text=True, timeout=10)
            auth_message = (proc.stdout or proc.stderr or "no login status output").strip()
            add("codex_auth", proc.returncode == 0, auth_message)
        except (OSError, subprocess.TimeoutExpired) as exc:
            add("codex_auth", False, str(exc))
        default_model = default_codex_model(Path.cwd())
        add("codex_default_model", bool(default_model), default_model or "no supported default model reported")
    else:
        add("codex_auth", False, "cannot check auth without the Codex binary")
        add("codex_default_model", False, "cannot list models without the Codex binary")
    result = {"ok": all(check["ok"] for check in checks), "checks": checks}
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_init(args):
    emit(init_target(Path(args.target).expanduser().resolve(), args.dry_run, with_evals=args.evals), args.json)
    return 0


def _status_text(status):
    suite = status["suite"]
    lines = [
        f"target: {status['target']}",
        f"state: {status['state']['path']} ({'ready' if status['state']['exists'] else 'missing'})",
        f"suite: {suite['path']} ({'ready' if suite['exists'] else 'missing'})",
    ]
    if suite["exists"]:
        lines.append(f"evals: {suite.get('eval_count', 0)} {suite.get('eval_types', {})}")
    lines.append(f"runs: {status['runs']['count']}")
    latest = status["runs"].get("latest")
    if latest:
        lines.append(f"latest: {latest.get('run_id')} {latest.get('totals')}")
    return "\n".join(lines)


def command_status(args):
    result = status_snapshot(args.target)
    emit(result if args.json else _status_text(result), args.json)
    return 0


def command_sessions_list(args):
    rows = list_threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query, cwd=args.cwd)
    emit({"ok": True, "threads": [row.as_dict() for row in rows]} if args.json else render_thread_list(rows), args.json)
    return 0


def command_sessions_show(args):
    result = show_thread(args.thread_id, max_chars=args.max_chars)
    emit(result if args.json else result["transcript_markdown"], args.json)
    return 0 if result["ok"] else 1


def _run_context(args):
    suite = suite_path(args.suite)
    manifest = load_manifest(suite)
    return {
        "manifest": manifest,
        "suite": suite,
        "workbench": workbench_from_suite(suite),
        "project": project_from_suite(suite),
        "skill_id": skill_id_from_suite(suite),
        "runs_root": runs_from_suite(suite),
        "worktrees_root": worktrees_from_suite(suite),
        "adhoc": False,
    }


def _fatal_lint(result):
    return [warning for warning in result.get("warnings", []) if warning.get("kind") in FATAL_SUITE_WARNINGS]


def command_eval_run(args):
    if args.adhoc:
        if not args.task:
            raise CliError("--adhoc requires --task", 2)
        result = run_eval(args)
        emit(result, args.json)
        return 0 if result["ok"] else 1
    context = _run_context(args)
    lint = lint_suite(str(context["suite"]))
    fatal = _fatal_lint(lint)
    if args.check:
        result = {"ok": not fatal, "lint": lint}
        emit(result, args.json)
        return 0 if result["ok"] else 1
    if fatal:
        details = ", ".join(sorted({warning.get("kind", "lint") for warning in fatal}))
        raise CliError(f"suite lint blocks the run: {details}", 2)
    result = run_eval(args, context=context)
    result["lint"] = lint
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_eval_grade(args):
    result = grade_run(args.run, parallel=args.parallel, model=args.model)
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_eval_record(args):
    result = record_human_grade(
        args.run,
        trial_id=args.trial,
        grader_id=args.grader,
        metric=args.metric,
        label=args.label,
        score=args.score,
        rationale=args.rationale,
    )
    emit(result, args.json)
    return 0


def command_eval_list(args):
    result = list_runs(args.suite)
    emit(result, args.json)
    return 0


def command_eval_report(args):
    report = build_report(args.run)
    if args.out:
        output = write_report(report, Path(args.out).expanduser())
        emit({"ok": True, "run_id": report["run_id"], "out": str(output)}, args.json)
    elif args.json:
        emit(report, True)
    else:
        print(render_markdown(report), end="")
    return 0


def command_workbench_open(args):
    from .workbench_server.server import run_workbench_server

    run_workbench_server(Path(args.root).expanduser().resolve(), port=args.port, open_browser=args.open)
    return 0


def command_validate(args):
    result = validate_report(args.skill_dir)
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_package(args):
    result = package_skill(args.skill_dir, args.out_dir)
    emit(result, args.json)
    return 0 if result["ok"] else 1


def build_parser():
    parser = argparse.ArgumentParser(prog="metaskill", description="Skill authoring and evaluation workbench")
    sub = parser.add_subparsers(dest="command", required=True)

    doctor = sub.add_parser("doctor", help="Check runtime and Codex readiness")
    doctor.add_argument("--json", action="store_true")
    doctor.set_defaults(func=command_doctor)

    init = sub.add_parser("init", help="Create repository MetaSkill state")
    init.add_argument("target", nargs="?", default=".")
    init.add_argument("--evals", action="store_true", help="Also create an empty evals.json")
    init.add_argument("--dry-run", action="store_true")
    init.add_argument("--json", action="store_true")
    init.set_defaults(func=command_init)

    status = sub.add_parser("status", help="Show suite readiness and run history")
    status.add_argument("target", nargs="?", default=".")
    status.add_argument("--json", action="store_true")
    status.set_defaults(func=command_status)

    sessions = sub.add_parser("sessions", help="Inspect local Codex sessions")
    sessions_sub = sessions.add_subparsers(dest="sessions_command", required=True)
    sessions_list = sessions_sub.add_parser("list", help="List local sessions")
    sessions_list.add_argument("--limit", type=int, default=25)
    sessions_list.add_argument("--archived", choices=["active", "archived", "all"], default="active")
    sessions_list.add_argument("--days", type=int)
    sessions_list.add_argument("--query")
    sessions_list.add_argument("--cwd")
    sessions_list.add_argument("--json", action="store_true")
    sessions_list.set_defaults(func=command_sessions_list)
    sessions_show = sessions_sub.add_parser("show", help="Render one session transcript")
    sessions_show.add_argument("thread_id")
    sessions_show.add_argument("--max-chars", type=int, default=12000)
    sessions_show.add_argument("--json", action="store_true")
    sessions_show.set_defaults(func=command_sessions_show)

    evaluate = sub.add_parser("eval", help="Run and inspect evaluations")
    eval_sub = evaluate.add_subparsers(dest="eval_command", required=True)
    run = eval_sub.add_parser("run", help="Run a suite or one-off task")
    run.add_argument("--suite")
    run.add_argument("--objective")
    run.add_argument("--baseline")
    run.add_argument("--candidates")
    run.add_argument("--split")
    run.add_argument("--case", action="append")
    run.add_argument("--type", action="append")
    run.add_argument("--repetitions", type=int)
    run.add_argument("--model")
    run.add_argument("--parallel", type=int, default=1)
    run.add_argument("--timeout", type=int)
    run.add_argument("--no-baseline", action="store_true")
    run.add_argument("--no-grade", action="store_true")
    run.add_argument("--human-review-sample", type=int)
    run.add_argument("--source-run-id")
    run.add_argument("--adhoc", action="store_true")
    run.add_argument("--task")
    run.add_argument("--skill")
    run.add_argument("--expected-output")
    run.add_argument("--expectation", dest="expectations", action="append")
    run.add_argument("--eval-type", dest="adhoc_type", choices=["capability", "regression", "failure"])
    run.add_argument("--priority", choices=["high", "medium", "low"])
    run.add_argument("--check", action="store_true")
    run.add_argument("--json", action="store_true")
    run.set_defaults(func=command_eval_run)

    grade = eval_sub.add_parser("grade", help="Regrade frozen run inputs")
    grade.add_argument("--run", required=True)
    grade.add_argument("--model")
    grade.add_argument("--parallel", type=int, default=1)
    grade.add_argument("--json", action="store_true")
    grade.set_defaults(func=command_eval_grade)

    record = eval_sub.add_parser("record", help="Append a declared human grade")
    record.add_argument("--run", required=True)
    record.add_argument("--trial", required=True)
    record.add_argument("--grader")
    record.add_argument("--metric")
    record.add_argument("--label", choices=["pass", "partial", "fail", "unknown"], required=True)
    record.add_argument("--score", type=float)
    record.add_argument("--rationale", required=True)
    record.add_argument("--json", action="store_true")
    record.set_defaults(func=command_eval_record)

    run_list = eval_sub.add_parser("list", help="List suite runs")
    run_list.add_argument("--suite")
    run_list.add_argument("--json", action="store_true")
    run_list.set_defaults(func=command_eval_list)
    report = eval_sub.add_parser("report", help="Read or export one run report")
    report.add_argument("--run", required=True)
    report.add_argument("--out")
    report.add_argument("--json", action="store_true")
    report.set_defaults(func=command_eval_report)

    workbench = sub.add_parser("workbench", help="Open the repository evaluation workbench")
    workbench_sub = workbench.add_subparsers(dest="workbench_command", required=True)
    open_command = workbench_sub.add_parser("open", help="Serve the workbench UI")
    open_command.add_argument("--root", default=".")
    open_command.add_argument("--port", type=int, default=7333)
    open_command.add_argument("--open", action=argparse.BooleanOptionalAction, default=True)
    open_command.set_defaults(func=command_workbench_open)

    validate = sub.add_parser("validate", help="Validate a skill payload")
    validate.add_argument("skill_dir")
    validate.add_argument("--json", action="store_true")
    validate.set_defaults(func=command_validate)
    package = sub.add_parser("package", help="Package a validated skill payload")
    package.add_argument("skill_dir")
    package.add_argument("--out-dir")
    package.add_argument("--json", action="store_true")
    package.set_defaults(func=command_package)
    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except CliError as exc:
        return fail(exc.message, getattr(args, "json", False), exc.code, exc.detail)
    except KeyboardInterrupt:
        return fail("interrupted", getattr(args, "json", False), 130)


if __name__ == "__main__":
    raise SystemExit(main())
