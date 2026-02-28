# Progress Log

## 2026-01-30 - 2.1: Mine Construction industry SOW

Run: 20260130-110048-64111 (iteration 1)

- Guardrails reviewed: yes
- Commit: 01601d3 2.1: Mine Construction industry SOW
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/construction.json')); assert d['industry']=='Construction'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/construction.json (created)
- What was implemented:
  - Parsed Project Great White - Draft Scope of Work.json (Construction industry)
  - Extracted 15 FDD sections with verbatim bullets: Financial due diligence, Quality of earnings, Sales and margin trends, Cost of sales and operating costs, Working Capital, Accounts receivable, Prepaid materials and other assets, Inventory, Accounts payable and accrued liabilities, Fixed asset equipment and vehicles, Net debt and other assets/liabilities, Related parties, Commitments and contingencies, Accounting overview, Accounting comparison (IFRS vs ASPE)
  - Identified 32 construction-specific terms (project-based revenue, percentage of completion, backlog, bonding requirements, billings in excess of cost, etc.)
  - Noted 4 workstreams: Financial DD (primary, extracted), Synergy Diligence, Canadian Tax DD, Tax Advisory Services (all noted but not extracted)
  - No phases detected (single-phase SOW)
  - Scope period: FY2023-FY2024 + YTD March 2025
- **Learnings:**
  - Construction SOWs use project-based revenue analysis (by revenue stream, customer, geography, industry)
  - Formatting signals: bold + indent_level 1 = section heading; style "Bullet 1"/"Bullet 2" = sub-bullets
  - Horizontal rule paragraphs (dashes) separate workstreams
  - This SOW includes an IFRS vs ASPE comparison section (Canadian target under ASPE acquired by IFRS reporter)

---

## 2026-01-30 - 2.2: Mine Eyecare industry SOWs

Run: 20260130-110048-64111 (iteration 2)

- Guardrails reviewed: yes
- Commit: 56cc9bb 2.2: Mine Eyecare industry SOWs
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/eyecare.json')); assert d['industry']=='Eyecare'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/eyecare.json (created)
- What was implemented:
  - Parsed 2 source files: Axis - Eng Procedures.json (engagement letter with FDD workplan) and Project View - SOW 2022-04-12.json (standalone SOW for Morris Eye Group)
  - Extracted 15 FDD sections with verbatim bullets: Overview, Summary financials, Quality of earnings, Supporting analysis to QoE (KPIs), Cost of revenue and corporate expenses, Quality of revenue and receivables and cash proof, Working capital, Supporting analysis to working capital, Trade and other receivables, Inventories, Other current assets, Trade and other payables and accrued liabilities, Capital expenditure requirements, Net debt/debt-like items, Commitments and contingencies
  - 2 shared sections (Quality of earnings, Working capital) include bullets from BOTH files with source tags
  - Identified 24 eyecare-specific terms (by clinic analysis, physician production, per visit trends, revenue waterfall, billing data, etc.)
  - Noted 1 workstream: Financial Due Diligence (primary)
  - No phases detected (both documents are single-phase)
  - Two separate scope periods: FY16-FY18+YTD FY19 (Axis) and FY19-FY21+YTD22 (Project View)
- **Learnings:**
  - Eyecare SOWs use clinic-level analysis (revenue/costs by location) and per-visit metrics as key KPIs
  - The Axis file uses "Bullet for no #'s" style for both headings (when bold) and body bullets (when not bold) — bold is the primary heading indicator
  - Revenue waterfall analysis using underlying billing data is a characteristic eyecare/healthcare FDD section
  - Engagement letters embed FDD scope in appendices (Appendix II in this case)

---

## 2026-01-30 - 2.3: Mine Healthcare industry SOWs

Run: 20260130-110048-64111 (iteration 3)

