# Teach Memory

Read this when using `$teach` and the request depends on presentation style, learning preferences, or prior corrections. Keep it concise and current so Teach can personalize explanations without making the user repeat themselves.

## How To Use

- Apply matching preferences quietly; do not announce memory unless it helps the user understand why the explanation is shaped a certain way.
- Treat the user's current request as higher priority than this file.
- Update this file when the user explicitly states a durable preference, corrects the presentation style, or repeats the same preference across Teach sessions.
- Ask before recording a preference if it is sensitive, personal, ambiguous, or likely to be temporary.
- Do not store secrets, credentials, private personal facts, medical/legal/financial facts, raw transcripts, or one-off task details.
- Prefer replacing stale or conflicting entries over appending duplicates.
- Keep entries short. Use `- <preference> (source: YYYY-MM-DD, confidence: explicit|observed)`.
- Mention memory updates in the final response when you edit this file.

## Presentation Preferences

- Explain in plain English for a smart non-technical reader. Avoid dense implementation language unless the concept requires it. (source: 2026-06-06, confidence: explicit)
- Infer the explanation level from context instead of asking the user to choose ELI5, ELI14, intern, or expert mode. (source: 2026-06-06, confidence: explicit)
- Keep Teach low-latency and terse by default. Prefer small incremental explanations over long lectures. (source: 2026-06-06, confidence: explicit)
- Use visuals when they make an explanation shorter or clearer, especially Mermaid diagrams, small tables, and minimal dark HTML explainers. (source: 2026-06-06, confidence: explicit)
- Use light restatement for verification when helpful. Avoid test-like checks. (source: 2026-06-06, confidence: explicit)
- Do not call concepts simple, obvious, basic, or trivial. (source: 2026-06-06, confidence: explicit)

## Content Priorities

- Cover the problem, why it existed, the solution, tradeoffs, edge cases, and broader impact. (source: 2026-06-06, confidence: explicit)
- Make the why clear before going deep on mechanics. (source: 2026-06-06, confidence: explicit)
- Keep running understanding checklists in chat by default; save them only when asked or when repo instructions provide a planning location. (source: 2026-06-06, confidence: explicit)
