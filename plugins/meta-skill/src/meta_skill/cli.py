#!/usr/bin/env python3
"""Compact automation surface for the MetaSkill workbench."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from .codex_exec import codex_readiness
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
from .runner import finalize_eval, prepare_eval, retry_trial, run_eval, submit_trial, unresolved_trials
from .sessions import list_threads, render_thread_list, show_thread
from .suite_checks import check_suite
from .validation import validate_report
from .workbench import init_target, status_snapshot


def positive_int(raw):
    value = int(raw)
    if value < 1:
        raise argparse.ArgumentTypeError("must be at least 1")
    return value


def command_doctor(args):
    checks = []

    def add(name, ok, message, detail=None):
        checks.append({"name": name, "ok": bool(ok), "message": message, "detail": detail})

    add("python_version", sys.version_info >= (3, 10), sys.version.split()[0])
    add("validator", (Path(__file__).parent / "validation.py").exists(), "bundled validator")
    codex = shutil.which("codex")
    add("codex_binary", bool(codex), codex or "codex not found on PATH")
    if codex:
        ready, message, detail = codex_readiness()
        add("codex_auth", ready, (detail or {}).get("auth") or message)
        add("codex_cli", ready, message, detail)
    else:
        add("codex_auth", False, "cannot check auth without the Codex binary")
        add("codex_cli", False, "cannot check Codex without the binary")
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
        checks = check_suite(context["manifest"], context["suite"])
        result = {"ok": not fatal and checks["ok"], "lint": lint, "suite_checks": checks}
        emit(result, args.json)
        return 0 if result["ok"] else 1
    if fatal:
        details = ", ".join(sorted({warning.get("kind", "lint") for warning in fatal}))
        raise CliError(f"suite lint blocks the run: {details}", 2)
    result = run_eval(args, context=context)
    result["lint"] = lint
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_eval_prepare(args):
    if args.adhoc:
        if not args.task:
            raise CliError("--adhoc requires --task", 2)
        result = prepare_eval(args, task_executor_kind="native_subagent")
        emit(result, args.json)
        return 0
    context = _run_context(args)
    lint = lint_suite(str(context["suite"]))
    fatal = _fatal_lint(lint)
    if fatal:
        details = ", ".join(sorted({warning.get("kind", "lint") for warning in fatal}))
        raise CliError(f"suite lint blocks the run: {details}", 2)
    result = prepare_eval(args, context=context, task_executor_kind="native_subagent")
    result["lint"] = lint
    emit(result, args.json)
    return 0


def command_eval_submit(args):
    result = submit_trial(args.run, args.trial, args.attempt, args.result)
    emit({"ok": True, "state": result}, args.json)
    return 0


def command_eval_finalize(args):
    result = finalize_eval(
        args.run,
        grade=args.grade,
        parallel=args.parallel,
        model=args.model,
        reasoning_effort=args.reasoning_effort,
    )
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_eval_unresolved(args):
    emit(unresolved_trials(args.run), args.json)
    return 0


def command_eval_retry(args):
    emit(retry_trial(args.run, args.trial), args.json)
    return 0


def command_eval_grade(args):
    result = grade_run(
        args.run,
        parallel=args.parallel,
        model=args.model,
        reasoning_effort=args.reasoning_effort,
    )
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

    def add_run_arguments(command, *, check=False):
        command.add_argument("--suite")
        command.add_argument("--objective")
        command.add_argument("--baseline")
        command.add_argument("--candidates")
        command.add_argument("--split")
        command.add_argument("--case", action="append")
        command.add_argument("--type", action="append")
        command.add_argument("--repetitions", type=positive_int)
        command.add_argument("--model")
        command.add_argument("--reasoning-effort", choices=["none", "minimal", "low", "medium", "high", "xhigh"])
        command.add_argument("--parallel", type=positive_int, default=1)
        command.add_argument("--timeout", type=positive_int)
        command.add_argument("--no-baseline", action="store_true")
        command.add_argument("--no-grade", action="store_true")
        command.add_argument("--resume-run-id", help="Reuse exact completed trials from an interrupted run")
        command.add_argument("--gate", action="store_true", help="Exit non-zero on candidate regressions or unknown outcomes")
        command.add_argument("--adhoc", action="store_true")
        command.add_argument("--task")
        command.add_argument("--skill")
        command.add_argument("--expected-output")
        command.add_argument("--expectation", dest="expectations", action="append")
        command.add_argument("--eval-type", dest="adhoc_type", choices=["capability", "regression", "failure"])
        command.add_argument("--priority", choices=["high", "medium", "low"])
        if check:
            command.add_argument("--check", action="store_true")
        command.add_argument("--json", action="store_true")

    run = eval_sub.add_parser("run", help="Run a suite unattended with ephemeral Codex Exec workers")
    add_run_arguments(run, check=True)
    run.set_defaults(func=command_eval_run)

    prepare = eval_sub.add_parser("prepare", help="Freeze a run and emit workspace-local worker packets")
    add_run_arguments(prepare)
    prepare.set_defaults(func=command_eval_prepare)

    submit = eval_sub.add_parser("submit", help="Import one workspace-local worker result")
    submit.add_argument("--run", required=True)
    submit.add_argument("--trial", required=True)
    submit.add_argument("--attempt", required=True)
    submit.add_argument("--result", required=True)
    submit.add_argument("--json", action="store_true")
    submit.set_defaults(func=command_eval_submit)

    finalize = eval_sub.add_parser("finalize", help="Grade and render a run after every trial resolves")
    finalize.add_argument("--run", required=True)
    finalize.add_argument("--grade", action=argparse.BooleanOptionalAction, default=None)
    finalize.add_argument("--parallel", type=positive_int)
    finalize.add_argument("--model")
    finalize.add_argument("--reasoning-effort", choices=["none", "minimal", "low", "medium", "high", "xhigh"])
    finalize.add_argument("--json", action="store_true")
    finalize.set_defaults(func=command_eval_finalize)

    unresolved = eval_sub.add_parser("unresolved", help="Show unresolved worker packets for an interrupted run")
    unresolved.add_argument("--run", required=True)
    unresolved.add_argument("--json", action="store_true")
    unresolved.set_defaults(func=command_eval_unresolved)

    retry = eval_sub.add_parser("retry", help="Issue a new attempt for one unresolved trial")
    retry.add_argument("--run", required=True)
    retry.add_argument("--trial", required=True)
    retry.add_argument("--json", action="store_true")
    retry.set_defaults(func=command_eval_retry)

    grade = eval_sub.add_parser("grade", help="Regrade frozen run inputs")
    grade.add_argument("--run", required=True)
    grade.add_argument("--model")
    grade.add_argument(
        "--reasoning-effort",
        choices=["none", "minimal", "low", "medium", "high", "xhigh"],
    )
    grade.add_argument("--parallel", type=positive_int, default=1)
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
