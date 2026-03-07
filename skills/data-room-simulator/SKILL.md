---
name: data-room-simulator
description: "Generate complete M&A data rooms for fictitious companies with consistent financial data. Use when the user asks to \"create a data room\", \"simulate due diligence\", \"generate M&A documents\", or mentions \"data room\", \"QoE\", \"quality of earnings\"."
---

# Data Room Simulator

Generate realistic, internally consistent M&A data rooms for training, testing, or demonstration purposes.

## When to Use This Skill

- User asks to create/generate a data room or M&A documents
- User wants to simulate due diligence materials
- User mentions QoE (quality of earnings) analysis training
- User needs test data for financial analysis tools

## Workflow

```markdown
Progress:
- [ ] Step 1: Gather requirements (industry, size, realism mode)
- [ ] Step 2: Run one-command generation
- [ ] Step 3: Review manifest and index
- [ ] Step 4: Verify consistency report
- [ ] Step 5: Upgrade lease package quality (if leases are requested)
```

### Step 1: Gather Requirements

Ask for:
- **Industry**: `saas`, `construction`, `manufacturing`, `professional_services`, `retail`, `dental`
- **Size**: `small` ($5-20M), `mid` ($20-100M), `large` ($100-500M)
- **Realism**: `clean` (no issues), `realistic` (QoE adjustments), `messy` (intentional errors)

### Step 2: Generate Company Seed

### Preferred One-Command Flow

```bash
python3 scripts/run_data_room.py \
  --industry <industry> \
  --size <size> \
  --realism-mode <mode> \
  --start-period 2023-01 \
  --end-period 2025-12
```

Outputs are created in `output/runs/<run-id>/`.

Standard artifacts now include:
- `manifest.json` (file-level manifest with metadata and hashes)
- `INDEX.md` (human-readable file index and package overview)
- `verification_report.json` (consistency checks and QoE issues)

### Advanced Manual Flow

```bash
python3 scripts/generate_company.py --industry <industry> --size <size> --realism-mode <mode> --output-dir <output_dir>
```

Creates `output/company_seed.json` with company profile, brand identity, management team, and events timeline.

### Step 3: Generate Financial Data

```bash
python3 scripts/generate_financials.py --output-dir <output_dir> --start-period 2023-01 --end-period 2025-12
```

Creates trial balance, income statement, balance sheet, cash flow, and supporting schedules (AR/AP aging, fixed assets, NWC, event impacts).

### Step 4: Generate Operations Data

```bash
python3 scripts/generate_operations.py --output-dir <output_dir>
```

Creates industry-specific revenue detail:
- **SaaS**: subscriptions, MRR analysis, customer master
- **Construction**: projects, WIP, % completion
- **Manufacturing**: products, inventory, BOM
- **Services**: engagements, timesheets, utilization
- **Retail**: transactions, inventory, product catalog

### Step 5: Generate HR Data

```bash
python3 scripts/generate_hr_data.py --output-dir <output_dir>
```

Creates employee census, payroll register, department summary. Salary totals tie to P&L.

### Step 6: Generate Narrative Documents

Render templates in `templates/` to generate:
- CIM (Confidential Information Memorandum)
- Company overview
- Accounting policies
- EBITDA bridge

```bash
python3 scripts/render_narratives.py --output-dir <output_dir>
```

### Step 7: Verify Consistency

```bash
python3 scripts/verify_data_room.py --output-dir <output_dir>
```

Validates all cross-document ties.
Output: `<output_dir>/verification_report.json`
Also generates: `<output_dir>/manifest.json`, `<output_dir>/INDEX.md`

### Step 8: Generate Realistic Lease Documents (When Requested)

When the user asks for lease documents (especially long-form executed-style leases), do not generate short generic stubs.
Follow the lease quality guide and generate lease packets with realistic legal structure and exhibits.

1) Read lease drafting rules:
- `reference/lease-authoring-guidance.md`

2) Generate leases:

```bash
python3 scripts/generate_realistic_leases.py \
  --output-dir <output_dir> \
  --company-name "<tenant-name>"
```

3) Validate:
- Confirm exactly 3 PDF lease files in `<output_dir>/lease_documents/` (or count requested by user).
- Confirm each PDF is ~10 pages (or user-specified length).
- Confirm each includes:
  - Base rent terms
  - Step-up schedule
  - Additional rent / net lease language
  - Default and remedies
  - Assignment/subletting
  - Notices and estoppel
  - Addenda / exhibits

## Key Consistency Rules

- Trial balance balances (debits = credits)
- Balance sheet equation (A = L + E)
- Operations revenue = P&L revenue (exact match)
- Payroll totals = P&L salary expense
- AR/AP aging = balance sheet amounts
- Industry-specific rules (MRR × 12 = ARR, WIP ties, etc.)

## Supporting Files

- `profiles/` — Industry configurations (accounts, documents, rules)
- `scripts/` — Python generators and validators
- `templates/` — Narrative document templates
- `reference/` — Industry metrics, checklists, guides

## Requirements

```bash
pip install pandas openpyxl faker numpy reportlab jinja2
```
