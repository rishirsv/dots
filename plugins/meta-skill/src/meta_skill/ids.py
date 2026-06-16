"""Identifier and timestamp helpers."""

import re
import uuid
from datetime import datetime, timezone

from .errors import CliError


def utc_now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def run_id():
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    return f"run-{stamp}-{uuid.uuid4().hex[:8]}"


def slug(value):
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", str(value).lower())).strip("-")


def require_id(kind, value):
    if not isinstance(value, str) or value != slug(value) or not re.fullmatch(r"[a-z0-9][a-z0-9-]*", value):
        raise CliError(f"{kind} must be a lowercase slug: {value!r}", 2)
    return value

