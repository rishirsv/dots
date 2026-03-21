# Session Management

Multiple isolated browser sessions with state persistence and concurrent browsing.

## Named Sessions

```bash
agent-browser --session auth open https://app.example.com/login
agent-browser --session public open https://example.com
agent-browser --session auth fill @e1 "user@example.com"
agent-browser --session public get text body
```

## Session State Persistence

```bash
agent-browser state save /path/to/auth-state.json
agent-browser state load /path/to/auth-state.json
agent-browser open https://app.example.com/dashboard
```

## Common Patterns

```bash
agent-browser --session site1 open https://site1.com &
agent-browser --session site2 open https://site2.com &
wait
agent-browser --session site1 get text body > site1.txt
agent-browser --session site2 get text body > site2.txt
```

## Cleanup

```bash
agent-browser --session auth close
agent-browser session list
```
