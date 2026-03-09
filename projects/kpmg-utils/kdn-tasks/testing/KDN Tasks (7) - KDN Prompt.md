# voice_001

**User Prompt**

Tonight for Project Falcon we need to get the databook updated. The client sent over the June trial balances yesterday, they're in the shared folder. Make sure you map everything using the same mapping we used for the May TBs, I think those were from Dynamics. Roll forward the IS through June for all the entities and the combined, and don't forget the topside calculation. Also the BS needs June too. There's a variance in the AR aging from last week that we never figured out, can you take another look at that? I think it was like 15k off from the control account. Oh and the payroll registers came in for May and June finally. Process those into the database and update the headcount analysis. Flag any new employees that don't have role mappings. For the QofE, just extend the reported numbers through June, don't touch the adjustments yet. Save everything to the usual output folder.

Document context:
- June 2025 trial balances (Dynamics export) in shared folder
- Existing mapping from May TB processing
- AR aging working file with ~$15k variance to Combined BS
- May-June 2025 payroll registers
- Employee role mapping tab in databook

**Model Output**

📋 **Assumptions & Questions**   

Critical assumptions:  
• Tonight's files are in {Project Falcon}/On-shore Inputs/{YYYY-MM-DD}; main databook is *{Falcon_Databook_current}.xlsx*.  
Clarifying questions:  
• None.

**Draft email**

**Subject: Project Falcon**

KDN Team,

Hope you are well. Please see the following tasks for Project Falcon today. Tonight's focus is rolling the databook and QoE through Jun-25 and updating AR aging and payroll support using the latest source files in {Project Falcon}/On-shore Inputs/{YYYY-MM-DD}.

📁 {YYYY-MM-DD}

1. Jun-25 TB mapping and IS/BS roll-forward:
   a. Use the June 2025 TB export from *{Falcon_Jun-2025_TBs_Dynamics}.xlsx* in `{Project Falcon}/On-shore Inputs/{YYYY-MM-DD}` and map accounts using the existing May-25 TB mapping in *{Falcon_Databook_current}.xlsx*.
   b. In *{Falcon_Databook_current}.xlsx*, add a Jun-25 column to all entity IS tabs plus 'IS|Combining' and 'IS|Combined' and populate from the mapped June TB data.
   c. In the same databook, add a Jun-25 column to all entity BS tabs plus 'BS|Combining' and 'BS|Combined' and populate from the mapped June TB data.
   d. Update 'IS|Topside' in *{Falcon_Databook_current}.xlsx* for Jun-25 based on the updated 'IS|Combined' and entity IS tabs.

2. AR aging variance follow-up:
   a. In *{Falcon_AR_Aging_Working}.xlsx*, revisit the reconciliation of the AR aging to the 'BS|Combined' AR control for the latest period and investigate the ~15k variance noted previously.
   b. Update the schedule and reconciliation notes to reflect findings and ensure totals reconcile or clearly flag any remaining unexplained variance.
   c. Add or update a check row tying total AR aging to `Combined BS!{cell}`.

3. May–Jun 2025 payroll processing and headcount update:
   a. Append the May-25 and Jun-25 payroll registers from *{Falcon_Payroll_Registers_May-Jun-2025}.xlsx* to the payroll database tab (e.g., 'Payroll database') in *{Falcon_Databook_current}.xlsx*.
   b. Refresh the headcount and payroll analytics tabs (e.g., 'Headcount analysis', 'Payroll by role') for May-25 and Jun-25 based on the updated payroll database.
   c. Use the 'Employee role mapping' tab to map any new employees and flag in yellow any employees that remain without a role mapping.

4. QoE reported extension through Jun-25:
   a. In *{Falcon_QoE_Working_current}.xlsx*, extend the reported QoE IS and any related reported-only schedules to include Jun-25, using updated reported figures from 'IS|Combined' in *{Falcon_Databook_current}.xlsx*.
   b. Do not change any existing QoE adjustments, adjusted columns, or pro forma logic; only extend the reported numbers through Jun-25.

Save to: Project Falcon/KDN Outputs/{YYYY-MM-DD}

Thanks,  
{First name}

---

# voice_002

**User Prompt**

