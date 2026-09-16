# Capability parity and evidence

This is an implementation/evidence matrix, **not a claim of Commander parity or full spec completion**. The supplied Commander ZIP is a public manifest/documentation bundle; its execution source and upstream regression fixtures were not supplied. No upstream source fixture was silently replaced by a Portal test.

States: **implemented-and-exercised** applies only to the named tested outcome; **implemented-unverified** means source exists but the end-to-end runtime path is not qualified; **unavailable** means intentionally fail-closed in the registry; **not implemented** is mandatory unfinished scope. An exercised subset does not certify the entire requirement.

| Capability | State | Actual evidence and limitation |
|---|---|---|
| `artifacts.get` | implemented-unverified | Account/workspace-bounded artifact source; independent retrieval, host presentation and closed-workspace access remain unqualified/incomplete. |
| `code.run` | implemented-unverified | E02-E04 skipped: QuickJS absent. U20 proves broker read-only authority with an injected handler, not guest execution. |
| `code.run_read` | implemented-unverified | E02-E04 skipped: QuickJS absent. U20 proves broker read-only authority with an injected handler, not guest execution. |
| `documents.docx.create` | implemented-unverified | D01-D04 direct parser fixtures; production OS-contained broker route not exercised. Multi-run complex edits reject. |
| `documents.docx.edit` | implemented-unverified | D01-D04 direct parser fixtures; production OS-contained broker route not exercised. Multi-run complex edits reject. |
| `documents.docx.inspect` | implemented-unverified | D01-D04 direct parser fixtures; production OS-contained broker route not exercised. Multi-run complex edits reject. |
| `documents.docx.read` | implemented-unverified | D01-D04 direct parser fixtures; production OS-contained broker route not exercised. Multi-run complex edits reject. |
| `documents.pdf.create` | implemented-unverified | D10-D12 direct parser fixtures include real rendering/page edits; OS containment and host presentation not exercised. |
| `documents.pdf.edit` | implemented-unverified | D10-D12 direct parser fixtures include real rendering/page edits; OS containment and host presentation not exercised. |
| `documents.pdf.inspect` | implemented-unverified | D10-D12 direct parser fixtures include real rendering/page edits; OS containment and host presentation not exercised. |
| `documents.pdf.read` | implemented-unverified | D10-D12 direct parser fixtures include real rendering/page edits; OS containment and host presentation not exercised. |
| `documents.pdf.render` | implemented-unverified | D10-D12 direct parser fixtures include real rendering/page edits; OS containment and host presentation not exercised. |
| `documents.sheet.create` | implemented-unverified | D05-D09 direct parser fixtures; formula/cache and untouched-part preservation verified, not sandbox qualification. |
| `documents.sheet.edit` | implemented-unverified | D05-D09 direct parser fixtures; formula/cache and untouched-part preservation verified, not sandbox qualification. |
| `documents.sheet.inspect` | implemented-unverified | D05-D09 direct parser fixtures; formula/cache and untouched-part preservation verified, not sandbox qualification. |
| `documents.sheet.legacy_read` | unavailable | Legacy XLS parser not established; no upstream-format fixture evidence. Explicit rejection, no conversion. |
| `documents.sheet.read` | implemented-unverified | D05-D09 direct parser fixtures; formula/cache and untouched-part preservation verified, not sandbox qualification. |
| `documents.sheet.xlsm_edit` | unavailable | D08 rejects macro edits; read-only inert VBA fixture covered. Edit preservation not qualified. |
| `files.append` | implemented-and-exercised | I01 |
| `files.apply_patch` | implemented-and-exercised | I07; per-file outcomes only |
| `files.copy` | implemented-and-exercised | I26, I27 |
| `files.list` | implemented-and-exercised | I05 |
| `files.manifest` | implemented-and-exercised | I26-I28 |
| `files.mkdir` | implemented-unverified | I07 indirectly; direct standalone call not separately asserted |
| `files.move` | implemented-and-exercised | I07, I26, I27 |
| `files.read` | implemented-and-exercised | I03, I04 |
| `files.read_many` | implemented-and-exercised | I04 |
| `files.remove` | implemented-and-exercised | I09, I28 |
| `files.replace` | implemented-and-exercised | I08 |
| `files.stage_chunk` | implemented-unverified | Staging/offset/hash/commit source supplied; dedicated complete upload/retry/fault scenario not recorded. |
| `files.stage_commit` | implemented-unverified | Staging/offset/hash/commit source supplied; dedicated complete upload/retry/fault scenario not recorded. |
| `files.stage_start` | implemented-unverified | Staging/offset/hash/commit source supplied; dedicated complete upload/retry/fault scenario not recorded. |
| `files.stat` | implemented-and-exercised | I05 and 10,000-operation core stress |
| `files.tail` | implemented-and-exercised | I03 |
| `files.write` | implemented-and-exercised | I01, I02; C01/C02 |
| `images.inspect` | implemented-unverified | D13 direct Pillow fixtures; first frame/crop/resize tested. Broker containment and MCP image delivery not exercised. |
| `images.view` | implemented-unverified | D13 direct Pillow fixtures; first frame/crop/resize tested. Broker containment and MCP image delivery not exercised. |
| `instructions.read_for_path` | implemented-and-exercised | I24 |
| `jobs.cancel` | implemented-unverified | State/coordination portions I13; actual owned Codex process lifecycle and cancellation unqualified. |
| `jobs.get` | implemented-unverified | State/coordination portions I13; actual owned Codex process lifecycle and cancellation unqualified. |
| `jobs.list` | implemented-unverified | State/coordination portions I13; actual owned Codex process lifecycle and cancellation unqualified. |
| `jobs.output` | implemented-and-exercised | U11-U13; actual 1 GiB spool test. Owned Codex command source/output notification path not exercised. |
| `network.fetch` | implemented-unverified | U07 public-IP/SSRF decision table passes; live DNS/HTTPS/redirect/timeout route not exercised. |
| `processes.list` | implemented-unverified | UID-filtered native process inventory source; dedicated permission/identity integration not recorded. |
| `processes.signal` | not implemented | Explicitly unavailable. Exact-identity unrelated-process termination is mandatory unfinished scope. |
| `search.cancel` | implemented-and-exercised | I21; bounded local scanner/basic ignore, not full ripgrep behavior; document sub-search route unqualified. |
| `search.list` | implemented-and-exercised | I21; bounded local scanner/basic ignore, not full ripgrep behavior; document sub-search route unqualified. |
| `search.read` | implemented-and-exercised | I19-I21; bounded local scanner/basic ignore, not full ripgrep behavior; document sub-search route unqualified. |
| `search.start` | implemented-and-exercised | I19-I21; bounded local scanner/basic ignore, not full ripgrep behavior; document sub-search route unqualified. |
| `tasks.close` | implemented-and-exercised | I16 |
| `tasks.create` | implemented-and-exercised | I16 |
| `tasks.read` | implemented-and-exercised | I16 |
| `tasks.save_result` | implemented-and-exercised | I16 |
| `tasks.update_plan` | implemented-and-exercised | I16 |
| `terminal.exec` | implemented-unverified | U14-U17 validate adapter policy/qualification rejection; actual Codex binary, command, stdin and PTY absent. |
| `terminal.resize` | implemented-unverified | U14-U17 validate adapter policy/qualification rejection; actual Codex binary, command, stdin and PTY absent. |
| `terminal.stdin` | implemented-unverified | U14-U17 validate adapter policy/qualification rejection; actual Codex binary, command, stdin and PTY absent. |

