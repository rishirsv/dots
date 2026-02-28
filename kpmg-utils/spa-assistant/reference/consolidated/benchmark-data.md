# SPA Benchmark Data (from analyzed deals)

> Note on scope: Benchmarks below are taken from the analyses in `reference/`. Where a document is a **public-company merger agreement** (fixed per-share price), classic private-company SPA mechanics (Net Debt / NWC true-up, escrow-backed indemnities) are often **not applicable** and are shown as such.

## Deal Size Distribution

| Deal | Headline Value | Deal Type | Pricing Structure |
|------|---------------|-----------|-------------------|
| HealthEquity/Luum | $50,000,000 base + up to $20,000,000 earn-out (up to $70,000,000 total) | Strategic | Completion accounts (Cash/Debt/NWC/Txn Exp) + earn-out |
| TreeHouse (Meal Prep) | $950,000,000 enterprise value (Estimated Purchase Price cap $1,010,000,000) | Financial sponsor-style buyer | Completion accounts (EV bridge) |
| Newgistics/Logistics Management | $19,500,000 baseline (before Cash/Debt/NWC) | Strategic | Completion accounts (Cash/Debt/NWC) |
| National Financial Services/Fiserv | $348,937,500 + up to $15,000,000 contingent payment (max $363,937,500), plus/minus Net Capital | Strategic / financial institution | Hybrid: Net Capital true-up + contingent payment |
| Durata/Pfizer | $9,750,000 upfront + $25,000,000 milestone (or $20,000,000 buyout option) | Strategic carve-out | Fixed closing payment + milestone mechanics (no completion accounts) |
| Deutsche Telekom/AT&T (T‑Mobile USA) | ~$39,000,000,000 base ( $25B cash + $14B stock value, adjusted) | Strategic | Deal-specific completion accounts-style true-up (FCF / specified debt discharge / divestiture) |
| Aerojet Rocketdyne/L3Harris (Merger) | ~$4,678,000,000 implied equity value (common only; excludes ticking fee) | Strategic | Fixed per-share cash + ticking fee (public merger) |
| iRobot/Amazon (Merger) | ~$1,660,000,000 implied equity value snapshot (common only) | Strategic | Fixed per-share cash (public merger) |
| Bluerock Residential/Badger (Merger) | ~$641,200,000 implied equity value (common only; excludes preferred redemption + Spinco value) | Sponsor-style | Fixed per-share cash (public merger) |
| CyrusOne/Cavalry (Merger) | Not stated (per-share $90.50) | Sponsor-style | Fixed per-share cash (public merger) |
| MoneyGram/Mobius (Merger) | Not stated (per-share price; aggregate not stated) | Sponsor-style | Fixed per-share cash (public merger) |

## Escrow Prevalence & Sizing

| Deal | Has Escrow? | Indemnity Escrow % | PPA Escrow % | Period |
|------|-------------|-------------------|--------------|--------|
| HealthEquity/Luum | Yes | 0.50% (General indemnity escrow: $250k on $50M base) | 1.00% (PPA/adjustment escrow: $500k on $50M base) | 18 months |
| TreeHouse (Meal Prep) | No | 0% | 0% | N/A (functional holdback via Seller Note true-up setoff) |
| Newgistics/Logistics Management | Yes | ~10% ($1.95M on $19.5M baseline) | 0% (no separate PPA escrow identified) | ~14 months (to May 8, 2008) |
| National Financial Services/Fiserv | No | 0% | 0% | N/A |
| Durata/Pfizer | No | 0% | 0% | N/A |
| Deutsche Telekom/AT&T (T‑Mobile USA) | No | 0% | 0% | N/A |

**Observations (true SPAs only):**
- 2 of 6 true SPAs include an escrow.
- Median indemnity escrow (among deals with an indemnity escrow): 5.25%.
- Median escrow period (among deals with an escrow): ~16 months.

## True-Up Timelines

| Deal | Buyer Prep | Seller Review | Dispute Period | IA Resolution |
|------|-----------|---------------|----------------|---------------|
| HealthEquity/Luum | 90 days post-close | 30 days | 30 days | 60 days |
| TreeHouse (Meal Prep) | 120 days post-close | 60 days | 60 days (end of review window) | 30 days |
| Newgistics/Logistics Management | 60 days post-close | 60 days | 60 days | Not fixed (“as soon as practicable”) |
| National Financial Services/Fiserv | 75 days post-close | 30 days | 30 days | 30 days |
| Deutsche Telekom/AT&T (T‑Mobile USA) | ≤90 days post-close | ≤30 days | ≤30 days | ~30 days |
| Durata/Pfizer | N/A | N/A | N/A | N/A |

**Observations (true SPAs with a true-up):**
- Median buyer prep time: 90 days.
- Median seller review: 30 days.
- Median dispute window: 30 days.

## R&W Insurance

| Deal | Has RWI? | Premium Split | Retention |
|------|----------|---------------|-----------|
| HealthEquity/Luum | Yes | 50/50 Purchaser/Sellers (via Transaction Expenses) | Not stated in provided PDF (policy exhibit missing) |
| TreeHouse (Meal Prep) | Yes | Buyer bears all costs | Not stated in SPA text |
| Newgistics/Logistics Management | No / not mentioned | N/A | N/A |
| National Financial Services/Fiserv | No / not mentioned | N/A | N/A |
| Durata/Pfizer | No / not mentioned | N/A | N/A |
| Deutsche Telekom/AT&T (T‑Mobile USA) | No / not mentioned | N/A | N/A |

## Earnout / Contingent Consideration Prevalence

| Deal | Has Earnout? | Metric | Period | Cap |
|------|-------------|--------|--------|-----|
| HealthEquity/Luum | Yes | Qualified Revenue | Jan 1, 2021–Jan 31, 2023 (split into Initial/Subsequent periods) | $20,000,000 |
| National Financial Services/Fiserv | Yes (earnout-like) | Revenue retention / “Qualifying Revenue” mechanics | “Year One” (per agreement definitions) | $15,000,000 |
| Durata/Pfizer | Yes (milestone) | Regulatory/clinical milestone | Milestone-based (timing depends on milestone) | $25,000,000 (or $20,000,000 buyout option) |
| TreeHouse (Meal Prep) | No | N/A | N/A | N/A |
| Newgistics/Logistics Management | No | N/A | N/A | N/A |
| Deutsche Telekom/AT&T (T‑Mobile USA) | No | N/A | N/A | N/A |

## Consideration Type

| Deal | Cash | Stock | Seller Note | Earnout |
|------|------|-------|-------------|---------|
| HealthEquity/Luum | Yes | No | No | Yes |
| TreeHouse (Meal Prep) | Yes | No | Yes | No |
| Newgistics/Logistics Management | Yes | No | No | No |
| National Financial Services/Fiserv | Yes | No | No | Yes (contingent payment) |
| Durata/Pfizer | Yes | No | Yes (promissory note option for milestone) | Yes (milestone) |
| Deutsche Telekom/AT&T (T‑Mobile USA) | Yes | Yes | No | No |
| Aerojet Rocketdyne/L3Harris (Merger) | Yes | No | No | No |
| iRobot/Amazon (Merger) | Yes | No | No | No |
| Bluerock Residential/Badger (Merger) | Yes | No | No | No |
| CyrusOne/Cavalry (Merger) | Yes | No | No | No |
| MoneyGram/Mobius (Merger) | Yes | No | No | No |

