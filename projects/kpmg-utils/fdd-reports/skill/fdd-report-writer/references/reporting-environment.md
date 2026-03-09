# Section contract: Policies

## Table of contents

- Section objective
- Core principles
- Analytical workflow
- Section architecture
- Typical content areas
- Assembly patterns
- Section-specific writing guidance
- Verification and review checks
- Full examples

## Section objective

The Policies section summarizes the company-specific policies that matter to diligence. In most cases, this section is primarily a financial reporting and accounting policy section, so it should explain the reporting basis, assurance background, close process, systems, key accounting policies, and the team structure that supports financial reporting. However, the section can also be used for other policy areas, such as payroll, benefits, IT, or other target-company policies, when those are the user’s focus or are materially relevant to the analysis.

The goal is to explain how a policy works in practice, who owns it, how often it operates, what systems or processes support it, and why it matters for interpreting the business or the reported numbers. Summarize the policy in company-specific language rather than repeating policy text word for word.

Global writing, placeholder, and language rules are defined in `references/global-writing-conventions.md` and apply here.

## Core principles

1. **Match the section title and scope to the user’s context:** The heading may be `Reporting environment`, `Accounting policies`, `Finance and reporting policies`, `Payroll and benefits policies`, `IT policies`, or another policy-focused label depending on the request.
2. **Default to financial reporting policies when the ask is broad:** If the user asks for this section generally, lead with reporting basis, assurance, close process, systems, finance-team ownership, and the key accounting policies that shape the reported numbers.
3. **Keep policy discussion company-specific:** Explain how the policy operates at the Company, not how the accounting standard or policy manual reads in the abstract.
4. **Show how the policy actually works:** Include cadence, workflow, approvals, ownership, system inputs, thresholds, estimates, or exceptions when they explain how the policy is applied in practice.
5. **Use team and ownership context where it matters:** Describe the staff, composition, outsourcing, or shared-service structure when it helps the reader understand how the policy is executed or controlled.
6. **Keep assurance and reporting basis explicit where relevant:** Distinguish audited, reviewed, compiled, and management-prepared information clearly when the section is financial-reporting focused.
7. **Focus on material policies and implications:** Cover the policies that affect reported numbers, operating interpretation, or diligence conclusions. Do not reproduce immaterial handbook language or generic boilerplate.
8. **End with what the policy means for the reader:** Make clear how the policies should shape interpretation of the financial analysis, the operating model, or the specific topic the user asked about.

## Analytical workflow

1. **Define the requested policy scope:** Determine whether the user wants the default financial reporting environment, a specific policy area such as payroll or IT, or a broader mix of policy topics.
2. **Review all provided source material before drafting:** Pull the relevant policies from the full report contents, management materials, policy summaries, audit background, system descriptions, and team information provided by the user.
3. **Anchor the section in the right context:** If the section is reporting-focused, confirm the framework, entity coverage, assurance status, and reporting layers first. If the section is non-financial, confirm the function, policy owner, and operating scope first.
4. **Identify the core policy topics:** Focus on the policies that most affect reported numbers, process reliability, employee obligations, system governance, or the topic requested by the user.
5. **Map ownership, cadence, and execution:** For each material policy area, identify who owns it, how often it operates, what systems or support it relies on, and where manual intervention or judgment enters the process.
6. **Summarize the policy in practical terms:** State how the policy works, the important thresholds or mechanics, and any exceptions or limitations that matter to the reader.
7. **Add policy-change or framework-transition context where relevant:** Include changes in auditors, frameworks, systems, accounting treatment, or policy application only when they affect interpretation or comparability.
8. **Describe the implications:** Explain how the policy affects the financial analysis, the operating model, or the requested topic, rather than ending with policy description alone.
9. **Stop when the policy is fully interpretable:** Include enough detail for the reader to understand how the policy operates and why it matters, but do not turn the section into a policy manual or a controls audit.

## Section architecture

Scale the section based on the breadth of policy topics requested, the amount of execution detail needed, and the extent to which policy ownership, systems, or transitions affect interpretation.

**Verbosity:**