## Transport, lifecycle and release surfaces

| Surface | Evidence and status |
|---|---|
| Agent / owner IPC | I25 real daemon, singleton, protected socket authentication, frontend loss/restart and receipt retrieval pass on Linux. Not macOS launchd/Keychain qualification. |
| Direct MCP tools | 17 generated interfaces and annotations tested U10; E05 official SDK path skipped. |
| Five skills | U10, I22-I24 local hashes/static-private separation/live change loading pass. Actual host import not run. |
| Relay and provider validation | Source/migrations/deploy templates supplied; E01 and E06 skipped. U18/U19 run a real local test issuer with PKCE, not Auth0 or full relay validation. |
| Code mode | Source supplied; actual interpreter tests skipped. |
| Mac install / sleep / worker recovery | Native/installer/supervisor source and physical test harness supplied; not exercised on Mac. |
| Private tunnel | Stdio/manual-client instructions supplied. Portal-owned tunnel supervision not implemented. |
| Updates / legacy migration | Backups and migration idempotence exercised I18; signed update orchestration and legacy apply/import not implemented. |
| Long soak / host | 10,000-operation short core stress and 1 GiB spool run only. 72-hour/100-interruption mixed soak and actual ChatGPT tests not run. |

## Scope exclusions from the supplied specification

GUI mouse/keyboard automation, browser automation, billing, enterprise fleet administration, non-Mac production agents and hidden model reasoning are excluded-product-scope. Mandatory gaps in OPEN-GAPS.md are **not** reclassified as exclusions.
