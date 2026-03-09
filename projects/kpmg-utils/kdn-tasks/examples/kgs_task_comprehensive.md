# KGS Task Catalogue

This catalogue consolidates the discrete tasks documented across the KGS Thread files and the contextual "KDN - Analysis performed by KDN" inventory. Task families mirror the patterns called out in the context memo (data mapping, schedule building, roll-forwarding, etc.) so the list can double as a playbook for re-use.

## Analysis Plan
- Review every KGS Thread plus the KDN analysis memo to inventory deliverables, dates, and data sources per engagement.
- Bucket the work into recurring task types (roll-forwards, adjustments, payroll analytics, WCap, GL schedules, KPIs, QC/documentation) so similar asks live together.
- Lock a uniform template (Task / What / Data Used / Steps & Subtasks) to describe each deliverable at the same level of detail.
- Populate the template for every unique task, referencing the originating project/thread and highlighting the precise data touchpoints and workflow.
- Cross-check the resulting matrix against the source folders to confirm coverage before saving this master file for future reuse.

## Task Template
Each task entry below follows the same structure to make scoping repeatable:
- **Task:** Short, action-oriented name plus the originating project.
- **What:** One to two sentences summarizing the business objective/outcome.
- **Data Used:** Specific files, systems, or tabs required to execute.
- **Steps & Subtasks:** Ordered checklist capturing the concrete workflow (including calculations, reconciliations, QC steps, and communications) that KGS followed.

---

## 1. Databook & Financial Statement Roll-Forwards

#### Task: Roll-forward Monthly IS/BS through Jul-2025 (Project Academy)
- **What:** Extend the Project Academy databook to cover May–July 2025 while preserving Topside logic and capturing new line items (Cleaning & Personal Supplies, Capital – DWHP, Distribution Payable).
- **Data Used:** “Project Academy – Reported through June 2025 vS” databook, consolidated/location trial balances for May–Jul 2025, location IS/BS tabs, Topside tab.
- **Steps & Subtasks:**
  1. Insert May, June, and July 2025 columns plus TTM May/Jun into every IS/BS tab; copy formulas and formats across locations and Combined/Combining tabs.
  2. Refresh IS|Topside by subtracting the updated location P&Ls from IS|Consolidated, and map the new line items to both IS and BS views.
  3. Load the latest consolidated TBs, tie each period back to source, log any retained-earnings vs net-income breaks in the error log, and highlight unresolved audit checks.

#### Task: Roll-forward Operating Model to May-2025 (Project Lebron)
- **What:** Carry the Lebron operating model, vendor schedules, and month-end reconciliation from March to May 2025 without disturbing historical manual overrides.
- **Data Used:** Project Lebron operating model workbook, April/May TB exports, GL details, vendor tables, “Project Lebron - Month-end files Recon_v4.”
- **Steps & Subtasks:**
  1. Update every Source>> tab with April/May data (keeping prior periods untouched), then extend IS|location, IS|entity, Balance Sheet, and Operating Model IS>> tables to May with matching TTM columns.
  2. Refresh vendor tables, the locations allocation database, and Site adjustments tabs so BHSS adjusted EBITDA still ties to IS|Consolidated; mark completion status in the roll-forward tracker.
  3. Extend “Recon | Month-end to Audit” through May (including the TTM column), ensuring each JE component traces to the new service-month pivots and that Month-end to TB totals reconcile.

#### Task: Convert Quarterly Databook to Monthly Placeholders (Project Event)
- **What:** Rebuild the Project Event databook so all income statement, balance sheet, and EBITDA tabs are monthly (Jan-2022–Jun-2025) while retaining quarterly tables to the right.
- **Data Used:** Project Event databook (07.06.2025), example file “01-25 Batch…Close_w_MstTbl,” FX rates file.
- **Steps & Subtasks:**
  1. Add monthly placeholders across IS/BS/EBITDA sections (Jan-2022 onward) and recalc CY columns as Jan–Dec sums; group the legacy quarterly tables on the right per instructions.
  2. For EBITDA and rent tabs that were already monthly, only add CY columns and ensure the total rows pull from the new monthly ranges instead of dividing quarterly numbers by three.
  3. Append Feb–Jun 2025 data to the FX tab (highlight in green), update recon tabs to continue pulling from the quarterly tables, and verify link consistency after regrouping.

