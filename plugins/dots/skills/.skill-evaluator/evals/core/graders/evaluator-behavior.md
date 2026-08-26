# Evaluator behavior grader

Read the realistic request, worker response, target evaluator runtime, and only
the case criteria supplied by the coordinator. Do not infer the expected answer
from case names or compare prose mechanically.

For each criterion return Pass, Fail, or Inconclusive with direct evidence from
the response or produced artifacts. Accept materially equivalent wording and
organization. Fail only when the observable behavior crosses the criterion's
boundary. Mark missing worker output, unavailable files, or execution-system
failure Inconclusive rather than as a target-skill failure.

Keep criteria separate. A strong response on one criterion cannot compensate
for a failed approval, isolation, attribution, or ownership boundary.