- Stop adding detail when the reader can understand which policies matter, how they operate in practice, who owns them, and what they mean for the analysis. In most cases, aim for 6-14 bullets or numbered items and roughly 450-1,050 words. Move above that range only when the section covers multiple policy areas, mixed assurance or framework issues, or a policy topic that requires deeper practical explanation.

**Required content areas:**

- Scope and basis
  - Define what policy area the section covers and the context in which it should be read.
- Core policy commentary
  - Explain the material policies in practical, company-specific terms.
- Ownership and process context
  - Show who owns the policy and how it is executed when that matters to interpretation.

**Optional content areas:**

- Assurance and audit background
  - Add when the section is financial-reporting focused and audit status or assurance mix affects reliance.
- Close process and reporting cadence
  - Add when close timing, year-end-only entries, or review cadence affects how reported numbers should be read.
- Systems and data flow
  - Add when the policy depends on specific systems, integrations, uploads, or manual journals that affect execution or reliability.
- Policy change or framework transition
  - Add when a change in accounting framework, auditor, system, or policy application affects comparability or interpretation.
- Non-financial policy areas
  - Add when the user asks for payroll, benefits, IT, HR, treasury, or other policy topics beyond financial reporting.
- Diligence implication
  - Add when the reader needs an explicit statement of how the policy should affect QoE, NWC, net debt, balance-sheet, operating, or other analysis.

**Data / information typically needed:**

- The user’s requested policy scope or the full report contents if the policy topics need to be inferred
- Audited financial statements, management accounts, or statutory accounts where relevant
- Audit status, review status, compilation status, or other assurance information where relevant
- Policy summaries, accounting memos, management explanations, or process descriptions
- Close calendars, reporting cadence notes, and reviewer or approver roles where relevant
- Finance, accounting, HR, payroll, IT, or other function ownership and team composition where relevant
- ERP, payroll, consolidation, reporting, or other system architecture information where relevant
- Known policy changes, framework transitions, manual processes, or limitations affecting interpretation

**Data mapping considerations:**

- Start with the policy scope the user actually wants. If the request is broad, default first to the financial reporting environment and accounting policies.
- Group related policy points into natural topics rather than listing disconnected facts.
- For each policy, explain what it is, how it operates, who owns it, how often it is applied, and why it matters.
- Include team composition when it explains execution, control, continuity, or dependence on a small number of people.
- Include systems and manual dependencies only when they help explain how the policy is implemented or where risk or interpretation enters.
- Quantify where useful, such as team size, close timeline, payroll cadence, bonus terms, or policy thresholds.
- Summarize policy content in report-writing language rather than quoting policy manuals or accounting standards word for word.
- If the source support is thin, use concise inline placeholders for missing policy detail rather than broad filler.

**Formatting principle:**

- Use a short opening scope line followed by bulleted or numbered policy commentary grouped in the order most natural for the requested topic.
- When a policy or topic is clear, use the topic name followed by a colon in bold, then explain how the policy works in practice.
- Match the section title to the user’s context. Use titles such as `Reporting environment`, `Accounting policies`, `Finance and reporting policies`, `Payroll and benefits policies`, or `IT policies` as appropriate.
- Format fiscal years as `FY24`, `FY25`, etc. Format monetary amounts as `$x.x million`, and use full amounts such as `$325,000` or `$90,000` for balances below `$0.1 million`.

**Ordering rules:**

- For a broad or default policy section, use this order: scope and basis -> assurance or reporting background -> close process -> systems and team ownership -> key policies -> diligence implication.
- For a pure accounting-policy section, use this order: scope and reporting basis -> key accounting policies -> estimates or judgment areas -> transition or comparability points -> implication.
- For a non-financial policy section, use this order: scope -> ownership and process -> core policy bullets -> exceptions or terms -> implication.
- If financial reporting and non-financial policies both appear, lead with the financial reporting environment first unless the user clearly prioritizes another topic.

## Typical content areas

Use these as the main building blocks for the section. Choose only the content areas the draft actually needs.

The standard pattern is a short scope-setting line followed by policy commentary grouped by topic.

Placeholder usage follows `references/global-writing-conventions.md` and is not restated in each content-area definition.

### Scope and title note

