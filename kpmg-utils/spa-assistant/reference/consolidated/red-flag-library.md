# Red Flag Language Library

> Extracted from the analyses in `reference/`. Merger agreements are included but are not completion-accounts SPAs.

## Category: Overly Broad Definitions

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "“all liabilities with respect to past or present litigation… including… legal fees”" | HealthEquity/Luum | Indebtedness / Debt | Converts contingent/operating liabilities into “debt” adjustments, potentially allowing buyer to deduct items that are inherently uncertain or already reserved in working capital. | High |
| "“of any nature whatsoever”" | iRobot/Amazon (Merger) | Taxes | Very expansive; could pull in unexpected quasi-tax assessments depending on jurisdiction. Typically fine, but worth noting if cross-border or specialized assessments exist. | Low |

## Category: Missing Anti-Duplication

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "“long-term deferred revenue”" | HealthEquity/Luum | Indebtedness / Debt | Deducting deferred revenue as debt can materially reduce price and can double-count if any portion is also embedded in NWC. | High |
| "Inclusion of accrued/deferred Income Taxes (viii)" | TreeHouse (Meal Prep) | Indebtedness / Debt | Creates overlap with NWC and the Tax Indemnity regime (Section 6.7). Can also drive “double counting” if income tax payable is reflected in WC. | High |
| "Overlap with Indebtedness clause (vii)" | TreeHouse (Meal Prep) | Transaction Expenses | Both definitions touch employee-related transaction payments; even with anti-duplication, classification fights are common and can double-count if the statement template isn’t airtight. | High |
| "“(which amount may be negative)”" | Newgistics/Logistics Management | Cash / Cash and Cash Equivalents | If overdrafts are treated as negative cash, they reduce purchase price, but if also treated as indebtedness elsewhere (or not clearly treated), you risk disputes or double counting/under counting. | Medium |

## Category: Buyer Discretion / Sole Determination

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "Buyer prepares both preliminary and final statements" | TreeHouse (Meal Prep) | Accounting Principles / Methodology | Buyer-controlled statement: Medium — mitigated by access + IA process, but still control risk. | Medium |
| "“at the election of Parent… either (i) converted… or (ii) canceled” (re subsidiary-owned shares)" | CyrusOne/Cavalry (Merger) | Purchase Price / Consideration | Not a pricing issue, but it’s discretionary treatment of intra-group holdings; confirm no unintended consequences (e.g., operating partnership / REIT structure). | Low |

## Category: Ambiguous Timing / Cut-off

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "“Working Capital Overage… Working Capital Underage…” (as defined using **Estimated** NWC; PDF p. 33)" | TreeHouse (Meal Prep) | Purchase Price / Consideration | Purchase Price is meant to be based on **Closing** NWC, but the Overage/Underage definitions reference **Estimated Net Working Capital**. This can create ambiguity on whether there is a true working capital true-up at all, or a drafting “bug” that becomes leverage in a dispute. | High |
| "Use of “Estimated” for core share issuance" | Deutsche Telekom/AT&T (T‑Mobile USA) | Purchase Price / Consideration | Creates economics driven by estimation methodology; dispute risk | Medium |
| "“from time to time”" | Newgistics/Logistics Management | Accounting Principles | For closing accounts, parties often want GAAP as of a specific date or consistent with past practice to avoid changes affecting calculations. Here, “from time to time” is partially mitigated by “consistent with” language elsewhere. | Medium |
| "“Closing Time”" | Newgistics/Logistics Management | True-Up Process | Measurement time is “Closing Time” = 11:59 p.m. Eastern on the day immediately preceding the Closing Date (definition p.3). This is fine, but parties must ensure operational cut-offs match this exact timestamp. | Medium |
| "“as soon as practicable”" | Newgistics/Logistics Management | True-Up Process | No fixed deadline for the Auditor’s decision (“as soon as practicable”), which can drag in contentious disputes (Medium). | Medium |
| "**Working capital definitional mismatch** (Estimated vs Closing) is a potential drafting defect that increases dispute risk." | TreeHouse (Meal Prep) | True-Up Process | **Working capital definitional mismatch** (Estimated vs Closing) is a potential drafting defect that increases dispute risk. | Medium |
| "“applied consistently from time to time”" | MoneyGram/Mobius (Merger) | Accounting Principles | If used for any future calculations, this could be argued to include evolving GAAP rather than locked policy elections; however there are no completion-account calculations here. | Low |
| "“without interest”" | MoneyGram/Mobius (Merger) | Purchase Price / Consideration | Not a red flag by itself; the practical risk is administrative delay in payments without compensation. | Low |
| "“without interest”" | iRobot/Amazon (Merger) | Purchase Price / Consideration | Not really a “red flag” in public M&A; but economically, if the Paying Agent process is slow, stockholders bear time value loss. | Low |

