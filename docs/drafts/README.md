# Drafts research

Drafts is a proposed stateful writing plugin that adapts to a user's voice
across reports, email, Teams, iMessage, and other contexts. It keeps explicit
writing rules separate from descriptive stylometry, preserves long-running
document state, and learns conservatively from user-authorized evidence.

This directory contains research and a proposed implementation shape. Drafts is
not implemented yet.

## Research set

- [Every writing-workflow research](research/every-articles.md) captures
  source-linked paraphrases of three Every articles and derives the workflow
  implications for Drafts.
- [Dots repository findings](research/repository-findings.md) records the local
  state, writing, channel, and packaging precedents examined for the proposal.
- [State architecture and ubiquitous language](research/state-architecture-and-language.md)
  defines the four state planes, shared vocabulary, rule and stylometry shapes,
  learning lifecycle, architecture options, and confirmed decisions.
- [Implementation-plan visualization](research/implementation-plan.html) maps
  the research into a proposed plugin tree, file contracts, runtime state, build
  sequence, and proof boundaries.

Start with the state architecture for the durable product model. Use the Every
notes for workflow provenance and the implementation plan for the proposed
package shape.
