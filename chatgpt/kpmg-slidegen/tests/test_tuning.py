import unittest

from extractor.tuning import RoundMetrics, TuningThresholds, evaluate_thresholds


class TestTuningThresholds(unittest.TestCase):
    def test_thresholds_pass_when_all_metrics_within_bounds(self):
        thresholds = TuningThresholds()
        metrics = RoundMetrics(
            chrome_ssim=0.99,
            content_ssim=0.97,
            mean_slot_drift_in=0.02,
            max_slot_drift_in=0.05,
            severe_overlaps=0,
            out_of_bounds=0,
        )
        passed, failures = evaluate_thresholds(metrics, thresholds)
        self.assertTrue(passed)
        self.assertEqual(failures, [])

    def test_thresholds_fail_for_multiple_violations(self):
        thresholds = TuningThresholds()
        metrics = RoundMetrics(
            chrome_ssim=0.90,
            content_ssim=0.80,
            mean_slot_drift_in=0.20,
            max_slot_drift_in=0.50,
            severe_overlaps=2,
            out_of_bounds=1,
        )
        passed, failures = evaluate_thresholds(metrics, thresholds)
        self.assertFalse(passed)
        self.assertGreaterEqual(len(failures), 6)


if __name__ == "__main__":
    unittest.main()