#### Task: Load FY21/FY22 Trial Balances Into Databook (Project SL)
- **What:** Populate the Project SL databook with Sage FY21/FY22 monthly trial balances and align Foundation vs Sage mappings while fixing the equity roll.
- **Data Used:** “Project SL_Draft Databook (03.18.2025)_v2.xlsx,” “Sage TB mapping_18-Mar-25_KGS,” Sage/FIB TB exports.
- **Steps & Subtasks:**
  1. Use the mapping workbook to align Sage GL accounts to the Foundation COA, documenting any unmapped codes in yellow in the IS/BS tabs.
  2. Insert FY21 columns throughout IS and BS tabs (keeping MTD BS references on the right) and remap GL 103 plus other misclassified accounts consistent with management’s internal BS.
  3. Refresh the equity and retained-earnings rolls so monthly movement ties to the new TB data, and run databook checks to confirm zero variance.

---

## 2. Adjustments, Reconciliations & QoE Builds

#### Task: Central Adjustment Database & Location Adjusted IS (Project Academy)
- **What:** Stand up a monthly adjustment database feeding a location-selector adjusted IS plus on-tab adjustment/adjusted tables for every P&L.
- **Data Used:** Project Academy databook, adjustment support files, Bound Brook & Budd Lake adjustment details.
- **Steps & Subtasks:**
  1. Build the adjustment database with fields Type, Adjustment #, Description, GL #/Description, Location P&L, Mapping 1/2, and ensure definitional vs management flags are corrected.
  2. Create the site-based adjusted IS tab that reads from the database via a dropdown, and add “Adjustments” plus “Adjusted” tables beneath every location P&L to sum reported + adjustments.
  3. Reconcile Bound Brook start-up and Budd Lake closure adjustments so QofE detail equals the adjusted IS, then run the name-cleaning macro across the databook.

#### Task: Integrate FY24 Audit Journal Entries (Project Lebron)
- **What:** Incorporate five FY24 audit JE files into the Lebron statements so Dec-24 balances reflect audit adjustments everywhere (IS/BS, recon tabs, Capex).
- **Data Used:** FY24 audit JE summaries, TB legend, Lebron databook (06.29.2025).
- **Steps & Subtasks:**
  1. Create “FY24 audit JE” tab, load each entry, and add columns for Entity #/Name and Location #/Name by parsing the account string and pivoting the TB for the legend.
  2. Add an “FY24 Adjusting Entries” column to every IS by location/entity and BS tab; copy old Dec-24 values to a storage column, then formula the live column as Stored + JE impact (using Copy not Cut to preserve downstream links).
  3. Re-run TB-to-FS recon tabs (IS, BS, Month-end) and update the Capex schedule plus Site adjustment tabs so they reference the adjusted Dec-24 balances.

#### Task: Diligence vs Pro Forma Adjustment Stack (Project Beaver)
- **What:** Transform sell-side diligence/pro forma support into auditable buyer-ready adjustment databases feeding the QoE summary and Adjusted IS.
- **Data Used:** Sell-side databook, adjustment support tabs, Attendant care FY24 cohort assumptions.
- **Steps & Subtasks:**
  1. Database each adjustment (diligence and pro forma) with GL codes, descriptions, locations, and monthly timing (allocating FY24 cohort evenly unless revised by client).
  2. Build summary tabs that roll each adjustment into the QoE detail and Adjusted IS, with cross-checks back to seller support and clear highlighting where support lacks monthly detail.
  3. Validate that the combined Adjustment tab feeds the QoE summary (Reported | Sell-side diligence | Buy-side placeholders | Sell-side pro forma) and mirrors the new Adjusted IS tab.

