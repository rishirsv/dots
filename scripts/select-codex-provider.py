#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["tomlkit==0.13.3"]
# ///
"""Select native GPT or the local Claude/Muse proxy for new Codex chats."""

import argparse
import os
from pathlib import Path
import tempfile

import tomlkit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("provider", choices=("openai", "proxy"))
    parser.add_argument("--fast", action="store_true", help="use GPT Fast mode (openai only)")
    args = parser.parse_args()
    if args.fast and args.provider != "openai":
        parser.error("Fast mode is available here only with native OpenAI models")

    home = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
    config = home / "config.toml"
    document = tomlkit.parse(config.read_text())
    if args.provider == "proxy":
        if "cliproxyapi" not in document.get("model_providers", {}):
            parser.error("run scripts/setup-cliproxy.py first")
        if not (home / "cliproxy-models.json").is_file():
            parser.error("proxy model catalog is missing; run scripts/sync-configs.sh --codex")
        document["model"] = "claude-opus-5-5"
        document["model_provider"] = "cliproxyapi"
        document["model_catalog_json"] = "cliproxy-models.json"
        document["service_tier"] = "default"
    else:
        document["model"] = "gpt-6-astra"
        document["model_provider"] = "openai"
        document.pop("model_catalog_json", None)
        document["service_tier"] = "fast" if args.fast else "default"
        if args.fast:
            if "features" not in document:
                document["features"] = tomlkit.table()
            document["features"]["fast_mode"] = True

    descriptor, temporary_name = tempfile.mkstemp(prefix=".config-", dir=home)
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, "w") as output:
            output.write(tomlkit.dumps(document))
        os.replace(temporary_name, config)
    finally:
        if os.path.exists(temporary_name):
            os.unlink(temporary_name)
    print("Selected", args.provider, "for new Codex chats; restart the desktop app if it keeps the old catalog")


if __name__ == "__main__":
    main()
