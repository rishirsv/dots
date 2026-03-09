# Meeting Notes Summary

**User:** Rishi Sharma (rishisharma@kpmg.ca)  
**Created:** 1/8/2026 10:53:54  
**Updated:** 1/8/2026 11:11:38  
**Exported:** 1/8/2026 11:14:52  
**Link:** [https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd311-b988-833f-abf5-55036102f729](https://chatgpt.com/g/g-6937393ee8a081bda6ceb556401a5e8c-meeting-intelligence-beta/c/695fd311-b988-833f-abf5-55036102f729)  

## Response:
Thought for 1m 2s

FDD Meeting Notes — Operating Model Walkthrough and Site-Level Economics
========================================================================

*   Date: Not provided in transcript
*   Deal Context:
    *   Target: Not provided in transcript
    *   Industry: Behavioral health services (ABA) and behavioral respite / personal care assistance
    *   Purpose: Walk through the operating model file (tabs, sources, mechanics) and align on how site-level economics, consolidated financials, and EBITDA adjustments are built and traced. Review key data requests and where/how they will be fulfilled.
    *   Participants: CFO, External Advisors / FDD Team, Controller (mentioned), Revenue Cycle leader (mentioned), Chief People Officer (mentioned)
*   Transcript:

* * *

Attendees & Roles
-----------------

*   CFO
*   Consultant (External Advisor / FDD Team)
*   Controller (“Morrison”) (mentioned as the source for TB / GL items)
*   Director of Revenue Cycle (“Yang”) (mentioned as owner for billing/collections export walk-through)
*   Chief People Officer (mentioned as provider of employee census snapshot)

* * *

Operating Model Overview, Assumptions, and Planned Data Improvements
--------------------------------------------------------------------

### Key Takeaways

*   Site-level revenue in the model is currently driven by location-level blended funding rates that may be outdated due to mix changes, creating diligence risk around the accuracy of true site economics until more granular reporting is implemented.
*   A planned SQL database is intended to materially improve revenue attribution and slicing (payer, service setting, etc.), but the timing (targeted by end of June) means diligence work must proceed with interim methods and clear limitations.
*   The model is positioned as an internal “pretty good sense” tool rather than a fully auditable site-revenue system today, implying diligence conclusions should lean on TB/financial statements for reported results and treat site outputs as directional until tie-outs are proven.

### Meeting Notes

**Blended funding rate assumption by location**

*   The model uses a blended revenue rate by location and payer category (e.g., school districts, regional centers, private insurance), established during budget build (described as sometime in Q3/Q4 of the prior year).
*   The blended rates were not updated after the CFO joined; it was explicitly noted that rates “may have been accurate at the time” but are “probably not now” because of changes in client mix and related dynamics.
*   The blended rate is described as “revenue divided by the hours” for a given month (a guess was made that the reference month may have been September, tied to budget timing), and it blends service types such as direct care and supervision (codes referenced: 97153/97154).

**SQL database build to improve revenue precision**

*   Work is underway to build a SQL database to pull revenue by location precisely on a monthly basis, with the ability to break down by payer category (district / regional center / private insurance) and by service setting (center vs school vs home vs telehealth).
*   The historical data was described as lacking this desired granularity; the SQL build is meant to remediate this limitation.
*   Target timing stated: “hoping to have it by end of June” and “start Q3 with it,” supported by outsourced development providers.

### 💡 Insights

*   Location-level blended rates are a common interim workaround in multi-payer healthcare services, but they can misstate site margins materially when payer mix, authorization patterns, or service setting mix shifts.
*   Building a repeatable site-revenue cube (payer × location × setting × month) typically becomes a cornerstone for diligence defensibility, especially when the investment thesis depends on clinic-level scalability and capacity utilization.
*   Where site economics are directionally useful but not fully tie-able, diligence write-ups often need explicit caveats and a plan to reconcile (e.g., sampling tie-outs by location/month) to avoid over-reliance on model outputs.

* * *

Source Data Tabs: Labor, Service Hours, Census, and Forecast Mechanics
----------------------------------------------------------------------

### Key Takeaways

*   Direct clinical labor and operational activity volumes (hours, census) are sourced from systems (payroll and EHR extracts), reducing manipulation risk for those specific inputs, but revenue attribution remains the weaker link until SQL is implemented.
*   Forecast sections (including placeholders labeled for 2026) are explicitly not intended for diligence use; diligence should anchor on actuals and TB-driven reporting rather than future placeholders.
*   The model includes internal operational controls (e.g., billed hours vs paid hours ratio checks) that can highlight productivity leakage, which may become a diligence discussion area even if not fully quantified here.

### Meeting Notes

**Clinical labor (direct costs)**

*   The “Clinical labor” tab is used to pull direct cost actuals applied to each clinic.
*   Data is described as downloaded straight from payroll, with “no massaging.”
*   Green fields are described as helper fields (e.g., concatenated unique identifiers) used to facilitate auditable lookups.

**Funding rate pull-through**

*   A “Funding rate” tab pulls the blended rate assumptions into a structured layout by clinic and funding source to support downstream lookups into clinic worksheets.

**Service hours and census**

*   “Service hours” are pulled straight from the underlying data source, segmented by funding source, location, and service type (direct vs supervision).
*   “Census” is pulled from the EHR extract and used to feed the model.
*   A derived “service hours per census” calculation is used (service hours divided by census).

**Forecast mechanics and explicit non-reliance on placeholders**

*   Forecast is pulled into a gray section as the most current forecast and is updated “probably quarterly.”
*   Yellow sections labeled for 2026 were described as placeholders that simply pull the same month from the prior year and are “not at all accurate” and should be ignored.

**Operational ratio check: billed hours vs paid hours**

*   A clinic summary view includes paid hours from payroll records to compare against billed hours; the purpose is to check the ratio of hours billed vs hours paid.
*   The typical ratio expectation was described as “85 or 90%” depending on category, with unbillable time drivers cited (travel time, report writing).
*   The ratio is used to identify situations where employees are spending a disproportionate amount of unbillable time.

### 💡 Insights

*   In ABA and home-based services, billed-vs-paid ratios can swing with staffing mix, travel radius, documentation requirements, and cancellations; stable measurement can help separate operational issues from payer timing noise.
*   Quarterly forecast refreshes are common, but for diligence, the key value is often (a) the underlying operational drivers and (b) whether the reporting cadence is disciplined and reproducible.

* * *

Trial Balance Structure, Period 14 Audit Adjustments, and Mapping Rules
-----------------------------------------------------------------------

### Key Takeaways

*   The TB-to-reporting workflow is structured to incorporate audit adjustments via a period 14 convention, which can improve clarity for “adjusted FY” reporting if consistently applied.
*   Because balance sheet and P&L treatment differ for period 12 vs period 14, diligence tie-outs must be explicit about which “version” of period 12 is being used (P&L adjusted 12 vs BS period 14).
*   The TB provided in the model is a monthly working TB (not the detailed TB requested), indicating additional diligence support is expected via a detailed TB delivered separately.

### Meeting Notes

**TB ingestion and usage**

*   A TB tab is used monthly; black-font data is provided by the controller and dropped into the file.
*   A detailed TB was requested by the diligence team and will be sent separately.

**Period 14 convention**

*   Period 14 is used to capture audit adjustments.
*   For P&L: period 12 is treated as “12 plus period 14” to create an “adjusted 12” for P&L line items.
*   For balance sheet: period 12 is ignored and period 14 is brought in (i.e., the balance sheet reflects the audit-adjusted balances via period 14).
*   There is no period 13.

### 💡 Insights

*   A dedicated audit-adjustment period is a practical way to preserve the “pre-audit close” vs “post-audit close” trail, but diligence workpapers must be consistent about which layer is used for LTM/YTD calculations.

* * *

Clinic-Level Economics Tabs and Two Lines of Business
-----------------------------------------------------

### Key Takeaways

*   The model’s clinic tabs are standardized mechanically, but clinic-level revenue is sometimes forced to tie to actual monthly revenue totals via an adjustment factor, signaling that site outputs are partially “trued up” rather than purely system-derived.
*   The business operates two distinct service lines with different delivery settings (ABA across center/home/schools vs support services predominantly in-home), implying that economics, staffing patterns, and payer dynamics likely differ by line and should be analyzed separately where possible.
*   Some personnel cost attribution is driven by payroll location tagging (e.g., senior leadership tagged to a single clinic), which can distort clinic comparability unless/ until a dedicated “leadership location” or allocation approach is implemented.

### Meeting Notes

**Clinic tab mechanics and naming**

*   Clinic sheets are largely identical and pull from the gray source tabs; the tab name drives the lookups (renaming a tab changes the data pulled).
*   Naming conventions distinguish locations and lines of business, including a support services designation.

**Two lines of business**

*   California site care: ABA services (applied behavioral analysis) for autism spectrum.
*   Behavioral respite / support services: personal care assistance for individuals with intellectual and developmental disabilities, described (with caveats) as akin to “babysitting,” including support with daily living (toileting, feeding, community outings).
*   ABA delivery setting mix described using an example market: roughly half in-center, about “40%” in-home, and some in schools; support services is predominantly in-home, with some cases in residential facilities.

**High-acuity staffing example**

*   A specific example was described where four employees provide care to one individual, “four at a time, 24 hours a day,” due to safety risk (danger to themselves and others), delivered in a facility.

**Revenue tie-to-actual adjustments inside clinic sheets**

*   Because the model’s revenue is driven by the blended funding rate assumptions and operational inputs, revenue does not automatically tie to reported actuals.
*   A formula is used to “force” modeled revenue to tie more closely to actual monthly revenue totals for internal reporting purposes by scaling the funding rate by a percentage.
*   Example cited for one location/month pattern: January revenue was forced up by “almost 4%,” February by “2%,” and March by “less than 1%,” with the stated intent of producing a “pretty good sense” of clinic performance until SQL reporting is available.

**De novo sites and bookend ranges**

*   “S&E start and end” bookend tabs define the ranges included in business summaries.
*   There are versions of the end (“E1” vs “E2”) to allow views including or excluding a set of de novo clinics.
*   De novo clinics have more forecast-driven inputs due to lack of historical data.

**Direct costs and wage-rate mechanism**

*   Direct costs are pulled as actual direct payroll costs from the payroll system; there is not a forced wage rate mechanism for actuals.
*   For certain forecast components (e.g., management center and BCBA), an approach is used that takes an average of the last three months and runs it forward; other direct components are driven by service hour projections.

**Senior leadership cost location tagging**

*   Some clinics include a “senior leadership” cost because a senior leader spanning multiple clinics is tagged in payroll to a specific clinic location; those costs are left in that clinic until a separate leadership location is created.

### 💡 Insights

*   For multi-site healthcare, clinic-level “four-wall” reporting is most useful when (a) revenue is attributed consistently, (b) leadership/ shared labor is either separated or allocated consistently, and (c) occupancy and shared overhead policies are explicit. Any gaps in these areas can create misleading clinic ranking.
*   High-acuity 1:1 (or higher) staffing cases can create outlier economics that may warrant separate tracking (operationally and for diligence narrative) to avoid conflating them with baseline service delivery.

* * *

Consolidated Financial Views, Legal Entity Views, and Management Opex Labor Modeling
------------------------------------------------------------------------------------

### Key Takeaways

*   Reported financials used by auditors are pulled directly from the TB into standardized consolidated and entity-level views, improving traceability for diligence conclusions on historical performance.
*   Management operating expenses and indirect labor are modeled forward-looking with employee-level detail and burden rates, but historical indirect labor detail is not captured in that schedule, limiting backward-looking analysis from that component.
*   Multiple internal output views exist (including CPC / support services splits and lender vs management EBITDA), but terminology and labeling inconsistencies create interpretation risk and require careful reconciliation in diligence deliverables.

### Meeting Notes

**TB-driven reporting**

*   A set of darker gray tabs are described as coming directly from the trial balance and represent what auditors see.
*   These tabs are populated monthly by dragging across TB-derived values; there are no manual inputs in those tabs.

**Legal entity references**

*   The model includes distinct legal entity groupings referenced as CPC (ABA/autism), BRIA (support services), and ZNS (management), plus an “other” catch-all.
*   These are described as easy to tie to ledger data via clear formulas referencing entity/category/month/year.

**ZNS comp / management opex labor forecast**

*   A management opex compensation tab includes employee-level details (ID, name, position, location, FTE status) and runs through 2026 (with prior guidance that 2026 placeholders are not meaningful).
*   A burden rate is applied based on historical data, with different burden rates for wages vs bonuses because “bonuses just tax” (no medical benefits).
*   The output is intended to reconcile to expected P&L amounts; an example expectation was cited as “April of $1.2 million” for wages + bonus + taxes (as a P&L expectation for that modeled component).

**P&L view variants**

*   There is a consolidated P&L view and additional variants that show CPC and support services impacts; the consolidated view is described as the primary diligence-relevant view.

### 💡 Insights

*   Where management reporting includes both “management EBITDA” and “lender EBITDA,” diligence typically benefits from explicitly bridging between them and clarifying which adjustments are lender-accepted vs management-only and how they map to QoE adjustments.

* * *

EBITDA Adjustments Workbook, Credit Agreement Structure, and Startup Losses Treatment
-------------------------------------------------------------------------------------

### Key Takeaways

*   Adjustments are tracked in Excel and structured to mirror the credit agreement, providing a useful starting point for diligence-adjustment identification, but historical narrative support may be limited prior to the CFO’s start date.
*   Some adjustments are lender-accepted and others are explicitly disallowed today (with potential revisit if covenants tighten), meaning diligence should separate (a) recurring earnings, (b) management add-backs, and (c) lender-accepted add-backs.
*   Startup losses have explicit time and dollar caps (initial month window and per-location/aggregate limits), which is critical for ensuring add-backs are not overstated and for assessing sustainability of “adjusted” earnings.

### Meeting Notes

**Adjustments tracked via Excel**

*   Adjustments are “done via Excel,” and for earlier history the file may contain “just numbers and cells” with limited supporting detail.
*   For periods from December onward, the CFO’s adjustments are expected to have clearer structure and traceability within the workbook.

**Credit agreement-aligned structure**

*   Adjustments are organized consistent with the credit agreement categories (examples cited include startup losses and transaction fees), with definitional excerpts included in the worksheet for reference.
*   The worksheet includes both management adjustments and lender adjustments; differences are calculated to show what management includes that the lender does not accept.

**Lender acceptance and disallowance**

*   Items flagged as “no” are currently disallowed by the lender, with the stated caveat that if covenant compliance becomes tight, the lender may revisit them but is not investing time reviewing them now.
*   One explicitly mentioned disallowed item: SQL development costs are not accepted by the lender in the lender total.

**Caps/limits logic**

*   The workbook includes logic to ensure certain buckets are not overstated, including a cited cap that “shall not collectively exceed $750k for any trailing 12 month period” for specific categories (referenced as “M and O”).

**Startup losses and discontinued operations feed**

*   A separate sheet (startup losses and discontinued operations) pulls straight from the TB.
*   For discontinued operations, sublease income (if any), actual expenses, and the carried loss are tracked.
*   For startups, revenue, operating expense, depreciation, and related costs are summarized, with net loss used to feed the startup loss adjustment category.
*   Startup loss adjustment treatment was described as lender-allowed.
*   Startup loss period and limits were described as: initial “eight months” (stated with uncertainty) with limits “not to exceed $200,000 per location” and “aggregate not to exceed $500,000.”

### 💡 Insights

*   Credit-agreement add-backs can be directionally helpful for diligence, but they may not align with buyer QoE standards; diligence often needs to re-underwrite each add-back for recurrence, documentation quality, and whether it is truly non-operational vs a chronic cost of doing business.

* * *

New Site Ramp, Geographic Strategy, and Implications for Pro Forma Treatment
----------------------------------------------------------------------------

### Key Takeaways

*   The ramp profile for new sites is not supported by a mature historical FP&A framework (described as previously weak), which limits confidence in pro forma “maturity” adjustments without additional evidence.
*   Strategic emphasis is shifting toward densifying within California near existing clinics (leveraging payer relationships and waitlists) rather than expanding to new states, suggesting lower ramp risk in core markets but still requiring proof via early clinic cohorts.
*   Recently opened or ramping sites (including a new Location A site and newer markets like Orange/Lincoln) may require specific diligence disclosure on run-rate stability and potential pro forma framing.

### Meeting Notes

**Lack of standardized ramp history**

*   It was stated that historical modeling from an FP&A perspective was “substandard and weak,” and while new models now exist, there is not a robust history to conclude a standard maturity curve for new clinics.

**Multi-state expansion concerns**

*   A location in Lincoln, Nebraska was discussed as an example of out-of-state expansion, with skepticism expressed due to slow ramp, lack of payer relationships, and operational complexity of managing across states.

**California densification approach**

*   Many clinics were described as full with waitlists.
*   A near-term plan is to open additional locations close to existing ones to redirect waitlist demand and build density.
*   A new Location A site was stated as opened “last Monday,” about “7 miles” from an existing Location A, with expectation it can be filled “within a month or two” by redirecting waitlist demand.
*   Similar “close proximity” expansion was described for Commerce (a “5 minute walk” from an existing site) and a hoped-for expansion in Long Beach.
*   The rationale includes capturing local density, strengthening brand presence, and keeping competitors at bay.

**Identifying newer sites in the model**

*   Certain sites were identified as newer (including Orange and Lincoln as new in the current year).
*   Sacramento was described as started in December 2023, with a growth trajectory and a forecast to reach “roughly $250,000 a month” in revenue.
*   Other sites suggested as reference points for “recently new” dynamics included Modesto and Lompoc.

### 💡 Insights

*   “Close-in” de novo openings leveraging existing waitlists can reduce demand risk but may introduce cannibalization questions; diligence often benefits from tracking whether total market volume grows versus just shifting between sites.
*   Pro forma maturity adjustments generally require an evidence-based ramp curve (or, at minimum, consistent cohort data); absent that, diligence typically leans toward disclosure and sensitivity framing rather than firm add-backs.

* * *

Board and Lender Reporting Pack (MD&A Tab), EBITDA Definitions, and KPI Reporting
---------------------------------------------------------------------------------

### Key Takeaways

*   Management and lender reporting includes distinct EBITDA constructs (management EBITDA vs lender EBITDA) with category-level adjustments linked back to the adjustments worksheet, which should enable diligence traceability if the underlying categories are well-documented.
*   Historical internal reporting prior to the current year was described as unreliable/unsatisfying, implying diligence may need to reconstruct trend views from TB/financial statements rather than relying on legacy management packs.

### Meeting Notes

**Monthly reporting to board and lenders**

*   A monthly package is sent to the board and lenders with commentary and comparisons (month vs prior month, year-over-year vs budget).
*   This package includes management EBITDA and lender EBITDA views both on a monthly and year-to-date basis.

**Adjustment visibility**

*   In the 2025 income statement review section, the adjustments are shown by category and link directly back to the adjustments sheet, described as easy to follow and trace.

**Historical reporting quality**

*   Historical internal reporting (before the current year) was described as not satisfactory and creating “more questions than answers,” leading to starting from scratch going forward.

* * *

Budget Construction Limitations and Diligence Relevance
-------------------------------------------------------

### Key Takeaways

*   The budget (particularly operating expenses) was described as constructed via prior-year plus a percent, straight-lined monthly, reducing its usefulness for variance analysis and limiting the diligence value of “actual vs budget” narratives.
*   Because the budget lacks driver-based detail, diligence should prioritize actual trends, TB-backed explanations, and adjustment logic rather than treating budget variance as a primary diagnostic.

### Meeting Notes

*   The operating expense budget was described as not done well and built as prior year plus a percentage, with amounts evenly spread across each month (same value repeated), making monthly variance analysis difficult.
*   There was no background detail available for why specific budget categories were set the way they were.
*   It was noted this is unusual for a company described as “over $100 million.”

* * *

Diligence Data Requests Review, Owners, and Delivery Plan
---------------------------------------------------------

### Key Takeaways

*   Key diligence needs (detailed TB, GL breakdowns, revenue/billing exports, payroll registers, fee structures, leases) are mapped to specific owners (controller, revenue cycle leader, HR) but several items depend on systems exports and may not reconcile cleanly without additional analysis.
*   Revenue cycle exports are expected to be large (“tens of thousands of rows”) and likely require data analytics support; tie-out to financials is anticipated to be non-straightforward due to billing adjustments and top-side entries.
*   Corporate overhead is not allocated to clinics today, meaning true clinic “EBITDA” and line-of-business EBITDA splits (ABA vs respite) are not currently known; allocation methodology is planned but depends on improving revenue precision first.

### Meeting Notes

**Trial balance and reconciliation**

*   A detailed TB is expected to be provided separately from what is embedded in the model.
*   The model is intended to demonstrate how financial statements are derived from the TB.

**Audit timing**

*   FY24 audit was stated as in process, targeting completion by end of June (lender requirement by end of June), with hope for mid-June.

**Org chart / employee census**

*   A formal org chart was not available.
*   An employee census snapshot “as of today” was obtained from the Chief People Officer and will be uploaded, including employee IDs and supervisor names (enabling an org chart to be constructed by analytics).
*   Historical end-of-year employee census snapshots were not believed to be available; UKG data was described as messy for historical “as-of” views without saved snapshots.

**Payroll / HR systems**

*   UKG is used for HRIS; payroll is in-house but UKG supports HRIS needs. This is consistent across all states/locations.

**Geography footprint**

*   Lincoln, Nebraska facility described as having “5 employees.”
*   Other than Lincoln, remote employees in other states were described as “maybe no more than a dozen.”
*   Revenue concentration described as “99 plus percent” in California.

**Revenue, billing, and collections exports**

*   For revenue/billing/collections requests, the plan is to provide a very large MySQL report export containing the requested raw data, with many columns and tens of thousands of rows.
*   The diligence team was directed to route detailed questions to the director of revenue cycle (“Yang”) after receiving the export.
*   Timing note: Yang will be out of the country for the last two weeks of May, so diligence was encouraged to engage earlier.

**Tie-out expectation (raw data vs financials)**

*   It was stated that the raw data feeds the financials, but it was also anticipated that a 1:1 tie-out is unlikely to be straightforward due to billing adjustments and related entries; detailed understanding is expected to sit with revenue cycle.

**Pricing / fee structure**

*   It was stated there is not a “price fee schedule” set internally because insurers determine pricing.
*   A “fee structure for the last three years” was stated as available and planned to be uploaded.

**Corporate overhead and clinic economics scope**

*   No corporate overhead allocation to clinics is performed today; clinic tabs go to direct contribution and exclude items such as rent, executive time, marketing, and legal allocations.
*   Rent exists on the overall P&L within operating expenses by location but is not shown on the clinic worksheet views.
*   A future allocation methodology is contemplated but will not be implemented before the diligence work is completed, and is dependent on improving revenue attribution accuracy by location first.
*   A key unresolved question was explicitly stated: true EBITDA split between the ABA business and the support services business is not known under current allocation practices.

**Occupancy / leases**

*   Diligence requested a summary of leases; the preferred first step is a lease summary with key financial terms (start date, renewal periods, monthly rate). If not available, providing the lease agreements was discussed as an alternative.

**Compensation structure and accounting policies**

*   Certain accounting policy and compensation structure requests were assigned to the controller for response.
*   A reconciliation of “employee census compensation costs to P&L” was stated as not expected to be available (“don’t see that happening”).

**Engagement letter / process**

*   The advisor noted internal risk-management approvals delaying the formal engagement letter, but work would begin in parallel; this was framed as an internal approvals issue rather than a conflict.

### 💡 Insights

*   When billing exports are “raw and huge,” diligence frequently needs a scoped reconciliation approach (e.g., sample months, top payers, key locations) to establish confidence without boiling the ocean.
*   Lack of corporate overhead allocation is common in growth-stage multi-site services; diligence typically addresses this by (a) separating corporate EBITDA from clinic contribution and (b) applying a transparent allocation or sensitivity where required for valuation discussions.

* * *

Key Findings
------------

### Figures

| Category | Item | Value | Period/Context |
| --- | --- | --- | --- |
| Systems / Data | Target timing for SQL revenue-by-location database | End of June (target), start Q3 goal | Planned build to enable granular monthly revenue reporting |
| Internal reporting | Modeled revenue forced adjustment example | January ~+4%; February +2%; March <1% | Example of scaling funding rate to tie modeled to actual monthly revenue |
| Opex / Payroll modeling | Expected management opex comp total (wages + bonus + tax) | $1.2M | Stated as expected to show on P&L for April |
| Add-backs / Credit agreement | Cap referenced for certain add-back buckets | $750k (trailing 12 months, collective) | Logic included to avoid overstating specific categories |
| Add-backs / Startup losses | Startup losses allowed window | ~8 months (stated with uncertainty) | Lender-allowed add-back category |
| Add-backs / Startup losses | Startup loss caps | $200k per location; $500k aggregate | Limits cited for lender-allowed startup losses |
| Growth / Ramp | Sacramento forecast revenue target | ~$250k per month | Forecasted run-rate referenced for a newer site |
| Footprint | Lincoln facility headcount | 5 employees | Out-of-state facility discussed |
| Footprint | Revenue concentration | “99 plus percent” in California | Stated revenue mix by geography |
| Expansion | New Location A proximity | ~7 miles from existing | Opened “last Monday,” expected to fill in 1–2 months |

### Potential Adjustments

| Ref | Item | Category | Type | Brief Rationale |
| --- | --- | --- | --- | --- |
| **QoE1** | Startup losses (credit agreement add-back) | EBITDA | Normalize | Startup losses are tracked and described as lender-allowed, with explicit caps and a defined initial-month window. |
| **QoE2** | Transaction fees / one-time items (per adjustment workbook structure) | EBITDA | Normalize | Adjustments workbook is structured to capture one-time/transaction-type categories per credit agreement definitions. |
| **QoE3** | Lender-disallowed adjustments (e.g., SQL development) | EBITDA | Normalize | Certain items are tracked as management add-backs but explicitly not accepted by the lender today. |
| **QoE4** | Pro forma treatment for ramping / newer clinics | EBITDA | Pro forma | Diligence raised the need to frame ramping sites; historical ramp evidence was stated as weak, implying disclosure/sensitivity may be required. |

### Risks

*   🔴 **Site-level revenue accuracy risk until SQL implementation** — Blended funding rates by location may be outdated due to mix changes; modeled revenue is sometimes scaled to tie to actual totals, limiting “true” site economics confidence.
*   🔴 **Raw billing data vs financials reconciliation complexity** — It was anticipated that tying raw billing exports to financial statements will not be straightforward due to billing adjustments/top-side entries and requires revenue cycle expertise.
*   🟡 **Clinic comparability distortion from payroll location tagging** — Senior leadership spanning multiple sites may be recorded in a single clinic due to payroll tagging; without a leadership location or allocation methodology, clinic-level labor comparisons can be skewed.
*   🟡 **Line-of-business EBITDA uncertainty** — No corporate overhead allocations are performed today; true EBITDA for ABA vs support services was explicitly stated as unknown under current reporting.

### Contradictions / Gaps

*   Blended funding rates are used for forward-looking / site modeling despite acknowledgement they likely do not reflect current mix; the precise impact on site profitability is not quantified here.
*   Historical management reporting and FP&A models were described as unreliable; trend interpretation may require reconstruction from TB/financial statements rather than relying on older internal packs.
*   No clear historical “as-of” employee census snapshots were confirmed as available from UKG; only a current-point-in-time snapshot was planned.
*   The organization does not currently allocate rent and corporate overhead into the clinic-level “direct contribution” views; the pathway to “true clinic EBITDA” is dependent on future SQL-driven revenue precision and subsequent allocation methodology work.

* * *

Open Items & Follow-Ups
-----------------------

| Priority | Item |
| --- | --- |
| **\[H\]** | Provide detailed trial balance and GL breakdowns requested by diligence (separate from the monthly TB embedded in the model). |
| **\[H\]** | Provide the large MySQL raw export covering revenue, billing, and collections (dozens of columns; tens of thousands of rows) and schedule a working session with revenue cycle lead for interpretation and tie-out approach. |
| **\[H\]** | Confirm and document the reconciliation approach between raw billing data and financial statements, including identification of billing adjustments/top-side entries that break a simple 1:1 tie. |
| **\[M\]** | Upload employee census snapshot (as-of current date) including employee IDs and supervisor names to enable an org chart build. |
| **\[M\]** | Provide pricing / fee structure documentation for the last three years (noting insurer-determined pricing context). |
| **\[M\]** | Provide payroll registers, bonus schedule, and any severance schedule (noting severance is expected to appear in adjustments). |
| **\[M\]** | Provide occupancy / lease summary with key financial terms (start date, renewal options, monthly rate); if unavailable, provide lease agreements. |
| **\[M\]** | Provide accounting policies and compensation structure overview as coordinated through the controller. |
| **\[L\]** | Clarify naming consistency for Location A vs second Location A (tab naming / lookup updates) to avoid misinterpretation in model extracts. |
| **\[L\]** | Identify whether any historical UKG “snapshot” reports exist to support year-end headcount/organization analyses; if not, document limitation for diligence. |

* * *

📝 Generate Draft Adjustments Memo?

## Response:
Thought for 3m 36s

Draft Adjustments Memo — Operating Model Walkthrough and Site-Level Economics
=============================================================================

EBITDA Adjustments (Normalized)
-------------------------------

**QoE1: Startup losses (credit agreement add-back category)**

Startup losses are explicitly tracked and treated as lender-allowed (within defined timing and caps). This is a primary normalization candidate, subject to confirming the underlying TB accounts and the “startup” definition applied in the schedule.

**Request:** Startup losses schedule (tab export), supporting TB/GL detail by site/month, and the policy/definition used to label a site as “startup.”

**Setup:**

*   Startup losses (per startup losses tab) — **Add-back (+)** to EBITDA
*   Pull the monthly net startup loss amounts (negative numbers only, where there’s a loss) from the startup losses schedule that is described as pulling from the trial balance.
*   Limit the add-back to the allowed “initial” window and apply the per-location and aggregate caps referenced in the credit agreement logic.
*   Apply to the relevant diligence period(s) (e.g., LTM / FY / YTD) using the monthly schedule.

> “Yes… initial eight months… Not to exceed 200,000 per location and aggregate not to exceed… 500,000.”  
> “So then when I go to my startup losses, I’m only pulling in the negative numbers wherever there’s a loss.”

* * *

**QoE2: Discontinued operations (net loss / carrying costs, net of sublease income)**

A discontinued operations schedule exists that tracks sublease income (if any), actual expenses, and the loss being carried. If these costs relate to operations that are exited / non-core, this may be a normalization candidate (or at minimum a reclassification disclosure item).

**Request:** Discontinued operations schedule export and supporting TB/GL detail (including sublease income and related occupancy/exit costs).

**Setup:**

*   Discontinued operations net loss — **Add-back (+)** to EBITDA (if confirmed discontinued / non-recurring)
*   Pull monthly discontinued operations results (sublease income, actual expenses, net loss carried) from the discontinued operations portion of the schedule.
*   Confirm the underlying cost types (e.g., lease/occupancy, exit costs) and whether they are expected to continue post-close.
*   Include only the portion that is clearly associated with discontinued / exited operations.

> “This is our start up and discontinued operations…”  
> “So I have the sublease, if we have any… what the actual expenses… and what loss we’re carrying.”

* * *

**QoE3: Transaction / one-time items (credit agreement structure)**

The adjustments workbook is explicitly structured around the credit agreement’s definitional categories, including “transaction” and “one time” buckets. These items are common QoE normalization candidates, but require GL-level substantiation and clear non-recurring rationale.

**Request:** Adjustments workbook export (by month), GL detail for each transaction/one-time category, and invoices/contracts supporting the nature of the spend.

**Setup:**

*   Transaction / one-time expenses — **Add-back (+)** to EBITDA (for qualifying non-recurring items)
*   Start with the adjustments workbook categories labeled “transaction” / “one time.”
*   Tie each category to TB/GL detail and isolate the specific vendor/description line items that qualify as non-recurring.
*   Exclude items that appear recurring in nature or represent ongoing run-rate requirements.

> “This is structured… \[with\] summary of… what was in the credit agreement as far as definitional… Transaction one time etc etc.”

* * *

**QoE4: Severance (potential non-recurring people cost)**

A severance pay schedule is referenced as available in the files already sent. Severance is often a normalization candidate, but must be supported with a schedule, dates, and classification as one-time vs recurring restructuring.

**Request:** Severance pay schedule (as referenced), and the GL/TB accounts where severance is recorded.

**Setup:**

*   Severance expense — **Add-back (+)** to EBITDA (to the extent one-time / non-recurring)
*   Pull severance amounts from the severance schedule and reconcile to the P&L/TB by month.
*   Confirm whether severance is tied to a discrete event or program, and whether additional severance is expected going forward.
*   Apply add-back only to the months/periods where severance is recorded.

> “Provide severance pay schedule… So that’ll be in there in the file that I already had sent you guys.”

* * *

**QoE5: Lender-disallowed adjustments (SQL development costs)**

SQL development costs are explicitly noted as not accepted by the lender today. For QoE purposes, this should be evaluated as a potential add-back only if it is clearly non-recurring / project-based and not required on a continuing basis.

**Request:** GL detail for SQL development costs (vendor, dates, description), capitalization policy assessment (how it was treated in the books), and any project scope/contract documentation.

**Setup:**

*   SQL development costs — **Add-back (+)** to EBITDA (only if supported as non-recurring / non-operational)
*   Identify the SQL development amounts in the adjustments workbook and/or GL.
*   Confirm whether the spend is ongoing (recurring) vs a discrete implementation.
*   If treated as an add-back, apply only the qualifying portion and document the basis for non-recurring classification.

> “So the lender is not accepting this SQL development.”

* * *

**QoE6: Audit adjustments / period-14 treatment (basis alignment item)**

Not an “add-back” per se, but a critical basis item: the company uses period 14 for audit adjustments, and the model’s reporting approach differs for P&L vs balance sheet. EBITDA and any QoE bridge should explicitly state whether it is built off the adjusted P&L basis.

**Request:** Confirmation of the period 14 entries by month and the final audited FY basis once the audit completes.

**Setup:**

*   Reported EBITDA basis — **Basis alignment (no direction)**
*   Build reported EBITDA using the company’s convention: P&L period 12 reflecting audit adjustments (period 14 activity included in the year-end view), and ensure balance sheet references the audit-adjusted period (period 14) convention.
*   Ensure all diligence schedules (EBITDA bridge, adjustments rollforward, and any WC tie-outs) are consistent with the chosen basis.

> “We use a period 14 to capture audit adjustments.”  
> “I’m ignoring period 12 and bringing in period 14.”  
> “Good. We don’t have a 13.”

* * *

EBITDA Adjustments (Pro Forma)
------------------------------

**PF1: New site ramp / maturity normalization (qualitative candidate only at this stage)**

The transcript explicitly notes that historical FP&A modeling was weak and there is not an established, evidence-backed ramp curve. Management referenced expectations for filling near-duplicate locations from waitlists and a forecasted revenue target for a newer site, but this is not yet supported with a standardized ramp dataset.

**Request:** Cohort ramp analysis (site opening date, monthly revenue, direct labor, contribution) and the definition of “mature” vs “startup,” ideally using the planned revenue-by-location SQL outputs once available.

**Setup:**

*   New site ramp impacts — **Pro forma candidate (direction depends on analysis)**
*   Compile a list of de novo / recently opened sites and their opening dates.
*   Build a monthly ramp profile (revenue, direct labor, direct contribution) and compare to “mature” site benchmarks.
*   Only incorporate a pro forma adjustment if a consistent, supportable ramp curve and “steady-state” economics can be evidenced.

> “The modeling… was really substandard and weak.”  
> “Opened last Monday… 7 miles from \[an existing site\]… fill it within a month or two.”  
> “Forecast… roughly 250,000 a month.”

* * *

Working Capital Adjustments
---------------------------

**WC1: Bonus accrual vs payout timing (classification/peg normalization candidate)**

A bonus schedule is referenced as being pulled from payroll. This is a common working-capital peg item where accrued liabilities may not reflect steady-state payout timing.

**Request:** Bonus schedule from payroll and the month-end accrued compensation/bonus liability detail.

**Setup:**

*   Accrued compensation / bonus liability — **Direction (+/−)** to NWC depends on whether accrual exceeds steady-state payout timing
*   Reconcile the payroll-derived bonus schedule to month-end accrued liabilities on the balance sheet.
*   Identify any one-time or catch-up accruals that inflate period-end working capital.
*   Normalize the peg to steady-state accrual behavior based on typical payout cadence.

> “Bonus I’ll get that from payroll.”

* * *

**WC2: Severance accrual classification (if accrued at period end)**

If severance is accrued at period-end (rather than paid), it can affect the NWC peg depending on whether it is a one-time item or part of steady-state operations.

**Request:** Severance pay schedule and the period-end accrual detail (if any).

**Setup:**

*   Accrued liabilities (severance) — **Direction (+/−)** to NWC depends on whether severance accrual is non-recurring
*   Tie severance amounts to period-end accruals and subsequent cash payments.
*   If severance is clearly non-recurring, normalize the peg by excluding the non-recurring accrual from NWC.

> “Provide severance pay schedule…”



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)