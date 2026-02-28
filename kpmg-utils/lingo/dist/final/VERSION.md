# Lingo Bundle Versions

Production-frozen bundles for Lingo GPT.

## v1 - lingo_bundle_v1.py
- **Frozen**: 2024-12-02
- **Source modules**: formatting.py, rearrange.py, glossary_generator.py
- **Pagination**: Fixed capacity (row count based)
- **Notes**: Original implementation before dynamic pagination

## v2 - lingo_bundle_v2.py
- **Frozen**: 2024-12-02
- **Source modules**: formatting.py, rearrange.py, pagination.py, glossary_generator.py
- **Pagination**: Dynamic (character-based estimation)
- **Notes**: Adds smart pagination for varying definition lengths
- **Key changes**:
  - Uses `paginate_glossary_items()` for content-aware pagination
  - Estimates row usage based on definition character length
  - Limits to 17 rows per column (not 18) for safety margin
  - Short terms (1 row) allow ~34 items per slide
  - Long definitions (4+ rows) automatically create more slides
  - Supports both dict and tuple/list input formats
  - Explicit empty input handling: 0 items -> 1 empty slide
  - Centralized calibration values in `GLOSSARY_PAGINATION_DEFAULTS`

## v3 - lingo_bundle_v3.py
- **Frozen**: 2025-01-XX (today)
- **Source modules**: formatting.py, rearrange.py, pagination.py, glossary_generator.py
- **Pagination**: Height-based adaptive row heights (V3)
- **Notes**: Complete rewrite with adaptive row heights - eliminates all text clipping
- **Key changes**:
  - **Height-based pagination**: Pack items by pixel height budget (~400pt per column), not row count
  - **Dynamic row heights**: Set `table.rows[idx].height = Pt(height_pt)` during generation
  - **Column-aware packing**: Fill left column to capacity, then right column
  - **Zero clipping**: All definitions fully visible, no text overflow
  - **Regression tested**: All tests pass - no regressions on small/medium glossaries
  - **Large glossary improvement**: 108-term glossary: V1 had 76 clipped terms in 4 slides, V3 has 0 clipped in 6 slides
- **Test results**:
  - ✅ Small glossaries (2-10 terms): Same as V1 (no regression)
  - ✅ Medium glossaries (30 terms): Same as V1 (no regression)
  - ✅ Large glossaries (108 terms): 76 fewer clipped terms (uses 2 more slides)
  - ✅ All test cases: Zero text clipping detected