Write a set of instructions for KDN, and ask them to incorporate the new trial balances for the GP trial balance from 2023 to 2025. It's uploaded to the share file. Within the trial balances, you should be aligning all of the mapping and accounts consistently with the previous trial balances that were processed already, which should be the dynamics. And the QuickBooks data. Once the trial balances are all database, ensure you send that database back to the OnShore team. And for the actual trial balances, then make sure they balance, all the source checks are complete, and create monthly income statements and balance sheets for each entity. And also on a consolidated basis, as well as on a consolidating basis, incorporate any topside entries as part of the management. Now actually incorporate all of the topside adjustments as part of the monthly financial reporting. As well as part of the TBs, include entries that align back to the management reporting. And then create reconciliations back to the audited statements as well as to the internal financial reports. For the payroll registers, we then received additional support relating to the monthly registers and the reconciliations to the monthly reported numbers. Take a look through these files to see if it addresses what was missing previously. I'd incorporate it into the database as well as creating checks for the missing periods. Complete the AR and AP agings that was not completed yesterday. And you can start identifying and creating the QofE and working capital setup and create a stratified balance sheet.

Document context:
- GP Trial Balances 2023-2025 on ShareFile
- Dynamics TB mapping (existing)
- QuickBooks TB mapping (existing)
- Payroll registers (monthly)
- AR/AP aging source files
- Audited financial statements for reconciliation

**Model Output**

📋 **Assumptions & Questions**   

Critical assumptions: • Tonight's folder is {YYYY-MM-DD}; • Main IS/BS databook is *{Databook file name}*; • TB database workbook is *{TB database file}*.  
Clarifying questions: • Please confirm which file contains the management topside adjustments and internal management financial reports used for reconciliation.  

**Subject: Project {project_name}**

KDN Team,

Hope you are well. Please see the following tasks for {project_name} today.

Tonight please load the new GP TBs for 2023–2025 into the database, update monthly IS/BS and reconciliations, and progress payroll, AR/AP, and QoE/WC workstreams.

📁 {YYYY-MM-DD}

1. Incorporate GP TBs 2023–2025 into TB database and mappings:
   a. Load the GP TBs for 2023–2025 from *{GP TB file}* into *{TB database file}* using the same import structure as the existing TB periods.
   b. Map all new accounts using the existing Dynamics and QuickBooks mapping logic (for example, tabs '{Dynamics mapping tab}' and '{QuickBooks mapping tab}') so that mappings and account groupings are fully consistent with the previously processed TBs.
   c. Add check rows to confirm each new TB balances and that source totals reconcile to the imported data.
   d. Save the updated TB database workbook in tonight's outputs folder for on-shore review.

2. Build monthly IS/BS by entity, consolidated and consolidating, including topside adjustments:
   a. Using the updated TB database in *{TB database file}*, build monthly IS and BS schedules for each entity (for example, tabs 'IS|{Entity}' and 'BS|{Entity}') for 2023–2025, consistent with the existing format.
   b. Build monthly 'IS|Consolidated', 'BS|Consolidated', 'IS|Consolidating', and 'BS|Consolidating' tabs for 2023–2025, aligned to the structure used for prior periods.
   c. Incorporate all management topside adjustments from *{Topside adjustments file}* into both the TB database and the monthly IS/BS so that entries align back to the management reporting.

3. Reconcile consolidated results to AFS and internal management reports:
   a. Create reconciliation tabs comparing the consolidated IS and BS by year to the audited financial statements in *{AFS file}* for 2023–2025.
   b. Create separate reconciliations tying the consolidated monthly IS/BS to the internal management financial reports in *{Internal reporting file}* and summarize any remaining differences.

4. Process additional payroll registers and update payroll database:
   a. Review the new monthly payroll register and reconciliation files in *{Payroll registers file}* to confirm they address the periods that were previously missing.
   b. Append any new periods to the existing payroll database tab 'Payroll Database' in *{Payroll database file}* and add checks to confirm coverage and reconciliation for all months in scope.

5. Complete AR and AP agings:
   a. Using the AR/AP aging source files (*{AR aging file}* and *{AP aging file}*), finish the AR and AP aging schedules that were started yesterday, following the same structure and formatting used for the schedules already completed.
   b. Add check rows on each aging schedule tying the total aging balance to the corresponding AR or AP control line in the BS.

6. Start QoE, WC setup, and stratified BS:
   a. Set up initial QoE and working capital schedule tabs using the updated TB database and consolidated IS/BS, with lines grouped by key revenue, COGS, operating expense, and working capital categories.
   b. Create a stratified BS tab that classifies balances (for example, working-capital versus non-working-capital and other key groupings) based on the consolidated BS, leaving room for further refinement by the on-shore team.

Save to: {Project}/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# bullet_001

**User Prompt**

Project Cedar tonight:
- process new GL export into vendor tables
- need billing fees, professional services, office supplies
- opening/activity/ending format like the example
- tie back to IS
- also finish the lease summary from yesterday
- client wants monthly rent by location