#### Task: Refresh Fee-Based Income & QofE Commentary (Project Everest)
- **What:** Update the Everest report and databook for management’s latest comments, focusing on non-interest/fee income analytics and supporting contract summaries.
- **Data Used:** Management comments file, audited FS, “PCI MBR - December 2024.pdf,” Aviva distribution and Kognitive services agreements, QoE tabs.
- **Steps & Subtasks:**
  1. Build a “Pro forma adjusted Fee-based income” tab in Report tables>> summarizing fee captions, then mirror the updates in the non-interest income slide with refreshed commentary.
  2. Process PSI’s quarterly GWP, calculate the 7.5% commission, create a graph, and insert it (with narrative) under Insurance income.
  3. Summarize the Aviva and Kognitive contracts in new databook tabs (highlighting financial metrics and run-rate assumptions) and update all QofE tables plus the income statement overview accordingly.

---

## 3. Payroll, Personnel & Census Analytics

#### Task: Payroll Database & Reconciliation (Project Academy)
- **What:** Maintain a dynamic payroll database through May-25, capturing new hires, missing employer taxes, and TTM metrics while reconciling to the IS.
- **Data Used:** Payroll registers Jan-23–May-25, Databook payroll tabs (“Payroll rec - pay date,” “Payroll by role/location,” etc.).
- **Steps & Subtasks:**
  1. Append the May-25 register, map 17 new employees with provisional role mapping, and flag blanks (employer tax, OT hours) for follow-up.
  2. Update every payroll pivot tab (pay date vs period end, by role vs location) plus add TTM May-25 columns while retaining TTM Apr-25 for comparison.
  3. Build the “Payroll per register vs Payroll per IS” reconciliation with component-level variance, and document differences (e.g., DW calculation vs register) in the log.

#### Task: Employee Census & Payroll Pivot Suite (Project Lebron)
- **What:** Produce a complete census of direct and indirect employees plus payroll pivots to analyze salaries, bonuses, and headcount with reconciliations.
- **Data Used:** Payroll register report (Jan-2023 onward), employee mapping tab, bonus summary file.
- **Steps & Subtasks:**
  1. Add a dynamic “Type” column (lookup to Code Categories) in the data tab, and build separate direct and indirect census tables including salaries, bonus, benefits, payroll taxes, headcount, and cost-per-head.
  2. Create Z&S-only, by-location, indirect vs direct, and bonus pivots with reconciliations to the income statement compensation lines.
  3. Add source checks tying each pivot back to the payroll register and to the “Payroll register to TB” tab, highlighting any residual variances.

#### Task: Personnel Analysis Enhancements (Project SL)
- **What:** Enrich the Personnel analysis tab with salary vs burden vs benefits detail plus new HR attributes from the supplementary employee list.
- **Data Used:** Employee listing (job titles, pay rates, raises, PTO), payroll registers, Personnel analysis tab.
- **Steps & Subtasks:**
  1. Insert columns for job title, hire date (calculate tenure), pay type (hourly/salary), exemption status, pay rate, PTO accrual, last raise date/amount, salary, and bonus.
  2. Split salaries vs burden (with a benefits placeholder), add headcount placeholders awaiting monthly data, and ensure payroll burden comparisons reflect employer—not employee—costs.
  3. Reconcile total compensation per employee list to the payroll register totals and flag discrepancies for the client.

---

## 4. Operational KPI & Revenue/Cost Analytics

#### Task: Core vs Non-core KPI Suite (Project Academy)
- **What:** Build KPI analyses by location and combined, splitting core CPT codes (97153/97155/9715) from non-core services plus productivity metrics.
- **Data Used:** “Database (Abbreviated)” tab, CPT mapping, Combined IS.
- **Steps & Subtasks:**
  1. Classify CPT codes into core/non-core buckets and compute agreed charges, billable hours (TimeWorkedInMins/60), and total revenue for each location.
  2. Calculate average billable-hour rates and reconcile total revenue back to each location P&L (including mapping “Home-based” to Main Office).
  3. Replicate the KPI tables in IS|Combined (including N/A/Not known entities) and extend the census/hours/visits/hours-per-visit metrics requested by Victoria.

#### Task: Payroll-Based KPI Bridge (Project Lebron)
- **What:** Split payroll between direct service and SG&A, link the bridge to the operating model, and add KPI ratios explaining variances.
- **Data Used:** Locations allocation database, Operating Model IS>>, Kindle Bridge tab, clinical labor data.
- **Steps & Subtasks:**
  1. Duplicate the allocation database, summing payroll by location/entity and tagging California Psychcare & BRIA costs as direct while routing others to SG&A (retaining cost-type granularity).
  2. Link the bridge tables and BHSS tab to the new payroll split, ensuring adjusted EBITDA ties to IS|Consolidated except for known labor recon differences.
  3. Add the KPI section (net revenue per service hour, labor per headcount/hour, rent per sq ft, etc.) pulling denominators from the operating model and Kindle databook.

