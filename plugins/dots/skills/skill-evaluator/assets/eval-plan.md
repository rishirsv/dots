# Evaluation plan

- **Status:** Draft
- **Suite ID:** `<stable-id>`
- **Target:** `<skill name and repository-relative path>`
- **Target versions:** `<file IDs, paths, and SHA-256 hashes>`
- **Decision:** `<what this evidence will help the user decide>`
- **Claim:** `<one bounded behavioral claim>`
- **Claim kind:** `<absolute | incremental | regression | readiness | triggering | efficiency | evaluator-validity>`
- **Evidence level:** `<unproven | informally tested | established suite | mature benchmark>`
- **Why this level:** `<observed evidence and missing proof>`

## Configurations

| ID | Role | Skill/version | Host and model | Tools and permissions |
|---|---|---|---|---|
| `<id>` | `<target | baseline | candidate | comparison>` | `<ref and hash>` | `<resolved configuration>` | `<bounded set>` |

## Cases or sampling method

For each case record its stable ID, split, realistic request, fixtures,
configuration IDs, criteria, expected and prohibited outcomes, accepted
alternatives, independent evidence, invalid-run conditions, and dependency IDs.

If records will be sampled, describe the population, random component, cluster
or coverage component, exclusions, seed, and stopping rule.

## Evidence and visibility

- **Worker-visible fixtures:** `<IDs>`
- **Hidden evidence:** `<IDs and why workers cannot see it>`
- **Graders:** `<criterion, kind, implementation/model hash, calibration>`
- **Blind comparison:** `<none or coordinator mapping and decision paths>`
- **Holdout policy:** `<fresh confirmation boundary>`

## Run policy

- **Repetitions:** `<count and reason>`
- **Timeout:** `<per trial>`
- **Maximum expected cost:** `<amount or none>`
- **External mutations:** `<false or exact authorized effects>`
- **Stopping rule:** `<when enough evidence exists or work must stop>`

## Invalid-run conditions

`<conditions that produce no skill outcome>`

## Conclusion limits

`<configurations, cases, populations, and decisions this evidence cannot cover>`

## Approval

- **Approved by:** `<user identity or null>`
- **Approved at:** `<ISO timestamp or null>`
- **Approved contract SHA-256:** `<digest or null>`

Approval covers the evaluation contract, not permanent freshness of target,
fixture, grader, or runtime versions. Those hashes are resolved for every run.
