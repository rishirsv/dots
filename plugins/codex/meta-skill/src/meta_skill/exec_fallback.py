"""Narrow codex exec fallback runner."""

import subprocess


def exec_run(trial, prompt, candidate_info, event_path, output_path, model=None):
    cmd = [
        "codex",
        "exec",
        "--json",
        "--cd",
        candidate_info["cwd"],
        "--sandbox",
        "workspace-write",
        "--skip-git-repo-check",
        "--output-last-message",
        str(output_path),
    ]
    if model:
        cmd.extend(["--model", model])
    cmd.append("-")
    event_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(cmd, input=prompt, capture_output=True, text=True)
    event_path.write_text(proc.stdout)
    if proc.returncode and not output_path.exists():
        output_path.write_text("")
    return {
        "status": "completed" if proc.returncode == 0 else "failed",
        "returncode": proc.returncode,
        "stderr": proc.stderr[-2000:] if proc.returncode and proc.stderr else "",
        "final_response_chars": len(output_path.read_text()) if output_path.exists() else 0,
    }