- Guardrails reviewed: yes
- Commit: c7e989b 2.3: Mine Healthcare industry SOWs
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/healthcare.json')); assert d['industry']=='Healthcare'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/healthcare.json (created)
- What was implemented:
  - Parsed 2 source files: Project Academy - Draft SOW (ABA therapy/behavioral health) and Project Red Deer - Draft SOW (pharmacy/retail healthcare — Rexall)
  - Extracted 20 FDD sections with verbatim bullets: Business overview, Financial reporting and accounting policies, Target's accounting profile, Quality of earnings analysis, Store portfolio analysis, Revenue and profitability, Revenue and margin analysis, Operating expenses, Working capital analysis, Accounts receivable analysis, Inventory, Other assets, Accounts payable and accrued liabilities analysis, Capital expenditure requirements, Net debt/debt-like items, Commitment and contingencies, Purchase and Sale Agreement, Assistance with transaction documentation, Waterfall Revenue Analysis, Audit working papers
  - 7 shared sections (QoE, OpEx, Working capital, AR, AP, Capex, Net debt) include bullets from BOTH files with source tags
  - Identified 39 healthcare-specific terms (payor mix, de novo expansion, CPT code, center-level analysis, Behavior Therapists, BCBA, patient financing, Rx count, front store vs pharmacy, generic vs branded drugs, etc.)
  - Noted 4 workstreams: Financial DD (primary, extracted), Operations DD Phase I (Separation Assessment), Operations DD Phase II (Day 1 Readiness), Post Close PMO Support — non-FDD workstreams noted but not extracted
  - Two scope periods: FY23-FY24+YTD25 (Academy) and FY2022-FY2023+TTM Nov/Dec 2023 (Red Deer)
  - Noted phases in Red Deer (Phase 1 Separation, Phase 2 Integration) — these are non-FDD operational phases
- **Learnings:**
  - Healthcare SOWs span two distinct sub-verticals: clinical/ABA therapy (center-level, CPT codes, payor mix) and pharmacy/retail (store portfolio, Rx counts, front store vs pharmacy)
  - Project Academy includes an optional Waterfall Revenue Analysis section with claims-level billing data — unique to healthcare
  - Project Red Deer is a carve-out transaction with extensive non-FDD workstreams (separation assessment, TSA support, Day 1 readiness, post-close PMO)
  - The Red Deer document references specific vendor tools and brands (McKesson, SPI tool, PowerBI, Rexall, Well.ca) — copied verbatim
  - Bold text at indent_level 0 or 1 with styles like "Bullet for no #'s" or "Normal" are section headings; non-bold "List Paragraph" at indent_level 1 are bullets

---

## 2026-01-30 - 2.4: Mine HVAC industry SOWs

Run: 20260130-110048-64111 (iteration 4)

- Guardrails reviewed: yes
- Commit: 73d31a4 2.4: Mine HVAC industry SOWs
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/hvac.json')); assert d['industry']=='HVAC'; assert 'sections' in d; assert len(d['sections'])>0; assert len(d['files_analyzed'])>=3; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/hvac.json (created)
- What was implemented:
  - Parsed 3 source files: KPMG Financial Due Diligence SOW - Aug 8 (sell-side VDD, Frontier Service Partners), Flacon_Aug 8 (near-identical variant), Project Celsius (buy-side FDD)
  - Extracted 24 FDD sections with verbatim bullets across all 3 files
  - Overlapping sections (QoE, Working capital, AR, AP, Commitments, Net debt) include bullets from all 3 files with source tags
  - Identified 52 HVAC industry-specific terms (Service Line, compressed air, chiller, plumbing, technician utilization, fleet analysis, commodity pass-through, cross-selling, etc.)
  - Noted 2 workstreams: Financial Due Diligence (all 3 files), Data & Analytics (Aug 8 + Flacon only)
  - Both sell-side SOWs: Phase 1 (FDD + D&A) / Phase 2 (post-bid support); Celsius: Phase 1 (pre-bid QoE review) / Phase 2 (full buy-side FDD)
- **Learnings:**
  - HVAC SOWs have distinct Phase 1 pre-bid / Phase 2 post-bid structure
  - Aug 8 and Flacon_Aug 8 are near-identical (same target) — likely variants for different addressees
  - Sell-side SOWs include extensive D&A workstreams (SPI tool, Power BI dashboards, sales cube) with 4 sub-areas
  - Service-line-level analysis is a hallmark of HVAC SOWs
  - Technician-level KPIs (utilization, turnover, revenue per tech, fleet analysis) are HVAC-specific
  - Project Celsius references POC revenue recognition and commodity pass-through — Services & Projects segments

