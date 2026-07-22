#!/usr/bin/env python3
"""Pulse CLI: plan, collect, normalize, and bundle social/market evidence."""

from __future__ import annotations

import argparse
import fcntl
import html
import json
import math
import os
import re
import shutil
import subprocess
import threading
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence


PLAN_VERSION = 3
SOURCES = ("reddit", "x", "tiktok", "web", "polymarket")
CREDENTIALS_FILE_NAME = "provider-credentials.env"
APPEND_LOCK = threading.Lock()
CREDENTIAL_KEYS = (
    "SCRAPECREATORS_API_KEY",
    "XAI_API_KEY",
    "AUTH_TOKEN",
    "CT0",
    "X_BEARER_TOKEN",
)
SEARCH_STOPWORDS = {
    "about",
    "after",
    "around",
    "are",
    "current",
    "does",
    "from",
    "have",
    "into",
    "latest",
    "market",
    "odds",
    "people",
    "pulse",
    "reaction",
    "right",
    "scan",
    "saying",
    "social",
    "that",
    "the",
    "this",
    "what",
    "when",
    "why",
    "will",
    "with",
}
REDDIT_PRIMARY_PROVIDER = "reddit-keyless"
REDDIT_PRIMARY_TIER = "primary_keyless"
REDDIT_PAID_PROVIDER = "scrapecreators"
REDDIT_PAID_TIER = "paid_api_backfill"
REDDIT_FALLBACK_PUBLIC_JSON_TIER = "fallback_public_json"
REDDIT_FALLBACK_RSS_TIER = "fallback_rss"
REDDIT_FALLBACK_WEB_TIER = "fallback_web_discovery"
TIKTOK_PROVIDER = "scrapecreators"
TIKTOK_STANDARD_SEARCH_CALLS = 1
TIKTOK_DEEP_SEARCH_CALLS = 2
TIKTOK_STANDARD_TRANSCRIPT_CALLS = 3
TIKTOK_DEEP_TRANSCRIPT_CALLS = 5
REDDIT_COMMENT_STANDARD_POST_LIMIT = 6
REDDIT_COMMENT_DEEP_POST_LIMIT = 10
REDDIT_COMMENT_STANDARD_PER_POST_LIMIT = 3
REDDIT_COMMENT_DEEP_PER_POST_LIMIT = 5
REDDIT_COMMENT_STANDARD_TOTAL_LIMIT = 12
REDDIT_COMMENT_DEEP_TOTAL_LIMIT = 25


@dataclass
class SourceDecision:
    enabled: bool
    reason: str


@dataclass
class Plan:
    plan_version: int
    question: str
    topic: str
    exclude_terms: List[str]
    depth: str
    run_shape: str
    sources: Dict[str, SourceDecision]
    lookback_days: int
    since: str
    until: str
    targets: Dict[str, List[str]]
    source_budgets: Dict[str, int]
    access: List[str]
    created_at: str


@dataclass
class SourceItem:
    id: str
    source: str
    title: str
    url: str
    snippet: str
    collected_at: str
    metadata: Dict[str, object]


class ProviderCollectionError(RuntimeError):
    def __init__(self, source: str, errors: Sequence[Dict[str, str]]) -> None:
        self.source = source
        self.errors = list(errors)
        summary = "; ".join(f"{error['provider']}: {error['message']}" for error in self.errors)
        super().__init__(summary or f"{source} collection unavailable")


def provider_error(provider: str, exc: BaseException) -> Dict[str, str]:
    status = ""
    if isinstance(exc, urllib.error.HTTPError):
        status = str(exc.code)
    error = {
        "provider": provider,
        "error_type": type(exc).__name__,
        "status": status,
        "message": str(exc),
    }
    if provider == "scrapecreators" and status == "402":
        error["hint"] = "ScrapeCreators account has no available credits or requires payment."
    elif provider == "scrapecreators" and status in {"401", "403"}:
        error["hint"] = "ScrapeCreators credentials or account permissions are not usable for this endpoint."
    elif provider == "scrapecreators" and status == "429":
        error["hint"] = "ScrapeCreators rate limit was reached; retry later or reduce collection depth."
    elif provider == "scrapecreators" and status.startswith("5"):
        error["hint"] = "ScrapeCreators returned a server error; retry the bounded probe later."
    return error


def provider_status_error(provider: str, error_type: str, message: str) -> Dict[str, str]:
    return {
        "provider": provider,
        "error_type": error_type,
        "status": "",
        "message": message,
    }


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def slug(text: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return value[:48] or "pulse"


def credentials_path() -> Path:
    override = os.environ.get("PULSE_CREDENTIALS_FILE")
    if override:
        return Path(override).expanduser()
    config_home = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config"))
    return config_home / "pulse" / CREDENTIALS_FILE_NAME


def is_placeholder_value(value: str) -> bool:
    stripped = value.strip()
    return not stripped or "<" in stripped or stripped.upper() in {"REPLACE_ME", "TODO", "NONE"}


def parse_env_file(path: Path) -> Dict[str, str]:
    if not path.exists():
        return {}
    values: Dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key in CREDENTIAL_KEYS and not is_placeholder_value(value):
            values[key] = value
    return values


def credential_value(name: str) -> Optional[str]:
    env_value = os.environ.get(name)
    if env_value and not is_placeholder_value(env_value):
        return env_value
    return parse_env_file(credentials_path()).get(name)


def route_depth(question: str, requested: str) -> str:
    if requested in {"standard", "deep"}:
        return requested
    deep_terms = {
        "deep",
        "thorough",
        "strategy",
        "decision",
        "compare",
        "high confidence",
        "should we",
    }
    lowered = question.lower()
    return "deep" if any(term in lowered for term in deep_terms) else "standard"


def route_lookback_days(question: str, requested: Optional[int]) -> int:
    if requested is not None:
        days = requested
    else:
        lowered = question.lower()
        explicit = re.search(r"(?:last|past|previous)\s+(\d{1,3})\s+days?", lowered)
        if explicit:
            days = int(explicit.group(1))
        elif any(term in lowered for term in ("today", "past 24 hours", "last 24 hours")):
            days = 1
        elif any(term in lowered for term in ("this week", "past week", "last week")):
            days = 7
        else:
            days = 14
    if not 1 <= days <= 90:
        raise SystemExit("--days must be between 1 and 90")
    return days


def source_reasons(question: str) -> Dict[str, SourceDecision]:
    lowered = question.lower()
    tiktok_explicit = bool(re.search(r"\btik\s*tok\b|\btiktok\b", lowered))
    x_explicit = bool(re.search(r"\b(?:x|twitter)\b", lowered)) or bool(
        not tiktok_explicit and re.search(r"(?<![\w@])@[A-Za-z0-9_]+", lowered)
    )
    explicit = {
        "reddit": bool(re.search(r"\breddit\b|(?<!\w)r/[A-Za-z0-9_]+", lowered)),
        "x": x_explicit,
        "tiktok": tiktok_explicit,
        "web": bool(re.search(r"\b(?:web|blogs?|news coverage|public web)\b", lowered)),
        "polymarket": bool(re.search(r"\bpolymarket\b|\bprediction markets?\b", lowered)),
    }
    if any(explicit.values()):
        enabled = explicit
    else:
        social_intent = any(
            term in lowered
            for term in (
                "people saying", "what are people", "chatter", "discussion",
                "community reaction", "reception", "social signal", "pulse",
            )
        )
        forecast_intent = any(
            term in lowered
            for term in ("odds", "forecast", "will it", "will the", "priced expectation")
        )
        creator_intent = any(
            term in lowered
            for term in ("short-form", "short form", "viral video", "creator reaction", "hashtag")
        )
        enabled = {
            "reddit": social_intent,
            "x": social_intent,
            "tiktok": creator_intent,
            "web": False,
            "polymarket": forecast_intent,
        }
        if not any(enabled.values()):
            enabled["reddit"] = True
            enabled["x"] = True

    return {
        "reddit": SourceDecision(
            enabled=enabled["reddit"],
            reason="explicit platform or community-signal fit" if enabled["reddit"] else "no Reddit-specific contribution identified",
        ),
        "x": SourceDecision(
            enabled=enabled["x"],
            reason="explicit platform or fast-discourse fit" if enabled["x"] else "no X-specific contribution identified",
        ),
        "tiktok": SourceDecision(
            enabled=enabled["tiktok"],
            reason="explicit platform or creator-video fit" if enabled["tiktok"] else "no creator-video contribution identified",
        ),
        "web": SourceDecision(
            enabled=enabled["web"],
            reason="explicit public-Web context requested" if enabled["web"] else "Web remains available as bounded discovery fallback",
        ),
        "polymarket": SourceDecision(
            enabled=enabled["polymarket"],
            reason="explicit market or forecast fit" if enabled["polymarket"] else "no well-defined forecast contribution identified",
        ),
    }


def parse_sources(question: str, value: str) -> Dict[str, SourceDecision]:
    decisions = source_reasons(question)
    if value == "auto":
        return decisions
    selected = {part.strip().lower() for part in value.split(",") if part.strip()}
    unknown = selected.difference(SOURCES)
    if unknown:
        raise SystemExit(f"Unknown sources: {', '.join(sorted(unknown))}")
    return {
        source: SourceDecision(
            enabled=source in selected,
            reason=("explicitly requested" if source in selected else "not selected"),
        )
        for source in SOURCES
    }


def extract_source_targets(question: str) -> Dict[str, List[str]]:
    subreddits = unique_terms(
        [match.group(1) for match in re.finditer(r"(?<!\w)r/([A-Za-z0-9_]+)", question)],
        8,
    )
    handles = unique_terms(
        [match.group(1) for match in re.finditer(r"(?<![\w@])@([A-Za-z0-9_]{1,30})", question)],
        8,
    )
    hashtags = unique_terms(
        [match.group(1) for match in re.finditer(r"(?<!\w)#([A-Za-z0-9_]+)", question)],
        8,
    )
    return {
        "reddit_subreddits": subreddits,
        "x_handles": handles,
        "tiktok_creators": handles,
        "tiktok_hashtags": hashtags,
    }


def source_call_budgets(depth: str) -> Dict[str, int]:
    return {
        "reddit": 15 if depth == "deep" else 8,
        "x": 3 if depth == "deep" else 2,
        "tiktok": 8 if depth == "deep" else 4,
        "web": 0,
        "polymarket": 4 if depth == "deep" else 2,
    }


def build_plan(
    question: str,
    depth: str,
    sources: str,
    lookback_days: Optional[int] = None,
    topic: str = "",
    exclude_terms: Sequence[str] = (),
) -> Plan:
    resolved_days = route_lookback_days(question, lookback_days)
    resolved_depth = route_depth(question, depth)
    decisions = parse_sources(question, sources)
    run_shape = "deep" if resolved_depth == "deep" else "quick"
    until_date = datetime.now(timezone.utc).date()
    since_date = until_date - timedelta(days=resolved_days - 1)
    return Plan(
        plan_version=PLAN_VERSION,
        question=question,
        topic=topic.strip() or question.strip(),
        exclude_terms=unique_terms([term.strip() for term in exclude_terms if term.strip()], 12),
        depth=resolved_depth,
        run_shape=run_shape,
        sources=decisions,
        lookback_days=resolved_days,
        since=since_date.isoformat(),
        until=until_date.isoformat(),
        targets=extract_source_targets(question),
        source_budgets=source_call_budgets(resolved_depth),
        access=["public-providers", "agent-web-search-when-selected-or-needed"],
        created_at=utc_now(),
    )


def plan_to_dict(plan: Plan) -> Dict[str, object]:
    data = asdict(plan)
    data["sources"] = {key: asdict(value) for key, value in plan.sources.items()}
    return data


def load_plan(path: Path) -> Plan:
    data = json.loads(path.read_text())
    if data.get("plan_version") != PLAN_VERSION:
        raise SystemExit(
            f"Unsupported Pulse plan version {data.get('plan_version', 'legacy')}; regenerate the plan with this Pulse version."
        )
    return Plan(
        plan_version=data["plan_version"],
        question=data["question"],
        topic=data["topic"],
        exclude_terms=list(data.get("exclude_terms", [])),
        depth=data["depth"],
        run_shape=data["run_shape"],
        sources={
            key: SourceDecision(enabled=value["enabled"], reason=value["reason"])
            for key, value in data["sources"].items()
        },
        lookback_days=int(data["lookback_days"]),
        since=str(data["since"]),
        until=str(data["until"]),
        targets={key: list(value) for key, value in data["targets"].items()},
        source_budgets={key: int(value) for key, value in data["source_budgets"].items()},
        access=list(data.get("access", [])),
        created_at=data["created_at"],
    )


def enabled_sources(plan: Plan) -> List[str]:
    return [source for source in SOURCES if plan.sources[source].enabled]


def mock_items(plan: Plan) -> List[SourceItem]:
    items: List[SourceItem] = []
    topic = plan.topic
    for source in enabled_sources(plan):
        if source == "reddit":
            reddit_url = f"https://www.reddit.com/r/examplecommunity/comments/mockpost1/{slug(topic)}_thread/"
            items.extend(
                [
                    SourceItem(
                        id="reddit-post-1",
                        source="reddit",
                        title="Community thread clusters around practical experience",
                        url=reddit_url,
                        snippet="Reddit discussion highlights repeated firsthand reactions.",
                        collected_at=utc_now(),
                        metadata={
                            "mock": True,
                            "query": topic,
                            "kind": "reddit_post",
                            "provider": "mock-scrapecreators",
                            "provider_tier": REDDIT_PRIMARY_TIER,
                            "collection_surface": "mock-reddit-api",
                            "evidence_quality": "mock-api-post",
                            "subreddit": "examplecommunity",
                            "reddit_post_id": "mockpost1",
                            "comments": 42,
                            "score": 180,
                            "rank_score": 82,
                            "rank_reason": "mock high topic fit and discussion depth",
                            "cluster_key": "primary-discussion:examplecommunity",
                        },
                    ),
                    SourceItem(
                        id="reddit-comment-1",
                        source="reddit",
                        title="Comment by u/example_reader",
                        url=f"{reddit_url.rstrip('/')}/mockcomment1/",
                        snippet="People like the direction, but several replies say the details do not generalize.",
                        collected_at=utc_now(),
                        metadata={
                            "mock": True,
                            "query": topic,
                            "kind": "reddit_comment",
                            "provider": "mock-scrapecreators",
                            "provider_tier": REDDIT_PRIMARY_TIER,
                            "collection_surface": "mock-reddit-api",
                            "evidence_quality": "mock-api-comment",
                            "subreddit": "examplecommunity",
                            "author": "example_reader",
                            "ups": 91,
                            "reddit_comment_id": "mockcomment1",
                            "parent_source_id": "reddit-post-1",
                            "parent_post_id": "mockpost1",
                            "parent_post_url": reddit_url,
                            "comment_url": f"{reddit_url.rstrip('/')}/mockcomment1/",
                            "quote_safe_excerpt": "People like the direction, but several replies say the details do not generalize.",
                            "rank_score": 88,
                            "rank_reason": "mock representative comment and useful counter-signal",
                            "cluster_key": "primary-discussion:examplecommunity",
                        },
                    ),
                    SourceItem(
                        id="reddit-post-2",
                        source="reddit",
                        title="Commenters disagree on whether the signal generalizes",
                        url=f"https://www.reddit.com/r/examplecommunity/comments/mockpost2/{slug(topic)}_thread_2/",
                        snippet="Several comments frame the topic as community-specific.",
                        collected_at=utc_now(),
                        metadata={
                            "mock": True,
                            "query": topic,
                            "kind": "reddit_post",
                            "provider": "mock-scrapecreators",
                            "provider_tier": REDDIT_PRIMARY_TIER,
                            "collection_surface": "mock-reddit-api",
                            "evidence_quality": "mock-api-post",
                            "subreddit": "examplecommunity",
                            "reddit_post_id": "mockpost2",
                            "comments": 18,
                            "score": 77,
                            "rank_score": 70,
                            "rank_reason": "mock relevant community thread",
                            "cluster_key": "community-texture:examplecommunity",
                        },
                    ),
                ]
            )
            if plan.depth == "deep":
                items.append(
                    SourceItem(
                        id="reddit-comment-2",
                        source="reddit",
                        title="Comment by u/example_skeptic",
                        url=f"{reddit_url.rstrip('/')}/mockcomment2/",
                        snippet="The skeptical replies are useful because they separate loud complaints from broader agreement.",
                        collected_at=utc_now(),
                        metadata={
                            "mock": True,
                            "query": topic,
                            "kind": "reddit_comment",
                            "provider": "mock-scrapecreators",
                            "provider_tier": REDDIT_PRIMARY_TIER,
                            "collection_surface": "mock-reddit-api",
                            "evidence_quality": "mock-api-comment",
                            "subreddit": "examplecommunity",
                            "author": "example_skeptic",
                            "ups": 44,
                            "reddit_comment_id": "mockcomment2",
                            "parent_source_id": "reddit-post-1",
                            "parent_post_id": "mockpost1",
                            "parent_post_url": reddit_url,
                            "comment_url": f"{reddit_url.rstrip('/')}/mockcomment2/",
                            "quote_safe_excerpt": "The skeptical replies are useful because they separate loud complaints from broader agreement.",
                            "rank_score": 74,
                            "rank_reason": "mock counter-signal comment",
                            "cluster_key": "counter-signals:examplecommunity",
                        },
                    )
                )
            continue
        elif source == "x":
            rows = [
                ("Fast discourse is polarized", "X posts show quick reactions and disagreement."),
                ("Influential accounts are shaping framing", "A few high-reach posts appear to anchor the conversation."),
            ]
            if plan.depth == "deep":
                rows.append(("Deep X pass separates memes from claims", "Additional fast-discourse evidence helps distinguish jokes, complaints, and factual claims."))
        elif source == "tiktok":
            rows = [
                ("Creators repeat a practical reaction", "Several short-form videos frame the topic through firsthand demonstrations."),
                ("A viral framing is driving replies", "High-engagement videos repeat one memorable claim while comments add disagreement."),
            ]
            if plan.depth == "deep":
                rows.append(("Transcript review separates demos from slogans", "Spoken-word captions provide more context than titles and engagement alone."))
        elif source == "web":
            rows = [
                ("Web results provide context", "Search-discovered pages ground the social chatter."),
                ("Primary context may be needed", "The scan should not rely only on social reactions."),
            ]
            if plan.depth == "deep":
                rows.append(("Independent reporting challenges the dominant reaction", "A separate publication reports that early accessibility testing conflicts with the loudest social narrative."))
        else:
            rows = [
                ("Market relevance is conditional", "Relevant markets can show priced expectations when liquidity exists."),
                ("Market wording may not match the user question", "A market can be an imperfect proxy."),
            ]
            if plan.depth == "deep":
                rows.append(("Deep market pass checks proxy fit", "Additional market evidence is used to compare liquidity, wording, and whether prices map to the question."))
        for index, (title, snippet) in enumerate(rows, start=1):
            item_url = f"https://example.com/pulse/{source}/{slug(topic)}-{index}"
            if source == "web" and plan.depth == "deep" and index == 3:
                item_url = f"https://independent.example.org/pulse/{slug(topic)}-counter-signal"
            items.append(
                SourceItem(
                    id=f"{source}-{index}",
                    source=source,
                    title=title,
                    url=item_url,
                    snippet=snippet,
                    collected_at=utc_now(),
                    metadata={
                        "mock": True,
                        "query": topic,
                        "kind": "tiktok_video" if source == "tiktok" else f"{source}_item",
                        "video_id": f"mockvideo{index}" if source == "tiktok" else None,
                        "independent_source": index if plan.depth == "deep" else 1,
                    },
                )
            )
    for item in items:
        item.metadata.setdefault("requested_since", plan.since)
        item.metadata.setdefault("requested_until", plan.until)
        item.metadata.setdefault("lookback_days", plan.lookback_days)
        if item.metadata.get("mock") and item.source in {"reddit", "x", "tiktok"}:
            item.metadata.setdefault("created_at", utc_now())
    return items


def http_json(
    url: str,
    headers: Optional[Dict[str, str]] = None,
    body: Optional[Dict[str, object]] = None,
) -> object:
    data = None
    request_headers = {
        "Accept": "application/json",
        "User-Agent": "Pulse/0.1 personal research skill",
        **(headers or {}),
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        request_headers = {"Content-Type": "application/json", **request_headers}
    request = urllib.request.Request(url, data=data, headers=request_headers)
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def http_text(url: str, headers: Optional[Dict[str, str]] = None) -> str:
    request_headers = {
        "Accept": "text/html,application/atom+xml,application/rss+xml,*/*",
        "User-Agent": "Mozilla/5.0 Pulse/0.1 personal research skill",
        **(headers or {}),
    }
    request = urllib.request.Request(url, headers=request_headers)
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read().decode("utf-8", "replace")


def source_item(
    source: str,
    index: int,
    title: str,
    url: str,
    snippet: str,
    metadata: Optional[Dict[str, object]] = None,
) -> SourceItem:
    return SourceItem(
        id=f"{source}-{index}",
        source=source,
        title=title,
        url=url,
        snippet=snippet,
        collected_at=utc_now(),
        metadata=metadata or {},
    )


def first_present(*values: object) -> object:
    for value in values:
        if value is not None:
            return value
    return None


def compact_text(value: object, limit: int = 700) -> str:
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    if len(text) <= limit:
        return text
    return text[: max(0, limit - 3)].rstrip() + "..."


def safe_int(value: object, default: int = 0) -> int:
    if value is None:
        return default
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (int, float)):
        return int(value)
    text = str(value).replace(",", "").strip()
    try:
        return int(float(text))
    except ValueError:
        return default


def safe_float(value: object, default: float = 0.0) -> float:
    if value is None:
        return default
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).replace(",", "").strip()
    try:
        return float(text)
    except ValueError:
        return default


