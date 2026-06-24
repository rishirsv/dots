# Style Library Sync

Use this reference when creating, moving, exporting, importing, backing up, or
syncing reusable user style guides.

## Contract

The user style library is private user state. Sync should make style guides
available across machines without silently spreading raw personal samples,
client material, or imported message archives.

Default to syncing generated style guides and the style registry. Sync raw
references only when the user explicitly asks for that mode.

## Library Root

Resolve the user style library root in this order:

1. Explicit path supplied by the user for the current operation.
2. `DRAFTS_STYLE_HOME`, when set.
3. `${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

The library root contains:

```text
style-library.json
<style-id>/
  style.md
  references/
```

If `DRAFTS_STYLE_HOME` is set, treat it as the style library root itself, not as
a parent folder. Do not set or change environment variables for the user unless
they explicitly ask.

## Registry

Maintain `style-library.json` when the style library exists or changes. The
registry is the user-facing index for sync, selection, backup, and inspection.

Use this shape:

```json
{
  "schema": "drafts/v1",
  "kind": "style_library",
  "updated_at": "",
  "sync_mode": "guides_only",
  "styles": [
    {
      "id": "email-client",
      "title": "Client Email",
      "guide_status": "ready",
      "channels": ["email"],
      "audiences": ["client"],
      "privacy": "private",
      "reference_policy": "local_only",
      "updated_at": "",
      "source_hash": ""
    }
  ]
}
```

Registry fields:

- `id`: concrete style ID.
- `title`: human-readable name.
- `guide_status`: `ready`, `stale`, `insufficient_evidence`, `contaminated`, or
  `failed`.
- `channels`: channels the guide is meant to support.
- `audiences`: relationship or audience contexts.
- `privacy`: `public`, `internal`, `private`, `sensitive`, or `client`.
- `reference_policy`: `local_only`, `redacted`, or `included`.
- `updated_at`: last guide or registry update.
- `source_hash`: current guide source hash when available.

## Sync Modes

Use one of these sync modes:

- `guides_only`: sync `style.md` files and `style-library.json`; keep
  `references/` local. This is the default.
- `redacted_bundle`: sync `style.md`, `style-library.json`, and redacted
  reference summaries when available.
- `full_bundle`: sync `style.md`, `style-library.json`, and selected raw or
  cleaned references. Use only after explicit user approval.

Never infer approval for `full_bundle` from a general request to "sync my
styles." Treat sensitive personal corpora, client material, iMessage data,
Outlook archives, and Slack exports as `local_only` unless the user explicitly
changes that policy.

## Export

When exporting a style library, create a bundle rather than a loose folder copy:

```text
drafts-style-library/
  manifest.json
  style-library.json
  styles/
    <style-id>/
      style.md
      references/
```

`manifest.json` should record:

- schema and kind.
- export time.
- export mode.
- included style IDs.
- whether raw references are included.
- warnings about sensitive material.

For `guides_only`, omit `references/` or include an empty folder with a note that
references were intentionally excluded.

## Import

Before importing:

1. Read `manifest.json` and `style-library.json` when present.
2. List style IDs, titles, guide status, privacy, reference policy, and warnings.
3. Ask before overwriting any existing style ID.
4. Import unknown styles directly.
5. For conflicts, keep both versions unless the user explicitly chooses an
   overwrite.

Conflict-safe names may use:

```text
<style-id>-imported-<yyyymmdd>
```

After import, update `style-library.json`.

## Folder Sync

If the user wants ongoing sync through iCloud, Dropbox, Google Drive, Syncthing,
or another folder sync tool, prefer syncing the library root through
`DRAFTS_STYLE_HOME` instead of changing `CODEX_HOME`.

Recommended shape:

```text
DRAFTS_STYLE_HOME=<synced-folder>/drafts/styles
```

Then each machine resolves the same style library root while keeping unrelated
Codex state local.

Do not recommend syncing all of `${CODEX_HOME:-~/.codex}` just to move Drafts
styles. That is too broad and can mix unrelated credentials, state, or local
configuration.

## Conflict Handling

Before writing synced or imported styles, compare:

- style ID.
- `source_hash`.
- `generated_at`.
- `guide_version`.
- `guide_status`.

If both local and incoming versions changed, keep both and report a conflict.
Do not merge style guide prose automatically. A merged voice guide can blend
contexts that should remain separate.

## Reporting

For any sync, export, import, or root change, report:

- resolved library root.
- sync mode.
- styles included.
- references included or excluded.
- conflicts created or resolved.
- any privacy warnings.