Document context:
- GL export file (Jan-25 through May-25)
- Vendor table example template in databook
- Lease agreements by location (12 locations)
- Prior day's incomplete lease summary tab

**Model Output**

**Subject: Project Cedar**

KDN Team,

Hope you are well. Please see the following tasks for Cedar today:

📁 {YYYY-MM-DD}

1. Build vendor tables from Jan-25 to May-25 GL export:
   a. In *{databook filename}*, create vendor tables for billing fees, professional services, and office supplies modeled on the existing 'Vendor example'.
   b. Pull Jan-25 through May-25 GL detail for these three categories from *{GL export filename}* into the new vendor tables.
   c. Build opening/activity/ending by vendor for each category, consistent with 'Vendor example'.
   d. Include checks back to 'IS|Consolidated' for each category.

2. Complete lease summary with monthly rent by location:
   a. Using the prior day's incomplete lease summary tab in *{databook filename}*, complete the schedule using the lease agreements by location (12 locations) in *{lease agreements filename(s)}*.
   b. For each of the 12 locations, populate monthly base rent so the summary shows rent by month and location per the client request.

Save to: Project Cedar/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# bullet_002

**User Prompt**

Academy tasks:
- AR aging for Cigna like Horizon
- check the $15k variance
- roll IS through July
- TTM Jul-25

Document context:
- NWC|Horizon AR Aging template in databook
- Cigna AR source file
- July 2025 trial balances
- Combined BS!C28 for AR control

**Model Output**

**Subject: Project Academy**

KDN Team,

Hope you are well. Please see the following tasks for Academy today. Focus is on building the Cigna AR aging based on Horizon and rolling the IS through Jul-25 including TTM.

📁 {YYYY-MM-DD}

1. Cigna AR aging – modeled on 'NWC|Horizon AR Aging':
   a. In *{Academy databook filename}* copy 'Horizon_All_AR Aging' and rename to 'Cigna_All_AR Aging'.
   b. Update source references in 'Cigna_All_AR Aging' to pull from *{Cigna AR source filename}* tab '{Cigna AR tab}'.
   c. Create 'NWC|Cigna AR Aging' tab in the databook using the same structure and bucket formulas as 'NWC|Horizon AR Aging'.
   d. Add a check row tying total AR on 'NWC|Cigna AR Aging' to `Combined BS!C28`.

2. AR variance reconciliation – investigate ~$15k difference:
   a. Using the check row in 'NWC|Cigna AR Aging', quantify the variance between the aging total and `Combined BS!C28` (currently ~15k).
   b. Identify and summarize key drivers of the variance in a short reconciliation on 'NWC|Cigna AR Aging' (or a new 'Cigna AR Reconciliation' tab if cleaner).
   c. Add a brief note indicating whether any remaining variance is timing-related versus other items.

3. Jul-25 IS roll-forward and TTM:
   a. In *{Academy databook filename}* add a Jul-25 column to 'IS|Combined', 'IS|Combining', and all location IS tabs.
   b. Populate Jul-25 using *{July 2025 trial balances file}* with existing mappings.
   c. Calculate the TTM-Jul 25 column on the relevant IS tabs.
   d. Update 'IS|Topside' for Jul-25 and TTM-Jul 25.

Save to: Project Academy/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# initiation_001

**User Prompt**

New project coming in. Client is Meridian Capital, target is Pacific Home Services which does home healthcare in California and Nevada. Buy-side deal. Scope is FY23, FY24, and YTD through May 2025. Year end is December. They sent over the sell-side databook and GL exports. We need to set up the IS and BS by entity, build a consolidated and consolidating view, and create the standard databases. Also need to convert their COA to our standard mapping. Let me know if you need the SharePoint links.

Document context:
- Sell-side databook (Excel)
- GL exports FY23-YTD May-25
- COA/Chart of accounts file
- SharePoint links not yet provided

**Model Output**

📋 **Assumptions & Questions**

Critical assumptions:
• Currency is USD (thousands) and accounting basis is US GAAP.  
Clarifying questions:
• Please confirm SharePoint links and exact file names for the sell-side databook, GL exports, and COA before sending to KDN.

**Draft email**

**Subject: Project {project_name}**

KDN Team,

A new buy-side deal requires your assistance.

Deal preferences
- Currency: USD (thousands)
- Accounting basis: US GAAP
- Naming: `IS | Entity Name`, `BS | Entity Name` for tabs; files as `Project {project_name}_[description]_[date]_KDN.xlsx`
- Year-end: December 31
- Scope: FY23, FY24, YTD25 (through May-25)

Target overview
- Client: Meridian Capital
- Target: Pacific Home Services
- Home healthcare provider operating in California and Nevada

