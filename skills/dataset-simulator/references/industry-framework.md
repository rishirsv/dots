# Industry Framework: Operating Model Characteristics

**Purpose**: Define how data rooms vary by industry using operating model characteristics rather than industry labels. Each axis defines what documents are triggered.

---

## Table of Contents

1. [Axes of Variation](#axes-of-variation)
2. [Document Trigger Rules](#document-trigger-rules)
3. [Industry Cluster Examples](#industry-cluster-examples)

---

## Axes of Variation

### 1. Revenue Model
**What it is**: How the company generates revenue and when it recognizes it.

**Possible values**:
- `subscription` — recurring fixed/tiered fees, ARR-based
- `usage_based` — variable per transaction, usage unit, or consumption
- `project_wip` — work-in-progress, milestone, or percentage-of-completion
- `sku_product` — discrete inventory items, units shipped/sold
- `transactional_pos` — point-of-sale, per-transaction settlement
- `professional_services` — time/materials, staff augmentation, fixed-fee engagements
- `provider_clinical` — per-service, per-visit, capitated, insurance claims
- `lending_portfolio` — interest income, yield on loan portfolio
- `contracted_infrastructure` — managed services, SLA-based, usage-metered

**Documents triggered**:
- Deferred revenue schedule, revenue recognition memo, contract asset/liability schedule
- Cohort analysis (subscription), backlog/pipeline (project), inventory ledger (SKU), cash flow timing bridge
- KPI pack (bookings, ARR, volume metrics), variable consideration reserve
- Pricing tiers, contract template library, customer economics model

---

### 2. Unit of Account
**What it is**: The primary granular entity that drives financial and operational measurement.

**Possible values**:
- `customer` — revenue and metrics by customer, often with multi-contract relationships
- `contract` — distinct contracts with separate terms, even for same customer
- `project` — project-based work with distinct budgets, timelines, scope
- `order` — purchase order, invoice-level transaction
- `sku` — product line, variant, or discrete inventory item
- `store` — physical retail location or franchised unit
- `provider` — clinician, facility, or network participant
- `route` — delivery or service route (logistics/field service)
- `loan` — individual loan instrument
- `asset` — equipment, vehicle, or property asset
- `patient_encounter` — healthcare visit, episode, or encounter

**Documents triggered**:
- Master file keyed by unit (customer master, contract register, project list, store master, provider roster, etc.)
- Detail P&L, P&L roll-up structure
- Volume metrics, trend analysis
- Concentration analysis (top 10 customers, stores, providers, etc.)

---

### 3. Regulatory Burden
**What it is**: Intensity of compliance, certification, and regulatory oversight.

**Possible values**:
- `light` — minimal compliance, standard commercial law only
- `moderate` — industry permits, basic certifications, annual filings
- `heavy` — extensive licensing, real-time inspections, audit trails, quality systems, recalls, reporting

**Documents triggered**:
- `light` → Entity formation, commercial agreements
- `moderate` → Permits, licenses, renewal schedules, compliance calendar
- `heavy` → Compliance pack (training logs, certification roster, inspection reports, CAPA register, recall log, regulatory correspondence, audit workpapers, quality manual, adverse event tracking)

---

### 4. Asset Intensity
**What it is**: Proportion of asset base in tangible, long-lived items vs. people/software/contracts.

**Possible values**:
- `light` — primarily people, software, IP, contracts; minimal physical plant
- `medium` — significant equipment, vehicles, or real estate
- `heavy` — major plants, distribution centers, fleet, extensive facilities, mining/extraction assets

**Documents triggered**:
- Fixed asset ledger (by class, location, depreciation method)
- Maintenance and repair tracking, capex budget and pipeline
- Environmental, safety, and equipment compliance docs
- Real estate appraisals, facility condition assessments
- Lease schedules (machinery, equipment, real estate)
- Insurance inventory (property, casualty, workers comp)
- Capex project-level rollup

---

### 5. Inventory and Working Capital Intensity
**What it is**: Extent and complexity of inventory management and working capital dynamics.

**Possible values**:
- `none` — services only, no product inventory
- `light_consumables` — small supplies, PPE, consumables with fast turnover
- `raw_wip_finished` — manufacturing flow with raw materials, work-in-progress, finished goods
- `retail` — retail inventory with SKU-level tracking, shrink, markdown, seasonal peaks

**Documents triggered**:
- Inventory ledger, perpetual rolls, physical count reports
- Bill of Materials (BOM), production schedules, standard cost cards
- Inventory aging, obsolescence reserve, scrap/waste log
- Purchase price variance, inventory valuation method (FIFO/LIFO/weighted)
- Deferred revenue and contract asset schedules (retainage, over/under billings)
- Working capital bridge (AR, AP, inventory turns)
- Markdown and shrink tracking
- Supplier concentration

---

### 6. Labor Model
**What it is**: How labor is structured, compensated, and tracked.

**Possible values**:
- `salaried` — fixed payroll, minimal variable comp, typical corporate structure
- `commission` — variable revenue-driven comp, sales force or service partners
- `billable_professional` — time-tracked, billable hours, utilization rates
- `shift_hourly` — hourly, shift-based, retail/hospitality-typical
- `licensed_provider` — credentialed professionals (MD, RN, therapist), licensing/malpractice overlay
- `unionized` — union contracts, defined scales, grievance procedures

**Documents triggered**:
- Org chart, headcount by function/title/location
- Payroll register, bonus/commission payout schedule
- Comp ladders, equity grants and vesting
- Utilization reporting (billable, hours, realization)
- Credentialing roster (licenses, malpractice, DEA numbers, insurance)
- Union agreements, wage scales, grievance log
- Benefits enrollment, ERISA compliance, pension liability
- Beneficiary designations (key person insurance)

---

### 7. Customer Concentration and Contract Architecture
**What it is**: Scale and relationship depth with customer base; contract and MSA strategy.

**Possible values**:
- `enterprise_msa` — large customers, master service agreements, multi-year terms
- `smb_self_serve` — small-to-medium businesses, standard terms, self-onboarding
- `consumer_retail` — individual end-users, minimal contract depth
- `government` — public sector, RFP-driven, compliance overlay, fixed pricing
- `payer_network` — insurance, employer networks, capitation or fee schedules
- `franchise` — franchisees as primary revenue unit

**Documents triggered**:
- Customer master (revenue tier, contract terms, churn risk, concentration notes)
- Top-10 concentration analysis
- Contract register with terms, renewals, escalation, change-order log
- Customer reference list, net promoter score
- Franchise agreement templates, royalty schedules, franchisee roster
- Government customer compliance (labor, environmental, cybersecurity attestations)
- Payer contracts, fee schedules, claims adjudication detail

---

### 8. Site Footprint
**What it is**: Geographic distribution of operations and locations.

**Possible values**:
- `single` — single headquarters or facility
- `multi_site` — multiple owned/operated locations (offices, facilities)
- `plant_network` — manufacturing plant footprint
- `retail_chain` — multi-store retail operations
- `clinic_network` — distributed healthcare delivery
- `remote_first` — primarily remote/distributed workforce
- `route_based` — field operations, delivery routes, field service routes

**Documents triggered**:
- Site master (name, address, size, staffing, revenue, opening/closing dates)
- Real estate schedules, rent rolls, landlord contacts
- Site-level P&L, revenue/margin by site
- Lease abstracts, tenant improvement schedules
- Facility condition assessment, capex by site
- Site-level compliance (local permits, health inspections, zoning)
- Route manifest, service territory definitions
- Utilities, maintenance contracts by site
- Insurance by location

---

### 9. Data Sensitivity and Technology Dependence
**What it is**: Criticality of data security, privacy compliance, and IT systems.

**Possible values**:
- `low` — standard business data, no special sensitivity
- `moderate` — customer data privacy, payment card compliance (PCI), basic IT security
- `high` — PHI/PII, intellectual property, financial data, state secrets, clinical data; SOC2, ISO27001, HIPAA, FedRAMP requirements

**Documents triggered**:
- Privacy policy, data retention schedule
- Security assessment (penetration test results, security audit)
- Incident log (breaches, near-misses)
- Business continuity and disaster recovery plan, RTO/RPO
- Vendor security questionnaires, BAAs (Business Associate Agreements)
- Cybersecurity insurance, coverage summary
- Data governance charter, classification policy
- System architecture diagram, infrastructure provider (AWS/Azure/GCP SLA)
- Backup and recovery testing results
- Compliance certifications (SOC2, ISO27001, HIPAA, PCI-DSS)

---

### 10. Quality and Safety Exposure
**What it is**: Regulatory and liability exposure related to product/service quality and safety.

**Possible values**:
- `none` — low/no quality or safety risk
- `standard` — typical commercial quality standards, product liability insurance
- `product_safety` — consumer product safety, recall procedures, liability exposure
- `clinical_quality` — medical/pharmaceutical quality, adverse event reporting, malpractice exposure
- `food_safety` — food handling, contamination risk, FSMA compliance
- `environmental` — hazardous materials, environmental permits, remediation

**Documents triggered**:
- Quality manual, quality metrics dashboard
- Incident log, CAPA (Corrective and Preventive Action) register
- Product recall history, recall procedures
- Adverse event log (clinical), malpractice claims summary
- Food safety audit results, supplier certifications
- Environmental permits, environmental compliance audit
- Product liability insurance, coverage limits
- Regulatory correspondence (FDA, EPA, OSHA)
- Training and certification records (food handler, biohazard, environmental)

---

### 11. Capital Structure Complexity
**What it is**: Sophistication and layering of the financial structure.

**Possible values**:
- `simple` — founder-owned, personal guarantee LOC, straightforward equity
- `moderate` — PE-backed, basic holdco/opco structure, venture rounds, seller financing
- `complex` — multi-layer debt (tranches, mezzanine), contingent consideration, seller notes, roll-over equity, multiple holdcos, earn-outs

**Documents triggered**:
- Ownership cap table, equity schedules, vesting agreements
- Debt schedule (all tranches, covenants, payment terms, guarantors)
- Corporate documents (articles, bylaws, board resolutions)
- Intercompany transaction log, allocation methodologies
- Earn-out or contingent consideration schedule
- Guarantee agreements, collateral documentation
- Related-party transaction summary
- Cash flow waterfall, debt service coverage
- Banking relationship summary, credit agreement terms
- Subscription agreements, note terms
- Tax allocation agreements (partnership/LLC)

---

### 12. Geographic and Tax Footprint
**What it is**: Jurisdictional complexity of operations and tax exposure.

**Possible values**:
- `single_state` — operations in one US state
- `multi_state` — multiple US states, multi-state tax filing
- `cross_border` — international subsidiaries, transfer pricing, foreign tax compliance

**Documents triggered**:
- Tax return family (federal, state, local, foreign)
- State apportionment schedules, nexus analysis
- Sales tax registration and filing summary (by state)
- Payroll tax registration (federal, state, local, by state)
- Property tax returns and assessments (by jurisdiction)
- Transfer pricing documentation (if applicable)
- Foreign subsidiary tax filings (if applicable)
- Tax notice log (open audits, proposed adjustments)
- Tax provision reconciliation, uncertain tax position schedule
- Indirect tax exposure summary (VAT, GST, if international)

---

## Document Trigger Rules

**Format**: `Trigger condition` → `Documents added`

| # | Trigger Condition | Documents Added |
|---|---|---|
| 1 | revenue_model in {subscription, usage_based} | deferred_revenue_schedule, revenue_recognition_memo, contract_asset_schedule, cohort_retention_analysis, arr_bridge_and_waterfall, churn_and_nrr_analysis |
| 2 | revenue_model in {project_wip, professional_services} | project_ledger, wip_schedule, revenue_by_milestone, backlog_and_pipeline, estimated_loss_schedule, change_order_log |
| 3 | revenue_model in {sku_product, retail} | inventory_ledger, bill_of_materials, production_schedule, purchase_price_variance, markdown_and_shrink_log |
| 4 | revenue_model == lending_portfolio | loan_detail_schedule, interest_income_bridge, reserve_for_losses_schedule, delinquency_aging |
| 5 | revenue_model in {provider_clinical, subscription} | customer_contract_register, variable_consideration_and_reserves_schedule, pricing_tiers_and_discounts, customer_economics_model |
| 6 | unit_of_account == store OR site_footprint in {retail_chain, multi_site, clinic_network} | store_master_or_site_master, site_level_pl, rent_roll_and_lease_abstracts, site_opening_closing_schedule, four_wall_economics |
| 7 | unit_of_account == project OR revenue_model == project_wip | project_schedule, project_P&L, revenue_by_milestone, wip_aging, contract_status_dashboard |
| 8 | unit_of_account in {provider, patient_encounter} OR revenue_model == provider_clinical | provider_roster_and_credentialing, provider_production_and_compensation, payer_mix_and_reimbursement, patient_ar_aging, insurance_write_off_reserve |
| 9 | inventory_model in {raw_wip_finished, retail} | inventory_ledger, physical_count_report, perpetual_variance_analysis, obsolescence_reserve, scrap_log, inventory_turnover_trend |
| 10 | inventory_model != none | inventory_valuation_method_memo, purchase_price_variance_detail, supplier_concentration_analysis, inventory_aging |
| 11 | labor_model == commission OR labor_model == billable_professional | commission_or_billable_payout_schedule, sales_rep_or_resource_roster, compensation_plan_detail, utilization_report, sales_pipeline_and_forecast |
| 12 | labor_model == licensed_provider | credentialing_roster, malpractice_claims_summary, provider_credentialing_summary, dea_or_license_expiration_schedule |
| 13 | labor_model == unionized | union_agreement, wage_scale, grievance_log, collective_bargaining_summary |
| 14 | labor_model in {shift_hourly, salaried} | org_chart, headcount_by_function_and_location, compensation_ladder_by_role, payroll_register, attrition_and_tenure_analysis |
| 15 | regulatory_burden == heavy | compliance_pack (training_logs, inspection_reports, certification_roster, CAPA_register, recall_log, regulatory_correspondence, audit_workpapers) |
| 16 | regulatory_burden == moderate | permits_and_licenses, compliance_calendar, renewal_schedule, annual_compliance_attestation |
| 17 | asset_intensity in {medium, heavy} | fixed_asset_ledger_by_class_and_location, depreciation_schedule, capex_budget_and_project_list, maintenance_contract_summary |
| 18 | asset_intensity == heavy | environmental_permits_and_compliance, facility_condition_assessment, real_estate_appraisal, equipment_maintenance_log, insurance_inventory_by_asset_class |
| 19 | customer_concentration == enterprise_msa OR contract_architecture == government | customer_master_with_top_10_concentration, contract_register_with_renewal_dates_and_terms, change_order_log, contract_liability_schedule |
| 20 | customer_concentration == payer_network OR revenue_model == provider_clinical | payer_contract_schedule, fee_schedule_and_rates, claims_adjudication_detail, insurance_write_off_reserve, capitation_and_risk_adjustment |
| 21 | customer_concentration == franchise | franchise_agreement, royalty_schedule, franchisee_roster_and_performance, area_developer_agreements |
| 22 | site_footprint in {multi_site, retail_chain, clinic_network, plant_network} | site_master_with_revenue_and_headcount, site_opening_closing_schedule, real_estate_schedule_and_rent_roll, site_level_audit_trail |
| 23 | site_footprint == route_based | route_master, service_territory_map, delivery_schedule, route_productivity_and_profitability |
| 24 | data_sensitivity in {moderate, high} | privacy_policy, data_retention_schedule, security_assessment_or_penetration_test, incident_log, business_continuity_plan, vendor_baa_summary, cybersecurity_insurance |
| 25 | data_sensitivity == high | soc2_or_iso27001_certification, hipaa_or_fedramp_compliance_checklist, system_architecture_diagram, backup_and_recovery_test_results |
| 26 | quality_and_safety == product_safety | product_recall_history, product_liability_insurance_certificate, product_safety_incident_log, fsm_audit_results |
| 27 | quality_and_safety == clinical_quality | adverse_event_log, malpractice_claims_summary, clinical_quality_metrics_dashboard, clia_or_cap_certification |
| 28 | quality_and_safety == environmental | environmental_permits, environmental_audit_report, hazardous_waste_log, environmental_remediation_schedule |
| 29 | capital_structure_complexity in {moderate, complex} | cap_table_and_equity_schedule, debt_schedule_with_covenants, related_party_transaction_summary, earnings_and_contingent_consideration_schedule |
| 30 | capital_structure_complexity == complex | intercompany_transaction_log, corporate_restructuring_history, contingent_liability_schedule, guarantee_and_collateral_documentation |
| 31 | tax_footprint in {multi_state, cross_border} | state_apportionment_schedule, nexus_analysis, sales_tax_registration_summary, payroll_tax_registration_by_state |
| 32 | tax_footprint == cross_border | transfer_pricing_documentation, foreign_tax_credit_schedule, foreign_subsidiary_tax_filings, indirect_tax_exposure_analysis |
| 33 | (always) | entity_formation_docs, accounting_policy_memo, trial_balance, general_ledger, close_checklist, financial_statement_package, cash_flow_statement, key_assumptions_and_estimates_schedule |
| 34 | revenue_model != none | customer_master_or_contract_register, revenue_recognition_policy, top_10_customer_concentration, revenue_bridge_from_prior_year |

---

## Industry Cluster Examples

### SaaS / Subscription
**Axis values**:
- revenue_model: `subscription` or `usage_based`
- unit_of_account: `customer`
- regulatory_burden: `light` or `moderate`
- asset_intensity: `light`
- inventory_model: `none`
- labor_model: `salaried`
- customer_concentration: `enterprise_msa` or `smb_self_serve`
- site_footprint: `single` or `remote_first`
- data_sensitivity: `moderate` or `high`
- capital_structure_complexity: `moderate`

**Document overlay**:
- Deferred revenue schedule, revenue recognition memo, contract asset ledger
- Cohort analysis, ARR bridge, NRR and churn by cohort
- Customer master, top-10 concentration, customer lifetime value model
- SAC and CAC analysis, sales pipeline and forecast
- Org chart, headcount by function
- SOC2 Type II certification, security assessment
- Cap table, equity grant schedule
- Payroll, benefits, stock option pool

---

### Construction / Project-Based Services
**Axis values**:
- revenue_model: `project_wip`
- unit_of_account: `project` or `contract`
- regulatory_burden: `moderate` or `heavy`
- asset_intensity: `medium`
- inventory_model: `light_consumables`
- labor_model: `salaried` or `unionized`
- customer_concentration: `enterprise_msa` or `government`
- site_footprint: `multi_site` or `route_based`
- data_sensitivity: `moderate`
- capital_structure_complexity: `moderate` or `complex`

**Document overlay**:
- Project ledger with WIP aging, revenue by milestone (POC method)
- Estimated loss schedule, change order log, backlog and pipeline
- Contract register with terms, estimated profit/loss
- Bonding schedule (bid, performance, payment bonds)
- Safety metrics, incident log, OSHA compliance
- Equipment and vehicle fleet schedule
- Union agreements, wage scales, fringe benefits
- Site master, site-level P&L, rent roll
- Subcontractor roster and payment tracking

---

### Manufacturing
**Axis values**:
- revenue_model: `sku_product`
- unit_of_account: `sku` or `order`
- regulatory_burden: `moderate` or `heavy`
- asset_intensity: `heavy`
- inventory_model: `raw_wip_finished`
- labor_model: `shift_hourly` or `unionized`
- customer_concentration: `enterprise_msa` or `smb_self_serve`
- site_footprint: `plant_network`
- data_sensitivity: `low` or `moderate`
- quality_and_safety: `product_safety` or `environmental`

**Document overlay**:
- Bill of materials (BOM), production schedule, standard cost cards
- Inventory ledger (raw, WIP, finished), physical count reports
- Plant master, capacity analysis, production bottleneck summary
- Purchase price variance, supplier concentration
- Sales and operations plan (S&OP)
- Fixed asset ledger by plant, capex project list
- Product liability insurance, recall procedures
- Environmental compliance, permits, and audit reports
- Headcount by plant and function, union agreements
- Customer master, top-10 concentration, sales forecast by customer/product

---

### Professional Services
**Axis values**:
- revenue_model: `professional_services` or `billable_professional`
- unit_of_account: `project` or `contract`
- regulatory_burden: `moderate` (legal/accounting/advisory) or `light`
- asset_intensity: `light`
- inventory_model: `none`
- labor_model: `billable_professional`
- customer_concentration: `enterprise_msa`
- site_footprint: `single` or `multi_site`
- data_sensitivity: `high`

**Document overlay**:
- Project ledger, engagement detail, revenue by milestone or time-and-materials
- Utilization report (billable hours, realization rate, capacity)
- Backlog and pipeline (projects in process and opportunity pipeline)
- Resource roster with billable status, utilization by resource
- Headcount by level (partner, director, manager, analyst), comp ladders
- Professional liability insurance, malpractice claims summary
- Engagement contracts, change order log
- Client master, top-10 concentration, client profitability
- SOC2 Type II certification, security assessment, privacy policy
- Unbilled revenue schedule

---

### Retail
**Axis values**:
- revenue_model: `transactional_pos` or `sku_product`
- unit_of_account: `store` or `order`
- regulatory_burden: `light` or `moderate`
- asset_intensity: `medium`
- inventory_model: `retail`
- labor_model: `shift_hourly`
- customer_concentration: `consumer_retail`
- site_footprint: `retail_chain`
- data_sensitivity: `moderate`

**Document overlay**:
- Store master (count, size, location, opening/closing dates)
- Site-level P&L, four-wall economics, comp store sales trend
- Inventory ledger, physical count reports, markdown and shrink log
- Store rent roll, landlord agreements, real estate schedule
- Point-of-sale (POS) detail (daily/weekly sales by store and category)
- Employee headcount and payroll by store, org chart
- Loyalty program and gift card liability
- Promotional calendar, vendor allowances and rebate schedule
- Product safety and recall log
- Store-level metrics (traffic, conversion, ATV, margin)

---

### Dental / Healthcare Provider
**Axis values**:
- revenue_model: `provider_clinical`
- unit_of_account: `provider` or `patient_encounter`
- regulatory_burden: `heavy`
- asset_intensity: `medium`
- inventory_model: `light_consumables`
- labor_model: `licensed_provider` or `salaried`
- customer_concentration: `payer_network`
- site_footprint: `clinic_network`
- data_sensitivity: `high`
- quality_and_safety: `clinical_quality`

**Document overlay**:
- Provider roster with credentials, DEA numbers, malpractice insurance, license status
- Provider production by service line, payer, patient cohort
- Patient AR aging, insurance write-off reserve, patient bad debt reserve
- Payer contract schedule with fee schedules and capitation rates
- Claims adjudication detail, denial analysis, appeal log
- Clinical quality metrics, adverse event log, CAPA register
- HIPAA compliance, BAA summary, business continuity plan
- Facility master, equipment and clinical supplies inventory
- Payroll by provider, bonus and incentive compensation
- Patient encounter ledger, diagnosis code mix, referral source analysis
- Credentialing and malpractice claims summary
- CLIA or CAP certification, state licensing

---

### Financial Services / Lending
**Axis values**:
- revenue_model: `lending_portfolio`
- unit_of_account: `loan`
- regulatory_burden: `heavy`
- asset_intensity: `medium` (real estate-backed) or `light`
- inventory_model: `none`
- labor_model: `salaried`
- customer_concentration: `varies` (can be concentrated in large institutions)
- site_footprint: `single` or `multi_site`
- data_sensitivity: `high`
- capital_structure_complexity: `moderate` to `complex`

**Document overlay**:
- Loan detail schedule with borrower name, amount, rate, term, vintage
- Interest income bridge, yield and premium analysis
- Reserve for loan losses schedule, provision methodology, loss history
- Delinquency aging (30/60/90+ days), default and loss statistics
- Loan collateral schedule, appraisal summary, LTV analysis
- Regulatory compliance (CRA, fair lending, BSA/AML)
- Financial statements and audited information for large borrowers (if relevant)
- Capital adequacy and leverage ratios (if regulated entity)
- Servicing summary, mortgage insurance, forbearance log
- Loan sale/securitization documentation (if applicable)

---

### Energy / Infrastructure
**Axis values**:
- revenue_model: `contracted_infrastructure` or `subscription`
- unit_of_account: `asset` or `site`
- regulatory_burden: `heavy`
- asset_intensity: `heavy`
- inventory_model: `none` or `light_consumables`
- labor_model: `salaried` or `shift_hourly`
- customer_concentration: `enterprise_msa` or `government`
- site_footprint: `plant_network` or `single`
- data_sensitivity: `moderate` or `high`
- quality_and_safety: `environmental`

**Document overlay**:
- Asset register by asset type, location, acquisition cost, depreciation
- Capacity analysis, utilization by asset or facility
- Maintenance contract summary, preventive maintenance schedule, CapEx pipeline
- Environmental permits and compliance audit results
- Regulatory correspondence (EPA, FERC, state utility commissions)
- Insurance inventory by asset class, property and casualty certificates
- Renewable energy incentives (if applicable), tax credit schedule
- Customer contracts (PPAs, service agreements), top-10 concentration
- Operations and maintenance metrics, incident log
- Real estate and right-of-way agreements

---

### Food & Beverage
**Axis values**:
- revenue_model: `sku_product` or `transactional_pos`
- unit_of_account: `sku` or `order` or `location`
- regulatory_burden: `heavy`
- asset_intensity: `medium`
- inventory_model: `raw_wip_finished` or `retail`
- labor_model: `shift_hourly`
- customer_concentration: `varies` (B2B or B2C)
- site_footprint: `plant_network` (manufacturing) or `retail_chain` (restaurants/retail)
- data_sensitivity: `low` or `moderate`
- quality_and_safety: `food_safety`

**Document overlay**:
- Recipe and BOM, ingredient costing, supplier concentration
- Inventory ledger, physical count by location, shrink and waste log
- Food safety audit results, FSMA compliance, training logs
- Supplier certifications, audit summary, recall procedures
- Production schedule, manufacturing P&L (if manufacturer)
- Location master (restaurants/stores), site-level P&L
- Health inspection records, violation log
- Product liability insurance, recall history
- Point-of-sale detail and daily sales reporting (if restaurant/retail)
- Promotional calendar, vendor rebates, pricing tiers

---

### Logistics / Transportation
**Axis values**:
- revenue_model: `transactional_pos` or `contracted_infrastructure` or `usage_based`
- unit_of_account: `order` or `shipment` or `route`
- regulatory_burden: `heavy`
- asset_intensity: `heavy`
- inventory_model: `none`
- labor_model: `shift_hourly`
- customer_concentration: `enterprise_msa` or `smb_self_serve`
- site_footprint: `route_based` or `plant_network` (distribution centers)
- data_sensitivity: `moderate`
- quality_and_safety: `product_safety` or `standard`

**Document overlay**:
- Fleet master (vehicles, equipment, maintenance status, lease terms)
- Route master, service territory definition, pickup/delivery schedule
- Shipment detail, shipment-level P&L, mileage and fuel tracking
- Driver roster, driver qualifications, safety certifications
- Maintenance contract summary, vehicle repair log, preventive maintenance schedule
- Insurance by vehicle class, third-party liability, cargo insurance
- Customer master, top-10 shipper concentration, pricing by lane
- Compliance with DOT regulations, vehicle inspection records, HAZMAT certifications
- Utilization metrics (asset turns, miles per vehicle, capacity utilization)
- Fuel hedge and cost tracking
- Technology (TMS, GPS, tracking) system architecture and SLA

