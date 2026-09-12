# Insights Report

The insights route answers a different question from the improvement
review: not "what should change?" but "how does the user actually work across
the retained history?" The output is a broad insights report over the whole
retained session window. Use [user-coaching.md](user-coaching.md) instead when
the user asks for a focused evaluation or rating of their own work.

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
python3 scripts/self_improve.py stats
```

`stats` caches derivations by schema, session, transcript mtime, and effective
time bounds. Closed sessions wholly inside successive windows reuse their cache;
sessions crossing a moving boundary are recomputed. It scans the full selected
window by default. `--limit` and `--max-new` impose explicit caps; carry eligible,
analyzed, included, skipped, malformed, and interrupted counts into the report.
A completed scan does not imply complete telemetry or an unbiased profile.

Sessions with fewer than two user messages or under a minute of elapsed time
are flagged as weak narrative evidence. They remain in workload totals when
they contain recorded tools or token samples, including delegated children.
Empty low-signal sessions and transcripts whose opening turns are a usage
report or self-improve pass are excluded and counted separately. With no
`--days`, the requested bounds cover retained history through the current clock.
Use `--days` only for the narrower window the user requested.

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
- **Testing time** can show how long recorded tests and builds took, which ones
  repeated, and whether failures were followed by edits and another test. Use
  these as clues, then read the conversation before explaining why they happened.
- **Tool counts** separate raw outer calls, orchestration wrappers, and recorded
  command/MCP operations. `tool_calls` excludes `exec` wrappers and includes
  distinct structured operations. The helper never executes or parses wrapper
  JavaScript to guess children. Without a recorded parent link, child attribution
  remains unknown. Structured status/exit codes outrank error-like text;
  `inferred_tool_failures` and `unknown_tool_outcomes` identify heuristic or
  missing evidence. Other completed-item kinds are not operation-normalized.
- **Tokens** are nondecreasing cumulative deltas inside the requested bounds.
  Intervals crossing a boundary, counter resets, missing fields, and records
  without samples are disclosed. Missing cache/reasoning fields are not zero.
  Cached input is included in input; reasoning is included in output. Do not
  add them twice or convert recorded traffic into money without billing evidence.
- **Lineage** identifies declared parent/child records and parents outside the
  included set. Children exclude events timestamped before their creation;
  unknown forks, retries, or recaptured inherited events remain undeduplicated.
  Record totals are not a count of independent user tasks. Inspect the parent
  cluster before attributing workload or generalizing a pattern.
- **Time bounds** apply to stamped events, not just session discovery. Unstamped
  events are counted as unavailable and excluded from bounded measurements.
  Test-call durations can overlap; their sum is not elapsed wall time.
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
   Give each side concrete patterns, not a single blended complaint. This is a
   insights summary, not a fixed rubric for evaluating the user.
5. **Quick Wins** — draw from what is actually installed and configured, not a
   generic feature list. An installed skill with no organic invocations in
   `skill-usage` or `stats` is a stronger lead than a feature pitch. Skip
   suggestions that amount to "give more context" or "confirm before acting".
6. **On The Horizon** — three ambitious workflows that better models make
   reachable: autonomous loops, parallel agents, iterating against tests.
7. **Leads For The Improvement Review** — anything that looks durable enough
   for a separate improvement review.

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
finished report to `$html` and save the artifact under `tmp/`. Do
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
- Lead: <pattern>
  Why it might be durable: <one sentence>
  Next step: run the improvement review on this lead

## Coverage
- Host: <selected host>
- Window: <range> · retention limit: <limit>
- Sessions: <analyzed> of <listed> · excluded: <counts> · capped: <count>
- Unmeasurable: <capabilities the host did not record>
```
