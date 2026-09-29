#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["Pillow>=11,<13"]
# ///
"""Forward CLIProxyAPI requests, sizing Claude images for long conversations."""

import argparse
import base64
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
import json
from pathlib import Path
import subprocess
import sys
from threading import Lock
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from PIL import Image


MAX_EDGE = 2000
HOP_HEADERS = {"connection", "content-length", "host", "transfer-encoding", "accept-encoding"}
CLAUDE_AUTH_LOCK = Lock()


def claude_token_expiring():
    path = Path.home() / ".cli-proxy-api" / "claude-from-cli.json"
    try:
        expiry = json.loads(path.read_text())["expired"]
        return datetime.fromisoformat(expiry.replace("Z", "+00:00")) <= datetime.now(timezone.utc) + timedelta(minutes=5)
    except (OSError, KeyError, ValueError):
        return True


def ensure_claude_auth():
    if not claude_token_expiring():
        return
    with CLAUDE_AUTH_LOCK:
        if not claude_token_expiring():
            return
        helper = Path.home() / ".local" / "bin" / "cliproxy-sync-claude-token"
        subprocess.run(
            [sys.executable, str(helper), "--refresh"],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=100,
        )


def resize_data_url(value):
    if not isinstance(value, str) or not value.startswith("data:image/"):
        return value
    header, separator, encoded = value.partition(",")
    if not separator or not header.endswith(";base64"):
        return value
    raw = base64.b64decode(encoded)
    with Image.open(BytesIO(raw)) as image:
        if max(image.size) <= MAX_EDGE:
            return value
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        output = BytesIO()
        image.save(output, format=image.format)
    return header + "," + base64.b64encode(output.getvalue()).decode("ascii")


def resize_images(value):
    if isinstance(value, dict):
        return {key: resize_images(item) for key, item in value.items()}
    if isinstance(value, list):
        return [resize_images(item) for item in value]
    return resize_data_url(value)


def prepare_body(body, path):
    if path.split("?", 1)[0] != "/v1/responses":
        return body
    payload = json.loads(body)
    if not str(payload.get("model", "")).startswith("claude-"):
        return body
    return json.dumps(resize_images(payload), separators=(",", ":")).encode("utf-8")


class GuardHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.0"
    upstream_port = 8318

    def log_message(self, *_args):
        pass

    def do_GET(self):
        self.forward()

    def do_POST(self):
        self.forward()

    def forward(self):
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length) if length else None
        try:
            if body is not None:
                is_claude = self.path.split("?", 1)[0] == "/v1/responses" and str(
                    json.loads(body).get("model", "")
                ).startswith("claude-")
                if is_claude:
                    ensure_claude_auth()
                body = prepare_body(body, self.path)
            headers = {key: value for key, value in self.headers.items() if key.lower() not in HOP_HEADERS}
            headers["Accept-Encoding"] = "identity"
            request = Request(
                f"http://127.0.0.1:{self.upstream_port}{self.path}",
                data=body,
                headers=headers,
                method=self.command,
            )
            try:
                response = urlopen(request, timeout=600)
            except HTTPError as error:
                response = error
            with response:
                self.send_response(response.status)
                for key, value in response.headers.items():
                    if key.lower() not in HOP_HEADERS:
                        self.send_header(key, value)
                self.end_headers()
                while chunk := response.read1(65536):
                    self.wfile.write(chunk)
                    self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        except (OSError, URLError, ValueError, subprocess.CalledProcessError, subprocess.TimeoutExpired) as error:
            self.send_error(502, "Local model proxy error")
            print(f"Image guard request failed: {type(error).__name__}", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--listen-port", type=int, default=8317)
    parser.add_argument("--upstream-port", type=int, default=8318)
    args = parser.parse_args()
    GuardHandler.upstream_port = args.upstream_port
    server = ThreadingHTTPServer(("127.0.0.1", args.listen_port), GuardHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
