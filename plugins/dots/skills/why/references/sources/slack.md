# Slack Conversations

## What this source contains

- Real-time discussions of problems and decisions
- Incident channels where urgent decisions were made
- Design discussion threads where tradeoffs were debated
- Questions answered by senior engineers that didn't make it into docs
- Post-merge discussions that explain why something was revisited
- DMs (usually not searchable, scope accordingly)

Slack can record decisions about changes that have no separate design document. Its records may be incomplete because threads are deleted, channels are archived, and search quality changes over time.

## How to search it

Slack MCP tools vary. Check which Slack MCP is available and inspect its tool schema first. It may require `mcp_auth`. If authentication fails, stop and report the gap.

1. **Author-bounded search.** Messages from the PR author around the PR merge date. This limits the search to messages likely to discuss the change.
2. **Keyword search for the feature name and key symbols.** Include misspellings and casual phrasings.
3. **PR URL search.** Slack often links PRs when they're reviewed or discussed. Search for the PR URL (or just `/pull/<number>`).
4. **Error string search.** If the code handles a specific error, search for the error string. Incident threads often surface.
5. **Channel-scoped search.** Narrow to likely channels:
   - `#eng-*`. Engineering discussions
   - `#proj-*`. Project channels
   - `#incident-*` / `#sev-*`. Incident channels
   - Team-specific channels for the owning team
   - Design review channels
6. **Thread traversal.** When you find a relevant message, fetch the whole thread. The decision often lives in the replies.

## What good evidence looks like here

- A thread where tradeoffs were explicitly debated ("I was going to use A but B is better because...")
- An incident channel message describing the bug the code prevents
- A question from a reviewer and an authoritative answer from the author or lead
- A reference to a meeting where a decision was made
- A message from a product manager or customer-facing engineer explaining a customer ask

## Common pitfalls

- **Missing old messages.** Very old messages may be gone due to retention policies. If you can't find anything before a certain date, report the unavailable time period.
- **Unsearched DMs.** Many decisions happen in DMs that aren't searchable. You'll miss them; that's a known limitation.
- **Speculative jokes as "decisions."** Slack is casual. "Lol just do the thing" isn't a decision, even if it preceded the commit. Look for considered discussion.
- **Messages without thread context.** Without the thread, a single message often reads differently than in context. Always fetch threads.
- **Auth failures.** If the MCP isn't authenticated, stop. Don't make up findings. Report that Slack wasn't searchable.

## What to return

For each relevant thread:
- Channel name
- Permalink or thread ID
- Participants
- Date range of the discussion
- The key quotes (verbatim) with attribution
- Context: what thread/incident/discussion this was part of
