# Authentication Patterns

Login flows, session persistence, OAuth, 2FA, and authenticated browsing.

## Import Auth from Your Browser

Use a Chrome session that is already logged in, then save its cookies and storage.

```bash
"$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222
agent-browser --auto-connect state save ./my-auth.json
agent-browser --state ./my-auth.json open https://app.example.com/dashboard
```

## Persistent Profiles

Use `--profile` for a persistent browser profile:

```bash
agent-browser --profile ~/.myapp-profile open https://app.example.com/login
agent-browser --profile ~/.myapp-profile open https://app.example.com/dashboard
```

## Session Persistence

Use `--session-name` to auto-save and restore cookies and localStorage:

```bash
agent-browser --session-name myapp open https://app.example.com/login
agent-browser close
agent-browser --session-name myapp open https://app.example.com/dashboard
```

## Basic Login Flow

```bash
agent-browser open https://app.example.com/login
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
```

## Saving Authentication State

```bash
agent-browser state save ./auth-state.json
agent-browser state load ./auth-state.json
```

## OAuth / SSO Flows

```bash
agent-browser open https://app.example.com/auth/google
agent-browser wait --url "**/accounts.google.com**"
agent-browser snapshot -i
agent-browser fill @e1 "user@gmail.com"
agent-browser click @e2
```

## Two-Factor Authentication

```bash
agent-browser open https://app.example.com/login --headed
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --url "**/dashboard" --timeout 120000
```

## HTTP Basic Auth

```bash
agent-browser set credentials username password
agent-browser open https://protected.example.com
```

## Cookie-Based Auth

```bash
agent-browser cookies set session_token "abc123xyz"
agent-browser open https://app.example.com/dashboard
```

## Security Best Practices

- Treat saved state files as secrets.
- Add state files to `.gitignore`.
- Set `AGENT_BROWSER_ENCRYPTION_KEY` for encryption at rest.