## Category: Classification Gaming Risk

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "Inclusion of employee transaction-related obligations in debt (vii)" | TreeHouse (Meal Prep) | Indebtedness / Debt | These same items frequently show up in Transaction Expenses or WC accruals; even with the exclusion (D), classification disputes are common and can swing price materially. | High |
| "The “Marketing Period” concept can create closing timing leverage tied to what is “Compliant” required financial information (Definition of “Marketing Period”, PDF p.72 / A-68)." | CyrusOne/Cavalry (Merger) | Accounting Principles / Methodology | Others: Medium (closing timing / process) | Medium |
| "“consistent with … historical accounting practices … (but solely to the extent … consistent with GAAP)”" | HealthEquity/Luum | Working Capital / Net Working Capital | Generally good, but can create disputes on whether a historical practice is GAAP-compliant. | Medium |
| "“to the extent… treated as debt under GAAP” (clauses d, g)" | Durata/Pfizer | Indebtedness / Debt | GAAP treatment test can narrow what is captured as “Debt”. | Low |

## Category: Double-Count Risk

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "“severance… deferred bonus… payable as a result of the Closing”" | HealthEquity/Luum | Indebtedness / Debt | Could overlap with “Transaction Expenses” or with working capital accruals; needs routing clarity. | Medium |

## Category: Undefined Terms in Formula

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "(Absence of a cash definition)" | Durata/Pfizer | Cash / Cash and Cash Equivalents | If any cash exists at closing, unclear who keeps it unless | Medium |
| "(Absence of Net Debt concept)" | MoneyGram/Mobius (Merger) | Net Debt | Buyer bears changes in net debt position between signing and closing, limited by covenants and MAE/closing conditions rather than a price true-up. | Medium |
| "(Absence of NWC adjustment)" | MoneyGram/Mobius (Merger) | Working Capital / Net Working Capital | If the Company’s working capital deteriorates between signing and closing but doesn’t trigger MAE or covenant breach, buyer has no price protection. | Medium |
| "No explicit inclusion of accrued interest / breakage" | National Financial Services/Fiserv | Indebtedness / Debt | If Indebtedness is used operationally (covenants, defaults, assignment mechanics), omission can create disputes over whether interest/breakage are captured elsewhere. | Medium |
| "“subject to adjustment… Section 1.5.3”" | National Financial Services/Fiserv | Purchase Price / Consideration | Section 1.5.3 introduces a multi-step “Shortfall” construct tied to foreign account closures that affects both closing payment and earnout; needs tight definitions and dispute routing. | Medium |
| "No explicit intercompany debt inclusion" | Newgistics/Logistics Management | Indebtedness / Debt | If there are seller/affiliate notes, the definition may be argued to exclude them unless clearly “borrowed money.” | Medium |
| "No explicit overdraft/cash pooling inclusion" | Newgistics/Logistics Management | Indebtedness / Debt | If overdrafts exist, routing can become disputed between “Cash” and “Indebtedness,” impacting price. | Medium |
| "“subject to adjustment …”" | Aerojet Rocketdyne/L3Harris (Merger) | Purchase Price / Consideration | Ensure adjustment mechanics are symmetric and not overly discretionary | Low |
| "No explicit Net Debt term" | HealthEquity/Luum | Net Debt | Forces interpretation via formula language; not fatal, but can create ambiguity if Cash < Debt (see sign convention analysis). | Low |
| "Parenthetical mismatch “whether payable by the Seller Group Companies)”" | HealthEquity/Luum | Transaction Expenses | Drafting sloppiness; could be exploited in disputes but likely harmless. | Low |
| "(Absence of transaction expense deduction)" | MoneyGram/Mobius (Merger) | Transaction Expenses | Not a red flag in public mergers; just confirms no SPA-style net proceeds adjustment to stockholders. | Low |

