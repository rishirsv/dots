# Insights Report

The insights route answers a different question from the improvement review:
not "what should change?" but "how does the user actually work?" The output is a
coaching report over the whole retained session window.

The report itself is host-neutral. Only the session source differs; every
section, heading, and judgment reads the same regardless of which host was
mined. Do not name the host in the report body — say "the agent" for the
assistant side and put host identity in the coverage block alone.

**Report-only.** This route never edits an instruction file, skill, memory
store, or script. When it surfaces something durable, name it as a lead and
offer to run the improvement review on that lead.

## Scope

Profile the whole retained window for the selected host, not a triaged subset.
Triage ranks evidence; a usage profile needs the distribution.

Run the statistics pass first, then read a small number of representative
sessions to explain what the numbers mean:

```bash
python3 scripts/self_improve.py stats --top 10
python3 scripts/self_improve.py stats --json
```

`stats` derives per-session facts and caches them by schema version, session id,
and transcript mtime, so repeat runs only touch new sessions. It excludes
sessions with fewer than two user messages or under a minute of elapsed time,
and excludes transcripts whose opening turns are themselves a usage report or
self-improve pass — otherwise the report profiles the reporting. It reports every
exclusion and cap in its coverage block. With no `--days` or `--limit`, it lists
the whole retained window; use those flags only when the user explicitly asks
for a narrower insights report. Carry the coverage numbers into the report; a
silent cap reads as full coverage.

Read these fields the way `stats` defines them:

- **Engaged time** sums consecutive event gaps under 15 minutes. Use this as the
  time-worked figure. **Session span** is first-to-last wall clock and includes
  idle and resumed time, so it can exceed the calendar window — never present it
  as time worked.
- **Host-injected blocks** are instruction and context payloads that arrive with
  the user role but were never typed. They are excluded from message volume and
  from every keyword signal.
- **Interruptions** count the host's interrupt sentinel plus short imperative
  stop turns. A zero here can mean the host records no sentinel, not that the
  user never interrupts.
- **Failure buckets** are coarse leads about where friction concentrates. An
  empty set can mean the failure markers do not match this host's tool surface.
- **Unmeasurable** lines name exactly these capability gaps. Repeat them in the
  report's coverage block rather than reporting a zero as a finding.

Statistics are facts about volume and distribution. They are not evidence for a
durable change on their own — that requires the improvement review's evidence
packet and generalization gate.

## Sections

Write in second person. Skip a section rather than padding it.

1. **How You Work** — two or three paragraphs on interaction style: quick
   iteration or detailed upfront specs, interrupting or letting a run finish,
   how corrections arrive. Ground each claim in a distribution from `stats` or a
   session you read. Bold the load-bearing observations.
2. **Project Areas** — four or five areas by session share, each with what the
   work was and how the agent was used.
3. **What Is Working** — three workflows worth keeping. No flattery, no
   tool-call trivia, no restating raw counts.
4. **Where Friction Appears** — split the two sides, because the fixes differ:
   - *Agent-side*: misread requests, wrong approach, output that did not work.
   - *User-side*: thin context up front, environment and setup gaps, scope that
     shifted mid-run.
   Give each side concrete patterns, not a single blended complaint.
5. **Quick Wins** — draw from what is actually installed and configured, not a
   generic feature list. An installed skill with no organic invocations in
   `skill-usage` or `stats` is a stronger lead than a feature pitch. Skip
   suggestions that amount to "give more context" or "confirm before acting".
6. **On The Horizon** — three ambitious workflows that better models make
   reachable: autonomous loops, parallel agents, iterating against tests.
7. **Leads For The Improvement Review** — anything that looks durable, each with
   the proposal key it would carry so `decide` can settle it later.

Before writing **Quick Wins** and **Leads**, read the decisions store
(`decide status`) and drop anything already recorded rejected or applied.

## Privacy

This report is meant to be shareable, which raises the bar above an ordinary
review. The body carries aggregate counts, behavioral patterns, and at most
paraphrased examples. Keep out of the body:

- transcript excerpts, command output, and pasted content;
- session ids, thread ids, and local transcript paths;
- repository paths beyond a project name the user would recognize;
- anything resembling a credential, token, or private third-party detail.

Provenance belongs in the terminal reply, not the artifact.

## Coverage

Close with an honest coverage block:

- Host mined, and whether the other host's state was present but unread.
- Window requested, and the retention boundary. Absence of an older session is
  not evidence the work never happened.
- Sessions listed, analyzed, excluded, and capped.
- Capabilities the host did not record — for example, absent event timestamps
  mean no response-gap distribution.
- Whether malformed rollout lines were encountered.

## Output

Return markdown by default. When the user wants a shareable page, hand the
finished report to `$html` and save the artifact under `.agents/outputs/`. Do
not embed an HTML template in this skill.

```md
# Usage Insights

<sessions> sessions · <messages> messages · <hours>h engaged · <commits> commits
<window start> to <window end>

## At A Glance
- **What's working:** <two or three sentences> See _What Is Working_.
- **What's hindering you:** <agent-side, then user-side> See _Where Friction Appears_.
- **Quick wins to try:** <installed, unused capability> See _Quick Wins_.
- **Ambitious workflows:** <what better models unlock> See _On The Horizon_.

## How You Work
## Project Areas
## What Is Working
## Where Friction Appears
### Agent-Side
### User-Side
## Quick Wins
## On The Horizon
## Leads For The Improvement Review
- Lead: <pattern>  (key <proposal-key>)
  Why it might be durable: <one sentence>
  Next step: run the improvement review on this lead

## Coverage
- Host: <selected host>
- Window: <range> · retention limit: <limit>
- Sessions: <analyzed> of <listed> · excluded: <counts> · capped: <count>
- Unmeasurable: <capabilities the host did not record>
```