---

## 2026-01-30 - 2.5: Mine Manufacturing industry SOWs

Run: 20260130-110048-64111 (iteration 5)

- Guardrails reviewed: yes
- Commit: 4966b9c 2.5: Mine Manufacturing industry SOWs
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/manufacturing.json')); assert d['industry']=='Manufacturing'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/manufacturing.json (created)
- What was implemented:
  - Parsed 4 source files: Atlas Scope (sell-side FDD, aerospace precision shims), EL Flag (PDF extraction failure — insufficient content), Project Diamond (buy-side integrated DD, plastics/resin manufacturing), Project Sourdough (buy-side FDD, food manufacturing)
  - Extracted 25 FDD sections with 254 verbatim bullets across all 3 content-bearing files
  - Key sections: Overview, Consistency of accounting policies, Sell-side QoE assessment, VDD Report review, Quality of earnings, Revenue/margin trends (3 variants), Operating expenses/SG&A, Expenses, Normalized EBITDA bridges, Forecast/budget analysis, Budget vs actual, Working capital, AR, AP/accrued liabilities, Inventory, Capex/fixed assets, Net debt, Commitments & contingencies, Prepaids, ASPE to IFRS/US GAAP, Related party transactions, Operational cost/margin assessment
  - Identified 49 manufacturing-specific terms (production capacity, utilization rates, scrap rates, costing methodology, manufacturing overhead, resin type, plant-level analysis, food safety, hedging programs, constant currency analysis, etc.)
  - Noted 9 workstreams: Financial DD (primary), US Tax DD, Canadian Tax DD, Tax Structuring, Other Tax Advisory, Tax Advisory Services, IT & Cyber DD, HR DD, Other Business Analysis (optional)
  - EL Flag.json logged as insufficient content (PDF extraction error)
- **Learnings:**
  - Manufacturing SOWs are the most workstream-heavy — Diamond has 6 workstreams reflecting complexity of cross-border manufacturing acquisitions
  - Inventory is treated as industry-specific in Manufacturing (detailed costing methodology, spoilage, standard cost updates, purchasing procedures) vs generic balance sheet item in other industries
  - Two of three content-bearing SOWs are buy-side with VDD Report / sell-side QoE review — buy-side manufacturing DD commonly critiques the sell-side advisor's work
  - Revenue analysis in Manufacturing is highly granular: by plant, brand, product category, SKU, customer, distribution channel, with average selling price and cost per lbs
  - Manufacturing QoE sections include commodity/raw material cost fluctuations, hedging program impacts, and supply chain disruption analysis — not seen in other industries

---

## 2026-01-30 - 2.6: Mine Prof. Services industry SOWs

Run: 20260130-110048-64111 (iteration 6)

- Guardrails reviewed: yes
- Commit: 499c370 2.6: Mine Prof. Services industry SOWs
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/prof-services.json')); assert d['industry']=='Prof. Services'; assert 'sections' in d; assert 'notes' in d; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/prof-services.json (created)
- What was implemented:
  - Parsed 2 source files: Project DGA_KPMG DRAFT EL_June 2022.json (architecture firm — DG Architects, Inc.) and Project Flag_KPMG DRAFT EL_Feb 2024 vF.json (project management/cost consultancy — Gardiner & Theobald LLP)
  - Both are engagement letters (not standalone SOWs) — FDD scope extracted from embedded Deal Advisory & Tax Workplan appendices
  - Extracted 13 FDD sections with verbatim bullets from both files: Overview, Quality of earnings, Revenue/revenue recognition/margins, Operating expenses, Working capital, Receivables, WIP/Amounts recoverable on contracts, AP/Accrued liabilities, Other current assets liabilities, Net debt/debt-like items, Capital expenditure requirements, Budget, Assistance with transaction documentation
  - All sections appear in both files — included bullets from both with source tags
  - Identified 23 professional services-specific terms (POC revenue, utilization rates, billing rates, proposal win-rates, backlog, pipeline, gross-to-net revenue bridge, consultants/sub-contractors, owners'/partners' remuneration, carve-out considerations, etc.)
  - Noted 6 workstreams: Financial DD (primary), US Tax DD, US Tax Structuring, UK Tax DD, Remuneration Analysis, Tax Advisory Services
  - Notes field explains engagement letter format vs standalone SOW
