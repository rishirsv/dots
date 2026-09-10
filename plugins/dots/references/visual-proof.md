# Visual Proof

Shared checklist for any skill that must verify rendered output: web pages,
HTML artifacts, app screens, charts, or simulator UI. Verification means
looking at the real rendered surface, not reasoning about the code.

## Tool Order

- **Web/HTML**: follow the active browser skill and the user's browser choice.
  Default to the in-app browser. Its documented controls, including its
  Playwright API, are supported; a standalone automation browser is a
  separate surface.
- **iOS**: the user's simulator via XcodeBuildMCP (`build_run_sim`,
  `screenshot`, `snapshot_ui`). Check `session_show_defaults` before the first
  build in a session.
- **Charts**: render and inspect the real output; automated checks rarely catch
  geometry, scales, labels, legends, or collision problems.

## Recurring Failures To Check When Relevant

1. **Local preview access.** Open local HTML with its absolute filesystem path
   in the in-app browser. If that fails, distinguish a rendering failure from
   an automation limitation and follow the active browser skill's recovery
   guidance. If a local server is needed, serve only the artifact directory and
   bind it to loopback.
2. **Wrong tab/window.** Confirm the inspected tab displays the artifact you
   just built. Obtain a fresh tab only when the existing one cannot be
   identified or reused. Screenshotting an unrelated tab is not proof.
3. **Viewport misses.** Inspect the intended viewing size and any responsive
   breakpoints affected by the change. For responsive web output, include a
   narrow viewport; use 320px only when that width is supported or requested.
   Flag unintended horizontal overflow; wide content should scroll inside its
   own container.

## Proof Standard

- A claim that something renders correctly requires a screenshot or an
  in-browser inspection from this run — never inferred from code.
- Name what was verified (URL/screen, viewport, state) and what was not.
- Before sharing evidence, confirm screenshots and logs contain no secrets.
