# Rationale template

Use this one-page structure for the design package. Replace the italic notes
with the actual design.

## Problem

*What are we trying to do, and what makes the shape non-obvious? Include the
existing types, callers, invariants, or constraints the design must honor.*

## Usage (caller's view)

*Write this before the type sketch. Show the README or quickstart the consumer
would read and two or three realistic call sites: what they import, what they
call, and what comes back. Derive the shape from this usage. When they diverge,
reconcile the sketch to the usage.*

## Shape

*Describe the recommended architecture. Put data structures first, then show
how data moves through the signatures. Name the load-bearing decisions,
invariants encoded in types, validation boundaries, responsible modules, and
what the system deliberately does not do. State what complexity the public
surface hides and what remains exposed to callers.*

## Synthesis decision

*Record which candidate became the base and why, what was adapted from the
others, and what was rejected.*

## Tradeoffs accepted

*Use one bullet per tradeoff: “We accept X in exchange for Y.” Name anything a
future reader might otherwise mistake for an oversight.*

## Alternatives considered

*Name at least one concrete alternative shape and why it lost. Judge alternatives
on interface depth, not implementation simplicity alone. Do not list several
flavors of the same shape.*

## Open questions and risks

*Include only questions or risks that could change the design or implementation.
Name what would resolve each one.*

## Next implementation step

*State the first thing to build against the sketch in one sentence.*