- **Learnings:**
  - Professional services ELs embed FDD scope in "Deal Advisory & Tax Workplan" appendices — identical structure to standalone SOWs but nested within EL
  - POC (percentage of completion) revenue recognition is a hallmark of professional services FDD — appears prominently in both Overview and Revenue sections
  - Both targets are project-based businesses: backlog, pipeline, WIP, and proposal win-rates are key KPIs
  - Gross-to-net revenue bridge including payments to consultants/sub-contractors is industry-specific (fee income vs pass-through)
  - Flag (2024) adds carve-out considerations, US royalties, pension liabilities, and members/partners' remuneration benchmarking — reflects LLP partnership structure
  - DGA (2022) includes derivative financial instruments in net debt — not present in Flag

---

## 2026-01-30 - 2.7: Mine Real estate industry SOW

Run: 20260130-110048-64111 (iteration 7)

- Guardrails reviewed: yes
- Commit: 8c3c554 2.7: Mine Real estate industry SOW
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/real-estate.json')); assert d['industry']=='Real estate'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/real-estate.json (created)
- What was implemented:
  - Parsed Project Senator Scope of Work (April 11 2025)vSent.json — a real estate investment trust (InterRent REIT) acquisition SOW with both Tax DD and Financial DD sections
  - Document has clear structural boundary: Tax DD (paragraphs 4-73) and Financial DD (paragraphs 74-120) separated by bold "FINANCIAL DUE DILIGENCE SCOPE OF WORK" heading
  - Extracted 6 FDD sections with verbatim bullets: Accounting overview, Sustainability of NOI on a consolidated basis, Operating expenses, Balance sheet, Operating cash flow / Funds from operations, Audit work paper
  - Tax DD content excluded from sections array per FDD-only rules; Tax DD workstream noted in workstreams_found with detailed description of its scope
  - Identified 28 real estate-specific terms (NOI, FFO, property operating costs, occupancy rates, lease rates, tenant rental deposits, investment properties, REIT, etc.)
  - Noted 2 workstreams: Financial Due Diligence (primary, extracted) and Tax Due Diligence (noted_not_extracted, with detailed scope description)
  - No phases detected (single-phase SOW)
  - Scope period: FY2023-FY2024 + TTM Feb/Mar-25
- **Learnings:**
  - Real estate SOWs use NOI (Net Operating Income) instead of EBITDA as the primary profitability metric
  - FFO (Funds from Operations) is a REIT-specific performance metric used in the cash flow section
  - Balance sheet is presented as one comprehensive section rather than broken into sub-sections (AR, AP, WC, net debt all combined)
  - The sustainability of NOI section includes real estate-specific pro forma items: new units, lost units, acquired/developed/sold properties, expiring leases
  - Tax DD section includes REIT qualification testing and MFT (mutual fund trust) qualification testing — specific to REIT structure
  - The indent_level metadata is less reliable in this document — many bullets use numbered Word styles (pw_numbered-level2) rather than indent_level values
  - This is a public company take-private (REIT privatization) — includes "elimination of public company costs" as a NOI adjustment

---

## 2026-01-30 - 2.8: Mine Service industry SOWs

Run: 20260130-110048-64111 (iteration 8)

