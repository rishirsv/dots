# Financial Modelling

Read this when creating or revising a skill that builds, updates, audits, or
explains a financial model. Use it to add the controls the recurring job needs;
it is not a workbook template and does not require every model to use the same
tabs, schedules, methods, or outputs.

## Define the model's job and operating path

State what the skill owns: for example, an operating forecast, budget,
three-statement model, DCF, comparable-company valuation, transaction model,
LBO, merger analysis, scenario pack, or workbook tie-out. Name adjacent jobs it
does not own when their boundary would otherwise be unclear. A scenario skill,
for example, should alter an existing baseline rather than silently rebuild it;
an audit skill should diagnose a workbook rather than overwrite it.

Choose the artifact from the job and the supplied inputs. A formula workbook is
normally the source of truth when the user needs to change drivers, trace
calculations, or retain a reusable model. A controlled values export can suit a
fixed analysis. A concise narrative or HTML companion can explain results, but
should point back to exact workbook cells or ranges when it reports model
outputs. Do not make raw plans, run logs, ledgers, or intermediate JSON the
default human-facing artifact unless the request calls for them.

Make the workflow branch on the condition of the input model:

- If a usable model exists, preserve formulas and raw inputs outside the
  requested change scope. Make authorized updates in a copy unless the user
  explicitly requests in-place editing.
- If the skill receives partial data, construct only the schedules justified by
  the data and identify what the missing inputs prevent it from calculating.
- If the baseline contains known formula errors, unstable links, or undefined
  drivers, stop before presenting scenario outputs as a baseline. Route to a
  repair or audit path, or label a diagnostic overlay as such.
- If a deterministic transform is repeated, provide and test a script with a
  declared input contract, output locations, and a useful failure message.

## Make the model traceable

Tell authors to separate, either by tabs, clearly marked blocks, or structured
data layers:

- source facts and historical actuals;
- user inputs and explicit assumptions;
- calculations and supporting schedules;
- checks; and
- summary outputs.

Keep one source of truth for each editable driver and each scenario selection.
Do not duplicate a growth rate, discount rate, debt term, tax rate, or share
count across formulas just to make a sheet look self-contained. Preserve the
distinction among actual, budget, forecast, and scenario values; retain fiscal
period, currency, units, entity, account, and sign labels whenever they affect
the calculation.

Require a source or assumption record for inputs that drive reported outputs.
The record should make the value, unit, currency, as-of date or forecast
period, source location or assumption label, and workbook cell/range available
without forcing a reader to infer them. When an output is derived in the
workbook and later used in another artifact, retain its workbook location and
the upstream inputs needed to reproduce it.

Define sign conventions once and carry them through the model. For example,
state how the model represents operating cash flow, capex, debt balances,
repayments, and enterprise-value bridge deductions. Do not rely on visual
formatting alone to distinguish a negative outflow from a positive balance.

## Select only the needed structure and formulas

Have the skill choose schedules from the model type rather than generate a
large universal workbook. An operating or three-statement model may need linked
revenue, expense, working-capital, fixed-asset, debt, tax, income-statement,
balance-sheet, and cash-flow schedules. A DCF needs a cash-flow definition,
forecast horizon, discount-rate build, terminal-value method, enterprise-to-
equity bridge, and per-share calculation where relevant. A transaction model
may additionally need sources and uses, financing, ownership, purchase
accounting, accretion/dilution, or sponsor-return schedules.

Specify formula relationships that must remain linked, not merely the labels of
tabs. Examples include:

- ending cash on the cash-flow statement ties to balance-sheet cash;
- beginning debt plus draws less repayments equals ending debt;
- depreciation and working-capital movements connect to their supporting
  schedules;
- enterprise value bridges to equity value using the applicable debt-like and
  non-operating items; and
- per-share value uses the stated diluted-share basis.

