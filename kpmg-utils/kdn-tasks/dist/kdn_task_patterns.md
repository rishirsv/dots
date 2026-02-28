# KDN Task Patterns

Reference patterns for common FDD task types and anti-patterns to avoid. When a user request matches one of these patterns, use the structure, checks, and example task block as a template.

Use numbered tasks (1, 2, 3) with lettered sub-steps (a, b, c). Use asterisk prefix for notes. Use single quotes for tab names ('tab name').

---

# Substep Verbosity Examples

These examples show the contrast between verbose (bad) and brief (good) substeps. KDN team members are experienced FDD professionals—specify WHAT to do, not HOW.

## Example 1: IS Roll-Forward

**User input:** "Roll forward IS through June for all entities"

❌ BAD (invented substeps, over-specified):
```
a. Add a Jun-25 column to 'IS|Entity' tabs, 'IS|Combining', and 'IS|Combined', and link each line item to the mapped June TB data.
b. Ensure formulas extend through the new Jun-25 column and that all subtotals recalculate correctly.
c. Verify June-25 total revenue and EBITDA on 'IS|Combined' tie back to the mapped June TB within rounding, and confirm total assets and total liabilities plus equity on 'BS|Combined' tie to the mapped June TB control totals.
```
**Problems:** Invented "link each line item" (KDN pastes values, doesn't link). Added obvious verification. Multiple sentences per substep.

✓ GOOD:
```
a. Add Jun-25 column to all entity IS tabs, 'IS|Combining', and 'IS|Combined'
```

## Example 2: Vendor Tables

**User input:** "Build vendor tables for billing fees, professional services, office supplies using opening/activity/ending format"

❌ BAD (explains obvious concepts):
```
c. For each category, build an opening/activity/ending structure where:
   • Opening = beginning balance as of Jan-25
   • Activity = Jan-25 through May-25 movement
   • Ending = balance as of May-25
d. Ensure Opening + Activity = Ending at vendor and total level
e. Reconcile total activity for billing fees to IS|Consolidated!{cell}, confirm variance is 0
```
**Problems:** Defined what opening/activity/ending means (KDN knows). Listed obvious check.

✓ GOOD:
```
c. Build opening/activity/ending by vendor for each category, consistent with 'Vendor example'
```

## Example 3: AR Aging Tie-Out

**User input:** "Make sure the AR aging ties to the BS"

❌ BAD:
```
a. Pull the Combined BS AR balance from the databook (tab 'BS|Combined', AR control line) into the reconciliation
b. Reconcile to the total from the aging schedule
c. Document each reconciling item in the Notes column
d. Summarize remaining unexplained variance as a single line and highlight it
```
**Problems:** Over-specified a simple check. KDN knows how to do a reconciliation.

✓ GOOD:
```
a. Add check row tying AR aging total to 'BS|Combined' AR.
```

## Example 4: Matching User Detail Level

**User gives brief input:** "Roll forward the databook through July"

❌ BAD (over-elaborates a brief request):
```
1. Jul-25 databook roll-forward:
   a. Add Jul-25 column to all IS tabs ('IS|Entity 1' through 'IS|Entity 12', 'IS|Combining', 'IS|Combined')
   b. Add Jul-25 column to all BS tabs ('BS|Entity 1' through 'BS|Entity 12', 'BS|Combining', 'BS|Combined')
   c. Add TTM-Jul 25 column to IS and BS
   d. Verify all formulas extend correctly
```
**Problems:** User gave 7 words; output has 6 substeps with excessive detail they didn't ask for.

✓ GOOD: Match the brevity
```
1. Jul-25 databook roll-forward:
   a. Add Jul-25 column to all IS and BS tabs; add TTM Jul-25 totals
```

**User gives detailed input:** "Roll forward the IS through July for all 13 location tabs plus combined and combining. Update the topside. Add TTM. Flag any check errors."

✓ GOOD: Match the detail
```
1. Jul-25 IS roll-forward:
   a. Add Jul-25 column to all 13 location IS tabs, 'IS|Combined', and 'IS|Combining'; Add TTM-Jul 25 column.
   b. Update 'IS|Topside' (Combined less sum of locations). Flag reconciling variances for my review.
```

## Example 5: Verification Language

**User input:** "Build vendor tables and tie back to IS"

❌ BAD (over-explains the obvious):
```
c. For each category, tie the total activity back to the corresponding line on 'IS|Consolidated' and add a simple check row at the bottom of each table.
```
**Problems:** KDN knows how to build a check row. Too many words.

✓ GOOD:
```
c. Include checks back to 'IS|Consolidated'
```

## Example 6: Structure Over-specification

**User input:** "Build adjustment database with the standard columns"

❌ BAD (invents column list):
```
a. Create 'Adj Database' with columns: Type (definitional, diligence, pro forma),
   Adjustment #, Description, GL #, GL Description, Location, Mapping 1, Mapping 2,
   then monthly columns consistent with 'QoE Detail'
```
**Problems:** User said "standard columns"—KDN knows what those are. Don't list them out.

✓ GOOD:
```
a. Create 'Adj Database' with standard adjustment columns
```

## Example 7: Parentheticals

Parentheticals are OK for disambiguation, not for explaining.

✓ OK (disambiguates which tab):
```
b. Update 'IS|Topside' (Combined less sum of locations)
```

❌ BAD (explains obvious concept):
```
b. Map accounts using the existing mapping logic (i.e., follow the existing mapping tabs/workings)
```

❌ BAD (lists alternatives):
```
c. Add a check structure (e.g., subtotal rows or a pivot)
```

## Example 8: Task Grouping

When building similar items, group them into one task—don't create separate numbered tasks.

**User input:** "Create IS, BS, and GL databases"

❌ BAD (splits into 3 tasks):
```
1. Create IS database:
   a. Build *IS_DATABASE.xlsx* with standard columns
   b. Include all entities and periods

2. Create BS database:
   a. Build *BS_DATABASE.xlsx* with standard columns
   b. Include all entities and periods

3. Create GL database:
   a. Build *GL_DATABASE.xlsx* with standard columns
   b. Include entity and period tags
```

✓ GOOD (one task with substeps):
```
1. Create standard databases:
   a. Build *IS_DATABASE.xlsx* and *BS_DATABASE.xlsx* with standard columns for all entities and periods
   b. Build *GL_DATABASE.xlsx* with standard GL columns plus entity and period tags
```

## Example 9: Parallel Builds

When building the same structure for multiple items (customers, vendors, entities), combine into one task.

**User input:** "Build AR aging tabs for United and Humana using the Horizon template"

❌ BAD (repeats same substeps for each):
```
1. United AR aging tab:
   a. Create tab using Horizon structure
   b. Populate from United source file
   c. Add check row tying to `Combined BS!C28`

2. Humana AR aging tab:
   a. Create tab using Horizon structure
   b. Populate from Humana source file
   c. Add check row tying to `Combined BS!C28`
```
**Problems:** Identical structure repeated. Wasteful.

✓ GOOD:
```
1. United and Humana AR aging tabs:
   a. Create aging tabs for United and Humana using 'NWC|Horizon AR Aging' structure. Populate from respective source files in On-shore Inputs abd include checks to 'BS|Combined'.
```

---

# Part 1: Task Pattern Derivations

These examples show how to derive task blocks from user prompts. Each substep must trace back to something the user explicitly said or provided. Never add substeps based on what "typically" happens—only what THIS user requested.

## Derivation Process

For each user prompt:
1. **Identify the objective** – What is the core action the user is asking for?
2. **Extract explicit inputs** – What files, tabs, periods, or references did they name?
3. **Group by action** – Cluster related inputs under a single action. Don't create separate substeps for things that belong together.
4. **Write substeps** – Start each with an action verb (Roll-forward, Map, Build, Update, Add, Pull, Flag). Incorporate scope (tabs, periods, entities) into the action rather than as separate substeps.
5. **Match verbosity** – Brief prompt → brief output. Detailed prompt → detailed output.

---

## File and Tab References

Mirror the user's specificity level for file and tab names. Never invent placeholder syntax.

| User provided | Output uses |
|---------------|-------------|
| Specific name: "*TB_2025-06-30.xlsx*" | That exact name: "*TB_2025-06-30.xlsx*" |
| Generic reference: "the databook" | Same generic: "the databook" |
| Type only: "the AR aging" | Descriptor: "the AR aging file" |
| New item, no name: "compile a list" | Generic: "a separate tab" |

**Never invent placeholders** like `{databook_name}`, `{AR_aging_file}`, or `{New_employees_list_tab}`.

❌ BAD:
```
a. Load into the databook {databook_name}
b. Flag new employees and compile on {New_employees_list_tab}
```

✓ GOOD:
```
a. Load into the databook
b. Flag new employees; compile on a separate tab
```

---

## Pattern 1: Databook and IS/BS Roll-forwards

**User prompt:** "Roll forward the IS through June for all 12 locations plus combined and combining. Use *TB_2025-06-30.xlsx*. Update topside."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "Roll forward the IS through June" + "for all 12 locations plus combined and combining" | Roll-forward (scope + period combined) |
| "Use *TB_2025-06-30.xlsx*" | Map (source file) |
| "Update topside" | Update (separate action) |

**Task block:**
```
1. Jun-25 IS roll-forward:
   a. Roll-forward all 12 location IS tabs, 'IS|Combined', and 'IS|Combining' to Jun-25
   b. Map accounts from *TB_2025-06-30.xlsx* using existing mappings
   c. Update 'IS|Topside'
```

**What we did NOT add:** TTM columns (user didn't ask), check formulas (user didn't ask), error log updates (user didn't ask). If user wanted those, they would have said so.

---

## Pattern 2: Trial Balance Mapping

**User prompt:** "Map the FY24 TB to the databook using the COA crosswalk. Flag anything unmapped."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "Map the FY24 TB to the databook" + "using the COA crosswalk" | Map (source + method combined) |
| "Flag anything unmapped" | Flag (separate action) |

**Task block:**
```
1. Map FY24 trial balance to databook:
   a. Map GL accounts from FY24 TB using COA crosswalk; flag unmapped
```

**What we did NOT add:** Specific tab names (user didn't specify), import steps (obvious), verification (user didn't ask). Note: "flag unmapped" is short enough to combine with the map action.

---

## Pattern 3: Adjustment Database

**User prompt:** "Build the adj database from *Adjustment Support_v2.xlsx*—pull from 'Diligence' and 'Pro Forma' tabs. Standard columns."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "Build the adj database" + "Standard columns" + "from *Adjustment Support_v2.xlsx*" + "'Diligence' and 'Pro Forma' tabs" | Build (all details belong to one action) |

**Task block:**
```
1. Build adjustment database:
   a. Build 'Adj Database' with standard columns; populate from *Adjustment Support_v2.xlsx* tabs 'Diligence' and 'Pro Forma'
```

**What we did NOT add:** Column list (user said "standard"), tie-out checks (user didn't ask), QoE reconciliation (user didn't mention). Single substep because it's one cohesive action.

---

## Pattern 4: Payroll Processing

**User prompt:** "Append May payroll to the database from *Payroll_May2025.xlsx* tab 'Detail'. Map new employees—flag unmapped."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "Append May payroll to the database" + "from *Payroll_May2025.xlsx* tab 'Detail'" | Append (source included) |
| "Map new employees" + "flag unmapped" | Map (with flag as qualifier) |

**Task block:**
```
1. Process May-25 payroll register:
   a. Append from *Payroll_May2025.xlsx* tab 'Detail' to 'Payroll Database'
   b. Map new employees using 'Employee Mapping'; flag unmapped
```

**What we did NOT add:** Pivot table updates (user didn't mention pivots), TTM columns (user didn't ask), IS reconciliation (user didn't request). If the user wanted pivot updates, they would have said "update the pivot tabs."

---

## Pattern 5: AR/AP Aging

**User prompt:** "Build Cigna AR aging using the Horizon template. Source is *Cigna AR Aging_06-16-2025.xlsx* tab 'Cigna_All'. Credit balances go in row 175. Add check to 'BS|Combined'."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "Build Cigna AR aging" + "using the Horizon template" + "Source is *Cigna AR Aging_06-16-2025.xlsx* tab 'Cigna_All'" | Build (template + source combined) |
| "Add check to 'BS\|Combined'" | Add (separate action) |
| "Credit balances go in row 175" | Note (instruction, not action) |

**Task block:**
```
1. Build Cigna AR aging – modeled on 'NWC|Horizon AR Aging':
   a. Build 'Cigna_All_AR Aging' using Horizon structure; pull from *Cigna AR Aging_06-16-2025.xlsx* tab 'Cigna_All'
   b. Add source check to 'BS|Combined'
   *Credit balances grouped separately in row 175
```

**What we did NOT add:** Aging bucket definitions (KDN knows standard buckets), copy/rename steps (obvious mechanics).

---

## Pattern 6: GL/Vendor Schedules

**User prompt:** "Build CAPEX schedule for FY24. Opening from *FY23_FA_Schedule.xlsx* 'Summary', activity from *GL_FA_Detail_FY24.xlsx* accounts 1600-1699. Structure: opening/additions/disposals/depreciation/ending by asset class. Check to BS Net PP&E. Note: disposal gain/loss goes to Other Income per client."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "Build CAPEX schedule for FY24" + "Structure: opening/additions/disposals/depreciation/ending by asset class" | Build (structure is part of build) |
| "Opening from *FY23_FA_Schedule.xlsx* 'Summary'" | Pull (opening balances) |
| "activity from *GL_FA_Detail_FY24.xlsx* accounts 1600-1699" | Map (activity) |
| "Check to BS Net PP&E" | Add (check) |
| "disposal gain/loss goes to Other Income per client" | Note |

**Task block:**
```
1. Build CAPEX schedule for FY24:
   a. Build opening/additions/disposals/depreciation/ending structure by asset class
   b. Pull opening from *FY23_FA_Schedule.xlsx* tab 'Summary'; map activity from *GL_FA_Detail_FY24.xlsx* accounts 1600-1699
   c. Add source check to 'BS|Combined' Net PP&E
   *Disposal gain/loss in "Other Income" per client
```

This example has more substeps because the user gave more detail—but we still combined where logical (opening + activity sources in one substep). Match their level.

---

## Pattern 7: KPI and Analytics

**User prompt:** "Build KPI tab with DSO, EBITDA margin, and revenue per client for FY23-FY25."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "Build KPI tab" + "DSO, EBITDA margin, and revenue per client" + "for FY23-FY25" | Build (all one action) |

**Task block:**
```
1. Build KPI tab for FY23-FY25:
   a. Build metrics: DSO, EBITDA margin, Revenue per client
```

**What we did NOT add:** Data sources (user didn't specify), calculation methodology (KDN knows), additional metrics (user only asked for three). Brief prompt → brief output.

---

## Pattern 8: QC and Error Logging

**User prompt:** "QC the databook. Compare to *AFS_FY24_Final.pdf*. Update error log with any variances—rounding under $1 is OK."

**Derivation:**
| User said | Action group |
|-----------|--------------|
| "QC the databook" | Run (check formulas) |
| "Compare to *AFS_FY24_Final.pdf*" | Compare (to source) |
| "Update error log with any variances" | Update (error log) |
| "rounding under $1 is OK" | Note (tolerance) |

**Task block:**
```
1. QC databook:
   a. Run check formulas; compare key figures to *AFS_FY24_Final.pdf*
   b. Update 'Error Log' with variances
   *Rounding <$1 acceptable
```

Note: Combined QC and compare into one substep since they're related verification actions.

# Part 2: Anti-Patterns to Avoid

Never produce instructions with these issues. Each anti-pattern includes BAD and GOOD examples.

## Vague File References

Instructions must specify exact file names, tabs, and ranges.

**BAD:**
> "Update the databook with the new data"

**GOOD:**
> "Update *Project Academy Databook_v5.xlsx* tab 'IS|Combined' with May-25 data from *TB_2025-05-31.xlsx* tab 'Consolidated'"

## Missing Tie-outs

Every schedule or update must include inline verification.

**BAD:**
> "Add the new schedule to the databook"

**GOOD:**
> "Add the Prepaids schedule to the databook:
>    a. Build schedule structure
>    b. Include check cell in row 45 tying the total to `Combined BS!C32`"

## Ambiguous Scope

Specify exactly which rows, columns, accounts, or entities are affected.

**BAD:**
> "Clean up the GL database"

**GOOD:**
> "In *GL_Database.xlsx* tab 'Raw':
>    a. Remove duplicate rows based on columns A-D
>    b. Standardize vendor names using 'Vendor Mapping' tab"

## Implicit Assumptions

Never assume KDN knows project-specific conventions. Document everything.

**BAD:**
> "Use the same format as last time"

**GOOD:**
> "Use the same format as 'NWC|Horizon AR Aging' tab in the current databook"

## Missing Period or Version Context

Always specify which period, version, or date applies.

**BAD:**
> "Roll forward the IS with the new TB"

**GOOD:**
> "Roll forward the IS through Jun-25 using *TB_2025-06-30_Final.xlsx* (not the draft version dated 06-28)"

## Unclear Save Locations

Specify exact output paths and file naming.

**BAD:**
> "Save the updated file"

**GOOD:**
> "Save to: Project Academy/KDN Outputs/2025-06-24"