📁 Initial files: *Sell-side databook.xlsx*, *GL_Exports_FY23–YTD_May25.xlsx*, *COA_PacificHomeServices.xlsx*

Initial tasks

1. IS and BS build by entity and consolidated:
   a. Using *Sell-side databook.xlsx*, create IS and BS tabs for each Pacific Home Services legal entity and for each period in scope (FY23, FY24, YTD May-25).
   b. Build 'IS|Consolidating', 'IS|Consolidated', 'BS|Consolidating', and 'BS|Consolidated' summarizing all entities for the same periods.
   c. Add check rows so consolidated IS and BS totals reconcile to the sell-side databook or GL control totals.

2. COA mapping to KPMG standard:
   a. Import the client COA from *COA_PacificHomeServices.xlsx* into a new 'COA mapping' tab in the main working file.
   b. Add columns for KPMG standard mapping (for example, Mapping 1, Mapping 2, FS line, Category) and map each GL account from the client COA to the standard structure.
   c. Flag any unmapped or ambiguous accounts in the 'COA mapping' tab for follow-up.

3. Standard IS, BS, and GL databases:
   a. Create *IS_BS_DATABASE_PacificHomeServices.xlsx* with IS and BS databases that capture monthly data for FY23, FY24, and YTD May-25 for all entities plus consolidated and consolidating views.
   b. Create *GL_DATABASE_PacificHomeServices.xlsx* using the GL exports for FY23–YTD May-25 with standard columns (Date, Entity, Account #, Account description, Department/Location where available, Description, Debit, Credit, Period, Year).
   c. Ensure database totals reconcile to the consolidated IS and BS built in Task 1.

Save to: Project {project_name}/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# initiation_002

**User Prompt**

Starting Project Redwood. Sell-side diligence for timber company in Oregon. Dec year end. FY22 through FY24 plus stub through March 2025. Client is sending databook tomorrow. Need databook setup ready.

Document context:
- Files TBD - awaiting client databook

**Model Output**

📋 **Assumptions & Questions**   
Critical assumptions:  
• Deal preferences: USD (thousands), US GAAP, single-entity databook shell; tonight's folder is {YYYY-MM-DD}.  
Clarifying questions:  
• Confirm if there are multiple legal entities or locations needing separate tabs from day one.

**Subject: Project Redwood**

KDN Team,

A new sell-side diligence deal requires your assistance.

Deal preferences
- Currency: USD (thousands)
- Accounting basis: US GAAP
- Naming: `IS|Redwood`, `BS|Redwood`, `NWC|Summary`, `TB Import`, `mapping`, `Error Log`; files as `Project Redwood_[description]_[YYYY-MM-DD]_KDN.xlsx`
- Year-end: December 31
- Scope: FY22, FY23, FY24, stub through March 2025

Target overview
- Client: {client_name}
- Target: {target_name}
- Timber company based in Oregon; analysis to cover FY22–FY24 plus stub period through March 2025.

📁 Initial files: client sell-side databook expected in `{Project Redwood}/On-shore Inputs/{YYYY-MM-DD}` (will share once received)

Initial tasks

1. Set up Project Redwood databook shell:
   a. Create *Project Redwood_Databook_shell.xlsx* with core tabs: 'IS|Redwood', 'BS|Redwood', 'NWC|Summary', 'TB Import', 'mapping', 'Error Log'
   b. On 'IS|Redwood' and 'BS|Redwood', set up columns for FY22, FY23, FY24, and YTD Mar-25 consistent with a December year-end
   *Assume a single legal entity; we will add entity-level or location-level tabs later if needed

2. Prepare period structure and headers:
   a. On 'TB Import', 'mapping', and 'NWC|Summary', set up monthly columns from Jan-22 through Mar-25 plus corresponding FY and TTM columns where relevant
   b. Align period labels and sign conventions across all tabs so they are ready to receive data from the client databook once available

Save to: Project Redwood/KDN Outputs/{YYYY-MM-DD}

Thanks,  
{First name}

---

# nightly_001

**User Prompt**

For Academy, roll forward the IS and BS through August. Use the August TBs in yesterday's folder. Make sure the topside recalculates.

Document context:
- August 2025 TBs in folder 2025-08-28
- Project Academy databook (through July 2025)
- IS tabs: 13 locations plus Combined, Combining, Topside
- Consolidated BS tab

**Model Output**

**Subject: Project Academy**

Team,

Hope you are well. Please see the following tasks for Academy today:

Tonight’s focus is to roll forward the IS and consolidated BS through Aug-25 using the August TBs and ensure the topside updates.

📁 {YYYY-MM-DD}

1. Aug-25 IS and BS roll-forward:
   a. In *Project Academy databook.xlsx*, using the August 2025 TB files in `Project Academy/On-shore Inputs/2025-08-28`, add an Aug-25 column to all 13 location IS tabs, 'IS|Combined', and 'IS|Combining'.
   b. Roll forward the 'Consolidated BS' tab through Aug-25 using the same August 2025 TB balances.
   c. Update 'IS|Topside' so the Aug-25 topside recalculates correctly.

Save to: Project Academy/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# nightly_002

**User Prompt**

Project Academy tonight - need the May roll-forward for IS (all locations plus combined/combining), BS consolidated, and update the QoE to pull May reported numbers. Don't touch adjustments. Check the topside ties.

Document context:
- May 2025 trial balances
- Academy databook with QoE Summary and Detail tabs
- 13 location IS tabs plus Combined, Combining, Topside

**Model Output**

📋 **Assumptions & Questions**

Critical assumptions:
• Tonight's folder is {YYYY-MM-DD} and inputs are under `Project Academy/On-shore Inputs/{YYYY-MM-DD}`.
• Main databook is *{Academy databook}.xlsx* with 'QoE Summary' and 'QoE Detail' tabs and 13 location IS tabs plus 'IS|Combined', 'IS|Combining', and 'IS|Topside'.

**Draft email**

**Subject: Project Academy**

Hi Divya,

Hope you are well. Please see the following tasks for Academy today; focus is rolling forward through May-25 and refreshing QoE reported columns.

📁 {YYYY-MM-DD}

1. May-25 IS roll-forward:
   a. In *{Academy databook}.xlsx*, add a May-25 column to all 13 location IS tabs plus 'IS|Combined' and 'IS|Combining' using the existing structure.
   b. Map May-25 balances from *{May-25 TB file}.xlsx* to the IS tabs using the existing TB-to-IS mappings.
   c. Update 'IS|Topside' for May-25 based on the refreshed 'IS|Combined' and location tabs.
   d. Confirm 'IS|Topside' ties to Combined less sum of locations for May-25 within normal rounding.

2. May-25 BS consolidated roll-forward:
   a. In *{Academy databook}.xlsx*, add a May-25 column to the consolidated BS tab '{BS_consolidated_tab}' using the existing structure.
   b. Map May-25 BS balances from *{May-25 TB file}.xlsx* (consolidated tab) to the May-25 column using existing mappings.

3. QoE reported numbers – update for May-25:
   a. In *{Academy databook}.xlsx* tabs 'QoE Summary' and 'QoE Detail', update the reported columns to pull May-25 figures from the updated IS/BS tabs.
   b. Do not change any QoE adjustment lines, amounts, or calculations; only update the reported pull-throughs for May-25.
   *Do not edit any adjustment databases or pro forma logic tied to QoE.

Save to: Project Academy/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# technical_001

**User Prompt**

For Academy, can you build out the adjustment database? It needs to have columns for type (definitional, diligence, pro forma), adjustment number, description, GL number and description, location, and the two mapping fields. Then create a summary tab that rolls up to the QofE detail. Make sure there's a check that ties the database totals to the QofE. Also build the adjusted IS that pulls from this database with a dropdown to select which location you want to see.

Document context:
- Project Academy databook
- QoE Detail tab (existing)
- Adjustment support files
- Location P&L tabs (13 locations)

**Model Output**

📋 **Assumptions & Questions**

Critical assumptions:
• Main databook is *{databook filename}* and already includes a 'QoE Detail' tab and 13 location P&L tabs 

Clarifying questions:
• Please confirm the exact databook filename and tonight’s folder date `{YYYY-MM-DD}` before sending to KDN 

**Draft email**

**Subject: Project Academy**

KDN Team,

Hope you are well. Please see the following tasks for Academy today:

📁 {YYYY-MM-DD}

1. Build adjustment database:
   a. In *{databook filename}* create new tab 'Adj Database' with columns: Type (definitional, diligence, pro forma), Adjustment #, Description, GL #, GL Description, Location, Mapping 1, Mapping 2, then monthly columns consistent with 'QoE Detail'.
   b. Populate 'Adj Database' from the adjustment support files in `{Project}/On-shore Inputs/{YYYY-MM-DD}`, with one row per GL account and location combination.
   c. Add a check row tying total adjustments in 'Adj Database' to the totals used in 'QoE Detail'.

2. Build adjustment summary rolling to QoE detail:
   a. In *{databook filename}* create 'Adj Summary' that summarizes 'Adj Database' by QoE line item and adjustment type in the same structure as 'QoE Detail'.
   b. Link 'Adj Summary' into 'QoE Detail' so that QoE lines reconcile to the underlying adjustment database.

3. Build adjusted IS with location selector:
   a. In *{databook filename}* create 'IS|Adjusted' modeled on the existing location P&L tabs and set it to pull adjustment amounts by location from 'Adj Database'.
   b. Add a location dropdown (covering all 13 locations) that drives 'IS|Adjusted' to display reported plus adjustment amounts for the selected location.

*Note base period coverage and line-item naming on 'QoE Detail' and the existing location P&L tabs.*

Save to: Project Academy/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# technical_002

**User Prompt**

Build the payroll database for Project Maple. Needs all fields from the register - employee name, ID, department, role, regular hours, OT hours, gross pay, employer taxes, benefits. Monthly columns Jan-23 through current. Add reconciliation to IS compensation line. Create pivots by role and by department.

Document context:
- Payroll registers Jan 2023 - current
- IS|Consolidated compensation line
- Role mapping tab

**Model Output**

📋 **Assumptions & Questions**

Critical assumptions:
• Tonight's folder is {YYYY-MM-DD}  
• Payroll registers Jan-23–current are in *{Payroll_registers_file}.xlsx* tab '{register_tab}'  
• IS compensation line is on *{Databook_file}.xlsx* tab 'IS|Consolidated'  

Clarifying questions:
• Confirm which file and tab contain the 'Role mapping' data.

**Subject: Project Maple**

KDN Team,

Hope you are well. Please see the following tasks for Project Maple today:

Tonight's focus is to build a monthly payroll database from Jan-23 through current with reconciliation to the IS compensation line and supporting pivots by role and department.

📁 {YYYY-MM-DD}

1. Build payroll database from payroll registers:
   a. From *{Payroll_registers_file}.xlsx* tab '{register_tab}', build a consolidated 'Payroll database' tab covering all periods Jan-23 through current.
   b. Include at least the following fields as separate columns: employee name, employee ID, department, role, regular hours, OT hours, gross pay, employer taxes, and benefits.
   c. Add monthly columns Jan-23 through {current_month} so that gross pay, employer taxes, and benefits can be analyzed on a monthly basis.
   d. Use the 'Role mapping' tab (in *{Role_mapping_file}.xlsx* or equivalent) to populate role and department for each employee and flag any unmapped employees.
   e. Add a reconciliation so total monthly compensation in the payroll database ties to the compensation line on 'IS|Consolidated'.

2. Create payroll pivots:
   a. Create a pivot summarizing gross pay, employer taxes, and benefits by role by month based on the 'Payroll database' tab.
   b. Create a pivot summarizing gross pay, employer taxes, and benefits by department by month based on the 'Payroll database' tab.

Save to: Project Maple/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# multi_001

**User Prompt**

Tonight for Sequoia: (1) finish the AR aging for customers A, B, C - use the template from customer D aging, (2) process June payroll into database and flag new hires, (3) roll IS through June with TTM, (4) update net debt schedule with new borrowing data

Document context:
- Customer D AR aging template
- June payroll register
- June trial balances
- New borrowing documentation
- Net debt schedule

**Model Output**

📋 **Assumptions & Questions**

Critical assumptions:
• Tonight’s folder is `{YYYY-MM-DD}` under `Project Sequoia/On-shore Inputs/{YYYY-MM-DD}`.   
• The main working files are the existing Sequoia databook, AR aging workbook, payroll database, and net debt schedule already used on this deal.

Clarifying questions:
• Before sending, please confirm the exact file names for the AR aging workbook, June payroll register, June TB file, borrowing support, and net debt schedule.

**Subject: Project Sequoia**

KDN Team,

Hope you are well. Please see the following tasks for Sequoia today: finish the AR agings for key customers, process June payroll, roll the IS through June with TTM, and update the net debt schedule for new borrowings.

📁 {YYYY-MM-DD}

1. AR aging for customers A–C – modeled on Customer D:
   a. In *{AR_aging_workbook}*, use the existing Customer D AR aging tab as a template to build separate aging tabs for customers A, B, and C with the same bucket structure and layout.
   b. Populate each new aging for customers A, B, and C using the June AR detail consistent with how Customer D is sourced in the current template.
   c. Add a check row on each new aging to tie the total AR balance for that customer back to the relevant AR control balance in the main Sequoia databook.

2. June payroll – process into payroll database and flag new hires:
   a. Append the June payroll data from *{June_payroll_register}* into the existing payroll database tab in *{payroll_database_file}*.
   b. Identify employees who appear for the first time in June and flag them as new hires in the payroll database (for example, in a “New hire” flag column).

3. Jun-25 IS roll-forward with TTM:
   a. In *{Sequoia_databook_file}*, add Jun-25 columns to 'IS|Combined', 'IS|Combining', and all relevant entity/location IS tabs using the June trial balances from *{June_TB_file}* and the existing mappings.
   b. Add TTM-Jun 25 columns on the combined and entity IS tabs based on the updated June data, consistent with the existing TTM calculations.

4. Net debt schedule – update for new borrowings:
   a. Update *{net_debt_schedule_file}* for June with the new borrowing details from *{borrowing_support_file}*, following the existing structure and line items for each facility.
   b. Ensure the updated June net debt balances in the schedule tie to the related debt and cash lines in the main Sequoia databook.

Save to: Project Sequoia/KDN Outputs/{YYYY-MM-DD}

Thanks,  
{First name}

---

# ar_ap_001

**User Prompt**

For Academy, we need to build out AR aging tabs for two more payors - United and Humana. Model them exactly like the Horizon AR aging tab we already have. Use the aging files in yesterday's folder. Make sure the buckets are <30, 30-60, 60-90, 90+ and that the totals tie to the Combined BS AR line. Put a check row at the bottom.

Document context:
- NWC|Horizon AR Aging template in databook
- United AR aging source file in folder 2025-08-15
- Humana AR aging source file in folder 2025-08-15
- Combined BS with AR in cell C28

**Model Output**

_(no model output recorded for KDN Tasks prompt)_

---

# payroll_001

**User Prompt**

We got the August payroll registers for Project Maple. Add them to the payroll database. There are probably some new hires that won't have role mappings - flag those in yellow. Update all the pivot tabs - by role, by location, by department. Add TTM August column to the summaries. Also need a reconciliation showing payroll per register versus payroll per IS so we can see where the variance is coming from.

Document context:
- August 2025 payroll register
- Payroll database tab (through July 2025)
- Employee role mapping tab
- Pivot tabs: Payroll by Role, Payroll by Location, Payroll by Department
- IS|Consolidated compensation line

**Model Output**

**Subject: Project Maple**

KDN Team,

Hope you are well. Please see the following tasks for Maple today:

📁 {YYYY-MM-DD}

1. Aug-25 payroll register – update payroll database and pivots:
   a. Append the August 2025 payroll register from *{August 2025 payroll register file}* to the existing 'Payroll Database' tab (currently through Jul-25) in *{Project Maple payroll file}* so the data set runs through Aug-25. 
   b. Map any new employees using the existing 'Employee role mapping' tab and highlight any unmapped employees in yellow.
   c. Refresh the pivot tabs 'Payroll by Role', 'Payroll by Location', and 'Payroll by Department' so they reflect data through Aug-25. 
   d. Add a TTM-Aug 25 column to the existing payroll summary views, consistent with the current TTM logic through Jul-25.
   *Note the current payroll database and pivot structure should remain unchanged other than extending through Aug-25.*

2. Aug-25 payroll-to-IS reconciliation:
   a. In *{Project Maple payroll file}*, create a new tab 'Payroll_Recon_Aug25' comparing total payroll per the August 2025 register to the consolidated compensation line on 'IS|Consolidated'.
   b. Structure the reconciliation with columns for payroll category/component, payroll per register, payroll per 'IS|Consolidated' compensation line, variance, and brief notes.
   c. Include checks so the reconciliation ties back to the August 2025 register total and the 'IS|Consolidated' compensation total, and highlight any material variances.

Save to: Project Maple/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# qoe_001

**User Prompt**

Set up the QoE for Project Birch. Structure should be Reported, then Definitional adjustments, then Diligence adjustments, then Pro forma. Need both a summary tab and a detail tab. The detail should have monthly columns and roll up to the summary. Also create an Adjusted IS that shows Reported plus each adjustment category. We have the sell-side adjustment support files to work from.

Document context:
- Project Birch databook (IS and BS complete)
- Sell-side adjustment support files
- IS|Consolidated for reported figures

**Model Output**

**Subject: Project Birch**

KDN Team,

Hope you are well. Please see the following tasks for Project Birch today:

Tonight’s focus is to set up the QoE framework (detail, summary, and adjusted IS) in the Project Birch databook using reported IS and sell-side adjustment support.

📁 {YYYY-MM-DD}

1. QoE detail database and tab:
   a. In *{Project Birch databook filename}* create a 'QoE Detail' tab with columns for Adjustment Type (Definitional, Diligence, Pro forma), Adjustment #, Description, IS line mapping, Support reference, and monthly columns covering the same periods as 'IS|Consolidated'.
   b. Populate 'QoE Detail' using *{Sell-side adjustment support files}*, assigning each line to Definitional, Diligence, or Pro forma and mapping to the appropriate IS line, with monthly amounts by adjustment.
   c. Add a simple check structure (e.g., subtotal rows or a pivot) that summarizes monthly adjustment totals by Type for use in the QoE summary.

2. QoE summary tab:
   a. Create a 'QoE Summary' tab in *{Project Birch databook filename}* with IS line items aligned to 'IS|Consolidated' and columns ordered as Reported, Definitional adjustments, Diligence adjustments, Pro forma adjustments, and Adjusted.
   b. Pull Reported monthly figures from 'IS|Consolidated' and link Definitional, Diligence, and Pro forma columns to the monthly totals from 'QoE Detail', calculating Adjusted as Reported plus all three adjustment categories.

3. Adjusted IS view:
   a. Create an 'IS|Adjusted QoE' tab in *{Project Birch databook filename}* with the same row structure and monthly periods as 'IS|Consolidated'.
   b. Populate 'IS|Adjusted QoE' so that for each month it shows columns for Reported, Definitional adjustments, Diligence adjustments, Pro forma adjustments, and Adjusted, pulling Reported from 'IS|Consolidated' and the adjustment columns from 'QoE Summary'.

Save to: Project Birch/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# edge_001

**User Prompt**

Can you update the schedules with the new data we got? Also make sure everything ties.

Document context:
(none provided)

**Model Output**

Here is a draft you can paste into your KDN email, using placeholders where your specific file names, tabs, and dates are needed  .

📋 **Assumptions & Questions**

Critical assumptions:
• Main schedules are in *{main_databook_file}* and the new data is in *{new_data_file}* for period {period}.
• Tonight’s files are in `{Project}/On-shore Inputs/{YYYY-MM-DD}` and outputs go to `{Project}/KDN Outputs/{YYYY-MM-DD}`.

Clarifying questions:
• Please confirm which specific schedule tabs (for example, '{schedule_tab_1}', '{schedule_tab_2}') should be updated with the new data.

**Draft email**

**Subject: Project {project_name}**

Hi {KDN_name},

Hope you are well. Please see the following tasks for {project_name} today:

📁 {YYYY-MM-DD}

1. Update schedules with new data:
   a. In *{main_databook_file}*, update the following tabs for {period} using data from *{new_data_file}*: '{schedule_tab_1}', '{schedule_tab_2}', '{schedule_tab_3}'.
   b. Ensure each updated schedule ties to its source totals in *{new_data_file}* and to the existing control lines in '{control_tab}' (for example, IS/BS/NWC checks).

Save to: {Project}/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}

