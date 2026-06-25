# Style Library Sync

Use this reference when creating, moving, exporting, importing, backing up, or
syncing reusable user style guides.

## What Gets Synced

The style library sync surface should make reusable guides available across
machines without turning the guide system into an overgrown registry. The
synced unit is the voice manual plus the small lookup record needed to find it.

Default to syncing generated style guides, optional maintenance notes, and the
style registry. Do not move sample corpora as part of ordinary style sync.

## Finding The Library

Resolve the user style library root in this order:

1. Explicit path supplied by the user for the current operation.
2. `DRAFTS_STYLE_HOME`, when set.
3. `${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

The library root contains:

```text
style-library.json
<style-id>/
  style.md
  notes.md
  references/
```

If `DRAFTS_STYLE_HOME` is set, treat it as the style library root itself, not as
a parent folder. Do not set or change environment variables for the user unless
they explicitly ask.

## Style Lookup Index

Maintain `style-library.json` when the style library exists or changes. The
registry is the user-facing index for selection, sync, backup, and inspection.
Keep it minimal.

Use this shape:

```json
{
  "schema": "drafts/v2",
  "kind": "style_library",
  "updated_at": "",
  "styles": [
    {
      "id": "email-rishi",
      "title": "Rishi Email Style",
      "channel": "email",
      "path": "email-rishi/style.md",
      "modes": ["client", "internal_peer", "delegation_review", "document_comment"],
      "aliases": ["email-base-rishi", "email-client-advisory"],
      "notes_path": "email-rishi/notes.md"
    }
  ]
}
```

Registry fields:

- `id`: concrete style ID.
- `title`: human-readable name.
- `channel`: primary channel family.
- `path`: relative path to the runtime guide.
- `modes`: audience, relationship, or task variants inside the guide.
- `aliases`: prior IDs or alternate names that should resolve to this guide.
- `notes_path`: optional relative path to maintenance notes.
- `updated_at`: optional library update time.

Do not put lifecycle fields, model settings, counts, source hashes, or
generated timestamps in the runtime guide. Add registry fields only when they
help lookup, sync, aliasing, or migration.

## What To Copy

Ordinary sync copies:

- `style-library.json`
- each selected `style.md`
- `notes.md` when present

Do not infer approval to sync sample corpora from a general request to "sync my
styles." If the user explicitly asks to export or move references, treat that
as a separate operation and state what will be included before copying.

## Export

When exporting a style library, create a bundle rather than a loose folder copy:

```text
drafts-style-library/
  manifest.json
  style-library.json
  styles/
    <style-id>/
      style.md
      notes.md
```

`manifest.json` should record:

- schema and kind.
- export time.
- included style IDs.
- whether notes are included.
- whether references are included, if the user explicitly asked for them.

## Import

Before importing:

1. Read `manifest.json` and `style-library.json` when present.
2. List style IDs, titles, channels, modes, aliases, and notes paths.
3. Ask before overwriting any existing style ID.
4. Import unknown styles directly.
5. For conflicts, keep both versions unless the user explicitly chooses an
   overwrite.

Conflict-safe names may use:

```text
<style-id>-imported-<yyyymmdd>
```

After import, update `style-library.json`.

## Syncing A Folder

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

## Handling Conflicts

Before writing synced or imported styles, compare:

- style ID.
- guide path.
- title.
- channel.
- modes.
- aliases.
- updated time when present.

If both local and incoming versions changed, keep both and report a conflict.
Do not merge style guide prose automatically. A merged voice guide can blend
contexts that should remain separate.

## What To Say After Sync

For any sync, export, import, or root change, report:

- resolved library root.
- styles included.
- notes included or excluded.
- references included only when explicitly requested.
- conflicts created or resolved.