For circular calculations such as interest and cash sweeps, require the skill
to document the intended circularity or iterative setting, identify the linked
cells, and expose a non-circular diagnostic where practical. Do not use opaque
plugs to force a balance sheet to balance.

## Assumptions, cases, and scenarios

Instruct the skill to expose the operating drivers behind a forecast, such as
volume, price, mix, headcount, utilization, margin, working-capital days,
capex, tax, financing, or exit assumptions. Link each driver to the periods and
formula outputs it changes. A model may use top-down assumptions when detail is
unavailable, but it should label those assumptions rather than imply they are
reported facts.

Use scenario analysis only when it answers a concrete model question. Change a
small set of meaningful drivers, retain the base case, and show absolute
outputs alongside deltas. For each changed driver, retain the baseline value,
case value, timing, type of change, reason, source or assumption label, and
the outputs affected. Keep formula changes out of scenario cases. Do not mix
market, source, and model dates without surfacing the mismatch.

Ask the skill to identify useful breakpoints when the model supports them: the
price, volume, margin, leverage, liquidity, interest-rate, covenant, dilution,
or return level at which the result changes. A driver table must link to
the same output used by the base case and must alter the intended input cells;
never substitute pasted results for an active calculation.

## Build visible controls and inspection steps

Choose controls that match the schedules present. Common controls include:

- balance sheet: assets equal liabilities plus equity in every period;
- cash flow: net income, non-cash charges, working capital, and ending cash tie
  to their originating schedules and statements;
- debt: roll-forward, interest rate, amortization, fees, revolver, and maturity
  calculations tie to the debt schedule;
- valuation: enterprise-to-equity bridge, diluted shares, discounting, and
  driver-table base cell reconcile; and
- transaction returns: equity invested, cash-flow timing, IRR, and MOIC link to
  the stated transaction assumptions.

Require a formula scan appropriate to the artifact: formulas that break a copy
pattern, unexplained hardcodes, wrong-period references, spreadsheet errors,
hidden sheets feeding outputs, undocumented external links, volatile functions,
and circular references. A static scan is useful but does not replace opening
the workbook, recalculating when the available spreadsheet engine can do so,
and tracing key precedents and dependents.

For a workbook-producing skill, require a visual inspection of the entry sheet
plus the assumptions/drivers, scenarios, core schedules, sources, and checks
that exist in that artifact. Verify that headings, periods, units, formula
results, and error flags are readable. For a net-new workbook without a
controlling template or navigation convention, put the main outputs, important
drivers, and unresolved inputs on the first visible sheet. For an existing
workbook, preserve its entry structure and make those items discoverable through
its existing navigation.

Keep calculation status separate from input coverage. A workbook can balance
and contain no formula errors while still relying on placeholders, stale data,
unsupported assumptions, or incomplete financing terms. State both facts
plainly instead of compressing them into a single pass/fail label.

## Failure behavior and evaluator handoff

Describe what the skill does when a calculation cannot be supported. It should
not invent a missing historical value, debt term, share count, currency
conversion, terminal assumption, or source date. Preserve the missing field,
label the affected output, and say which calculation or scenario is unavailable
until the input is supplied. Stop a deterministic build when its schema,
formula controls, or required reconciliation fails; return the failed check and
the location to fix rather than a workbook that appears complete.

When behavioral evidence is needed, give `skill-evaluator` a small valid model,
a missing-required-input case, a broken reconciliation, a wrong formula
reference, a scenario that must change a known output, and a workbook with an
external link, spreadsheet error, or intentional circularity. Specify the
expected formulas, controls, outputs, and failure behavior. Keep deterministic
script tests with the script source. When native recalculation is unavailable,
require the evaluator to inspect formulas and cached results separately and
record the limitation.

Keep the runtime compact: put shared modelling methods, schedule-specific
checks, and sector variations in read-when references; put repeatable workbook
inspection or generation in scripts; keep only the recurring decision path in
`SKILL.md`.
