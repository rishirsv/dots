#!/usr/bin/env python3
"""
Fetch SEC company facts + recent filing index and build slide-ready CSVs.

Usage:
  python3 testing/scripts/fetch_sec_data.py --ticker AAPL --out-dir testing/data/sec
  python3 testing/scripts/fetch_sec_data.py --ticker AAPL --ticker SBUX --ticker CAT --out-dir testing/data/sec
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any

SEC_BASE = "https://data.sec.gov"
TICKER_INDEX_URL = "https://www.sec.gov/files/company_tickers.json"

ANNUAL_FORMS = {"10-K", "20-F", "40-F"}
QUARTERLY_FORMS = {"10-Q"}
FILING_FORMS = {"10-K", "10-Q", "8-K"}

METRIC_TAG_CANDIDATES = {
    "revenue": [
        "Revenues",
        "RevenueFromContractWithCustomerExcludingAssessedTax",
        "SalesRevenueNet",
    ],
    "gross_profit": ["GrossProfit"],
    "operating_income": ["OperatingIncomeLoss"],
    "net_income": ["NetIncomeLoss"],
    "assets": ["Assets"],
    "liabilities": ["Liabilities"],
    "equity": ["StockholdersEquity"],
    "operating_cash_flow": ["NetCashProvidedByUsedInOperatingActivities"],
    "diluted_shares": ["WeightedAverageNumberOfDilutedSharesOutstanding"],
}

METRIC_UNIT_PREFERENCE = {
    "revenue": ["USD"],
    "gross_profit": ["USD"],
    "operating_income": ["USD"],
    "net_income": ["USD"],
    "assets": ["USD"],
    "liabilities": ["USD"],
    "equity": ["USD"],
    "operating_cash_flow": ["USD"],
    "diluted_shares": ["shares"],
}


def sec_headers() -> dict[str, str]:
    ua = os.environ.get("SEC_USER_AGENT", "kpmg-slidegen-testing/1.0 (ops@example.com)")
    return {
        "User-Agent": ua,
        "Accept": "application/json",
    }


def fetch_json(url: str) -> dict[str, Any]:
    req = urllib.request.Request(url, headers=sec_headers())
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    return json.loads(data.decode("utf-8"))


def load_ticker_index() -> dict[str, dict[str, Any]]:
    raw = fetch_json(TICKER_INDEX_URL)
    out: dict[str, dict[str, Any]] = {}
    for _, item in raw.items():
        ticker = str(item.get("ticker", "")).upper().strip()
        if ticker:
            out[ticker] = item
    return out


def cik10(cik: int | str) -> str:
    return f"{int(cik):010d}"


def pick_tag_and_unit(facts: dict[str, Any], metric: str) -> tuple[str, str] | tuple[None, None]:
    us_gaap = facts.get("facts", {}).get("us-gaap", {})
    for tag in METRIC_TAG_CANDIDATES[metric]:
        entry = us_gaap.get(tag)
        if not entry:
            continue
        units = entry.get("units", {})
        for unit in METRIC_UNIT_PREFERENCE[metric]:
            if unit in units:
                return tag, unit
        # fallback to first available unit
        if units:
            first = next(iter(units.keys()))
            return tag, first
    return None, None


def latest_points(points: list[dict[str, Any]], *, annual: bool) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str], dict[str, Any]] = {}
    for p in points:
        form = str(p.get("form", ""))
        fp = str(p.get("fp", ""))
        fy = str(p.get("fy", ""))
        if not fy:
            continue
        if annual:
            if form not in ANNUAL_FORMS and fp != "FY":
                continue
            key = (fy, "FY")
        else:
            if form not in QUARTERLY_FORMS:
                continue
            if fp not in {"Q1", "Q2", "Q3", "Q4"}:
                continue
            key = (fy, fp)
        prev = grouped.get(key)
        if not prev or str(p.get("filed", "")) > str(prev.get("filed", "")):
            grouped[key] = p
    if annual:
        return [grouped[k] for k in sorted(grouped.keys(), key=lambda x: int(x[0]))]
    return [grouped[k] for k in sorted(grouped.keys(), key=lambda x: (int(x[0]), x[1]))]


def build_metric_rows(
    companyfacts: dict[str, Any], *, annual: bool, recent_years: int
) -> tuple[list[str], list[dict[str, Any]]]:
    # key -> row fields
    rows: dict[tuple[str, str], dict[str, Any]] = {}
    sources: dict[str, str] = {}

    for metric in METRIC_TAG_CANDIDATES:
        tag, unit = pick_tag_and_unit(companyfacts, metric)
        if not tag or not unit:
            continue
        sources[metric] = f"us-gaap:{tag} [{unit}]"
        points = (
            companyfacts.get("facts", {})
            .get("us-gaap", {})
            .get(tag, {})
            .get("units", {})
            .get(unit, [])
        )
        selected = latest_points(points, annual=annual)
        for p in selected:
            fy = str(p.get("fy", ""))
            fp = "FY" if annual else str(p.get("fp", ""))
            key = (fy, fp)
            row = rows.setdefault(
                key,
                {
                    "fiscal_year": fy,
                    "fiscal_period": fp,
                    "end": str(p.get("end", "")),
                    "filed": str(p.get("filed", "")),
                    "form": str(p.get("form", "")),
                },
            )
            row[metric] = p.get("val")
            # keep latest meta values
            if str(p.get("filed", "")) > str(row.get("filed", "")):
                row["end"] = str(p.get("end", ""))
                row["filed"] = str(p.get("filed", ""))
                row["form"] = str(p.get("form", ""))

    fields = [
        "fiscal_year",
        "fiscal_period",
        "end",
        "filed",
        "form",
        "revenue",
        "gross_profit",
        "operating_income",
        "net_income",
        "assets",
        "liabilities",
        "equity",
        "operating_cash_flow",
        "diluted_shares",
    ]

    ordered_keys = sorted(rows.keys(), key=lambda x: (int(x[0]), x[1]))
    if ordered_keys and recent_years > 0:
        max_year = max(int(y) for y, _ in ordered_keys)
        min_year = max_year - recent_years + 1
        ordered_keys = [k for k in ordered_keys if int(k[0]) >= min_year]
    return fields + ["metric_sources"], [
        {
            **{k: rows[key].get(k, "") for k in fields},
            "metric_sources": "; ".join(f"{m}:{s}" for m, s in sorted(sources.items())),
        }
        for key in ordered_keys
    ]


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def build_recent_filings(submissions: dict[str, Any], cik: str) -> list[dict[str, Any]]:
    recent = submissions.get("filings", {}).get("recent", {})
    forms = recent.get("form", [])
    dates = recent.get("filingDate", [])
    accession = recent.get("accessionNumber", [])
    reports = recent.get("reportDate", [])
    docs = recent.get("primaryDocument", [])

    out: list[dict[str, Any]] = []
    n = min(len(forms), len(dates), len(accession), len(reports), len(docs))
    for i in range(n):
        form = str(forms[i])
        if form not in FILING_FORMS:
            continue
        acc = str(accession[i])
        acc_nodash = acc.replace("-", "")
        primary = str(docs[i])
        filing_url = f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc_nodash}/{primary}"
        out.append(
            {
                "filing_date": str(dates[i]),
                "report_date": str(reports[i]),
                "form": form,
                "accession_number": acc,
                "primary_document": primary,
                "filing_url": filing_url,
            }
        )

    out.sort(key=lambda x: x["filing_date"], reverse=True)
    return out


def process_ticker(
    ticker: str,
    out_root: Path,
    index: dict[str, dict[str, Any]],
    *,
    recent_years: int,
    save_raw: bool,
) -> None:
    t = ticker.upper()
    if t not in index:
        raise SystemExit(f"Ticker not found in SEC index: {t}")

    cik = cik10(index[t]["cik_str"])
    company_name = index[t].get("title", t)

    submissions_url = f"{SEC_BASE}/submissions/CIK{cik}.json"
    companyfacts_url = f"{SEC_BASE}/api/xbrl/companyfacts/CIK{cik}.json"

    submissions = fetch_json(submissions_url)
    time.sleep(0.15)
    companyfacts = fetch_json(companyfacts_url)

    base = out_root / t
    base.mkdir(parents=True, exist_ok=True)

    if not save_raw:
        for stale in ("raw_submissions.json", "raw_companyfacts.json"):
            p = base / stale
            if p.exists():
                p.unlink()

    if save_raw:
        # Raw snapshots for transparency/repro.
        (base / "raw_submissions.json").write_text(
            json.dumps(submissions, indent=2), encoding="utf-8"
        )
        (base / "raw_companyfacts.json").write_text(
            json.dumps(companyfacts, indent=2), encoding="utf-8"
        )

    annual_fields, annual_rows = build_metric_rows(
        companyfacts, annual=True, recent_years=recent_years
    )
    q_fields, q_rows = build_metric_rows(
        companyfacts, annual=False, recent_years=recent_years
    )
    write_csv(base / "annual_metrics.csv", annual_fields, annual_rows)
    write_csv(base / "quarterly_metrics.csv", q_fields, q_rows)

    filings_rows = build_recent_filings(submissions, cik)
    write_csv(
        base / "recent_filings.csv",
        ["filing_date", "report_date", "form", "accession_number", "primary_document", "filing_url"],
        filings_rows,
    )

    metadata = {
        "ticker": t,
        "company_name": company_name,
        "cik": cik,
        "generated_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source_urls": {
            "submissions": submissions_url,
            "companyfacts": companyfacts_url,
            "ticker_index": TICKER_INDEX_URL,
        },
        "files": [
            "annual_metrics.csv",
            "quarterly_metrics.csv",
            "recent_filings.csv",
        ],
    }
    if save_raw:
        metadata["files"].extend(["raw_submissions.json", "raw_companyfacts.json"])
    (base / "README.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    print(f"Built SEC sample data for {t} -> {base}")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Fetch SEC filing + companyfacts sample data for testing")
    p.add_argument(
        "--ticker",
        action="append",
        required=True,
        help="Ticker symbol (repeatable), e.g. --ticker AAPL --ticker SBUX",
    )
    p.add_argument("--out-dir", default="testing/data/sec", help="Output root directory")
    p.add_argument(
        "--recent-years",
        type=int,
        default=6,
        help="Keep only the most recent N fiscal years in annual/quarterly CSVs",
    )
    p.add_argument(
        "--save-raw",
        action="store_true",
        help="Also save raw SEC JSON payloads (larger on disk)",
    )
    return p.parse_args()


def main() -> int:
    args = parse_args()
    out_root = Path(args.out_dir)

    try:
        ticker_index = load_ticker_index()
    except urllib.error.URLError as e:
        print(f"Failed to fetch SEC ticker index: {e}", file=sys.stderr)
        return 1

    for ticker in args.ticker:
        try:
            process_ticker(
                ticker,
                out_root,
                ticker_index,
                recent_years=args.recent_years,
                save_raw=args.save_raw,
            )
        except Exception as e:  # pragma: no cover - CLI script
            print(f"Failed ticker {ticker}: {e}", file=sys.stderr)
            return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