## Category: Missing Schedules / Exhibits

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "Indebtedness basket tied to “Capital Expenditure Budget” and “Capital Expenditure Funding Framework” in Company Disclosure Letter" | CyrusOne/Cavalry (Merger) | Indebtedness / Debt | Key numerical limits may sit in disclosure letter not provided here; without seeing it, you can’t validate practical flexibility. | High |
| "“using the line items set forth on Schedule 2.3(a)(I) and (II)”" | Deutsche Telekom/AT&T (T‑Mobile USA) | Accounting Principles / Methodology | Missing schedules drive accounting: High | High |
| "Reliance on missing schedules/annexes" | Deutsche Telekom/AT&T (T‑Mobile USA) | Purchase Price / Consideration | Critical calculation inputs not present in PDF | High |
| "“line items set forth on Schedule 2.3(a)(I) and (II)”" | Deutsche Telekom/AT&T (T‑Mobile USA) | True-Up Process | **Schedule dependency:** Closing statement must use “line items set forth on Schedule 2.3(a)(I) and (II)” (missing). **Severity: High.** | High |
| "“include only the line items set forth on Exhibit C” (Exhibit missing)." | HealthEquity/Luum | Accounting Principles / Methodology | Missing Exhibit C and Schedule II: High | High |
| "Exhibit C and Schedule I are missing, which are essential for executing the NWC and funds flow mechanics. That creates a practical dispute risk even if the dispute process is fair. (TOC references; NWC definition; PDF pp. 2–4, 14)" | HealthEquity/Luum | True-Up Process | Exhibit C and Schedule I are missing, which are essential for executing the NWC and funds flow mechanics. That creates a practical dispute risk even if the dispute process is fair. (TOC references; NWC definition; PDF pp. 2–4, 14) | High |
| "“include only the line items set forth on Exhibit C” (Exhibit missing)" | HealthEquity/Luum | Working Capital / Net Working Capital | Without Exhibit C, the definition is operationally incomplete; parties can disagree on which accounts are “in.” | High |
| "“unless otherwise adjusted to reflect… Schedule 1.6.1”" | National Financial Services/Fiserv | Accounting Principles | Schedule 1.6.1 is an economic methodology “override,” but it is **not included** in the provided PDF; can materially shift Net Capital outcomes. | High |
| "Schedules referenced but not provided" | National Financial Services/Fiserv | Accounting Principles / Methodology | Missing illustrative schedules: High diligence / execution set completeness risk. | High |
| "“notwithstanding that such adjustments… may not be in accordance with GAAP” (PDF p.8–9)" | National Financial Services/Fiserv | Accounting Principles / Methodology | Overrides that may not follow GAAP: Medium/High if Schedule 1.6.1 is broad or ambiguous. | High |
| "“unless otherwise adjusted… Schedule 1.6.1” (Net Capital def, PDF p.58)" | National Financial Services/Fiserv | Accounting Principles / Methodology | Overrides that may not follow Rule 15c3-1: High because Net Capital is a regulated metric; methodology must be tightly defined. | High |
| "“includes Targeted Net Capital” (but Targeted Net Capital is in Schedule 6.1)" | National Financial Services/Fiserv | Purchase Price / Consideration | Targeted Net Capital is a key economic peg, but **Schedule 6.1 is not included** in the provided PDF—economic outcome is not fully evaluable from the current pack. | High |
| "High: **Schedule 1.6.1** (pre-closing adjustments) and **Schedule 6.1** (Targeted Net Capital) are not included in the provided PDF; they are essential to reproduce the Net Capital calculation and economics." | National Financial Services/Fiserv | True-Up Process | High: **Schedule 1.6.1** (pre-closing adjustments) and **Schedule 6.1** (Targeted Net Capital) are not included in the provided PDF; they are essential to reproduce the Net Capital calculation and economics. | High |
| "“except as set forth on Schedule 3.4”" | Newgistics/Logistics Management | Accounting Principles / Methodology | Schedule-driven deviations not provided: High: unknown rules can materially change outcomes | High |
| "Schedule 3.4 governs GAAP exceptions but is not included in the provided document. That is the biggest risk driver for true-up disputes (High)." | Newgistics/Logistics Management | True-Up Process | Schedule 3.4 governs GAAP exceptions but is not included in the provided document. That is the biggest risk driver for true-up disputes (High). | High |
| "“except as set forth on Schedule 3.4”" | Newgistics/Logistics Management | Working Capital / Net Working Capital | Schedule 3.4 is not provided; could materially change what counts in Current Assets/Liabilities and thus the true-up. | High |
| "“set forth on… Disclosure Schedules” (not provided)" | TreeHouse (Meal Prep) | Accounting Principles | Without Disclosure Schedule 2.3(a), you cannot validate the true financial mechanics. This is a critical missing input for any SPA analytics tool. | High |
| "“Applicable Accounting Principles… set forth on Section 2.3(a) of the Disclosure Schedules.” (PDF p. 14)" | TreeHouse (Meal Prep) | Accounting Principles / Methodology | Missing accounting principles schedule: High — you cannot validate the actual methodology. | High |
| "“amounts in Exhibit E are illustrative only…” (PDF p. 26)" | TreeHouse (Meal Prep) | Accounting Principles / Methodology | Exhibit E non-binding: High — increases reclassification/dispute risk. | High |
| "“Applicable Accounting Principles” not included in PDF" | TreeHouse (Meal Prep) | Working Capital / Net Working Capital | The controlling rule set is missing from the provided document, so we cannot validate whether it is GAAP, consistent with past practice, includes special reserves, etc. | High |
| "“amounts in Exhibit E are illustrative only and do not represent binding principles”" | TreeHouse (Meal Prep) | Working Capital / Net Working Capital | This materially increases risk of disputes and allows reclassification arguments post-close. Because Buyer prepares the Final Closing Statement, ambiguity can be buyer-leveraged unless Exhibit E / accounting principles are extremely prescriptive. | High |
| "Missing explicit interest/breakage" | Deutsche Telekom/AT&T (T‑Mobile USA) | Indebtedness / Debt | May shift payoff costs to buyer unless captured elsewhere | Medium |
| "“capital leases” only" | Deutsche Telekom/AT&T (T‑Mobile USA) | Indebtedness / Debt | Operating leases not included (2011 accounting) | Medium |
| "“no hindsight”" | Deutsche Telekom/AT&T (T‑Mobile USA) | True-Up Process | **No explicit “no hindsight” clause**; could create accounting-policy disputes absent schedules. **Severity: Medium.** | Medium |
| "Low/Medium: Seller has 30 days to object—tight if the Net Capital schedule is complex and underlying broker-dealer computations are extensive." | National Financial Services/Fiserv | True-Up Process | Low/Medium: Seller has 30 days to object—tight if the Net Capital schedule is complex and underlying broker-dealer computations are extensive. | Medium |
| "“derived from”" | National Financial Services/Fiserv | True-Up Process | Medium: Draft Net Capital Schedule is “derived from” Closing Date Balance Sheet and then adjusted; if Schedule 1.6.1 is broad, it can override GAAP and Rule 15c3-1 treatment (see Part 7). | Medium |
| "“calculated in accordance with the Applicable Accounting Principles” (but principles not provided)" | TreeHouse (Meal Prep) | Cash / Cash and Cash Equivalents | Without the Disclosure Schedule 2.3(a) “Applicable Accounting Principles,” parties may disagree on classification of “marketable securities,” short-term investments, or bank sweep accounts. | Medium |

