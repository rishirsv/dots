---
name: portal-terminal
description: Run builds, tests and interactive commands using Portal’s sandboxed execution-only Codex adapter and durable jobs.
version: 0.1.0
capabilities: ["terminal.exec", "jobs.output"]
---

# portal-terminal

Use `exec_command` for one explicit argv command. An argv array is not a shell string. For pipelines or shell syntax, deliberately request a shell such as `["/bin/zsh", "-c", "..."]`; no login shell or startup-file access is implied. Environment overrides are restricted and cannot change credential, loader or Portal control settings.

Command availability depends on qualification of the exact local Codex binary, schemas and sandbox behavior. `EXECUTOR_UPGRADE_REQUIRED` is a real release gate. Do not switch to `process/spawn`, a raw RPC method, a model turn or an unrestricted subprocess. Portal does not invoke inference to execute a command.

Choose the narrowest execution profile. A writable workspace does not make a command read-only merely because its text looks harmless. Explicit read-only execution must use the actual sandbox. Network access is a separate locally approved capability and may cause external effects. Root grants and toolchain permissions cannot be expanded by command arguments.

A returned job ID means durable admission, not successful completion. Keep the job and operation IDs. Read output with `read_output`, retaining its next cursor. Two readers can use the same cursor without consuming one another’s output. Omitted ranges identify retained-output eviction; they are not empty output. A nonzero exit code is a completed command outcome, not a broken transport.

Use `write_stdin` only for actual input or EOF. For interactive work, request a real PTY and use the discovered `terminal.resize` operation when needed. Do not pretend pipes with a TERM variable are a PTY. Short tool-yield deadlines are distinct from the command’s hard deadline.

Cancellation persists intent before requesting termination. Inspect whether termination is confirmed, particularly after an executor crash or sleep. Unknown descendant quiescence keeps writer ownership blocked. Agent or transport restart is not permission to start a duplicate command. Recover the existing operation first.

Apple-development work may need locally approved SDK, DerivedData and cache roots. Baseline tests must not sign, publish, upload builds or use production credentials. Finish by reporting the actual exit, retained evidence and any unverified Mac-specific behavior.

Read the relevant reference below only when that topic applies.
- [jobs.md](references/jobs.md)
- [shell-and-env.md](references/shell-and-env.md)
- [apple-development.md](references/apple-development.md)