#### Task: Backlog & Top Customer Analytics (Project SL)
- **What:** Analyze backlog and top-customer files to flag trends by state, customer, margin, and project status.
- **Data Used:** Top ten customer monthly file (2022–2024), backlog list workbook.
- **Steps & Subtasks:**
  1. Normalize the top-customer file, consolidate names, and compute monthly trends to flag increasing/declining customers while ensuring totals reconcile to the TB.
  2. Clean the backlog master tab, separate “not started,” “ongoing,” and “completed” jobs, and summarize by state, customer, revenue, cost, margin, project length, and percent of total buckets.
  3. For active jobs, compare estimated revenue/cost/margin versus recognized-to-date figures to highlight work remaining and craft follow-up questions.

#### Task: G&A & Rent/Vacancy Trends (Project Senator)
- **What:** Common-size G&A (pub-co vs non-recurring, budget vs actual) and summarize five-year rent/vacancy data with questions for management.
- **Data Used:** Files 3.1–3.3 G&A 2021–2025, 3.1 General & Admin 2025 budget, file 5.6 (5-year average monthly rent & vacancy), add-back support.
- **Steps & Subtasks:**
  1. Load G&A data, split recurring vs non-recurring vs budget, and common-size each year to revenue to pinpoint spikes.
  2. Draft add-back questions noting support gaps and requested backup.
  3. Format the rent/vacancy dataset annually and by property, summarize average vacancy, rent per unit, and highlight trends or anomalies for client synergy assessment.

---

## 5. GL, Vendor & Schedule Construction

#### Task: GL Vendor Tables, AP Aging, CAPEX & Lease Tabs (Project Academy)
- **What:** Clean the GL, build vendor tables for targeted accounts, process AP aging, and create CAPEX plus lease schedules tying back to the balance sheet.
- **Data Used:** GL folder (Billing fees, Professional fees, Database Mgmt, Office Supplies, Retirement plans payable, Chase CC), AP Aging files, BS detail, HOH forecast & lease data.
- **Steps & Subtasks:**
  1. Clean GL descriptions (using memo where vendor names blank) and construct “Vendor tables | IS/BS” tabs with opening balance/activity/ending balance plus source checks to Consolidated IS/BS.
  2. Process each AP aging into the databook, noting variances vs Combined BS and highlighting them for follow-up.
  3. Build the CAPEX schedule (opening/additions/dispositions/end balance) and lease summary tab, tying totals back to BS accounts and inserting checks.

#### Task: Vendor/Prepaid Schedules & Lease Recon (Project Lebron)
- **What:** Reformat prepaid/accrued vendor tables, add new lease recon tab, and ensure descriptions plus checks align with supporting documentation.
- **Data Used:** GL database, supporting documents for prepaids/accruals, lease summary files.
- **Steps & Subtasks:**
  1. Reorder the Vendor tables | BS tab to match supporting docs, inserting JNLDTLDESC as the primary column and grouping to subtotal structures.
  2. Create new lease recon tab (monthly) with columns for lease terms vs IS expense by location, plus variance analysis.
  3. Add any newly requested vendor tables (per Eddie’s notes) and ensure each includes source checks to the consolidated financial statements.

#### Task: Non-Merch Payables & Sundry Consolidation (Project Scout)
- **What:** Combine redundant GL tables, add car-wash unit analytics, and document ARO schedules with tie-outs.
- **Data Used:** Non Merchandise Payables (221032), Sundry Receivables tabs, Car wash data, ARO files.
- **Steps & Subtasks:**
  1. Merge the Non Merchandise and Sundry receivable tabs into single tables per account code, renaming columns and ensuring totals tie to the BS stratified schedule.
  2. Create “Car wash (Units)” tab to pair units with revenue per site and highlight unit-weighted performance.
  3. Build “ARO (240200, 280100)” and “ARO calculation” tabs detailing additions and accretion, tying totals back to BS.

