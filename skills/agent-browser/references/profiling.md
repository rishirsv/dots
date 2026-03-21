# Profiling

Capture Chrome DevTools traces during browser automation.

## Basic Profiling

```bash
agent-browser profiler start
agent-browser navigate https://example.com
agent-browser click "#button"
agent-browser wait 1000
agent-browser profiler stop ./trace.json
```

## Profiler Commands

```bash
agent-browser profiler start --categories "devtools.timeline,v8.execute,blink.user_timing"
agent-browser profiler stop ./trace.json
```

## Viewing Profiles

- Chrome DevTools Performance panel
- https://ui.perfetto.dev/
- `chrome://tracing`
