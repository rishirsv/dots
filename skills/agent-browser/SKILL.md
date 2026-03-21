---
name: agent-browser
description: Browser automation CLI for AI agents. Use when the user needs to interact with websites, including navigating pages, filling forms, clicking buttons, taking screenshots, extracting data, testing web apps, or automating any browser task.
---

# Browser Automation with agent-browser

agent-browser drives Chrome or Chromium directly over CDP. Install it with `npm i -g agent-browser`, `brew install agent-browser`, or `cargo install agent-browser`.

Run `agent-browser install` to download Chrome, and `agent-browser upgrade` to update the binary.

## Core Workflow

Follow the browser loop:

1. Navigate: `agent-browser open <url>`
2. Snapshot: `agent-browser snapshot -i`
3. Interact with the `@eN` refs from the snapshot
4. Re-snapshot after navigation or major DOM changes

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# @e1 [input type="email"], @e2 [input type="password"], @e3 [button] "Submit"
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i
```

## Command Chaining

Commands can be chained with `&&` because browser state persists in the background daemon.

```bash
agent-browser open https://example.com && agent-browser wait --load networkidle && agent-browser snapshot -i
agent-browser fill @e1 "user@example.com" && agent-browser fill @e2 "password123" && agent-browser click @e3
agent-browser open https://example.com && agent-browser wait --load networkidle && agent-browser screenshot page.png
```

Use chaining when you do not need to inspect intermediate output. Run separate commands when you need to read the snapshot before choosing the next ref.

## Essential Commands

```bash
# Navigation
agent-browser open <url>
agent-browser back
agent-browser forward
agent-browser reload
agent-browser close
agent-browser connect 9222

# Snapshot
agent-browser snapshot -i
agent-browser snapshot -c
agent-browser snapshot -d 3
agent-browser snapshot -s "#main"

# Interaction
agent-browser click @e1
agent-browser click @e1 --new-tab
agent-browser dblclick @e1
agent-browser focus @e1
agent-browser fill @e2 "text"
agent-browser type @e2 "text"
agent-browser select @e1 "value"
agent-browser check @e1
agent-browser uncheck @e1
agent-browser press Enter
agent-browser keydown Shift
agent-browser keyup Shift
agent-browser hover @e1
agent-browser scroll down 500
agent-browser scrollintoview @e1
agent-browser drag @e1 @e2
agent-browser upload @e1 file.pdf

# Get information
agent-browser get text @e1
agent-browser get html @e1
agent-browser get value @e1
agent-browser get attr @e1 href
agent-browser get title
agent-browser get url
agent-browser get cdp-url
agent-browser get count ".item"
agent-browser get box @e1
agent-browser get styles @e1

# Wait
agent-browser wait @e1
agent-browser wait --load networkidle
agent-browser wait --url "**/dashboard"
agent-browser wait 2000
agent-browser wait --text "Success"
agent-browser wait --fn "document.readyState === 'complete'"

# Screenshots and PDF
agent-browser screenshot
agent-browser screenshot path.png
agent-browser screenshot --full
agent-browser screenshot --annotate
agent-browser pdf output.pdf

# Video recording
agent-browser record start ./demo.webm
agent-browser record stop
agent-browser record restart ./take2.webm

# Mouse control
agent-browser mouse move 100 200
agent-browser mouse down left
agent-browser mouse up left
agent-browser mouse wheel 100

# Semantic locators
agent-browser find role button click --name "Submit"
agent-browser find text "Sign In" click
agent-browser find label "Email" fill "user@test.com"
agent-browser find placeholder "Search" type "query"

# Browser settings
agent-browser set viewport 1920 1080
agent-browser set viewport 1920 1080 2
agent-browser set device "iPhone 14"
agent-browser set geo 37.7749 -122.4194
agent-browser set offline on
agent-browser set headers '{"X-Key":"v"}'
agent-browser set credentials user pass
agent-browser set media dark

# Cookies and storage
agent-browser cookies
agent-browser cookies set name value
agent-browser cookies clear
agent-browser storage local
agent-browser storage local key
agent-browser storage local set k v
agent-browser storage local clear

