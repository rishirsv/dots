"""Statistical helpers for evaluation reporting and judge calibration."""

from math import comb, sqrt
from statistics import NormalDist


def wilson_interval(successes, total, confidence=0.95):
    """Return a Wilson score interval for a binomial proportion."""
    successes = int(successes)
    total = int(total)
    if total <= 0:
        return None
    z = NormalDist().inv_cdf(0.5 + float(confidence) / 2)
    rate = successes / total
    z2 = z * z
    denominator = 1 + z2 / total
    center = (rate + z2 / (2 * total)) / denominator
    margin = z * sqrt((rate * (1 - rate) + z2 / (4 * total)) / total) / denominator
    return max(0.0, center - margin), min(1.0, center + margin)


def exact_mcnemar_pvalue(improved, regressed):
    """Return the two-sided exact McNemar p-value for discordant pairs."""
    improved = int(improved)
    regressed = int(regressed)
    discordant = improved + regressed
    if discordant == 0:
        return 1.0
    tail = min(improved, regressed)
    probability = sum(comb(discordant, index) for index in range(tail + 1)) / (2 ** discordant)
    return min(1.0, 2 * probability)


def calibration_metrics(calibration):
    """Derive held-out judge metrics and confidence bounds from a confusion matrix."""
    test = calibration["test"]
    true_positive = int(test["true_positive"])
    false_negative = int(test["false_negative"])
    true_negative = int(test["true_negative"])
    false_positive = int(test["false_positive"])
    confidence = float(calibration.get("confidence_level", 0.95))
    fail_count = true_positive + false_negative
    pass_count = true_negative + false_positive
    predicted_fail = true_positive + false_positive
    tpr = true_positive / fail_count if fail_count else None
    tnr = true_negative / pass_count if pass_count else None
    precision = true_positive / predicted_fail if predicted_fail else None
    return {
        "true_positive": true_positive,
        "false_negative": false_negative,
        "true_negative": true_negative,
        "false_positive": false_positive,
        "fail_count": fail_count,
        "pass_count": pass_count,
        "prevalence": fail_count / (fail_count + pass_count) if fail_count + pass_count else None,
        "tpr": tpr,
        "tnr": tnr,
        "precision": precision,
        "tpr_interval": wilson_interval(true_positive, fail_count, confidence),
        "tnr_interval": wilson_interval(true_negative, pass_count, confidence),
        "confidence_level": confidence,
    }
