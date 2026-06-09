#!/usr/bin/env python3
"""Compatibility shim for the packaged Meta Skill CLI."""

from meta_skill.cli import *  # noqa: F401,F403
from meta_skill.cli import main


if __name__ == "__main__":
    raise SystemExit(main())
