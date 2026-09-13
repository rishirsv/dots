---
name: use-prosper
description: "Reads, explains, reviews, and updates the user's Prosper Finance ledger through its connector. Use for spending, transactions, balances, categories, transfers, investments, trips, imports, or category reviews in Prosper; not for generic financial advice or another finance system."
---

# Use Prosper

Answer the user's finance question through the configured Prosper Finance
connector. Treat the connector's current tool schemas and returned data as the
authority for this dataset. Do not invent tools, balances, transaction history,
coverage, or calculations that the connector does not provide.

## Choose the read

Start from the question and preserve any established date, account, category,
or trip scope. Resolve relative dates to exact dates.

- Use `summarize_cash_flow` for canonical totals, comparisons, category totals,
  and trends. Do not rebuild aggregates from transaction pages.
- Use `search_transactions` for transaction-level evidence and exact mutation
  targets. Retain the same filters when following a cursor.
- Use `get_financial_position` for recorded as-of balances. Report missing or
  stale snapshots rather than inferring them.
- Use `list_accounts`, `list_categories`, or `list_category_rules` only when
  their IDs, exclusions, lifecycle state, or saved rules are needed.

Use `show_finance_view` when the user wants to browse, click through, compare,
or review in an interactive interface. Ordinary reads are better for analysis,
lookups, and verification because they do not render UI. Prefer one useful
view after the analysis rather than emitting a table for every call. The review
view may resume or list reviews; open a new review with
`open_category_review`, then show it using its returned ID.

Keep `headline`, `excluded`, and `allMovement` distinct. Spending reports use
included categories. For transaction evidence behind spending, call
`search_transactions` with `cashFlowTreatment: "included"` and a negative
amount range. Use `cashFlowTreatment: "excluded"` for transfers and other
excluded activity. Omit that filter only when the user asks for all movement.
Never count a transfer as spending merely because it is a transaction.

Carry forward material warnings, exclusions, pagination gaps, missing balances,
and partial-period limits once, where they affect the answer. An empty result
means the connector returned no records for that scope; it does not prove the
source data is complete. Remove labels and warnings that only repeat visible
context or do not change the user's decision.

## Categorize with evidence

Read the exact transaction before proposing a category or merchant change.
Use historical matches as evidence when the user requests that basis, while
keeping the current description, merchant, amount, account, date, and category
visible enough to verify the choice. A prior category can support a one-off
decision; it does not authorize saving a reusable rule.

For travel, establish the trip's destination and actual start and end from
available itinerary, flight, calendar, or email evidence. Dates alone do not
make every purchase in that interval a trip expense. Classify a transaction as
trip-related only when its merchant, location, description, transport timing,
or other evidence connects it to the trip. Keep recurring rent, memberships,
home deliveries, and other home expenses in their normal categories. Follow
the user's stated treatment for work trips and reimbursements.

Respect the dataset's configured category exclusions. Transfers between the
user's accounts and investment contributions are normally excluded from
spending. Resolve a brokerage transaction's direction and destination from
available statements, email, or account activity before changing its merchant
label to an investment account such as RRSP, TFSA, or FHSA. Never infer the
destination from the bank account alone.

## Review, approve, and apply

Use the durable category-review tools for bulk corrections or import review:

1. Open or resume a review and save draft decisions against its current
   revision. Draft choices do not alter the ledger or create rules.
2. Prepare the review to freeze the exact choices and impact. Present the plan,
   unresolved issues, exclusions, and import/skip decisions clearly.
3. Apply only after the user gives plain-text approval for that exact prepared
   plan. A changed or stale plan must be prepared and approved again.
4. Read back the changed records and report verified results.

For a single durable edit, show the exact transaction, current value, proposed
value, and effect before approval. Use the operation named by the schema:
`set_transaction_category` for a category, `set_transaction_merchant` for a
user-defined label, and `restore_transaction_details` only for exact original
source text. Keep a stable idempotency key for the intended write and reuse the
same key and arguments after an uncertain response.

Save a reusable category rule only after separate approval of its complete
condition, direction, destination category, optional account or source scope,
and enabled state. Rules do not retroactively recategorize history.

For imports, preserve source merchant and description text, stage the reviewed
rows, present the exact batch and warnings, obtain approval, apply that same
batch, and verify it. Do not normalize provider exports inside Prosper or use
an import to work around a blocked restoration.

Finish with the supported answer, the verified changes if any, and only the
limitations that affect interpretation. Do not hardcode personal merchants,
destinations, accounts, category choices, or dates from an earlier session.
