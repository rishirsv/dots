# Voice comparison: v1 and v2

V1 is frozen in `../../versions/v1/`. Its five long-form drafts and editorial scores come from `../voice-trial-2026-09-25/` unchanged. The five new v2 long-form drafts use the same core assignments recorded in `prompts.json` and `../../versions/v2/`.

The short-form prompts are new. For each subject, one Luna agent wrote a v1 post before reading the v2 guide, then wrote a v2 post for the same prompt. The order reduces direct v2 influence on the v1 post, but the comparison is not blind or statistically independent. The long-form comparison is also small, subjective, and influenced by the model and prompt, so scores are editorial evidence for discussion rather than proof of a personal voice.

The v2 guide draws techniques from 12 Dan Shipper essays listed in `../../examples/dan-shipper-reading-list.md`. The repository saves links and notes rather than full copies of those third-party articles. The user's source passage remains the primary voice evidence.

The self-contained `viewer.html` shows all prompt text, paired drafts, scores, source links, and a feedback form. Feedback stays in browser storage unless downloaded or copied by the writer. `analysis.json` holds the editorial judgments; `build_viewer.py` rebuilds the page from the source files.
