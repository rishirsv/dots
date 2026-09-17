# Source provenance

Build identity: Portal 0.1.0, private engineering handoff. Input files were read-only.

- `DOCKYARD-BUILD-SPEC(1).md` — 125,739 bytes; SHA-256 `d2fc3db29d2ff2da2d2216dae4c7ed4307b2376900b82e95cbe0643472a6860c`.
- `DOCKYARD-BUILD-SPEC(2).md` — 125,739 bytes; SHA-256 `d2fc3db29d2ff2da2d2216dae4c7ed4307b2376900b82e95cbe0643472a6860c`.
- `remote-desktop-commander-1.0.3.zip` — 158,918 bytes; SHA-256 `f271a705072fb871e1b4a072ac41ef4faa08b4cf77793b6b95b224c3c553aac9`.

The two specification attachments are byte-identical. `docs/BUILD-SPEC.md` preserves the contract with the requested Portal naming substitution. The uploaded Commander ZIP is a versioned public plugin/documentation distribution, not a Git checkout. Its actual Git revision cannot be established from the supplied archive. The spec's reference revision is not asserted as an actual supplied execution-server revision.

`DesktopCommanderMCP` source, a Dots/Advisor checkout and a Codex native binary were not supplied. No upstream server or proprietary hosted relay was copied. Portal is independent source. No Commander production endpoint is called. All hostnames in deployment manifests require owner provisioning.

Selected/exercised build tools: Node 22.16.0, npm 10.9.2, TypeScript 5.8.3, Linux x64, native C compiler and Node headers. See evidence/environment.json for actual versions. The target remains Apple Silicon macOS, which was not available for qualification.

Public integration references consulted:
- https://learn.chatgpt.com/docs/app-server
- https://developers.openai.com/plugins/build/mcp-server
- https://developers.openai.com/plugins/build/skills
- https://developers.openai.com/plugins/build/auth
- https://developers.openai.com/api/docs/guides/secure-mcp-tunnels
- https://github.com/justjake/quickjs-emscripten
- https://pypdfium2.readthedocs.io/

These references inform adapters, not a claim that a documentation example's schema is enforced by an untested binary. Native Codex qualification must generate schemas from the actual installed executable. No binary/schema hash is fabricated in compatibility/codex.json.
