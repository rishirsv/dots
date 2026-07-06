# Visual Proof

Shared checklist for any skill that must verify rendered output: web pages,
HTML artifacts, app screens, charts, or simulator UI. Verification means
looking at the real rendered surface, not reasoning about the code.

## Tool Order

- **Web/HTML**: Codex Browser first, Chrome only as fallback. Never Playwright
  unless the user asks.
- **iOS**: the user's simulator via XcodeBuildMCP (`build_run_sim`,
  `screenshot`, `snapshot_ui`). Check `session_show_defaults` before the first
  build in a session.
- **Charts/dataviz**: render and screenshot; the palette validator checks
  color, not layout — geometry and label collisions need eyes.

## The Three Recurring Failures (check every run)

1. **`file://` blocked.** Browser policy often blocks local file previews.
   Fall back to a throwaway localhost server (`python3 -m http.server` in the
   artifact directory) instead of declaring the artifact broken.
2. **Wrong tab/window.** Confirm the inspected tab is the artifact you just
   built — open the file URL in a fresh window when in doubt. Screenshotting
   an unrelated tab and calling it proof has happened before.
3. **Viewport misses.** Check desktop, 375px, and 320px widths. Flag any
   horizontal overflow; wide content must scroll inside its own container.

## Proof Standard

- A claim that something renders correctly requires a screenshot or an
  in-browser inspection from this run — never inferred from code.
- Name what was verified (URL/screen, viewport, state) and what was not.
- Before sharing evidence, confirm screenshots and logs contain no secrets.
