"""Statistical contract tests for evaluation reports and judge calibration."""

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.eval_stats import calibration_metrics, exact_mcnemar_pvalue, wilson_interval


class EvalStatsTests(unittest.TestCase):
    def test_wilson_interval_keeps_small_samples_visibly_uncertain(self):
        low, high = wilson_interval(1, 1)
        self.assertGreater(low, 0)
        self.assertLess(low, 0.25)
        self.assertEqual(high, 1)
        self.assertIsNone(wilson_interval(0, 0))

    def test_exact_mcnemar_uses_discordant_pairs(self):
        self.assertAlmostEqual(exact_mcnemar_pvalue(10, 0), 0.001953125)
        self.assertEqual(exact_mcnemar_pvalue(0, 0), 1)
        self.assertEqual(exact_mcnemar_pvalue(3, 3), 1)

    def test_calibration_metrics_report_class_balance_and_uncertainty(self):
        metrics = calibration_metrics({
            "confidence_level": 0.95,
            "test": {
                "true_positive": 90,
                "false_negative": 10,
                "true_negative": 95,
                "false_positive": 5,
            },
        })
        self.assertEqual(metrics["fail_count"], 100)
        self.assertEqual(metrics["pass_count"], 100)
        self.assertEqual(metrics["prevalence"], 0.5)
        self.assertEqual(metrics["tpr"], 0.9)
        self.assertEqual(metrics["tnr"], 0.95)
        self.assertLess(metrics["tpr_interval"][0], metrics["tpr"])


if __name__ == "__main__":
    unittest.main()
