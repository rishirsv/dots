# Choose and Operate a Runner

Use this reference for execution-mode decisions. [Task running](task-running.md)
owns package readiness and evidence capture; [Calibration](calibration.md)
owns invalid-run classification. This reference owns host isolation checks and
workflows, not a bundled Codex wrapper or custom subagent service.

Prefer a fresh session in a dedicated folder with enforced folder permissions.
Containers are not the default requirement. Use a stronger environment only
when the task needs it or the host cannot enforce the agreed boundary.

## Choose from actual capabilities

| Mode | Prefer when | Check before choosing |
|---|---|---|
| Fresh Codex session | Native skill discovery, a complete project workspace, or independently configured trials matter | Model/settings, inherited instructions and skill catalogs, file/tool boundaries, and trace export |
| Fresh-context subagent | A quick task can use the host's existing tools and the host supports the required environment | No parent history, separate working state, correct skill catalog, exact model/settings, and accessible evidence |

Use [Comparison](comparison.md) for matched candidate conditions.
If a host cannot enforce the boundary or
supply necessary evidence, explain the gap and choose a capable mode with the
user. A shared-filesystem subagent is not isolated merely because its conversation
is fresh. Neither a working-directory flag nor a write sandbox proves that
hidden files cannot be read.

## Prepare the full task environment

1. Freeze candidate packages and the task version. Copy the task's starting
   workspace into a fresh working copy; do not run in the original source.
2. Make the candidate and approved dependency skills discoverable through the
   host's normal mechanism, including references, scripts, assets, and runtime
   dependencies. For Codex, use its supported project skill location inside the
   trial, such as `.agents/skills/<name>/`.
   Do not install trial candidates into the user's global skill catalog.
3. Inspect inherited project instructions, ancestor directories, global skills,
   plugins, tools, memory, and connected applications. Remove unintended
   influence through supported per-trial configuration, or disclose it. Never
   modify the user's global configuration to clean a trial.
   In particular, exclude the hidden companion's AGENTS.md from candidate
   inheritance. If a nested working copy would inherit it, use an isolated trial
   root instead; removing it from the copied files alone is insufficient.
4. Verify needed files and tools and denial of hidden grading material. A
   workbook task needs its input workbook and spreadsheet tooling, not only
   the spreadsheet skill's text. Serialize or reset shared mutable apps.
