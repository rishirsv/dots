from pathlib import Path
import sys

root = Path(__file__).resolve().parent
runbook = root / "out" / "runbook.md"
session_root = root / ".autoresearch"
errors = []

if not runbook.exists():
    errors.append("Missing out/runbook.md")
else:
    text = runbook.read_text().strip()
    for heading in ["# Summary", "# Immediate Checks", "# Escalation"]:
        if heading not in text:
            errors.append(f"Missing heading: {heading}")
    words = text.split()
    if len(words) >= 170:
        errors.append(f"Runbook exceeds word limit: {len(words)} words")
    lower = text.lower()
    if "nightly import job" not in lower:
        errors.append("Runbook does not mention the nightly import job")
    if "crm" not in lower:
        errors.append("Runbook does not mention the CRM source system")
    if "2026-04-18 02:14 utc" not in lower:
        errors.append("Runbook does not mention the last successful run timestamp")
    forbidden = ["slack", "pagerduty", "airflow", "datadog", "snowflake", "dbt"]
    for token in forbidden:
        if token in lower:
            errors.append(f"Runbook drifted into unrelated tooling: {token}")

expected_files = [
    session_root / "session.md",
    session_root / "verify.md",
    session_root / "config.json",
]
for file_path in expected_files:
    if not file_path.exists():
        errors.append(f"Missing session artifact: {file_path.relative_to(root)}")

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("autoresearch benchmark verification passed")