def clamp(value: float, lower: float = 0.0, upper: float = 1.0) -> float:
    return max(lower, min(upper, value))


def tokenize(text: str) -> List[str]:
    return [
        term
        for term in re.findall(r"[a-z0-9]+(?:\.[a-z0-9]+)*", text.lower())
        if len(term) > 1 and term not in SEARCH_STOPWORDS
    ]


def unique_terms(terms: Sequence[str], limit: int = 12) -> List[str]:
    output: List[str] = []
    for term in terms:
        if term not in output:
            output.append(term)
        if len(output) >= limit:
            break
    return output


def normalized_permalink_url(permalink: object, fallback_url: object = "") -> str:
    permalink_value = str(permalink or "")
    fallback_value = str(fallback_url or "")
    if permalink_value.startswith("/"):
        return f"https://www.reddit.com{permalink_value}"
    if permalink_value.startswith("http"):
        return permalink_value
    return fallback_value


def reddit_native_id(value: object) -> str:
    text = str(value or "").strip()
    if text.startswith("t3_") or text.startswith("t1_"):
        return text.split("_", 1)[1]
    return text


def reddit_post_native_id(post: Dict[str, object]) -> str:
    return reddit_native_id(first_present(post.get("id"), post.get("name"), post.get("postId"), post.get("post_id")))


def reddit_comment_native_id(comment: Dict[str, object]) -> str:
    return reddit_native_id(first_present(comment.get("id"), comment.get("name"), comment.get("commentId"), comment.get("comment_id")))


def reddit_subreddit(value: object) -> str:
    text = str(value or "").strip()
    return text.removeprefix("r/")


def log_score(value: object, max_reference: float) -> float:
    number = max(0, safe_float(value))
    if number <= 0:
        return 0.0
    return clamp(math.log1p(number) / math.log1p(max_reference))


def freshness_score(created: object) -> float:
    if created is None:
        return 0.45
    timestamp = safe_float(created)
    if timestamp <= 0 and isinstance(created, str):
        try:
            timestamp = datetime.fromisoformat(created.replace("Z", "+00:00")).timestamp()
        except ValueError:
            timestamp = 0.0
    if timestamp <= 0:
        return 0.45
    now = datetime.now(timezone.utc).timestamp()
    age_days = max(0.0, (now - timestamp) / 86400)
    if age_days <= 1:
        return 1.0
    if age_days <= 7:
        return 0.85
    if age_days <= 30:
        return 0.65
    if age_days <= 365:
        return 0.35
    return 0.15


def item_date(value: object) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, (int, float)) or str(value).replace(".", "", 1).isdigit():
        try:
            return datetime.fromtimestamp(float(value), timezone.utc).date().isoformat()
        except (ValueError, OSError, OverflowError):
            return None
    text = str(value).strip()
    if not text:
        return None
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00")).date().isoformat()
    except ValueError:
        return text[:10] if re.fullmatch(r"\d{4}-\d{2}-\d{2}.*", text) else None


def date_in_plan(value: object, plan: Plan) -> bool:
    date = item_date(value)
    return bool(date and plan.since <= date <= plan.until)


def annotate_collection(items: Sequence[SourceItem], plan: Plan, calls: int, provider: str) -> List[SourceItem]:
    for item in items:
        item.metadata.setdefault("requested_since", plan.since)
        item.metadata.setdefault("requested_until", plan.until)
        item.metadata.setdefault("lookback_days", plan.lookback_days)
        item.metadata["provider_call_count"] = calls
        item.metadata.setdefault("provider", provider)
    return list(items)


def enforce_social_window(items: Sequence[SourceItem], plan: Plan) -> List[SourceItem]:
    """Keep only date-verifiable social evidence inside the requested window."""
    output: List[SourceItem] = []
    for item in items:
        if item.source not in {"reddit", "x", "tiktok"}:
            output.append(item)
            continue
        created = first_present(item.metadata.get("created_at"), item.metadata.get("created_utc"), item.metadata.get("date"))
        if not created or not date_in_plan(created, plan):
            continue
        item.metadata["window_status"] = "in_window"
        output.append(item)
    return output


def excluded_by_plan(item: SourceItem, plan: Plan) -> bool:
    if not plan.exclude_terms:
        return False
    haystack = f"{item.title} {item.snippet}".lower()
    return any(term.lower() in haystack for term in plan.exclude_terms)


def dedupe_ranked_items(items: Sequence[SourceItem], metadata_key: str) -> List[SourceItem]:
    seen = set()
    output: List[SourceItem] = []
    for item in sorted(items, key=lambda value: safe_float(value.metadata.get("rank_score")), reverse=True):
        key = str(item.metadata.get(metadata_key) or item.url or item.id)
        if key in seen:
            continue
        seen.add(key)
        output.append(item)
    for index, item in enumerate(output, start=1):
        item.id = f"{item.source}-{index}"
    return output


