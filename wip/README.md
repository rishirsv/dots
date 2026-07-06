# Work In Progress

Holding area for skills that are being built or rebuilt and should not ship in
any plugin package. Nothing in this directory is packaged, synced, or
discoverable by agents at runtime.

Rules:

- Move a skill here (with its full directory) when it needs rework that would
  otherwise leave a broken or misleading skill live in a plugin.
- Move it back into `plugins/<plugin>/skills/` only after it passes the normal
  skill validation for that plugin.
- Do not link to files in `wip/` from any live skill.

Current contents:

- `visualize/` — pulled from `dots` pending a platform-neutral rewrite and
  evidence of real usage; its diagram/chart guidance may be absorbed elsewhere.
- `html-artifact/` — removed from `dots` on main (`8c477923`); restored here as
  the working copy for a future rebuild.
- `dataviz/` — imported from `~/Desktop/dataviz`; candidate chart lane for the
  `explain-2` proposal.
- `explain-2/` — proposed replacement for `explain`, built for review; not
  packaged anywhere.
