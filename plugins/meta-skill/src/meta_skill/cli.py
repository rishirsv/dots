#!/usr/bin/env python3
"""Meta Skill CLI.

One agent-facing command surface for skill validation, packaging, eval
materialization, App Server-backed trial runs, progress, and grading.
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

from .app_server.client import app_server_readiness
from .calibration import calibrate_run
from .errors import CliError
from .grading import grade_run, human_review_packet, record_human_grade
from .io import emit, fail, read_json, resolve_run_dir
from .linting import lint_suite
from .packaging import package_skill
from .presets import apply_preset, build_preset_report, load_preset, preset_lint, render_preset_markdown, resolve_preset_ref
from .report import build_report, list_runs, render_markdown
from .runner import progress_snapshot, run_eval, terminal_count
from .sessions import extract_thread_improvement, list_threads, render_thread_list, show_thread
from .validation import validate_report
from .workbench import init_workbench, materialize_cases


def command_doctor(args):
    checks = []

    def add(name, ok, message, detail=None):
        checks.append({"name": name, "ok": bool(ok), "message": message, "detail": detail})

    add(
        "python_version",
        sys.version_info >= (3, 10),
        f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
    )
    cli_path = Path(__file__).resolve()
    package_root = cli_path.parent
    add("cli_source", cli_path.exists(), str(cli_path))
    validator_paths = [package_root / name for name in ("validate_skill.py", "lint_authoring.py")]
    add("validators_canonical", all(path.exists() for path in validator_paths), "package validators")
    try:
        import openai_codex

        add("openai_codex_sdk", True, getattr(openai_codex, "__version__", "unknown"))
    except Exception as exc:
        add("openai_codex_sdk", False, str(exc))
    ok_sdk, message, detail = app_server_readiness()
    add("codex_app_server_sdk", ok_sdk, message, detail)
    ok = all(item["ok"] for item in checks)
    result = {"ok": ok, "checks": checks}
    emit(result, args.json)
    return 0 if ok else 1


def command_workbench_init(args):
    target = Path(args.target or ".").expanduser().resolve()
    emit(init_workbench(target, args.dry_run), args.json)
    return 0


def command_sessions_list(args):
    rows = list_threads(
        limit=args.limit,
        archived=args.archived,
        days=args.days,
        query=args.query,
        cwd=args.cwd,
    )
    if args.json:
        emit({"ok": True, "threads": [row.as_dict() for row in rows]}, True)
    else:
        print(render_thread_list(rows))
    return 0


def command_sessions_show(args):
    result = show_thread(args.thread_id, max_chars=args.max_chars)
    if args.json:
        emit(result, True)
    else:
        print(result["transcript_markdown"], end="")
    return 0


def command_sessions_extract(args):
    result = extract_thread_improvement(
        args.thread_id,
        target=args.target,
        max_chars=args.max_chars,
    )
    if args.out:
        out_path = Path(args.out).expanduser()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(result["handoff_markdown"])
        result = {**result, "out": str(out_path)}
    if args.json:
        emit(result, True)
    elif args.out:
        print(f"Wrote {result['out']}")
    else:
        print(result["handoff_markdown"], end="")
    return 0 if result["ok"] else 1


def command_eval_materialize(args):
    emit(materialize_cases(args.suite, args.force), args.json)
    return 0


def command_eval_lint(args):
    result = lint_suite(args.suite)
    if getattr(args, "preset", None):
        resolved = resolve_preset_ref(args.preset, args.suite)
        result = {"suite": result, "preset": preset_lint(str(resolved))}
    emit(result, args.json)
    return 0


def command_eval_run(args):
    if getattr(args, "preset", None):
        resolved = resolve_preset_ref(args.preset, args.suite)
        apply_preset(args, load_preset(str(resolved)))
    result = run_eval(args)
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_eval_progress(args):
    if args.watch:
        seen = None
        while True:
            snap = progress_snapshot(args.run)
            if snap != seen:
                emit(snap, args.json)
                seen = snap
            if terminal_count(snap) >= snap["trials"]:
                break
            time.sleep(2)
        return 0
    emit(progress_snapshot(args.run), args.json)
    return 0


def command_eval_grade(args):
    result = grade_run(args.run)
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_eval_calibrate(args):
    emit(calibrate_run(args.run, args.metric), args.json)
    return 0


def command_eval_human(args):
    if args.label:
        if not args.trial:
            raise CliError("--trial is required when recording a human grade", 2)
        result = record_human_grade(
            args.run,
            trial_id=args.trial,
            grader_id=args.grader,
            metric=args.metric,
            label=args.label,
            score=args.score,
            rationale=args.rationale or "",
            reviewer=args.reviewer,
        )
    else:
        result = human_review_packet(args.run, args.trial)
    emit(result, args.json)
    return 0


def command_eval_list(args):
    result = list_runs(args.suite)
    preset = getattr(args, "preset", None)
    if preset:
        loaded = load_preset(str(resolve_preset_ref(preset, args.suite)))
        preset_id = loaded["id"]
        preset_path = str(loaded["path"])
        matching = []
        for row in result["runs"]:
            run_dir = Path(result["runs_dir"]) / row["run_id"]
            try:
                run = read_json(run_dir / "run.json")
            except CliError:
                continue
            if run.get("preset_id") == preset_id or run.get("preset_path") == preset_path:
                matching.append(row)
        result = dict(result)
        result["runs"] = matching
    emit(result, args.json)
    return 0


def command_eval_report(args):
    preset = getattr(args, "preset", None)
    run = None
    if not preset:
        try:
            run = read_json(resolve_run_dir(args.run) / "run.json")
        except CliError:
            run = None
    use_preset = bool(preset) or bool(run and run.get("preset_path"))
    if use_preset:
        report = build_preset_report(args.run, preset)
        markdown = render_preset_markdown(report)
        run_id = report["run"]["run_id"]
    else:
        report = build_report(args.run)
        markdown = render_markdown(report)
        run_id = report["run_id"]
    if args.out:
        out_path = Path(args.out).expanduser()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(markdown)
        emit({"ok": True, "run_id": run_id, "out": str(out_path)}, args.json)
    elif args.json:
        emit(report, True)
    else:
        print(markdown, end="")
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
    parser = argparse.ArgumentParser(prog="meta-skill", description="Meta Skill workbench CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    doctor = sub.add_parser("doctor", help="Check Python, validator, and App Server SDK readiness")
    doctor.add_argument("--json", action="store_true")
    doctor.set_defaults(func=command_doctor)

    workbench = sub.add_parser("workbench", help="Workbench commands")
    workbench_sub = workbench.add_subparsers(dest="workbench_command", required=True)
    init = workbench_sub.add_parser("init", help="Create .<skill-name> workbench guidance")
    init.add_argument("--target", default=".")
    init.add_argument("--dry-run", action="store_true")
    init.add_argument("--json", action="store_true")
    init.set_defaults(func=command_workbench_init)

    sessions = sub.add_parser("sessions", help="Codex local session evidence commands")
    sessions_sub = sessions.add_subparsers(dest="sessions_command", required=True)
    sessions_list = sessions_sub.add_parser("list", help="List Codex sessions from state_5.sqlite")
    sessions_list.add_argument("--limit", type=int, default=25)
    sessions_list.add_argument("--archived", choices=["active", "archived", "all"], default="active")
    sessions_list.add_argument("--days", type=int)
    sessions_list.add_argument("--query")
    sessions_list.add_argument("--cwd")
    sessions_list.add_argument("--json", action="store_true")
    sessions_list.set_defaults(func=command_sessions_list)

    sessions_show = sessions_sub.add_parser("show", help="Render one Codex session transcript")
    sessions_show.add_argument("thread_id")
    sessions_show.add_argument("--max-chars", type=int, default=12000)
    sessions_show.add_argument("--json", action="store_true")
    sessions_show.set_defaults(func=command_sessions_show)

    sessions_extract = sessions_sub.add_parser("extract", help="Build a read-only thread-to-skill improvement handoff")
    sessions_extract.add_argument("thread_id")
    sessions_extract.add_argument("--target", help="Target skill directory or SKILL.md")
    sessions_extract.add_argument("--max-chars", type=int, default=12000)
    sessions_extract.add_argument("--out", help="Write the Markdown handoff to this file instead of stdout")
    sessions_extract.add_argument("--json", action="store_true")
    sessions_extract.set_defaults(func=command_sessions_extract)

    eval_parser = sub.add_parser("eval", help="Evaluation commands")
    eval_sub = eval_parser.add_subparsers(dest="eval_command", required=True)
    lint = eval_sub.add_parser("lint", help="Check eval manifest task, grader, and coverage shape")
    lint.add_argument("--suite")
    lint.add_argument("--preset", help="Also lint this preset (name or path)")
    lint.add_argument("--json", action="store_true")
    lint.set_defaults(func=command_eval_lint)

    materialize = eval_sub.add_parser("materialize", help="Materialize cases from evals.json")
    materialize.add_argument("--suite")
    materialize.add_argument("--force", action="store_true")
    materialize.add_argument("--json", action="store_true")
    materialize.set_defaults(func=command_eval_materialize)

    run = eval_sub.add_parser("run", help="Run selected eval trials")
    run.add_argument("--suite")
    run.add_argument("--candidates")
    run.add_argument("--split")
    run.add_argument("--case", action="append", help="Run only this case id; repeat or comma-separate for several")
    run.add_argument("--type", action="append", help="Run only this case type; repeat or comma-separate for several")
    run.add_argument("--repetitions", type=int)
    run.add_argument("--preset", help="Run the task and candidate slice selected by this preset (name or path)")
    run.add_argument("--model")
    run.add_argument("--no-grade", action="store_true", help="Run trials without grading; intended only for runtime debugging")
    run.add_argument("--json", action="store_true")
    run.set_defaults(func=command_eval_run)

    progress = eval_sub.add_parser("progress", help="Read compact run progress")
    progress.add_argument("--run", required=True)
    progress.add_argument("--watch", action="store_true")
    progress.add_argument("--json", action="store_true")
    progress.set_defaults(func=command_eval_progress)

    grade = eval_sub.add_parser("grade", help="Grade completed eval outputs")
    grade.add_argument("--run", required=True)
    grade.add_argument("--json", action="store_true")
    grade.set_defaults(func=command_eval_grade)

    calibrate = eval_sub.add_parser("calibrate", help="Compare model judge grades against human grades")
    calibrate.add_argument("--run", required=True)
    calibrate.add_argument("--metric", help="Restrict calibration to one shared grade metric")
    calibrate.add_argument("--json", action="store_true")
    calibrate.set_defaults(func=command_eval_calibrate)

    human = eval_sub.add_parser("human", help="Show or record human grades for one eval run")
    human.add_argument("--run", required=True)
    human.add_argument("--trial", help="Restrict to one trial, or required when recording a grade")
    human.add_argument("--grader", default="human-review")
    human.add_argument("--metric", default="human-review")
    human.add_argument("--label", choices=["pass", "partial", "fail", "unknown"])
    human.add_argument("--score", type=float)
    human.add_argument("--rationale")
    human.add_argument("--reviewer")
    human.add_argument("--json", action="store_true")
    human.set_defaults(func=command_eval_human)

    list_runs_parser = eval_sub.add_parser("list", help="List eval runs in the workbench")
    list_runs_parser.add_argument("--suite")
    list_runs_parser.add_argument("--preset", help="List only runs associated with this preset (name or path)")
    list_runs_parser.add_argument("--json", action="store_true")
    list_runs_parser.set_defaults(func=command_eval_list)

    report = eval_sub.add_parser("report", help="Render a readable report for one run")
    report.add_argument("--run", required=True)
    report.add_argument("--preset", help="Render the preset scorecard report using this preset (name or path)")
    report.add_argument("--out", help="Write the Markdown report to this file instead of stdout")
    report.add_argument("--json", action="store_true")
    report.set_defaults(func=command_eval_report)

    validate = sub.add_parser("validate", help="Validate a skill payload")
    validate.add_argument("skill_dir")
    validate.add_argument("--json", action="store_true")
    validate.set_defaults(func=command_validate)

    package = sub.add_parser("package", help="Package a skill payload")
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