def reddit_search_plan(question: str, depth: str = "standard") -> List[Dict[str, object]]:
    terms = unique_terms(tokenize(question), 10)
    required = terms[:4]
    optional = terms[4:10]
    lowered = question.lower()
    subreddits: List[str] = []
    if "nba" in lowered or "finals" in lowered:
        subreddits = ["nba", "nbadiscussion", "sportsbook"]
    elif "ios" in lowered or "apple" in lowered:
        subreddits = ["apple", "ios", "iphone"]
    subqueries: List[Dict[str, object]] = [
        {
            "label": "primary-discussion",
            "search_query": question,
            "ranking_query": question,
            "weight": 1.0,
            "required_anchors": required,
            "optional_terms": optional,
            "target_subreddits": subreddits,
        },
        {
            "label": "community-texture",
            "search_query": f"{question} reddit comments discussion",
            "ranking_query": f"Reddit community discussion and comment texture for {question}",
            "weight": 0.85,
            "required_anchors": required,
            "optional_terms": unique_terms(optional + ["comments", "discussion"], 8),
            "target_subreddits": subreddits,
        },
    ]
    if depth == "deep":
        subqueries.append(
            {
                "label": "counter-signals",
                "search_query": f"{question} complaints criticism disagreement",
                "ranking_query": f"Reddit disagreement, complaints, and counter-signals for {question}",
                "weight": 0.7,
                "required_anchors": required,
                "optional_terms": unique_terms(optional + ["complaints", "criticism", "disagreement"], 10),
                "target_subreddits": subreddits,
            }
        )
    return subqueries


def topic_fit_score(text: str, terms: Sequence[str]) -> float:
    if not terms:
        return 0.5
    haystack = text.lower()
    hits = sum(1 for term in terms if term and term in haystack)
    return clamp(hits / max(1, len(terms)))


def score_reddit_post(item: SourceItem, subquery: Dict[str, object]) -> SourceItem:
    metadata = dict(item.metadata)
    required = [str(term) for term in subquery.get("required_anchors", [])]
    optional = [str(term) for term in subquery.get("optional_terms", [])]
    terms = unique_terms(required + optional, 12)
    haystack = f"{item.title} {item.snippet} {metadata.get('subreddit', '')}"
    topic_fit = topic_fit_score(haystack, terms)
    required_hit = not required or any(term in haystack.lower() for term in required)
    post_freshness = freshness_score(metadata.get("created_utc"))
    discussion = log_score(metadata.get("comments"), 5000)
    engagement = log_score(metadata.get("score"), 10000)
    subreddit = reddit_subreddit(metadata.get("subreddit"))
    targets = {str(value).lower().removeprefix("r/") for value in subquery.get("target_subreddits", [])}
    subreddit_quality = 1.0 if subreddit.lower() in targets else (0.55 if subreddit else 0.2)
    evidence_richness = 0.0
    evidence_richness += 0.35 if item.title else 0.0
    evidence_richness += 0.25 if item.snippet else 0.0
    evidence_richness += 0.2 if item.url else 0.0
    evidence_richness += 0.2 if metadata.get("score") is not None or metadata.get("comments") is not None else 0.0
    penalty = 0.0
    reasons = []
    if not required_hit:
        penalty += 20.0
        reasons.append("entity-miss demotion")
    if metadata.get("provider_tier") in {REDDIT_FALLBACK_RSS_TIER, REDDIT_FALLBACK_PUBLIC_JSON_TIER}:
        penalty += 3.0
        reasons.append("fallback provider")
    if not item.snippet:
        penalty += 3.0
        reasons.append("low-context post")
    score = (
        35 * topic_fit
        + 15 * post_freshness
        + 15 * discussion
        + 15 * engagement
        + 10 * subreddit_quality
        + 10 * evidence_richness
        + 5 * safe_float(subquery.get("weight"), 1.0)
        - penalty
    )
    if topic_fit >= 0.6:
        reasons.append("high topic fit")
    if discussion >= 0.6:
        reasons.append("strong discussion depth")
    if engagement >= 0.6:
        reasons.append("strong engagement")
    if subreddit_quality >= 1.0:
        reasons.append("target subreddit")
    metadata.update(
        {
            "kind": "reddit_post",
            "subquery_label": subquery.get("label"),
            "search_query": subquery.get("search_query"),
            "ranking_query": subquery.get("ranking_query"),
            "topic_fit": round(topic_fit, 3),
            "freshness_score": round(post_freshness, 3),
            "discussion_score": round(discussion, 3),
            "engagement_score": round(engagement, 3),
            "subreddit_score": round(subreddit_quality, 3),
            "evidence_richness_score": round(evidence_richness, 3),
            "rank_score": round(max(0.0, score), 3),
            "rank_reason": ", ".join(reasons) if reasons else "balanced topic and source-native signal",
            "relevance_floor_passed": topic_fit >= 0.2 or subreddit_quality >= 1.0,
            "cluster_key": f"{subquery.get('label')}:{subreddit or 'reddit'}",
            "cluster_terms": terms[:6],
        }
    )
    item.metadata = metadata
    return item


def score_reddit_comment(item: SourceItem, question: str, sibling_texts: Sequence[str]) -> SourceItem:
    metadata = dict(item.metadata)
    terms = unique_terms(tokenize(question), 10)
    topic_fit = topic_fit_score(f"{item.title} {item.snippet}", terms)
    upvotes = log_score(metadata.get("ups"), 10000)
    repeated_terms = unique_terms(tokenize(" ".join(sibling_texts)), 20)
    representative = topic_fit_score(item.snippet, repeated_terms)
    lowered = item.snippet.lower()
    disagreement = 1.0 if any(term in lowered for term in ("but", "however", "disagree", "wrong", "not ", "issue", "problem")) else 0.35
    text_length = len(item.snippet)
    quote_quality = 1.0 if 20 <= text_length <= 240 and "http" not in lowered else 0.35
    context_quality = 1.0 if safe_int(metadata.get("depth"), 0) <= 1 else 0.6
    penalty = 0.0
    reasons = []
    if metadata.get("removed") or lowered in {"[deleted]", "[removed]"}:
        penalty += 40.0
        reasons.append("removed/deleted")
    if topic_fit >= 0.5:
        reasons.append("high topic fit")
    if upvotes >= 0.5:
        reasons.append("high upvotes")
    if representative >= 0.5:
        reasons.append("representative theme")
    if disagreement >= 1.0:
        reasons.append("useful counter-signal")
    if quote_quality >= 1.0:
        reasons.append("quote-safe")
    score = (
        35 * topic_fit
        + 25 * upvotes
        + 15 * representative
        + 10 * disagreement
        + 10 * quote_quality
        + 5 * context_quality
        - penalty
    )
    metadata.update(
        {
            "kind": "reddit_comment",
            "topic_fit": round(topic_fit, 3),
            "upvote_score": round(upvotes, 3),
            "representative_score": round(representative, 3),
            "disagreement_score": round(disagreement, 3),
            "quote_quality_score": round(quote_quality, 3),
            "context_quality_score": round(context_quality, 3),
            "rank_score": round(max(0.0, score), 3),
            "rank_reason": ", ".join(reasons) if reasons else "balanced comment signal",
        }
    )
    item.metadata = metadata
    return item


def reddit_item_dedupe_key(item: SourceItem) -> str:
    metadata = item.metadata
    if metadata.get("kind") == "reddit_comment":
        return str(metadata.get("reddit_comment_id") or item.url or item.snippet.lower())
    return str(
        metadata.get("reddit_post_id")
        or metadata.get("id")
        or item.url
        or item.title.lower()
    )


def reddit_ready() -> bool:
    return True


def reddit_access_mode() -> str:
    if credential_value("SCRAPECREATORS_API_KEY"):
        return "keyless-rss+shreddit-primary+scrapecreators-backfill"
    return "keyless-rss+shreddit"


def x_ready() -> bool:
    bird = (
        os.environ.get("PULSE_X_BACKEND") == "bird"
        and credential_value("AUTH_TOKEN")
        and credential_value("CT0")
        and shutil.which("node")
    )
    return bool(credential_value("XAI_API_KEY") or credential_value("X_BEARER_TOKEN") or bird)


def x_access_modes() -> List[str]:
    modes = []
    if credential_value("XAI_API_KEY"):
        modes.append("xai-x-search")
    if credential_value("X_BEARER_TOKEN"):
        modes.append("official-x-api")
    if os.environ.get("PULSE_X_BACKEND") == "bird" and credential_value("AUTH_TOKEN") and credential_value("CT0"):
        modes.append("bird-explicit-environment-cookies")
    return modes


def tiktok_ready() -> bool:
    return bool(credential_value("SCRAPECREATORS_API_KEY"))


def tiktok_access_mode() -> str:
    return "scrapecreators-native-search" if tiktok_ready() else "unavailable"


def probe_tiktok() -> bool:
    """Use one search call for readiness; never spend transcript/comment credits."""
    payload = http_json(
        "https://api.scrapecreators.com/v1/tiktok/search/keyword?"
        + urllib.parse.urlencode({"query": "pulse provider probe", "sort_by": "relevance"}),
        headers=scrapecreators_headers(),
    )
    return bool(tiktok_raw_items(payload))


def credential_sources() -> Dict[str, str]:
    file_values = parse_env_file(credentials_path())
    sources = {}
    for key in CREDENTIAL_KEYS:
        if os.environ.get(key) and not is_placeholder_value(os.environ[key]):
            sources[key] = "environment"
        elif key in file_values:
            sources[key] = "credentials-file"
        else:
            sources[key] = "missing"
    return sources


