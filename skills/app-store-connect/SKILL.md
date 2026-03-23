---
name: app-store-connect
description: Unified App Store Connect CLI skill for `asc` auth and command discovery, build lifecycle, TestFlight rollout, metadata sync, release notes writing, submission readiness, and repo-local release workflows. Use when asked to operate App Store Connect from the CLI, prepare a TestFlight/App Store release, manage ASC metadata, or automate a repeatable `asc` release flow.
---

# app-store-connect

Use this skill when the user wants to work with App Store Connect through the `asc` CLI.

It merges the practical workflows from:
- CLI usage and auth
- build lifecycle
- TestFlight orchestration
- metadata sync
- What's New drafting
- submission health
- release readiness and submit flow
- repo-local `asc workflow` automation

## Operating rules

- Always confirm the exact command shape with `--help` before running an unfamiliar subcommand.
- Prefer explicit long flags like `--app`, `--version`, `--build`, `--output`.
- Use `--paginate` when the user wants complete lists.
- Use `--confirm` for destructive or mutating commands.
- Prefer `--output json` for machine steps and `--output table` for human review.
- Prefer keychain auth via `asc auth login`.
- Fallback auth env vars: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY_PATH`, `ASC_PRIVATE_KEY`, `ASC_PRIVATE_KEY_B64`.
- `ASC_APP_ID` can provide a default app ID.
- Timeout env vars: `ASC_TIMEOUT`, `ASC_TIMEOUT_SECONDS`, `ASC_UPLOAD_TIMEOUT`, `ASC_UPLOAD_TIMEOUT_SECONDS`.

## Start here

When beginning a task, resolve these first when relevant:
- `APP_ID`
- version string like `1.2.3`
- `BUILD_ID`
- lower-level IDs only if needed: `VERSION_ID`, `SUBMISSION_ID`, `GROUP_ID`, `APP_INFO_ID`

First discovery commands:

```bash
asc --help
asc auth status
asc apps list --output table
asc builds list --app "APP_ID" --sort -uploadedDate --limit 10
```

## Pick the right path

### 1. "Are we ready to ship?"

Answer in this order:
1. Is the app ready right now, or not yet?
2. What are the blockers?
3. Which blockers are API-fixable versus web-session/manual?
4. What exact command should run next?

Fast readiness check:

```bash
asc submit preflight --app "APP_ID" --version "1.2.3" --platform IOS
```

Full dry run:

```bash
asc release run \
  --app "APP_ID" \
  --version "1.2.3" \
  --build "BUILD_ID" \
  --metadata-dir "./metadata/version/1.2.3" \
  --dry-run \
  --output table
```

Deeper audit:

```bash
asc validate --app "APP_ID" --version "1.2.3" --platform IOS --output table
```

If the app sells digital goods:

```bash
asc validate iap --app "APP_ID" --output table
asc validate subscriptions --app "APP_ID" --output table
```

Real submit after dry-run is clean:

```bash
asc release run \
  --app "APP_ID" \
  --version "1.2.3" \
  --build "BUILD_ID" \
  --metadata-dir "./metadata/version/1.2.3" \
  --confirm