#### Task: Operations Database Build (Project Beaver)
- **What:** Create combined operations databases (client hours, client counts, payroll, headcount) to feed QoE and KPI analyses.
- **Data Used:** OPERATIONS_DATABASE.xlsx, RR Client data, payroll files.
- **Steps & Subtasks:**
  1. Separate tabs for client hours, client count, payroll, and headcount, ensuring each uses consistent entity tags.
  2. Combine RR client and payroll databases where possible (documenting why certain components can’t be merged) and maintain manageable file size.
  3. Add control totals tying each tab back to the GL/vendor tables and note assumptions in the tracker.

---

## 6. Working Capital, Aging & Cash Support

#### Task: Payor-Specific AR Aging Build (Project Academy)
- **What:** Produce Cigna and Aetna AR aging tabs modeled after the Horizon example for NWC analysis.
- **Data Used:** “AR Analysis (06-16-2024)_v3,” Cigna and Aetna AR source files, databook NWC section.
- **Steps & Subtasks:**
  1. Replicate the Horizon template structure for each payor, including buckets, job/customer granularity, and top-10 vs other segmentation.
  2. Populate the NWC|Cigna and NWC|Aetna tabs, tie subtotals to the GL control accounts, and flag variances.
  3. Document findings in the error log and highlight any missing source data.

#### Task: Month-end vs Audit Revenue Reconciliation (Project Lebron)
- **What:** Trace each JE component back to service-date monthly totals and reconcile cumulative revenue between month-end files and the TB/Audit.
- **Data Used:** Month-end files (JE tabs), “Recon| Month-end to Audit,” Service date pivots.
- **Steps & Subtasks:**
  1. For each JE tab, copy the pivot, filter to Service month/year, and rebuild the table so only 360CalcChr values remain.
  2. Link the “Recon | Month-end to Audit” tables to the monthly outputs, ensuring each JE subtotal ties to the cumulative revenue figure for that month.
  3. After updating Jan-, Feb-, and Apr-25, calculate line-by-line differences between consecutive months to isolate anomalies; hardcode if file size requires, citing the “NL” version as backup.

#### Task: AR/AP Aging & Bank Reconciliations (Project SL)
- **What:** Process AR/AP agings and bank reconciliations for FY23–Feb25, ensuring each ties to the balance sheet.
- **Data Used:** AR aging, AP aging, GL 1010 bank statements (Jan-24–Feb-25), databook agings section.
- **Steps & Subtasks:**
  1. Build AR/AP tabs for each period, summarizing by job/customer and reconciling ending balances to the BS.
  2. Perform monthly bank reconciliations for GL 1010 (Accounts Payable – FIB), noting missing Feb-25 data and filling gap once provided.
  3. Insert source checks at the bottom of each tab and flag unreconciled amounts for Victoria.

#### Task: AR/AP Quarterly Roll-up (Project Senator)
- **What:** Summarize monthly AR/AP agings by quarter and identify top aged accounts for follow-up.
- **Data Used:** File 3.8 AR and AP aging (monthly), prior year-end agings.
- **Steps & Subtasks:**
  1. Sum the monthly agings into quarterly totals, presenting trends for management’s review.
  2. For the latest monthly aging, sort the largest aged accounts, then check if those accounts also appeared in Dec-24 or Dec-23 agings.
  3. Document persistent delinquencies and draft questions or support requests accordingly.

---

## 7. Capex, Real Estate & Lease Analyses

#### Task: Maintenance, Occupancy & Real Estate Schedules (Project Scout)
- **What:** Build the suite of M&R occupancy, cash rent, real estate adjustment, and store-count schedules to support QoE adjustments.
- **Data Used:** Site (ST lease & IOL) tabs, Cash rent data, FMV valuations, store-count files.
- **Steps & Subtasks:**
  1. Populate “Site (ST Lease and IOL)” and “Closed sites (Prior 2018)” tabs with updated site lists and metrics.
  2. Create “M&R Occupancy” and “Cash rent by site” tabs, linking cash rent totals back to reported IFRS 16 rows and flagging variances where FMV data is pending.
  3. Update store count summaries and real estate adjustment tabs (including FMV continuity) so they tie to the stratified BS and adjustment database.

