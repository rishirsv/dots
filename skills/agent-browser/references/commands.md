# Commands Reference

## Navigation

```bash
agent-browser open <url>
agent-browser back
agent-browser forward
agent-browser reload
agent-browser close
agent-browser connect 9222
```

## Snapshot

```bash
agent-browser snapshot
agent-browser snapshot -i
agent-browser snapshot -c
agent-browser snapshot -d 3
agent-browser snapshot -s "#main"
```

## Interactions

```bash
agent-browser click @e1
agent-browser click @e1 --new-tab
agent-browser dblclick @e1
agent-browser focus @e1
agent-browser fill @e2 "text"
agent-browser type @e2 "text"
agent-browser press Enter
agent-browser press Control+a
agent-browser hover @e1
agent-browser check @e1
agent-browser uncheck @e1
agent-browser select @e1 "value"
agent-browser scroll down 500
agent-browser scrollintoview @e1
agent-browser drag @e1 @e2
agent-browser upload @e1 file.pdf
```

## Get Information

```bash
agent-browser get text @e1
agent-browser get html @e1
agent-browser get value @e1
agent-browser get attr @e1 href
agent-browser get title
agent-browser get url
agent-browser get cdp-url
```

## Wait

```bash
agent-browser wait @e1
agent-browser wait 2000
agent-browser wait --text "Success"
agent-browser wait --url "**/dashboard"
agent-browser wait --load networkidle
agent-browser wait --fn "document.readyState === 'complete'"
```

## Screenshots and PDF

```bash
agent-browser screenshot
agent-browser screenshot path.png
agent-browser screenshot --full
agent-browser screenshot --annotate
agent-browser pdf output.pdf
```

## Network

```bash
agent-browser network requests
agent-browser network route
agent-browser network route --abort
agent-browser network route --body '{}'
agent-browser network unroute
```

## Frames

```bash
agent-browser frame "#iframe"
agent-browser frame @e3
agent-browser frame main
```
