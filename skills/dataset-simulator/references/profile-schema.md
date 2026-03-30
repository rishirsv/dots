# Profile Schema v2

## Contents

- [Overview](#overview)
- [Schema Reference](#schema-reference)
- [Document Triggers](#document-triggers)
- [Pre-Built vs On-The-Fly](#pre-built-vs-on-the-fly)
- [Generating a Profile for a New Industry](#generating-a-profile-for-a-new-industry)

## Overview

A profile defines the operating characteristics of a company in a specific industry and subvertical. Scripts consume the profile to generate realistic, internally consistent data room artifacts.

Six pre-built profiles ship with the skill: `saas`, `construction`, `manufacturing`, `professional_services`, `retail`, `dental`. For any other industry, the agent generates a profile on-the-fly matching this schema.

## Schema Reference

```json
{
  "profile_version": "2.0",

  "identity": {
    "sector": "string — broad industry (e.g., Healthcare Services, Technology, Industrial)",
    "subvertical": "string — specific niche (e.g., Dental, SaaS, Commercial Construction)",
    "jurisdiction": "string — primary legal jurisdiction (default: US)",
    "currency": "string — primary currency (default: USD)"
  },

  "size_model": {
    "small": {
      "revenue": [5000000, 20000000],
      "headcount": [20, 80],
      "sites": [1, 3],
      "primary_units": [50, 500]
    },
    "mid": {
      "revenue": [20000000, 100000000],
      "headcount": [80, 400],
      "sites": [3, 25],
      "primary_units": [200, 2000]
    },
    "large": {
      "revenue": [100000000, 500000000],
      "headcount": [400, 2000],
      "sites": [15, 100],
      "primary_units": [1000, 10000]
    }
  },

  "revenue_streams": [
    {
      "name": "string — stream name (e.g., Subscription Revenue, Project Revenue)",
      "model": "string — subscription | usage_based | project | product | transaction | clinical | time_based | lending | contracted_infrastructure",
      "pct_of_total": 0.85,
      "recognition": "string — over contract term | at delivery | as services rendered | percentage of completion | at point of sale",
      "billing_cadence": "string — monthly recurring | milestone | at shipment | at service | invoice net 30",
      "cash_collection_lag_days": [15, 45],
      "contract_term_months": 12,
      "primary_unit": "string — customer | contract | project | order | SKU | store | provider | route | loan | patient_encounter"
    }
  ],

  "operating_model": {
    "primary_units": ["string — the main entities the business operates around"],
    "asset_intensity": "string — light | medium | heavy",
    "inventory_model": "string — none | light_consumables | raw_wip_finished | retail",
    "labor_model": "string — salaried | commission | billable_professional | shift_hourly | licensed_provider | unionized",
    "site_model": "string — single | multi_site | plant_network | retail_chain | clinic_network | remote_first | route_based",
    "customer_model": "string — enterprise_msa | smb_self_serve | consumer_retail | government | payer_network | franchise"
  },

  "regulatory_model": {
    "burden": "string — light | moderate | heavy",
    "regimes": ["string — e.g., HIPAA, OSHA, FDA, SOC2, PCI, state_licensure"],
    "required_compliance_docs": ["string — e.g., license_roster, training_log, incident_log, CAPA_register"]
  },

  "financial_model": {
    "chart_of_accounts": {
      "revenue": [
        {"code": "4000", "name": "string", "pct_of_revenue": 0.85, "normal_balance": "credit"}
      ],
      "cogs": [
        {"code": "5000", "name": "string", "pct_of_revenue": 0.35, "normal_balance": "debit"}
      ],
      "opex": [
        {"code": "6000", "name": "string", "pct_of_revenue": 0.15, "normal_balance": "debit"}
      ],
      "assets": [
        {"code": "1000", "name": "string", "normal_balance": "debit"}
      ],
      "liabilities": [
        {"code": "2000", "name": "string", "normal_balance": "credit"}
      ],
      "equity": [
        {"code": "3000", "name": "string", "normal_balance": "credit"}
      ]
    },

    "seasonality": {
      "type": "string — quarterly | monthly",
      "pattern": {"Q1": 0.22, "Q2": 0.25, "Q3": 0.25, "Q4": 0.28}
    },

    "working_capital_drivers": {
      "dso_range": [30, 60],
      "dpo_range": [30, 45],
      "inventory_days_range": [0, 0],
      "deferred_revenue_months_range": [0, 0],
      "retainage_pct_range": [0, 0]
    },

    "capex_policy": {
      "capex_pct_of_revenue": [0.02, 0.05],
      "capitalization_threshold": 5000,
      "useful_life_years": [3, 7]
    },

    "debt_structure": {
      "type": "string — none | revolver | term_loan | abl | equipment | bonding",
      "leverage_range": [0, 3.0],
      "interest_rate_range": [0.05, 0.08]
    }
  },

  "document_triggers": {
    "needs_deferred_revenue_schedule": false,
    "needs_wip_schedule": false,
    "needs_inventory_ledger": false,
    "needs_bom": false,
    "needs_provider_production": false,
    "needs_store_master": false,
    "needs_project_master": false,
    "needs_timesheet_data": false,
    "needs_loan_tape": false,
    "needs_fleet_master": false,
    "needs_credentialing_roster": false,
    "needs_lot_traceability": false,
    "needs_route_economics": false,
    "needs_payer_mix": false,
    "needs_mrr_analysis": false,
    "needs_backlog_schedule": false,
    "needs_comp_sales": false
  },

  "kpis": [
    {
      "name": "string",
      "min": 0.0,
      "max": 1.0,
      "typical": 0.5,
      "unit": "string — pct | ratio | days | dollars | count"
    }
  ],

  "qoe_adjustments": {
    "common": [
      {"name": "string", "description": "string", "pct_of_ebitda_range": [0.01, 0.05]}
    ],
    "owner_addbacks": [
      {"name": "string", "description": "string", "dollar_range": [50000, 200000]}
    ]
  },

  "red_flag_library": [
    {
      "name": "string",
      "description": "string",
      "detection_method": "string — how a diligence analyst would find it",
      "severity": "string — critical | significant | manageable"
    }
  ],

  "departments": [
    {"name": "string", "typical_pct": 0.25, "is_revenue_generating": true}
  ],

  "narrative_style": {
    "industry_terms": ["string — domain-specific vocabulary for narrative generation"],
    "banker_terms": ["string — M&A/investment banking terminology"],
    "legal_terms": ["string — industry-specific legal/contract terms"]
  },

  "validation_rules": [
    {
      "id": "string — rule ID (e.g., U-001, S-001)",
      "description": "string",
      "tolerance": 0.001,
      "applies_when": "string — always | trigger condition"
    }
  ]
}
```

## Document Triggers

Document triggers replace the old `if industry == "saas"` pattern. Each trigger is a boolean derived from the profile's operating model:

| Trigger | Set when | Documents added |
|---|---|---|
| `needs_deferred_revenue_schedule` | `revenue_stream.model in {subscription, usage_based}` | deferred_revenue_schedule.xlsx, contract_assets.xlsx |
| `needs_mrr_analysis` | `revenue_stream.model == subscription` | mrr_analysis.xlsx, arr_bridge.xlsx, cohort_retention.xlsx |
| `needs_wip_schedule` | `revenue_stream.model == project` | wip_schedule.xlsx, backlog.xlsx, change_orders.xlsx |
| `needs_backlog_schedule` | `revenue_stream.model in {project, contracted_infrastructure}` | backlog_schedule.xlsx |
| `needs_inventory_ledger` | `inventory_model != none` | inventory_ledger.xlsx, inventory_valuation.xlsx |
| `needs_bom` | `inventory_model == raw_wip_finished` | bill_of_materials.xlsx, production_schedule.xlsx |
| `needs_provider_production` | `labor_model == licensed_provider` | provider_production.xlsx, provider_roster.xlsx |
| `needs_payer_mix` | `customer_model == payer_network` | payer_mix.xlsx, insurance_ar_aging.xlsx |
| `needs_credentialing_roster` | `labor_model == licensed_provider` | credentialing_roster.xlsx |
| `needs_store_master` | `site_model in {retail_chain, clinic_network}` | store_master.xlsx, site_level_pl.xlsx |
| `needs_comp_sales` | `site_model == retail_chain` | comp_sales.xlsx, daily_sales.xlsx |
| `needs_project_master` | `revenue_stream.model == project` | project_master.xlsx, contract_register.xlsx |
| `needs_timesheet_data` | `labor_model == billable_professional` | timesheet_data.xlsx, utilization_report.xlsx |
| `needs_loan_tape` | `revenue_stream.model == lending` | loan_tape.xlsx, delinquency_roll.xlsx |
| `needs_fleet_master` | `site_model == route_based` | fleet_master.xlsx, route_economics.xlsx |
| `needs_route_economics` | `site_model == route_based` | route_density.xlsx, on_time_delivery.xlsx |
| `needs_lot_traceability` | `regulatory_model.regimes includes {FDA, HACCP, SQF}` | lot_traceability.xlsx, batch_records.xlsx |

## Pre-Built vs On-The-Fly

**Pre-built profiles** (in `references/profiles/`) serve as calibration examples. They have been reviewed for realistic bounds, complete COAs, and accurate KPIs.

**On-the-fly profiles** are generated by the agent for any industry not covered by pre-built profiles. The agent:
1. Reads this schema documentation
2. Uses its domain knowledge to populate all fields for the target industry
3. Writes the profile to `references/profiles/<industry>.json`
4. Scripts consume it identically to pre-built profiles

## Generating a Profile for a New Industry

When asked to generate a data room for an industry without a pre-built profile:

1. Determine the sector, subvertical, and operating model characteristics.
2. Set revenue streams with realistic models, recognition methods, and collection lags.
3. Set operating model axes: asset intensity, inventory, labor, site, customer model.
4. Set regulatory burden and applicable regimes.
5. Build the chart of accounts with industry-appropriate line items and realistic percentages.
6. Set seasonality patterns appropriate to the business.
7. Set working capital drivers (DSO, DPO, inventory days, deferred revenue, retainage).
8. Resolve document triggers from the operating model.
9. Define 5-10 industry-specific KPIs with realistic min/max/typical ranges.
10. Define 3-5 common QoE adjustments and 2-3 owner addbacks.
11. Define 3-5 red flags specific to the industry.
12. Define departments with typical headcount percentages.
13. Write the profile JSON and validate it parses correctly.

Use the pre-built profiles as calibration — the structure and level of detail should match.
