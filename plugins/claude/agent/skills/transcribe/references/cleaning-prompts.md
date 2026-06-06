# Cleaning Policy

## Goal

Create a readable clean-verbatim transcript without changing meaning. The clean transcript is not a summary, meeting note, rewrite, or response to the content.

The workflow has one clean path:

1. The script writes `transcript-clean.md` with deterministic cleanup.
2. Codex must then run the model clean-verbatim pass below and overwrite `transcript-clean.md`.

Do not skip the model pass.

## Deterministic Pre-Clean

The bundled CLI removes obvious mechanical artifacts before the model pass:

- Standalone fillers such as `um`, `uh`, `ah`, `er`, `hmm`.
- Obvious filler phrases such as `you know`, `I mean`, `sort of`, and `kind of`.
- Duplicate adjacent words such as `I I think`.
- Simple stutters such as `w-we`.
- Empty standalone acknowledgements such as `yeah`, `right`, and `mm-hmm`.
- Duplicate adjacent sentence text.
- Spacing and punctuation artifacts.

## Model Clean-Verbatim Pass

Use this instruction when rewriting `transcript-clean.md` after the deterministic pre-clean:

```text
Create a clean-verbatim transcript from the transcript below.

Use the raw transcript as the source of truth when the pre-cleaned transcript looks over-trimmed or uncertain.

Remove filler words, stutters, false starts, repeated words, duplicate adjacent sentences, and non-meaningful acknowledgements.

Preserve timestamps, meaning, uncertainty, speaker intent, sequence, names, numbers, technical terms, and commitments.

Do not summarize, paraphrase, reorder, answer the transcript, add content, remove substantive details, or turn the transcript into notes.

Return the cleaned transcript in the same Markdown timestamp structure.
```

## Preserve

- Timestamps and ordering.
- Meaning, uncertainty, sequence, and speaker intent.
- Names, numbers, terms of art, commitments, and quoted wording.
- Hesitation when it changes confidence or tone.
