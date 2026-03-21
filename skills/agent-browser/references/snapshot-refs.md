# Snapshot and Refs

Snapshots produce compact `@eN` refs that are stable until the page changes.

## Snapshot Command

```bash
agent-browser snapshot
agent-browser snapshot -i
```

## Using Refs

```bash
agent-browser click @e6
agent-browser fill @e10 "user@example.com"
agent-browser fill @e11 "password123"
agent-browser click @e12
```

## Ref Lifecycle

Always re-snapshot after navigation or dynamic page changes.

## Iframes

Iframe content is inlined into the snapshot output, and refs inside iframes can be used directly.

## Troubleshooting

- Re-snapshot if a ref cannot be found.
- Scroll the page or wait for dynamic content if the element is missing.