- Purpose: define what policy area the section covers and how the reader should frame it.
- Use when: opening the section.
- Skip when: never; this is the normal entry point.
- Target length: 15-40 words.
- Source note: usually not needed.
- Example: `The section below summarizes the Company’s reporting environment and the accounting policies that most affect historical comparability and interpretation of the financial analysis.`

### Reporting basis and assurance

- Purpose: explain the reporting framework, assurance status, and the main implication for reliance.
- Use when: the section is financial-reporting focused.
- Skip when: the user requested a non-financial policy topic only.
- Target length: 25-75 words.
- Source note: recommended.
- Example: `**Reporting basis and assurance:** The Company reports under IFRS, with audited consolidated financial statements through FY24 and management-prepared monthly packs used for FY25 YTD analysis. Annual periods can therefore be used as the primary anchor for trend work, while interim periods should be read together with the estimate and close-process notes below.`

### Close process and reporting cadence

- Purpose: explain how often the books or policy cycle is run and where timing or review differences matter.
- Use when: close speed, year-end-only entries, payroll cycles, quarterly reviews, or similar cadence affects interpretation.
- Skip when: cadence adds no meaningful context.
- Target length: 25-80 words.
- Source note: recommended.
- Example: `**Close process:** Month-end close is typically completed within four business days, with quarter-end and year-end closes following the same core process plus additional review over reserve, deferred revenue, and intercompany balances.`

### Team and ownership

- Purpose: explain who owns the policy and how the team structure affects execution or reliance.
- Use when: team composition, outsourcing, shared-service dependence, or concentrated ownership matters.
- Skip when: ownership detail adds no interpretive value.
- Target length: 25-80 words.
- Source note: recommended.
- Example: `**Finance team:** The finance function is led by the CFO and comprises 11 FTEs across controllership, FP&A, payroll, and treasury. The team structure supports monthly consolidation internally, although policy knowledge remains concentrated with the Controller and VP Finance.`

### Systems and data flow

- Purpose: explain the systems and interfaces that support the policy or reporting process.
- Use when: ERP, payroll, consolidation, reporting, or manual uploads materially shape execution.
- Skip when: the content would become a software inventory with no policy implication.
- Target length: 25-80 words.
- Source note: recommended.
- Example: `**Systems:** The Company uses Business Central as its ERP, Workday for payroll and HR, and a separate consolidation model for group reporting. Payroll and certain operating systems are uploaded through scheduled interfaces, with manual reclasses concentrated in consolidation and shared-service allocations.`

### Accounting policy summary

- Purpose: explain a specific accounting or reporting policy in practical company-specific terms.
- Use when: the section includes revenue recognition, leases, capitalization, provisions, loyalty, ECL, commissions, or other financial policies.
- Skip when: the point is just a generic accounting-standard summary.
- Target length: 35-110 words.
- Source note: recommended.
- Example: `**Revenue recognition:** Subscription revenue is recognized ratably over the service period, while implementation revenue is recognized using an input method based on labour hours incurred relative to total expected project hours. Monthly contract-asset and contract-liability entries are recorded where actual billings differ from revenue recognized.`

### Estimate or judgment note

- Purpose: explain where management judgment, assumptions, or year-end true-ups affect the policy outcome.
- Use when: reserves, provisions, loyalty balances, bonus commissions, impairment, or other judgment-heavy items are material.
- Skip when: the policy can be understood without discussing estimates.
- Target length: 25-80 words.
- Source note: recommended.
- Example: `**Expected credit losses:** ECL is model-based and reviewed formally each quarter by the CFO and credit-risk leadership. Monthly results therefore reflect the standing reserve approach, while quarter-end periods may include larger assumption updates and overlay entries.`

### Payroll or benefits policy

- Purpose: explain payroll, bonus, vacation, sick leave, or employee benefits policies when requested or relevant.
- Use when: the user asks for people-related policies or the source materials emphasize them.
- Skip when: the section is strictly financial-reporting focused and these policies do not matter to the request.
- Target length: 25-90 words.
- Source note: recommended.
- Example: `**Payroll and benefits:** Employees are paid bi-weekly, with short-term bonuses paid in the following fiscal year and long-term incentives vesting over three years. Employees are entitled to three to five weeks of vacation based on tenure, with up to one week permitted to be carried forward.`

