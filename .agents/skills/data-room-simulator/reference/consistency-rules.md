# Data Consistency Rules

These are the checks currently enforced by `scripts/verify_data_room.py`.

## Universal Rules

| Rule ID | Rule | Tolerance |
|---|---|---|
| U-001 | Trial balance file exists | Required |
| U-002 | Trial balance balances (sum of account columns = 0 by period) | $1 max imbalance |
| U-003 | Balance sheet equation: Assets = Liabilities + Equity | $1 |
| U-004 | Revenue consistency: Income Statement revenue = Trial Balance revenue by year | 0.1% |
| U-005 | AR aging total ties to balance sheet AR | 1% |
| U-006 | AP aging total ties to balance sheet AP | 1% |
| U-007 | Headcount ties to company seed | +/- 3 employees |
| U-008 | Cash flow ending cash ties to balance sheet cash | $1 |
| U-009 | Net income ties to change in retained earnings | $1 |
| U-010 | Payroll totals tie to payroll-linked financial accounts | 5% |
| U-011 | Rendered narratives contain no unresolved template tokens | Required |

## Industry-Specific Rules

### SaaS

| Rule ID | Rule | Tolerance |
|---|---|---|
| S-001 | MRR ties to monthly P&L revenue (sampled periods) | 0.1% |
| S-002 | ARR = MRR × 12 | $1 |

### Construction

| Rule ID | Rule | Tolerance |
|---|---|---|
| C-001 | WIP revenue recognized ties to P&L revenue | 0.1% |

### Manufacturing

| Rule ID | Rule | Tolerance |
|---|---|---|
| M-001 | Invoice totals tie to P&L revenue | 0.1% |

### Professional Services

| Rule ID | Rule | Tolerance |
|---|---|---|
| P-001 | WIP billed revenue ties to P&L revenue | 0.1% |

### Retail

| Rule ID | Rule | Tolerance |
|---|---|---|
| R-001 | Sales transaction totals tie to P&L revenue | 0.1% |

### Dental

| Rule ID | Rule | Tolerance |
|---|---|---|
| D-001 | Total collections tie to P&L revenue | 0.1% |
| D-002 | Average hygiene production/hour is in profile range | Profile min/max |
| D-003 | Average schedule utilization is in profile range | Profile min/max |
| D-004 | Insurance AR aging total ties to balance sheet AR | 0.1% |

## QoE / Issues Output

- `clean` mode: no QoE issues are expected.
- `realistic` and `messy` modes: issues are generated from events and profile adjustment libraries.
- Report fields:
- `qoe_issues`: canonical issues list
- `issues`: alias for compatibility with downstream consumers

## Strict Mode

When `--strict` is passed to `verify_data_room.py`, `messy` mode runs are marked `fail` when QoE issues are present.