def live_provider_probe() -> Dict[str, object]:
    reddit_errors: List[Dict[str, str]] = []
    reddit_primary_usable = False
    reddit_fallback_usable = False
    reddit_probe = build_plan("pulse provider probe", "standard", "reddit", 7)
    try:
        reddit_primary_usable = bool(collect_reddit(reddit_probe))
    except ProviderCollectionError as exc:
        reddit_errors.extend(exc.errors)
    except (urllib.error.URLError, TimeoutError, ET.ParseError) as exc:
        reddit_errors.append(provider_error("reddit-keyless", exc))
    if not reddit_primary_usable and credential_value("SCRAPECREATORS_API_KEY"):
        try:
            reddit_fallback_usable = bool(
                collect_reddit_scrapecreators("pulse provider probe", include_comments=False, include_subreddits=False)
            )
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            reddit_errors.append(provider_error("scrapecreators", exc))
    x_errors: List[Dict[str, str]] = []
    x_usable = False
    if not x_ready():
        x_errors.append(
            provider_status_error(
                "x",
                "MissingCredentials",
                "No live X provider is configured; set XAI_API_KEY or X_BEARER_TOKEN.",
            )
        )
    else:
        try:
            x_usable = bool(collect_x(build_plan("pulse provider probe", "standard", "x", 7)))
            if not x_usable:
                x_errors.append(provider_status_error("x", "NoResults", "Live X provider returned no usable posts."))
        except (ProviderCollectionError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            x_errors.append(provider_error("x", exc))
    tiktok_errors: List[Dict[str, str]] = []
    tiktok_usable = False
    if not tiktok_ready():
        tiktok_errors.append(provider_status_error("scrapecreators", "MissingCredentials", "No TikTok provider is configured; set SCRAPECREATORS_API_KEY."))
    else:
        try:
            tiktok_usable = probe_tiktok()
            if not tiktok_usable:
                tiktok_errors.append(provider_status_error("scrapecreators", "NoResults", "TikTok provider returned no usable videos."))
        except (ProviderCollectionError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            tiktok_errors.append(provider_error("scrapecreators", exc))
    polymarket_errors: List[Dict[str, str]] = []
    polymarket_usable = False
    try:
        polymarket_usable = bool(collect_polymarket("next fed rate decision"))
        if not polymarket_usable:
            polymarket_errors.append(
                provider_status_error("polymarket", "NoResults", "Polymarket public API returned no relevant markets.")
            )
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        polymarket_errors.append(provider_error("polymarket", exc))
    return {
        "reddit": {
            "checked": True,
            "usable": reddit_primary_usable,
            "primary_usable": reddit_primary_usable,
            "fallback_usable": reddit_fallback_usable,
            "errors": reddit_errors,
        },
        "x": {
            "checked": True,
            "usable": x_usable,
            "errors": x_errors,
        },
        "tiktok": {"checked": True, "usable": tiktok_usable, "errors": tiktok_errors},
        "polymarket": {
            "checked": True,
            "usable": polymarket_usable,
            "errors": polymarket_errors,
        },
    }


def provider_status(live_check: bool = False) -> Dict[str, object]:
    live = live_provider_probe() if live_check else {}
    return {
        "reddit": {
            "configured": reddit_ready(),
            "access": reddit_access_mode(),
            "live_check": live.get("reddit", {"checked": False, "usable": None, "errors": []}),
        },
        "x": {
            "configured": x_ready(),
            "access": x_access_modes(),
            "live_check": live.get("x", {"checked": False, "usable": None, "errors": []}),
        },
        "tiktok": {
            "configured": tiktok_ready(),
            "access": tiktok_access_mode(),
            "live_check": live.get("tiktok", {"checked": False, "usable": None, "errors": []}),
        },
        "web": {"configured": True, "access": "agent-web-search-tool", "usable": True},
        "polymarket": {
            "configured": True,
            "access": "public-read",
            "usable": True,
            "live_check": live.get("polymarket", {"checked": False, "usable": None, "errors": []}),
        },
        "credentials_file": str(credentials_path()),
        "credential_sources": credential_sources(),
    }


def parse_required_sources(value: str) -> List[str]:
    required = [part.strip().lower() for part in value.split(",") if part.strip()]
    invalid = [source for source in required if source not in SOURCES]
    if invalid:
        raise SystemExit(f"Unsupported required source(s): {', '.join(invalid)}")
    return required


def live_check_for_source(status: Dict[str, object], source: str) -> Dict[str, object]:
    source_status = status.get(source)
    if not isinstance(source_status, dict):
        return {"checked": False, "usable": False, "errors": [provider_status_error(source, "MissingStatus", "No provider status was reported.")]}
    if source == "web":
        return {"checked": True, "usable": bool(source_status.get("usable")), "errors": []}
    live_check = source_status.get("live_check")
    if isinstance(live_check, dict):
        return live_check
    return {"checked": False, "usable": False, "errors": [provider_status_error(source, "MissingLiveCheck", "No live provider probe was reported.")]}


def readiness_report(required_sources: Sequence[str]) -> Dict[str, object]:
    status = provider_status(live_check=True)
    checks: Dict[str, Dict[str, object]] = {}
    for source in required_sources:
        live_check = live_check_for_source(status, source)
        checks[source] = {
            "checked": bool(live_check.get("checked")),
            "usable": live_check.get("usable") is True,
            "errors": live_check.get("errors", []),
        }
    failed = [source for source, check in checks.items() if not check["usable"]]
    return {
        "ok": not failed,
        "required": list(required_sources),
        "failed": failed,
        "checks": checks,
        "status": status,
    }


def normalize_reddit_post(
    source_label: str,
    index: int,
    post: Dict[str, object],
    provider_tier: str = REDDIT_PRIMARY_TIER,
    subquery: Optional[Dict[str, object]] = None,
) -> SourceItem:
    permalink = str(post.get("permalink") or "")
    url_value = str(post.get("url") or "")
    if permalink.startswith("/"):
        url_value = f"https://www.reddit.com{permalink}"
    elif "reddit.com" not in url_value and post.get("id"):
        subreddit = post.get("subreddit") or post.get("subreddit_name_prefixed") or ""
        clean_subreddit = str(subreddit).removeprefix("r/")
        url_value = f"https://www.reddit.com/r/{clean_subreddit}/comments/{post.get('id')}/"
    reddit_id = reddit_post_native_id(post)
    subreddit = reddit_subreddit(first_present(post.get("subreddit"), post.get("subreddit_name_prefixed")))
    item = source_item(
        "reddit",
        index,
        str(post.get("title") or "Reddit result"),
        url_value,
        compact_text(first_present(post.get("selftext"), post.get("body"), post.get("subreddit_name_prefixed"), "")),
        {
            "kind": "reddit_post",
            "provider": source_label,
            "provider_tier": provider_tier,
            "collection_surface": "scrapecreators-api" if source_label == REDDIT_PAID_PROVIDER else source_label,
            "evidence_quality": "paid-api-post" if provider_tier == REDDIT_PAID_TIER else "public-post",
            "subreddit": subreddit,
            "score": first_present(post.get("score"), post.get("ups"), post.get("votes")),
            "comments": first_present(post.get("num_comments"), post.get("comments")),
            "created_utc": first_present(post.get("created_utc"), post.get("created"), post.get("createdAt")),
            "author": first_present(post.get("author"), post.get("user"), post.get("username")),
            "id": reddit_id or post.get("id"),
            "reddit_post_id": reddit_id or post.get("id"),
            "permalink": normalized_permalink_url(permalink, url_value),
        },
    )
    if subquery:
        item = score_reddit_post(item, subquery)
    return item


def collect_reddit_public(question: str) -> List[SourceItem]:
    query = urllib.parse.urlencode(
        {"q": question, "limit": "10", "type": "link", "sort": "relevance", "t": "month"}
    )
    payload = http_json(
        f"https://www.reddit.com/search.json?{query}",
    )
    children = payload.get("data", {}).get("children", []) if isinstance(payload, dict) else []
    items = []
    for index, child in enumerate(children[:10], start=1):
        data = child.get("data", {}) if isinstance(child, dict) else {}
        subquery = reddit_search_plan(question)[0]
        item = normalize_reddit_post("reddit-public-json", index, data, REDDIT_FALLBACK_PUBLIC_JSON_TIER, subquery)
        if item.metadata.get("relevance_floor_passed") is not False:
            items.append(item)
    return items


def reddit_discussion_url(url: str) -> bool:
    return bool(re.search(r"reddit\.com/r/[^/]+/comments/", url))


def parse_reddit_rss(payload: str, question: str) -> List[SourceItem]:
    root = ET.fromstring(payload)
    namespace = {"atom": "http://www.w3.org/2005/Atom"}
    items = []
    subquery = reddit_search_plan(question)[0]
    for index, entry in enumerate(root.findall("atom:entry", namespace)[:10], start=1):
        title = entry.findtext("atom:title", default="Reddit result", namespaces=namespace)
        summary = entry.findtext("atom:summary", default="", namespaces=namespace)
        updated = entry.findtext("atom:updated", default="", namespaces=namespace)
        url_value = ""
        for link in entry.findall("atom:link", namespace):
            href = link.attrib.get("href")
            if href:
                url_value = href
                break
        if not reddit_discussion_url(url_value):
            continue
        subreddit_match = re.search(r"reddit\.com/r/([^/]+)/", url_value)
        item = source_item(
            "reddit",
            len(items) + 1,
            title.strip() or "Reddit result",
            url_value,
            re.sub(r"<[^>]+>", " ", summary).strip(),
            {
                "kind": "reddit_post",
                "provider": "reddit-search-rss",
                "provider_tier": REDDIT_FALLBACK_RSS_TIER,
                "collection_surface": "reddit-search-rss",
                "evidence_quality": "fallback-rss-snippet",
                "subreddit": subreddit_match.group(1) if subreddit_match else None,
                "created_utc": updated,
                "date": item_date(updated),
            },
        )
        item = score_reddit_post(item, subquery)
        if item.metadata.get("relevance_floor_passed") is not False:
            items.append(item)
    return items


def collect_reddit_rss(question: str, subreddits: Optional[Sequence[str]] = None) -> List[SourceItem]:
    urls = [
        "https://www.reddit.com/search.rss?"
        + urllib.parse.urlencode({"q": question, "limit": "25", "sort": "relevance", "t": "month"})
    ]
    for subreddit in list(subreddits or [])[:3]:
        clean = str(subreddit).removeprefix("r/")
        urls.append(
            f"https://www.reddit.com/r/{urllib.parse.quote(clean)}/search.rss?"
            + urllib.parse.urlencode({"q": question, "restrict_sr": "on", "sort": "relevance", "t": "month"})
        )
    items: List[SourceItem] = []
    seen = set()
    errors: List[BaseException] = []
    for url in urls:
        try:
            parsed = parse_reddit_rss(http_text(url), question)
        except (urllib.error.URLError, TimeoutError, ET.ParseError) as exc:
            errors.append(exc)
            continue
        for item in parsed:
            if item.url not in seen:
                seen.add(item.url)
                items.append(item)
    if not items and errors:
        raise errors[-1]
    return items


REDDIT_POST_CARD = re.compile(r"<shreddit-post(?=[\s>])[^>]*>")
REDDIT_COMMENT_CARD = re.compile(r"<shreddit-comment(?=[\s>])[^>]*>")


def html_attr(tag: str, name: str) -> str:
    match = re.search(rf'\b{re.escape(name)}="([^"]*)"', tag)
    return html.unescape(match.group(1)) if match else ""


def parse_reddit_listing(payload: str, question: str) -> List[SourceItem]:
    subquery = reddit_search_plan(question)[0]
    items: List[SourceItem] = []
    for tag in REDDIT_POST_CARD.findall(payload or ""):
        permalink = html_attr(tag, "permalink")
        if "/comments/" not in permalink:
            continue
        item = normalize_reddit_post(
            "reddit-shreddit-listing",
            len(items) + 1,
            {
                "title": html_attr(tag, "post-title"),
                "permalink": permalink,
                "id": re.search(r"/comments/([A-Za-z0-9]+)", permalink).group(1),
                "subreddit": html_attr(tag, "subreddit-name"),
                "author": html_attr(tag, "author"),
                "score": safe_int(html_attr(tag, "score")),
                "num_comments": safe_int(html_attr(tag, "comment-count")),
                "created_utc": html_attr(tag, "created-timestamp"),
            },
            REDDIT_PRIMARY_TIER,
            subquery,
        )
        item.metadata["collection_surface"] = "reddit-shreddit-listing"
        item.metadata["evidence_quality"] = "public-listing-post"
        items.append(item)
    return items


def collect_reddit_listings(question: str, subreddits: Sequence[str], depth: str) -> List[SourceItem]:
    sorts = ("top", "hot", "new") if depth == "deep" else ("top", "hot")
    items: List[SourceItem] = []
    seen = set()
    for subreddit in list(subreddits)[:3]:
        clean = str(subreddit).removeprefix("r/")
        for sort in sorts:
            url = f"https://www.reddit.com/svc/shreddit/community-more-posts/{sort}/?name={urllib.parse.quote(clean)}"
            if sort == "top":
                url += "&t=month"
            try:
                parsed = parse_reddit_listing(http_text(url), question)
            except (urllib.error.URLError, TimeoutError):
                continue
            for item in parsed:
                key = reddit_item_dedupe_key(item)
                if key not in seen:
                    seen.add(key)
                    items.append(item)
    return items


def parse_reddit_shreddit_comments(payload: str, parent: SourceItem, question: str, limit: int) -> List[SourceItem]:
    items: List[SourceItem] = []
    for tag in REDDIT_COMMENT_CARD.findall(payload or ""):
        thing_id = html_attr(tag, "thingid") or html_attr(tag, "thing-id")
        comment_id = reddit_native_id(thing_id)
        if not comment_id:
            continue
        anchor = f'id="t1_{comment_id}-post-rtjson-content"'
        start = payload.find(anchor)
        body = ""
        if start >= 0:
            window = payload[start : start + 8000]
            paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", window, re.S)
            body = compact_text(html.unescape(re.sub(r"<[^>]+>", " ", " ".join(paragraphs))), 500)
        if not body:
            continue
        permalink = html_attr(tag, "permalink")
        raw = {
            "id": comment_id,
            "body": body,
            "author": html_attr(tag, "author"),
            "score": safe_int(html_attr(tag, "score")),
            "created": html_attr(tag, "created-timestamp"),
            "permalink": permalink,
            "depth": safe_int(html_attr(tag, "depth")),
        }
        item = normalize_reddit_comment("reddit-shreddit-comments", len(items) + 1, raw, parent, question)
        item.metadata["provider_tier"] = REDDIT_PRIMARY_TIER
        item.metadata["collection_surface"] = "reddit-shreddit-comments"
        item.metadata["evidence_quality"] = "public-comment"
        items.append(item)
    return sorted(items, key=lambda item: safe_float(item.metadata.get("rank_score")), reverse=True)[:limit]


def collect_reddit_shreddit_comments(parent: SourceItem, question: str, limit: int) -> List[SourceItem]:
    match = re.search(r"/r/([^/]+)/comments/([A-Za-z0-9]+)", parent.url)
    if not match:
        return []
    url = f"https://www.reddit.com/svc/shreddit/comments/r/{match.group(1)}/t3_{match.group(2)}?sort=top"
    return parse_reddit_shreddit_comments(http_text(url), parent, question, limit)


def scrapecreators_headers() -> Dict[str, str]:
    token = credential_value("SCRAPECREATORS_API_KEY")
    if not token:
        return {}
    return {"x-api-key": token, "Content-Type": "application/json"}


def parse_scrapecreators_posts(payload: object) -> List[Dict[str, object]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if not isinstance(payload, dict):
        return []
    raw = payload.get("posts") or payload.get("data") or payload.get("items") or payload.get("results") or []
    return raw if isinstance(raw, list) else []


def extract_reddit_comments(payload: object) -> List[Dict[str, object]]:
    roots: List[object]
    if isinstance(payload, list):
        roots = payload
    elif isinstance(payload, dict):
        roots = [
            payload.get("comments"),
            payload.get("data"),
            payload.get("items"),
            payload.get("results"),
        ]
    else:
        roots = []
    comments: List[Dict[str, object]] = []

    def walk(value: object) -> None:
        if isinstance(value, list):
            for entry in value:
                walk(entry)
            return
        if not isinstance(value, dict):
            return
        candidate = value.get("data") if isinstance(value.get("data"), dict) else value
        body = first_present(candidate.get("body"), candidate.get("text"), candidate.get("comment"), candidate.get("content"))
        if body and reddit_comment_native_id(candidate):
            comments.append(candidate)
        for key in ("replies", "children", "comments"):
            if key in candidate:
                walk(candidate[key])

    for root in roots:
        walk(root)
    return comments


def normalize_reddit_comment(
    provider: str,
    index: int,
    comment: Dict[str, object],
    parent: SourceItem,
    question: str,
) -> SourceItem:
    comment_id = reddit_comment_native_id(comment)
    parent_metadata = parent.metadata
    permalink = normalized_permalink_url(comment.get("permalink"), "")
    if not permalink and comment_id:
        permalink = f"{parent.url.rstrip('/')}/{comment_id}/"
    body = compact_text(first_present(comment.get("body"), comment.get("text"), comment.get("comment"), comment.get("content"), ""), 500)
    author = str(first_present(comment.get("author"), comment.get("user"), comment.get("username"), "") or "")
    item = source_item(
        "reddit",
        index,
        f"Comment by u/{author}" if author else "Reddit comment",
        permalink or parent.url,
        body,
        {
            "kind": "reddit_comment",
            "provider": provider,
            "provider_tier": parent_metadata.get("provider_tier", REDDIT_PRIMARY_TIER),
            "collection_surface": "scrapecreators-api",
            "evidence_quality": "api-comment",
            "subreddit": parent_metadata.get("subreddit"),
            "author": author or None,
            "ups": first_present(comment.get("ups"), comment.get("score"), comment.get("upvotes"), comment.get("votes")),
            "depth": first_present(comment.get("depth"), comment.get("level"), 0),
            "created_utc": first_present(comment.get("created_utc"), comment.get("created"), comment.get("createdAt")),
            "reddit_comment_id": comment_id,
            "parent_source_id": parent.id,
            "parent_post_id": parent_metadata.get("reddit_post_id") or parent_metadata.get("id"),
            "parent_post_url": parent.url,
            "comment_url": permalink or parent.url,
            "quote_safe_excerpt": compact_text(body, 240),
            "cluster_key": parent_metadata.get("cluster_key"),
        },
    )
    return score_reddit_comment(item, question, [parent.title, parent.snippet, body])


def collect_reddit_scrapecreators_comments(parent: SourceItem, question: str, limit: int) -> List[SourceItem]:
    if not credential_value("SCRAPECREATORS_API_KEY") or not parent.url:
        return []
    query = urllib.parse.urlencode({"url": parent.url, "trim": "true"})
    payload = http_json(
        f"https://api.scrapecreators.com/v1/reddit/post/comments?{query}",
        headers=scrapecreators_headers(),
    )
    comments = extract_reddit_comments(payload)
    sibling_texts = [parent.title, parent.snippet] + [
        compact_text(first_present(comment.get("body"), comment.get("text"), comment.get("comment"), comment.get("content"), ""), 500)
        for comment in comments
    ]
    items = [
        normalize_reddit_comment(REDDIT_PAID_PROVIDER, index, comment, parent, question)
        for index, comment in enumerate(comments, start=1)
        if compact_text(first_present(comment.get("body"), comment.get("text"), comment.get("comment"), comment.get("content"), ""))
    ]
    for item in items:
        item.metadata["representative_score"] = max(
            safe_float(item.metadata.get("representative_score")),
            topic_fit_score(item.snippet, unique_terms(tokenize(" ".join(sibling_texts)), 20)),
        )
    return sorted(items, key=lambda item: safe_float(item.metadata.get("rank_score")), reverse=True)[:limit]


def collect_reddit_scrapecreators_subreddit_posts(subreddit: str, subquery: Dict[str, object]) -> List[SourceItem]:
    if not credential_value("SCRAPECREATORS_API_KEY") or not subreddit:
        return []
    query = urllib.parse.urlencode(
        {
            "subreddit": subreddit.removeprefix("r/"),
            "timeframe": "month",
            "sort": "hot",
            "trim": "true",
        }
    )
    payload = http_json(
        f"https://api.scrapecreators.com/v1/reddit/subreddit?{query}",
        headers=scrapecreators_headers(),
    )
    items = []
    for post in parse_scrapecreators_posts(payload):
        item = normalize_reddit_post(REDDIT_PAID_PROVIDER, len(items) + 1, post, REDDIT_PAID_TIER, subquery)
        item.metadata["collection_surface"] = "scrapecreators-subreddit-api"
        item.metadata["subreddit_discovery"] = True
        item.metadata["target_subreddit"] = subreddit.removeprefix("r/")
        items.append(item)
    return items


def select_reddit_posts_for_comments(candidates: Sequence[SourceItem], depth: str) -> List[SourceItem]:
    limit = REDDIT_COMMENT_DEEP_POST_LIMIT if depth == "deep" else REDDIT_COMMENT_STANDARD_POST_LIMIT
    subreddit_cap = 4 if depth == "deep" else 3
    selected: List[SourceItem] = []
    per_subreddit: Dict[str, int] = {}
    ranked = sorted(candidates, key=lambda item: safe_float(item.metadata.get("rank_score")), reverse=True)
    for item in ranked:
        subreddit = str(item.metadata.get("subreddit") or "reddit").lower()
        explicitly_targeted = safe_float(item.metadata.get("subreddit_score")) >= 1.0
        if explicitly_targeted or per_subreddit.get(subreddit, 0) < subreddit_cap:
            selected.append(item)
            per_subreddit[subreddit] = per_subreddit.get(subreddit, 0) + 1
        if len(selected) >= limit:
            break
    for item in ranked:
        if len(selected) >= limit:
            break
        if item not in selected:
            selected.append(item)
    rescue_candidates = [
        item
        for item in ranked
        if item not in selected
        and safe_float(item.metadata.get("topic_fit")) >= 0.75
        and safe_float(item.metadata.get("engagement_score")) < 0.25
    ]
    if rescue_candidates and selected:
        rescue = max(rescue_candidates, key=lambda item: safe_float(item.metadata.get("topic_fit")))
        selected[-1] = rescue
    return selected[:limit]


def collect_reddit_scrapecreators(
    question: str,
    depth: str = "standard",
    include_comments: bool = True,
    include_subreddits: bool = True,
    max_search_calls: Optional[int] = None,
) -> List[SourceItem]:
    token = credential_value("SCRAPECREATORS_API_KEY")
    if not token:
        return []
    subqueries = reddit_search_plan(question, depth)
    if max_search_calls is not None:
        subqueries = subqueries[:max(0, max_search_calls)]
    if not subqueries:
        return []
    candidates: List[SourceItem] = []
    seen = set()
    for subquery in subqueries:
        query = urllib.parse.urlencode(
            {
                "query": str(subquery["search_query"]),
                "sort": "relevance",
                "timeframe": "month",
                "trim": "true",
            }
        )
        payload = http_json(
            f"https://api.scrapecreators.com/v1/reddit/search?{query}",
            headers=scrapecreators_headers(),
        )
        for post in parse_scrapecreators_posts(payload):
            item = normalize_reddit_post(REDDIT_PAID_PROVIDER, len(candidates) + 1, post, REDDIT_PAID_TIER, subquery)
            key = reddit_item_dedupe_key(item)
            if key in seen:
                continue
            seen.add(key)
            if item.metadata.get("relevance_floor_passed") is False:
                continue
            candidates.append(item)
    if include_subreddits:
        target_subreddits = []
        for subquery in subqueries[:1]:
            for subreddit in subquery.get("target_subreddits", []):
                subreddit_value = str(subreddit).removeprefix("r/")
                if subreddit_value and subreddit_value not in target_subreddits:
                    target_subreddits.append(subreddit_value)
        for subreddit in target_subreddits[:3]:
            try:
                for item in collect_reddit_scrapecreators_subreddit_posts(subreddit, subqueries[0]):
                    key = reddit_item_dedupe_key(item)
                    if key in seen:
                        continue
                    seen.add(key)
                    if item.metadata.get("relevance_floor_passed") is False:
                        continue
                    candidates.append(item)
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
                continue
    per_post_limit = REDDIT_COMMENT_DEEP_PER_POST_LIMIT if depth == "deep" else REDDIT_COMMENT_STANDARD_PER_POST_LIMIT
    total_comment_limit = REDDIT_COMMENT_DEEP_TOTAL_LIMIT if depth == "deep" else REDDIT_COMMENT_STANDARD_TOTAL_LIMIT
    selected_posts = select_reddit_posts_for_comments(candidates, depth)
    items: List[SourceItem] = []
    for post_index, post in enumerate(selected_posts, start=1):
        post.id = f"reddit-post-{post_index}"
        items.append(post)
    if not include_comments:
        return items
    comments: List[SourceItem] = []
    for post in selected_posts:
        try:
            comments.extend(collect_reddit_scrapecreators_comments(post, question, per_post_limit))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            post.metadata["comment_fetch_error"] = provider_error(REDDIT_PAID_PROVIDER, exc)
    comments = sorted(comments, key=lambda item: safe_float(item.metadata.get("rank_score")), reverse=True)[:total_comment_limit]
    for comment_index, comment in enumerate(comments, start=1):
        comment.id = f"reddit-comment-{comment_index}"
        items.append(comment)
    return items


def collect_reddit(plan: Plan) -> List[SourceItem]:
    errors: List[Dict[str, str]] = []
    subreddits = list(plan.targets.get("reddit_subreddits", []))
    if not subreddits:
        for subquery in reddit_search_plan(plan.topic, plan.depth)[:1]:
            subreddits.extend(str(value) for value in subquery.get("target_subreddits", []))
    candidates: List[SourceItem] = []
    calls = 0
    try:
        rss_items = collect_reddit_rss(plan.topic, subreddits)
        calls += 1 + min(3, len(subreddits))
        candidates.extend(rss_items)
    except (urllib.error.URLError, TimeoutError, ET.ParseError) as exc:
        errors.append(provider_error("reddit-search-rss", exc))
    if subreddits and calls < plan.source_budgets["reddit"]:
        listing_calls = min(
            plan.source_budgets["reddit"] - calls,
            len(subreddits) * (3 if plan.depth == "deep" else 2),
        )
        try:
            candidates.extend(collect_reddit_listings(plan.topic, subreddits, plan.depth))
            calls += listing_calls
        except (urllib.error.URLError, TimeoutError) as exc:
            errors.append(provider_error("reddit-shreddit-listing", exc))
    seen = set()
    posts: List[SourceItem] = []
    for item in sorted(candidates, key=lambda value: safe_float(value.metadata.get("rank_score")), reverse=True):
        created = item.metadata.get("created_utc") or item.metadata.get("date")
        if created and not date_in_plan(created, plan):
            continue
        key = reddit_item_dedupe_key(item)
        if key in seen or item.metadata.get("relevance_floor_passed") is False:
            continue
        seen.add(key)
        posts.append(item)
    target_posts = 10 if plan.depth == "deep" else 6
    posts = posts[:target_posts]
    comments: List[SourceItem] = []
    per_post = 5 if plan.depth == "deep" else 3
    enrich_limit = 5 if plan.depth == "deep" else 3
    for post in posts[:enrich_limit]:
        if calls >= plan.source_budgets["reddit"]:
            break
        try:
            comments.extend(collect_reddit_shreddit_comments(post, plan.topic, per_post))
            calls += 1
        except (urllib.error.URLError, TimeoutError) as exc:
            post.metadata["comment_fetch_error"] = provider_error("reddit-shreddit-comments", exc)
    minimum_posts = 6 if plan.depth == "deep" else 3
    remaining_calls = max(0, plan.source_budgets["reddit"] - calls)
    if len(posts) < minimum_posts and remaining_calls and credential_value("SCRAPECREATORS_API_KEY"):
        try:
            paid = collect_reddit_scrapecreators(
                plan.topic,
                plan.depth,
                include_comments=False,
                include_subreddits=False,
                max_search_calls=remaining_calls,
            )
            calls += min(remaining_calls, len(reddit_search_plan(plan.topic, plan.depth)))
            for item in paid:
                created = item.metadata.get("created_utc") or item.metadata.get("date")
                if not created or not date_in_plan(created, plan):
                    continue
                key = reddit_item_dedupe_key(item)
                if key not in seen:
                    seen.add(key)
                    posts.append(item)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            errors.append(provider_error(REDDIT_PAID_PROVIDER, exc))
    items = posts[:target_posts]
    for index, item in enumerate(items, start=1):
        item.id = f"reddit-post-{index}"
    comments = sorted(comments, key=lambda value: safe_float(value.metadata.get("rank_score")), reverse=True)
    for index, item in enumerate(comments[: (25 if plan.depth == "deep" else 12)], start=1):
        item.id = f"reddit-comment-{index}"
        items.append(item)
    if items:
        return annotate_collection(items, plan, calls, REDDIT_PRIMARY_PROVIDER)
    if errors:
        raise ProviderCollectionError("reddit", errors)
    return []


def parse_xai_items(payload: object) -> List[Dict[str, object]]:
    output_text = ""
    if isinstance(payload, dict):
        if payload.get("error"):
            raise ValueError(f"xAI API error: {compact_text(payload.get('error'), 240)}")
        output = payload.get("output")
        if isinstance(output, str):
            output_text = output
        elif isinstance(output, list):
            for entry in output:
                if not isinstance(entry, dict):
                    continue
                content = entry.get("content")
                if isinstance(content, list):
                    for content_entry in content:
                        if isinstance(content_entry, dict) and content_entry.get("type") == "output_text":
                            output_text = str(content_entry.get("text") or "")
                            break
                if output_text:
                    break
        if not output_text and isinstance(payload.get("choices"), list):
            for choice in payload["choices"]:
                if isinstance(choice, dict) and isinstance(choice.get("message"), dict):
                    output_text = str(choice["message"].get("content") or "")
                    if output_text:
                        break
    match = re.search(r'\{[\s\S]*"items"[\s\S]*\}', output_text)
    if not match:
        if output_text:
            raise ValueError("xAI search returned output without a JSON items object")
        raise ValueError("xAI search returned no output text")
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError as exc:
        raise ValueError("xAI search returned invalid JSON") from exc
    items = data.get("items") if isinstance(data, dict) else []
    return items if isinstance(items, list) else []


def x_post_id(post: Dict[str, object]) -> str:
    direct = str(first_present(post.get("id"), post.get("tweet_id"), post.get("post_id"), "") or "")
    if direct:
        return direct
    match = re.search(r"/status/(\d+)", str(post.get("url") or ""))
    return match.group(1) if match else ""


def x_search_queries(plan: Plan) -> List[str]:
    queries = [plan.topic]
    handles = plan.targets.get("x_handles", [])
    if handles:
        queries.append(" OR ".join(f"from:{handle}" for handle in handles[:4]))
    elif plan.depth == "deep":
        terms = unique_terms(tokenize(plan.topic), 6)
        if terms:
            queries.append(" ".join(terms))
    return queries[: (2 if plan.depth == "deep" else 1)]


def score_x_item(item: SourceItem, plan: Plan) -> SourceItem:
    metadata = item.metadata
    engagement = metadata.get("engagement") if isinstance(metadata.get("engagement"), dict) else {}
    metrics = metadata.get("public_metrics") if isinstance(metadata.get("public_metrics"), dict) else {}
    relevance = safe_float(metadata.get("relevance"), topic_fit_score(f"{item.title} {item.snippet}", unique_terms(tokenize(plan.topic), 10)))
    freshness = freshness_score(metadata.get("created_at") or metadata.get("date"))
    engagement_score = max(
        log_score(first_present(engagement.get("likes"), metrics.get("like_count")), 100000),
        log_score(first_present(engagement.get("reposts"), metrics.get("retweet_count")), 20000),
        log_score(first_present(engagement.get("replies"), metrics.get("reply_count")), 20000),
    )
    metadata.update(
        {
            "kind": "x_post",
            "topic_fit": round(relevance, 3),
            "freshness_score": round(freshness, 3),
            "engagement_score": round(engagement_score, 3),
            "rank_score": round(55 * relevance + 25 * freshness + 20 * engagement_score, 3),
            "rank_reason": "topic fit, freshness, and source-native engagement",
        }
    )
    item.metadata = metadata
    return item


def normalize_x_post(provider: str, index: int, post: Dict[str, object], plan: Plan) -> Optional[SourceItem]:
    post_id = x_post_id(post)
    url = str(post.get("url") or (f"https://x.com/i/web/status/{post_id}" if post_id else ""))
    created = first_present(post.get("date"), post.get("created_at"))
    if created and not date_in_plan(created, plan):
        return None
    handle = str(first_present(post.get("author_handle"), post.get("username"), "") or "").lstrip("@")
    metrics = post.get("public_metrics") if isinstance(post.get("public_metrics"), dict) else post.get("metrics")
    item = source_item(
        "x",
        index,
        f"@{handle}" if handle else (f"X post {post_id}" if post_id else "X post"),
        url,
        compact_text(post.get("text"), 500),
        {
            "provider": provider,
            "provider_tier": "primary_api" if provider == "xai-x-search" else "fallback_api",
            "collection_surface": provider,
            "tweet_id": post_id,
            "post_id": post_id,
            "author_handle": handle or None,
            "author_id": post.get("author_id"),
            "created_at": created,
            "date": item_date(created),
            "engagement": post.get("engagement"),
            "public_metrics": metrics,
            "why_relevant": post.get("why_relevant"),
            "relevance": post.get("relevance"),
        },
    )
    return score_x_item(item, plan)


def collect_x_xai(plan: Plan) -> List[SourceItem]:
    token = credential_value("XAI_API_KEY")
    if not token:
        return []
    body = {
        "model": os.environ.get("PULSE_XAI_MODEL", "grok-4-1-fast"),
        "tools": [{"type": "x_search", "from_date": plan.since, "to_date": plan.until}],
        "input": [
            {
                "role": "user",
                "content": (
                    f"Search X posts from {plan.since} through {plan.until} and return only JSON in the shape "
                    '{"items":[{"text":"...","url":"https://x.com/user/status/...","author_handle":"...",'
                    '"date":"YYYY-MM-DD or null","engagement":{},"why_relevant":"..."}]}. '
                    "Search lanes: " + " | ".join(x_search_queries(plan))
                ),
            }
        ],
    }
    payload = http_json(
        "https://api.x.ai/v1/responses",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        body=body,
    )
    posts = parse_xai_items(payload)
    items = []
    limit = 30 if plan.depth == "deep" else 15
    for index, post in enumerate(posts[:limit], start=1):
        if not isinstance(post, dict):
            continue
        item = normalize_x_post("xai-x-search", index, post, plan)
        if item:
            items.append(item)
    return sorted(items, key=lambda item: safe_float(item.metadata.get("rank_score")), reverse=True)


def collect_x_official(plan: Plan) -> List[SourceItem]:
    token = credential_value("X_BEARER_TOKEN") or ""
    if not token:
        return []
    official_since = max(
        datetime.fromisoformat(plan.since).date(),
        datetime.now(timezone.utc).date() - timedelta(days=6),
    ).isoformat()
    requested_end = datetime.fromisoformat(plan.until).replace(tzinfo=timezone.utc) + timedelta(days=1) - timedelta(seconds=1)
    safe_end = min(requested_end, datetime.now(timezone.utc) - timedelta(seconds=10))
    query = urllib.parse.urlencode(
        {
            "query": plan.topic,
            "max_results": "100" if plan.depth == "deep" else "25",
            "start_time": f"{official_since}T00:00:00Z",
            "end_time": safe_end.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "tweet.fields": "created_at,author_id,public_metrics,lang,entities",
        }
    )
    payload = http_json(
        f"https://api.x.com/2/tweets/search/recent?{query}",
        headers={"Authorization": f"Bearer {token}"},
    )
    posts = payload.get("data", []) if isinstance(payload, dict) else []
    items = []
    for index, post in enumerate(posts, start=1):
        if not isinstance(post, dict):
            continue
        item = normalize_x_post("official-x-api", index, post, plan)
        if item:
            item.metadata["achieved_since"] = official_since
            items.append(item)
    return sorted(items, key=lambda item: safe_float(item.metadata.get("rank_score")), reverse=True)


def bird_script_path() -> Path:
    return Path(__file__).resolve().parent / "vendor" / "bird-search" / "bird-search.mjs"


def collect_x_bird(plan: Plan) -> List[SourceItem]:
    if os.environ.get("PULSE_X_BACKEND") != "bird":
        return []
    auth_token = credential_value("AUTH_TOKEN")
    ct0 = credential_value("CT0")
    node = shutil.which("node")
    if not auth_token or not ct0 or not node:
        raise ProviderCollectionError(
            "x",
            [provider_status_error("bird", "MissingCredentials", "Bird requires Node plus explicit AUTH_TOKEN and CT0 environment variables.")],
        )
    query = f"{plan.topic} since:{plan.since} until:{(datetime.fromisoformat(plan.until).date() + timedelta(days=1)).isoformat()}"
    env = dict(os.environ)
    env.update({"AUTH_TOKEN": auth_token, "CT0": ct0, "BIRD_DISABLE_BROWSER_COOKIES": "1"})
    try:
        completed = subprocess.run(
            [node, str(bird_script_path()), query, "--count", "40" if plan.depth == "deep" else "20", "--json"],
            text=True,
            capture_output=True,
            check=False,
            timeout=60 if plan.depth == "deep" else 45,
            env=env,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise ProviderCollectionError("x", [provider_error("bird", exc)]) from exc
    if completed.returncode != 0:
        raise ProviderCollectionError(
            "x",
            [provider_status_error("bird", "BirdSearchError", compact_text(completed.stderr or completed.stdout, 300))],
        )
    try:
        payload = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise ProviderCollectionError(
            "x",
            [provider_status_error("bird", "SchemaError", "Bird returned a non-JSON response.")],
        ) from exc
    raw = payload if isinstance(payload, list) else payload.get("items", []) if isinstance(payload, dict) else []
    items = []
    for index, post in enumerate(raw if isinstance(raw, list) else [], start=1):
        if not isinstance(post, dict):
            continue
        author = post.get("author") if isinstance(post.get("author"), dict) else {}
        normalized = {
            "id": first_present(post.get("id"), post.get("rest_id")),
            "text": first_present(post.get("text"), post.get("full_text")),
            "url": post.get("url"),
            "author_handle": first_present(author.get("username"), post.get("username")),
            "created_at": first_present(post.get("createdAt"), post.get("created_at")),
            "public_metrics": {
                "like_count": first_present(post.get("likeCount"), post.get("favorite_count")),
                "retweet_count": first_present(post.get("retweetCount"), post.get("retweet_count")),
                "reply_count": first_present(post.get("replyCount"), post.get("reply_count")),
            },
        }
        item = normalize_x_post("bird-explicit-cookies", index, normalized, plan)
        if item:
            item.metadata["provider_tier"] = "explicit_session_api"
            items.append(item)
    return dedupe_ranked_items(items, "tweet_id")


def collect_x(plan: Plan) -> List[SourceItem]:
    errors: List[Dict[str, str]] = []
    if os.environ.get("PULSE_X_BACKEND") == "bird":
        return annotate_collection(collect_x_bird(plan), plan, 1, "bird-explicit-cookies")
    if credential_value("XAI_API_KEY"):
        try:
            items = collect_x_xai(plan)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, ValueError) as exc:
            errors.append(provider_error("xai-x-search", exc))
            items = []
        if items:
            return annotate_collection(dedupe_ranked_items(items, "tweet_id"), plan, 1, "xai-x-search")
        if credential_value("X_BEARER_TOKEN"):
            try:
                return annotate_collection(collect_x_official(plan), plan, 2, "official-x-api")
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                errors.append(provider_error("official-x-api", exc))
    if credential_value("X_BEARER_TOKEN"):
        try:
            return annotate_collection(collect_x_official(plan), plan, 1, "official-x-api")
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            errors.append(provider_error("official-x-api", exc))
    if errors:
        raise ProviderCollectionError("x", errors)
    return []


def tiktok_search_queries(plan: Plan) -> List[Dict[str, str]]:
    lanes: List[Dict[str, str]] = []
    for hashtag in plan.targets.get("tiktok_hashtags", [])[:2]:
        lanes.append({"surface": "hashtag", "query": hashtag})
    for creator in plan.targets.get("tiktok_creators", [])[:2]:
        lanes.append({"surface": "creator", "query": creator})
    lanes.append({"surface": "keyword", "query": plan.topic})
    if plan.depth == "deep":
        core = " ".join(unique_terms(tokenize(plan.topic), 6))
        if core and core != plan.topic:
            lanes.append({"surface": "keyword", "query": core})
    limit = TIKTOK_DEEP_SEARCH_CALLS if plan.depth == "deep" else TIKTOK_STANDARD_SEARCH_CALLS
    return lanes[:limit]


def tiktok_raw_items(payload: object) -> List[Dict[str, object]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if not isinstance(payload, dict):
        return []
    raw = (
        payload.get("search_item_list") or payload.get("aweme_list") or payload.get("items")
        or payload.get("results") or payload.get("data") or []
    )
    if isinstance(raw, dict):
        raw = raw.get("items") or raw.get("aweme_list") or []
    output = []
    for entry in raw if isinstance(raw, list) else []:
        if isinstance(entry, dict):
            value = entry.get("aweme_info", entry)
            if isinstance(value, dict):
                output.append(value)
    return output


def tiktok_stats(post: Dict[str, object]) -> Dict[str, int]:
    stats = post.get("statistics") if isinstance(post.get("statistics"), dict) else post.get("stats")
    stats = stats if isinstance(stats, dict) else {}
    return {
        "views": safe_int(first_present(stats.get("play_count"), stats.get("playCount"), stats.get("views"))),
        "likes": safe_int(first_present(stats.get("digg_count"), stats.get("diggCount"), stats.get("likes"))),
        "comments": safe_int(first_present(stats.get("comment_count"), stats.get("commentCount"), stats.get("comments"))),
        "shares": safe_int(first_present(stats.get("share_count"), stats.get("shareCount"), stats.get("shares"))),
    }


def normalize_tiktok_video(index: int, post: Dict[str, object], plan: Plan, lane: Dict[str, str]) -> Optional[SourceItem]:
    video_id = str(first_present(post.get("aweme_id"), post.get("id"), post.get("video_id"), "") or "")
    author = post.get("author") if isinstance(post.get("author"), dict) else {}
    creator = str(first_present(author.get("unique_id"), author.get("uniqueId"), post.get("author_handle"), "") or "").lstrip("@")
    url = str(first_present(post.get("share_url"), post.get("url"), "") or "")
    if not url and creator and video_id:
        url = f"https://www.tiktok.com/@{creator}/video/{video_id}"
    if not video_id:
        match = re.search(r"/video/(\d+)", url)
        video_id = match.group(1) if match else ""
    created = first_present(post.get("create_time"), post.get("createTime"), post.get("date"))
    if created and not date_in_plan(created, plan):
        return None
    text = compact_text(first_present(post.get("desc"), post.get("text"), post.get("caption"), ""), 500)
    engagement = tiktok_stats(post)
    topic_fit = topic_fit_score(text, unique_terms(tokenize(plan.topic), 10))
    fresh = freshness_score(created)
    engagement_score = max(
        log_score(engagement["views"], 10_000_000),
        log_score(engagement["likes"], 1_000_000),
        log_score(engagement["comments"], 100_000),
        log_score(engagement["shares"], 100_000),
    )
    item = source_item(
        "tiktok",
        index,
        f"@{creator}" if creator else (f"TikTok video {video_id}" if video_id else "TikTok video"),
        url,
        text,
        {
            "kind": "tiktok_video",
            "provider": TIKTOK_PROVIDER,
            "provider_tier": "primary_api",
            "collection_surface": f"scrapecreators-tiktok-{lane['surface']}",
            "search_query": lane["query"],
            "video_id": video_id,
            "creator": creator or None,
            "created_at": created,
            "date": item_date(created),
            "engagement": engagement,
            "views": engagement["views"],
            "likes": engagement["likes"],
            "comments": engagement["comments"],
            "shares": engagement["shares"],
            "topic_fit": round(topic_fit, 3),
            "freshness_score": round(fresh, 3),
            "engagement_score": round(engagement_score, 3),
            "rank_score": round(50 * topic_fit + 20 * fresh + 30 * engagement_score, 3),
            "rank_reason": "topic fit, freshness, and video engagement",
        },
    )
    return item


def tiktok_lane_url(lane: Dict[str, str]) -> str:
    if lane["surface"] == "hashtag":
        return "https://api.scrapecreators.com/v1/tiktok/search/hashtag?" + urllib.parse.urlencode({"hashtag": lane["query"]})
    if lane["surface"] == "creator":
        return "https://api.scrapecreators.com/v3/tiktok/profile/videos?" + urllib.parse.urlencode({"handle": lane["query"], "sort_by": "latest"})
    return "https://api.scrapecreators.com/v1/tiktok/search/keyword?" + urllib.parse.urlencode({"query": lane["query"], "sort_by": "relevance"})


def fetch_tiktok_transcript(item: SourceItem) -> str:
    payload = http_json(
        "https://api.scrapecreators.com/v1/tiktok/video/transcript?" + urllib.parse.urlencode({"url": item.url}),
        headers=scrapecreators_headers(),
    )
    if not isinstance(payload, dict):
        return ""
    transcript = first_present(payload.get("transcript"), payload.get("captions"), payload.get("text"), "")
    if isinstance(transcript, list):
        transcript = " ".join(str(value.get("text") if isinstance(value, dict) else value) for value in transcript)
    return compact_text(re.sub(r"(?:WEBVTT|\d{2}:\d{2}:\d{2}[^\n]*)", " ", str(transcript or "")), 1200)


def fetch_tiktok_comments(item: SourceItem, limit: int = 5) -> List[Dict[str, object]]:
    payload = http_json(
        "https://api.scrapecreators.com/v1/tiktok/video/comments?" + urllib.parse.urlencode({"url": item.url, "trim": "true"}),
        headers=scrapecreators_headers(),
    )
    raw = payload.get("comments") or payload.get("data") or [] if isinstance(payload, dict) else []
    comments = []
    for value in raw if isinstance(raw, list) else []:
        if not isinstance(value, dict) or not value.get("text"):
            continue
        author = value.get("user") if isinstance(value.get("user"), dict) else {}
        comments.append(
            {
                "comment_id": first_present(value.get("cid"), value.get("id")),
                "author": first_present(author.get("unique_id"), author.get("nickname")),
                "text": compact_text(value.get("text"), 400),
                "likes": safe_int(value.get("digg_count")),
                "date": item_date(value.get("create_time")),
            }
        )
    return sorted(comments, key=lambda value: safe_int(value.get("likes")), reverse=True)[:limit]


def collect_tiktok(plan: Plan) -> List[SourceItem]:
    if not credential_value("SCRAPECREATORS_API_KEY"):
        return []
    errors: List[Dict[str, str]] = []
    candidates: List[SourceItem] = []
    calls = 0
    for lane in tiktok_search_queries(plan):
        try:
            payload = http_json(tiktok_lane_url(lane), headers=scrapecreators_headers())
            calls += 1
            for post in tiktok_raw_items(payload):
                item = normalize_tiktok_video(len(candidates) + 1, post, plan, lane)
                if item:
                    candidates.append(item)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            calls += 1
            errors.append(provider_error(TIKTOK_PROVIDER, exc))
    items = dedupe_ranked_items(candidates, "video_id")
    comment_requested = bool(re.search(r"\b(comment|comments|reply|replies|audience reaction)\b", plan.question, re.I))
    include_comments = plan.depth == "deep" or comment_requested
    transcript_limit = TIKTOK_DEEP_TRANSCRIPT_CALLS if plan.depth == "deep" else TIKTOK_STANDARD_TRANSCRIPT_CALLS
    if include_comments and plan.depth != "deep":
        transcript_limit = max(0, transcript_limit - 1)
    for item in items[:transcript_limit]:
        if calls >= plan.source_budgets["tiktok"]:
            break
        try:
            transcript = fetch_tiktok_transcript(item)
            calls += 1
            if transcript:
                item.metadata["transcript"] = transcript
                item.metadata["transcript_excerpt"] = compact_text(transcript, 500)
                if len(transcript) > len(item.snippet):
                    item.snippet = compact_text(transcript, 700)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            calls += 1
            item.metadata["transcript_error"] = provider_error(TIKTOK_PROVIDER, exc)
    comment_items: List[SourceItem] = []
    if include_comments and items and calls < plan.source_budgets["tiktok"]:
        try:
            parent = items[0]
            comments = fetch_tiktok_comments(parent)
            calls += 1
            for index, comment in enumerate(comments, start=1):
                comment_items.append(
                    source_item(
                        "tiktok",
                        index,
                        f"Comment by @{comment.get('author')}" if comment.get("author") else "TikTok comment",
                        parent.url,
                        str(comment.get("text") or ""),
                        {
                            "kind": "tiktok_comment",
                            "provider": TIKTOK_PROVIDER,
                            "provider_tier": "primary_api",
                            "collection_surface": "scrapecreators-tiktok-comments",
                            "comment_id": comment.get("comment_id"),
                            "author": comment.get("author"),
                            "likes": comment.get("likes"),
                            "date": comment.get("date"),
                            "parent_source_id": parent.id,
                            "parent_video_id": parent.metadata.get("video_id"),
                            "rank_score": safe_float(parent.metadata.get("rank_score")) * 0.6 + log_score(comment.get("likes"), 10000) * 40,
                            "rank_reason": "parent video relevance and comment likes",
                        },
                    )
                )
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            calls += 1
            items[0].metadata["comment_fetch_error"] = provider_error(TIKTOK_PROVIDER, exc)
    if items:
        videos = items[: (40 if plan.depth == "deep" else 20)]
        for index, item in enumerate(videos, start=1):
            item.id = f"tiktok-video-{index}"
        for index, item in enumerate(comment_items, start=1):
            item.id = f"tiktok-comment-{index}"
            item.metadata["parent_source_id"] = videos[0].id
        return annotate_collection(videos + comment_items, plan, calls, TIKTOK_PROVIDER)
    if errors:
        raise ProviderCollectionError("tiktok", errors)
    return []


def collect_web(question: str) -> List[SourceItem]:
    # Web collection is performed by the agent's web search tool, not by
    # provider API credentials inside this CLI.
    return []


def collect_polymarket(question: str) -> List[SourceItem]:
    results: List[object] = []
    for search_query in polymarket_search_queries(question):
        endpoint = f"https://gamma-api.polymarket.com/public-search?{urllib.parse.urlencode({'q': search_query})}"
        try:
            payload = http_json(endpoint)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
            continue
        raw = payload if isinstance(payload, list) else (
            payload.get("markets") or payload.get("events") or payload.get("results") or payload.get("data") or []
            if isinstance(payload, dict) else []
        )
        results = expand_polymarket_results(raw if isinstance(raw, list) else [])
        results = relevant_polymarket_results(question, results)
        results = select_polymarket_horizon(question, results)
        if results:
            break
    items = []
    for index, result in enumerate(results[:10], start=1):
        if not isinstance(result, dict):
            continue
        title = str(result.get("question") or result.get("title") or result.get("name") or "Polymarket result")
        item_url = result.get("url") or result.get("event_slug") or result.get("slug") or ""
        if item_url and not str(item_url).startswith("http"):
            item_url = f"https://polymarket.com/event/{item_url}"
        items.append(
            source_item(
                "polymarket",
                index,
                title,
                str(item_url),
                str(result.get("description") or result.get("subtitle") or ""),
                {
                    "provider": "polymarket-gamma",
                    "condition_id": result.get("conditionId"),
                    "question_id": result.get("questionID"),
                    "outcome_prices": result.get("outcomePrices"),
                    "outcomes": result.get("outcomes"),
                    "volume": result.get("volume"),
                    "liquidity": result.get("liquidity"),
                    "active": result.get("active"),
                    "closed": result.get("closed"),
                    "end_date": result.get("endDate") or result.get("end_date_iso"),
                    "updated_at": result.get("updatedAt"),
                    "resolution_source": result.get("resolutionSource"),
                    "rules": result.get("rules"),
                    "event_title": result.get("event_title"),
                    "event_slug": result.get("event_slug"),
                },
            )
        )
    return items


def polymarket_search_queries(question: str) -> List[str]:
    terms = set(significant_terms(question))
    if terms & {"fed", "federal", "fomc"}:
        candidates = ["Fed rate decision", "Fed decisions", question]
    elif "nba" in terms and terms & {"finals", "champion", "championship"}:
        candidates = ["NBA Finals", question]
    else:
        compact = " ".join(significant_terms(question)[:6])
        candidates = [compact, question] if compact else [question]
    return list(dict.fromkeys(candidate for candidate in candidates if candidate.strip()))


def expand_polymarket_results(results: Sequence[object]) -> List[object]:
    expanded: List[object] = []
    for result in results:
        if not isinstance(result, dict):
            continue
        markets = result.get("markets")
        if not isinstance(markets, list) or not markets:
            expanded.append(result)
            continue
        event_title = result.get("title") or result.get("question") or result.get("name")
        event_slug = result.get("slug")
        for market in markets:
            if not isinstance(market, dict):
                continue
            enriched = dict(market)
            enriched["event_title"] = event_title
            enriched["event_slug"] = event_slug
            expanded.append(enriched)
    return expanded


def select_polymarket_horizon(question: str, results: Sequence[object]) -> List[object]:
    rows = [row for row in results if isinstance(row, dict)]
    if not re.search(r"\b(next|nearest|upcoming)\b", question, re.IGNORECASE):
        return rows
    active_rows = [row for row in rows if row.get("active") is not False and row.get("closed") is not True]
    dated_rows = [row for row in active_rows if row.get("endDate") or row.get("end_date")]
    if not dated_rows:
        return active_rows or rows
    nearest = min(str(row.get("endDate") or row.get("end_date")) for row in dated_rows)
    return [row for row in dated_rows if str(row.get("endDate") or row.get("end_date")) == nearest]


def significant_terms(text: str) -> List[str]:
    terms = []
    for term in re.findall(r"[a-zA-Z0-9]+", text.lower()):
        if len(term) < 3 or term in SEARCH_STOPWORDS:
            continue
        terms.append(term)
    return terms


def polymarket_result_text(result: Dict[str, object]) -> str:
    return " ".join(
        str(result.get(key) or "")
        for key in ("question", "title", "name", "description", "subtitle", "slug", "ticker")
    ).lower()


def polymarket_result_title_text(result: Dict[str, object]) -> str:
    return " ".join(
        str(result.get(key) or "")
        for key in ("question", "title", "name", "slug", "ticker")
    ).lower()


def text_terms(text: str) -> set[str]:
    return set(significant_terms(text))


def relevant_polymarket_results(question: str, results: Sequence[object]) -> List[object]:
    query_terms = significant_terms(question)
    if not query_terms:
        return list(results)
    anchor_groups = {
        "nba": {"nba"}, "nfl": {"nfl"}, "mlb": {"mlb"}, "nhl": {"nhl"},
        "fed": {"fed", "federal", "fomc"}, "bitcoin": {"bitcoin", "btc"},
        "crypto": {"crypto", "cryptocurrency"}, "election": {"election", "electoral"},
    }
    query_term_set = set(query_terms)
    required_anchor_groups = [group for group in anchor_groups.values() if query_term_set & group]
    required_specific_terms = [term for term in query_terms if term in {"finals", "champion", "championship"}]
    min_score = 1 if required_anchor_groups or required_specific_terms else 2
    relevant = []
    for result in results:
        if not isinstance(result, dict):
            continue
        haystack = polymarket_result_text(result)
        haystack_terms = text_terms(haystack)
        title_terms = text_terms(polymarket_result_title_text(result))
        score = sum(1 for term in query_terms if term in haystack_terms)
        anchor_ok = not required_anchor_groups or all(bool(group & title_terms) for group in required_anchor_groups)
        if anchor_groups["fed"] in required_anchor_groups:
            anchor_ok = anchor_ok and bool(
                {"rate", "rates", "interest", "fomc", "decision", "decisions", "cut", "cuts", "hike", "hikes", "pause", "hold"}
                & title_terms
            )
        specific_ok = not required_specific_terms or any(term in title_terms for term in required_specific_terms)
        score_ok = score >= min_score or (bool(required_anchor_groups) and anchor_ok)
        if anchor_ok and specific_ok and score_ok:
            relevant.append(result)
    return relevant


def unavailable_source_item(source: str) -> SourceItem:
    if source == "web":
        snippet = (
            "Web source collection uses the agent's web search tool. Run web search in the parent agent "
            "and record exact URLs/snippets as source artifacts before synthesis."
        )
        metadata: Dict[str, object] = {"unavailable": True, "collection_surface": "agent-web-search-tool"}
    elif source in {"reddit", "x", "tiktok"}:
        snippet = "No usable artifacts were collected. Check provider credentials, access policy, or query fit."
        metadata = {
            "unavailable": True,
            "credential_env": (
                "SCRAPECREATORS_API_KEY" if source == "tiktok"
                else "XAI_API_KEY/X_BEARER_TOKEN" if source == "x"
                else None
            ),
            "provider_tier": "primary_unavailable",
        }
        if source == "x" and credential_value("AUTH_TOKEN") and credential_value("CT0"):
            metadata["note"] = "AUTH_TOKEN/CT0 are configured for user-provided session-cookie workflows, but this CLI has no vendored X GraphQL collector."
    else:
        snippet = "No usable artifacts were collected for this source. Check provider availability or query fit."
        metadata = {"unavailable": True}
    return source_item(source, 0, f"{source} unavailable or no results", "", snippet, metadata)


def live_items(plan: Plan) -> List[SourceItem]:
    collectors = {
        "reddit": collect_reddit,
        "x": collect_x,
        "tiktok": collect_tiktok,
        "web": collect_web,
        "polymarket": collect_polymarket,
    }
    items: List[SourceItem] = []
    for source in enabled_sources(plan):
        try:
            collector = collectors[source]
            collected = collector(plan.topic) if source in {"web", "polymarket"} else collector(plan)
            if collected:
                relevant = [item for item in collected if not excluded_by_plan(item, plan)]
                windowed = enforce_social_window(relevant, plan)
                if windowed:
                    items.extend(windowed)
                else:
                    items.append(unavailable_source_item(source))
            else:
                items.append(unavailable_source_item(source))
        except (ProviderCollectionError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            metadata: Dict[str, object] = {"error": True, "error_type": type(exc).__name__, "provider": source}
            if isinstance(exc, ProviderCollectionError):
                metadata["provider_errors"] = exc.errors
            items.append(
                source_item(
                    source,
                    0,
                    f"{source} collection unavailable",
                    "",
                    str(exc),
                    metadata,
                )
            )
    return items


def write_sources(path: Path, items: Iterable[SourceItem]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for item in items:
            handle.write(json.dumps(asdict(item), sort_keys=True) + "\n")


def read_sources(path: Path) -> List[Dict[str, object]]:
    if not path.exists():
        raise SystemExit(f"Missing sources file: {path}")
    rows = []
    for line in path.read_text().splitlines():
        if line.strip():
            rows.append(json.loads(line))
    return rows


def next_source_index(items: Sequence[Dict[str, object]], source: str) -> int:
    highest = 0
    prefix = f"{source}-"
    for item in items:
        item_id = str(item.get("id", ""))
        if item_id.startswith(prefix):
            suffix = item_id[len(prefix) :]
            if suffix.isdigit():
                highest = max(highest, int(suffix))
    return highest + 1


def enriched_append_metadata(source: str, url: str, metadata: Dict[str, object]) -> Dict[str, object]:
    enriched = dict(metadata)
    if enriched.get("published_at"):
        enriched.setdefault("date", item_date(enriched["published_at"]))
    surface = str(enriched.get("surface") or enriched.get("collection_surface") or "")
    if surface == "web-search-tool":
        enriched.setdefault("discovery_only", True)
        enriched.setdefault("date_status", "known" if enriched.get("date") else "unknown")
        if source in {"reddit", "x", "tiktok"}:
            direct_kinds = {"reddit": "reddit_post", "x": "x_post", "tiktok": "tiktok_video"}
            enriched.setdefault("kind", f"{source}_discovery" if enriched.get("discovery_only") else direct_kinds[source])
            enriched.setdefault("provider", "web-search-tool")
            enriched.setdefault("provider_tier", "fallback_web_discovery")
            enriched.setdefault("collection_surface", "web-search-tool")
            enriched.setdefault("evidence_quality", "link_snippet_only" if enriched.get("discovery_only") else "opened-public-page")
    if source != "reddit" or "reddit.com/" not in url:
        return enriched
    if surface != "web-search-tool" and enriched.get("provider_tier") != REDDIT_FALLBACK_WEB_TIER:
        return enriched
    subreddit_match = re.search(r"reddit\.com/r/([^/]+)/", url)
    enriched["provider_tier"] = REDDIT_FALLBACK_WEB_TIER
    enriched.setdefault("subreddit", subreddit_match.group(1) if subreddit_match else None)
    enriched.setdefault("rank_score", 0)
    enriched.setdefault("rank_reason", "web-discovered Reddit fallback")
    return enriched


def append_source_item(
    sources_path: Path,
    source: str,
    title: str,
    url: str,
    snippet: str,
    metadata: Optional[Dict[str, object]] = None,
) -> SourceItem:
    if source not in SOURCES:
        raise SystemExit(f"Unknown source: {source}")
    normalized_metadata = enriched_append_metadata(source, url, metadata or {})
    sources_path.parent.mkdir(parents=True, exist_ok=True)
    with APPEND_LOCK:
        with sources_path.open("a+", encoding="utf-8") as handle:
            fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
            handle.seek(0)
            existing = []
            for line in handle.read().splitlines():
                if line.strip():
                    existing.append(json.loads(line))
            index = next_source_index(existing, source)
            item = source_item(source, index, title, url, snippet, metadata or {})
            item.metadata = normalized_metadata
            handle.seek(0, os.SEEK_END)
            handle.write(json.dumps(asdict(item), sort_keys=True) + "\n")
            fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
    return item


def is_unusable_item(item: Dict[str, object]) -> bool:
    metadata = item.get("metadata")
    return isinstance(metadata, dict) and bool(metadata.get("error") or metadata.get("unavailable"))


DIRECT_SOCIAL_KINDS = {"reddit_post", "reddit_comment", "x_post", "tiktok_video", "tiktok_comment"}


def build_evidence_bundle(
    plan: Plan,
    items: Sequence[Dict[str, object]],
    include_ids: Sequence[str],
) -> Dict[str, object]:
    selected_ids = unique_terms([item_id.strip() for item_id in include_ids if item_id.strip()], 500)
    if not selected_ids:
        raise SystemExit("bundle requires at least one --include evidence ID")
    by_id: Dict[str, Dict[str, object]] = {}
    duplicate_ids: List[str] = []
    for item in items:
        item_id = str(item.get("id") or "").strip()
        if not item_id:
            continue
        if item_id in by_id:
            duplicate_ids.append(item_id)
        by_id[item_id] = item
    if duplicate_ids:
        raise SystemExit(f"duplicate evidence IDs: {', '.join(sorted(set(duplicate_ids)))}")
    unknown = [item_id for item_id in selected_ids if item_id not in by_id]
    if unknown:
        raise SystemExit(f"unknown evidence IDs: {', '.join(unknown)}")

    evidence: List[Dict[str, object]] = []
    context: List[Dict[str, object]] = []
    selected_dates: List[str] = []
    selected_urls: Dict[str, str] = {}
    for item_id in selected_ids:
        item = by_id[item_id]
        if is_unusable_item(item):
            raise SystemExit(f"selected evidence is unavailable or failed: {item_id}")
        searchable = f"{item.get('title', '')} {item.get('snippet', '')}".lower()
        excluded = [term for term in plan.exclude_terms if term.lower() in searchable]
        if excluded:
            raise SystemExit(f"selected evidence {item_id} matches excluded term: {excluded[0]}")
        url = str(item.get("url") or "").strip()
        if url and url in selected_urls:
            raise SystemExit(f"selected evidence duplicates URL from {selected_urls[url]}: {item_id}")
        if url:
            selected_urls[url] = item_id
        metadata = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
        kind = str(metadata.get("kind") or "")
        discovery = bool(metadata.get("discovery_only")) or kind.endswith("_discovery")
        published = item_date(
            first_present(metadata.get("published_at"), metadata.get("created_at"), metadata.get("created_utc"), metadata.get("date"))
        )
        if published:
            selected_dates.append(published)
        if kind in DIRECT_SOCIAL_KINDS and not metadata.get("mock"):
            if not published:
                raise SystemExit(f"selected direct social evidence has no publication date: {item_id}")
            if not plan.since <= published <= plan.until:
                raise SystemExit(f"selected social evidence is outside the requested window: {item_id}")
        if discovery:
            context.append(item)
        else:
            evidence.append(item)

    selected_set = set(selected_ids)
    rejected = []
    for item in items:
        item_id = str(item.get("id") or "")
        if item_id in selected_set:
            continue
        rejected.append(
            {
                "id": item_id,
                "source": item.get("source"),
                "reason": "unavailable" if is_unusable_item(item) else "not_selected",
            }
        )

    coverage: Dict[str, Dict[str, int]] = {}
    for source in SOURCES:
        source_rows = [item for item in items if item.get("source") == source]
        coverage[source] = {
            "retrieved": len(source_rows),
            "selected_evidence": sum(1 for item in evidence if item.get("source") == source),
            "selected_context": sum(1 for item in context if item.get("source") == source),
            "unavailable": sum(1 for item in source_rows if is_unusable_item(item)),
        }

    limitations = []
    missing_selected_sources = [
        source for source in enabled_sources(plan)
        if not any(item.get("source") == source for item in evidence + context)
    ]
    if missing_selected_sources:
        limitations.append("No selected evidence from: " + ", ".join(missing_selected_sources))
    if context:
        limitations.append("Discovery-only context cannot establish time-bounded social signal.")
    if not evidence:
        limitations.append("No direct evidence was selected; return only a coverage gap or unresolved finding.")

    lane_index = {
        source: {
            "evidence_ids": [str(item.get("id")) for item in evidence if item.get("source") == source],
            "context_ids": [str(item.get("id")) for item in context if item.get("source") == source],
        }
        for source in SOURCES
        if any(item.get("source") == source for item in evidence + context)
    }
    material_lanes = [
        source for source, lane in lane_index.items()
        if lane["evidence_ids"]
    ]
    analysis_mode = "subagent-led" if len(material_lanes) > 1 else "direct"

    return {
        "bundle_version": 1,
        "question": plan.question,
        "topic": plan.topic,
        "requested_window": {"since": plan.since, "until": plan.until},
        "achieved_dates": {
            "earliest": min(selected_dates) if selected_dates else None,
            "latest": max(selected_dates) if selected_dates else None,
        },
        "evidence": evidence,
        "context": context,
        "lane_index": lane_index,
        "analysis": {
            "mode": analysis_mode,
            "material_lanes": material_lanes,
            "lead_required": analysis_mode == "subagent-led",
        },
        "coverage": coverage,
        "limitations": limitations,
        "rejected": rejected,
    }


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="pulse",
        description="Plan, collect, and bundle traceable social or market evidence.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    plan_parser = subparsers.add_parser("plan", help="Resolve the question, window, and source mix.")
    plan_parser.add_argument("question")
    plan_parser.add_argument("--depth", choices=("auto", "standard", "deep"), default="auto")
    plan_parser.add_argument("--sources", default="auto")
    plan_parser.add_argument("--days", type=int)
    plan_parser.add_argument("--topic", default="")
    plan_parser.add_argument("--exclude", action="append", default=[])

    collect_parser = subparsers.add_parser("collect", help="Collect normalized provider evidence.")
    collect_parser.add_argument("--plan", required=True)
    collect_parser.add_argument("--out", required=True)
    collect_parser.add_argument("--mock", action="store_true")

    append_parser = subparsers.add_parser("append-source", help="Append agent-retrieved public evidence.")
    append_parser.add_argument("--sources", required=True)
    append_parser.add_argument("--source", choices=SOURCES, required=True)
    append_parser.add_argument("--title", required=True)
    append_parser.add_argument("--url", required=True)
    append_parser.add_argument("--snippet", required=True)
    append_parser.add_argument("--published-at")
    evidence_mode = append_parser.add_mutually_exclusive_group()
    evidence_mode.add_argument("--discovery-only", action="store_true")
    evidence_mode.add_argument("--direct", action="store_true")
    append_parser.add_argument("--metadata-json", default="{}")

    bundle_parser = subparsers.add_parser("bundle", help="Create the reviewed synthesis boundary.")
    bundle_parser.add_argument("--plan", required=True)
    bundle_parser.add_argument("--sources", required=True)
    bundle_parser.add_argument("--include", required=True)
    bundle_parser.add_argument("--out")

    diagnose_parser = subparsers.add_parser("diagnose", help="Inspect provider configuration.")
    diagnose_parser.add_argument("--live", action="store_true", help="Perform bounded live provider probes.")

    readiness_parser = subparsers.add_parser("readiness", help="Require direct provider usability.")
    readiness_parser.add_argument(
        "--require",
        default="reddit,x,polymarket",
        help="Comma-separated sources that must be live-usable. Default: reddit,x,polymarket.",
    )

    args = parser.parse_args(argv)

    if args.command == "plan":
        plan = build_plan(
            args.question,
            args.depth,
            args.sources,
            args.days,
            topic=args.topic,
            exclude_terms=args.exclude,
        )
        print(json.dumps(plan_to_dict(plan), indent=2, sort_keys=True))
        return 0
    if args.command == "collect":
        plan = load_plan(Path(args.plan))
        write_sources(Path(args.out), mock_items(plan) if args.mock else live_items(plan))
        return 0
    if args.command == "append-source":
        try:
            metadata = json.loads(args.metadata_json)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"Invalid --metadata-json: {exc}") from exc
        if not isinstance(metadata, dict):
            raise SystemExit("--metadata-json must decode to an object")
        if args.published_at:
            metadata["published_at"] = args.published_at
        if args.discovery_only:
            metadata["discovery_only"] = True
        elif args.direct:
            metadata["discovery_only"] = False
        item = append_source_item(Path(args.sources), args.source, args.title, args.url, args.snippet, metadata)
        print(json.dumps(asdict(item), indent=2, sort_keys=True))
        return 0
    if args.command == "bundle":
        result = build_evidence_bundle(
            load_plan(Path(args.plan)),
            read_sources(Path(args.sources)),
            args.include.split(","),
        )
        payload = json.dumps(result, indent=2, sort_keys=True) + "\n"
        if args.out:
            output_path = Path(args.out)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(payload, encoding="utf-8")
        print(payload, end="")
        return 0
    if args.command == "diagnose":
        print(json.dumps(provider_status(live_check=args.live), indent=2, sort_keys=True))
        return 0
    if args.command == "readiness":
        result = readiness_report(parse_required_sources(args.require))
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["ok"] else 1
    raise AssertionError(args.command)


if __name__ == "__main__":
    raise SystemExit(main())