### IT or systems policy

- Purpose: explain IT governance, system access, data ownership, or related operating policies when requested or materially relevant.
- Use when: the user asks for IT policies or system governance materially affects reporting or operations.
- Skip when: IT detail is not relevant to the section’s purpose.
- Target length: 25-90 words.
- Source note: recommended.
- Example: `**IT policy environment:** Core finance, payroll, and reporting systems are maintained internally, with user access administered centrally and reviewed periodically by finance and IT leadership. Key reporting outputs are therefore generated within controlled systems, although certain consolidation steps remain spreadsheet-based.`

### Policy change or framework transition

- Purpose: explain a change in framework, auditor, system, or policy application that affects comparability or interpretation.
- Use when: there is an audit change, framework bridge, system conversion, or policy transition that matters to the reader.
- Skip when: no material transition exists.
- Target length: 20-70 words.
- Source note: recommended.
- Example: `**Framework transition:** Standalone statutory entities report under local GAAP, while group reporting is prepared under IFRS. Historical periods should therefore be read using the consolidation bridge rather than the statutory accounts in isolation.`

### Diligence implication

- Purpose: state what the policy environment means for the reader’s analysis.
- Use when: the policy discussion changes how the numbers, operations, or requested topic should be interpreted.
- Skip when: the implication is already obvious from the preceding bullets.
- Target length: 20-70 words.
- Source note: usually not needed.
- Example: `**Implication for diligence:** Annual audited periods can be relied on as the main basis for trend analysis, while interim periods should be normalized for quarterly estimate updates and any year-end-only true-up entries.`

## Assembly patterns

Use one of these patterns based on the policy scope. These are practical guides, not fixed templates.

### Default reporting environment section

- Usual flow: scope note -> reporting basis and assurance -> close process -> systems and team ownership -> key accounting policies -> diligence implication.
- In practice, this pattern often uses 6-10 bullets.
- Aim for 6-10 bullets plus one small exhibit only if the incoming data shape is important to show.
- Stop adding detail when the reader understands how the reported numbers are prepared, who drives the process, and which policies matter most.

### Accounting-policy deep dive

- Usual flow: scope note -> reporting basis -> multiple accounting policy bullets -> estimate or transition notes -> implication.
- In practice, this pattern often appears where revenue recognition, leases, ECL, contingent commissions, loyalty, or capitalization policies materially affect interpretation.
- Aim for 6-12 bullets or numbered items.
- Stop adding detail when each material policy is clear in terms of practical application and financial statement effect.

### Functional policy section

- Usual flow: scope note -> ownership and cadence -> payroll, benefits, IT, or other requested policy bullets -> exceptions or terms -> implication.
- In practice, this pattern often applies when the user asks for a specific non-financial policy topic.
- Aim for 5-9 bullets or numbered items.
- Stop adding detail when the reader understands how the requested policies operate in practice and where the main obligations, exceptions, or dependencies sit.

## Section-specific writing guidance

1. Match the section title to the actual topic requested rather than forcing everything into `Reporting environment`.
2. Use bold topic labels and explain how the policy works in practice instead of paraphrasing a policy document line by line.
3. Include ownership, cadence, and key terms or thresholds when they materially affect how the policy should be understood.
4. Keep audit, assurance, or limitation language factual and brief.
5. Keep systems, staffing, and process detail only where it helps explain policy execution or interpretation.

## Verification and review checks

**Verification questions:**

- Does the section title and opening scope line match the policy topic the user actually asked for?
- If the request is broad, does the section cover the reporting basis, key policy topics, and the team or process context needed to understand them?
- For each material policy, does the section explain how it works in practice, who owns it, and why it matters?
- Where relevant, does the section include cadence, systems, manual dependencies, or estimate mechanics rather than describing the policy at a purely abstract level?
- If there is an assurance, framework, or policy-transition issue, is it stated clearly and tied to interpretation?
- Does the section stay company-specific and avoid reciting policy wording or accounting standards word for word?

## Full examples

