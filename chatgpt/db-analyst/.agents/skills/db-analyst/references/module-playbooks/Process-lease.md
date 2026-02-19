# Playbook: Process-lease

## Required Inputs

- Lease source file (PDF preferred; CSV extract accepted).
- Optional entity/location lookup table.

## Target Sheet/Block

- `Data | Leases Extract` source extraction block.
- `Leases` normalized output block.

## Table Schema

- `lease_id`
- `entity`
- `start_date`
- `end_date`
- `payment`
- `currency`
- `notes`
- `source`

## Calculations

- Normalize extracted rows into canonical lease schema.
- Compute simple flags (missing dates/payment).

## Tie-Outs

- Row count tie-out between extraction and normalized output.
- Missing critical fields are surfaced as exceptions.

## Inline Note Patterns

- `Missing support:` critical lease fields unavailable.
- `Extraction review:` low-confidence parse from PDF source.