## Category: Asymmetric Timelines

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "Seller gets 60 days to object after receiving the Closing Statement. That’s longer than typical and can delay finality and cash settlement (Medium)." | Newgistics/Logistics Management | True-Up Process | Seller gets 60 days to object after receiving the Closing Statement. That’s longer than typical and can delay finality and cash settlement (Medium). | Medium |
| "Buyer has **120 days** to deliver the Final Closing Statement (longer than many market deals), which delays finality and can be used tactically." | TreeHouse (Meal Prep) | True-Up Process | Buyer has **120 days** to deliver the Final Closing Statement (longer than many market deals), which delays finality and can be used tactically. | Medium |

## Category: Unusual Exclusions/Inclusions

| Phrase | Deal | Definition | Why Concerning | Severity |
|--------|------|------------|----------------|----------|
| "“in no event shall the Net Adjustment Amount exceed $30,000,000 (whether positive or negative)”" | TreeHouse (Meal Prep) | True-Up Process | **$30,000,000 cap on Net Adjustment Amount** is a major economic limitation: “in no event shall the Net Adjustment Amount exceed $30,000,000 (whether positive or negative)” (Section 2.3(g)(i); PDF p. 42). This is seller-protective and can leave buyer exposed if estimates are materially wrong. | High |
| "“Additional Consideration … after September 17, 2023”" | Aerojet Rocketdyne/L3Harris (Merger) | Purchase Price / Consideration | If regulatory delays extend long, buyer’s cost increases daily; however rate is modest (~$0.202M/day on current shares) | Medium |
| "“as may be adjusted pursuant to… Section 6.16”" | Bluerock Residential/Badger (Merger) | Purchase Price / Consideration | Only Special Pre-Closing Dividend is expressly price-adjusting; regular dividends are handled separately, but stakeholders can still misread whether other dividend types reduce the $24.25. Ambiguity increases execution disputes risk. | Medium |
| "“any liability… as a result of being a member of an affiliated… group… transferee or successor”" | Bluerock Residential/Badger (Merger) | Taxes | Broad secondary liability capture can be significant where historic consolidated/combined returns exist; allocation of responsibility must be airtight (here it’s largely handled via Separation Principles). | Medium |
| "“keep well… to maintain any financial statement condition”" | CyrusOne/Cavalry (Merger) | Indebtedness / Debt | Broad; can capture non-traditional support arrangements and may restrict routine commercial support for affiliates/partners. In a long interim period, could constrain operations. | Medium |
| "“except as otherwise expressly set forth…”" | CyrusOne/Cavalry (Merger) | Transaction Expenses | Requires careful scan for exceptions; key exception is D&O tail premium paid by Company (Section 5.07(c)). | Medium |
| "Lack of a cash definition can create confusion and leave “cash-like” items un-routed." | Deutsche Telekom/AT&T (T‑Mobile USA) | Cash / Cash and Cash Equivalents | Lack of a cash definition can create confusion and leave “cash-like” items un-routed. | Medium |
| "**2‑business‑day objection windows** on estimates are operationally tight. **Severity: Medium.**" | Deutsche Telekom/AT&T (T‑Mobile USA) | True-Up Process | **2‑business‑day objection windows** on estimates are operationally tight. **Severity: Medium.** | Medium |
| "(No Net Debt definition)" | Durata/Pfizer | Net Debt | If liabilities/cash are not fully addressed in carve-outs, | Medium |
| "(Not in 2.2 itself; see 2.5.2 buyout and 2.5.1 deferral)" | Durata/Pfizer | Purchase Price / Consideration | Consideration economics depend heavily on optional mechanics. | Medium |
| "“by contract” / “or otherwise”" | Durata/Pfizer | Taxes | Can sweep in unexpected contractual tax-like indemnities. | Medium |
| "(No WC/NWC construct)" | Durata/Pfizer | Working Capital / Net Working Capital | If any short-term assets/liabilities remain with Company, | Medium |
| "Exclusion of insurance proceeds/reserves" | HealthEquity/Luum | Cash / Cash and Cash Equivalents | Could create disputes if proceeds are already booked as cash and the corresponding liability is treated elsewhere (e.g., litigation liabilities in Indebtedness). | Medium |
| "“fees or taxes would become payable upon their immediate use”" | HealthEquity/Luum | Cash / Cash and Cash Equivalents | Without a methodology (what fees/taxes, whose estimate, gross vs net), sellers can argue for inclusion; buyer can argue for exclusion. | Medium |
| "“deferred purchase price… whether or not contingent”" | HealthEquity/Luum | Indebtedness / Debt | Could sweep in ordinary accruals or earnout-like obligations from prior acquisitions unless explicitly excluded. | Medium |
| "“Purchase Price” excludes Earn-Out by silence" | HealthEquity/Luum | Purchase Price / Consideration | Creates ambiguity for (i) “purchase price adjustment” treatment in tax, (ii) cap formulations tied to “Purchase Price”, and (iii) diligence summaries relying on the defined term. | Medium |
| "“whether incurred by the Company directly or by the Purchaser” (RWI 50%)" | HealthEquity/Luum | Transaction Expenses | If Buyer pays insurer directly, sellers still bear 50% through purchase price reduction; that’s intended, but should be reconciled in funds flow to avoid double-charge. | Medium |
| "“amount, if any, by which Cash exceeds Indebtedness”" | HealthEquity/Luum | True-Up Process | The purchase price formula’s “amount, if any, by which Cash exceeds Indebtedness” is not symmetrical on its face. If the Closing Statement does not explicitly treat negative net cash as a deduction, sellers could argue there is no downward adjustment when debt exceeds cash. This should be clarified as “Cash minus Indebtedness (which may be positive or negative).” (Section 2.4, PDF p. 21 / Agreement p. 17) | Medium |
| "TCBE carve-out list of accounts" | HealthEquity/Luum | Working Capital / Net Working Capital | If those accounts also contain non-TCBE activity, exclusion could be overbroad unless there’s a clean tagging mechanism. | Medium |
| "“promptly… obtain payoff letters… and… comply with… time periods required by the terms…” (Section 5.17, PDF p. 62)" | MoneyGram/Mobius (Merger) | Indebtedness / Debt | If debt documents require long notice periods or lender consent steps, delays could risk closing timing; coordination risk is operationally significant. | Medium |
| "“deferred purchase price… services”" | National Financial Services/Fiserv | Indebtedness / Debt | Could pick up ordinary-course accruals if not interpreted narrowly (though context suggests deal-like deferrals). | Medium |
| "“excluding amounts reserved in a freight payment cash account”" | Newgistics/Logistics Management | Cash / Cash and Cash Equivalents | Needs operational clarity: what constitutes “reserved,” how reconciled, and interaction with freight payment receivables/payables exclusions in working capital. | Medium |
| "Escrow terminates/releases on a fixed date (May 8, 2008) that appears shorter than the 15-month survival window (Section 9.1). If Buyer discovers a claim after May 8 but before the survival end, Buyer may still have an indemnity right but no escrow fund (and the cap is still escrow amount). This should be reconciled explicitly." | Newgistics/Logistics Management | Escrow Mechanics | Escrow terminates/releases on a fixed date (May 8, 2008) that appears shorter than the 15-month survival window (Section 9.1). If Buyer discovers a claim after May 8 but before the survival end, Buyer may still have an indemnity right but no escrow fund (and the cap is still escrow amount). This should be reconciled explicitly. | Medium |
| "“Indebtedness … that is funded and outstanding”" | Newgistics/Logistics Management | Purchase Price / Consideration | “Funded” may exclude items buyers often expect in debt (e.g., overdrafts, certain lease liabilities, intercompany debt, deferred purchase price). | Medium |
| "“plus … $1,950,000 (the ‘Escrow Amount’)”" | Newgistics/Logistics Management | Purchase Price / Consideration | Read literally, could imply escrow is incremental consideration rather than a holdback from seller proceeds. In practice it’s meant as a holdback, but the wording plus Section 3.3(b) can confuse funds flow. | Medium |
| "“applied consistently with the principles applied… Most Recent Balance Sheet”" | Newgistics/Logistics Management | Working Capital / Net Working Capital | Good conceptually, but disputes arise if accounting practices changed or if the Most Recent Balance Sheet is unaudited. | Medium |
| "Inclusion of government grant/relief recapture" | TreeHouse (Meal Prep) | Taxes | If the business received COVID relief, recapture risk could be material and may not be fully diligenced if treated as “tax.” | Medium |
| "“incurred by the Group Companies”" | TreeHouse (Meal Prep) | Transaction Expenses | If some costs are incurred by TreeHouse but allocated or charged through intercompany, routing becomes important (especially given intercompany settlement at closing). | Medium |
| "“rounded up”" | Deutsche Telekom/AT&T (T‑Mobile USA) | Purchase Price / Consideration | Systematic upward rounding transfers incremental value to Seller | Low |
| "“Except as otherwise expressly provided…”" | Durata/Pfizer | Transaction Expenses | Requires careful check for any embedded cost shifting. | Low |
| "“other similar government charges… including… fines”" | MoneyGram/Mobius (Merger) | Taxes | Broad definitions can expand the scope of tax reps/covenants beyond what some sellers expect, but this is typical drafting. | Low |