# Network
agent-browser network route
agent-browser network route --abort
agent-browser network route --body '{}'
agent-browser network unroute [url]
agent-browser network requests
agent-browser network requests --filter api

# Tabs and windows
agent-browser tab
agent-browser tab new [url]
agent-browser tab 2
agent-browser tab close
agent-browser tab close 2
agent-browser window new

# Frames
agent-browser frame "#iframe"
agent-browser frame @e3
agent-browser frame main

# JavaScript
agent-browser eval 'document.title'
agent-browser eval --stdin
agent-browser eval -b "$(echo -n 'Array.from(document.querySelectorAll("a")).map(a => a.href)' | base64)"
```

## Common Patterns

### Form Submission

```bash
agent-browser open https://example.com/signup
agent-browser snapshot -i
agent-browser fill @e1 "Jane Doe"
agent-browser fill @e2 "jane@example.com"
agent-browser select @e3 "California"
agent-browser check @e4
agent-browser click @e5
agent-browser wait --load networkidle
```

### Authentication

Prefer the auth vault for recurring work:

```bash
echo "pass" | agent-browser auth save github --url https://github.com/login --username user --password-stdin
agent-browser auth login github
agent-browser auth list
agent-browser auth show github
agent-browser auth delete github
```

For one-off work, use browser state:

```bash
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "$USERNAME"
agent-browser fill @e2 "$PASSWORD"
agent-browser click @e3
agent-browser wait --url "**/dashboard"
agent-browser state save auth.json
agent-browser state load auth.json
```

### Session Persistence

```bash
agent-browser --session-name myapp open https://app.example.com/login
agent-browser close
agent-browser --session-name myapp open https://app.example.com/dashboard
```

### Data Extraction

```bash
agent-browser open https://example.com/products
agent-browser snapshot -i
agent-browser get text @e5
agent-browser get text body > page.txt
agent-browser snapshot -i --json
agent-browser get text @e1 --json
```

### Connect to Existing Chrome

```bash
agent-browser --auto-connect open https://example.com
agent-browser --auto-connect snapshot
agent-browser --cdp 9222 snapshot
```

### Visual Debugging

```bash
agent-browser --headed open https://example.com
agent-browser highlight @e1
agent-browser inspect
agent-browser record start demo.webm
agent-browser profiler start
agent-browser profiler stop trace.json
```

### Local Files and iOS

```bash
agent-browser --allow-file-access open file:///path/to/document.pdf
agent-browser --allow-file-access open file:///path/to/page.html
agent-browser device list
agent-browser -p ios --device "iPhone 16 Pro" open https://example.com
agent-browser -p ios tap @e1
agent-browser -p ios fill @e2 "text"
agent-browser -p ios swipe up
agent-browser -p ios screenshot mobile.png
agent-browser -p ios close
```

## Safety and Reliability

All security features are opt-in. By default, agent-browser imposes no restrictions on navigation or output.

Useful safeguards:

```bash
export AGENT_BROWSER_CONTENT_BOUNDARIES=1
export AGENT_BROWSER_ALLOWED_DOMAINS="example.com,*.example.com"
export AGENT_BROWSER_ACTION_POLICY=./policy.json
export AGENT_BROWSER_MAX_OUTPUT=50000
```

The default timeout is 25 seconds. Use explicit waits for slow sites, and re-snapshot after every navigation or major DOM change.

## Session Cleanup

```bash
agent-browser session list
agent-browser --session auth close
agent-browser close
```

## Deep-Dive References

- [references/commands.md](references/commands.md)
- [references/snapshot-refs.md](references/snapshot-refs.md)
- [references/session-management.md](references/session-management.md)
- [references/authentication.md](references/authentication.md)
- [references/video-recording.md](references/video-recording.md)
- [references/profiling.md](references/profiling.md)
- [references/proxy-support.md](references/proxy-support.md)

## Templates

- [templates/form-automation.sh](templates/form-automation.sh)
- [templates/authenticated-session.sh](templates/authenticated-session.sh)
- [templates/capture-workflow.sh](templates/capture-workflow.sh)