These examples show content flow, not required headings or exact bullet counts.

The examples below show the style of policy commentary the skill should draft. The section title changes based on the policy topic requested.

### Example 1: Reporting environment and accounting policies

```markdown
## Reporting environment

- The section below summarizes the Company’s reporting environment and the accounting policies that most affect interpretation of the historical financial analysis.

- **Reporting basis and assurance:** The Company prepares consolidated financial statements under IFRS, with audited annual financial statements through FY24 and management-prepared monthly reporting packs used for FY25 YTD analysis. Annual periods therefore form the primary basis for trend work, while interim periods should be read together with the close-process and estimate notes below.
- **Close process:** Month-end close is typically completed within four business days. Quarter-end and year-end follow the same core process, with additional review over deferred revenue, capitalization, intercompany balances, and accruals before financials are approved by the CFO.
- **Finance team:** The finance function is led by the CFO and comprises 12 FTEs across controllership, FP&A, payroll, and treasury. Monthly reporting is prepared internally, although policy knowledge for consolidation and capitalization remains concentrated with the Controller and VP Finance.
- **Systems:** The Company uses Business Central as its ERP, Workday for payroll and HR, and a separate consolidation model for board and lender reporting. Payroll and selected operating-system data are uploaded through scheduled interfaces, while consolidation and shared-service allocation entries include a limited number of manual journals.
- **Revenue recognition:** Subscription revenue is recognized ratably over the contract term, while implementation revenue is recognized using an input method based on labour hours incurred relative to total expected project hours. Contract assets and liabilities are recorded monthly where billings differ from revenue recognized.
- **Capitalized development costs:** Internal and external development costs are capitalized once projects move beyond the preliminary stage and meet the Company’s IAS 38 criteria. Capitalized costs consist primarily of labour and are amortized over three to five years once the related software is placed in service.
- **Reserve and estimate areas:** The Company’s principal judgment areas are deferred revenue, expected implementation margins, and annual bonus accruals. These balances are reviewed monthly, with more formal challenge and true-up procedures performed at quarter-end and year-end.
- **Implication for diligence:** Annual audited periods can be relied on as the main basis for historical analysis. Interim periods should be normalized for quarter-end estimate updates and for any capitalization or accrual true-ups recorded outside the standard month-end process.
```

### Example 2: Payroll, benefits, and IT policies

```markdown
## Payroll, benefits, and IT policies

- The section below summarizes the Company’s payroll, incentive, employee-benefit, and related IT administration policies as they operate in practice.

- **Team ownership:** Payroll and benefits administration is owned jointly by the HR Director and Payroll Manager, with payroll processing supported by a third-party provider and final approval performed internally by Finance.
- **Payroll cycle:** Employees are paid bi-weekly, with payroll covering the prior two-week work period and cash disbursed on the following Friday. Executive payroll follows the same cycle, while commission and overtime balances are reviewed and approved separately before each run.
- **Short-term incentives:** Annual bonuses are paid in the first quarter following the fiscal year-end and are based on role-specific target percentages and company performance measures. Bonus accruals are recognized during the year through the monthly close.
- **Long-term incentives:** Senior management participates in a three-year cash-settled long-term incentive plan linked to EBITDA and strategic objectives. Amounts are accrued over the service period and paid following the applicable vesting date.
- **Vacation and leave:** Employees receive three weeks of vacation on hire, increasing with tenure, and may carry forward up to one week of unused vacation into the following year. Sick days do not carry forward and are not paid out on termination.
- **Benefits administration:** Health, dental, and disability coverage are administered through a national broker, with employee deductions processed directly through payroll. Changes in employee status, salary, and participation are updated in the HRIS before the payroll cut-off for the next pay period.
- **IT administration:** Payroll and HR data are maintained in the Company’s HRIS, with user access administered by IT and reviewed periodically by HR and Finance. Payroll files are transferred to the third-party processor through controlled exports rather than manual re-entry.
- **Implication:** These policies are operationally standard, but the annual bonus and long-term incentive programs create recurring accrual balances, and the HRIS-to-payroll interface should be understood when interpreting payroll-related working-capital and compensation trends.
```
