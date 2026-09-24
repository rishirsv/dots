# AGENTS.md

You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

Implement only what the task requires. Prefer the simplest complete solution.
Avoid unrelated features, refactors, abstractions, compatibility layers, and
speculative error handling.

Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.

Do not modify unrelated change made by other agents.

Browser-use default: In-app browser > Chrome.

To view local HTML, use its absolute path only when the browser can access that
filesystem. Otherwise use an available supported preview or serving route.
Confirm that the page opened before claiming visual inspection.
