# Judge Design

Use a judge only when code cannot decide the criterion.

## Rules

- One judge per failure mode.
- Binary verdict only: `Pass` or `Fail`.
- Define the criterion in observable terms.
- Include at least one pass example and one fail example.
- Ask for critique before verdict.

## Good fit for a judge

- whether the output is complete
- whether the structure is faithful to the requested contract
- whether the instructions are materially ambiguous

## Bad fit for a judge

- whether a required heading exists
- whether YAML is valid
- whether a link resolves
- whether a phrase is present

## Template

```markdown
# Judge: <name>

## Task
Evaluate whether the output satisfies <one criterion>.

## Pass Definition
<observable pass condition>

## Fail Definition
<observable fail condition>

## Examples
### Pass
<real pass example>

### Fail
<real fail example>

## Output
Return JSON only:
{"critique":"brief observation","result":"Pass"}
```

## Validation

Before trusting a judge:

- run it on a few known pass cases
- run it on a few known fail cases
- confirm it is not just echoing stylistic preference
