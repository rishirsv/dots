"""Local HTTP server for the calibration review workbench.

Binds 127.0.0.1 only. Serves app.html plus a small JSON API over the
workbench filesystem. Never makes external requests.
"""

import json
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from ..errors import CliError
from ..grading import record_human_grade
from ..ids import utc_now
from ..io import append_jsonl, read_json, read_jsonl
from .queue import build_queue, is_recorded_human_grade

APP_PATH = Path(__file__).with_name("app.html")
ANNOTATION_TAGS = {"taste-rule", "one-off", "task-defect", "grader-defect"}
ANNOTATION_ARTIFACTS = {"response", "transcript", "task"}
GRADE_LABELS = {"pass", "partial", "fail", "unknown"}
TRANSCRIPT_MAX_ITEMS = 120
TRANSCRIPT_MAX_CHARS = 400
FILE_READ_LIMIT = 60000


def _read_text(path, limit=FILE_READ_LIMIT):
    path = Path(path)
    if not path.exists():
        return None
    return path.read_text(errors="replace")[:limit]


def _event_text(payload):
    if isinstance(payload, str):
        return payload
    if not isinstance(payload, dict):
        return ""
    item = payload.get("item")
    if isinstance(item, dict):
        for key in ("text", "command", "output", "name", "type"):
            value = item.get(key)
            if isinstance(value, str) and value.strip():
                return value
        if isinstance(item.get("command"), list):
            return " ".join(str(part) for part in item["command"])
    for key in ("text", "message", "delta"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value
    return json.dumps(payload, sort_keys=True)[:TRANSCRIPT_MAX_CHARS]


def transcript_digest(events_path):
    """Readable digest of events.jsonl: item completions and tool calls, capped."""
    if not events_path or not Path(events_path).exists():
        return {"total": 0, "shown": 0, "items": []}
    total = 0
    items = []
    for line in Path(events_path).read_text(errors="replace").splitlines():
        if not line.strip():
            continue
        total += 1
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        method = str(row.get("method") or "event")
        if "delta" in method:
            continue
        if len(items) < TRANSCRIPT_MAX_ITEMS:
            items.append({"method": method, "text": _event_text(row.get("payload"))[:TRANSCRIPT_MAX_CHARS]})
    return {"total": total, "shown": len(items), "items": items}


def _judge_guidance(case_dir):
    judge_text = _read_text(case_dir / "judge.md")
    if judge_text is not None:
        return {"source": "judge.md", "hidden_from_agent": True, "text": judge_text, "expectations": []}
    expectations = []
    expectations_path = case_dir / "expectations.json"
    if expectations_path.exists():
        try:
            parsed = json.loads(expectations_path.read_text())
            if isinstance(parsed, list):
                expectations = [str(item) for item in parsed]
        except json.JSONDecodeError:
            pass
    return {"source": "expectations", "hidden_from_agent": True, "text": None, "expectations": expectations}


def _expected_files(case_dir):
    if not case_dir.is_dir():
        return []
    return [
        {"name": path.name, "content": _read_text(path, limit=20000)}
        for path in sorted(case_dir.glob("expected.*"))
        if path.is_file()
    ]


def build_trial_packet(run_dir, trial_id):
    run = read_json(run_dir / "run.json")
    results = {row.get("trial_id"): row for row in read_jsonl(run_dir / "results.jsonl")}
    result = results.get(trial_id)
    if result is None:
        result = next((row for row in run.get("trials", []) if row.get("trial_id") == trial_id), None)
    if result is None:
        raise CliError(f"trial not found in run: {trial_id}", 2)
    case_id = result.get("case_id") or ""
    cases_root = (run_dir / "inputs" / "cases").resolve()
    case_dir = (cases_root / case_id).resolve()
    if case_dir.parent != cases_root:
        raise CliError(f"invalid case id: {case_id}", 2)
    trials_root = (run_dir / "trials").resolve()
    trial_dir = (trials_root / trial_id).resolve()
    if trial_dir.parent != trials_root:
        raise CliError(f"invalid trial id: {trial_id}", 2)

    grade_rows = [row for row in read_jsonl(run_dir / "grades.jsonl") if row.get("trial_id") == trial_id]
    judge_rows = [row for row in grade_rows if (row.get("grader") or {}).get("kind") == "model"]
    other_rows = [row for row in grade_rows if (row.get("grader") or {}).get("kind") != "model"]
    annotations = [row for row in read_jsonl(run_dir / "annotations.jsonl") if row.get("trial_id") == trial_id]

    events_path = result.get("events_path") or (trial_dir / "events.jsonl")
    response_path = result.get("response_path") or (trial_dir / "response.md")
    return {
        "run_id": run.get("run_id") or run_dir.name,
        "trial_id": trial_id,
        "case_id": case_id,
        "candidate": result.get("candidate"),
        "repetition": result.get("repetition"),
        "runtime_status": result.get("runtime_status"),
        "task": _read_text(case_dir / "task.md"),
        "response": _read_text(response_path),
        "transcript": transcript_digest(events_path),
        "judge_guidance": _judge_guidance(case_dir),
        "expected": _expected_files(case_dir),
        "grades": other_rows,
        "annotations": annotations,
        "human_recorded": any(is_recorded_human_grade(row) for row in other_rows),
        # Hidden until the reviewer commits a grade; the client must not
        # render anything under this key before commit.
        "judge": {"grades": judge_rows},
    }


class _Handler(BaseHTTPRequestHandler):
    server_version = "meta-skill-review"
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):  # keep the terminal quiet
        pass

    # -- helpers ----------------------------------------------------------

    def _send_json(self, data, status=200):
        body = json.dumps(data, sort_keys=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _send_error_json(self, message, status=400):
        self._send_json({"ok": False, "error": message}, status=status)

    def _run_dir(self, run_id):
        if not run_id:
            raise CliError("run is required", 2)
        runs_root = (self.server.workbench / "runs").resolve()
        candidate = (runs_root / run_id).resolve()
        if candidate.parent != runs_root or not (candidate / "run.json").exists():
            raise CliError(f"run not found: {run_id}", 2)
        return candidate

    def _query_run(self, query):
        return (query.get("run") or [self.server.default_run or ""])[0]

    def _read_body(self):
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b""
        try:
            data = json.loads(raw.decode("utf-8") or "{}")
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise CliError("request body must be valid JSON", 2)
        if not isinstance(data, dict):
            raise CliError("request body must be a JSON object", 2)
        return data

    # -- routes -----------------------------------------------------------

    def do_GET(self):
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.split("/") if part]
        query = parse_qs(parsed.query)
        try:
            if not parts:
                return self._serve_app()
            if parts == ["api", "runs"]:
                return self._send_json({"runs": self._list_runs(), "default_run": self.server.default_run})
            if len(parts) == 4 and parts[:2] == ["api", "runs"] and parts[3] == "queue":
                run_dir = self._run_dir(parts[2])
                return self._send_json({"run_id": parts[2], "queue": build_queue(run_dir)})
            if len(parts) == 3 and parts[:2] == ["api", "trials"]:
                run_dir = self._run_dir(self._query_run(query))
                return self._send_json(build_trial_packet(run_dir, parts[2]))
            if parts == ["api", "calibration"]:
                return self._calibration(query)
            return self._send_error_json("not found", status=404)
        except CliError as exc:
            return self._send_error_json(exc.message, status=400)

    def do_POST(self):
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.split("/") if part]
        try:
            body = self._read_body()
            if parts == ["api", "grades"]:
                return self._post_grade(body)
            if parts == ["api", "annotations"]:
                return self._post_annotation(body)
            return self._send_error_json("not found", status=404)
        except CliError as exc:
            return self._send_error_json(exc.message, status=400)

    # -- handlers ---------------------------------------------------------

    def _serve_app(self):
        body = APP_PATH.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _list_runs(self):
        runs_root = self.server.workbench / "runs"
        runs = []
        if not runs_root.is_dir():
            return runs
        for run_dir in sorted(runs_root.iterdir()):
            if not (run_dir / "run.json").exists():
                continue
            try:
                run = read_json(run_dir / "run.json")
            except CliError:
                continue
            results = read_jsonl(run_dir / "results.jsonl")
            grades = read_jsonl(run_dir / "grades.jsonl")
            runs.append(
                {
                    "run_id": run.get("run_id") or run_dir.name,
                    "created_at": run.get("created_at"),
                    "planned_trials": len(run.get("trials", [])),
                    "results": len(results),
                    "grades": len(grades),
                    "has_summary": (run_dir / "summary.json").exists(),
                }
            )
        return runs

    def _calibration(self, query):
        run_dir = self._run_dir(self._query_run(query))
        metric = (query.get("metric") or [None])[0] or None
        try:
            from ..calibration import agreement_summary
        except ImportError:
            return self._send_error_json("calibration module unavailable in this build; update meta-skill and retry", status=503)
        rows = read_jsonl(run_dir / "grades.jsonl")
        model_rows = [row for row in rows if (row.get("grader") or {}).get("kind") == "model"]
        human_rows = [row for row in rows if (row.get("grader") or {}).get("kind") == "human"]
        result = agreement_summary(model_rows, human_rows, metric)
        return self._send_json({"run_id": run_dir.name, "metric": metric, **result})

    def _post_grade(self, body):
        run_dir = self._run_dir(str(body.get("run") or self.server.default_run or ""))
        trial_id = str(body.get("trial_id") or "")
        trials_root = (run_dir / "trials").resolve()
        if (trials_root / trial_id).resolve().parent != trials_root:
            raise CliError(f"invalid trial id: {trial_id}", 2)
        label = str(body.get("label") or "")
        if label not in GRADE_LABELS:
            raise CliError(f"label must be one of {', '.join(sorted(GRADE_LABELS))}", 2)
        score = body.get("score")
        if score is not None and not isinstance(score, (int, float)):
            raise CliError("score must be a number between 0 and 1", 2)
        with self.server.write_lock:
            result = record_human_grade(
                str(run_dir),
                trial_id=trial_id,
                grader_id=str(body.get("grader_id") or "human-review"),
                metric=str(body.get("metric") or ""),
                label=label,
                score=score,
                rationale=str(body.get("rationale") or ""),
                reviewer=(str(body["reviewer"]) if body.get("reviewer") else None),
            )
        return self._send_json({"ok": True, "grade": result["grade"]})

    def _post_annotation(self, body):
        run_dir = self._run_dir(str(body.get("run") or self.server.default_run or ""))
        trial_id = str(body.get("trial_id") or "")
        trials_root = (run_dir / "trials").resolve()
        if not trial_id or (trials_root / trial_id).resolve().parent != trials_root:
            raise CliError(f"invalid trial id: {trial_id}", 2)
        artifact = body.get("artifact")
        if artifact not in ANNOTATION_ARTIFACTS:
            raise CliError(f"artifact must be one of {', '.join(sorted(ANNOTATION_ARTIFACTS))}", 2)
        tag = body.get("tag")
        if tag not in ANNOTATION_TAGS:
            raise CliError(f"tag must be one of {', '.join(sorted(ANNOTATION_TAGS))}", 2)
        note = str(body.get("note") or "").strip()
        if not note:
            raise CliError("note is required", 2)
        span = body.get("span")
        if not isinstance(span, dict) or not isinstance(span.get("quote"), str):
            raise CliError("span must be an object with start, end, and quote", 2)
        row = {
            "trial_id": trial_id,
            "artifact": artifact,
            "span": {
                "start": int(span.get("start") or 0),
                "end": int(span.get("end") or 0),
                "quote": span["quote"][:2000],
            },
            "note": note,
            "tag": tag,
            "timestamp": utc_now(),
        }
        if body.get("reviewer"):
            row["reviewer"] = str(body["reviewer"])
        with self.server.write_lock:
            append_jsonl(run_dir / "annotations.jsonl", row)
        return self._send_json({"ok": True, "annotation": row})


def create_server(workbench, run=None, port=7333):
    """Build the review server (bound to 127.0.0.1) without serving."""
    workbench = Path(workbench).expanduser().resolve()
    if not workbench.is_dir():
        raise CliError(f"workbench not found: {workbench}", 2)
    server = ThreadingHTTPServer(("127.0.0.1", port), _Handler)
    server.workbench = workbench
    server.default_run = run
    server.write_lock = threading.Lock()
    return server


def run_review_server(workbench, run=None, port=7333, open_browser=False):
    """Serve the review workbench until interrupted."""
    server = create_server(workbench, run=run, port=port)
    url = f"http://127.0.0.1:{server.server_address[1]}/"
    print(f"review server listening at {url} (ctrl-c to stop)")
    if open_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
