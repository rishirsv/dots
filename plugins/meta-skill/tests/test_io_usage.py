"""normalize_usage flattens the SDK token payload for downstream rollups."""

import unittest

from meta_skill.io import normalize_usage


class NormalizeUsageTests(unittest.TestCase):
    def test_flattens_total_section_to_snake_case(self):
        payload = {
            "last": {"inputTokens": 21079, "outputTokens": 103, "totalTokens": 21182},
            "modelContextWindow": 258400,
            "total": {
                "cachedInputTokens": 60928,
                "inputTokens": 80403,
                "outputTokens": 1164,
                "reasoningOutputTokens": 111,
                "totalTokens": 81567,
            },
        }
        self.assertEqual(
            normalize_usage(payload),
            {
                "input_tokens": 80403,
                "cached_input_tokens": 60928,
                "output_tokens": 1164,
                "total_tokens": 81567,
            },
        )

    def test_none_and_shapeless_payloads_return_none(self):
        self.assertIsNone(normalize_usage(None))
        self.assertIsNone(normalize_usage("junk"))
        self.assertIsNone(normalize_usage({"last": {"inputTokens": 1}}))


if __name__ == "__main__":
    unittest.main()
