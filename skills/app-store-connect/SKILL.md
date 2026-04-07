---
name: app-store-connect
description: Repo-aligned App Store Connect CLI skill for `asc` auth, command discovery, build and TestFlight workflows, metadata sync, submission readiness, and App Store release automation. Use when asked to operate App Store Connect from the CLI, prepare a TestFlight/App Store release, manage ASC metadata, or automate a repeatable `asc` release flow.
---

# app-store-connect

Use this skill when the user wants to work with App Store Connect through the `asc` CLI.

Keep guidance aligned with the upstream CLI repo:
- GitHub repo: `https://github.com/rudrankriyam/App-Store-Connect-CLI`
- Current repo snapshot checked for this update: commit `23619c9fd56e150104079b8a7fd1b17b396e99ce` dated `2026-04-07`

## Operating rules

- Always confirm the exact command shape with `--help` before running an unfamiliar subcommand.
- Prefer the canonical 1.0+ command paths from the upstream docs.
- Do not recommend removed legacy paths like `asc submit preflight` or `asc release run`.
- Prefer explicit long flags like `--app`, `--version`, `--build`, `--output`.
- Use `--paginate` when the user wants complete lists.
- Use `--confirm` for destructive or mutating commands.
- Respect TTY-aware output defaults: `table` in terminals, `json` in non-interactive contexts.
- Prefer explicit `--output json` for machine steps and `--output table` or `--output markdown` for human review.
- Prefer keychain auth via `asc auth login` unless CI or headless usage makes config/env auth a better fit.
- If keychain access is flaky, use `ASC_BYPASS_KEYCHAIN=1` or `asc auth login --bypass-keychain`.

Useful env vars:
- `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY_PATH`, `ASC_PRIVATE_KEY`, `ASC_PRIVATE_KEY_B64`
- `ASC_APP_ID`
- `ASC_DEFAULT_OUTPUT`
- `ASC_TIMEOUT`, `ASC_TIMEOUT_SECONDS`
- `ASC_UPLOAD_TIMEOUT`, `ASC_UPLOAD_TIMEOUT_SECONDS`
- `ASC_DEBUG`
- `ASC_RETRY_LOG`

## Start here

When beginning a task, resolve these first when relevant:
- `APP_ID`
- version string like `1.2.3`
- `BUILD_ID`
- path to IPA when publishing: `./build/MyApp.ipa`
- lower-level IDs only if needed: `VERSION_ID`, `SUBMISSION_ID`, `GROUP_ID`, `APP_INFO_ID`, `DETAIL_ID`

First discovery commands:

```bash
asc version
asc --help
asc auth status --validate
asc auth doctor
asc apps list --output table
asc builds list --app "APP_ID" --sort -uploadedDate --limit 10
```

If the user wants the official skill pack installed from upstream:

```bash
asc install-skills
```

## Canonical command map

Prefer these current paths:
- readiness check: `asc validate`
- pre-submit staging: `asc release stage`
- canonical App Store ship flow: `asc publish appstore --submit --confirm`
- canonical TestFlight publish flow: `asc publish testflight`
- release pipeline dashboard: `asc status --app "APP_ID"`
- review blockers: `asc review doctor --app "APP_ID"`
- submission lifecycle follow-up: `asc submit status`, `asc submit cancel`

Migration reminders:
- old `asc submit preflight` -> `asc validate`
- old `asc release run` -> `asc publish appstore --submit --confirm` or `asc release stage`

## Pick the right path

### 1. "Are we ready to ship?"

Answer in this order:
1. Is the app ready right now, or not yet?
2. What are the blockers?
3. Which blockers are API-fixable versus web-session/manual?
4. What exact command should run next?

Canonical readiness check:

```bash
asc validate --app "APP_ID" --version "1.2.3" --output table
```

Pre-submit deterministic staging dry run:

```bash
asc release stage \
  --app "APP_ID" \
  --version "1.2.3" \
  --build "BUILD_ID" \
  --metadata-dir "./metadata" \
  --dry-run
```

Canonical end-to-end ship flow:

```bash
asc publish appstore \
  --app "APP_ID" \
  --ipa "./build/MyApp.ipa" \
  --version "1.2.3" \
  --submit \
  --confirm
```

Monitor state after staging or submit:

```bash
asc status --app "APP_ID" --watch
asc review status --app "APP_ID"
asc submit status --version-id "VERSION_ID"
```

If the app sells digital goods:

```bash
asc validate iap --app "APP_ID" --output table
asc validate subscriptions --app "APP_ID" --output table
```

### 2. "Why is submission blocked?"

Use this checklist:

```bash
asc validate --app "APP_ID" --version "1.2.3" --output table
asc review status --app "APP_ID" --version "1.2.3"
asc review doctor --app "APP_ID" --version "1.2.3"
asc builds info --build "BUILD_ID"
asc versions get --version-id "VERSION_ID" --include-build
asc apps info view --app "APP_ID" --version "1.2.3" --platform IOS --output json --pretty
asc localizations list --version "VERSION_ID"
asc apps info list --app "APP_ID"
asc localizations list --app "APP_ID" --type app-info --app-info "APP_INFO_ID"
```

Check for:
- build `processingState` is `VALID`
- missing metadata or locale coverage
- encryption/export compliance
- content rights declaration
- screenshots or preview assets missing
- privacy policy URL or App Privacy gaps
- review details or attachments still missing

Content rights check:

```bash
asc apps get --id "APP_ID" --output json | jq '.data.attributes.contentRightsDeclaration'
asc apps update --id "APP_ID" --content-rights "DOES_NOT_USE_THIRD_PARTY_CONTENT"
```

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

