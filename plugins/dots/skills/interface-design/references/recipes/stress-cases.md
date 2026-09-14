# Scenario axes

Use the selected axes only when the component can encounter their cases. Add project-specific extremes; keep the set bounded by real data and supported layouts.

## Content length

**Cue: the component renders variable text.** User input, CMS content, API data, translations. A fixed, untranslated label fails the cue.

| Scenario | What it catches |
| --- | --- |
| Empty string | Collapsed boxes, floating labels with nothing to float over, placeholder-only inputs |
| One word | Buttons and badges sized to their longest expected content |
| Typical content | The baseline the others are judged against |
| Several sentences | Wrapping, line-height at multiple lines, containers that assumed one line |
| One unbreakable string | A long URL or `Donaudampfschiffahrtsgesellschaft`: overflow with no wrap opportunity |

## Content shape

**Cue: the text can come from users or locales the team does not write in.** Same sources as content length, minus content the codebase fully controls.

| Scenario | What it catches |
| --- | --- |
| Emoji, alone and mixed into text | Line-height jumps, broken vertical centering, truncation splitting a character |
| RTL text | Direction handling, punctuation landing on the wrong side |
| Mixed-direction text | An LTR product name inside an RTL sentence, and the reverse |
| Diacritics and tall scripts | Clipped ascenders and descenders in tight line boxes |
| Numbers where columns align | Proportional figures wobbling in tables and timers |

## Quantity

**Cue: the component repeats over items.** Lists, tables, grids, tag rows, avatar stacks. A singular component fails the cue.

| Scenario | What it catches |
| --- | --- |
| Zero items | Blank regions, missing empty states |
| One item | Grids and layouts designed around plural content |
| The realistic count | The baseline |
| Ten times the realistic count | Missing scroll or pagination, performance collapse, sticky elements unsticking |

## Container

**Cue: the component’s available space varies.** Use its smallest and largest supported containers; test viewport changes too when viewport rules govern its layout.

| Scenario | What it catches |
| --- | --- |
| Smallest supported container (for example, 320px) | Clipping, horizontal scroll, controls escaping the box |
| Squeezed by a flex or grid sibling | Min-content blowout, the component refusing to shrink |
| A very wide container | Unbounded measure, stretched controls, content pinned to opposite edges |

## State

**Cue: the component has the state.** Read the props and the interaction model; exercise reachable states through props, interactions, or supported test adapters. A static component fails the cue entirely.

| Scenario | What it catches |
| --- | --- |
| Loading | Layout shift when content arrives, spinners with no accessible name |
| Error | Messages that overflow, color as the only signal |
| Disabled | State recognition, explanation, and focus behavior; apply the relevant contrast exceptions |

Exercise real focus and hover, state transitions, cancellation, and repeated input where supported. Static state fixtures cannot prove transition behavior.

## Environment

**Cue: the project supports the mode.** Use the app’s real theme controls and browser or platform settings for dark mode, zoom, text scaling, reduced motion, and forced colors where applicable. Record which modes were exercised and which were unavailable. Redeclaring tokens around a fixture tests a different theme.