5. Apply the [run-approval boundary](../SKILL.md#communicating-with-the-user).

## Fresh Codex session workflow

### Enforce folder permissions

Use a per-run permission profile, not just `-C`. Current Codex profiles can deny
reads outside workspace roots. They are beta; verify the installed version.
Do not combine them with legacy `sandbox_mode` or `--sandbox`, which can select
the older behavior instead. Example starting policy:

```toml
default_permissions = "eval-folder"
approval_policy = "never"

[permissions.eval-folder]
extends = ":workspace"

[permissions.eval-folder.filesystem]
":root" = "deny"
":minimal" = "read"
":tmpdir" = "deny"
":slash_tmp" = "deny"

[permissions.eval-folder.network]
enabled = false
```

This applies to sandboxed commands, not all client operations. Model service
traffic, MCP, browser, and other connected tools have separate controls. Disable
unneeded capabilities independently. If command networking is necessary, domain
rules require an active network proxy. See [permission profiles and enforcement](https://learn.chatgpt.com/docs/permissions).

Keep the policy outside candidate modification and apply it through supported
per-invocation configuration. Confirm the resolved workspace roots include only
the trial, not the parent repository or sibling trials. Do not change global
configuration. Permit additional runtime paths only when a failed readiness
check proves they are necessary; document each exception. Use a private scratch
directory rather than opening shared temporary directories broadly.

The policy is a starting example, not a verified launch recipe for every host.
Do not broaden access or approve an escape during a trial. If required operations
are denied, stop, revise the environment with approval, and start a fresh trial.
Never retry with unrestricted execution.

### Check the boundary before inference

Use harmless synthetic sentinel files, not secrets or actual grading answers.
Exercise the same resolved permission policy and working root that the runner
will use. The installed `codex sandbox --help` describes command-only probes;
use those without launching a model. Retain the command, outcome, and policy.

- Reading the intended input and complete candidate package succeeds.
- Required writes succeed only in the approved workspace/output locations.
- Reading a sentinel beside the workspace or in the evaluator area fails.
- Writing outside the workspace fails; a symlink to an outside sentinel does
  not grant access. Check both relative traversal and absolute paths.
- Command networking is denied when not required, and required local tooling
  still works. No probe should contact production services.

Separately inspect startup instruction discovery and the skill/tool catalog.
Command restrictions do not prove the client omitted ancestor AGENTS.md,
personal instructions, or plugin skills before the first model call. Exclude
unintended context through supported controls or relocate the trial root. Do
not declare a native discovery test clean until its actual catalog is known.

### Launch and capture

Confirm the installed `codex exec --help` and `codex --version` before composing
the command. Start a new `codex exec` per independent trial, not `resume` or a
history-carrying fork. Use `-C` for the prepared working copy, `-m` for the
approved model, and supported configuration for reasoning and permissions.
Supply only the approved task request via stdin; do not append the Task Spec,
review discussion, hidden criteria, or previous answers.

Use `--json` to capture events and `--output-last-message` for the final response.
The coordinator retains those files, stderr, exit status, resolved settings,
and actual output artifacts under the run directory outside candidate access.
Do not mistake the final response for a complete trace or an actual workbook.
Check which events the installed version exports and report missing evidence.

Use the verified folder policy and context boundary. Do not bypass approvals
or sandboxing to make an eval run. Use the host's approved authentication without
copying secrets into task files. Monitor under the agreed timeout; retain partial
evidence and terminal status on failure. Keep one session across declared turns
of a multi-turn task, but never across independent trials.

These flags are covered by [Codex non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode).
Follow [Codex skill discovery](https://learn.chatgpt.com/docs/build-skills) for
placement and recheck the installed version rather than assuming every host has
the same options.

## Fresh-context subagent workflow

Use folder-restricted subagents only when the host exposes a working-root and
enforced permission policy for the child, or the child demonstrably inherits a
parent already restricted to that one trial. Run the same boundary checks.
Do not confuse an instruction to use a directory with a permission setting.
If the spawn API offers neither control, report that limitation and use the
folder-restricted CLI instead; do not invent child permission parameters.

Use the host's fresh-context option, such as `fork_turns: "none"` when available.
Provide the approved task request and intended environment only. Do not inherit
the coordinator's conversation, hypotheses, grading guidance, or prior outputs.

Before spawning, verify that the host can provide the intended working copy,
skill discovery, tools, model, and reasoning settings. If its interface cannot
establish those conditions, do not invent parameters or treat a prompt telling
the agent to stay in a folder as enforcement. Use a capable runtime instead.
A role with a fixed model is unsuitable when it conflicts with the run plan.

Start one new agent per independent trial. Collect actual artifacts and available
messages/tool events as it works; wait for a terminal result and record the agent
identity and status. Do not send corrective hints during a scored trial. Later
user turns must follow the approved task policy. A final summary without needed
traces is insufficient for process or activation claims.

## Explicit and implicit invocation

For explicit-use tasks, name the skill as a user normally would. For implicit
discovery, use the ordinary request with the skill already available in the
environment; do not name it, paste its body, or tell the agent that selecting it
is the test. Include should-use, near-miss, and should-not-use tasks when testing
discovery.

Use observed skill loading or equivalent native evidence to assess activation.
A good answer alone does not prove invocation. Distinguish non-activation from
an unavailable skill or insufficient traces. Keep activation and task quality
as separate results.

### Build and interpret the trigger set

Label each task's expected selection before running: target should activate,
target should not activate, or a named competing skill should be selected. Use
realistic requests, paraphrases, ambiguous near misses, and requests that share
vocabulary but need a different skill. Keep the complete candidate package
available, not only its description. Freeze the surrounding skill catalog.

Run each task in a fresh context. Inspect native activation evidence rather than
asking the agent whether it used the skill. Record target activation, competing
activations, availability, and evidence sufficiency. Report false triggers and
missed triggers with separate denominators; unavailable or unobservable trials
are not negative labels. Judge task outcomes separately from selection.

Repeat tasks only when activation variability could change the conclusion and
the budget permits. Keep tuning examples separate from fresh validation tasks.
If revising the description, check both held-out trigger behavior and execution
quality; improving discovery can attract tasks the skill cannot perform.

## Collect and hand off

Preserve files, hashes or revision IDs, complete available traces, timing/usage
when supplied, and termination status before recycling a workspace. Keep the
candidate mapping and grading material in the coordinator's run record. Audit
validity using [Calibration](calibration.md), then present outputs through
[Human review](review.md). No automatic reruns beyond approved limits.
