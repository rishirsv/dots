# Logic Prototype

A logic prototype is a tiny interactive terminal app that lets the user drive a state model by hand. Use it when the question is about business logic, state transitions, or data shape: the kind of thing that looks reasonable on paper but only feels wrong once you push it through real cases.

## When This Is The Right Shape

- "I'm not sure if this state machine handles the edge case where X then Y."
- "Does this data model actually let me represent the case where..."
- "I want to feel out what the API should look like before writing it."
- Anything where the user wants to press buttons and watch state change.

If the question is "what should this look like", use [UI.md](UI.md).

## Process

### 1. State The Question

Before writing code, write down what state model and what question you are prototyping. One paragraph in the prototype README or a top-of-file comment is enough.

### 2. Pick The Language

Use whatever the host project uses. If the project has no obvious runtime, ask. Match the project's tooling; do not add a package manager or runtime just for the prototype.

### 3. Isolate The Logic In A Portable Module

Put the actual logic behind a small, pure interface that could be lifted into real code later. The TUI is throwaway; the logic module should not be.

Choose the shape that fits the question:

- **Pure reducer**: `(state, action) => state`. Good when actions are discrete events and state is a single value.
- **State machine**: explicit states and transitions. Good when legal actions depend on current state.
- **Pure functions over a plain data type**: good when there is no implicit current state.
- **Class or module with methods**: good when the logic genuinely owns ongoing internal state.

Keep it pure: no I/O, no terminal code, no `console.log` for control flow. The TUI imports it and calls into it.

### 4. Build The Smallest TUI That Exposes State

Build a lightweight TUI. On every tick, clear the screen and re-render the whole frame. The user should always see one stable view, not an ever-growing scrollback.

Each frame has two parts:

1. **Current state**, pretty-printed and diff-friendly.
2. **Keyboard shortcuts**, listed at the bottom.

Behavior:

1. Initialize a single in-memory state object.
2. Render the first frame on start.
3. Read one keystroke or one line at a time.
4. Dispatch to a handler that mutates state.
5. Re-render the full frame after every action.
6. Loop until quit.

The whole frame should fit on one screen.

### 5. Make It Runnable In One Command

Add a script to the project's existing task runner: `package.json`, `Makefile`, `justfile`, `pyproject.toml`, or equivalent. If the host project has no task runner, put the command at the top of the prototype README.

### 6. Hand It Over

Give the user the run command. The interesting moments are when they say "wait, that should not be possible" or "I assumed X would be different." Those are bugs in the idea, which is the point.

### 7. Capture The Answer

When the prototype has done its job, keep only the answer. If the user is around, ask what it taught them. If not, leave a `NOTES.md` next to the prototype so the answer can be filled in before deletion.

## Anti-Patterns

- Do not add tests. A prototype that needs tests is no longer a prototype.
- Do not wire it to the real database unless the question is specifically about persistence.
- Do not generalize for hypothetical future cases.
- Do not blur the logic and TUI together.
- Do not ship the TUI shell into production.
