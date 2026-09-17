# Errors And Recovery

On a lost response call `get_operation` with the original operation ID or workspace/key. `RESULT_EXPIRED` retains a known outcome and never authorizes replay. `OUTCOME_UNKNOWN` requires inspection and an explicit continuation.
