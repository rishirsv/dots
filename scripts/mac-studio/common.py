"""Read-only command helpers. Never invoke a shell or elevate privileges."""
import json
import subprocess


def collect(commands, execute=False, runner=subprocess.run):
    result = []
    for label, argv in commands:
        row = {'check': label, 'command': argv, 'state': 'planned'}
        if execute:
            try:
                proc = runner(argv, capture_output=True, text=True, timeout=20, check=False)
                row.update(state='observed' if proc.returncode == 0 else 'unknown',
                           exit_code=proc.returncode, output=proc.stdout.strip())
                # Never publish stderr: helpers can include user paths or account details.
            except (OSError, subprocess.TimeoutExpired):
                row.update(state='unknown', output='Unavailable or timed out; verify manually.')
        result.append(row)
    return result


def emit(result):
    print(json.dumps(result, indent=2))
