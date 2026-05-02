# RS Tools

Personal Codex plugin marketplace and reusable agent skills.

## Structure

- `skills/`: loose reusable skills while drafting or before plugin packaging.
- `plugins/`: installable Codex plugins.
- `.agents/plugins/marketplace.json`: repo-scoped Codex marketplace catalog.
- `.codex/config.toml`: repo-local Codex config that registers this marketplace.
- `configs/`: reusable agent and prompt configuration.
- `references/`: external examples, archived candidate skills, and source material.
- `TODO.md`: improvement backlog for future skill rebuilds.

## Local Marketplace

This repo exposes a local Codex marketplace named `rs-tools`.

Current plugin:

- `plugins/rs-tools`: starter Codex plugin that bundles the `rs-tools` skill.

Bundled skills:

- `agent-browser`: live browser and Electron automation through Vercel Agent Browser.
- `commit`: safe focused git commits.
- `handoff`: concise continuation briefs.
- `hard-cut`: one canonical implementation, no legacy compatibility paths.
- `oracle`: repo-context packages for external review or planning.
- `research`: explicit sourced research with repo context and primary-source guidance.
- `rs-tools`: guidance for this plugin repo.
- `simplify`: post-implementation cleanup for clarity, reuse, quality, and efficiency.
- `scope`: clarify, ideate, or pressure-test before planning or implementation.
- `tech-debt`: explicit architecture debt review that updates `TECH-DEBT.md`.
- `yeet`: CLI-first commit, push, and draft PR flow.

After opening this repo in Codex, restart Codex so it detects `.agents/plugins/marketplace.json`. Then open the plugin directory, choose the `RS Tools` marketplace, and install `RS Tools`.

Codex installs a selected plugin into its plugin cache and loads that installed copy. For local plugins, the installed version is `local`.

## References

Reference folders are not installed as active skills. They exist to guide future skill rebuilds and KPMG/deck work:

- `references/oai/`: OAI artifact package, OAI skills, and presentation references.
- `references/candidates/`: archived skills to mine while rebuilding coding and design workflows.
- `references/system/`: installed system skills kept as design references.
- `references/anthropic/`: Anthropic knowledge-work and financial-services plugin examples.

## Repo Codex Config

This repo keeps its Codex config in `.codex/config.toml`.

That file registers `.agents/plugins/marketplace.json` as the `rs-tools` marketplace and enables `rs-tools@rs-tools` for this repo. User-specific secrets, auth, and machine-wide defaults should stay in `~/.codex/config.toml`.
