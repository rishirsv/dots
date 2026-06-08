#!/usr/bin/env python3
"""Single command runner for Agent Skill project helpers.

Usage:
    meta_skill.py create <skill-dir> --slug <slug> --title <title> --description <description> --job <job>
    meta_skill.py openai-init <skill-name> --path <path> [--resources scripts,references,assets] [--examples] [--project]
    meta_skill.py openai-yaml <skill-dir> [--name <skill-name>] [--interface key=value]
    meta_skill.py lint <skill-dir>
    meta_skill.py quick-validate <skill-dir>
    meta_skill.py package <skill-dir> [--out-dir <dir>]
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

from generate_openai_yaml import write_openai_yaml
from init_skill import ALLOWED_RESOURCES, init_skill as openai_init_skill, package_skill_zip, parse_resources
from quick_validate import validate_skill as quick_validate_skill

MAX_SKILL_NAME_LENGTH = 64
DEFAULT_RUNTIME_FOLDERS = ()
DEFAULT_PACKAGE_EXCLUDES = {
    ".DS_Store",
    ".git",
    ".meta-skill",
    "__pycache__",
    "dist",
}


def normalize_slug(value):
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
    return re.sub(r"-{2,}", "-", slug)


def validate_slug(slug):
    if not slug:
        return "slug must include at least one lowercase letter or digit"
    if len(slug) > MAX_SKILL_NAME_LENGTH:
        return f"slug is too long ({len(slug)} characters; max {MAX_SKILL_NAME_LENGTH})"
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        return "slug must be lowercase hyphen-case with no leading, trailing, or repeated hyphens"
    return None


def yaml_quote(value):
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'


def default_prompt(slug, job):
    return f"Use ${slug} to {job.rstrip('.')}."


def default_short_description(title, job):
    candidates = [
        job.rstrip("."),
        f"{title} workflow helper",
        f"Help with {title} workflows",
    ]
    for candidate in candidates:
        candidate = candidate.strip()
        if 25 <= len(candidate) <= 64:
            return candidate
    value = candidates[-1]
    if len(value) < 25:
        return f"{value} and tasks"[:64]
    return value[:64].rstrip()


def draft_outline(title, description, job, project_mode):
    project_text = "project mode with `.meta-skill/`" if project_mode else "portable-only"
    return f"""## Draft Skill Outline

Replace this outline with final runtime guidance once the interview intake is
settled.

- Job: {job.rstrip('.')}
- Trigger (+ not for): {description}
- Inputs and output: TODO
- Invariants and failure shields: TODO
- Fragility: TODO: judgment prose | fixed shape | script-backed | strict sequence
- Gates: TODO: approval gates or none
- Project mode: {project_text}
- Still open: TODO"""


def rewrite_skill_md(skill_dir, slug, title, description, job, project_mode):
    skill_md = skill_dir / "SKILL.md"
    content = skill_md.read_text()
    replacement_header = f"---\nname: {slug}\ndescription: {yaml_quote(description)}\n---\n\n# {title}\n"
    content = re.sub(r"^---\n.*?\n---\n\n# .+?\n", replacement_header, content, count=1, flags=re.DOTALL)
    outline = draft_outline(title, description, job, project_mode)
    if "## Draft Skill Outline" in content:
        content = re.sub(r"## Draft Skill Outline\n\n.*?\n\n## Overview", f"{outline}\n\n## Overview", content, count=1, flags=re.DOTALL)
    else:
        content = content.replace(f"# {title}\n", f"# {title}\n\n{outline}\n", 1)
    skill_md.write_text(content)


def create_authoring_docs(skill_dir, title, description, job, project_mode):
    meta_dir = skill_dir / ".meta-skill"
    docs_dir = meta_dir / "docs"
    research_dir = docs_dir / "research"
    meta_dir.mkdir(exist_ok=True)
    docs_dir.mkdir(parents=True, exist_ok=True)
    research_dir.mkdir(parents=True, exist_ok=True)
    (meta_dir / "plans").mkdir(exist_ok=True)
    (meta_dir / "tests").mkdir(exist_ok=True)
    notes = f"""# {title} Authoring Notes