---

# edge_002

**User Prompt**

Finish the work from yesterday.

Document context:
(unknown)

**Model Output**

_(no model output recorded for KDN Tasks prompt)_

---

# continuation_001

**User Prompt**

Continue with Project Sequoia from yesterday. The GL vendor tables weren't finished - still need accounts payable detail and accrued expenses. Also the bank reconciliation had issues, I left comments in the tab. And start on the capex schedule if you have time - opening balance, additions, disposals, ending balance format. Use the FA detail file.

Document context:
- Project Sequoia databook (in progress)
- GL vendor tables tab (partially complete)
- Bank reconciliation tab with onshore comments
- FA detail file for capex schedule
- Prior day's work in folder 2025-08-20

**Model Output**

_(no model output recorded for KDN Tasks prompt)_

---

# continuation_002

**User Prompt**

Picking up Academy from last night. Victoria left notes in the error log about the AR variance. Address those first, then continue with the July roll-forward.

Document context:
- Academy databook
- Error log tab with Victoria's notes
- July 2025 trial balances

**Model Output**

_(no model output recorded for KDN Tasks prompt)_

---

# gl_schedule_001

**User Prompt**

Build vendor tables for Academy - need Billing Fees, Professional Services, and Office Supplies from the GL. Use opening/activity/ending format. Group by vendor name. Add source check to Combined IS at bottom.

Document context:
- GL database
- Combined IS
- Vendor table example in databook

**Model Output**

_(no model output recorded for KDN Tasks prompt)_

---

# gl_schedule_002

**User Prompt**

Capex schedule for Lebron - Opening Dec-24, Additions, Disposals, Depreciation, Ending Mar-25. By asset class. Tie to Net PP&E on Combined BS. Use the FA schedule and GL 1600-1699.

Document context:
- FA schedule (prior year)
- GL detail accounts 1600-1699
- Combined BS Net PP&E line

**Model Output**

_(no model output recorded for KDN Tasks prompt)_

---