When you need lower-level review control:

```bash
asc review submissions-create --app "APP_ID" --platform IOS
asc review items-add --submission "SUBMISSION_ID" --item-type appStoreVersions --item-id "VERSION_ID"
asc review submissions-submit --id "SUBMISSION_ID" --confirm
```

### 3. "Handle TestFlight"

Inspect config, groups, testers, and metrics:

```bash
asc testflight config export --app "APP_ID" --output "./testflight.yaml"
asc testflight groups list --app "APP_ID" --paginate
asc testflight testers list --app "APP_ID" --paginate
asc testflight testers add --app "APP_ID" --email "tester@example.com" --group "Beta Testers"
asc testflight testers invite --app "APP_ID" --email "tester@example.com"
asc testflight metrics app-testers --app "APP_ID"
```

High-level publish flow:

```bash
asc publish testflight \
  --app "APP_ID" \
  --ipa "./build/MyApp.ipa" \
  --group "External Testers,Beta Team"
```

Lower-level build distribution:

```bash
asc builds add-groups --build "BUILD_ID" --group "GROUP_ID"
asc builds remove-groups --build "BUILD_ID" --group "GROUP_ID" --confirm
```

Feedback and crash triage:

```bash
asc testflight feedback list --app "APP_ID" --paginate
asc testflight feedback view --submission-id "SUBMISSION_ID"
asc testflight crashes list --app "APP_ID" --sort -createdDate --limit 10
asc testflight crashes log --submission-id "SUBMISSION_ID"
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

If the user wants cleanup:

```bash
asc builds expire-all --app "APP_ID" --older-than 90d --dry-run
asc builds expire-all --app "APP_ID" --older-than 90d --confirm
asc builds expire --build "BUILD_ID" --confirm
```

## Metadata sync

Use this when updating App Store text, localizations, or privacy-policy metadata.

Canonical file workflow:

```bash
asc metadata pull --app "APP_ID" --version "1.2.3" --dir "./metadata"
asc metadata validate --dir "./metadata"
asc metadata push --app "APP_ID" --version "1.2.3" --dir "./metadata" --dry-run
asc metadata push --app "APP_ID" --version "1.2.3" --dir "./metadata"
```

Supported metadata scopes in the upstream docs:
- app-info localizations: `name`, `subtitle`, `privacyPolicyUrl`, `privacyChoicesUrl`, `privacyPolicyText`
- version localizations: `description`, `keywords`, `marketingUrl`, `promotionalText`, `supportUrl`, `whatsNew`

If ASC reports multiple app infos, explicitly pass `--app-info`.

### Quick edits

```bash
asc apps info view --app "APP_ID" --output json --pretty
asc apps info edit --app "APP_ID" --locale "en-US" --whats-new "Bug fixes and improvements"
asc apps info edit --app "APP_ID" --locale "en-US" --description "Your app description here"
asc apps info edit --app "APP_ID" --locale "en-US" --keywords "keyword1,keyword2,keyword3"
asc apps info edit --app "APP_ID" --locale "en-US" --support-url "https://support.example.com"
asc versions update --version-id "VERSION_ID" --copyright "2026 Your Company"
asc versions update --version-id "VERSION_ID" --release-type AFTER_APPROVAL
```

Keyword audit before applying:

```bash
asc metadata keywords audit --app "APP_ID" --version "1.2.3" --blocked-terms-file "./blocked-terms.txt"
```

### Legacy fastlane metadata

```bash
asc migrate export --app "APP_ID" --version-id "VERSION_ID" --output-dir "./fastlane"
asc migrate validate --fastlane-dir "./fastlane"
asc migrate import --app "APP_ID" --version-id "VERSION_ID" --fastlane-dir "./fastlane" --dry-run
asc migrate import --app "APP_ID" --version-id "VERSION_ID" --fastlane-dir "./fastlane"
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
- `metadata/app-info/{locale}.json`
- `metadata/versions/{version}/{locale}.json`
- read `keywords`
- update `whatsNew`
- optionally update `promotionalText`

Show the draft with character counts and wait for approval before upload.

Upload paths:

```bash
asc apps info edit --app "APP_ID" --locale "en-US" --whats-new "Your release notes here"
asc metadata push --app "APP_ID" --version "1.2.3" --dir "./metadata" --dry-run
asc metadata push --app "APP_ID" --version "1.2.3" --dir "./metadata"
```

## Repo-local ASC workflows

Use this when the user wants one repeatable command for beta or release automation.

Workflow commands:

```bash
asc workflow --help
asc workflow validate
asc workflow list
asc workflow run --dry-run testflight_beta VERSION:1.2.3
asc workflow run testflight_beta VERSION:1.2.3
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
asc workflow run --dry-run testflight_beta VERSION:1.2.3
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
- Use `asc review details-*` and `asc review attachments-*` when App Review is blocked on contact info, demo credentials, or supporting files.
- The upstream repo labels `web` workflows as experimental and discouraged. Use them only when the API path is unavailable and the user accepts the tradeoff.

## Troubleshooting

Useful diagnostics:

```bash
asc auth doctor
ASC_BYPASS_KEYCHAIN=1 asc auth status --validate
ASC_DEBUG=api asc apps list --output json
ASC_RETRY_LOG=true asc builds list --app "APP_ID"
```

For slower requests or uploads:

```bash
export ASC_TIMEOUT=2m
export ASC_UPLOAD_TIMEOUT=10m
```

## Response shape

When working a release or submission question, keep the answer structured:
1. current state
2. blockers
3. next exact command
4. any manual or experimental-web step still required