- Guardrails reviewed: yes
- Commit: 1b853f6 2.8: Mine Service industry SOW
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/service.json')); assert d['industry']=='Service'; assert 'sections' in d; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/service.json (created)
- What was implemented:
  - Parsed 3 source files: Ascent_ SoW.json (PDF extraction failure — no usable content), Project North KPMG Draft Scope of Work May 2024 (docx — full FDD scope), Project Ink Engagement Letter 2023 (PDF extraction failure — no usable content)
  - Two of three files are PDF extractions that failed with '[ERROR] No PDF library available.' — noted in files_analyzed and notes
  - All FDD content extracted from Project North (technology-enabled services company, VDD/sell-side engagement)
  - Extracted 13 FDD sections with verbatim bullets: General, Quality of earnings, Supporting analysis to QoE, Revenue analysis, Cost structure, Working capital, Supporting analysis to working capital, Accounts receivable, Prepaid expenses and other assets, AP/accrued liabilities/other liabilities, Capital expenditure requirements, Net debt/debt-like items, Audit work papers
  - Identified 22 service industry-specific terms (recurring revenue, annual recurring revenue, retention rates, customer churn, contractor costs, software development costs, data center costs, merchant service fees, deferred revenue, etc.)
  - Noted 3 workstreams: Financial Due Diligence (primary), Share Purchase Agreement Support (optional add-on), Discussion with Prospective Purchasing Parties (optional add-on)
  - No phases detected (single-phase SOW)
  - Scope period: FY22-FY23 + TTM Apr-24
- **Learnings:**
  - Service industry SOW follows a VDD/sell-side structure with optional buyer discussion and SPA support add-ons billed separately
  - Document separates "Supporting analysis" from main sections (QoE split into Revenue analysis + Cost structure; Working capital split into AR + Prepaids + AP)
  - Revenue analysis emphasizes annual recurring revenue, retention rates, and customer churn — characteristic of service/subscription businesses
  - Cost structure references software, data center, merchant service fees — indicating a technology-enabled services company
  - Capitalized labour (software development and commissions) is the primary capex item — distinct from manufacturing or construction capex
  - Two PDF files had no extractable content — this is the first story with majority of source files yielding no content

---

## 2026-01-30 - 2.9: Mine Supermarket industry SOW

Run: 20260130-110048-64111 (iteration 9)

- Guardrails reviewed: yes
- Commit: 29f62d0 2.9: Mine Supermarket industry SOW
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/supermarket.json')); assert d['industry']=='Supermarket'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/supermarket.json (created)
- What was implemented:
  - Parsed Project Tiger - Draft SOW - 2022-09-26.json (single source file, docx format, supermarket/grocery business)
  - Extracted 9 FDD sections with verbatim bullets: Financial Overview, Quality of Earnings, Supporting analysis for quality of earnings, SG&A expenses, Working capital, Net debt and other liabilities, Capital expenditures, Audit work papers, Assistance with transaction documentation
  - The "Supporting analysis for quality of earnings" section is the largest (19 bullets) and most industry-specific, covering: store-level analysis, tonnage, product category mix, customer cohort analytics, private label brand impact, central production unit, loyalty program metrics, competitive presence analysis, ramp-up analysis, and PowerBI dashboard deliverables
  - Identified 33 supermarket-specific terms (retail vs wholesale, tonnage, store-level analysis, product category mix, private label, central production unit, loyalty program, AOS, square footage, markdowns, stock shrinkage, distribution centers, PowerBI dashboards, etc.)
  - Noted 1 workstream: Financial Due Diligence (primary)
  - Business is segmented into Retail (store operations + e-commerce), Wholesale, and Corporate Overhead
  - Scope period: FY19-FY21 + TTM September 2022
  - No phases detected (single-phase SOW)
  - Document references US GAAP to IFRS conversion, suggesting cross-border transaction context
  - "Assistance with transaction documentation" section focuses on asset purchase agreement — buy-side engagement
- **Learnings:**
  - Supermarket SOWs have a uniquely large "Supporting analysis for QoE" section driven by store-level and customer analytics
  - Tonnage is a supermarket-specific revenue metric (not seen in any other industry)
  - Central production unit analysis is unique to grocery/supermarket businesses
  - Competitive presence analysis (5-10km radius circles) is a retail-specific location analysis technique
  - PowerBI dashboard creation is explicitly called out as a deliverable — not just an internal tool
  - The SOW segments analysis by Retail/Wholesale/Corporate Overhead — working capital and net debt sections explicitly call for bifurcation by business line

---

## 2026-01-30 - 2.10: Mine Tech industry SOWs