This private workbench document is excluded from packaged skills. Use it for
durable non-runtime notes only; keep runtime guidance in `SKILL.md` or linked
runtime files.

## Initial Intake

- Job: {job.rstrip('.')}
- Trigger (+ not for): {description}
- Inputs and output: TODO
- Invariants and failure shields: TODO
- Fragility: TODO
- Gates: TODO
- Project mode: {"project mode with `.meta-skill/`" if project_mode else "portable-only"}
- Still open: TODO

## Source Notes

TODO: Capture source-pack notes, interview decisions, rejected approaches, or
review context that should not ship in the portable payload.

## Research

When authoring requires outside research, store concise reports under
`.meta-skill/docs/research/` and reference only the runtime-relevant conclusions
from `SKILL.md`.

## Portable Payload

The portable payload is the project root: `{skill_dir.name}/`.

Keep build notes, source-specific research, fixtures, package metadata, and
private workbench state under `.meta-skill/` unless they are intentional runtime
dependencies.
"""
    (docs_dir / "intake-notes.md").write_text(notes)


def create_extra_runtime_folders(skill_dir, folders):
    created = []
    for folder in folders:
        folder_path = skill_dir / folder
        if folder_path.exists():
            continue
        folder_path.mkdir(parents=True)
        created.append(folder)
        print(f"[OK] Created {folder}/")
    return created


def create_skill(args):
    slug = normalize_slug(args.slug)
    slug_error = validate_slug(slug)
    if slug_error:
        print(f"[ERROR] {slug_error}")
        return 1
    if slug != args.slug:
        print(f"Note: Normalized slug from '{args.slug}' to '{slug}'.")

    skill_dir = Path(args.skill_dir).expanduser().resolve()
    if skill_dir.exists():
        print(f"[ERROR] Skill directory already exists: {skill_dir}")
        return 1

    folders = list(dict.fromkeys(args.folders))
    openai_resources = [folder for folder in folders if folder in ALLOWED_RESOURCES]
    extra_folders = [folder for folder in folders if folder not in ALLOWED_RESOURCES]
    if args.examples and not openai_resources:
        print("[ERROR] --examples requires --folders to include scripts, references, or assets.")
        return 1

    interface = [
        f"display_name={args.title}",
        f"short_description={args.short_description or default_short_description(args.title, args.job)}",
        f"default_prompt={args.default_prompt or default_prompt(slug, args.job)}",
    ]

    created = openai_init_skill(
        slug,
        str(skill_dir.parent),
        openai_resources,
        args.examples,
        interface + args.interface,
        project=False,
        target_dir=skill_dir,
    )
    if not created:
        return 1

    rewrite_skill_md(skill_dir, slug, args.title, args.description, args.job, args.project)
    print(f"[OK] Updated {skill_dir / 'SKILL.md'}")
    create_extra_runtime_folders(skill_dir, extra_folders)

    if args.project:
        create_authoring_docs(skill_dir, args.title, args.description, args.job, args.project)
        print(f"[OK] Created {skill_dir / '.meta-skill' / 'docs' / 'intake-notes.md'}")
        package_result = package_skill(argparse.Namespace(skill_dir=str(skill_dir), out_dir=None))
        if package_result:
            return package_result
    return lint_skill(argparse.Namespace(skill_dir=str(skill_dir)))


def read_frontmatter(skill_dir):
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        return None, "SKILL.md not found"
    content = skill_md.read_text()
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return None, "SKILL.md must start with YAML frontmatter delimited by ---"
    try:
        frontmatter = yaml.safe_load(match.group(1))
    except yaml.YAMLError as exc:
        return None, f"invalid YAML frontmatter: {exc}"
    if not isinstance(frontmatter, dict):
        return None, "frontmatter must be a YAML mapping"
    return frontmatter, None


def lint_skill(args):
    skill_dir = Path(args.skill_dir).expanduser().resolve()
    frontmatter, error = read_frontmatter(skill_dir)
    failures = []
    warnings = []

    quick_valid, quick_message = quick_validate_skill(skill_dir)
    if not quick_valid:
        failures.append(quick_message)

    if error:
        failures.append(error)
    else:
        unknown = set(frontmatter) - {"name", "description", "license", "allowed-tools", "metadata"}
        if unknown:
            warnings.append(f"unexpected frontmatter key(s): {', '.join(sorted(unknown))}")
        name = frontmatter.get("name")
        description = frontmatter.get("description")
        if not isinstance(name, str) or validate_slug(name):
            failures.append("frontmatter name must be lowercase hyphen-case")
        if not isinstance(description, str) or not description.strip():
            failures.append("frontmatter description must be a non-empty string")
        elif len(description) > 1024:
            failures.append("frontmatter description must be 1024 characters or fewer")
        elif "Use when" not in description or "not for" not in description:
            warnings.append("description should usually include 'Use when ...; not for ...'")

    for folder in ("references", "scripts"):
        folder_path = skill_dir / folder
        if folder_path.exists() and not folder_path.is_dir():
            failures.append(f"{folder}/ exists but is not a directory")

    if (skill_dir / "agents" / "openai.yaml").exists():
        try:
            yaml.safe_load((skill_dir / "agents" / "openai.yaml").read_text())
        except yaml.YAMLError as exc:
            failures.append(f"agents/openai.yaml is invalid YAML: {exc}")

    for message in warnings:
        print(f"[WARN] {message}")
    if failures:
        for message in failures:
            print(f"[FAIL] {message}")
        return 1
    print(f"[OK] Skill lint passed: {skill_dir}")
    return 0


def package_skill(args):
    skill_dir = Path(args.skill_dir).expanduser().resolve()
    lint_result = lint_skill(argparse.Namespace(skill_dir=str(skill_dir)))
    if lint_result:
        return lint_result

    frontmatter, _ = read_frontmatter(skill_dir)
    slug = frontmatter["name"]
    out_dir = Path(args.out_dir).expanduser().resolve() if args.out_dir else skill_dir / ".meta-skill" / "dist"
    out_dir.mkdir(parents=True, exist_ok=True)
    zip_path = package_skill_zip(skill_dir, slug, out_dir)

    metadata_path = out_dir / f"{slug}.package.json"
    metadata_path.write_text(
        json.dumps(
            {
                "slug": slug,
                "source": str(skill_dir),
                "artifact": str(zip_path),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "excluded": sorted(DEFAULT_PACKAGE_EXCLUDES),
            },
            indent=2,
        )
        + "\n"
    )
    print(f"[OK] Wrote {zip_path}")
    print(f"[OK] Wrote {metadata_path}")
    return 0


def openai_init(args):
    raw_skill_name = args.skill_name
    skill_name = normalize_slug(raw_skill_name)
    slug_error = validate_slug(skill_name)
    if slug_error:
        print(f"[ERROR] {slug_error}")
        return 1
    if skill_name != raw_skill_name:
        print(f"Note: Normalized skill name from '{raw_skill_name}' to '{skill_name}'.")

    resources = parse_resources(args.resources)
    if args.examples and not resources:
        print("[ERROR] --examples requires --resources to be set.")
        return 1

    result = openai_init_skill(
        skill_name,
        args.path,
        resources,
        args.examples,
        args.interface,
        args.project,
    )
    return 0 if result else 1


def openai_yaml(args):
    skill_dir = Path(args.skill_dir).expanduser().resolve()
    if not skill_dir.exists():
        print(f"[ERROR] Skill directory not found: {skill_dir}")
        return 1
    if not skill_dir.is_dir():
        print(f"[ERROR] Path is not a directory: {skill_dir}")
        return 1
    skill_name = args.name
    if not skill_name:
        frontmatter, error = read_frontmatter(skill_dir)
        if error:
            print(f"[ERROR] {error}")
            return 1
        skill_name = frontmatter["name"]
    result = write_openai_yaml(skill_dir, skill_name, args.interface)
    return 0 if result else 1


def quick_validate(args):
    valid, message = quick_validate_skill(Path(args.skill_dir).expanduser().resolve())
    print(message)
    return 0 if valid else 1


def parse_folders(raw):
    if not raw:
        return list(DEFAULT_RUNTIME_FOLDERS)
    folders = []
    for value in raw.split(","):
        folder = value.strip().strip("/")
        if not folder:
            continue
        if folder.startswith(".") or ".." in Path(folder).parts:
            raise argparse.ArgumentTypeError("folders must be relative runtime folders")
        folders.append(folder)
    return folders


def main():
    parser = argparse.ArgumentParser(description="Create, lint, and package Agent Skill projects.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    create = subparsers.add_parser("create", help="Create a root-payload skill project")
    create.add_argument("skill_dir", help="Target skill directory, resolved from the current working directory when relative")
    create.add_argument("--slug", required=True, help="Lowercase skill slug used in SKILL.md")
    create.add_argument("--title", required=True, help="Human-readable title for SKILL.md")
    create.add_argument("--description", required=True, help='Trigger description, preferably "Use when ...; not for ..."')
    create.add_argument("--job", required=True, help="Short statement of the recurring job")
    create.add_argument("--folders", type=parse_folders, default=list(DEFAULT_RUNTIME_FOLDERS), help="Comma-separated runtime folders to create, such as references,scripts,assets,examples,resources")
    create.add_argument("--examples", action="store_true", help="Create OpenAI example files inside selected references/scripts/assets folders")
    create.add_argument("--project", action="store_true", help="Add .meta-skill/ workbench folders and a packaged placeholder zip")
    create.add_argument("--short-description", help="agents/openai.yaml short_description override")
    create.add_argument("--default-prompt", help="agents/openai.yaml default_prompt override")
    create.add_argument("--interface", action="append", default=[], help="Extra agents/openai.yaml interface override in key=value format")
    create.set_defaults(func=create_skill)

    openai_init_parser = subparsers.add_parser("openai-init", help="Run the canonical OpenAI skill initializer through this runner")
    openai_init_parser.add_argument("skill_name", help="Skill name, normalized to hyphen-case")
    openai_init_parser.add_argument("--path", required=True, help="Output directory for the skill")
    openai_init_parser.add_argument("--resources", default="", help="Comma-separated list: scripts,references,assets")
    openai_init_parser.add_argument("--examples", action="store_true", help="Create example files inside selected resource directories")
    openai_init_parser.add_argument("--interface", action="append", default=[], help="Interface override in key=value format")
    openai_init_parser.add_argument("--project", action="store_true", help="Create .meta-skill/ workbench state and a packaged placeholder zip")
    openai_init_parser.set_defaults(func=openai_init)

    openai_yaml_parser = subparsers.add_parser("openai-yaml", help="Generate or refresh agents/openai.yaml through this runner")
    openai_yaml_parser.add_argument("skill_dir", help="Path to the skill directory")
    openai_yaml_parser.add_argument("--name", help="Skill name override; defaults to SKILL.md frontmatter")
    openai_yaml_parser.add_argument("--interface", action="append", default=[], help="Interface override in key=value format")
    openai_yaml_parser.set_defaults(func=openai_yaml)

    lint = subparsers.add_parser("lint", help="Validate a root-payload skill project")
    lint.add_argument("skill_dir", help="Skill directory")
    lint.set_defaults(func=lint_skill)

    quick = subparsers.add_parser("quick-validate", help="Run the canonical quick validator through this runner")
    quick.add_argument("skill_dir", help="Skill directory")
    quick.set_defaults(func=quick_validate)

    package = subparsers.add_parser("package", help="Package the portable payload from the skill project root")
    package.add_argument("skill_dir", help="Skill directory")
    package.add_argument("--out-dir", help="Output directory; defaults to <skill-dir>/.meta-skill/dist")
    package.set_defaults(func=package_skill)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
