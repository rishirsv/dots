# Release cloud plugins

This procedure is for maintainers publishing an existing account or workspace
plugin. Public users install local plugins through [INSTALL.md](../../INSTALL.md).

Dots is a standalone skills plugin. Tunnel is a separate app with its own
connection and release process. Dots packages contain no `.app.json` binding or
`apps` declaration. Keep Git as the source for local and cloud releases.
A profile selects cloud only when its signed-in account has those plugins.
Otherwise it selects local. Source selection controls the local loader, not
cloud publication or account sign-in.

Resolve the target plugin's exact backend ID from its installation metadata or
authorized plugin discovery. Maintainers may keep their deployment IDs in
`~/.config/dots/cloud-plugins.json`, outside Git. Verify each ID against the
signed-in account; do not reuse another maintainer's private plugin.

Use Plugin Creator's supported tools without ChatGPT web login:

1. Read `get_plugin_files` with the resolved ID. Follow inventory pagination and
   inspect the manifest, scope, and current release. Preserve the existing scope
   and the existing audience. A display name or `name@marketplace` key is not
   a backend ID.
2. Finish the source changes and bump the owning plugin's three manifests
   together. Run `python3 scripts/verify.py --full` for the release. Commit only the release
   changes, then package `plugins/<name>/` from that commit, including hidden
   compatibility manifests, as one `<name>/` directory in a ZIP outside the
   source directory. Include skills, scripts, references, agents, and assets; exclude secrets, caches, and
   untracked development files. Do not package another task's uncommitted edits.
3. Call `update_plugin` with the exact backend ID, the archive's absolute local
   path as `archive`, and the observed release as `expected_release_id`.
   If the release changed, reread and reconcile before retrying. Do not create
   a replacement plugin. The update overlays files and cannot delete them;
   identify retired files still present rather than claiming ZIP omission
   removed them.
4. Read back the returned release. Compare the complete expected skill inventory,
   changed content, and metadata with the source. Open the cloud listing and
   desktop plugin card to confirm the logo and composer icon render. Packaged
   image files alone do not prove that the listing uses them; report branding
   verification as pending if either surface shows a fallback icon.
   If an archive update leaves the cloud image URLs empty, upload the same
   committed ZIP through the existing plugin's **Upload new version** action.
   Refresh the web page and the desktop plugin inventory before checking again.
   Include explicit light and dark icon paths, even when both use the same artwork.
   Installing or publishing skills does not start Tunnel or authorize folders.
5. Refresh the desktop plugin inventory and verify a fresh loader uses the
   selected source without duplicates. The current `verify-codex-skills.py`
   checks availability and known duplicates, not complete release contents.
   Report cloud publication separately from desktop verification. Restart only
   after active chats finish if desktop retains stale skills.

## Preserve Tunnel during skill releases

Preserve the existing Tunnel app and its connected account, runtime credentials,
and authorized folders. Its app-backed canonical plugin cannot be edited with
Plugin Creator. Use the app's owning release process for Tunnel updates; never
package Dots skills into it. Keep the tools-only Tunnel plugin enabled
independently of the Dots/Drafts skill-source policies.

If a supported publisher or read-back is unavailable, report that step as
pending. Archive creation, local cache refresh, and local skill availability
alone do not prove cloud publication. Do not edit installed caches or switch
another profile's source to complete a release.

