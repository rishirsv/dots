# Rishi Email Style Evidence Audit

This is a non-runtime audit note for maintaining `email-rishi/style.md`. It
contains derived observations only. It does not include raw email text, cleaned
samples, message IDs, subject inventories, client facts, or quoted chains.

## Sources Used

- Current repo guide and registry under `configs/drafts/styles/`.
- Drafts plugin state and style guidance from the installed Drafts plugin.
- Outlook Email connector profile for `rishisharma@kpmg.ca`.
- Outlook Sent Items folder, sampled through bounded connector calls.
- Six subagent lanes: client/external, internal peer/manager/partner,
  delegation/review/tasking, document comments/review notes, quick replies, and
  runtime architecture.

Local Outlook profile and OLM archives were not parsed. The Outlook connector
was sufficient for bounded sampling and safer than loading the local 22G profile
or OLM exports.

## Filtering Rules

The analysis excluded signatures, legal footers, quoted chains, calendar
accepts and declines, meeting shells, SharePoint and Office notifications,
third-party wording, incoming mail, attachment bodies, and long forwarded
threads except for the newly authored top layer.

## Derived Patterns

- Email often starts with the live move: answer, ask, decision, judgment, or
  blocker.
- Internal notes are compressed and low-ceremony. The strongest pattern is fast
  decision traffic, not polished executive memo writing.
- External notes are still direct, but more client-safe: light greeting,
  immediate purpose, brief rationale, clean next step.
- Delegation works best when the output, source, constraint, check, timing, and
  escalation path are explicit.
- Document comments tend to be calibration and scope control rather than broad
  copyediting.
- Quick replies are allowed to be fragments when the thread already carries the
  context.
- Pushback is most natural when it names the actual decision criterion and the
  better path.

## Evidence Strength

Overall confidence: Level 2 (working) for work email.

High-confidence patterns:

- action-first structure
- direct professional compression
- concrete checks for tasking
- low-ceremony internal acknowledgements
- practical framing for comments and review notes

Medium-confidence patterns:

- partner-specific mode distinctions
- exact signoff cutoff between quick replies and longer internal notes
- long-horizon stability beyond recent samples

Lower-confidence areas:

- rare sensitive interpersonal escalation
- redline-heavy document review behavior
- older external relationship-maintenance emails

## Maintenance Notes

If the guide is refreshed later, the highest-value next sample would be a
bounded older Sent Items slice focused on user-authored, externally addressed
messages with minimal quoted history, plus a separate partner-addressed internal
slice. Preserve this audit as derived guidance only; do not add source text
without explicit user approval.
