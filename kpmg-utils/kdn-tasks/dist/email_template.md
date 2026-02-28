---
name: kdn-task-writer-email-template
description: Use this template when writing KDN Task Writer emails.
---

## How to use this file

- Use **Standard email** for nightly instructions on an existing deal.
- Use **Initiation email** when setting up a new deal and defining Deal preferences.
- For each request, choose one primary pattern (Initiation or Standard). If the request clearly blends both, clarify via an Assumptions & Questions block and then choose the best fit.
- Use `{placeholder}` syntax ONLY for dates (`{YYYY-MM-DD}`), project names (`{Project}`), and people names (`{First name}`). For files and tabs, use generic descriptors like "the databook" or "a new tab"—never invent names like `{databook_name}`.
- When you need to call out blocking assumptions or questions, use the Assumptions & Questions block **above** the email body, using the standard format from the style guide.
- A `---` separator is acceptable between the assumptions block and the email. Do NOT use `---` between tasks or elsewhere in the email body.
- Use relative paths like `{Project}/On-shore Inputs/{YYYY-MM-DD}` and `{Project}/KDN Outputs/{YYYY-MM-DD}` (the associate pastes their SharePoint base URL).

## Assumptions block (use sparingly)

**Most requests do NOT need this block.** Only use when critical information is missing AND you cannot produce a usable email without it:

```text
📋 **Assumptions & Questions**
Critical assumptions:
• {Assumption 1}
• {Assumption 2}
Clarifying questions:
• {Question 1}
• {Question 2}  (or "none")
```

- No numbering; bullets only.
- A `---` separator after this block is acceptable.

# Standard email

Use this template for nightly instructions. Match the casual, direct style of real associate emails.

[Optional: If there are blocking assumptions or questions, insert the Assumptions & Questions block above the subject line using the canonical format.]

[Subject: ONLY project name, nothing else — bold in output]
**Subject: Project {project_name}**

[Greeting: Use KDN name if known from context; otherwise "KDN Team" or "Team"]
Hi {KDN_name},
or
KDN Team,
or
Team,

Hope you are well. Please see the following tasks for {project_name} today:

[Context: Optional 1 sentence, max 15 words. Example: "Tonight: Jun-25 roll-forward and AR aging update."]

📁 {YYYY-MM-DD}

1. {Task title}:
   a. {Substep with specific detail}
   b. {Substep with requested check, if any}
   *{Short note if needed}

2. {Task title}:
   a. {Substep}
   b. {Substep}

Save to: {project_name}/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

# Initiation email

Use this template when setting up a new deal. **REQUIRED sections: Deal preferences AND Target overview.** Do not skip these sections for initiation emails.

[Optional: Assumptions & Questions block above the subject line if deal details are incomplete.]

[Subject: ONLY project name, nothing else — bold in output]
**Subject: Project {project_name}**

Greeting:
`KDN Team,` or `Team,`

A new {deal_type} deal requires your assistance.

Deal preferences
- Currency: {currency_code} ({units})
- Accounting basis: {US GAAP / IFRS / other}
- Naming: {file and tab naming conventions}
- Year-end: {month day}
- Scope: {periods, e.g., FY23, FY24, YTD25}

Target overview
- Client: {client_name}
- Target: {target_name(s)}
- {Brief description of business}

📁 Initial files: {folder_date or list of key files once available}

Initial tasks

1. {Task title}:
   a. {Substep}
   b. {Substep}

2. {Task title}:
   a. {Substep}
   b. {Substep}

Save to: {project_name}/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

