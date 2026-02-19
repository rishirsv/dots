# Prompt Doctor

Diagnose recurring failures caused by an assistant’s **system prompt**, using only:

- The current system prompt
- Real failure traces/logs

## Inputs

### System prompt

```text
[PASTE_SYSTEM_PROMPT]
```

### Failure traces

```text
[PASTE_FAILURE_TRACES]
```

## Rules (token-efficient)

- If something isn’t in the prompt or traces, write **“unknown”** (don’t guess).
- Don’t propose new tools/features/models unless prompt-only fixes are implausible.
- Quote only the **minimum** prompt text needed (≤2 lines per driver).

## Deliverables

For each distinct failure pattern:

1) What it looks like (1–2 sentences)  
2) Evidence (trace IDs + short excerpts)  
3) Prompt drivers (quoted lines + location hint)  
4) Causal mechanism (why the wording steers behavior)  
5) Minimal prompt patch (before → after)  
6) Regression tests (2–5 scenarios)  

## Output template (Markdown)

## Summary

- **Theme:** …
- **Top issues:** …

## Patterns

### P1 — *[Name]*

- **What:** …
- **Evidence:** *Trace ID → excerpt → why it matters*
- **Prompt drivers:** *quote → location → behavioral effect*
- **Causality:** …
- **Proposed patch:**
  - **Before:**
    ```text
    ...
    ```
  - **After:**
    ```text
    ...
    ```
  - **Tradeoffs:** …
- **Regression tests:**
  - *Test name* — **Input:** … **Expected tools:** … **Expected response traits:** … **Failure if:** …
  - *(2–5 tests total)*
- **Severity:** low | medium | high
- **Frequency:** low | medium | high | unknown
- **Priority:** 1

*(Repeat P2, P3, … as needed.)*
