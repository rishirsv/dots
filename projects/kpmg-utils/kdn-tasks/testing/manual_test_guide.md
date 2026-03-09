# KDN Task Writer - Manual Test Guide

## Overview

This document provides 10 test prompts for manually evaluating the KDN Task Writer GPT. Run each prompt through the GPT and evaluate the output against the criteria provided.

## Gold Standard Reference

The target output style is based on real onshore associate emails from the KGS Thread examples. Key characteristics:

**Onshore Associates (the style we're mimicking):**
- Victoria Hatanaka, Vivien Lieu, Rishi Sharma, Mitchell Tomlin, Cindy Xie, Scott Cronin

**Their Writing Patterns:**
- Numbered tasks (1, 2, 3) with lettered/bulleted sub-steps
- Specific file references: `*filename.xlsx*` with tab `<Tab Name>` or `'Tab Name'`
- Inline verification embedded in steps (not separate sections)
- Folder date references: `📁 2025-06-24`
- Notes with asterisk prefix: `*Note the new payroll GL accounts...`
- Direct, concise tone without boilerplate

---

## Evaluation Rubric

### Scoring Scale: 1-7

| Score | Description |
|-------|-------------|
| 7 | Excellent - Send-ready, matches gold standard perfectly |
| 6 | Very Good - Minor formatting issues only |
| 5 | Good - Usable with light editing |
| 4 | Acceptable - Requires moderate editing |
| 3 | Below Average - Structure issues, missing elements |
| 2 | Poor - Major gaps, wrong format |
| 1 | Unacceptable - Does not follow instructions |

### Evaluation Dimensions

**A. Structure (25%)**
- [ ] Greeting format correct ("Hi {Name}," or "Team," or "KDN Team,")
- [ ] Tasks numbered (1, 2, 3) with lettered sub-steps (a, b, c) or bullets
- [ ] Single save location at end (not repeated per task)
- [ ] No horizontal dividers (`---`)
- [ ] Subject line format: `Project {Name}` (no date prefix, no "KDN-" prefix)

**B. File References (25%)**
- [ ] File names in italics: `*TrialBalance_2025-06-30.xlsx*`
- [ ] Tab names in angle brackets `<IS|Combined>` or quotes `'mapping'`
- [ ] Cell references in backticks: `` `Combined BS!C28` ``
- [ ] Specific ranges/rows mentioned where applicable

**C. Verification & Completeness (25%)**
- [ ] Tie-outs/checks embedded inline within task steps
- [ ] NO separate "Acceptance checks" section
- [ ] Each task has clear objective (what outcome is expected)
- [ ] Assumptions documented with `*Note...` prefix
- [ ] Missing info uses `{placeholder}` format

**D. Tone & Style (25%)**
- [ ] Active voice, direct instructions
- [ ] No boilerplate phrases ("let us know if questions", "please confirm receipt")
- [ ] No job title in signature (just first name)
- [ ] No bold on action verbs within steps (only task titles bold)
- [ ] Acronyms used correctly per style guide (TB, IS, BS, QoE, NWC, etc.)

---

## Anti-Patterns to Flag

Mark these as failures if present:

1. **Vague file references**: "Update the databook" without specifying which file/tab
2. **Separate verification section**: "Acceptance checks:" as its own section
3. **Boilerplate closing**: "Please let us know if you have any questions"
4. **Bold action verbs**: "**Add** the column..." within steps
5. **Repeated save locations**: Save path mentioned multiple times
6. **Time estimates**: "This should take about 2 hours"
7. **Invented specifics**: Made-up file names, thresholds, or dates not in the prompt
8. **Over-explaining**: Lengthy explanations of why to do something
9. **Offering extras**: "I can also create a summary document if helpful"
10. **Internal reasoning**: "Based on my analysis..." or planning text visible

---

## Test Prompts

### TEST 1: Voice Dictation - Complex Multi-Workstream

**Category:** Voice transcription / rambling input
**Difficulty:** High
**Tests:** Parsing multiple workstreams, capturing specifics, organizing chaotic input

**Input Prompt:**
```
Tonight for Project Falcon we need to get the databook updated. The client sent over the June trial balances yesterday, they're in the shared folder. Make sure you map everything using the same mapping we used for the May TBs, I think those were from Dynamics. Roll forward the IS through June for all the entities and the combined, and don't forget the topside calculation. Also the BS needs June too. There's a variance in the AR aging from last week that we never figured out, can you take another look at that? I think it was like 15k off from the control account. Oh and the payroll registers came in for May and June finally. Process those into the database and update the headcount analysis. Flag any new employees that don't have role mappings. For the QofE, just extend the reported numbers through June, don't touch the adjustments yet. Save everything to the usual output folder.
```

**Document Context:**
```
Files available:
- June 2025 trial balances (Dynamics export) in shared folder
- Existing mapping from May TB processing
- AR aging working file with ~$15k variance to Combined BS
- May-June 2025 payroll registers
- Employee role mapping tab in databook
```

**Expected Output Elements:**
- 4-5 numbered tasks covering: IS/BS roll-forward, AR aging investigation, payroll processing, QofE extension
- Reference to June TBs and existing Dynamics mapping
- Specific mention of ~$15k AR variance to investigate against control account
- Instruction to flag unmapped employees (yellow highlighting)
- Note about not touching QofE adjustments (reported numbers only)
- Topside calculation mentioned for IS
- Single save location at end

**Key Evaluation Points:**
- Did it separate the rambling into distinct tasks?
- Did it capture the $15k variance detail?
- Did it note the "don't touch adjustments" constraint?
- Is the output organized logically despite chaotic input?

---

### TEST 2: Short Bullet Notes

**Category:** Terse bullet input
**Difficulty:** Medium
**Tests:** Expanding abbreviated instructions, inferring standard practices

**Input Prompt:**
```
Project Cedar tonight:
- process new GL export into vendor tables
- need billing fees, professional services, office supplies
- opening/activity/ending format like the example
- tie back to IS
- also finish the lease summary from yesterday
- client wants monthly rent by location
```

**Document Context:**
```
Files available:
- GL export file (Jan-25 through May-25)
- Vendor table example template in databook
- Lease agreements by location (12 locations)
- Prior day's incomplete lease summary tab
```

**Expected Output Elements:**
- Task 1: GL vendor tables for three specific accounts (billing fees, professional services, office supplies)
- Structure specified: opening balance, activity, ending balance
- Source check row tying to Consolidated IS
- Task 2: Complete lease summary with monthly rent by location
- Reference to example template for format consistency

**Key Evaluation Points:**
- Did it expand bullets into actionable sub-steps?
- Did it infer the need for source checks (standard practice)?
- Did it maintain the specific accounts requested?
- Did it reference the example template?

---

### TEST 3: Initiation Email - New Deal

**Category:** Deal setup / initiation
**Difficulty:** Medium
**Tests:** Initiation format, Deal Preferences, handling missing info

**Input Prompt:**
```
New project coming in. Client is Meridian Capital, target is Pacific Home Services which does home healthcare in California and Nevada. Buy-side deal. Scope is FY23, FY24, and YTD through May 2025. Year end is December. They sent over the sell-side databook and GL exports. We need to set up the IS and BS by entity, build a consolidated and consolidating view, and create the standard databases. Also need to convert their COA to our standard mapping. Let me know if you need the SharePoint links.
```

**Document Context:**
```
Files available:
- Sell-side databook (Excel)
- GL exports FY23-YTD May-25
- COA/Chart of accounts file
(SharePoint links not yet provided)
```

**Expected Output Elements:**
- Initiation email format (not standard nightly)
- Deal Preferences section with: Currency (USD assumed), Accounting basis (US GAAP assumed), Year-end (Dec-31), Scope (FY23, FY24, YTD May-25)
- Target overview: Meridian Capital / Pacific Home Services / home healthcare CA & NV
- Initial tasks: IS/BS by entity, consolidating/consolidated views, COA mapping, database builds
- Placeholder for SharePoint links: `{On-shore Inputs link}` and `{KDN Outputs link}`
- Assumptions stated clearly at top

**Key Evaluation Points:**
- Did it use initiation format (not standard nightly)?
- Did it include Deal Preferences section?
- Did it use placeholders for missing SharePoint links?
- Did it state assumptions about currency/accounting basis?

---

### TEST 4: Detailed Technical Task - Adjustment Database

**Category:** Single-workstream technical task
**Difficulty:** Medium
**Tests:** Capturing field specifications, database structure, dropdown functionality

**Input Prompt:**
```
For Academy, can you build out the adjustment database? It needs to have columns for type (definitional, diligence, pro forma), adjustment number, description, GL number and description, location, and the two mapping fields. Then create a summary tab that rolls up to the QofE detail. Make sure there's a check that ties the database totals to the QofE. Also build the adjusted IS that pulls from this database with a dropdown to select which location you want to see.
```

**Document Context:**
```
Files available:
- Project Academy databook (current version on SharePoint)
- QoE Detail tab (existing)
- Adjustment support files
- Location P&L tabs (13 locations total)
```

**Expected Output Elements:**
- Task 1: Adjustment database with all 8 fields: Type, Adj #, Description, GL #, GL Description, Location/P&L, Mapping 1, Mapping 2
- Monthly columns after the field columns
- Task 2: Summary tab with check row comparing totals to `<QoE Detail>`
- Task 3: Adjusted IS tab with location dropdown selector
- Note about pro forma allocation method (monthly spread if annual)

**Key Evaluation Points:**
- Did it capture all 8 database fields exactly?
- Did it include the check/tie-out to QoE Detail?
- Did it specify the dropdown functionality?
- Did it mention monthly column structure?

---

### TEST 5: Roll-Forward with Specific Checks

**Category:** Standard roll-forward task
**Difficulty:** Low-Medium
**Tests:** Roll-forward pattern, TTM calculation, topside logic, specific checks

**Input Prompt:**
```
For Project Academy, roll forward the databook through July 2025. Update the IS for all locations and the combined/combining tabs. Don't forget the topside. Add TTM July-25 column. For the BS, just do consolidated. The July TBs are in the folder from yesterday. Make sure everything ties to the consolidated IS within $1 and the topside recalculates correctly.
```

**Document Context:**
```
Files available:
- Project Academy databook (through June 2025)
- July 2025 trial balances in 📁 2025-07-28
- 13 location IS tabs plus Combined, Combining, Topside
- Consolidated BS tab
```

**Expected Output Elements:**
- Task 1: Jul-25 IS roll-forward for all location tabs, IS|Combined, IS|Combining
- Task 2: Calculate TTM-Jul 25 column (Aug-24 through Jul-25)
- Task 3: Update IS|Topside (Consolidated minus sum of location P&Ls)
- Task 4: Jul-25 BS roll-forward (consolidated only)
- Verification: Combined IS ties to Consolidated IS within $1
- Verification: Topside recalculates with zero variance
- Reference to July TBs in 📁 2025-07-28

**Key Evaluation Points:**
- Did it include all IS tabs (locations + combined/combining)?
- Did it correctly describe topside calculation?
- Did it specify the $1 tolerance for IS tie-out?
- Did it include TTM column calculation?

---

### TEST 6: Payroll Processing with Reconciliation

**Category:** Payroll/census analytics
**Difficulty:** Medium
**Tests:** Database append, mapping, pivot updates, reconciliation

**Input Prompt:**
```
We got the August payroll registers for Project Maple. Add them to the payroll database. There are probably some new hires that won't have role mappings - flag those in yellow. Update all the pivot tabs - by role, by location, by department. Add TTM August column to the summaries. Also need a reconciliation showing payroll per register versus payroll per IS so we can see where the variance is coming from.
```

**Document Context:**
```
Files available:
- August 2025 payroll register
- Payroll database tab (through July 2025)
- Employee role mapping tab
- Pivot tabs: Payroll by Role, Payroll by Location, Payroll by Department
- IS|Consolidated for compensation line reconciliation
```

**Expected Output Elements:**
- Task 1: Append Aug-25 register to Payroll Database tab
- Task 2: Map new employees using role mapping; flag unmapped in yellow
- Task 3: Update pivot tabs (by role, by location, by department)
- Task 4: Add TTM-Aug 25 column to all summary tabs
- Task 5: Build reconciliation table - Register totals vs IS compensation line
- Reference to specific IS cell for compensation: `IS|Consolidated!{cell}`

**Key Evaluation Points:**
- Did it specify yellow highlighting for unmapped employees?
- Did it list all three pivot tabs to update?
- Did it include the reconciliation structure (register vs IS)?
- Did it mention TTM column addition?

---

### TEST 7: AR/AP Aging Build

**Category:** Working capital / aging schedules
**Difficulty:** Medium
**Tests:** Aging bucket structure, payor-specific build, tie-outs to BS

**Input Prompt:**
```
For Academy, we need to build out AR aging tabs for two more payors - United and Humana. Model them exactly like the Horizon AR aging tab we already have. Use the aging files in yesterday's folder. Make sure the buckets are <30, 30-60, 60-90, 90+ and that the totals tie to the Combined BS AR line. Put a check row at the bottom.
```

**Document Context:**
```
Files available:
- Existing tab: NWC|Horizon AR Aging (template)
- United AR aging source file in 📁 2025-08-15
- Humana AR aging source file in 📁 2025-08-15
- Combined BS with AR control account in cell C28
```

**Expected Output Elements:**
- Task 1: Create NWC|United AR Aging tab modeled on NWC|Horizon AR Aging
- Task 2: Create NWC|Humana AR Aging tab (same structure)
- Aging buckets: <30, 30-60, 60-90, 90+ days
- Source files from 📁 2025-08-15
- Check row tying total to `Combined BS!C28`
- Note about matching Horizon structure exactly

**Key Evaluation Points:**
- Did it reference the Horizon tab as the template?
- Did it specify all four aging buckets?
- Did it include the BS tie-out with specific cell reference?
- Did it create separate tasks or sub-steps for each payor?

---

### TEST 8: QoE and Adjusted IS Build

**Category:** QoE / adjustment work
**Difficulty:** High
**Tests:** QoE structure, adjustment categories, summary vs detail relationship

**Input Prompt:**
```
Set up the QoE for Project Birch. Structure should be Reported, then Definitional adjustments, then Diligence adjustments, then Pro forma. Need both a summary tab and a detail tab. The detail should have monthly columns and roll up to the summary. Also create an Adjusted IS that shows Reported plus each adjustment category. We have the sell-side adjustment support files to work from.
```

**Document Context:**
```
Files available:
- Project Birch databook (IS and BS complete)
- Sell-side adjustment support files
- IS|Consolidated for reported figures
```

**Expected Output Elements:**
- Task 1: QoE Summary tab with structure: Reported | Definitional | Diligence | Pro forma | Adjusted
- Task 2: QoE Detail tab with monthly columns, rolling to Summary
- Task 3: Adjusted IS tab showing Reported + adjustment impacts
- Reference to sell-side support files for adjustment details
- Check ensuring Detail totals tie to Summary
- Note about monthly allocation for annual adjustments

**Key Evaluation Points:**
- Did it specify the correct adjustment sequence?
- Did it describe Summary vs Detail relationship?
- Did it include the Adjusted IS as separate deliverable?
- Did it mention checks between Summary and Detail?

---

### TEST 9: Ambiguous/Incomplete Input

**Category:** Edge case - missing critical info
**Difficulty:** N/A (testing error handling)
**Tests:** Appropriate response to vague requests

**Input Prompt:**
```
Can you update the schedules with the new data we got? Also make sure everything ties.
```

**Document Context:**
```
(none provided)
```

**Expected Behavior - Option A (Preferred):**
GPT asks clarifying questions:
- Which project?
- Which schedules (IS, BS, NWC, specific tabs)?
- What is the "new data" (TB, GL, payroll, aging)?
- What period?
- Where are files located?

**Expected Behavior - Option B (Acceptable):**
GPT states assumptions and uses placeholders:
- "I'm assuming the following: [list]"
- Produces template with `{project_name}`, `{schedule_tabs}`, `{source_file}`, `{period}`
- Notes that user should fill in specifics

**Failure Conditions:**
- Produces complete email with guessed/invented content
- Invents file names or project details
- Proceeds without acknowledging information gaps

**Key Evaluation Points:**
- Did it recognize the input was insufficient?
- Did it ask questions OR clearly state assumptions?
- Did it avoid inventing specifics?

---

### TEST 10: Multi-Day Continuation

**Category:** Reference to prior work
**Difficulty:** Medium
**Tests:** Handling "continue from yesterday" references

**Input Prompt:**
```
Continue with Project Sequoia from yesterday. The GL vendor tables weren't finished - still need accounts payable detail and accrued expenses. Also the bank reconciliation had issues, I left comments in the tab. And start on the capex schedule if you have time - opening balance, additions, disposals, ending balance format. Use the FA detail file.
```

**Document Context:**
```
Files available:
- Project Sequoia databook (in progress)
- GL vendor tables tab (partially complete)
- Bank reconciliation tab with onshore comments
- FA detail file for capex schedule
- Prior day's work in 📁 2025-08-20
```

**Expected Output Elements:**
- Task 1: Complete GL vendor tables - AP detail and accrued expenses
- Task 2: Address bank reconciliation issues per comments in tab
- Task 3: Build capex schedule with structure: Opening, Additions, Disposals, Ending
- Reference to FA detail file as source
- Note about reviewing tab comments for bank recon issues
- Reference to prior day's folder for context

**Key Evaluation Points:**
- Did it acknowledge the continuation context?
- Did it reference the comments in the bank recon tab?
- Did it specify the capex structure correctly?
- Did it handle the "if you have time" prioritization?

---

## Scoring Sheet Template

Use this template for each test:

```
Test #: ___
Date: ___________
Tester: ___________

STRUCTURE (25 points max)
- Greeting format:        ___ / 5
- Task numbering:         ___ / 8
- Single save location:   ___ / 5
- No dividers:            ___ / 3
- Subject line:           ___ / 4
Subtotal:                 ___ / 25

FILE REFERENCES (25 points max)
- File names italic:      ___ / 7
- Tab names formatted:    ___ / 7
- Cell refs backticks:    ___ / 6
- Specific ranges:        ___ / 5
Subtotal:                 ___ / 25

VERIFICATION (25 points max)
- Inline tie-outs:        ___ / 8
- No separate checks:     ___ / 5
- Clear objectives:       ___ / 6
- Assumptions noted:      ___ / 6
Subtotal:                 ___ / 25

TONE & STYLE (25 points max)
- Active voice:           ___ / 6
- No boilerplate:         ___ / 7
- No bold verbs:          ___ / 5
- Correct acronyms:       ___ / 7
Subtotal:                 ___ / 25

TOTAL:                    ___ / 100

OVERALL SCORE (1-7): ___

Anti-patterns observed:
_______________________________
_______________________________

Notes:
_______________________________
_______________________________
```

---

## After Testing

After completing all 10 tests:

1. Calculate average score across all tests
2. Identify patterns in failures (which dimensions score lowest?)
3. Document specific prompt/template changes needed
4. Re-test failed cases after changes
5. Proceed to automated testing once manual pass rate > 80%

---

## Sources

- [OpenAI Evals Documentation](https://platform.openai.com/docs/guides/evals)
- [OpenAI Cookbook - Getting Started with Evals](https://cookbook.openai.com/examples/evaluation/getting_started_with_openai_evals)
- [OpenAI Evals GitHub Repository](https://github.com/openai/evals)