Run: 20260130-110048-64111 (iteration 10)

- Guardrails reviewed: yes
- Commit: ad1b885 2.10: Mine Tech industry SOW
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/tech.json')); assert d['industry']=='Tech'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/tech.json (created)
- What was implemented:
  - Parsed 2 source files: Project Vortex - scope.json (SaaS company, Themis Solutions / Clio, engagement letter with Phase 1/Phase 2 structure) and Project Zeno - scope.json (health tech carve-out, Rigel/Zeno division of Orion Health Holdings / HEALWELL AI)
  - Extracted 12 FDD sections with verbatim bullets from both files: Business understanding (Vortex), Business overview (Zeno), Financial reporting environment (Zeno), Quality of revenue (Vortex), Quality of earnings (both files), Supporting analysis to quality of earnings (Zeno), ARR drivers (Zeno), Profitability drivers (Zeno), Net working capital (both files), Locked box (Vortex), Stratified balance sheet and net debt (Zeno), Phase 1 GAAP considerations (Vortex)
  - 2 shared sections (Quality of earnings, Net working capital) include bullets from BOTH files with source tags
  - Identified 38 Tech/SaaS-specific terms (ARR, annual recurring revenues, SaaS KPIs, upsell, downsell, churn, deferred revenue, R&D capitalization, contract assets, commissions, GAAP conversion, locked box, booked-not-billed, customer cube, subscription revenues, stand-alone costs, DSO, DPO, etc.)
  - Noted 3 workstreams: Financial Due Diligence (primary), GAAP Conversion Analysis (Vortex — Spanish GAAP vs US GAAP), Tax Due Diligence (referenced in locked box section)
  - Vortex has Phase 1 (red flags) / Phase 2 (full DD) structure — classic Tech DD phasing
  - Two scope periods: both FY22-FY24+TTM
  - Terms and Conditions boilerplate excluded from extraction (non-FDD content)
- **Learnings:**
  - Tech SOWs emphasize ARR reconciliation, recurring vs non-recurring revenue splits, and SaaS KPI analysis (upsell/downsell/churn) as distinct sections
  - Locked box analysis is a prominent section in Tech M&A transactions (buyer pricing mechanism)
  - Carve-out Tech SOWs (Zeno) include extensive stand-alone cost analysis, allocated cost methodology review, and go-forward employee structure reconciliation
  - GAAP conversion (Spanish GAAP to US GAAP) can be a separate workstream in cross-border Tech deals
  - Tech SOWs split revenue analysis into Quality of Revenue (Vortex) vs ARR Drivers (Zeno) — different labels for similar analysis
  - Both documents contain substantial Terms and Conditions boilerplate after the FDD scope — must filter by font_size_pt (8pt = T&C) vs 10pt (scope content) and style (TnC = boilerplate)

---

## 2026-01-30 - 2.11: Mine Transportation industry SOW

Run: 20260130-110048-64111 (iteration 11)

- Guardrails reviewed: yes
- Commit: 5e6300f 2.11: Mine Transportation industry SOW
- Verification: `python3 -c "import json,sys; d=json.load(open('docs/mining/transportation.json')); assert d['industry']=='Transportation'; assert 'sections' in d; assert len(d['sections'])>0; print('PASS')"` -> PASS
- Files changed:
  - docs/mining/transportation.json (created)
- What was implemented:
  - Parsed 1 source file: Project Bus - Financial Due Diligence Scope of Work 1 1.json (docx format, bus/coach transportation company — Great Canadian Coaches Inc. and related entities)
  - Extracted 14 FDD sections with verbatim bullets: Overview, Consistency of accounting policies, Quality / sustainability of earnings, Revenue and profitability trends, Cost of revenues and Operating expenses, Working capital, Accounts receivable, Inventory, Other assets and liabilities, Accounts payable and accrued liabilities, Capital expenditure and fixed assets, Net Debt, Related Party Transactions, Commitments and Contingencies
  - Identified 20 transportation-specific terms (trip type, tours, day trips, number of trips, customer type, customer profile, fleet management, route-based operations, fare revenue, ridership, fuel costs, regulatory compliance, contract transit, maintenance vs growth capex, historical replacement cycle, utilization per unit, customer deposits, deferred revenue, seasonality)
  - Noted 1 workstream: Financial Due Diligence (primary)
  - No phases detected (single-phase work plan)
  - Scope period: FY22-FY24 + latest available YTD
  - Document includes two sub-heading groupings: "Supporting analyses to quality / sustainability of earnings" and "Supporting analyses to working capital"
  - Revenue section is most industry-specific: analysis by trip type (tours, day trips), customer profile (related vs third party), and KPIs like number of trips
  - Capex section includes fleet-specific items: replacement cycle, utilization per unit
