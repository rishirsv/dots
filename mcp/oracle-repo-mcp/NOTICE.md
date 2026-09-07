# Source provenance

Oracle Repo MCP is a focused personal adapter derived from [Chat On Steroids](https://github.com/totec448-spec/chat-on-steroids), MIT license, pinned at `0f3ec7532b7d598275bf6ebf8f842495d8ab9284` (v2.0.6). Its MIT copyright and permission notice are retained in LICENSE.

The vendored patch parser and text-update helpers in `src/vendor/patch/` are extracted and adapted from that revision’s `src/main/codex/apply-patch/` files: errors, file-update, hunk, mode, parser, seek-sequence, streaming-parser, and text-file. `src/tunnel-health.ts` comes from `src/main/tunnel/health.ts`. The loopback MCP, command-session, and tunnel lifecycle implementation follows the base application’s mechanisms, with a CLI-owned singleton and explicit per-instance retry/precondition checks in place of its desktop session ownership.

Native tool contract reference: [OpenAI Codex](https://github.com/openai/codex), revision `6750f5bd1356fe1553c0fcc9f2632704f3055946`. The Rust tool specifications and apply-patch grammar were inspected as interface references; this project does not embed or launch the Codex agent or claim byte-identical Rust execution behavior. MCP envelope differences and local limits are documented in README.md.

The independently downloaded `tunnel-client` executable is OpenAI’s official release v0.0.14, installed from its release archive after SHA256SUMS verification. It is not vendored in this repository. Other dependencies retain their package licenses.
