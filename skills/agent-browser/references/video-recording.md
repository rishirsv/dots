# Video Recording

Capture browser automation as a video for debugging or documentation.

## Basic Recording

```bash
agent-browser record start ./demo.webm
agent-browser open https://example.com
agent-browser snapshot -i
agent-browser click @e1
agent-browser fill @e2 "test input"
agent-browser record stop
```

## Recording Commands

```bash
agent-browser record start ./output.webm
agent-browser record stop
agent-browser record restart ./take2.webm
```

## Best Practices

- Add pauses for readability.
- Use descriptive filenames.
- Stop recordings in error handlers.