- **Learnings:**
  - Transportation SOWs structure revenue by trip type (tours, day trips) — unique to bus/coach businesses
  - KPIs are volume-based (number of trips) rather than unit-price-based — reflects route-based operations model
  - Capital expenditure section emphasizes fleet replacement cycles and per-unit utilization — fleet-intensive business characteristic
  - The document uses "Bullet for no #'s" style for section headings (when bold) — consistent with other SOW documents in this corpus
  - Revenue analysis by customer profile (related party vs third party) indicates multi-entity group structure — 5 related companies in the target group
  - This is one of the more straightforward SOWs with standard FDD structure and no non-FDD workstreams

---

## 2026-01-30 - 3.0: Synthesize mining outputs into unified FDD scope library

Run: 20260130-110048-64111 (iteration 12)

- Guardrails reviewed: yes
- Commit: 2e2cbbc 3.0: Synthesize mining outputs into unified FDD scope library
- Verification: `python3 -c "import json,sys; d=json.load(open('reference/fdd_scope_library.json')); assert 'common_skeleton' in d; assert len(d['common_skeleton'])>0; assert 'industry_modules' in d; assert len(d['industry_modules'])>=8; assert 'metadata' in d; print('PASS')"` -> PASS
- Files changed:
  - reference/fdd_scope_library.json (created)
- What was implemented:
  - Read all 11 mining output JSON files from docs/mining/ (construction, eyecare, healthcare, hvac, manufacturing, prof-services, real-estate, service, supermarket, tech, transportation)
  - Normalized ~50+ variant section heading names across industries into ~13 canonical names using a heading normalization dictionary
  - Identified 9 common skeleton sections appearing in 8+ of 11 industries: business_overview, quality_of_earnings, revenue_analysis, operating_expenses, working_capital, accounts_receivable, accounts_payable_and_accrued_liabilities, capital_expenditure_requirements, net_debt
  - 4 sections did NOT meet 8/11 threshold: accounting_overview, inventory, commitments_and_contingencies, related_parties — these appear only in industry_modules
  - Selected generic default bullets for each common section (filtered out company-specific references, fiscal year mentions, and industry-specific terms)
  - Built industry_modules for all 11 industries with industry-specific bullets that ADD to or REPLACE the common skeleton
  - Handled bullet format variance: plain strings (construction, real-estate, service, supermarket, transportation) vs {text, source} objects (eyecare, healthcare, hvac, manufacturing, prof-services, tech)
  - Output metadata: industries_analyzed=11, common_threshold="8 of 11", total_sections_found=60, total_bullets_cataloged=1253
  - All 7 acceptance criteria passed on first verification attempt
- **Learnings:**
  - Heading normalization is the critical step — ~50+ variant headings needed mapping to ~13 canonical names (e.g., "supporting_analysis_for_quality_of_earnings" → "revenue_analysis", "cost_structure" → "operating_expenses", "sga_expenses" → "operating_expenses")
  - Bullet format variance (plain strings vs {text, source} objects) must be handled during ingestion — unwrap to text only for deduplication
  - 9 of 13 canonical sections appear in 8+ industries — a strong common skeleton for FDD SOWs
  - Real estate is the most structurally different industry (only 6 sections, NOI instead of EBITDA, combined balance sheet section)
  - Generic bullet selection requires filtering out: company names, fiscal year references (FY19, FY20, etc.), currency references, and industry-specific terms (tonnage, NOI, ARR, etc.)

---
