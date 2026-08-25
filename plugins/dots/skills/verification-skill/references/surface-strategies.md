# Surface strategies

Read only the rows that match the repository. Existing supported harnesses take
precedence over these defaults.

| Surface | Prefer for driving | Useful proof | Isolation |
| --- | --- | --- | --- |
| Web UI | Existing browser tests or semantic browser automation | Accessibility snapshot, screenshot, resulting URL and persisted state | Port, browser profile, account, data store |
| Desktop UI | Existing UI harness or accessibility automation; browser tooling for Electron when supported | Window identity, accessibility state, screenshot, files or records changed | App profile, data directory, process identity |
| Mobile app | Existing simulator or device build-and-drive tooling | App state before and after, screenshot, logs, persisted model or service state | Simulator/device, app container, account |
| CLI or TUI | Existing integration harness, isolated PTY, or terminal session | Command, stdout, stderr, exit status, files or records changed | Working directory, environment, config and data paths |
| HTTP service | Existing integration client or explicit HTTP requests | Request and response, logs, durable state read through a public or read-only path | Port, namespace, database or tenant |
| Library | Public API exercised through the repository's test or example harness | Inputs, returned values, emitted state, public error behavior | Process, fixture, temporary directory |

## Selection rules

- Prefer semantic handles over coordinates and fixed sleeps.
- Prefer a production entry point over direct mutation of internal state.
- Use the smallest harness that can prove the user-visible contract and its
  material side effects.
- Do not create a generic wrapper merely to normalize different surfaces. Keep
  each surface's native controls visible in the generated skill.
- When several surfaces expose the same feature, map and prove each meaningful
  entry point rather than treating them as interchangeable.
- When isolation is impossible, document exclusive ownership and refuse to
  double-drive a shared instance.