```

### 2. "Why is submission blocked?"

Use this pre-submission checklist:

```bash
asc builds info --build "BUILD_ID"
asc submit preflight --app "APP_ID" --version "1.2.3" --platform IOS
asc validate --app "APP_ID" --version "1.2.3" --platform IOS
asc versions get --version-id "VERSION_ID" --include-build
asc localizations list --version "VERSION_ID"
asc apps info list --app "APP_ID"
asc localizations list --app "APP_ID" --type app-info --app-info "APP_INFO_ID"
```

Check for:
- build `processingState` is `VALID`
- encryption/export compliance
- content rights declaration
- version metadata completeness
- locale completeness
- screenshots present
- privacy policy URL present
- App Privacy published

Content rights fix:

```bash
asc apps get --id "APP_ID" --output json | jq '.data.attributes.contentRightsDeclaration'
asc apps update --id "APP_ID" --content-rights "DOES_NOT_USE_THIRD_PARTY_CONTENT"
```

If encryption is unexpectedly required, the cleaner fix is usually rebuilding with:
- `ITSAppUsesNonExemptEncryption = NO`

If App Privacy is the blocker and the user accepts experimental web-session commands:

```bash
asc web privacy pull --app "APP_ID" --out "./privacy.json"
asc web privacy plan --app "APP_ID" --file "./privacy.json"
asc web privacy apply --app "APP_ID" --file "./privacy.json"
asc web privacy publish --app "APP_ID" --confirm
```

Otherwise send the user to:

```text
https://appstoreconnect.apple.com/apps/APP_ID/appPrivacy
```

Submit explicitly through review submissions when you need more control:

```bash
asc review submissions-create --app "APP_ID" --platform IOS
asc review items-add --submission "SUBMISSION_ID" --item-type appStoreVersions --item-id "VERSION_ID"
asc review submissions-submit --id "SUBMISSION_ID" --confirm
```

### 3. "Handle TestFlight"

Inspect and export current config:

```bash
asc testflight config export --app "APP_ID" --output "./testflight.yaml"
asc testflight config export --app "APP_ID" --output "./testflight.yaml" --include-builds --include-testers
```

Groups and testers:

```bash
asc testflight groups list --app "APP_ID" --paginate
asc testflight groups create --app "APP_ID" --name "Beta Testers"
asc testflight testers list --app "APP_ID" --paginate
asc testflight testers add --app "APP_ID" --email "tester@example.com" --group "Beta Testers"
asc testflight testers invite --app "APP_ID" --email "tester@example.com"
```

Distribute a build:

```bash
asc builds add-groups --build "BUILD_ID" --group "GROUP_ID"
asc builds remove-groups --build "BUILD_ID" --group "GROUP_ID" --confirm
```

What to Test notes:

```bash
asc builds test-notes create --build "BUILD_ID" --locale "en-US" --whats-new "Test instructions"
asc builds test-notes update --id "LOCALIZATION_ID" --whats-new "Updated notes"
```

### 4. "Find the latest build / wait for processing / clean up old builds"

```bash
asc builds latest --app "APP_ID" --version "1.2.3" --platform IOS
asc builds list --app "APP_ID" --sort -uploadedDate --limit 10
asc builds info --build "BUILD_ID"
```

End-to-end publish helpers:

```bash
asc publish testflight --app "APP_ID" --ipa "./app.ipa" --group "GROUP_ID" --wait
asc publish appstore --app "APP_ID" --ipa "./app.ipa" --version "1.2.3" --wait --submit --confirm
```

Cleanup:

```bash
asc builds expire-all --app "APP_ID" --older-than 90d --dry-run
asc builds expire-all --app "APP_ID" --older-than 90d --confirm
asc builds expire --build "BUILD_ID" --confirm
```

## Metadata sync

Use this when updating App Store text, localizations, or privacy-policy metadata.

### Version localizations

Fields:
- `description`
- `keywords`
- `whatsNew`
- `supportUrl`
- `marketingUrl`
- `promotionalText`

```bash
asc localizations list --version "VERSION_ID"
asc localizations download --version "VERSION_ID" --path "./localizations"
asc localizations upload --version "VERSION_ID" --path "./localizations"
```

### App info localizations

Fields:
- `name`
- `subtitle`
- `privacyPolicyUrl`
- `privacyChoicesUrl`
- `privacyPolicyText`

```bash
asc apps info list --app "APP_ID"
asc localizations list --app "APP_ID" --type app-info --app-info "APP_INFO_ID"
asc localizations upload --app "APP_ID" --type app-info --app-info "APP_INFO_ID" --path "./app-info-localizations"
```

If ASC reports multiple app infos, explicitly pass `--app-info`.

### Legacy fastlane metadata

```bash
asc migrate export --app "APP_ID" --version-id "VERSION_ID" --output-dir "./fastlane"
asc migrate validate --fastlane-dir "./fastlane"
asc migrate import --app "APP_ID" --version-id "VERSION_ID" --fastlane-dir "./fastlane" --dry-run
asc migrate import --app "APP_ID" --version-id "VERSION_ID" --fastlane-dir "./fastlane"
```

### Quick edits

```bash
asc apps info edit --app "APP_ID" --locale "en-US" --whats-new "Bug fixes and improvements"
asc apps info edit --app "APP_ID" --locale "en-US" --description "Your app description here"
asc apps info edit --app "APP_ID" --locale "en-US" --keywords "keyword1,keyword2,keyword3"
asc apps info edit --app "APP_ID" --locale "en-US" --support-url "https://support.example.com"
asc versions update --version-id "VERSION_ID" --copyright "2026 Your Company"
asc versions update --version-id "VERSION_ID" --release-type AFTER_APPROVAL
```

Canonical metadata validation:

```bash
asc metadata validate --dir "./metadata"
```

Character limits:
- name: 30
- subtitle: 30
- keywords: 100
- description: 4000
- what's new: 4000
- promotional text: 170

## Writing What's New

Read [release_notes_guidelines.md](./references/release_notes_guidelines.md) before drafting.

Preconditions:
- metadata is pulled locally under `./metadata`, or the user has provided the raw changes
- auth is configured if upload is requested
- default primary locale is `en-US`

Gather input from one of:
- git log since latest tag
- rough bullet points
- free-text summary from the user

Git log helpers:

```bash
git describe --tags --abbrev=0
git log $(git describe --tags --abbrev=0)..HEAD --oneline --no-merges
```

Drafting rules:
- classify changes as `New`, `Improved`, `Fixed`
- omit empty sections
- make the first ~170 characters the hook
- write for user benefit, not implementation details
- naturally echo relevant locale keywords from metadata when they genuinely fit
- target 500-1500 chars in the primary locale
- hard limit is 4000 chars

Canonical metadata paths:
- `metadata/version/{latest-version}/{locale}.json`
- read `keywords`
- update `whatsNew`
- optionally update `promotionalText`

Show the draft with character counts and wait for approval before upload.

Upload paths:

```bash
asc apps info edit --app "APP_ID" --version-id "VERSION_ID" --locale "en-US" --whats-new "Your release notes here"
asc metadata push --app "APP_ID" --version "1.2.3" --dir "./metadata" --dry-run
asc metadata push --app "APP_ID" --version "1.2.3" --dir "./metadata"
```

For full metadata translation, this skill can manage the upload flow, but if the main request is localization strategy, load a dedicated localization skill if one exists in the environment.

## Repo-local ASC workflows

Use this when the user wants one repeatable command for beta or release automation.

Workflow commands:

```bash
asc workflow --help
asc workflow validate
asc workflow list
asc workflow run --dry-run beta
asc workflow run beta BUILD_ID:123456789 GROUP_ID:abcdef
```

Default file:
- `.asc/workflow.json`

Execution pattern:
1. author `.asc/workflow.json`
2. validate it
3. dry-run it
4. run it for real with explicit params

Validation and CI examples:

```bash
asc workflow validate | jq -e '.valid == true'
asc workflow run beta BUILD_ID:123 GROUP_ID:xyz | jq -e '.status == "ok"'
```

Authoring rules:
- keep workflow files in version control
- use IDs where possible
- pass secrets via env, not checked-in JSON
- prefer helper sub-workflows for shared steps
- keep hooks lightweight

## Common blockers and escape hatches

- Initial app availability may require a web-session bootstrap:

```bash
asc pricing availability get --app "APP_ID"
asc web apps availability create --app "APP_ID" --territory "USA,GBR" --available-in-new-territories true
```

- First-review subscriptions may need explicit attachment:

```bash
asc web review subscriptions list --app "APP_ID"
asc web review subscriptions attach-group --app "APP_ID" --group-id "GROUP_ID" --confirm
```

- First-time IAP inclusion may still require manual selection in the App Store Connect UI even if the rest of the prep is done through `asc`.

- If Game Center component versions must ship with the app version, prefer explicit `asc review submissions-*` commands over a one-shot `asc release run --confirm`.

## Response shape

When working a release or submission question, keep the answer structured:
1. current state
2. blockers
3. next exact command
4. any manual or web-session-only step still required