#### Task: Lease & Fire Cancellation Analyses (Project Lebron)
- **What:** Produce monthly lease reconciliations and process the fire cancellations dataset to refresh the clinical labor views.
- **Data Used:** Lease summary tab, Location detail tab, Fire cancellations source file, new ClinicalLabor tab.
- **Steps & Subtasks:**
  1. Add a monthly lease recon tab comparing lease agreements (per location) to reported IS lease income/expense, with variance analysis.
  2. Process the Fire cancellations tab into a structured table (location, client, employee, service, rates, scheduled units, revenue, cost, direct contribution) while retaining source formulas.
  3. Replace the existing ClinicalLabor tab with the updated version, and refresh the Labor expense recon plus Clinical labor by location tabs to reference the new dataset.

#### Task: Capex by Property & Suite Turnover Metrics (Project Senator)
- **What:** Analyze five-year capex files and suite turnover capex to inform property-level diligence questions.
- **Data Used:** File 5.13 (5-year capex by property), file 5.12 (Suite turnover capex), mapping tab.
- **Steps & Subtasks:**
  1. Process the 5.13 tab by asset type, tagging each row in column B, keeping GL # and account name fields, and aggregating totals by property for FY22–FY24.
  2. From the suite turnover file, compute average spend per turnover event and per property, treating each year’s spend as a single instance tied to the tenant turnover.
  3. Summarize the findings (spend distribution, outliers, implied run-rate) for inclusion in the diligence deck.

---

## 8. Reporting, QC & Supporting Documentation

#### Task: Report & Databook QC (Project Everest)
- **What:** Full QC of the Everest report and databook focusing on formatting, references, terminology, and incorporation of management comments.
- **Data Used:** Report, databook, “Management comments” tracker.
- **Steps & Subtasks:**
  1. Verify that every management comment update appears consistently across slides, tables, and databook tabs (especially QofE, Adjusted IS, Net interest income).
  2. Check headline colors, font sizes, appendix numbering, glossary terms, and replace “the Company” with “Everest” per instructions.
  3. Document open issues in the error pages file and confirm with Danielle once cleared.

#### Task: Comprehensive Databook QC & Error Log (Project Scout)
- **What:** Run through the IS and BS databooks, logging inconsistencies and providing marked-up PDFs for the onshore team.
- **Data Used:** Project Scout IS/BS databooks, error log PDF.
- **Steps & Subtasks:**
  1. Perform formula and tie-out checks across income statement and balance sheet tabs, noting unresolved issues in the error column tab (status-driven).
  2. Mark report inconsistencies directly in PDF with commentary (e.g., mismatched figures, mislabeled captions) and indicate which were updated.
  3. Share the updated databooks plus error log, highlighting items still pending for client input.

#### Task: Time-Series QC & Error Log Maintenance (Project Academy)
- **What:** Maintain an error log tied to time-series checks (IS/BS) to catch net-income vs retained-earnings breaks and other anomalies.
- **Data Used:** Time series tab, error log, databook checks.
- **Steps & Subtasks:**
  1. Run the time-series check (expected zero) after each update; log any deltas with references to the affected tabs/rows.
  2. Highlight issues such as net income vs retained earnings mismatches or source inconsistencies and communicate them via email.
  3. Track resolutions (status, owner, date) to give the onshore team visibility before deliverables go to the client.

#### Task: Month-End File VDR Packaging (Project Lebron)
- **What:** Prepare month-end files for VDR upload by embedding KPMG recon sections and clear source traces.
- **Data Used:** Six month-end files (green tabs), “Billings to revenue recon” tab, JE - 360BHI Lumary example.
- **Steps & Subtasks:**
  1. Manipulate each green pivot tab so columns show DOS month (Service date) and include only required fields (360CalcChr plus month).
  2. At the bottom of each tab, add a “KPMG recon >>” section with copies of the monthly pivots and links back to the source tab so reviewers can trace values.
  3. Repeat for all six month-end files, ensuring the recon matches the “Recon | Billings to TB” cumulative table and flagging any variances for Cindy.

